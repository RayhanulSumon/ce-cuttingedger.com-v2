import React, { useEffect } from 'react';
import { X, Mail, Phone, MapPin, ArrowUpRight, Send } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import { SiteSettings } from '@/types/models';

interface SlideOverContactProps {
    isOpen: boolean;
    onClose: () => void;
    settings?: SiteSettings;
}

export function SlideOverContact({ isOpen, onClose, settings }: SlideOverContactProps) {
    const { data, setData, post, processing, reset, wasSuccessful } = useForm({
        name: '',
        email: '',
        message: '',
        service_interest: 'General Inquiry',
        honeypot: '',
    });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/contact', {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <div
            className={`fixed inset-0 z-[100] transition-opacity duration-300 ${
                isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            aria-modal="true"
            role="dialog"
            aria-labelledby="slideover-title"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />

            {/* Panel */}
            <div
                className={`absolute top-0 right-0 h-full w-full max-w-xl bg-[#0e1017] dark:bg-[#0c0d12] border-l border-white/10 text-white shadow-2xl p-6 sm:p-10 flex flex-col justify-between overflow-y-auto transition-transform duration-500 ease-out ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Header */}
                <div>
                    <div className="flex items-center justify-between pb-6 border-b border-white/10">
                        <span className="font-mono text-xs uppercase tracking-widest text-[#d4ff00]">
                            Direct Agency Channel
                        </span>
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close contact drawer"
                            className="p-2 rounded-full border border-white/10 hover:border-[#d4ff00] hover:text-[#d4ff00] text-neutral-400 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="mt-8">
                        <h2 id="slideover-title" className="text-3xl sm:text-4xl font-display font-bold leading-tight">
                            Have a wild project in mind? <span className="text-[#d4ff00]">Let's talk.</span>
                        </h2>
                        <p className="mt-3 text-neutral-400 text-sm">
                            We collaborate with ambitious innovators worldwide. Drop us a note or call our studio directly.
                        </p>
                    </div>

                    {/* Quick Form */}
                    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                        {/* Honeypot field */}
                        <input
                            type="text"
                            name="website_url"
                            value={data.honeypot}
                            onChange={(e) => setData('honeypot', e.target.value)}
                            tabIndex={-1}
                            autoComplete="off"
                            className="hidden"
                            aria-hidden="true"
                        />

                        <div>
                            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                                Your Name
                            </label>
                            <input
                                type="text"
                                required
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Elon Musk"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#d4ff00] transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="hello@company.com"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#d4ff00] transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                                Message
                            </label>
                            <textarea
                                required
                                rows={3}
                                value={data.message}
                                onChange={(e) => setData('message', e.target.value)}
                                placeholder="Tell us about the scope, timeline, and vision..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#d4ff00] transition-colors"
                            />
                        </div>

                        {wasSuccessful && (
                            <div className="p-3 rounded-lg bg-[#d4ff00]/10 border border-[#d4ff00]/40 text-[#d4ff00] text-xs font-mono">
                                Inbound message transmitted. We will reply within 24 hours.
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-[#d4ff00] text-black font-display font-bold py-3.5 px-6 rounded-xl hover:bg-[#c2eb00] transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
                        >
                            <span>{processing ? 'Sending...' : 'Transmit Inquiry'}</span>
                            <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>
                    </form>
                </div>

                {/* Footer Info & Contacts */}
                <div className="mt-10 pt-8 border-t border-white/10 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <a
                            href={`mailto:${settings?.contact_email || 'studio@cuttingedger.com'}`}
                            className="flex items-center gap-2.5 text-neutral-300 hover:text-[#d4ff00] transition-colors"
                        >
                            <Mail className="w-4 h-4 text-[#d4ff00]" />
                            <span>{settings?.contact_email || 'studio@cuttingedger.com'}</span>
                        </a>
                        <a
                            href={`tel:${settings?.contact_phone || '+18005553343'}`}
                            className="flex items-center gap-2.5 text-neutral-300 hover:text-[#d4ff00] transition-colors"
                        >
                            <Phone className="w-4 h-4 text-[#d4ff00]" />
                            <span>{settings?.contact_phone || '+1 (800) 555-EDGE'}</span>
                        </a>
                        <div className="flex items-center gap-2.5 text-neutral-400 sm:col-span-2">
                            <MapPin className="w-4 h-4 text-[#d4ff00]" />
                            <span>{settings?.office_address || '742 Evergreen Terrace, Creative District, SF'}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 pt-2">
                        {['Twitter', 'LinkedIn', 'Instagram', 'Dribbble'].map((social) => (
                            <a
                                key={social}
                                href="#"
                                className="text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-[#d4ff00] transition-colors flex items-center gap-1"
                            >
                                <span>{social}</span>
                                <ArrowUpRight className="w-3 h-3" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
