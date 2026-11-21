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
            'adminNotificationRecipients' => Setting::adminNotificationRecipients(),
        ]);
    }

    /**
     * Update studio settings.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'settings' => ['required', 'array'],
            'settings.*' => ['nullable'],
            'settings.admin_notification_emails' => [
                'sometimes',
                'nullable',
                'string',
                'max:5000',
                function (string $attribute, mixed $value, \Closure $fail): void {
                    $invalid = Setting::invalidEmailsIn($value);

                    if ($invalid !== []) {
                        $fail('Invalid notification email(s): '.implode(', ', $invalid));
                    }
                },
            ],
        ]);

        if (array_key_exists('admin_notification_emails', $validated['settings'])) {
            $validated['settings']['admin_notification_emails'] = implode(
                "\n",
                Setting::parseEmailList($validated['settings']['admin_notification_emails'])
            );
        }

        foreach ($validated['settings'] as $key => $value) {
            Setting::updateOrCreate(
                ['key' => (string) $key],
                ['value' => is_array($value) ? json_encode($value) : $value]
            );
        }

        return redirect()->back()->with('success', 'Studio configuration persisted.');
    }
}
