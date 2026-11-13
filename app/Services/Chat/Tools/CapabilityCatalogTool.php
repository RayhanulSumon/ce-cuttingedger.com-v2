<?php

namespace App\Services\Chat\Tools;

use App\Models\Capability;

/**
 * Builds the information cards shown in chat for capabilities. Never includes prices.
 */
class CapabilityCatalogTool
{
    /**
     * Card listing every main capability with its sub-capabilities.
     *
     * @return array<string, mixed>
     */
    public function catalog(): array
    {
        $capabilities = Capability::active()->main()
            ->with(['children' => fn ($query) => $query->active()])
            ->orderBy('sort_order')
            ->get();

        return [
            'type' => 'capability_catalog_card',
            'capabilities' => $capabilities->map(fn (Capability $main) => [
                'id' => $main->id,
                'tag' => $main->tag,
                'title' => $main->title,
                'subtitle' => $main->subtitle,
                'path' => $main->path,
                'children' => $main->children->map(fn (Capability $child) => [
                    'title' => $child->title,
                    'path' => $child->path,
                ])->values()->all(),
            ])->values()->all(),
        ];
    }

    /**
     * Card with the details of one capability or sub-capability.
     *
     * @return array<string, mixed>
     */
    public function detail(Capability $capability): array
    {
        $capability->loadMissing(['parent', 'children' => fn ($query) => $query->active()]);

        return [
            'type' => 'capability_detail_card',
            'id' => $capability->id,
            'tag' => $capability->tag ?? $capability->parent?->tag,
            'title' => $capability->title,
            'subtitle' => $capability->subtitle,
            'path' => $capability->path,
            'features' => array_slice((array) $capability->features, 0, 4),
            'deliverables' => array_slice((array) $capability->deliverables, 0, 4),
            'children' => $capability->children->map(fn (Capability $child) => [
                'title' => $child->title,
                'path' => $child->path,
            ])->values()->all(),
        ];
    }
}
