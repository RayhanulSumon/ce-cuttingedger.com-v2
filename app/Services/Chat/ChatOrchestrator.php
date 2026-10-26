<?php

namespace App\Services\Chat;

use App\Models\ChatConsultation;
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
                'user_message_id' => $userMessage->id,
                'message' => null,
            ];
        }

        $engineUsed = 'fallback';
        $assistantContent = '';
        $toolCards = [];
        $suggestedReplies = [];
        $toolCallsData = null;

        // 2. Primary: Route conversational & bespoke queries to Ollama AI
        if ($this->ollama->isAvailable()) {
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

        $clientTimezone = $session->metadata['timezone'] ?? 'UTC';

        // Auto-safeguard for existing appointment inquiries: e.g. "when will be my schedule date and time?", "when is my meeting", "what is my schedule"
        $isCheckingExisting = preg_match('/\b(when|what|check|show|tell me|my|current)\b/i', $userText) && preg_match('/\b(sched\w*|appoint\w*|meet\w*|call\w*|book\w*|slot\w*)\b/i', $userText);

        if ($isCheckingExisting && empty($toolCards)) {
            $appointmentCard = (new CalendarBookingTool)->checkAppointment([], $session);
            if (! empty($appointmentCard) && ($appointmentCard['type'] ?? '') === 'appointment_status_card') {
                $toolCards[] = $appointmentCard;
                if (empty($assistantContent)) {
                    $assistantContent = "Your consultation is confirmed for **{$appointmentCard['datetime_formatted']}**! Our senior production specialist will meet with you over Google Meet.";
                }
            }
        }
        // Auto-safeguard: If the client asked to book, schedule, or meet (e.g. "i want to book", "i want schedule", "schedule book for demo", "book tomorrow 11am")
        // but no booking card was generated, automatically execute checkSpecificSlot so they get the compact 1-click booking card!
        elseif (empty($toolCards) && ! $isCheckingExisting && preg_match('/\b(book\w*|sched\w*|sced\w*|sked\w*|calend\w*|appoint\w*|apoint\w*|reserv\w*|call me|agend\w*|cita\w*|termin\w*|বুকিং)\b/iu', $userText)) {
            $proposal = (new CalendarBookingTool)->checkSpecificSlot($userText, $clientTimezone, $session);
            $toolCards[] = $proposal;
            if (empty($assistantContent) || str_contains(strtolower($assistantContent), 'feel free to ask') || str_contains(strtolower($assistantContent), 'make your project a success')) {
                $assistantContent = $proposal['message'];
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
You are a senior production specialist and studio manager at CuttingEdger (premier commercial post-production & image editing house). Talk like a high-level creative production director — articulate, confident, warm, business-focused, and authoritative.

Studio Production Disciplines & Commercial Pricing:
- Clipping Path / Cutouts: $0.45 – $0.49 / image (100% hand-drawn Photoshop Pen Tool bezier curves; 0.5px inward feathering to eliminate background halos).
- Ghost Mannequin / Invisible Symmetry: $0.99 / image (Neck-joint insertion, collar reconstruction, 3D anatomical volume, balanced garment symmetry).
- Natural / Drop Shadow & Reflections: $0.49 / image (Cast, floating, or mirror reflection matching studio lighting angle).
- Multi-Clipping Path / Color Masking: $1.25 / image (Component layer separation for e-commerce colorway variants & garment swaps).
- High-End Fashion & Beauty Retouching: $1.99 – $3.99 / image (Micro frequency separation, natural skin pore preservation without plastic blur, flyaway hair cleanup).
- Fine Jewelry & Macro Retouching: $2.49 – $4.99 / image (500% zoom dust/scratch removal, precious metal luster polishing, diamond facet sparkle alignment).
- Turnaround SLA: Standard 12–24 hours, Express rush 6 hours.
- Volume Pricing: 15% off for 100+ images, 25% off for 500+ images. Dedicated teams for enterprise retainers.
- Free Trial: 3 free test images with no credit card required.

Our 4-Step Studio Production Pipeline (Explain clearly when asked about process or pipeline):
1. Ingestion & Calibration: Client shares RAW, PSD, or TIFF via chat, Google Drive, Dropbox, or WeTransfer. We calibrate color profiles (sRGB/Adobe RGB) and custom style guides.
2. Artisanal Hand-Drawn Execution: 100% manual craftsmanship by senior Photoshop artists. We never use automated AI magic wands or jagged cutouts. Every curve is hand-crafted at 300% zoom.
3. 3-Tier Quality Control (QC): Every file passes two senior QA supervisors and an art director checking edge fidelity, color accuracy, and realistic lighting.
4. Rapid Secure Delivery: Exported in your exact required formats (layered PSD, transparent PNG, web-optimized WebP/JPEG, print TIFF) within 12–24 hours.

Formatting & Business Communication Guidelines:
1. SERVICE & PIPELINE INQUIRIES: Present answers with clean, beautiful structure: a quick 1-sentence value overview, 3–4 clean bullet points explaining the craft/pipeline, turnaround SLA & rate, and a call-to-action to claim 3 free sample edits.
2. ALL PRICING INQUIRIES: If the client asks for "all pricing" or a "single readable format", output the clean, complete pricing catalog right in text. Never show a single-item calculator when they asked for all rates.
3. SCHEDULING & DEMO INQUIRIES: Whenever the client expresses intent to book, schedule, meet, or see a demo (e.g. "i want to book", "i want schedule", "schedule book for demo", "book tomorrow 11am"), ALWAYS invoke check_specific_time_slot so they get the interactive 1-click confirmation card. Never answer with a passive text-only reply without an interactive booking proposal card!
4. MULTILINGUAL & TYPOS: Detect the user's language automatically and respond fluently in their language (German, Spanish, French, Italian, Bengali, Arabic, etc.). Seamlessly auto-correct typos ("calendaer bookg", "priicng", "shedule") without judging or correcting them.
5. TONE & ELEGANCE: Sound like a seasoned studio executive. Never use cliché robotic phrases like "Certainly!", "I would be delighted to assist", or "As an AI language model". Keep formatting clean, prestigious, and readable.
PROMPT;

        // Inject Active Booking context if user already has a scheduled appointment
        $activeBooking = ChatConsultation::where('chat_session_id', $session->id)
            ->orWhere(function ($q) use ($session) {
                if ($session->lead_email) {
                    $q->where('email', $session->lead_email);
                }
            })
            ->where('scheduled_at', '>=', now()->subMinutes(30))
            ->whereNotIn('status', ['cancelled'])
            ->latest('scheduled_at')
            ->first();

        if ($activeBooking) {
            $clientTz = $session->metadata['timezone'] ?? 'UTC';
            $slotFormattedUtc = $activeBooking->scheduled_at->format('l, F j, Y \a\t g:i A \U\T\C');
            $localSlot = $clientTz !== 'UTC' ? ' ('.$activeBooking->scheduled_at->copy()->setTimezone($clientTz)->format('g:i A T').' in client local timezone)' : '';

            $systemPrompt .= "\n\nCRITICAL CONTEXT - CLIENT ALREADY HAS AN ACTIVE BOOKING:
The client ({$activeBooking->name}, email: {$activeBooking->email}) ALREADY HAS A CONFIRMED CONSULTATION:
- Scheduled Date & Time: {$slotFormattedUtc}{$localSlot}
- Meeting: 15-Minute Technical Intake Call (Google Meet / Zoom calendar invite sent to their inbox)
- Status: Confirmed
RULE: When the client asks about their appointment, date, time, or schedule (e.g. 'when will be my schedule date and time?'), DIRECTLY state and confirm their exact scheduled time ({$slotFormattedUtc}{$localSlot}). DO NOT offer or ask them to book a new slot unless they explicitly ask to change or reschedule.";
        }

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
