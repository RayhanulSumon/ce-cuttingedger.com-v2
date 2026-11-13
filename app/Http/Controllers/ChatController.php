<?php

namespace App\Http\Controllers;

use App\Models\ChatMessage;
use App\Models\ChatSession;
use App\Services\Chat\ChatOrchestrator;
use App\Services\Chat\ChatSessionManager;
use App\Services\Chat\InfoResponder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Information-only visitor chat: sessions, messages and polling for a human operator's replies.
 */
class ChatController extends Controller
{
    public function __construct(
        protected ChatSessionManager $sessionManager,
        protected ChatOrchestrator $orchestrator
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
            ->map(fn (ChatMessage $msg) => $this->present($msg))
            ->values();

        if ($messages->isEmpty()) {
            $messages = collect([$this->createWelcome($session)]);
        }

        return $this->stateResponse($session, $messages->all());
    }

    /**
     * Start a fresh chat session and return the initial welcome message.
     */
    public function reset(Request $request): JsonResponse
    {
        $currentSession = $this->sessionManager->resolve($request, touch: false, createIfMissing: false);
        if ($currentSession) {
            $currentSession->update(['status' => 'archived']);
        }

        $session = $this->sessionManager->resolve($request, touch: true, createIfMissing: true, forceNew: true);

        return $this->stateResponse($session, [$this->createWelcome($session)]);
    }

    /**
     * Send a visitor message and get the information reply.
     */
    public function message(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'message' => 'required|string|max:2000',
        ]);

        $session = $this->sessionManager->resolve($request);

        $result = $this->orchestrator->handle($session, trim($validated['message']));

        $result['mode'] = $session->mode;
        $result['needs_human'] = (bool) $session->needs_human;
        $result['operator_name'] = $session->operator_name;

        return response()->json($result);
    }

    /**
     * Poll for newly arrived messages (e.g. from a human operator) or state updates.
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

        return response()->json([
            'session_id' => $session->id,
            'mode' => $session->mode,
            'needs_human' => (bool) $session->needs_human,
            'operator_name' => $session->operator_name,
            'messages' => $query->get()->map(fn (ChatMessage $msg) => $this->present($msg)),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function createWelcome(ChatSession $session): array
    {
        $welcome = ChatMessage::create([
            'chat_session_id' => $session->id,
            'sender' => 'assistant',
            'content' => InfoResponder::WELCOME_MESSAGE,
            'suggested_replies' => InfoResponder::WELCOME_REPLIES,
        ]);

        return $this->present($welcome);
    }

    /**
     * @return array<string, mixed>
     */
    private function present(ChatMessage $msg): array
    {
        return [
            'id' => $msg->id,
            'sender' => $msg->sender,
            'content' => $msg->content,
            'tool_cards' => $msg->tool_results ?? [],
            'suggested_replies' => $msg->suggested_replies ?? [],
            'created_at' => $msg->created_at->toISOString(),
        ];
    }

    /**
     * @param  array<int, array<string, mixed>>  $messages
     */
    private function stateResponse(ChatSession $session, array $messages): JsonResponse
    {
        return response()->json([
            'session_id' => $session->id,
            'mode' => $session->mode,
            'needs_human' => (bool) $session->needs_human,
            'operator_name' => $session->operator_name,
            'messages' => $messages,
        ])->cookie(ChatSessionManager::COOKIE_NAME, $session->id, 60 * 24 * 30);
    }
}
