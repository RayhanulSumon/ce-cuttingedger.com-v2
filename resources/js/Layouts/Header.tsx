import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Menu, ArrowUpRight, ChevronDown, Calendar, Sparkles } from 'lucide-react';
import { ThemeToggle } from '@/Components/ui/ThemeToggle';
import { SiteSettings } from '@/types/models';

interface HeaderProps {
    onOpenContact: () => void;
    onOpenDiscoveryCall?: () => void;
    onOpenMobileMenu: () => void;
    settings?: SiteSettings;
}

export function Header({
    onOpenContact,
    onOpenDiscoveryCall,
    onOpenMobileMenu,
    settings,
}: HeaderProps) {
    const { url } = usePage();
    const [isScrolled, setIsScrolled] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const headerRef = React.useRef<HTMLElement>(null);
    const calendlyUrl = (settings as any)?.calendly_url || 'https://calendly.com/cuttingedger/discovery-call';

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

    useEffect(() => {
        const updateHeaderHeight = () => {
            if (headerRef.current && isScrolled) {
                const height = headerRef.current.getBoundingClientRect().height;
                if (height > 0) {
                    document.documentElement.style.setProperty('--header-height', `${height}px`);
                }
            }
        };

        updateHeaderHeight();
        const timer = setTimeout(updateHeaderHeight, 320);
        return () => clearTimeout(timer);
    }, [isScrolled]);

    interface NavGroup {
        category: string;
        hubHref: string;
        items: { label: string; href: string }[];
    }

    interface NavItem {
        label: string;
        href: string;
        isMegaMenu?: boolean;
        groups?: NavGroup[];
        children?: { label: string; href: string }[];
    }

    const navItems: NavItem[] = [
        {
            label: 'Services',
            href: '/services',
            isMegaMenu: true,
            children: [
                { label: 'All Service Pillars', href: '/services' },
            ],
            groups: [
                {
                    category: '1. Catalog Optimization',
                    hubHref: '/services/ecommerce-catalog-optimization',
                    items: [
                        { label: 'Overview & High-Volume Retouching', href: '/services/ecommerce-catalog-optimization' },
                        { label: 'Clipping Path Service', href: '/services/ecommerce-catalog-optimization/clipping-path-service' },
                        { label: 'Image Masking Service', href: '/services/ecommerce-catalog-optimization/image-masking-service' },
                        { label: 'Ghost Mannequin Service', href: '/services/ecommerce-catalog-optimization/ghost-mannequin-service' },
                    ],
                },
                {
                    category: '2. Color Standardization',
                    hubHref: '/services/color-standardization',
                    items: [
                        { label: 'Color Standardization Overview', href: '/services/color-standardization' },
                        { label: 'Delta-E Swatch Calibration', href: '/services/color-standardization' },
                        { label: 'Apparel Multi-Colorway Shifts', href: '/services/color-standardization' },
                        { label: 'Fabric Texture Preservation', href: '/services/color-standardization' },
                    ],
                },
                {
                    category: '3. White-Label Extension',
                    hubHref: '/services/white-label-agency-extension',
                    items: [
                        { label: 'Agency Bandwidth Overview', href: '/services/white-label-agency-extension' },
                        { label: 'Confidential 24/7 Overnight Delivery', href: '/services/white-label-agency-extension' },
                        { label: 'Dedicated Account Teams', href: '/services/white-label-agency-extension' },
                        { label: 'Strict Mutual NDA Governance', href: '/nda-compliance' },
                    ],
                },
                {
                    category: '4. Virtual Production & CGI',
                    hubHref: '/services/virtual-production-cgi',
                    items: [
                        { label: '3D CGI Product Studio', href: '/services/virtual-production-cgi' },
                        { label: '3D Furniture Modeling & Staging', href: '/services/virtual-production-cgi/3d-furniture-modeling' },
                        { label: 'Procedural PBR Material Authoring', href: '/services/virtual-production-cgi' },
                        { label: 'Interactive 360° WebGL Spins', href: '/services/virtual-production-cgi' },
                    ],
                },
            ],
        },
        {
            label: 'Case Studies',
            href: '/case-studies',
        },
        {
            label: 'Reviews',
            href: '/reviews',
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
                        className="group shrink-0 flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4ff00] rounded-lg"
                    >
                        <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center p-1.5 group-hover:border-[#d4ff00]/60 group-hover:bg-[#d4ff00]/10 transition-all duration-300">
                            <img
                                src="/images/ce/ce_icon_neon.png"
                                alt="Cutting Edger"
                                className="w-5 h-5 object-contain group-hover:scale-110 transition-transform duration-300"
                            />
                        </div>
                        <div className="flex items-baseline tracking-tight">
                            <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-[#d4ff00] transition-colors">
                                CUTTING
                            </span>
                            <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-[#d4ff00] ml-1">
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
                                                ? 'text-[#d4ff00] font-semibold bg-[#d4ff00]/10'
                                                : 'text-neutral-300 hover:text-white hover:bg-white/5'
                                        }`}
                                    >
                                        <span className="whitespace-nowrap">{item.label}</span>
                                        {hasDropdown && (
                                            <ChevronDown className="w-3 h-3 text-neutral-400 group-hover:text-white transition-transform shrink-0" />
                                        )}
                                    </Link>

                                    {/* Dropdown Menu */}
                                    {hasDropdown && openDropdown === item.label && (
                                        item.isMegaMenu && item.groups ? (
                                            /* Mega Menu for 4 Core Pillars */
                                            <div className="absolute top-full -left-20 w-[840px] pt-3 z-50">
                                                <div className="rounded-3xl p-6 sm:p-8 bg-[#12141c] border border-white/15 shadow-2xl backdrop-blur-2xl">
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                                        {item.groups.map((group, gIdx) => (
                                                            <div key={gIdx} className="space-y-3">
                                                                <Link
                                                                    href={group.hubHref}
                                                                    className="font-mono text-xs font-bold uppercase tracking-wider text-[#d4ff00] pb-2 border-b border-white/15 flex items-center justify-between hover:text-white transition-colors"
                                                                >
                                                                    <span>{group.category}</span>
                                                                    <ArrowUpRight className="w-3 h-3" />
                                                                </Link>
                                                                <ul className="space-y-1.5">
                                                                    {group.items.map((sub, sIdx) => (
                                                                        <li key={sIdx}>
                                                                            <Link
                                                                                href={sub.href}
                                                                                className="block text-xs font-medium text-neutral-200 hover:text-black hover:bg-[#d4ff00] px-2 py-1.5 rounded-lg transition-all duration-150"
                                                                            >
                                                                                {sub.label}
                                                                            </Link>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Mega Menu Footer Banner */}
                                                    <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-neutral-300 bg-white/[0.02] -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 px-6 sm:px-8 py-4">
                                                        <span className="text-neutral-400">Looking for custom enterprise catalog turnarounds?</span>
                                                        <Link
                                                            href="/services"
                                                            className="text-[#d4ff00] hover:text-white flex items-center gap-1 font-bold uppercase tracking-wider transition-colors"
                                                        >
                                                            <span>Explore All Service Disciplines</span>
                                                            <ArrowUpRight className="w-3.5 h-3.5" />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            /* Standard Dropdown */
                                            <div className="absolute top-full left-0 w-60 pt-2 z-50">
                                                <div className="rounded-2xl p-2 bg-[#12141c] border border-white/10 shadow-2xl backdrop-blur-2xl space-y-1">
                                                    {item.children?.map((child, idx) => (
                                                        <Link
                                                            key={idx}
                                                            href={child.href}
                                                            className="block px-3 py-2 text-xs font-mono uppercase tracking-wider text-neutral-300 hover:text-black hover:bg-[#d4ff00] rounded-xl transition-colors"
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

                        {/* Free Pilot Lead Magnet Button */}
                        <Link
                            href="/#free-trial"
                            className="hidden xl:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#d4ff00]/40 text-[#d4ff00] hover:bg-[#d4ff00]/10 font-mono text-xs uppercase tracking-wider transition-all shrink-0 whitespace-nowrap"
                        >
                            <Sparkles className="w-3.5 h-3.5 shrink-0" />
                            <span>3-Asset Pilot</span>
                        </Link>

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
                            className="hidden md:inline-flex items-center gap-1.5 xl:gap-2 px-3.5 py-2 xl:px-5 xl:py-2.5 rounded-full bg-[#d4ff00] text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#c2eb00] hover:shadow-[0_0_20px_rgba(212,255,0,0.4)] transition-all duration-300 cursor-pointer select-none shrink-0 whitespace-nowrap"
                        >
                            <Calendar className="w-3.5 h-3.5 text-black stroke-[2.5] shrink-0" />
                            <span>Discovery Call</span>
                        </button>

                        {/* Mobile Menu Hamburger */}
                        <button
                            type="button"
                            onClick={onOpenMobileMenu}
                            aria-label="Open mobile navigation menu"
                            className="p-2.5 rounded-full border border-white/15 bg-white/5 text-neutral-200 hover:text-[#d4ff00] hover:border-[#d4ff00] lg:hidden transition-colors"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
