import React from 'react';
import { PageHero } from '@/Components/Common/PageHero';
import { SeoHead } from '@/Components/Common/SeoHead';
import { EnterpriseSolutionsSection } from '@/Components/Pricing/EnterpriseSolutionsSection';
import { PricingCardsSection } from '@/Components/Pricing/PricingCardsSection';
import { Accordion } from '@/Components/ui/Accordion';
import { Faq, PricingPlan } from '@/types/models';

interface PricingProps {
    plans?: PricingPlan[];
    faqs: Faq[];
}

export default function Pricing({ plans = [], faqs = [] }: PricingProps) {
    return (
        <>
            <SeoHead
                title="Production Pricing & Volume Tiers"
                description="Simple, scalable post-production pricing for 2D retouching, Digital Twins, Virtual Try-On, 3D CGI, DTP, and video workflows."
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'Pricing', url: '/pricing' },
                ]}
            />

            <PageHero
                compact
                eyebrow="Studio Credit Plans"
                title="Simple credit plans."
                highlight="Flexible production."
                description="Pick a preset credit pack or customize your exact credit volume. Spend credits anytime across 2D retouching, Digital Twins, Virtual Try-On, 3D CGI, DTP, and Video."
            />

            <PricingCardsSection plans={plans} />

            <EnterpriseSolutionsSection />

            {faqs.length > 0 && (
                <section className="border-t border-ink/10 bg-page py-16 sm:py-20">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-12 space-y-3 text-center">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-primary-ink">
                                Pricing FAQ
                            </p>
                            <h2 className="text-3xl font-display font-bold text-ink sm:text-4xl">
                                Pricing Clarity.
                            </h2>
                        </div>

                        <Accordion
                            items={faqs.map((faq) => ({
                                id: faq.id,
                                question: faq.question,
                                answer: faq.answer,
                            }))}
                        />
                    </div>
                </section>
            )}
        </>
    );
}
