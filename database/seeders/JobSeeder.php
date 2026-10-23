<?php

namespace Database\Seeders;

use App\Models\Job;
use Illuminate\Database\Seeder;

class JobSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jobs = [
            [
                'title' => 'Senior Retouching Artist (Fashion & Jewelry)',
                'slug' => 'senior-retouching-artist',
                'department' => 'Production',
                'location_type' => 'On-Site / Dhaka Studio',
                'experience_level' => 'Senior',
                'overview' => 'Seeking master Photoshop artists with deep expertise in frequency separation, micro dodge & burn, and fine jewelry reflection balancing.',
                'responsibilities' => [
                    'Execute high-end model skin, garment drape, and diamond/gemstone retouching',
                    'Maintain strict color consistency across multi-thousand SKU batches',
                    'Mentor junior cutout and clipping path technicians',
                ],
                'requirements' => [
                    '4+ years in commercial e-commerce or high-end editorial retouching',
                    'Demonstrated speed and precision with Wacom tablet and Pen Tool',
                    'Flawless eye for color, contrast, and subtle texture preservation',
                ],
                'benefits' => [
                    'Competitive compensation with festival bonuses',
                    'State-of-the-art dual-monitor 4K color-calibrated workstations',
                    'Continuous professional development and skill certification',
                ],
                'is_open' => true,
            ],
            [
                'title' => '3D Hard-Surface & CGI Modeler (Blender / 3ds Max)',
                'slug' => '3d-cgi-modeler',
                'department' => '3D Spatial',
                'location_type' => 'Hybrid',
                'experience_level' => 'Mid-Senior',
                'overview' => 'Translate CAD data and reference photography into photorealistic consumer products and furniture rendering suites.',
                'responsibilities' => [
                    'Model clean quad-topology meshes from blueprints and photographs',
                    'Author realistic PBR materials, procedural textures, and studio lighting rigs',
                    'Optimize low-poly variants for interactive 360° WebGL turntables',
                ],
                'requirements' => [
                    'Proficiency in Blender, 3ds Max, V-Ray/Corona, or Substance Painter',
                    'Portfolio showcasing photo-match lighting and material photorealism',
                    'Understanding of GLTF/USDZ real-time mobile AR constraints',
                ],
                'benefits' => [
                    'Top-tier GPU rendering hardware support',
                    'Flexible hybrid working schedule',
                    'Health and wellness allowances',
                ],
                'is_open' => true,
            ],
        ];

        foreach ($jobs as $job) {
            Job::firstOrCreate(['slug' => $job['slug']], $job);
        }
    }
}
