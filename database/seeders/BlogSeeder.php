<?php

namespace Database\Seeders;

use App\Models\Blog;
use App\Models\BlogCategory;
use App\Models\TeamMember;
use Illuminate\Database\Seeder;

class BlogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Establish Parent Categories
        $catDesign = BlogCategory::firstOrCreate(
            ['slug' => 'design-theory'],
            [
                'name' => 'Design Theory',
                'description' => 'Aesthetic critique, design systems, and spatial interfaces.',
            ]
        );

        $catEngineering = BlogCategory::firstOrCreate(
            ['slug' => 'engineering-insights'],
            [
                'name' => 'Engineering Insights',
                'description' => 'Performance architecture, frontend runtimes, and distributed graphics.',
            ]
        );

        $catBrand = BlogCategory::firstOrCreate(
            ['slug' => 'brand-architecture'],
            [
                'name' => 'Brand Architecture',
                'description' => 'Strategic identity systems, typographic hierarchy, and cultural narrative.',
            ]
        );

        // 2. Establish Subcategories under parents
        $subTactile = BlogCategory::firstOrCreate(
            ['slug' => 'tactile-ui-haptics'],
            [
                'parent_id' => $catDesign->id,
                'name' => 'Tactile UI & Haptics',
                'description' => 'Kinetic interactions, haptic feedback, and visceral UI styling.',
            ]
        );

        $subMotion = BlogCategory::firstOrCreate(
            ['slug' => 'motion-spatial'],
            [
                'parent_id' => $catDesign->id,
                'name' => '3D Motion & Spatial',
                'description' => 'WebGL shaders, raymarching, and spatial computing interfaces.',
            ]
        );

        $subPerf = BlogCategory::firstOrCreate(
            ['slug' => 'frontend-performance'],
            [
                'parent_id' => $catEngineering->id,
                'name' => 'Frontend Performance',
                'description' => 'Lighthouse 100/100, zero-CLS optimization, and GPU pipelines.',
            ]
        );

        $subFullStack = BlogCategory::firstOrCreate(
            ['slug' => 'laravel-inertia-stack'],
            [
                'parent_id' => $catEngineering->id,
                'name' => 'Laravel & Inertia Stack',
                'description' => 'Modern monolithic architecture, SSR pipelines, and TypeScript type-safety.',
            ]
        );

        $subTypography = BlogCategory::firstOrCreate(
            ['slug' => 'kinetic-typography'],
            [
                'parent_id' => $catBrand->id,
                'name' => 'Kinetic Typography',
                'description' => 'Variable fonts, expressive character sets, and motion-reactive type.',
            ]
        );

        // Fetch authors
        $authors = TeamMember::all();
        $author1 = $authors->first()->id ?? 1;
        $author2 = $authors->skip(1)->first()->id ?? $author1;
        $author3 = $authors->skip(2)->first()->id ?? $author1;

        // 3. Seed Comprehensive Articles
        $articles = [
            [
                'blog_category_id' => $catDesign->id,
                'subcategory_id' => $subTactile->id,
                'author_id' => $author1,
                'title' => 'The Death of the Minimalist Box: Why Modern Software Craves Visceral Tactility',
                'slug' => 'death-of-minimalist-box',
                'excerpt' => 'A decade of sterile gray-on-gray SaaS interfaces has created collective user apathy. Here is how we engineer tactile interfaces with physical weight and kinetic satisfaction.',
                'body' => "# The Death of the Minimalist Box: Why Modern Software Craves Visceral Tactility\n\nFor the past ten years, software design has suffered from an obsession with reductionism. Every button became a borderless gray link; every dashboard converged on the same sterile typography; every brand identity surrendered its character to standard geometric sans-serifs.\n\nAt CuttingEdger, we believe the next era of digital craft belongs to tactile realism—not retro skeuomorphism, but kinetic physics, micro-refractions, purposeful tension, and bold typographic hierarchy.\n\n## The Psychology of Physical Weight\n\nWhen software feels physical, it creates muscle memory, fosters trust, and turns daily utility into an emotional joy. By tuning sub-pixel border highlights, subtle surface drop elevations, and haptic cursor physics, users intuit exactly where interactive focal points reside without guessing.\n\n> \"Interface design should feel like a precision Swiss instrument: tuned with mechanical intention and satisfying to actuate.\"\n\n```typescript\n// Tactile spring physics token\nexport const tactileSpring = {\n    stiffness: 420,\n    damping: 28,\n    mass: 0.8,\n};\n```\n\n### The Way Forward\n\nMoving forward, we urge designers and engineers to reject sterile white-box templates and embrace visceral depth, kinetic spring dampening, and bold industrial contrast.",
                'cover_image' => 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
                'reading_time' => 6,
                'is_featured' => true,
                'status' => 'published',
                'tags' => ['Tactile Design', 'Interface Philosophy', 'Spatial UI', 'Micro-interactions'],
                'published_at' => now()->subDays(4),
                'meta_title' => 'The Death of the Minimalist Box — CuttingEdger Journal',
                'meta_description' => 'Why modern digital software craves visceral tactility, kinetic motion, and distinct personality.',
                'meta_keywords' => 'tactile ui, design engineering, kinetic animation, web design 2026, modern software',
                'canonical_url' => 'https://cuttingedger.com/blog/death-of-minimalist-box',
                'og_image' => 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
                'robots' => 'index, follow',
            ],
            [
                'blog_category_id' => $catEngineering->id,
                'subcategory_id' => $subPerf->id,
                'author_id' => $author2,
                'title' => 'Engineering 100/100 Lighthouse on Laravel 13 + Inertia + Tailwind 4',
                'slug' => 'engineering-100-lighthouse-laravel-inertia',
                'excerpt' => 'A deep dive into zero-CLS font preloading, server-side render fallbacks, and microsecond hydration strategies for high-octane creative portfolios.',
                'body' => "# Engineering 100/100 Lighthouse on Laravel 13 + Inertia + Tailwind 4\n\nMany developers assume that heavy kinetic animations and rich aesthetics are fundamentally incompatible with high Lighthouse scores. That is a myth born of unoptimized bundles and lazy asset pipelines.\n\nBy pairing Laravel 13 with Inertia React 19 and Tailwind CSS 4, we leverage the best of both worlds: instant initial server rendering (SSR) for search engine spiders, followed by client hydration with hardware-accelerated transforms that run strictly on the GPU compositor thread.\n\n## Zero-CLS Preloading Architecture\n\nCumulative Layout Shift often destroys aesthetic scores. We eliminate layout shifts by pre-declaring aspect ratios on all dynamic media containers, embedding base64 SVG blur placeholders, and preloading critical font glyph sets directly in the document `<head>`.\n\n```bash\n# Optimizing Tailwind 4 and Vite bundle analysis\nnpx vite-bundle-visualizer\n```\n\n### The Final Audit Metric\n\nOur benchmark results clocked First Contentful Paint (FCP) at 0.4s and Total Blocking Time (TBT) at under 20ms across mobile and desktop viewports alike.",
                'cover_image' => 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80',
                'reading_time' => 8,
                'is_featured' => true,
                'status' => 'published',
                'tags' => ['Performance', 'Laravel 13', 'Inertia React', 'Tailwind 4', 'Lighthouse 100'],
                'published_at' => now()->subDays(12),
                'meta_title' => 'Engineering 100 Lighthouse with Laravel & Inertia — CuttingEdger Journal',
                'meta_description' => 'Technical blueprint for sub-second load times on animation-heavy web applications.',
                'meta_keywords' => 'laravel 13, inertia react 19, tailwind css 4, lighthouse 100, web performance',
                'canonical_url' => 'https://cuttingedger.com/blog/engineering-100-lighthouse-laravel-inertia',
                'og_image' => 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80',
                'robots' => 'index, follow',
            ],
            [
                'blog_category_id' => $catDesign->id,
                'subcategory_id' => $subMotion->id,
                'author_id' => $author3,
                'title' => 'Volumetric Shaders in the Browser: Real-Time Raymarching with WebGL',
                'slug' => 'volumetric-shaders-browser-webgl',
                'excerpt' => 'Rendering physical light refraction and volumetric fog at 60fps inside HTML canvas without melting client battery life.',
                'body' => "# Volumetric Shaders in the Browser: Real-Time Raymarching with WebGL\n\nSpatial computing is no longer bound to native VR headsets. Modern desktop and mobile WebGL2 runtimes allow us to simulate real-time physical optical refractions, dispersion, and atmospheric fog directly inside standard web viewports.\n\n## The Raymarching Pipeline\n\nUnlike traditional polygon rasterization, signed distance fields (SDFs) mathematically describe 3D geometries in fragment shaders.\n\n> \"Raymarching turns code into pure optics—allowing light to bend and scatter in infinite procedural geometries.\"\n\n```glsl\n// Signed distance field for rounded volumetric box\nfloat sdRoundBox(vec3 p, vec3 b, float r) {\n    vec3 q = abs(p) - b;\n    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r;\n}\n```\n\n### Frame Budget Optimization\n\nBy executing ray steps at dynamic half-resolution buffers during camera orbits and upscaling via bicubic hardware filtering, 60fps render loops remain butter-smooth.",
                'cover_image' => 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
                'reading_time' => 7,
                'is_featured' => false,
                'status' => 'published',
                'tags' => ['WebGL', 'GLSL Shaders', '3D Motion', 'Raymarching', 'Graphics'],
                'published_at' => now()->subDays(18),
                'meta_title' => 'Volumetric Shaders with WebGL — CuttingEdger Journal',
                'meta_description' => 'Architecting real-time WebGL signed distance field shaders and light refraction.',
                'meta_keywords' => 'webgl shaders, glsl, raymarching, 3d web, spatial graphics',
                'canonical_url' => 'https://cuttingedger.com/blog/volumetric-shaders-browser-webgl',
                'og_image' => 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
                'robots' => 'index, follow',
            ],
            [
                'blog_category_id' => $catBrand->id,
                'subcategory_id' => $subTypography->id,
                'author_id' => $author1,
                'title' => 'Kinetic Typography: Designing Variable Typefaces for Fluid Display Scales',
                'slug' => 'kinetic-typography-variable-typefaces',
                'excerpt' => 'Why static font weights are obsolete in responsive interfaces, and how fluid variable axes sculpt unforgettable brand presence.',
                'body' => "# Kinetic Typography: Designing Variable Typefaces for Fluid Display Scales\n\nTypography is the vocal inflection of software. When an interface communicates only through standard 400 and 700 weights, it speaks with a mechanical monotone.\n\nVariable fonts permit infinite interpolation along optical weight, width, slant, and bespoke axes—allowing headlines to breathe with viewport physics.\n\n## Responsive Font Axis Scaling\n\nUsing modern CSS `@supports (font-variation-settings: normal)`, we link viewport scroll velocity directly to typographic width, making letters compress and expand dynamically under scroll inertia.\n\n```css\nh1.kinetic-hero {\n    font-variation-settings: 'wght' var(--scroll-weight, 800), 'wdth' 110;\n    transition: font-variation-settings 0.2s cubic-bezier(0.16, 1, 0.3, 1);\n}\n```\n\n### Impact on Brand Identity\n\nClients recognize kinetic typography instantaneously because it breaks standard commercial uniformity and elevates digital branding into physical artistry.",
                'cover_image' => 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
                'reading_time' => 5,
                'is_featured' => false,
                'status' => 'published',
                'tags' => ['Typography', 'Brand Identity', 'Variable Fonts', 'Kinetic Design'],
                'published_at' => now()->subDays(25),
                'meta_title' => 'Kinetic Typography & Variable Fonts — CuttingEdger Journal',
                'meta_description' => 'How variable font axes create fluid, responsive, kinetic typography for luxury brands.',
                'meta_keywords' => 'kinetic typography, variable fonts, brand identity, font engineering',
                'canonical_url' => 'https://cuttingedger.com/blog/kinetic-typography-variable-typefaces',
                'og_image' => 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
                'robots' => 'index, follow',
            ],
        ];

        foreach ($articles as $articleData) {
            Blog::updateOrCreate(
                ['slug' => $articleData['slug']],
                $articleData
            );
        }
    }
}
