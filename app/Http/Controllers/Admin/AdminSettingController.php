<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminSettingController extends Controller
{
    /**
     * Display studio settings.
     */
    public function index(): Response
    {
        $settings = Setting::all();

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings,
        ]);
    }

    /**
     * Update studio settings.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'settings' => ['required', 'array'],
        ]);

        foreach ($validated['settings'] as $key => $value) {
            Setting::updateOrCreate(
                ['key' => (string) $key],
                ['value' => is_array($value) ? json_encode($value) : $value]
            );
        }

        return redirect()->back()->with('success', 'Studio configuration persisted.');
    }
}
