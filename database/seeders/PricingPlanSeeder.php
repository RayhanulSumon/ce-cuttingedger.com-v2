<?php

namespace Database\Seeders;

use App\Models\PricingPlan;
use Illuminate\Database\Seeder;

class PricingPlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $slugs = ['starter-credit-pack', 'studio-credit-pack', 'scale-credit-pack'];
        PricingPlan::whereNotIn('slug', $slugs)->delete();

        $plans = [
            [
                'name' => 'Starter Credit Pack',
                'slug' => 'starter-credit-pack',
                'badge' => 'Starter Pack',
                'headline' => 'Ideal for boutique shoots, product launches, and testing studio workflows.',
                'base_credits' => 500,
                'bonus_credits' => 0,
                'price_amount' => 250.00,
                'validity_days' => 90,
                'price' => '$250',
                'billing_cycle' => '$0.50 / credit',
                'features' => [
                    'Valid for 90 days from activation',
                    'Use across 2D, 3D, DTP & Try-On',
                    'Unlimited revisions with 2-step QA',
                ],
                'is_popular' => false,
                'cta_text' => 'Buy Starter Plan',
                'sort_order' => 1,
            ],
            [
                'name' => 'Studio Credit Pack',
                'slug' => 'studio-credit-pack',
                'badge' => 'Most Popular',
                'headline' => 'Built for growing fashion and e-commerce brands with recurring catalog drops.',
                'base_credits' => 2000,
                'bonus_credits' => 300,
                'price_amount' => 900.00,
                'validity_days' => 180,
                'price' => '$900',
                'billing_cycle' => '$0.39 / credit',
                'features' => [
                    '2,000 + 300 bonus = 2,300 credits',
                    'Valid for 180 days from activation',
                    '12–18h priority studio turnaround',
                ],
                'is_popular' => true,
                'cta_text' => 'Buy Studio Plan',
                'sort_order' => 2,
            ],
            [
                'name' => 'Scale Credit Pack',
                'slug' => 'scale-credit-pack',
                'badge' => 'High Volume',
                'headline' => 'Maximum per-credit value for multi-season rollouts and enterprise teams.',
                'base_credits' => 5000,
                'bonus_credits' => 1250,
                'price_amount' => 2000.00,
                'validity_days' => 365,
                'price' => '$2,000',
                'billing_cycle' => '$0.32 / credit',
                'features' => [
                    '5,000 + 1,250 bonus = 6,250 credits',
                    'Valid for 365 days (12 months) from activation',
                    'Sub-6h rush lane & dedicated pod',
                ],
                'is_popular' => false,
                'cta_text' => 'Buy Scale Plan',
                'sort_order' => 3,
            ],
        ];

        foreach ($plans as $plan) {
            PricingPlan::updateOrCreate(['slug' => $plan['slug']], $plan);
        }
    }
}
