import React, { useCallback, useEffect, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { DemoModal } from '@/Components/Landing/DemoModal';
import { Menubar } from '@/Components/Landing/Menubar';
import { EASE_OUT_QUART, PAD_X } from '@/Components/Landing/shared';
import { initializeAttribution } from '@/lib/attribution';
import { PageProps } from '@/types';

const LEGAL_LINKS: [string, string][] = [
    ['Privacy', '/privacy'],
    ['Terms', '/terms'],
    ['Cookies', '/cookie-policy'],
    ['NDA', '/nda-compliance'],
];

/**
 * Light page shell that matches the homepage: the same menubar, a quiet footer and a short
 * fade-in on every Inertia visit, so moving between the homepage and its inner pages feels like one app.
 */
export function LandingLayout({ children }: { children: React.ReactNode }) {
    const { url } = usePage();
    const { settings } = usePage<PageProps>().props;
    const [demoOpen, setDemoOpen] = useState(false);
    const openDemo = useCallback(() => setDemoOpen(true), []);
    const closeDemo = useCallback(() => setDemoOpen(false), []);

    useEffect(() => {
        initializeAttribution();
    }, []);

    const email = settings?.contact_email || 'hello@cuttingedger.com';

    return (
        <div className="flex min-h-screen flex-col bg-[#f2f2f1] text-[#16191f] selection:bg-[#f5761a] selection:text-white">
            <Menubar openDemo={openDemo} />

            <motion.main
                key={url.split('?')[0]}
                id="main-content"
                className="flex-1"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: EASE_OUT_QUART }}
            >
                {children}
            </motion.main>

            <footer className={`border-t border-[#16191f]/10 py-8 text-sm text-[#5d6572] ${PAD_X}`}>
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <p>
                        &copy; {new Date().getFullYear()} CuttingEdger ·{' '}
                        <a href={`mailto:${email}`} className="font-medium text-[#16191f] hover:text-[#f5761a]">
                            {email}
                        </a>
                    </p>
                    <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-2">
                        {LEGAL_LINKS.map(([label, href]) => (
                            <Link key={href} href={href} className="transition-colors hover:text-[#f5761a]">
                                {label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </footer>

            <DemoModal open={demoOpen} onClose={closeDemo} />
        </div>
    );
}
