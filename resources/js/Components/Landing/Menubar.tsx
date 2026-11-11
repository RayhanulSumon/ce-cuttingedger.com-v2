import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Menu, X } from 'lucide-react';
import { PageProps } from '@/types';
import { CAPABILITY_FALLBACK } from './content';
import { SECTION_INDEX } from './shared';

interface MenubarProps {
    index: number;
    goTo: (index: number) => void;
    openDemo: () => void;
}

/** Light bars on dark sections (book demo + footer) */
const DARK_SECTIONS = [SECTION_INDEX['book-demo'], SECTION_INDEX.contact];

export function Menubar({ index, goTo, openDemo }: MenubarProps) {
    const { services_nav = [] } = usePage<PageProps>().props;
    const [capOpen, setCapOpen] = useState(false);
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
            <header className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-5 text-sm font-medium transition-colors duration-500 sm:px-10 lg:px-16 ${dark ? 'text-white' : 'text-[#1d1d1d]'}`}>
                <button type="button" onClick={() => go(0)} className="text-base font-extrabold tracking-[-0.04em]" aria-label="CuttingEdger home">
                    CUTTINGEDGER
                </button>

                <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
                    <button type="button" onClick={() => go(0)} className="opacity-70 hover:opacity-100">Home</button>

                    <div className="relative" onMouseEnter={() => setCapOpen(true)} onMouseLeave={() => setCapOpen(false)}>
                        <button type="button" aria-expanded={capOpen} onClick={() => setCapOpen((v) => !v)} className="flex items-center gap-1 opacity-70 hover:opacity-100">
                            Capabilities <ChevronDown size={14} className={`transition-transform ${capOpen ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                            {capOpen && (
                                <motion.ul
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 8 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute left-1/2 top-full min-w-44 -translate-x-1/2 pt-3"
                                >
                                    <div className="overflow-hidden rounded-2xl bg-white p-2 text-[#1d1d1d] shadow-2xl">
                                        {capabilities.map((c) => (
                                            <li key={c.label}>
                                                <Link href={c.href} className="block rounded-xl px-4 py-2.5 hover:bg-[#f2f2f1]">{c.label}</Link>
                                            </li>
                                        ))}
                                    </div>
                                </motion.ul>
                            )}
                        </AnimatePresence>
                    </div>

                    <button type="button" onClick={() => go(SECTION_INDEX.showcase)} className="opacity-70 hover:opacity-100">Showcase</button>
                    <button type="button" onClick={() => go(SECTION_INDEX['case-study'])} className="opacity-70 hover:opacity-100">Case Study</button>
                    <button type="button" onClick={() => go(SECTION_INDEX.faq)} className="opacity-70 hover:opacity-100">FAQ</button>
                </nav>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={openDemo}
                        className={`hidden rounded-full px-5 py-2.5 text-xs font-bold sm:block ${dark ? 'bg-white text-[#141A26]' : 'bg-[#1b1b1b] text-white'}`}
                    >
                        Book a Demo
                    </button>
                    <button type="button" onClick={() => setDrawer(true)} aria-label="Open menu" className="grid h-10 w-10 place-items-center rounded-full bg-[#1b1b1b] text-white md:hidden">
                        <Menu size={18} />
                    </button>
                </div>
            </header>

            <AnimatePresence>
                {drawer && (
                    <motion.div
                        className="fixed inset-0 z-[90] flex flex-col bg-[#141A26] p-8 text-white md:hidden"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <button type="button" onClick={() => setDrawer(false)} aria-label="Close menu" className="ml-auto grid h-10 w-10 place-items-center rounded-full bg-white/10">
                            <X size={18} />
                        </button>
                        <ul className="mt-6 space-y-4 text-3xl font-extrabold tracking-tight">
                            {[
                                ['Home', SECTION_INDEX.hero],
                                ['Digital Twins', SECTION_INDEX['digital-twins']],
                                ['Try-On', SECTION_INDEX['try-on']],
                                ['Showcase', SECTION_INDEX.showcase],
                                ['Case Study', SECTION_INDEX['case-study']],
                                ['FAQ', SECTION_INDEX.faq],
                            ].map(([label, i]) => (
                                <li key={label}>
                                    <button type="button" onClick={() => go(i as number)}>{label}</button>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-auto flex flex-wrap gap-4 text-sm text-white/70">
                            {capabilities.map((c) => (
                                <Link key={c.label} href={c.href}>{c.label}</Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

