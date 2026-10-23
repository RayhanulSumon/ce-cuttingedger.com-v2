<?php

namespace Database\Seeders;

use App\Models\Faq;
use Illuminate\Database\Seeder;

class FaqSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faqs = [
            [
                'category' => 'Free Trial',
                'question' => 'How does the Free Trial work?',
                'answer' => 'You can upload up to 3 test images directly through our website with no credit card required. We will process them according to your exact specifications and deliver them back within 12 to 24 hours so you can inspect our quality firsthand.',
                'sort_order' => 1,
            ],
            [
                'category' => 'Quality & Revisions',
                'question' => 'What if I need adjustments or revisions on my delivered images?',
                'answer' => 'We offer 100% free unlimited revisions until you are completely satisfied. Each batch is reviewed by a dedicated Quality Assurance manager before delivery to ensure zero clipping errors or color shifts.',
                'sort_order' => 2,
            ],
            [
                'category' => 'Turnaround & Capacity',
                'question' => 'What is your daily production capacity and turnaround time?',
                'answer' => 'Our 24/7/365 production facility in Dhaka employs over 100+ trained retouching artists, processing over 10,000+ images daily. Standard turnaround is 12 to 24 hours, with rush 4 to 6-hour emergency delivery available for enterprise partners.',
                'sort_order' => 3,
            ],
            [
                'category' => 'Security & Privacy',
                'question' => 'Are my unreleased product photos kept confidential?',
                'answer' => 'Absolutely. We sign binding Non-Disclosure Agreements (NDAs) with all commercial clients. Your images are transmitted over encrypted TLS connections, stored in isolated private containers, and never shared or used in promotional materials without explicit consent.',
                'sort_order' => 4,
            ],
        ];

        foreach ($faqs as $faq) {
            Faq::firstOrCreate(['question' => $faq['question']], $faq);
        }
    }
}
