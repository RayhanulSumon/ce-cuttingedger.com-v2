import React, { memo, useCallback, useEffect, useRef } from 'react';
import { Link, useRemember } from '@inertiajs/react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Project } from '@/types/models';
import { CASE_STUDIES } from './content';
import { OrderCta, PAD_X, Reveal, SectionIntro, SectionProps } from './shared';

interface CaseStudyProps extends SectionProps {
    projects: Project[];
}

interface CardTheme {
    bg: string;
    ink: string;
}

const CARD_THEMES: readonly CardTheme[] = [
    { bg: 'var(--color-secondary)', ink: 'var(--color-secondary-foreground)' },
    { bg: 'var(--color-surface)', ink: 'var(--color-ink)' },
    { bg: 'var(--color-ink)', ink: 'var(--color-surface)' },
];

const DOT_POSITIONS = [0.03, 0.45, 0.98] as const;

const clamp = (v: number): number => Math.max(0, Math.min(1, v));
const seg = (p: number, a: number, b: number): number => {
    const t = clamp((p - a) / (b - a));
    return t * t * (3 - 2 * t);
};
const snapPx = (v: number): number => Math.round(v * 2) / 2;

interface ParsedMetric {
    prefix: string;
    target: number;
    suffix: string;
    raw: string;
}

function parseMetricValue(raw: string): ParsedMetric {
    const match = raw.match(/^([^\d.-]*-?)(\d+(?:\.\d+)?)(.*)$/);
    if (!match) {
        return { prefix: '', target: 0, suffix: raw, raw };
    }
    return {
        prefix: match[1] ?? '',
        target: Number(match[2]),
        suffix: match[3] ?? '',
        raw,
    };
}

interface CardVisualCache {
    visible: boolean;
    transform: string;
    clipPath: string;
    opacity: string;
    bgOpacity: string;
}

function applyCardVisual(
    el: HTMLElement,
    bgEl: HTMLElement | null,
    cache: CardVisualCache,
    next: CardVisualCache,
) {
    if (cache.visible !== next.visible) {
        cache.visible = next.visible;
        el.style.visibility = next.visible ? 'visible' : 'hidden';
    }
    if (!next.visible) {
        return;
    }
    if (cache.transform !== next.transform) {
        cache.transform = next.transform;
        el.style.transform = next.transform;
    }
    if (cache.clipPath !== next.clipPath) {
        cache.clipPath = next.clipPath;
        el.style.clipPath = next.clipPath;
    }
    if (cache.opacity !== next.opacity) {
        cache.opacity = next.opacity;
        el.style.opacity = next.opacity;
    }
    if (bgEl && cache.bgOpacity !== next.bgOpacity) {
        cache.bgOpacity = next.bgOpacity;
        bgEl.style.opacity = next.bgOpacity;
    }
}

