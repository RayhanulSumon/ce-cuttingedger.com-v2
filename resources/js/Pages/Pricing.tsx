import React from 'react';
import { Link } from '@inertiajs/react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { PageHero } from '@/Components/Common/PageHero';
import { PricingPlan, Faq } from '@/types/models';
import { Accordion } from '@/Components/ui/Accordion';
import { Check, Sparkles, ArrowUpRight } from 'lucide-react';

interface PricingProps {
    plans: PricingPlan[];
    faqs: Faq[];
}

export default function Pricing({ plans = [], faqs = [] }: PricingProps) {
    return (
        <>
            <SeoHead
                title="Engagement Models & Investment Pricing"
                description="Transparent, value-aligned pricing for design sprints, full flagship builds, and ongoing studio retainers."
            />

            <PageHero
                eyebrow="TRANSPARENT VALUE"
                title="PREDICTABLE INVESTMENT."
                highlight="UNMATCHED RETURN."
                description="No vague estimates or hidden line items. We engage through focused sprints and milestone-anchored flagships designed for maximum ROI."
            />

            {/* Plans Grid */}
            <section className="py-24 bg-[#0a0b0e]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                        {plans.map((plan) => (
                            <div
                                key={plan.id || plan.slug}
                                className={`relative rounded-3xl p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 ${
                                    plan.is_popular
                                        ? 'bg-[#141622] border-2 border-[#d4ff00] shadow-[0_0_35px_rgba(212,255,0,0.15)] md:-translate-y-4'
                                        : 'bg-[#12141c] border border-white/10 hover:border-white/20'
                                }`}
                            >
                                {plan.is_popular && (
                                    <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-[#d4ff00] text-black font-display font-bold text-[11px] uppercase tracking-widest px-4 py-1 rounded-full flex items-center gap-1 shadow-md">
                                        <Sparkles className="w-3 h-3" />
                                        <span>Most Popular Engagement</span>
                                    </div>
                                )}

                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-display font-extrabold text-2xl text-white">
                                            {plan.name}
                                        </h3>
                                    </div>

                                    <p className="text-xs text-neutral-400 font-mono mb-6">
                                        {plan.headline}
                                    </p>

                                    <div className="pb-8 mb-8 border-b border-white/10 flex items-baseline gap-2">
                                        <span className="text-4xl sm:text-5xl font-display font-black text-white">
                                            {plan.price}
                                        </span>
                                        <span className="text-xs font-mono text-neutral-400">
                                            {plan.billing_cycle}
                                        </span>
                                    </div>

                                    {/* Features */}
                                    <ul className="space-y-3.5 mb-8">
                                        {plan.features?.map((feat, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm text-neutral-300">
                                                <div className="w-4 h-4 rounded-full bg-[#d4ff00]/20 flex items-center justify-center shrink-0 mt-0.5">
                                                    <Check className="w-3 h-3 text-[#d4ff00]" />
                                                </div>
                                                <span>{feat}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <Link
                                    href="/contact"
                                    className={`w-full py-4 px-6 rounded-2xl font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                                        plan.is_popular
                                            ? 'bg-[#d4ff00] text-black hover:bg-[#c2eb00] shadow-[0_0_20px_rgba(212,255,0,0.3)]'
                                            : 'bg-white/10 text-white hover:bg-white/20'
                                    }`}
                                >
                                    <span>{plan.cta_text}</span>
                                    <ArrowUpRight className="w-4 h-4" />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing FAQ Section */}
            {faqs.length > 0 && (
                <section className="py-24 bg-[#0c0d12] border-t border-white/10">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16 space-y-3">
                            <span className="font-mono text-xs uppercase tracking-widest text-[#d4ff00]">
                                [ FINANCIAL & SCOPE QUESTIONS ]
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
                                Pricing Clarity.
                            </h2>
                        </div>

                        <Accordion
                            items={faqs.map((f) => ({
                                id: f.id,
                                question: f.question,
                                answer: f.answer,
                            }))}
                        />
                    </div>
                </section>
            )}
        </>
    );
}
