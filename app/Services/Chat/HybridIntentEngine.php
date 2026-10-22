<?php

namespace App\Services\Chat;

use App\Models\ChatSession;
use App\Models\FreeTrialRequest;
use App\Services\Notification\NotificationService;
use App\Services\Security\EmailAndSpamGuard;

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

            if ($session) {
                FreeTrialRequest::where('chat_session_id', $session->id)
                    ->where(function ($q) {
                        $q->where('email', 'like', '%temp.local%')->orWhereNull('email');
                    })
                    ->update(['email' => $email]);
            }

            return [
                'content' => "Perfect! I've linked **{$email}** to your session and your sample trial order. Our studio director will send your retouched master files as soon as they are complete. Would you like to schedule a 15-minute intake call or review our standard turnaround times?",
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
            $count = count($attachments);
            $quoteResult = $this->tools->execute('calculate_image_price', [
                'service' => 'background-removal',
                'complexity' => 'simple',
                'quantity' => $count,
            ], $session);

            $intro = $count <= 3
                ? "I've received your image! Because you've submitted {$count} ".($count === 1 ? 'image' : 'images').', you qualify for our **100% Free Sample Trial at $0.00 cost** (zero payment required). Click below to activate your free test edits:'
                : "I've received your images! Here is your itemized baseline quote. Submissions up to 3 images are eligible for 100% Free Sample Edits:";

            return [
                'content' => $intro,
                'tool_cards' => [$quoteResult],
                'suggested_replies' => [
                    'Claim 3 Free Sample Edits',
                    'Ghost Mannequin Quote',
                    'Jewelry Macro Retouch',
                    'Model Skin Retouch',
                ],
            ];
        }

        // 3. Detect Calendar, Meeting & Reschedule Intent
        $isRescheduleQuery = str_contains($text, 'reschedule') ||
            str_contains($text, 'change time') ||
            str_contains($text, 'change slot') ||
            str_contains($text, 'change date') ||
            str_contains($text, 'move call') ||
            str_contains($text, 'move meeting');

        $isCheckAppointmentQuery = str_contains($text, 'check appointment') ||
            str_contains($text, 'my appointment') ||
            str_contains($text, 'my booking') ||
            str_contains($text, 'when is my call') ||
            str_contains($text, 'check booking');

        if ($isCheckAppointmentQuery) {
            $checkResult = $this->tools->execute('check_my_appointment', [], $session);

            return [
                'content' => 'Here is the current status of your scheduled consultation call:',
                'tool_cards' => [$checkResult],
                'suggested_replies' => [
                    'Reschedule to Another Time',
                    'How to prepare images for the call?',
                    'Calculate Pricing First',
                ],
            ];
        }

        if ($isRescheduleQuery ||
            str_contains($text, 'calendar') ||
            str_contains($text, 'book') ||
            str_contains($text, 'schedule') ||
            str_contains($text, 'meet') ||
            str_contains($text, 'call') ||
            str_contains($text, 'appointment')) {

            $slotsResult = $this->tools->execute('check_available_calendar_slots', [
                'timezone' => 'UTC',
                'is_reschedule' => $isRescheduleQuery,
            ], $session);

            $messageText = $isRescheduleQuery
                ? "I'd be glad to help you reschedule your technical consultation! Here are our available 15-minute slots. Select your new preferred time below:"
                : "I'd love to connect you with our studio lead! Here are our open 15-minute consultation slots. Pick a time that fits your calendar:";

            return [
                'content' => $messageText,
                'tool_cards' => [$slotsResult],
                'suggested_replies' => [
                    'Calculate Pricing First',
                    'How does Free Trial work?',
                    'Enterprise SLA Questions',
                ],
            ];
        }

        // 3.5. Detect Free Trial Claim vs Paid Batch Upload Intent
        $isFreeTrialIntent = str_contains($text, 'claim 3 free') ||
            str_contains($text, 'try 3 free') ||
            str_contains($text, 'free sample') ||
            str_contains($text, 'sample edit') ||
            str_contains($text, 'sample images') ||
            str_contains($text, 'free trial');

        $isConfirmBatchIntent = str_contains($text, 'confirm') ||
            str_contains($text, 'proceed') ||
            str_contains($text, 'upload batch') ||
            str_contains($text, 'upload my') ||
            str_contains($text, 'upload own');

        if ($isFreeTrialIntent || $isConfirmBatchIntent) {
            // Retrieve latest batch of attachments for this submission (not summing across all history)
            $trialImages = [];
            if (! empty($attachments)) {
                $trialImages = $attachments;
            } elseif ($session) {
                $latestMsgWithImages = $session->messages()
                    ->whereNotNull('attachments')
                    ->latest('id')
                    ->first();
                $trialImages = (array) ($latestMsgWithImages?->attachments ?? []);
            }
            $uploadedCount = count($trialImages);

            // Check single email & session trial limit
            $clientEmail = $session?->lead_email;
            if (empty($clientEmail) && preg_match('/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/', $text, $matches)) {
                $clientEmail = strtolower($matches[0]);
            }

            // Find ANY existing trial for this email or session
            $existingTrial = null;
            if (! empty($clientEmail)) {
                $existingTrial = FreeTrialRequest::where('email', $clientEmail)->first();
            }
            if (! $existingTrial && $session) {
                $existingTrial = FreeTrialRequest::where('chat_session_id', $session->id)->first();
            }

            // If a trial already exists, enforce the 1-trial rule
            if ($isFreeTrialIntent && $existingTrial) {
                if ($existingTrial->status === 'completed') {
                    return [
                        'content' => "⚠️ **Free Trial Quota Limit Reached**\n\nOur records indicate that **{$existingTrial->email}** has already redeemed and completed the complimentary 3-image trial quota (Order #{$existingTrial->id}).\n\nTo ensure fair studio capacity for all new brands, our 100% Free Trial is limited to **one trial batch per client / studio**.\n\n💼 **Please Apply Our Standard Production Rates:**\nYou can proceed with our standard studio rates starting at just **$0.49 USD per photo** for clipping paths and background removal with sub-12h turnaround, or schedule a technical consultation for high-volume enterprise discounts.",
                        'tool_cards' => [
                            [
                                'type' => 'trial_quota_exhausted_card',
                                'title' => 'Trial Quota Limit Reached',
                                'client_email' => $existingTrial->email,
                                'message' => "You have already completed your 100% Free Trial sample order (#{$existingTrial->id}). Standard production rates apply.",
                                'starting_rate' => '$0.49 / image',
                                'services' => [
                                    ['name' => 'Clipping Path / Background Removal', 'rate' => '$0.49 / image'],
                                    ['name' => 'Multi-Path Vector Masking', 'rate' => '$1.25 / image'],
                                    ['name' => 'Ghost Mannequin / Invisible Symmetry', 'rate' => '$0.99 / image'],
                                    ['name' => 'High-End E-Commerce Retouching', 'rate' => '$1.49 / image'],
                                ],
                            ],
                        ],
                        'suggested_replies' => [
                            'Schedule 15-Min Technical Call',
                            'Volume Pricing Calculator',
                            'Proceed with Standard Rate',
                        ],
                    ];
                }

                if ($existingTrial->status === 'in_production') {
                    return [
                        'content' => "🎨 **Sample Order Already In Production!**\n\nYour 100% Free Trial sample order (**Order #{$existingTrial->id}**) is currently being retouched by our senior artists.\n\nFinished layered master files (PSD & PNG) will be delivered to **{$existingTrial->email}** as soon as quality inspection passes!",
                        'tool_cards' => [
                            [
                                'type' => 'free_trial_confirmed_card',
                                'title' => 'Free Trial Already In Production',
                                'images_count' => $existingTrial->images_count,
                                'total_cost' => '$0.00 USD (FREE)',
                                'turnaround' => 'Sub-12 Hours Rapid SLA',
                                'status' => 'In Production Queue',
                                'client_email' => $existingTrial->email,
                                'images' => $existingTrial->images ?? [],
                            ],
                        ],
                        'suggested_replies' => [
                            'Schedule 15-Min Technical Call',
                            'Volume Pricing Calculator',
                        ],
                    ];
                }

                // If already pending, show the existing pending order without creating another row
                return [
                    'content' => "⏳ **Trial Request Already Queued**\n\nYour free trial sample order (**Order #{$existingTrial->id}**) has already been received and is queued for studio assignment with **$0.00 cost**.\n\nDelivery destination: **{$existingTrial->email}**",
                    'tool_cards' => [
                        [
                            'type' => 'free_trial_confirmed_card',
                            'title' => '100% Free Trial Activated',
                            'images_count' => $existingTrial->images_count,
                            'total_cost' => '$0.00 USD (FREE)',
                            'turnaround' => 'Sub-12 Hours Rapid SLA',
                            'status' => 'In Production Queue',
                            'client_email' => $existingTrial->email,
                            'images' => $existingTrial->images ?? [],
                        ],
                    ],
                    'suggested_replies' => [
                        'Schedule 15-Min Technical Call',
                        'Turnaround SLAs',
                    ],
                ];
            }

            // Check IP address rate limit (1 trial per network / IP per 7 days)
            $spamGuard = app(EmailAndSpamGuard::class);
            if ($session && ! empty($session->ip_address)) {
                $ipCheck = $spamGuard->checkIpRateLimit($session->ip_address, $session->id);
                if (! $ipCheck['allowed']) {
                    return [
                        'content' => "⚠️ **Free Trial Limit Reached**\n\n{$ipCheck['reason']}",
                        'tool_cards' => [
                            [
                                'type' => 'trial_quota_exhausted_card',
                                'title' => 'Trial Quota Limit Reached',
                                'client_email' => $clientEmail ?: 'Your IP / Network',
                                'message' => $ipCheck['reason'],
                                'starting_rate' => '$0.49 / image',
                            ],
                        ],
                        'suggested_replies' => [
                            'Schedule 15-Min Technical Call',
                            'Volume Pricing Calculator',
                            'Proceed with Standard Rate',
                        ],
                    ];
                }
            }

            // Case A: User is claiming free trial and already has images attached in this conversation
            if ($isFreeTrialIntent && $uploadedCount > 0) {
                $actualCount = min($uploadedCount, 3);

                // Persist Free Trial Request in database for Admin visibility & processing
                if ($session) {
                    $trialOrder = FreeTrialRequest::firstOrCreate(
                        [
                            'chat_session_id' => $session->id,
                        ],
                        [
                            'email' => $clientEmail ?: 'pending-email@temp.local',
                            'ip_address' => $session->ip_address,
                            'name' => $session->lead_name ?? 'Guest Client',
                            'phone' => $session->lead_phone,
                            'images' => array_slice($trialImages, 0, 3),
                            'images_count' => $actualCount,
                            'service' => 'background-removal',
                            'status' => 'pending',
                        ]
                    );

                    if (! empty($clientEmail)) {
                        try {
                            app(NotificationService::class)->sendToAllAdmins('trial.new', [
                                'title' => '🎁 New Free Trial Order',
                                'message' => "Client {$clientEmail} submitted {$actualCount} sample image(s) for retouching",
                                'trial_id' => $trialOrder->id,
                                'admin_url' => url('/admin/free-trials'),
                                'timestamp' => now()->toISOString(),
                            ]);
                        } catch (\Throwable $e) {
                            // Silently log
                        }
                    }
                }

                $contentMsg = ! empty($clientEmail)
                    ? "🎉 **100% Free Trial Order Confirmed!**\n\nYour sample image has been entered into our production queue with **$0.00 cost** (Zero upfront payment, no credit card required).\n\nYour finished retouched master PSD & PNG files will be delivered to **{$clientEmail}** within 12 hours!"
                    : "🎉 **100% Free Trial Order Confirmed!**\n\nYour sample image has been entered into our production queue with **$0.00 cost** (Zero upfront payment, no credit card required).\n\nPlease enter your **email address** below so our production team can deliver your retouched master files!";

                return [
                    'content' => $contentMsg,
                    'tool_cards' => [
                        [
                            'type' => 'free_trial_confirmed_card',
                            'title' => '100% Free Trial Activated',
                            'images_count' => $actualCount,
                            'total_cost' => '$0.00 USD (FREE)',
                            'turnaround' => 'Sub-12 Hours Rapid SLA',
                            'status' => 'In Production Queue',
                            'client_email' => $clientEmail,
                            'images' => array_slice($trialImages, 0, 3),
                        ],
                    ],
                    'suggested_replies' => [
                        'Schedule 15-Min Technical Call',
                        'Ask About Formats (PSD / PNG)',
                        'Turnaround SLAs',
                    ],
                ];
            }

            // Case B: User clicked Free Trial but hasn't uploaded any photos yet
            if ($isFreeTrialIntent) {
                return [
                    'content' => "You qualify for **3 complimentary test edits** with zero cost or commitment!\n\nClick the button below or drag & drop up to 3 test photos directly into the chat window:",
                    'tool_cards' => [
                        [
                            'type' => 'upload_prompt_card',
                            'title' => 'Select Up to 3 Test Images to Upload',
                            'description' => 'Upload 1 to 3 images to claim your 100% Free Sample Trial ($0.00 cost). Our artists will hand-craft vector clipping paths and deliver layered master PSDs.',
                            'cta' => 'Select 3 Test Images',
                        ],
                    ],
                    'suggested_replies' => [
                        'Schedule 15-Min Technical Call',
                        'What formats are accepted?',
                        'Turnaround SLAs',
                    ],
                ];
            }

            // Case C: Standard batch upload for volume production
            return [
                'content' => "🎉 **Quote Confirmed!** Let's get your images into production.\n\nClick the button below or use the paperclip 📎 icon to select your batch photos. Please also reply with your **email address** so our studio director can send your job receipt, invoice, and finished edits!",
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

        // 5. Dedicated Services Catalog Intent
        if (str_contains($text, 'service') ||
            str_contains($text, 'capabilities') ||
            str_contains($text, 'what do you do') ||
            str_contains($text, 'what you do') ||
            str_contains($text, 'what services') ||
            str_contains($text, 'production lines') ||
            str_contains($text, 'retouching options') ||
            str_contains($text, 'view all') ||
            str_contains($text, 'service list')) {

            // Detect if specific service slug is queried
            $specificSlug = null;
            if (str_contains($text, 'mannequin') || str_contains($text, 'ghost')) {
                $specificSlug = 'ghost-mannequin';
            } elseif (str_contains($text, 'background') || str_contains($text, 'clipping') || str_contains($text, 'cutout')) {
                $specificSlug = 'background-removal';
            } elseif (str_contains($text, 'jewelry') || str_contains($text, 'gem') || str_contains($text, 'watch')) {
                $specificSlug = 'jewelry-retouch';
            } elseif (str_contains($text, 'model') || str_contains($text, 'skin') || str_contains($text, 'fashion') || str_contains($text, 'beauty')) {
                $specificSlug = 'high-end-model-retouch';
            } elseif (str_contains($text, '3d') || str_contains($text, 'cgi') || str_contains($text, 'render')) {
                $specificSlug = '3d-modeling';
            } elseif (str_contains($text, 'dtp') || str_contains($text, 'publishing') || str_contains($text, 'catalog')) {
                $specificSlug = 'dtp-publishing';
            }

            $catalogResult = $this->tools->execute('explore_services_catalog', [
                'service_slug' => $specificSlug,
                'action' => $specificSlug ? 'detail' : 'list',
            ], $session);

            $intro = $specificSlug
                ? 'Here are the technical capabilities, turnaround SLAs, and deliverable formats for this service:'
                : 'Here is our studio production services catalog. You can inspect specs, turnaround SLAs, or calculate volume rates:';

            return [
                'content' => $intro,
                'tool_cards' => [$catalogResult],
                'suggested_replies' => [
                    'Calculate Pricing',
                    'Claim 3 Free Test Images',
                    'Schedule 15-Min Technical Call',
                ],
            ];
        }

        // 5.5. General FAQs, Turnaround, Free Trial & Policy Queries
        if (str_contains($text, 'turnaround') ||
            str_contains($text, 'trial') ||
            str_contains($text, 'format') ||
            str_contains($text, 'revision') ||
            str_contains($text, 'capacity') ||
            str_contains($text, 'sla') ||
            str_contains($text, 'nda') ||
            str_contains($text, 'faq')) {

            $infoResult = $this->tools->execute('search_services_and_faqs', [
                'topic' => $text,
            ], $session);

            return [
                'content' => 'Here are key facts regarding our production capacity, turnaround SLAs, delivery formats, and free trial policy:',
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
