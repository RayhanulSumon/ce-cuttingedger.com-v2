<?php

namespace App\Services\Chat;

use App\Models\ChatSession;

class HybridIntentEngine
{
    public function __construct(
        protected ToolRegistry $tools
    ) {}

    /**
     * Analyze message and execute appropriate tools deterministically.
     *
     * @param  array<int, string>  $attachments
     * @return array<string, mixed>
     */
    public function process(string $message, array $attachments = [], ?ChatSession $session = null): array
    {
        $text = strtolower(trim($message));

        // 1. Detect Email / Lead submission
        if (preg_match('/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/', $text, $matches)) {
            $email = $matches[0];
            $toolResult = $this->tools->execute('capture_lead', [
                'email' => $email,
                'name' => $session?->lead_name ?? 'Client',
                'notes' => $message,
            ], $session);

            return [
                'content' => "Perfect! I've linked **{$email}** to your session. Our studio director will send your customized estimate and sample review. Would you like to schedule a 15-minute intake call or review our standard turnaround times?",
                'tool_cards' => [$toolResult],
                'suggested_replies' => [
                    'Schedule Consultation Call',
                    'Check Turnaround SLA',
                    'Ask a Question',
                ],
            ];
        }

        // 2. Detect Uploaded Images -> Offer Instant Quote
        if (! empty($attachments)) {
            $quoteResult = $this->tools->execute('calculate_image_price', [
                'service' => 'background-removal',
                'complexity' => 'simple',
                'quantity' => count($attachments),
            ], $session);

            return [
                'content' => "I've received your image! Based on standard e-commerce specs, here is your estimated baseline quote. You can select your required service below or claim **3 free sample edits**:",
                'tool_cards' => [$quoteResult],
                'suggested_replies' => [
                    'Try 3 Free Test Images',
                    'Ghost Mannequin Quote',
                    'Jewelry Macro Retouch',
                    'Model Skin Retouch',
                ],
            ];
        }

        // 3. Detect Calendar & Meeting Intent
        if (str_contains($text, 'calendar') ||
            str_contains($text, 'book') ||
            str_contains($text, 'schedule') ||
            str_contains($text, 'meet') ||
            str_contains($text, 'call') ||
            str_contains($text, 'appointment')) {

            $slotsResult = $this->tools->execute('check_available_calendar_slots', [
                'timezone' => 'UTC',
            ], $session);

            return [
                'content' => "I'd love to connect you with our studio lead! Here are our open 15-minute consultation slots. Pick a time that fits your calendar:",
                'tool_cards' => [$slotsResult],
                'suggested_replies' => [
                    'Calculate Pricing First',
                    'How does Free Trial work?',
                    'Enterprise SLA Questions',
                ],
            ];
        }

        // 3.5. Detect Quote Confirmation & Batch Upload Intent
        if (str_contains($text, 'confirm') ||
            str_contains($text, 'proceed') ||
            str_contains($text, 'upload batch') ||
            str_contains($text, 'upload my') ||
            str_contains($text, 'upload own') ||
            str_contains($text, 'claim 3 free') ||
            str_contains($text, 'sample edit')) {

            return [
                'content' => "🎉 **Quote Confirmed!** Let's get your images into production.\n\nClick the button below or use the paperclip 📎 icon to select your photos. Please also reply with your **email address** so our studio director can send your job receipt, invoice, and finished edits!",
                'tool_cards' => [
                    [
                        'type' => 'upload_prompt_card',
                        'title' => 'Select Batch Images to Upload',
                        'description' => 'Upload your JPEG, PNG, RAW, PSD, or TIFF files. Submissions under 3 images qualify for 100% Free Sample Trial.',
                        'cta' => 'Browse & Upload Images',
                    ],
                ],
                'suggested_replies' => [
                    'Schedule 15-Min Technical Call',
                    'Turnaround SLAs',
                    'Ask About Formats (PSD / PNG)',
                ],
            ];
        }

        // 4. Detect Pricing & Cost Intent
        if (str_contains($text, 'price') ||
            str_contains($text, 'cost') ||
            str_contains($text, 'quote') ||
            str_contains($text, 'rate') ||
            str_contains($text, 'how much')) {

            $service = 'background-removal';
            if (str_contains($text, 'mannequin') || str_contains($text, 'neck')) {
                $service = 'ghost-mannequin';
            } elseif (str_contains($text, 'model') || str_contains($text, 'skin') || str_contains($text, 'fashion')) {
                $service = 'high-end-model-retouch';
            } elseif (str_contains($text, 'jewelry') || str_contains($text, 'diamond')) {
                $service = 'jewelry-retouch';
            } elseif (str_contains($text, '3d') || str_contains($text, 'cgi')) {
                $service = '3d-modeling';
            }

            $quoteResult = $this->tools->execute('calculate_image_price', [
                'service' => $service,
                'complexity' => 'simple',
                'quantity' => 50,
            ], $session);

            return [
                'content' => 'Here is our volume pricing model. Every new brand is eligible for **3 free test edits** with zero upfront commitment:',
                'tool_cards' => [$quoteResult],
                'suggested_replies' => [
                    'Claim 3 Free Sample Edits',
                    'Book a Call with Lead',
                    'Upload My Own Images',
                ],
            ];
        }

        // 5. Detect Services, Free Trial & Turnaround Intent
        if (str_contains($text, 'service') ||
            str_contains($text, 'turnaround') ||
            str_contains($text, 'trial') ||
            str_contains($text, 'format') ||
            str_contains($text, 'revision') ||
            str_contains($text, 'capacity')) {

            $infoResult = $this->tools->execute('search_services_and_faqs', [
                'topic' => $text,
            ], $session);

            return [
                'content' => 'Here are key facts regarding our production capacity, delivery formats, and free trial policy:',
                'tool_cards' => [$infoResult],
                'suggested_replies' => [
                    'Get an Instant Quote',
                    'Book Technical Consultation',
                    'Claim Free Trial',
                ],
            ];
        }

        // 6. Default Smart Greeting / Fallback Menu
        return [
            'content' => 'Hello! Welcome to **CuttingEdger**. I can estimate immediate retouching pricing for your images, check our studio turnaround SLAs, or schedule a quick technical call. How can I assist you today?',
            'tool_cards' => [],
            'suggested_replies' => [
                'Calculate Price Quote',
                'Schedule 15-Min Meeting',
                'Test 3 Images Free',
                'View All Services',
            ],
        ];
    }
}
