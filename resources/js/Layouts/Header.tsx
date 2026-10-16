import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Menu, ArrowUpRight } from 'lucide-react';
import { ThemeToggle } from '@/Components/UI/ThemeToggle';
import { Button } from '@/Components/UI/Button';
import { SiteSettings } from '@/types/models';

interface HeaderProps {
    onOpenContact: () => void;
    onOpenMobileMenu: () => void;
    settings?: SiteSettings;
}

export function Header({ onOpenContact, onOpenMobileMenu, settings }: HeaderProps) {
    const { url } = usePage();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { label: 'Work', href: '/work' },
        { label: 'Services', href: '/services' },
        { label: 'About', href: '/about' },
        { label: 'Team', href: '/team' },
        { label: 'Blog', href: '/blog' },
        { label: 'Contact', href: '/contact' },
    ];

    const isActive = (href: string) => {
        if (href === '/') return url === '/';
        return url.startsWith(href);
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled
                    ? 'py-3.5 bg-[#0a0b0e]/85 dark:bg-[#0a0b0e]/90 light:bg-white/85 backdrop-blur-xl border-b border-black/5 dark:border-white/10 shadow-sm'
                    : 'py-6 bg-transparent'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* Brand Logo */}
                    <Link
                        href="/"
                        className="group flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#d4ff00] rounded-lg"
                    >
                        <span className="font-display font-black text-xl sm:text-2xl tracking-tighter text-neutral-900 dark:text-white transition-colors">
                            {settings?.brand_name || 'CUTTING'}
                        </span>
                        <span className="font-display font-black text-xl sm:text-2xl tracking-tighter text-[#d4ff00]">
                            EDGER.
                        </span>
                        <span className="w-2 h-2 rounded-full bg-[#d4ff00] animate-pulse ml-0.5" />
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden lg:flex items-center gap-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full px-4 py-1.5 backdrop-blur-md">
                        {navItems.map((item) => {
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`relative px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-colors rounded-full ${
                                        active
                                            ? 'text-[#d4ff00] bg-black/20 dark:bg-white/10'
                                            : 'text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-[#d4ff00]'
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right Action Bar */}
                    <div className="flex items-center gap-3">
                        <ThemeToggle />

                        <Button
                            variant="primary"
                            size="sm"
                            onClick={onOpenContact}
                            className="hidden sm:inline-flex"
                        >
                            <span>Let's talk</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </Button>

                        {/* Mobile Menu Hamburger */}
                        <button
                            type="button"
                            onClick={onOpenMobileMenu}
                            aria-label="Open mobile navigation menu"
                            className="p-2.5 rounded-full border border-black/10 dark:border-white/15 bg-white/5 dark:bg-white/5 text-neutral-800 dark:text-neutral-200 hover:text-[#d4ff00] hover:border-[#d4ff00] lg:hidden transition-colors"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
