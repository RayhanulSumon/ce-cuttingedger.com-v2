<?php

namespace App\Services\Chat;

use App\Models\ChatMessage;
use App\Models\ChatSession;
use App\Services\Chat\Tools\CalendarBookingTool;

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

        // If a human operator has taken over this chat session, do not generate bot replies
        if ($session->isOperatorActive()) {
            return [
                'session_id' => $session->id,
                'engine' => 'operator',
                'operator_active' => true,
                'operator_name' => $session->operator_name,
                'message' => [
                    'id' => $userMessage->id,
                    'sender' => 'user',
                    'content' => $userText,
                    'attachments' => $attachments,
                    'tool_cards' => [],
                    'suggested_replies' => [],
                    'created_at' => $userMessage->created_at->toISOString(),
                ],
            ];
        }

        $engineUsed = 'fallback';
        $assistantContent = '';
        $toolCards = [];
        $suggestedReplies = [];
        $toolCallsData = null;

        // 2. Fast-Path: High-confidence instant queries (greetings, operator takeover, cloud links, email capture)
        // These answer in <30ms without needing CPU token generation
        if ($this->isInstantQuery($userText) && empty($attachments) && empty($imagesBase64)) {
            $fallbackResult = $this->fallbackEngine->process($userText, $attachments, $session);
            $assistantContent = $fallbackResult['content'];
            $toolCards = $fallbackResult['tool_cards'];
            $suggestedReplies = $fallbackResult['suggested_replies'];
            $engineUsed = 'fast_path';
        }
        // 3. Otherwise, route conversational & bespoke queries to Ollama AI
        elseif ($this->ollama->isAvailable()) {
            $history = $this->buildMessageHistory($session);
            $toolDefinitions = $this->tools->getRelevantDefinitions($userText);

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

        // Auto-safeguard: If the client asked to book a specific day/time (e.g. "book me tomorrow 11am")
        // but no booking card was generated, automatically execute checkSpecificSlot so they get a compact 1-click confirm card!
        if (empty($toolCards) && preg_match('/\b(book|schedule|reserve|call me|appointment)\b/i', $userText)) {
            $isSpecific = preg_match('/\b(tomorrow|today|monday|tuesday|wednesday|thursday|friday|saturday|sunday|\d{1,2}(?::\d{2})?\s*(?:am|pm))\b/i', $userText);
            if ($isSpecific) {
                $proposal = (new CalendarBookingTool)->checkSpecificSlot($userText, 'UTC', $session);
                $toolCards[] = $proposal;
                if (empty($assistantContent) || $assistantContent === "We're ready to take on your project!") {
                    $assistantContent = $proposal['message'];
                }
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
            'user_message_id' => $userMessage->id,
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
You are a senior production specialist at CuttingEdger studio. Talk like a friendly, expert human colleague over live chat — warm, direct, smart, and concise.

Studio Production Disciplines & Pricing:
- Clipping Path / Cutouts: $0.45 – $0.49 / image (100% hand-drawn pen tool paths)
- Ghost Mannequin / Invisible Symmetry: $0.99 / image
- Natural / Drop Shadow & Reflections: $0.49 / image
- Multi-Clipping Path / Color Masking: $1.25 / image
- High-End Fashion & Beauty Retouching: $1.99 – $3.99 / image
- Fine Jewelry & Macro Diamond Retouching: $2.49 – $4.99 / image
- Turnaround SLA: Standard 12–24 hours, Express rush 6 hours
- Volume Discounts: 15% off for 100+ photos, 25% off for 500+ photos
- Free Trial: 3 free test images with no credit card required

Human Chat Guidelines:
1. UNDERSTAND CONTEXT: Pay close attention to what the client specifically asks. If they ask for "all pricing" or "single readable format", give them a clean, direct pricing breakdown right in text. Never show a single-item calculator when they asked for all rates.
2. SCHEDULING: If they specify a time like "tomorrow 11am", call check_specific_time_slot so they get an instant 1-click confirmation button. Do not dump the full multi-day widget. Offer the closest available studio slot (10:00 AM or 11:30 AM) and ask for their email/name to finalize.
3. CONCISE & NATURAL: 1 to 3 short sentences maximum. Direct answer first. Never use robotic filler words like "Certainly!", "I'd be happy to assist", "As an AI language model", or "Feel free to ask". Talk like a real studio lead ("Sure thing", "Got it", "Here's the full breakdown", "We can deliver that in 24 hours").
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

    /**
     * Check if query has a high-confidence instant answer to bypass heavy CPU inference.
     */
    protected function isInstantQuery(string $text): bool
    {
        $clean = strtolower(trim($text));

        // Greetings
        if (preg_match('/^(hi|hello|hey|good (morning|afternoon|evening)|howdy|greetings)[!.? ]*$/i', $clean)) {
            return true;
        }

        // Request live human operator
        if (preg_match('/\b(human|agent|operator|person|support team|real person|speak to someone|talk to someone|representative)\b/i', $clean)) {
            return true;
        }

        // Cloud Drive link
        if (preg_match('/(https?:\/\/[^\s]+)/i', $text) && (str_contains($clean, 'drive') || str_contains($clean, 'dropbox') || str_contains($clean, 'wetransfer') || str_contains($clean, 'onedrive') || str_contains($clean, 'box.com'))) {
            return true;
        }

        // Reset
        if (in_array($clean, ['reset', 'clear', '/reset', 'new chat', 'fresh chat', 'clear chat', 'start fresh', 'start over', 'restart chat'])) {
            return true;
        }

        return false;
    }
}
