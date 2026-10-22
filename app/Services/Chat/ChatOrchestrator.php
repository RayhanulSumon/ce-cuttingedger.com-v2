<?php

namespace App\Services\Chat;

use App\Models\ChatMessage;
use App\Models\ChatSession;

class ChatOrchestrator
{
    public function __construct(
        protected OllamaClientService $ollama,
        protected ToolRegistry $tools,
        protected HybridIntentEngine $fallbackEngine
    ) {}

    /**
     * Handle incoming visitor message and orchestrate response.
     *
     * @param  array<int, string>  $attachments
     * @param  array<int, string>  $imagesBase64
     * @return array<string, mixed>
     */
    public function handle(
        ChatSession $session,
        string $userText,
        array $attachments = [],
        array $imagesBase64 = []
    ): array {
        // 1. Persist visitor message
        $userMessage = ChatMessage::create([
            'chat_session_id' => $session->id,
            'sender' => 'user',
            'content' => $userText,
            'attachments' => ! empty($attachments) ? $attachments : null,
        ]);

        $session->touchActivity();

        $engineUsed = 'fallback';
        $assistantContent = '';
        $toolCards = [];
        $suggestedReplies = [];
        $toolCallsData = null;

        // 2. Attempt Ollama AI Processing if online
        if ($this->ollama->isAvailable()) {
            $history = $this->buildMessageHistory($session);
            $toolDefinitions = $this->tools->getDefinitions();

            $aiResponse = $this->ollama->chat($history, $toolDefinitions, $imagesBase64);

            if ($aiResponse && isset($aiResponse['message'])) {
                $engineUsed = 'ollama';
                $msg = $aiResponse['message'];
                $assistantContent = (string) ($msg['content'] ?? '');

                // Check for tool calls
                if (! empty($msg['tool_calls'])) {
                    $toolCallsData = $msg['tool_calls'];
                    foreach ($msg['tool_calls'] as $call) {
                        $fnName = $call['function']['name'] ?? '';
                        $fnArgs = $call['function']['arguments'] ?? [];
                        if (is_string($fnArgs)) {
                            $fnArgs = json_decode($fnArgs, true) ?? [];
                        }

                        $card = $this->tools->execute($fnName, $fnArgs, $session);
                        $toolCards[] = $card;
                    }
                }

                if (empty($assistantContent) && ! empty($toolCards)) {
                    $assistantContent = 'Here are the details based on your request:';
                }

                $suggestedReplies = $this->deriveSuggestedReplies($userText, $toolCards);
            }
        }

        // 3. Fallback to HybridIntentEngine if Ollama was unavailable or returned nothing
        if ($engineUsed === 'fallback' || empty($assistantContent)) {
            $engineUsed = 'fallback';
            $fallbackResult = $this->fallbackEngine->process($userText, $attachments, $session);
            $assistantContent = $fallbackResult['content'];
            $toolCards = array_merge($toolCards, $fallbackResult['tool_cards']);
            $suggestedReplies = $fallbackResult['suggested_replies'];
        }

        // 4. Save Assistant response in database
        $assistantMessage = ChatMessage::create([
            'chat_session_id' => $session->id,
            'sender' => 'assistant',
            'content' => $assistantContent,
            'tool_calls' => $toolCallsData,
            'tool_results' => ! empty($toolCards) ? $toolCards : null,
            'suggested_replies' => ! empty($suggestedReplies) ? $suggestedReplies : null,
        ]);

        return [
            'session_id' => $session->id,
            'engine' => $engineUsed,
            'message' => [
                'id' => $assistantMessage->id,
                'sender' => 'assistant',
                'content' => $assistantContent,
                'tool_cards' => $toolCards,
                'suggested_replies' => $suggestedReplies,
                'created_at' => $assistantMessage->created_at->toISOString(),
            ],
        ];
    }

    /**
     * Build recent conversation history for Ollama context.
     *
     * @return array<int, array<string, string>>
     */
    protected function buildMessageHistory(ChatSession $session): array
    {
        $systemPrompt = <<<'PROMPT'
You are a senior production specialist at CuttingEdger studio. Talk like a friendly, knowledgeable human colleague over live chat — warm, direct, and conversational.

Studio Disciplines:
- Hand-drawn clipping paths & background removal ($0.45 - $0.49/image)
- Invisible ghost mannequin jointing
- High-end fashion & beauty skin retouching
- Diamond & macro fine jewelry retouching
- 3D CGI product modeling & rendering
- Desktop publishing (DTP) & catalog layout

Human Chat Rules:
1. KEEP IT SHORT & PRECISE: 1 to 2 short sentences maximum (under 25 words). Never write paragraphs or essays.
2. SOUND HUMAN: Never say "Certainly!", "I'd be happy to assist", "As an AI", or "Feel free to ask". Talk naturally like a real person at a design studio ("Sure thing", "Got it", "Here's our pricing", "We'll take care of it").
3. ANSWER DIRECTLY FIRST: Never repeat the user's question back to them. Give the direct answer in the very first sentence.
4. USE TOOLS PROMPTLY: Call `calculate_image_price` for quotes, `check_available_calendar_slots` for calls, and `capture_lead` when an email is given. The UI card shows the details; keep your text reply to a single natural sentence.
PROMPT;

        $messages = [
            ['role' => 'system', 'content' => $systemPrompt],
        ];

        $pastMessages = $session->messages()
            ->latest('id')
            ->take(10)
            ->get()
            ->reverse();

        foreach ($pastMessages as $msg) {
            $messages[] = [
                'role' => $msg->sender === 'user' ? 'user' : 'assistant',
                'content' => $msg->content,
            ];
        }

        return $messages;
    }

    /**
     * Derive relevant quick replies for the user.
     *
     * @param  array<int, array<string, mixed>>  $toolCards
     * @return array<int, string>
     */
    protected function deriveSuggestedReplies(string $userText, array $toolCards): array
    {
        // Keep conversation natural and human; tool cards provide their own interactive actions
        return [];
    }
}
