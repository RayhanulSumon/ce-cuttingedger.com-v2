<?php

namespace App\Services\Chat\Tools;

use App\Models\ChatConsultation;
use App\Models\ChatSession;
use App\Models\Service;
use App\Services\Notification\NotificationService;
use App\Services\Security\EmailAndSpamGuard;
use Carbon\Carbon;

class CalendarBookingTool
{
    /**
     * Get tool definition schema for slot checking.
     *
     * @return array<string, mixed>
     */
    public static function checkSlotsSchema(): array
    {
        return [
            'type' => 'function',
            'function' => [
                'name' => 'check_available_calendar_slots',
                'description' => 'Check available meeting slots for client consultation, quote discussion, or reschedule request.',
                'parameters' => [
                    'type' => 'object',
                    'properties' => [
                        'timezone' => [
                            'type' => 'string',
                            'description' => 'Client timezone, e.g. America/New_York, Europe/London, Asia/Dhaka. Defaults to UTC.',
                        ],
                        'is_reschedule' => [
                            'type' => 'boolean',
                            'description' => 'Set to true if user is rescheduling an existing booking.',
                        ],
                    ],
                ],
            ],
        ];
    }

    /**
     * Get tool definition schema for booking an appointment.
     *
     * @return array<string, mixed>
     */
    public static function bookAppointmentSchema(): array
    {
        return [
            'type' => 'function',
            'function' => [
                'name' => 'book_calendar_appointment',
                'description' => 'Book or reschedule a confirmed consultation call slot directly on the studio calendar.',
                'parameters' => [
                    'type' => 'object',
                    'properties' => [
                        'name' => ['type' => 'string', 'description' => 'Client full name'],
                        'email' => ['type' => 'string', 'description' => 'Client email address'],
                        'phone' => ['type' => 'string', 'description' => 'Client phone or WhatsApp number'],
                        'slot_datetime' => ['type' => 'string', 'description' => 'ISO datetime string of the selected slot'],
                        'service' => ['type' => 'string', 'description' => 'Service of interest'],
                        'notes' => ['type' => 'string', 'description' => 'Any project details or specifications'],
                        'consultation_id' => ['type' => 'integer', 'description' => 'Optional existing consultation ID to reschedule'],
                        'is_reschedule' => ['type' => 'boolean', 'description' => 'Whether this is a reschedule action'],
                    ],
                    'required' => ['name', 'email', 'slot_datetime'],
                ],
            ],
        ];
    }

    /**
     * Get tool definition schema for explicitly rescheduling an appointment.
     *
     * @return array<string, mixed>
     */
    public static function rescheduleAppointmentSchema(): array
    {
        return [
            'type' => 'function',
            'function' => [
                'name' => 'reschedule_calendar_appointment',
                'description' => 'Reschedule an existing scheduled consultation call to a new date and time slot.',
                'parameters' => [
                    'type' => 'object',
                    'properties' => [
                        'slot_datetime' => ['type' => 'string', 'description' => 'New ISO datetime slot'],
                        'consultation_id' => ['type' => 'integer', 'description' => 'Optional specific consultation ID to reschedule'],
                        'email' => ['type' => 'string', 'description' => 'Client email to match consultation if ID not known'],
                        'reason' => ['type' => 'string', 'description' => 'Reason for rescheduling'],
                    ],
                    'required' => ['slot_datetime'],
                ],
            ],
        ];
    }

    /**
     * Get tool definition schema for checking a specific day/time slot without dumping full widget.
     *
     * @return array<string, mixed>
     */
    public static function checkSpecificSlotSchema(): array
    {
        return [
            'type' => 'function',
            'function' => [
                'name' => 'check_specific_time_slot',
                'description' => 'Check if a specific time slot requested by the client (e.g. "tomorrow 11am", "tomorrow at 10am", "Friday 2pm") is open, or find the closest open slot without displaying the full multi-day widget.',
                'parameters' => [
                    'type' => 'object',
                    'properties' => [
                        'requested_time' => [
                            'type' => 'string',
                            'description' => 'The specific time requested by the client, e.g. "tomorrow 11am", "tomorrow 10am", "Wednesday 2pm"',
                        ],
                        'timezone' => [
                            'type' => 'string',
                            'description' => 'Client timezone, defaults to UTC',
                        ],
                    ],
                    'required' => ['requested_time'],
                ],
            ],
        ];
    }

