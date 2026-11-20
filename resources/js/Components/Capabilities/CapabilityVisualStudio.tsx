import React, { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import { OrderCta, PAD_X } from '@/Components/Landing/shared';
import { Capability } from '@/types/models';
import {
    CapabilityCard,
    CapabilityPageHeader,
    pathForCapability,
    quoteUrlForCapability,
} from './CapabilityShared';
import { getCapabilityVisualProfile } from './capabilityVisualConfig';
import { StudioBeforeAfter } from './StudioBeforeAfter';

interface CapabilityVisualStudioProps {
    capability: Capability;
    parent: Capability | null;
    related: Capability[];
}

/**
 * Unified minimal visual studio showcase for every capability page.
 * Matches the compact header, pill filter tabs, and clean visual rhythm of Digital Twins & Virtual Try-On.
 */
export function CapabilityVisualStudio({ capability, parent, related = [] }: CapabilityVisualStudioProps) {
    const profile = getCapabilityVisualProfile(capability, parent);
    const samples = profile.samples;
    const children = capability.children ?? [];
    const quoteHref = quoteUrlForCapability(capability, parent);

    const [activeSampleIndex, setActiveSampleIndex] = useState(0);

    useEffect(() => {
        setActiveSampleIndex(0);
    }, [capability.slug]);

    const activeSample = samples[activeSampleIndex] ?? samples[0];

    const stepSample = (delta: -1 | 1) => {
        setActiveSampleIndex((prev) => (prev + delta + samples.length) % samples.length);
    };

    return (
        <div className="min-h-screen bg-white text-ink">
            {/* 1. Compact Shared Header */}
            <CapabilityPageHeader
                backHref={parent ? `/capabilities/${parent.slug}` : '/capabilities'}
                backLabel={parent ? `Back to ${parent.title}` : 'All capabilities'}
                title={capability.title}
                subtitle={capability.subtitle}
                ctaHref={quoteHref}
                ctaLabel="Request a quote"
            />

            {/* 2. Under-Header Technique Tabs + Featured Before / After Stage */}
            <section className={`py-7 sm:py-9 ${PAD_X}`}>
                <div className="mx-auto max-w-[1440px]">
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                        <div
                            role="tablist"
                            aria-label={`${capability.title} techniques`}
                            className="flex items-center gap-2 overflow-x-auto py-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                        >
                            {samples.map((sample, idx) => {
                                const isSelected = idx === activeSampleIndex;
                                return (
                                    <button
                                        key={sample.id}
                                        type="button"
                                        role="tab"
                                        aria-selected={isSelected}
                                        onClick={() => setActiveSampleIndex(idx)}
                                        className={`cursor-pointer whitespace-nowrap rounded-full border px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
                                            isSelected
                                                ? 'border-ink bg-ink text-white shadow-xs'
                                                : 'border-ink/15 bg-white text-subtle hover:border-primary/60 hover:text-primary'
                                        }`}
                                    >
                                        {sample.tabLabel}
                                    </button>
                                );
                            })}
                        </div>

                        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-subtle">
                            Drag to compare
                        </span>
                    </div>

                    {activeSample && (
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.45fr_0.55fr] lg:items-center lg:gap-10">
                            <StudioBeforeAfter
                                beforeImage={activeSample.beforeImage}
                                afterImage={activeSample.afterImage}
                                alt={activeSample.title}
                                beforeLabel={activeSample.beforeLabel}
                                afterLabel={activeSample.afterLabel}
                                aspectClass="aspect-[16/10]"
                                sweepKey={activeSample.id}
                            />

                            {/* Spacious, borderless editorial detail column */}
                            <div className="flex flex-col justify-center">
                                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary-ink">
                                    {String(activeSampleIndex + 1).padStart(2, '0')} / {String(samples.length).padStart(2, '0')} · {activeSample.tag}
                                </p>

                                <h2 className="mt-2 text-xl font-extrabold tracking-[-0.025em] text-ink sm:text-2xl">
                                    {activeSample.title}
                                </h2>

                                <p className="mt-2 text-sm leading-relaxed text-muted">
                                    {activeSample.subtitle}
                                </p>

                                <ul className="mt-5 space-y-2">
                                    {activeSample.checkpoints.map((point) => (
                                        <li key={point} className="flex items-center gap-2.5 text-[13px] font-medium text-ink-2">
                                            <Check size={14} strokeWidth={2.5} className="shrink-0 text-primary" />
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>

                                <dl className="mt-6 space-y-2 border-t border-ink/10 pt-4 text-xs">
                                    <div className="flex items-baseline justify-between gap-4">
                                        <dt className="font-semibold uppercase tracking-[0.14em] text-subtle">Turnaround</dt>
                                        <dd className="font-semibold text-ink">{profile.turnaround}</dd>
                                    </div>
                                    <div className="flex items-baseline justify-between gap-4">
                                        <dt className="font-semibold uppercase tracking-[0.14em] text-subtle">Formats</dt>
                                        <dd className="font-semibold text-ink">{profile.formats}</dd>
                                    </div>
                                </dl>

                                {samples.length > 1 && (
                                    <div className="mt-6 flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => stepSample(-1)}
                                            aria-label="Previous sample"
                                            className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-ink/15 bg-white text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
                                        >
                                            <ArrowLeft size={15} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => stepSample(1)}
                                            aria-label="Next sample"
                                            className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-ink/15 bg-white text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
                                        >
                                            <ArrowRight size={15} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* 3. Main Capability Specialities Grid OR Sub-Capability 3-Card Before/After Showcase */}
            {children.length > 0 ? (
                <section className={`border-t border-ink/10 py-10 ${PAD_X}`}>
                    <div className="mx-auto max-w-[1440px]">
                        <div className="mb-5 flex items-baseline justify-between gap-4">
                            <h2 className="text-base font-extrabold uppercase tracking-[0.08em] text-ink sm:text-lg">
                                {capability.tag ?? capability.title} Specialities
                            </h2>
                            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-subtle">
                                {children.length} {children.length === 1 ? 'capability' : 'capabilities'}
                            </span>
                        </div>

                        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                            {children.map((child) => (
                                <li key={child.id}>
                                    <CapabilityCard
                                        capability={child}
                                        parent={capability}
                                        href={pathForCapability(child, capability)}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            ) : (
                samples.length > 0 && (
                    <section className={`border-t border-ink/10 py-10 ${PAD_X}`}>
                        <div className="mx-auto max-w-[1440px]">
                            <div className="mb-5 flex items-baseline justify-between gap-4">
                                <h2 className="text-base font-extrabold tracking-[-0.02em] text-ink sm:text-lg">
                                    Before &amp; After Samples
                                </h2>
                                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-subtle">
                                    Interactive sliders
                                </span>
                            </div>

                            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                                {samples.map((sample, idx) => {
                                    const isActive = idx === activeSampleIndex;
                                    return (
                                        <div
                                            key={sample.id}
                                            className={`overflow-hidden rounded-2xl border bg-white transition-colors duration-200 ${
                                                isActive ? 'border-primary/60' : 'border-ink/10 hover:border-ink/25'
                                            }`}
                                        >
                                            <div className="p-2.5 pb-0">
                                                <StudioBeforeAfter
                                                    beforeImage={sample.beforeImage}
                                                    afterImage={sample.afterImage}
                                                    alt={sample.title}
                                                    beforeLabel={sample.beforeLabel}
                                                    afterLabel={sample.afterLabel}
                                                    aspectClass="aspect-[4/3]"
                                                    compact
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setActiveSampleIndex(idx)}
                                                className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-[#f8fafc]"
                                            >
                                                <span className="truncate text-sm font-bold text-ink">{sample.title}</span>
                                                <span className="shrink-0 text-[11px] font-semibold text-subtle">{sample.tag}</span>
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                )
            )}

            {/* 4. Sibling Capabilities Strip */}
            {related.length > 0 && (
                <section className={`border-t border-ink/10 py-10 ${PAD_X}`}>
                    <div className="mx-auto max-w-[1440px]">
                        <div className="mb-5 flex items-baseline justify-between gap-4">
                            <h2 className="text-base font-extrabold tracking-[-0.02em] text-ink sm:text-lg">
                                {parent ? `More in ${parent.title}` : 'Other Capabilities'}
                            </h2>
                            <Link
                                href={parent ? `/capabilities/${parent.slug}` : '/capabilities'}
                                prefetch
                                className="inline-flex items-center gap-1 text-xs font-bold text-primary-ink hover:underline"
                            >
                                View all
                                <ArrowUpRight size={13} />
                            </Link>
                        </div>

                        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            {related.map((item) => (
                                <li key={item.id}>
                                    <CapabilityCard
                                        capability={item}
                                        parent={parent}
                                        href={pathForCapability(item, parent)}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            )}

            {/* 5. Compact Studio CTA Bar */}
            <section className={`pb-12 pt-2 ${PAD_X}`}>
                <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 rounded-2xl border border-ink/10 bg-[#f4f7fb] px-6 py-6 sm:px-8">
                    <div>
                        <h2 className="text-lg font-extrabold tracking-[-0.02em] text-ink sm:text-xl">
                            Try 3 sample files free
                        </h2>
                        <p className="mt-1 text-sm text-subtle">
                            Send three raw files and review our studio quality before committing to a batch.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <OrderCta href={quoteHref}>Request a quote</OrderCta>
                        <Link
                            href="/book-a-demo"
                            prefetch
                            className="inline-flex h-11 items-center rounded-full border border-ink/20 bg-white px-6 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-white"
                        >
                            Book a Demo
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
