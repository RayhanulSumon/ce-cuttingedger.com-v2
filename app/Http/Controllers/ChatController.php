<?php

namespace App\Http\Controllers;

use App\Models\ChatMessage;
use App\Services\Chat\ChatOrchestrator;
use App\Services\Chat\ChatSessionManager;
use App\Services\Chat\Tools\CalendarBookingTool;
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
        $session = $this->sessionManager->resolve($request);

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
                'content' => '👋 Hi there! Welcome to **CuttingEdger**. How can I help you today? You can drop a photo for an **instant price quote**, schedule a call, or explore our services.',
                'suggested_replies' => [
                    'Get an Instant Quote',
                    'Claim 3 Free Sample Edits',
                    'Schedule Consultation Call',
                    'Turnaround SLAs',
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
        ]);

        $session = $this->sessionManager->resolve($request);
        $result = $this->calendarTool->book($validated, $session);

        // Record as system/assistant message in chat history
        $bookingMessage = ChatMessage::create([
            'chat_session_id' => $session->id,
            'sender' => 'assistant',
            'content' => "🎉 **Consultation Booked!** We have confirmed your session for {$result['datetime_formatted']}.",
            'tool_results' => [$result],
            'suggested_replies' => [
                'How to prepare images for the call?',
                'Upload Sample Files Now',
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
        $session = $this->sessionManager->resolve($request, touch: false);
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
