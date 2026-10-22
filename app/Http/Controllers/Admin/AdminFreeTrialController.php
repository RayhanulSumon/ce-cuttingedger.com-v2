<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FreeTrialRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminFreeTrialController extends Controller
{
    /**
     * Display listing of Free Trial submissions.
     */
    public function index(Request $request): Response
    {
        $status = $request->query('status');
        $search = $request->query('search');

        $query = FreeTrialRequest::with('chatSession')->latest('id');

        if ($status && in_array($status, ['pending', 'in_production', 'completed', 'rejected'], true)) {
            $query->where('status', $status);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('service', 'like', "%{$search}%");
            });
        }

        $trials = $query->paginate(15)->withQueryString()->through(fn (FreeTrialRequest $trial) => [
            'id' => $trial->id,
            'chat_session_id' => $trial->chat_session_id,
            'name' => $trial->name,
            'email' => $trial->email,
            'phone' => $trial->phone,
            'service' => $trial->service,
            'images' => (array) ($trial->images ?? []),
            'images_count' => $trial->images_count,
            'instructions' => $trial->instructions,
            'status' => $trial->status,
            'admin_notes' => $trial->admin_notes,
            'created_at' => $trial->created_at->toISOString(),
            'created_at_formatted' => $trial->created_at->format('M j, Y \a\t g:i A'),
        ]);

        $stats = [
            'total' => FreeTrialRequest::count(),
            'pending' => FreeTrialRequest::where('status', 'pending')->count(),
            'in_production' => FreeTrialRequest::where('status', 'in_production')->count(),
            'completed' => FreeTrialRequest::where('status', 'completed')->count(),
            'rejected' => FreeTrialRequest::where('status', 'rejected')->count(),
        ];

        return Inertia::render('Admin/FreeTrials/Index', [
            'trials' => $trials,
            'stats' => $stats,
            'currentStatus' => $status,
            'searchTerm' => $search,
        ]);
    }

    /**
     * Update trial status and notes.
     */
    public function update(Request $request, FreeTrialRequest $freeTrial): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,in_production,completed,rejected',
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        $freeTrial->update($validated);

        return redirect()->back()->with('success', "Trial order #{$freeTrial->id} status updated to {$validated['status']}.");
    }

    /**
     * Delete a free trial request.
     */
    public function destroy(FreeTrialRequest $freeTrial): RedirectResponse
    {
        $freeTrial->delete();

        return redirect()->back()->with('success', 'Free trial request deleted.');
    }
}
