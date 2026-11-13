import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { ArrowUpRight, Box, ChevronDown, Clapperboard, Layers, LayoutTemplate, Menu, X } from 'lucide-react';
import { PageProps, ServiceNavItem } from '@/types';
import { DARK_SECTIONS, EASE_OUT_EXPO, EASE_OUT_QUART, SECTION_INDEX, SECTIONS } from './shared';

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

interface Capability {
    key: string;
    tag: string;
    title: string;
    blurb: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    /** Matches the admin service whose page this capability opens. */
    match: RegExp;
}

export const CAPABILITIES: Capability[] = [
    {
        key: '2d',
        tag: '2D',
        title: '2D Retouching',
        blurb: 'Cutouts, masking, ghost mannequin and colour-true retouching.',
        icon: Layers,
        match: /retouch|clipping|mask|ghost|colou?r|catalog/i,
    },
    {
        key: '3d',
        tag: '3D',
        title: '3D & Digital Twins',
        blurb: 'Product modelling, renders and photoreal digital twins.',
        icon: Box,
        match: /3d|cgi|twin|render/i,
    },
    {
        key: 'dtp',
        tag: 'DTP',
        title: 'Catalog & Layout',
        blurb: 'Catalog layout, multilingual formatting and prepress.',
        icon: LayoutTemplate,
        match: /publish|dtp|layout|prepress/i,
    },
    {
        key: 'video',
        tag: 'Video',
        title: 'Motion & Video',
        blurb: 'Short-form cut-downs built from the same source files.',
        icon: Clapperboard,
        match: /video|motion/i,
    },
];

/** Finds the service page for a capability, falling back to the services hub. */
function capabilityHref(capability: Capability, services: ServiceNavItem[]): string {
    for (const pillar of services) {
        if (capability.match.test(pillar.title)) {
            return pillar.path;
        }
        const child = pillar.children.find((item) => capability.match.test(item.title));
        if (child) {
            return child.path;
        }
    }
    return '/services';
}

type NavItem = { label: string; href: string; section?: keyof typeof SECTION_INDEX; capabilities?: true };

/** Main navigation. `section` entries jump in place when the menu is opened on the homepage. */
const MAIN_NAV: NavItem[] = [
    { label: 'Home', href: '/', section: 'hero' },
    { label: 'Digital Twins', href: '/digital-twins', section: 'digital-twins' },
    { label: 'Virtual Try-On', href: sectionUrl('try-on'), section: 'try-on' },
    { label: 'Capabilities', href: '/services', section: 'services', capabilities: true },
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/about' },
    { label: 'FAQ', href: sectionUrl('faq'), section: 'faq' },
];

const SECONDARY_NAV: [string, string][] = [
    ['Team', '/team'],
    ['Careers', '/careers'],
    ['Contact', '/contact'],
];

const LIST: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } },
};

const ITEM: Variants = {
    hidden: { opacity: 0, x: 32 },
    show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: EASE_OUT_EXPO } },
};

const ROW =
    'flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-[22px] font-bold tracking-[-0.02em] transition-colors duration-300 hover:bg-white/10';

