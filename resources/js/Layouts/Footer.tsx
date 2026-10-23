import React, { useState } from 'react';
import { Link, usePage, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ChevronUp, ArrowUpRight, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { SiteSettings } from '@/types/models';

interface FooterProps {
    settings?: SiteSettings;
    onOpenContact?: () => void;
    compact?: boolean;
}

export function Footer({ settings, onOpenContact, compact }: FooterProps) {
    const { url } = usePage();
    const isHomePage = url === '/' || url.split('?')[0] === '';
    const isCompact = compact !== undefined ? compact : !isHomePage;

    const letters = Array.from('CONTACT US');
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    // Mini dispatch newsletter form
    const { data, setData, post, processing, recentlySuccessful, reset } = useForm({
        email: '',
    });

    const handleNewsletterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.email) return;
        post('/newsletter', {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    const scrollToTop = () => {
        if (typeof window !== 'undefined' && (window as any).lenis) {
            (window as any).lenis.scrollTo(0);
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const socials = [
        { name: 'Twitter', url: settings?.social_twitter || 'https://twitter.com/cutting_edger' },
        { name: 'Instagram', url: settings?.social_instagram || 'https://instagram.com/cuttingedgerinc' },
        { name: 'LinkedIn', url: settings?.social_linkedin || 'https://linkedin.com/company/cutting-edger' },
        { name: 'Facebook', url: 'https://facebook.com/CuttingEdgerInc' },
        { name: 'YouTube', url: 'https://youtube.com/channel/UCJS-gaoOogk-552jQfRYPBQ' },
    ];

    const serviceLinks = [
        { label: 'E-Commerce Catalog Optimization', href: '/services/ecommerce-catalog-optimization' },
        { label: 'Hand-Drawn Clipping Path Service', href: '/services/ecommerce-catalog-optimization/clipping-path-service' },
        { label: 'Image Masking (Alpha & Hair)', href: '/services/ecommerce-catalog-optimization/image-masking-service' },
        { label: 'Ghost Mannequin & Neck Joint', href: '/services/ecommerce-catalog-optimization/ghost-mannequin-service' },
        { label: 'Color Standardization Services', href: '/services/color-standardization' },
        { label: 'White-Label Agency Bandwidth', href: '/services/white-label-agency-extension' },
        { label: 'Virtual Production & 3D CGI Studio', href: '/services/virtual-production-cgi' },
        { label: '3D Furniture Modeling & AR Assets', href: '/services/virtual-production-cgi/3d-furniture-modeling' },
    ];

    const agencyLinks = [
        { label: 'Case Studies', href: '/case-studies' },
        { label: 'Verified Reviews & Proof', href: '/reviews' },
        { label: 'Studio Philosophy & About', href: '/about' },
        { label: 'Creative Leadership Team', href: '/team' },
        { label: 'Career Openings', href: '/careers' },
        { label: 'Transparent Pricing Plans', href: '/pricing' },
        { label: 'NDA & Security Compliance', href: '/nda-compliance' },
        { label: 'ESG & Sustainability Charter', href: '/esg-policy' },
        { label: 'Cookie Policy', href: '/cookie-policy' },
        { label: 'Studio FAQ', href: '/faq' },
    ];

    // =========================================================================
    // FULL-WIDTH SLEEK MINIMAL AGENCY FOOTER (Inner Pages: About, Work, Team, etc.)
    // =========================================================================
    if (isCompact) {
        return (
            <footer
                id="site-footer"
                className="relative bg-[#07080b] text-white border-t border-white/10 select-none overflow-hidden w-full"
            >
                {/* Subtle ambient top glow spanning full width */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#d4ff00]/40 to-transparent pointer-events-none" />

                <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 pt-16 sm:pt-20 pb-12">
                    {/* Top Multi-Column Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-white/10">
                        {/* Col 1: Brand & Studio Identity (4 cols) */}
                        <div className="lg:col-span-4 space-y-6">
                            <Link
                                href="/"
                                className="group inline-flex items-center gap-3 focus-visible:ring-2 focus-visible:ring-[#d4ff00] rounded-lg"
                            >
                                <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center p-1.5 group-hover:border-[#d4ff00]/60 group-hover:bg-[#d4ff00]/10 transition-all duration-300">
                                    <img
                                        src="/images/ce/ce_icon_neon.png"
                                        alt="Cutting Edger"
                                        className="w-5 h-5 object-contain group-hover:scale-110 transition-transform duration-300"
                                    />
                                </div>
                                <div className="flex items-baseline tracking-tight">
                                    <span className="font-display text-2xl sm:text-[26px] font-black tracking-tight text-white transition-colors">
                                        CUTTING
                                    </span>
                                    <span className="font-display text-2xl sm:text-[26px] font-black tracking-tight text-[#d4ff00] ml-1">
                                        EDGER
                                    </span>
                                </div>
                            </Link>

                            <p className="text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed max-w-sm">
                                AI-driven visual performance agency engineered for high-volume catalog retouching, swatch color standardization, white-label production, and 3D CGI virtual staging.
                            </p>

                            <div className="space-y-2 text-xs font-mono text-neutral-400">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-3.5 h-3.5 text-[#d4ff00]" />
                                    <span>Artisan Center, Level-7, West Panthapath, Dhaka 1215</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="w-3.5 h-3.5 text-[#d4ff00]" />
                                    <a href="mailto:hello@cuttingedger.com" className="hover:text-white transition-colors">
                                        hello@cuttingedger.com
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Col 2: Services / Pillars (3 cols) */}
                        <div className="lg:col-span-3 space-y-4">
                            <h3 className="font-mono text-xs uppercase tracking-widest text-[#d4ff00] font-bold">
                                Visual Disciplines
                            </h3>
                            <ul className="space-y-2 text-xs text-neutral-400 font-sans">
                                {serviceLinks.map((item) => (
                                    <li key={item.label}>
                                        <Link
                                            href={item.href}
                                            className="hover:text-white transition-colors block py-0.5"
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Col 3: Studio & Governance (2 cols) */}
                        <div className="lg:col-span-2 space-y-4">
                            <h3 className="font-mono text-xs uppercase tracking-widest text-[#d4ff00] font-bold">
                                Agency & Trust
                            </h3>
                            <ul className="space-y-2 text-xs text-neutral-400 font-sans">
                                {agencyLinks.map((item) => (
                                    <li key={item.label}>
                                        <Link
                                            href={item.href}
                                            className="hover:text-white transition-colors block py-0.5"
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Col 4: Dispatch Newsletter & Start a Pilot CTA (3 cols) */}
                        <div className="lg:col-span-3 space-y-5">
                            <div className="space-y-2">
                                <h3 className="font-mono text-xs uppercase tracking-widest text-[#d4ff00] font-bold">
                                    Visual Intelligence
                                </h3>
                                <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                                    Quarterly briefs on catalog velocity, Delta-E color science, and 3D CGI conversion lift.
                                </p>
                            </div>

                            <form onSubmit={handleNewsletterSubmit} className="space-y-2.5">
                                <div className="relative flex items-center">
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="director@brand.com"
                                        required
                                        className="w-full bg-[#12141c] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4ff00] transition-colors pr-24 font-sans"
                                    />
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="absolute right-1.5 px-3 py-1.5 rounded-lg bg-[#d4ff00] text-black text-xs font-mono font-bold uppercase tracking-wider hover:bg-white transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                    >
                                        <span>Join</span>
                                        <Send className="w-3 h-3" />
                                    </button>
                                </div>
                                {recentlySuccessful && (
                                    <p className="text-[11px] text-[#d4ff00] font-mono flex items-center gap-1.5">
                                        <CheckCircle2 className="w-3 h-3" />
                                        <span>Subscribed to Cutting Edger Brief.</span>
                                    </p>
                                )}
                            </form>

                            {/* Direct Free Pilot CTA */}
                            <div className="pt-1">
                                <Link
                                    href="/#free-trial"
                                    className="group inline-flex items-center justify-between w-full px-4 py-3 rounded-xl border border-white/15 bg-white/[0.03] hover:bg-[#d4ff00] hover:text-black hover:border-[#d4ff00] transition-all duration-300"
                                >
                                    <span className="text-xs font-mono uppercase tracking-wider font-semibold">
                                        Test Us On 3 Raw Assets
                                    </span>
                                    <span className="flex items-center gap-1 text-xs font-mono font-bold uppercase text-[#d4ff00] group-hover:text-black transition-colors">
                                        Free Pilot
                                        <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Sub-Row: Copyright, Legal, Socials & Back To Top */}
                    <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-neutral-400 font-sans">
                        {/* Copyright & Legal */}
                        <div className="flex flex-wrap items-center gap-4 sm:gap-6 order-2 sm:order-1 font-mono text-[11px]">
                            <span>© {new Date().getFullYear()} Cutting Edger Inc.</span>
                            <Link href="/privacy" className="hover:text-white transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="hover:text-white transition-colors">
                                Terms of Service
                            </Link>
                            <Link href="/cookie-policy" className="hover:text-white transition-colors">
                                Cookie Policy
                            </Link>
                            <Link href="/nda-compliance" className="hover:text-white transition-colors">
                                NDA Compliance
                            </Link>
                            <Link href="/esg-policy" className="hover:text-white transition-colors">
                                ESG Charter
                            </Link>
                        </div>

                        {/* Social Links with hover effect */}
                        <div className="flex flex-wrap items-center gap-5 sm:gap-6 order-1 sm:order-2">
                            {socials.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="relative text-[#f9f4e8]/80 hover:text-white transition-colors font-medium tracking-wide after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[1px] after:bg-[#d4ff00] after:transition-all after:duration-300 text-xs"
                                >
                                    {social.name}
                                </a>
                            ))}
                        </div>

                        {/* Back to top button */}
                        <div className="order-3">
                            <button
                                type="button"
                                onClick={scrollToTop}
                                aria-label="Scroll back to top"
                                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#d4ff00] hover:text-black text-white flex items-center justify-center transition-all duration-300 cursor-pointer"
                            >
                                <ChevronUp className="w-4 h-4 stroke-[2.5]" />
                            </button>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }

    // =========================================================================
    // GRAND AGNTIX DESIGN STUDIO CARD FOOTER (HOMEPAGE ONLY)
    // =========================================================================
    return (
        <footer
            id="site-footer"
            className="relative bg-[#090a0d] px-3 sm:px-5 pb-4 pt-12 sm:pt-16 select-none"
        >
            <div
                className="relative rounded-[24px] sm:rounded-[36px] overflow-hidden border border-white/10 min-h-[75vh] flex flex-col justify-between p-6 sm:p-10 lg:p-14 shadow-[0_30px_90px_rgba(0,0,0,0.95)]"
                style={{
                    backgroundColor: '#080302',
                    backgroundImage: "url('/images/footer-bg.jpg')",
                    backgroundPosition: 'center center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/50 pointer-events-none" />

                {/* TOP BAR */}
                <div className="relative z-10 w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm font-sans text-[#f9f4e8]">
                    <span className="font-normal text-[#f9f4e8]/90 tracking-wide order-2 sm:order-1 font-mono text-xs">
                        AI-Driven Visual Performance Agency
                    </span>

                    <Link
                        href="/"
                        className="order-1 sm:order-2 inline-flex items-center gap-2.5 font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white uppercase hover:text-[#d4ff00] transition-colors"
                    >
                        <img
                            src="/images/ce/ce_icon_neon.png"
                            alt="Cutting Edger"
                            className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
                        />
                        <span>cutting edger</span>
                    </Link>

                    <span className="font-normal text-[#f9f4e8]/90 tracking-wide order-3 hidden sm:inline-block font-mono text-xs">
                        Dhaka · London · San Francisco
                    </span>
                </div>

                {/* MIDDLE SECTION: GIANT INTERACTIVE "CONTACT US" */}
                <div className="relative z-10 w-full px-2 sm:px-4 py-12 sm:py-16 flex flex-col items-center justify-center text-center my-auto">
                    <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#d4ff00] font-bold mb-6 select-none">
                        READY TO ELEVATE YOUR CATALOG CRAFT & VELOCITY?
                    </span>

                    <Link
                        href="/contact"
                        onClick={(e) => {
                            if (onOpenContact) {
                                e.preventDefault();
                                onOpenContact();
                            }
                        }}
                        onPointerLeave={() => setHoveredIndex(null)}
                        className="cursor-pointer group flex items-start justify-center select-none w-full max-w-[98%] mx-auto"
                        title="Click to get in touch"
                    >
                        <div className="flex items-center justify-center flex-nowrap w-full overflow-hidden py-4 sm:py-6">
                            {letters.map((char, index) => {
                                if (char === ' ') {
                                    return (
                                        <span
                                            key={`space-${index}`}
                                            className="w-[1.8vw] sm:w-[2.2vw] lg:w-[2.6vw] inline-block pointer-events-none"
                                        />
                                    );
                                }

                                const isHovered = hoveredIndex === index;

                                return (
                                    <motion.span
                                        key={`char-${index}`}
                                        onPointerEnter={(e) => {
                                            e.stopPropagation();
                                            setHoveredIndex(index);
                                        }}
                                        onPointerLeave={(e) => {
                                            e.stopPropagation();
                                            setHoveredIndex((prev) => (prev === index ? null : prev));
                                        }}
                                        animate={{
                                            scaleY: isHovered ? 1.2 : 1,
                                            y: isHovered ? '2%' : '0%',
                                        }}
                                        transition={{
                                            duration: 0.2,
                                            ease: [0.39, 0.575, 0.565, 1],
                                        }}
                                        style={{
                                            transformOrigin: 'center center',
                                        }}
                                        className="inline-block font-display font-black uppercase text-[6.5vw] sm:text-[7vw] md:text-[7.5vw] lg:text-[8vw] xl:text-[8.5vw] leading-none text-[#f9f4e8] tracking-[-0.03em] will-change-transform select-none cursor-pointer hover:text-white"
                                    >
                                        {char}
                                    </motion.span>
                                );
                            })}
                        </div>
                    </Link>
                </div>

                {/* BOTTOM BAR */}
                <div className="relative z-10 w-full pt-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-mono text-[#f9f4e8] border-t border-white/10">
                    <div className="flex flex-wrap items-center gap-4 text-xs">
                        <span>© {new Date().getFullYear()} Cutting Edger</span>
                        <Link href="/privacy" className="text-[#f9f4e8]/70 hover:text-white transition-colors">
                            Privacy
                        </Link>
                        <Link href="/terms" className="text-[#f9f4e8]/70 hover:text-white transition-colors">
                            Terms
                        </Link>
                        <Link href="/cookie-policy" className="text-[#f9f4e8]/70 hover:text-white transition-colors">
                            Cookies
                        </Link>
                        <Link href="/nda-compliance" className="text-[#f9f4e8]/70 hover:text-white transition-colors">
                            NDA
                        </Link>
                        <Link href="/esg-policy" className="text-[#f9f4e8]/70 hover:text-white transition-colors">
                            ESG
                        </Link>
                    </div>

                    <div className="flex items-center gap-6 sm:gap-8">
                        {socials.map((social) => (
                            <a
                                key={social.name}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative text-[#f9f4e8]/80 hover:text-white transition-colors font-medium tracking-wide text-xs"
                            >
                                {social.name}
                            </a>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={scrollToTop}
                            aria-label="Scroll back to top"
                            className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-[#d4ff00] transition-all duration-300 shadow-xl cursor-pointer shrink-0"
                        >
                            <ChevronUp className="w-5 h-5 stroke-[2.5]" />
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
