import React, { memo, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
import { PageProps } from '@/types';
import { Reveal, SectionProps } from './shared';

const LETTERS = Array.from('CONTACT US');

const MAIN_LINKS = [
    { label: 'Capabilities', href: '/capabilities' },
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' },
];

const POLICY = [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Cookies', href: '/cookie-policy' },
    { label: 'NDA', href: '/nda-compliance' },
];

const DEFAULT_SOCIALS = [
    { name: 'Twitter', url: 'https://twitter.com/cutting_edger' },
    { name: 'Instagram', url: 'https://instagram.com/cuttingedgerinc' },
    { name: 'LinkedIn', url: 'https://linkedin.com/company/cutting-edger' },
    { name: 'Facebook', url: 'https://facebook.com/CuttingEdgerInc' },
    { name: 'YouTube', url: 'https://youtube.com/channel/UCJS-gaoOogk-552jQfRYPBQ' },
];

/** Light theme gradient: white to page colour, with a soft primary-colour glow rising from the bottom right. */
const FOOTER_GRADIENT = [
    'radial-gradient(62% 80% at 90% 115%, color-mix(in srgb, var(--color-primary) 30%, transparent), transparent 70%)',
    'radial-gradient(40% 50% at 6% -6%, color-mix(in srgb, var(--color-primary) 10%, transparent), transparent 70%)',
    'linear-gradient(160deg, var(--color-surface) 0%, var(--color-page) 100%)',
].join(', ');

/**
 * Letter fill: ink at rest, sliding into an ink-to-primary gradient when hovered. The gradient is three
 * times taller than the letter and only its position moves, so the change is smooth instead of a flat colour swap.
 */
const LETTER_FILL =
    'linear-gradient(180deg, var(--color-ink) 0%, var(--color-ink) 34%, var(--color-primary-ink) 60%, var(--color-primary) 84%, color-mix(in srgb, var(--color-primary) 70%, white) 100%)';

/** One labelled line of the contact box, with a thin rule under it. */
function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-baseline justify-between gap-6 border-b border-ink/15 py-2.5 first:pt-0 last:border-b-0 last:pb-0">
            <dt className="text-[10px] font-bold uppercase tracking-[0.2em] text-subtle">{label}</dt>
            <dd className="text-right text-[13px] font-semibold text-ink">{children}</dd>
        </div>
    );
}

/** The giant "CONTACT US" footer card, sized to fit one screen. */
export const FooterSection = memo(function FooterSection({ active, goTo }: SectionProps) {
    const { settings } = usePage<PageProps>().props;
    const [hovered, setHovered] = useState<number | null>(null);
    const [groupHover, setGroupHover] = useState(false);

    const configured = Object.entries(settings?.socials ?? {})
        .filter(([, url]) => !!url)
        .map(([name, url]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), url: url as string }));
    const socials = configured.length ? configured : DEFAULT_SOCIALS;

    const email = settings?.contact_email || 'hello@cuttingedger.com';
    const phones = settings?.contact_phones ?? [];
    const office = settings?.office_address;

    return (
        <div className="h-full w-full bg-page p-3 pt-16 sm:p-5 sm:pt-20">
            <div
                data-scrollable
                className="relative flex h-full flex-col justify-between gap-6 overflow-y-auto rounded-[24px] border border-ink/10 p-5 sm:rounded-[36px] sm:p-8 lg:p-10"
                style={{ backgroundImage: FOOTER_GRADIENT }}
            >
                {/* Soft grid that fades out towards the glow, for a little texture. */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,var(--color-ink)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-ink)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:linear-gradient(to_bottom,black,transparent_75%)]"
                />

                {/* Top: how to reach us */}
                <Reveal active={active} className="relative z-10 flex md:justify-end">
                    <dl className="w-full md:max-w-sm">
                        <InfoRow label="Email">
                            <a href={`mailto:${email}`} className="transition-colors hover:text-primary-ink">
                                {email}
                            </a>
                        </InfoRow>
                        {phones.map((phone) => (
                            <InfoRow key={`${phone.label}-${phone.number}`} label={phone.label}>
                                <a href={`tel:${phone.number.replace(/[^+\d]/g, '')}`} className="transition-colors hover:text-primary-ink">
                                    {phone.number}
                                </a>
                            </InfoRow>
                        ))}
                        {office && <InfoRow label="Office">{office}</InfoRow>}
                    </dl>
                </Reveal>

                {/* Middle: the big call to action */}
                <Reveal active={active} delay={0.12} className="relative z-10 my-auto flex flex-col items-center py-2 text-center">
                    <span className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-primary-ink sm:mb-4">
                        Ready to elevate your catalog craft &amp; velocity?
                    </span>
                    <Link
                        href="/contact"
                        prefetch
                        title="Go to the contact page"
                        onPointerEnter={() => setGroupHover(true)}
                        onPointerLeave={() => {
                            setHovered(null);
                            setGroupHover(false);
                        }}
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
                                        animate={{ scaleY: hovered === i ? 1.12 : 1, y: hovered === i ? '-2%' : '0%' }}
                                        transition={{ duration: 0.25, ease: [0.39, 0.575, 0.565, 1] }}
                                        style={{
                                            transformOrigin: 'center bottom',
                                            backgroundImage: LETTER_FILL,
                                            backgroundSize: '100% 300%',
                                            backgroundPosition: hovered === i ? '0% 100%' : groupHover ? '0% 42%' : '0% 0%',
                                            WebkitBackgroundClip: 'text',
                                            backgroundClip: 'text',
                                            color: 'transparent',
                                        }}
                                        className="inline-block select-none text-[min(10.5vw,20vh)] font-black uppercase leading-[0.95] tracking-[-0.04em] [transition:background-position_0.55s_cubic-bezier(0.22,1,0.36,1)]"
                                    >
                                        {char}
                                    </motion.span>
                                ),
                            )}
                        </span>
                    </Link>
                </Reveal>

                {/* Bottom: one line of links, one line of small print */}
                <Reveal active={active} delay={0.26} className="relative z-10 space-y-4 border-t border-ink/10 pt-5">
                    <nav aria-label="Footer" className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <ul className="flex flex-wrap gap-x-6 gap-y-2">
                            {MAIN_LINKS.map((item) => (
                                <li key={item.href}>
                                    <Link href={item.href} prefetch className="text-sm font-semibold text-ink transition-colors hover:text-primary-ink">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <ul className="flex flex-wrap gap-x-5 gap-y-2">
                            {socials.map((social) => (
                                <li key={social.name}>
                                    <a href={social.url} target="_blank" rel="noopener noreferrer" className="text-sm text-muted transition-colors hover:text-ink">
                                        {social.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="flex items-center justify-between gap-4 text-xs text-subtle">
                        <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
                            <span>© {new Date().getFullYear()} Cutting Edger</span>
                            {POLICY.map((item) => (
                                <Link key={item.href} href={item.href} className="transition-colors hover:text-ink">
                                    {item.label}
                                </Link>
                            ))}
                        </p>
                        <button
                            type="button"
                            onClick={() => goTo(0)}
                            aria-label="Back to top"
                            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-white shadow-lg transition-colors hover:bg-primary"
                        >
                            <ChevronUp size={18} strokeWidth={2.5} />
                        </button>
                    </div>
                </Reveal>
            </div>
        </div>
    );
});
