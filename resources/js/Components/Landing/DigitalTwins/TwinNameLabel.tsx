import React from 'react';
import { DigitalTwinModel } from './twins';

/**
 * Clean model name shown directly under the active front model,
 * with a tilted rubber-stamp seal ("SOLD OUT") across the center when copyright is sold.
 */
export function TwinNameLabel({ twin }: { twin: DigitalTwinModel }) {
    const [name] = twin.name.split(' — ');

    return (
        <>
            {twin.isCopyrightSold && (
                <div className="pointer-events-none absolute left-1/2 top-[48%] z-10 -translate-x-1/2 -translate-y-1/2 -rotate-[14deg] select-none whitespace-nowrap rounded-md border-[3px] border-[#d92626]/85 bg-white/80 p-1 shadow-[0_12px_28px_-10px_rgba(217,38,38,0.45)] backdrop-blur-[2px]">
                    <div className="flex items-center gap-2 rounded-[3px] border-[1.5px] border-dashed border-[#d92626]/75 px-4 py-1.5 text-[#d92626]">
                        <span aria-hidden="true" className="text-xs leading-none opacity-85">
                            ★
                        </span>
                        <span className="font-michroma text-[15px] font-black uppercase leading-none tracking-[0.22em] sm:text-[17px]">
                            Sold Out
                        </span>
                        <span aria-hidden="true" className="text-xs leading-none opacity-85">
                            ★
                        </span>
                    </div>
                </div>
            )}
            <div className="pointer-events-none absolute left-1/2 top-[98%] mt-4 flex -translate-x-1/2 flex-col items-center text-center whitespace-nowrap">
                <p className="font-michroma text-xs sm:text-sm font-bold tracking-[0.08em] text-ink leading-none drop-shadow-sm">
                    {name}
                </p>
            </div>
        </>
    );
}
