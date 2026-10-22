<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Client;
use App\Models\Faq;
use App\Models\Job;
use App\Models\PricingPlan;
use App\Models\Project;
use App\Models\Service;
use App\Models\TeamMember;
use App\Models\Testimonial;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(RoleAndSuperAdminSeeder::class);

        // 1. Portfolio & Service Categories
        $catCutout = Category::firstOrCreate(['slug' => 'image-editing'], ['name' => '2D Image Editing & Cutout', 'type' => 'work']);
        $catRetouch = Category::firstOrCreate(['slug' => 'fashion-retouching'], ['name' => 'High-End Fashion & Jewelry', 'type' => 'work']);
        $catSpatial = Category::firstOrCreate(['slug' => '3d-cgi-modeling'], ['name' => '3D CGI & Product Modeling', 'type' => 'work']);
        $catDtp = Category::firstOrCreate(['slug' => 'desktop-publishing'], ['name' => 'Desktop Publishing (DTP)', 'type' => 'work']);

        // 2. Featured Real-World Case Studies
        Project::create([
            'category_id' => $catRetouch->id,
            'title' => 'Nordic Luxury Outerwear Ghost Mannequin',
            'slug' => 'nordic-outerwear-ghost-mannequin',
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
        ]);

        Project::create([
            'category_id' => $catRetouch->id,
            'title' => 'Diamond & Fine Jewelry Macro Retouch Series',
            'slug' => 'diamond-jewelry-macro-retouch',
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
        ]);

        Project::create([
            'category_id' => $catSpatial->id,
            'title' => '3D CGI Furniture Modeling & Architectural Rendering',
            'slug' => '3d-cgi-furniture-modeling',
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
        ]);

        Project::create([
            'category_id' => $catCutout->id,
            'title' => 'Global Footwear Multipath & Colorway Isolation',
            'slug' => 'footwear-multipath-colorway',
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
        ]);

        // 3. Core Services
        Service::create([
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
        ]);

        Service::create([
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
        ]);

        Service::create([
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
        ]);

        Service::create([
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
        ]);

        Service::create([
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
        ]);

        Service::create([
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
        ]);

        // 4. Real Enterprise Clients (From CuttingEdger live portfolio)
        $clients = [
            [
                'name' => 'Pet Supplies Plus',
                'url' => 'https://www.petsuppliesplus.com/',
                'logo_dark' => 'https://www.cuttingedger.com/images/source/clients/PetSupply.webp',
                'logo_light' => 'https://www.cuttingedger.com/images/source/clients/PetSupply.webp',
                'marquee_row' => 1,
                'sort_order' => 1,
            ],
            [
                'name' => 'Melie Bianco',
                'url' => 'https://www.meliebianco.com/',
                'logo_dark' => 'https://www.cuttingedger.com/images/source/clients/Meiliebianco.webp',
                'logo_light' => 'https://www.cuttingedger.com/images/source/clients/Meiliebianco.webp',
                'marquee_row' => 1,
                'sort_order' => 2,
            ],
            [
                'name' => 'Haglöfs',
                'url' => 'https://www.haglofs.com/en',
                'logo_dark' => 'https://www.cuttingedger.com/images/source/clients/Haglofs.webp',
                'logo_light' => 'https://www.cuttingedger.com/images/source/clients/Haglofs.webp',
                'marquee_row' => 1,
                'sort_order' => 3,
            ],
            [
                'name' => 'Kenny Pools',
                'url' => 'http://www.kennypools.com/',
                'logo_dark' => 'https://www.cuttingedger.com/images/source/clients/Kenny.webp',
                'logo_light' => 'https://www.cuttingedger.com/images/source/clients/Kenny.webp',
                'marquee_row' => 1,
                'sort_order' => 4,
            ],
            [
                'name' => 'G3 Studios',
                'url' => 'https://g3studios.net/',
                'logo_dark' => 'https://www.cuttingedger.com/images/source/clients/G3Norbert.webp',
                'logo_light' => 'https://www.cuttingedger.com/images/source/clients/G3Norbert.webp',
                'marquee_row' => 1,
                'sort_order' => 5,
            ],
            [
                'name' => 'Felgenoutlet',
                'url' => 'https://www.felgenoutlet.com/en/',
                'logo_dark' => 'https://www.cuttingedger.com/images/source/clients/logo_fo-300x300.png',
                'logo_light' => 'https://www.cuttingedger.com/images/source/clients/logo_fo-300x300.png',
                'marquee_row' => 1,
                'sort_order' => 6,
            ],
            [
                'name' => 'Drykorn',
                'url' => 'https://drykorn.com/en-int/',
                'logo_dark' => 'https://www.cuttingedger.com/images/source/clients/Drykorn.webp',
                'logo_light' => 'https://www.cuttingedger.com/images/source/clients/Drykorn.webp',
                'marquee_row' => 2,
                'sort_order' => 7,
            ],
            [
                'name' => 'Naked Cashmere',
                'url' => 'https://www.nakedcashmere.com/',
                'logo_dark' => 'https://www.cuttingedger.com/images/source/clients/logo-nc-300x300.png',
                'logo_light' => 'https://www.cuttingedger.com/images/source/clients/logo-nc-300x300.png',
                'marquee_row' => 2,
                'sort_order' => 8,
            ],
            [
                'name' => 'Bambini Fashion',
                'url' => 'https://bambinifashion.com/',
                'logo_dark' => 'https://www.cuttingedger.com/images/source/clients/BambiniFashion.webp',
                'logo_light' => 'https://www.cuttingedger.com/images/source/clients/BambiniFashion.webp',
                'marquee_row' => 2,
                'sort_order' => 9,
            ],
            [
                'name' => 'aCommerce',
                'url' => 'https://www.acommerce.asia/',
                'logo_dark' => 'https://www.cuttingedger.com/images/source/clients/aCommerce.webp',
                'logo_light' => 'https://www.cuttingedger.com/images/source/clients/aCommerce.webp',
                'marquee_row' => 2,
                'sort_order' => 10,
            ],
            [
                'name' => 'Batik Boutique',
                'url' => 'https://global.batikboutique.com/en-int',
                'logo_dark' => 'https://www.cuttingedger.com/images/source/clients/bb-logo-300x300.png',
                'logo_light' => 'https://www.cuttingedger.com/images/source/clients/bb-logo-300x300.png',
                'marquee_row' => 2,
                'sort_order' => 11,
            ],
            [
                'name' => 'D1 Milano',
                'url' => 'https://d1milano.com/',
                'logo_dark' => 'https://www.cuttingedger.com/images/source/clients/logo-shopmilano-300x300.png',
                'logo_light' => 'https://www.cuttingedger.com/images/source/clients/logo-shopmilano-300x300.png',
                'marquee_row' => 2,
                'sort_order' => 12,
            ],
        ];

        foreach ($clients as $clientData) {
            Client::create($clientData);
        }

        // 5. Authentic Client Testimonials
        Testimonial::create([
            'client_name' => 'Markus Weber',
            'client_role' => 'Global Head of E-Commerce Production',
            'client_company' => 'Haglöfs',
            'avatar' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
            'quote' => 'CuttingEdger processes our seasonal catalog of over 4,500 apparel SKUs with zero defect tolerance. Their ghost mannequin neck joints and symmetrical alignment have elevated our online store conversion rates dramatically.',
            'rating' => 5,
            'featured' => true,
        ]);

        Testimonial::create([
            'client_name' => 'Melissa Bianco',
            'client_role' => 'Creative Director',
            'client_company' => 'Melie Bianco',
            'avatar' => 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
            'quote' => 'Their jewelry and handbag retouching is nothing short of sorcery. They bring out the rich texture of vegan leather and eliminate harsh reflections on metallic hardware with sub-12 hour turnaround.',
            'rating' => 5,
            'featured' => true,
        ]);

        Testimonial::create([
            'client_name' => 'Stefan Müller',
            'client_role' => 'Director of Digital Assets',
            'client_company' => 'Felgenoutlet',
            'avatar' => 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
            'quote' => 'CuttingEdger handled over 10,000 automobile alloy wheel cutouts and 3D reflections for our German configurator. Flawless hand-drawn clipping paths and incredible communication around the clock.',
            'rating' => 5,
            'featured' => true,
        ]);

        // 6. Transparent Volume E-Commerce Pricing Plans
        PricingPlan::create([
            'name' => 'Starter Trial & Single Batch',
            'slug' => 'starter-trial',
            'headline' => 'Ideal for sampling quality or small boutique collections',
            'price' => '$0.80',
            'billing_cycle' => 'per image · min. 10 images',
            'features' => [
                'Free 3-image trial with zero upfront cost',
                '100% hand-drawn pen tool clipping paths',
                'Basic color balance & background replacement',
                'Standard 24-hour turnaround SLA',
                'Unlimited revisions until 100% satisfied',
            ],
            'is_popular' => false,
            'cta_text' => 'Try 3 Images Free',
            'sort_order' => 1,
        ]);

        PricingPlan::create([
            'name' => 'High-Volume E-Commerce',
            'slug' => 'high-volume-ecommerce',
            'headline' => 'Engineered for fashion brands, Shopify stores & Amazon sellers',
            'price' => '$0.45',
            'billing_cycle' => 'per image · 500+ SKU batches',
            'features' => [
                'Ghost mannequin & complex multipath cutouts',
                'Jewelry, accessories & model skin retouching',
                'Guaranteed 12-hour batch delivery SLA',
                'Dedicated Senior Quality Assurance Manager',
                'Custom export specs (JPG, PNG, Layered PSD)',
                'Automated FTP, Dropbox & Google Drive sync',
            ],
            'is_popular' => true,
            'cta_text' => 'Request Volume Quote',
            'sort_order' => 2,
        ]);

        PricingPlan::create([
            'name' => 'Enterprise Dedicated Studio',
            'slug' => 'enterprise-studio',
            'headline' => 'Dedicated retouchers & 3D artists seamlessly embedded in your workflow',
            'price' => '$0.35',
            'billing_cycle' => 'per image · 2,500+ SKU monthly volume',
            'features' => [
                'Dedicated squad of 5–25 certified Photoshop artists',
                'Sub-6 hour rush turnaround available on demand',
                '3D CGI modeling & 360° interactive product spins',
                'Direct communication via Slack, Teams, or WhatsApp',
                'Custom API integration & automated Webhook pipeline',
                'Strict enterprise NDA & secure cloud asset hosting',
            ],
            'is_popular' => false,
            'cta_text' => 'Talk To Enterprise Lead',
            'sort_order' => 3,
        ]);

        // 7. Practical Studio FAQs
        Faq::create([
            'category' => 'Free Trial',
            'question' => 'How does the Free Trial work?',
            'answer' => 'You can upload up to 3 test images directly through our website with no credit card required. We will process them according to your exact specifications and deliver them back within 12 to 24 hours so you can inspect our quality firsthand.',
            'sort_order' => 1,
        ]);

        Faq::create([
            'category' => 'Quality & Revisions',
            'question' => 'What if I need adjustments or revisions on my delivered images?',
            'answer' => 'We offer 100% free unlimited revisions until you are completely satisfied. Each batch is reviewed by a dedicated Quality Assurance manager before delivery to ensure zero clipping errors or color shifts.',
            'sort_order' => 2,
        ]);

        Faq::create([
            'category' => 'Turnaround & Capacity',
            'question' => 'What is your daily production capacity and turnaround time?',
            'answer' => 'Our 24/7/365 production facility in Dhaka employs over 100+ trained retouching artists, processing over 10,000+ images daily. Standard turnaround is 12 to 24 hours, with rush 4 to 6-hour emergency delivery available for enterprise partners.',
            'sort_order' => 3,
        ]);

        Faq::create([
            'category' => 'Security & Privacy',
            'question' => 'Are my unreleased product photos kept confidential?',
            'answer' => 'Absolutely. We sign binding Non-Disclosure Agreements (NDAs) with all commercial clients. Your images are transmitted over encrypted TLS connections, stored in isolated private containers, and never shared or used in promotional materials without explicit consent.',
            'sort_order' => 4,
        ]);

        // 8. Studio Leadership
        TeamMember::create([
            'name' => 'Rayhanul Sumon',
            'email' => 'sumon@cuttingedger.com',
            'slug' => 'rayhanul-sumon',
            'role' => 'Founder & Managing Director',
            'since_year' => 2019,
            'bio' => 'Pioneered CuttingEdger from a boutique retouching facility into an international post-production engine trusted by over 170+ global retail and e-commerce brands.',
            'avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
            'social_links' => ['linkedin' => 'https://www.linkedin.com/company/cutting-edger/'],
            'featured' => true,
            'sort_order' => 1,
        ]);

        TeamMember::create([
            'name' => 'Naveen Chowdhury',
            'email' => 'naveen@cuttingedger.com',
            'slug' => 'naveen-chowdhury',
            'role' => 'Head of Quality Assurance & Operations',
            'since_year' => 2020,
            'bio' => 'Oversees our multi-tiered QA inspection pipeline, ensuring every clipping path, ghost mannequin joint, and jewelry sparkle meets exacting international specifications.',
            'avatar' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
            'social_links' => ['linkedin' => 'https://linkedin.com'],
            'featured' => true,
            'sort_order' => 2,
        ]);

        TeamMember::create([
            'name' => 'Farhana Kabir',
            'email' => 'farhana@cuttingedger.com',
            'slug' => 'farhana-kabir',
            'role' => 'Lead 3D & CGI Visualization Artist',
            'since_year' => 2021,
            'bio' => 'Specializes in CAD-to-mesh digital twin modeling, PBR texture synthesis, and interactive WebGL assets for enterprise furniture and consumer hardware brands.',
            'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
            'social_links' => ['linkedin' => 'https://linkedin.com'],
            'featured' => true,
            'sort_order' => 3,
        ]);

        TeamMember::create([
            'name' => 'Tariqul Islam',
            'email' => 'tariqul@cuttingedger.com',
            'slug' => 'tariqul-islam',
            'role' => 'Lead Clipping Path & Vector Specialist',
            'since_year' => 2021,
            'bio' => 'Directs our high-speed vector cutout division, specializing in complex hair masking, multi-layered paths, and zero-defect Amazon/Shopify compliance.',
            'avatar' => 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80',
            'social_links' => ['linkedin' => 'https://linkedin.com'],
            'featured' => true,
            'sort_order' => 4,
        ]);

        TeamMember::create([
            'name' => 'Tanvir Ahmed',
            'email' => 'tanvir@cuttingedger.com',
            'slug' => 'tanvir-ahmed',
            'role' => 'Production Logistics & Client Delivery Lead',
            'since_year' => 2022,
            'bio' => 'Coordinates 24/7 client delivery pipelines across North America and Europe, guaranteeing strict SLA adherence for high-volume enterprise batches.',
            'avatar' => 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
            'social_links' => ['linkedin' => 'https://linkedin.com'],
            'featured' => true,
            'sort_order' => 5,
        ]);

        // 9. Career Openings
        Job::create([
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
        ]);

        Job::create([
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
        ]);

        // 10. Blogs & Dynamic SEO Suite
        $this->call(BlogSeeder::class);

        // 11. Initial Production & Trial Orders
        $this->call(OrderSeeder::class);
    }
}
