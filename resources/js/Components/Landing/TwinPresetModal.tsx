import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Copyright, Layers, ShoppingBag, X } from 'lucide-react';
import {
    DIGITAL_TWINS,
    DigitalTwinModel,
    TWIN_MODELS_SPRITE,
    TWIN_PIECES_SPRITE,
    TWIN_Y0,
    TWIN_Y1,
    TwinPosePreset,
} from './looks';

interface TwinPresetModalProps {
    twinIndex: number | null;
    onSelectTwin: (index: number) => void;
    onClose: () => void;
    openDemo: () => void;
}

/**
 * Renders an SVG crop from the high-resolution Digital Twins model sprite sheet,
 * with support for per-pose framing (full-body, 3/4, portrait, waist crop, mirrored stance).
 */
export function TwinSpriteCrop({
    twin,
    pose,
    className = 'h-full w-full',
}: {
    twin: DigitalTwinModel;
    pose?: TwinPosePreset;
    className?: string;
}) {
    const fullW = twin.x1 - twin.x0;
    const fullH = TWIN_Y1 - TWIN_Y0;
    const yStart = TWIN_Y0 + (pose ? pose.yStartFrac * fullH : 0);
    const yEnd = TWIN_Y0 + (pose ? pose.yEndFrac * fullH : fullH);
    const cropH = Math.max(60, yEnd - yStart);
    const padX = pose?.xPadFrac ? fullW * pose.xPadFrac : 0;
    const vx = twin.x0 - padX;
    const vw = fullW + padX * 2;

    const transformStyle: React.CSSProperties | undefined =
        pose?.mirror || pose?.tiltDeg
            ? {
                  transform: `${pose?.mirror ? 'scaleX(-1)' : ''} ${pose?.tiltDeg ? `rotate(${pose.tiltDeg}deg)` : ''}`.trim(),
              }
            : undefined;

    return (
        <svg
            viewBox={`${vx} ${yStart} ${vw} ${cropH}`}
            className={`block select-none ${className}`}
            style={transformStyle}
            aria-hidden="true"
        >
            <svg x={vx} y={yStart} width={vw} height={cropH} viewBox={`${vx} ${yStart} ${vw} ${cropH}`}>
                <image href={TWIN_MODELS_SPRITE} width="960" height="540" />
            </svg>
        </svg>
    );
}

/**
 * Renders an SVG crop from the Digital Twins garment pieces sheet (`PIECES` in demo/Digital Twins.html).
 */
function PieceSpriteCrop({ box, className = 'h-full w-full' }: { box: [number, number, number, number]; className?: string }) {
    const [x0, x1, y0, y1] = box;
    const w = x1 - x0;
    const h = y1 - y0;
    return (
        <svg viewBox={`${x0} ${y0} ${w} ${h}`} className={`block select-none ${className}`} aria-hidden="true">
            <svg x={x0} y={y0} width={w} height={h} viewBox={`${x0} ${y0} ${w} ${h}`}>
                <image href={TWIN_PIECES_SPRITE} width="960" height="720" />
            </svg>
        </svg>
    );
}

