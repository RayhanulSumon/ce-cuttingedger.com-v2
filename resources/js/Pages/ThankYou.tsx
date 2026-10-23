import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { CheckCircle2, Calendar, ArrowRight, ShieldCheck, Clock, FileCheck } from 'lucide-react';
import { PageProps } from '@/types';

export default function ThankYou() {
    const { settings, flash } = usePage<PageProps>().props;
    const calendlyUrl = (settings as any)?.calendly_url || 'https://calendly.com/cuttingedger/discovery-call';

    return (
        <>
            <SeoHead
                title="Transmission Confirmed — Free Pilot Inbound"
                description="Your visual production request has landed safely in the Cutting Edger terminal."
                noindex={true}
            />

            <section className="relative min-h-[85vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-[#0a0b0e] overflow-hidden">
                {/* Glow Backdrop */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[42rem] h-[26rem] bg-[#d4ff00]/10 rounded-full blur-[200px] pointer-events-none" />

                <div className="max-w-3xl w-full mx-auto relative z-10 text-center space-y-8">
                    {/* Status Pill */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d4ff00]/10 border border-[#d4ff00]/30 text-xs font-mono uppercase tracking-widest text-[#d4ff00]">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Transmission Received & Logged</span>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white tracking-tight">
                            YOUR PILOT IS <span className="text-[#d4ff00]">IN MOTION.</span>
                        </h1>
                        <p className="text-neutral-300 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
                            Our Senior Art Directors are reviewing your sample assets. Your complimentary test edits will be returned within 24 business hours.
                        </p>
                    </div>

                    {/* Calendly Discovery Call Highlight Card */}
                    <div className="p-8 sm:p-10 rounded-3xl bg-[#12141c]/90 border border-white/15 shadow-2xl text-left space-y-6 backdrop-blur-xl">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                            <div className="space-y-1">
                                <span className="font-mono text-xs uppercase tracking-wider text-[#d4ff00] font-bold">
                                    [ ACCELERATED ONBOARDING ]
                                </span>
                                <h2 className="text-2xl font-display font-bold text-white">
                                    Book a 15-Minute Discovery Call
                                </h2>
                                <p className="text-xs text-neutral-400">
                                    Discuss volume pricing, custom turnaround SLAs, or review test asset instructions directly with our technical team.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => window.dispatchEvent(new CustomEvent('ce:open-discovery-call'))}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#d4ff00] text-black font-display font-bold text-sm hover:bg-[#bfe600] transition-all shadow-lg shrink-0 cursor-pointer"
                            >
                                <Calendar className="w-4 h-4" />
                                <span>Select Live Calendar Slot</span>
                            </button>
                        </div>

                        {/* Production Workflow Milestones */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1.5">
                                <div className="flex items-center gap-2 text-xs font-mono text-[#d4ff00]">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>T + 2 HOURS</span>
                                </div>
                                <p className="text-xs font-bold text-white">Asset Inspection</p>
                                <p className="text-[11px] text-neutral-400">Resolution, color space, and path complexity assessment.</p>
                            </div>

                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1.5">
                                <div className="flex items-center gap-2 text-xs font-mono text-[#d4ff00]">
                                    <FileCheck className="w-3.5 h-3.5" />
                                    <span>T + 12 HOURS</span>
                                </div>
                                <p className="text-xs font-bold text-white">Master Edits Delivery</p>
                                <p className="text-[11px] text-neutral-400">Layered PSD & web-ready previews sent via secure link.</p>
                            </div>

                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1.5">
                                <div className="flex items-center gap-2 text-xs font-mono text-[#d4ff00]">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    <span>T + 24 HOURS</span>
                                </div>
                                <p className="text-xs font-bold text-white">Account Activation</p>
                                <p className="text-[11px] text-neutral-400">Dedicated SFTP/cloud credentials & volume SLA contract.</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex items-center justify-center gap-4 text-xs font-mono">
                        <Link href="/" className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors">
                            <span>Return to Homepage</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <span className="text-neutral-600">·</span>
                        <Link href="/services" className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors">
                            <span>Explore Service Pillars</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
