<?php

namespace Database\Seeders;

use App\Models\Capability;
use Illuminate\Database\Seeder;

/**
 * The four main capabilities (2D, 3D, DTP, Video) and their sub-capabilities.
 * Everything here can be edited from the admin panel. There are no prices: work is quoted per project.
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
                        'process_steps' => $main['process_steps'],
                        'faqs' => $main['faqs'],
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
                'description' => 'From cutouts and masking to fashion, beauty and jewelry retouching, our 2D studio turns raw photography into marketplace-ready images. Every file follows your style guide so a catalog of thousands looks like one shoot.',
                'icon' => 'Layers',
                'features' => ['Hand-finished edges with no colour halos', 'Consistent look across the whole catalog', 'Style guide and preset set-up for your brand', 'Two-step quality control on every file'],
                'deliverables' => ['Layered master PSD files', 'Transparent PNG assets', 'Web-ready JPG and WebP', 'Print-ready TIFF'],
                'process_steps' => $this->steps('Send your photos and style guide.', 'Our artists edit by hand, with AI assistance where it helps.'),
                'faqs' => [
                    ['question' => 'How fast can you deliver?', 'answer' => 'Standard batches are typically delivered within 24 hours. Larger batches get a fixed delivery date before we start.'],
                    ['question' => 'Can you match our existing style?', 'answer' => 'Yes. We build a preset from your guidelines and sample files so every batch matches.'],
                ],
                'meta_title' => '2D Image Retouching & Post-Production | CuttingEdger',
                'meta_description' => 'Clipping paths, masking, ghost mannequin, fashion and jewelry retouching and colour correction for e-commerce brands.',
                'children' => [
                    [
                        'slug' => 'background-removal',
                        'title' => 'Background Removal & Clipping Path',
                        'subtitle' => 'Precise cutouts with clean, natural edges.',
                        'description' => 'Hand-drawn paths isolate your product from any background, keeping fine edges sharp and free of colour fringing. Ideal for marketplaces that need pure white backgrounds.',
                        'icon' => 'Scissors',
                        'features' => ['Hand-drawn paths for sharp, natural edges', 'Multiple paths for complex products', 'Pure white or transparent backgrounds'],
                        'deliverables' => ['Transparent PNG', 'Layered PSD with embedded path', 'White-background JPG'],
                    ],
                    [
                        'slug' => 'image-masking',
                        'title' => 'Image Masking',
                        'subtitle' => 'Soft edges such as hair, fur and sheer fabric.',
                        'description' => 'When a simple path is not enough, masking separates hair strands, knitwear, lace and transparent materials from the background while keeping their natural softness.',
                        'icon' => 'Wand2',
                        'features' => ['Hair, fur and fine texture isolation', 'Sheer and semi-transparent fabrics', 'Colour decontamination of edges'],
                        'deliverables' => ['Transparent PNG', 'Layered PSD with mask', 'Backgrounds of your choice'],
                    ],
                    [
                        'slug' => 'ghost-mannequin',
                        'title' => 'Ghost Mannequin',
                        'subtitle' => 'Invisible-mannequin garment images with natural shape.',
                        'description' => 'We combine front, back and inside-label shots into one hollow-body image, rebuilding the neck and sleeves so garments look worn without a model.',
                        'icon' => 'Shirt',
                        'features' => ['Neck and collar reconstruction', 'Balanced shape and symmetry', 'Wrinkle and crease clean-up'],
                        'deliverables' => ['Web-ready JPG', 'Layered PSD', 'Marketplace-spec versions'],
                    ],
                    [
                        'slug' => 'fashion-beauty-retouching',
                        'title' => 'Fashion & Beauty Retouching',
                        'subtitle' => 'Natural skin, clean fabric and polished campaign images.',
                        'description' => 'Editorial-quality retouching that keeps real skin texture and fabric detail while removing distractions, flyaway hair and stray marks.',
                        'icon' => 'Sparkles',
                        'features' => ['Natural skin and texture preservation', 'Fabric, hem and flyaway clean-up', 'Colour and tone matching across a set'],
                        'deliverables' => ['High-resolution JPG and TIFF', 'Layered PSD', 'Web and print versions'],
                    ],
                    [
                        'slug' => 'jewelry-retouching',
                        'title' => 'Jewelry Retouching',
                        'subtitle' => 'Macro-level clean-up for metal, stones and watches.',
                        'description' => 'Dust, scratches and uneven reflections are removed at high zoom, while metal luster and stone sparkle are brought out for premium product pages.',
                        'icon' => 'Gem',
                        'features' => ['Dust and scratch removal at high zoom', 'Metal luster and stone sparkle', 'Reflection and shadow control'],
                        'deliverables' => ['High-resolution JPG and TIFF', 'Layered PSD', 'Transparent PNG'],
                    ],
                    [
                        'slug' => 'color-correction',
                        'title' => 'Colour Correction & Standardisation',
                        'subtitle' => 'True-to-product colour, consistent across every image.',
                        'description' => 'We match colour to the real product and keep it identical across angles, shoots and colourways, so customers get what they see.',
                        'icon' => 'Palette',
                        'features' => ['Product-accurate colour matching', 'Consistent tone across a catalog', 'Colourway generation from a single shot'],
                        'deliverables' => ['Colour-managed JPG and TIFF', 'Layered PSD', 'Colourway variants'],
                    ],
                    [
                        'slug' => 'shadows-reflections',
                        'title' => 'Shadows & Reflections',
                        'subtitle' => 'Natural grounding for products on clean backgrounds.',
                        'description' => 'Drop shadows, cast shadows and mirror reflections are created to match your lighting, so cutout products still look photographed in place.',
                        'icon' => 'Layers',
                        'features' => ['Natural and drop shadows', 'Floor and mirror reflections', 'Lighting-matched direction and softness'],
                        'deliverables' => ['Web-ready JPG', 'PNG with shadow layer', 'Layered PSD'],
                    ],
                ],
            ],
            [
                'slug' => '3d',
                'tag' => '3D',
                'title' => '3D, CGI & Digital Twins',
                'subtitle' => 'Photoreal 3D models, renders and AI digital twins without a studio shoot.',
                'description' => 'We turn product designs and photos into 3D models, renders and digital twins that can be shown in any colour, pose or setting. Create once and reuse across every channel.',
                'icon' => 'Box',
                'features' => ['Photoreal materials and lighting', 'One model, unlimited variants', 'Formats for web, AR and print', 'Faster launches with no physical shoot'],
                'deliverables' => ['High-resolution renders', '3D model files', 'Web-optimised models for your store', 'Turntable and 360° spins'],
                'process_steps' => $this->steps('Share product files, photos or reference images.', 'We build and render the 3D assets, and you review a first proof.'),
                'faqs' => [
                    ['question' => 'Do I need a physical sample?', 'answer' => 'Not always. We can work from CAD files, design packs or good reference photos. A sample helps for materials.'],
                    ['question' => 'Can the models be used on my store?', 'answer' => 'Yes. We export lightweight web models and render sets that work on common storefront platforms.'],
                ],
                'meta_title' => '3D Modeling, CGI Rendering & Digital Twins | CuttingEdger',
                'meta_description' => 'Photoreal 3D product models, CGI renders, digital twins and virtual try-on for fashion and e-commerce brands.',
                'children' => [
                    [
                        'slug' => '3d-modeling',
                        'title' => '3D Product Modeling',
                        'subtitle' => 'Accurate 3D models from designs, CAD or photos.',
                        'description' => 'We build clean, production-ready 3D models of products, furniture and accessories, with accurate proportions and materials.',
                        'icon' => 'Box',
                        'features' => ['Models from CAD, sketches or photos', 'Accurate proportions and materials', 'Clean, reusable model files'],
                        'deliverables' => ['3D model files', 'Material and texture sets', 'Preview renders'],
                    ],
                    [
                        'slug' => 'cgi-rendering',
                        'title' => 'CGI Product Rendering',
                        'subtitle' => 'Studio-quality renders in any colour and setting.',
                        'description' => 'Photoreal renders replace repeat photo shoots. Change colourways, backgrounds and lighting without moving a single product.',
                        'icon' => 'Camera',
                        'features' => ['Photoreal lighting and materials', 'Unlimited colourways and scenes', 'Consistent look across a range'],
                        'deliverables' => ['High-resolution renders', 'Transparent PNG', 'Lifestyle scene images'],
                    ],
                    [
                        'slug' => 'digital-twins',
                        'title' => 'Digital Twins',
                        'subtitle' => 'Photoreal AI models that wear your garments in any pose.',
                        'description' => 'Digital twins are lifelike AI models available in many poses and styles. Dress them in your collection and publish images without booking a shoot.',
                        'icon' => 'Users',
                        'features' => ['Photoreal models in many poses', 'Custom models built for your brand', 'Usage rights to suit your needs'],
                        'deliverables' => ['Model images in every pose', 'Web and print sizes', 'Usage agreement'],
                    ],
                    [
                        'slug' => 'virtual-try-on',
                        'title' => 'Virtual Try-On',
                        'subtitle' => 'Show your garments on styled models without a shoot.',
                        'description' => 'Send us your pieces and choose a look. We dress our models in your garments, matching fit, drape and colour, for product pages and campaigns.',
                        'icon' => 'Shirt',
                        'features' => ['Garments fitted to styled models', 'Fit, drape and colour matched', 'Looks for store and campaigns'],
                        'deliverables' => ['Try-on images per look', 'Web-ready JPG', 'Layered PSD'],
                    ],
                    [
                        'slug' => '360-product-spin',
                        'title' => '360° Product Spin',
                        'subtitle' => 'Interactive turntables that let shoppers rotate a product.',
                        'description' => 'Interactive 360° spins give shoppers a closer look at your product, and come from your 3D model or from a photo set.',
                        'icon' => 'RotateCw',
                        'features' => ['Smooth interactive rotation', 'Lightweight for fast pages', 'From 3D models or photo sets'],
                        'deliverables' => ['Embeddable 360° viewer', 'Image sequence', 'Fallback still images'],
                    ],
                ],
            ],
            [
                'slug' => 'dtp',
                'tag' => 'DTP',
                'title' => 'DTP & Catalog Layout',
                'subtitle' => 'Catalogs, lookbooks and print files, laid out and ready to publish.',
                'description' => 'Our desktop publishing team formats catalogs, lookbooks, line sheets and packaging artwork, in any language, and prepares files that print correctly the first time.',
                'icon' => 'LayoutTemplate',
                'features' => ['Layouts that follow your brand guidelines', 'Support for many languages and scripts', 'Print-ready files with correct colour', 'Fast updates when products change'],
                'deliverables' => ['Print-ready PDF', 'Editable InDesign files', 'Digital flip-book PDF', 'Packaged fonts and links'],
                'process_steps' => $this->steps('Send your content, images and brand guidelines.', 'We lay out the pages and you review a proof before final files.'),
                'faqs' => [
                    ['question' => 'Can you work in other languages?', 'answer' => 'Yes. We typeset in many languages, including right-to-left and non-Latin scripts.'],
                    ['question' => 'Do I get the editable files?', 'answer' => 'Yes. You receive the editable layout files together with the print-ready PDFs.'],
                ],
                'meta_title' => 'DTP, Catalog Layout & Prepress | CuttingEdger',
                'meta_description' => 'Catalog and lookbook layout, multilingual typesetting, vector conversion and print-ready files.',
                'children' => [
                    [
                        'slug' => 'catalog-layout',
                        'title' => 'Catalog & Lookbook Layout',
                        'subtitle' => 'Product catalogs and lookbooks with a consistent design.',
                        'description' => 'We design and format catalogs and lookbooks from your product data and images, with templates that make every update fast.',
                        'icon' => 'BookOpen',
                        'features' => ['Templates built for easy updates', 'Data-driven product pages', 'Consistent brand look'],
                        'deliverables' => ['Print-ready PDF', 'Editable layout files', 'Digital version'],
                    ],
                    [
                        'slug' => 'multilingual-typesetting',
                        'title' => 'Multilingual Typesetting',
                        'subtitle' => 'Accurate layouts in any language or script.',
                        'description' => 'We adapt layouts for translated content, with correct fonts, line breaks and right-to-left support.',
                        'icon' => 'Languages',
                        'features' => ['Many languages and scripts', 'Right-to-left layouts', 'Font and line-break checks'],
                        'deliverables' => ['Layouts per language', 'Print-ready PDF', 'Editable files'],
                    ],
                    [
                        'slug' => 'vector-conversion',
                        'title' => 'Vector Conversion',
                        'subtitle' => 'Logos and artwork redrawn as clean vectors.',
                        'description' => 'Low-resolution logos and artwork are redrawn as crisp vectors that scale to any size, from a tag to a billboard.',
                        'icon' => 'PenTool',
                        'features' => ['Accurate redraw of logos and artwork', 'Clean, editable paths', 'Colour-matched output'],
                        'deliverables' => ['AI and EPS files', 'SVG', 'PDF'],
                    ],
                    [
                        'slug' => 'prepress',
                        'title' => 'Prepress & Print-Ready Files',
                        'subtitle' => 'Files checked and prepared so they print right.',
                        'description' => 'We check bleeds, colour profiles, resolution and fonts, and prepare files to your printer’s specification.',
                        'icon' => 'Printer',
                        'features' => ['Bleed, trim and colour checks', 'CMYK and spot colour set-up', 'Printer-specific output'],
                        'deliverables' => ['Print-ready PDF', 'Packaged source files', 'Preflight report'],
                    ],
                    [
                        'slug' => 'packaging-artwork',
                        'title' => 'Packaging Artwork',
                        'subtitle' => 'Dielines and artwork adapted for every pack size.',
                        'description' => 'We adapt your artwork to packaging dielines and sizes, keeping brand colours and legal text accurate across a range.',
                        'icon' => 'Package',
                        'features' => ['Dieline-accurate artwork', 'Range and size adaptations', 'Brand colour consistency'],
                        'deliverables' => ['Print-ready artwork', 'Editable source files', 'Proof PDF'],
                    ],
                ],
            ],
            [
                'slug' => 'video',
                'tag' => 'Video',
                'title' => 'Video & Motion',
                'subtitle' => 'Product videos and social cut-downs built from the same source files.',
                'description' => 'We edit product videos, social cut-downs and motion graphics that reuse your existing footage and images, so one shoot feeds every channel.',
                'icon' => 'Clapperboard',
                'features' => ['Edits sized for every channel', 'Captions, music and branding included', 'Consistent look with your stills', 'Quick turnaround on repeat formats'],
                'deliverables' => ['MP4 in each aspect ratio', 'Subtitle files', 'Project files on request', 'Thumbnail images'],
                'process_steps' => $this->steps('Share your footage, images and brand assets.', 'We edit a first cut and you review it before the final export.'),
                'faqs' => [
                    ['question' => 'Which formats do you deliver?', 'answer' => 'We export in the aspect ratios and sizes each channel needs, such as 16:9, 1:1 and 9:16.'],
                    ['question' => 'Can you use my existing photos?', 'answer' => 'Yes. Photos, product renders and footage can be combined in the same video.'],
                ],
                'meta_title' => 'Product Video Editing & Motion Graphics | CuttingEdger',
                'meta_description' => 'Product videos, social media cut-downs and motion graphics for fashion and e-commerce brands.',
                'children' => [
                    [
                        'slug' => 'product-videos',
                        'title' => 'Product Videos',
                        'subtitle' => 'Short videos that show a product at its best.',
                        'description' => 'We edit product footage and images into short videos for product pages and marketplaces, with clean pacing and branding.',
                        'icon' => 'Video',
                        'features' => ['Clean, benefit-led edits', 'Branding and captions', 'Marketplace-ready sizes'],
                        'deliverables' => ['MP4 files', 'Subtitle files', 'Thumbnail images'],
                    ],
                    [
                        'slug' => 'social-cut-downs',
                        'title' => 'Social Media Cut-Downs',
                        'subtitle' => 'One video, resized and trimmed for every channel.',
                        'description' => 'We cut long videos into short, platform-ready versions in vertical, square and wide formats.',
                        'icon' => 'Smartphone',
                        'features' => ['Vertical, square and wide formats', 'Hooks, captions and music', 'Batches for regular posting'],
                        'deliverables' => ['MP4 in each format', 'Caption files', 'Cover images'],
                    ],
                    [
                        'slug' => 'motion-graphics',
                        'title' => 'Motion Graphics',
                        'subtitle' => 'Animated banners, titles and explainers.',
                        'description' => 'We animate your brand assets into banners, lower thirds, titles and short explainers that fit your visual style.',
                        'icon' => 'Sparkles',
                        'features' => ['Animated banners and titles', 'Brand-consistent style', 'Loops and short explainers'],
                        'deliverables' => ['MP4 and GIF', 'Animated banner files', 'Project files on request'],
                    ],
                    [
                        'slug' => 'video-color-cleanup',
                        'title' => 'Video Colour & Clean-Up',
                        'subtitle' => 'Colour-graded, tidy footage ready to publish.',
                        'description' => 'We correct colour, balance exposure and remove small distractions so footage matches your photography and brand.',
                        'icon' => 'Palette',
                        'features' => ['Colour grading and matching', 'Exposure and white balance fixes', 'Object and blemish clean-up'],
                        'deliverables' => ['Graded MP4', 'LUT files on request', 'Before and after previews'],
                    ],
                ],
            ],
        ];
    }

    /**
     * The same four steps for every capability, with a custom first and second step.
     *
     * @return array<int, array{title: string, description: string}>
     */
    private function steps(string $brief, string $work): array
    {
        return [
            ['title' => 'Brief', 'description' => $brief],
            ['title' => 'Production', 'description' => $work],
            ['title' => 'Quality control', 'description' => 'Every file is checked before it leaves the studio.'],
            ['title' => 'Delivery', 'description' => 'You receive the files in your exact formats on the agreed date.'],
        ];
    }
}
