<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TrackingScript;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminTrackingScriptController extends Controller
{
    /**
     * Display all tracking and verification scripts.
     */
    public function index(): Response
    {
        $scripts = TrackingScript::orderBy('sort_order')->orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/TrackingScripts/Index', [
            'scripts' => $scripts,
        ]);
    }

    /**
     * Store a new tracking/verification script.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', 'in:tag_manager,analytics,pixel,verification,custom'],
            'placement' => ['required', 'string', 'in:head,body_start,footer'],
            'code' => ['required', 'string'],
            'target_scope' => ['required', 'string', 'in:all,specific'],
            'target_pages' => ['nullable', 'array'],
            'is_active' => ['boolean'],
            'sort_order' => ['integer'],
        ]);

        $validated['created_by'] = $request->user()->id;
        $validated['is_active'] = $request->boolean('is_active', true);

        TrackingScript::create($validated);

        return redirect()->back()->with('success', 'Tracking script added successfully.');
    }

    /**
     * Update an existing tracking script.
     */
    public function update(Request $request, TrackingScript $trackingScript): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', 'in:tag_manager,analytics,pixel,verification,custom'],
            'placement' => ['required', 'string', 'in:head,body_start,footer'],
            'code' => ['required', 'string'],
            'target_scope' => ['required', 'string', 'in:all,specific'],
            'target_pages' => ['nullable', 'array'],
            'is_active' => ['boolean'],
            'sort_order' => ['integer'],
        ]);

        $validated['is_active'] = $request->boolean('is_active', true);

        $trackingScript->update($validated);

        return redirect()->back()->with('success', 'Tracking script updated successfully.');
    }

    /**
     * Toggle active state of a script.
     */
    public function toggle(TrackingScript $trackingScript): RedirectResponse
    {
        $trackingScript->update(['is_active' => ! $trackingScript->is_active]);

        $status = $trackingScript->is_active ? 'enabled' : 'disabled';

        return redirect()->back()->with('success', "Script '{$trackingScript->name}' has been {$status}.");
    }

    /**
     * Remove a tracking script.
     */
    public function destroy(TrackingScript $trackingScript): RedirectResponse
    {
        $trackingScript->delete();

        return redirect()->back()->with('success', 'Tracking script removed successfully.');
    }
}
