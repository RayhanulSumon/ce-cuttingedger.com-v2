import React, { useCallback, useEffect, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ChatWidget } from '@/Components/Chat/ChatWidget';
import { CookieConsentBanner } from '@/Components/Common/CookieConsentBanner';
import { DiscoveryCallModal } from '@/Components/Common/DiscoveryCallModal';
import { DemoModal } from '@/Components/Landing/DemoModal';
import { Menubar } from '@/Components/Landing/Menubar';
import { EASE_OUT_QUART, PAD_X } from '@/Components/Landing/shared';
import { Toaster, toast } from '@/Components/ui/sonner';
import { initializeAttribution } from '@/lib/attribution';
import { PageProps } from '@/types';
import { SlideOverContact } from './SlideOverContact';

const COMPANY_LINKS: [string, string][] = [
    ['About', '/about'],
    ['Team', '/team'],
    ['Careers', '/careers'],
    ['Case Studies', '/case-studies'],
    ['Blog', '/blog'],
    ['Pricing', '/pricing'],
    ['Contact', '/contact'],
];

const LEGAL_LINKS: [string, string][] = [
    ['Privacy', '/privacy'],
    ['Terms', '/terms'],
    ['Cookies', '/cookie-policy'],
    ['NDA', '/nda-compliance'],
    ['ESG', '/esg-policy'],
];

const FOOTER_HEADING = 'text-[11px] font-semibold uppercase tracking-[0.22em] text-subtle';
const FOOTER_LINK = 'text-sm text-ink-2 transition-colors hover:text-primary';

/**
 * Light page shell shared by every inner page and persistent across Inertia visits: the menubar, modals
 * and chat stay mounted while only the page content swaps, so navigation is instant and never reloads.
 */
export function LandingLayout({ children }: { children: React.ReactNode }) {
    const { url } = usePage();
    const { settings, flash, services_nav = [] } = usePage<PageProps>().props;
    const [demoOpen, setDemoOpen] = useState(false);
    const [contactOpen, setContactOpen] = useState(false);
    const [discoveryOpen, setDiscoveryOpen] = useState(false);
    const openDemo = useCallback(() => setDemoOpen(true), []);
    const closeDemo = useCallback(() => setDemoOpen(false), []);

    useEffect(() => {
        initializeAttribution();
    }, []);

    // Global events used by chat cards and buttons across the site.
    useEffect(() => {
        const openDiscovery = () => setDiscoveryOpen(true);
        const openContact = () => setContactOpen(true);
        window.addEventListener('ce:open-discovery-call', openDiscovery);
        window.addEventListener('ce:open-contact', openContact);
        return () => {
            window.removeEventListener('ce:open-discovery-call', openDiscovery);
            window.removeEventListener('ce:open-contact', openContact);
        };
    }, []);

    // Flash messages as toasts. The order and thank-you pages show their own confirmation.
    useEffect(() => {
        if (url.startsWith('/thank-you') || url.startsWith('/order')) {
            return;
        }
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash, url]);

    const email = settings?.contact_email || 'hello@cuttingedger.com';

    return (
        <div className="flex min-h-screen flex-col bg-page text-ink selection:bg-primary selection:text-white">
            <a
                href="#main-content"
                className="sr-only z-[1000] rounded-md bg-primary px-4 py-2 font-bold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
            >
                Skip to main content
            </a>

            <Toaster />
            <Menubar openDemo={openDemo} />

            <motion.main
                key={url.split('?')[0]}
                id="main-content"
                className="flex-1"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: EASE_OUT_QUART }}
            >
                {children}
            </motion.main>

            <footer className={`border-t border-ink/10 bg-white pb-8 pt-12 ${PAD_X}`}>
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
                    <div className="max-w-xs">
                        <Link href="/" prefetch className="text-lg font-extrabold tracking-[-0.04em]">
                            CUTTING  EDGER
                        </Link>
                        <p className="mt-3 text-sm leading-relaxed text-muted">
                            AI-integrated image editing and post-production for fashion and e-commerce brands.
                        </p>
                        <a href={`mailto:${email}`} className="mt-4 inline-block text-sm font-semibold text-ink hover:text-primary">
                            {email}
                        </a>
                    </div>

                    <div>
                        <p className={FOOTER_HEADING}>Capabilities</p>
                        <ul className="mt-4 space-y-2.5">
                            {services_nav.slice(0, 6).map((service) => (
                                <li key={service.id}>
                                    <Link href={service.path} prefetch className={FOOTER_LINK}>
                                        {service.title}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <Link href="/services" prefetch className={FOOTER_LINK}>
                                    All capabilities
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <p className={FOOTER_HEADING}>Company</p>
                        <ul className="mt-4 space-y-2.5">
                            {COMPANY_LINKS.map(([label, href]) => (
                                <li key={href}>
                                    <Link href={href} prefetch className={FOOTER_LINK}>
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <p className={FOOTER_HEADING}>Legal</p>
                        <ul className="mt-4 space-y-2.5">
                            {LEGAL_LINKS.map(([label, href]) => (
                                <li key={href}>
                                    <Link href={href} className={FOOTER_LINK}>
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <p className="mt-10 border-t border-ink/10 pt-6 text-xs text-subtle">
                    &copy; {new Date().getFullYear()} CuttingEdger. All rights reserved.
                </p>
            </footer>

            <DemoModal open={demoOpen} onClose={closeDemo} />
            <DiscoveryCallModal isOpen={discoveryOpen} onClose={() => setDiscoveryOpen(false)} />
            <SlideOverContact isOpen={contactOpen} onClose={() => setContactOpen(false)} settings={settings} />
            <ChatWidget />
            <CookieConsentBanner />
        </div>
    );
}
