import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileMenu } from './MobileMenu';
import { SlideOverContact } from './SlideOverContact';
import { DiscoveryCallModal } from '@/Components/Common/DiscoveryCallModal';
import { ChatWidget } from '@/Components/Chat/ChatWidget';
import { CookieConsentBanner } from '@/Components/Common/CookieConsentBanner';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { initializeAttribution } from '@/lib/attribution';
import { PageProps } from '@/types';

interface AppLayoutProps {
    children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
    const { settings, flash } = usePage<PageProps>().props;
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [isDiscoveryCallOpen, setIsDiscoveryCallOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Initialize Lenis smooth scroll
    useSmoothScroll();

    // Initialize first-touch lead attribution tracker
    useEffect(() => {
        initializeAttribution();
    }, []);

    // Global listener for dedicated Discovery Call calendar modal
    useEffect(() => {
        const handleOpenDiscovery = () => setIsDiscoveryCallOpen(true);
        window.addEventListener('ce:open-discovery-call', handleOpenDiscovery);
        return () => window.removeEventListener('ce:open-discovery-call', handleOpenDiscovery);
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-[#0a0b0e] text-[#f4f5f8] relative selection:bg-[#d4ff00] selection:text-black">
            {/* Accessibility: Skip Link */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[1000] px-4 py-2 bg-[#d4ff00] text-black font-mono font-bold rounded-md shadow-lg"
            >
                Skip to main content
            </a>

            {/* Global Notification Banner if Flash */}
            {flash?.success && (
                <div
                    role="alert"
                    className="fixed top-20 right-6 z-[90] bg-[#d4ff00] text-black px-5 py-3 rounded-xl font-mono text-xs font-bold shadow-xl flex items-center gap-2 animate-in slide-in-from-top-2"
                >
                    <span>✓ {flash.success}</span>
                </div>
            )}

            {/* Persistent Header */}
            <Header
                onOpenContact={() => setIsContactOpen(true)}
                onOpenDiscoveryCall={() => setIsDiscoveryCallOpen(true)}
                onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
                settings={settings}
            />

            {/* Main Page Slot */}
            <main id="main-content" className="flex-1 w-full">
                {children}
            </main>

            {/* Persistent Footer */}
            <Footer
                settings={settings}
                onOpenContact={() => setIsContactOpen(true)}
            />

            {/* Dedicated Discovery Call Calendar Modal */}
            <DiscoveryCallModal
                isOpen={isDiscoveryCallOpen}
                onClose={() => setIsDiscoveryCallOpen(false)}
            />

            {/* Slide-out Contact Drawer */}
            <SlideOverContact
                isOpen={isContactOpen}
                onClose={() => setIsContactOpen(false)}
                settings={settings}
            />

            {/* Full-screen Mobile Menu */}
            <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                onOpenContact={() => setIsContactOpen(true)}
                settings={settings}
            />

            {/* Smart Public Client Chat & MCP Dialog */}
            <ChatWidget />

            {/* Cookie & Privacy Consent Banner */}
            <CookieConsentBanner />
        </div>
    );
}
