<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ChatConsultation;
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

        if ($status && in_array($status, ['confirmed', 'completed', 'cancelled'], true)) {
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
            'upcoming' => ChatConsultation::where('scheduled_at', '>=', now())
                ->where('status', '!=', 'cancelled')
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
     * Update consultation status and admin notes.
     */
    public function update(Request $request, ChatConsultation $consultation): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:confirmed,completed,cancelled'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $consultation->update($validated);

        return redirect()->back()->with('success', 'Consultation status updated successfully.');
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