    /**
     * Get tool definition schema for checking current appointment status.
     *
     * @return array<string, mixed>
     */
    public static function checkMyAppointmentSchema(): array
    {
        return [
            'type' => 'function',
            'function' => [
                'name' => 'check_my_appointment',
                'description' => 'Check the status and scheduled time of an existing consultation booking for the user.',
                'parameters' => [
                    'type' => 'object',
                    'properties' => [
                        'email' => ['type' => 'string', 'description' => 'Client email address'],
                    ],
                ],
            ],
        ];
    }

    /**
     * Generate next available slots over coming business days.
     *
     * @return array<string, mixed>
     */
    public function getAvailableSlots(string $clientTimezone = 'UTC', ?ChatSession $session = null, bool $isReschedule = false): array
    {
        $days = [];
        $current = Carbon::now($clientTimezone)->addDay();
        $checkedDays = 0;

        // Fetch already booked slots in this timeframe
        $bookedSlots = ChatConsultation::where('scheduled_at', '>=', now())
            ->where('status', '!=', 'cancelled')
            ->pluck('scheduled_at')
            ->map(fn ($dt) => $dt->format('Y-m-d H:i'))
            ->toArray();

        while ($checkedDays < 4) {
            // Skip weekends
            if ($current->isWeekend()) {
                $current->addDay();

                continue;
            }

            $dateKey = $current->format('Y-m-d');
            $dateLabel = $current->format('D, M j');

            $times = ['10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM', '05:00 PM'];
            $availableTimeSlots = [];

            foreach ($times as $time) {
                $slotCarbon = Carbon::parse("{$dateKey} {$time}", $clientTimezone);
                $slotFormatted = $slotCarbon->format('Y-m-d H:i');

                if (! in_array($slotFormatted, $bookedSlots, true)) {
                    $availableTimeSlots[] = [
                        'time' => $time,
                        'iso' => $slotCarbon->toIso8601String(),
                    ];
                }
            }

            if (! empty($availableTimeSlots)) {
                $days[] = [
                    'date' => $dateKey,
                    'label' => $dateLabel,
                    'slots' => $availableTimeSlots,
                ];
                $checkedDays++;
            }

            $current->addDay();
        }

        // Check if there is an active UPCOMING booking (scheduled_at >= now) in this session or for this email
        $existingBooking = null;
        if ($session) {
            $queryUpcoming = function ($builder) {
                return $builder->where('scheduled_at', '>=', now()->subMinutes(15))
                    ->whereNotIn('status', ['cancelled', 'completed']);
            };

            $existingConsultation = $queryUpcoming(ChatConsultation::where('chat_session_id', $session->id))
                ->latest('scheduled_at')
                ->first();

            if (! $existingConsultation && $session->lead_email) {
                $existingConsultation = $queryUpcoming(ChatConsultation::where('email', $session->lead_email))
                    ->latest('scheduled_at')
                    ->first();
            }

            if ($existingConsultation) {
                $existingBooking = [
                    'consultation_id' => $existingConsultation->id,
                    'current_time_formatted' => $existingConsultation->scheduled_at->format('l, M j \a\t g:i A T'),
                    'client_name' => $existingConsultation->name,
                    'client_email' => $existingConsultation->email,
                    'status' => $existingConsultation->status,
                ];
                $isReschedule = true;
            }
        }

        return [
            'type' => 'calendar_slot_picker',
            'title' => $isReschedule
                ? 'Reschedule Technical Intake Call'
                : 'Schedule a 15-Minute Technical Call with Our Production Lead',
            'description' => $isReschedule
                ? "You have an upcoming consultation booked for {$existingBooking['current_time_formatted']}. Select a new slot below to move it, or keep your existing appointment."
                : 'Pick a time that works best for you. We will review your images and delivery SLA.',
            'timezone' => $clientTimezone,
            'is_reschedule' => $isReschedule,
            'existing_booking' => $existingBooking,
            'days' => $days,
        ];
    }

