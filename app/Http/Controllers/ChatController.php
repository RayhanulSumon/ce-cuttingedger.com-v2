<?php

namespace App\Http\Controllers;

use App\Models\ChatMessage;
use App\Models\Order;
use App\Services\Chat\ChatOrchestrator;
use App\Services\Chat\ChatSessionManager;
use App\Services\Chat\Tools\CalendarBookingTool;
use App\Services\Notification\NotificationService;
use App\Services\Security\EmailAndSpamGuard;
use App\Services\Security\LinkAndFileSecurityGuard;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

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
            'mode' => $session->mode,
            'needs_human' => (bool) $session->needs_human,
            'operator_name' => $session->operator_name,
            'messages' => $messages,
        ])->cookie(
            ChatSessionManager::COOKIE_NAME,
            $session->id,
            60 * 24 * 30 // 30 days
        );
    }

    /**
     * Start a fresh chat session and return the initial welcome message.
     */
    public function reset(Request $request): JsonResponse
    {
        // Resolve and archive current session if one exists
        $currentSession = $this->sessionManager->resolve($request, touch: false, createIfMissing: false);
        if ($currentSession) {
            $currentSession->update(['status' => 'archived']);
        }

        // Force creation of a brand new session
        $session = $this->sessionManager->resolve($request, touch: true, createIfMissing: true, forceNew: true);

        // Always create fresh welcome assistant message for the new session
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

        return response()->json([
            'session_id' => $session->id,
            'lead_name' => null,
            'lead_email' => null,
            'mode' => 'bot',
            'needs_human' => false,
            'operator_name' => null,
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

        $result['mode'] = $session->mode;
        $result['needs_human'] = (bool) $session->needs_human;
        $result['operator_name'] = $session->operator_name;

        return response()->json($result);
    }

    /**
     * Poll for newly arrived messages (e.g. from human operator) or state updates.
     */
    public function poll(Request $request): JsonResponse
    {
        $session = $this->sessionManager->resolve($request, touch: true, createIfMissing: false);

        if (! $session) {
            return response()->json([
                'messages' => [],
                'mode' => 'bot',
                'needs_human' => false,
                'operator_name' => null,
            ]);
        }

        $afterId = (int) $request->query('after_id', 0);

        $query = $session->messages()->orderBy('id', 'asc');
        if ($afterId > 0) {
            $query->where('id', '>', $afterId);
        }

        $messages = $query->get()->map(fn (ChatMessage $msg) => [
            'id' => $msg->id,
            'sender' => $msg->sender,
            'content' => $msg->content,
            'attachments' => $msg->attachments ?? [],
            'tool_cards' => $msg->tool_results ?? [],
            'suggested_replies' => $msg->suggested_replies ?? [],
            'created_at' => $msg->created_at->toISOString(),
        ]);

        return response()->json([
            'session_id' => $session->id,
            'mode' => $session->mode,
            'needs_human' => (bool) $session->needs_human,
            'operator_name' => $session->operator_name,
            'messages' => $messages,
        ]);
    }

    /**
     * Upload an image to attach to chat with size guard and cloud drive fallback.
     */
    public function uploadImage(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|mimes:jpeg,png,jpg,webp,tiff,tif,psd|max:25600', // 25MB max
        ], [
            'file.max' => 'File exceeds the 25MB server limit. For large RAW/PSD batches or high-res archives, you can paste a Google Drive, Dropbox, or WeTransfer link directly in chat!',
            'file.mimes' => 'Accepted formats: JPEG, PNG, WEBP, TIFF, PSD. For other formats or bulk zip archives, please share via Google Drive or WeTransfer.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors()->first('file'),
                'suggest_cloud_drive' => true,
            ], 422);
        }

        $file = $request->file('file');

        // Deep security inspection against webshells, PHP injection, double extensions, and polyglots
        $securityGuard = app(LinkAndFileSecurityGuard::class);
        $inspectResult = $securityGuard->inspectUploadedFile($file);
        if (! $inspectResult['valid']) {
            return response()->json([
                'error' => $inspectResult['reason'],
                'suggest_cloud_drive' => false,
            ], 422);
        }

        $path = $file->store('chat_uploads', 'public');
        $url = Storage::disk('public')->url($path);

        // Prepare base64 for Vision model only if file <= 5MB to preserve memory
        $base64 = null;
        if ($file->getSize() <= 5 * 1024 * 1024 && str_starts_with($file->getMimeType() ?? '', 'image/')) {
            $fileContents = file_get_contents($file->getRealPath());
            $base64 = base64_encode($fileContents);
        }

        return response()->json([
            'url' => $url,
            'filename' => $file->getClientOriginalName(),
            'size' => $file->getSize(),
            'base64' => $base64,
        ]);
    }

    /**
     * Link a Google Drive, Dropbox, or WeTransfer URL to active session or order.
     */
    public function saveCloudLink(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'link' => 'required|url|max:1000',
        ]);

        $link = trim((string) $validated['link']);

        // Strict security validation: HTTPS, domain whitelisting, SSRF protection, blocked extensions
        $securityGuard = app(LinkAndFileSecurityGuard::class);
        $check = $securityGuard->validateCloudLink($link);
        if (! $check['valid']) {
            return response()->json([
                'success' => false,
                'message' => $check['reason'],
            ], 422);
        }

        $session = $this->sessionManager->resolve($request);

        $order = Order::where('chat_session_id', $session->id)
            ->where('status', 'pending')
            ->latest('id')
            ->first();

        if ($order) {
            $order->update(['cloud_link' => $link]);
        }

        return response()->json([
            'success' => true,
            'cloud_link' => $link,
            'order_number' => $order?->order_number,
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
            // Delete any unconfirmed temporary trial order in this session
            Order::where('chat_session_id', $session->id)
                ->where('payment_status', 'free_trial')
                ->where(function ($q) {
                    $q->whereNull('client_email')
                        ->orWhere('client_email', '')
                        ->orWhere('client_email', 'like', '%temp.local%');
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
        $existingTrial = Order::where('client_email', $email)
            ->where('payment_status', 'free_trial')
            ->first();

        if ($existingTrial && (in_array($existingTrial->status, ['completed', 'in_production'], true) || $existingTrial->chat_session_id !== $session->id)) {
            // Delete temporary pending trial in this session to prevent quota bypass
            Order::where('chat_session_id', $session->id)
                ->where('payment_status', 'free_trial')
                ->where(function ($q) {
                    $q->whereNull('client_email')
                        ->orWhere('client_email', '')
                        ->orWhere('client_email', 'like', '%temp.local%');
                })->delete();

            return response()->json([
                'success' => false,
                'quota_exceeded' => true,
                'message' => "You've already used your free trial quota with {$email}. Regular edits start at just $0.49/image.",
                'lead_email' => $session->lead_email,
                'lead_name' => $session->lead_name,
            ]);
        }

        // Link pending orders in this session to this email and name
        Order::where('chat_session_id', $session->id)
            ->where(function ($q) {
                $q->whereNull('client_email')
                    ->orWhere('client_email', '')
                    ->orWhere('client_email', 'like', '%temp.local%');
            })
            ->update([
                'client_email' => $email,
                'client_name' => $name,
                'client_phone' => $phone ?: $session->lead_phone,
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
        $session = $this->sessionManager->resolve($request);

        // Auto-populate from session lead info or authenticated user if not provided in request
        if (! $request->filled('name')) {
            $request->merge(['name' => $session->lead_name ?: ($request->user()?->name ?: 'Guest Specialist')]);
        }
        if (! $request->filled('email') && ($session->lead_email || $request->user()?->email)) {
            $request->merge(['email' => $session->lead_email ?: $request->user()?->email]);
        }

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

    /**
     * Get available consultation slots for dedicated modal or booking page.
     */
    public function availableSlots(Request $request): JsonResponse
    {
        $timezone = $request->query('timezone', 'UTC');
        $session = $this->sessionManager->resolve($request);
        $data = $this->calendarTool->getAvailableSlots($timezone, $session);

        return response()->json($data);
    }
}
