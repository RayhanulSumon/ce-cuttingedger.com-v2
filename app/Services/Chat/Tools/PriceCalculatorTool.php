<?php

namespace App\Services\Chat\Tools;

use App\Models\Service;

class PriceCalculatorTool
{
    /**
     * Get tool definition schema for Ollama / LLM function calling.
     *
     * @return array<string, mixed>
     */
    public static function schema(): array
    {
        return [
            'type' => 'function',
            'function' => [
                'name' => 'calculate_image_price',
                'description' => 'Calculate estimated pricing for photo editing, retouching, ghost mannequin, or 3D services based on service category, complexity, and quantity.',
                'parameters' => [
                    'type' => 'object',
                    'properties' => [
                        'service' => [
                            'type' => 'string',
                            'description' => 'Service name, e.g. background-removal, ghost-mannequin, high-end-model-retouch, jewelry-retouch, 3d-modeling, desktop-publishing',
                        ],
                        'complexity' => [
                            'type' => 'string',
                            'enum' => ['simple', 'medium', 'complex', 'super_complex'],
                            'description' => 'Visual complexity of the images or 3D assets',
                        ],
                        'quantity' => [
                            'type' => 'integer',
                            'description' => 'Number of images or items (default: 1)',
                        ],
                        'turnaround' => [
                            'type' => 'string',
                            'enum' => ['standard_24h', 'rush_12h', 'rush_6h'],
                            'description' => 'Turnaround SLA time requested',
                        ],
                    ],
                    'required' => ['service', 'complexity'],
                ],
            ],
        ];
    }

    /**
     * Execute price calculation.
     *
     * @param  array<string, mixed>  $params
     * @return array<string, mixed>
     */
    public function execute(array $params): array
    {
        $serviceSlug = strtolower(trim((string) ($params['service'] ?? 'background-removal')));
        $complexity = strtolower(trim((string) ($params['complexity'] ?? 'simple')));
        $quantity = max(1, (int) ($params['quantity'] ?? 1));
        $turnaround = strtolower((string) ($params['turnaround'] ?? 'standard_24h'));

        // Base rate mapping (USD per image)
        $baseRates = [
            'background-removal' => ['simple' => 0.45, 'medium' => 0.85, 'complex' => 1.75, 'super_complex' => 3.20],
            'ghost-mannequin' => ['simple' => 0.95, 'medium' => 1.45, 'complex' => 2.40, 'super_complex' => 3.80],
            'high-end-model-retouch' => ['simple' => 1.80, 'medium' => 3.20, 'complex' => 5.50, 'super_complex' => 9.50],
            'jewelry-retouch' => ['simple' => 1.95, 'medium' => 3.60, 'complex' => 6.20, 'super_complex' => 11.00],
            '3d-modeling' => ['simple' => 25.00, 'medium' => 55.00, 'complex' => 110.00, 'super_complex' => 220.00],
            'desktop-publishing' => ['simple' => 2.50, 'medium' => 5.00, 'complex' => 9.50, 'super_complex' => 18.00],
        ];

        // Match fuzzy service name to key
        $resolvedService = 'background-removal';
        foreach (array_keys($baseRates) as $key) {
            if (str_contains($serviceSlug, str_replace('-', ' ', $key)) || str_contains($serviceSlug, $key)) {
                $resolvedService = $key;
                break;
            }
        }
        if (str_contains($serviceSlug, 'clipping') || str_contains($serviceSlug, 'cutout') || str_contains($serviceSlug, 'path')) {
            $resolvedService = 'background-removal';
        } elseif (str_contains($serviceSlug, 'neck') || str_contains($serviceSlug, 'mannequin') || str_contains($serviceSlug, 'hollow')) {
            $resolvedService = 'ghost-mannequin';
        } elseif (str_contains($serviceSlug, 'model') || str_contains($serviceSlug, 'skin') || str_contains($serviceSlug, 'beauty')) {
            $resolvedService = 'high-end-model-retouch';
        } elseif (str_contains($serviceSlug, 'jewelry') || str_contains($serviceSlug, 'diamond') || str_contains($serviceSlug, 'watch')) {
            $resolvedService = 'jewelry-retouch';
        } elseif (str_contains($serviceSlug, '3d') || str_contains($serviceSlug, 'cgi') || str_contains($serviceSlug, 'render')) {
            $resolvedService = '3d-modeling';
        }

        $rateTable = $baseRates[$resolvedService] ?? $baseRates['background-removal'];
        $unitPrice = $rateTable[$complexity] ?? $rateTable['simple'];

        // Volume discount
        $discountPercent = 0;
        if ($quantity >= 500) {
            $discountPercent = 35;
        } elseif ($quantity >= 100) {
            $discountPercent = 20;
        } elseif ($quantity >= 25) {
            $discountPercent = 10;
        }

        $discountedUnitPrice = $unitPrice * (1 - ($discountPercent / 100));

        // Rush fee multiplier
        $turnaroundMultiplier = match ($turnaround) {
            'rush_6h' => 1.50,
            'rush_12h' => 1.25,
            default => 1.00,
        };

        $finalUnitPrice = round($discountedUnitPrice * $turnaroundMultiplier, 2);
        $totalEstimated = round($finalUnitPrice * $quantity, 2);

        // Find matching live service title from DB
        $serviceRecord = Service::where('slug', 'like', "%{$resolvedService}%")->first();
        $serviceTitle = $serviceRecord ? $serviceRecord->title : ucwords(str_replace('-', ' ', $resolvedService));

        $isEligibleForFreeTrial = ($quantity <= 3);

        return [
            'type' => 'quote_card',
            'service_name' => $serviceTitle,
            'service_slug' => $resolvedService,
            'complexity' => ucfirst(str_replace('_', ' ', $complexity)),
            'quantity' => $quantity,
            'unit_price' => number_format($finalUnitPrice, 2),
            'regular_total' => $isEligibleForFreeTrial ? number_format($totalEstimated, 2) : null,
            'total_price' => $isEligibleForFreeTrial ? '0.00' : number_format($totalEstimated, 2),
            'currency' => 'USD',
            'turnaround' => match ($turnaround) {
                'rush_6h' => 'Express 6 Hours SLA',
                'rush_12h' => 'Rush 12 Hours SLA',
                default => 'Standard 24 Hours SLA',
            },
            'discount_applied' => $isEligibleForFreeTrial
                ? '100% Free Trial ($0.00 Zero Cost)'
                : ($discountPercent > 0 ? "{$discountPercent}% Volume Discount" : null),
            'free_trial_eligible' => $isEligibleForFreeTrial,
            'call_to_action' => $isEligibleForFreeTrial
                ? 'Claim 3 Free Sample Edits ($0.00 Zero Cost)'
                : 'Confirm Quote & Upload Batch',
        ];
    }
}
