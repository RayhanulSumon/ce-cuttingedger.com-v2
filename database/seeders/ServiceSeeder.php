<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = [
            [
                'title' => 'Background Removal & Multipath Cutout',
                'slug' => 'background-removal',
                'marquee_label' => 'HAND-DRAWN CLIPPING PATH · ALPHA MASKING · MULTIPATH · ZERO FRINGE',
                'subtitle' => 'Pixel-perfect vector cutouts and alpha isolation for high-volume enterprise e-commerce.',
                'description' => 'We reject automated jagged edge erasers. Every silhouette is crafted using 100% hand-drawn Adobe Photoshop Pen Tool vector clipping paths and advanced alpha channel masking, ensuring razor-sharp edges without color halos or degraded anti-aliasing.',
                'features' => ['100% Hand-Drawn Pen Tool Paths', 'Zero Halation or Background Color Bleed', 'Layered PSD / Transparent PNG / Pure White JPG', 'Sub-12 Hour Rapid Batch Turnaround'],
                'deliverables' => ['Layered Master PSD Files', 'Transparent PNG Web Assets', 'Clipping Path Embedded TIFF/EPS', 'Standardized Suffix Batch Naming'],
                'icon' => 'Scissors',
                'sort_order' => 1,
                'accent_color' => '#d4ff00',
            ],
            [
                'title' => 'Ghost Mannequin & Invisible Neck Joint',
                'slug' => 'ghost-mannequin',
                'marquee_label' => 'INVISIBLE MANNEQUIN · 3D APPAREL VOLUME · HOLLOW MAN · SYMMETRIC DRAPE',
                'subtitle' => 'Transforming flat studio garment shots into photorealistic 3D hollow body silhouettes.',
                'description' => 'Give your garments natural dimension without the expense of live model casting. We composite front shots, interior collar/neck linings, and sleeve bottoms into a seamless 3D hollow appearance with wrinkle smoothing and balanced drape.',
                'features' => ['Natural Fabric Drape & Joint Alignment', 'Wrinkle & Crease Micro-Smoothing', 'Symmetrical Hem & Collar Balancing', 'High-Res Fabric Texture Preservation'],
                'deliverables' => ['High-Res Web Compressed JPGs', 'Layered Master PSDs with Joint Paths', 'Amazon & Shopify Spec Compliance', 'Custom Cast & Natural Shadow Layers'],
                'icon' => 'Shirt',
                'sort_order' => 2,
                'accent_color' => '#00f5ff',
            ],
            [
                'title' => 'High-End Fashion & Model Retouching',
                'slug' => 'high-end-model-retouch',
                'marquee_label' => 'FREQUENCY SEPARATION · SKIN PORE INTEGRITY · DODGE & BURN · HAIR CLEANUP',
                'subtitle' => 'Editorial-grade skin, hair, and garment refinement that respects authentic human texture.',
                'description' => 'We banish plastic artificial blur. Using advanced frequency separation, micro dodge and burn, and flyaway hair reconstruction, we deliver pristine editorial portraits and e-commerce model imagery that commands premium pricing.',
                'features' => ['Micro Dodge & Burn Technique', 'Advanced Frequency Separation', 'Flyaway Hair Removal & Reconstruction', 'Garment Crease & Shape Refinement'],
                'deliverables' => ['High-Bitrate Retouched Master PSDs', 'Lookbook & Editorial Color Grading', 'Skin-Tone Harmonization', 'Print & Billboard Resolution Assets'],
                'icon' => 'Sparkles',
                'sort_order' => 3,
                'accent_color' => '#ff3e8a',
            ],
            [
                'title' => 'Jewelry & Luxury Accessories Retouching',
                'slug' => 'jewelry-retouch',
                'marquee_label' => 'GEMSTONE BRILLIANCE · METALLIC LUSTER · ZERO SCRATCHES · FOCUS STACKING',
                'subtitle' => 'Macro-level perfection for precious gemstones, luxury timepieces, and metallic reflection.',
                'description' => 'Jewelry photography is notoriously vulnerable to reflections, dust, and focal softness. We clean micro-imperfections, balance specular highlights on gold and platinum, and emphasize diamond fire and gemstone facet brilliance.',
                'features' => ['Micro-Scratch & Dust Elimination', 'Metal Surface Refinement (Gold/Platinum)', 'Gemstone Facet & Sparkle Enhancement', 'Focus Stacking & Depth-of-Field Sharpening'],
                'deliverables' => ['Pure White 255/255/255 Backgrounds', 'Custom Drop & Reflection Shadow', 'High-DPI Zoom Compatible TIFF', 'E-Commerce Marketplace Ready'],
                'icon' => 'Gem',
                'sort_order' => 4,
                'accent_color' => '#ffd700',
            ],
            [
                'title' => '3D CGI Product Modeling & Rendering',
                'slug' => '3d-modeling-and-rendering',
                'marquee_label' => 'CAD TO 3D MESH · PHOTOREALISTIC LIGHTING · 360° SPINS · AR ASSETS',
                'subtitle' => 'Eliminate costly physical studio logistics with ultra-realistic 3D digital twins.',
                'description' => 'From simple consumer electronics to complex furniture systems, we translate CAD blueprints or multi-angle photos into ultra-realistic 3D meshes with PBR materials, custom studio lighting environments, and interactive 360° spin views.',
                'features' => ['CAD / Blueprint to Low & High-Poly Mesh', 'PBR Material & Procedural Shader Authoring', 'Photorealistic Studio Lighting Rigs', '360° Spin Turntables & AR GLTF/USDZ'],
                'deliverables' => ['Ultra-High 4K/8K Photorealistic Renders', 'Interactive 3D WebGL GLTF Assets', 'Configurable Color & Material Variants', 'Infinite Camera Angles for E-Commerce'],
                'icon' => 'Box',
                'sort_order' => 5,
                'accent_color' => '#ff6b35',
            ],
            [
                'title' => 'Desktop Publishing (DTP) & Multilingual Layout',
                'slug' => 'desktop-publishing',
                'marquee_label' => 'INDESIGN MASTERY · MULTILINGUAL TYPESETTING · CATALOG PACKAGING',
                'subtitle' => 'High-capacity catalog formatting, raster-to-vector conversion, and prepress prep.',
                'description' => 'Need 500 catalog pages formatted across 14 languages overnight? Our desktop publishing studio operates 24/7 in Adobe InDesign and Illustrator, handling complex LTR and RTL typesetting, font substitution, and press-ready CMYK output.',
                'features' => ['Right-to-Left (Arabic/Hebrew) & Asian Scripts', 'InDesign Master Page Template Build', 'Pre-Press CMYK PDF Validation', 'Raster-to-Vector Brand Reconstruction'],
                'deliverables' => ['Print-Ready Press PDFs (PDF/X-1a)', 'Packaged Adobe InDesign INDD Suites', 'Vector AI & SVG Master Assets', 'Digital Interactive PDF Specs'],
                'icon' => 'BookOpen',
                'sort_order' => 6,
                'accent_color' => '#7000ff',
            ],
        ];

        foreach ($services as $service) {
            Service::firstOrCreate(['slug' => $service['slug']], $service);
        }
    }
}
