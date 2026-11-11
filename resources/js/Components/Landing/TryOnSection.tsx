import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { Eyebrow, SectionProps } from './shared';
import { LOOKS } from './looks';

const LOOK_COUNT = LOOKS.length; // 6 looks
const ACTOR_COUNT = LOOK_COUNT * 2; // 12 actors around the 3D ring (6 looks × 2 clones)
const TAU = Math.PI * 2;
const MODEL_AR = 0.5625; // 9:16 model aspect ratio from demo

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const mod = (v: number, n: number) => ((v % n) + n) % n;

export function TryOnSection({ active, openDemo }: SectionProps) {
    const stageRef = useRef<HTMLDivElement | null>(null);
    const actorRefs = useRef<(HTMLDivElement | null)[]>([]);
    const cursorRef = useRef<HTMLSpanElement | null>(null);
    const cardRefs = useRef<(HTMLLIElement | null)[]>([]);

    const [index, setIndex] = useState(0);
    const [zoomed, setZoomed] = useState(false);
    const [playing, setPlaying] = useState(true);
    const [hotPin, setHotPin] = useState<number | null>(null);
    const [addedPieces, setAddedPieces] = useState<Record<string, boolean>>({});
    const [cursorState, setCursorState] = useState<{
        on: boolean;
        mode: 'drag' | 'view' | 'link';
        dragging: boolean;
    }>({
        on: false,
        mode: 'drag',
        dragging: false,
    });

    // Mutable physics & layout state matching demo/hero & Virtual try on section/src/app.js
    const simRef = useRef({
        W: 0,
        H: 0,
        cx: 0,
        R: 0,
        P: 0,
        floor: 0,
        horizon: 0,
        fs: 1.08,
        modelH: 480,
        unit: 180,
        cur: 0,
        target: 0,
        vel: 0,
        last: 0,
        dragging: false,
        sx: 0,
        sy: 0,
        startTarget: 0,
        moved: 0,
        cursorX: 0,
        cursorY: 0,
        cursorTX: 0,
        cursorTY: 0,
        engaged: false,
    });

    const placeRing = useCallback(() => {
        const s = simRef.current;
        if (!s.W || !s.H) {
            return;
        }
        const step = TAU / ACTOR_COUNT;
        const modelW = s.modelH * MODEL_AR;

        for (let a = 0; a < ACTOR_COUNT; a++) {
            const el = actorRefs.current[a];
            if (!el) {
                continue;
            }
            let phi = ((a - s.cur) * step) % TAU;
            if (phi > Math.PI) {
                phi -= TAU;
            }
            if (phi < -Math.PI) {
                phi += TAU;
            }

            const z = s.R * (1 - Math.cos(phi));
            const sl = Math.abs(phi) / step;
            const p = (s.P / (s.P + z)) * (1 + (s.fs - 1) * clamp(1 - sl, 0, 1));
            const x = s.cx + s.R * Math.sin(phi) * (s.P / (s.P + z));
            const feet = s.horizon + (s.floor - s.horizon) * (s.P / (s.P + z));
            const bottom = s.H - feet;
            const blur = sl <= 1 ? 1.8 * sl : Math.min(1.8 + (sl - 1) * 2, 6.5);

            let o = clamp((Math.cos(phi) + 0.55) / 0.3, 0, 1);
            const half = modelW * p * 0.5;
            if (x + half < -4 || x - half > s.W + 4) {
                o = 0;
            }

            const st = el.style;
            st.height = `${s.modelH}px`;
            st.width = `${Math.round(modelW)}px`;
            st.transform = `translate3d(${x.toFixed(2)}px,${(-bottom).toFixed(2)}px,0) translateX(-50%) scale(${p.toFixed(4)})`;
            st.opacity = o.toFixed(3);
            st.zIndex = String(Math.round(p * 1000));
            st.visibility = o < 0.01 ? 'hidden' : 'visible';
            st.pointerEvents = o < 0.5 ? 'none' : 'auto';
            const bb = Math.round(blur * 10) / 10;
            st.filter = bb > 0.08 ? `blur(${bb}px)` : 'none';

            // Mark front actor vs side actors
            const isFrontActor = sl < 0.35;
            el.dataset.frontActor = isFrontActor ? 'true' : 'false';
        }
    }, []);

    const measure = useCallback(() => {
        const stage = stageRef.current;
        if (!stage) {
            return;
        }
        const r = stage.getBoundingClientRect();
        const W = r.width;
        const H = r.height;
        if (!W || !H) {
            return;
        }
        const mobile = window.innerWidth <= 749;
        const s = simRef.current;
        s.W = W;
        s.H = H;
        s.fs = 1.08;
        s.modelH = Math.max(200, Math.round((H - 34 - 18) / s.fs));
        s.cx = W * 0.5;
        s.R = W * (mobile ? 0.72 : 0.62);
        s.P = W * (mobile ? 1.9 : 1.65);
        s.floor = H - 34;
        s.horizon = H * 0.36;
        s.unit = Math.max(mobile ? 90 : 120, W * 0.3);
        placeRing();
    }, [placeRing]);

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

    // Spring animation loop for the 3D ring + smooth cursor follower
    useEffect(() => {
        if (!active) {
            return;
        }
        measure();
        let rafId = 0;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const K = 150;
        const C = 2 * Math.sqrt(K);
        const sub = 3;

        const step = (t: number) => {
            const s = simRef.current;
            const dt = s.last ? Math.min(0.034, (t - s.last) / 1000) : 1 / 60;
            s.last = t;
            const h = dt / sub;

            if (reduced) {
                s.cur = s.target;
                s.vel = 0;
            } else {
                for (let j = 0; j < sub; j++) {
                    const acc = -K * (s.cur - s.target) - C * s.vel;
                    s.vel += acc * h;
                    s.cur += s.vel * h;
                }
                if (Math.abs(s.cur - s.target) <= 0.0005 && Math.abs(s.vel) <= 0.0005) {
                    s.cur = s.target;
                    s.vel = 0;
                }
            }

            placeRing();

            // Cursor inertia (trails pointer with k = 0.18 just like demo)
            const k = reduced ? 1 : 0.18;
            s.cursorX += (s.cursorTX - s.cursorX) * k;
            s.cursorY += (s.cursorTY - s.cursorY) * k;
            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate3d(${s.cursorX.toFixed(1)}px,${s.cursorY.toFixed(1)}px,0)`;
            }

            rafId = requestAnimationFrame(step);
        };

        rafId = requestAnimationFrame(step);
        return () => cancelAnimationFrame(rafId);
    }, [active, measure, placeRing]);

    const moveTo = useCallback((nextTarget: number) => {
        const s = simRef.current;
        s.target = nextTarget;
        const nextIdx = mod(Math.round(nextTarget), LOOK_COUNT);
        setIndex(nextIdx);
        setHotPin(null);
    }, []);

    const goToLook = useCallback(
        (targetLookIdx: number) => {
            const s = simRef.current;
            const currentLookIdx = mod(Math.round(s.target), LOOK_COUNT);
            let d = mod(targetLookIdx - currentLookIdx, LOOK_COUNT);
            if (d > LOOK_COUNT / 2) {
                d -= LOOK_COUNT;
            }
            moveTo(Math.round(s.target) + d);
        },
        [moveTo],
    );

    const nextLook = useCallback(() => {
        moveTo(Math.round(simRef.current.target) + 1);
    }, [moveTo]);

    const prevLook = useCallback(() => {
        moveTo(Math.round(simRef.current.target) - 1);
    }, [moveTo]);

    // Autoplay timer (5000ms matching data-speed="5000")
    useEffect(() => {
        if (!active || !playing || zoomed) {
            return;
        }
        const timer = window.setTimeout(() => {
            if (!simRef.current.dragging) {
                nextLook();
            }
        }, 5000);
        return () => window.clearTimeout(timer);
    }, [active, playing, zoomed, index, nextLook]);

    // Close zoom popup on Escape
    useEffect(() => {
        if (!zoomed) {
            return;
        }
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                e.stopPropagation();
                setZoomed(false);
                setHotPin(null);
            }
        };
        window.addEventListener('keydown', onKey, true);
        return () => window.removeEventListener('keydown', onKey, true);
    }, [zoomed]);

    const handleStagePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        const stage = stageRef.current;
        if (!stage) {
            return;
        }
        const s = simRef.current;
        const r = stage.getBoundingClientRect();
        s.cursorTX = e.clientX - r.left;
        s.cursorTY = e.clientY - r.top;

        if (!cursorState.on && e.pointerType === 'mouse') {
            s.cursorX = s.cursorTX;
            s.cursorY = s.cursorTY;
        }

        if (s.dragging) {
            const dx = e.clientX - s.sx;
            s.moved = Math.max(s.moved, Math.abs(dx));
            s.target = s.startTarget - dx / s.unit;
            const liveIdx = mod(Math.round(s.target), LOOK_COUNT);
            if (liveIdx !== index) {
                setIndex(liveIdx);
            }
            return;
        }

        if (e.pointerType === 'mouse') {
            const actorEl = (e.target as HTMLElement | null)?.closest('[data-actor-index]') as HTMLElement | null;
            const isFront = actorEl?.dataset.frontActor === 'true';
            const isSide = Boolean(actorEl && !isFront);
            const nextMode: 'drag' | 'view' | 'link' = isFront ? 'view' : isSide ? 'link' : 'drag';
            setCursorState((prev) =>
                prev.on && prev.mode === nextMode && !prev.dragging
                    ? prev
                    : { on: true, mode: nextMode, dragging: false },
            );
        }
    };

    const handleStagePointerLeave = () => {
        setCursorState((prev) => ({ ...prev, on: false, dragging: false }));
    };

    const handleStagePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if (zoomed) {
            return;
        }
        const s = simRef.current;
        s.dragging = true;
        s.sx = e.clientX;
        s.sy = e.clientY;
        s.startTarget = s.target;
        s.moved = 0;
        e.currentTarget.setPointerCapture(e.pointerId);
        if (e.pointerType === 'mouse') {
            setCursorState((prev) => ({ ...prev, on: true, dragging: true }));
        }
    };

    const handleStagePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        const s = simRef.current;
        if (!s.dragging) {
            return;
        }
        s.dragging = false;

        if (s.moved < 8) {
            // Click without drag: check if user clicked a model
            const hit = document
                .elementsFromPoint(e.clientX, e.clientY)
                .find((el) => el instanceof HTMLElement && el.dataset.actorIndex !== undefined) as
                | HTMLElement
                | undefined;

            if (hit) {
                const actorIdx = Number(hit.dataset.actorIndex);
                const isFront = hit.dataset.frontActor === 'true';
                if (isFront) {
                    // Clicking the front model opens the Look Popup / Zoom Modal (`rw__lb`)!
                    setPlaying(false);
                    setZoomed(true);
                } else {
                    // Clicking a side model in the ring rotates it to the front
                    let diff = ((actorIdx - Math.round(s.target)) % ACTOR_COUNT + ACTOR_COUNT) % ACTOR_COUNT;
                    if (diff > ACTOR_COUNT / 2) {
                        diff -= ACTOR_COUNT;
                    }
                    moveTo(Math.round(s.target) + diff);
                }
            } else {
                moveTo(Math.round(s.target));
            }
        } else {
            moveTo(Math.round(s.target));
        }

        if (e.pointerType === 'mouse') {
            setCursorState((prev) => ({ ...prev, dragging: false }));
        }
    };

    const handlePinSelect = (pinIdx: number) => {
        setHotPin(pinIdx);
        const card = cardRefs.current[pinIdx];
        if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        }
    };

    const toggleAddPiece = (pieceKey: string) => {
        setAddedPieces((prev) => ({ ...prev, [pieceKey]: !prev[pieceKey] }));
    };

    const currentLook = LOOKS[index] ?? LOOKS[0];

    return (
        <div className="relative grid h-full w-full grid-cols-1 overflow-hidden bg-white pt-16 text-[#151413] sm:pt-20 lg:grid-cols-[minmax(0,1fr)_380px]">
            {/* LEFT COLUMN: Header + 3D Ring Runway Stage + Bottom Controls + Look Zoom Popup (`rw__lb`) */}
            <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
                {/* Header (`rw__head`) */}
                <div
                    className={`relative z-10 flex items-end justify-between gap-6 px-5 pt-3 transition-opacity duration-300 sm:px-10 sm:pt-5 lg:px-14 ${
                        zoomed ? 'pointer-events-none opacity-0' : 'opacity-100'
                    }`}
                >
                    <div className="flex flex-col gap-1.5">
                        <Eyebrow>02 / Virtual Try-On</Eyebrow>
                        <h2 className="text-[clamp(28px,3.8vw,46px)] font-normal leading-[1.06] tracking-[-0.02em] text-[#151413]">
                            Try the Look.
                        </h2>
                        <p className="max-w-[38ch] text-xs leading-[1.55] text-[#66625c]">
                            Six looks, styled head to toe. Tap the front model to view pins, or drag to spin the runway.
                        </p>
                    </div>
                </div>

                {/* 3D Ring Runway Stage (`rw__stage`) */}
                <div
                    ref={stageRef}
                    role="region"
                    aria-roledescription="carousel"
                    aria-label="Try the Look — drag or click a model to rotate the ring, click the front model to view outfit pins"
                    onPointerMove={handleStagePointerMove}
                    onPointerLeave={handleStagePointerLeave}
                    onPointerDown={handleStagePointerDown}
                    onPointerUp={handleStagePointerUp}
                    onPointerCancel={handleStagePointerUp}
                    className={`relative min-h-0 flex-1 overflow-hidden touch-pan-y select-none ${
                        cursorState.on ? 'lg:cursor-none' : 'cursor-grab active:cursor-grabbing'
                    }`}
                >
                    {/* Stage Atmosphere: Floor Gradient + Breathing Spotlight + Haze */}
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] bg-[linear-gradient(to_top,rgba(21,20,19,0.07),rgba(21,20,19,0.02)_55%,transparent)]"
                    />
                    <div
                        aria-hidden="true"
                        className="animate-rw-breathe pointer-events-none absolute -bottom-[16%] left-1/2 aspect-[2.4] w-[min(60%,680px)] bg-[radial-gradient(closest-side,rgba(255,255,255,0.75),rgba(255,255,255,0.25)_55%,rgba(255,255,255,0))] mix-blend-soft-light"
                    />

                    {/* 12 Ring Actors (`rw__actors`) */}
                    <div
                        className={`absolute inset-0 transition-opacity duration-300 ${
                            zoomed ? 'pointer-events-none opacity-0' : 'opacity-100'
                        }`}
                    >
                        {Array.from({ length: ACTOR_COUNT }).map((_, actorIdx) => {
                            const lookIdx = actorIdx % LOOK_COUNT;
                            const lookItem = LOOKS[lookIdx];
                            return (
                                <div
                                    key={actorIdx}
                                    ref={(el) => {
                                        actorRefs.current[actorIdx] = el;
                                    }}
                                    data-actor-index={actorIdx}
                                    data-look-index={lookIdx}
                                    className=" absolute bottom-0 left-0 origin-bottom opacity-0 will-change-[transform,opacity]"
                                >
                                    {/* Contact Shadow (`.rw__shadow`) */}
                                    <span
                                        aria-hidden="true"
                                        className="pointer-events-none absolute bottom-0 left-[58%] h-[9%] max-h-[46px] min-h-[14px] w-[150%] -translate-x-1/2 translate-y-1/2 bg-[radial-gradient(closest-side,rgba(20,16,12,0.30),rgba(20,16,12,0.14)_45%,rgba(20,16,12,0.04)_75%,transparent)] blur-[2px]"
                                    />
                                    <div className="relative h-full w-full">
                                        <img
                                            src={lookItem.model}
                                            srcSet={`${lookItem.model} 640w, ${lookItem.modelHiRes} 1080w`}
                                            sizes="(min-width: 1800px) 540px, (min-width: 750px) 420px, 320px"
                                            alt={lookItem.name}
                                            draggable={false}
                                            className="pointer-events-none absolute inset-0 block h-full w-full object-contain object-bottom select-none"
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Custom Frosted 84×84px Cursor (`rw__cursor`) showing DRAG or VIEW */}
                    <span
                        ref={cursorRef}
                        aria-hidden="true"
                        className="pointer-events-none absolute left-0 top-0 z-[1700] hidden h-0 w-0 will-change-transform lg:block"
                    >
                        <span
                            className={`absolute -left-[42px] -top-[42px] grid h-[84px] w-[84px] place-items-center rounded-full border backdrop-blur-[6px] transition-all duration-300 ${
                                !cursorState.on || zoomed
                                    ? 'scale-30 border-[#151413]/25 bg-white/40 text-[#151413] opacity-0'
                                    : cursorState.dragging
                                      ? 'scale-75 border-[#0e0e0e] bg-[#0e0e0e] text-white opacity-100'
                                      : cursorState.mode === 'link'
                                        ? 'scale-20 border-transparent bg-[#0e0e0e] text-white opacity-100'
                                        : 'scale-100 border-[#151413]/28 bg-white/45 text-[#151413] opacity-100'
                            }`}
                        >
                            {cursorState.mode !== 'link' && (
                                <span
                                    className={`pl-[0.24em] text-[10px] font-medium uppercase transition-all ${
                                        cursorState.dragging ? 'tracking-[0.42em]' : 'tracking-[0.24em]'
                                    }`}
                                >
                                    {cursorState.mode === 'view' && !cursorState.dragging ? 'View' : 'Drag'}
                                </span>
                            )}
                        </span>
                    </span>
                </div>

                {/* Bottom Controls (`rw__controls`) */}
                <div
                    className={`relative z-10 flex items-center gap-3 px-4 pb-5 pt-1.5 transition-opacity duration-300 sm:gap-5 sm:px-11 sm:pb-7 ${
                        zoomed ? 'pointer-events-none opacity-0' : 'opacity-100'
                    }`}
                >
                    <button
                        type="button"
                        onClick={prevLook}
                        aria-label="Previous look"
                        className="group relative grid h-11 w-11 shrink-0 place-items-center text-[#151413] transition hover:opacity-75"
                    >
                        <svg
                            width="26"
                            height="14"
                            viewBox="0 0 26 14"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="transition-transform duration-300 group-hover:-translate-x-1"
                        >
                            <path d="M25 7H1M7 1L1 7l6 6" />
                        </svg>
                    </button>

                    {/* 6 Expanding Progress Ticks (`rw__ticks`) */}
                    <div className="flex min-w-0 flex-1 items-center gap-1.5">
                        {LOOKS.map((l, i) => {
                            const isCurrent = i === index;
                            const isPast = i < index;
                            return (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => goToLook(i)}
                                    aria-current={isCurrent ? 'true' : 'false'}
                                    aria-label={`Look ${i + 1}: ${l.name}`}
                                    className={`group flex h-11 flex-col justify-center gap-2 text-left transition-all duration-500 ${
                                        isCurrent
                                            ? 'w-[140px] shrink-0 text-[#151413] sm:w-[190px]'
                                            : 'min-w-[14px] flex-1 basis-[44px] text-[#66625c] hover:text-[#151413]'
                                    }`}
                                >
                                    <span className="relative block h-[2px] w-full overflow-hidden bg-[#151413]/14 transition-transform group-hover:scale-y-150">
                                        <span
                                            key={isCurrent && playing && !zoomed ? `run-${index}` : `still-${i}`}
                                            className={` absolute inset-0 origin-left bg-[#0e0e0e] ${
                                                isCurrent
                                                    ? playing && !zoomed
                                                        ? 'animate-rw-fill'
                                                        : 'scale-x-100'
                                                    : isPast
                                                      ? 'scale-x-100 opacity-35'
                                                      : 'scale-x-0'
                                            }`}
                                        />
                                    </span>
                                    <span className="block truncate text-[10px] tracking-[0.12em] tabular-nums">
                                        {String(i + 1).padStart(2, '0')}
                                        {isCurrent && (
                                            <span className="ml-2 hidden sm:inline">{l.name}</span>
                                        )}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Autoplay Toggle (`rw__auto`) */}
                    <button
                        type="button"
                        onClick={() => setPlaying((p) => !p)}
                        aria-pressed={playing}
                        aria-label="Toggle autoplay"
                        className="grid h-11 w-11 shrink-0 place-items-center text-[#151413] transition hover:opacity-75"
                    >
                        {playing ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M6.5 4.5h3.5v15H6.5zM14 4.5h3.5v15H14z" />
                            </svg>
                        ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M7 4.5v15l12.5-7.5z" />
                            </svg>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={nextLook}
                        aria-label="Next look"
                        className="group relative grid h-11 w-11 shrink-0 place-items-center text-[#151413] transition hover:opacity-75"
                    >
                        <svg
                            width="26"
                            height="14"
                            viewBox="0 0 26 14"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="transition-transform duration-300 group-hover:translate-x-1"
                        >
                            <path d="M1 7h24M19 1l6 6-6 6" />
                        </svg>
                    </button>
                </div>

                {/* LOOK POPUP / ZOOM MODAL (`rw__lb`) — Opens when clicking the front model */}
                <div
                    role="region"
                    aria-label="View look"
                    aria-hidden={!zoomed}
                    className={`absolute inset-0 z-40 transition-all duration-500 ${
                        zoomed ? 'visible pointer-events-auto opacity-100' : 'invisible pointer-events-none opacity-0'
                    }`}
                >
                    {/* Solid White Stage Backdrop (`rw__lb::before`) */}
                    <div
                        onClick={() => {
                            setZoomed(false);
                            setHotPin(null);
                        }}
                        className="absolute inset-0 cursor-zoom-out bg-white"
                    />

                    {/* Zoomed Front Model + Pulsing Numbered Pins (`rw__lb-stage`) */}
                    <div
                        onClick={(e) => {
                            if (e.target === e.currentTarget) {
                                setZoomed(false);
                                setHotPin(null);
                            }
                        }}
                        className="absolute inset-x-4 bottom-11 top-20 flex cursor-zoom-out items-end justify-center sm:inset-x-12 sm:bottom-12 sm:top-22"
                    >
                        <div
                            className={`relative h-full aspect-[9/16] max-h-full cursor-default transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                                zoomed ? 'scale-100 translate-y-0' : 'scale-90 translate-y-6'
                            }`}
                        >
                            {/* Contact Shadow */}
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute bottom-0 left-[58%] h-[9%] max-h-[46px] min-h-[14px] w-[150%] -translate-x-1/2 translate-y-1/2 bg-[radial-gradient(closest-side,rgba(20,16,12,0.30),rgba(20,16,12,0.14)_45%,rgba(20,16,12,0.04)_75%,transparent)] blur-[2px]"
                            />

                            <img
                                src={currentLook.modelHiRes}
                                alt={currentLook.name}
                                draggable={false}
                                className="pointer-events-none h-full w-full object-contain object-bottom select-none"
                            />

                            {/* Numbered Outfit Pins (`1`, `2`, `3`) with double pulsing rings & glass tooltip */}
                            <div className="absolute inset-0 z-10">
                                {currentLook.pins.map((pinPos, pinIdx) => {
                                    const pieceItem = currentLook.pieces[pinIdx];
                                    const isHot = hotPin === pinIdx;
                                    return (
                                        <button
                                            key={pinIdx}
                                            type="button"
                                            style={{ left: `${pinPos.left}%`, top: `${pinPos.top}%` }}
                                            aria-label={`${pinIdx + 1}: ${pieceItem?.name ?? ''}`}
                                            onMouseEnter={() => setHotPin(pinIdx)}
                                            onMouseLeave={() => setHotPin(null)}
                                            onFocus={() => setHotPin(pinIdx)}
                                            onBlur={() => setHotPin(null)}
                                            onClick={() => handlePinSelect(pinIdx)}
                                            className="group absolute -ml-[22px] -mt-[22px] grid h-[44px] w-[44px] cursor-pointer place-items-center"
                                        >
                                            <span
                                                className={`relative grid h-6 w-6 place-items-center rounded-full text-[11px] font-semibold leading-none shadow-[0_4px_14px_-4px_rgba(0,0,0,0.35)] backdrop-blur-[6px] transition-all duration-300 ${
                                                    isHot
                                                        ? 'scale-130 bg-[#0e0e0e] text-white shadow-[0_0_0_6px_rgba(14,14,14,0.22),0_8px_20px_-6px_rgba(0,0,0,0.45)]'
                                                        : 'bg-white/88 text-[#151413] group-hover:scale-130 group-hover:bg-[#0e0e0e] group-hover:text-white'
                                                }`}
                                            >
                                                <span
                                                    aria-hidden="true"
                                                    className="animate-rw-ring pointer-events-none absolute -inset-[5px] rounded-full border border-white/80"
                                                />
                                                <span
                                                    aria-hidden="true"
                                                    className="animate-rw-ring-delayed pointer-events-none absolute -inset-[5px] rounded-full border border-white/55"
                                                />
                                                {pinIdx + 1}
                                            </span>

                                            {/* Frosted Glass Tooltip (`rw__pin::after`) */}
                                            {pieceItem && (
                                                <span
                                                    className={`pointer-events-none absolute left-[calc(100%-6px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-medium tracking-[0.04em] text-[#151413] shadow-[0_10px_26px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md transition-all duration-300 ${
                                                        isHot
                                                            ? 'translate-x-0 scale-100 opacity-100'
                                                            : '-translate-x-2 scale-95 opacity-0 group-hover:translate-x-0 group-hover:scale-100 group-hover:opacity-100'
                                                    }`}
                                                >
                                                    {pieceItem.name}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Top Bar (`rw__lb-top`): Look Number + Look Name + Rotating Close Button */}
                    <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-4 px-6 pt-5 sm:px-12 sm:pt-7">
                        <p className="flex flex-col gap-1">
                            <span className="text-[10px] tracking-[0.2em] uppercase text-[#66625c] tabular-nums">
                                Look {String(index + 1).padStart(2, '0')}
                            </span>
                            <span className="text-lg font-normal leading-[1.1] text-[#151413] sm:text-xl">
                                {currentLook.name}
                            </span>
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                setZoomed(false);
                                setHotPin(null);
                            }}
                            aria-label="Close look view"
                            className="pointer-events-auto grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[#151413]/22 bg-white/65 text-[#151413] backdrop-blur-md transition-all duration-500 hover:rotate-90 hover:border-[#151413]"
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                aria-hidden="true"
                            >
                                <path d="M5 5l14 14M19 5L5 19" />
                            </svg>
                        </button>
                    </div>

                    {/* Bottom Hint (`rw__lb-hint`) */}
                    <p className="pointer-events-none absolute inset-x-0 bottom-4 text-center text-[10px] tracking-[0.2em] uppercase text-[#66625c]">
                        Tap a dot to shop the piece
                    </p>
                </div>
            </div>

            {/* RIGHT SIDEBAR (`rw__panel`, 380px on desktop, border-l #c8c8c8) */}
            <aside
                aria-label="In this look"
                className="relative flex flex-col border-t border-[#c8c8c8] bg-white lg:border-l lg:border-t-0"
            >
                {/* Desktop Panel Header (`rw__panel-head`) */}
                <div className="hidden items-baseline justify-between gap-3 px-8 pb-4 pt-8 lg:flex">
                    <h3 className="text-[26px] font-normal leading-[1.1] text-[#151413]">In this look</h3>
                    <span className="text-[10px] tracking-[0.16em] uppercase text-[#66625c]">
                        {currentLook.pieces.length} pieces
                    </span>
                </div>

                {/* Mobile Docked Header (`rw__mhead`) */}
                <div className="flex items-baseline justify-between gap-3 px-5 pb-1.5 pt-3 lg:hidden">
                    <span className="truncate text-base font-medium text-[#151413]">{currentLook.name}</span>
                    <span className="text-[10px] tracking-[0.16em] uppercase text-[#66625c]">
                        {currentLook.pieces.length} pieces
                    </span>
                </div>

                {/* 3 Piece Items List (`rw__items` — full-height divided list on desktop, horizontal scroll row on mobile) */}
                <ul
                    data-scrollable
                    role="list"
                    className="flex flex-row gap-4 overflow-x-auto px-5 pb-4 pt-2 lg:flex-1 lg:flex-col lg:justify-between lg:gap-0 lg:overflow-y-auto lg:px-8 lg:pb-7 lg:pt-1.5"
                >
                    {currentLook.pieces.map((pieceItem, i) => {
                        const isHot = hotPin === i;
                        const pieceKey = `${index}-${i}`;
                        const isAdded = Boolean(addedPieces[pieceKey]);

                        return (
                            <li
                                key={`${index}-${pieceItem.name}-${i}`}
                                ref={(el) => {
                                    cardRefs.current[i] = el;
                                }}
                                onMouseEnter={() => setHotPin(i)}
                                onMouseLeave={() => setHotPin(null)}
                                className={`group relative grid shrink-0 grid-cols-[72px_minmax(0,1fr)_40px] items-center gap-x-3.5 py-2 transition-colors sm:grid-cols-[92px_minmax(0,1fr)_44px] lg:flex-1 lg:grid-cols-[106px_minmax(0,1fr)_44px] lg:gap-x-[18px] lg:border-t lg:border-[#c8c8c8] lg:py-4 lg:last:border-b ${
                                    isHot ? 'bg-[#151413]/[0.03]' : ''
                                } min-w-[250px] lg:min-w-0`}
                            >
                                {/* Optional "New" swinging tag (`rw__tag`) */}
                                {pieceItem.tag && (
                                    <span
                                        aria-hidden="true"
                                        className="pointer-events-none absolute left-2 top-2 z-10 flex flex-col items-start"
                                    >
                                        <span className="rounded-[2px] bg-[#151413] px-1.5 py-1 text-[9px] font-semibold tracking-[0.14em] uppercase text-white">
                                            {pieceItem.tag}
                                        </span>
                                    </span>
                                )}

                                {/* Product Media Thumbnail (`rw__media` 4/5 aspect ratio + top-right number badge) */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (!zoomed) {
                                            setPlaying(false);
                                            setZoomed(true);
                                        }
                                        setHotPin(i);
                                    }}
                                    className="relative block aspect-[4/5] w-full overflow-hidden bg-[#f3f3f3] text-left"
                                >
                                    <img
                                        src={pieceItem.image}
                                        alt={pieceItem.name}
                                        loading="lazy"
                                        className="block h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <span
                                        className={`absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full text-[10px] font-semibold transition-all duration-300 ${
                                            isHot
                                                ? 'scale-110 bg-[#0e0e0e] text-white'
                                                : 'bg-white/90 text-[#151413] group-hover:scale-110 group-hover:bg-[#0e0e0e] group-hover:text-white'
                                        }`}
                                    >
                                        {i + 1}
                                    </span>
                                </button>

                                {/* Brand & Product Name (`rw__info`) */}
                                <div className="flex min-w-0 flex-col gap-1">
                                    <span className="truncate text-[10px] tracking-[0.14em] uppercase text-[#66625c]">
                                        {pieceItem.brand}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={openDemo}
                                        className="self-start text-left text-[13px] font-medium leading-[1.3] text-[#151413] underline-offset-4 hover:underline"
                                    >
                                        {pieceItem.name}
                                    </button>
                                </div>

                                {/* Add / Shortlist Action Button (`rw__add`) */}
                                <button
                                    type="button"
                                    onClick={() => toggleAddPiece(pieceKey)}
                                    aria-label={`Select ${pieceItem.name}`}
                                    className={`grid h-10 w-10 place-items-center rounded-full border transition-all duration-300 ${
                                        isAdded
                                            ? 'border-[#0e0e0e] bg-[#0e0e0e] text-white'
                                            : 'border-[#151413]/20 text-[#151413] hover:rotate-90 hover:border-[#151413]'
                                    }`}
                                >
                                    {isAdded ? <Check size={16} /> : <Plus size={16} />}
                                </button>

                                {/* Bottom Active Highlight Line (`rw__item::after`) */}
                                <span
                                    aria-hidden="true"
                                    className={`pointer-events-none absolute inset-x-0 -bottom-px hidden h-px origin-left bg-[#0e0e0e] transition-transform duration-500 lg:block ${
                                        isHot ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                    }`}
                                />
                            </li>
                        );
                    })}
                </ul>
            </aside>
        </div>
    );
}
