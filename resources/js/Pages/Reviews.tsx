import React from 'react';
import { Link } from '@inertiajs/react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { PageHero } from '@/Components/Common/PageHero';
import { Star, ShieldCheck, CheckCircle2, ArrowRight, Quote } from 'lucide-react';
import { Testimonial, Client } from '@/types/models';

interface ReviewsProps {
    testimonials?: Testimonial[];
    clients?: Client[];
}

export default function Reviews({ testimonials = [], clients = [] }: ReviewsProps) {
    return (
        <>
            <SeoHead
                title="Verified Client Reviews & Performance Ratings"
                description="Explore verified client testimonials and performance ratings from leading e-commerce brands, fashion retailers, and creative agencies partnering with Cutting Edger."
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'Reviews & Proof', url: '/reviews' },
                ]}
                reviewsSchema={{
                    ratingValue: 4.9,
                    reviewCount: 486,
                    bestRating: 5,
                }}
            />

            <PageHero
                eyebrow="VERIFIED CLIENT SATISFACTION"
                title="REPUTATION OF"
                highlight="UNCOMPROMISED CRAFT."
                description="Read authentic performance appraisals from production directors, brand founders, and agency art leads."
            />

            <section className="py-20 bg-[#f2f2f1]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
                    {/* Score Summary Box */}
                    <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#16191f]/10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 rounded-2xl bg-[#f5761a]/10 border border-[#f5761a]/30 flex flex-col items-center justify-center text-center shrink-0">
                                <span className="font-display text-4xl font-black text-[#c4540a]">4.9</span>
                                <div className="flex text-[#c4540a] mt-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-3 h-3 fill-current" />
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-xl sm:text-2xl font-display font-bold text-[#16191f]">
                                    Exceptional B2B Production Satisfaction
                                </h2>
                                <p className="text-xs text-[#4a505b]">
                                    Based on 480+ verified enterprise SKU delivery sign-offs across North America, Europe, and Asia-Pacific.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                            <Link
                                href="/#free-trial"
                                className="px-6 py-3.5 rounded-xl bg-[#f5761a] text-white font-display font-bold text-xs uppercase tracking-wider hover:bg-[#e0650c] transition-all shadow-lg flex items-center gap-2"
                            >
                                <span>Request 3-Asset Pilot</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Testimonials Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {testimonials.map((t) => (
                            <div
                                key={t.id}
                                className="p-8 rounded-3xl bg-white border border-[#16191f]/10 hover:border-[#f5761a]/40 transition-all space-y-5 flex flex-col justify-between"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex text-[#c4540a]">
                                            {[...Array(t.rating || 5)].map((_, i) => (
                                                <Star key={i} className="w-3.5 h-3.5 fill-current" />
                                            ))}
                                        </div>
                                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                                            <CheckCircle2 className="w-3 h-3" />
                                            <span>Verified Partner</span>
                                        </span>
                                    </div>
                                    <p className="text-[#2f333a] text-sm leading-relaxed italic">
                                        &quot;{t.quote}&quot;
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-[#16191f]/10 flex items-center gap-3">
                                    {t.avatar ? (
                                        <img
                                            src={t.avatar}
                                            alt={t.author}
                                            className="w-10 h-10 rounded-full object-cover border border-[#16191f]/15"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-[#16191f]/[0.05] border border-[#16191f]/10 flex items-center justify-center font-bold text-xs text-[#16191f]">
                                            {t.author.charAt(0)}
                                        </div>
                                    )}
                                    <div className="text-xs">
                                        <p className="font-bold text-[#16191f]">{t.author}</p>
                                        <p className="text-[#4a505b] text-[11px]">{t.role}{t.company ? `, ${t.company}` : ''}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Enterprise Client Logos */}
                    {clients.length > 0 && (
                        <div className="p-8 rounded-3xl bg-white/50 border border-[#16191f]/10 space-y-6 text-center">
                            <span className="font-mono text-xs uppercase tracking-widest text-[#4a505b]">
                                [ TRUSTED BY LEADING GLOBAL BRANDS & STUDIOS ]
                            </span>
                            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-70">
                                {clients.map((c) => (
                                    <img
                                        key={c.id}
                                        src={c.logo_dark || c.logo_light}
                                        alt={c.name}
                                        className="h-7 w-auto object-contain grayscale hover:grayscale-0 transition-all"
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
