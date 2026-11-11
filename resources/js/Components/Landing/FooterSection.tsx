import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { PageProps } from '@/types';
import { Reveal, SectionProps } from './shared';

const LINKS = [
    { label: 'Services', href: '/services' },
    { label: 'Case studies', href: '/case-studies' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
];

const LEGAL = [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Cookies', href: '/cookie-policy' },
];

export function FooterSection({ active, openDemo }: SectionProps) {
    const { settings } = usePage<PageProps>().props;
    const email = settings?.contact_email || 'hello@cuttingedger.com';
    const socials = Object.entries(settings?.socials ?? {}).filter(([, url]) => !!url) as [string, string][];

    return (
        <div data-scrollable className="flex h-full w-full flex-col justify-between overflow-y-auto bg-[#0A0D14] px-6 pb-6 pt-24 text-[#F2F4F8] sm:px-14">
            <Reveal active={active}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/50">09 / Contact us</p>
                <button
                    type="button"
                    onClick={openDemo}
                    className="mt-3 text-left text-[clamp(44px,11vw,180px)] font-extrabold uppercase leading-[0.85] tracking-[-0.05em] transition-colors hover:text-[#6F86FF]"
                >
                    Contact us
                </button>
            </Reveal>

            <Reveal active={active} delay={0.15} className="mt-10 grid gap-10 border-t border-white/15 pt-8 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-3 text-sm text-white/75">
                    <a href={`mailto:${email}`} className="flex items-center gap-2 hover:text-white">
                        <Mail size={16} /> {email}
                    </a>
                    {settings?.contact_phone && (
                        <a href={`tel:${settings.contact_phone}`} className="flex items-center gap-2 hover:text-white">
                            <Phone size={16} /> {settings.contact_phone}
                        </a>
                    )}
                    {settings?.office_address && (
                        <p className="flex items-start gap-2">
                            <MapPin size={16} className="mt-0.5 shrink-0" /> {settings.office_address}
                        </p>
                    )}
                </div>
                <nav aria-label="Footer" className="grid grid-cols-2 gap-2 text-sm text-white/75">
                    {LINKS.map((l) => (
                        <Link key={l.href} href={l.href} className="hover:text-white">
                            {l.label}
                        </Link>
                    ))}
                </nav>
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm capitalize text-white/75">
                    {socials.map(([name, url]) => (
                        <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                            {name}
                        </a>
                    ))}
                </div>
                <div className="flex gap-5 text-xs text-white/50 sm:justify-end">
                    {LEGAL.map((l) => (
                        <Link key={l.href} href={l.href} className="hover:text-white">
                            {l.label}
                        </Link>
                    ))}
                </div>
            </Reveal>
            <p className="mt-8 text-xs text-white/40">© {new Date().getFullYear()} CuttingEdger. All rights reserved.</p>
        </div>
    );
}

