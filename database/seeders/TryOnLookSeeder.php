<?php

namespace Database\Seeders;

use App\Models\TryOnLook;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class TryOnLookSeeder extends Seeder
{
    /**
     * Seed the initial 6 Virtual Try-On Looks.
     */
    public function run(): void
    {
        $base = 'https://reel-ref-try-the-look.vercel.app/assets';

        $piece = fn (string $name, string $image, string $brand = 'Nike', ?string $tag = null): array => [
            'name' => $name,
            'brand' => $brand,
            'image' => "{$base}/source-{$image}.webp",
            'tag' => $tag,
        ];

        $looks = [
            [
                'model_name' => 'Jonah K.',
                'name' => 'The City Edit',
                'description' => 'A charcoal knit and easy denim.',
                'runway_image' => "{$base}/model-1-640.webp",
                'hi_res_image' => "{$base}/original-look-1.webp",
                'pieces' => [
                    $piece('Sweatshirt', 'sweatshirt', 'Nike'),
                    $piece('Tshirt', 'tshirt', 'Nike'),
                    $piece('Air Jordan 12 Retro', 'tatum-5-orbit-copy', 'Nikey | Password: 1'),
                ],
                'pins' => [
                    ['left' => 47, 'top' => 27],
                    ['left' => 48, 'top' => 58],
                    ['left' => 45, 'top' => 92],
                ],
                'sort_order' => 1,
            ],
            [
                'model_name' => 'Marcus T.',
                'name' => 'Gallery Opening',
                'description' => 'A clean white tee and relaxed denim.',
                'runway_image' => "{$base}/model-5-640.webp",
                'hi_res_image' => "{$base}/original-look-5.webp",
                'pieces' => [
                    $piece('Hoodie Black', 'hoodie-black', 'Nike', 'New'),
                    $piece('Tshirt', 'tshirt', 'Nike'),
                    $piece('Tatum 5 Orbit', 'tatum-5-orbit', 'Nikey | Password: 1'),
                ],
                'pins' => [
                    ['left' => 50, 'top' => 28],
                    ['left' => 48, 'top' => 58],
                    ['left' => 45, 'top' => 88],
                ],
                'sort_order' => 2,
            ],
            [
                'model_name' => 'Theo R.',
                'name' => 'Olive Grounds',
                'description' => 'Olive knitwear. A grounded palette.',
                'runway_image' => "{$base}/model-4-640.webp",
                'hi_res_image' => "{$base}/original-look-4.webp",
                'pieces' => [
                    $piece('Sweatshirt Plus', 'sweatshirt-plus', 'Nike'),
                    $piece('Tshirt', 'tshirt', 'Nike'),
                    $piece('Tatum 5 Orbit', 'tatum-5-orbit', 'Nikey | Password: 1', 'New'),
                ],
                'pins' => [
                    ['left' => 50, 'top' => 28],
                    ['left' => 48, 'top' => 58],
                    ['left' => 45, 'top' => 88],
                ],
                'sort_order' => 3,
            ],
            [
                'model_name' => 'Kai M.',
                'name' => 'Studio Day',
                'description' => 'Black, white and laid-back denim.',
                'runway_image' => "{$base}/model-6-640.webp",
                'hi_res_image' => "{$base}/original-look-6.webp",
                'pieces' => [
                    $piece('Hoodie Black', 'hoodie-black', 'Nike'),
                    $piece('Tshirt', 'tshirt', 'Nike'),
                    $piece('Air Jordan 12 Retro', 'tatum-5-orbit-copy', 'Nikey | Password: 1'),
                ],
                'pins' => [
                    ['left' => 50, 'top' => 28],
                    ['left' => 48, 'top' => 58],
                    ['left' => 45, 'top' => 88],
                ],
                'sort_order' => 4,
            ],
            [
                'model_name' => 'Rafael D.',
                'name' => 'Burgundy Layers',
                'description' => 'Burgundy layers. A tailored perspective.',
                'runway_image' => "{$base}/model-3-640.webp",
                'hi_res_image' => "{$base}/original-look-3.webp",
                'pieces' => [
                    $piece('Sweatshirt', 'sweatshirt', 'Nike'),
                    $piece('Tshirt', 'tshirt', 'Nike'),
                    $piece('Tatum 5 Orbit', 'tatum-5-orbit', 'Nikey | Password: 1'),
                ],
                'pins' => [
                    ['left' => 50, 'top' => 28],
                    ['left' => 48, 'top' => 58],
                    ['left' => 45, 'top' => 88],
                ],
                'sort_order' => 5,
            ],
            [
                'model_name' => 'Elias V.',
                'name' => 'Everyday Grey',
                'description' => 'A grey crew and your favourite denim.',
                'runway_image' => "{$base}/model-2-640.webp",
                'hi_res_image' => "{$base}/original-look-2.webp",
                'pieces' => [
                    $piece('Hoodie', 'hoodie', 'Nike'),
                    $piece('Tshirt', 'tshirt', 'Nike'),
                    $piece('Luka 5', 'air-jordan-12-retro-copy', 'Nikey | Password: 1'),
                ],
                'pins' => [
                    ['left' => 50, 'top' => 28],
                    ['left' => 48, 'top' => 58],
                    ['left' => 45, 'top' => 88],
                ],
                'sort_order' => 6,
            ],
        ];

        foreach ($looks as $look) {
            $slug = Str::slug($look['name'].'-'.$look['model_name']);

            TryOnLook::updateOrCreate(
                ['slug' => $slug],
                array_merge($look, [
                    'slug' => $slug,
                    'is_featured_on_home' => true,
                    'is_active' => true,
                ])
            );
        }
    }
}
