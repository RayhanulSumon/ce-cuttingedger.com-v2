import React, { memo } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Reveal, SectionProps } from './shared';

export const BookDemoSection = memo(function BookDemoSection({ active, openDemo }: SectionProps) {
    return (
        <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#141A26] px-6 text-center text-[#F2F4F8]">
            <div
                aria-hidden="true"
                className="animate-pulse-glow pointer-events-none absolute left-1/2 top-1/2 -ml-[60vmin] -mt-[60vmin] h-[120vmin] w-[120vmin] bg-[radial-gradient(closest-side,rgba(43,75,255,0.42),rgba(43,75,255,0.16)_45%,transparent)]"
            />
            <Reveal active={active} className="relative z-10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/60">07 / Book a call or demo</p>
            </Reveal>
            <Reveal active={active} delay={0.08} className="relative z-10">
                <h2 className="mx-auto mt-4 max-w-4xl text-[clamp(34px,7vw,104px)] font-extrabold leading-[0.9] tracking-[-0.04em]">
                    See it on your own images.
                </h2>
            </Reveal>
            <Reveal active={active} delay={0.18} className="relative z-10">
                <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-white/70 sm:text-base">
                    Upload a few files and tell us what you need. We will send back a free retouched sample and book a
                    walkthrough with the team.
                </p>
            </Reveal>
            <Reveal active={active} delay={0.28} className="relative z-10 mt-9 flex flex-wrap items-center justify-center gap-3">
                <button
                    type="button"
                    onClick={openDemo}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-[#141A26] transition-transform duration-300 hover:-translate-y-0.5"
                >
                    Book a Demo <ArrowUpRight size={18} />
                </button>
                <button
                    type="button"
                    onClick={() => window.dispatchEvent(new CustomEvent('ce:open-discovery-call'))}
                    className="rounded-full border border-white/40 px-8 py-4 text-sm font-semibold transition-colors duration-300 hover:bg-white/10"
                >
                    Schedule a call
                </button>
            </Reveal>
        </div>
    );
});

