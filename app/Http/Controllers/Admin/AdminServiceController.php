<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminServiceController extends Controller
{
    /**
     * Display a listing of services.
     */
    public function index(): Response
    {
        $services = Service::orderBy('sort_order', 'asc')->get();

        return Inertia::render('Admin/Services/Index', [
            'services' => $services,
        ]);
    }

    /**
     * Store a newly created service.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'marquee_label' => ['required', 'string', 'max:255'],
            'subtitle' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'icon' => ['required', 'string', 'max:50'],
            'accent_color' => ['nullable', 'string', 'max:20'],
            'sort_order' => ['integer'],
        ]);

        $validated['slug'] = Str::slug($validated['title']).'-'.Str::random(3);

        Service::create($validated);

        return redirect()->back()->with('success', 'Discipline commissioned successfully.');
    }

    /**
     * Update the specified service.
     */
    public function update(Request $request, Service $service): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'marquee_label' => ['required', 'string', 'max:255'],
            'subtitle' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'icon' => ['required', 'string', 'max:50'],
            'accent_color' => ['nullable', 'string', 'max:20'],
            'sort_order' => ['integer'],
        ]);

        $service->update($validated);

        return redirect()->back()->with('success', "Discipline [{$service->title}] updated successfully.");
    }

    /**
     * Remove the specified service.
     */
    public function destroy(Service $service): RedirectResponse
    {
        $title = $service->title;
        $service->delete();

        return redirect()->back()->with('success', "Discipline [{$title}] removed successfully.");
    }
}
