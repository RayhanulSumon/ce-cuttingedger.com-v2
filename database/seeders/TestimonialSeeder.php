<?php

namespace Database\Seeders;

use App\Models\Testimonial;
use Illuminate\Database\Seeder;

class TestimonialSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $testimonials = [
            [
                'client_name' => 'Markus Weber',
                'client_role' => 'Global Head of E-Commerce Production',
                'client_company' => 'Haglöfs',
                'avatar' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
                'quote' => 'CuttingEdger processes our seasonal catalog of over 4,500 apparel SKUs with zero defect tolerance. Their ghost mannequin neck joints and symmetrical alignment have elevated our online store conversion rates dramatically.',
                'rating' => 5,
                'featured' => true,
            ],
            [
                'client_name' => 'Melissa Bianco',
                'client_role' => 'Creative Director',
                'client_company' => 'Melie Bianco',
                'avatar' => 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
                'quote' => 'Their jewelry and handbag retouching is nothing short of sorcery. They bring out the rich texture of vegan leather and eliminate harsh reflections on metallic hardware with sub-12 hour turnaround.',
                'rating' => 5,
                'featured' => true,
            ],
            [
                'client_name' => 'Stefan Müller',
                'client_role' => 'Director of Digital Assets',
                'client_company' => 'Felgenoutlet',
                'avatar' => 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
                'quote' => 'CuttingEdger handled over 10,000 automobile alloy wheel cutouts and 3D reflections for our German configurator. Flawless hand-drawn clipping paths and incredible communication around the clock.',
                'rating' => 5,
                'featured' => true,
            ],
        ];

        foreach ($testimonials as $testimonial) {
            Testimonial::firstOrCreate(
                ['client_name' => $testimonial['client_name'], 'client_company' => $testimonial['client_company']],
                $testimonial
            );
        }
    }
}
