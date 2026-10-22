import React, { useState } from 'react';
import { BeforeAfterSlider } from '@/Components/UI/BeforeAfterSlider';
import { Sparkles, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface ShowcaseItem {
    id: string;
    tabName: string;
    serviceCategory: string;
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
            headline: '3D Hollow Invisible Joint',
            description:
                'We composite flat front and inner neck lining captures into photorealistic 3D hollow volume with symmetrical hem balance, eliminating mannequin plastic and model reshoots.',
            highlights: [
                'Seamless Inner Neck Joint',
                'Natural Fabric Drape Alignment',
                'Wrinkle Attenuation & Crease Cleanup',
                'Custom Floor Drop Shadow',
            ],
            beforeImage:
                'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1400&q=80',
            afterImage:
                'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1400&q=80',
            beforeLabel: 'RAW STUDIO CAPTURE',
            afterLabel: '3D GHOST MANNEQUIN',
        },
        {
            id: 'jewelry',
            tabName: 'Fine Jewelry Retouch',
            serviceCategory: 'Macro Luxury Studio',
            headline: 'Brilliant Diamond Sparkle & Zero Glare',
            description:
                'Micro-scratch eradication, platinum highlight balancing, and gemstone facet enhancement without losing precious stone fire or depth of field.',
            highlights: [
                'Gemstone Facet Sharpening',
                'Micro-Scratch & Dust Cleansing',
                'Focus Stacking Depth Alignment',
                'Pure 255 White RGB Isolation',
            ],
            beforeImage:
                'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1400&q=80',
            afterImage:
                'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1400&q=80',
            beforeLabel: 'RAW UNPROCESSED MACRO',
            afterLabel: 'CATALOG-READY BRILLIANCE',
        },
        {
            id: 'model-retouch',
            tabName: 'High-End Model Retouch',
            serviceCategory: 'Fashion & Editorial',
            headline: 'Authentic Skin Texture Preservation',
            description:
                'We use frequency separation and micro dodge & burn to eliminate blemishes, stray hairs, and color splotches while preserving every natural skin pore.',
            highlights: [
                '100% Pore Texture Preservation',
                'Micro Dodge & Burn Lighting',
                'Flyaway Hair Reconstruction',
                'Garment Fold Harmonization',
            ],
            beforeImage:
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1400&q=80',
            afterImage:
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1400&q=80',
            beforeLabel: 'RAW LIGHTROOM EXPORT',
            afterLabel: 'VOGUE-GRADE RETOUCH',
        },
        {
            id: '3d-cgi',
            tabName: '3D CGI Product Twin',
            serviceCategory: 'CGI & Spatial Asset',
            headline: 'CAD to Photorealistic 8K Render',
            description:
                'Transform engineering CAD blueprints into photorealistic 3D digital twins with realistic PBR materials, custom studio HDRI lighting, and 360-degree spin views.',
            highlights: [
                'Quad-Topology CAD to Mesh',
                'PBR Texture & Procedural Shaders',
                'Infinite Camera Shot Angles',
                'Interactive WebGL GLTF Export',
            ],
            beforeImage:
                'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1400&q=80',
            afterImage:
                'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1400&q=80',
            beforeLabel: 'RAW WIREFRAME CAD',
            afterLabel: '8K PHOTOREALISTIC CGI',
        },
    ];

    const [activeTab, setActiveTab] = useState<string>(showcaseItems[0].id);
    const activeItem = showcaseItems.find((item) => item.id === activeTab) || showcaseItems[0];

    return (
        <section
            id="before-after-showcase-section"
            className="relative py-24 sm:py-32 bg-[#0a0b0f] border-t border-white/10 overflow-hidden select-none"
        >
            {/* Ambient Lighting */}
            <div className="absolute top-1/2 right-10 w-[35rem] h-[35rem] bg-[#d4ff00]/5 rounded-full blur-[200px] pointer-events-none" />
            <div className="absolute bottom-10 left-10 w-[30rem] h-[30rem] bg-[#00f5ff]/5 rounded-full blur-[180px] pointer-events-none" />

            <div className="w-full max-w-[96%] xl:max-w-[1560px] 2xl:max-w-[1750px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-widest text-[#d4ff00] mb-4">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>[ SURGICAL CRAFT DEMO ]</span>
                        </div>
                        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold text-white tracking-tight leading-[1.02]">
                            See The Difference <br />
                            <span className="text-[#d4ff00]">Pixel By Pixel.</span>
                        </h2>
                    </div>

                    <p className="text-sm sm:text-base text-neutral-400 font-sans max-w-md">
                        Drag the comparison handle across any sample to inspect our hand-drawn vector paths, invisible apparel joints, and macro retouches.
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-4 mb-8 sm:mb-12 scrollbar-none border-b border-white/10">
                    {showcaseItems.map((item) => {
                        const isActive = item.id === activeTab;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-mono text-xs sm:text-sm uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${
                                    isActive
                                        ? 'bg-[#d4ff00] text-black font-bold shadow-[0_0_20px_rgba(212,255,0,0.3)]'
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

                    {/* Right Column: Discipline Specs & Highlights */}
                    <div className="lg:col-span-5 xl:col-span-4 space-y-6">
                        <div className="inline-block px-3 py-1 rounded-md bg-white/5 text-xs font-mono uppercase tracking-widest text-[#d4ff00] border border-white/10">
                            {activeItem.serviceCategory}
                        </div>

                        <h3 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight leading-tight">
                            {activeItem.headline}
                        </h3>

                        <p className="text-sm sm:text-base text-neutral-400 font-sans leading-relaxed">
                            {activeItem.description}
                        </p>

                        <div className="space-y-3 pt-2">
                            <span className="font-mono text-xs text-neutral-300 uppercase tracking-widest block font-bold">
                                Guaranteed Execution Standards:
                            </span>
                            <div className="grid grid-cols-1 gap-2.5">
                                {activeItem.highlights.map((highlight, idx) => (
                                    <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm text-neutral-200">
                                        <CheckCircle2 className="w-4 h-4 text-[#d4ff00] shrink-0" />
                                        <span>{highlight}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/10 flex items-center gap-4">
                            <a
                                href="#trial-uploader-section"
                                className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#d4ff00] hover:bg-[#bde600] text-black font-mono text-xs uppercase tracking-widest font-bold transition-all duration-300 shadow-lg"
                            >
                                <span>Test This On Your Images</span>
                                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
