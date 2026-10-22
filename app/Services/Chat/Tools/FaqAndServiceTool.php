<?php

namespace App\Services\Chat\Tools;

use App\Models\Faq;
use App\Models\PricingPlan;
use App\Models\Service;

class FaqAndServiceTool
{
    /**
     * Tool schema for services and FAQ search.
     *
     * @return array<string, mixed>
     */
    public static function schema(): array
    {
        return [
            'type' => 'function',
            'function' => [
                'name' => 'search_services_and_faqs',
                'description' => 'Search services, capabilities, deliverables, turnaround times, file formats, and FAQs about CuttingEdger.',
                'parameters' => [
                    'type' => 'object',
                    'properties' => [
                        'topic' => [
                            'type' => 'string',
                            'description' => 'The topic or question, e.g. "turnaround time", "free trial", "ghost mannequin", "file formats", "revisions"',
                        ],
                    ],
                    'required' => ['topic'],
                ],
            ],
        ];
    }

    /**
     * Search relevant information across services and FAQs.
     *
     * @param  array<string, mixed>  $params
     * @return array<string, mixed>
     */
    public function execute(array $params): array
    {
        $topic = strtolower(trim((string) ($params['topic'] ?? '')));

        // Check FAQs
        $faqs = Faq::where('question', 'like', "%{$topic}%")
            ->orWhere('answer', 'like', "%{$topic}%")
            ->orWhere('category', 'like', "%{$topic}%")
            ->take(2)
            ->get();

        // Check Services
        $services = Service::where('title', 'like', "%{$topic}%")
            ->orWhere('description', 'like', "%{$topic}%")
            ->orWhere('subtitle', 'like', "%{$topic}%")
            ->take(2)
            ->get();

        $pricing = PricingPlan::where('name', 'like', "%{$topic}%")
            ->orWhere('headline', 'like', "%{$topic}%")
            ->take(2)
            ->get();

        return [
            'type' => 'info_card',
            'topic' => $topic,
            'faqs' => $faqs->map(fn ($f) => ['q' => $f->question, 'a' => $f->answer])->values()->all(),
            'services' => $services->map(fn ($s) => [
                'title' => $s->title,
                'slug' => $s->slug,
                'subtitle' => $s->subtitle,
                'features' => array_slice((array) $s->features, 0, 3),
            ])->values()->all(),
            'pricing_plans' => $pricing->map(fn ($p) => [
                'name' => $p->name,
                'price' => $p->price,
                'cycle' => $p->billing_cycle,
            ])->values()->all(),
        ];
    }
}
