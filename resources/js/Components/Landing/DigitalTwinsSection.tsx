import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Eye } from 'lucide-react';
import { Eyebrow, SectionProps } from './shared';
import { DIGITAL_TWINS, TWIN_FIRST_LOOK, TWIN_Y0, TWIN_Y1 } from './looks';
import { TwinPresetModal, TwinSpriteCrop } from './TwinPresetModal';

/** Auto-advance interval in ms (paused while hovering or dragging). */
const AUTO_ADVANCE_MS = 2800;

// Exact depth stops from demo/Digital Twins.html: d = -1 (leaving front-right) to d = 5 (far back-left)
const KX = [1.2, 0.744, 0.496, 0.346, 0.235, 0.15, 0.085];
const KF = [1.14, 0.89, 0.777, 0.704, 0.651, 0.616, 0.59];
const KH = [1.18, 0.832, 0.574, 0.436, 0.334, 0.258, 0.19];
const KB = [0, 0, 1.5, 4, 8, 12, 17];
const KO = [1, 1, 1, 1, 0.86, 0.5, 0];

const N = DIGITAL_TWINS.length;
const wrap = (x: number, n: number) => ((x % n) + n) % n;
const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));

export function DigitalTwinsSection({ active, openDemo, onOverlayChange }: SectionProps) {
    const stageRef = useRef<HTMLDivElement | null>(null);
    const modelRefs = useRef<(HTMLDivElement | null)[]>([]);
    const rollRef = useRef<HTMLSpanElement | null>(null);
    const ringRef = useRef<HTMLDivElement | null>(null);
    /** true while mouse is inside the stage — pauses auto-advance */
    const hoveredRef = useRef(false);

    const [activeTwinIdx, setActiveTwinIdx] = useState(0);
    const [modalTwinIdx, setModalTwinIdx] = useState<number | null>(null);
    const [cursorMode, setCursorMode] = useState<'hidden' | 'ring' | 'drag' | 'view'>('hidden');

    /** Opens the pose-preset modal and notifies the parent (hides SideDots/Menubar). */
    const openModal = (idx: number) => {
        setModalTwinIdx(idx);
        onOverlayChange?.(true);
    };

    /** Closes the pose-preset modal and notifies the parent (restores SideDots/Menubar). */
    const closeModal = () => {
        setModalTwinIdx(null);
        onOverlayChange?.(false);
    };

    // Mutable animation state matching demo/Digital Twins.html
    const stateRef = useRef({
        W: 0,
        H: 0,
        base: 0,
        p: 0,
        target: 0,
        last: 0,
        dirty: true,
        mx: 0,
        my: 0,
        cx: 0,
        cy: 0,
        down: false,
        sx: 0,
        st: 0,
        moved: 0,
        hoveredModel: -1,
        BoundaryReleaseCount: 0,
    });

    const paint = useCallback(() => {
        const s = stateRef.current;
        const { W, H, base, p } = s;
        if (!W || !H || !base) {
            return;
        }

        DIGITAL_TWINS.forEach((twin, i) => {
            const el = modelRefs.current[i];
            if (!el) {
                return;
            }
            const r = (twin.x1 - twin.x0) / (TWIN_Y1 - TWIN_Y0);
            let d = wrap(i - p, N);
            if (d > N - 1) {
                d -= N;
            }
            const k = clamp(d + 1, 0, 6);
            const a = Math.floor(k);
            const b = Math.min(6, a + 1);
            const t = k - a;
            const mix = (A: number[]) => A[a] + (A[b] - A[a]) * t;

            const h = mix(KH) * H;
            const scale = h / base;
            const w = h * r;
            const x = mix(KX) * W - w / 2;
            const y = mix(KF) * H - h;

            el.style.width = `${(base * r).toFixed(1)}px`;
            el.style.height = `${base.toFixed(1)}px`;
            el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) scale(${scale.toFixed(4)})`;

            const f = mix(KB) / scale;
            const fs = f < 0.2 ? 'none' : `blur(${f.toFixed(1)}px)`;
            const o = mix(KO).toFixed(3);

            el.style.filter = fs;
            el.style.opacity = o;
            el.style.zIndex = String(100 - Math.round(d * 10));
        });

        const rollEl = rollRef.current;
        if (rollEl && rollEl.firstElementChild) {
            const rowH = (rollEl.firstElementChild as HTMLElement).offsetHeight || 38;
            rollEl.style.transform = `translate3d(0,${(-wrap(p, N) * rowH).toFixed(1)}px,0)`;
        }

        const currentIdx = wrap(Math.round(p), N);
        setActiveTwinIdx((prev) => (prev === currentIdx ? prev : currentIdx));
    }, []);

    const measure = useCallback(() => {
        const stage = stageRef.current;
        if (!stage) {
            return;
        }
        const s = stateRef.current;
        s.W = stage.clientWidth;
        s.H = stage.clientHeight;
        s.base = s.H * 1.2;
        s.dirty = true;
        paint();
    }, [paint]);

    useEffect(() => {
        measure();
        const stage = stageRef.current;
        if (!stage) {
            return;
        }
        const ro = new ResizeObserver(() => measure());
        ro.observe(stage);
        window.addEventListener('resize', measure);
        return () => {
            ro.disconnect();
            window.removeEventListener('resize', measure);
        };
    }, [measure]);

    useEffect(() => {
        if (!active) {
            return;
        }
        measure();
        let rafId = 0;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const loop = (now: number) => {
            const s = stateRef.current;
            const dt = Math.min(50, now - s.last) || 16;
            s.last = now;
            const was = s.p;

            if (reduced) {
                s.p = s.target;
            } else {
                s.p += (s.target - s.p) * (1 - Math.exp(-dt * 0.0072));
            }
            if (Math.abs(s.target - s.p) < 0.0004) {
                s.p = s.target;
            }
            if (s.p !== was || s.dirty) {
                s.dirty = false;
                paint();
            }

            s.cx += (s.mx - s.cx) * 0.32;
            s.cy += (s.my - s.cy) * 0.32;
            if (ringRef.current) {
                ringRef.current.style.transform = `translate3d(${s.cx.toFixed(1)}px,${s.cy.toFixed(1)}px,0)`;
            }

            rafId = requestAnimationFrame(loop);
        };

        rafId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(rafId);
    }, [active, measure, paint]);

    // ── Auto-play: advance one model every AUTO_ADVANCE_MS when active and not hovered/dragged ──
    useEffect(() => {
        if (!active || modalTwinIdx !== null) {
            return;
        }
        const id = window.setInterval(() => {
            const s = stateRef.current;
            // Pause while user is hovering or actively dragging
            if (hoveredRef.current || s.down) {
                return;
            }
            s.target = s.target + 1; // wraps naturally via the paint loop's modular arithmetic
        }, AUTO_ADVANCE_MS);
        return () => window.clearInterval(id);
    }, [active, modalTwinIdx]);

    const stepLook = (delta: number) => {
        const s = stateRef.current;
        // Allow wrapping past bounds — the paint loop's wrap() handles display correctly.
        // For manual buttons we still clamp so the user doesn't fly far off.
        const next = Math.round(s.target) + delta;
        s.target = clamp(next, 0, N - 1);
    };

    const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
        if (e.pointerType === 'mouse') {
            hoveredRef.current = true;
            const stage = stageRef.current;
            if (stage) {
                const r = stage.getBoundingClientRect();
                stateRef.current.mx = stateRef.current.cx = e.clientX - r.left;
                stateRef.current.my = stateRef.current.cy = e.clientY - r.top;
            }
            setCursorMode('ring');
        }
    };

    const handlePointerLeave = () => {
        hoveredRef.current = false;
        stateRef.current.hoveredModel = -1;
        setCursorMode('hidden');
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        const stage = stageRef.current;
        if (!stage) {
            return;
        }
        const s = stateRef.current;
        const r = stage.getBoundingClientRect();
        s.mx = e.clientX - r.left;
        s.my = e.clientY - r.top;

        if (s.down) {
            const pull = Math.max(150, s.W * 0.2);
            const dx = e.clientX - s.sx;
            s.moved = Math.max(s.moved, Math.abs(dx));
            s.target = s.st - dx / pull;
            return;
        }

        if (e.pointerType === 'mouse') {
            const targetEl = (e.target as HTMLElement | null)?.closest('[data-twin-model]') as HTMLElement | null;
            if (targetEl) {
                s.hoveredModel = Number(targetEl.dataset.twinModel);
                setCursorMode('view');
            } else {
                s.hoveredModel = -1;
                setCursorMode('ring');
            }
        }
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement | null)?.closest('button, a')) {
            return;
        }
        const s = stateRef.current;
        s.down = true;
        s.sx = e.clientX;
        s.st = s.target;
        s.moved = 0;
        e.currentTarget.setPointerCapture(e.pointerId);
        if (e.pointerType === 'mouse') {
            setCursorMode('drag');
        }
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        const s = stateRef.current;
        if (!s.down) {
            return;
        }
        s.down = false;

        if (s.moved < 6) {
            const hit = document
                .elementsFromPoint(e.clientX, e.clientY)
                .find((el) => el instanceof HTMLElement && el.dataset.twinModel !== undefined) as HTMLElement | undefined;

            if (hit && hit.dataset.twinModel !== undefined) {
                const clickedIdx = Number(hit.dataset.twinModel);
                let d = wrap(clickedIdx - s.target, N);
                d = Math.round(d);
                if (d > 0 && d < N) {
                    s.target = Math.round(s.target) + d;
                }
                // Open the Pose Preset modal for the clicked model ("click view show that model with diffrent pose preset")
                openModal(clickedIdx);
            }
        } else {
            s.target = Math.round(s.target);
        }

        if (e.pointerType === 'mouse') {
            const overModel = (e.target as HTMLElement | null)?.closest('[data-twin-model]');
            setCursorMode(overModel ? 'view' : 'ring');
        }
    };

    const activeTwin = DIGITAL_TWINS[activeTwinIdx] ?? DIGITAL_TWINS[0];

    return (
        <div className="relative h-full w-full overflow-hidden bg-white select-none">
            {/* Full-Frame Runway Stage matching demo/Digital Twins.html */}
            <section
                ref={stageRef}
                aria-label="Digital Twins runway lookbook. Hover a model and click View to inspect pose presets, or drag to step through looks."
                onPointerEnter={handlePointerEnter}
                onPointerLeave={handlePointerLeave}
                onPointerMove={handlePointerMove}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                className="relative h-full w-full overflow-hidden touch-pan-y select-none lg:cursor-none"
                style={{
                    background:
                        'linear-gradient(transparent 60%, rgba(255,255,255,0.72) 100%), linear-gradient(90deg, #f1f5fa 0%, #e7eff6 38%, #eef4f9 62%, #f6f9fc 100%)',
                }}
            >
                {/* 3D Perspective Diagonal Line of 6 Models */}
                <div className="absolute inset-0">
                    {DIGITAL_TWINS.map((twin, i) => (
                        <div
                            key={twin.lookNumber}
                            ref={(el) => {
                                modelRefs.current[i] = el;
                            }}
                            data-twin-model={i}
                            role="button"
                            tabIndex={0}
                            aria-label={`View ${twin.name} pose presets`}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    openModal(i);
                                }
                            }}
                            className="group absolute left-0 top-0 origin-top-left will-change-[transform,filter] lg:cursor-none"
                        >
                            {/* Contact Shadow under model feet */}
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute -bottom-[1.6%] left-[8%] right-[8%] h-[3.6%] rounded-[50%] bg-[radial-gradient(closest-side,rgba(70,85,105,0.24),transparent)]"
                            />
                            <TwinSpriteCrop twin={twin} className="relative block h-full w-full" />

                            {/* Model first-name label — fades in on hover */}
                            <span
                                aria-hidden="true"
                                className="font-michroma pointer-events-none absolute -bottom-5 left-1/2 w-max max-w-[140px] -translate-x-1/2 truncate text-center text-[8px] tracking-[0.14em] text-[#16191f]/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                            >
                                {twin.name.split(' — ')[0]}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Top-Left Intro Block (`.intro` in demo/Digital Twins.html) */}
                <div className="pointer-events-none absolute left-5 top-20 z-20 max-w-[420px] sm:left-10 sm:top-24 lg:left-14 lg:top-28">
                    <Eyebrow>01 / Digital Twins · AI Generated Imagery</Eyebrow>
                    <h2 className="font-michroma mt-2.5 text-[clamp(18px,2vw,26px)] font-normal leading-[1.2] tracking-[0.16em] text-[#16191f]">
                        Spring Summer 2027
                    </h2>
                    <p className="mt-3 hidden text-xs leading-[1.62] tracking-[0.012em] text-[#737b86] sm:block sm:text-sm">
                        A study in softness and strength. Shoot a garment once — our photoreal AI digital twins wear it
                        across every studio pose, lighting preset, and lookbook angle. Hover any model and click{' '}
                        <strong className="font-semibold text-[#16191f]">View</strong> to explore pose presets.
                    </p>
                </div>

                {/* Bottom-Left Rolling Look Counter + View Poses CTA (`.tag` in demo/Digital Twins.html) */}
                <div className="absolute bottom-6 left-5 z-20 sm:bottom-10 sm:left-10 lg:left-14">
                    <div
                        className="font-michroma pointer-events-none flex items-center gap-3 text-[clamp(22px,2.4vw,34px)] leading-[38px] tracking-[0.14em] text-[#16191f]"
                        aria-live="polite"
                    >
                        <span>Look</span>
                        <span className="h-[38px] overflow-hidden">
                            <span ref={rollRef} className="block will-change-transform">
                                {Array.from({ length: N + 1 }).map((_, idx) => (
                                    <b key={idx} className="block h-[38px] font-normal">
                                        {TWIN_FIRST_LOOK + (idx % N)}
                                    </b>
                                ))}
                            </span>
                        </span>
                    </div>

                    <p className="mt-0.5 text-xs font-medium text-[#737b86]">{activeTwin.name}</p>

                    <div className="mt-3 flex flex-wrap items-center gap-4">
                        <button
                            type="button"
                            onClick={() => openModal(activeTwinIdx)}
                            className="font-michroma inline-flex items-center gap-2 border-b border-[#16191f] pb-1 text-[10px] tracking-[0.14em] text-[#16191f] transition hover:opacity-70"
                        >
                            <Eye size={13} />
                            View Pose Presets (6 Poses)
                        </button>
                        <button
                            type="button"
                            onClick={openDemo}
                            className="font-michroma inline-block border-b border-[#737b86] pb-1 text-[10px] tracking-[0.14em] text-[#737b86] transition hover:border-[#16191f] hover:text-[#16191f]"
                        >
                            Create My Twin
                        </button>
                    </div>
                </div>

                {/* Bottom-Right Runway Navigation Controls */}
                <div className="absolute bottom-6 right-5 z-20 flex items-center gap-2.5 sm:bottom-10 sm:right-10 lg:right-14">
                    <button
                        type="button"
                        onClick={() => stepLook(-1)}
                        aria-label="Previous digital twin"
                        className="grid h-11 w-11 place-items-center rounded-full border border-[#16191f]/25 bg-white/80 text-[#16191f] backdrop-blur transition hover:bg-[#16191f] hover:text-white"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <button
                        type="button"
                        onClick={() => openModal(activeTwinIdx)}
                        className="font-michroma hidden h-11 items-center gap-2 rounded-full bg-[#16191f] px-5 text-[10px] tracking-[0.16em] text-white shadow-sm transition hover:bg-black sm:inline-flex"
                    >
                        <Eye size={14} />
                        View Poses
                    </button>
                    <button
                        type="button"
                        onClick={() => stepLook(1)}
                        aria-label="Next digital twin"
                        className="grid h-11 w-11 place-items-center rounded-full border border-[#16191f]/25 bg-white/80 text-[#16191f] backdrop-blur transition hover:bg-[#16191f] hover:text-white"
                    >
                        <ArrowRight size={18} />
                    </button>
                </div>

                {/* Custom Follower Cursor Ring — ring/drag/view modes */}
                <div
                    ref={ringRef}
                    aria-hidden="true"
                    className="pointer-events-none absolute left-0 top-0 z-[150] hidden lg:block"
                >
                    <div
                        className={`grid place-items-center transition-all duration-200 ease-out ${
                            cursorMode === 'hidden'
                                ? 'h-[96px] w-[96px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0'
                                : cursorMode === 'drag'
                                  ? 'h-[42px] w-[100px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[2px] border-[#16191f]/40 bg-white/50 opacity-100 backdrop-blur-sm'
                                  : cursorMode === 'view'
                                    ? 'h-[96px] w-[96px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/40 opacity-100 shadow-sm backdrop-blur-md ring-1 ring-white/60'
                                    : 'h-[42px] w-[42px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[2px] border-[#16191f]/50 opacity-100'
                        }`}
                    >
                        {cursorMode === 'view' && (
                            <span className="select-none text-[11px] font-semibold tracking-[0.18em] text-[#16191f]/80">
                                VIEW
                            </span>
                        )}
                        {cursorMode === 'drag' && (
                            <span className="font-michroma pl-[0.18em] text-[8px] tracking-[0.2em] text-[#16191f]">
                                DRAG
                            </span>
                        )}
                    </div>
                </div>
            </section>

            {/* Pose Preset Modal: Left side multi-pose gallery + Right sidebar Buy/Order buttons */}
            <TwinPresetModal
                twinIndex={modalTwinIdx}
                onSelectTwin={(idx) => {
                    stateRef.current.target = idx;
                    setModalTwinIdx(idx);
                }}
                onClose={closeModal}
                openDemo={openDemo}
            />
        </div>
    );
}
