<?php

namespace App\Services\Chat\Tools;

use App\Models\ChatConsultation;
use App\Models\ChatSession;
use App\Models\Service;
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
                'description' => 'Check available meeting slots for client consultation, quote discussion, or technical intake call.',
                'parameters' => [
                    'type' => 'object',
                    'properties' => [
                        'timezone' => [
                            'type' => 'string',
                            'description' => 'Client timezone, e.g. America/New_York, Europe/London, Asia/Dhaka. Defaults to UTC.',
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
                'description' => 'Book a confirmed consultation call slot directly on the calendar.',
                'parameters' => [
                    'type' => 'object',
                    'properties' => [
                        'name' => ['type' => 'string', 'description' => 'Client full name'],
                        'email' => ['type' => 'string', 'description' => 'Client email address'],
                        'phone' => ['type' => 'string', 'description' => 'Client phone or WhatsApp number'],
                        'slot_datetime' => ['type' => 'string', 'description' => 'ISO datetime string of the selected slot'],
                        'service' => ['type' => 'string', 'description' => 'Service of interest'],
                        'notes' => ['type' => 'string', 'description' => 'Any project details or specifications'],
                    ],
                    'required' => ['name', 'email', 'slot_datetime'],
                ],
            ],
        ];
    }

    /**
     * Generate next available slots over the coming 5 business days.
     *
     * @return array<string, mixed>
     */
    public function getAvailableSlots(string $clientTimezone = 'UTC'): array
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

        return [
            'type' => 'calendar_slot_picker',
            'title' => 'Schedule a 15-Minute Technical Call with Our Production Lead',
            'description' => 'Pick a time that works best for you. We will review your images and delivery SLA.',
            'timezone' => $clientTimezone,
            'days' => $days,
        ];
    }

    /**
     * Book appointment and store in DB.
     *
     * @param  array<string, mixed>  $params
     * @return array<string, mixed>
     */
    public function book(array $params, ?ChatSession $session = null): array
    {
        $name = trim((string) ($params['name'] ?? 'Guest Client'));
        $email = trim((string) ($params['email'] ?? ''));
        $phone = trim((string) ($params['phone'] ?? ''));
        $slotDatetime = trim((string) ($params['slot_datetime'] ?? ''));
        $notes = trim((string) ($params['notes'] ?? 'Booked via smart chat dialog'));
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
            'status' => 'confirmed',
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

        return [
            'type' => 'booking_confirmed_card',
            'consultation_id' => $consultation->id,
            'client_name' => $name,
            'email' => $email,
            'datetime_formatted' => $scheduledCarbon->format('l, F j, Y \a\t g:i A T'),
            'meeting_link_note' => 'A Google Meet / Zoom link has been sent to your email with calendar invitation.',
            'status' => 'Confirmed',
        ];
    }
}
