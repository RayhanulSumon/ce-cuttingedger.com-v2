<?php

namespace Database\Seeders;

use App\Models\Category;
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

        // 1. Portfolio Categories
        $catEng = Category::firstOrCreate(['slug' => 'creative-engineering'], ['name' => 'Creative Engineering', 'type' => 'work']);
        $catBrand = Category::firstOrCreate(['slug' => 'brand-architecture'], ['name' => 'Brand Architecture', 'type' => 'work']);
        $catSpatial = Category::firstOrCreate(['slug' => '3d-spatial'], ['name' => '3D & Spatial', 'type' => 'work']);
        $catProduct = Category::firstOrCreate(['slug' => 'product-design'], ['name' => 'Product Design', 'type' => 'work']);

        // 2. Featured Projects
        Project::create([
            'category_id' => $catEng->id,
            'title' => 'Kinetix OS',
            'slug' => 'kinetix-os',
            'client_name' => 'Kinetix Systems',
            'year' => '2026',
            'summary' => 'A revolutionary spatial interface and kinetic design system engineered for the next generation of ambient computing hardware.',
            'description' => 'Kinetix OS required a complete re-imagining of operating system paradigms. Moving beyond skeuomorphism and flat surfaces, we sculpted a volumetric design language with sub-millisecond interaction feedback, real-time light refraction, and procedural audio feedback loops.',
            'cover_image' => 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1400&q=80',
            'gallery' => [
                'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
            ],
            'deliverables' => ['Design System', 'Spatial UI/UX', 'Kinetic Shaders', 'Audio Design'],
            'featured' => true,
            'sort_order' => 1,
            'metrics' => [
                ['label' => 'Interaction Latency', 'value' => '< 12ms'],
                ['label' => 'App Ecosystem Growth', 'value' => '+340%'],
                ['label' => 'Awwwards Score', 'value' => '9.2 / 10'],
            ],
            'meta_title' => 'Kinetix OS Case Study — CuttingEdger',
            'meta_description' => 'How CuttingEdger engineered a spatial operating system interface for next-gen computing.',
            'live_url' => 'https://cuttingedger.com',
        ]);

        Project::create([
            'category_id' => $catSpatial->id,
            'title' => 'Hyperion Audio',
            'slug' => 'hyperion-audio',
            'client_name' => 'Hyperion Acoustic Labs',
            'year' => '2025',
            'summary' => 'Sculptural acoustic hardware brand identity accompanied by an interactive 3D WebGL sound visualizer and global e-commerce flagship.',
            'description' => 'Hyperion produces $20,000 audiophile monitoring speakers. Our task was to make sound physically tangible on screen through dynamic shader frequencies, bespoke typography inspired by mechanical brass tuning forks, and frictionless luxury commerce.',
            'cover_image' => 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?auto=format&fit=crop&w=1400&q=80',
            'gallery' => [
                'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80',
            ],
            'deliverables' => ['Brand Identity', '3D WebGL Configurator', 'Luxury E-Commerce', 'Creative Direction'],
            'featured' => true,
            'sort_order' => 2,
            'metrics' => [
                ['label' => 'Conversion Rate', 'value' => '4.8%'],
                ['label' => 'Pre-Orders Sold Out', 'value' => '48 Hours'],
                ['label' => 'Average Order Value', 'value' => '$14,200'],
            ],
            'meta_title' => 'Hyperion Audio Case Study — CuttingEdger',
            'meta_description' => 'Acoustic luxury brand and 3D WebGL soundstage engineered by CuttingEdger.',
            'live_url' => 'https://cuttingedger.com',
        ]);

        Project::create([
            'category_id' => $catProduct->id,
            'title' => 'Aura Robotics',
            'slug' => 'aura-robotics',
            'client_name' => 'Aura Dynamics',
            'year' => '2025',
            'summary' => 'Tactile mission-control interface and human-machine teleoperation cockpit for autonomous planetary rovers.',
            'description' => 'Teleoperating multi-ton autonomous robots across hazardous environments leaves zero room for visual ambiguity. We architected a high-contrast ergonomic telemetry cockpit with instantaneous telemetry graphing, predictive path corridors, and failsafe gestures.',
            'cover_image' => 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1400&q=80',
            'gallery' => [
                'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1200&q=80',
            ],
            'deliverables' => ['Mission Control UI', 'Telemetry Architecture', 'Tactile Design System', 'Hardware Ergonomics'],
            'featured' => true,
            'sort_order' => 3,
            'metrics' => [
                ['label' => 'Operator Fatigue Reduction', 'value' => '42%'],
                ['label' => 'Emergency Response Time', 'value' => '0.18s'],
                ['label' => 'Fleet Deployment', 'value' => '2,400 Units'],
            ],
            'meta_title' => 'Aura Robotics Telemetry Cockpit — CuttingEdger',
            'meta_description' => 'Mission-critical teleoperation interface for autonomous robotics.',
            'live_url' => 'https://cuttingedger.com',
        ]);

        Project::create([
            'category_id' => $catBrand->id,
            'title' => 'Vortex Protocol',
            'slug' => 'vortex-protocol',
            'client_name' => 'Vortex Capital',
            'year' => '2025',
            'summary' => 'Comprehensive brand architecture, bespoke kinetic typography, and high-frequency trading terminal for institutional liquidity providers.',
            'description' => 'Vortex bridges traditional quantitative hedge funds with decentralized algorithmic liquidity. We built a monolithic brand identity rooted in cryptographic precision, backed by a microsecond-level terminal interface built with WebAssembly and WebSockets.',
            'cover_image' => 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=1400&q=80',
            'gallery' => [
                'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
            ],
            'deliverables' => ['Brand Strategy', 'Visual Identity', 'Algorithmic UI', 'Typeface Design'],
            'featured' => true,
            'sort_order' => 4,
            'metrics' => [
                ['label' => 'Daily Volume Handled', 'value' => '$1.2B'],
                ['label' => 'Execution Speed', 'value' => '4ms'],
                ['label' => 'Institutional Retention', 'value' => '98.5%'],
            ],
            'meta_title' => 'Vortex Protocol Brand & Terminal — CuttingEdger',
            'meta_description' => 'Cryptographic institutional trading terminal and brand system.',
            'live_url' => 'https://cuttingedger.com',
        ]);

        // 3. Services
        Service::create([
            'title' => 'Product Design & Design Systems',
            'slug' => 'product-design',
            'marquee_label' => 'DESIGN SYSTEMS · PROTOTYPES · MULTI-PLATFORM UX',
            'subtitle' => 'Architecting scalable digital products that users obsess over.',
            'description' => 'We don’t just draw wireframes; we craft comprehensive, token-driven component ecosystems that harmonize product, brand, and code. From zero-to-one SaaS apps to multi-platform enterprise suites, we optimize for intuition, velocity, and delight.',
            'features' => ['Modular Token Architecture', 'Complex Workflow Simplification', 'Micro-Interactions & Feedback Loops', 'WCAG 2.2 AA Compliance'],
            'deliverables' => ['Figma Component Library', 'Design Tokens (Tailwind/CSS)', 'Interactive Prototypes', 'UX Research & User Journeys'],
            'icon' => 'Layers',
            'sort_order' => 1,
            'accent_color' => '#d4ff00',
        ]);

        Service::create([
            'title' => 'Brand Architecture & Spatial Identity',
            'slug' => 'brand-architecture',
            'marquee_label' => 'VERBAL IDENTITY · BESPOKE TYPE · KINETIC GUIDELINES',
            'subtitle' => 'Defining category leaders through fearless visual and verbal positioning.',
            'description' => 'Great brands are unmistakable cultural artifacts. We build comprehensive brand worlds encompassing logo marks, custom typography, provocative voice & tone, physical packaging, and tactile digital guidelines that cannot be ignored.',
            'features' => ['Distinctive Category Positioning', 'Custom Type Design', 'Motion Guidelines & Kinetic Rules', 'Spatial Brand Worlds'],
            'deliverables' => ['Master Brand Book', 'Typography Files (OTF/WOFF2)', 'Vector Identity Assets', 'Packaging & Collateral'],
            'icon' => 'Compass',
            'sort_order' => 2,
            'accent_color' => '#00f5ff',
        ]);

        Service::create([
            'title' => 'Kinetic 3D & Motion Direction',
            'slug' => 'motion-design',
            'marquee_label' => 'WEBGL SHADERS · 3D PRODUCT RENDERS · FILM DIRECTION',
            'subtitle' => 'Breathing life and gravity into digital canvas through fluid movement.',
            'description' => 'Motion is meaning. We craft immersive 3D simulations, WebGL shaders, kinetic title sequences, and physics-driven micro-animations that turn mundane interactions into dopamine-inducing experiences.',
            'features' => ['Real-Time WebGL & Three.js', 'Subtle Scroll-Tied Choreography', '3D Asset Sculpting & Lighting', 'Physics-Based Easing Models'],
            'deliverables' => ['Optimized 3D GLTF Assets', 'Custom Shader Pipelines', 'Lottie / Framer Motion Code', 'Motion Brand Specs'],
            'icon' => 'Flame',
            'sort_order' => 3,
            'accent_color' => '#ff3e3e',
        ]);

        Service::create([
            'title' => 'Creative Web & Full-Stack Velocity',
            'slug' => 'web-development',
            'marquee_label' => 'LARAVEL 13 · INERTIA REACT · TAILWIND 4 · SUB-SECOND SSR',
            'subtitle' => 'Military-grade web architecture built for 100/100 Lighthouse scores.',
            'description' => 'We engineer hyper-optimized web flagships combining Laravel with Inertia React and Tailwind CSS. We deliver sub-second time-to-interactive, zero layout shifts, dynamic SEO, and bulletproof security.',
            'features' => ['Sub-Second Global TTFB', 'Inertia SSR SEO Engine', 'Zero-CLS Performance Architecture', 'Enterprise Security & Rate Limiting'],
            'deliverables' => ['Production Source Code', 'Automated CI/CD Workflows', 'Performance Audit Reports', 'CMS / Admin Backoffice'],
            'icon' => 'Cpu',
            'sort_order' => 4,
            'accent_color' => '#b0d600',
        ]);

        // 4. Team Members
        TeamMember::create([
            'name' => 'Elena Rostova',
            'slug' => 'elena-rostova',
            'role' => 'Co-Founder & Executive Creative Director',
            'since_year' => 2019,
            'bio' => 'Former lead designer at Pentagram and Apple. Elena spearheads aesthetic philosophy and ensures every project breaks commercial design orthodoxies.',
            'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
            'social_links' => ['twitter' => 'https://twitter.com', 'linkedin' => 'https://linkedin.com'],
            'featured' => true,
            'sort_order' => 1,
        ]);

        TeamMember::create([
            'name' => 'Marcus Vance',
            'slug' => 'marcus-vance',
            'role' => 'Co-Founder & VP of Engineering',
            'since_year' => 2019,
            'bio' => 'Architect behind high-throughput distributed systems and WebGL rendering engines. Marcus bridges the gap between pure mathematics and visual elegance.',
            'avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
            'social_links' => ['github' => 'https://github.com', 'twitter' => 'https://twitter.com'],
            'featured' => true,
            'sort_order' => 2,
        ]);

        TeamMember::create([
            'name' => 'Chloe Zhang',
            'slug' => 'chloe-zhang',
            'role' => 'Head of Motion & Spatial 3D',
            'since_year' => 2021,
            'bio' => 'Specializes in generative shaders and tactile physics engines. Chloe creates digital spaces that obey their own laws of gravity.',
            'avatar' => 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
            'social_links' => ['dribbble' => 'https://dribbble.com', 'instagram' => 'https://instagram.com'],
            'featured' => true,
            'sort_order' => 3,
        ]);

        TeamMember::create([
            'name' => 'Darius Thorne',
            'slug' => 'darius-thorne',
            'role' => 'Principal Brand Strategist',
            'since_year' => 2022,
            'bio' => 'Transforms complex frontier technologies into razor-sharp market narratives that unlock venture rounds and enterprise sales pipelines.',
            'avatar' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
            'social_links' => ['linkedin' => 'https://linkedin.com'],
            'featured' => true,
            'sort_order' => 4,
        ]);

        TeamMember::create([
            'name' => 'Siddharth Roy',
            'slug' => 'siddharth-roy',
            'role' => 'Lead Systems & UI Architect',
            'since_year' => 2023,
            'bio' => 'Obsessed with accessibility, token design systems, and frontend compile speeds. Siddharth crafts interfaces that scale effortlessly.',
            'avatar' => 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80',
            'social_links' => ['github' => 'https://github.com', 'twitter' => 'https://twitter.com'],
            'featured' => true,
            'sort_order' => 5,
        ]);

        // 5. Testimonials
        Testimonial::create([
            'client_name' => 'Soren Lindqvist',
            'client_role' => 'CEO & Founder',
            'client_company' => 'Kinetix Systems',
            'avatar' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
            'quote' => 'CuttingEdger did not just design a website; they invented an entire visual universe for our operating system. Within 3 weeks of launch, our enterprise tier waitlist grew by 600%. They are unequivocally the sharpest team in the industry.',
            'rating' => 5,
            'featured' => true,
        ]);

        Testimonial::create([
            'client_name' => 'Aria Montgomery',
            'client_role' => 'Chief Product Officer',
            'client_company' => 'Hyperion Acoustic Labs',
            'avatar' => 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
            'quote' => 'Their mastery of kinetic motion and 3D WebGL is intoxicating. They turned our esoteric acoustic hardware into an irresistible luxury digital artifact. Every dollar spent returned tenfold.',
            'rating' => 5,
            'featured' => true,
        ]);

        Testimonial::create([
            'client_name' => 'Dr. Aris Thorne',
            'client_role' => 'VP of Autonomy',
            'client_company' => 'Aura Robotics',
            'avatar' => 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
            'quote' => 'Our telemetry operators require instantaneous situational awareness. CuttingEdger reduced cognitive load by over 40% while engineering a dark aesthetic that looks like it was shipped from the year 2040.',
            'rating' => 5,
            'featured' => true,
        ]);

        // 6. Pricing Plans
        PricingPlan::create([
            'name' => 'Design Sprint',
            'slug' => 'design-sprint',
            'headline' => 'Rapid exploration & prototype',
            'price' => '$14,500',
            'billing_cycle' => 'per 2-week sprint',
            'features' => [
                'Bespoke product interface design',
                'Clickable high-fidelity Figma prototype',
                'Core design tokens & component system',
                'Direct Slack channel with design leads',
                'Async Loom reviews every 48 hours',
            ],
            'is_popular' => false,
            'cta_text' => 'Book Sprint',
            'sort_order' => 1,
        ]);

        PricingPlan::create([
            'name' => 'Full Flagship Build',
            'slug' => 'full-flagship',
            'headline' => 'End-to-end design & engineering',
            'price' => '$38,000',
            'billing_cycle' => 'per full project',
            'features' => [
                'Complete brand architecture & logo suite',
                'Kinetic 3D shaders & micro-interactions',
                'Full-stack Laravel 13 + Inertia React implementation',
                '100/100 Lighthouse performance optimization',
                'Dynamic SEO, OpenGraph, JSON-LD schema',
                'Filament CMS setup with custom fields',
                '30 days post-launch hypercare & warranty',
            ],
            'is_popular' => true,
            'cta_text' => 'Commission Flagship',
            'sort_order' => 2,
        ]);

        PricingPlan::create([
            'name' => 'Studio Retainer',
            'slug' => 'studio-retainer',
            'headline' => 'Dedicated engineering & design squad',
            'price' => '$22,000',
            'billing_cycle' => 'per month',
            'features' => [
                'Dedicated Senior Designer + Full-Stack Engineer',
                'Unlimited revisions within active sprint velocity',
                'Continuous deployment & feature development',
                'Quarterly brand refresh & motion experiments',
                'Guaranteed 4-hour SLA response time',
            ],
            'is_popular' => false,
            'cta_text' => 'Secure Retainer',
            'sort_order' => 3,
        ]);

        // 7. FAQs
        Faq::create([
            'category' => 'General',
            'question' => 'How does CuttingEdger differ from standard design agencies?',
            'answer' => 'We don’t outsource or use off-the-shelf themes. Our designers write code, and our engineers understand kerning, easing curves, and spatial rhythm. The result is zero friction between concept and execution, producing award-winning flagships that load under 0.5s.',
            'sort_order' => 1,
        ]);

        Faq::create([
            'category' => 'Process',
            'question' => 'What is the typical project timeline from kickoff to live deployment?',
            'answer' => 'A rapid Design Sprint takes 2 weeks. Comprehensive Flagship builds (complete brand identity, 3D WebGL motion, and full-stack Laravel/Inertia React development) typically run 6 to 10 weeks depending on custom feature scope.',
            'sort_order' => 2,
        ]);

        Faq::create([
            'category' => 'Technology',
            'question' => 'Why do you choose Laravel 13 + Inertia.js + React 19 + Tailwind CSS 4?',
            'answer' => 'This stack delivers the pinnacle of developer velocity, rock-solid backend reliability (queue workers, auth, caching), and SPA fluid transitions without the architectural overhead of separate decoupled APIs. Tailwind 4 provides lightning-fast builds with native CSS variable cascades.',
            'sort_order' => 3,
        ]);

        Faq::create([
            'category' => 'Financials',
            'question' => 'What are your payment terms and engagement structures?',
            'answer' => 'We typically structure engagements with a 50% deposit upon contract signing, 25% at milestone design signoff, and 25% upon staging deployment prior to DNS cutover. Retainers are billed at the beginning of each monthly cycle.',
            'sort_order' => 4,
        ]);

        // 8. Career Openings
        Job::create([
            'title' => 'Senior Creative Frontend Engineer (React / WebGL)',
            'slug' => 'senior-frontend-engineer',
            'department' => 'Engineering',
            'location_type' => 'Remote',
            'experience_level' => 'Senior / Lead',
            'overview' => 'We are seeking an obsessive creative developer who views the DOM as an interactive canvas. You will architect fluid transitions, custom shaders, and sub-second React 19 applications.',
            'responsibilities' => [
                'Build interactive, kinetic web interfaces with React 19, TypeScript, and Tailwind CSS 4',
                'Implement WebGL shaders and smooth scrolling motion systems',
                'Optimize Core Web Vitals to maintain 95+ scores on mobile and desktop',
                'Collaborate closely with brand designers to push interaction boundaries',
            ],
            'requirements' => [
                '5+ years of production experience in high-octane frontend development',
                'Deep mastery of CSS transforms, Framer Motion / GSAP, and Canvas / WebGL',
                'Experience with Laravel + Inertia or modern SSR architectures',
                'An immaculate eye for typography, spacing, and micro-delights',
            ],
            'benefits' => [
                '$150,000 - $185,000 USD base salary + performance bonuses',
                '100% remote flexibility anywhere in Americas / European timezones',
                'Top-tier Apple M4 Max hardware allowance & home office stipend',
                'Annual studio retreat in Tokyo, Zurich, or Lisbon',
            ],
            'is_open' => true,
        ]);

        Job::create([
            'title' => 'Lead Brand & Spatial Designer',
            'slug' => 'lead-brand-designer',
            'department' => 'Design',
            'location_type' => 'Hybrid / Remote',
            'experience_level' => 'Principal',
            'overview' => 'Craft boundary-pushing identity systems, custom typography, and spatial 3D brand guidelines for next-generation hardware and software ventures.',
            'responsibilities' => [
                'Lead brand identity engagements from discovery through master guideline delivery',
                'Direct 3D artists and motion designers to produce cohesive visual narratives',
                'Create custom typographic experiments and spatial brand artifacts',
            ],
            'requirements' => [
                'Stunning portfolio demonstrating bold, unconventional design sensibilities',
                'Proficiency in Figma, Illustrator, Cinema 4D / Blender, and After Effects',
                'Confident client presentation skills and strategic articulation',
            ],
            'benefits' => [
                '$140,000 - $175,000 USD base salary',
                'Full medical, dental, and vision coverage',
                'Generous paid time off and sabbatical after 3 years',
            ],
            'is_open' => true,
        ]);

        // 9. Full Blogs with Subcategories & Dynamic SEO Suite
        $this->call(BlogSeeder::class);
    }
}
