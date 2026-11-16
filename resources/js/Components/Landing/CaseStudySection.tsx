import React, { memo, useCallback, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
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
    { bg: 'var(--color-page, #F2F2F1)', ink: 'var(--color-ink, #16191F)' },
    { bg: 'var(--color-ink, #16191F)', ink: '#FFFFFF' },
];

const DOT_POSITIONS = [0.03, 0.45, 0.98] as const;

const clamp = (v: number): number => Math.max(0, Math.min(1, v));
const seg = (p: number, a: number, b: number): number => {
    const t = clamp((p - a) / (b - a));
    return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

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

export const CaseStudySection = memo(function CaseStudySection({ active, projects }: CaseStudyProps) {
    const isMobile = useMediaQuery('(max-width: 767px)') === true;
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

        let ent = 0;
        let entered = false;
        let cur = -1;
        let rafScheduled = false;
        let disposed = false;

        const startEntry = () => {
            entered = true;
            cards[0].classList.add('in');
            const t0 = performance.now();
            const frame = (now: number) => {
                if (disposed || !entered) {
                    return;
                }
                const k = Math.min(1, (now - t0) / 1100);
                ent = 1 - Math.pow(1 - k, 4);
                layout();
                if (k < 1) {
                    requestAnimationFrame(frame);
                }
            };
            requestAnimationFrame(frame);
        };

        const syncUi = (p: number, e1: number, e3: number) => {
            const stepIndex = p < 0.17 ? 0 : p < 0.5 ? 1 : 2;
            dotRefs.current.forEach((btn, i) => {
                btn?.classList.toggle('on', i === stepIndex);
            });
            if (hintRef.current) {
                hintRef.current.style.opacity = p < 0.03 && ent > 0.8 ? '1' : '0';
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

        const layout = () => {
            if (disposed) {
                return;
            }
            const scroller = scrollerRef.current;
            let tgt = 0;
            if (scroller) {
                const max = scroller.scrollHeight - scroller.clientHeight;
                tgt = max > 0 ? clamp(scroller.scrollTop / max) : 0;
                if (active && !entered) {
                    startEntry();
                } else if (!active && entered) {
                    entered = false;
                    ent = 0;
                    cards[0].classList.remove('in');
                }
            } else {
                const r = cs.getBoundingClientRect();
                const max = r.height - window.innerHeight;
                tgt = max > 0 ? clamp(-r.top / max) : 0;
                const vh = window.innerHeight;
                if (!entered && r.top < vh * 0.9) {
                    startEntry();
                } else if (entered && r.top > vh * 0.98) {
                    entered = false;
                    ent = 0;
                    cards[0].classList.remove('in');
                }
            }

            if (cur < 0) {
                cur = tgt;
            }
            cur += (tgt - cur) * 0.1;
            if (Math.abs(tgt - cur) < 0.0004) {
                cur = tgt;
            }
            const p = cur;

            const W = stage.clientWidth;
            const H = stage.clientHeight;
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

            // Card 1: full screen -> half
            a.style.left = `${m}px`;
            a.style.top = `${topM}px`;
            a.style.width = `${mob ? iw : lerp(iw, hw, e1)}px`;
            a.style.height = `${mob ? lerp(ih, hh, e1) : ih}px`;
            a.style.transform = `scale(${0.95 + 0.05 * ent})`;

            // Card 2: rises into the other half, expands full screen, then shrinks back
            if (mob) {
                b.style.left = `${m}px`;
                b.style.width = `${iw}px`;
                b.style.top = `${lerp(topM + hh + g, topM, f)}px`;
                b.style.height = `${lerp(hh, ih, f)}px`;
            } else {
                b.style.top = `${topM}px`;
                b.style.height = `${ih}px`;
                b.style.left = `${lerp(m + hw + g, m, f)}px`;
                b.style.width = `${lerp(hw, iw, f)}px`;
            }
            b.style.transform = `translate(${(1 - e1) * (mob ? W : 0)}px, ${(1 - e1) * (mob ? 0 : H)}px)`;

            // Card 3: rises from the bottom into the left slot, then expands full screen
            c.style.left = `${m}px`;
            c.style.top = `${topM}px`;
            c.style.width = `${mob ? iw : lerp(hw, iw, e4)}px`;
            c.style.height = `${mob ? lerp(hh, ih, e4) : ih}px`;
            c.style.transform = `translate(${mob ? -(1 - e3) * W : 0}px, ${mob ? 0 : (1 - e3) * (H + 40)}px)`;

            syncUi(p, e1, e3);
            if (cur !== tgt) {
                req();
            }
        };

        const req = () => {
            if (!rafScheduled && !disposed) {
                rafScheduled = true;
                requestAnimationFrame(() => {
                    rafScheduled = false;
                    layout();
                });
            }
        };

        const cleanups: (() => void)[] = [];
        cards.forEach((card) => {
            const inn = card.querySelector<HTMLElement>('.cs-in');
            const glow = card.querySelector<HTMLElement>('.cs-glow');
            if (!inn || !glow) {
                return;
            }
            const onMove = (e: PointerEvent) => {
                if (e.pointerType !== 'mouse') {
                    return;
                }
                const r = card.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width;
                const y = (e.clientY - r.top) / r.height;
                card.classList.add('hov');
                glow.style.background = `radial-gradient(420px circle at ${x * 100}% ${y * 100}%, rgba(127, 140, 255, 0.28), transparent 60%)`;
                inn.style.transform = `perspective(1000px) rotateX(${(0.5 - y) * 6}deg) rotateY(${(x - 0.5) * 8}deg)`;
                card.style.setProperty('--tx', `${(0.5 - x) * 18}px`);
                card.style.setProperty('--ty', `${(0.5 - y) * 18}px`);
            };
            const onLeave = () => {
                card.classList.remove('hov');
                inn.style.transform = '';
                card.style.setProperty('--tx', '0px');
                card.style.setProperty('--ty', '0px');
            };
            card.addEventListener('pointermove', onMove);
            card.addEventListener('pointerleave', onLeave);
            cleanups.push(() => {
                card.removeEventListener('pointermove', onMove);
                card.removeEventListener('pointerleave', onLeave);
            });
        });

        const scroller = scrollerRef.current;
        if (scroller) {
            scroller.addEventListener('scroll', req, { passive: true });
        } else {
            window.addEventListener('scroll', req, { passive: true });
        }
        window.addEventListener('resize', req);
        layout();

        return () => {
            disposed = true;
            cs.classList.remove('anim');
            if (scroller) {
                scroller.removeEventListener('scroll', req);
            } else {
                window.removeEventListener('scroll', req);
            }
            window.removeEventListener('resize', req);
            cleanups.forEach((fn) => fn());
        };
    }, [active, isMobile]);

    const content = (
        <div ref={csRef} className="cs">
            <div ref={stageRef} className="cs-stage">
                {CASE_STUDIES.slice(0, 3).map((study, i) => {
                    const linked = projects[i];
                    const theme = CARD_THEMES[i] ?? CARD_THEMES[0];
                    const imageUrl = linked?.cover_image || study.image;
                    const href = linked ? `/case-studies/${linked.slug}` : '/case-studies';
                    const cardClass = `cs-card c${i + 1}`;

                    return (
                        <article
                            key={study.title}
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
                                        Case study 0{i + 1} · {study.category}
                                    </span>
                                    <h3>{study.title}</h3>
                                    <p>{study.summary}</p>
                                    <div className="cs-nums">
                                        {study.metrics.slice(0, 2).map((metric) => {
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
                                    aria-label={study.title}
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
        <div ref={scrollerRef} data-scrollable className="h-full w-full overflow-y-auto bg-white">
            {content}
        </div>
    );
});
