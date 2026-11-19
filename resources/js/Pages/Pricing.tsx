import React from 'react';
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

            <PricingCardsSection plans={plans} />

            <EnterpriseSolutionsSection />

            {faqs.length > 0 && (
                <section className="border-t border-ink/10 bg-page py-12 sm:py-14">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-8 space-y-2 text-center">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-primary-ink">
                                Pricing FAQ
                            </p>
                            <h2 className="text-2xl font-display font-bold text-ink sm:text-3xl">
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