export function Menubar({ index, goTo, openDemo, hidden = false, onDark }: MenubarProps) {
    const { services_nav = [] } = usePage<PageProps>().props;
    const { url } = usePage();
    const path = url.split('?')[0];
    const [drawer, setDrawer] = useState(false);
    const [capabilitiesOpen, setCapabilitiesOpen] = useState(false);
    const dark = onDark ?? (index !== undefined && DARK_SECTIONS.includes(index));
    /** Inner pages scroll under the bar, so it fades in a backdrop; the homepage stage does not scroll. */
    const solid = !goTo;

    const closeDrawer = () => setDrawer(false);

    const isCurrent = (item: NavItem) => {
        if (goTo) {
            return item.section !== undefined && index === SECTION_INDEX[item.section];
        }
        return item.href === '/' ? path === '/' : path === item.href || path.startsWith(`${item.href}/`);
    };

    const renderRow = (item: NavItem) => {
        const tone = isCurrent(item) ? 'text-white' : 'text-white/65';

        if (item.capabilities) {
            return (
                <div>
                    <button
                        type="button"
                        aria-expanded={capabilitiesOpen}
                        onClick={() => setCapabilitiesOpen((open) => !open)}
                        className={`${ROW} ${tone}`}
                    >
                        {item.label}
                        <ChevronDown size={20} className={`transition-transform duration-300 ${capabilitiesOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence initial={false}>
                        {capabilitiesOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.4, ease: EASE_OUT_QUART }}
                                className="overflow-hidden"
                            >
                                <motion.ul
                                    className="grid gap-1 px-2 pb-2 pt-1"
                                    initial="hidden"
                                    animate="show"
                                    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } } }}
                                >
                                    {CAPABILITIES.map((capability) => (
                                        <motion.li
                                            key={capability.key}
                                            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT_QUART } } }}
                                        >
                                            <Link
                                                href={capabilityHref(capability, services_nav)}
                                                prefetch
                                                onClick={closeDrawer}
                                                className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-300 hover:bg-white/10"
                                            >
                                                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-primary transition-[background-color,color] duration-300 group-hover:bg-primary group-hover:text-white">
                                                    <capability.icon size={18} />
                                                </span>
                                                <span className="min-w-0">
                                                    <span className="block text-[15px] font-semibold leading-tight">
                                                        <span className="text-primary">{capability.tag}</span> · {capability.title}
                                                    </span>
                                                    <span className="mt-0.5 block text-xs leading-snug text-white/50">{capability.blurb}</span>
                                                </span>
                                            </Link>
                                        </motion.li>
                                    ))}
                                    <li>
                                        <Link
                                            href="/services"
                                            prefetch
                                            onClick={closeDrawer}
                                            className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-white/70 transition-colors hover:text-white"
                                        >
                                            All capabilities <ArrowUpRight size={14} />
                                        </Link>
                                    </li>
                                </motion.ul>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            );
        }

        if (goTo && item.section !== undefined) {
            const target = SECTION_INDEX[item.section];
            return (
                <button
                    type="button"
                    onClick={() => {
                        closeDrawer();
                        goTo(target);
                    }}
                    className={`${ROW} ${tone}`}
                >
                    {item.label}
                </button>
            );
        }

        return (
            <Link href={item.href} prefetch onClick={closeDrawer} className={`${ROW} ${tone}`}>
                {item.label}
            </Link>
        );
    };

    return (
        <>
            <motion.header
                initial={{ opacity: 0, y: -18 }}
                animate={{ opacity: hidden ? 0 : 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
                className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-4 px-5 py-5 text-sm font-medium transition-colors duration-500 sm:px-10 lg:px-16 ${
                    solid ? 'bg-gradient-to-b from-page via-page/80 to-transparent' : ''
                } ${dark ? 'text-white' : 'text-ink'} ${hidden ? 'pointer-events-none' : ''}`}
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

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={openDemo}
                        className={`group inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-xs font-bold transition-[background-color,transform] duration-300 hover:-translate-y-0.5 ${
                            dark ? 'bg-white text-secondary' : 'bg-ink text-white hover:bg-primary'
                        }`}
                    >
                        Book a Demo
                        <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </button>

                    <button
                        type="button"
                        onClick={() => setDrawer(true)}
                        aria-label="Open menu"
                        className={`grid h-10 w-10 place-items-center rounded-full transition-[background-color,transform] duration-300 hover:scale-105 ${
                            dark ? 'bg-white/15 text-white hover:bg-white/25' : 'bg-ink text-white hover:bg-primary'
                        }`}
                    >
                        <Menu size={18} />
                    </button>
                </div>
            </motion.header>

            <AnimatePresence>
                {drawer && (
                    <>
                        <motion.div
                            className="fixed inset-0 z-[88] bg-black/55 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={closeDrawer}
                        />

                        <motion.aside
                            data-scrollable
                            aria-label="Main navigation"
                            className="fixed right-0 top-0 z-[90] flex h-full w-[min(400px,92vw)] flex-col overflow-y-auto bg-secondary px-6 py-6 text-white shadow-2xl sm:px-8"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-extrabold tracking-[-0.04em] text-white/60">CUTTING  EDGER</span>
                                <button
                                    type="button"
                                    onClick={closeDrawer}
                                    aria-label="Close menu"
                                    className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition-[transform,background-color] duration-300 hover:rotate-90 hover:bg-white/20"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <motion.div variants={LIST} initial="hidden" animate="show" className="flex flex-1 flex-col">
                                <nav aria-label="Main" className="mt-6 flex flex-col gap-0.5">
                                    {MAIN_NAV.map((item) => (
                                        <motion.div key={item.label} variants={ITEM}>
                                            {renderRow(item)}
                                        </motion.div>
                                    ))}
                                </nav>

                                <motion.div variants={ITEM} className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/10 px-4 pt-5">
                                    {SECONDARY_NAV.map(([label, href]) => (
                                        <Link
                                            key={href}
                                            href={href}
                                            prefetch
                                            onClick={closeDrawer}
                                            className="text-sm font-medium text-white/55 transition-colors hover:text-white"
                                        >
                                            {label}
                                        </Link>
                                    ))}
                                </motion.div>

                                <motion.div variants={ITEM} className="mt-auto pt-8">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            closeDrawer();
                                            openDemo();
                                        }}
                                        className="flex w-full items-center justify-center gap-2 rounded-full bg-white py-3.5 text-sm font-bold text-secondary transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-white/90"
                                    >
                                        Book a Demo
                                        <ArrowUpRight size={16} />
                                    </button>
                                </motion.div>
                            </motion.div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
