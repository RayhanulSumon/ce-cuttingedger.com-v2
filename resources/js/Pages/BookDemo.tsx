import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { PageProps } from '@/types';
import {
    AlertCircle,
    ArrowRight,
    Calendar,
    CheckCircle2,
    Clock,
    ExternalLink,
    Loader2,
    Lock,
    Mail,
    Shield,
    Sparkles,
} from 'lucide-react';

declare global {
    interface Window {
        Calendly?: {
            initInlineWidget: (options: {
                url: string;
                parentElement: HTMLElement;
                prefill?: { name?: string; email?: string };
            }) => void;
        };
    }
}

const CALENDLY_SCRIPT_SRC = 'https://assets.calendly.com/assets/external/widget.js';
const DEFAULT_PLACEHOLDER_URL = 'https://calendly.com/cuttingedger/discovery-call';

const WHAT_WE_COVER = [
    {
        title: 'Live workflow & quality walkthrough',
        detail: 'See how our retouching, ghost mannequin, 3D CGI, and Digital Twin pipelines fit your stack.',
    },
    {
        title: 'Custom volume pricing & SLA review',
        detail: 'Align on per-SKU rates, 24-hour standard delivery, or sub-6h rush queues for catalog drops.',
    },
    {
        title: 'Free 3-image production sample',
        detail: 'Optionally scope 3 complex test assets so your team can benchmark quality before committing.',
    },
];

const DEMO_FAQS = [
    {
        question: 'What should we prepare for the discovery call?',
        answer: 'No heavy preparation needed. Having a rough estimate of your monthly SKU volume, target delivery turnarounds, and a sample link to your current catalog imagery helps us provide immediate pricing and workflow recommendations.',
    },
    {
        question: 'Can colleagues or agency partners join the call?',
        answer: 'Yes! When choosing a date and time slot in the calendar, Calendly allows you to add additional guest emails so meeting links and calendar invites are sent to your entire team.',
    },
    {
        question: 'How does the complimentary 3-image test work?',
        answer: 'After aligning on your brand guidelines during the call, you can send 3 of your most complex raw image assets. Our senior retouching artisans will process and return production-ready master files in under 24 hours with zero commitment.',
    },
    {
        question: 'What if none of the available times work for my timezone?',
        answer: 'Our studio operates around the clock across US and European timezones. If you cannot find a suitable slot, email us directly at info@cuttingedger.com with your preferred time, and we will arrange a dedicated session.',
    },
];

function isPlaceholderOrEmpty(url?: string | null): boolean {
    if (!url) return true;
    const trimmed = url.trim().toLowerCase();
    return (
        trimmed === '' ||
        trimmed === DEFAULT_PLACEHOLDER_URL.toLowerCase() ||
        trimmed.includes('cuttingedger/discovery-call') ||
        trimmed.includes('your-org') ||
        trimmed.includes('example.com')
    );
}

function buildCalendlyEmbedUrl(rawUrl: string): string | null {
    try {
        const parsed = new URL(rawUrl);
        if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
            return null;
        }
        parsed.searchParams.set('hide_event_type_details', '1');
        parsed.searchParams.set('hide_gdpr_banner', '1');
        parsed.searchParams.set('primary_color', 'f5761a');
        parsed.searchParams.set('text_color', '16191f');
        parsed.searchParams.set('background_color', 'ffffff');
        return parsed.toString();
    } catch {
        return null;
    }
}