export const CaseStudySection = memo(function CaseStudySection({ active, projects }: CaseStudyProps) {
    const isMobile = useMediaQuery('(max-width: 767px)') === true;
    const [rememberedScrollTop, setRememberedScrollTop] = useRemember(0, 'home:case-study-scroll');
    const activeRef = useRef(active);
    activeRef.current = active;
    const rememberedScrollRef = useRef(rememberedScrollTop);
    rememberedScrollRef.current = rememberedScrollTop;
    const reqRef = useRef<() => void>(() => {});

    const scrollerRef = useRef<HTMLDivElement>(null);
    const csRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<(HTMLElement | null)[]>([]);
    const dotRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const hintRef = useRef<HTMLDivElement>(null);

    const scrollToCard = useCallback((index: number) => {
        const q = DOT_POSITIONS[index] ?? 0;
        const scroller = scrollerRef.current;
        if (scroller) {
            const max = scroller.scrollHeight - scroller.clientHeight;
            scroller.scrollTo({ top: q * max, behavior: 'smooth' });
            return;
        }
        const cs = csRef.current;
        if (!cs) {
            return;
        }
        const r = cs.getBoundingClientRect();
        window.scrollTo({
            top: window.scrollY + r.top + q * (r.height - window.innerHeight),
            behavior: 'smooth',
        });
    }, []);

    // Trigger a frame evaluation whenever section active state changes without rebuilding listeners.
    useEffect(() => {
        reqRef.current();
    }, [active]);

    useEffect(() => {
        if (isMobile) {
            return;
        }
        const cs = csRef.current;
        const stage = stageRef.current;
        const cards = cardRefs.current.filter((c): c is HTMLElement => c !== null);
        if (!cs || !stage || cards.length < 3) {
            return;
        }

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        cs.classList.add('anim');
        const bgEls = cards.map((card) => card.querySelector<HTMLElement>('.cs-bg'));

        const metricNodes = cards.map((card) => Array.from(card.querySelectorAll<HTMLElement>('[data-n]')));
        metricNodes.forEach((list) => {
            list.forEach((node) => {
                const prefix = node.dataset.p ?? '';
                const suffix = node.dataset.s ?? '';
                node.textContent = `${prefix}0${suffix}`;
            });
        });

        const counted = [false, false, false];
        const countUp = (i: number) => {
            if (counted[i]) {
                return;
            }
            counted[i] = true;
            metricNodes[i].forEach((node) => {
                const to = Number(node.dataset.n ?? 0);
                const prefix = node.dataset.p ?? '';
                const suffix = node.dataset.s ?? '';
                const t0 = performance.now();
                const step = (now: number) => {
                    const k = Math.min(1, (now - t0) / 1000);
                    const val = Math.round(to * (1 - Math.pow(1 - k, 3)));
                    node.textContent = `${prefix}${val}${suffix}`;
                    if (k < 1) {
                        requestAnimationFrame(step);
                    }
                };
                requestAnimationFrame(step);
            });
        };

        // Cached layout metrics — applied once per resize so scroll frames never trigger layout or paint.
        let W = 0;
        let H = 0;
        let vh = window.innerHeight;
        let maxScroll = 1;
        let csDocTop = 0;
        let csHeight = 1;
        let mob = false;
        let halfClip = 0;
        let halfVClip = 0;

        const measure = () => {
            W = stage.clientWidth;
            H = stage.clientHeight;
            vh = window.innerHeight;
            mob = W < 820;

            const g = 16;
            const m = mob ? 16 : Math.max(20, Math.min(64, W * 0.04));
            const topM = mob ? 84 : 92;
            const botM = mob ? 22 : 28;
            const iw = Math.max(200, W - 2 * m);
            const ih = Math.max(240, H - topM - botM);
            const hw = (iw - g) / 2;
            const hh = (ih - g) / 2;
            halfClip = snapPx(iw - hw);
            halfVClip = snapPx(ih - hh);

            const leftPx = `${snapPx(m)}px`;
            const topPx = `${snapPx(topM)}px`;
            const widthPx = `${snapPx(iw)}px`;
            const heightPx = `${snapPx(ih)}px`;

            cards.forEach((card) => {
                card.style.left = leftPx;
                card.style.top = topPx;
                card.style.width = widthPx;
                card.style.height = heightPx;
            });

            const scroller = scrollerRef.current;
            if (scroller) {
                maxScroll = Math.max(1, scroller.scrollHeight - scroller.clientHeight);
            } else {
                const r = cs.getBoundingClientRect();
                csDocTop = r.top + window.scrollY;
                csHeight = r.height;
                maxScroll = Math.max(1, csHeight - vh);
            }
        };

        let ent = 0;
        let entryStart = 0;
        let entered = false;
        let cur = -1;
        let lastTime = 0;
        let lastDot = -1;
        let lastHintVisible: boolean | null = null;
        let rafId = 0;
        let disposed = false;
        let persistTimer = 0;
        const clearHoverRects: (() => void)[] = [];

        const caches: CardVisualCache[] = [
            { visible: true, transform: '', clipPath: '', opacity: '', bgOpacity: '' },
            { visible: true, transform: '', clipPath: '', opacity: '', bgOpacity: '' },
            { visible: true, transform: '', clipPath: '', opacity: '', bgOpacity: '' },
        ];

        const startEntry = (now: number) => {
            entered = true;
            entryStart = now;
            ent = 0;
            cards[0].classList.add('in');
        };

        const syncUi = (p: number, secondVis: number, thirdVis: number) => {
            const stepIndex = p < 0.17 ? 0 : p < 0.5 ? 1 : 2;
            if (stepIndex !== lastDot) {
                lastDot = stepIndex;
                dotRefs.current.forEach((btn, i) => {
                    btn?.classList.toggle('on', i === stepIndex);
                });
            }
            const hintVisible = p < 0.03 && ent > 0.8;
            if (hintRef.current && hintVisible !== lastHintVisible) {
                lastHintVisible = hintVisible;
                hintRef.current.style.opacity = hintVisible ? '1' : '0';
            }
            if (ent > 0.8) {
                countUp(0);
            }
            if (secondVis > 0.7) {
                countUp(1);
            }
            if (thirdVis > 0.7) {
                countUp(2);
            }
        };

        const frame = (now: number) => {
            rafId = 0;
            if (disposed) {
                return;
            }
            const dt = lastTime ? Math.min(0.05, (now - lastTime) / 1000) : 0.016;
            lastTime = now;

            const scroller = scrollerRef.current;
            let tgt = 0;
            if (scroller) {
                tgt = clamp(scroller.scrollTop / maxScroll);
                if (activeRef.current && !entered) {
                    startEntry(now);
                } else if (!activeRef.current && entered) {
                    entered = false;
                    ent = 0;
                    cards[0].classList.remove('in');
                }
            } else {
                const relTop = csDocTop - window.scrollY;
                tgt = clamp(-relTop / maxScroll);
                if (!entered && relTop < vh * 0.9) {
                    startEntry(now);
                } else if (entered && relTop > vh * 0.98) {
                    entered = false;
                    ent = 0;
                    cards[0].classList.remove('in');
                }
            }

            let animatingEntry = false;
            if (entered && ent < 1) {
                const k = Math.min(1, (now - entryStart) / 1100);
                ent = 1 - Math.pow(1 - k, 4);
                animatingEntry = k < 1;
            }

            const prevCur = cur;
            if (cur < 0) {
                cur = tgt;
            } else {
                const alpha = 1 - Math.exp(-12 * dt);
                cur += (tgt - cur) * alpha;
                if (Math.abs(tgt - cur) < 0.0005) {
                    cur = tgt;
                }
            }
            if (cur !== prevCur) {
                clearHoverRects.forEach((fn) => fn());
            }

            const p = cur;
            const e1 = seg(p, 0.06, 0.2);
            const e2 = seg(p, 0.28, 0.42);
            const e3 = seg(p, 0.5, 0.64);
            const e4 = seg(p, 0.76, 0.92);
            const f = e2 * (1 - e3);
            const [a, b, c] = cards;

            if (mob) {
                const botClip1 = snapPx(halfVClip * e1);
                applyCardVisual(a, bgEls[0], caches[0], {
                    visible: f < 0.999 && e4 < 0.999,
                    transform: ent < 1 ? `scale(${(0.95 + 0.05 * ent).toFixed(4)})` : 'none',
                    clipPath: botClip1 > 0.5 ? `inset(0px 0px ${botClip1}px 0px round 22px)` : 'none',
                    opacity: '1',
                    bgOpacity: (e1 * 0.2).toFixed(3),
                });

                const tx2 = e1 < 1 ? snapPx((1 - e1) * W) : 0;
                const ty2 = snapPx((1 - f) * halfVClip);
                applyCardVisual(b, bgEls[1], caches[1], {
                    visible: e1 > 0.001 && e4 < 0.999,
                    transform: tx2 === 0 && ty2 === 0 ? 'none' : `translate3d(${tx2}px, ${ty2}px, 0)`,
                    clipPath: ty2 > 0.5 ? `inset(0px 0px ${ty2}px 0px round 22px)` : 'none',
                    opacity: '1',
                    bgOpacity: ((1 - f) * 0.2).toFixed(3),
                });

                const tx3 = e3 < 1 ? snapPx(-(1 - e3) * W) : 0;
                const botClip3 = snapPx((1 - e4) * halfVClip);
                applyCardVisual(c, bgEls[2], caches[2], {
                    visible: e3 > 0.001,
                    transform: tx3 === 0 ? 'none' : `translate3d(${tx3}px, 0, 0)`,
                    clipPath: botClip3 > 0.5 ? `inset(0px 0px ${botClip3}px 0px round 22px)` : 'none',
                    opacity: '1',
                    bgOpacity: ((1 - e4) * 0.2).toFixed(3),
                });
            } else {
                const rightClip1 = snapPx(halfClip * e1);
                applyCardVisual(a, bgEls[0], caches[0], {
                    visible: f < 0.999 && e4 < 0.999,
                    transform: ent < 1 ? `scale(${(0.95 + 0.05 * ent).toFixed(4)})` : 'none',
                    clipPath: rightClip1 > 0.5 ? `inset(0px ${rightClip1}px 0px 0px round 28px)` : 'none',
                    opacity: '1',
                    bgOpacity: (e1 * 0.2).toFixed(3),
                });

                const tx2 = snapPx((1 - f) * halfClip);
                const ty2 = e1 < 1 ? snapPx((1 - e1) * H) : 0;
                applyCardVisual(b, bgEls[1], caches[1], {
                    visible: e1 > 0.001 && e4 < 0.999,
                    transform: tx2 === 0 && ty2 === 0 ? 'none' : `translate3d(${tx2}px, ${ty2}px, 0)`,
                    clipPath: tx2 > 0.5 ? `inset(0px ${tx2}px 0px 0px round 28px)` : 'none',
                    opacity: '1',
                    bgOpacity: ((1 - f) * 0.2).toFixed(3),
                });

                const ty3 = e3 < 1 ? snapPx((1 - e3) * (H + 40)) : 0;
                const rightClip3 = snapPx((1 - e4) * halfClip);
                applyCardVisual(c, bgEls[2], caches[2], {
                    visible: e3 > 0.001,
                    transform: ty3 === 0 ? 'none' : `translate3d(0, ${ty3}px, 0)`,
                    clipPath: rightClip3 > 0.5 ? `inset(0px ${rightClip3}px 0px 0px round 28px)` : 'none',
                    opacity: '1',
                    bgOpacity: ((1 - e4) * 0.2).toFixed(3),
                });
            }

            syncUi(p, e1, e3);
            if (cur !== tgt || animatingEntry) {
                req();
            } else {
                lastTime = 0;
            }
        };

        const req = () => {
            if (!rafId && !disposed) {
                rafId = requestAnimationFrame(frame);
            }
        };
        reqRef.current = req;

        const onResize = () => {
            measure();
            req();
        };

        const cleanups: (() => void)[] = [];
        cards.forEach((card) => {
            const inn = card.querySelector<HTMLElement>('.cs-in');
            if (!inn) {
                return;
            }
            let hoverRaf = 0;
            let lastEvent: PointerEvent | null = null;
            let cardRect: DOMRect | null = null;
            clearHoverRects.push(() => {
                cardRect = null;
            });

            const applyHover = () => {
                hoverRaf = 0;
                if (!lastEvent || !cardRect || disposed || cardRect.width <= 0 || cardRect.height <= 0) {
                    return;
                }
                const px = lastEvent.clientX - cardRect.left;
                const py = lastEvent.clientY - cardRect.top;
                const x = clamp(px / cardRect.width);
                const y = clamp(py / cardRect.height);

                card.classList.add('hov');
                inn.style.transform = `perspective(1100px) rotateX(${((0.5 - y) * 5).toFixed(2)}deg) rotateY(${((x - 0.5) * 7).toFixed(2)}deg)`;
                card.style.setProperty('--tx', `${((0.5 - x) * 16).toFixed(1)}px`);
                card.style.setProperty('--ty', `${((0.5 - y) * 16).toFixed(1)}px`);
            };

            const onEnter = (e: PointerEvent) => {
                if (e.pointerType !== 'mouse') {
                    return;
                }
                cardRect = card.getBoundingClientRect();
            };

            const onMove = (e: PointerEvent) => {
                if (e.pointerType !== 'mouse') {
                    return;
                }
                if (!cardRect) {
                    cardRect = card.getBoundingClientRect();
                }
                lastEvent = e;
                if (!hoverRaf) {
                    hoverRaf = requestAnimationFrame(applyHover);
                }
            };

            const onLeave = () => {
                lastEvent = null;
                cardRect = null;
                if (hoverRaf) {
                    cancelAnimationFrame(hoverRaf);
                    hoverRaf = 0;
                }
                card.classList.remove('hov');
                inn.style.transform = '';
                card.style.setProperty('--tx', '0px');
                card.style.setProperty('--ty', '0px');
            };

            card.addEventListener('pointerenter', onEnter);
            card.addEventListener('pointermove', onMove, { passive: true });
            card.addEventListener('pointerleave', onLeave);
            cleanups.push(() => {
                if (hoverRaf) {
                    cancelAnimationFrame(hoverRaf);
                }
                card.removeEventListener('pointerenter', onEnter);
                card.removeEventListener('pointermove', onMove);
                card.removeEventListener('pointerleave', onLeave);
            });
        });

        const scroller = scrollerRef.current;
        if (scroller) {
            if (rememberedScrollRef.current > 0 && scroller.scrollTop === 0) {
                scroller.scrollTop = rememberedScrollRef.current;
            }
            const onInnerScroll = () => {
                req();
                window.clearTimeout(persistTimer);
                const nextTop = scroller.scrollTop;
                persistTimer = window.setTimeout(() => {
                    if (!disposed) {
                        setRememberedScrollTop(nextTop);
                    }
                }, 150);
            };
            scroller.addEventListener('scroll', onInnerScroll, { passive: true });
            window.addEventListener('resize', onResize);

            const resizeObserver = new ResizeObserver(onResize);
            resizeObserver.observe(stage);
            measure();
            req();

            return () => {
                disposed = true;
                reqRef.current = () => {};
                window.clearTimeout(persistTimer);
                if (rafId) {
                    cancelAnimationFrame(rafId);
                }
                cs.classList.remove('anim');
                scroller.removeEventListener('scroll', onInnerScroll);
                window.removeEventListener('resize', onResize);
                resizeObserver.disconnect();
                cleanups.forEach((fn) => fn());
            };
        }

        window.addEventListener('scroll', req, { passive: true });
        window.addEventListener('resize', onResize);

        const resizeObserver = new ResizeObserver(onResize);
        resizeObserver.observe(stage);
        resizeObserver.observe(cs);
        measure();
        req();

        return () => {
            disposed = true;
            reqRef.current = () => {};
            window.clearTimeout(persistTimer);
            if (rafId) {
                cancelAnimationFrame(rafId);
            }
            cs.classList.remove('anim');
            window.removeEventListener('scroll', req);
            window.removeEventListener('resize', onResize);
            resizeObserver.disconnect();
            cleanups.forEach((fn) => fn());
        };
    }, [isMobile]);

    const content = (
        <div ref={csRef} className="cs">
            <div ref={stageRef} className="cs-stage">
                {CASE_STUDIES.slice(0, 3).map((study, i) => {
                    const linked = projects[i];
                    const theme = CARD_THEMES[i] ?? CARD_THEMES[0];
                    const title = linked?.title || study.title;
                    const category = linked?.category?.name || study.category;
                    const summary = linked?.summary || study.summary;
                    const metrics = linked?.metrics?.length ? linked.metrics : study.metrics;
                    const imageUrl = linked?.cover_image || study.image;
                    const href = linked ? `/case-studies/${linked.slug}` : '/case-studies';
                    const cardClass = `cs-card c${i + 1}`;

                    return (
                        <article
                            key={linked?.id ?? study.title}
                            ref={(el) => {
                                cardRefs.current[i] = el;
                            }}
                            className={cardClass}
                            style={
                                {
                                    '--cb': theme.bg,
                                    '--ci': theme.ink,
                                } as React.CSSProperties
                            }
                        >
                            <div className="cs-bg" aria-hidden="true">
                                <img src={imageUrl} alt="" loading="lazy" decoding="async" draggable={false} />
                            </div>
                            <div className="cs-in">
                                <div className="cs-copy">
                                    <span className="cs-tag">
                                        Case study 0{i + 1} · {category}
                                    </span>
                                    <h3>{title}</h3>
                                    <p>{summary}</p>
                                    <div className="cs-nums">
                                        {metrics.slice(0, 2).map((metric) => {
                                            const parsed = parseMetricValue(metric.value);
                                            return (
                                                <div key={metric.label}>
                                                    <b
                                                        data-n={parsed.target}
                                                        data-p={parsed.prefix}
                                                        data-s={parsed.suffix}
                                                    >
                                                        {parsed.raw}
                                                    </b>
                                                    {metric.label}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <Link className="cs-btn" href={href} prefetch>
                                        Read the full case
                                    </Link>
                                </div>
                                <div className="cs-media">
                                    <img src={imageUrl} alt={title} loading="lazy" decoding="async" draggable={false} />
                                </div>
                            </div>
                        </article>
                    );
                })}

                <div className="cs-dots" aria-label="Case study steps">
                    {CASE_STUDIES.slice(0, 3).map((study, i) => (
                        <button
                            key={study.title}
                            ref={(el) => {
                                dotRefs.current[i] = el;
                            }}
                            type="button"
                            aria-label={`Go to ${study.client}`}
                            onClick={() => scrollToCard(i)}
                        />
                    ))}
                </div>

                <div ref={hintRef} className="cs-hint" style={{ opacity: 0 }}>
                    Scroll ↓
                </div>
            </div>
        </div>
    );

    if (isMobile) {
        return (
            <div className={`w-full bg-page pb-12 pt-24 sm:px-10 ${PAD_X}`}>
                <SectionIntro active={active} title="Selected Case Studies" bodyClassName="text-sm text-muted">
                    Measurable results across high-volume retouching, digital twins, and omnichannel production.
                </SectionIntro>

                <div className="mt-6 flex flex-col gap-5">
                    {CASE_STUDIES.slice(0, 3).map((study, i) => {
                        const linked = projects[i];
                        const theme = CARD_THEMES[i] ?? CARD_THEMES[0];
                        const title = linked?.title || study.title;
                        const category = linked?.category?.name || study.category;
                        const summary = linked?.summary || study.summary;
                        const metrics = linked?.metrics?.length ? linked.metrics : study.metrics;
                        const imageUrl = linked?.cover_image || study.image;
                        const href = linked ? `/case-studies/${linked.slug}` : '/case-studies';
                        const isLightCard = i === 1;

                        return (
                            <Reveal key={linked?.id ?? study.title} active={active} delay={0.08 * i} y="18px">
                                <article
                                    className={`overflow-hidden rounded-3xl p-4 shadow-[0_18px_42px_-26px_rgba(16,17,20,0.35)] ${
                                        isLightCard ? 'border border-line' : ''
                                    }`}
                                    style={{ backgroundColor: theme.bg, color: theme.ink }}
                                >
                                    <div className="aspect-[16/10] w-full overflow-hidden rounded-2xl bg-secondary/10">
                                        <img
                                            src={imageUrl}
                                            alt={title}
                                            loading="lazy"
                                            decoding="async"
                                            draggable={false}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    <div className="mt-4 flex flex-col items-start gap-3">
                                        <span className="text-2xs font-semibold uppercase tracking-[0.16em] opacity-75">
                                            Case study 0{i + 1} · {category}
                                        </span>
                                        <h3 className="font-display text-xl font-extrabold leading-tight tracking-[-0.02em]">
                                            {title}
                                        </h3>
                                        <p className="text-sm leading-relaxed opacity-85">{summary}</p>

                                        <div className="flex flex-wrap gap-6 py-1">
                                            {metrics.slice(0, 2).map((metric) => (
                                                <div key={metric.label}>
                                                    <span className="block font-display text-2xl font-extrabold leading-none tabular-nums">
                                                        {metric.value}
                                                    </span>
                                                    <span className="mt-1 block text-xs opacity-75">{metric.label}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <OrderCta href={href} size="sm">
                                            Read Case Study
                                        </OrderCta>
                                    </div>
                                </article>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div ref={scrollerRef} data-scrollable className="h-full w-full overflow-y-auto bg-page">
            {content}
        </div>
    );
});
