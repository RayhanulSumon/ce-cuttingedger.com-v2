import React, { useEffect, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react';
import { isClientUser } from '@/Components/Common/OrderAuthNotice';
import { PageProps } from '@/types';
import { DARK_SECTIONS, EASE_OUT_EXPO, EASE_OUT_QUART, SECTION_INDEX, SECTIONS } from './shared';

interface MenubarProps {
    /** Active homepage section. Omit on other pages. */
    index?: number;
    /** Jumps to a homepage section in place. Omit on other pages: section links then navigate to the homepage. */
    goTo?: (index: number) => void;
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

type NavItem = { label: string; href: string; section?: keyof typeof SECTION_INDEX; capabilities?: true };

/** Main navigation. `section` entries jump in place when the menu is opened on the homepage. */
const MAIN_NAV: NavItem[] = [
    { label: 'Home', href: '/', section: 'hero' },
    { label: 'Capabilities', href: '/capabilities', section: 'capabilities', capabilities: true },
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/about' },
    { label: 'FAQ', href: sectionUrl('faq'), section: 'faq' },
];

const SECONDARY_NAV: [string, string][] = [
    ['Client Portal', '/portal'],
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

export function Menubar({ index, goTo, hidden = false, onDark }: MenubarProps) {
    const { capabilities_nav = [], auth } = usePage<PageProps>().props;
    const isClient = isClientUser(auth?.user);
    const { url } = usePage();
    const path = url.split('?')[0];
    const activeCapabilityId =
        capabilities_nav.find((cap) => path === cap.path || path.startsWith(`${cap.path}/`))?.id ?? null;
    const [drawer, setDrawer] = useState(false);
    const [capabilitiesOpen, setCapabilitiesOpen] = useState(false);
    const [openCapability, setOpenCapability] = useState<number | null>(activeCapabilityId);
    const collapsed = index !== undefined && index > 0;
    const dark = onDark ?? (index !== undefined && DARK_SECTIONS.includes(index));
    /** Inner pages scroll under the bar, so it fades in a backdrop; the homepage stage does not scroll. */
    const solid = !goTo;

    useEffect(() => {
        setOpenCapability(activeCapabilityId);
    }, [activeCapabilityId]);

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
                                transition={{ duration: 0.35, ease: EASE_OUT_QUART }}
                                className="overflow-hidden"
                            >
                                <ul className="space-y-0.5 px-2 pb-2 pt-1">
                                    {capabilities_nav.map((capability) => {
                                        const isExpanded = openCapability === capability.id;
                                        const isActive = path === capability.path || path.startsWith(`${capability.path}/`);

                                        return (
                                            <li key={capability.id}>
                                                <button
                                                    type="button"
                                                    aria-expanded={isExpanded}
                                                    onClick={() => setOpenCapability(isExpanded ? null : capability.id)}
                                                    className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-base font-semibold transition-colors duration-200 hover:bg-white/10 hover:text-white ${isActive || isExpanded ? 'text-white' : 'text-white/75'
                                                        }`}
                                                >
                                                    <span className="truncate">{capability.title}</span>
                                                    <ChevronDown
                                                        size={15}
                                                        className={`shrink-0 text-white/50 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                                                    />
                                                </button>

                                                <AnimatePresence initial={false}>
                                                    {isExpanded && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.3, ease: EASE_OUT_QUART }}
                                                            className="overflow-hidden"
                                                        >
                                                            <ul className="my-1 ml-3 space-y-0.5 border-l border-white/15 pl-3">
                                                                {capability.children.map((child) => (
                                                                    <li key={child.id}>
                                                                        <Link
                                                                            href={child.path}
                                                                            prefetch
                                                                            onClick={closeDrawer}
                                                                            className={`block rounded-lg px-2.5 py-1.5 text-[13.5px] transition-colors duration-200 hover:bg-white/10 hover:text-white ${path === child.path ? 'font-semibold text-white' : 'text-white/60'
                                                                                }`}
                                                                        >
                                                                            {child.title}
                                                                        </Link>
                                                                    </li>
                                                                ))}
                                                                <li>
                                                                    <Link
                                                                        href={capability.path}
                                                                        prefetch
                                                                        onClick={closeDrawer}
                                                                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-primary transition-colors duration-200 hover:text-white"
                                                                    >
                                                                        All {capability.tag ?? capability.title}
                                                                        <ArrowUpRight size={12} />
                                                                    </Link>
                                                                </li>
                                                            </ul>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </li>
                                        );
                                    })}
                                    <li>
                                        <Link
                                            href="/capabilities"
                                            prefetch
                                            onClick={closeDrawer}
                                            className="mt-1 flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white/60 transition-colors hover:text-white"
                                        >
                                            All capabilities <ArrowUpRight size={13} />
                                        </Link>
                                    </li>
                                </ul>
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
                className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-2 sm:gap-4 px-4 py-4 text-sm font-medium transition-colors duration-500 sm:px-10 sm:py-5 lg:px-16 ${solid
                        ? 'bg-gradient-to-b from-page via-page/80 to-transparent'
                        : collapsed
                          ? 'max-md:border-b max-md:border-ink/8 max-md:bg-page/88 max-md:backdrop-blur-md'
                          : ''
                    } ${dark ? 'text-white' : 'text-ink'} ${hidden ? 'pointer-events-none' : ''}`}
            >
                {goTo ? (
                    <button
                        type="button"
                        onClick={() => goTo(0)}
                        className="relative flex h-7 items-center text-base font-extrabold tracking-[-0.04em]"
                        aria-label="CuttingEdger home"
                    >
                        {/* Full wordmark on the first section, shrinking to the small mark everywhere else. */}
                        <img
                            src="/images/ce/ce_logo_word.png"
                            alt="CuttingEdger"
                            width={459}
                            height={70}
                            className={`h-6 w-auto origin-left transition-[filter,opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:h-7 ${dark ? 'brightness-0 invert' : ''
                                } ${collapsed ? 'pointer-events-none scale-75 opacity-0' : 'scale-100 opacity-100'}`}
                        />
                        <img
                            src={dark ? '/images/ce/ce_icon_white.png' : '/images/ce/ce_icon.png'}
                            alt=""
                            aria-hidden="true"
                            width={512}
                            height={512}
                            className={`absolute left-0 top-1/2 h-8 w-8 origin-left -translate-y-1/2 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${collapsed ? 'scale-100 opacity-100' : 'pointer-events-none scale-75 opacity-0'
                                }`}
                        />
                    </button>
                ) : (
                    <Link href="/" prefetch aria-label="CuttingEdger home">
                        <img
                            src="/images/ce/ce_logo_word.png"
                            alt="CuttingEdger"
                            width={459}
                            height={70}
                            className={`h-6 w-auto transition-[filter] duration-500 sm:h-7 ${dark ? 'brightness-0 invert' : ''}`}
                        />
                    </Link>
                )}

                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <Link
                        href={isClient ? '/portal' : '/login'}
                        className={`hidden sm:inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold transition-colors duration-300 ${dark
                                ? 'border-white/25 text-white hover:bg-white/15'
                                : 'border-ink/20 text-ink hover:border-primary hover:text-primary-ink'
                            }`}
                    >
                        {isClient ? 'My Portal' : 'Client Login'}
                    </Link>

                    <Link
                        href="/book-a-demo"
                        prefetch
                        className={`group inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 sm:px-5 sm:py-2.5 text-xs font-bold transition-all duration-200 active:scale-[0.98] ${dark ? 'bg-surface text-secondary hover:bg-surface/90 hover:shadow-xs' : 'bg-ink text-surface hover:bg-primary hover:text-primary-foreground hover:shadow-md'
                            }`}
                    >
                        Book a Demo
                        <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </Link>

                    <button
                        type="button"
                        onClick={() => setDrawer(true)}
                        aria-label="Open menu"
                        className={`grid h-10 w-10 place-items-center rounded-full transition-[background-color,transform] duration-300 hover:scale-105 ${dark ? 'bg-white/15 text-white hover:bg-white/25' : 'bg-ink text-surface hover:bg-primary hover:text-primary-foreground'
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
                            className="fixed inset-0 z-[110] bg-ink/55 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={closeDrawer}
                        />

                        <motion.aside
                            data-scrollable
                            aria-label="Main navigation"
                            className="fixed right-0 top-0 z-[120] flex h-full w-[min(400px,92vw)] flex-col overflow-y-auto bg-secondary px-6 py-6 text-secondary-foreground shadow-2xl sm:px-8"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
                        >
                            <div className="flex items-center justify-between">
                                <img src="/images/ce/ce_logo_word.png" alt="CuttingEdger" width={459} height={70} className="h-5 w-auto brightness-0 invert" />
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
                                    <Link
                                        href="/book-a-demo"
                                        prefetch
                                        onClick={closeDrawer}
                                        className="flex w-full items-center justify-center gap-2 rounded-full bg-surface py-3.5 text-sm font-bold text-secondary transition-all duration-200 hover:bg-surface/90 hover:shadow-xs active:scale-[0.98]"
                                    >
                                        Book a Demo
                                        <ArrowUpRight size={16} />
                                    </Link>
                                </motion.div>
                            </motion.div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
