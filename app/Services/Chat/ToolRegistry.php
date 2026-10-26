<?php

namespace App\Services\Chat;

use App\Models\ChatSession;
use App\Services\Chat\Tools\CalendarBookingTool;
use App\Services\Chat\Tools\FaqAndServiceTool;
use App\Services\Chat\Tools\LeadCaptureTool;
use App\Services\Chat\Tools\PriceCalculatorTool;
use App\Services\Chat\Tools\ServiceCatalogTool;

class ToolRegistry
{
    /**
     * Get all tool schemas for Ollama / LLM function calling.
     *
     * @return array<int, array<string, mixed>>
     */
    public function getDefinitions(): array
    {
        return [
            PriceCalculatorTool::schema(),
            CalendarBookingTool::checkSpecificSlotSchema(),
            CalendarBookingTool::checkSlotsSchema(),
            CalendarBookingTool::bookAppointmentSchema(),
            CalendarBookingTool::rescheduleAppointmentSchema(),
            CalendarBookingTool::checkMyAppointmentSchema(),
            ServiceCatalogTool::schema(),
            FaqAndServiceTool::schema(),
            LeadCaptureTool::schema(),
        ];
    }

    /**
     * Get dynamically filtered tool schemas matching the user query to avoid heavy CPU prompt bloat.
     *
     * @return array<int, array<string, mixed>>
     */
    public function getRelevantDefinitions(string $userText): array
    {
        $text = strtolower($userText);
        $tools = [];

        // Pricing queries
        if (preg_match('/\b(price|pricing|cost|quote|rate|how much|dollar|\$|discount|estimate)\b/i', $text)) {
            $tools[] = PriceCalculatorTool::schema();
        }

        // Booking / Calendar queries
        if (preg_match('/\b(call|meeting|book|schedule|appointment|calendar|slot|reschedule)\b/i', $text)) {
            $tools[] = CalendarBookingTool::checkSpecificSlotSchema();
            $tools[] = CalendarBookingTool::checkSlotsSchema();
            $tools[] = CalendarBookingTool::bookAppointmentSchema();
        }

        // Email / Lead capture
        if (str_contains($text, '@')) {
            $tools[] = LeadCaptureTool::schema();
        }

        // Service exploration
        if (preg_match('/\b(service|services|catalog|portfolio|what do you (do|offer))\b/i', $text)) {
            $tools[] = ServiceCatalogTool::schema();
        }

        return $tools;
    }

    /**
     * Dispatch and execute a tool by function name.
     *
     * @param  array<string, mixed>  $arguments
     * @return array<string, mixed>
     */
    public function execute(string $toolName, array $arguments, ?ChatSession $session = null): array
    {
        return match ($toolName) {
            'check_specific_time_slot' => (new CalendarBookingTool)->checkSpecificSlot($arguments['requested_time'] ?? '', $arguments['timezone'] ?? 'UTC', $session),
            'calculate_image_price' => (new PriceCalculatorTool)->execute($arguments),
            'check_available_calendar_slots' => (new CalendarBookingTool)->getAvailableSlots($arguments['timezone'] ?? 'UTC', $session, (bool) ($arguments['is_reschedule'] ?? false)),
            'book_calendar_appointment' => (new CalendarBookingTool)->book($arguments, $session),
            'reschedule_calendar_appointment' => (new CalendarBookingTool)->reschedule($arguments, $session),
            'check_my_appointment' => (new CalendarBookingTool)->checkAppointment($arguments, $session),
            'explore_services_catalog' => (new ServiceCatalogTool)->execute($arguments),
            'search_services_and_faqs' => (new FaqAndServiceTool)->execute($arguments),
            'capture_lead' => (new LeadCaptureTool)->execute($arguments, $session),
            default => [
                'error' => "Unknown tool: {$toolName}",
            ],
        };
    }
}
