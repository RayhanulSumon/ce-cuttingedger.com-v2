import React, { memo, useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Check, MessageCircle } from 'lucide-react';
import { PageProps } from '@/types';
import { SocialIcon } from './SocialIcon';
import { Reveal, SectionProps } from './shared';

const LETTERS = Array.from('CONTACT US');

const MAIN_LINKS = [
    { label: 'Capabilities', href: '/capabilities' },
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'About', href: '/about' },
    { label: 'Team', href: '/team' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' },
];

const POLICY = [
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

/** Refined warm editorial surface with a soft ember wash in the lower corner. */
const FOOTER_GRADIENT = [
    'radial-gradient(65% 80% at 92% 115%, color-mix(in srgb, var(--color-primary) 18%, transparent), transparent 68%)',
    'radial-gradient(45% 55% at 0% 110%, color-mix(in srgb, var(--color-primary) 8%, transparent), transparent 70%)',
    'linear-gradient(165deg, var(--color-surface) 0%, var(--color-page) 100%)',
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
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-6 border-b border-ink/15 py-1.5 first:pt-0 last:border-b-0 last:pb-0">
            <dt className="text-2xs font-bold uppercase tracking-[0.2em] text-subtle shrink-0">{label}</dt>
            <dd className="text-left sm:text-right text-xs sm:text-sm font-semibold text-ink break-words">{children}</dd>
        </div>
    );
}

/** Email signup for the newsletter. Success is shown in place, because the homepage has no toast area. */
function NewsletterSignup() {
    const { data, setData, post, processing, errors, reset } = useForm({ email: '' });
    const [done, setDone] = useState(false);

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        post('/newsletter', {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                reset('email');
                setDone(true);
            },
        });
    };

    return (
        <div className="max-w-md">
            <p className="text-lg font-extrabold leading-tight tracking-[-0.02em] text-ink sm:text-xl">Get new work and tips in your inbox.</p>
            <p className="mt-1 text-xs text-muted">Occasional emails on retouching, 3D and catalog workflows. No spam.</p>

            {done ? (
                <p role="status" className="mt-3 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white">
                    <Check size={14} strokeWidth={3} /> You are on the list.
                </p>
            ) : (
                <form onSubmit={submit} className="mt-3">
                    <div className="flex items-center gap-1.5 rounded-full border border-ink/15 bg-surface p-1 pl-4 shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                        <label htmlFor="footer-newsletter" className="sr-only">
                            Email address
                        </label>
                        <input
                            id="footer-newsletter"
                            type="email"
                            required
                            value={data.email}
                            onChange={(event) => setData('email', event.target.value)}
                            placeholder="you@company.com"
                            autoComplete="email"
                            className="min-w-0 flex-1 bg-transparent text-xs sm:text-sm text-ink placeholder-faint outline-none"
                        />
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-surface transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-60"
                        >
                            {processing ? 'Sending…' : 'Subscribe'}
                            <ArrowUpRight size={13} />
                        </button>
                    </div>
                    {errors.email && <p className="mt-1.5 pl-4 text-xs text-danger">{errors.email}</p>}
                </form>
            )}
        </div>
    );
}