export function TwinPresetModal({ twinIndex, onSelectTwin, onClose, openDemo }: TwinPresetModalProps) {
    const [poseIdx, setPoseIdx] = useState(0);
    const [actionFeedback, setActionFeedback] = useState<'buy' | 'lifetime' | null>(null);

    const isOpen = twinIndex !== null;
    const twin = DIGITAL_TWINS[twinIndex ?? 0] ?? DIGITAL_TWINS[0];
    const activePose = twin.poses[poseIdx] ?? twin.poses[0];

    useEffect(() => {
        setPoseIdx(0);
        setActionFeedback(null);
    }, [twinIndex]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                event.stopPropagation();
                onClose();
            } else if (event.key === 'ArrowRight') {
                event.preventDefault();
                setPoseIdx((prev) => (prev + 1) % twin.poses.length);
            } else if (event.key === 'ArrowLeft') {
                event.preventDefault();
                setPoseIdx((prev) => (prev - 1 + twin.poses.length) % twin.poses.length);
            }
        };
        window.addEventListener('keydown', onKeyDown, true);
        return () => window.removeEventListener('keydown', onKeyDown, true);
    }, [isOpen, onClose, twin.poses.length]);

    if (!isOpen) {
        return null;
    }

    const handlePresetAction = (type: 'buy' | 'lifetime') => {
        setActionFeedback(type);
        window.setTimeout(() => {
            openDemo();
        }, 260);
    };

    return (
        <div
            className="absolute inset-0 z-[500] flex flex-col bg-[#f4f7fb]/95 backdrop-blur-md lg:grid lg:grid-cols-[minmax(0,1fr)_410px] xl:grid-cols-[minmax(0,1fr)_440px]"
            role="dialog"
            aria-modal="true"
            aria-label={`${twin.name} pose presets`}
            onWheel={(e) => {
                e.stopPropagation();
            }}
        >
            {/* ── Prominent close button — always visible top-right ── */}
            <button
                type="button"
                onClick={onClose}
                aria-label="Close pose preset view"
                className="absolute right-5 top-5 z-50 grid h-11 w-11 place-items-center rounded-full bg-[#16191f] text-white shadow-lg transition-transform duration-300 hover:rotate-90 hover:scale-105 sm:right-8 sm:top-7"
            >
                <X size={20} />
            </button>
            {/* LEFT SIDE: Selected Model + Multi-Pose Photo Gallery */}
            <div
                data-scrollable
                className="relative flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-6 pt-20 sm:px-8 sm:pt-24 lg:px-10"
            >
                {/* Top Header Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d8e1ec] pb-4">
                    <div>
                        <p className="font-michroma text-[10px] tracking-[0.2em] text-[#737b86]">
                            LOOK {twin.lookNumber} · {twin.archetype}
                        </p>
                        <h3 className="mt-1 text-xl font-bold tracking-[-0.02em] text-[#16191f] sm:text-2xl">
                            {twin.name}
                        </h3>
                    </div>

                    {/* Model Switcher Pills */}
                    <div className="flex items-center gap-1.5">
                        {DIGITAL_TWINS.map((item, idx) => (
                            <button
                                key={item.lookNumber}
                                type="button"
                                onClick={() => onSelectTwin(idx)}
                                className={`h-8 rounded-full px-3 font-michroma text-[10px] tracking-[0.14em] transition-all ${
                                    idx === twin.index
                                        ? 'bg-[#16191f] text-white shadow-sm'
                                        : 'border border-[#d0dae6] bg-white/80 text-[#5a6270] hover:border-[#16191f] hover:text-[#16191f]'
                                }`}
                            >
                                #{item.lookNumber}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Pose Stage + Multi-Pose Grid */}
                <div className="mt-5 grid min-h-0 flex-1 grid-cols-1 gap-5 xl:grid-cols-[minmax(280px,0.95fr)_minmax(0,1.25fr)]">
                    {/* Featured Active Pose Frame */}
                    <div
                        className="relative flex min-h-[320px] flex-col justify-between overflow-hidden rounded-2xl border border-[#d8e1ec] p-5 shadow-sm"
                        style={{ background: activePose.backdrop }}
                    >
                        <div className="relative z-10 flex items-start justify-between gap-2">
                            <div>
                                <span className="inline-block rounded-full bg-[#16191f] px-3 py-1 font-michroma text-[9px] tracking-[0.18em] text-white">
                                    {activePose.code}
                                </span>
                                <p className="mt-2 text-base font-bold text-[#16191f]">{activePose.title}</p>
                                <p className="text-xs text-[#5d6572]">{activePose.angle}</p>
                            </div>
                            <span className="rounded-full border border-[#16191f]/15 bg-white/80 px-2.5 py-1 text-[11px] font-medium text-[#16191f] backdrop-blur">
                                {activePose.lens}
                            </span>
                        </div>

                        <div className="relative my-2 flex min-h-[240px] flex-1 items-center justify-center">
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute bottom-2 left-1/2 h-6 w-3/5 -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(45,60,80,0.26),transparent)]"
                            />
                            <div className="h-[260px] w-full max-w-[260px] sm:h-[320px] lg:h-[360px]">
                                <TwinSpriteCrop twin={twin} pose={activePose} className="h-full w-full" />
                            </div>
                        </div>

                        <div className="relative z-10 flex items-center justify-between border-t border-[#16191f]/10 pt-3">
                            <span className="font-michroma text-[10px] tracking-[0.14em] text-[#5d6572]">
                                POSE {String(poseIdx + 1).padStart(2, '0')} / {String(twin.poses.length).padStart(2, '0')}
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setPoseIdx((p) => (p - 1 + twin.poses.length) % twin.poses.length)}
                                    aria-label="Previous pose"
                                    className="grid h-8 w-8 place-items-center rounded-full border border-[#16191f]/20 bg-white/80 text-[#16191f] transition hover:bg-[#16191f] hover:text-white"
                                >
                                    <ArrowLeft size={14} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPoseIdx((p) => (p + 1) % twin.poses.length)}
                                    aria-label="Next pose"
                                    className="grid h-8 w-8 place-items-center rounded-full border border-[#16191f]/20 bg-white/80 text-[#16191f] transition hover:bg-[#16191f] hover:text-white"
                                >
                                    <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Multi-Pose Photo Gallery ("left side show that model many pose photo") */}
                    <div className="flex min-h-0 flex-col">
                        <div className="mb-3 flex items-center justify-between">
                            <span className="font-michroma text-[10px] tracking-[0.18em] text-[#16191f]">
                                MULTI-POSE PRESET GALLERY ({twin.poses.length} POSES)
                            </span>
                            <span className="text-xs text-[#737b86]">Click any pose photo to inspect</span>
                        </div>

                        <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-3">
                            {twin.poses.map((pose, idx) => {
                                const selected = idx === poseIdx;
                                return (
                                    <button
                                        key={pose.id}
                                        type="button"
                                        onClick={() => setPoseIdx(idx)}
                                        aria-pressed={selected}
                                        className={`group relative flex flex-col overflow-hidden rounded-xl border text-left transition-all ${
                                            selected
                                                ? 'border-[#16191f] bg-white ring-2 ring-[#16191f]/15 shadow-md'
                                                : 'border-[#d8e1ec] bg-white/75 hover:border-[#16191f]/50 hover:bg-white'
                                        }`}
                                    >
                                        <div
                                            className="relative flex h-36 w-full items-center justify-center overflow-hidden p-2 sm:h-40"
                                            style={{ background: pose.backdrop }}
                                        >
                                            <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 font-michroma text-[8px] tracking-[0.14em] text-[#16191f] shadow-xs">
                                                {pose.code}
                                            </span>
                                            {selected && (
                                                <span className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-[#16191f] text-white">
                                                    <Check size={11} />
                                                </span>
                                            )}
                                            <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
                                                <TwinSpriteCrop twin={twin} pose={pose} className="h-full w-full" />
                                            </div>
                                        </div>
                                        <div className="border-t border-[#e6ebf0] px-3 py-2">
                                            <p className="truncate text-xs font-semibold text-[#16191f]">{pose.title}</p>
                                            <p className="truncate text-[11px] text-[#737b86]">{pose.angle}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDEBAR: Preset Details + Two Action Buttons ("Buy This Preset" & "Order This Preset") */}
            <aside
                data-scrollable
                className="flex flex-col justify-between overflow-y-auto border-t border-[#d8e1ec] bg-white p-6 sm:p-8 lg:border-l lg:border-t-0 lg:pt-24"
                aria-label="Digital twin preset actions"
            >
                <div>
                    <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eef4f9] px-3 py-1 font-michroma text-[9px] tracking-[0.16em] text-[#16191f]">
                            <Layers size={12} /> PRESET PACK #{twin.lookNumber}
                        </span>
                        <span className="font-michroma text-[10px] tracking-[0.14em] text-[#737b86]">8K STUDIO RIG</span>
                    </div>

                    <h4 className="mt-3 text-xl font-extrabold tracking-[-0.02em] text-[#16191f]">{twin.name}</h4>
                    <p className="mt-2 text-xs leading-relaxed text-[#5d6572]">{twin.description}</p>

                    {/* Selected Pose Indicator */}
                    <div className="mt-4 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-3.5">
                        <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-[#16191f]">Selected Pose Preset</span>
                            <span className="font-michroma text-[10px] text-[#737b86]">{activePose.code}</span>
                        </div>
                        <p className="mt-1 text-sm font-bold text-[#16191f]">{activePose.title}</p>
                        <p className="text-xs text-[#737b86]">
                            {activePose.angle} · {activePose.lens}
                        </p>
                    </div>

                    {/* Included Deliverables */}
                    <div className="mt-4">
                        <p className="font-michroma text-[9.5px] tracking-[0.16em] text-[#737b86]">INCLUDED IN THIS PRESET</p>
                        <ul className="mt-2.5 space-y-2">
                            {twin.deliverables.map((item) => (
                                <li key={item} className="flex items-center gap-2.5 text-xs font-medium text-[#16191f]">
                                    <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Styled Garments in This Look */}
                    <div className="mt-5">
                        <p className="font-michroma text-[9.5px] tracking-[0.16em] text-[#737b86]">GARMENT MAPPING REFERENCE</p>
                        <div className="mt-2.5 grid grid-cols-2 gap-2.5">
                            {twin.featuredPieces.map((piece) => (
                                <div
                                    key={piece.name}
                                    className="flex items-center gap-2.5 rounded-lg border border-[#e6ebf0] bg-[#f3f6fa] p-2"
                                >
                                    <div className="h-12 w-12 shrink-0 rounded bg-white p-1">
                                        <PieceSpriteCrop box={piece.box} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate text-[11px] font-semibold text-[#16191f]">{piece.name}</p>
                                        <p className="text-[11px] text-[#737b86]">{piece.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* TWO ACTION BUTTONS */}
                <div className="mt-6 space-y-3 border-t border-[#e6ebf0] pt-5">
                    {actionFeedback && (
                        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-center text-xs font-medium text-emerald-800">
                            {actionFeedback === 'buy'
                                ? `Preset #${twin.lookNumber} (${activePose.code}) selected — opening checkout…`
                                : `Lifetime copyright for Look #${twin.lookNumber} — opening checkout…`}
                        </p>
                    )}

                    {/* Button 1: Buy This Preset */}
                    <button
                        type="button"
                        onClick={() => handlePresetAction('buy')}
                        className="flex w-full items-center justify-between rounded-xl bg-[#16191f] px-5 py-4 text-left text-white shadow-md transition hover:-translate-y-0.5 hover:bg-black"
                    >
                        <span className="flex items-center gap-3">
                            <ShoppingBag size={18} className="shrink-0" />
                            <span>
                                <span className="block font-michroma text-[11px] tracking-[0.14em]">Buy This Preset</span>
                                <span className="block text-[11px] text-white/70">Instant download · All 6 poses included</span>
                            </span>
                        </span>
                        <span className="font-michroma text-sm font-bold">{twin.presetPrice}</span>
                    </button>

                    {/* Button 2: Buy Lifetime Copyright */}
                    <button
                        type="button"
                        onClick={() => handlePresetAction('lifetime')}
                        className="flex w-full items-center justify-between rounded-xl border-2 border-[#16191f] bg-white px-5 py-3.5 text-left text-[#16191f] transition hover:-translate-y-0.5 hover:bg-[#f1f5fa]"
                    >
                        <span className="flex items-center gap-3">
                            <Copyright size={18} className="shrink-0" />
                            <span>
                                <span className="block font-michroma text-[11px] tracking-[0.14em]">Buy Lifetime Copyright</span>
                                <span className="block text-[11px] text-[#5d6572]">Full commercial rights · Unlimited usage</span>
                            </span>
                        </span>
                        <span className="font-michroma text-sm font-bold">{twin.lifetimePrice}</span>
                    </button>
                </div>
            </aside>
        </div>
    );
}