    /**
     * Check a specific day/time slot requested by user and return a compact proposal without dumping the full multi-day widget.
     *
     * @return array<string, mixed>
     */
    public function checkSpecificSlot(string $requestedTime, string $clientTimezone = 'UTC', ?ChatSession $session = null): array
    {
        $targetDate = Carbon::now($clientTimezone);
        if (str_contains(strtolower($requestedTime), 'tomorrow')) {
            $targetDate = $targetDate->addDay();
        } elseif (preg_match('/\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i', $requestedTime, $dayMatch)) {
            $targetDate = Carbon::parse("next {$dayMatch[1]}", $clientTimezone);
        }

        if ($targetDate->isWeekend()) {
            $targetDate = Carbon::parse('next monday', $clientTimezone);
        }

        $dateKey = $targetDate->format('Y-m-d');
        $dateLabel = $targetDate->format('l, F j');

        $standardTimes = ['10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM', '05:00 PM'];

        $bookedSlots = ChatConsultation::whereDate('scheduled_at', $dateKey)
            ->where('status', '!=', 'cancelled')
            ->pluck('scheduled_at')
            ->map(fn ($dt) => $dt->format('g:i A'))
            ->toArray();

        $closestTime = null;
        $isExact = false;

        if (preg_match('/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/i', $requestedTime, $m)) {
            $hour = (int) $m[1];
            $minute = ! empty($m[2]) ? (int) $m[2] : 0;
            $meridiem = ! empty($m[3]) ? strtoupper($m[3]) : ($hour < 8 || $hour === 12 ? 'PM' : 'AM');
            if ($meridiem === 'AM' && $hour === 12) {
                $hour = 0;
            }

            $requestedMinutes = ($meridiem === 'PM' && $hour < 12 ? $hour + 12 : $hour) * 60 + $minute;
            $minDiff = 9999;
            foreach ($standardTimes as $st) {
                $stCarbon = Carbon::parse("{$dateKey} {$st}", $clientTimezone);
                $stMinutes = $stCarbon->hour * 60 + $stCarbon->minute;
                $diff = abs($stMinutes - $requestedMinutes);
                if ($diff < $minDiff && ! in_array($st, $bookedSlots, true)) {
                    $minDiff = $diff;
                    $closestTime = $st;
                }
            }

            if ($closestTime) {
                $isExact = ($minDiff === 0);
            }
        }

        if (! $closestTime) {
            $open = array_values(array_diff($standardTimes, $bookedSlots));
            $closestTime = $open[0] ?? '10:00 AM';
        }

        $slotCarbon = Carbon::parse("{$dateKey} {$closestTime}", $clientTimezone);

        return [
            'type' => 'compact_slot_proposal',
            'date_label' => $dateLabel,
            'requested_time' => $requestedTime,
            'selected_time' => $closestTime,
            'slot_datetime' => $slotCarbon->toIso8601String(),
            'is_exact' => $isExact,
            'message' => $isExact
                ? "{$dateLabel} at {$closestTime} UTC is available! Click below to confirm or reply with your email to lock it in:"
                : (preg_match('/\b(tomorrow|today|monday|tuesday|wednesday|thursday|friday|saturday|sunday|\d{1,2}(?::\d{2})?\s*(?:am|pm))\b/i', $requestedTime)
                    ? "For {$requestedTime}, our closest available slot on {$dateLabel} is **{$closestTime} UTC**. Click below to confirm or select another time:"
                    : "We would be delighted to schedule your technical intake call! Our earliest available slot on {$dateLabel} is **{$closestTime} UTC**. Click below to confirm or select another time:"),
        ];
    }

