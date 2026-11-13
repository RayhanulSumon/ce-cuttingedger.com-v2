import React from 'react';
import { Calendar, Copyright, Download, ShoppingBag } from 'lucide-react';
import { DigitalTwinModel, formatDownloadCount, formatTwinAge, TwinPosePreset } from './twins';

export type PresetAction = 'buy' | 'lifetime';

interface TwinPresetSidebarProps {
    twin: DigitalTwinModel;
    pose: TwinPosePreset;
    pendingAction: PresetAction | null;
    onAction: (action: PresetAction) => void;
}

const ACTION_BUTTON =
    'flex w-full items-center justify-between rounded-2xl px-5 py-4 text-left transition-[transform,background-color] duration-300 hover:-translate-y-0.5';

/** Right side of the pose modal: model name, short description, and simple action buttons. */
export function TwinPresetSidebar({ twin, pendingAction, onAction }: TwinPresetSidebarProps) {
    const [name] = twin.name.split(' — ');

    return (
        <div className="flex flex-col gap-6">
            <div>
                <p className="font-michroma text-[10px] tracking-[0.2em] text-[#737b86]">LOOK {twin.lookNumber}</p>
                <h3 className="mt-2 text-3xl font-extrabold tracking-[-0.02em] text-[#16191f]">{name}</h3>
                {twin.isCopyrightSold ? (
                    <span className="mt-3 inline-block rounded-full bg-red-600 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white shadow-[0_8px_18px_-8px_rgba(220,38,38,0.7)]">
                        Sold out
                    </span>
                ) : (
                    <div className="mt-4 flex items-center divide-x divide-[#16191f]/10 rounded-xl border border-[#16191f]/10 bg-[#f6f8fb] text-[#16191f]">
                        <div className="flex flex-1 items-center gap-2.5 px-4 py-2.5">
                            <Download size={16} className="text-[#f5761a]" strokeWidth={2.5} />
                            <div className="leading-tight">
                                <p className="text-base font-extrabold">{formatDownloadCount(twin.downloadCount)}</p>
                                <p className="text-[11px] text-[#5d6572]">downloads so far</p>
                            </div>
                        </div>
                        <div className="flex flex-1 items-center gap-2.5 px-4 py-2.5">
                            <Calendar size={16} className="text-[#5d6572]" />
                            <div className="leading-tight">
                                <p className="text-base font-extrabold">{formatTwinAge(twin.listedAt)}</p>
                                <p className="text-[11px] text-[#5d6572]">since listed</p>
                            </div>
                        </div>
                    </div>
                )}
                <p className="mt-3 text-sm leading-relaxed text-[#5d6572]">{twin.description}</p>
            </div>

            <div className="space-y-3">
                <button
                    type="button"
                    onClick={() => onAction('buy')}
                    disabled={twin.isCopyrightSold}
                    className={`${ACTION_BUTTON} bg-[#f5761a] text-white shadow-[0_16px_34px_-16px_rgba(245,118,26,0.9)] hover:bg-[#e0650c] disabled:cursor-not-allowed disabled:bg-[#16191f]/10 disabled:text-[#16191f]/45 disabled:shadow-none disabled:hover:translate-y-0 disabled:hover:bg-[#16191f]/10`}
                >
                    <span className="flex items-center gap-3">
                        <ShoppingBag size={18} className="shrink-0" />
                        <span>
                            <span className="block text-sm font-bold">Buy this preset</span>
                            <span className="block text-xs opacity-80">
                                {twin.isCopyrightSold ? 'Sold out — no longer available' : `All ${twin.poses.length} poses included`}
                            </span>
                        </span>
                    </span>
                    <span className={`text-base font-extrabold ${twin.isCopyrightSold ? 'line-through' : ''}`}>{twin.presetPrice}</span>
                </button>

                <button
                    type="button"
                    onClick={() => onAction('lifetime')}
                    disabled={twin.isCopyrightSold}
                    className={`${ACTION_BUTTON} border border-[#16191f]/25 bg-white text-[#16191f] hover:bg-[#f1f5fa] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-white`}
                >
                    <span className="flex items-center gap-3">
                        <Copyright size={18} className="shrink-0" />
                        <span>
                            <span className="block text-sm font-bold">Buy lifetime copyright</span>
                            <span className="block text-xs text-[#5d6572]">
                                {twin.isCopyrightSold ? 'Sold out — copyright already purchased' : 'Full commercial rights'}
                            </span>
                        </span>
                    </span>
                    <span className={`text-base font-extrabold ${twin.isCopyrightSold ? 'line-through' : ''}`}>{twin.lifetimePrice}</span>
                </button>

                <p role="status" className={`text-center text-xs font-medium text-emerald-700 ${pendingAction ? '' : 'invisible'}`}>
                    {pendingAction === 'lifetime' ? 'Lifetime copyright selected' : 'Preset selected'} — opening your email…
                </p>
            </div>
        </div>
    );
}
