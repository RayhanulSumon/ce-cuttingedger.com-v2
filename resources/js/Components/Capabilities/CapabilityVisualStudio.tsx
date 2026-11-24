import React, { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowLeft, ArrowUpRight, Check } from 'lucide-react';
import { OrderCta, PAD_X } from '@/Components/Landing/shared';
import { Capability } from '@/types/models';
import { CapabilityBannerSlider } from './CapabilityBannerSlider';
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
 * Unified visual studio showcase for every capability page.
 *
 * For Root Capabilities (e.g. 2D, 3D):
 * 1. Shows compact header + sub-capabilities grid directly below.
 * 2. Followed by the interactive quality benchmark comparison slider below the grid.
 *
 * For Child Sub-Capabilities (e.g. Background Removal, Ghost Mannequin):
 * 1. Direct 100% full-width Hero Banner Slider directly under the navbar (edge-to-edge).
 * 2. Content appears immediately below: headline, editorial details, checkpoints, and
 *    interactive Before/After comparison side-by-side (matching the classic cuttingedger.com experience).
 */
export function CapabilityVisualStudio({ capability, parent, related = [] }: CapabilityVisualStudioProps) {
    const profile = getCapabilityVisualProfile(capability, parent);
    const samples = profile.samples;
    const children = capability.children ?? [];
    const isRoot = !parent && children.length > 0;
    const quoteHref = quoteUrlForCapability(capability, parent);

    const [activeSampleIndex, setActiveSampleIndex] = useState(0);

    useEffect(() => {
        setActiveSampleIndex(0);
    }, [capability.slug]);

    const activeSample = samples[activeSampleIndex] ?? samples[0];

    return (
        <div className="min-h-screen bg-surface text-ink">
            {/* ========================================================================= */}
            {/* ROOT CAPABILITY VIEW (e.g. /capabilities/2d, /capabilities/3d)            */}
            {/* ========================================================================= */}
            {isRoot ? (
                <>
                    {/* Header for Root Category Hubs */}
                    <CapabilityPageHeader
                        backHref="/capabilities"
                        backLabel="All capabilities"
                        title={capability.title}
                        subtitle={capability.subtitle}
                        ctaHref={quoteHref}
                        ctaLabel="Request a quote"
                    />

                    {/* Primary Hero: All Sub-Capabilities Directory Grid */}
                    <section className={`py-6 sm:py-8 ${PAD_X}`}>
                        <div className="mx-auto max-w-[1440px]">
                            <div className="mb-4 flex items-center justify-between border-b border-ink/10 pb-3">
                                <span className="text-2xs font-bold uppercase tracking-[0.18em] text-subtle">
                                    {children.length} {children.length === 1 ? 'specialized workflow' : 'specialized workflows'}
                                </span>
                            </div>

                            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-5">
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

                    {/* Secondary Section: Interactive Quality Benchmark Comparison */}
                    {activeSample && (
                        <section className={`border-t border-ink/10 bg-surface-2/40 py-10 sm:py-14 ${PAD_X}`}>
                            <div className="mx-auto max-w-[1440px]">
                                <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                                    <div>
                                        <p className="text-2xs font-bold uppercase tracking-[0.18em] text-primary-ink">
                                            Studio Benchmark
                                        </p>
                                        <h2 className="mt-1 text-xl font-extrabold tracking-[-0.025em] text-ink sm:text-2xl">
                                            Interactive Quality Comparison
                                        </h2>
                                        <p className="mt-1 text-xs text-subtle sm:text-sm">
                                            Drag slider to benchmark raw studio capture against retouched master output.
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div
                                            role="tablist"
                                            aria-label={`${capability.title} benchmark techniques`}
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
                                                                : 'border-ink/15 bg-surface text-subtle hover:border-primary/60 hover:text-primary'
                                                        }`}
                                                    >
                                                        {sample.tabLabel}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

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

                                    <div className="flex flex-col justify-center">
                                        <p className="text-2xs font-bold uppercase tracking-[0.18em] text-primary-ink">
                                            {String(activeSampleIndex + 1).padStart(2, '0')} / {String(samples.length).padStart(2, '0')} · {activeSample.tag}
                                        </p>

                                        <h3 className="mt-2 text-xl font-extrabold tracking-[-0.025em] text-ink sm:text-2xl">
                                            {activeSample.title}
                                        </h3>

                                        <p className="mt-2 text-sm leading-relaxed text-muted">
                                            {activeSample.subtitle}
                                        </p>

                                        <ul className="mt-5 space-y-2">
                                            {activeSample.checkpoints.map((point) => (
                                                <li key={point} className="flex items-center gap-2.5 text-sm font-medium text-ink-2">
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
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}
                </>
            ) : (
                /* ========================================================================= */
                /* CHILD SUB-CAPABILITY VIEW (e.g. /capabilities/2d/background-removal)       */
                /* Direct Full-Width Banner Slider at Top -> Instant Content Layout Below    */
                /* ========================================================================= */
                <>
                    {/* 1. Direct Edge-to-Edge Full Width Banner Slider (Under Navbar) */}
                    <div className="pt-16 sm:pt-20">
                        <CapabilityBannerSlider
                            capability={capability}
                            parent={parent}
                            profile={profile}
                            quoteHref={quoteHref}
                        />
                    </div>

                    {/* 2. Content Section (Immediately Below Banner) */}
                    <section className={`py-8 sm:py-12 ${PAD_X}`}>
                        <div className="mx-auto max-w-[1440px]">
                            {/* Breadcrumb line */}
                            <div className="mb-4">
                                <Link
                                    href={parent ? `/capabilities/${parent.slug}` : '/capabilities'}
                                    prefetch
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-subtle transition-colors hover:text-primary"
                                >
                                    <ArrowLeft size={13} />
                                    Back to {parent?.title ?? 'All capabilities'}
                                </Link>
                            </div>

                            {/* Headline matching main site styling */}
                            <div className="mb-8">
                                <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-ink sm:text-3xl lg:text-4xl">
                                    Make Your Product Stand Out With Our {capability.title}
                                </h1>
                                <p className="mt-2 text-sm text-subtle sm:text-base max-w-3xl leading-relaxed">
                                    {capability.subtitle}
                                </p>
                            </div>

                            {/* Two-Column Side-by-Side: Left Details & CTA, Right Interactive Slider */}
                            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-12">
                                {/* Left Column: Editorial details, checkpoints, specs & quote CTA */}
                                <div className="flex flex-col justify-center">
                                    <p className="text-2xs font-bold uppercase tracking-[0.18em] text-primary-ink">
                                        {String(activeSampleIndex + 1).padStart(2, '0')} / {String(samples.length).padStart(2, '0')} · {activeSample.tag}
                                    </p>

                                    <h2 className="mt-2 text-xl font-extrabold tracking-[-0.025em] text-ink sm:text-2xl">
                                        {activeSample.title}
                                    </h2>

                                    <p className="mt-2 text-sm leading-relaxed text-muted">
                                        {activeSample.subtitle}
                                    </p>

                                    <ul className="mt-5 space-y-2.5">
                                        {activeSample.checkpoints.map((point) => (
                                            <li key={point} className="flex items-center gap-2.5 text-sm font-medium text-ink-2">
                                                <Check size={15} strokeWidth={2.5} className="shrink-0 text-primary" />
                                                <span>{point}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <dl className="mt-6 space-y-2.5 border-t border-ink/10 pt-4 text-xs">
                                        <div className="flex items-baseline justify-between gap-4">
                                            <dt className="font-semibold uppercase tracking-[0.14em] text-subtle">Turnaround</dt>
                                            <dd className="font-semibold text-ink">{profile.turnaround}</dd>
                                        </div>
                                        <div className="flex items-baseline justify-between gap-4">
                                            <dt className="font-semibold uppercase tracking-[0.14em] text-subtle">Formats</dt>
                                            <dd className="font-semibold text-ink">{profile.formats}</dd>
                                        </div>
                                    </dl>

                                    <div className="mt-8 flex flex-wrap items-center gap-3">
                                        <OrderCta href={quoteHref}>Request a quote</OrderCta>
                                        <Link
                                            href="/book-a-demo"
                                            prefetch
                                            className="inline-flex h-11 items-center rounded-full border border-ink/20 bg-surface px-6 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-white"
                                        >
                                            Book a Demo
                                        </Link>
                                    </div>
                                </div>

                                {/* Right Column: Technique Selector Tabs + Interactive Before/After Stage */}
                                <div>
                                    <div className="mb-4 flex items-center justify-between gap-3">
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
                                                                : 'border-ink/15 bg-surface text-subtle hover:border-primary/60 hover:text-primary'
                                                        }`}
                                                    >
                                                        {sample.tabLabel}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <span className="text-2xs font-semibold uppercase tracking-[0.16em] text-subtle shrink-0">
                                            Drag to compare
                                        </span>
                                    </div>

                                    <StudioBeforeAfter
                                        beforeImage={activeSample.beforeImage}
                                        afterImage={activeSample.afterImage}
                                        alt={activeSample.title}
                                        beforeLabel={activeSample.beforeLabel}
                                        afterLabel={activeSample.afterLabel}
                                        aspectClass="aspect-[16/11]"
                                        sweepKey={activeSample.id}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Sibling Capabilities Strip */}
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
                </>
            )}

            {/* Common Compact Studio CTA Bar */}
            <section className={`pb-12 pt-6 ${PAD_X}`}>
                <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 rounded-2xl border border-ink/10 bg-surface-2 px-6 py-6 sm:px-8">
                    <div>
                        <h2 className="text-lg font-extrabold tracking-[-0.025em] text-ink sm:text-xl">
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
                            className="inline-flex h-11 items-center rounded-full border border-ink/20 bg-surface px-6 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-white"
                        >
                            Book a Demo
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