    /**
     * Book appointment or reschedule existing appointment.
     *
     * @param  array<string, mixed>  $params
     * @return array<string, mixed>
     */
    public function book(array $params, ?ChatSession $session = null): array
    {
        $consultationId = $params['consultation_id'] ?? null;
        $email = trim((string) ($params['email'] ?? ($session?->lead_email ?? '')));

        if ($email) {
            $spamGuard = app(EmailAndSpamGuard::class);
            $emailCheck = $spamGuard->validateEmail($email);
            if (! $emailCheck['valid']) {
                return [
                    'type' => 'error_card',
                    'success' => false,
                    'error' => $emailCheck['reason'],
                    'message' => $emailCheck['reason'],
                ];
            }
        }

        // Check if user already has an active upcoming consultation in database
        $existingConsultation = null;
        if ($consultationId) {
            $existingConsultation = ChatConsultation::find($consultationId);
        }

        if (! $existingConsultation) {
            $query = ChatConsultation::where('scheduled_at', '>=', now()->subMinutes(15))
                ->whereNotIn('status', ['cancelled', 'completed']);

            if ($session && $email) {
                $existingConsultation = $query->where(function ($q) use ($session, $email) {
                    $q->where('chat_session_id', $session->id)
                        ->orWhere('email', $email);
                })->latest('scheduled_at')->first();
            } elseif ($session) {
                $existingConsultation = $query->where('chat_session_id', $session->id)->latest('scheduled_at')->first();
            } elseif ($email) {
                $existingConsultation = $query->where('email', $email)->latest('scheduled_at')->first();
            }
        }

        // If an upcoming consultation exists, automatically update/reschedule it to prevent duplicates
        if ($existingConsultation) {
            return $this->reschedule([
                'consultation_id' => $existingConsultation->id,
                'slot_datetime' => $params['slot_datetime'] ?? '',
                'reason' => $params['notes'] ?? 'Rescheduled via chat slot picker',
                'name' => $params['name'] ?? $existingConsultation->name,
                'email' => $email ?: $existingConsultation->email,
                'phone' => $params['phone'] ?? $existingConsultation->phone,
            ], $session);
        }

        $name = trim((string) ($params['name'] ?? 'Guest Client'));
        $email = trim((string) ($params['email'] ?? ''));
        $phone = trim((string) ($params['phone'] ?? ''));
        $slotDatetime = trim((string) ($params['slot_datetime'] ?? ''));
        $notes = ! empty($params['notes']) ? trim((string) $params['notes']) : 'General technical intake & studio inquiry';
        $serviceSlug = trim((string) ($params['service'] ?? ''));

        $serviceId = null;
        if ($serviceSlug) {
            $service = Service::where('slug', 'like', "%{$serviceSlug}%")->first();
            $serviceId = $service?->id;
        }

        $scheduledCarbon = Carbon::parse($slotDatetime);

        $consultation = ChatConsultation::create([
            'chat_session_id' => $session?->id,
            'name' => $name,
            'email' => $email,
            'phone' => $phone ?: null,
            'service_id' => $serviceId,
            'scheduled_at' => $scheduledCarbon,
            'timezone' => $scheduledCarbon->getTimezone()->getName() ?: 'UTC',
            'status' => 'pending',
            'notes' => $notes,
        ]);

        if ($session) {
            $session->update([
                'lead_name' => $name,
                'lead_email' => $email,
                'lead_phone' => $phone ?: $session->lead_phone,
                'status' => 'converted',
            ]);
        }

        // Broadcast real-time alert to administrators
        try {
            app(NotificationService::class)->triggerConsultationBooked($consultation);
        } catch (\Throwable $e) {
            // Silently log
        }

        return [
            'type' => 'booking_confirmed_card',
            'consultation_id' => $consultation->id,
            'client_name' => $name,
            'email' => $email,
            'slot_datetime' => $scheduledCarbon->toIso8601String(),
            'datetime_formatted' => $scheduledCarbon->format('l, F j, Y \a\t g:i A T'),
            'meeting_link_note' => 'A Google Meet / Zoom link has been sent to your email with calendar invitation.',
            'status' => 'Confirmed',
            'is_rescheduled' => false,
        ];
    }

