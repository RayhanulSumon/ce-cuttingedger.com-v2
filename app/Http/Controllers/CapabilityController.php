<?php

namespace App\Http\Controllers;

use App\Models\Capability;
use App\Services\Catalog\CatalogCacheService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CapabilityController extends Controller
{
    /**
     * All main capabilities with their sub-capabilities (SEO & listing fields only).
     */
    public function index(): Response
    {
        $capabilities = Capability::active()->main()
            ->with(['children' => fn ($query) => $query->active()])
            ->orderBy('sort_order')
            ->get()
            ->map(fn (Capability $main) => $main->toPublicArray(includeChildren: true))
            ->values()
            ->all();

        return Inertia::render('Capabilities/Index', [
            'capabilities' => $capabilities,
        ]);
    }

    /**
     * A main capability (/capabilities/2d) or one of its sub-capabilities (/capabilities/2d/ghost-mannequin).
     * Sends only SEO and routing metadata from the backend; visual layout is rendered per capability on the frontend.
     */
    public function show(string $parentSlug, ?string $childSlug = null): Response|RedirectResponse
    {
        if ($childSlug) {
            $parent = Capability::active()->where('slug', $parentSlug)->firstOrFail();
            $capability = Capability::active()->where('slug', $childSlug)->whereNotNull('parent_id')->firstOrFail();

            // A sub-capability opened under an old parent slug redirects to its canonical URL.
            if ($capability->parent_id !== $parent->id) {
                $capability->load('parent');
                abort_unless($capability->parent && $capability->parent->is_active, 404);

                return redirect()->to($capability->path, 301);
            }
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
            ->get()
            ->map(fn (Capability $item) => $item->toPublicArray(includeParent: true))
            ->values()
            ->all();

        return Inertia::render('Capabilities/Show', [
            'capability' => $capability->toPublicArray(includeParent: true, includeChildren: true),
            'related' => $related,
            'tryOnLooks' => $capability->slug === 'virtual-try-on'
                ? CatalogCacheService::getHomeTryOnLooks()
                : [],
            'digitalTwins' => $capability->slug === 'digital-twins'
                ? CatalogCacheService::getAllDigitalTwins()
                : [],
        ]);
    }

    /**
     * Fast JSON API returning SEO-only capability tree.
     */
    public function apiIndex(): JsonResponse
    {
        $capabilities = Capability::active()->main()
            ->with(['children' => fn ($query) => $query->active()])
            ->orderBy('sort_order')
            ->get()
            ->map(fn (Capability $main) => $main->toPublicArray(includeChildren: true))
            ->values()
            ->all();

        return response()->json([
            'data' => $capabilities,
        ]);
    }
}
