import React, { useEffect, useRef, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Paperclip, X } from 'lucide-react';
import { getAttributionData } from '@/lib/attribution';
import { EASE_OUT_QUART } from './shared';

interface DemoModalProps {
    open: boolean;
    onClose: () => void;
}

const inputClass =
    'w-full rounded-xl border border-[#CBD2DE] bg-white px-4 py-3 text-sm text-[#141A26] outline-none transition-colors focus:border-[#2B4BFF]';

export function DemoModal({ open, onClose }: DemoModalProps) {
    const fileInput = useRef<HTMLInputElement>(null);
    const [submitted, setSubmitted] = useState(false);
    const { data, setData, post, processing, errors, reset, transform } = useForm({
        name: '',
        email: '',
        company: '',
        instructions: '',
        attachments: [] as File[],
        honeypot: '',
    });

    useEffect(() => {
        if (!open) {
            // Reopening after a successful request starts from a clean form, not the thank-you screen.
            const timer = window.setTimeout(() => setSubmitted(false), 400);
            return () => window.clearTimeout(timer);
        }
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const attr = getAttributionData();
        transform((current) => ({
            ...current,
            submission_page_url: window.location.href,
            landing_page_url: attr.landing_page_url || window.location.href,
            utm_source: attr.utm_source || '',
            utm_medium: attr.utm_medium || '',
            utm_campaign: attr.utm_campaign || '',
        }));
        post('/free-trial', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setSubmitted(true);
            },
        });
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-[100] grid place-items-center bg-[#0A0D14]/80 p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    onClick={onClose}
                >
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-label="Book a demo"
                        data-scrollable
                        onClick={(e) => e.stopPropagation()}
                        initial={{ y: 40, scale: 0.97, opacity: 0 }}
                        animate={{ y: 0, scale: 1, opacity: 1 }}
                        exit={{ y: 24, scale: 0.98, opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } }}
                        transition={{ duration: 0.45, ease: EASE_OUT_QUART }}
                        className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-[28px] bg-[#EBEEF3] p-6 sm:p-9"
                    >
                        <button type="button" onClick={onClose} aria-label="Close" className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full bg-white">
                            <X size={16} />
                        </button>

                        {submitted ? (
                            <div className="py-10 text-center">
                                <CheckCircle2 className="mx-auto text-[#2B4BFF]" size={48} />
                                <h3 className="mt-4 text-2xl font-extrabold text-[#141A26]">Request received</h3>
                                <p className="mt-2 text-sm text-[#5A6478]">We will be in touch shortly with your sample and a time to talk.</p>
                                <button type="button" onClick={onClose} className="mt-6 rounded-full bg-[#141A26] px-7 py-3 text-sm font-semibold text-white">
                                    Close
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={submit} className="space-y-3" noValidate>
                                <h3 className="text-2xl font-extrabold tracking-tight text-[#141A26]">Book a demo</h3>
                                <p className="pb-2 text-sm text-[#5A6478]">Tell us about your project and attach a few sample files.</p>

                                <input type="text" tabIndex={-1} autoComplete="off" value={data.honeypot} onChange={(e) => setData('honeypot', e.target.value)} className="hidden" aria-hidden="true" />

                                <div>
                                    <input className={inputClass} placeholder="Full name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                    {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                                </div>
                                <div>
                                    <input type="email" className={inputClass} placeholder="Work email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                                    {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                                </div>
                                <input className={inputClass} placeholder="Company" value={data.company} onChange={(e) => setData('company', e.target.value)} />
                                <textarea className={`${inputClass} min-h-24 resize-none`} placeholder="What do you need? (2D, 3D, DTP, video...)" value={data.instructions} onChange={(e) => setData('instructions', e.target.value)} />

                                <input
                                    ref={fileInput}
                                    type="file"
                                    multiple
                                    accept=".jpg,.jpeg,.png,.webp,.tiff,.psd,.zip,.pdf"
                                    className="hidden"
                                    onChange={(e) => setData('attachments', Array.from(e.target.files ?? []))}
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInput.current?.click()}
                                    className="flex w-full items-center gap-2 rounded-xl border border-dashed border-[#5A6478] px-4 py-3 text-left text-sm text-[#5A6478] hover:border-[#2B4BFF]"
                                >
                                    <Paperclip size={16} />
                                    {data.attachments.length ? `${data.attachments.length} file(s) attached` : 'Attach files (JPG, PNG, PSD, ZIP, PDF · 25 MB each)'}
                                </button>
                                {(errors as Record<string, string>)['attachments.0'] && (
                                    <p className="text-xs text-red-600">{(errors as Record<string, string>)['attachments.0']}</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full rounded-full bg-[#2B4BFF] px-6 py-4 text-sm font-bold text-white transition-opacity disabled:opacity-60"
                                >
                                    {processing ? 'Sending…' : 'Send request'}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

