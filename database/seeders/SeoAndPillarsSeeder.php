<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Redirect;
use App\Models\Service;
use App\Models\Setting;
use App\Models\TrackingScript;
use Illuminate\Database\Seeder;

class SeoAndPillarsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // -------------------------------------------------------------
        // 1. SEED THE 4 CORE SERVICE PILLARS AND COMMERCIAL CHILD PAGES
        // -------------------------------------------------------------

        // Pillar 1: E-commerce Catalog Optimization
        $pillar1 = Service::updateOrCreate(
            ['slug' => 'ecommerce-catalog-optimization'],
            [
                'parent_id' => null,
                'title' => 'E-Commerce Catalog Optimization',
                'h1_title' => 'E-Commerce Catalog Optimization & High-Volume Retouching Services',
                'marquee_label' => 'HIGH-VOLUME SKU VELOCITY · 100% HAND-DRAWN PATHS · DELTA-E COLOR FIDELITY · ZERO HALATION',
                'subtitle' => 'Turn raw product photography into high-converting, marketplace-compliant visual assets at enterprise scale.',
                'description' => 'We engineer automated and human-curated post-production pipelines for global brands, DTC leaders, and multi-channel retailers. From surgical edge cutouts to ghost mannequin garment shaping and marketplace compliance, we deliver rapid turnarounds with flawless consistency across hundreds of thousands of SKUs.',
                'problem_statement' => 'High-volume product photography suffers from erratic studio lighting, background halos, mismatched colorways, and slow manual turnaround that stalls new product drops and depresses conversion rates.',
                'solution_statement' => 'Cutting Edger deploys dual-layer QC teams and proprietary batch pipelines to process up to 10,000 assets daily, ensuring pixel-perfect 255 pure white backgrounds, uniform margins, and 12-hour delivery SLAs.',
                'features' => [
                    'Multi-Channel Compliance (Amazon, Shopify, Google Shopping, Zalando)',
                    'Sub-12 Hour Rapid Turnaround for High-Volume Catalog Batches',
                    'Zero Background Halation or Edge Artifacts',
                    'Dedicated Account Directors and Strict Quality SLAs',
                ],
                'deliverables' => [
                    'Standardized Multi-Resolution Web Assets (WebP, AVIF, High-Res JPG)',
                    'Layered Master PSDs with Embedded Paths & Alpha Channels',
                    'Custom Shadow Injections (Cast, Drop, and Natural Floor Reflection)',
                    'Automated SKU-Compliant Naming & Folder Packaging',
                ],
                'process_steps' => [
                    ['step' => '01', 'title' => 'Secure Ingestion', 'description' => 'Batch asset ingestion via encrypted SFTP, Aspera, or S3 cloud link.'],
                    ['step' => '02', 'title' => 'Pathing & Isolation', 'description' => 'Precision hand-drawn vector clipping paths and alpha channel separation.'],
                    ['step' => '03', 'title' => 'Retouch & Standardize', 'description' => 'Micro-dust cleanup, symmetrical garment jointing, and canvas alignment.'],
                    ['step' => '04', 'title' => 'Dual-Layer QC', 'description' => '100% zoom pixel inspection by Senior QC leads before final export.'],
                ],
                'faqs' => [
                    ['question' => 'What is the standard turnaround time for high-volume catalogs?', 'answer' => 'Our standard turnaround is under 24 hours. For enterprise retainers with scheduled daily drops, we offer accelerated 6-hour and 12-hour SLAs.'],
                    ['question' => 'How do you ensure edge accuracy on complex products?', 'answer' => 'We reject automated erasers. Every edge is defined using hand-crafted Photoshop Pen Tool vector paths, supplemented by advanced alpha channel masking for soft fabrics or fur.'],
                    ['question' => 'Can you handle Amazon, Shopify, and marketplace formatting?', 'answer' => 'Yes. We strictly adhere to marketplace standards: pure 255/255/255 RGB backgrounds, exact 85% frame filling ratios, and sRGB color profile exports.'],
                ],
                'icon' => 'Layers',
                'sort_order' => 1,
                'accent_color' => '#d4ff00',
                'meta_title' => 'E-Commerce Image Retouching Agency & Catalog Optimization | Cutting Edger',
                'meta_description' => 'Scale your product visual pipeline with enterprise e-commerce image retouching, clipping paths, and catalog optimization for Amazon and Shopify.',
                'is_noindex' => false,
            ]
        );

        // Sub-page 1.1: Clipping Path Service
        Service::updateOrCreate(
            ['slug' => 'clipping-path-service'],
            [
                'parent_id' => $pillar1->id,
                'title' => 'Clipping Path Service',
                'h1_title' => '100% Hand-Drawn Pen Tool Vector Clipping Path Service',
                'marquee_label' => 'HAND-DRAWN PEN TOOL · ZERO JAGGED EDGES · MULTIPATH ISOLATION · 10,000 SKUS/DAY',
                'subtitle' => 'Pixel-perfect vector cutouts and multipath silhouette isolation crafted by senior Photoshop artisans.',
                'description' => 'Automated AI tools butcher fine curves and leave blurry color fringe. Our clipping path studio delivers 100% hand-drawn Adobe Photoshop Pen Tool vector paths with smooth bezier curves and zero fringing, even across reflective chrome, transparent glassware, and complex apparel.',
                'problem_statement' => 'Automated background removers leave jagged pixels, degraded edges, and unsightly background color bleeds that degrade brand luxury perception.',
                'solution_statement' => 'Hand-crafted vector paths placed precisely 1 pixel inside the subject edge ensure clean isolation without clipping product details or leaving artifacts.',
                'features' => [
                    '100% Manual Photoshop Pen Tool Vector Paths',
                    'Multipath Separation for Infinite Colorway Adjustments',
                    'Zero Color Bleeding on Dark or Saturated Backgrounds',
                    'Support for Compound Paths and Intricate Cutouts',
                ],
                'deliverables' => [
                    'Clipping Path Embedded TIFF and EPS Files',
                    'Transparent PNG Web Assets with Crisp Alpha Transparency',
                    'Layered PSDs with Isolated Product Elements',
                    'High-Capacity Batch Processing via SFTP',
                ],
                'process_steps' => [
                    ['step' => '01', 'title' => 'Bezier Vector Pathing', 'description' => 'Artisans trace every curve manually at 300% zoom with pen bezier handles.'],
                    ['step' => '02', 'title' => 'Multipath Component Masking', 'description' => 'Separate paths for soles, laces, buttons, and accessories.'],
                    ['step' => '03', 'title' => 'Edge Feather Calibration', 'description' => 'Sub-pixel 0.3px anti-aliasing feathering for natural realism.'],
                    ['step' => '04', 'title' => 'Batch Export', 'description' => 'Multi-format export matching your exact CMS and DAM specifications.'],
                ],
                'faqs' => [
                    ['question' => 'Why choose manual pen tool clipping over AI background removal?', 'answer' => 'AI removers guess at edge boundaries, creating fuzzy textures and cutting off thin details. Hand-drawn clipping paths provide crisp, mathematically perfect vector lines that scale cleanly.'],
                    ['question' => 'What is multipath clipping?', 'answer' => 'Multipath clipping creates distinct paths for different parts of an item (e.g. sole, upper, laces of a shoe). This enables individual color changes, texture swaps, or selective retouching.'],
                ],
                'icon' => 'Scissors',
                'sort_order' => 1,
                'accent_color' => '#d4ff00',
                'meta_title' => 'Hand-Drawn Clipping Path Service for High-Volume Brands | Cutting Edger',
                'meta_description' => 'Outsource clipping path service with 100% hand-drawn vector paths. Razor-sharp product cutouts for e-commerce, fashion, and retail brands.',
                'is_noindex' => false,
            ]
        );

        // Sub-page 1.2: Image Masking Service
        Service::updateOrCreate(
            ['slug' => 'image-masking-service'],
            [
                'parent_id' => $pillar1->id,
                'title' => 'Image Masking Service',
                'h1_title' => 'Advanced Alpha Channel & Hair Strand Image Masking Service',
                'marquee_label' => 'ALPHA CHANNEL MASKING · TRANSLUCENT FABRIC ISOLATION · FINE FLYAWAY HAIR · FUR & FEATHERS',
                'subtitle' => 'Seamless background extraction for complex, soft, and semi-transparent edges that vector paths cannot trace.',
                'description' => 'When products feature flyaway hair, delicate cashmere knitwear, transparent bridal veils, or furry textures, standard vector clipping falls short. We combine alpha channel calculations, color decontaminations, and refine edge painting to isolate every single strand.',
                'problem_statement' => 'Sheer garments, flyaway hair, and textured edges lose detail or pick up dark color casts when cut out using traditional hard-edge methods.',
                'solution_statement' => 'Multi-channel luminance masking and custom hair reconstruction preserve natural transparency and soft gradients against any new backdrop.',
                'features' => [
                    'Alpha Channel and Luminosity Mask Separation',
                    'Color Decontamination for Translucent and Glassware Edges',
                    'Fine Hair, Fur, and Fiber Detail Retention',
                    'Seamless Placement onto Pure White or Lifestyle Backdrops',
                ],
                'deliverables' => [
                    '16-Bit Alpha Channel Layered PSD Master Files',
                    'Color-Neutral Transparent PNGs',
                    'Soft Shadow Retention and Shadow Regeneration Layers',
                ],
                'process_steps' => [
                    ['step' => '01', 'title' => 'Channel Contrast Analysis', 'description' => 'Identifying highest-contrast color channels for base isolation.'],
                    ['step' => '02', 'title' => 'Luminosity Masking', 'description' => 'Separating delicate fibers, hair tips, and sheer fabric threads.'],
                    ['step' => '03', 'title' => 'Background Decontamination', 'description' => 'Neutralizing studio ambient spill from edges without losing transparency.'],
                ],
                'faqs' => [
                    ['question' => 'When should I use masking instead of clipping paths?', 'answer' => 'Use masking when the subject has soft, fuzzy, or translucent boundaries such as model hair, knitwear, wool, fur, smoke, or sheer fabrics.'],
                ],
                'icon' => 'Sparkles',
                'sort_order' => 2,
                'accent_color' => '#00f5ff',
                'meta_title' => 'Professional Image Masking Service for Apparel & Models | Cutting Edger',
                'meta_description' => 'Alpha channel and advanced hair strand masking service. Flawless cutout of sheer fabrics, fur, and intricate model hair for luxury brands.',
                'is_noindex' => false,
            ]
        );

        // Sub-page 1.3: Ghost Mannequin Service
        Service::updateOrCreate(
            ['slug' => 'ghost-mannequin-service'],
            [
                'parent_id' => $pillar1->id,
                'title' => 'Ghost Mannequin Service',
                'h1_title' => 'Invisible Ghost Mannequin & 3D Apparel Hollow Body Jointing',
                'marquee_label' => '3D GARMENT VOLUME · INVISIBLE NECK JOINT · HOLLOW MAN EFFECT · SYMMETRIC DRAPE',
                'subtitle' => 'Give flat apparel three-dimensional life and volume without costly on-model photoshoots.',
                'description' => 'We composite studio ghost mannequin shots, inner neck linings, bottom hems, and sleeve cuffs into a unified 3D hollow appearance. Every joint is seamlessly blended, draped with natural fabric weight, and balanced symmetrically to showcase premium garment tailoring.',
                'problem_statement' => 'Flat-lay photos look lifeless, while live model photography is expensive and distracts from garment details on multi-SKU retail catalogs.',
                'solution_statement' => 'Our ghost mannequin specialists align front and interior garment captures, sculpt natural shadow depths, and eliminate wrinkles while retaining authentic weave texture.',
                'features' => [
                    'Seamless Collar, Cuff, and Hem Lining Insertion',
                    'Symmetrical Balancing of Lapels, Zippers, and Seams',
                    'Micro-Smoothing of Distracting Fabric Creases & Wrinkles',
                    'Realistic 3D Interior Shadow & Depth Sculpting',
                ],
                'deliverables' => [
                    'Standardized E-Commerce Apparel Assets (Amazon & Shopify Specs)',
                    'Multi-Layer Master PSDs with Isolated Inners and Shadows',
                    'Consistent Brand Alignment Across Entire Size Runs',
                ],
                'process_steps' => [
                    ['step' => '01', 'title' => 'Joint Alignment', 'description' => 'Warping and aligning inner neck lining to front garment curvature.'],
                    ['step' => '02', 'title' => 'Seamless Blending', 'description' => 'Micro-stitching seams with natural fabric texture continuity.'],
                    ['step' => '03', 'title' => 'Volume Sculpting', 'description' => 'Adding subtle inner gradient shadows to emphasize 3D garment depth.'],
                ],
                'faqs' => [
                    ['question' => 'How many photos do I need to supply per garment?', 'answer' => 'Typically two photos: one of the garment on the mannequin from the front, and one shot of the garment turned inside-out to capture the inner neck tag and lining.'],
                ],
                'icon' => 'Shirt',
                'sort_order' => 3,
                'accent_color' => '#ff3e8a',
                'meta_title' => 'Ghost Mannequin Service & Invisible Neck Jointing | Cutting Edger',
                'meta_description' => 'High-precision ghost mannequin photo editing service. 3D hollow apparel effect with neck joints and wrinkle cleanup for fashion brands.',
                'is_noindex' => false,
            ]
        );

        // Pillar 2: Color Standardization
        Service::updateOrCreate(
            ['slug' => 'color-standardization'],
            [
                'parent_id' => null,
                'title' => 'Color Standardization',
                'h1_title' => 'Color Standardization & Apparel Swatch Matching Services',
                'marquee_label' => 'DELTA-E < 1 ACCURACY · PANTONE SWATCH MATCHING · ZERO RESHOOTS · INFINITE COLORWAYS',
                'subtitle' => 'Eliminate costly reshoots and return rates with lab-grade digital color grading and swatch calibration.',
                'description' => 'E-commerce return rates are overwhelmingly driven by color mismatch between web imagery and physical items. Cutting Edger delivers Delta-E compliant color correction, translating Pantone references, RGB values, or physical fabric swatches across your entire product line without reshooting a single frame.',
                'problem_statement' => 'Color distortion between studio strobe lighting and web monitors causes high customer return rates and lost trust in fashion and home goods.',
                'solution_statement' => 'Our colorists use calibrated color profiles, L*a*b* color space curves, and multipath separation to match physical production swatches with scientific precision.',
                'features' => [
                    'Delta-E < 1 Colorimetric Accuracy Across Displays',
                    'Single-Capture Colorway Multiplication (Save 70% on Photoshoots)',
                    'Pantone, CMYK, Hex, and Physical Swatch Alignment',
                    'Skin Tone Preservation During Garment Color Shifts',
                ],
                'deliverables' => [
                    'Multi-Colorway E-Commerce Catalog Image Packs',
                    'Calibrated sRGB and Adobe RGB Color Master Files',
                    'Color Quality Control Verification Audit Reports',
                ],
                'process_steps' => [
                    ['step' => '01', 'title' => 'Swatch Digitization', 'description' => 'Calibrating target RGB values from physical swatches or Pantone codes.'],
                    ['step' => '02', 'title' => 'Selective Mask Isolation', 'description' => 'Creating tight masks so only designated fabrics shift color.'],
                    ['step' => '03', 'title' => 'Luminance Balancing', 'description' => 'Adjusting hue and saturation while preserving fabric highlight and shadow contrast.'],
                ],
                'faqs' => [
                    ['question' => 'How accurately can you match physical fabric colors?', 'answer' => 'We achieve commercial color fidelity with Delta-E under 1, meaning color variations are imperceptible to the human eye under standard viewing conditions.'],
                    ['question' => 'Can you create 10 color variants from 1 white photoshoot?', 'answer' => 'Yes! That is one of our most popular enterprise workflows. Shoot once in neutral white or light grey, and we generate all colorways and patterns digitally.'],
                ],
                'icon' => 'Palette',
                'sort_order' => 2,
                'accent_color' => '#ffd700',
                'meta_title' => 'Color Standardization & Apparel Color Correction Services | Cutting Edger',
                'meta_description' => 'Outsource color standardization and apparel swatch matching. Reduce e-commerce returns with scientific Delta-E color correction services.',
                'is_noindex' => false,
            ]
        );

        // Pillar 3: White-Label Agency Extension
        Service::updateOrCreate(
            ['slug' => 'white-label-agency-extension'],
            [
                'parent_id' => null,
                'title' => 'White-Label Agency Extension',
                'h1_title' => 'White-Label Visual Production & Scalable Agency Extension',
                'marquee_label' => 'STRICT NDA PROTECTION · 24/7 OVERNIGHT PRODUCTION · ZERO OVERHEAD · YOUR BRAND ONLY',
                'subtitle' => 'Confidential, enterprise-grade post-production bandwidth for creative agencies, production studios, and commercial photographers.',
                'description' => 'Agencies turn to Cutting Edger to handle heavy-lifting retouching, cutouts, and CGI pipelines under strict non-disclosure agreements. We operate seamlessly as your invisible overnight back-office, delivering billboard-grade craft while you protect agency margins and scale client capacity.',
                'problem_statement' => 'Creative agencies frequently face post-production bottlenecks during seasonal campaign surges, with high in-house overhead and unpredictable contractor quality.',
                'solution_statement' => 'We act as an integrated white-label extension of your studio, working in your project management tools (Asana, Monday, Frame.io) with custom SLAs and zero client attribution.',
                'features' => [
                    '100% Confidential White-Label Delivery (Signed NDAs)',
                    '24/7 Follow-the-Sun Global Production Shifts',
                    'Fixed Per-Asset or Dedicated Retainer Pricing',
                    'Direct Integration with Frame.io, Aspera, and Cloud Buckets',
                ],
                'deliverables' => [
                    'Client-Ready Retouched PSDs with Preserved Layer Hierarchies',
                    'Custom Branded Delivery Packages & Folders',
                    'Overnight Batch Processing SLAs',
                ],
                'process_steps' => [
                    ['step' => '01', 'title' => 'Onboarding & NDA', 'description' => 'Establishing style guides, brand guidelines, and legal confidentiality.'],
                    ['step' => '02', 'title' => 'Pilot Calibration', 'description' => 'Refining retouching nuances across 5-10 test assets with your Art Director.'],
                    ['step' => '03', 'title' => 'Continuous Flow', 'description' => 'Drop assets into shared buckets at 6 PM, receive finished masters by 8 AM.'],
                ],
                'faqs' => [
                    ['question' => 'How do you guarantee confidentiality for our agency clients?', 'answer' => 'Every team member signs strict, legally binding NDAs. We never publish or claim agency client work in public portfolios unless explicitly granted written consent.'],
                    ['question' => 'Can we communicate directly with your lead retouchers?', 'answer' => 'Yes. Dedicated accounts receive dedicated Slack/Teams channels and named Senior Retouching Leads for real-time art direction.'],
                ],
                'icon' => 'Shield',
                'sort_order' => 3,
                'accent_color' => '#7000ff',
                'meta_title' => 'White-Label Photo Editing for Creative Agencies | Cutting Edger',
                'meta_description' => 'Scale creative agency post-production capacity with white-label photo retouching, clipping path, and CGI services under strict NDA protection.',
                'is_noindex' => false,
            ]
        );

        // Pillar 4: Virtual Production and CGI Studio
        $pillar4 = Service::updateOrCreate(
            ['slug' => 'virtual-production-cgi'],
            [
                'parent_id' => null,
                'title' => 'Virtual Production & CGI Studio',
                'h1_title' => 'Virtual Production & Photorealistic 3D CGI Studio',
                'marquee_label' => 'CAD TO 3D MESH · 8K ULTRA-HD RENDERS · PROCEDURAL PBR SHADERS · 360° WEBGL ASSETS',
                'subtitle' => 'Eliminate physical photoshoot logistics with ultra-realistic 3D digital twins and virtual studio staging.',
                'description' => 'From luxury consumer goods and electronics to architectural furniture suites, we convert CAD engineering drawings and multi-view photographs into photorealistic 3D CGI models. Render infinite camera angles, swap fabrics instantly, and publish interactive 360° WebGL turntable spins with zero photography logistics.',
                'problem_statement' => 'Shipping heavy physical prototypes, renting studio spaces, and building physical sets costs hundreds of thousands of dollars and delays go-to-market cycles.',
                'solution_statement' => 'We author accurate 3D digital twins with physics-based PBR materials and procedural lighting rigs, allowing infinite variations from a single master model.',
                'features' => [
                    'CAD, STEP, and STL to Production-Ready 3D Meshes',
                    'Photorealistic Studio Lighting Environments (HDRI Authoring)',
                    '8K Ultra-HD Resolution Still and Lifestyle Renders',
                    'Interactive WebGL, GLTF, and USDZ AR-Ready Assets',
                ],
                'deliverables' => [
                    'Photorealistic 4K and 8K Campaign Renders',
                    'Optimized GLB/GLTF Files for Shopify 3D & WebGL Viewers',
                    'Turnaround Animations and 360-Degree Spin Sequences',
                ],
                'process_steps' => [
                    ['step' => '01', 'title' => 'CAD Topology Cleanup', 'description' => 'Converting raw engineering files into clean, subdivision quad meshes.'],
                    ['step' => '02', 'title' => 'PBR Material Authoring', 'description' => 'Simulating real-world roughness, metalness, and sub-surface scattering.'],
                    ['step' => '03', 'title' => 'Virtual Staging & Lighting', 'description' => 'Rigging virtual softboxes, reflectors, and environmental backdrops.'],
                    ['step' => '04', 'title' => 'Ray-Traced Rendering', 'description' => 'High-resolution rendering with multi-pass beauty, diffuse, and depth passes.'],
                ],
                'faqs' => [
                    ['question' => 'What inputs do you need to create a 3D model?', 'answer' => 'We can work from CAD files (STEP, IGES, SolidWorks), architectural blueprints, or even smartphone reference photos with physical dimension specifications.'],
                    ['question' => 'Can your 3D models be used on Shopify or Amazon?', 'answer' => 'Yes. We deliver web-optimized, low-draw-call GLTF/GLB files that load instantly in Shopify 3D viewer and Amazon AR view.'],
                ],
                'icon' => 'Box',
                'sort_order' => 4,
                'accent_color' => '#ff6b35',
                'meta_title' => '3D Product Rendering & CGI Virtual Production Studio | Cutting Edger',
                'meta_description' => 'Photorealistic 3D product rendering, CGI modeling, and virtual production. Convert CAD blueprints into high-converting 3D digital twin assets.',
                'is_noindex' => false,
            ]
        );

        // Sub-page 4.1: 3D Furniture Modeling
        Service::updateOrCreate(
            ['slug' => '3d-furniture-modeling'],
            [
                'parent_id' => $pillar4->id,
                'title' => '3D Furniture Modeling',
                'h1_title' => 'Outsource 3D Furniture Modeling & Photorealistic CGI Architectural Rendering',
                'marquee_label' => 'FURNITURE DIGITAL TWINS · REALISTIC FABRIC SEAMS · PROCEDURAL WOOD GRAIN · 360° AR',
                'subtitle' => 'High-precision 3D CGI modeling for luxury furniture manufacturers, interior designers, and catalog brands.',
                'description' => 'Shipping bulky sofas, marble dining tables, and modular casegoods to physical photo studios is expensive and prone to transit damage. We build high-fidelity 3D digital twins with photorealistic cushions, wrinkles, leather grain, and wood finishes, staged in breathtaking architectural lifestyle interiors.',
                'problem_statement' => 'Prototyping physical furniture collections across multiple upholstery colors and wood stains costs immense capital and logistics coordination.',
                'solution_statement' => 'We construct reusable 3D CAD meshes with interchangeable PBR fabric libraries, enabling instant catalog generation across thousands of finishes.',
                'features' => [
                    'Photorealistic Upholstery, Leather Creases, and Stitch Detailing',
                    'Procedural Wood Grain and Metallic Powder-Coat Texturing',
                    'Bespoke Architectural Lifestyle Room Scene Construction',
                    'Configurable Asset Export for Augmented Reality (AR) Shopping',
                ],
                'deliverables' => [
                    'High-Res 8K Room Staging Renders',
                    'Pure White Silhouette Product Spin Assets',
                    'Shopify and Amazon AR Compatible GLTF/USDZ Models',
                ],
                'process_steps' => [
                    ['step' => '01', 'title' => 'Scale Blueprint Sculpting', 'description' => 'Modeling frame geometry to millimeter accuracy from spec sheets.'],
                    ['step' => '02', 'title' => 'Cloth & Seam Physics', 'description' => 'Simulating natural cushion compression and stitch wrinkles in Marvelous Designer.'],
                    ['step' => '03', 'title' => 'PBR Texture Authoring', 'description' => 'Creating micro-displacement maps for bouclé, velvet, leather, and oak.'],
                ],
                'faqs' => [
                    ['question' => 'How much photoshoot budget can 3D furniture modeling save?', 'answer' => 'Our furniture clients report saving 70% to 85% compared to physical studio builds and freight logistics.'],
                ],
                'icon' => 'Box',
                'sort_order' => 1,
                'accent_color' => '#ff6b35',
                'meta_title' => 'Outsource 3D Furniture Modeling & CGI Rendering | Cutting Edger',
                'meta_description' => 'Outsource 3D furniture modeling and photorealistic interior CGI rendering. High-fidelity digital twins and AR assets for furniture manufacturers.',
                'is_noindex' => false,
            ]
        );

        // -------------------------------------------------------------
        // 2. SEED SYSTEM REDIRECTS (LEGACY + NEW PILLARS MIGRATION)
        // -------------------------------------------------------------
        $redirectsMap = [
            // Old service paths to new pillar hierarchy
            '/services/background-removal' => '/services/ecommerce-catalog-optimization/clipping-path-service',
            '/services/ghost-mannequin' => '/services/ecommerce-catalog-optimization/ghost-mannequin-service',
            '/services/high-end-model-retouch' => '/services/ecommerce-catalog-optimization',
            '/services/jewelry-retouch' => '/services/ecommerce-catalog-optimization',
            '/services/3d-modeling-and-rendering' => '/services/virtual-production-cgi',
            '/services/desktop-publishing' => '/services/white-label-agency-extension',

            // Old /work route to SEO plan /case-studies
            '/work' => '/case-studies',

            // Legacy 301 paths from original cuttingedger.com
            '/photo-background-removal-services' => '/services/ecommerce-catalog-optimization/clipping-path-service',
            '/best-clipping-path-service' => '/services/ecommerce-catalog-optimization/clipping-path-service',
            '/invisible-mannequin' => '/services/ecommerce-catalog-optimization/ghost-mannequin-service',
            '/photo-hollow-man-services' => '/services/ecommerce-catalog-optimization/ghost-mannequin-service',
            '/photo-jewelry-retouch-services' => '/services/ecommerce-catalog-optimization',
            '/photo-high-end-model-retouch-services' => '/services/ecommerce-catalog-optimization',
            '/photo-retouching-outsourcing' => '/services/white-label-agency-extension',
            '/photo-lifestyle-retouch-services' => '/services/ecommerce-catalog-optimization',
            '/photo-semi-nude-or-calendar-model-retouch-services' => '/services/ecommerce-catalog-optimization',
            '/photo-lingerie-model-retouch-services' => '/services/ecommerce-catalog-optimization',
            '/photo-automobile-retouch-services' => '/services/ecommerce-catalog-optimization',
            '/photo-accessories-retouch-services' => '/services/ecommerce-catalog-optimization',
            '/photo-shoe-retouch-services' => '/services/ecommerce-catalog-optimization',
            '/image-masking-service' => '/services/ecommerce-catalog-optimization/image-masking-service',
            '/shadow-creation-service' => '/services/ecommerce-catalog-optimization',
            '/photo-reflection-creation-services' => '/services/ecommerce-catalog-optimization',
            '/photo-color-correction-services' => '/services/color-standardization',
            '/photo-manipulation-services' => '/services/virtual-production-cgi',
            '/photo-harmonization-services' => '/services/color-standardization',
            '/photo-image-restoration-services' => '/services/ecommerce-catalog-optimization',
            '/photo-face-swapping-services' => '/services/ecommerce-catalog-optimization',

            // 3D & CGI legacy
            '/3D/3d-modeling-and-rendering-service' => '/services/virtual-production-cgi',
            '/3d/3d-modeling-and-rendering-service' => '/services/virtual-production-cgi',
            '/3d-furniture-modeling' => '/services/virtual-production-cgi/3d-furniture-modeling',

            // DTP legacy
            '/multilingual-typesetting-and-formatting-services' => '/services/white-label-agency-extension',
            '/brand-identity-services' => '/services/white-label-agency-extension',
            '/ai-concept-art-and-illustration-services' => '/services/virtual-production-cgi',
            '/presentation-services' => '/services/white-label-agency-extension',
            '/adaption-services' => '/services/white-label-agency-extension',
            '/data-entry-services' => '/services/white-label-agency-extension',

            // Orders & Legacy Pages
            '/option/free-trial' => '/#free-trial',
            '/option/order' => '/pricing',
            '/page/aboutus' => '/about',
            '/page/contact' => '/contact',
            '/page/pricing' => '/pricing',
            '/page/faqs' => '/faq',
        ];

        foreach ($redirectsMap as $source => $target) {
            Redirect::updateOrCreate(
                ['source_path' => $source],
                [
                    'target_url' => $target,
                    'status_code' => 301,
                    'is_regex' => false,
                    'is_active' => true,
                    'notes' => 'Legacy migration mapping to new SEO architecture',
                ]
            );
        }

        // -------------------------------------------------------------
        // 3. SEED SETTINGS (ROBOTS.TXT, CALENDLY, SEO DEFAULTS)
        // -------------------------------------------------------------
        $settingsData = [
            'brand_name' => 'Cutting Edger',
            'tagline' => 'AI-Driven Visual Performance & Post-Production Agency.',
            'contact_email' => 'hello@cuttingedger.com',
            'contact_phone' => '+1 (409) 995-2565',
            'office_address' => 'Artisan Center, Level-7, House# 57/9, West Panthapath, Dhaka 1215',
            'calendly_url' => 'https://calendly.com/cuttingedger/discovery-call',
            'default_meta_title' => 'Cutting Edger — AI-Driven Visual Performance Agency',
            'default_meta_description' => 'High-volume e-commerce catalog retouching, color standardization, white-label agency bandwidth, and 3D CGI virtual production studio.',
            'robots_txt_content' => "User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nDisallow: /thank-you\n\nSitemap: https://cuttingedger.com/sitemap.xml",
        ];

        foreach ($settingsData as $key => $val) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $val]
            );
        }

        // -------------------------------------------------------------
        // 4. SEED SAMPLE TRACKING SCRIPTS IN ADMIN
        // -------------------------------------------------------------
        TrackingScript::updateOrCreate(
            ['name' => 'Google Tag Manager (GTM Container)'],
            [
                'type' => 'tag_manager',
                'placement' => 'head',
                'code' => "<!-- Google Tag Manager -->\n<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':\nnew Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],\nj=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=\n'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);\n})(window,document,'script','dataLayer','GTM-CEPROD');</script>\n<!-- End Google Tag Manager -->",
                'target_scope' => 'all',
                'is_active' => false, // Active when user enters real container ID
                'sort_order' => 1,
            ]
        );

        TrackingScript::updateOrCreate(
            ['name' => 'Google Search Console Verification'],
            [
                'type' => 'verification',
                'placement' => 'head',
                'code' => '<meta name="google-site-verification" content="CE_GSC_VERIFICATION_TOKEN" />',
                'target_scope' => 'all',
                'is_active' => false,
                'sort_order' => 2,
            ]
        );

        TrackingScript::updateOrCreate(
            ['name' => 'Microsoft Clarity Analytics'],
            [
                'type' => 'analytics',
                'placement' => 'head',
                'code' => "<script type=\"text/javascript\">\n(function(c,l,a,r,i,t,y){\nc[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};\nt=l.createElement(r);t.async=1;t.src=\"https://www.clarity.ms/tag/\"+i;\ny=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);\n})(window, document, \"clarity\", \"script\", \"CE_CLARITY_ID\");\n</script>",
                'target_scope' => 'all',
                'is_active' => false,
                'sort_order' => 3,
            ]
        );

        // -------------------------------------------------------------
        // 5. UPDATE EXISTING CASE STUDIES WITH CONCEPT WORK TOGGLE
        // -------------------------------------------------------------
        Project::where('slug', 'nordic-outerwear-ghost-mannequin')->update([
            'is_concept' => false,
            'client_challenge' => 'Haglöfs needed to launch 4,800 technical outerwear SKUs across European e-commerce channels with internal seam visibility and natural silhouette drape in under 2 weeks.',
            'work_done' => 'Constructed a dual-shift ghost mannequin assembly line, compositing front shots with inside neck labels and storm flap linings, applying subtle drop shadows and wrinkle reduction.',
            'measurable_result' => 'Delivered 4,800 SKUs with 99.8% first-pass approval and reduced catalog production turnaround from 14 days to 48 hours.',
        ]);

        Project::where('slug', 'diamond-jewelry-macro-retouch')->update([
            'is_concept' => false,
            'client_challenge' => 'Macro studio jewelry photos captured dust particles, micro-scratches, and studio lighting reflections that diminished perceived gemstone fire.',
            'work_done' => 'Hand-sculpted metallic highlights, executed multi-focus-stack alignment, and eliminated micro-defects on platinum and 18K gold bands.',
            'measurable_result' => 'Generated a +42% CTR lift on Amazon luxury storefronts with Delta-E color fidelity under 1.',
        ]);

        Project::where('slug', '3d-cgi-furniture-modeling')->update([
            'is_concept' => true, // Concept showcase work
            'client_challenge' => 'Evaluating CAD-to-CGI pipeline efficiency versus traditional physical photoshoots for high-end modular sectional sofas.',
            'work_done' => 'Constructed high-subdivision quad meshes from manufacturing blueprints, authored procedural bouclé and velvet shaders, and built 3 interactive lifestyle room environments.',
            'measurable_result' => 'Proved 78% cost savings versus physical studio staging, outputting 8K ultra-HD renders and Shopify WebGL models.',
        ]);
    }
}
