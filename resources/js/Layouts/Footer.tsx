import React from 'react';
import { Link, usePage, useForm } from '@inertiajs/react';
import { ChevronUp, ArrowUpRight, ArrowRight, Mail, MapPin, CheckCircle2, Calendar } from 'lucide-react';
import { SiteSettings } from '@/types/models';
import { PageProps } from '@/types';

interface FooterProps {
    settings?: SiteSettings;
    onOpenContact?: () => void;
    compact?: boolean;
}

export function Footer({ settings, onOpenContact, compact }: FooterProps) {
    const { url } = usePage();
    const { services_nav = [] } = usePage<PageProps>().props;
    const isHomePage = url === '/' || url.split('?')[0] === '';
    const isCompact = compact !== undefined ? compact : !isHomePage;

    const { data, setData, post, processing, recentlySuccessful, reset } = useForm({
        email: '',
    });

    const handleNewsletterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.email) {
            return;
        }
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

    const handleBookConsultation = () => {
        if (onOpenContact) {
            onOpenContact();
            return;
        }
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('ce:open-discovery-call'));
        }
    };

    const socials = [
        { name: 'X', label: 'X', url: settings?.social_twitter || 'https://twitter.com/cutting_edger' },
        { name: 'Instagram', label: 'IG', url: settings?.social_instagram || 'https://instagram.com/cuttingedgerinc' },
        { name: 'LinkedIn', label: 'IN', url: settings?.social_linkedin || 'https://linkedin.com/company/cutting-edger' },
        { name: 'Facebook', label: 'FB', url: 'https://facebook.com/CuttingEdgerInc' },
        { name: 'YouTube', label: 'YT', url: 'https://youtube.com/channel/UCJS-gaoOogk-552jQfRYPBQ' },
    ];

    const dynamicServiceLinks =
        services_nav.length > 0
            ? services_nav
                  .flatMap((pillar) => [
                      { label: pillar.title, href: pillar.path },
                      ...(pillar.children || [])
                          .slice(0, 1)
                          .map((child) => ({ label: child.title, href: child.path })),
                  ])
                  .slice(0, 6)
            : [
                  { label: 'AI-Powered Visual Production', href: '/services/virtual-production-cgi' },
                  { label: '3D Spatial CGI & Motion', href: '/services/virtual-production-cgi' },
                  { label: 'High-Volume Retouching & Prep', href: '/services/ecommerce-catalog-optimization' },
                  { label: 'Corporate Campaign Design', href: '/services/white-label-agency-extension' },
              ];

    const studioLinks = [
        { label: 'Home', href: '/' },
        { label: 'Services', href: '/services' },
        { label: 'Portfolio', href: '/case-studies' },
        { label: 'About Us', href: '/about' },
        { label: 'Leadership Team', href: '/team' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Contact', href: '/contact' },
    ];

    // =========================================================================
    // COMPACT FOOTER FOR INNER PAGES
    // =========================================================================
    if (isCompact) {
        return (
            <footer
                id="site-footer"
                className="relative bg-[#07080b] text-white border-t border-white/10 select-none overflow-hidden w-full"
            >
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent pointer-events-none" />

                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
                        <div className="lg:col-span-5 space-y-5">
                            <Link
                                href="/"
                                className="group inline-flex items-center gap-3 focus-visible:ring-2 focus-visible:ring-accent rounded-lg"
                            >
                                <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center p-1.5 group-hover:border-accent/60 transition-all">
                                    <img
                                        src="/images/ce/ce_icon_neon.png"
                                        alt="CuttingEdger"
                                        className="w-5 h-5 object-contain"
                                    />
                                </div>
                                <span className="font-display text-2xl font-black tracking-tight text-white">
                                    Cutting<span className="text-accent">Edger</span>
                                </span>
                            </Link>

                            <p className="text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed max-w-sm">
                                Enterprise creative &amp; AI visual production studio delivering surgical digital prep, high-volume retouching, and photorealistic 3D spatial CGI.
                            </p>

                            <div className="space-y-1.5 text-xs font-mono text-neutral-400">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-3.5 h-3.5 text-accent" />
                                    <span>Artisan Center, Level-7, West Panthapath, Dhaka 1215</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="w-3.5 h-3.5 text-accent" />
                                    <a href="mailto:hello@cuttingedger.com" className="hover:text-white transition-colors">
                                        hello@cuttingedger.com
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-4 space-y-3">
                            <h3 className="font-mono text-xs uppercase tracking-widest text-accent font-bold">
                                Capabilities
                            </h3>
                            <ul className="space-y-2 text-xs text-neutral-400 font-sans">
                                {dynamicServiceLinks.map((item) => (
                                    <li key={item.label}>
                                        <Link href={item.href} className="hover:text-white transition-colors block py-0.5">
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="lg:col-span-3 space-y-3">
                            <h3 className="font-mono text-xs uppercase tracking-widest text-accent font-bold">
                                Studio
                            </h3>
                            <ul className="space-y-2 text-xs text-neutral-400 font-sans">
                                {studioLinks.map((item) => (
                                    <li key={item.label}>
                                        <Link href={item.href} className="hover:text-white transition-colors block py-0.5">
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400 font-mono">
                        <div className="flex flex-wrap items-center gap-5">
                            <span>© {new Date().getFullYear()} CuttingEdger. All rights reserved.</span>
                            <Link href="/privacy" className="hover:text-white transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="hover:text-white transition-colors">
                                Terms of Service
                            </Link>
                            <Link href="/nda-compliance" className="hover:text-white transition-colors">
                                NDA &amp; ISO 27001
                            </Link>
                        </div>

                        <button
                            type="button"
                            onClick={scrollToTop}
                            aria-label="Scroll back to top"
                            className="w-9 h-9 rounded-full bg-white/10 hover:bg-accent hover:text-black text-white flex items-center justify-center transition-all cursor-pointer"
                        >
                            <ChevronUp className="w-4 h-4 stroke-[2.5]" />
                        </button>
                    </div>
                </div>
            </footer>
        );
    }

    // =========================================================================
    // HIGH-CONVERSION ENTERPRISE FOOTER (HOMEPAGE — MATCHING REFERENCE IMAGE & PROMPT)
    // =========================================================================
    return (
        <footer
            id="site-footer"
            className="relative bg-[#07080b] pt-14 sm:pt-20 pb-10 border-t border-white/10 select-none overflow-hidden"
        >
            {/* Ambient Warm Golden Glow behind CTA Box matching reference image */}
            <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[55rem] h-[22rem] bg-amber-500/[0.11] rounded-full blur-[160px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 xs:px-6 lg:px-8 relative z-10">
                {/* 1. GLOWING GOLD-BORDERED ENTERPRISE CTA CARD (Matching Reference Image + Upgraded Copy) */}
                <div className="relative rounded-3xl p-8 sm:p-12 lg:p-16 bg-gradient-to-b from-[#16140f] via-[#11100d] to-[#0c0d11] border border-amber-500/35 shadow-[0_0_70px_rgba(245,166,35,0.12),inset_0_1px_0_rgba(255,255,255,0.1)] text-center overflow-hidden mb-16 sm:mb-20">
                    {/* Subtle radial gold sheen */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(245,166,35,0.12),transparent)] pointer-events-none" />

                    <div className="relative z-10 max-w-3xl mx-auto space-y-5 sm:space-y-6">
                        <span className="inline-block font-mono text-[11px] sm:text-xs uppercase tracking-[0.3em] text-[#d4a853] font-semibold">
                            LET&apos;S CREATE SOMETHING EXCEPTIONAL
                        </span>

                        <h2 className="text-2xl sm:text-4xl lg:text-[2.75rem] font-serif font-normal text-[#f5deb3] tracking-tight leading-[1.18]">
                            Ready to Scale Your Creative Pipeline?{' '}
                            <span className="font-display font-extrabold text-white block mt-1">
                                Request a Free Pilot Project or Consultation.
                            </span>
                        </h2>

                        <p className="text-xs sm:text-sm text-neutral-300 font-sans max-w-xl mx-auto leading-relaxed">
                            Validate our surgical retouching, 3D spatial CGI, and AI production speed on your own brand assets—protected by ISO 27001 security and a strict mutual NDA.
                        </p>

                        <div className="pt-2 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
                            <Link
                                href="/contact?intent=free-pilot"
                                className="inline-flex items-center gap-2.5 px-7 sm:px-8 py-3.5 sm:py-4 rounded-full bg-gradient-to-b from-[#fcd34d] via-accent to-[#e09214] text-black font-display font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-[0_0_30px_rgba(245,166,35,0.35)] transition-all duration-300 cursor-pointer"
                            >
                                <span>Request a Free Pilot Project</span>
                                <ArrowUpRight className="w-4 h-4 text-black stroke-[2.5]" />
                            </Link>

                            <button
                                type="button"
                                onClick={handleBookConsultation}
                                className="inline-flex items-center gap-2 px-7 sm:px-8 py-3.5 sm:py-4 rounded-full bg-white/[0.04] hover:bg-white/10 text-[#f5deb3] hover:text-white border border-amber-500/35 hover:border-accent font-mono text-xs uppercase tracking-wider font-semibold transition-all duration-300 cursor-pointer"
                            >
                                <Calendar className="w-3.5 h-3.5 text-accent" />
                                <span>Schedule Consultation</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 2. THREE-COLUMN STUDIO FOOTER (Exact Reference Image Layout: CuttingEdger | STUDIO | SUBSCRIBE) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-white/10">
                    {/* Left Column: CuttingEdger Brand & Summary */}
                    <div className="md:col-span-5 space-y-4">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2.5 group focus:outline-none"
                        >
                            <img
                                src="/images/ce/ce_icon_neon.png"
                                alt="CuttingEdger"
                                className="w-6 h-6 object-contain"
                            />
                            <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#d4a853] group-hover:text-white transition-colors">
                                CuttingEdger
                            </span>
                        </Link>

                        <p className="text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed max-w-sm">
                            With over a decade of excellence in high-end visual production, CuttingEdger empowers global luxury brands and corporate agencies with AI workflows, precision retouching, and 3D spatial CGI.
                        </p>

                        <div className="pt-1 flex flex-wrap items-center gap-4 text-[11px] font-mono text-neutral-500">
                            <span>ISO 27001 Certified</span>
                            <span>•</span>
                            <span>Dhaka · London · New York</span>
                        </div>
                    </div>

                    {/* Middle Column: STUDIO Navigation */}
                    <div className="md:col-span-3 space-y-3">
                        <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-200 font-bold">
                            STUDIO
                        </h3>
                        <ul className="space-y-2 text-xs text-neutral-400 font-sans">
                            {studioLinks.map((item) => (
                                <li key={item.label}>
                                    <Link
                                        href={item.href}
                                        className="hover:text-accent transition-colors inline-block py-0.5"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right Column: SUBSCRIBE + Circular Social Icons */}
                    <div className="md:col-span-4 space-y-4">
                        <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-200 font-bold">
                            SUBSCRIBE
                        </h3>
                        <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                            Receive enterprise visual production benchmarks, AI workflow briefs, and 3D CGI case studies.
                        </p>

                        <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                            <div className="flex items-center gap-2">
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Enter corporate email..."
                                    required
                                    className="flex-1 bg-[#12131a] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-accent transition-colors font-sans"
                                />
                                <button
                                    type="submit"
                                    disabled={processing}
                                    aria-label="Subscribe"
                                    className="w-10 h-10 rounded-xl bg-white/[0.08] hover:bg-accent text-white hover:text-black border border-white/15 hover:border-accent flex items-center justify-center transition-all cursor-pointer shrink-0 disabled:opacity-50"
                                >
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                            {recentlySuccessful && (
                                <p className="text-[11px] text-accent font-mono flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>Subscribed to CuttingEdger Enterprise Brief.</span>
                                </p>
                            )}
                        </form>

                        {/* Circular Social Icons matching reference image */}
                        <div className="pt-2 flex items-center gap-2.5">
                            {socials.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={social.name}
                                    className="w-8 h-8 rounded-full border border-white/15 bg-white/[0.03] hover:border-accent hover:bg-accent hover:text-black text-neutral-400 flex items-center justify-center text-[10px] font-mono font-bold transition-all duration-300"
                                >
                                    {social.label}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 3. BOTTOM COPYRIGHT & METADATA ROW (Unified "CuttingEdger" Spelling) */}
                <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-neutral-500">
                    <div>
                        © {new Date().getFullYear()} CuttingEdger. All rights reserved.
                    </div>

                    <div className="flex flex-wrap items-center gap-5">
                        <Link href="/privacy" className="hover:text-neutral-300 transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="hover:text-neutral-300 transition-colors">
                            Terms &amp; Conditions
                        </Link>
                        <Link href="/nda-compliance" className="hover:text-neutral-300 transition-colors">
                            ISO 27001 &amp; NDA
                        </Link>
                        <button
                            type="button"
                            onClick={scrollToTop}
                            aria-label="Scroll to top"
                            className="w-7 h-7 rounded-full border border-white/15 hover:border-accent text-neutral-400 hover:text-accent flex items-center justify-center transition-colors cursor-pointer"
                        >
                            <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
