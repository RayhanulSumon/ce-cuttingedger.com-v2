<?php

namespace App\Services\Chat;

use App\Events\ChatMessageSent;
use App\Events\LiveChatTakeoverRequested;
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

        // Broadcast user message via Reverb WebSockets
        try {
            broadcast(new ChatMessageSent($userMessage));
        } catch (\Throwable) {
            // Reverb broadcast safe fallback
        }

        // If user asks for a live assistant, human agent, or real person, flag session for live takeover
        $isLiveHumanInquiry = preg_match('/\b(human|agent|operator|person|support team|real person|speak to someone|talk to someone|talk to a person|representative|live assist\w*|live support|live desk|anyone live)\b/iu', $userText);
        if ($isLiveHumanInquiry) {
            $session->requestHuman();
            try {
                broadcast(new LiveChatTakeoverRequested($session, $userText));
            } catch (\Throwable) {
            }
            try {
                broadcast(new \App\Events\LiveChatTakeoverRequested($session, $userText));
            } catch (\Throwable) {}
        }

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

                // Guard against defective Ollama outputs:
                $trimmed = trim($assistantContent);
                $cleanText = preg_replace('/[\p{P}\p{S}\s]+/u', '', $trimmed);

                // If Ollama output begins with repetitive formulaic filler like "Whether it's about...", strip it to the main response
                if (preg_match('/^whether\s+[^.!?]+[.!?]\s*/i', $trimmed, $fillerMatches)) {
                    $cleaned = trim(substr($trimmed, strlen($fillerMatches[0])));
                    if (strlen($cleaned) > 20) {
                        $trimmed = $cleaned;
                        $assistantContent = $cleaned;
                    }
                }

                $isInvalidOrEmpty = (strlen($trimmed) < 10 || strlen($cleanText) < 5) && empty($toolCards);

                // Anti-Echo: Check if this response exactly repeats the immediate last assistant message
                $isDuplicateResponse = false;
                $lastAssistantMsg = $session->messages()
                    ->where('sender', 'assistant')
                    ->latest('id')
                    ->value('content');

                if ($lastAssistantMsg) {
                    similar_text(strtolower($trimmed), strtolower(trim((string) $lastAssistantMsg)), $similarityPercent);
                    if ($similarityPercent > 85) {
                        $isDuplicateResponse = true;
                    }
                }

                if ($isInvalidOrEmpty || $isDuplicateResponse) {
                    $fallbackResult = $this->fallbackEngine->process($userText, $attachments, $session);
                    $assistantContent = $fallbackResult['content'];
                    $toolCards = $fallbackResult['tool_cards'];
                    $suggestedReplies = $fallbackResult['suggested_replies'];
                    $engineUsed = 'fallback';
                } else {
                    $suggestedReplies = $this->deriveSuggestedReplies($userText, $toolCards);
                }
            }
        }

        $clientTimezone = $session->metadata['timezone'] ?? 'UTC';

        // 3. Fallback to HybridIntentEngine if Ollama was unavailable or returned nothing
        if ($engineUsed === 'fallback' || empty($assistantContent)) {
            $engineUsed = 'fallback';
            $fallbackResult = $this->fallbackEngine->process($userText, $attachments, $session);
            $assistantContent = $fallbackResult['content'];
            $toolCards = $fallbackResult['tool_cards'];
            $suggestedReplies = $fallbackResult['suggested_replies'];
        }

        // 4. Booking & Scheduling Handler:
        // Ensure at most ONE calendar card is shown, and if the user ALREADY has an upcoming booking,
        // remind them of their scheduled time and provide the Reschedule button!
        $isBookingOrScheduleQuery = preg_match('/\b(book\w*|sched\w*|sced\w*|sked\w*|calend\w*|appoint\w*|apoint\w*|reserv\w*|call me|agend\w*|cita\w*|termin\w*|বুকিং)\b/iu', $userText);

        if ($isBookingOrScheduleQuery) {
            $isExplicitReschedule = preg_match('/\b(resched\w*|change\s*(time|date|slot)|different\s*(time|date|slot)|move\s*(call|meeting|time))\b/i', $userText);

            $existingBooking = ChatConsultation::where('chat_session_id', $session->id)
                ->orWhere(function ($q) use ($session) {
                    if ($session->lead_email) {
                        $q->where('email', $session->lead_email);
                    }
                })
                ->where('scheduled_at', '>=', now()->subMinutes(15))
                ->whereNotIn('status', ['cancelled', 'completed'])
                ->latest('scheduled_at')
                ->first();

            if ($existingBooking && ! $isExplicitReschedule) {
                // Client already has an active upcoming consultation!
                // Remind them of their scheduled time with Reschedule option instead of opening a duplicate booking card
                $statusCard = (new CalendarBookingTool)->checkAppointment([], $session);
                $toolCards = [$statusCard];
                $assistantContent = "You already have a confirmed consultation scheduled for **{$statusCard['datetime_formatted']}**! Our senior production specialist will meet with you over Google Meet. If you need a different time, click **Reschedule Slot** below:";
            } else {
                // Client has no active booking OR requested to reschedule: show exactly one booking proposal card
                $wantsFull = preg_match('/\b(all\s*(times?|dates?|days?)|full\s*calendar|every\s*slot)\b/i', $userText);
                if ($wantsFull) {
                    $toolCards = [(new CalendarBookingTool)->getAvailableSlots($clientTimezone, $session, $isExplicitReschedule)];
                } else {
                    $proposal = (new CalendarBookingTool)->checkSpecificSlot($userText, $clientTimezone, $session);
                    $toolCards = [$proposal];
                    if (empty($assistantContent) || str_contains(strtolower($assistantContent), 'feel free to ask') || str_contains(strtolower($assistantContent), 'make your project a success')) {
                        $assistantContent = $proposal['message'];
                    }
                }
            }
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

        // Broadcast assistant reply via Reverb WebSockets
        try {
            broadcast(new ChatMessageSent($assistantMessage));
        } catch (\Throwable) {
            // Reverb broadcast safe fallback
        }

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

Studio Production Disciplines & Commercial Base Rates:
- Clipping Path / Cutouts: starting at $0.45 – $0.49 / image (100% hand-drawn Photoshop Pen Tool bezier curves; 0.5px inward feathering to eliminate background halos).
- Ghost Mannequin / Invisible Symmetry: $0.99 / image (Neck-joint insertion, collar reconstruction, 3D anatomical volume, balanced garment symmetry).
- Natural / Drop Shadow & Reflections: $0.49 / image (Cast, floating, or mirror reflection matching studio lighting angle).
- Multi-Clipping Path / Color Masking: $1.25 / image (Component layer separation for e-commerce colorway variants & garment swaps).
- High-End Fashion & Beauty Retouching: $1.99 – $3.99 / image (Micro frequency separation, natural skin pore preservation without plastic blur, flyaway hair cleanup).
- Fine Jewelry & Macro Retouching: $2.49 – $4.99 / image (500% zoom dust/scratch removal, precious metal luster polishing, diamond facet sparkle alignment).
- Turnaround SLA: Standard 12–24 hours, Express rush 6 hours.
- Volume Pricing: 15% off for 100+ images, 25% off for 500+ images. Dedicated teams for enterprise retainers.
- Free Trial: 3 free test images with no credit card required.

Our 4-Step Studio Production Pipeline:
1. Ingestion & Calibration: Client shares RAW, PSD, or TIFF via chat, Google Drive, Dropbox, or WeTransfer. We calibrate color profiles (sRGB/Adobe RGB) and custom style guides.
2. Artisanal Hand-Drawn Execution: 100% manual craftsmanship by senior Photoshop artists. We never use automated AI magic wands or jagged cutouts. Every curve is hand-crafted at 300% zoom.
3. 3-Tier Quality Control (QC): Every file passes two senior QA supervisors and an art director checking edge fidelity, color accuracy, and realistic lighting.
4. Rapid Secure Delivery: Exported in your exact required formats (layered PSD, transparent PNG, web-optimized WebP/JPEG, print TIFF) within 12–24 hours.

Studio Headquarters & Facts:
- Studio Headquarters: Artisan Center, Level-7, House# 57/9, West Panthapath, Dhaka 1215.
- Global Presence: 24/7 continuous desks serving top commercial brands, e-commerce studios, and agencies worldwide across North America, the UK, Europe, and Asia.
- Contact Email: hello@cuttingedger.com

Conversational Rules & Direct Responses:
0. CRITICAL ANTI-FILLER CONSTRAINT: NEVER begin your message with "Whether", "Whether you need", "Whether it's about", "Whether you are looking", "As an AI", or similar corporate canned boilerplate. Jump directly into answering the client with warmth and intelligence!
1. LIVE ASSISTANT / HUMAN INQUIRIES: If the client asks "anyone live assistant here?", "is there a person?", "can I speak with a human?", or similar:
   Confirm clearly: "Yes, absolutely! I am our 24/7 AI studio specialist available right now to answer questions, discuss editing specs, and calculate estimates. In addition, our human production team is active 24/7! I've flagged our live desk — would you like a live specialist to step in, or can I help you with a specific project question right now?"
   DO NOT recite the pricing catalog when asked about a live assistant!
2. SHORT SERVICES INQUIRY: If the client asks "what is your services give me short", "what do you offer", "what can you do", "list services", or "describe your studio":
   Provide this clean, concise overview:
   • Clipping Path / Cutouts ($0.45 – $0.49/img, 100% hand-drawn Photoshop Pen Tool curves)
   • Ghost Mannequin / Invisible Symmetry ($0.99/img, 3D garment volume & neck joints)
   • Multi-Clipping Path / Color Masking ($1.25/img, layer separation for e-commerce colorways)
   • High-End Fashion & Beauty Retouching ($1.99 – $3.99/img, micro frequency separation)
   • Fine Jewelry & Macro Retouching ($2.49 – $4.99/img, 500% dust removal & metal polishing)
   Turnaround: Standard 12–24h, Express rush 6h. We offer 3 Free Sample Edits to test our quality!
3. GREETINGS: If the client simply says "hi", "hello", "hey":
   Reply warmly and politely in 1 sentence: "Hello! Welcome to CuttingEdger Studio. How can I assist you with your image editing, clipping paths, or retouching project today?" DO NOT dump the physical office address or rates unless asked!
4. HOW ARE YOU: If asked "how are you?", answer warmly in 1 line: "Doing great, thank you! Running a busy day of catalog batches. How can I assist you with your images today?"
5. OFFICE LOCATION: If asked "where is your office located?":
   Give our exact headquarters at Artisan Center, Level-7, House# 57/9, West Panthapath, Dhaka 1215, and mention our 24/7 global desks.
6. PRICING INQUIRIES: If the client asks for pricing or rates without specific image counts:
   List the commercial disciplines and starting rates clearly in clean bullet points, turnaround time, volume discount tiers (15% for 100+, 25% for 500+), and mention the 3 free test images.
7. SCHEDULING / BOOKING: If the client wants to book, meet, or schedule a demo, invoke the booking tool so they receive an interactive confirmation card.
8. CRITICAL: Always provide complete, articulate English sentences. Directly address the client's latest inquiry without formulaic filler.
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

        // Take only last 4 messages to keep CPU prompt evaluation lightning fast (< 1.5s)
        $pastMessages = $session->messages()
            ->latest('id')
            ->take(4)
            ->get()
            ->reverse();

        foreach ($pastMessages as $msg) {
            $trimmed = trim((string) $msg->content);
            $cleanText = preg_replace('/[\p{P}\p{S}\s]+/u', '', $trimmed);

            // Filter out empty messages, single emoji messages, or poisoned repetitive messages
            if (empty($trimmed) || strlen($cleanText) < 2 || ($msg->sender !== 'user' && preg_match('/^whether/i', $trimmed))) {
                continue;
            }

            // Cap long past messages to 450 characters without cutting words
            if ($msg->sender !== 'user' && strlen($trimmed) > 450) {
                $trimmed = substr($trimmed, 0, 450);
            }

            $messages[] = [
                'role' => $msg->sender === 'user' ? 'user' : 'assistant',
                'content' => $trimmed,
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
