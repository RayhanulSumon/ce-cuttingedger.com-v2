<?php

namespace App\Services\Chat;

use App\Models\ChatSession;
use App\Models\Order;
use App\Services\Chat\Tools\PriceCalculatorTool;
use App\Services\Notification\NotificationService;
use App\Services\Security\EmailAndSpamGuard;
use App\Services\Security\LinkAndFileSecurityGuard;
use Illuminate\Support\Str;

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

        // 0. Detect Human Operator / Live Agent request
        if (preg_match('/\b(human|agent|operator|person|support team|real person|speak to someone|talk to someone|talk to a person|representative)\b/i', $text)) {
            if ($session) {
                $session->requestHuman();
                try {
                    app(NotificationService::class)->toAllAdmins()->send('chat_takeover_requested', [
                        'title' => '🚨 Live Chat Takeover Requested',
                        'message' => 'Visitor requested to speak with a human specialist.',
                        'session_id' => $session->id,
                        'admin_url' => url('/admin/chat-sessions?id='.$session->id),
                        'timestamp' => now()->toISOString(),
                    ]);
                } catch (\Throwable $e) {
                }
            }

            $responses = [
                "I've flagged our live production team! A studio specialist is being notified and will join this chat in a moment. What can we help you solve today?",
                'Connecting you with our team right away. A senior production specialist has been alerted. Feel free to type your question or share files while they jump in!',
                'Got it! I just alerted our on-duty team. Someone will take over this chat shortly. Feel free to leave your email or WhatsApp number here so we can reply even if you close the tab.',
            ];

            return [
                'content' => $responses[array_rand($responses)],
                'tool_cards' => [],
                'suggested_replies' => [
                    'Schedule Consultation Call',
                    'Check Turnaround SLA',
                    'View Pricing Catalog',
                ],
            ];
        }

        // 1. Detect Email / Lead submission
        if (preg_match('/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/', $text, $matches)) {
            $email = $matches[0];
            $toolResult = $this->tools->execute('capture_lead', [
                'email' => $email,
                'name' => $session?->lead_name ?? 'Client',
                'notes' => $message,
            ], $session);

            if ($session) {
                Order::where('chat_session_id', $session->id)
                    ->where(function ($q) {
                        $q->where('client_email', 'like', '%temp.local%')->orWhereNull('client_email');
                    })
                    ->update(['client_email' => $email]);
            }

            return [
                'content' => "Got it! Saved **{$email}** for updates. We'll send your completed files and invoice here. Need help with anything else?",
                'tool_cards' => [$toolResult],
                'suggested_replies' => [
                    'Schedule Consultation Call',
                    'Check Turnaround SLA',
                    'Ask a Question',
                ],
            ];
        }

        // 1.2. Detect Cloud Storage / Drive Link (Google Drive, Dropbox, WeTransfer, OneDrive, Box)
        if (preg_match('/(https?:\/\/[^\s]+)/i', $message, $cloudMatches)) {
            $cloudUrl = trim($cloudMatches[0]);
            $secCheck = app(LinkAndFileSecurityGuard::class)->validateCloudLink($cloudUrl);

            // If it is a link but not a valid cloud link, check if it was specifically attempting to share files
            if (! $secCheck['valid']) {
                $isCloudAttempt = str_contains($text, 'drive') || str_contains($text, 'dropbox') || str_contains($text, 'wetransfer') || str_contains($text, 'folder') || str_contains($text, 'files');
                if ($isCloudAttempt) {
                    return [
                        'content' => "⚠️ **Security Notice:** {$secCheck['reason']}\n\nTo protect studio workstations, we only accept links from trusted cloud storage providers (**Google Drive, Dropbox, WeTransfer, OneDrive, or Box**). Executable scripts or unverified domains are strictly blocked.",
                        'tool_cards' => [],
                        'suggested_replies' => [
                            'How to share Google Drive link?',
                            'Calculate Pricing First',
                            'Schedule Consultation Call',
                        ],
                    ];
                }
            } else {
                $pendingOrder = $session
                    ? Order::where('chat_session_id', $session->id)->where('status', 'pending')->latest('id')->first()
                    : null;

                if ($pendingOrder) {
                    $pendingOrder->update(['cloud_link' => $cloudUrl]);

                    try {
                        app(NotificationService::class)->toAllAdmins()->send('order.updated', [
                            'title' => '🔗 Drive Link Attached: Order #'.$pendingOrder->order_number,
                            'message' => "Client attached cloud folder: {$cloudUrl}",
                            'order_id' => $pendingOrder->id,
                            'admin_url' => url('/admin/orders'),
                            'timestamp' => now()->toISOString(),
                        ]);
                    } catch (\Throwable $e) {
                    }

                    return [
                        'content' => "🔗 **Cloud Drive Link Attached!**\n\nWe've linked your folder to Order **#{$pendingOrder->order_number}**:\n{$cloudUrl}\n\nOur production artists can download your raw files directly from this link. Need anything else before we begin?",
                        'tool_cards' => [
                            [
                                'type' => 'order_confirmed_card',
                                'order_number' => $pendingOrder->order_number,
                                'service_name' => $pendingOrder->service_name,
                                'service_slug' => $pendingOrder->service_slug,
                                'complexity' => $pendingOrder->complexity,
                                'quantity' => $pendingOrder->quantity,
                                'uploaded_count' => $pendingOrder->uploaded_count,
                                'remaining_count' => max(0, $pendingOrder->quantity - $pendingOrder->uploaded_count),
                                'discrepancy_status' => 'complete',
                                'unit_price' => number_format($pendingOrder->unit_price, 2),
                                'total_price' => number_format($pendingOrder->total_price, 2),
                                'turnaround' => $pendingOrder->turnaround,
                                'client_email' => $pendingOrder->client_email,
                                'cloud_link' => $cloudUrl,
                                'images' => $pendingOrder->images ?? [],
                            ],
                        ],
                        'suggested_replies' => [
                            'Schedule Consultation Call',
                            'Check Turnaround SLA',
                            'Ask About Delivery Formats (PSD/TIFF)',
                        ],
                    ];
                } else {
                    $clientEmail = $session?->lead_email ?: 'pending-email@temp.local';
                    $clientName = $session?->lead_name ?: 'Client';

                    $order = Order::create([
                        'chat_session_id' => $session?->id,
                        'client_name' => $clientName,
                        'client_email' => $clientEmail,
                        'client_phone' => $session?->lead_phone,
                        'service_name' => 'Clipping Path / Commercial Retouching',
                        'service_slug' => 'background-removal',
                        'complexity' => 'simple',
                        'quantity' => 25,
                        'uploaded_count' => 0,
                        'unit_price' => 0.45,
                        'total_price' => 11.25,
                        'currency' => 'USD',
                        'turnaround' => 'Standard 24h SLA',
                        'cloud_link' => $cloudUrl,
                        'status' => 'pending',
                        'payment_status' => 'unpaid',
                        'source' => 'chat',
                    ]);

                    try {
                        app(NotificationService::class)->toAllAdmins()->send('order.new', [
                            'title' => '🔗 New Order #'.$order->order_number.' (Drive Link)',
                            'message' => "Client submitted cloud drive folder: {$cloudUrl}",
                            'order_id' => $order->id,
                            'admin_url' => url('/admin/orders'),
                            'timestamp' => now()->toISOString(),
                        ]);
                    } catch (\Throwable $e) {
                    }

                    return [
                        'content' => "🔗 **Cloud Link Received!**\n\nWe created Order **#{$order->order_number}** and linked your folder:\n{$cloudUrl}\n\nApproximately how many images are in this folder, or what retouching service do you need?",
                        'tool_cards' => [
                            [
                                'type' => 'order_confirmed_card',
                                'order_number' => $order->order_number,
                                'service_name' => $order->service_name,
                                'service_slug' => $order->service_slug,
                                'complexity' => $order->complexity,
                                'quantity' => $order->quantity,
                                'uploaded_count' => 0,
                                'discrepancy_status' => 'complete',
                                'unit_price' => number_format($order->unit_price, 2),
                                'total_price' => number_format($order->total_price, 2),
                                'turnaround' => $order->turnaround,
                                'client_email' => $order->client_email,
                                'cloud_link' => $cloudUrl,
                                'images' => [],
                            ],
                        ],
                        'suggested_replies' => [
                            'Background Removal (25 images)',
                            'Ghost Mannequin (50 images)',
                            'Jewelry Macro Retouch',
                            'Schedule Consultation Call',
                        ],
                    ];
                }
            }
        }

        // 1.5. Detect Quantity Discrepancy Adjustment Intent (e.g. "Proceed with 10", "Adjust to 10")
        if (preg_match('/(?:proceed with|adjust to|change to|only|make it)\s*(\d{1,5})\s*(?:images|files|photos|pics)?/i', $text, $adjMatch)) {
            $adjQty = max(1, (int) $adjMatch[1]);
            $pendingOrder = $session ? Order::where('chat_session_id', $session->id)->where('status', 'pending')->latest('id')->first() : null;
            if ($pendingOrder) {
                $calc = app(PriceCalculatorTool::class)->execute([
                    'service' => $pendingOrder->service_slug,
                    'complexity' => $pendingOrder->complexity,
                    'quantity' => $adjQty,
                ]);
                $newTotal = (float) str_replace(',', '', (string) ($calc['total_price'] ?? '0'));
                $newUnit = (float) str_replace(',', '', (string) ($calc['unit_price'] ?? '0'));
                $newDiscount = $calc['discount_applied'] ? (int) filter_var($calc['discount_applied'], FILTER_SANITIZE_NUMBER_INT) : 0;

                $pendingOrder->update([
                    'quantity' => $adjQty,
                    'unit_price' => $newUnit,
                    'total_price' => $newTotal,
                    'discount_percent' => $newDiscount,
                ]);

                $uploaded = $pendingOrder->uploaded_count;
                $discStatus = $uploaded < $adjQty ? 'under' : ($uploaded > $adjQty ? 'over' : 'complete');

                return [
                    'content' => "👍 **Order #{$pendingOrder->order_number} adjusted to {$adjQty} images** (\${$newTotal} USD total). Current uploads: {$uploaded} of {$adjQty}.",
                    'tool_cards' => [
                        [
                            'type' => 'order_confirmed_card',
                            'order_number' => $pendingOrder->order_number,
                            'service_name' => $pendingOrder->service_name,
                            'service_slug' => $pendingOrder->service_slug,
                            'complexity' => $pendingOrder->complexity,
                            'quantity' => $adjQty,
                            'uploaded_count' => $uploaded,
                            'remaining_count' => max(0, $adjQty - $uploaded),
                            'discrepancy_status' => $discStatus,
                            'unit_price' => number_format($newUnit, 2),
                            'total_price' => number_format($newTotal, 2),
                            'turnaround' => $pendingOrder->turnaround,
                            'client_email' => $pendingOrder->client_email,
                            'images' => $pendingOrder->images ?? [],
                        ],
                    ],
                    'suggested_replies' => [
                        'Schedule Consultation Call',
                        'Ask About Turnaround SLA',
                    ],
                ];
            }
        }

        // 2. Detect Uploaded Images -> Link to Order or Offer Instant Quote
        if (! empty($attachments)) {
            $count = count($attachments);

            // Check if there is an active pending order for this session
            $pendingOrder = $session
                ? Order::where('chat_session_id', $session->id)->where('status', 'pending')->latest('id')->first()
                : null;

            if ($pendingOrder) {
                // Merge newly uploaded attachments with existing files
                $allImages = array_values(array_unique(array_merge($pendingOrder->images ?? [], $attachments)));
                $uploadedCount = count($allImages);
                $targetQty = $pendingOrder->quantity;

                // Discrepancy Validation
                if ($uploadedCount < $targetQty) {
                    $remaining = $targetQty - $uploadedCount;
                    $pendingOrder->update([
                        'images' => $allImages,
                        'uploaded_count' => $uploadedCount,
                    ]);

                    return [
                        'content' => "⚠️ **Received {$uploadedCount} of {$targetQty} images** for Order **#{$pendingOrder->order_number}** ({$remaining} images remaining).\n\nYou can drop the remaining **{$remaining} images** anytime, or reply *'Proceed with {$uploadedCount}'* if this is your full batch.",
                        'tool_cards' => [
                            [
                                'type' => 'order_confirmed_card',
                                'order_number' => $pendingOrder->order_number,
                                'service_name' => $pendingOrder->service_name,
                                'service_slug' => $pendingOrder->service_slug,
                                'complexity' => $pendingOrder->complexity,
                                'quantity' => $targetQty,
                                'uploaded_count' => $uploadedCount,
                                'remaining_count' => $remaining,
                                'discrepancy_status' => 'under',
                                'unit_price' => number_format($pendingOrder->unit_price, 2),
                                'total_price' => number_format($pendingOrder->total_price, 2),
                                'turnaround' => $pendingOrder->turnaround,
                                'client_email' => $pendingOrder->client_email,
                                'images' => $allImages,
                            ],
                        ],
                        'suggested_replies' => [
                            "Proceed with {$uploadedCount} images",
                            'Schedule Consultation Call',
                            'Ask About Turnaround SLA',
                        ],
                    ];
                } elseif ($uploadedCount > $targetQty) {
                    $extra = $uploadedCount - $targetQty;
                    $calc = app(PriceCalculatorTool::class)->execute([
                        'service' => $pendingOrder->service_slug,
                        'complexity' => $pendingOrder->complexity,
                        'quantity' => $uploadedCount,
                    ]);
                    $newTotal = (float) str_replace(',', '', (string) ($calc['total_price'] ?? '0'));
                    $newUnit = (float) str_replace(',', '', (string) ($calc['unit_price'] ?? '0'));
                    $newDiscount = $calc['discount_applied'] ? (int) filter_var($calc['discount_applied'], FILTER_SANITIZE_NUMBER_INT) : 0;

                    $pendingOrder->update([
                        'images' => $allImages,
                        'quantity' => $uploadedCount,
                        'uploaded_count' => $uploadedCount,
                        'unit_price' => $newUnit,
                        'total_price' => $newTotal,
                        'discount_percent' => $newDiscount,
                    ]);

                    return [
                        'content' => "📦 **Received {$uploadedCount} images** ({$extra} more than your quoted {$targetQty})! We've automatically updated Order **#{$pendingOrder->order_number}** to {$uploadedCount} images with our volume discount applied (\${$newTotal} total).",
                        'tool_cards' => [
                            [
                                'type' => 'order_confirmed_card',
                                'order_number' => $pendingOrder->order_number,
                                'service_name' => $pendingOrder->service_name,
                                'service_slug' => $pendingOrder->service_slug,
                                'complexity' => $pendingOrder->complexity,
                                'quantity' => $uploadedCount,
                                'uploaded_count' => $uploadedCount,
                                'remaining_count' => 0,
                                'discrepancy_status' => 'over',
                                'unit_price' => number_format($newUnit, 2),
                                'total_price' => number_format($newTotal, 2),
                                'turnaround' => $pendingOrder->turnaround,
                                'client_email' => $pendingOrder->client_email,
                                'images' => $allImages,
                            ],
                        ],
                        'suggested_replies' => [
                            'Schedule Consultation Call',
                            'Turnaround SLAs',
                        ],
                    ];
                } else {
                    // Exact match
                    $pendingOrder->update([
                        'images' => $allImages,
                        'uploaded_count' => $uploadedCount,
                    ]);

                    return [
                        'content' => "✅ **All {$targetQty} images received** for Order **#{$pendingOrder->order_number}**! Your batch is queued for production.",
                        'tool_cards' => [
                            [
                                'type' => 'order_confirmed_card',
                                'order_number' => $pendingOrder->order_number,
                                'service_name' => $pendingOrder->service_name,
                                'service_slug' => $pendingOrder->service_slug,
                                'complexity' => $pendingOrder->complexity,
                                'quantity' => $targetQty,
                                'uploaded_count' => $uploadedCount,
                                'remaining_count' => 0,
                                'discrepancy_status' => 'complete',
                                'unit_price' => number_format($pendingOrder->unit_price, 2),
                                'total_price' => number_format($pendingOrder->total_price, 2),
                                'turnaround' => $pendingOrder->turnaround,
                                'client_email' => $pendingOrder->client_email,
                                'images' => $allImages,
                            ],
                        ],
                        'suggested_replies' => [
                            'Schedule Consultation Call',
                            'Turnaround SLAs',
                        ],
                    ];
                }
            }

            // No pending order:
            if ($count <= 3) {
                $quoteResult = $this->tools->execute('calculate_image_price', [
                    'service' => 'background-removal',
                    'complexity' => 'simple',
                    'quantity' => $count,
                ], $session);

                $intro = 'Got your photo! Since this is within 3 images, your test edit is 100% on us ($0). Ready to test our quality?';

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
            } else {
                // Direct commercial batch upload (>3 images)
                $calc = app(PriceCalculatorTool::class)->execute([
                    'service' => 'background-removal',
                    'complexity' => 'simple',
                    'quantity' => $count,
                ]);
                $total = (float) str_replace(',', '', (string) ($calc['total_price'] ?? '0'));
                $unit = (float) str_replace(',', '', (string) ($calc['unit_price'] ?? '0'));
                $discountPercent = $calc['discount_applied'] ? (int) filter_var($calc['discount_applied'], FILTER_SANITIZE_NUMBER_INT) : 0;

                $order = Order::create([
                    'chat_session_id' => $session?->id,
                    'client_name' => $session?->lead_name ?? 'Client',
                    'client_email' => $session?->lead_email ?? 'pending-email@temp.local',
                    'client_phone' => $session?->lead_phone,
                    'service_name' => 'Clipping Path / Background Removal',
                    'service_slug' => 'background-removal',
                    'complexity' => 'simple',
                    'quantity' => $count,
                    'uploaded_count' => $count,
                    'unit_price' => $unit,
                    'discount_percent' => $discountPercent,
                    'total_price' => $total,
                    'currency' => 'USD',
                    'turnaround' => 'Standard 24h SLA',
                    'images' => $attachments,
                    'status' => 'pending',
                    'payment_status' => 'unpaid',
                    'source' => 'chat',
                ]);

                try {
                    app(NotificationService::class)->toAllAdmins()->send('order.new', [
                        'title' => '🛒 New Order #'.$order->order_number,
                        'message' => "Order #{$order->order_number} created with {$count} images (\$".number_format($total, 2).')',
                        'order_id' => $order->id,
                        'admin_url' => url('/admin/orders'),
                        'timestamp' => now()->toISOString(),
                    ]);
                } catch (\Throwable $e) {
                }

                return [
                    'content' => "🎉 **Order #{$order->order_number} Created!** Received all {$count} images (\${$total} total). Where should we email your completed files and invoice?",
                    'tool_cards' => [
                        [
                            'type' => 'order_confirmed_card',
                            'order_number' => $order->order_number,
                            'service_name' => $order->service_name,
                            'service_slug' => $order->service_slug,
                            'complexity' => $order->complexity,
                            'quantity' => $count,
                            'uploaded_count' => $count,
                            'remaining_count' => 0,
                            'discrepancy_status' => 'complete',
                            'unit_price' => number_format($unit, 2),
                            'total_price' => number_format($total, 2),
                            'turnaround' => $order->turnaround,
                            'client_email' => $order->client_email,
                            'images' => $attachments,
                        ],
                    ],
                    'suggested_replies' => [
                        'Schedule Consultation Call',
                        'Ask About Turnaround SLA',
                    ],
                ];
            }
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
                'content' => 'Your appointment details:',
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
                ? 'Pick a new time below to reschedule:'
                : 'Pick a time below that works for a quick 15-min chat:';

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
            str_contains($text, 'order') ||
            str_contains($text, 'upload batch') ||
            str_contains($text, 'upload my') ||
            str_contains($text, 'upload own');

        if ($isFreeTrialIntent) {
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
                $existingTrial = Order::where('payment_status', 'free_trial')->where('client_email', $clientEmail)->first();
            }
            if (! $existingTrial && $session) {
                $existingTrial = Order::where('payment_status', 'free_trial')->where('chat_session_id', $session->id)->first();
            }

            // If a trial already exists, enforce the 1-trial rule
            if ($existingTrial) {
                if ($existingTrial->status === 'completed') {
                    return [
                        'content' => "Looks like you've already used your free test edits with **{$existingTrial->client_email}**! Regular edits start at just $0.49/image. Here are the rates:",
                        'tool_cards' => [
                            [
                                'type' => 'trial_quota_exhausted_card',
                                'title' => 'Trial Quota Limit Reached',
                                'client_email' => $existingTrial->client_email,
                                'message' => "You have already completed your 100% Free Trial sample order ({$existingTrial->order_number}). Standard production rates apply.",
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
                        'content' => "Your test edits (Order {$existingTrial->order_number}) are already in production! We'll email the finished files to **{$existingTrial->client_email}** soon.",
                        'tool_cards' => [
                            [
                                'type' => 'free_trial_confirmed_card',
                                'title' => 'Free Trial Already In Production',
                                'images_count' => $existingTrial->quantity,
                                'total_cost' => '$0.00 USD (FREE)',
                                'turnaround' => 'Sub-12 Hours Rapid SLA',
                                'status' => 'In Production Queue',
                                'client_email' => $existingTrial->client_email,
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
                    'content' => "We have your sample order (Order {$existingTrial->order_number}) queued! We'll deliver the files to **{$existingTrial->client_email}** once finished.",
                    'tool_cards' => [
                        [
                            'type' => 'free_trial_confirmed_card',
                            'title' => '100% Free Trial Activated',
                            'images_count' => $existingTrial->quantity,
                            'total_cost' => '$0.00 USD (FREE)',
                            'turnaround' => 'Sub-12 Hours Rapid SLA',
                            'status' => 'In Production Queue',
                            'client_email' => $existingTrial->client_email,
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
                        'content' => 'Your network has already used the free test trial. Regular edits start at just $0.49/image:',
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
            if ($uploadedCount > 0) {
                $actualCount = min($uploadedCount, 3);

                if ($session) {
                    $trialOrder = Order::firstOrCreate(
                        [
                            'chat_session_id' => $session->id,
                            'payment_status' => 'free_trial',
                        ],
                        [
                            'order_number' => 'CE-TRL-'.strtoupper(Str::random(6)),
                            'client_name' => $session->lead_name ?? 'Guest Client',
                            'client_email' => $clientEmail ?: 'pending-email@temp.local',
                            'client_phone' => $session->lead_phone,
                            'ip_address' => $session->ip_address,
                            'service_name' => 'Background Removal',
                            'service_slug' => 'background-removal',
                            'complexity' => 'simple',
                            'quantity' => $actualCount,
                            'uploaded_count' => $actualCount,
                            'unit_price' => 0.00,
                            'total_price' => 0.00,
                            'currency' => 'USD',
                            'turnaround' => '12h Free Trial SLA',
                            'images' => array_slice($trialImages, 0, 3),
                            'instructions' => '100% Free Trial requested via smart chat assistant.',
                            'status' => 'pending',
                            'payment_status' => 'free_trial',
                            'source' => 'chat_trial',
                        ]
                    );

                    if (! empty($clientEmail)) {
                        try {
                            app(NotificationService::class)->toAllAdmins()->send('trial.new', [
                                'title' => '🎁 New Free Trial Order',
                                'message' => "Client {$clientEmail} submitted {$actualCount} sample image(s) for retouching",
                                'trial_id' => $trialOrder->id,
                                'admin_url' => url('/admin/orders?type=free_trial'),
                                'timestamp' => now()->toISOString(),
                            ]);
                        } catch (\Throwable $e) {
                        }
                    }
                }

                $contentMsg = ! empty($clientEmail)
                    ? "🎉 **Free Trial Activated!** We'll email your finished edits to **{$clientEmail}** within 12 hours."
                    : '🎉 **Free Trial Activated!** Where should we email your finished edits?';

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
            return [
                'content' => 'Add up to 3 sample photos below to try us out for free ($0):',
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

        // 3.6. Detect Commercial Batch Order Intent (Quote Confirmation & File Fulfill)
        if ($isConfirmBatchIntent) {
            $batchQty = 50;
            if (preg_match('/(?:for|order|batch)\s*(\d{1,5})\b/i', $text, $m)) {
                $batchQty = max(1, (int) $m[1]);
            } elseif (preg_match('/\b(\d{1,5})\s*(?:images|photos|items|files|pics)\b/i', $text, $m)) {
                $batchQty = max(1, (int) $m[1]);
            }

            $serviceSlug = 'background-removal';
            $serviceTitle = 'Clipping Path / Background Removal';
            if (str_contains($text, 'mannequin') || str_contains($text, 'neck') || str_contains($text, 'joint')) {
                $serviceSlug = 'ghost-mannequin';
                $serviceTitle = 'Ghost Mannequin / Invisible Symmetry';
            } elseif (str_contains($text, 'model') || str_contains($text, 'skin') || str_contains($text, 'beauty')) {
                $serviceSlug = 'high-end-model-retouch';
                $serviceTitle = 'High-End Model & Skin Retouch';
            } elseif (str_contains($text, 'jewelry') || str_contains($text, 'diamond') || str_contains($text, 'gem')) {
                $serviceSlug = 'jewelry-retouch';
                $serviceTitle = 'Jewelry Macro Retouch';
            } elseif (str_contains($text, '3d') || str_contains($text, 'cgi')) {
                $serviceSlug = '3d-modeling';
                $serviceTitle = '3D Product Modeling';
            }

            $complexity = 'simple';
            if (str_contains($text, 'super complex') || str_contains($text, 'super_complex')) {
                $complexity = 'super_complex';
            } elseif (str_contains($text, 'medium')) {
                $complexity = 'medium';
            } elseif (str_contains($text, 'complex')) {
                $complexity = 'complex';
            }

            $calc = app(PriceCalculatorTool::class)->execute([
                'service' => $serviceSlug,
                'complexity' => $complexity,
                'quantity' => $batchQty,
            ]);
            $total = (float) str_replace(',', '', (string) ($calc['total_price'] ?? '0'));
            $unit = (float) str_replace(',', '', (string) ($calc['unit_price'] ?? '0'));
            $discountPercent = $calc['discount_applied'] ? (int) filter_var($calc['discount_applied'], FILTER_SANITIZE_NUMBER_INT) : 0;

            $sessionImages = [];
            if (! empty($attachments)) {
                $sessionImages = $attachments;
            } elseif ($session) {
                $latestMsg = $session->messages()->whereNotNull('attachments')->latest('id')->first();
                $sessionImages = (array) ($latestMsg?->attachments ?? []);
            }
            $uploadedCount = count($sessionImages);

            $clientEmail = $session?->lead_email ?: 'pending-email@temp.local';
            $clientName = $session?->lead_name ?: 'Client';

            $order = Order::updateOrCreate(
                [
                    'chat_session_id' => $session?->id,
                    'status' => 'pending',
                ],
                [
                    'client_name' => $clientName,
                    'client_email' => $clientEmail,
                    'client_phone' => $session?->lead_phone,
                    'service_name' => $serviceTitle,
                    'service_slug' => $serviceSlug,
                    'complexity' => $complexity,
                    'quantity' => $batchQty,
                    'uploaded_count' => $uploadedCount,
                    'unit_price' => $unit,
                    'discount_percent' => $discountPercent,
                    'total_price' => $total,
                    'currency' => 'USD',
                    'turnaround' => 'Standard 24h SLA',
                    'images' => $sessionImages,
                    'payment_status' => 'unpaid',
                    'source' => 'chat',
                ]
            );

            try {
                app(NotificationService::class)->toAllAdmins()->send('order.new', [
                    'title' => '🛒 Order #'.$order->order_number.' Placed',
                    'message' => "Order #{$order->order_number} for {$batchQty} {$serviceTitle} images (\$".number_format($total, 2).')',
                    'order_id' => $order->id,
                    'admin_url' => url('/admin/orders'),
                    'timestamp' => now()->toISOString(),
                ]);
            } catch (\Throwable $e) {
            }

            if ($uploadedCount === 0) {
                return [
                    'content' => "🎉 **Order #{$order->order_number} Created!**\n\nQuoted **{$batchQty} images** at **\${$unit}/image** (\${$total} total). Please upload your {$batchQty} files below to start production:",
                    'tool_cards' => [
                        [
                            'type' => 'order_confirmed_card',
                            'order_number' => $order->order_number,
                            'service_name' => $order->service_name,
                            'service_slug' => $order->service_slug,
                            'complexity' => $order->complexity,
                            'quantity' => $batchQty,
                            'uploaded_count' => 0,
                            'remaining_count' => $batchQty,
                            'discrepancy_status' => 'under',
                            'unit_price' => number_format($unit, 2),
                            'total_price' => number_format($total, 2),
                            'turnaround' => $order->turnaround,
                            'client_email' => $order->client_email,
                            'images' => [],
                        ],
                        [
                            'type' => 'upload_prompt_card',
                            'title' => "Upload {$batchQty} Images for Order #{$order->order_number}",
                            'description' => 'Drop your JPEG, PNG, RAW, PSD, or TIFF files. Our team will begin hand-crafting paths upon receipt.',
                            'cta' => "Select {$batchQty} Images to Upload",
                        ],
                    ],
                    'suggested_replies' => [
                        'Schedule Consultation Call',
                        'Ask About Turnaround SLA',
                        'What formats are accepted?',
                    ],
                ];
            } elseif ($uploadedCount < $batchQty) {
                $remaining = $batchQty - $uploadedCount;

                return [
                    'content' => "⚠️ **Order #{$order->order_number} Created!**\n\nReceived **{$uploadedCount} of {$batchQty} images** ({$remaining} pending). Please upload the remaining {$remaining} files, or reply *'Proceed with {$uploadedCount}'* if this is your complete set.",
                    'tool_cards' => [
                        [
                            'type' => 'order_confirmed_card',
                            'order_number' => $order->order_number,
                            'service_name' => $order->service_name,
                            'service_slug' => $order->service_slug,
                            'complexity' => $order->complexity,
                            'quantity' => $batchQty,
                            'uploaded_count' => $uploadedCount,
                            'remaining_count' => $remaining,
                            'discrepancy_status' => 'under',
                            'unit_price' => number_format($unit, 2),
                            'total_price' => number_format($total, 2),
                            'turnaround' => $order->turnaround,
                            'client_email' => $order->client_email,
                            'images' => $sessionImages,
                        ],
                        [
                            'type' => 'upload_prompt_card',
                            'title' => "Upload Remaining {$remaining} Images",
                            'description' => "Order #{$order->order_number} currently has {$uploadedCount} of {$batchQty} files. Select the remaining {$remaining} images to proceed.",
                            'cta' => "Select Remaining {$remaining} Images",
                        ],
                    ],
                    'suggested_replies' => [
                        "Proceed with {$uploadedCount} images",
                        'Schedule Consultation Call',
                        'Ask About Turnaround SLA',
                    ],
                ];
            } else {
                return [
                    'content' => "✅ **Order #{$order->order_number} Created!**\n\nAll **{$batchQty} images** are received and verified. Your order is queued for production with 24h SLA delivery.",
                    'tool_cards' => [
                        [
                            'type' => 'order_confirmed_card',
                            'order_number' => $order->order_number,
                            'service_name' => $order->service_name,
                            'service_slug' => $order->service_slug,
                            'complexity' => $order->complexity,
                            'quantity' => $batchQty,
                            'uploaded_count' => $uploadedCount,
                            'remaining_count' => 0,
                            'discrepancy_status' => 'complete',
                            'unit_price' => number_format($unit, 2),
                            'total_price' => number_format($total, 2),
                            'turnaround' => $order->turnaround,
                            'client_email' => $order->client_email,
                            'images' => $sessionImages,
                        ],
                    ],
                    'suggested_replies' => [
                        'Schedule Consultation Call',
                        'Turnaround SLAs',
                    ],
                ];
            }
        }

        // 4. Detect Pricing & Cost Intent
        if (str_contains($text, 'price') ||
            str_contains($text, 'pricing') ||
            str_contains($text, 'cost') ||
            str_contains($text, 'quote') ||
            str_contains($text, 'rate') ||
            str_contains($text, 'volume') ||
            str_contains($text, 'calculat') ||
            str_contains($text, 'how much')) {

            $service = 'background-removal';
            if (str_contains($text, 'mannequin') || str_contains($text, 'neck') || str_contains($text, 'joint')) {
                $service = 'ghost-mannequin';
            } elseif (str_contains($text, 'model') || str_contains($text, 'skin') || str_contains($text, 'fashion') || str_contains($text, 'beauty')) {
                $service = 'high-end-model-retouch';
            } elseif (str_contains($text, 'jewelry') || str_contains($text, 'diamond') || str_contains($text, 'gem') || str_contains($text, 'ring')) {
                $service = 'jewelry-retouch';
            } elseif (str_contains($text, '3d') || str_contains($text, 'cgi') || str_contains($text, 'render')) {
                $service = '3d-modeling';
            }

            $complexity = 'simple';
            if (str_contains($text, 'super complex') || str_contains($text, 'super_complex')) {
                $complexity = 'super_complex';
            } elseif (str_contains($text, 'medium')) {
                $complexity = 'medium';
            } elseif (str_contains($text, 'complex')) {
                $complexity = 'complex';
            }

            $quantity = 50;
            if (preg_match('/\b(\d{1,5})\s*(?:images|photos|items|pics|files)?\b/', $text, $m)) {
                $val = (int) $m[1];
                if ($val > 0) {
                    $quantity = $val;
                }
            }

            $quoteResult = $this->tools->execute('calculate_image_price', [
                'service' => $service,
                'complexity' => $complexity,
                'quantity' => $quantity,
            ], $session);

            return [
                'content' => 'Here is our volume pricing calculator. Rates adapt based on image complexity and batch volume:',
                'tool_cards' => [$quoteResult],
                'suggested_replies' => [],
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
                ? 'Here are the details:'
                : 'Here is what we specialize in:';

            return [
                'content' => $intro,
                'tool_cards' => [$catalogResult],
                'suggested_replies' => [],
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
                'content' => 'Here is a quick breakdown:',
                'tool_cards' => [$infoResult],
                'suggested_replies' => [],
            ];
        }

        // 5.6. Reset / Fresh Chat Intent
        if (str_contains($text, 'fresh chat') ||
            str_contains($text, 'new chat') ||
            str_contains($text, 'clear chat') ||
            str_contains($text, 'reset chat') ||
            str_contains($text, 'start fresh') ||
            str_contains($text, 'start over') ||
            str_contains($text, 'restart chat') ||
            str_contains($text, 'clear conversation') ||
            $text === 'reset' ||
            $text === 'clear' ||
            $text === '/reset' ||
            $text === '/clear') {

            return [
                'content' => 'Ready for a clean slate! Click below to start a fresh chat:',
                'tool_cards' => [
                    [
                        'type' => 'reset_chat_prompt_card',
                        'title' => 'Start Fresh Conversation',
                        'description' => 'Clear this conversation history and begin a new session.',
                        'cta' => 'Start Fresh Chat Now',
                    ],
                ],
                'suggested_replies' => [],
            ];
        }

        // 6. Default Smart Greeting / Fallback Menu
        return [
            'content' => "I'm right here! Feel free to ask about our editing services, turnaround SLAs, or volume pricing. What kind of images are you working on?",
            'tool_cards' => [],
            'suggested_replies' => [],
        ];
    }
}
