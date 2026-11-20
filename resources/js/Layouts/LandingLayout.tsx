import React, { useCallback, useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ChatWidget } from '@/Components/Chat/ChatWidget';
import { CookieConsentBanner } from '@/Components/Common/CookieConsentBanner';
import { ScrollToTop, useScrolledPast } from '@/Components/Common/ScrollToTop';
import { DiscoveryCallModal } from '@/Components/Common/DiscoveryCallModal';
import { DemoModal } from '@/Components/Landing/DemoModal';
import { FooterSection } from '@/Components/Landing/FooterSection';
import { Menubar } from '@/Components/Landing/Menubar';
import { EASE_OUT_QUART } from '@/Components/Landing/shared';
import { Toaster, toast } from '@/Components/ui/sonner';
import { initializeAttribution } from '@/lib/attribution';
import { PageProps } from '@/types';
import { SlideOverContact } from './SlideOverContact';

/**
 * Light page shell shared by every inner page and persistent across Inertia visits: the menubar, modals
 * and chat stay mounted while only the page content swaps, so navigation is instant and never reloads.
 */
export function LandingLayout({ children }: { children: React.ReactNode }) {
    const { url } = usePage();
    const { settings, flash } = usePage<PageProps>().props;
    const [demoOpen, setDemoOpen] = useState(false);
    const [contactOpen, setContactOpen] = useState(false);
    const [discoveryOpen, setDiscoveryOpen] = useState(false);
    const scrolled = useScrolledPast();
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

    // Silently warm top landing page chunks in browser idle time so first click is instantaneous
    useEffect(() => {
        const schedule =
            typeof window !== 'undefined' && 'requestIdleCallback' in window
                ? window.requestIdleCallback
                : (cb: () => void) => setTimeout(cb, 180);

        schedule(() => {
            if (url !== '/pricing') import('@/Pages/Pricing');
            if (!url.startsWith('/capabilities')) import('@/Pages/Capabilities/Index');
            if (url !== '/about') import('@/Pages/About');
            if (url !== '/work') import('@/Pages/Work/Index');
        });
    }, [url]);

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
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.16, ease: EASE_OUT_QUART }}
            >
                {children}
            </motion.main>

            <FooterSection fullpage={false} />

            <DemoModal open={demoOpen} onClose={closeDemo} />
            <DiscoveryCallModal isOpen={discoveryOpen} onClose={() => setDiscoveryOpen(false)} />
            <SlideOverContact isOpen={contactOpen} onClose={() => setContactOpen(false)} settings={settings} />
            <ScrollToTop visible={scrolled} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
            <ChatWidget />
            <CookieConsentBanner />
        </div>
    );
}
