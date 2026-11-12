import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { PageProps } from '@/types';
import { CAPABILITY_FALLBACK } from './content';
import { DARK_SECTIONS, EASE_OUT_QUART, SECTION_INDEX } from './shared';

interface MenubarProps {
    index: number;
    goTo: (index: number) => void;
    openDemo: () => void;
    /** When true, fades out and disables pointer events (e.g. while a fullscreen modal is open). */
    hidden?: boolean;
}

const NAV_ITEMS: [string, number][] = [
    ['Home', SECTION_INDEX.hero],
    ['Digital Twins', SECTION_INDEX['digital-twins']],
    ['Try-On', SECTION_INDEX['try-on']],
    ['Showcase', SECTION_INDEX.showcase],
    ['Case Study', SECTION_INDEX['case-study']],
    ['FAQ', SECTION_INDEX.faq],
];

export function Menubar({ index, goTo, openDemo, hidden = false }: MenubarProps) {
    const { services_nav = [] } = usePage<PageProps>().props;
    const [drawer, setDrawer] = useState(false);
    const dark = DARK_SECTIONS.includes(index);

    const capabilities = services_nav.length
        ? services_nav.map((s) => ({ label: s.title, href: s.path }))
        : CAPABILITY_FALLBACK;

    const go = (i: number) => {
        setDrawer(false);
        goTo(i);
    };

    return (
        <>
            <header
                className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-5 text-sm font-medium transition-[color,opacity] duration-500 sm:px-10 lg:px-16 ${dark ? 'text-white' : 'text-[#1d1d1d]'} ${hidden ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
            >
                {/* Logo */}
                <button
                    type="button"
                    onClick={() => go(0)}
                    className="text-base font-extrabold tracking-[-0.04em]"
                    aria-label="CuttingEdger home"
                >
                    CUTTING  EDGER
                </button>

                {/* Right side: Book a Demo + sidebar toggle */}
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={openDemo}
                        className={`rounded-full px-5 py-2.5 text-xs font-bold transition-colors duration-500 ${dark ? 'bg-white text-[#141A26]' : 'bg-[#1b1b1b] text-white'}`}
                    >
                        Book a Demo
                    </button>

                    {/* Sidebar toggle — always visible on all breakpoints */}
                    <button
                        type="button"
                        onClick={() => setDrawer(true)}
                        aria-label="Open menu"
                        className={`grid h-10 w-10 place-items-center rounded-full transition-colors duration-500 ${dark ? 'bg-white/15 text-white hover:bg-white/25' : 'bg-[#1b1b1b] text-white hover:bg-[#333]'}`}
                    >
                        <Menu size={18} />
                    </button>
                </div>
            </header>

            {/* Right-side Sidebar Drawer */}
            <AnimatePresence>
                {drawer && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="fixed inset-0 z-[88] bg-black/55"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => setDrawer(false)}
                        />

                        {/* Drawer panel — slides in from the right */}
                        <motion.aside
                            data-scrollable
                            className="fixed right-0 top-0 z-[90] flex h-full w-72 flex-col overflow-y-auto bg-[#141A26] px-8 py-8 text-white shadow-2xl"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ duration: 0.42, ease: EASE_OUT_QUART }}
                        >
                            {/* Close */}
                            <button
                                type="button"
                                onClick={() => setDrawer(false)}
                                aria-label="Close menu"
                                className="ml-auto grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20"
                            >
                                <X size={18} />
                            </button>

                            {/* Nav links */}
                            <nav className="mt-8 flex flex-col gap-1">
                                {NAV_ITEMS.map(([label, i]) => (
                                    <button
                                        key={label}
                                        type="button"
                                        onClick={() => go(i)}
                                        className={`rounded-xl px-4 py-3 text-left text-lg font-semibold tracking-tight transition hover:bg-white/10 ${index === i ? 'text-white' : 'text-white/70'}`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </nav>

                            {/* Capabilities sub-links */}
                            <div className="mt-6 border-t border-white/10 pt-6">
                                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
                                    Capabilities
                                </p>
                                <div className="flex flex-col gap-1">
                                    {capabilities.map((c) => (
                                        <Link
                                            key={c.label}
                                            href={c.href}
                                            onClick={() => setDrawer(false)}
                                            className="rounded-xl px-4 py-2.5 text-sm text-white/60 transition hover:bg-white/10 hover:text-white"
                                        >
                                            {c.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Book Demo CTA */}
                            <div className="mt-auto pt-6">
                                <button
                                    type="button"
                                    onClick={() => { setDrawer(false); openDemo(); }}
                                    className="w-full rounded-full bg-white py-3 text-sm font-bold text-[#141A26] transition hover:bg-white/90"
                                >
                                    Book a Demo
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
