import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
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

    const scrollToTop = () => {
        if (typeof window !== 'undefined' && (window as any).lenis) {
            (window as any).lenis.scrollTo(0);
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const socials = [
        { name: 'Twitter', url: settings?.social_twitter || 'https://twitter.com' },
        { name: 'Instagram', url: settings?.social_instagram || 'https://instagram.com' },
        { name: 'Behance', url: 'https://behance.net' },
        { name: 'Dribbble', url: settings?.social_dribbble || 'https://dribbble.com' },
        { name: 'LinkedIn', url: settings?.social_linkedin || 'https://linkedin.com' },
    ];

    // =========================================================================
    // COMPACT FOOTER FOR ALL INNER PAGES (About, Work, Contact, Pricing, etc.)
    // =========================================================================
    if (isCompact) {
        return (
            <footer
                id="site-footer"
                className="relative bg-[#07080a] text-white border-t border-white/10 select-none"
            >
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16">
                    {/* Main Compact Row */}
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pb-10 border-b border-white/10">
                        {/* Brand */}
                        <div className="space-y-2">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 font-['MangoGrotesque',_'Antonio',_sans-serif] text-3xl sm:text-4xl font-normal tracking-wider text-white uppercase hover:text-[#d4ff00] transition-colors"
                            >
                                <span className="text-2xl font-black text-[#d4ff00]">▲</span>
                                <span>cuttingedger</span>
                            </Link>
                            <p className="text-xs sm:text-sm text-neutral-400 font-sans max-w-sm">
                                Radical digital agency & creative engineering studio for visionary innovators.
                            </p>
                        </div>

                        {/* Navigation Links */}
                        <nav className="flex flex-wrap items-center gap-6 sm:gap-8 text-xs sm:text-sm font-mono uppercase tracking-wider text-neutral-300">
                            <Link href="/work" className="hover:text-[#d4ff00] transition-colors">
                                Work
                            </Link>
                            <Link href="/services" className="hover:text-[#d4ff00] transition-colors">
                                Services
                            </Link>
                            <Link href="/about" className="hover:text-[#d4ff00] transition-colors">
                                About
                            </Link>
                            <Link href="/pricing" className="hover:text-[#d4ff00] transition-colors">
                                Pricing
                            </Link>
                            <Link href="/contact" className="hover:text-[#d4ff00] transition-colors">
                                Contact
                            </Link>
                        </nav>

                        {/* Quick CTA */}
                        <div className="flex items-center gap-3">
                            <Link
                                href="/contact"
                                onClick={(e) => {
                                    if (onOpenContact) {
                                        e.preventDefault();
                                        onOpenContact();
                                    }
                                }}
                                className="px-5 py-2.5 rounded-full border border-white/20 bg-white/5 hover:bg-[#d4ff00] hover:text-black hover:border-[#d4ff00] text-xs font-mono uppercase tracking-wider text-white transition-all duration-300 shadow-sm"
                            >
                                Start a Project
                            </Link>
                        </div>
                    </div>

                    {/* Sub Row: Copyright, Socials & Back To Top */}
                    <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-neutral-400 font-sans">
                        {/* Copyright & Legal */}
                        <div className="flex items-center gap-6 order-2 sm:order-1">
                            <span>Copyright © {new Date().getFullYear()} CuttingEdger.</span>
                            <Link href="/privacy" className="hover:text-white transition-colors">
                                Privacy
                            </Link>
                            <Link href="/terms" className="hover:text-white transition-colors">
                                Terms
                            </Link>
                        </div>

                        {/* Socials with hover underline */}
                        <div className="flex items-center gap-6 order-1 sm:order-2">
                            {socials.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="relative text-[#f9f4e8]/80 hover:text-white transition-colors font-medium tracking-wide after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[1px] after:bg-[#d4ff00] after:transition-all after:duration-300"
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
            {/* AGNTIX DESIGN STUDIO ISOLATED ROUNDED FOOTER CARD (.elementor-element-bdce392) */}
            <div
                className="relative rounded-[24px] sm:rounded-[36px] overflow-hidden border border-white/10 min-h-[82vh] lg:min-h-[88vh] flex flex-col justify-between p-6 sm:p-10 lg:p-14 shadow-[0_30px_90px_rgba(0,0,0,0.95)]"
                style={{
                    backgroundColor: '#080302',
                    backgroundImage: "url('/images/footer-bg.jpg')",
                    backgroundPosition: 'center center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                }}
            >
                {/* Subtle contrast vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/40 pointer-events-none" />

                {/* TOP BAR: Agency Headline, Logo & Location (.des-footer-top) */}
                <div className="relative z-10 w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-base font-sans text-[#f9f4e8]">
                    <span className="font-normal text-[#f9f4e8]/90 tracking-wide order-2 sm:order-1">
                        Creative Design Agency
                    </span>

                    {/* Agency Brand Mark */}
                    <Link
                        href="/"
                        className="order-1 sm:order-2 inline-flex items-center gap-1.5 font-['MangoGrotesque',_'Antonio',_sans-serif] text-3xl sm:text-4xl font-normal tracking-wider text-white uppercase hover:text-[#d4ff00] transition-colors"
                    >
                        <span className="text-2xl font-black text-[#d4ff00]">▲</span>
                        <span>cuttingedger</span>
                    </Link>

                    <span className="font-normal text-[#f9f4e8]/90 tracking-wide order-3 hidden sm:inline-block">
                        {settings?.office_address || 'Based in London'}
                    </span>
                </div>

                {/* MIDDLE SECTION: GIANT AGNTIX "CONTACT US" WITH VERTICAL LETTER-SCALE HOVER (.des-footer-title) */}
                <div className="relative z-10 w-full px-2 sm:px-4 py-14 sm:py-20 flex flex-col items-center justify-center text-center my-auto">
                    {/* Eyebrow Subtitle */}
                    <span className="font-['Plus_Jakarta_Sans',_sans-serif] text-xs sm:text-sm uppercase tracking-[0.22em] text-[#f9f4e8]/70 font-medium mb-6 sm:mb-8 select-none">
                        CONTACT US AND LET'S BRING YOUR VISION TO LIFE
                    </span>

                    {/* Giant Interactive Stretch Typography Container */}
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
                        <div className="flex items-start justify-center flex-nowrap overflow-visible">
                            {letters.map((char, index) => {
                                if (char === ' ') {
                                    return (
                                        <span
                                            key={`space-${index}`}
                                            className="w-3 sm:w-6 md:w-10 lg:w-14 inline-block pointer-events-none"
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
                                            scaleY: isHovered ? 1.3 : 1,
                                            y: isHovered ? '6.5%' : '0%',
                                        }}
                                        transition={{
                                            duration: 0.2,
                                            ease: [0.39, 0.575, 0.565, 1], // Exact GSAP sine easing from Agntix
                                        }}
                                        style={{
                                            transformOrigin: 'center center',
                                        }}
                                        className="inline-block font-['MangoGrotesque',_'Antonio',_sans-serif] font-normal uppercase text-[90px] xs:text-[130px] sm:text-[190px] md:text-[270px] lg:text-[340px] xl:text-[400px] leading-[0.86] text-[#f9f4e8] tracking-[-0.01em] will-change-transform select-none cursor-pointer hover:text-white"
                                    >
                                        {char}
                                    </motion.span>
                                );
                            })}
                        </div>
                    </Link>
                </div>

                {/* BOTTOM BAR: Powered by, Socials, Copyright & Back to Top (.des-footer-bottom) */}
                <div className="relative z-10 w-full pt-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs sm:text-sm font-sans text-[#f9f4e8] border-t border-white/10">
                    {/* Left: Powered By & Legal Links */}
                    <div className="flex items-center gap-6">
                        <span>Powered by CuttingEdger</span>
                        <Link
                            href="/privacy"
                            className="text-[#f9f4e8]/60 hover:text-white transition-colors text-xs"
                        >
                            Privacy
                        </Link>
                        <Link
                            href="/terms"
                            className="text-[#f9f4e8]/60 hover:text-white transition-colors text-xs"
                        >
                            Terms
                        </Link>
                    </div>

                    {/* Center: Social Links with hover underline */}
                    <div className="flex items-center gap-6 sm:gap-8">
                        {socials.map((social) => (
                            <a
                                key={social.name}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative text-[#f9f4e8] hover:text-white transition-colors font-medium tracking-wide after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[1px] after:bg-[#f9f4e8] after:transition-all after:duration-300"
                            >
                                {social.name}
                            </a>
                        ))}
                    </div>

                    {/* Right: Copyright + White Floating Back to Top Button */}
                    <div className="flex items-center gap-4">
                        <span>Copyright © {new Date().getFullYear()}</span>

                        <button
                            type="button"
                            onClick={scrollToTop}
                            aria-label="Scroll back to top"
                            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-black flex items-center justify-center hover:bg-[#d4ff00] transition-all duration-300 shadow-xl cursor-pointer shrink-0"
                        >
                            <ChevronUp className="w-5 h-5 stroke-[2.5]" />
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
