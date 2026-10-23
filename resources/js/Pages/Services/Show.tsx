import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { PageHero } from '@/Components/Common/PageHero';
import { Service, Project } from '@/types/models';
import { ArrowUpRight, Check, ArrowRight, ShieldCheck, HelpCircle, Layers, Calendar, Sparkles } from 'lucide-react';
import { PageProps } from '@/types';

interface ServiceShowProps {
    service: Service & {
        parent?: Service;
        children?: Service[];
        problem_statement?: string;
        solution_statement?: string;
        process_steps?: { step: string; title: string; description: string }[];
        faqs?: { question: string; answer: string }[];
        h1_title?: string;
    };
    otherServices: Service[];
    relatedProjects: Project[];
}

export default function Show({
    service,
    otherServices = [],
    relatedProjects = [],
}: ServiceShowProps) {
    const { settings } = usePage<PageProps>().props;
    const calendlyUrl = (settings as any)?.calendly_url || 'https://calendly.com/cuttingedger/discovery-call';

    // Build dynamic breadcrumbs
    const breadcrumbs = [
        { name: 'Home', url: '/' },
        { name: 'Services', url: '/services' },
    ];

    if (service.parent) {
        breadcrumbs.push({
            name: service.parent.title,
            url: `/services/${service.parent.slug}`,
        });
    }

    breadcrumbs.push({
        name: service.title,
        url: service.parent ? `/services/${service.parent.slug}/${service.slug}` : `/services/${service.slug}`,
    });

    return (
        <>
            <SeoHead
                title={service.meta_title || `${service.title} Services — Cutting Edger`}
                description={service.meta_description || service.subtitle || service.description}
                breadcrumbs={breadcrumbs}
                serviceSchema={{
                    name: service.title,
                    description: service.description,
                    serviceType: service.title,
                }}
                faqSchema={service.faqs || []}
            />

            <PageHero
                eyebrow={`CAPABILITIES // ${service.marquee_label || 'VISUAL PERFORMANCE'}`}
                title={service.h1_title || service.title}
                description={service.subtitle}
                backUrl={service.parent ? `/services/${service.parent.slug}` : '/services'}
                backLabel={service.parent ? `Back to ${service.parent.title}` : 'All Disciplines'}
            />

            {/* Sub-Services Navigation Bar if this is a pillar with children */}
            {service.children && service.children.length > 0 && (
                <div className="bg-[#12141c] border-b border-white/10 py-4 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
                        <span className="text-neutral-400 uppercase font-bold">
                            Specialized Sub-Services:
                        </span>
                        <div className="flex flex-wrap gap-2">
                            {service.children.map((child) => (
                                <Link
                                    key={child.id || child.slug}
                                    href={`/services/${service.slug}/${child.slug}`}
                                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#d4ff00] hover:text-black border border-white/10 text-neutral-300 transition-all"
                                >
                                    {child.title}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* 1. Problem & Solution Section (SEO Requirement) */}
            {(service.problem_statement || service.solution_statement) && (
                <section className="py-16 bg-[#090a0d] border-b border-white/10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Problem */}
                            <div className="p-8 rounded-3xl bg-[#12141c] border border-red-500/20 space-y-3">
                                <span className="font-mono text-xs uppercase tracking-widest text-red-400 font-bold">
                                    [ THE PRODUCTION BOTTLENECK ]
                                </span>
                                <h3 className="text-2xl font-display font-bold text-white">The Challenge</h3>
                                <p className="text-neutral-300 text-sm leading-relaxed">
                                    {service.problem_statement || 'High-volume product shoots and inconsistent manual editing stall seasonal drops and inflate return rates.'}
                                </p>
                            </div>

                            {/* Solution */}
                            <div className="p-8 rounded-3xl bg-[#12141c] border border-[#d4ff00]/30 space-y-3">
                                <span className="font-mono text-xs uppercase tracking-widest text-[#d4ff00] font-bold">
                                    [ THE CUTTING EDGER RESOLUTION ]
                                </span>
                                <h3 className="text-2xl font-display font-bold text-white">Our Method</h3>
                                <p className="text-neutral-300 text-sm leading-relaxed">
                                    {service.solution_statement || 'We deploy dedicated retouching teams, 100% hand-drawn paths, and automated multi-channel format compliance.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* 2. Overview & Deliverables Deep Dive */}
            <section className="py-20 bg-[#0c0d12] border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Main Description & Features */}
                        <div className="lg:col-span-7 space-y-8">
                            <div className="space-y-4">
                                <span className="font-mono text-xs uppercase tracking-widest text-[#d4ff00] font-bold">
                                    [ DISCIPLINE ARCHITECTURE ]
                                </span>
                                <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
                                    Built for brands that refuse to compromise on visual craft.
                                </h2>
                                <p className="text-neutral-300 text-base sm:text-lg leading-relaxed">
                                    {service.description}
                                </p>
                            </div>

                            <div className="pt-4 space-y-4">
                                <h3 className="font-display font-bold text-xl text-white">
                                    Key Service Capabilities & Standards
                                </h3>
                                <div className="space-y-3">
                                    {service.features?.map((feat, i) => (
                                        <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                            <div className="w-5 h-5 rounded-full bg-[#d4ff00]/10 border border-[#d4ff00] text-black flex items-center justify-center shrink-0 mt-0.5">
                                                <Check className="w-3 h-3 text-[#d4ff00]" />
                                            </div>
                                            <span className="text-neutral-200 text-sm font-medium">{feat}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar: Deliverables & Conversion CTAs */}
                        <div className="lg:col-span-5 space-y-6">
                            <div className="p-8 rounded-3xl bg-[#12141c] border border-white/10 space-y-6 shadow-2xl">
                                <h3 className="font-display font-bold text-xl text-white">
                                    Handed Over Deliverables
                                </h3>
                                <ul className="space-y-3">
                                    {service.deliverables?.map((deliv, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-neutral-300 font-mono">
                                            <span className="text-[#d4ff00] font-bold">→</span>
                                            <span>{deliv}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="pt-6 border-t border-white/10 space-y-3">
                                    <Link
                                        href="/#free-trial"
                                        className="w-full bg-[#d4ff00] text-black font-display font-bold text-xs uppercase tracking-wider py-4 px-6 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#bfe600] transition-colors shadow-lg"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        <span>Test 3 Free Sample Assets</span>
                                    </Link>

                                    <a
                                        href={calendlyUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full border border-white/15 text-white hover:bg-white/5 font-mono text-xs uppercase tracking-wider py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <Calendar className="w-4 h-4 text-[#d4ff00]" />
                                        <span>Book a 15-Min Discovery Call</span>
                                    </a>
                                </div>
                            </div>

                            {/* Other Disciplines Quick Navigation */}
                            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                                <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 block font-bold">
                                    Explore Other Service Pillars
                                </span>
                                <div className="space-y-2">
                                    {otherServices.map((s) => (
                                        <Link
                                            key={s.id || s.slug}
                                            href={`/services/${s.slug}`}
                                            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 text-xs text-neutral-300 hover:text-[#d4ff00] transition-colors"
                                        >
                                            <span className="font-mono">{s.title}</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Production Process Steps (SEO Requirement) */}
            {service.process_steps && service.process_steps.length > 0 && (
                <section className="py-20 bg-[#07080a] border-b border-white/10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                        <div className="text-center max-w-xl mx-auto space-y-2">
                            <span className="font-mono text-xs uppercase tracking-widest text-[#d4ff00] font-bold">
                                [ SYSTEMATIC PIPELINE ]
                            </span>
                            <h2 className="text-3xl font-display font-bold text-white">
                                How We Process Your Assets
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {service.process_steps.map((step, idx) => (
                                <div key={idx} className="p-6 rounded-2xl bg-[#12141c] border border-white/10 space-y-3">
                                    <span className="font-display text-3xl font-extrabold text-[#d4ff00]">
                                        {step.step}
                                    </span>
                                    <h3 className="font-display font-bold text-base text-white">{step.title}</h3>
                                    <p className="text-xs text-neutral-400 leading-relaxed">{step.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* 4. Frequently Asked Questions (FAQPage Schema - SEO Requirement) */}
            {service.faqs && service.faqs.length > 0 && (
                <section className="py-20 bg-[#0c0d12]">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                        <div className="text-center space-y-2">
                            <span className="font-mono text-xs uppercase tracking-widest text-[#d4ff00] font-bold">
                                [ FREQUENTLY ASKED QUESTIONS ]
                            </span>
                            <h2 className="text-3xl font-display font-bold text-white">
                                Questions About {service.title}
                            </h2>
                        </div>

                        <div className="space-y-4">
                            {service.faqs.map((faq, idx) => (
                                <div
                                    key={idx}
                                    className="p-6 rounded-2xl bg-[#12141c] border border-white/10 space-y-2"
                                >
                                    <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
                                        <HelpCircle className="w-4 h-4 text-[#d4ff00] shrink-0" />
                                        <span>{faq.question}</span>
                                    </h3>
                                    <p className="text-neutral-300 text-xs leading-relaxed pl-6">
                                        {faq.answer}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}
