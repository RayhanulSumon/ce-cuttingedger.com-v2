<?php

namespace App\Services\Chat\Tools;

use App\Models\Service;

class ServiceCatalogTool
{
    /**
     * Tool schema for exploring services catalog and service details.
     *
     * @return array<string, mixed>
     */
    public static function schema(): array
    {
        return [
            'type' => 'function',
            'function' => [
                'name' => 'explore_services_catalog',
                'description' => 'Explore CuttingEdger studio retouching services, technical specifications, deliverables, turnaround SLAs, and starting rates.',
                'parameters' => [
                    'type' => 'object',
                    'properties' => [
                        'service_slug' => [
                            'type' => 'string',
                            'description' => 'Optional slug to inspect a specific service (e.g. "background-removal", "ghost-mannequin", "high-end-model-retouch", "jewelry-retouch", "3d-modeling", "dtp-publishing").',
                        ],
                        'action' => [
                            'type' => 'string',
                            'description' => '"list" to see all studio services, or "detail" for full specs of a specific service.',
                            'enum' => ['list', 'detail'],
                        ],
                    ],
                ],
            ],
        ];
    }

    /**
     * Execute catalog query or fetch individual service specs.
     *
     * @param  array<string, mixed>  $params
     * @return array<string, mixed>
     */
    public function execute(array $params = []): array
    {
        $slug = trim((string) ($params['service_slug'] ?? ''));
        $action = trim((string) ($params['action'] ?? ($slug ? 'detail' : 'list')));

        // If specific service detail is requested
        if ($slug || $action === 'detail') {
            $service = Service::where('slug', $slug)
                ->orWhere('slug', 'like', "%{$slug}%")
                ->orWhere('title', 'like', "%{$slug}%")
                ->first();

            if ($service) {
                return $this->formatServiceDetail($service);
            }
        }

        // Return full service catalog
        $services = Service::orderBy('sort_order', 'asc')->get();

        // Baseline rate map
        $rateMap = [
            'background-removal' => '$0.49 / image',
            'ghost-mannequin' => '$0.95 / image',
            'high-end-model-retouch' => '$2.50 / image',
            'jewelry-retouch' => '$3.90 / image',
            '3d-modeling' => 'Custom Quote / SKU',
            'dtp-publishing' => '$15 / page layout',
        ];

        $slaMap = [
            'background-removal' => '4 - 12 Hours',
            'ghost-mannequin' => '6 - 24 Hours',
            'high-end-model-retouch' => '12 - 24 Hours',
            'jewelry-retouch' => '12 - 36 Hours',
            '3d-modeling' => '24 - 48 Hours',
            'dtp-publishing' => '12 - 24 Hours',
        ];

        return [
            'type' => 'service_catalog_card',
            'title' => 'CuttingEdger Studio Services & Production Lines',
            'subtitle' => 'High-volume e-commerce and editorial retouching powered by senior production artisans.',
            'services' => $services->map(fn ($s) => [
                'id' => $s->id,
                'slug' => $s->slug,
                'title' => $s->title,
                'subtitle' => $s->subtitle,
                'icon' => $s->icon ?? 'Layers',
                'accent_color' => $s->accent_color ?? '#d4ff00',
                'starting_rate' => $rateMap[$s->slug] ?? '$0.49 / image',
                'turnaround' => $slaMap[$s->slug] ?? '4 - 24 Hours',
                'features' => array_slice((array) ($s->features ?? []), 0, 3),
                'deliverables' => array_slice((array) ($s->deliverables ?? []), 0, 3),
            ])->values()->all(),
            'trial_banner' => 'Every new studio partner qualifies for 3 complimentary trial images with zero credit card required.',
        ];
    }

    /**
     * Format a single service with exhaustive technical specs.
     *
     * @return array<string, mixed>
     */
    protected function formatServiceDetail(Service $service): array
    {
        $rateMap = [
            'background-removal' => '$0.49 / image',
            'ghost-mannequin' => '$0.95 / image',
            'high-end-model-retouch' => '$2.50 / image',
            'jewelry-retouch' => '$3.90 / image',
            '3d-modeling' => 'Custom Quote / SKU',
            'dtp-publishing' => '$15 / page layout',
        ];

        $slaMap = [
            'background-removal' => '4 - 12 Hours SLA',
            'ghost-mannequin' => '6 - 24 Hours SLA',
            'high-end-model-retouch' => '12 - 24 Hours SLA',
            'jewelry-retouch' => '12 - 36 Hours SLA',
            '3d-modeling' => '24 - 48 Hours SLA',
            'dtp-publishing' => '12 - 24 Hours SLA',
        ];

        return [
            'type' => 'service_detail_card',
            'id' => $service->id,
            'slug' => $service->slug,
            'title' => $service->title,
            'subtitle' => $service->subtitle,
            'description' => $service->description,
            'icon' => $service->icon ?? 'Layers',
            'accent_color' => $service->accent_color ?? '#00f5ff',
            'starting_rate' => $rateMap[$service->slug] ?? '$0.49 / image',
            'turnaround' => $slaMap[$service->slug] ?? 'Sub-24 Hours',
            'features' => (array) ($service->features ?? []),
            'deliverables' => (array) ($service->deliverables ?? []),
            'sample_formats' => ['Layered Master PSD', 'Transparent Alpha PNG', 'E-commerce JPG (Amazon/Shopify Spec)', 'Embedded TIFF'],
        ];
    }
}
