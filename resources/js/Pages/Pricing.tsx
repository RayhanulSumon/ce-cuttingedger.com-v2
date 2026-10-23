import React from 'react';
import { Link } from '@inertiajs/react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { PageHero } from '@/Components/Common/PageHero';
import { PricingPlan, Faq } from '@/types/models';
import { Accordion } from '@/Components/ui/Accordion';
import { VolumePricingCalculator } from '@/Components/Common/VolumePricingCalculator';
import { EnterpriseSolutionsSection } from '@/Components/Pricing/EnterpriseSolutionsSection';
import { FreeTrialDropzone } from '@/Components/Home/FreeTrialDropzone';
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
                eyebrow="HIGH-VOLUME TRANSPARENCY"
                title="PREDICTABLE PER-IMAGE PRICING."
                highlight="HIGH-SPEED TURNAROUND."
                description="From $0.35 per image. No hidden setup fees or minimum contract lock-ins. Free unlimited revisions with 24/7 round-the-clock studio capacity."
            />

            {/* 1. Interactive Volume & Combo Price Estimator */}
            <VolumePricingCalculator />

            {/* 2. Enterprise & B2B Volume Solutions Showcase */}
            <EnterpriseSolutionsSection />

            {/* 4. Instant Batch Trial Dropzone */}
            <FreeTrialDropzone />

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
