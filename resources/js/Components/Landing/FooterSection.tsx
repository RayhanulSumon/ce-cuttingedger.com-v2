import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
import { PageProps } from '@/types';
import { Reveal, SectionProps } from './shared';

const LETTERS = Array.from('CONTACT US');

const LEGAL = [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Cookies', href: '/cookie-policy' },
    { label: 'NDA', href: '/nda-compliance' },
    { label: 'ESG', href: '/esg-policy' },
];

const DEFAULT_SOCIALS = [
    { name: 'Twitter', url: 'https://twitter.com/cutting_edger' },
    { name: 'Instagram', url: 'https://instagram.com/cuttingedgerinc' },
    { name: 'LinkedIn', url: 'https://linkedin.com/company/cutting-edger' },
    { name: 'Facebook', url: 'https://facebook.com/CuttingEdgerInc' },
    { name: 'YouTube', url: 'https://youtube.com/channel/UCJS-gaoOogk-552jQfRYPBQ' },
];

/** The familiar giant "CONTACT US" footer card, sized to fit one screen. */
export function FooterSection({ active, goTo }: SectionProps) {
    const { settings } = usePage<PageProps>().props;
    const [hovered, setHovered] = useState<number | null>(null);

    const configured = Object.entries(settings?.socials ?? {})
        .filter(([, url]) => !!url)
        .map(([name, url]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), url: url as string }));
    const socials = configured.length ? configured : DEFAULT_SOCIALS;

    return (
        <div className="h-full w-full bg-[#090a0d] p-3 pt-16 sm:p-5 sm:pt-20">
            <div
                data-scrollable
                className="relative flex h-full flex-col justify-between overflow-y-auto rounded-[24px] border border-white/10 bg-[#080302] bg-cover bg-center p-5 sm:rounded-[36px] sm:p-8 lg:p-12"
                style={{ backgroundImage: "url('/images/footer-bg.jpg')" }}
            >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/50" />

                <Reveal active={active} className="relative z-10 flex flex-col items-center justify-between gap-2 text-xs text-[#f9f4e8] sm:flex-row">
                    <span className="font-mono text-[11px] text-[#f9f4e8]/90">AI-Driven Visual Performance Agency</span>
                    <Link href="/" className="inline-flex items-center gap-2.5 text-xl font-extrabold uppercase tracking-tight text-white transition-colors hover:text-[#f5a623] sm:text-2xl">
                        <img src="/images/ce/ce_icon_neon.png" alt="" className="h-6 w-6 object-contain" />
                        cutting edger
                    </Link>
                    <span className="hidden font-mono text-[11px] text-[#f9f4e8]/90 sm:inline">Dhaka · London · San Francisco</span>
                </Reveal>

                <Reveal active={active} delay={0.1} className="relative z-10 my-auto flex flex-col items-center py-6 text-center">
                    <span className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-[#f5a623] sm:mb-5">
                        Ready to elevate your catalog craft &amp; velocity?
                    </span>
                    <Link
                        href="/contact"
                        title="Go to the contact page"
                        onPointerLeave={() => setHovered(null)}
                        className="group flex w-full max-w-full items-center justify-center focus:outline-none"
                    >
                        <span className="flex flex-nowrap items-center justify-center" aria-label="Contact us">
                            {LETTERS.map((char, i) =>
                                char === ' ' ? (
                                    <span key={i} className="inline-block w-[2.4vw] sm:w-[3vw]" aria-hidden="true" />
                                ) : (
                                    <motion.span
                                        key={i}
                                        aria-hidden="true"
                                        onPointerEnter={() => setHovered(i)}
                                        onPointerLeave={() => setHovered((prev) => (prev === i ? null : prev))}
                                        animate={{ scaleY: hovered === i ? 1.15 : 1, y: hovered === i ? '-2%' : '0%' }}
                                        transition={{ duration: 0.2, ease: [0.39, 0.575, 0.565, 1] }}
                                        style={{ transformOrigin: 'center bottom' }}
                                        className="inline-block select-none text-[min(11.5vw,24vh)] font-black uppercase leading-[0.95] tracking-[-0.04em] text-[#f9f4e8] transition-colors group-hover:text-white"
                                    >
                                        {char}
                                    </motion.span>
                                ),
                            )}
                        </span>
                    </Link>
                </Reveal>

                <Reveal
                    active={active}
                    delay={0.2}
                    className="relative z-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-5 font-mono text-xs text-[#f9f4e8] md:flex-row"
                >
                    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
                        <span>© {new Date().getFullYear()} Cutting Edger</span>
                        {LEGAL.map((l) => (
                            <Link key={l.href} href={l.href} className="text-[#f9f4e8]/70 transition-colors hover:text-white">
                                {l.label}
                            </Link>
                        ))}
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1">
                        {socials.map((s) => (
                            <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="text-[#f9f4e8]/80 transition-colors hover:text-white">
                                {s.name}
                            </a>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={() => goTo(0)}
                        aria-label="Back to top"
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-black shadow-xl transition-colors hover:bg-[#f5a623]"
                    >
                        <ChevronUp size={20} strokeWidth={2.5} />
                    </button>
                </Reveal>
            </div>
        </div>
    );
}
