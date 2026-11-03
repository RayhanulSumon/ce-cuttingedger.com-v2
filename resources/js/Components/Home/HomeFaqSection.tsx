import React, { useState } from 'react';
import { Plus, Minus, ArrowUpRight, HelpCircle, Sparkles, MessageSquare } from 'lucide-react';
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
                'We specialize in high-volume e-commerce catalog retouching, invisible ghost mannequin joint composites, fine jewelry retouching, Delta-E color swatch standardization, vector clipping paths, and hyper-realistic 3D CGI spatial product twins.',
        },
        {
            id: 'turnaround',
            question: 'What is the turnaround time?',
            answer:
                'Standard batch production turnaround is 12 to 24 hours. For enterprise partners with dedicated studio pods, we offer expedited 4-hour rush turnarounds and real-time overnight delivery aligned with your morning publishing schedules.',
        },
        {
            id: 'engagement',
            question: 'How does a typical engagement look like?',
            answer:
                'We begin with a zero-risk 3-asset pilot to calibrate your lighting, color profiles, and output specs. Once approved, you gain access to our secure client portal, dedicated Slack/Teams pod, and automated SFTP or cloud intake pipeline.',
        },
        {
            id: 'pricing',
            question: 'How much does a project cost?',
            answer:
                'Pricing is transparent and based on volume tiers and complexity. Standard catalog retouching starts around $0.80–$1.50 per asset, with bespoke volume pricing tiers and dedicated art director retainers available for global agencies.',
        },
        {
            id: 'retainer',
            question: 'Do you offer retainer services?',
            answer:
                'Yes. Enterprise brands and creative agencies frequently secure dedicated production pods with guaranteed monthly quotas, assigned senior colorists, and zero-latency overnight workflows.',
        },
        {
            id: 'cancellation',
            question: "Can we cancel if it doesn't help before starting out?",
            answer:
                'Absolutely. We have zero lock-in contracts for standard production pipelines. You test us on our free 3-image pilot first, and you only scale when you are 100% satisfied with our surgical fidelity.',
        },
    ];

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section
            id="faq-section"
            className="relative py-16 sm:py-20 lg:py-24 bg-[#07080b] border-t border-white/10 overflow-hidden select-none"
        >
            {/* Ambient Lighting Glow */}
            <div className="absolute top-1/2 right-10 w-[45rem] h-[30rem] bg-accent/[0.04] rounded-full blur-[200px] pointer-events-none" />
            <div className="absolute bottom-10 left-10 w-[35rem] h-[25rem] bg-accent/[0.03] rounded-full blur-[180px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 xs:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
                    {/* Left Column: Heading & Support Card */}
                    <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/25 text-xs font-mono uppercase tracking-[0.2em] text-accent font-semibold">
                            <HelpCircle className="w-3.5 h-3.5" />
                            <span>COMMON PROTOCOLS</span>
                        </div>

                        {/* Title matching screenshot: "Frequent questions." */}
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight leading-[1.1]">
                            Frequent{' '}
                            <span className="font-serif italic font-normal text-accent">
                                questions.
                            </span>
                        </h2>

                        <p className="text-sm sm:text-base text-neutral-400 font-sans leading-relaxed">
                            Everything you need to know about partnering with CuttingEdger, our SLA velocity, data security, and bespoke pilot testing.
                        </p>

                        {/* "How can we help?" Card from screenshot */}
                        <div className="p-6 sm:p-7 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-4 shadow-xl">
                            <div className="flex items-center gap-2.5 text-accent font-mono text-xs font-bold uppercase tracking-wider">
                                <MessageSquare className="w-4 h-4" />
                                <span>Direct Studio Consultation</span>
                            </div>

                            <h3 className="font-display text-lg sm:text-xl font-bold text-white">
                                How can we help?
                            </h3>

                            <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed">
                                Let's scale up your visual assets together. Our team is ready to deliver pixel-perfect results tailored to your exact catalog specs.
                            </p>

                            <div className="pt-2">
                                <Link
                                    href="/contact"
                                    className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-accent text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-white transition-all duration-300 shadow-md cursor-pointer"
                                >
                                    <span>Get a custom proposal</span>
                                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Accordion List */}
                    <div className="lg:col-span-7 divide-y divide-white/10 border-y border-white/10">
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
                                        <span className={`font-display font-bold text-base sm:text-lg lg:text-xl transition-colors pr-6 ${
                                            isOpen ? 'text-accent' : 'text-neutral-100 group-hover:text-white'
                                        }`}>
                                            {faq.question}
                                        </span>

                                        <div
                                            className={`w-8 h-8 shrink-0 rounded-full border border-white/15 flex items-center justify-center transition-all duration-300 ${
                                                isOpen
                                                    ? 'bg-accent text-black border-accent rotate-180'
                                                    : 'text-neutral-400 group-hover:border-accent group-hover:text-accent'
                                            }`}
                                        >
                                            {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
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
                </div>
            </div>
        </section>
    );
}

