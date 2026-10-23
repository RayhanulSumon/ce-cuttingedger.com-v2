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
                'name' => 'On-Demand Batch Production',
                'slug' => 'on-demand-batch',
                'headline' => 'Ideal for seasonal campaigns, ad-hoc SKU drops & agile studios',
                'price' => 'From $0.31',
                'billing_cycle' => 'per image · calculated dynamically',
                'features' => [
                    'Free 3-image trial with zero upfront payment',
                    '100% hand-drawn pen clipping paths & alpha channels',
                    'Transparent batch volume tiers down to $0.31/photo',
                    'Guaranteed 24h standard or 12h rush SLA',
                    'Free unlimited revisions until 100% approved',
                ],
                'is_popular' => false,
                'cta_text' => 'Calculate Batch Rate',
                'sort_order' => 1,
            ],
            [
                'name' => 'Dedicated Retoucher Squad (Pod)',
                'slug' => 'dedicated-squad-retainer',
                'headline' => 'Dedicated artists embedded in daily production for consistent brand aesthetics',
                'price' => 'Custom Retainer',
                'billing_cycle' => 'FTE squad · 2,500+ assets / month',
                'features' => [
                    'Dedicated squad of 3–20 certified Photoshop artists',
                    'Trained specifically on your brand stylebook & PSD actions',
                    'Guaranteed sub-12h overnight delivery turnaround',
                    'Dedicated Senior QA Manager & real-time Slack/Teams channel',
                    'Automated FTP, Dropbox & AWS S3 hotfolder synchronization',
                    'Consolidated monthly Net-30 corporate invoicing',
                ],
                'is_popular' => true,
                'cta_text' => 'Book Discovery Call',
                'sort_order' => 2,
            ],
            [
                'name' => 'Enterprise Headless Pipeline',
                'slug' => 'enterprise-headless-pipeline',
                'headline' => 'Custom API integrations, extreme capacity & bespoke enterprise SLAs',
                'price' => 'Custom Contract',
                'billing_cycle' => 'Enterprise SLA · 10,000+ assets / month',
                'features' => [
                    'Sub-6 hour emergency rush delivery available on demand',
                    'Headless REST API & Webhook automation for e-commerce PIMs',
                    '3D CGI digital twins & 360° interactive product spin models',
                    'Strict mutual NDA & enterprise encrypted TLS asset vault',
                    'Dedicated Technical Account Director & SLA financial credits',
                    'Flexible Net-30/60 enterprise billing agreements',
                ],
                'is_popular' => false,
                'cta_text' => 'Talk To Enterprise Lead',
                'sort_order' => 3,
            ],
        ];

        foreach ($plans as $plan) {
            PricingPlan::updateOrCreate(['slug' => $plan['slug']], $plan);
        }
    }
}
