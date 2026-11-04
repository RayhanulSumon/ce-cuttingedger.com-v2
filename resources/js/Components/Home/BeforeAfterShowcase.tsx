import React, { useState } from 'react';
import { BeforeAfterSlider } from '@/Components/ui/BeforeAfterSlider';
import { Sparkles, ArrowUpRight, CheckCircle2, TrendingUp } from 'lucide-react';

interface ShowcaseItem {
    id: string;
    tabName: string;
    serviceCategory: string;
    roiBadge: string;
    headline: string;
    description: string;
    highlights: string[];
    beforeImage: string;
    afterImage: string;
    beforeLabel: string;
    afterLabel: string;
}

export function BeforeAfterShowcase() {
    const showcaseItems: ShowcaseItem[] = [
        {
            id: 'ghost-mannequin',
            tabName: 'Ghost Mannequin',
            serviceCategory: 'Apparel Post-Production',
            roiBadge: '65% Faster Catalog Launch • Zero Model Reshoots',
            headline: '3D Hollow Invisible Joint — 65% Faster SKU Launch',
            description:
                'We composite flat front and inner neck lining captures into photorealistic 3D hollow volume with symmetrical hem balance, eliminating plastic mannequins and model reshoots.',
            highlights: [
                'Seamless Inner Neck Joint Composite',
                'Natural Fabric Drape & Symmetrical Alignment',
                'Wrinkle Micro-Smoothing & Crease Cleanup',
                'Custom Studio Drop Shadow Creation',
            ],
            beforeImage:
                'https://www.cuttingedger.com/images/source/service/before_after/ghost_mannequin_01_before.png',
            afterImage:
                'https://www.cuttingedger.com/images/source/service/before_after/ghost_mannequin_01_after.png',
            beforeLabel: 'ON-MANNEQUIN RAW CAPTURE',
            afterLabel: '3D GHOST MANNEQUIN FINISH',
        },
        {
            id: 'jewelry',
            tabName: 'Fine Jewelry Retouch',
            serviceCategory: 'Macro Luxury Studio',
            roiBadge: '+42% Luxury PDP Conversion Lift',
            headline: 'Brilliant Gemstone Facet Fire & Zero Glare',
            description:
                'Micro-scratch eradication, platinum highlight balancing, and gemstone facet enhancement without losing precious stone fire or natural depth of field.',
            highlights: [
                'Diamond & Gemstone Facet Sharpening',
                'Metallic Luster & Specular Highlight Tuning',
                'Micro-Scratch, Dust & Smudge Elimination',
                '100% Marketplace-Ready White RGB Isolation',
            ],
            beforeImage:
                'https://www.cuttingedger.com/images/source/service/before_after/jewelry_retouch_01_before.png',
            afterImage:
                'https://www.cuttingedger.com/images/source/service/before_after/jewelry_retouch_01_after.png',
            beforeLabel: 'RAW MACRO CAPTURE',
            afterLabel: 'LUXURY RETOUCHED BRILLIANCE',
        },
        {
            id: 'model-retouch',
            tabName: 'High-End Model Retouch',
            serviceCategory: 'Fashion & Editorial',
            roiBadge: '12h Turnaround • 100% Pore Integrity',
            headline: 'Authentic Skin Texture & Pore Preservation',
            description:
                'We use non-destructive frequency separation and micro dodge & burn to eliminate blemishes, stray hairs, and color splotches while preserving every authentic skin pore.',
            highlights: [
                '100% Pore Texture Integrity (No Plastic Blur)',
                'Micro Dodge & Burn Lighting Sculpting',
                'Flyaway Hair Reconstruction & Harmonization',
                'Editorial Lookbook Color Grading',
            ],
            beforeImage:
                'https://www.cuttingedger.com/images/source/service/before_after/high_end_01_before.png',
            afterImage:
                'https://www.cuttingedger.com/images/source/service/before_after/high_end_01_after.png',
            beforeLabel: 'UNTOUCHED STUDIO RAW',
            afterLabel: 'EDITORIAL MASTER GRADE',
        },
        {
            id: 'multipath',
            tabName: 'Multipath Clipping',
            serviceCategory: 'Core Cutout & Prep',
            roiBadge: '10,000+ Daily Assets • Sub-Pixel Accuracy',
            headline: '100% Hand-Drawn Pen Tool Vector Isolation',
            description:
                'Surgical vector clipping paths with multi-channel separation for color swaps, individual component isolation, and zero-halo cutout edges.',
            highlights: [
                'Smooth 100% Hand-Drawn Bézier Curves',
                'Multi-Channel Component Separation',
                'Natural Edge Feathering Without Halos',
                'Layered PSD with Embedded Named Paths',
            ],
            beforeImage:
                'https://www.cuttingedger.com/images/source/service/before_after/multi_path_before_01.png',
            afterImage:
                'https://www.cuttingedger.com/images/source/service/before_after/multi_path_after_01.png',
            beforeLabel: 'RAW COMPLEX BACKGROUND',
            afterLabel: 'MULTIPATH VECTOR ISOLATION',
        },
        {
            id: '3d-cgi',
            tabName: '3D CGI Product Twin',
            serviceCategory: 'CGI & Spatial Asset',
            roiBadge: '60% Cost Reduction vs. Physical Shoots',
            headline: 'CAD Wireframe to Photorealistic 8K Render',
            description:
                'Transform engineering CAD blueprints into photorealistic 3D digital twins with realistic PBR materials, custom studio HDRI lighting, and 360-degree spin views.',
            highlights: [
                'Clean Quad-Topology CAD to Mesh Conversion',
                'PBR Texture & Photorealistic Shader Shading',
                'Infinite Studio Camera Shot Angles',
                'Interactive WebGL GLTF & AR Ready Export',
            ],
            beforeImage:
                'https://www.cuttingedger.com/images/three/3d-furniture-rendering-services/wireframe.webp',
            afterImage:
                'https://www.cuttingedger.com/images/three/3d-furniture-rendering-services/texture.webp',
            beforeLabel: 'RAW CAD WIREFRAME MESH',
            afterLabel: '8K PHOTOREALISTIC PBR RENDER',
        },
    ];

    const [activeTab, setActiveTab] = useState<string>(showcaseItems[0].id);
    const activeItem = showcaseItems.find((item) => item.id === activeTab) || showcaseItems[0];

    return (
        <section
            id="before-after-showcase-section"
            className="relative py-16 sm:py-20 lg:py-24 bg-[#090a0e] border-t border-white/10 overflow-hidden select-none"
        >
            {/* Ambient Lighting */}
            <div className="absolute top-1/2 right-10 w-[35rem] h-[35rem] bg-accent/5 rounded-full blur-[200px] pointer-events-none" />
            <div className="absolute bottom-10 left-10 w-[30rem] h-[30rem] bg-accent/5 rounded-full blur-[180px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 xs:px-6 lg:px-8 relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-widest text-accent mb-4">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>[ INTERACTIVE BEFORE / AFTER PRECISION ]</span>
                        </div>
                        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight leading-[1.08]">
                            Inspect Our Craft <span className="text-accent">Pixel By Pixel.</span>
                        </h2>
                    </div>

                    <p className="text-sm sm:text-base text-neutral-400 font-sans max-w-md">
                        Drag the comparison handle across actual enterprise production deliverables to verify our retouching fidelity and 3D CGI precision.
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-4 mb-8 sm:mb-12 scrollbar-none border-b border-white/10">
                    {showcaseItems.map((item) => {
                        const isActive = item.id === activeTab;
                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setActiveTab(item.id)}
                                className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-mono text-xs sm:text-sm uppercase tracking-wider whitespace-nowrap transition-all duration-300 cursor-pointer ${
                                    isActive
                                        ? 'bg-accent text-black font-bold shadow-[0_0_20px_rgba(251,183,24,0.3)]'
                                        : 'bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white border border-white/5'
                                }`}
                            >
                                {item.tabName}
                            </button>
                        );
                    })}
                </div>

                {/* 2-Column Split: Interactive Slider + Spec Card */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
                    {/* Left Column: Interactive Slider */}
                    <div className="lg:col-span-7 xl:col-span-8">
                        <BeforeAfterSlider
                            key={activeItem.id}
                            beforeImage={activeItem.beforeImage}
                            afterImage={activeItem.afterImage}
                            beforeLabel={activeItem.beforeLabel}
                            afterLabel={activeItem.afterLabel}
                            altText={activeItem.headline}
                            className="aspect-[4/3] md:aspect-[16/10]"
                        />
                    </div>

                    {/* Right Column: Discipline Specs & ROI Highlights */}
                    <div className="lg:col-span-5 xl:col-span-4 space-y-5">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-block px-3 py-1 rounded-md bg-white/5 text-xs font-mono uppercase tracking-widest text-neutral-300 border border-white/10">
                                {activeItem.serviceCategory}
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-accent/15 text-xs font-mono text-accent border border-accent/30 font-semibold">
                                <TrendingUp className="w-3.5 h-3.5" />
                                <span>{activeItem.roiBadge}</span>
                            </span>
                        </div>

                        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white tracking-tight leading-tight">
                            {activeItem.headline}
                        </h3>

                        <p className="text-sm sm:text-base text-neutral-400 font-sans leading-relaxed">
                            {activeItem.description}
                        </p>

                        <div className="space-y-3 pt-2 border-t border-white/10">
                            <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest block">
                                Guaranteed Execution Standards:
                            </span>
                            <ul className="space-y-2.5">
                                {activeItem.highlights.map((point, index) => (
                                    <li key={index} className="flex items-center gap-3 text-xs sm:text-sm text-neutral-300 font-sans">
                                        <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="pt-3">
                            <a
                                href="#free-trial"
                                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-accent text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-accent-hover hover:shadow-[0_0_20px_rgba(251,183,24,0.4)] transition-all duration-300 cursor-pointer"
                            >
                                <span>Request Free 3-Asset Pilot</span>
                                <ArrowUpRight className="w-4 h-4 text-black stroke-[2.5]" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
