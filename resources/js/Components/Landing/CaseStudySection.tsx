import React, { memo, useCallback, useEffect, useRef } from 'react';
import { Link, useRemember } from '@inertiajs/react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Project } from '@/types/models';
import { CASE_STUDIES } from './content';
import { SectionProps } from './shared';

interface CaseStudyProps extends SectionProps {
    projects: Project[];
}

interface CardTheme {
    bg: string;
    ink: string;
}

const CARD_THEMES: readonly CardTheme[] = [
    { bg: 'var(--color-secondary, #141A26)', ink: '#FFFFFF' },
    { bg: 'var(--color-surface, #FFFFFF)', ink: 'var(--color-ink, #16191F)' },
    { bg: 'var(--color-ink, #16191F)', ink: '#FFFFFF' },
];

const DOT_POSITIONS = [0.03, 0.45, 0.98] as const;

const clamp = (v: number): number => Math.max(0, Math.min(1, v));
const seg = (p: number, a: number, b: number): number => {
    const t = clamp((p - a) / (b - a));
    return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
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

interface CardCache {
    left: number;
    top: number;
    width: number;
    height: number;
    transform: string;
    visible: boolean;
}

function applyCardStyle(el: HTMLElement, cache: CardCache, next: CardCache) {
    if (cache.visible !== next.visible) {
        cache.visible = next.visible;
        el.style.visibility = next.visible ? 'visible' : 'hidden';
    }
    if (!next.visible) {
        return;
    }
    if (cache.left !== next.left) {
        cache.left = next.left;
        el.style.left = `${next.left}px`;
    }
    if (cache.top !== next.top) {
        cache.top = next.top;
        el.style.top = `${next.top}px`;
    }
    if (cache.width !== next.width) {
        cache.width = next.width;
        el.style.width = `${next.width}px`;
    }
    if (cache.height !== next.height) {
        cache.height = next.height;
        el.style.height = `${next.height}px`;
    }
    if (cache.transform !== next.transform) {
        cache.transform = next.transform;
        el.style.transform = next.transform;
    }
}

export const CaseStudySection = memo(function CaseStudySection({ active, projects }: CaseStudyProps) {
    const isMobile = useMediaQuery('(max-width: 767px)') === true;
    const [rememberedScrollTop, setRememberedScrollTop] = useRemember(0, 'home:case-study-scroll');
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

    useEffect(() => {
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

        const metricNodes = cards.map((card) =>
            Array.from(card.querySelectorAll<HTMLElement>('[data-n]')),
        );
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

        // Cached layout metrics — updated only on resize so scroll frames never force reflows.
        let W = 0;
        let H = 0;
        let vh = window.innerHeight;
        let maxScroll = 1;
        let csDocTop = 0;
        let csHeight = 1;

        const measure = () => {
            W = stage.clientWidth;
            H = stage.clientHeight;
            vh = window.innerHeight;
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

        const caches: CardCache[] = [
            { left: -1, top: -1, width: -1, height: -1, transform: '', visible: true },
            { left: -1, top: -1, width: -1, height: -1, transform: '', visible: true },
            { left: -1, top: -1, width: -1, height: -1, transform: '', visible: true },
        ];

        const startEntry = (now: number) => {
            entered = true;
            entryStart = now;
            ent = 0;
            cards[0].classList.add('in');
        };

        const syncUi = (p: number, e1: number, e3: number) => {
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
            if (e1 > 0.7) {
                countUp(1);
            }
            if (e3 > 0.7) {
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
                if (active && !entered) {
                    startEntry(now);
                } else if (!active && entered) {
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

            if (cur < 0) {
                cur = tgt;
            } else {
                const alpha = 1 - Math.exp(-14 * dt);
                cur += (tgt - cur) * alpha;
                if (Math.abs(tgt - cur) < 0.0008) {
                    cur = tgt;
                }
            }
            const p = cur;

            const g = 16;
            const m = Math.max(12, W * 0.03);
            const mob = W < 820;
            const topM = mob ? 74 : m;
            const botM = mob ? 28 : m;
            const iw = W - 2 * m;
            const ih = H - topM - botM;

            const e1 = seg(p, 0.06, 0.2);
            const e2 = seg(p, 0.28, 0.42);
            const e3 = seg(p, 0.5, 0.64);
            const e4 = seg(p, 0.76, 0.92);
            const f = e2 * (1 - e3);
            const hw = (iw - g) / 2;
            const hh = (ih - g) / 2;

            const [a, b, c] = cards;

            applyCardStyle(a, caches[0], {
                left: snapPx(m),
                top: snapPx(topM),
                width: snapPx(mob ? iw : lerp(iw, hw, e1)),
                height: snapPx(mob ? lerp(ih, hh, e1) : ih),
                transform: ent < 1 ? `scale(${(0.95 + 0.05 * ent).toFixed(4)})` : 'none',
                visible: f < 0.999 && e4 < 0.999,
            });

            applyCardStyle(b, caches[1], {
                left: snapPx(mob ? m : lerp(m + hw + g, m, f)),
                top: snapPx(mob ? lerp(topM + hh + g, topM, f) : topM),
                width: snapPx(mob ? iw : lerp(hw, iw, f)),
                height: snapPx(mob ? lerp(hh, ih, f) : ih),
                transform:
                    e1 < 1
                        ? `translate3d(${snapPx((1 - e1) * (mob ? W : 0))}px, ${snapPx((1 - e1) * (mob ? 0 : H))}px, 0)`
                        : 'none',
                visible: e1 > 0.001 && e4 < 0.999,
            });

            applyCardStyle(c, caches[2], {
                left: snapPx(m),
                top: snapPx(topM),
                width: snapPx(mob ? iw : lerp(hw, iw, e4)),
                height: snapPx(mob ? lerp(hh, ih, e4) : ih),
                transform:
                    e3 < 1
                        ? `translate3d(${snapPx(mob ? -(1 - e3) * W : 0)}px, ${snapPx(mob ? 0 : (1 - e3) * (H + 40))}px, 0)`
                        : 'none',
                visible: e3 > 0.001,
            });

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

        const onResize = () => {
            measure();
            req();
        };

        const cleanups: (() => void)[] = [];
        cards.forEach((card) => {
            const inn = card.querySelector<HTMLElement>('.cs-in');
            const glow = card.querySelector<HTMLElement>('.cs-glow');
            if (!inn || !glow) {
                return;
            }
            let hoverRaf = 0;
            let lastEvent: PointerEvent | null = null;
            const applyHover = () => {
                hoverRaf = 0;
                if (!lastEvent || disposed) {
                    return;
                }
                const r = card.getBoundingClientRect();
                const x = (lastEvent.clientX - r.left) / r.width;
                const y = (lastEvent.clientY - r.top) / r.height;
                card.classList.add('hov');
                glow.style.background = `radial-gradient(420px circle at ${x * 100}% ${y * 100}%, rgba(245, 118, 26, 0.22), transparent 60%)`;
                inn.style.transform = `perspective(1000px) rotateX(${(0.5 - y) * 6}deg) rotateY(${(x - 0.5) * 8}deg)`;
                card.style.setProperty('--tx', `${(0.5 - x) * 18}px`);
                card.style.setProperty('--ty', `${(0.5 - y) * 18}px`);
            };
            const onMove = (e: PointerEvent) => {
                if (e.pointerType !== 'mouse') {
                    return;
                }
                lastEvent = e;
                if (!hoverRaf) {
                    hoverRaf = requestAnimationFrame(applyHover);
                }
            };
            const onLeave = () => {
                lastEvent = null;
                if (hoverRaf) {
                    cancelAnimationFrame(hoverRaf);
                    hoverRaf = 0;
                }
                card.classList.remove('hov');
                inn.style.transform = '';
                card.style.setProperty('--tx', '0px');
                card.style.setProperty('--ty', '0px');
            };
            card.addEventListener('pointermove', onMove, { passive: true });
            card.addEventListener('pointerleave', onLeave);
            cleanups.push(() => {
                if (hoverRaf) {
                    cancelAnimationFrame(hoverRaf);
                }
                card.removeEventListener('pointermove', onMove);
                card.removeEventListener('pointerleave', onLeave);
            });
        });

        const scroller = scrollerRef.current;
        if (scroller) {
            if (rememberedScrollTop > 0 && scroller.scrollTop === 0) {
                scroller.scrollTop = rememberedScrollTop;
            }
            const onInnerScroll = () => {
                setRememberedScrollTop(scroller.scrollTop);
                req();
            };
            scroller.addEventListener('scroll', onInnerScroll, { passive: true });
            window.addEventListener('resize', onResize);

            const resizeObserver = new ResizeObserver(onResize);
            resizeObserver.observe(stage);
            measure();
            req();

            return () => {
                disposed = true;
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
        measure();
        req();

        return () => {
            disposed = true;
            if (rafId) {
                cancelAnimationFrame(rafId);
            }
            cs.classList.remove('anim');
            window.removeEventListener('scroll', req);
            window.removeEventListener('resize', onResize);
            resizeObserver.disconnect();
            cleanups.forEach((fn) => fn());
        };
    }, [active, isMobile]);

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
                            <div
                                className="cs-bg"
                                style={{ backgroundImage: `url(${imageUrl})` }}
                                aria-hidden="true"
                            />
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
                                    <Link className="cs-btn" href={href}>
                                        Read the full case
                                    </Link>
                                </div>
                                <div
                                    className="cs-media"
                                    style={{ backgroundImage: `url(${imageUrl})` }}
                                    role="img"
                                    aria-label={title}
                                />
                            </div>
                            <div className="cs-glow" aria-hidden="true" />
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
        return content;
    }

    return (
        <div ref={scrollerRef} data-scrollable className="h-full w-full overflow-y-auto bg-page">
            {content}
        </div>
    );
});
