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
        $pillar2 = Service::updateOrCreate(
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

        // Sub-page 2.1: Delta-E Swatch Calibration
        Service::updateOrCreate(
            ['slug' => 'delta-e-swatch-calibration'],
            [
                'parent_id' => $pillar2->id,
                'title' => 'Delta-E Swatch Calibration',
                'h1_title' => 'Delta-E < 1 Swatch Calibration & Color Matching Services',
                'marquee_label' => 'LAB-GRADE COLOR ACCURACY · SPECTRAL MEASUREMENT · ICC PROFILES · ZERO COLOR SHIFT',
                'subtitle' => 'Scientific, lab-grade color alignment to physical fabric swatches, Pantone libraries, and brand hex palettes.',
                'description' => 'Eliminate color discrepancy between digital catalog listings and physical deliveries. We use spectrophotometer references, calibrated L*a*b* space curves, and certified ICC color workflows to calibrate every product with Delta-E under 1.0, ensuring visual perfection across mobile screens and desktop monitors.',
                'problem_statement' => 'Shoppers return up to 24% of online apparel orders because the physical color differs from the product listing photos.',
                'solution_statement' => 'Our certified color technicians align digital imagery against physical production swatches and spectrophotometer data under standardized D50/D65 illuminants.',
                'features' => [
                    'Delta-E < 1 Spectral Measurement & Precise Calibration',
                    'Pantone TCX, TPX, and Solid Coated Cross-Matching',
                    'Custom ICC Display Profiling (sRGB, Adobe RGB, Display P3)',
                    'Neutral White-Point and Luminance Curve Balancing',
                ],
                'deliverables' => [
                    'Color-Calibrated Master Layered PSD Files',
                    'Batch Delta-E Quality Assurance Verification Audit',
                    'Web-Ready WebP and JPEG Assets Tagged with sRGB Profiles',
                ],
                'process_steps' => [
                    ['step' => '01', 'title' => 'Spectral Swatch Ingestion', 'description' => 'Importing Pantone, hex, or physical spectral measurement references.'],
                    ['step' => '02', 'title' => 'L*a*b* Curve Balancing', 'description' => 'Calibrating fabric tones in perceptual color space without clipping.'],
                    ['step' => '03', 'title' => 'Cross-Display Verification', 'description' => 'Validating against wide-gamut and standard consumer color spaces.'],
                ],
                'faqs' => [
                    ['question' => 'What is Delta-E and why does < 1 matter?', 'answer' => 'Delta-E measures color difference. A Delta-E value under 1.0 represents a difference that is imperceptible to the human eye, guaranteeing absolute visual fidelity.'],
                ],
                'icon' => 'Palette',
                'sort_order' => 1,
                'accent_color' => '#ffd700',
                'meta_title' => 'Delta-E Swatch Calibration & Color Matching Service | Cutting Edger',
                'meta_description' => 'Lab-grade Delta-E < 1 color calibration service. Match e-commerce apparel and products precisely to physical swatches and Pantone colors.',
                'is_noindex' => false,
            ]
        );

        // Sub-page 2.2: Apparel Multi-Colorway Shifts
        Service::updateOrCreate(
            ['slug' => 'apparel-colorway-generation'],
            [
                'parent_id' => $pillar2->id,
                'title' => 'Apparel Colorway Shifts',
                'h1_title' => 'Multi-Colorway Apparel Color Shifts & Pattern Generation',
                'marquee_label' => 'SHOOT ONCE · MULTIPLY SKUS · PERFECT WEAVE PRESERVATION · 70% BUDGET SAVINGS',
                'subtitle' => 'Turn a single base garment photoshoot into 50+ hyper-realistic colorways without costly studio reshoots.',
                'description' => 'Drastically slash photography budgets and production timelines. Shoot one neutral garment in-studio, and our digital colorists multiply it across your full seasonal colorway line. Every stitch, crease, fabric weave, and sheen gradient is maintained with absolute photographic reality.',
                'problem_statement' => 'Photographing every single garment SKU in every colorway costs tens of thousands in studio time, model fees, and shipping delay.',
                'solution_statement' => 'We photograph one master neutral item and digitally shift colors to match production swatches, cutting total studio photography costs by over 70%.',
                'features' => [
                    'Multi-Colorway Generation from a Single Studio Master Frame',
                    'Micro-Weave Fabric Sheen and Thread Preservation',
                    'Realistic Seam, Hem, and Shadow Value Continuity',
                    'Rapid Turnaround for Seasonal Collection Launches',
                ],
                'deliverables' => [
                    'Complete Multi-SKU E-Commerce Catalog Asset Packs',
                    'Organized PSDs with Non-Destructive Hue Adjustment Layers',
                    'Marketplace-Compliant Formats for Shopify, Amazon, and ASOS',
                ],
                'process_steps' => [
                    ['step' => '01', 'title' => 'Master Mask Isolation', 'description' => 'Drawing sub-pixel pen tool paths isolating garment fabrics from skin and backgrounds.'],
                    ['step' => '02', 'title' => 'Hue & Luminance Transformation', 'description' => 'Applying target colorway values while protecting dynamic highlights.'],
                    ['step' => '03', 'title' => 'Texture Integrity Check', 'description' => 'Ensuring fine fabric weave, ribbed knits, and stitching retain natural depth.'],
                ],
                'faqs' => [
                    ['question' => 'Can you also apply printed patterns or graphics?', 'answer' => 'Yes. We can map custom textile prints, plaids, and repeat graphics naturally across garment folds and curvature.'],
                ],
                'icon' => 'Sparkles',
                'sort_order' => 2,
                'accent_color' => '#ffd700',
                'meta_title' => 'Apparel Colorway Generation & Color Shift Service | Cutting Edger',
                'meta_description' => 'Outsource apparel colorway generation. Convert a single studio photoshoot into dozens of photo-accurate garment colorways and save 70% on reshoots.',
                'is_noindex' => false,
            ]
        );

        // Sub-page 2.3: Skin Tone Preservation & Color Grading
        Service::updateOrCreate(
            ['slug' => 'skin-tone-color-grading'],
            [
                'parent_id' => $pillar2->id,
                'title' => 'Skin Tone & Color Grading',
                'h1_title' => 'Fashion Skin Tone Preservation & Commercial Color Grading',
                'marquee_label' => 'NATURAL MELANIN PRESERVATION · ZERO COLOR SPILL · EDITORIAL GRADING · BEAUTY RETOUCH',
                'subtitle' => 'Protect organic skin tones during aggressive garment color shifts, campaign grading, and studio lighting edits.',
                'description' => 'In commercial fashion photography, changing garment colors or applying moody atmospheric grades often causes unnatural color spill onto model skin. Our colorists isolate and preserve organic skin undertones, ensuring rich, healthy melanin textures while executing bold campaign color grading.',
                'problem_statement' => 'Aggressive color grading and garment recoloring often creates muddy, plastic, or unnatural skin discoloration on models.',
                'solution_statement' => 'We separate skin tones into dedicated frequency and hue separation channels, maintaining lifelike micro-skin texture and radiant undertones.',
                'features' => [
                    'Multi-Ethnic Melanin Tone Protection & Standardization',
                    'Zero Color Bleed from High-Saturation Garments onto Skin',
                    'Commercial Fashion Campaign Color Grading & Harmonization',
                    'Non-Destructive Frequency Separation Retouching Workflows',
                ],
                'deliverables' => [
                    'High-End Fashion Editorial Master Retouched Files',
                    'Consistent Brand Look & Feel Color Profiles',
                    'Multi-Campaign Lookbook Assets Ready for Web and Print',
                ],
                'process_steps' => [
                    ['step' => '01', 'title' => 'Skin Map Isolation', 'description' => 'Isolating exposed model skin with feathered multi-channel masks.'],
                    ['step' => '02', 'title' => 'Garment Grade Application', 'description' => 'Applying target fashion grades and color adjustments to apparel and scene.'],
                    ['step' => '03', 'title' => 'Undertone Balancing', 'description' => 'Harmonizing warm highlights and natural skin reflectance for a radiant look.'],
                ],
                'faqs' => [
                    ['question' => 'Do you preserve natural freckles, moles, and skin texture?', 'answer' => 'Absolutely. We strictly maintain authentic pores and texture without artificial blurring or plastic airbrushing.'],
                ],
                'icon' => 'Sparkles',
                'sort_order' => 3,
                'accent_color' => '#ffd700',
                'meta_title' => 'Fashion Skin Tone Retouching & Color Grading | Cutting Edger',
                'meta_description' => 'Professional fashion skin tone preservation and commercial color grading. Natural melanin tones and flawless editorial lookbooks.',
                'is_noindex' => false,
            ]
        );

        // Pillar 3: White-Label Agency Extension
        $pillar3 = Service::updateOrCreate(
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

        // Sub-page 3.1: Overnight Batch Retouching
        Service::updateOrCreate(
            ['slug' => 'overnight-batch-retouching'],
            [
                'parent_id' => $pillar3->id,
                'title' => 'Overnight Batch Retouching',
                'h1_title' => '24/7 Overnight Batch Photo Retouching for Creative Studios',
                'marquee_label' => 'CLOSE OF BUSINESS INGEST · 8 AM DELIVERY · FOLLOW-THE-SUN SHIFTS · STRICT NDAS',
                'subtitle' => 'Drop thousands of RAW studio frames at 6:00 PM, wake up to client-ready retouched masters by 8:00 AM.',
                'description' => 'Eliminate overnight studio crunch. Operating round-the-clock across global timezones, our senior production team processes high-volume catalog batches while your internal team sleeps. Accelerate turnaround, satisfy impatient clients, and keep internal creative directors focused on high-level strategy.',
                'problem_statement' => 'Tight client deadlines force agency staff into costly overtime or frantic weekend retouching sprints that hurt morale and work quality.',
                'solution_statement' => 'We leverage time zone differences to deliver overnight post-production cycles, returning polished files within 12 to 24 hours guaranteed.',
                'features' => [
                    'Guaranteed 12-to-24-Hour Overnight Turnaround SLAs',
                    'Multi-Shift Round-the-Clock Global Production Capacity',
                    'Direct Hot-Folder Integration via Aspera, Dropbox, and Google Drive',
                    'Zero Metadata Footprint and Complete White-Label Anonymity',
                ],
                'deliverables' => [
                    'Print and Web Ready Retouched Master PSDs & TIFFs',
                    'Batch QA Checklists Signed by Senior Retouching Leads',
                    'Real-Time Dashboard Progress Tracking for Account Directors',
                ],
                'process_steps' => [
                    ['step' => '01', 'title' => 'Evening Ingestion', 'description' => 'Automated ingestion of RAW assets from your secure shared studio server.'],
                    ['step' => '02', 'title' => 'Overnight Execution', 'description' => 'Multi-seat team executes clipping, retouching, and color standardization.'],
                    ['step' => '03', 'title' => 'Morning Delivery', 'description' => 'Files undergo two-tier QA and sync back to your folders before 8:00 AM.'],
                ],
                'faqs' => [
                    ['question' => 'What if an urgent rush job requires 6-hour delivery?', 'answer' => 'We offer expedited emergency turnaround options for active retainers and priority agency clients.'],
                ],
                'icon' => 'Clock',
                'sort_order' => 1,
                'accent_color' => '#7000ff',
                'meta_title' => 'Overnight Batch Photo Retouching Service | Cutting Edger',
                'meta_description' => 'Overnight batch photo retouching for creative agencies. 12-hour turnaround, follow-the-sun shifts, and billboard-grade quality under strict NDA.',
                'is_noindex' => false,
            ]
        );

        // Sub-page 3.2: Dedicated Retoucher Teams
        Service::updateOrCreate(
            ['slug' => 'dedicated-retoucher-teams'],
            [
                'parent_id' => $pillar3->id,
                'title' => 'Dedicated Retoucher Teams',
                'h1_title' => 'Dedicated Retoucher Teams & White-Label Post-Production Pods',
                'marquee_label' => 'EXCLUSIVE TALENT SEATS · EMBEDDED SLACK WORKFLOW · CONSISTENT ARTISTRY · FLEXIBLE SCALING',
                'subtitle' => 'Exclusive retouchers dedicated 100% to your agency, trained on your exact style guides and embedded in your team.',
                'description' => 'Freelancers come and go, taking institutional knowledge with them. Secure a dedicated team of elite digital retouchers and 3D artists who work exclusively on your brand roster, integrated seamlessly into your project management tools (Slack, Teams, ClickUp, Asana).',
                'problem_statement' => 'Hiring local retouching staff carries massive overhead, while juggling ad-hoc freelancers leads to wildly inconsistent aesthetic handwriting.',
                'solution_statement' => 'We assign a dedicated, vetted pod of retouchers and an English-fluent Team Lead who master your style guidelines and remain your permanent crew.',
                'features' => [
                    '100% Dedicated Full-Time Talent (Zero Shared Allocation)',
                    'Direct Real-Time Collaboration in Your Slack or Microsoft Teams',
                    'Consistent Style Handwriting Across Multi-Year Campaigns',
                    'Flexible Monthly Seat Scaling to Match Campaign Volume Peaks',
                ],
                'deliverables' => [
                    'Dedicated Production Capacity Reserved 5 Days a Week',
                    'Daily Standup Worklogs and Velocity Tracking',
                    'Comprehensive Brand Retouching SOP Documentation',
                ],
                'process_steps' => [
                    ['step' => '01', 'title' => 'Style Calibration', 'description' => 'Deep-dive onboarding with your Art Director to document retouching aesthetics.'],
                    ['step' => '02', 'title' => 'Workflow Integration', 'description' => 'Inviting dedicated artists to your communication channels and asset servers.'],
                    ['step' => '03', 'title' => 'Continuous Production', 'description' => 'High-throughput daily production with compounding efficiency over time.'],
                ],
                'faqs' => [
                    ['question' => 'Can we interview and approve retouchers before they start?', 'answer' => 'Yes. You can test and review candidate portfolios to ensure their craftsmanship aligns with your creative expectations.'],
                ],
                'icon' => 'Users',
                'sort_order' => 2,
                'accent_color' => '#7000ff',
                'meta_title' => 'Dedicated Retoucher Teams for Creative Agencies | Cutting Edger',
                'meta_description' => 'Hire dedicated photo retouchers embedded in your agency workflow. Full-time dedicated post-production artists trained on your brand guidelines.',
                'is_noindex' => false,
            ]
        );

        // Sub-page 3.3: High-Volume Retainer SLAs
        Service::updateOrCreate(
            ['slug' => 'volume-retainer-slas'],
            [
                'parent_id' => $pillar3->id,
                'title' => 'High-Volume Retainer SLAs',
                'h1_title' => 'Enterprise High-Volume Photo Retouching Retainer SLAs',
                'marquee_label' => 'VOLUME DISCOUNTS UP TO 40% · GUARANTEED QUEUE PRIORITY · CUSTOM SLAS · SINGLE INVOICE',
                'subtitle' => 'Volume-tiered contracts, preferential queue reservations, and custom disaster-recovery SLAs for enterprise studios.',
                'description' => 'Designed for commercial photo studios and e-commerce aggregators processing 5,000 to 50,000+ assets every month. Lock in enterprise-level cost efficiencies, guaranteed throughput during peak shopping seasons, and clear contractual Service Level Agreements.',
                'problem_statement' => 'Enterprise studios face unpredictable seasonal surges during Q4 holidays and spring collection drops, risking missed deadlines and budget overruns.',
                'solution_statement' => 'Our retainer SLAs lock in capacity reserves, fixed discounted per-image rates, and contractually binding quality and turnaround guarantees.',
                'features' => [
                    'Volume Discount Tiers (Save 30% to 45% Over Ad-Hoc Rates)',
                    'Contractual Quality and Turnaround SLA Guarantees',
                    'Guaranteed Peak Season Surge Capacity (Black Friday / Cyber Week)',
                    'Consolidated Monthly Billing with Detailed SKU Analytics',
                ],
                'deliverables' => [
                    'Signed Enterprise Service Level Agreement (SLA)',
                    'Dedicated Account Executive & Senior Quality Lead',
                    'Monthly Asset Velocity and Error-Rate Performance Scorecards',
                ],
                'process_steps' => [
                    ['step' => '01', 'title' => 'Capacity Forecasting', 'description' => 'Analyzing historical SKU volumes and projecting peak season surges.'],
                    ['step' => '02', 'title' => 'Custom SLA Tailoring', 'description' => 'Establishing turnaround windows, file specifications, and QA thresholds.'],
                    ['step' => '03', 'title' => 'Production Execution', 'description' => 'Guaranteed queue priority with continuous delivery and monthly billing.'],
                ],
                'faqs' => [
                    ['question' => 'Do unused retainer credits roll over?', 'answer' => 'Yes, our enterprise contracts include flexible quarterly rollover allowances to accommodate seasonal ebbs and flows.'],
                ],
                'icon' => 'Shield',
                'sort_order' => 3,
                'accent_color' => '#7000ff',
                'meta_title' => 'Enterprise High-Volume Photo Editing Retainers | Cutting Edger',
                'meta_description' => 'High-volume photo retouching retainers for enterprise brands and commercial studios. Guaranteed SLAs, volume pricing, and priority capacity.',
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

        // Sub-page 4.2: 3D Product CGI Studio
        Service::updateOrCreate(
            ['slug' => '3d-product-cgi-studio'],
            [
                'parent_id' => $pillar4->id,
                'title' => '3D Product CGI Studio',
                'h1_title' => 'Photorealistic 3D Product Rendering & Digital Studio Staging',
                'marquee_label' => 'CAD TO 8K RENDER · SUB-SURFACE SCATTERING · EXPLODED VIEWS · PACKAGING CGI',
                'subtitle' => 'Transform industrial CAD models into breathtaking 8K commercial product renders and macro studio shots.',
                'description' => 'Escape the limitations of physical cameras. We build ultra-realistic 3D CGI product renders for cosmetics, consumer electronics, beverage packaging, and hardware. Simulate complex glass refraction, metallic sheen, brushed finishes, and dynamic liquid droplets with zero set construction.',
                'problem_statement' => 'Photographing reflective glass, chrome finishes, and unreleased product prototypes in physical studios results in glare, dust flaws, and leak risks.',
                'solution_statement' => 'We rebuild clean CAD topology with physics-based PBR materials and procedural lighting rigs, creating billboard-quality assets before manufacturing finishes.',
                'features' => [
                    'CAD, STEP, IGES, and SolidWorks Quad Retopology',
                    'Photorealistic PBR Materials (Glass, Liquid, Chrome, Matte Plastics)',
                    '8K Ultra-HD Macro Renders & Exploded-View Animations',
                    'Custom Environmental Studio HDRI Lighting Rigs',
                ],
                'deliverables' => [
                    'Multi-Pass 8K Master Renders (Beauty, Diffuse, Depth, Normal)',
                    'Transparent PNG Product Silhouette Cutouts',
                    'Dynamic Exploded Engineering Render Animations',
                ],
                'process_steps' => [
                    ['step' => '01', 'title' => 'CAD Optimization', 'description' => 'Converting dense engineering CAD meshes into clean subdivision quad geometry.'],
                    ['step' => '02', 'title' => 'PBR Shader Creation', 'description' => 'Applying accurate optical properties, index of refraction, and surface roughness.'],
                    ['step' => '03', 'title' => 'Lighting Rig & Render', 'description' => 'Balancing studio softboxes and executing multi-pass ray-traced rendering.'],
                ],
                'faqs' => [
                    ['question' => 'Can you render products before manufacturing is completed?', 'answer' => 'Yes! We only require CAD 3D blueprints or technical dimensional drawings to build fully photorealistic renders for pre-launch marketing.'],
                ],
                'icon' => 'Box',
                'sort_order' => 2,
                'accent_color' => '#ff6b35',
                'meta_title' => 'Photorealistic 3D Product Rendering & CGI Studio | Cutting Edger',
                'meta_description' => 'Commercial 3D product rendering studio. Transform CAD drawings into hyper-realistic 8K renders for electronics, cosmetics, and packaging.',
                'is_noindex' => false,
            ]
        );

        // Sub-page 4.3: Interactive 360° WebGL Spins
        Service::updateOrCreate(
            ['slug' => 'interactive-360-webgl-spins'],
            [
                'parent_id' => $pillar4->id,
                'title' => 'Interactive 360° WebGL Spins',
                'h1_title' => 'Interactive 360° Product Turntable Spins & WebGL 3D Models',
                'marquee_label' => 'SHOPIFY 3D · APPLE QUICK LOOK AR · SUB-3MB COMPRESSION · 60 FPS MOBILE RENDERING',
                'subtitle' => 'Web-optimized GLTF/GLB 3D models and smooth 360-degree turntable spins for high-converting e-commerce.',
                'description' => 'Empower online shoppers to rotate, zoom, and inspect your products from every possible angle. We deliver lightweight, real-time 3D models and interactive 360° image sequences with fast load times, direct Shopify 3D viewer support, and native iOS AR Quick Look compatibility.',
                'problem_statement' => 'Static 2D photos leave customer questions unanswered, leading to hesitation, lower conversion rates, and higher returns.',
                'solution_statement' => 'We create ultra-compact, high-performance WebGL 3D models under 3MB that load instantaneously and boost shopper engagement by up to 250%.',
                'features' => [
                    'Shopify 3D & Amazon AR Certified GLTF / GLB File Exports',
                    'Native iOS Safari Apple Quick Look USDZ Formatting',
                    'Smooth 72-Frame 360° WebP Turntable Image Sequences',
                    'Sub-3MB Lightweight Compression for Zero Page Speed Penalty',
                ],
                'deliverables' => [
                    'Production GLTF/GLB Real-Time 3D Mesh with Baked PBR Textures',
                    'Optimized Apple USDZ File for Augmented Reality',
                    'Full Interactive 360° Turntable Sequence Pack',
                ],
                'process_steps' => [
                    ['step' => '01', 'title' => 'Mesh Optimization', 'description' => 'Decimating polygon counts while preserving silhouette smoothness.'],
                    ['step' => '02', 'title' => 'Texture Baking', 'description' => 'Baking normal, ambient occlusion, and roughness maps into compact textures.'],
                    ['step' => '03', 'title' => 'Cross-Platform AR QA', 'description' => 'Testing in Shopify 3D viewer and iOS/Android AR environments.'],
                ],
                'faqs' => [
                    ['question' => 'Will 3D models slow down my Shopify storefront?', 'answer' => 'No. We rigorously optimize draw calls and compress textures using Draco / KTX2 algorithms so the entire 3D asset loads under 3MB.'],
                ],
                'icon' => 'Sparkles',
                'sort_order' => 3,
                'accent_color' => '#ff6b35',
                'meta_title' => 'Interactive 360 Product Spins & WebGL 3D Models | Cutting Edger',
                'meta_description' => 'Outsource interactive 360 product turntable spins and lightweight WebGL 3D models for Shopify and Amazon AR shopping.',
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
