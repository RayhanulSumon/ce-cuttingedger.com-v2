<?php

namespace App\Http\Controllers;

use App\Models\ChatMessage;
use App\Models\FreeTrialRequest;
use App\Services\Chat\ChatOrchestrator;
use App\Services\Chat\ChatSessionManager;
use App\Services\Chat\Tools\CalendarBookingTool;
use App\Services\Notification\NotificationService;
use App\Services\Security\EmailAndSpamGuard;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ChatController extends Controller
{
    public function __construct(
        protected ChatSessionManager $sessionManager,
        protected ChatOrchestrator $orchestrator,
        protected CalendarBookingTool $calendarTool
    ) {}

    /**
     * Initialize or resume chat session.
     */
    public function session(Request $request): JsonResponse
    {
        $forceNew = $request->boolean('force_new') || $request->header('X-Chat-Reset') === 'true';
        $session = $this->sessionManager->resolve($request, touch: true, createIfMissing: true, forceNew: $forceNew);

        $messages = $session->messages()
            ->latest('id')
            ->take(30)
            ->get()
            ->reverse()
            ->map(fn (ChatMessage $msg) => [
                'id' => $msg->id,
                'sender' => $msg->sender,
                'content' => $msg->content,
                'attachments' => $msg->attachments ?? [],
                'tool_cards' => $msg->tool_results ?? [],
                'suggested_replies' => $msg->suggested_replies ?? [],
                'created_at' => $msg->created_at->toISOString(),
            ])
            ->values();

        // If completely empty session, create initial welcome assistant message
        if ($messages->isEmpty()) {
            $welcome = ChatMessage::create([
                'chat_session_id' => $session->id,
                'sender' => 'assistant',
                'content' => '👋 Hi! Welcome to **CuttingEdger**. Have any questions, or how can I help you today?',
                'suggested_replies' => [
                    'What services do you offer?',
                    'How does pricing work?',
                    'Can I test sample edits?',
                    'Schedule a Consultation',
                ],
            ]);

            $messages = collect([[
                'id' => $welcome->id,
                'sender' => 'assistant',
                'content' => $welcome->content,
                'attachments' => [],
                'tool_cards' => [],
                'suggested_replies' => $welcome->suggested_replies,
                'created_at' => $welcome->created_at->toISOString(),
            ]]);
        }

        return response()->json([
            'session_id' => $session->id,
            'lead_name' => $session->lead_name,
            'lead_email' => $session->lead_email,
            'messages' => $messages,
        ])->cookie(
            ChatSessionManager::COOKIE_NAME,
            $session->id,
            60 * 24 * 30 // 30 days
        );
    }

    /**
     * Send user message and get orchestrated response.
     */
    public function message(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'message' => 'nullable|string|max:2000',
            'attachments' => 'nullable|array',
            'attachments.*' => 'string|url',
            'images_base64' => 'nullable|array',
            'images_base64.*' => 'string',
        ]);

        $message = trim((string) ($validated['message'] ?? ''));
        $attachments = $validated['attachments'] ?? [];
        $imagesBase64 = $validated['images_base64'] ?? [];

        if (empty($message) && empty($attachments)) {
            return response()->json(['error' => 'Message or attachment required'], 422);
        }

        $session = $this->sessionManager->resolve($request);

        $result = $this->orchestrator->handle(
            $session,
            $message ?: 'I have uploaded sample images. Please calculate quote.',
            $attachments,
            $imagesBase64
        );

        return response()->json($result);
    }

    /**
     * Upload an image to attach to chat.
     */
    public function uploadImage(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|image|mimes:jpeg,png,jpg,webp,tiff|max:15360', // 15MB
        ]);

        $file = $request->file('file');
        $path = $file->store('chat_uploads', 'public');
        $url = Storage::disk('public')->url($path);

        // Also prepare base64 for Vision model if needed
        $fileContents = file_get_contents($file->getRealPath());
        $base64 = base64_encode($fileContents);

        return response()->json([
            'url' => $url,
            'filename' => $file->getClientOriginalName(),
            'size' => $file->getSize(),
            'base64' => $base64,
        ]);
    }

    /**
     * Save/link visitor lead email and name to active chat session.
     */
    public function saveLead(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email|max:150',
            'name' => 'nullable|string|max:120',
            'phone' => 'nullable|string|max:50',
        ]);

        $session = $this->sessionManager->resolve($request);
        $email = strtolower(trim((string) $validated['email']));
        $name = trim((string) ($validated['name'] ?? ($session->lead_name ?? 'Client')));
        $phone = trim((string) ($validated['phone'] ?? ($session->lead_phone ?? '')));
        $clientIp = $request->ip() ?: $session->ip_address;

        // 1. Spam & Disposable Email Guard
        $spamGuard = app(EmailAndSpamGuard::class);
        $emailCheck = $spamGuard->validateEmail($email);
        if (! $emailCheck['valid']) {
            return response()->json([
                'success' => false,
                'message' => $emailCheck['reason'],
                'error_type' => $emailCheck['error_type'],
            ], 422);
        }

        // 2. IP Rate Limit Guard (prevent switching emails from same IP to abuse free trial)
        $ipCheck = $spamGuard->checkIpRateLimit($clientIp, $session->id);
        if (! $ipCheck['allowed']) {
            // Delete any unconfirmed temporary trial in this session
            FreeTrialRequest::where('chat_session_id', $session->id)
                ->where(function ($q) {
                    $q->whereNull('email')
                        ->orWhere('email', '')
                        ->orWhere('email', 'like', '%temp.local%');
                })->delete();

            return response()->json([
                'success' => false,
                'quota_exceeded' => true,
                'message' => $ipCheck['reason'],
                'lead_email' => $email,
                'lead_name' => $name,
            ]);
        }

        $session->update([
            'lead_email' => $email,
            'lead_name' => $name,
            'lead_phone' => $phone ?: $session->lead_phone,
            'status' => 'converted',
        ]);

        // 3. Enforce single email free trial quota: block if already completed, in production, or registered
        $existingTrial = FreeTrialRequest::where('email', $email)->first();
        if ($existingTrial && (in_array($existingTrial->status, ['completed', 'in_production'], true) || $existingTrial->chat_session_id !== $session->id)) {
            // Delete temporary pending trial in this session to prevent quota bypass
            FreeTrialRequest::where('chat_session_id', $session->id)
                ->where(function ($q) {
                    $q->whereNull('email')
                        ->orWhere('email', '')
                        ->orWhere('email', 'like', '%temp.local%');
                })->delete();

            return response()->json([
                'success' => false,
                'quota_exceeded' => true,
                'message' => "You've already used your free trial quota with {$email}. Regular edits start at just $0.49/image.",
                'lead_email' => $session->lead_email,
                'lead_name' => $session->lead_name,
            ]);
        }

        // Link pending trial requests in this session to this email and store IP
        FreeTrialRequest::where('chat_session_id', $session->id)
            ->where(function ($q) {
                $q->whereNull('email')
                    ->orWhere('email', '')
                    ->orWhere('email', 'like', '%temp.local%');
            })
            ->update([
                'email' => $email,
                'name' => $name,
                'ip_address' => $clientIp,
            ]);

        // Notify admins
        try {
            app(NotificationService::class)->triggerLeadCaptured($session);
        } catch (\Throwable $e) {
            // Silently log
        }

        return response()->json([
            'success' => true,
            'lead_email' => $session->lead_email,
            'lead_name' => $session->lead_name,
        ]);
    }

    /**
     * Direct slot booking submission from in-chat interactive calendar card.
     */
    public function bookSlot(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'slot_datetime' => 'required|string',
            'name' => 'required|string|max:120',
            'email' => 'required|email|max:150',
            'phone' => 'nullable|string|max:50',
            'notes' => 'nullable|string|max:1000',
            'service' => 'nullable|string|max:100',
            'consultation_id' => 'nullable|integer',
            'is_reschedule' => 'nullable|boolean',
        ]);

        $session = $this->sessionManager->resolve($request);

        // Spam & Disposable Email Guard for Calendar Appointments
        $spamGuard = app(EmailAndSpamGuard::class);
        $emailCheck = $spamGuard->validateEmail($validated['email']);
        if (! $emailCheck['valid']) {
            return response()->json([
                'success' => false,
                'message' => $emailCheck['reason'],
                'error_type' => $emailCheck['error_type'],
            ], 422);
        }

        $result = $this->calendarTool->book($validated, $session);

        $isRescheduled = ! empty($result['is_rescheduled']);
        $content = $isRescheduled
            ? "🔄 **Rescheduled!** Your session is now set for {$result['datetime_formatted']}."
            : "🎉 **All set!** Your consultation is booked for {$result['datetime_formatted']}.";

        // Record as system/assistant message in chat history
        $bookingMessage = ChatMessage::create([
            'chat_session_id' => $session->id,
            'sender' => 'assistant',
            'content' => $content,
            'tool_results' => [$result],
            'suggested_replies' => [
                'How to prepare images for the call?',
                'Upload Sample Files Now',
                'Ask About Turnaround SLA',
            ],
        ]);

        return response()->json([
            'success' => true,
            'message' => [
                'id' => $bookingMessage->id,
                'sender' => 'assistant',
                'content' => $bookingMessage->content,
                'tool_cards' => [$result],
                'suggested_replies' => $bookingMessage->suggested_replies,
                'created_at' => $bookingMessage->created_at->toISOString(),
            ],
        ]);
    }

    /**
     * Inactivity / Pause heartbeat check.
     */
    public function checkInactivity(Request $request): JsonResponse
    {
        $session = $this->sessionManager->resolve($request, touch: false, createIfMissing: false);

        if (! $session) {
            return response()->json(['nudge' => null]);
        }

        // Only nudge sessions that actually have conversation messages
        if ($session->messages()->count() === 0) {
            return response()->json(['nudge' => null]);
        }

        $nudge = $this->sessionManager->checkInactivityNudge($session);

        if (! $nudge) {
            return response()->json(['nudge' => null]);
        }

        // Save nudge into message history
        $msg = ChatMessage::create([
            'chat_session_id' => $session->id,
            'sender' => 'assistant',
            'content' => $nudge['content'],
            'suggested_replies' => $nudge['suggested_replies'],
        ]);

        return response()->json([
            'nudge' => [
                'id' => $msg->id,
                'sender' => 'assistant',
                'content' => $msg->content,
                'tool_cards' => [],
                'suggested_replies' => $msg->suggested_replies,
                'created_at' => $msg->created_at->toISOString(),
            ],
        ]);
    }
}