/** The giant "CONTACT US" footer card, sized to fit one screen on the landing page or flow naturally in inner layouts. */
export const FooterSection = memo(function FooterSection({
    active = true,
    fullpage = true,
}: Partial<SectionProps> & { fullpage?: boolean }) {
    const { settings } = usePage<PageProps>().props;
    const [hovered, setHovered] = useState<number | null>(null);
    const [groupHover, setGroupHover] = useState(false);

    const configured = Object.entries(settings?.socials ?? {})
        .filter(([, url]) => !!url)
        .map(([name, url]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), url: url as string }));
    const socials = configured.length ? configured : DEFAULT_SOCIALS;

    const email = settings?.contact_email || 'info@cuttingedger.com';
    const phones = settings?.contact_phones ?? [];
    const office = settings?.office_address;
    const whatsapp = (settings?.whatsapp_number ?? '').replace(/\D/g, '');
    const Outer = fullpage ? 'div' : 'footer';

    return (
        <Outer className={fullpage ? 'h-full w-full bg-page p-2.5 pt-16 sm:p-4 sm:pt-18 lg:p-5 lg:pt-20' : 'w-full bg-page p-3 sm:p-5'}>
            <div
                data-scrollable={fullpage ? '' : undefined}
                className={`relative flex flex-col justify-between rounded-[24px] border border-ink/10 p-4 sm:rounded-[32px] sm:p-6 lg:p-7 ${
                    fullpage ? 'h-full gap-3 sm:gap-4 overflow-hidden pb-4 sm:pb-5' : 'gap-8 overflow-hidden pb-16 sm:pb-10'
                }`}
                style={{ backgroundImage: FOOTER_GRADIENT }}
            >
                {/* Soft grid that fades out towards the glow, for a little texture. */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(to_right,var(--color-ink)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-ink)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:linear-gradient(to_bottom,black,transparent_75%)]"
                />

                {/* Top: newsletter on the left, how to reach us on the right */}
                <Reveal active={active} className="relative z-10 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] md:items-start">
                    <NewsletterSignup />

                    <dl className="w-full rounded-2xl border border-ink/10 bg-surface/80 p-3.5 sm:p-4 shadow-sm backdrop-blur-sm md:justify-self-end">
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
                        {whatsapp && (
                            <InfoRow label="WhatsApp">
                                <a
                                    href={`https://wa.me/${whatsapp}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 transition-colors hover:text-primary-ink"
                                >
                                    <MessageCircle size={14} /> Chat on WhatsApp
                                </a>
                            </InfoRow>
                        )}
                        {office && <InfoRow label="Office">{office}</InfoRow>}
                    </dl>
                </Reveal>

                {/* Middle: the big call to action */}
                <Reveal active={active} delay={0.12} className="relative z-10 my-auto flex flex-col items-center py-2 sm:py-3 text-center">
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
                                    <span key={i} className="inline-block w-[2.5vw] sm:w-[3vw]" aria-hidden="true" />
                                ) : (
                                    <motion.span
                                        key={i}
                                        aria-hidden="true"
                                        onPointerEnter={() => setHovered(i)}
                                        onPointerLeave={() => setHovered((prev) => (prev === i ? null : prev))}
                                        animate={{ scaleY: hovered === i ? 1.15 : 1.04, y: hovered === i ? '-2%' : '0%' }}
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
                                        className="inline-block select-none text-[clamp(36px,10vw,17vh)] font-black uppercase leading-[0.95] tracking-[-0.04em] [transition:background-position_0.55s_cubic-bezier(0.22,1,0.36,1)]"
                                    >
                                        {char}
                                    </motion.span>
                                ),
                            )}
                        </span>
                    </Link>
                </Reveal>

                {/* Bottom: one line of links, one line of small print */}
                <Reveal active={active} delay={0.26} className="relative z-10 space-y-2.5 border-t border-ink/10 pt-3 sm:pt-4">
                    <nav aria-label="Footer" className="flex flex-col gap-2.5 md:flex-row md:items-center md:justify-between">
                        <ul className="flex flex-wrap gap-x-5 gap-y-1.5">
                            {MAIN_LINKS.map((item) => (
                                <li key={item.href}>
                                    <Link href={item.href} prefetch className="text-xs sm:text-sm font-semibold text-ink transition-colors hover:text-primary-ink">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <ul className="flex flex-wrap gap-1.5">
                            {socials.map((social) => (
                                <li key={social.name}>
                                    <a
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.name}
                                        title={social.name}
                                        className="grid h-8 w-8 place-items-center rounded-full border border-ink/15 bg-surface/70 text-ink transition-[transform,background-color,color,border-color] duration-300 hover:-translate-y-0.5 hover:border-ink hover:bg-ink hover:text-white"
                                    >
                                        <SocialIcon name={social.name} />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="flex items-center justify-between gap-4 text-2xs text-subtle">
                        <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span>© {new Date().getFullYear()} Cutting Edger</span>
                            {POLICY.map((item) => (
                                <Link key={item.href} href={item.href} prefetch className="transition-colors hover:text-ink">
                                    {item.label}
                                </Link>
                            ))}
                        </p>
                    </div>
                </Reveal>
            </div>
        </Outer>
    );
});
