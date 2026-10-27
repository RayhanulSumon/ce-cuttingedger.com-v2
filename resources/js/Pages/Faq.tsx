import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { PageHero } from '@/Components/Common/PageHero';
import { Faq } from '@/types/models';
import { Accordion } from '@/Components/ui/Accordion';
import { ArrowUpRight, HelpCircle } from 'lucide-react';

interface FaqPageProps {
    faqs: Faq[];
    categories: string[];
}

export default function FaqPage({ faqs = [], categories = [] }: FaqPageProps) {
    const [selectedCat, setSelectedCat] = useState<string>('All');

    const filteredFaqs = selectedCat === 'All'
        ? faqs
        : faqs.filter((f) => f.category === selectedCat);

    const allCategories = ['All', ...categories];

    return (
        <>
            <SeoHead
                title="Frequently Asked Questions"
                description="Everything you need to know about partnering with CuttingEdger, our process, technical stack, and engagement models."
            />

            <PageHero
                eyebrow="ANSWERS & PROTOCOLS"
                title="COMMON QUESTIONS,"
                highlight="UNFILTERED CLARITY."
                description="Everything you need to know about our design philosophy, development velocity, contracts, and communication protocols."
            />

            {/* Filter Pills */}
            <section
                style={{ top: 'var(--header-height)' }}
                className="py-8 bg-[#0c0d12] border-b border-white/10 sticky top-[var(--header-height,61px)] z-30 backdrop-blur-xl bg-[#0c0d12]/90"
            >
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                        {allCategories.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setSelectedCat(cat)}
                                className={`px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                                    selectedCat === cat
                                        ? 'bg-accent text-black font-bold shadow-[0_0_15px_rgba(251, 183, 24, 0.3)]'
                                        : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/5'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Accordion List */}
            <section className="py-20 bg-[#0a0b0e]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Accordion
                        items={filteredFaqs.map((f) => ({
                            id: f.id,
                            question: f.question,
                            answer: f.answer,
                            category: f.category,
                        }))}
                    />

                    {/* Inquiry Prompt */}
                    <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-[#12141c] border border-white/10 text-center space-y-4">
                        <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/40 text-accent flex items-center justify-center mx-auto">
                            <HelpCircle className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-display font-bold text-white">
                            Still have an unanswered question?
                        </h3>
                        <p className="text-sm text-neutral-400 max-w-md mx-auto">
                            We pride ourselves on transparent communication. Speak directly with a principal partner today.
                        </p>
                        <div className="pt-2">
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 font-display font-bold text-xs uppercase tracking-widest text-black bg-accent hover:bg-accent-hover px-6 py-3.5 rounded-full transition-colors"
                            >
                                <span>Direct Inquiry Channel</span>
                                <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
