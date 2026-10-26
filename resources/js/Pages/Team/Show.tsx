import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { PageHero } from '@/Components/Common/PageHero';
import { TeamMember, Blog } from '@/types/models';
import { Phone, Mail, CheckCircle2, ArrowRight } from 'lucide-react';

interface TeamShowProps {
    member: TeamMember & { blogs?: Blog[] };
}

export default function Show({ member }: TeamShowProps) {
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data, setData, post, processing, reset } = useForm({
        name: '',
        email: '',
        message: '',
    });

    const isBusy = processing || isSubmitting;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isBusy) return;

        setIsSubmitting(true);
        post(`/team/${member.slug}/inquiry`, {
            preserveScroll: true,
            onSuccess: () => {
                setSubmitted(true);
                reset();
                setTimeout(() => setSubmitted(false), 5000);
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    return (
        <>
            <SeoHead
                title={`${member.name} — ${member.role}`}
                description={member.bio}
                image={member.avatar}
            />

            <PageHero
                eyebrow={`COLLECTIVE // SINCE ${member.since_year || '2019'}`}
                title={member.name}
                description={member.role}
                backUrl="/team"
                backLabel="Back to Collective"
            />

            {/* TEAM DETAIL PROFILE SECTION */}
            <section className="py-20 lg:py-28 bg-[#090a0d] border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                        {/* LEFT COLUMN: Clean Member Portrait + Contact Channels */}
                        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
                            <div className="rounded-[32px] overflow-hidden border border-white/15 bg-neutral-900 aspect-[3/4] shadow-[0_25px_60px_rgba(0,0,0,0.9)]">
                                <img
                                    src={member.avatar}
                                    alt={member.name}
                                    className="w-full h-full object-cover contrast-110"
                                />
                            </div>

                            {/* Social Links Only */}
                            {member.social_links && (
                                <div className="p-4 rounded-2xl bg-[#11131a] border border-white/10 flex items-center justify-center gap-3">
                                    {member.social_links?.twitter && (
                                        <a
                                            href={member.social_links.twitter}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="Twitter / X"
                                            className="w-10 h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-neutral-300 hover:text-black hover:bg-accent hover:border-accent transition-all"
                                        >
                                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                            </svg>
                                        </a>
                                    )}
                                    {member.social_links?.linkedin && (
                                        <a
                                            href={member.social_links.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="LinkedIn"
                                            className="w-10 h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-neutral-300 hover:text-black hover:bg-accent hover:border-accent transition-all"
                                        >
                                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.3a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
                                            </svg>
                                        </a>
                                    )}
                                    {member.social_links?.github && (
                                        <a
                                            href={member.social_links.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="GitHub"
                                            className="w-10 h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-neutral-300 hover:text-black hover:bg-accent hover:border-accent transition-all"
                                        >
                                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                                            </svg>
                                        </a>
                                    )}
                                    {member.social_links?.dribbble && (
                                        <a
                                            href={member.social_links.dribbble}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="Dribbble"
                                            className="w-10 h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-neutral-300 hover:text-black hover:bg-accent hover:border-accent transition-all"
                                        >
                                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 0 1 1.93 5.314c-.24-.05-2.55-.5-5.04-.15-.14-.32-.29-.65-.45-.98 2.92-1.64 3.49-3.92 3.56-4.184zm-5.07-1.92c1.78 1.41 2.35 3.39 2.46 3.79-2.55-.3-4.89.17-5.11.22-.59-1.29-1.25-2.55-1.97-3.66 1.48-.48 3.07-.63 4.62-.35zm-6.68 1.25c.73 1.1 1.4 2.33 1.98 3.61-2.9.83-5.32 1.01-5.59 1.03a8.513 8.513 0 0 1 3.61-4.64zm-3.39 6.64c.26-.02 3.03-.23 6.13-1.15.34.73.66 1.47.95 2.22-3.83 1.18-5.3 3.65-5.46 3.93a8.536 8.536 0 0 1-1.62-5zm7.39 7.42c.2-.35 1.54-2.58 5.16-3.83 1.05 2.73 1.47 5.09 1.54 5.51a8.51 8.51 0 0 1-6.7 1.68v-3.36zm6.81-3.6c-.08-.43-.5-2.73-1.52-5.39 2.25-.33 4.2.14 4.43.2a8.514 8.514 0 0 1-2.91 5.19z" />
                                            </svg>
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* RIGHT COLUMN: Member Details (Single Concise Paragraph + Clean Inquiry Form) */}
                        <div className="lg:col-span-7 space-y-10">
                            {/* Member Identity & Single Paragraph Biography */}
                            <div className="space-y-4 pb-8 border-b border-white/10">
                                <span className="font-mono text-xs uppercase tracking-widest text-accent block">
                                    {member.role}
                                </span>
                                <h1 className="text-4xl sm:text-6xl font-['Antonio',_'Bebas_Neue',_'Syne',_sans-serif] uppercase font-bold text-white tracking-tight leading-none">
                                    {member.name}
                                </h1>
                                <p className="text-neutral-300 text-base sm:text-lg leading-relaxed pt-2">
                                    {member.bio}
                                </p>
                            </div>

                            {/* Streamlined Direct Inquiry Form */}
                            <div className="p-8 sm:p-10 rounded-3xl bg-[#11131a] border border-white/10 space-y-6">
                                <div>
                                    <h3 className="text-2xl sm:text-3xl font-['Antonio',_'Bebas_Neue',_sans-serif] uppercase font-bold text-white tracking-tight">
                                        Work With {member.name.split(' ')[0]}
                                    </h3>
                                    <p className="text-xs font-mono text-neutral-400 uppercase tracking-wider pt-1">
                                        Direct collaboration, creative direction, or project inquiry.
                                    </p>
                                </div>

                                {submitted ? (
                                    <div className="p-6 rounded-2xl bg-accent/10 border border-accent/30 text-white flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                                        <span className="text-xs font-mono uppercase tracking-wider text-neutral-200">
                                            Message dispatched directly. We will respond within 4 hours.
                                        </span>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                required
                                                placeholder="Your name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:border-accent transition-colors"
                                            />
                                            <input
                                                type="email"
                                                required
                                                placeholder="Your email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:border-accent transition-colors"
                                            />
                                        </div>

                                        <textarea
                                            rows={5}
                                            required
                                            placeholder="Tell us about your project or inquiry..."
                                            value={data.message}
                                            onInput={(e) => {
                                                const target = e.currentTarget;
                                                target.style.height = 'auto';
                                                target.style.height = `${Math.max(120, target.scrollHeight)}px`;
                                            }}
                                            onChange={(e) => setData('message', e.target.value)}
                                            className="w-full min-h-[120px] px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:border-accent transition-colors resize-y"
                                        />

                                        <button
                                            type="submit"
                                            disabled={isBusy}
                                            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-accent text-black font-['Antonio',_'Bebas_Neue',_sans-serif] text-base font-bold uppercase tracking-wider hover:bg-accent-hover hover:shadow-[0_0_25px_rgba(251, 183, 24, 0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <span>{isBusy ? 'Transmitting...' : 'Send Message'}</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
