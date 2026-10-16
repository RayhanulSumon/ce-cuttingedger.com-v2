import React from 'react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { PageHero } from '@/Components/Common/PageHero';

export default function Terms() {
    return (
        <>
            <SeoHead
                title="Terms of Service"
                description="Terms and conditions governing access and commissioning engagements with CuttingEdger."
            />

            <PageHero
                eyebrow="LEGAL PROTOCOL"
                title="TERMS OF"
                highlight="SERVICE."
                description="General provisions governing studio deliverables, intellectual property rights, and client engagements."
            />

            <section className="py-20 bg-[#0a0b0e]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-invert space-y-8 text-neutral-300 leading-relaxed">
                    <div>
                        <h2 className="text-2xl font-display font-bold text-white mb-3">1. Intellectual Property & Ownership</h2>
                        <p>Upon receipt of final milestone payment, full ownership of all custom design artifacts, source code, and brand marks created under an executed Master Services Agreement transfers unconditionally to the client.</p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-display font-bold text-white mb-3">2. Portfolio Showcase Rights</h2>
                        <p>CuttingEdger reserves the right to exhibit completed creative work, case studies, and performance benchmarks in our archive and industry awards, unless explicitly protected by an active non-disclosure agreement.</p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-display font-bold text-white mb-3">3. Warranty & Hypercare</h2>
                        <p>All production web flagships include a 30-day hypercare warranty against reproducible functional bugs upon DNS cutover.</p>
                    </div>
                </div>
            </section>
        </>
    );
}
