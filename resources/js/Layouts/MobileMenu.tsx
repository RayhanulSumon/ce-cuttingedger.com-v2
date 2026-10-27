import React, { useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { X, ArrowUpRight, LogIn, UserPlus, User } from 'lucide-react';
import { ThemeToggle } from '@/Components/ui/ThemeToggle';
import { SiteSettings } from '@/types/models';
import { PageProps } from '@/types';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenContact: () => void;
    settings?: SiteSettings;
}

export function MobileMenu({ isOpen, onClose, onOpenContact, settings }: MobileMenuProps) {
    const { auth } = usePage<PageProps & { auth?: { user?: { name: string; email: string; role?: string } | null } }>().props;

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const navLinks = [
        { label: 'Services', href: '/services', count: '04' },
        { label: 'Case Studies', href: '/case-studies', count: '08' },
        { label: 'About', href: '/about', count: '01' },
        { label: 'Team', href: '/team', count: '05' },
        { label: 'Careers', href: '/careers', count: '03' },
        { label: 'Pricing', href: '/pricing', count: '03' },
        { label: 'Blog', href: '/blog', count: '06' },
        { label: 'Contact', href: '/contact', count: '01' },
    ];

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[120] bg-[#0a0b0e] text-white flex flex-col justify-between p-6 sm:p-12 overflow-y-auto animate-in fade-in duration-300"
            role="dialog"
            aria-modal="true"
        >
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-white/10 pb-6">
                <Link
                    href="/"
                    onClick={onClose}
                    className="font-display font-extrabold text-2xl tracking-tighter flex items-center gap-1"
                >
                    <span>CUTTING</span>
                    <span className="text-accent">EDGER.</span>
                </Link>

                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close mobile navigation"
                        className="p-3 rounded-full border border-white/20 text-neutral-300 hover:text-accent hover:border-accent transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="my-auto py-8">
                <ul className="space-y-4 sm:space-y-6">
                    {navLinks.map((item, index) => (
                        <li key={item.href} className="overflow-hidden">
                            <Link
                                href={item.href}
                                onClick={onClose}
                                className="group flex items-baseline justify-between py-2 border-b border-white/5 hover:border-accent/40 transition-colors"
                            >
                                <span className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-neutral-300 group-hover:text-accent group-hover:translate-x-3 transition-all duration-300">
                                    {item.label}
                                </span>
                                <span className="font-mono text-xs sm:text-sm text-neutral-500 group-hover:text-accent">
                                    ({item.count})
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Account / Auth Navigation Bar */}
            <div className="py-4 border-t border-white/10">
                {auth?.user ? (
                    <Link
                        href="/admin"
                        onClick={onClose}
                        className="w-full py-3 px-4 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 text-neutral-200 hover:text-white text-xs font-mono flex items-center justify-center gap-2 transition-colors"
                    >
                        <User className="w-4 h-4 text-accent" />
                        <span>Command Clearance ({auth.user.name?.split(' ')[0]})</span>
                    </Link>
                ) : (
                    <div className="grid grid-cols-2 gap-3 w-full">
                        <Link
                            href="/login"
                            onClick={onClose}
                            className="py-3 px-4 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 text-neutral-200 hover:text-white text-xs font-mono flex items-center justify-center gap-2 transition-colors"
                        >
                            <LogIn className="w-4 h-4 text-neutral-400" />
                            <span>Sign In</span>
                        </Link>
                        <a
                            href="/#free-trial"
                            onClick={(e) => {
                                onClose();
                                if (window.location.pathname === '/') {
                                    e.preventDefault();
                                    const el = document.getElementById('free-trial');
                                    if (el) {
                                        el.scrollIntoView({ behavior: 'smooth' });
                                    }
                                }
                            }}
                            className="py-3 px-4 rounded-2xl border border-accent/30 bg-accent/10 hover:bg-accent/20 text-accent hover:text-white text-xs font-mono flex items-center justify-center gap-2 transition-colors font-medium"
                        >
                            <UserPlus className="w-4 h-4 text-accent" />
                            <span>Sign Up</span>
                        </a>
                    </div>
                )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <span className="font-mono text-xs uppercase text-neutral-400 block mb-1">Direct Line</span>
                    <a
                        href={`mailto:${settings?.contact_email || 'hello@cuttingedger.com'}`}
                        className="text-sm font-semibold hover:text-accent transition-colors"
                    >
                        {settings?.contact_email || 'hello@cuttingedger.com'}
                    </a>
                </div>

                <Link
                    href="/contact"
                    onClick={onClose}
                    className="bg-accent text-black px-6 py-3.5 rounded-full font-display font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-accent-hover transition-colors"
                >
                    <span>Initiate Project</span>
                    <ArrowUpRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
