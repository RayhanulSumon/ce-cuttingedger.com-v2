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
        { name: 'Twitter', url: settings?.social_twitter || 'https://twitter.com' },
        { name: 'Instagram', url: settings?.social_instagram || 'https://instagram.com' },
        { name: 'Behance', url: 'https://behance.net' },
        { name: 'Dribbble', url: settings?.social_dribbble || 'https://dribbble.com' },
        { name: 'LinkedIn', url: settings?.social_linkedin || 'https://linkedin.com' },
    ];

    const serviceLinks = [
        { label: 'Product & Web Design', href: '/services' },
        { label: 'Brand Identity Systems', href: '/services' },
        { label: 'Kinetic 3D & Spatial Web', href: '/services' },
        { label: 'Full-Stack Engineering', href: '/services' },
        { label: 'Motion & Interactive Reel', href: '/work' },
    ];

    const agencyLinks = [
        { label: 'Work Archive', href: '/work' },
        { label: 'Our Philosophy', href: '/about' },
        { label: 'Creative Team', href: '/team' },
        { label: 'Careers', href: '/careers' },
        { label: 'Pricing Plans', href: '/pricing' },
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
                    {/* Top Multi-Column Grid spanning full edge-to-edge container */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-white/10">
                        {/* Col 1: Brand & Studio Identity (4 cols) */}
                        <div className="lg:col-span-4 space-y-6">
                            <Link
                                href="/"
                                className="group inline-flex items-center gap-2.5 focus-visible:ring-2 focus-visible:ring-[#d4ff00] rounded-lg"
                            >
                                <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-[#d4ff00] group-hover:bg-[#d4ff00] group-hover:text-black transition-all duration-300">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                        <path d="M12 2L2 22h7l3-6 3 6h7L12 2zm0 6l1.8 3.6h-3.6L12 8z" />
                                    </svg>
                                </div>
                                <div className="flex items-baseline tracking-tight">
                                    <span className="font-['Clash_Display',_'Syne',_'Outfit',_sans-serif] text-2xl sm:text-3xl font-bold tracking-wider text-white transition-colors">
                                        CUTTING
                                    </span>
                                    <span className="font-['Clash_Display',_'Syne',_'Outfit',_sans-serif] text-2xl sm:text-3xl font-bold tracking-wider text-[#d4ff00] ml-1.5">
                                        EDGER.
                                    </span>
                                </div>
                            </Link>

                            <p className="text-sm text-neutral-400 font-sans leading-relaxed max-w-md">
                                Independent digital agency engineering kinetic software interfaces, tactile brand identities, and immersive platforms for visionary leaders.
                            </p>

                            <div className="space-y-2 text-xs text-neutral-400 font-sans">
                                <div className="flex items-center gap-2 text-neutral-300">
                                    <MapPin className="w-3.5 h-3.5 text-[#d4ff00] shrink-0" />
                                    <span>{settings?.office_address || '742 Evergreen Terrace, Creative District, SF'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-neutral-300">
                                    <Mail className="w-3.5 h-3.5 text-[#d4ff00] shrink-0" />
                                    <a
                                        href={`mailto:${settings?.contact_email || 'hello@cuttingedger.com'}`}
                                        className="hover:text-[#d4ff00] transition-colors"
                                    >
                                        {settings?.contact_email || 'hello@cuttingedger.com'}
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Col 2: Services (2 cols) */}
                        <div className="lg:col-span-2 space-y-4">
                            <h3 className="font-mono text-xs uppercase tracking-widest text-[#d4ff00]">
                                Services
                            </h3>
                            <ul className="space-y-2.5 text-xs text-neutral-400 font-sans">
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

                        {/* Col 3: Studio & Pages (2 cols) */}
                        <div className="lg:col-span-2 space-y-4">
                            <h3 className="font-mono text-xs uppercase tracking-widest text-[#d4ff00]">
                                Agency
                            </h3>
                            <ul className="space-y-2.5 text-xs text-neutral-400 font-sans">
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

                        {/* Col 4: Dispatch Newsletter & Start a Project CTA (4 cols) */}
                        <div className="lg:col-span-4 space-y-5">
                            <div className="space-y-2">
                                <h3 className="font-mono text-xs uppercase tracking-widest text-[#d4ff00]">
                                    The Dispatch
                                </h3>
                                <p className="text-xs text-neutral-400 font-sans leading-relaxed max-w-sm">
                                    Subscribed by 4,000+ designers and founders. Tactical essays on code architecture, brand systems, and kinetic UI.
                                </p>
                            </div>

                            <form onSubmit={handleNewsletterSubmit} className="space-y-2.5">
                                <div className="relative flex items-center">
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="operative@agency.com"
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
                                        <span>Subscribed to CuttingEdger Dispatch.</span>
                                    </p>
                                )}
                            </form>

                            {/* Direct Project CTA */}
                            <div className="pt-1">
                                <Link
                                    href="/contact"
                                    onClick={(e) => {
                                        if (onOpenContact) {
                                            e.preventDefault();
                                            onOpenContact();
                                        }
                                    }}
                                    className="group inline-flex items-center justify-between w-full px-4 py-3 rounded-xl border border-white/15 bg-white/[0.03] hover:bg-[#d4ff00] hover:text-black hover:border-[#d4ff00] transition-all duration-300"
                                >
                                    <span className="text-xs font-mono uppercase tracking-wider font-semibold">
                                        Have a project in mind?
                                    </span>
                                    <span className="flex items-center gap-1 text-xs font-mono font-bold uppercase text-[#d4ff00] group-hover:text-black transition-colors">
                                        Let's Talk
                                        <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Sub-Row: Copyright, Legal, Socials & Back To Top */}
                    <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-neutral-400 font-sans">
                        {/* Copyright & Legal */}
                        <div className="flex flex-wrap items-center gap-5 sm:gap-6 order-2 sm:order-1">
                            <span>Copyright © {new Date().getFullYear()} CuttingEdger Studio.</span>
                            <Link href="/privacy" className="hover:text-white transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="hover:text-white transition-colors">
                                Terms of Service
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
                        className="order-1 sm:order-2 inline-flex items-center gap-1.5 font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white uppercase hover:text-[#d4ff00] transition-colors"
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
                                        className="inline-block font-display font-black uppercase text-[90px] xs:text-[130px] sm:text-[190px] md:text-[270px] lg:text-[340px] xl:text-[400px] leading-[0.86] text-[#f9f4e8] tracking-[-0.03em] will-change-transform select-none cursor-pointer hover:text-white"
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
