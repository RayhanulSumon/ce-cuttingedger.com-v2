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
     * Dispatch and execute a tool by function name.
     *
     * @param  array<string, mixed>  $arguments
     * @return array<string, mixed>
     */
    public function execute(string $toolName, array $arguments, ?ChatSession $session = null): array
    {
        return match ($toolName) {
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
