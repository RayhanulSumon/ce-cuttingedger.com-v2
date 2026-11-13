<?php

namespace Database\Seeders;

use App\Models\DigitalTwin;
use App\Models\DigitalTwinAttribute;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DigitalTwinSeeder extends Seeder
{
    /**
     * Seed the initial Digital Twins and their 7 customizable order attributes.
     */
    public function run(): void
    {
        $defaultPoses = DigitalTwin::defaultPoses();
        $defaultDeliverables = [
            '6 Multi-Angle Pose Presets (8K PNG/TIFF)',
            'Layered PSD + Garment UV Smart Masks',
            'Commercial Global Campaign License',
        ];

        $twins = [
            [
                'look_number' => 15,
                'sprite_x0' => 12,
                'sprite_x1' => 176,
                'name' => 'Aurelia V. — Feather & Satin Twin',
                'archetype' => 'High-Fashion Editorial Twin',
                'collection' => 'Spring Summer 2027 · Look 15',
                'preset_price' => '$149',
                'custom_order_price' => '$290',
                'lifetime_price' => '$490',
                'is_copyright_sold' => false,
                'listed_at' => '2026-06-20',
                'download_count' => 1284,
                'description' => 'Photoreal AI digital twin trained for structured outerwear, feather textures, and fluid satin trousers with 6 pre-lit studio pose rigs.',
                'featured_pieces' => [
                    ['name' => 'Feather Jacket', 'price' => '$2,900', 'box' => [26, 224, 28, 214]],
                    ['name' => 'Satin Wide Leg Trousers', 'price' => '$1,450', 'box' => [304, 412, 22, 236]],
                ],
                'sort_order' => 1,
            ],
            [
                'look_number' => 16,
                'sprite_x0' => 178,
                'sprite_x1' => 330,
                'name' => 'Celeste M. — Pleated Couture Twin',
                'archetype' => 'Runway & Lookbook Twin',
                'collection' => 'Spring Summer 2027 · Look 16',
                'preset_price' => '$149',
                'custom_order_price' => '$290',
                'lifetime_price' => '$490',
                'is_copyright_sold' => true,
                'listed_at' => '2026-03-09',
                'download_count' => 3416,
                'description' => 'Engineered for micro-pleated dresses, metallic waist accents, and soft evening movement across e-commerce and lookbook campaigns.',
                'featured_pieces' => [
                    ['name' => 'Pleated Dress', 'price' => '$2,200', 'box' => [530, 666, 12, 242]],
                    ['name' => 'Gold Waist Belt', 'price' => '$420', 'box' => [752, 922, 100, 146]],
                ],
                'sort_order' => 2,
            ],
            [
                'look_number' => 17,
                'sprite_x0' => 331,
                'sprite_x1' => 470,
                'name' => 'Sora K. — Trench & Leather Twin',
                'archetype' => 'Luxury Tailoring Twin',
                'collection' => 'Spring Summer 2027 · Look 17',
                'preset_price' => '$149',
                'custom_order_price' => '$290',
                'lifetime_price' => '$490',
                'is_copyright_sold' => false,
                'listed_at' => '2026-09-02',
                'download_count' => 542,
                'description' => 'Calibrated for satin trench silhouettes, structured leather accessories, and crisp architectural shadows in full-frame studio lighting.',
                'featured_pieces' => [
                    ['name' => 'Satin Trench Dress', 'price' => '$2,350', 'box' => [70, 176, 246, 466]],
                    ['name' => 'Top Handle Bag', 'price' => '$980', 'box' => [294, 422, 294, 432]],
                ],
                'sort_order' => 3,
            ],
            [
                'look_number' => 18,
                'sprite_x0' => 476,
                'sprite_x1' => 633,
                'name' => 'Elena R. — Silk & Drape Twin',
                'archetype' => 'Soft Silhouette Twin',
                'collection' => 'Spring Summer 2027 · Look 18',
                'preset_price' => '$149',
                'custom_order_price' => '$290',
                'lifetime_price' => '$490',
                'is_copyright_sold' => false,
                'listed_at' => '2026-01-15',
                'download_count' => 2871,
                'description' => 'Designed for billow-sleeve organza, sheer silk blouses, and tie-waist resort trousers with natural skin-to-fabric subsurface scattering.',
                'featured_pieces' => [
                    ['name' => 'Billow Sleeve Blouse', 'price' => '$860', 'box' => [508, 688, 240, 452]],
                    ['name' => 'Tie Waist Trousers', 'price' => '$740', 'box' => [780, 890, 252, 466]],
                ],
                'sort_order' => 4,
            ],
            [
                'look_number' => 19,
                'sprite_x0' => 634,
                'sprite_x1' => 767,
                'name' => 'Noemi L. — Overcoat & Tailored Twin',
                'archetype' => 'Minimalist Runway Twin',
                'collection' => 'Spring Summer 2027 · Look 19',
                'preset_price' => '$149',
                'custom_order_price' => '$290',
                'lifetime_price' => '$490',
                'is_copyright_sold' => true,
                'listed_at' => '2025-11-28',
                'download_count' => 4903,
                'description' => 'Built for longline powder coats, ivory straight-leg tailoring, and clean Scandinavian studio aesthetics with zero reshoot overhead.',
                'featured_pieces' => [
                    ['name' => 'Powder Long Coat', 'price' => '$1,980', 'box' => [64, 178, 484, 698]],
                    ['name' => 'Ivory Straight Trousers', 'price' => '$690', 'box' => [316, 396, 482, 698]],
                ],
                'sort_order' => 5,
            ],
            [
                'look_number' => 20,
                'sprite_x0' => 767,
                'sprite_x1' => 956,
                'name' => 'Valentina D. — Sculpted Ruffle Twin',
                'archetype' => 'Avant-Garde Campaign Twin',
                'collection' => 'Spring Summer 2027 · Look 20',
                'preset_price' => '$149',
                'custom_order_price' => '$290',
                'lifetime_price' => '$490',
                'is_copyright_sold' => false,
                'listed_at' => '2026-10-05',
                'download_count' => 187,
                'description' => 'Optimized for voluminous ruffle tops, pleated maxi skirts, and wide-stance hero campaign framing across web, print, and lookbooks.',
                'featured_pieces' => [
                    ['name' => 'Sculpted Ruffle Top', 'price' => '$1,120', 'box' => [530, 672, 508, 682]],
                    ['name' => 'Pleated Maxi Skirt', 'price' => '$1,340', 'box' => [754, 916, 484, 700]],
                ],
                'sort_order' => 6,
            ],
        ];

        foreach ($twins as $twin) {
            $slug = Str::slug($twin['name']);
            $aspect = round(($twin['sprite_x1'] - $twin['sprite_x0']) / 448, 4);

            DigitalTwin::updateOrCreate(
                ['slug' => $slug],
                array_merge($twin, [
                    'slug' => $slug,
                    'aspect_ratio' => $aspect,
                    'deliverables' => $defaultDeliverables,
                    'poses' => $defaultPoses,
                    'is_featured_on_home' => true,
                    'is_active' => true,
                ])
            );
        }

        // 7 Dynamic Custom Digital Twin Attributes
        $attributes = [
            [
                'name' => 'Height',
                'slug' => 'height',
                'input_type' => 'unit_input',
                'options' => ['ft', 'in'],
                'allow_custom' => false,
                'custom_label' => null,
                'placeholder' => 'Enter height value (e.g. 5\'9" or 69)',
                'is_required' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Body Structure',
                'slug' => 'body_structure',
                'input_type' => 'select',
                'options' => ['Slim', 'Toned', 'Curvy', 'Plus Size'],
                'allow_custom' => true,
                'custom_label' => 'Other',
                'placeholder' => 'Describe custom body structure...',
                'is_required' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Skin Tone',
                'slug' => 'skin_tone',
                'input_type' => 'select',
                'options' => ['Fair', 'Blonde', 'Brown', 'White', 'Dark'],
                'allow_custom' => true,
                'custom_label' => 'Custom',
                'placeholder' => 'Describe custom skin tone or undertone...',
                'is_required' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'Body Measurement',
                'slug' => 'body_measurement',
                'input_type' => 'multi_input',
                'options' => ['Shoulder', 'Chest', 'Hip'],
                'allow_custom' => false,
                'custom_label' => null,
                'placeholder' => 'in / cm',
                'is_required' => false,
                'sort_order' => 4,
            ],
            [
                'name' => 'Forehead',
                'slug' => 'forehead',
                'input_type' => 'select',
                'options' => ['Triangle', 'Round', 'Square', 'Diamond'],
                'allow_custom' => true,
                'custom_label' => 'Custom',
                'placeholder' => 'Describe custom forehead / face shape...',
                'is_required' => false,
                'sort_order' => 5,
            ],
            [
                'name' => 'Eye Shapes',
                'slug' => 'eye_shapes',
                'input_type' => 'select',
                'options' => ['Round', 'Almond', 'Upturned', 'Hooded'],
                'allow_custom' => true,
                'custom_label' => 'Custom',
                'placeholder' => 'Describe custom eye shape or color...',
                'is_required' => false,
                'sort_order' => 6,
            ],
            [
                'name' => 'Lip',
                'slug' => 'lip',
                'input_type' => 'select',
                'options' => ['Wide', 'Thin', 'Round', 'Full'],
                'allow_custom' => true,
                'custom_label' => 'Custom',
                'placeholder' => 'Describe custom lip shape...',
                'is_required' => false,
                'sort_order' => 7,
            ],
        ];

        foreach ($attributes as $attr) {
            DigitalTwinAttribute::updateOrCreate(
                ['slug' => $attr['slug']],
                array_merge($attr, ['is_active' => true])
            );
        }
    }
}
