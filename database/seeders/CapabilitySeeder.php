<?php

namespace Database\Seeders;

use App\Models\Capability;
use Illuminate\Database\Seeder;

/**
 * The four main capabilities (2D, 3D, DTP, Video) and their sub-capabilities.
 * Only SEO and listing fields are stored in the database; each page uses a custom visual layout.
 */
class CapabilitySeeder extends Seeder
{
    public function run(): void
    {
        foreach ($this->capabilities() as $order => $main) {
            $children = $main['children'];
            unset($main['children']);

            $parent = Capability::updateOrCreate(
                ['slug' => $main['slug']],
                $main + ['parent_id' => null, 'is_active' => true, 'sort_order' => $order + 1]
            );

            foreach ($children as $childOrder => $child) {
                Capability::updateOrCreate(
                    ['slug' => $child['slug']],
                    $child + [
                        'parent_id' => $parent->id,
                        'tag' => null,
                        'is_active' => true,
                        'sort_order' => $childOrder + 1,
                    ]
                );
            }
        }
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function capabilities(): array
    {
        return [
            [
                'slug' => '2d',
                'tag' => '2D',
                'title' => '2D Retouching & Post-Production',
                'subtitle' => 'Clean, consistent product and model images, edited by hand and checked twice.',
                'icon' => 'Layers',
                'meta_title' => '2D Image Retouching & Post-Production | CuttingEdger',
                'meta_description' => 'Clipping paths, masking, ghost mannequin, digital twins, virtual try-on, fashion and jewelry retouching and colour correction for e-commerce brands.',
                'children' => [
                    [
                        'slug' => 'background-removal',
                        'title' => 'Background Removal & Clipping Path',
                        'subtitle' => 'Precise cutouts with clean, natural edges.',
                        'icon' => 'Scissors',
                        'meta_title' => 'Photo Background Removal & Clipping Path Services | CuttingEdger',
                        'meta_description' => '100% hand-drawn clipping paths and background removal for e-commerce product photography with pure white or transparent backgrounds in 24 hours.',
                    ],
                    [
                        'slug' => 'image-masking',
                        'title' => 'Image Masking',
                        'subtitle' => 'Soft edges such as hair, fur and sheer fabric.',
                        'icon' => 'Wand2',
                        'meta_title' => 'Alpha Channel Image Masking Services | CuttingEdger',
                        'meta_description' => 'Precision hair, fur, knitwear and translucent fabric image masking with clean edge decontamination for fashion and e-commerce.',
                    ],
                    [
                        'slug' => 'ghost-mannequin',
                        'title' => 'Ghost Mannequin',
                        'subtitle' => 'Invisible-mannequin garment images with natural shape.',
                        'icon' => 'Shirt',
                        'meta_title' => 'Invisible Ghost Mannequin Photo Editing Services | CuttingEdger',
                        'meta_description' => '3D hollow-mannequin neck joint reconstruction, symmetry alignment and wrinkle cleanup for fashion and apparel catalogs.',
                    ],
                    [
                        'slug' => 'virtual-try-on',
                        'title' => 'Virtual Try-On',
                        'subtitle' => 'Show your garments on styled models without a shoot.',
                        'icon' => 'Shirt',
                        'meta_title' => 'AI Virtual Try-On Studio for Fashion Brands | CuttingEdger',
                        'meta_description' => 'Fit and drape your garments onto styled studio models or your own talent with realistic fabric physics and accurate colour.',
                    ],
                    [
                        'slug' => 'digital-twins',
                        'title' => 'Digital Twins',
                        'subtitle' => 'Photoreal AI models that wear your garments in any pose.',
                        'icon' => 'Users',
                        'meta_title' => 'Photoreal AI Digital Twins & Fashion Models | CuttingEdger',
                        'meta_description' => 'License ready-made 6-pose AI digital twins or commission a custom brand model with exclusive copyright for e-commerce and campaigns.',
                    ],
                    [
                        'slug' => 'fashion-beauty-retouching',
                        'title' => 'Fashion & Beauty Retouching',
                        'subtitle' => 'Natural skin, clean fabric and polished campaign images.',
                        'icon' => 'Sparkles',
                        'meta_title' => 'High-End Fashion & Beauty Photo Retouching | CuttingEdger',
                        'meta_description' => 'Editorial skin texture preservation, garment crease cleanup and consistent lookbook colour grading for fashion and beauty brands.',
                    ],
                    [
                        'slug' => 'jewelry-retouching',
                        'title' => 'Jewelry Retouching',
                        'subtitle' => 'Macro-level clean-up for metal, stones and watches.',
                        'icon' => 'Gem',
                        'meta_title' => 'Fine Jewelry & Watch Photo Retouching Services | CuttingEdger',
                        'meta_description' => 'Macro dust and scratch removal, diamond facet brilliance enhancement and precious metal reflection grading for jewelry e-commerce.',
                    ],
                    [
                        'slug' => 'color-correction',
                        'title' => 'Colour Correction & Standardisation',
                        'subtitle' => 'True-to-product colour, consistent across every image.',
                        'icon' => 'Palette',
                        'meta_title' => 'E-Commerce Colour Correction & SKU Recoloring | CuttingEdger',
                        'meta_description' => 'Swatch-accurate colour matching, multi-angle exposure standardisation and instant colourway generation from a single master photo.',
                    ],
                    [
                        'slug' => 'shadows-reflections',
                        'title' => 'Shadows & Reflections',
                        'subtitle' => 'Natural grounding for products on clean backgrounds.',
                        'icon' => 'Layers',
                        'meta_title' => 'Natural Drop Shadow & Reflection Creation Services | CuttingEdger',
                        'meta_description' => 'Realistic drop shadows, contact cast shadows and mirror floor reflections that ground isolated product photography.',
                    ],
                ],
            ],
            [
                'slug' => '3d',
                'tag' => '3D',
                'title' => '3D Modeling & CGI Rendering',
                'subtitle' => 'Photoreal 3D models, CGI renders and 360° spins without a studio shoot.',
                'icon' => 'Box',
                'meta_title' => '3D Modeling, CGI Rendering & 360° Product Spins | CuttingEdger',
                'meta_description' => 'Photoreal 3D product models, CGI renders and 360° product spins for fashion, furniture and e-commerce brands.',
                'children' => [
                    [
                        'slug' => '3d-modeling',
                        'title' => '3D Product Modeling',
                        'subtitle' => 'Accurate 3D models from designs, CAD or photos.',
                        'icon' => 'Box',
                        'meta_title' => 'Custom 3D Product Modeling & PBR Asset Creation | CuttingEdger',
                        'meta_description' => 'Production-ready 3D meshes and PBR material authoring from CAD blueprints, tech packs or reference photos.',
                    ],
                    [
                        'slug' => 'cgi-rendering',
                        'title' => 'CGI Product Rendering',
                        'subtitle' => 'Studio-quality renders in any colour and setting.',
                        'icon' => 'Camera',
                        'meta_title' => 'Photoreal CGI Product Rendering Studio | CuttingEdger',
                        'meta_description' => '8K ray-traced packshot and lifestyle CGI renders across unlimited colourways and virtual studio environments.',
                    ],
                    [
                        'slug' => '360-product-spin',
                        'title' => '360° Product Spin',
                        'subtitle' => 'Interactive turntables that let shoppers rotate a product.',
                        'icon' => 'RotateCw',
                        'meta_title' => 'Interactive 360° Product Spin & Turntable Viewers | CuttingEdger',
                        'meta_description' => 'Smooth interactive 360-degree product rotation sequences and lightweight web viewers from 3D models or studio photo sets.',
                    ],
                ],
            ],
            [
                'slug' => 'dtp',
                'tag' => 'DTP',
                'title' => 'DTP & Catalog Layout',
                'subtitle' => 'Catalogs, lookbooks and print files, laid out and ready to publish.',
                'icon' => 'LayoutTemplate',
                'meta_title' => 'DTP, Catalog Layout & Prepress | CuttingEdger',
                'meta_description' => 'Catalog and lookbook layout, multilingual typesetting, vector conversion and print-ready files.',
                'children' => [
                    [
                        'slug' => 'catalog-layout',
                        'title' => 'Catalog & Lookbook Layout',
                        'subtitle' => 'Product catalogs and lookbooks with a consistent design.',
                        'icon' => 'BookOpen',
                        'meta_title' => 'Catalog & Fashion Lookbook Layout Design | CuttingEdger',
                        'meta_description' => 'Editorial lookbook spreads and automated data-driven product catalog layouts delivered as editable InDesign and press-ready PDF files.',
                    ],
                    [
                        'slug' => 'multilingual-typesetting',
                        'title' => 'Multilingual Typesetting',
                        'subtitle' => 'Accurate layouts in any language or script.',
                        'icon' => 'Languages',
                        'meta_title' => 'Multilingual DTP & RTL Typesetting Services | CuttingEdger',
                        'meta_description' => 'Global catalog and packaging localization across Latin, CJK and Right-to-Left scripts with native typography verification.',
                    ],
                    [
                        'slug' => 'vector-conversion',
                        'title' => 'Vector Conversion',
                        'subtitle' => 'Logos and artwork redrawn as clean vectors.',
                        'icon' => 'PenTool',
                        'meta_title' => 'Raster to Vector Artwork Conversion Services | CuttingEdger',
                        'meta_description' => 'Hand-redrawn vector logos, technical graphics and apparel screen-print artwork in clean AI, EPS, SVG and PDF formats.',
                    ],
                    [
                        'slug' => 'prepress',
                        'title' => 'Prepress & Print-Ready Files',
                        'subtitle' => 'Files checked and prepared so they print right.',
                        'icon' => 'Printer',
                        'meta_title' => 'Prepress Preflight & Print-Ready File Preparation | CuttingEdger',
                        'meta_description' => 'CMYK and Pantone ink separation, 3mm bleed verification, colour profiling and press-ready PDF/X mastering.',
                    ],
                    [
                        'slug' => 'packaging-artwork',
                        'title' => 'Packaging Artwork',
                        'subtitle' => 'Dielines and artwork adapted for every pack size.',
                        'icon' => 'Package',
                        'meta_title' => 'Structural Packaging Dieline & Artwork Production | CuttingEdger',
                        'meta_description' => 'Precision packaging artwork adaptation across dielines, SKU ranges, foil masks and regulatory print specifications.',
                    ],
                ],
            ],
            [
                'slug' => 'video',
                'tag' => 'Video',
                'title' => 'Video & Motion',
                'subtitle' => 'Product videos and social cut-downs built from the same source files.',
                'icon' => 'Clapperboard',
                'meta_title' => 'Product Video Editing & Motion Graphics | CuttingEdger',
                'meta_description' => 'Product videos, social media cut-downs and motion graphics for fashion and e-commerce brands.',
                'children' => [
                    [
                        'slug' => 'product-videos',
                        'title' => 'Product Videos',
                        'subtitle' => 'Short videos that show a product at its best.',
                        'icon' => 'Video',
                        'meta_title' => 'E-Commerce Product Video Editing Services | CuttingEdger',
                        'meta_description' => 'Clean, high-converting PDP product videos and marketplace loops with studio pacing, callouts and fast-loading exports.',
                    ],
                    [
                        'slug' => 'social-cut-downs',
                        'title' => 'Social Media Cut-Downs',
                        'subtitle' => 'One video, resized and trimmed for every channel.',
                        'icon' => 'Smartphone',
                        'meta_title' => 'Multi-Format Social Media Video Cut-Downs | CuttingEdger',
                        'meta_description' => 'Vertical 9:16, square 1:1 and widescreen campaign cut-downs with hook pacing and safe-zone captions for Reels, TikTok and Paid Social.',
                    ],
                    [
                        'slug' => 'motion-graphics',
                        'title' => 'Motion Graphics',
                        'subtitle' => 'Animated banners, titles and explainers.',
                        'icon' => 'Sparkles',
                        'meta_title' => 'Kinetic Typography & Motion Graphics Production | CuttingEdger',
                        'meta_description' => 'Brand-consistent animated banners, kinetic titles, lower thirds and product explainer loops in MP4, WebM and GIF.',
                    ],
                    [
                        'slug' => 'video-color-cleanup',
                        'title' => 'Video Colour & Clean-Up',
                        'subtitle' => 'Colour-graded, tidy footage ready to publish.',
                        'icon' => 'Palette',
                        'meta_title' => 'Video Colour Grading & Frame Clean-Up Services | CuttingEdger',
                        'meta_description' => 'Log-to-Rec.709 colour grading, swatch-accurate garment matching and frame-by-frame rig or blemish removal.',
                    ],
                ],
            ],
        ];
    }
}
