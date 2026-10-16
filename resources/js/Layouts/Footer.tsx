import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import { ArrowUp, ArrowUpRight, Send, Check } from 'lucide-react';
import { SiteSettings } from '@/types/models';

interface FooterProps {
    settings?: SiteSettings;
}

export function Footer({ settings }: FooterProps) {
    const { data, setData, post, processing, wasSuccessful, reset } = useForm({
        email: '',
    });

    const handleNewsletterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/newsletter', {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="relative bg-[#0a0b0e] text-white border-t border-white/10 pt-20 pb-12 overflow-hidden">
            {/* Background Ambient Glow */}
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#d4ff00]/10 rounded-full blur-[140px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Giant Statement CTA */}
                <div className="pb-16 border-b border-white/10">
                    <span className="font-mono text-xs uppercase tracking-widest text-[#d4ff00] block mb-4">
                        Ready To Transform Your Category?
                    </span>
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight leading-[1.05] max-w-3xl">
                            Let’s engineer something{' '}
                            <span className="text-[#d4ff00] underline decoration-[#d4ff00]/40 underline-offset-8">
                                unforgettable
                            </span>{' '}
                            together.
                        </h2>

                        <a
                            href={`mailto:${settings?.contact_email || 'hello@cuttingedger.com'}`}
                            className="group inline-flex items-center gap-3 text-lg sm:text-xl font-mono text-neutral-300 hover:text-[#d4ff00] transition-colors"
                        >
                            <span>{settings?.contact_email || 'hello@cuttingedger.com'}</span>
                            <div className="w-10 h-10 rounded-full border border-white/20 group-hover:border-[#d4ff00] group-hover:bg-[#d4ff00] group-hover:text-black flex items-center justify-center transition-all">
                                <ArrowUpRight className="w-5 h-5" />
                            </div>
                        </a>
                    </div>
                </div>

                {/* Grid Links + Newsletter */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-16 border-b border-white/10">
                    {/* Brand Info */}
                    <div className="lg:col-span-2 space-y-4">
                        <Link href="/" className="font-display font-extrabold text-2xl tracking-tighter">
                            <span>CUTTING</span>
                            <span className="text-[#d4ff00]">EDGER.</span>
                        </Link>
                        <p className="text-neutral-400 text-sm max-w-sm leading-relaxed">
                            {settings?.tagline ||
                                'A next-generation digital agency engineering tactile brand identities, kinetic software interfaces, and radical web experiences.'}
                        </p>
                        <div className="pt-2">
                            <span className="font-mono text-xs text-neutral-500 uppercase block mb-2">
                                Headquartered in
                            </span>
                            <span className="text-sm text-neutral-300 font-medium">
                                {settings?.office_address || 'San Francisco & London'}
                            </span>
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div>
                        <h4 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-4">
                            Index
                        </h4>
                        <ul className="space-y-2.5 text-sm">
                            {['Work', 'Services', 'About', 'Team', 'Careers', 'Pricing'].map((item) => (
                                <li key={item}>
                                    <Link
                                        href={`/${item.toLowerCase()}`}
                                        className="text-neutral-400 hover:text-[#d4ff00] transition-colors"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-4">
                            Socials
                        </h4>
                        <ul className="space-y-2.5 text-sm">
                            {[
                                { name: 'Twitter / X', url: 'https://twitter.com' },
                                { name: 'Instagram', url: 'https://instagram.com' },
                                { name: 'LinkedIn', url: 'https://linkedin.com' },
                                { name: 'Dribbble', url: 'https://dribbble.com' },
                                { name: 'GitHub', url: 'https://github.com' },
                            ].map((s) => (
                                <li key={s.name}>
                                    <a
                                        href={s.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-neutral-400 hover:text-[#d4ff00] transition-colors inline-flex items-center gap-1"
                                    >
                                        <span>{s.name}</span>
                                        <ArrowUpRight className="w-3 h-3 opacity-60" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter Subscription */}
                    <div>
                        <h4 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-4">
                            Dispatch
                        </h4>
                        <p className="text-xs text-neutral-400 mb-3">
                            Quarterly digest on design theory, kinetic web engineering, and product velocity.
                        </p>
                        <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                            <div className="relative">
                                <input
                                    type="email"
                                    required
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="your@email.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4ff00] transition-colors pr-10"
                                />
                                <button
                                    type="submit"
                                    disabled={processing}
                                    aria-label="Subscribe to newsletter"
                                    className="absolute right-1.5 top-1.5 p-1.5 rounded-lg bg-[#d4ff00] text-black hover:bg-[#c2eb00] transition-colors"
                                >
                                    {wasSuccessful ? (
                                        <Check className="w-3.5 h-3.5" />
                                    ) : (
                                        <Send className="w-3.5 h-3.5" />
                                    )}
                                </button>
                            </div>
                            {wasSuccessful && (
                                <span className="text-[11px] font-mono text-[#d4ff00] block">
                                    Subscribed successfully.
                                </span>
                            )}
                        </form>
                    </div>
                </div>

                {/* Bottom Bar & Back to top */}
                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-500">
                    <div className="flex items-center gap-6">
                        <span>© {new Date().getFullYear()} CuttingEdger Inc. All rights reserved.</span>
                        <Link href="/privacy" className="hover:text-neutral-300 transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="hover:text-neutral-300 transition-colors">
                            Terms of Service
                        </Link>
                    </div>

                    <button
                        type="button"
                        onClick={scrollToTop}
                        aria-label="Scroll back to top"
                        className="inline-flex items-center gap-2 text-neutral-400 hover:text-[#d4ff00] transition-colors cursor-pointer"
                    >
                        <span>Back to top</span>
                        <div className="p-1 rounded-full border border-white/20">
                            <ArrowUp className="w-3.5 h-3.5" />
                        </div>
                    </button>
                </div>
            </div>
        </footer>
    );
}
