import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileMenu } from './MobileMenu';
import { SlideOverContact } from './SlideOverContact';
import { ChatWidget } from '@/Components/Chat/ChatWidget';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { PageProps } from '@/types';

interface AppLayoutProps {
    children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
    const { settings, flash } = usePage<PageProps>().props;
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Initialize Lenis smooth scroll
    useSmoothScroll();

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
        </div>
    );
}
