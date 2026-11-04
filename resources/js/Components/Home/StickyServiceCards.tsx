import React, { useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
import {
    motion,
    useScroll,
    useTransform,
    useMotionValue,
    useSpring,
} from 'framer-motion';
import { ArrowUpRight, Sparkles, Cpu, Box, Layers, Film, CheckCircle2 } from 'lucide-react';
import { Service } from '@/types/models';

interface BentoServicePillar {
    id: string;
    number: string;
    title: string;
    description: string;
    metrics: string;
    highlights: string[];
    slug: string;
    icon: React.ComponentType<{ className?: string }>;
    accentClass: string;
}

const BENTO_SERVICE_PILLARS: BentoServicePillar[] = [
    {
        id: 'ai-visual-production',
        number: '01',
        title: 'AI-Powered Visual Production',
        description:
            'Generative product shoots, virtual models, and localization at scale.',
        metrics: '60% Faster Campaign Velocity',
        highlights: [
            'Custom Brand-Trained Generative Product Shoots',
            'Hyper-Realistic Virtual Models & Lookbooks',
            'Automated Multi-Market Campaign Localization',
        ],
        slug: 'virtual-production-cgi',
        icon: Cpu,
        accentClass: 'from-amber-500/15 via-transparent to-transparent',
    },
    {
        id: '3d-spatial-cgi',
        number: '02',
        title: '3D Spatial CGI & Motion',
        description:
            'Photorealistic product renders, packaging visualization, and anamorphic assets.',
        metrics: '8K PBR Digital Twins',
        highlights: [
            'CAD-to-8K Photorealistic Product Renders',
            '3D Packaging Visualization & Liquid Simulations',
            'Anamorphic Billboard & WebGL/AR Spatial Assets',
        ],
        slug: 'virtual-production-cgi',
        icon: Box,
        accentClass: 'from-cyan-500/15 via-transparent to-transparent',
    },
    {
        id: 'high-volume-retouching',
        number: '03',
        title: 'High-Volume Retouching & Prep',
        description:
            'E-commerce catalogs and digital asset management.',
        metrics: '10,000+ Assets / Day SLA',
        highlights: [
            '100% Hand-Drawn Clipping Paths & Alpha Masking',
            '3D Invisible Ghost Mannequin & Apparel Symmetry',
            'Sub-1 Delta-E Swatch Color Standardization',
        ],
        slug: 'ecommerce-catalog-optimization',
        icon: Layers,
        accentClass: 'from-amber-500/15 via-transparent to-transparent',
    },
    {
        id: 'corporate-campaign-design',
        number: '04',
        title: 'Corporate Campaign Design',
        description:
            'End-to-end multi-channel visual assets for global brands.',
        metrics: 'Dedicated 24/6 Enterprise Pods',
        highlights: [
            'Omnichannel Key Visuals & Broadcast Brand Films',
            'Global Retail Rollout & DTP Catalog Mastering',
            'ISO 27001 Air-Gapped NDA Production Pipeline',
        ],
        slug: 'white-label-agency-extension',
        icon: Film,
        accentClass: 'from-indigo-500/15 via-transparent to-transparent',
    },
];

interface StackedCardItem {
    id: number;
    title: string;
    slug: string;
    image: string;
    categories: string[];
    year: number;
    description: string;
    tintOverlay: string;
}

const STACKED_SHOWCASE_CARDS: StackedCardItem[] = [
    {
        id: 1,
        title: 'AI Virtual Model & Luxury Apparel Studio',
        slug: 'virtual-production-cgi',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1400&q=85',
        categories: ['AI Visual Production', 'Virtual Talent', 'Global Localization'],
        year: 2026,
        description:
            'Generative editorial campaigns and surgical skin/fabric retouching delivered in 24 hours without physical location reshoots.',
        tintOverlay: 'from-[#8a3a12]/80 via-[#3b1808]/45 to-black/90',
    },
    {
        id: 2,
        title: '3D Spatial Beverage & Liquid CGI',
        slug: 'virtual-production-cgi',
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1400&q=85',
        categories: ['3D Spatial CGI', 'Fluid Dynamics', '8K Packaging Render'],
        year: 2026,
        description:
            'Photorealistic refractive glassware, condensation physics, and high-speed fluid simulations rendered for global beverage campaigns.',
        tintOverlay: 'from-[#0d6e7a]/75 via-[#083344]/40 to-black/90',
    },
    {
        id: 3,
        title: 'High-Volume E-Commerce Catalog Scaling',
        slug: 'ecommerce-catalog-optimization',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1400&q=85',
        categories: ['High-Volume Retouching', 'Ghost Mannequin', 'Macro Jewelry'],
        year: 2026,
        description:
            'Industrial-scale digital prep, hand-drawn vector paths, and macro reflection control for luxury timepieces, jewelry, and apparel.',
        tintOverlay: 'from-[#785513]/75 via-[#2e2005]/45 to-black/90',
    },
];

function StackedCardView({
    item,
    style,
    zIndex,
    dimOpacity,
}: {
    item: StackedCardItem;
    style: any;
    zIndex: number;
    dimOpacity?: any;
}) {
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);
    const [isHovered, setIsHovered] = useState(false);

    const springConfig = { damping: 28, stiffness: 350, mass: 0.15 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };

    return (
        <motion.article
            style={{
                ...style,
                zIndex,
                transformOrigin: 'top center',
            }}
            onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                mouseX.set(e.clientX - rect.left);
                mouseY.set(e.clientY - rect.top);
                setIsHovered(true);
            }}
            onMouseLeave={() => setIsHovered(false)}
            onMouseMove={handleMouseMove}
            className="absolute inset-0 w-full h-full rounded-[24px] sm:rounded-[32px] overflow-hidden border border-white/15 bg-neutral-950 shadow-[0_25px_70px_rgba(0,0,0,0.85)] group select-none will-change-transform"
        >
            <div className="absolute inset-0 z-0">
                <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className={`absolute inset-0 bg-gradient-to-b ${item.tintOverlay} pointer-events-none`} />
                {dimOpacity && (
                    <motion.div
                        style={{ opacity: dimOpacity }}
                        className="absolute inset-0 bg-black pointer-events-none"
                    />
                )}
            </div>

            <Link
                href={`/services/${item.slug}`}
                className="absolute inset-0 z-20"
                aria-label={`Explore ${item.title}`}
            />

            {/* Top Capsule Pills matching reference screenshot */}
            <div className="relative z-30 p-5 sm:p-8 flex items-center justify-between pointer-events-none">
                <div className="flex flex-wrap items-center gap-2">
                    {item.categories.map((cat, idx) => (
                        <span
                            key={idx}
                            className="px-3 py-1 rounded-full bg-black/55 backdrop-blur-md border border-white/20 text-[10px] sm:text-xs font-mono uppercase tracking-wider text-white font-medium"
                        >
                            {cat}
                        </span>
                    ))}
                </div>
                <span className="px-3 py-1 rounded-full bg-black/55 backdrop-blur-md border border-white/20 text-[10px] sm:text-xs font-mono text-white font-semibold">
                    [{item.year}]
                </span>
            </div>

            {/* Bottom Title & CTA */}
            <div className="absolute bottom-5 sm:bottom-8 inset-x-5 sm:inset-x-8 z-30 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pointer-events-none">
                <div className="space-y-1.5 max-w-xl">
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-mono font-bold text-accent uppercase tracking-wider inline-block">
                        0{item.id} // PRODUCTION PIPELINE
                    </span>
                    <h3 className="text-xl sm:text-3xl lg:text-4xl font-display font-extrabold text-white tracking-tight">
                        {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-200 font-sans leading-relaxed line-clamp-2">
                        {item.description}
                    </p>
                </div>

                <div className="pointer-events-auto shrink-0">
                    <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-black font-display font-bold text-xs uppercase tracking-wider group-hover:bg-white transition-all">
                        <span>Explore Capability</span>
                        <ArrowUpRight className="w-4 h-4 text-black stroke-[2.5]" />
                    </span>
                </div>
            </div>

            <motion.div
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{
                    opacity: isHovered ? 1 : 0,
                    scale: isHovered ? 1 : 0.7,
                }}
                transition={{ duration: 0.2 }}
                className="pointer-events-none absolute top-0 left-0 z-40 hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-black/85 backdrop-blur-xl border border-white/25 text-white text-xs font-mono uppercase tracking-wider"
            >
                <span className="w-2 h-2 rounded-full bg-accent" />
                <span>View Pipeline</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-accent" />
            </motion.div>
        </motion.article>
    );
}

