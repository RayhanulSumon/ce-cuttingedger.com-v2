import React from 'react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { PageHero } from '@/Components/Common/PageHero';
import { ShieldCheck, Lock, FileText, Server, Key, EyeOff } from 'lucide-react';

export default function NdaCompliance() {
    return (
        <>
            <SeoHead
                title="NDA & Security Compliance Protocols"
                description="Cutting Edger operates under ironclad non-disclosure and institutional data protection protocols for enterprise brands and agency partners."
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'NDA Compliance', url: '/nda-compliance' },
                ]}
            />

            <PageHero
                eyebrow="INSTITUTIONAL SECURITY"
                title="NDA & CLIENT"
                highlight="CONFIDENTIALITY."
                description="We guard unreleased product collections, embargoed fashion campaigns, and proprietary CAD models with military-grade rigor."
            />

            <section className="py-20 bg-[#0a0b0e]">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    {/* Security Pillars */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-8 rounded-3xl bg-[#12141c] border border-white/10 space-y-4">
                            <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
                                <Lock className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-display font-bold text-white">Mutual NDA Binding</h3>
                            <p className="text-xs text-neutral-400 leading-relaxed">
                                Every project is executed under bilateral non-disclosure terms. Every employee signs binding intellectual property assignment and confidentiality clauses.
                            </p>
                        </div>

                        <div className="p-8 rounded-3xl bg-[#12141c] border border-white/10 space-y-4">
                            <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
                                <Server className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-display font-bold text-white">Encrypted Transit & Storage</h3>
                            <p className="text-xs text-neutral-400 leading-relaxed">
                                End-to-end TLS 1.3 encryption in transit and AES-256 encryption at rest across dedicated AWS S3 private buckets and dedicated SFTP servers.
                            </p>
                        </div>

                        <div className="p-8 rounded-3xl bg-[#12141c] border border-white/10 space-y-4">
                            <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
                                <EyeOff className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-display font-bold text-white">Air-Gapped Studio Controls</h3>
                            <p className="text-xs text-neutral-400 leading-relaxed">
                                Strict workstation USB lockdown, biometric facility entrance controls, zero external recording devices allowed on production floors.
                            </p>
                        </div>
                    </div>

                    {/* Detailed Specifications */}
                    <div className="p-8 sm:p-12 rounded-3xl bg-[#12141c] border border-white/10 space-y-8">
                        <div className="flex items-center gap-3 pb-6 border-b border-white/10">
                            <ShieldCheck className="w-6 h-6 text-accent" />
                            <h2 className="text-2xl font-display font-bold text-white">Production Security Safeguards</h2>
                        </div>

                        <div className="space-y-6 text-sm text-neutral-300">
                            <div className="space-y-2">
                                <h3 className="font-bold text-white flex items-center gap-2">
                                    <span className="text-accent font-mono">01.</span>
                                    Embargoed Collection Quarantine
                                </h3>
                                <p className="text-xs text-neutral-400 leading-relaxed pl-6">
                                    Pre-release catalog shoots and prototype renders are partitioned into isolated network segments with role-based access control (RBAC). Only named artists assigned to your project can access working directories.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <h3 className="font-bold text-white flex items-center gap-2">
                                    <span className="text-accent font-mono">02.</span>
                                    Automated 30-Day Cryptographic Shredding
                                </h3>
                                <p className="text-xs text-neutral-400 leading-relaxed pl-6">
                                    Following client sign-off and delivery archive window (standard 30 days), master source files are automatically expunged from production arrays using multi-pass DoD-standard digital wipe protocols.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <h3 className="font-bold text-white flex items-center gap-2">
                                    <span className="text-accent font-mono">03.</span>
                                    White-Label Silence Guarantee
                                </h3>
                                <p className="text-xs text-neutral-400 leading-relaxed pl-6">
                                    We never publish, promote, or display agency partner client deliverables in public portfolios, marketing reels, or case studies without formal written release from your legal counsel.
                                </p>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-accent/5 border border-accent/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="space-y-1">
                                <h4 className="font-display font-bold text-white text-sm">Need a Signed Mutual NDA?</h4>
                                <p className="text-xs text-neutral-400">We execute standard DocuSign enterprise NDAs within 2 business hours.</p>
                            </div>
                            <a
                                href="mailto:legal@cuttingedger.com?subject=Enterprise%20NDA%20Request%20-%20Cutting%20Edger"
                                className="px-6 py-3 rounded-xl bg-accent text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-accent-hover transition-colors shrink-0"
                            >
                                Request NDA Execution
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
