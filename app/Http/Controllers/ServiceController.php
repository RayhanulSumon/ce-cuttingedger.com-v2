<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    /**
     * Display all capabilities & service pillars hub.
     */
    public function index(): Response
    {
        $pillars = Service::whereNull('parent_id')
            ->with('children')
            ->orderBy('sort_order')
            ->get();

        $allServices = Service::orderBy('sort_order')->get();

        return Inertia::render('Services/Index', [
            'pillars' => $pillars,
            'services' => $allServices,
        ]);
    }

    /**
     * Display individual service discipline detail (hierarchical support).
     */
    public function show(string $parentSlug, ?string $childSlug = null): Response|RedirectResponse
    {
        if ($childSlug) {
            $parent = Service::where('slug', $parentSlug)->firstOrFail();
            $service = Service::where('slug', $childSlug)
                ->where('parent_id', $parent->id)
                ->firstOrFail();
        } else {
            $service = Service::where('slug', $parentSlug)->firstOrFail();

            // If this is actually a child accessed without parent prefix, 301 redirect to canonical hierarchy
            if ($service->parent_id && $service->parent) {
                return redirect()->to("/services/{$service->parent->slug}/{$service->slug}", 301);
            }
        }

        $service->load(['parent', 'children']);

        // Related services
        $otherServices = Service::where('id', '!=', $service->id)
            ->whereNull('parent_id')
            ->take(4)
            ->get();

        // Related case studies
        $relatedProjects = Project::where('featured', true)->take(2)->get();

        return Inertia::render('Services/Show', [
            'service' => $service,
            'otherServices' => $otherServices,
            'relatedProjects' => $relatedProjects,
        ]);
    }
}
