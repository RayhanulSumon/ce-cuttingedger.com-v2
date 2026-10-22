<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ChatConsultation;
use App\Services\Notification\NotificationService;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminConsultationController extends Controller
{
    /**
     * Display a listing of booked client consultations.
     */
    public function index(Request $request): Response
    {
        $status = $request->query('status');

        $query = ChatConsultation::with('service', 'session')
            ->orderBy('scheduled_at', 'desc');

        if ($status && in_array($status, ['pending', 'confirmed', 'completed', 'cancelled'], true)) {
            $query->where('status', $status);
        }

        $consultations = $query->get()->map(fn (ChatConsultation $c) => [
            'id' => $c->id,
            'chat_session_id' => $c->chat_session_id,
            'name' => $c->name,
            'email' => $c->email,
            'phone' => $c->phone,
            'service_name' => $c->service?->title ?? 'General Technical Intake',
            'scheduled_at' => $c->scheduled_at->toISOString(),
            'scheduled_at_formatted' => $c->scheduled_at->format('M j, Y \a\t g:i A'),
            'is_upcoming' => $c->scheduled_at->isFuture(),
            'timezone' => $c->timezone,
            'status' => $c->status,
            'notes' => $c->notes,
            'created_at' => $c->created_at->toISOString(),
        ]);

        $stats = [
            'total' => ChatConsultation::count(),
            'pending' => ChatConsultation::where('status', 'pending')->count(),
            'upcoming' => ChatConsultation::where('scheduled_at', '>=', now())
                ->where('status', 'confirmed')
                ->count(),
            'completed' => ChatConsultation::where('status', 'completed')->count(),
            'cancelled' => ChatConsultation::where('status', 'cancelled')->count(),
        ];

        return Inertia::render('Admin/Consultations/Index', [
            'consultations' => $consultations,
            'stats' => $stats,
            'currentStatus' => $status,
        ]);
    }

    /**
     * Update consultation status, reschedule date/time, and admin notes.
     */
    public function update(Request $request, ChatConsultation $consultation): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['sometimes', 'required', 'in:pending,confirmed,completed,cancelled'],
            'scheduled_at' => ['nullable', 'date'],
            'timezone' => ['nullable', 'string', 'max:100'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $message = 'Consultation updated successfully.';

        if ($request->filled('scheduled_at')) {
            $newScheduledAt = Carbon::parse($request->input('scheduled_at'));
            if (! $newScheduledAt->equalTo($consultation->scheduled_at)) {
                $oldFormatted = $consultation->scheduled_at->format('M j, Y \a\t g:i A');
                $newFormatted = $newScheduledAt->format('M j, Y \a\t g:i A');
                $rescheduleNote = "\n[Rescheduled: previously {$oldFormatted}, moved to {$newFormatted}]";

                $validated['scheduled_at'] = $newScheduledAt;
                $validated['notes'] = trim(($validated['notes'] ?? $consultation->notes).$rescheduleNote);

                if (! isset($validated['status']) || $validated['status'] === 'pending') {
                    $validated['status'] = 'confirmed';
                }

                $message = "Consultation rescheduled to {$newFormatted}.";

                // Broadcast alert
                try {
                    app(NotificationService::class)->sendToAllAdmins('consultation.rescheduled', [
                        'title' => '📅 Call Rescheduled',
                        'message' => "Consultation with {$consultation->name} moved to {$newFormatted}",
                        'consultation_id' => $consultation->id,
                        'admin_url' => url('/admin/consultations'),
                        'timestamp' => now()->toISOString(),
                    ]);
                } catch (\Throwable $e) {
                    // Silently log
                }
            }
        }

        $consultation->update($validated);

        return redirect()->back()->with('success', $message);
    }

    /**
     * Remove consultation record.
     */
    public function destroy(ChatConsultation $consultation): RedirectResponse
    {
        $consultation->delete();

        return redirect()->back()->with('success', 'Consultation record deleted.');
    }
}