interface StickyServiceCardsProps {
    services?: Service[];
}

export function StickyServiceCards({ services: _services }: StickyServiceCardsProps) {
    const stackRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: stackRef,
        offset: ['start start', 'end end'],
    });

    // Smooth 3-card layered stack matching the reference screenshot
    const card0Scale = useTransform(scrollYProgress, [0, 0.45, 0.9], [1, 0.93, 0.87]);
    const card0Y = useTransform(scrollYProgress, [0, 0.45, 0.9], [0, -28, -54]);
    const card0Dim = useTransform(scrollYProgress, [0, 0.45, 0.9], [0, 0.25, 0.45]);

    const card1TranslateY = useTransform(scrollYProgress, [0, 0.1, 0.45], ['88%', '88%', '0%']);
    const card1Scale = useTransform(scrollYProgress, [0.45, 0.9], [1, 0.94]);
    const card1Y = useTransform(scrollYProgress, [0.45, 0.9], [0, -26]);
    const card1Dim = useTransform(scrollYProgress, [0.45, 0.9], [0, 0.25]);

    const card2TranslateY = useTransform(scrollYProgress, [0, 0.5, 0.88], ['92%', '92%', '0%']);

    return (
        <section
            id="b2b-service-bento-grid"
            className="relative py-12 sm:py-18 lg:py-22 bg-[#090a0d] border-t border-white/10 select-none"
        >
            {/* Ambient Glow */}
            <div className="absolute top-1/3 right-0 w-[50rem] h-[50rem] bg-accent/[0.04] rounded-full blur-[220px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 xs:px-6 lg:px-8">
                {/* SECTION 4 PART A: THE 4-CARD AI & B2B SERVICE BENTO GRID */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-6">
                    <div className="space-y-3 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/25 text-xs font-mono uppercase tracking-[0.18em] text-accent font-semibold">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>ENTERPRISE PRODUCTION CAPABILITIES</span>
                        </div>
                        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
                            AI &amp; B2B Creative <span className="text-accent">Production Grid.</span>
                        </h2>
                        <p className="text-sm sm:text-base text-neutral-400 font-sans leading-relaxed">
                            Purpose-built visual pipelines engineered for global luxury houses, high-velocity e-commerce catalogs, and corporate marketing teams.
                        </p>
                    </div>

                    <Link
                        href="/services"
                        className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/[0.04] border border-white/15 text-xs font-mono uppercase tracking-widest text-neutral-200 hover:text-black hover:bg-accent hover:border-accent transition-all duration-300 shrink-0 self-start md:self-auto"
                    >
                        <span>Explore All Capabilities</span>
                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                </div>

                {/* Clean 4-Card Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-16 sm:mb-24">
                    {BENTO_SERVICE_PILLARS.map((pillar) => {
                        const Icon = pillar.icon;
                        return (
                            <div
                                key={pillar.id}
                                className="group relative rounded-3xl p-6 sm:p-8 lg:p-9 bg-gradient-to-br from-[#12141d] to-[#0b0d13] border border-white/10 hover:border-accent/50 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.65)]"
                            >
                                <div
                                    className={`absolute inset-0 bg-gradient-to-br ${pillar.accentClass} opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none`}
                                />

                                <div className="relative z-10 space-y-5">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-11 h-11 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-black transition-all duration-300">
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
                                                [ {pillar.number} // B2B PILLAR ]
                                            </span>
                                        </div>

                                        <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/25 text-[11px] font-mono text-accent font-semibold">
                                            {pillar.metrics}
                                        </span>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-white group-hover:text-accent transition-colors">
                                            {pillar.title}
                                        </h3>
                                        <p className="text-sm sm:text-base text-neutral-300 font-sans leading-relaxed">
                                            {pillar.description}
                                        </p>
                                    </div>

                                    <ul className="space-y-2 pt-3 border-t border-white/10">
                                        {pillar.highlights.map((item, i) => (
                                            <li
                                                key={i}
                                                className="flex items-center gap-2.5 text-xs sm:text-sm text-neutral-300 font-sans"
                                            >
                                                <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="relative z-10 pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                                    <Link
                                        href={`/services/${pillar.slug}`}
                                        className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-white group-hover:text-accent font-bold transition-colors"
                                    >
                                        <span>Explore Workflow &amp; Specs</span>
                                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                    </Link>
                                    <a
                                        href="#free-trial"
                                        className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
                                    >
                                        Request Pilot →
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* SECTION 4 PART B: LAYERED STACKED VISUAL SHOWCASE CARDS (Matching Reference Image) */}
                <div ref={stackRef} className="relative h-[165vh] sm:h-[200vh] max-w-5xl mx-auto">
                    <div className="sticky top-20 sm:top-24 h-[52vh] sm:h-[58vh] lg:h-[62vh] min-h-[360px] sm:min-h-[420px] max-h-[560px] w-full rounded-[24px] sm:rounded-[32px] overflow-visible">
                        <StackedCardView
                            item={STACKED_SHOWCASE_CARDS[0]}
                            zIndex={10}
                            style={{
                                scale: card0Scale,
                                y: card0Y,
                            }}
                            dimOpacity={card0Dim}
                        />

                        <motion.div
                            style={{
                                y: card1TranslateY,
                                zIndex: 20,
                            }}
                            className="absolute inset-0 w-full h-full pointer-events-auto"
                        >
                            <StackedCardView
                                item={STACKED_SHOWCASE_CARDS[1]}
                                zIndex={20}
                                style={{
                                    scale: card1Scale,
                                    y: card1Y,
                                }}
                                dimOpacity={card1Dim}
                            />
                        </motion.div>

                        <motion.div
                            style={{
                                y: card2TranslateY,
                                zIndex: 30,
                            }}
                            className="absolute inset-0 w-full h-full pointer-events-auto"
                        >
                            <StackedCardView
                                item={STACKED_SHOWCASE_CARDS[2]}
                                zIndex={30}
                                style={{
                                    scale: 1,
                                    y: 0,
                                }}
                            />
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
