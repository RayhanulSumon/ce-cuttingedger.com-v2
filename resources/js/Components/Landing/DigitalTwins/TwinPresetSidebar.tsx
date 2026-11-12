import React from 'react';
import { CheckCircle2, Copyright, Layers, ShoppingBag } from 'lucide-react';
import { PieceSpriteCrop } from './TwinSpriteCrop';
import { DigitalTwinModel, TwinPosePreset } from './twins';

export type PresetAction = 'buy' | 'lifetime';

interface TwinPresetSidebarProps {
    twin: DigitalTwinModel;
    pose: TwinPosePreset;
    /** Action the visitor just picked, shown as a confirmation line while checkout opens. */
    pendingAction: PresetAction | null;
    onAction: (action: PresetAction) => void;
}

const SECTION_LABEL = 'font-michroma text-[9.5px] tracking-[0.16em] text-[#737b86]';

/** Right side of the preset modal: what the pack contains and the two purchase actions. */
export function TwinPresetSidebar({ twin, pose, pendingAction, onAction }: TwinPresetSidebarProps) {
    return (
        <>
            <div>
                <div className="flex items-center justify-between gap-2">
                    <span className="font-michroma inline-flex items-center gap-1.5 rounded-full bg-[#eef4f9] px-3 py-1 text-[9px] tracking-[0.16em] text-[#16191f]">
                        <Layers size={12} /> PRESET PACK #{twin.lookNumber}
                    </span>
                    <span className="font-michroma text-[10px] tracking-[0.14em] text-[#737b86]">8K STUDIO RIG</span>
                </div>

                <h4 className="mt-3 text-xl font-extrabold tracking-[-0.02em] text-[#16191f]">{twin.name}</h4>
                <p className="mt-2 text-xs leading-relaxed text-[#5d6572]">{twin.description}</p>

                <div className="mt-4 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-3.5">
                    <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#16191f]">Selected Pose Preset</span>
                        <span className="font-michroma text-[10px] text-[#737b86]">{pose.code}</span>
                    </div>
                    <p className="mt-1 text-sm font-bold text-[#16191f]">{pose.title}</p>
                    <p className="text-xs text-[#737b86]">
                        {pose.angle} · {pose.lens}
                    </p>
                </div>

                <div className="mt-4">
                    <p className={SECTION_LABEL}>INCLUDED IN THIS PRESET</p>
                    <ul className="mt-2.5 space-y-2">
                        {twin.deliverables.map((item) => (
                            <li key={item} className="flex items-center gap-2.5 text-xs font-medium text-[#16191f]">
                                <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-5">
                    <p className={SECTION_LABEL}>GARMENT MAPPING REFERENCE</p>
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

            <div className="mt-6 space-y-3 border-t border-[#e6ebf0] pt-5">
                {pendingAction && (
                    <p role="status" className="rounded-lg bg-emerald-50 px-3 py-2 text-center text-xs font-medium text-emerald-800">
                        {pendingAction === 'buy'
                            ? `Preset #${twin.lookNumber} (${pose.code}) selected — opening checkout…`
                            : `Lifetime copyright for Look #${twin.lookNumber} — opening checkout…`}
                    </p>
                )}

                <button
                    type="button"
                    onClick={() => onAction('buy')}
                    className="flex w-full items-center justify-between rounded-xl bg-[#16191f] px-5 py-4 text-left text-white shadow-md transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-black"
                >
                    <span className="flex items-center gap-3">
                        <ShoppingBag size={18} className="shrink-0" />
                        <span>
                            <span className="font-michroma block text-[11px] tracking-[0.14em]">Buy This Preset</span>
                            <span className="block text-[11px] text-white/70">
                                Instant download · All {twin.poses.length} poses included
                            </span>
                        </span>
                    </span>
                    <span className="font-michroma text-sm font-bold">{twin.presetPrice}</span>
                </button>

                <button
                    type="button"
                    onClick={() => onAction('lifetime')}
                    className="flex w-full items-center justify-between rounded-xl border-2 border-[#16191f] bg-white px-5 py-3.5 text-left text-[#16191f] transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-[#f1f5fa]"
                >
                    <span className="flex items-center gap-3">
                        <Copyright size={18} className="shrink-0" />
                        <span>
                            <span className="font-michroma block text-[11px] tracking-[0.14em]">Buy Lifetime Copyright</span>
                            <span className="block text-[11px] text-[#5d6572]">Full commercial rights · Unlimited usage</span>
                        </span>
                    </span>
                    <span className="font-michroma text-sm font-bold">{twin.lifetimePrice}</span>
                </button>
            </div>
        </>
    );
}
