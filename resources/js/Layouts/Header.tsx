import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Menu, ArrowUpRight, ChevronDown } from 'lucide-react';
import { ThemeToggle } from '@/Components/ui/ThemeToggle';
import { SiteSettings } from '@/types/models';

interface HeaderProps {
    onOpenContact: () => void;
    onOpenMobileMenu: () => void;
    settings?: SiteSettings;
}

export function Header({ onOpenContact, onOpenMobileMenu }: HeaderProps) {
    const { url } = usePage();
    const [isScrolled, setIsScrolled] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 15) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    interface NavGroup {
        category: string;
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
            label: 'Home',
            href: '/',
        },
        {
            label: 'Services',
            href: '/services',
            isMegaMenu: true,
            children: [
                { label: 'All Services', href: '/services' },
            ],
            groups: [
                {
                    category: 'Core Cutout & Prep',
                    items: [
                        { label: 'Background Removal', href: '/services/background-removal' },
                        { label: 'Ghost Mannequin', href: '/services/ghost-mannequin' },
                        { label: 'Multipath Clipping', href: '/services/background-removal' },
                        { label: 'Hollow Man Effect', href: '/services/ghost-mannequin' },
                        { label: 'Color Correction', href: '/services/background-removal' },
                    ],
                },
                {
                    category: 'High-End Retouching',
                    items: [
                        { label: 'High End Model Retouch', href: '/services/high-end-model-retouch' },
                        { label: 'Fashion & Editorial Retouch', href: '/services/high-end-model-retouch' },
                        { label: 'Shoe & Footwear Retouch', href: '/services/high-end-model-retouch' },
                        { label: 'Automobile & Vehicle Retouch', href: '/services/background-removal' },
                    ],
                },
                {
                    category: 'Luxury & Jewelry',
                    items: [
                        { label: 'Fine Jewelry Retouch', href: '/services/jewelry-retouch' },
                        { label: 'Gemstone & Diamond Polish', href: '/services/jewelry-retouch' },
                        { label: 'Metallic Luster & Watches', href: '/services/jewelry-retouch' },
                        { label: 'Shadow & Reflection Creation', href: '/services/jewelry-retouch' },
                    ],
                },
                {
                    category: '3D Spatial & DTP',
                    items: [
                        { label: '3D CGI Product Modeling', href: '/services/3d-modeling-and-rendering' },
                        { label: '360° Interactive WebGL Spins', href: '/services/3d-modeling-and-rendering' },
                        { label: '3D Furniture Rendering', href: '/services/3d-modeling-and-rendering' },
                        { label: 'Desktop Publishing (DTP)', href: '/services/desktop-publishing' },
                    ],
                },
            ],
        },
        {
            label: 'Pricing',
            href: '/pricing',
        },
        {
            label: 'Work',
            href: '/work',
        },
        {
            label: 'Company',
            href: '/about',
            children: [
                { label: 'About Studio', href: '/about' },
                { label: 'Creative Team', href: '/team' },
                { label: 'Careers & Openings', href: '/careers' },
                { label: 'Pricing Plans', href: '/pricing' },
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
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled
                    ? 'py-3 bg-[#0c0d12]/95 backdrop-blur-xl border-b border-white/10 shadow-lg'
                    : 'py-5 bg-[#090a0d]/80 backdrop-blur-md border-b border-white/5'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* Brand Logo matching Agntix reference styling */}
                    <Link
                        href="/"
                        className="group flex items-center gap-2.5 focus-visible:ring-2 focus-visible:ring-[#d4ff00] rounded-lg select-none"
                    >
                        {/* Stylized Modern Emblem Glyph */}
                        <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-[#d4ff00] group-hover:bg-[#d4ff00] group-hover:text-black transition-all duration-300">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                <path d="M12 2L2 22h7l3-6 3 6h7L12 2zm0 6l1.8 3.6h-3.6L12 8z" />
                            </svg>
                        </div>

                        {/* Wordmark */}
                        <div className="flex items-baseline tracking-tight">
                            <span className="font-['Clash_Display',_'Syne',_'Outfit',_sans-serif] text-2xl sm:text-3xl font-bold tracking-wider text-white transition-colors">
                                CUTTING
                            </span>
                            <span className="font-['Clash_Display',_'Syne',_'Outfit',_sans-serif] text-2xl sm:text-3xl font-bold tracking-wider text-[#d4ff00] ml-1.5">
                                EDGER.
                            </span>
                        </div>
                    </Link>

                    {/* Agntix-Style Desktop Navigation with Dropdown Carets */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {navItems.map((item) => {
                            const active = isActive(item.href);
                            const hasChildren = item.children && item.children.length > 0;

                            return (
                                <div
                                    key={item.label}
                                    className="relative"
                                    onMouseEnter={() => setOpenDropdown(item.label)}
                                    onMouseLeave={() => setOpenDropdown(null)}
                                >
                                    <Link
                                        href={item.href}
                                        className={`px-3.5 py-2 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors rounded-lg group ${
                                            active
                                                ? 'text-[#d4ff00]'
                                                : 'text-neutral-300 hover:text-white'
                                        }`}
                                    >
                                        <span>{item.label}</span>
                                        {hasChildren && (
                                            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-transform group-hover:rotate-180" />
                                        )}
                                    </Link>

                                    {/* Dropdown / Mega Menu */}
                                    {hasChildren && openDropdown === item.label && (
                                        item.isMegaMenu && item.groups ? (
                                            /* Services Wide Mega Menu Dropdown */
                                            <div className="absolute top-full -left-20 sm:-left-32 md:-left-44 w-[92vw] max-w-5xl pt-3 z-[100]">
                                                <div className="rounded-3xl p-6 sm:p-8 bg-[#10121a] border-2 border-white/20 shadow-[0_30px_90px_rgba(0,0,0,0.98),0_0_35px_rgba(212,255,0,0.12)] backdrop-blur-3xl ring-1 ring-white/10 relative overflow-hidden">
                                                    {/* Top ambient highlight line */}
                                                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4ff00] to-transparent pointer-events-none" />

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                                        {item.groups.map((group, gIdx) => (
                                                            <div key={gIdx} className="space-y-3">
                                                                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#d4ff00] pb-2 border-b border-white/15 flex items-center justify-between">
                                                                    <span>{group.category}</span>
                                                                </h4>
                                                                <ul className="space-y-1.5">
                                                                    {group.items.map((sub, sIdx) => (
                                                                        <li key={sIdx}>
                                                                            <Link
                                                                                href={sub.href}
                                                                                className="block text-xs font-medium text-neutral-200 hover:text-black hover:bg-[#d4ff00] px-2.5 py-1.5 rounded-lg transition-all duration-150"
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
                                                        <span className="text-neutral-400">Need high-volume studio retouching or custom workflow?</span>
                                                        <Link
                                                            href="/services"
                                                            className="text-[#d4ff00] hover:text-white flex items-center gap-1 font-bold uppercase tracking-wider transition-colors"
                                                        >
                                                            <span>Explore All Capabilities</span>
                                                            <ArrowUpRight className="w-3.5 h-3.5" />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            /* Standard Dropdown */
                                            <div className="absolute top-full left-0 w-56 pt-2 z-50">
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
                    <div className="flex items-center gap-3">
                        <ThemeToggle />

                        {/* Agntix-Style Pill "Get in Touch" Button */}
                        <button
                            type="button"
                            onClick={onOpenContact}
                            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#d4ff00] text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#c2eb00] hover:shadow-[0_0_20px_rgba(212,255,0,0.4)] transition-all duration-300 cursor-pointer select-none"
                        >
                            <span>Get in Touch</span>
                            <ArrowUpRight className="w-4 h-4 text-black stroke-[2.5]" />
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
