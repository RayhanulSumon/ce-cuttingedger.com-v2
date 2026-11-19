<?php

namespace Database\Seeders;

use App\Models\DigitalTwin;
use App\Models\DigitalTwinAttribute;
use App\Services\Catalog\CatalogCacheService;
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

        $spriteSlots = [
            [
                'sprite_x0' => 12,
                'sprite_x1' => 176,
                'featured_pieces' => [
                    ['name' => 'Feather Jacket', 'price' => '$2,900', 'box' => [26, 224, 28, 214]],
                    ['name' => 'Satin Wide Leg Trousers', 'price' => '$1,450', 'box' => [304, 412, 22, 236]],
                ],
            ],
            [
                'sprite_x0' => 178,
                'sprite_x1' => 330,
                'featured_pieces' => [
                    ['name' => 'Pleated Dress', 'price' => '$2,200', 'box' => [530, 666, 12, 242]],
                    ['name' => 'Gold Waist Belt', 'price' => '$420', 'box' => [752, 922, 100, 146]],
                ],
            ],
            [
                'sprite_x0' => 331,
                'sprite_x1' => 470,
                'featured_pieces' => [
                    ['name' => 'Satin Trench Dress', 'price' => '$2,350', 'box' => [70, 176, 246, 466]],
                    ['name' => 'Top Handle Bag', 'price' => '$980', 'box' => [294, 422, 294, 432]],
                ],
            ],
            [
                'sprite_x0' => 476,
                'sprite_x1' => 633,
                'featured_pieces' => [
                    ['name' => 'Billow Sleeve Blouse', 'price' => '$860', 'box' => [508, 688, 240, 452]],
                    ['name' => 'Tie Waist Trousers', 'price' => '$740', 'box' => [780, 890, 252, 466]],
                ],
            ],
            [
                'sprite_x0' => 634,
                'sprite_x1' => 767,
                'featured_pieces' => [
                    ['name' => 'Powder Long Coat', 'price' => '$1,980', 'box' => [64, 178, 484, 698]],
                    ['name' => 'Ivory Straight Trousers', 'price' => '$690', 'box' => [316, 396, 482, 698]],
                ],
            ],
            [
                'sprite_x0' => 767,
                'sprite_x1' => 956,
                'featured_pieces' => [
                    ['name' => 'Sculpted Ruffle Top', 'price' => '$1,120', 'box' => [530, 672, 508, 682]],
                    ['name' => 'Pleated Maxi Skirt', 'price' => '$1,340', 'box' => [754, 916, 484, 700]],
                ],
            ],
        ];

        $twins = [
            // Female (11 models — first 6 featured on Home runway)
            [
                'name' => 'Laura',
                'archetype' => 'Female',
                'is_copyright_sold' => false,
                'listed_at' => '2026-06-20',
                'download_count' => 1284,
                'description' => 'Photoreal AI digital twin trained for structured outerwear, feather textures, and fluid satin trousers with 6 pre-lit studio pose rigs.',
            ],
            [
                'name' => 'Pamela',
                'archetype' => 'Female',
                'is_copyright_sold' => true,
                'listed_at' => '2026-03-09',
                'download_count' => 3416,
                'description' => 'Engineered for micro-pleated dresses, metallic waist accents, and soft evening movement across e-commerce and lookbook campaigns.',
            ],
            [
                'name' => 'Moon',
                'archetype' => 'Female',
                'is_copyright_sold' => false,
                'listed_at' => '2026-09-02',
                'download_count' => 542,
                'description' => 'Calibrated for satin trench silhouettes, structured leather accessories, and crisp architectural shadows in full-frame studio lighting.',
            ],
            [
                'name' => 'Jia',
                'archetype' => 'Female',
                'is_copyright_sold' => false,
                'listed_at' => '2026-01-15',
                'download_count' => 2871,
                'description' => 'Designed for billow-sleeve organza, sheer silk blouses, and tie-waist resort trousers with natural skin-to-fabric subsurface scattering.',
            ],
            [
                'name' => 'Aumo',
                'archetype' => 'Female',
                'is_copyright_sold' => true,
                'listed_at' => '2025-11-28',
                'download_count' => 4903,
                'description' => 'Built for longline powder coats, ivory straight-leg tailoring, and clean Scandinavian studio aesthetics with zero reshoot overhead.',
            ],
            [
                'name' => 'Pauli',
                'archetype' => 'Female',
                'is_copyright_sold' => false,
                'listed_at' => '2026-10-05',
                'download_count' => 187,
                'description' => 'Optimized for voluminous ruffle tops, pleated maxi skirts, and wide-stance hero campaign framing across web, print, and lookbooks.',
            ],
            [
                'name' => 'Mooha',
                'archetype' => 'Female',
                'is_copyright_sold' => false,
                'listed_at' => '2026-07-14',
                'download_count' => 912,
                'description' => 'Versatile studio digital twin tuned for contemporary womenswear, draped knitwear, and high-key editorial lookbooks.',
            ],
            [
                'name' => 'Jolly',
                'archetype' => 'Female',
                'is_copyright_sold' => false,
                'listed_at' => '2026-08-03',
                'download_count' => 745,
                'description' => 'Balanced full-body proportion rig calibrated for resortwear, tailored separates, and crisp color-accurate e-commerce PDP shots.',
            ],
            [
                'name' => 'Lily',
                'archetype' => 'Female',
                'is_copyright_sold' => false,
                'listed_at' => '2026-08-19',
                'download_count' => 1104,
                'description' => 'Soft-lit studio model trained for delicate silk, lace overlays, and multi-angle runway lookbook production.',
            ],
            [
                'name' => 'Roza',
                'archetype' => 'Female',
                'is_copyright_sold' => false,
                'listed_at' => '2026-09-11',
                'download_count' => 628,
                'description' => 'Poised campaign digital twin tailored for structured blazers, luxury leather goods, and refined seasonal lookbooks.',
            ],
            [
                'name' => 'Julia',
                'archetype' => 'Female',
                'is_copyright_sold' => false,
                'listed_at' => '2026-09-25',
                'download_count' => 830,
                'description' => 'Expressive editorial digital twin crafted for evening silhouettes, layered coats, and seamless multi-pose garment fitting.',
            ],
            // Male (12 models)
            [
                'name' => 'John',
                'archetype' => 'Male',
                'is_copyright_sold' => false,
                'listed_at' => '2026-05-18',
                'download_count' => 1420,
                'description' => 'Classic menswear digital twin built for structured suiting, wool overcoats, and razor-sharp tailoring presentations.',
            ],
            [
                'name' => 'Paul',
                'archetype' => 'Male',
                'is_copyright_sold' => false,
                'listed_at' => '2026-06-04',
                'download_count' => 1085,
                'description' => 'Editorial menswear model calibrated for relaxed shirting, linen resort sets, and clean studio e-commerce poses.',
            ],
            [
                'name' => 'Nooh',
                'archetype' => 'Male',
                'is_copyright_sold' => false,
                'listed_at' => '2026-06-29',
                'download_count' => 760,
                'description' => 'Contemporary runway digital twin tuned for layered outerwear, utility cargo silhouettes, and dynamic stride framing.',
            ],
            [
                'name' => 'David',
                'archetype' => 'Male',
                'is_copyright_sold' => false,
                'listed_at' => '2026-07-08',
                'download_count' => 1590,
                'description' => 'Refined athletic menswear rig designed for performance knitwear, denim jackets, and consistent front-to-back SKU renders.',
            ],
            [
                'name' => 'Joseph',
                'archetype' => 'Male',
                'is_copyright_sold' => false,
                'listed_at' => '2026-07-22',
                'download_count' => 695,
                'description' => 'Minimalist campaign twin tailored for monochrome suiting, cashmere sweaters, and high-contrast luxury lookbooks.',
            ],
            [
                'name' => 'Issac',
                'archetype' => 'Male',
                'is_copyright_sold' => false,
                'listed_at' => '2026-08-10',
                'download_count' => 840,
                'description' => 'Precision studio twin optimized for tailored trousers, leather trench silhouettes, and macro collar detail views.',
            ],
            [
                'name' => 'Luke',
                'archetype' => 'Male',
                'is_copyright_sold' => false,
                'listed_at' => '2026-08-24',
                'download_count' => 512,
                'description' => 'Modern streetwear and outerwear twin engineered for puffer jackets, hoodies, and crisp 3/4 editorial stances.',
            ],
            [
                'name' => 'Elijah',
                'archetype' => 'Male',
                'is_copyright_sold' => false,
                'listed_at' => '2026-09-05',
                'download_count' => 930,
                'description' => 'Sculptural menswear digital twin ready for avant-garde layering, longline coats, and global campaign assets.',
            ],
            [
                'name' => 'Andrew',
                'archetype' => 'Male',
                'is_copyright_sold' => false,
                'listed_at' => '2026-09-17',
                'download_count' => 418,
                'description' => 'Studio-calibrated twin built for crisp dress shirts, lightweight tailoring, and consistent multi-angle catalog shoots.',
            ],
            [
                'name' => 'Top',
                'archetype' => 'Male',
                'is_copyright_sold' => false,
                'listed_at' => '2026-09-29',
                'download_count' => 604,
                'description' => 'Sharp runway posture digital twin tailored for contemporary jackets, structured knits, and hero product drops.',
            ],
            [
                'name' => 'Asher',
                'archetype' => 'Male',
                'is_copyright_sold' => false,
                'listed_at' => '2026-10-08',
                'download_count' => 375,
                'description' => 'Effortless editorial model trained for relaxed tailoring, tonal separates, and natural drape across 6 studio poses.',
            ],
            [
                'name' => 'Sam',
                'archetype' => 'Male',
                'is_copyright_sold' => false,
                'listed_at' => '2026-10-14',
                'download_count' => 289,
                'description' => 'Clean e-commerce menswear twin engineered for everyday essentials, overshirts, and rapid seasonal catalog scaling.',
            ],
            // Upcoming (1 model)
            [
                'name' => 'Upcoming Model',
                'archetype' => 'Upcoming',
                'preset_price' => 'Upcoming',
                'is_copyright_sold' => false,
                'listed_at' => '2026-11-19',
                'download_count' => 0,
                'description' => 'Next-generation digital twin currently in final studio lighting calibration and multi-angle pose verification.',
            ],
        ];

        $seededSlugs = [];

        foreach ($twins as $idx => $twin) {
            $slot = $spriteSlots[$idx % count($spriteSlots)];
            $lookNumber = 15 + $idx;
            $slug = Str::slug($twin['name']);
            $seededSlugs[] = $slug;
            $aspect = round(($slot['sprite_x1'] - $slot['sprite_x0']) / 448, 4);
            $isUpcoming = $twin['archetype'] === 'Upcoming';

            DigitalTwin::updateOrCreate(
                ['slug' => $slug],
                array_merge($twin, [
                    'slug' => $slug,
                    'look_number' => $lookNumber,
                    'sprite_x0' => $slot['sprite_x0'],
                    'sprite_x1' => $slot['sprite_x1'],
                    'collection' => $isUpcoming ? 'Upcoming Drop · Preview' : "Spring Summer 2027 · Look {$lookNumber}",
                    'preset_price' => $twin['preset_price'] ?? '$149',
                    'custom_order_price' => '$290',
                    'lifetime_price' => '$490',
                    'aspect_ratio' => $aspect,
                    'deliverables' => $defaultDeliverables,
                    'featured_pieces' => $slot['featured_pieces'],
                    'poses' => $defaultPoses,
                    'is_featured_on_home' => $idx < 6,
                    'is_active' => true,
                    'sort_order' => $idx + 1,
                ])
            );
        }

        DigitalTwin::whereNotIn('slug', $seededSlugs)->delete();
        CatalogCacheService::flushAll();

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
