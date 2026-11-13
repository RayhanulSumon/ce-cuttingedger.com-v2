import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { PageProps } from '@/types';
import { CAPABILITY_FALLBACK } from './content';
import { DARK_SECTIONS, EASE_OUT_QUART, SECTION_INDEX, SECTIONS } from './shared';

interface MenubarProps {
    /** Active homepage section. Omit on other pages. */
    index?: number;
    /** Jumps to a homepage section in place. Omit on other pages: section links then navigate to the homepage. */
    goTo?: (index: number) => void;
    openDemo: () => void;
    /** When true, fades out and disables pointer events (e.g. while a fullscreen modal is open). */
    hidden?: boolean;
    /** Force light ink on a dark page background. Defaults to the active section's tone. */
    onDark?: boolean;
}

/** Homepage sections shown in the menu, in order. */
const SECTION_LINKS: [string, keyof typeof SECTION_INDEX][] = [
    ['Home', 'hero'],
    ['Digital Twins', 'digital-twins'],
    ['Virtual Try-On', 'try-on'],
    ['Showcase', 'showcase'],
    ['Clients', 'clients'],
    ['Case Study', 'case-study'],
    ['Services', 'services'],
    ['FAQ', 'faq'],
];

/** Links shown in the bar itself on wide screens. `section` entries jump in place on the homepage. */
const BAR_LINKS: { label: string; section?: keyof typeof SECTION_INDEX; href: string }[] = [
    { label: 'Digital Twins', section: 'digital-twins', href: '/digital-twins' },
    { label: 'Virtual Try-On', section: 'try-on', href: sectionUrl('try-on') },
    { label: 'Services', section: 'services', href: '/services' },
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/about' },
];

const PAGE_LINKS: [string, string][] = [
    ['Case Studies', '/case-studies'],
    ['Pricing', '/pricing'],
    ['Blog', '/blog'],
    ['About', '/about'],
    ['Team', '/team'],
    ['Careers', '/careers'],
    ['Reviews', '/reviews'],
    ['FAQ', '/faq'],
    ['Contact', '/contact'],
];

/** URL that opens the homepage on a given section. */
export function sectionUrl(id: string): string {
    return id === 'hero' ? '/' : `/?section=${id}`;
}

/** Reads `?section=` from an Inertia page url and returns the matching section index. */
export function sectionIndexFromUrl(url: string): number {
    const id = new URLSearchParams(url.split('?')[1] ?? '').get('section');
    const found = SECTIONS.findIndex((section) => section.id === id);
    return found === -1 ? 0 : found;
}

const DRAWER_ITEM = 'rounded-xl px-4 py-3 text-left text-lg font-semibold tracking-tight transition hover:bg-white/10';