    /**
     * Reschedule an existing consultation.
     *
     * @param  array<string, mixed>  $params
     * @return array<string, mixed>
     */
    public function reschedule(array $params, ?ChatSession $session = null): array
    {
        $slotDatetime = trim((string) ($params['slot_datetime'] ?? ''));
        $consultationId = $params['consultation_id'] ?? null;
        $email = trim((string) ($params['email'] ?? ''));
        $reason = trim((string) ($params['reason'] ?? 'Requested new slot via chat'));

        $consultation = null;
        if ($consultationId) {
            $consultation = ChatConsultation::find($consultationId);
        }
        if (! $consultation && $session) {
            $consultation = ChatConsultation::where('chat_session_id', $session->id)
                ->where('status', '!=', 'cancelled')
                ->latest('id')
                ->first();
        }
        if (! $consultation && $email) {
            $consultation = ChatConsultation::where('email', $email)
                ->where('status', '!=', 'cancelled')
                ->latest('id')
                ->first();
        }

        if (! $consultation) {
            // If no prior consultation found, fall back to new booking
            return $this->book($params, $session);
        }

        $oldFormatted = $consultation->scheduled_at->format('M j, Y \a\t g:i A');
        $newCarbon = Carbon::parse($slotDatetime);
        $newFormatted = $newCarbon->format('M j, Y \a\t g:i A');

        $auditNote = "\n[Rescheduled via Chat: was {$oldFormatted}, moved to {$newFormatted}. Reason: {$reason}]";

        $consultation->update([
            'scheduled_at' => $newCarbon,
            'status' => 'confirmed',
            'notes' => trim(($consultation->notes ?? '').$auditNote),
        ]);

        if (! empty($params['name'])) {
            $consultation->update(['name' => trim((string) $params['name'])]);
        }
        if (! empty($params['phone'])) {
            $consultation->update(['phone' => trim((string) $params['phone'])]);
        }

        // Notify Admins
        try {
            app(NotificationService::class)->sendToAllAdmins('consultation.rescheduled', [
                'title' => '📅 Consultation Rescheduled',
                'message' => "Client {$consultation->name} moved call to {$newCarbon->format('l, M j \a\t g:i A T')}",
                'consultation_id' => $consultation->id,
                'admin_url' => url('/admin/consultations'),
                'timestamp' => now()->toISOString(),
            ]);
        } catch (\Throwable $e) {
            // Silently log
        }

        return [
            'type' => 'booking_confirmed_card',
            'consultation_id' => $consultation->id,
            'client_name' => $consultation->name,
            'email' => $consultation->email,
            'slot_datetime' => $newCarbon->toIso8601String(),
            'datetime_formatted' => $newCarbon->format('l, F j, Y \a\t g:i A T'),
            'previous_datetime' => $oldFormatted,
            'meeting_link_note' => 'Your calendar invitation has been updated with the new time.',
            'status' => 'Rescheduled',
            'is_rescheduled' => true,
        ];
    }

    /**
     * Check status of client's active appointment.
     *
     * @param  array<string, mixed>  $params
     * @return array<string, mixed>
     */
    public function checkAppointment(array $params, ?ChatSession $session = null): array
    {
        $email = trim((string) ($params['email'] ?? ''));

        $query = ChatConsultation::where('scheduled_at', '>=', now()->subMinutes(15))
            ->whereNotIn('status', ['cancelled', 'completed']);

        $consultation = null;
        if ($session && $email) {
            $consultation = $query->where(function ($q) use ($session, $email) {
                $q->where('chat_session_id', $session->id)->orWhere('email', $email);
            })->latest('scheduled_at')->first();
        } elseif ($session) {
            $consultation = $query->where('chat_session_id', $session->id)->latest('scheduled_at')->first();
        } elseif ($email) {
            $consultation = $query->where('email', $email)->latest('scheduled_at')->first();
        }

        if (! $consultation) {
            return [
                'type' => 'no_appointment_found',
                'message' => 'No active upcoming consultations found. Would you like to schedule a 15-minute intake call?',
            ];
        }

        return [
            'type' => 'appointment_status_card',
            'consultation_id' => $consultation->id,
            'client_name' => $consultation->name,
            'email' => $consultation->email,
            'slot_datetime' => $consultation->scheduled_at->toIso8601String(),
            'datetime_formatted' => $consultation->scheduled_at->format('l, F j, Y \a\t g:i A T'),
            'status' => ucfirst($consultation->status),
            'notes' => $consultation->notes,
            'can_reschedule' => true,
        ];
    }
}
