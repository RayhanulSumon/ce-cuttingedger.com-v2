import React from 'react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { PageHero } from '@/Components/Common/PageHero';
import { Leaf, Users, Award, Globe2, ShieldCheck, Heart } from 'lucide-react';

export default function EsgPolicy() {
    return (
        <>
            <SeoHead
                title="Environmental, Social & Governance (ESG) Charter"
                description="Cutting Edger is committed to sustainable digital visual production, ethical artist compensation, and transparent institutional governance."
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'ESG Policy', url: '/esg-policy' },
                ]}
            />

            <PageHero
                eyebrow="RESPONSIBLE INNOVATION"
                title="ESG & ETHICAL"
                highlight="STANDARDS."
                description="Pioneering sustainable digital twin production and ethical human-AI creative workforce empowerment."
            />

            <section className="py-20 bg-[#f2f2f1]">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    {/* 3 Pillars of ESG */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Environmental */}
                        <div className="p-8 rounded-3xl bg-white border border-[#16191f]/10 space-y-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                                <Leaf className="w-5 h-5" />
                            </div>
                            <span className="font-mono text-xs text-emerald-400 uppercase font-bold tracking-wider">
                                [ ENVIRONMENTAL ]
                            </span>
                            <h3 className="text-xl font-display font-bold text-[#16191f]">Carbon-Reduced Production</h3>
                            <p className="text-xs text-[#4a505b] leading-relaxed">
                                By replacing physical furniture and fashion photoshoots with 3D digital twins and virtual CGI staging, we eliminate hundreds of tons of transatlantic freight shipping and single-use set construction waste annually.
                            </p>
                        </div>

                        {/* Social */}
                        <div className="p-8 rounded-3xl bg-white border border-[#16191f]/10 space-y-4">
                            <div className="w-10 h-10 rounded-xl bg-[#f5761a]/10 border border-[#f5761a]/30 flex items-center justify-center text-[#c4540a]">
                                <Users className="w-5 h-5" />
                            </div>
                            <span className="font-mono text-xs text-[#c4540a] uppercase font-bold tracking-wider">
                                [ SOCIAL EQUITY ]
                            </span>
                            <h3 className="text-xl font-display font-bold text-[#16191f]">Fair Living Wages & Well-being</h3>
                            <p className="text-xs text-[#4a505b] leading-relaxed">
                                We reject predatory piece-rate sweatshop outsourcing. Our 200+ artisans receive certified above-market living wages, full medical benefits, ergonomic multi-display setups, and continuous digital CGI skill training.
                            </p>
                        </div>

                        {/* Governance */}
                        <div className="p-8 rounded-3xl bg-white border border-[#16191f]/10 space-y-4">
                            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                                <Award className="w-5 h-5" />
                            </div>
                            <span className="font-mono text-xs text-cyan-400 uppercase font-bold tracking-wider">
                                [ GOVERNANCE ]
                            </span>
                            <h3 className="text-xl font-display font-bold text-[#16191f]">Institutional Integrity</h3>
                            <p className="text-xs text-[#4a505b] leading-relaxed">
                                Zero-tolerance for corruption, strict adherence to international copyright and intellectual property protections, robust whistleblower safeguards, and audited financial statements.
                            </p>
                        </div>
                    </div>

                    {/* Quantitative Commitments */}
                    <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#16191f]/10 space-y-8">
                        <div className="flex items-center gap-3 pb-6 border-b border-[#16191f]/10">
                            <Globe2 className="w-6 h-6 text-[#c4540a]" />
                            <h2 className="text-2xl font-display font-bold text-[#16191f]">Our 2026 Sustainability Benchmarks</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="p-5 rounded-2xl bg-[#16191f]/[0.03] border border-[#16191f]/10 space-y-2 text-center">
                                <span className="font-display text-3xl font-extrabold text-[#c4540a]">78%</span>
                                <p className="text-xs font-bold text-[#16191f]">Photoshoot Carbon Reduction</p>
                                <p className="text-[11px] text-[#4a505b]">Via CGI virtual product twins vs physical set shipping.</p>
                            </div>

                            <div className="p-5 rounded-2xl bg-[#16191f]/[0.03] border border-[#16191f]/10 space-y-2 text-center">
                                <span className="font-display text-3xl font-extrabold text-[#c4540a]">100%</span>
                                <p className="text-xs font-bold text-[#16191f]">Renewable Cloud Compute</p>
                                <p className="text-[11px] text-[#4a505b]">Render farms hosted in carbon-neutral AWS & GCP regions.</p>
                            </div>

                            <div className="p-5 rounded-2xl bg-[#16191f]/[0.03] border border-[#16191f]/10 space-y-2 text-center">
                                <span className="font-display text-3xl font-extrabold text-[#c4540a]">44%</span>
                                <p className="text-xs font-bold text-[#16191f]">Female Technical Leadership</p>
                                <p className="text-[11px] text-[#4a505b]">Leading QC, Art Direction, and 3D modeling teams.</p>
                            </div>

                            <div className="p-5 rounded-2xl bg-[#16191f]/[0.03] border border-[#16191f]/10 space-y-2 text-center">
                                <span className="font-display text-3xl font-extrabold text-[#c4540a]">Zero</span>
                                <p className="text-xs font-bold text-[#16191f]">Paper Production Policy</p>
                                <p className="text-[11px] text-[#4a505b]">100% digital paperless proofing, invoicing, and asset dispatch.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