export function Menubar({ index, goTo, openDemo, hidden = false, onDark }: MenubarProps) {
    const { services_nav = [] } = usePage<PageProps>().props;
    const { url } = usePage();
    const path = url.split('?')[0];
    /** Inner pages scroll under the bar, so it gets a backdrop; the homepage stage does not scroll. */
    const solid = !goTo;
    const [drawer, setDrawer] = useState(false);
    const dark = onDark ?? (index !== undefined && DARK_SECTIONS.includes(index));

    const capabilities = services_nav.length
        ? services_nav.map((s) => ({ label: s.title, href: s.path }))
        : CAPABILITY_FALLBACK;

    const closeDrawer = () => setDrawer(false);

    return (
        <>
            <header
                className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-6 px-5 py-4 text-sm font-medium transition-[color,opacity,background-color] duration-500 sm:px-10 lg:px-16 ${solid ? 'bg-[#f2f2f1]/85 backdrop-blur-md' : 'py-5'} ${dark ? 'text-white' : 'text-[#1d1d1d]'} ${hidden ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
            >
                {goTo ? (
                    <button
                        type="button"
                        onClick={() => goTo(0)}
                        className="text-base font-extrabold tracking-[-0.04em]"
                        aria-label="CuttingEdger home"
                    >
                        CUTTING  EDGER
                    </button>
                ) : (
                    <Link href="/" prefetch className="text-base font-extrabold tracking-[-0.04em]" aria-label="CuttingEdger home">
                        CUTTING  EDGER
                    </Link>
                )}

                <nav aria-label="Main" className="hidden items-center gap-1 xl:flex">
                    {BAR_LINKS.map((item) => {
                        const isCurrent = goTo
                            ? item.section !== undefined && index === SECTION_INDEX[item.section]
                            : path === item.href || path.startsWith(`${item.href}/`);
                        const classes = `rounded-full px-3 py-2 text-[13px] font-semibold transition-colors duration-300 ${
                            isCurrent ? 'bg-[#16191f]/10' : 'opacity-75 hover:bg-[#16191f]/5 hover:opacity-100'
                        }`;

                        return goTo && item.section !== undefined ? (
                            <button key={item.label} type="button" onClick={() => goTo(SECTION_INDEX[item.section!])} className={classes}>
                                {item.label}
                            </button>
                        ) : (
                            <Link key={item.label} href={item.href} prefetch className={classes}>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={openDemo}
                        className={`rounded-full px-5 py-2.5 text-xs font-bold transition-colors duration-500 ${dark ? 'bg-white text-[#141A26]' : 'bg-[#1b1b1b] text-white'}`}
                    >
                        Book a Demo
                    </button>

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

            <AnimatePresence>
                {drawer && (
                    <>
                        <motion.div
                            className="fixed inset-0 z-[88] bg-black/55"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={closeDrawer}
                        />

                        <motion.aside
                            data-scrollable
                            className="fixed right-0 top-0 z-[90] flex h-full w-72 flex-col overflow-y-auto bg-[#141A26] px-8 py-8 text-white shadow-2xl"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ duration: 0.42, ease: EASE_OUT_QUART }}
                        >
                            <button
                                type="button"
                                onClick={closeDrawer}
                                aria-label="Close menu"
                                className="ml-auto grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20"
                            >
                                <X size={18} />
                            </button>

                            <nav className="mt-8 flex flex-col gap-1">
                                {SECTION_LINKS.map(([label, id]) => {
                                    const active = index === SECTION_INDEX[id];
                                    const tone = active ? 'text-white' : 'text-white/70';

                                    return goTo ? (
                                        <button
                                            key={id}
                                            type="button"
                                            onClick={() => {
                                                closeDrawer();
                                                goTo(SECTION_INDEX[id]);
                                            }}
                                            className={`${DRAWER_ITEM} ${tone}`}
                                        >
                                            {label}
                                        </button>
                                    ) : (
                                        <Link key={id} href={sectionUrl(id)} prefetch onClick={closeDrawer} className={`${DRAWER_ITEM} ${tone}`}>
                                            {label}
                                        </Link>
                                    );
                                })}
                            </nav>

                            <div className="mt-6 border-t border-white/10 pt-6">
                                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">Explore</p>
                                <div className="flex flex-col gap-1">
                                    {PAGE_LINKS.map(([label, href]) => (
                                        <Link
                                            key={href}
                                            href={href}
                                            prefetch
                                            onClick={closeDrawer}
                                            className="rounded-xl px-4 py-2.5 text-sm text-white/60 transition hover:bg-white/10 hover:text-white"
                                        >
                                            {label}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-6 border-t border-white/10 pt-6">
                                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">Capabilities</p>
                                <div className="flex flex-col gap-1">
                                    {capabilities.map((c) => (
                                        <Link
                                            key={c.label}
                                            href={c.href}
                                            prefetch
                                            onClick={closeDrawer}
                                            className="rounded-xl px-4 py-2.5 text-sm text-white/60 transition hover:bg-white/10 hover:text-white"
                                        >
                                            {c.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-auto pt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        closeDrawer();
                                        openDemo();
                                    }}
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
