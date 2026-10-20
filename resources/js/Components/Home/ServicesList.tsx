import React, { useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowUpRight, Layers, Compass, Flame, Cpu, Sparkles } from 'lucide-react';
import { Service } from '@/types/models';

interface ServicesListProps {
    services: Service[];
}

export function ServicesList({ services }: ServicesListProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const bannerRef = useRef<HTMLDivElement>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Kinetic scroll animation linked directly to section scroll progress (Lenis smoothed)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start'],
    });

    const smoothScroll = scrollYProgress;

    // Opposing scroll transforms for 4 marquee rows
    const xRow1 = useTransform(smoothScroll, [0, 1], ['5%', '-40%']);
    const xRow2 = useTransform(smoothScroll, [0, 1], ['-40%', '5%']);
    const xRow3 = useTransform(smoothScroll, [0, 1], ['8%', '-35%']);
    const xRow4 = useTransform(smoothScroll, [0, 1], ['-35%', '8%']);

    // Parallax scroll for the banner image
    const { scrollYProgress: bannerScroll } = useScroll({
        target: bannerRef,
        offset: ['start end', 'end start'],
    });
    const bannerImgY = useTransform(bannerScroll, [0, 1], ['-12%', '12%']);

    // Exact Agntix Design Studio 4 services disciplines
    const row1Items = ['Product Design', 'Product Design', 'Product Design', 'Product Design', 'Product Design'];
    const row2Items = ['Brand Design', 'Brand Design', 'Brand Design', 'Brand Design', 'Brand Design'];
    const row3Items = ['Motion Design', 'Motion Design', 'Motion Design', 'Motion Design', 'Motion Design'];
    const row4Items = ['Web Development', 'Web Development', 'Web Development', 'Web Development', 'Web Development'];

    const iconMap: Record<string, React.ElementType> = {
        Layers,
        Compass,
        Flame,
        Cpu,
    };

    return (
        <section
            ref={containerRef}
            id="services-section"
            className="relative pt-28 sm:pt-36 bg-[#090a0d] border-t border-white/10 overflow-hidden select-none"
        >
            {/* Ambient Background Light Flares */}
            <div className="absolute top-1/4 left-1/4 w-[45rem] h-[30rem] bg-[#ff5e36]/5 rounded-full blur-[180px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[45rem] h-[30rem] bg-[#00e5a3]/5 rounded-full blur-[180px] pointer-events-none" />

            {/* TOP HEADER (Exact match to Agntix Design Studio) */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center mb-16 sm:mb-20">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-widest text-[#d4ff00] mb-4">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>[ 02 // CAPABILITIES & DISCIPLINES ]</span>
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-['Antonio',_'Bebas_Neue',_'Syne',_sans-serif] uppercase tracking-wide text-neutral-100 font-bold">
                    We can help you with
                </h3>
                <p className="text-xs sm:text-sm font-sans text-neutral-400 mt-2 font-normal">
                    Check out some of my projects by area of expertise
                </p>
            </div>

            {/* KINETIC ROW 1: Product Design (Orange bullet dot #ff5e36) */}
            <div className="py-2.5 overflow-hidden border-y border-white/5 bg-black/20">
                <motion.div style={{ x: xRow1 }} className="flex items-center whitespace-nowrap will-change-transform">
                    {[...row1Items, ...row1Items].map((item, idx) => (
                        <div key={`r1-${idx}`} className="flex items-center">
                            <span className="inline-block w-4 h-4 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full bg-[#ff5e36] shrink-0 mx-4 sm:mx-8 shadow-[0_0_18px_rgba(255,94,54,0.7)]" />
                            <span
                                onClick={() => setIsDrawerOpen(true)}
                                className="font-['Antonio',_'Bebas_Neue',_'Syne',_sans-serif] uppercase font-bold text-5xl sm:text-7xl md:text-8xl lg:text-[110px] xl:text-[130px] text-white tracking-tight leading-none hover:text-[#ff5e36] transition-colors cursor-pointer"
                            >
                                {item}
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* CENTER DIVIDER WITH "Click to view Services" BUTTON */}
            <div className="relative my-8 sm:my-10 flex items-center justify-center border-t border-white/10 w-full px-4">
                <button
                    type="button"
                    onClick={() => setIsDrawerOpen((prev) => !prev)}
                    className="absolute bg-[#090a0d] px-6 sm:px-8 py-2.5 rounded-full border border-white/15 hover:border-[#d4ff00] text-neutral-300 hover:text-[#d4ff00] text-xs sm:text-sm font-sans transition-all duration-300 inline-flex items-center gap-2.5 cursor-pointer shadow-lg group hover:shadow-[0_0_20px_rgba(212,255,0,0.25)] select-none"
                    aria-expanded={isDrawerOpen}
                    aria-controls="services-tray"
                >
                    <span className="tracking-wide">Click to view Services</span>
                    <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${
                            isDrawerOpen ? 'rotate-180 text-[#d4ff00]' : 'text-neutral-400 group-hover:text-[#d4ff00]'
                        }`}
                    />
                </button>
            </div>

            {/* KINETIC ROW 2: Brand Design (Cyan bullet dot #00e5a3) */}
            <div className="py-2.5 overflow-hidden border-y border-white/5 bg-black/30">
                <motion.div style={{ x: xRow2 }} className="flex items-center whitespace-nowrap will-change-transform">
                    {[...row2Items, ...row2Items].map((item, idx) => (
                        <div key={`r2-${idx}`} className="flex items-center">
                            <span className="inline-block w-4 h-4 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full bg-[#00e5a3] shrink-0 mx-4 sm:mx-8 shadow-[0_0_18px_rgba(0,229,163,0.7)]" />
                            <span
                                onClick={() => setIsDrawerOpen(true)}
                                className="font-['Antonio',_'Bebas_Neue',_'Syne',_sans-serif] uppercase font-bold text-5xl sm:text-7xl md:text-8xl lg:text-[110px] xl:text-[130px] text-white tracking-tight leading-none hover:text-[#00e5a3] transition-colors cursor-pointer"
                            >
                                {item}
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* KINETIC ROW 3: Motion Design (Yellow bullet dot #ffd000) */}
            <div className="py-2.5 overflow-hidden border-b border-white/5 bg-black/20">
                <motion.div style={{ x: xRow3 }} className="flex items-center whitespace-nowrap will-change-transform">
                    {[...row3Items, ...row3Items].map((item, idx) => (
                        <div key={`r3-${idx}`} className="flex items-center">
                            <span className="inline-block w-4 h-4 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full bg-[#ffd000] shrink-0 mx-4 sm:mx-8 shadow-[0_0_18px_rgba(255,208,0,0.7)]" />
                            <span
                                onClick={() => setIsDrawerOpen(true)}
                                className="font-['Antonio',_'Bebas_Neue',_'Syne',_sans-serif] uppercase font-bold text-5xl sm:text-7xl md:text-8xl lg:text-[110px] xl:text-[130px] text-white tracking-tight leading-none hover:text-[#ffd000] transition-colors cursor-pointer"
                            >
                                {item}
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* KINETIC ROW 4: Web Development (Pink bullet dot #ff3b80) */}
            <div className="py-2.5 overflow-hidden border-b border-white/5 bg-black/40">
                <motion.div style={{ x: xRow4 }} className="flex items-center whitespace-nowrap will-change-transform">
                    {[...row4Items, ...row4Items].map((item, idx) => (
                        <div key={`r4-${idx}`} className="flex items-center">
                            <span className="inline-block w-4 h-4 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full bg-[#ff3b80] shrink-0 mx-4 sm:mx-8 shadow-[0_0_18px_rgba(255,59,128,0.7)]" />
                            <span
                                onClick={() => setIsDrawerOpen(true)}
                                className="font-['Antonio',_'Bebas_Neue',_'Syne',_sans-serif] uppercase font-bold text-5xl sm:text-7xl md:text-8xl lg:text-[110px] xl:text-[130px] text-white tracking-tight leading-none hover:text-[#ff3b80] transition-colors cursor-pointer"
                            >
                                {item}
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* EXPANDABLE INTERACTIVE SERVICES TRAY / DRAWER */}
            <AnimatePresence>
                {isDrawerOpen && (
                    <motion.div
                        id="services-tray"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {services.map((service, idx) => {
                                const IconComponent = iconMap[service.icon] || Layers;
                                const padIndex = String(idx + 1).padStart(2, '0');

                                return (
                                    <article
                                        key={service.id || service.slug}
                                        className="p-8 sm:p-10 rounded-3xl bg-[#11131a] border border-white/10 hover:border-[#d4ff00]/40 transition-all duration-300 flex flex-col justify-between group shadow-xl"
                                    >
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="font-mono text-xs uppercase tracking-widest text-neutral-500 group-hover:text-[#d4ff00] transition-colors">
                                                    [ {padIndex} // DISCIPLINE ]
                                                </span>
                                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#d4ff00] group-hover:bg-[#d4ff00] group-hover:text-black transition-colors">
                                                    <IconComponent className="w-5 h-5" />
                                                </div>
                                            </div>

                                            <h4 className="text-3xl sm:text-4xl font-['Antonio',_'Bebas_Neue',_sans-serif] uppercase font-bold text-white group-hover:text-[#d4ff00] transition-colors">
                                                {service.title}
                                            </h4>

                                            <p className="text-neutral-400 text-sm leading-relaxed font-sans">
                                                {service.description}
                                            </p>

                                            <div className="pt-2">
                                                <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 block mb-2">
                                                    Deliverables:
                                                </span>
                                                <div className="flex flex-wrap gap-2">
                                                    {service.deliverables?.map((deliv, dIdx) => (
                                                        <span
                                                            key={dIdx}
                                                            className="text-xs font-mono uppercase tracking-wider text-neutral-300 bg-black/40 border border-white/10 px-3 py-1 rounded-md"
                                                        >
                                                            ● {deliv}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-8 flex items-center justify-between border-t border-white/10 mt-6">
                                            <span className="font-mono text-xs uppercase tracking-wider text-neutral-400">
                                                {service.marquee_label}
                                            </span>
                                            <Link
                                                href={`/services/${service.slug}`}
                                                className="inline-flex items-center gap-2 font-['Antonio',_'Bebas_Neue',_sans-serif] text-sm uppercase tracking-wider font-bold text-black bg-[#d4ff00] hover:bg-[#c2eb00] px-5 py-2.5 rounded-full transition-all duration-300 shadow-md hover:shadow-[0_0_18px_rgba(212,255,0,0.4)]"
                                            >
                                                <span>Deep Dive</span>
                                                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                                            </Link>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* FULL-WIDTH PARALLAX IMAGE BANNER (Exact Agntix tp-banner-area) */}
            <div
                ref={bannerRef}
                className="relative w-full h-[450px] sm:h-[600px] lg:h-[750px] overflow-hidden mt-16 sm:mt-24 border-t-8 border-[#ff5e36]"
            >
                <motion.div
                    style={{ y: bannerImgY }}
                    className="absolute inset-x-0 -top-24 -bottom-24 w-full h-[125%]"
                >
                    <img
                        src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=2200&q=85"
                        alt="Agntix Design Studio Creative Vanguard"
                        className="w-full h-full object-cover object-center filter brightness-90 contrast-110"
                        loading="lazy"
                    />
                </motion.div>
                {/* Subtle vignette gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

                {/* Floating minimal capsule tag */}
                <div className="absolute bottom-8 right-8 z-10 hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-mono uppercase tracking-widest text-[#d4ff00]">
                    <span>[ SPATIAL VISIONS // ARCHIVED ]</span>
                </div>
            </div>
        </section>
    );
}
