<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Project;
use Illuminate\Database\Seeder;

class CategoryAndProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Portfolio & Service Categories
        $catCutout = Category::firstOrCreate(['slug' => 'image-editing'], ['name' => '2D Image Editing & Cutout', 'type' => 'work']);
        $catRetouch = Category::firstOrCreate(['slug' => 'fashion-retouching'], ['name' => 'High-End Fashion & Jewelry', 'type' => 'work']);
        $catSpatial = Category::firstOrCreate(['slug' => '3d-cgi-modeling'], ['name' => '3D CGI & Product Modeling', 'type' => 'work']);
        $catDtp = Category::firstOrCreate(['slug' => 'desktop-publishing'], ['name' => 'Desktop Publishing (DTP)', 'type' => 'work']);

        // 2. Featured Real-World Case Studies
        Project::firstOrCreate(
            ['slug' => 'nordic-outerwear-ghost-mannequin'],
            [
                'category_id' => $catRetouch->id,
                'title' => 'Nordic Luxury Outerwear Ghost Mannequin',
                'client_name' => 'Haglöfs Outdoor',
                'year' => '2025',
                'summary' => 'Batch processing 4,800 SKUs of technical waterproof jackets and thermal layers with symmetrical invisible mannequin joints and natural drape.',
                'description' => 'Technical apparel with internal taped seams, storm flaps, and 3D collar construction requires surgical precision. We built an automated workflow balancing inner neck lining insertion with photorealistic fabric texture retention, cutting turnaround time by 65%.',
                'cover_image' => 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1400&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=80',
                ],
                'deliverables' => ['Ghost Mannequin Execution', 'Symmetric Hem & Collar Joint', 'Wrinkle Attenuation', 'Amazon/Shopify Spec Export'],
                'featured' => true,
                'sort_order' => 1,
                'metrics' => [
                    ['label' => 'SKUs Processed', 'value' => '4,800+'],
                    ['label' => 'Turnaround SLA', 'value' => '< 12 Hours'],
                    ['label' => 'Approval Rate', 'value' => '99.8%'],
                ],
                'meta_title' => 'Ghost Mannequin Apparel Case Study — CuttingEdger',
                'meta_description' => 'How CuttingEdger delivered 4,800 high-spec ghost mannequin SKUs for global outerwear brand Haglöfs.',
                'live_url' => 'https://www.haglofs.com/en',
            ]
        );

        Project::firstOrCreate(
            ['slug' => 'diamond-jewelry-macro-retouch'],
            [
                'category_id' => $catRetouch->id,
                'title' => 'Diamond & Fine Jewelry Macro Retouch Series',
                'client_name' => 'Melie Bianco & D1 Milano',
                'year' => '2025',
                'summary' => 'Eliminating micro-scratches, dust, and studio reflections while preserving gemstone facet refraction and platinum luster.',
                'description' => 'High-end jewelry demands extreme macro clarity. Using frequency separation, focus stacking alignment, and hand-sculpted metallic highlights, we transformed raw studio macro captures into breathtaking catalog centerpieces on pure 255 white backgrounds.',
                'cover_image' => 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1400&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=80',
                ],
                'deliverables' => ['Gemstone Facet Sharpening', 'Scratch & Dust Cleansing', 'Custom Drop & Cast Shadows', 'Focus Stacking Integration'],
                'featured' => true,
                'sort_order' => 2,
                'metrics' => [
                    ['label' => 'E-Commerce CTR Lift', 'value' => '+42%'],
                    ['label' => 'Color Grading Accuracy', 'value' => 'Delta-E < 1'],
                    ['label' => 'Catalog Images', 'value' => '1,200 Units'],
                ],
                'meta_title' => 'Fine Jewelry Retouching Case Study — CuttingEdger',
                'meta_description' => 'Macro gemstone clarity and reflection curation by CuttingEdger.',
                'live_url' => 'https://www.meliebianco.com/',
            ]
        );

        Project::firstOrCreate(
            ['slug' => '3d-cgi-furniture-modeling'],
            [
                'category_id' => $catSpatial->id,
                'title' => '3D CGI Furniture Modeling & Architectural Rendering',
                'client_name' => 'Modern Living Studio',
                'year' => '2025',
                'summary' => 'Digitizing 350 physical luxury furniture models into photorealistic 3D digital twins with configurable fabric & wood textures.',
                'description' => 'Physical photoshoots for large furniture lines cost hundreds of thousands in logistics. CuttingEdger converted CAD blueprints into high-fidelity PBR meshes with photorealistic lighting environments and 360-degree interactive WebGL views.',
                'cover_image' => 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1400&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
                ],
                'deliverables' => ['CAD to Low/High Poly Mesh', 'PBR Material Authoring', 'Photorealistic Studio Renders', '360° GLTF Spin Views'],
                'featured' => true,
                'sort_order' => 3,
                'metrics' => [
                    ['label' => 'Photoshoot Cost Saved', 'value' => '78%'],
                    ['label' => 'Asset Render Res', 'value' => '8K Ultra HD'],
                    ['label' => 'Models Rendered', 'value' => '350+ Items'],
                ],
                'meta_title' => '3D Furniture CGI Modeling Case Study — CuttingEdger',
                'meta_description' => 'Photorealistic 3D architectural and furniture rendering by CuttingEdger.',
                'live_url' => 'https://cuttingedger.com',
            ]
        );

        Project::firstOrCreate(
            ['slug' => 'footwear-multipath-colorway'],
            [
                'category_id' => $catCutout->id,
                'title' => 'Global Footwear Multipath & Colorway Isolation',
                'client_name' => 'Bambini Fashion & Drykorn',
                'year' => '2025',
                'summary' => 'Complex multipath clipping on intricate footwear laces, soles, and embroidery for infinite instant colorway variations.',
                'description' => 'Retouching and clipping shoes with perforations, reflective stripes, and mesh requires 100% hand-drawn vector paths. We delivered multi-layered clipping paths allowing our clients to alter upper, sole, and stitch colors without reshooting.',
                'cover_image' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1400&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=80',
                ],
                'deliverables' => ['Multipath Vector Outlines', 'Colorway Masking', 'Reflective Shadow Creation', 'Dust & Glue Elimination'],
                'featured' => true,
                'sort_order' => 4,
                'metrics' => [
                    ['label' => 'Batch Volume', 'value' => '12,000 SKUs'],
                    ['label' => 'Vector Accuracy', 'value' => '100% Hand-Drawn'],
                    ['label' => 'First-Pass Approval', 'value' => '99.4%'],
                ],
                'meta_title' => 'Footwear Multipath & Clipping Path Case Study — CuttingEdger',
                'meta_description' => 'High-precision multipath clipping and colorway isolation by CuttingEdger.',
                'live_url' => 'https://drykorn.com/en-int/',
            ]
        );
    }
}
