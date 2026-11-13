<?php

namespace App\Services\Chat;

use App\Models\Capability;
use App\Models\ChatMessage;
use App\Models\ChatSession;

/**
 * Turns a visitor message into an information-only reply.
 *
 * The language model (when online) only writes the wording; the cards and quick replies always come from
 * InfoResponder, so the chat never books, quotes, collects files or creates orders.
 */
class ChatOrchestrator
{
    public function __construct(
        protected OllamaClientService $ollama,
        protected InfoResponder $responder
    ) {}

    /**
     * Handle incoming visitor message and build the reply.
     *
     * @return array<string, mixed>
     */
    public function handle(ChatSession $session, string $userText): array
    {
        $userMessage = ChatMessage::create([
            'chat_session_id' => $session->id,
            'sender' => 'user',
            'content' => $userText,
        ]);

        $session->touchActivity();

        // A human operator has taken over: stay quiet.
        if ($session->isOperatorActive()) {
            return [
                'session_id' => $session->id,
                'engine' => 'operator',
                'operator_active' => true,
                'operator_name' => $session->operator_name,
                'user_message_id' => $userMessage->id,
                'message' => null,
            ];
        }

        $answer = $this->responder->process($userText, $session);
        $content = $answer['content'];
        $engine = 'rules';

        // Plain conversational wording from the model, only when the rules found no specific topic.
        if ($this->ollama->isAvailable() && empty($answer['tool_cards'])) {
            $aiResponse = $this->ollama->chat($this->buildMessageHistory($session));
            $aiContent = trim((string) ($aiResponse['message']['content'] ?? ''));

            if ($aiContent !== '') {
                $content = $aiContent;
                $engine = 'ollama';
            }
        }

        $assistantMessage = ChatMessage::create([
            'chat_session_id' => $session->id,
            'sender' => 'assistant',
            'content' => $content,
            'tool_results' => ! empty($answer['tool_cards']) ? $answer['tool_cards'] : null,
            'suggested_replies' => ! empty($answer['suggested_replies']) ? $answer['suggested_replies'] : null,
        ]);

        return [
            'session_id' => $session->id,
            'engine' => $engine,
            'user_message_id' => $userMessage->id,
            'message' => [
                'id' => $assistantMessage->id,
                'sender' => 'assistant',
                'content' => $content,
                'tool_cards' => $answer['tool_cards'],
                'suggested_replies' => $answer['suggested_replies'],
                'created_at' => $assistantMessage->created_at->toISOString(),
            ],
        ];
    }

    /**
     * Recent conversation for the language model.
     *
     * @return array<int, array<string, string>>
     */
    protected function buildMessageHistory(ChatSession $session): array
    {
        $capabilities = Capability::active()->main()
            ->with(['children' => fn ($query) => $query->active()])
            ->orderBy('sort_order')
            ->get()
            ->map(fn (Capability $main) => "- {$main->title}: ".$main->children->pluck('title')->implode(', '))
            ->implode("\n");

        $systemPrompt = <<<PROMPT
You are the information assistant on the CuttingEdger website (AI-integrated image editing and post-production for fashion and e-commerce brands). Answer questions about capabilities, turnaround, process, file formats and confidentiality, briefly and warmly, in the visitor's language.

Capabilities (main capability: sub-capabilities):
{$capabilities}

Facts:
- Turnaround: standard image work is typically 12-24 hours and urgent jobs can be rushed. Larger projects get a fixed delivery date.
- Formats: JPG, PNG, WebP, TIFF, PSD, PDF, ZIP up to 25 MB per file.
- Every project can be covered by an NDA; images are never used to train public models.

Rules: you only give information. NEVER state or guess a price, rate or discount: pricing is quoted per project, based on image count, complexity, turnaround and formats. You cannot book calls, create quotes or orders, or receive files. When the visitor wants any of that, tell them to use the contact page (/contact). Keep answers under 90 words and never invent facts.
PROMPT;

        $messages = [['role' => 'system', 'content' => $systemPrompt]];

        $pastMessages = $session->messages()->latest('id')->take(8)->get()->reverse();

        foreach ($pastMessages as $message) {
            $messages[] = [
                'role' => $message->sender === 'user' ? 'user' : 'assistant',
                'content' => $message->content,
            ];
        }

        return $messages;
    }
}
