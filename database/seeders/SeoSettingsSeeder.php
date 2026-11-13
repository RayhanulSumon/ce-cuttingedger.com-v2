<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Redirect;
use App\Models\Setting;
use App\Models\TrackingScript;
use Illuminate\Database\Seeder;

class SeoSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // -------------------------------------------------------------
        // 2. SEED SYSTEM REDIRECTS (LEGACY + NEW PILLARS MIGRATION)
        // -------------------------------------------------------------
        $redirectsMap = [
            // Old /work route to SEO plan /case-studies
            '/work' => '/case-studies',

            // 2D
            '/photo-background-removal-services' => '/capabilities/2d/background-removal',
            '/best-clipping-path-service' => '/capabilities/2d/background-removal',
            '/invisible-mannequin' => '/capabilities/2d/ghost-mannequin',
            '/photo-hollow-man-services' => '/capabilities/2d/ghost-mannequin',
            '/image-masking-service' => '/capabilities/2d/image-masking',
            '/photo-high-end-model-retouch-services' => '/capabilities/2d/fashion-beauty-retouching',
            '/photo-lingerie-model-retouch-services' => '/capabilities/2d/fashion-beauty-retouching',
            '/photo-semi-nude-or-calendar-model-retouch-services' => '/capabilities/2d/fashion-beauty-retouching',
            '/photo-face-swapping-services' => '/capabilities/2d/fashion-beauty-retouching',
            '/photo-jewelry-retouch-services' => '/capabilities/2d/jewelry-retouching',
            '/photo-color-correction-services' => '/capabilities/2d/color-correction',
            '/photo-harmonization-services' => '/capabilities/2d/color-correction',
            '/shadow-creation-service' => '/capabilities/2d/shadows-reflections',
            '/photo-reflection-creation-services' => '/capabilities/2d/shadows-reflections',
            '/photo-lifestyle-retouch-services' => '/capabilities/2d',
            '/photo-automobile-retouch-services' => '/capabilities/2d',
            '/photo-accessories-retouch-services' => '/capabilities/2d',
            '/photo-shoe-retouch-services' => '/capabilities/2d',
            '/photo-image-restoration-services' => '/capabilities/2d',
            '/photo-retouching-outsourcing' => '/capabilities/2d',

            // 3D
            '/3D/3d-modeling-and-rendering-service' => '/capabilities/3d/3d-modeling',
            '/3d/3d-modeling-and-rendering-service' => '/capabilities/3d/3d-modeling',
            '/3d-furniture-modeling' => '/capabilities/3d/3d-modeling',
            '/photo-manipulation-services' => '/capabilities/3d',
            '/ai-concept-art-and-illustration-services' => '/capabilities/3d',

            // DTP
            '/multilingual-typesetting-and-formatting-services' => '/capabilities/dtp/multilingual-typesetting',
            '/brand-identity-services' => '/capabilities/dtp',
            '/presentation-services' => '/capabilities/dtp',
            '/adaption-services' => '/capabilities/dtp',
            '/data-entry-services' => '/capabilities/dtp',

            // Orders & legacy pages
            '/option/free-trial' => '/#free-trial',
            '/option/order' => '/pricing',
            '/page/aboutus' => '/about',
            '/page/contact' => '/contact',
            '/page/pricing' => '/pricing',
            '/page/faqs' => '/?section=faq',
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
            'contact_phones' => 'USA | +1 (409) 995-2565',
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