export default function BookDemo() {
    const { settings, auth } = usePage<PageProps>().props;
    const rawCalendlyUrl = settings?.calendly_url || DEFAULT_PLACEHOLDER_URL;
    const contactEmail = settings?.contact_email || 'info@cuttingedger.com';

    const isPlaceholder = isPlaceholderOrEmpty(rawCalendlyUrl);
    const embedUrl = useMemo(
        () => (isPlaceholder ? null : buildCalendlyEmbedUrl(rawCalendlyUrl)),
        [rawCalendlyUrl, isPlaceholder],
    );

    const embedRef = useRef<HTMLDivElement | null>(null);
    const [widgetState, setWidgetState] = useState<'loading' | 'ready' | 'error'>(embedUrl ? 'loading' : 'ready');
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

    useEffect(() => {
        if (isPlaceholder || !embedUrl) {
            setWidgetState('ready');
            return;
        }

        const container = embedRef.current;
        if (!container) {
            return;
        }

        let cancelled = false;
        let fallbackTimer: number | undefined;
        let iframeEl: HTMLIFrameElement | null = null;
        let handleIframeLoad: (() => void) | null = null;

        setWidgetState('loading');
        container.innerHTML = '';

        const mountWidget = () => {
            if (cancelled || !embedRef.current || !window.Calendly?.initInlineWidget) {
                return;
            }

            try {
                embedRef.current.innerHTML = '';
                window.Calendly.initInlineWidget({
                    url: embedUrl,
                    parentElement: embedRef.current,
                    prefill:
                        auth?.user?.name || auth?.user?.email
                            ? {
                                  name: auth.user.name || undefined,
                                  email: auth.user.email || undefined,
                              }
                            : undefined,
                });

                iframeEl = embedRef.current.querySelector('iframe');
                if (iframeEl) {
                    handleIframeLoad = () => {
                        if (!cancelled) {
                            setWidgetState('ready');
                        }
                    };
                    iframeEl.addEventListener('load', handleIframeLoad);
                }

                fallbackTimer = window.setTimeout(() => {
                    if (!cancelled) {
                        setWidgetState('ready');
                    }
                }, 3000);
            } catch {
                if (!cancelled) {
                    setWidgetState('error');
                }
            }
        };

        const handleScriptError = () => {
            if (!cancelled) {
                setWidgetState('error');
            }
        };

        let script = document.querySelector<HTMLScriptElement>(`script[src="${CALENDLY_SCRIPT_SRC}"]`);

        if (window.Calendly?.initInlineWidget) {
            mountWidget();
        } else {
            if (!script) {
                script = document.createElement('script');
                script.src = CALENDLY_SCRIPT_SRC;
                script.async = true;
                document.head.appendChild(script);
            }
            script.addEventListener('load', mountWidget);
            script.addEventListener('error', handleScriptError);
        }

        return () => {
            cancelled = true;
            if (fallbackTimer !== undefined) {
                window.clearTimeout(fallbackTimer);
            }
            if (iframeEl && handleIframeLoad) {
                iframeEl.removeEventListener('load', handleIframeLoad);
            }
            if (script) {
                script.removeEventListener('load', mountWidget);
                script.removeEventListener('error', handleScriptError);
            }
            container.innerHTML = '';
        };
    }, [embedUrl, isPlaceholder, auth?.user?.name, auth?.user?.email]);

    return (
        <>
            <SeoHead
                title="Book a Demo — 30-Min Technical Discovery | Cutting Edger"
                description="Schedule a 30-minute live screen-share with Cutting Edger studio directors to inspect retouching quality, review catalog turnaround SLAs, and configure custom volume pricing."
                canonicalUrl="/book-a-demo"
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'Book a Demo', url: '/book-a-demo' },
                ]}
            />

            <div className="bg-page min-h-screen text-ink">
                {/* Main Split Section — Clean, Simple, Uncluttered */}
                <section className="relative pt-28 pb-16 sm:pt-32 sm:pb-20">
                    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
                            {/* LEFT COLUMN: Clean, Concise Editorial Summary */}
                            <div className="space-y-6 lg:col-span-5">
                                <div className="space-y-3">
                                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary-ink">
                                        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                                        <span className="font-mono uppercase tracking-wider text-[11px]">
                                            30-Min Live Demo
                                        </span>
                                    </div>

                                    <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-[42px] lg:leading-[1.12] [text-wrap:balance]">
                                        Book a <span className="text-primary-ink">Demo.</span>
                                    </h1>

                                    <p className="max-w-md text-sm leading-relaxed text-muted sm:text-base">
                                        Pick a convenient time to walk through your visual pipeline, review turnaround SLAs, and plan a free 3-image test.
                                    </p>
                                </div>

                                {/* What We Cover Card */}
                                <div className="rounded-2xl border border-ink/10 bg-white p-5 space-y-4 shadow-xs">
                                    <p className="text-xs font-bold uppercase tracking-wider text-primary-ink">
                                        What We Cover
                                    </p>

                                    <div className="space-y-3.5">
                                        {WHAT_WE_COVER.map((item, idx) => (
                                            <div key={idx} className="flex items-start gap-3">
                                                <CheckCircle2 className="h-4 w-4 text-primary-ink shrink-0 mt-0.5" />
                                                <div className="space-y-0.5">
                                                    <h2 className="text-xs font-bold text-ink leading-snug">{item.title}</h2>
                                                    <p className="text-[11px] leading-relaxed text-muted">{item.detail}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 3 Badges Strip */}
                                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-muted">
                                    <span className="inline-flex items-center gap-1.5">
                                        <Clock className="h-3.5 w-3.5 text-primary-ink" />
                                        <span>24h SLA</span>
                                    </span>
                                    <span className="inline-flex items-center gap-1.5">
                                        <Shield className="h-3.5 w-3.5 text-primary-ink" />
                                        <span>Mutual NDA</span>
                                    </span>
                                    <span className="inline-flex items-center gap-1.5">
                                        <Sparkles className="h-3.5 w-3.5 text-primary-ink" />
                                        <span>No obligation</span>
                                    </span>
                                </div>

                                {/* Direct Support Card */}
                                <div className="rounded-2xl border border-ink/10 bg-white p-4.5 space-y-2 shadow-xs">
                                    <p className="text-xs font-bold text-ink">Prefer to send a written brief?</p>
                                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                                        <Link
                                            href="/contact"
                                            className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                                        >
                                            <span>Go to Contact Page</span>
                                            <ArrowRight className="h-3 w-3" />
                                        </Link>
                                        <a
                                            href={`mailto:${contactEmail}`}
                                            className="text-xs text-muted hover:text-ink transition-colors inline-flex items-center gap-1.5"
                                        >
                                            <Mail className="h-3.5 w-3.5 text-subtle" />
                                            <span>{contactEmail}</span>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT COLUMN: Pure, Clean Calendly Booking Card */}
                            <div className="lg:col-span-7">
                                <div className="overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-xs">
                                    {/* Card Header Bar */}
                                    <div className="flex items-center justify-between gap-3 border-b border-ink/8 px-5 py-3.5 bg-[#fbfcfd]">
                                        <div className="flex items-center gap-2.5">
                                            <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary-ink">
                                                <Calendar className="h-3.5 w-3.5" />
                                            </span>
                                            <div>
                                                <h2 className="text-xs font-bold text-ink">
                                                    Select a Date &amp; Time
                                                </h2>
                                                <p className="text-[11px] text-muted">
                                                    30-minute discovery call via Google Meet / Zoom
                                                </p>
                                            </div>
                                        </div>

                                        {!isPlaceholder && (
                                            <a
                                                href={rawCalendlyUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 rounded-lg border border-ink/10 bg-white px-2.5 py-1 text-[11px] font-semibold text-ink hover:text-primary-ink transition-colors shadow-xs"
                                            >
                                                <span>Open in Calendly</span>
                                                <ExternalLink className="h-3 w-3" />
                                            </a>
                                        )}
                                    </div>

                                    {/* Pure Calendly Embed Container */}
                                    <div className="relative bg-white" style={{ minHeight: '660px' }}>
                                        {isPlaceholder ? (
                                            /* Simple Fallback when URL not yet configured */
                                            <div className="flex min-h-[500px] flex-col items-center justify-center p-8 text-center space-y-4">
                                                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary-ink">
                                                    <Calendar className="h-6 w-6" />
                                                </div>
                                                <div className="max-w-sm space-y-1.5">
                                                    <h3 className="font-display text-base font-bold text-ink">
                                                        Discovery Calendar
                                                    </h3>
                                                    <p className="text-xs text-muted leading-relaxed">
                                                        Our studio schedule is being refreshed. You can connect with our team immediately through our direct contact page.
                                                    </p>
                                                </div>
                                                <Link
                                                    href="/contact"
                                                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-primary-hover transition-colors"
                                                >
                                                    <span>Open Contact Page</span>
                                                    <ArrowRight className="h-3.5 w-3.5" />
                                                </Link>
                                            </div>
                                        ) : (
                                            <>
                                                {widgetState === 'loading' && (
                                                    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-2.5 bg-white/95 text-sm text-muted">
                                                        <Loader2 className="h-5 w-5 animate-spin text-primary-ink" />
                                                        <span className="font-mono text-xs">Loading studio calendar…</span>
                                                    </div>
                                                )}

                                                {widgetState === 'error' ? (
                                                    <div className="flex min-h-[460px] flex-col items-center justify-center px-6 py-12 text-center space-y-3">
                                                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-700">
                                                            <AlertCircle className="h-5 w-5" />
                                                        </div>
                                                        <div className="max-w-xs space-y-1">
                                                            <h3 className="font-display text-sm font-bold text-ink">
                                                                Calendar embed blocked by browser
                                                            </h3>
                                                            <p className="text-[11px] text-muted leading-relaxed">
                                                                Your browser or privacy extension may be blocking third-party booking cookies. You can open our direct booking page in a new window below.
                                                            </p>
                                                        </div>
                                                        <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                                                            <a
                                                                href={rawCalendlyUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-primary-hover shadow-xs"
                                                            >
                                                                <span>Open Booking Schedule</span>
                                                                <ExternalLink className="h-3.5 w-3.5" />
                                                            </a>
                                                            <Link
                                                                href="/contact"
                                                                className="inline-flex items-center gap-1.5 rounded-xl border border-ink/15 bg-white px-4 py-2 text-xs font-semibold text-ink hover:border-ink/30 transition-colors"
                                                            >
                                                                <span>Contact Form</span>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div
                                                        ref={embedRef}
                                                        className="w-full"
                                                        style={{ minWidth: '320px', height: '660px', width: '100%' }}
                                                    />
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-12 border-t border-ink/8 bg-surface">
                    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
                        <div className="max-w-xl space-y-1.5">
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-ink">
                                Questions &amp; Answers
                            </p>
                            <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                                Common Discovery Inquiries
                            </h2>
                            <p className="text-xs text-muted">
                                Everything you need to know about our visual discovery walkthrough and trial terms.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {DEMO_FAQS.map((faq, idx) => {
                                const isOpen = openFaqIndex === idx;
                                return (
                                    <div
                                        key={idx}
                                        className="rounded-2xl border border-ink/8 bg-white p-5 space-y-2 transition-shadow hover:shadow-xs"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                                            className="w-full flex items-start justify-between gap-3 text-left cursor-pointer"
                                        >
                                            <span className="text-sm font-bold text-ink leading-snug">
                                                {faq.question}
                                            </span>
                                            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-[#f8f9fb] text-subtle text-xs">
                                                {isOpen ? '−' : '+'}
                                            </span>
                                        </button>
                                        <p className={`text-xs text-muted leading-relaxed ${isOpen ? 'block' : 'hidden sm:block'}`}>
                                            {faq.answer}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Bottom Navigation Strip */}
                <section className="py-8 border-t border-ink/8 bg-page">
                    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted">
                        <div>
                            <span>Cutting Edger Studio Discovery</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-5">
                            <Link href="/capabilities" className="hover:text-ink transition-colors">
                                Capabilities →
                            </Link>
                            <Link href="/case-studies" className="hover:text-ink transition-colors">
                                Case Studies →
                            </Link>
                            <Link href="/pricing" className="hover:text-ink transition-colors">
                                Transparent Pricing →
                            </Link>
                            <Link href="/contact" className="hover:text-ink transition-colors">
                                Contact Studio →
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
