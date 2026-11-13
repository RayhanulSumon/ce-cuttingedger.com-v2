import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { SeoHead } from '@/Components/Common/SeoHead';
import {
    CheckCircle2,
    Calendar,
    ArrowRight,
    Sparkles,
    DownloadCloud,
    Copy,
    Check,
    Clock,
    Shield,
    FileImage,
} from 'lucide-react';
import { PageProps } from '@/types';

export default function ThankYou() {
    const { settings, flash } = usePage<PageProps>().props;
    const orderNumber = (flash as any)?.order_number;
    const isPilot = Boolean(orderNumber);
    const contactEmail = (settings as any)?.contact_email || 'hello@cuttingedger.com';
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (orderNumber) {
            navigator.clipboard.writeText(orderNumber);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <>
            <SeoHead
                title="Request Confirmed — Cutting Edger"
                description="Your visual production request has been received by our studio team."
                noindex={true}
            />

            <section className="relative min-h-[85vh] flex items-center justify-center py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-page overflow-hidden">
                {/* Subtle Ambient Radial Lighting */}
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[38rem] h-[22rem] bg-primary/5 rounded-full blur-[200px] pointer-events-none" />

                <div className="max-w-3xl w-full mx-auto relative z-10 text-center space-y-8">
                    {/* Glowing Check Icon */}
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary-ink shadow-[0_0_35px_rgba(251, 183, 24, 0.18)]">
                        <CheckCircle2 className="w-7 h-7" />
                    </div>

                    {/* Minimal, Punchy Header */}
                    <div className="space-y-2">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-ink tracking-tight">
                            Request <span className="text-primary-ink">Confirmed.</span>
                        </h1>
                        <p className="text-muted text-sm sm:text-base max-w-md mx-auto">
                            {isPilot
                                ? 'Confirmation email sent. Your raw files are now in our studio production queue.'
                                : 'Confirmation email sent. Our studio directors are reviewing your project requirements.'}
                        </p>
                    </div>

                    {/* Visual 3-Stage Progress Timeline */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-white border border-ink/10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
                            {/* Step 1: Received */}
                            <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2 relative">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-xl bg-primary/15 border border-primary/40 flex items-center justify-center text-primary-ink">
                                        <Check className="w-4 h-4 stroke-[3]" />
                                    </div>
                                    <span className="text-[11px] font-mono uppercase tracking-wider text-primary-ink font-bold">
                                        01 · Received
                                    </span>
                                </div>
                                <p className="text-ink text-sm font-bold">
                                    {isPilot ? 'Files Logged' : 'Brief Logged'}
                                </p>
                                <p className="text-xs text-muted">
                                    {isPilot ? 'Confirmation email sent' : 'Direct studio notification'}
                                </p>
                            </div>

                            {/* Step 2: In Retouching / Review */}
                            <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2 relative">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-bold shadow-[0_0_20px_rgba(251, 183, 24, 0.35)] animate-pulse">
                                        <Sparkles className="w-4 h-4" />
                                    </div>
                                    <span className="text-[11px] font-mono uppercase tracking-wider text-ink font-bold">
                                        {isPilot ? '02 · In Queue' : '02 · In Review'}
                                    </span>
                                </div>
                                <p className="text-ink text-sm font-bold">
                                    {isPilot ? 'Senior Artisan' : 'Studio Director'}
                                </p>
                                <p className="text-xs text-muted">
                                    {isPilot ? 'Manual clipping & color work' : 'Scope & capacity assessment'}
                                </p>
                            </div>

                            {/* Step 3: Delivery / Response */}
                            <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2 relative">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-xl bg-ink/[0.03] border border-ink/10 flex items-center justify-center text-muted">
                                        <DownloadCloud className="w-4 h-4" />
                                    </div>
                                    <span className="text-[11px] font-mono uppercase tracking-wider text-subtle font-bold">
                                        {isPilot ? '03 · Delivery' : '03 · Response'}
                                    </span>
                                </div>
                                <p className="text-ink-2 text-sm font-bold">&lt; 24h Turnaround</p>
                                <p className="text-xs text-muted">
                                    {isPilot ? 'Layered PSD & web previews' : 'Custom estimate & next steps'}
                                </p>
                            </div>
                        </div>

                        {/* Order Reference Pill & Quick Specs */}
                        {orderNumber && (
                            <div className="mt-6 pt-5 border-t border-ink/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                                <div className="flex items-center gap-2">
                                    <span className="text-subtle">REF:</span>
                                    <span className="text-ink font-bold px-2.5 py-1 rounded-lg bg-ink/[0.03] border border-ink/10">
                                        {orderNumber}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={handleCopy}
                                        title="Copy Order ID"
                                        className="p-1.5 rounded-md hover:bg-ink/[0.05] text-muted hover:text-ink transition-colors cursor-pointer"
                                    >
                                        {copied ? <Check className="w-3.5 h-3.5 text-primary-ink" /> : <Copy className="w-3.5 h-3.5" />}
                                    </button>
                                </div>

                                <div className="flex items-center gap-4 text-muted text-[11px]">
                                    <span className="inline-flex items-center gap-1.5">
                                        <Clock className="w-3 h-3 text-primary-ink" /> 24h SLA
                                    </span>
                                    <span className="inline-flex items-center gap-1.5">
                                        <Shield className="w-3 h-3 text-primary-ink" /> NDA Protected
                                    </span>
                                    <span className="inline-flex items-center gap-1.5">
                                        <FileImage className="w-3 h-3 text-primary-ink" /> Layered PSD
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Visual Call-to-Action Bar: Discovery Call */}
                    <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-ink/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
                        <div className="space-y-0.5">
                            <span className="text-[11px] font-mono text-primary-ink font-bold uppercase tracking-wider">
                                Need High Volume or Custom SLAs?
                            </span>
                            <p className="text-sm font-bold text-ink">
                                Book an optional 15-min technical alignment call
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => window.dispatchEvent(new CustomEvent('ce:open-discovery-call'))}
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-display font-bold text-xs uppercase tracking-wider hover:bg-primary-hover transition-all shadow-md shrink-0 cursor-pointer self-start sm:self-center"
                        >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Schedule Call</span>
                        </button>
                    </div>

                    {/* Clean Minimal Footer Navigation */}
                    <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-muted">
                        <Link href="/" className="hover:text-ink transition-colors">
                            ← Return Home
                        </Link>
                        <span className="text-muted">·</span>
                        <Link href="/capabilities" className="hover:text-ink transition-colors flex items-center gap-1">
                            <span>View Capabilities</span>
                            <ArrowRight className="w-3 h-3" />
                        </Link>
                        <span className="text-muted">·</span>
                        <a href={`mailto:${contactEmail}`} className="hover:text-ink transition-colors">
                            Direct Support ({contactEmail})
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}
