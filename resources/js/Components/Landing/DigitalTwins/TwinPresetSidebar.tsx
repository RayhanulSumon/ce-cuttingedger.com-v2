import React from 'react';
import { Copyright, ShoppingBag } from 'lucide-react';
import { DigitalTwinModel, TwinPosePreset } from './twins';

export type PresetAction = 'buy' | 'lifetime';

interface TwinPresetSidebarProps {
    twin: DigitalTwinModel;
    pose: TwinPosePreset;
    /** Action the visitor just picked, shown as a confirmation line while checkout opens. */
    pendingAction: PresetAction | null;
    onAction: (action: PresetAction) => void;
}

const ACTION_BUTTON =
    'flex w-full items-center justify-between rounded-2xl px-5 py-4 text-left transition-[transform,background-color] duration-300 hover:-translate-y-0.5';

/** Right side of the pose modal: who the model is, one short description and the two purchase actions. */
export function TwinPresetSidebar({ twin, pose, pendingAction, onAction }: TwinPresetSidebarProps) {
    const [name, style] = twin.name.split(' — ');

    return (
        <div className="flex flex-col gap-6">
            <div>
                <p className="font-michroma text-[10px] tracking-[0.2em] text-[#737b86]">LOOK {twin.lookNumber}</p>
                <h3 className="mt-2 text-3xl font-extrabold tracking-[-0.02em] text-[#16191f]">{name}</h3>
                <p className="mt-1 text-sm font-medium text-[#5d6572]">{style}</p>
                <p className="mt-4 text-sm leading-relaxed text-[#5d6572]">{twin.description}</p>
                <p className="mt-4 text-xs text-[#737b86]">
                    Selected: <span className="font-semibold text-[#16191f]">{pose.title}</span>
                </p>
            </div>

            <div className="space-y-3">
                <button
                    type="button"
                    onClick={() => onAction('buy')}
                    className={`${ACTION_BUTTON} bg-[#f5761a] text-white shadow-[0_16px_34px_-16px_rgba(245,118,26,0.9)] hover:bg-[#e0650c]`}
                >
                    <span className="flex items-center gap-3">
                        <ShoppingBag size={18} className="shrink-0" />
                        <span>
                            <span className="block text-sm font-bold">Buy this preset</span>
                            <span className="block text-xs text-white/80">All {twin.poses.length} poses included</span>
                        </span>
                    </span>
                    <span className="text-base font-extrabold">{twin.presetPrice}</span>
                </button>

                <button
                    type="button"
                    onClick={() => onAction('lifetime')}
                    className={`${ACTION_BUTTON} border border-[#16191f]/25 bg-white text-[#16191f] hover:bg-[#f1f5fa]`}
                >
                    <span className="flex items-center gap-3">
                        <Copyright size={18} className="shrink-0" />
                        <span>
                            <span className="block text-sm font-bold">Buy lifetime copyright</span>
                            <span className="block text-xs text-[#5d6572]">Full commercial rights</span>
                        </span>
                    </span>
                    <span className="text-base font-extrabold">{twin.lifetimePrice}</span>
                </button>

                <p role="status" className={`text-center text-xs font-medium text-emerald-700 ${pendingAction ? '' : 'invisible'}`}>
                    {pendingAction === 'lifetime' ? 'Lifetime copyright selected' : 'Preset selected'} — opening checkout…
                </p>
            </div>
        </div>
    );
}
