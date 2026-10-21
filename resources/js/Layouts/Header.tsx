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

    const navItems: { label: string; href: string; children?: { label: string; href: string }[] }[] = [
        {
            label: 'Home',
            href: '/',
        },
        {
            label: 'Pages',
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
            label: 'Projects',
            href: '/work',
            children: [
                { label: 'All Commissions (24+)', href: '/work' },
                { label: '3D Spatial CGI', href: '/work?category=3d' },
                { label: '2D Vector Identity', href: '/work?category=2d' },
                { label: 'Kinetic WebGL Systems', href: '/work?category=web' },
            ],
        },
        {
            label: 'Services',
            href: '/services',
            children: [
                { label: 'All Disciplines', href: '/services' },
                { label: 'Brand Architecture', href: '/services/brand-architecture' },
                { label: 'Kinetic 3D & CGI', href: '/services/kinetic-3d' },
                { label: 'Full-Stack Web Velocity', href: '/services/creative-web' },
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
                            <span className="font-['Antonio',_'Bebas_Neue',_sans-serif] text-2xl sm:text-3xl font-bold text-white transition-colors">
                                CUTTING
                            </span>
                            <span className="font-['Antonio',_'Bebas_Neue',_sans-serif] text-2xl sm:text-3xl font-bold text-[#d4ff00] ml-1">
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

                                    {/* Dropdown Menu */}
                                    {hasChildren && openDropdown === item.label && (
                                        <div className="absolute top-full left-0 w-56 pt-2 z-50">
                                            <div className="rounded-2xl p-2 bg-[#12141c] border border-white/10 shadow-2xl backdrop-blur-2xl space-y-1">
                                                {item.children.map((child, idx) => (
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
