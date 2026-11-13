<?php

namespace App\Http\Controllers;

use App\Services\Consultation\ConsultationScheduler;
use App\Services\Security\EmailAndSpamGuard;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Backs the "Schedule a call" calendar popup used across the site (not the chat assistant).
 */
class DiscoveryCallController extends Controller
{
    public function __construct(protected ConsultationScheduler $calendar) {}

    /**
     * Available consultation slots for the calendar popup.
     */
    public function slots(Request $request): JsonResponse
    {
        return response()->json($this->calendar->getAvailableSlots((string) $request->query('timezone', 'UTC')));
    }

    /**
     * Book (or reschedule) a consultation slot.
     */
    public function book(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'slot_datetime' => 'required|string',
            'name' => 'required|string|max:120',
            'email' => 'required|email|max:150',
            'phone' => 'nullable|string|max:50',
            'notes' => 'nullable|string|max:1000',
            'capability' => 'nullable|string|max:100',
            'consultation_id' => 'nullable|integer',
            'is_reschedule' => 'nullable|boolean',
        ]);

        $emailCheck = app(EmailAndSpamGuard::class)->validateEmail($validated['email']);
        if (! $emailCheck['valid']) {
            return response()->json([
                'success' => false,
                'message' => $emailCheck['reason'],
                'error_type' => $emailCheck['error_type'],
            ], 422);
        }

        $result = $this->calendar->book($validated);

        if (($result['success'] ?? true) === false) {
            return response()->json(['success' => false, 'message' => $result['message'] ?? 'Unable to book this slot.'], 422);
        }

        return response()->json(['success' => true] + $result);
    }
}
