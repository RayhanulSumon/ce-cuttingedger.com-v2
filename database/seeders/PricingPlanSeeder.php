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
        $plans = [
            [
                'name' => 'Starter Trial & Single Batch',
                'slug' => 'starter-trial',
                'headline' => 'Ideal for sampling quality or small boutique collections',
                'price' => '$0.80',
                'billing_cycle' => 'per image · min. 10 images',
                'features' => [
                    'Free 3-image trial with zero upfront cost',
                    '100% hand-drawn pen tool clipping paths',
                    'Basic color balance & background replacement',
                    'Standard 24-hour turnaround SLA',
                    'Unlimited revisions until 100% satisfied',
                ],
                'is_popular' => false,
                'cta_text' => 'Try 3 Images Free',
                'sort_order' => 1,
            ],
            [
                'name' => 'High-Volume E-Commerce',
                'slug' => 'high-volume-ecommerce',
                'headline' => 'Engineered for fashion brands, Shopify stores & Amazon sellers',
                'price' => '$0.45',
                'billing_cycle' => 'per image · 500+ SKU batches',
                'features' => [
                    'Ghost mannequin & complex multipath cutouts',
                    'Jewelry, accessories & model skin retouching',
                    'Guaranteed 12-hour batch delivery SLA',
                    'Dedicated Senior Quality Assurance Manager',
                    'Custom export specs (JPG, PNG, Layered PSD)',
                    'Automated FTP, Dropbox & Google Drive sync',
                ],
                'is_popular' => true,
                'cta_text' => 'Request Volume Quote',
                'sort_order' => 2,
            ],
            [
                'name' => 'Enterprise Dedicated Studio',
                'slug' => 'enterprise-studio',
                'headline' => 'Dedicated retouchers & 3D artists seamlessly embedded in your workflow',
                'price' => '$0.35',
                'billing_cycle' => 'per image · 2,500+ SKU monthly volume',
                'features' => [
                    'Dedicated squad of 5–25 certified Photoshop artists',
                    'Sub-6 hour rush turnaround available on demand',
                    '3D CGI modeling & 360° interactive product spins',
                    'Direct communication via Slack, Teams, or WhatsApp',
                    'Custom API integration & automated Webhook pipeline',
                    'Strict enterprise NDA & secure cloud asset hosting',
                ],
                'is_popular' => false,
                'cta_text' => 'Talk To Enterprise Lead',
                'sort_order' => 3,
            ],
        ];

        foreach ($plans as $plan) {
            PricingPlan::firstOrCreate(['slug' => $plan['slug']], $plan);
        }
    }
}
