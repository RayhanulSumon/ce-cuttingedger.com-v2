import React, { useState } from 'react';
import { Plus, Minus, ArrowUpRight } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface FaqItem {
    id: string;
    question: string;
    answer: string;
}

export function HomeFaqSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs: FaqItem[] = [
        {
            id: 'services',
            question: 'What kind of services do you take on?',
            answer:
                'We specialize in AI-powered visual production, photorealistic 3D spatial CGI & motion, high-volume e-commerce catalog retouching (invisible ghost mannequin, fine jewelry, Delta-E color standardization, hand-drawn clipping paths), and corporate multi-channel campaign design.',
        },
        {
            id: 'turnaround',
            question: 'What is the turnaround time?',
            answer:
                'Standard batch production and AI/CGI turnarounds are 24 to 48 hours, with 12-hour overnight SLAs for daily e-commerce catalogs. Enterprise retainer partners receive dedicated 24/6 multi-shift studio pods.',
        },
        {
            id: 'engagement',
            question: 'How does a typical engagement look like?',
            answer:
                'We begin with a zero-risk Free Pilot Project to calibrate your brand lighting, color profiles, and CAD/retouching specs under a strict mutual NDA. Once approved, your team connects directly to our ISO 27001 certified pipeline via SFTP, S3, or API.',
        },
        {
            id: 'pricing',
            question: 'How much does a project cost?',
            answer:
                'Pricing is transparent and tailored to volume tiers and asset complexity—delivering up to 60% cost reduction compared to traditional physical studio shoots. We offer both per-asset volume quotes and dedicated monthly studio retainers.',
        },
        {
            id: 'retainer',
            question: 'Do you offer retainer services?',
            answer:
                'Yes. Global luxury brands, retailers, and creative agencies frequently secure dedicated production pods with guaranteed daily throughput, assigned creative directors, and priority turnaround SLAs.',
        },
        {
            id: 'cancellation',
            question: "Can we cancel if it doesn't help before starting out?",
            answer:
                'Absolutely. You validate our execution quality first with a complimentary pilot project before committing to any production contract, and standard volume plans carry zero lock-in obligations.',
        },
    ];

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section
            id="faq-section"
            className="relative py-16 sm:py-22 lg:py-26 bg-[#07080b] border-t border-white/10 overflow-hidden select-none"
        >
            {/* Ambient Lighting Glow */}
            <div className="absolute top-1/2 right-10 w-[45rem] h-[30rem] bg-accent/[0.04] rounded-full blur-[200px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 xs:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
                    {/* Left Column: "Frequent questions." matching reference image */}
                    <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-28">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight leading-[1.08]">
                            Frequent <br />
                            <span className="font-serif italic font-normal text-neutral-300">
                                questions.
                            </span>
                        </h2>

                        <p className="text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed max-w-xs">
                            Key answers on ISO 27001 security, 24–48h SLA velocity, AI/CGI workflows, and enterprise pilot onboarding.
                        </p>
                    </div>

                    {/* Right Column: Clean Scannable Accordion + Bottom "How can we help?" Bar */}
                    <div className="lg:col-span-8">
                        <div className="divide-y divide-white/10 border-y border-white/10">
                            {faqs.map((faq, index) => {
                                const isOpen = openIndex === index;

                                return (
                                    <div key={faq.id} className="group transition-colors">
                                        <button
                                            type="button"
                                            aria-expanded={isOpen}
                                            onClick={() => toggleFaq(index)}
                                            className="w-full py-5 sm:py-6 flex items-center justify-between text-left cursor-pointer focus:outline-none"
                                        >
                                            <span
                                                className={`font-display font-semibold text-sm sm:text-base lg:text-lg transition-colors pr-6 ${
                                                    isOpen
                                                        ? 'text-accent'
                                                        : 'text-neutral-200 group-hover:text-white'
                                                }`}
                                            >
                                                {faq.question}
                                            </span>

                                            <div
                                                className={`w-7 h-7 shrink-0 rounded-full border border-white/15 flex items-center justify-center transition-all duration-300 ${
                                                    isOpen
                                                        ? 'bg-accent text-black border-accent rotate-180'
                                                        : 'text-neutral-400 group-hover:border-accent group-hover:text-accent'
                                                }`}
                                            >
                                                {isOpen ? (
                                                    <Minus className="w-3.5 h-3.5" />
                                                ) : (
                                                    <Plus className="w-3.5 h-3.5" />
                                                )}
                                            </div>
                                        </button>

                                        <div
                                            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                                isOpen ? 'max-h-80 opacity-100 pb-6' : 'max-h-0 opacity-0'
                                            }`}
                                        >
                                            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-2xl font-sans">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Bottom Right Bar: "How can we help?" + "GET A CUSTOM PROPOSAL" matching reference image */}
                        <div className="mt-8 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h3 className="font-display text-sm sm:text-base font-bold text-white">
                                    How can we help?
                                </h3>
                                <p className="text-xs text-neutral-400 font-sans mt-0.5">
                                    Need a bespoke NDA workflow or high-volume enterprise SLA?
                                </p>
                            </div>

                            <Link
                                href="/contact"
                                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.04] hover:bg-accent text-neutral-200 hover:text-black border border-white/15 hover:border-accent font-mono text-[11px] font-bold uppercase tracking-wider transition-all duration-300 self-start sm:self-auto cursor-pointer"
                            >
                                <span>Get A Custom Proposal</span>
                                <ArrowUpRight className="w-3.5 h-3.5 text-accent group-hover:text-black transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
