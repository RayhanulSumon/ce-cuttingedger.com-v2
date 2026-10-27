import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    Menu,
    ArrowUpRight,
    ChevronDown,
    Calendar,
    Sparkles,
    Layers,
    Palette,
    Shield,
    Box,
    Scissors,
    Shirt,
    Gem,
    BookOpen,
    CheckCircle2,
    ArrowRight,
} from 'lucide-react';
import { ThemeToggle } from '@/Components/ui/ThemeToggle';
import { SiteSettings } from '@/types/models';
import { PageProps, ServiceNavItem } from '@/types';

interface HeaderProps {
    onOpenContact: () => void;
    onOpenDiscoveryCall?: () => void;
    onOpenMobileMenu: () => void;
    settings?: SiteSettings;
}

const resolveServiceIcon = (iconName?: string) => {
    switch (iconName) {
        case 'Scissors':
            return Scissors;
        case 'Shirt':
            return Shirt;
        case 'Sparkles':
            return Sparkles;
        case 'Palette':
            return Palette;
        case 'Shield':
            return Shield;
        case 'Box':
            return Box;
        case 'Gem':
            return Gem;
        case 'BookOpen':
            return BookOpen;
        case 'Layers':
        default:
            return Layers;
    }
};

export function Header({
    onOpenContact,
    onOpenDiscoveryCall,
    onOpenMobileMenu,
    settings,
}: HeaderProps) {
    const { url } = usePage();
    const { services_nav = [] } = usePage<PageProps>().props;
    const [isScrolled, setIsScrolled] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const headerRef = React.useRef<HTMLElement>(null);
    const calendlyUrl = (settings as any)?.calendly_url || 'https://calendly.com/cuttingedger/discovery-call';

    const servicesList = services_nav || [];

    useEffect(() => {
        const updateHeaderHeight = () => {
            if (headerRef.current) {
                const height = headerRef.current.getBoundingClientRect().height;
                if (height > 0) {
                    document.documentElement.style.setProperty('--header-height', `${height}px`);
                }
            }
        };

        const handleScroll = () => {
            if (window.scrollY > 15) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', updateHeaderHeight);
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', updateHeaderHeight);
        };
    }, []);


    interface NavItem {
        label: string;
        href: string;
        isMegaMenu?: boolean;
        children?: { label: string; href: string }[];
    }

    const navItems: NavItem[] = [
        {
            label: 'Services',
            href: '/services',
            isMegaMenu: true,
        },
        {
            label: 'Case Studies',
            href: '/case-studies',
        },
        {
            label: 'Pricing',
            href: '/pricing',
        },
        {
            label: 'Company',
            href: '/about',
            children: [
                { label: 'About Studio', href: '/about' },
                { label: 'Creative Leadership Team', href: '/team' },
                { label: 'Career Openings', href: '/careers' },
                { label: 'NDA & Security Compliance', href: '/nda-compliance' },
                { label: 'ESG & Sustainability Charter', href: '/esg-policy' },
                { label: 'Studio FAQ', href: '/faq' },
            ],
        },
        {
            label: 'Careers',
            href: '/careers',
        },
        {
            label: 'Blog',
            href: '/blog',
        },
        {
            label: 'Contact',
            href: '/contact',
        },
    ];

    const isActive = (href: string) => {
        if (href === '/') return url === '/';
        return url.startsWith(href);
    };

    return (
        <header
            ref={headerRef}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled
                    ? 'py-3 bg-[#0c0d12]/95 backdrop-blur-xl border-b border-white/10 shadow-lg'
                    : 'py-4 lg:py-5 bg-[#090a0d]/80 backdrop-blur-md border-b border-white/5'
            }`}
        >
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between gap-4">
                    {/* Brand Logo with authentic Cutting Edger emblem */}
                    <Link
                        href="/"
                        className="group shrink-0 flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg"
                    >
                        <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center p-1.5 group-hover:border-accent/60 group-hover:bg-accent/10 transition-all duration-300">
                            <img
                                src="/images/ce/ce_icon_neon.png"
                                alt="Cutting Edger"
                                className="w-5 h-5 object-contain group-hover:scale-110 transition-transform duration-300"
                            />
                        </div>
                        <div className="flex items-baseline tracking-tight">
                            <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-accent transition-colors">
                                CUTTING
                            </span>
                            <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-accent ml-1">
                                EDGER
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 font-mono text-[11px] xl:text-xs shrink-0">
                        {navItems.map((item) => {
                            const isCurrent = isActive(item.href);
                            const hasDropdown = item.isMegaMenu || (item.children && item.children.length > 0);

                            return (
                                <div
                                    key={item.label}
                                    className="relative"
                                    onMouseEnter={() => hasDropdown && setOpenDropdown(item.label)}
                                    onMouseLeave={() => hasDropdown && setOpenDropdown(null)}
                                >
                                    <Link
                                        href={item.href}
                                        className={`px-2 xl:px-3 py-1.5 xl:py-2 rounded-lg transition-colors flex items-center gap-1 uppercase tracking-wider whitespace-nowrap shrink-0 ${
                                            isCurrent
                                                ? 'text-accent font-semibold bg-accent/10'
                                                : 'text-neutral-300 hover:text-white hover:bg-white/5'
                                        }`}
                                    >
                                        <span className="whitespace-nowrap">{item.label}</span>
                                        {hasDropdown && (
                                            <ChevronDown className={`w-3 h-3 text-neutral-400 group-hover:text-white transition-transform shrink-0 ${openDropdown === item.label ? 'rotate-180 text-accent' : ''}`} />
                                        )}
                                    </Link>

                                    {/* Dropdown Menu */}
                                    {hasDropdown && openDropdown === item.label && (
                                        item.isMegaMenu ? (
                                            /* Modernized Dynamic Mega Menu for Backend Service Pillars */
                                            <div className="absolute top-full -left-20 w-[1040px] max-w-[96vw] pt-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                                <div className="rounded-3xl p-6 sm:p-7 bg-[#0b0d13]/98 border border-white/15 shadow-[0_30px_90px_rgba(0,0,0,0.95)] backdrop-blur-2xl relative overflow-hidden">
                                                    {/* Subtle top ambient glowing line */}
                                                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent pointer-events-none" />

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                                        {servicesList.map((pillar, pIdx) => {
                                                            const IconComponent = resolveServiceIcon(pillar.icon);
                                                            return (
                                                                <div
                                                                    key={pillar.slug || pIdx}
                                                                    className="flex flex-col justify-between lg:border-r lg:border-white/10 lg:pr-5 lg:last:border-r-0 lg:last:pr-0"
                                                                >
                                                                    <div>
                                                                        {/* Service Pillar Header (Clean & modern, no clunky Pillar tags) */}
                                                                        <Link
                                                                            href={pillar.path}
                                                                            className="group/pillar flex items-center justify-between gap-2.5 pb-3.5 border-b border-white/10 hover:border-accent/50 transition-colors"
                                                                        >
                                                                            <div className="flex items-center gap-2.5 min-w-0">
                                                                                <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-accent group-hover/pillar:bg-accent group-hover/pillar:text-black group-hover/pillar:border-accent transition-all duration-300 shadow-sm shrink-0">
                                                                                    <IconComponent className="w-4 h-4 transition-transform group-hover/pillar:scale-110" />
                                                                                </div>
                                                                                <h3 className="text-xs font-display font-bold text-white group-hover/pillar:text-accent transition-colors leading-snug">
                                                                                    {pillar.title}
                                                                                </h3>
                                                                            </div>
                                                                            <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500 group-hover/pillar:text-accent group-hover/pillar:translate-x-0.5 group-hover/pillar:-translate-y-0.5 transition-all shrink-0" />
                                                                        </Link>

                                                                        {/* Pillar Sub-items with illuminated dots and micro-interactions */}
                                                                        <ul className="mt-3 space-y-1.5">
                                                                            {pillar.children.map((sub, sIdx) => (
                                                                                <li key={sIdx}>
                                                                                    <Link
                                                                                        href={sub.path}
                                                                                        className="group/sub flex items-center justify-between px-2.5 py-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-white/[0.05] border border-transparent hover:border-white/10 transition-all text-xs"
                                                                                    >
                                                                                        <div className="flex items-center gap-2 min-w-0">
                                                                                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-600 group-hover/sub:bg-accent group-hover/sub:scale-125 transition-all shrink-0" />
                                                                                            <span className="truncate group-hover/sub:translate-x-0.5 transition-transform text-[12px] font-medium text-neutral-300 group-hover/sub:text-white">
                                                                                                {sub.title}
                                                                                            </span>
                                                                                        </div>
                                                                                        <ArrowRight className="w-3 h-3 text-neutral-500 group-hover/sub:text-accent shrink-0 opacity-0 group-hover/sub:opacity-100 group-hover/sub:translate-x-0.5 transition-all ml-1.5" />
                                                                                    </Link>
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>

                                                    {/* Mega Menu Footer Banner */}
                                                    <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono bg-white/[0.02] -mx-6 -mb-6 sm:-mx-7 sm:-mb-7 px-6 sm:px-7 py-3.5">
                                                        <div className="flex items-center gap-2 text-neutral-400 text-[11px]">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                                                            <span>Guaranteed 24h SLA · 100% Hand-Drawn Paths · Strict NDA</span>
                                                        </div>
                                                        <div className="flex items-center gap-4 text-xs font-mono">
                                                            <Link
                                                                href="/services"
                                                                className="text-neutral-400 hover:text-white flex items-center gap-1 font-semibold transition-colors"
                                                            >
                                                                <span>All Disciplines</span>
                                                                <ArrowRight className="w-3 h-3" />
                                                            </Link>
                                                            <Link
                                                                href="/#free-trial"
                                                                className="px-2.5 py-1 rounded-md bg-accent text-black font-bold uppercase text-[10px] tracking-wider hover:bg-accent-hover transition-colors"
                                                            >
                                                                Free 3-Asset Pilot
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            /* Standard Dropdown */
                                            <div className="absolute top-full left-0 w-60 pt-2 z-50">
                                                <div className="rounded-2xl p-2 bg-[#0c0d12]/95 border border-white/10 shadow-2xl backdrop-blur-2xl space-y-1">
                                                    {item.children?.map((child, idx) => (
                                                        <Link
                                                            key={idx}
                                                            href={child.href}
                                                            className="block px-3 py-2 text-xs font-mono text-neutral-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 rounded-xl transition-all"
                                                        >
                                                            {child.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            );
                        })}
                    </nav>

                    {/* Right Action Bar */}
                    <div className="flex items-center gap-2 xl:gap-3 shrink-0">
                        <ThemeToggle />



                        {/* Book Discovery Call via Dedicated On-Site Calendar Modal */}
                        <button
                            type="button"
                            onClick={() => {
                                if (onOpenDiscoveryCall) {
                                    onOpenDiscoveryCall();
                                } else {
                                    window.dispatchEvent(new CustomEvent('ce:open-discovery-call'));
                                }
                            }}
                            className="hidden md:inline-flex items-center gap-1.5 xl:gap-2 px-3.5 py-2 xl:px-5 xl:py-2.5 rounded-full bg-gradient-to-b from-[#fcd34d] via-accent to-[#e09214] text-black font-bold text-xs uppercase tracking-wider shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),0_4px_16px_rgba(245,166,35,0.25)] hover:brightness-105 hover:shadow-[0_4px_24px_rgba(245,166,35,0.4)] transition-all duration-300 cursor-pointer select-none shrink-0 whitespace-nowrap"
                        >
                            <Calendar className="w-3.5 h-3.5 text-black stroke-[2.5] shrink-0" />
                            <span>Discovery Call</span>
                        </button>

                        {/* Mobile Menu Hamburger */}
                        <button
                            type="button"
                            onClick={onOpenMobileMenu}
                            aria-label="Open mobile navigation menu"
                            className="p-2.5 rounded-full border border-white/15 bg-white/5 text-neutral-200 hover:text-accent hover:border-accent lg:hidden transition-colors"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
