<?php

namespace App\Http\Controllers;

use App\Models\Capability;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CapabilityController extends Controller
{
    /**
     * All main capabilities with their sub-capabilities.
     */
    public function index(): Response
    {
        $capabilities = Capability::active()->main()
            ->with(['children' => fn ($query) => $query->active()])
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('Capabilities/Index', [
            'capabilities' => $capabilities,
        ]);
    }

    /**
     * A main capability (/capabilities/2d) or one of its sub-capabilities (/capabilities/2d/ghost-mannequin).
     */
    public function show(string $parentSlug, ?string $childSlug = null): Response|RedirectResponse
    {
        if ($childSlug) {
            $parent = Capability::active()->where('slug', $parentSlug)->firstOrFail();
            $capability = Capability::active()->where('slug', $childSlug)->where('parent_id', $parent->id)->firstOrFail();
        } else {
            $capability = Capability::active()->where('slug', $parentSlug)->firstOrFail();

            // A sub-capability opened without its parent goes to its canonical URL.
            if ($capability->parent_id) {
                return redirect()->to($capability->path, 301);
            }
        }

        $capability->load(['parent', 'children' => fn ($query) => $query->active()]);

        // Siblings for a sub-capability, other main capabilities for a main one.
        $related = Capability::active()
            ->where('id', '!=', $capability->id)
            ->where('parent_id', $capability->parent_id)
            ->with('parent')
            ->orderBy('sort_order')
            ->take(4)
            ->get();

        return Inertia::render('Capabilities/Show', [
            'capability' => $capability,
            'related' => $related,
            'relatedProjects' => Project::where('featured', true)->take(2)->get(),
        ]);
    }
}
