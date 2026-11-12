import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Check,
    Heart,
    Plus,
    RotateCcw,
    X,
    ZoomIn,
    ZoomOut,
} from 'lucide-react';
import { Eyebrow, Reveal, SectionProps } from './shared';
import { LOOKS } from './looks';

const LOOK_COUNT = LOOKS.length; // 6 looks
const ACTOR_COUNT = LOOK_COUNT * 2; // 12 actors around the 3D ring (6 looks × 2 clones)
const TAU = Math.PI * 2;
const MODEL_AR = 0.5625; // 9:16 model aspect ratio from demo

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const mod = (v: number, n: number) => ((v % n) + n) % n;

export function TryOnSection({ active, openDemo, onOverlayChange }: SectionProps) {
    const stageRef = useRef<HTMLDivElement | null>(null);
    const actorRefs = useRef<(HTMLDivElement | null)[]>([]);
    const cursorRef = useRef<HTMLSpanElement | null>(null);
    const cardRefs = useRef<(HTMLLIElement | null)[]>([]);

    const [index, setIndex] = useState(0);
    const [zoomed, setZoomed] = useState(false);
    const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
    const [playing, setPlaying] = useState(true);
    const [hotPin, setHotPin] = useState<number | null>(null);
    const [addedPieces, setAddedPieces] = useState<Record<string, boolean>>({});
    const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

    const toggleWishlist = (pieceKey: string) => {
        setWishlist((prev) => ({ ...prev, [pieceKey]: !prev[pieceKey] }));
    };

    // 1. DRESS ITEM ZOOM & PAN STATE
    const [dressZoom, setDressZoom] = useState(1);
    const [dressPan, setDressPan] = useState({ x: 0, y: 0 });
    const [isDraggingDress, setIsDraggingDress] = useState(false);
    const dressDragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
    const dressContainerRef = useRef<HTMLDivElement | null>(null);

    // 2. MODEL ZOOM & PAN STATE
    const [modelZoom, setModelZoom] = useState(1);
    const [modelPan, setModelPan] = useState({ x: 0, y: 0 });
    const [isDraggingModel, setIsDraggingModel] = useState(false);
    const modelDragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
    const modelContainerRef = useRef<HTMLDivElement | null>(null);

    const [cursorState, setCursorState] = useState<{
        on: boolean;
        mode: 'drag' | 'view' | 'link';
        dragging: boolean;
    }>({
        on: false,
        mode: 'drag',
        dragging: false,
    });

    // Notify parent (Home.tsx) to lock fullpage scroll when the look view is active
    useEffect(() => {
        onOverlayChange?.(zoomed);
        return () => {
            onOverlayChange?.(false);
        };
    }, [zoomed, onOverlayChange]);

    // Reset dress zoom when switching piece or look
    useEffect(() => {
        setDressZoom(1);
        setDressPan({ x: 0, y: 0 });
        setIsDraggingDress(false);
    }, [selectedPiece, index]);

    // Reset model zoom when closing or changing look
    useEffect(() => {
        if (!zoomed) {
            setModelZoom(1);
            setModelPan({ x: 0, y: 0 });
            setIsDraggingModel(false);
        }
    }, [zoomed, index]);

    // Physics state for 3D Ring Runway
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

    const handleCloseLook = useCallback(() => {
        setZoomed(false);
        setSelectedPiece(null);
        setHotPin(null);
        setModelZoom(1);
        setModelPan({ x: 0, y: 0 });
        setDressZoom(1);
        setDressPan({ x: 0, y: 0 });
        onOverlayChange?.(false);
    }, [onOverlayChange]);

    useEffect(() => {
        if (!zoomed) {
            return;
        }
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                e.stopPropagation();
                if (selectedPiece !== null) {
                    setSelectedPiece(null);
                } else {
                    handleCloseLook();
                }
            }
        };
        window.addEventListener('keydown', onKey, true);
        return () => window.removeEventListener('keydown', onKey, true);
    }, [zoomed, selectedPiece, handleCloseLook]);

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
            const elements = document.elementsFromPoint(e.clientX, e.clientY);
            let hitActor: HTMLElement | null = null;
            for (const el of elements) {
                if (el instanceof HTMLElement) {
                    const match = el.dataset.actorIndex !== undefined ? el : el.closest<HTMLElement>('[data-actor-index]');
                    if (match) {
                        hitActor = match;
                        break;
                    }
                }
            }

            if (hitActor) {
                const actorIdx = Number(hitActor.dataset.actorIndex);
                const isFront = hitActor.dataset.frontActor === 'true';
                if (isFront) {
                    setPlaying(false);
                    setZoomed(true);
                    setSelectedPiece(null);
                } else {
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

    // DRESS ITEM ZOOM HANDLERS
    const zoomInDress = () => setDressZoom((z) => Math.min(2.5, Number((z + 0.4).toFixed(2))));
    const zoomOutDress = () => {
        setDressZoom((z) => {
            const next = Math.max(1, Number((z - 0.4).toFixed(2)));
            if (next === 1) setDressPan({ x: 0, y: 0 });
            return next;
        });
    };
    const resetDressZoom = () => {
        setDressZoom(1);
        setDressPan({ x: 0, y: 0 });
    };
    const doubleClickDress = () => {
        if (dressZoom > 1) {
            resetDressZoom();
        } else {
            setDressZoom(1.8);
        }
    };
    const handleDressWheel = (e: React.WheelEvent) => {
        e.stopPropagation();
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.2 : -0.2;
        setDressZoom((z) => {
            const next = clamp(Number((z + delta).toFixed(2)), 1, 2.5);
            if (next === 1) setDressPan({ x: 0, y: 0 });
            return next;
        });
    };
    const handleDressPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if (dressZoom <= 1) return;
        setIsDraggingDress(true);
        dressDragStart.current = { x: e.clientX, y: e.clientY, panX: dressPan.x, panY: dressPan.y };
        e.currentTarget.setPointerCapture(e.pointerId);
    };
    const handleDressPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDraggingDress || dressZoom <= 1) return;
        const dx = e.clientX - dressDragStart.current.x;
        const dy = e.clientY - dressDragStart.current.y;
        const maxPan = 140 * (dressZoom - 1);
        setDressPan({
            x: clamp(dressDragStart.current.panX + dx, -maxPan, maxPan),
            y: clamp(dressDragStart.current.panY + dy, -maxPan, maxPan),
        });
    };
    const handleDressPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        if (isDraggingDress) {
            setIsDraggingDress(false);
            try {
                e.currentTarget.releasePointerCapture(e.pointerId);
            } catch {
                // ignore
            }
        }
    };

    const handlePinClick = (pinIdx: number) => {
        if (selectedPiece === pinIdx) {
            setSelectedPiece(null);
            setHotPin(null);
            resetDressZoom();
            return;
        }
        setHotPin(pinIdx);
        setSelectedPiece(pinIdx);
        resetDressZoom();
        const card = cardRefs.current[pinIdx];
        if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        }
    };

    const handleSelectPieceFromSidebar = (i: number) => {
        if (!zoomed) {
            setPlaying(false);
            setZoomed(true);
            onOverlayChange?.(true);
        }
        if (selectedPiece === i && zoomed) {
            setSelectedPiece(null);
            setHotPin(null);
            resetDressZoom();
            return;
        }
        setHotPin(i);
        setSelectedPiece(i);
        resetDressZoom();
        const card = cardRefs.current[i];
        if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        }
    };

    // MODEL ZOOM HANDLERS
    const zoomInModel = () => setModelZoom((z) => Math.min(2.2, Number((z + 0.35).toFixed(2))));
    const zoomOutModel = () => {
        setModelZoom((z) => {
            const next = Math.max(1, Number((z - 0.35).toFixed(2)));
            if (next === 1) setModelPan({ x: 0, y: 0 });
            return next;
        });
    };
    const resetModelZoom = () => {
        setModelZoom(1);
        setModelPan({ x: 0, y: 0 });
    };
    const doubleClickModel = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('button')) return;
        if (modelZoom > 1) {
            resetModelZoom();
        } else {
            setModelZoom(1.6);
        }
    };
    const handleModelWheel = (e: React.WheelEvent) => {
        e.stopPropagation();
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.2 : -0.2;
        setModelZoom((z) => {
            const next = clamp(Number((z + delta).toFixed(2)), 1, 2.2);
            if (next === 1) setModelPan({ x: 0, y: 0 });
            return next;
        });
    };
    const handleModelPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if (modelZoom <= 1) return;
        if ((e.target as HTMLElement).closest('button')) return;
        setIsDraggingModel(true);
        modelDragStart.current = { x: e.clientX, y: e.clientY, panX: modelPan.x, panY: modelPan.y };
        e.currentTarget.setPointerCapture(e.pointerId);
    };
    const handleModelPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDraggingModel || modelZoom <= 1) return;
        const dx = e.clientX - modelDragStart.current.x;
        const dy = e.clientY - modelDragStart.current.y;
        const maxPanX = 120 * (modelZoom - 1);
        const maxPanY = 220 * (modelZoom - 1);
        setModelPan({
            x: clamp(modelDragStart.current.panX + dx, -maxPanX, maxPanX),
            y: clamp(modelDragStart.current.panY + dy, -maxPanY, maxPanY),
        });
    };
    const handleModelPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        if (isDraggingModel) {
            setIsDraggingModel(false);
            try {
                e.currentTarget.releasePointerCapture(e.pointerId);
            } catch {
                // ignore
            }
        }
    };

    const toggleAddPiece = (pieceKey: string) => {
        setAddedPieces((prev) => ({ ...prev, [pieceKey]: !prev[pieceKey] }));
    };

    const currentLook = LOOKS[index] ?? LOOKS[0];
    const isPieceOpen = selectedPiece !== null && currentLook.pieces[selectedPiece] !== undefined;

    return (
        <div className="relative grid h-full w-full grid-cols-1 overflow-hidden bg-[radial-gradient(ellipse_at_55%_35%,#f2f6fa_0%,#e7eff7_60%,#dde8f2_100%)] p-3 pt-16 sm:p-5 sm:pt-20 lg:p-6 lg:pt-20 text-[#151413] lg:grid-cols-[minmax(0,1fr)_270px] xl:grid-cols-[minmax(0,1fr)_290px] gap-3 lg:gap-4">
            {/* LEFT COLUMN: Header + 3D Ring Runway Stage + Bottom Controls + Look View (`rw__lb`) */}
            <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
                {/* Header (`rw__head`) */}
                <div
                    className={`relative z-10 flex items-end justify-between gap-6 px-5 pt-3 transition-opacity duration-300 sm:px-10 sm:pt-5 lg:px-14 ${
                        zoomed ? 'pointer-events-none opacity-0' : 'opacity-100'
                    }`}
                >
                    <Reveal active={active} className="flex flex-col gap-1.5">
                        <Eyebrow>02 / Virtual Try-On</Eyebrow>
                        <h2 className="text-[clamp(28px,3.8vw,46px)] font-normal leading-[1.06] tracking-[-0.02em] text-[#151413]">
                            Try the Look.
                        </h2>
                        <p className="max-w-[38ch] text-xs leading-[1.55] text-[#66625c]">
                            Six looks, styled head to toe. Tap the front model to view pins, or drag to spin the runway.
                        </p>
                    </Reveal>
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
                    {/* Stage Atmosphere */}
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
                                    className="absolute bottom-0 left-0 origin-bottom opacity-0 will-change-[transform,opacity]"
                                >
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

                    {/* Custom Frosted Cursor (`rw__cursor`) */}
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

                {/* Bottom Runway Controls (`rw__controls`) */}
                <div
                    className={`relative z-10 flex items-center gap-3 px-4 pb-5 pt-1.5 transition-opacity duration-300 sm:gap-5 sm:px-11 sm:pb-7 ${
                        zoomed ? 'pointer-events-none opacity-0' : 'opacity-100'
                    }`}
                >
                    <Reveal active={active} delay={0.1} className="flex w-full items-center gap-3 sm:gap-5">
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
                                                className={`absolute inset-0 origin-left bg-[#0e0e0e] ${
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
                    </Reveal>
                </div>

                {/* LOOK VIEW (`rw__lb`) — Opens when clicking front model */}
                <div
                    role="region"
                    aria-label="View look"
                    aria-hidden={!zoomed}
                    onWheel={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                    className={`absolute inset-0 z-40 transition-all duration-500 ${
                        zoomed ? 'visible pointer-events-auto opacity-100' : 'invisible pointer-events-none opacity-0'
                    }`}
                >
                    {/* Studio Stage Backdrop (blends seamlessly across entire stage) */}
                    <div
                        onClick={() => {
                            if (selectedPiece !== null) {
                                setSelectedPiece(null);
                            } else {
                                handleCloseLook();
                            }
                        }}
                        className="absolute inset-0 cursor-zoom-out bg-[radial-gradient(ellipse_at_55%_35%,#f2f6fa_0%,#e7eff7_60%,#dde8f2_100%)]"
                    />

                    {/* Zoomed Front Model Stage Area (translates left when piece is open) */}
                    <div
                        ref={modelContainerRef}
                        onWheel={handleModelWheel}
                        onDoubleClick={doubleClickModel}
                        onPointerDown={handleModelPointerDown}
                        onPointerMove={handleModelPointerMove}
                        onPointerUp={handleModelPointerUp}
                        onPointerCancel={handleModelPointerUp}
                        onClick={(e) => {
                            if (e.target === e.currentTarget) {
                                if (selectedPiece !== null) {
                                setSelectedPiece(null);
                            } else {
                                handleCloseLook();
                            }
                        }
                    }}
                    className={`absolute inset-x-4 bottom-4 top-8 flex items-end justify-center sm:inset-x-8 sm:bottom-6 sm:top-10 select-none ${
                        modelZoom > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-out'
                    }`}
                >
                    <div
                        className={`relative h-full aspect-[9/16] max-h-full cursor-default origin-bottom transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                            zoomed ? 'opacity-100' : 'opacity-0 scale-90 translate-y-6'
                        } ${
                            isPieceOpen
                                ? 'lg:-translate-x-[24%] xl:-translate-x-[26%]'
                                : 'translate-x-0'
                        }`}
                        style={{
                            transform: `translate3d(${isPieceOpen ? -24 : 0}%, 0, 0) translate3d(${modelPan.x}px, ${modelPan.y}px, 0) scale(${
                                modelZoom > 1 ? modelZoom : 1
                            })`,
                        }}
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

                            {/* Numbered Outfit Pins (1, 2, 3) mapped anatomically */}
                            <div className="absolute inset-0 z-10">
                                {currentLook.pins.map((pinPos, pinIdx) => {
                                    const pieceItem = currentLook.pieces[pinIdx];
                                    const isHot = hotPin === pinIdx;
                                    const isSelected = selectedPiece === pinIdx;
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
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handlePinClick(pinIdx);
                                            }}
                                            className="group absolute -ml-[22px] -mt-[22px] grid h-[44px] w-[44px] cursor-pointer place-items-center"
                                        >
                                            <span
                                                className={`relative grid h-7 w-7 place-items-center rounded-full text-[11px] font-semibold leading-none shadow-[0_4px_14px_-4px_rgba(0,0,0,0.35)] backdrop-blur-[6px] transition-all duration-300 ${
                                                    isSelected
                                                        ? 'scale-125 bg-[#0e0e0e] text-white shadow-[0_0_0_6px_rgba(14,14,14,0.22),0_8px_20px_-6px_rgba(0,0,0,0.45)] ring-2 ring-white'
                                                        : isHot
                                                            ? 'scale-120 bg-[#0e0e0e] text-white shadow-[0_0_0_5px_rgba(14,14,14,0.18)]'
                                                            : 'bg-white/90 text-[#151413] group-hover:scale-120 group-hover:bg-[#0e0e0e] group-hover:text-white'
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

                                            {pieceItem && (
                                                <span
                                                    className={`pointer-events-none absolute left-[calc(100%-6px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-medium tracking-[0.04em] text-[#151413] shadow-[0_10px_26px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md transition-all duration-300 ${
                                                        isSelected || isHot
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

                        {/* Floating Model Zoom Controls Pill (Left Side Zoom) */}
                        <div className="pointer-events-none absolute bottom-4 left-6 z-20 flex items-center gap-1.5">
                            <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-[#151413]/15 bg-white/90 px-2.5 py-1 shadow-sm backdrop-blur-md">
                                <button
                                    type="button"
                                    onClick={zoomOutModel}
                                    disabled={modelZoom <= 1}
                                    aria-label="Zoom out model"
                                    className="grid h-6 w-6 place-items-center rounded-full text-[#151413] transition hover:bg-[#151413]/10 disabled:pointer-events-none disabled:opacity-30"
                                >
                                    <ZoomOut size={13} />
                                </button>
                                <span className="min-w-[38px] text-center text-[11px] font-semibold tabular-nums text-[#151413]">
                                    {Math.round(modelZoom * 100)}%
                                </span>
                                <button
                                    type="button"
                                    onClick={zoomInModel}
                                    disabled={modelZoom >= 2.2}
                                    aria-label="Zoom in model"
                                    className="grid h-6 w-6 place-items-center rounded-full text-[#151413] transition hover:bg-[#151413]/10 disabled:pointer-events-none disabled:opacity-30"
                                >
                                    <ZoomIn size={13} />
                                </button>
                                {modelZoom > 1 && (
                                    <button
                                        type="button"
                                        onClick={resetModelZoom}
                                        aria-label="Reset model zoom"
                                        className="ml-1 flex items-center gap-1 rounded-full bg-[#151413] px-2 py-0.5 text-[9px] font-semibold tracking-wider text-white uppercase transition hover:bg-[#333]"
                                    >
                                        <RotateCcw size={10} />
                                        <span>Reset</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* BIG DRESS ITEM SHOWCASE (Sits cleanly on stage beside model - pure borderless studio look) */}
                    {isPieceOpen && currentLook.pieces[selectedPiece!] && (
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="pointer-events-auto absolute bottom-4 top-20 right-0 left-[38%] z-20 flex flex-col items-center justify-center p-2 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:left-[42%] select-none touch-none"
                        >
                            <div
                                key={`${index}-${selectedPiece}`}
                                className="animate-dress-reveal flex h-full w-full flex-col items-center justify-center"
                            >
                                {/* Minimalist Piece Label */}
                                <div className="pointer-events-none mb-1 flex flex-col items-center text-center">
                                    <span className="text-[10px] font-semibold tracking-[0.24em] uppercase text-[#736f69]">
                                        {currentLook.pieces[selectedPiece!].brand}
                                    </span>
                                    <h4 className="mt-0.5 text-base font-medium tracking-tight text-[#151413] sm:text-lg lg:text-xl">
                                        {currentLook.pieces[selectedPiece!].name}
                                    </h4>
                                </div>

                                {/* Dress Item Stage & Zoom Container */}
                                <div
                                    ref={dressContainerRef}
                                    onWheel={handleDressWheel}
                                    onDoubleClick={doubleClickDress}
                                    onPointerDown={handleDressPointerDown}
                                    onPointerMove={handleDressPointerMove}
                                    onPointerUp={handleDressPointerUp}
                                    onPointerCancel={handleDressPointerUp}
                                    className={`relative flex h-[76%] max-h-[660px] w-full max-w-[480px] items-center justify-center ${
                                        dressZoom > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'
                                    }`}
                                >
                                    {/* Soft Contact Shadow for Dress Item */}
                                    <span
                                        aria-hidden="true"
                                        className="pointer-events-none absolute bottom-4 left-1/2 h-[7%] max-h-[30px] w-[75%] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(20,16,12,0.18),rgba(20,16,12,0.06)_50%,transparent)] blur-[2px]"
                                    />

                                    <img
                                        src={currentLook.pieces[selectedPiece!].image}
                                        alt={currentLook.pieces[selectedPiece!].name}
                                        draggable={false}
                                        style={{
                                            transform: `translate3d(${dressPan.x}px, ${dressPan.y}px, 0) scale(${dressZoom})`,
                                            transformOrigin: 'center center',
                                        }}
                                        className={`max-h-[92%] max-w-[92%] object-contain select-none drop-shadow-[0_16px_36px_rgba(0,0,0,0.08)] will-change-transform ${
                                            isDraggingDress ? 'transition-none' : 'transition-transform duration-200'
                                        }`}
                                    />
                                </div>

                                {/* Floating Dress Zoom Controls Pill (Right Side Zoom) */}
                                <div className="pointer-events-none absolute bottom-4 right-4 z-20 flex items-center gap-1.5 sm:right-8">
                                    <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-[#151413]/15 bg-white/95 px-2.5 py-1 shadow-sm backdrop-blur-md">
                                        <button
                                            type="button"
                                            onClick={zoomOutDress}
                                            disabled={dressZoom <= 1}
                                            aria-label="Zoom out piece"
                                            className="grid h-6 w-6 place-items-center rounded-full text-[#151413] transition hover:bg-[#151413]/10 disabled:pointer-events-none disabled:opacity-30"
                                        >
                                            <ZoomOut size={13} />
                                        </button>
                                        <span className="min-w-[38px] text-center text-[11px] font-semibold tabular-nums text-[#151413]">
                                            {Math.round(dressZoom * 100)}%
                                        </span>
                                        <button
                                            type="button"
                                            onClick={zoomInDress}
                                            disabled={dressZoom >= 2.5}
                                            aria-label="Zoom in piece"
                                            className="grid h-6 w-6 place-items-center rounded-full text-[#151413] transition hover:bg-[#151413]/10 disabled:pointer-events-none disabled:opacity-30"
                                        >
                                            <ZoomIn size={13} />
                                        </button>
                                        {dressZoom > 1 && (
                                            <button
                                                type="button"
                                                onClick={resetDressZoom}
                                                aria-label="Reset piece zoom"
                                                className="ml-1 flex items-center gap-1 rounded-full bg-[#151413] px-2 py-0.5 text-[9px] font-semibold tracking-wider text-white uppercase transition hover:bg-[#333]"
                                            >
                                                <RotateCcw size={10} />
                                                <span>Reset</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Top Bar (`rw__lb-top`): Look Number + Look Name + Rotating Close Button */}
                    <div className="pointer-events-none absolute inset-x-0 top-0 z-50 flex items-start justify-between gap-4 px-6 pt-4 sm:px-10 sm:pt-5">
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
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleCloseLook();
                            }}
                            aria-label="Close look view"
                            className="pointer-events-auto relative z-50 grid h-12 w-12 shrink-0 cursor-pointer place-items-center rounded-full border border-[#151413]/25 bg-white/95 text-[#151413] shadow-md backdrop-blur-md transition-all duration-300 hover:rotate-90 hover:border-[#151413] hover:bg-white active:scale-95"
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
                        {isPieceOpen ? 'Click another dot or card to switch pieces' : 'Tap a dot to shop the piece'}
                    </p>
                </div>
            </div>

            {/* RIGHT SIDEBAR — Pure white cards floating on ice-blue studio stage */}
            <aside
                aria-label="In this look"
                className="relative flex h-full flex-col bg-transparent"
            >
                <Reveal active={active} delay={0.12} className="flex h-full flex-col justify-between overflow-hidden">
                    {/* 3 Full-Height Pure White Cards matching Image 3 */}
                    <ul
                        role="list"
                        className="flex h-full flex-row gap-2.5 overflow-x-auto p-1 lg:flex-col lg:justify-between lg:overflow-hidden lg:p-0"
                    >
                        {currentLook.pieces.map((pieceItem, i) => {
                            const isHot = hotPin === i;
                            const isSelected = selectedPiece === i && zoomed;
                            const pieceKey = `${index}-${i}`;
                            const isAdded = Boolean(addedPieces[pieceKey]);
                            const isWishlisted = Boolean(wishlist[pieceKey]);

                            return (
                                <li
                                    key={`${index}-${pieceItem.name}-${i}`}
                                    ref={(el) => {
                                        cardRefs.current[i] = el;
                                    }}
                                    onMouseEnter={() => setHotPin(i)}
                                    onMouseLeave={() => setHotPin(null)}
                                    onClick={(e) => {
                                        if ((e.target as HTMLElement).closest('button[data-action-btn]')) {
                                            return;
                                        }
                                        handleSelectPieceFromSidebar(i);
                                    }}
                                    className={`group relative flex min-h-0 flex-1 flex-col justify-between rounded-xl bg-white p-3 sm:p-3.5 transition-all duration-300 cursor-pointer select-none shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] ${
                                        isSelected
                                            ? 'ring-2 ring-[#151413] shadow-md'
                                            : isHot
                                                ? 'ring-1 ring-[#151413]/30 shadow-md'
                                                : 'hover:shadow-md hover:-translate-y-0.5'
                                    } min-w-[200px] lg:min-w-0`}
                                >
                                    {/* Card Top: Heart on Left, Dot Number on Right */}
                                    <div className="flex items-center justify-between">
                                        <button
                                            type="button"
                                            data-action-btn="true"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleWishlist(pieceKey);
                                            }}
                                            aria-label={`Wishlist ${pieceItem.name}`}
                                            className="grid h-6 w-6 place-items-center text-[#151413]/75 transition-transform hover:scale-120 hover:text-[#151413]"
                                        >
                                            <Heart
                                                size={15}
                                                strokeWidth={1.5}
                                                className={isWishlisted ? 'fill-[#151413] text-[#151413]' : 'stroke-current text-[#151413]'}
                                            />
                                        </button>

                                        <span
                                            className={`grid h-[19px] w-[19px] place-items-center rounded-full text-[9px] font-bold transition-all duration-300 ${
                                                isSelected || isHot
                                                    ? 'scale-105 bg-[#0e0e0e] text-white shadow-sm'
                                                    : 'bg-[#151413]/10 text-[#151413] group-hover:bg-[#0e0e0e] group-hover:text-white'
                                            }`}
                                        >
                                            {i + 1}
                                        </span>
                                    </div>

                                    {/* Card Center: Floating Garment Item Image */}
                                    <div className="my-1 flex min-h-0 flex-1 items-center justify-center py-1">
                                        <img
                                            src={pieceItem.image}
                                            alt={pieceItem.name}
                                            loading="lazy"
                                            className="max-h-[90px] sm:max-h-[105px] xl:max-h-[120px] w-auto max-w-[85%] object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.06)] transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>

                                    {/* Card Bottom: Name (Uppercase, No Price) on Left, Plus Icon on Right */}
                                    <div className="flex items-end justify-between gap-2 pt-0.5">
                                        <div className="flex min-w-0 flex-col">
                                            <h4 className="truncate text-[11px] font-semibold tracking-[0.10em] uppercase text-[#151413]">
                                                {pieceItem.name}
                                            </h4>
                                        </div>

                                        <button
                                            type="button"
                                            data-action-btn="true"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleAddPiece(pieceKey);
                                            }}
                                            aria-label={`Add ${pieceItem.name} to look`}
                                            className={`grid h-6 w-6 shrink-0 place-items-center rounded-full transition-all duration-300 ${
                                                isAdded
                                                    ? 'bg-[#0e0e0e] text-white'
                                                    : 'text-[#151413] hover:scale-120'
                                            }`}
                                        >
                                            {isAdded ? <Check size={14} strokeWidth={2} /> : <Plus size={16} strokeWidth={1.5} />}
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </Reveal>
            </aside>
        </div>
    );
}
