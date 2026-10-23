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
        $services = Service::with('parent')->orderBy('sort_order', 'asc')->get();
        $parentServices = Service::whereNull('parent_id')->orderBy('sort_order', 'asc')->get(['id', 'title', 'slug']);

        return Inertia::render('Admin/Services/Index', [
            'services' => $services,
            'parentServices' => $parentServices,
        ]);
    }

    /**
     * Store a newly created service.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'parent_id' => ['nullable', 'exists:services,id'],
            'title' => ['required', 'string', 'max:255'],
            'marquee_label' => ['required', 'string', 'max:255'],
            'subtitle' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'icon' => ['required', 'string', 'max:50'],
            'accent_color' => ['nullable', 'string', 'max:20'],
            'sort_order' => ['integer'],
            'h1_title' => ['nullable', 'string', 'max:255'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
            'canonical_url' => ['nullable', 'string', 'max:500'],
            'is_noindex' => ['boolean'],
            'og_image' => ['nullable', 'string', 'max:500'],
        ]);

        $validated['slug'] = Str::slug($validated['title']).'-'.Str::random(3);
        $validated['parent_id'] = ! empty($validated['parent_id']) ? $validated['parent_id'] : null;
        $validated['is_noindex'] = $request->boolean('is_noindex', false);

        Service::create($validated);

        return redirect()->back()->with('success', 'Discipline commissioned successfully.');
    }

    /**
     * Update the specified service.
     */
    public function update(Request $request, Service $service): RedirectResponse
    {
        $validated = $request->validate([
            'parent_id' => ['nullable', 'exists:services,id'],
            'title' => ['required', 'string', 'max:255'],
            'marquee_label' => ['required', 'string', 'max:255'],
            'subtitle' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'icon' => ['required', 'string', 'max:50'],
            'accent_color' => ['nullable', 'string', 'max:20'],
            'sort_order' => ['integer'],
            'h1_title' => ['nullable', 'string', 'max:255'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
            'canonical_url' => ['nullable', 'string', 'max:500'],
            'is_noindex' => ['boolean'],
            'og_image' => ['nullable', 'string', 'max:500'],
        ]);

        $validated['parent_id'] = ! empty($validated['parent_id']) ? $validated['parent_id'] : null;
        $validated['is_noindex'] = $request->boolean('is_noindex', false);

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
