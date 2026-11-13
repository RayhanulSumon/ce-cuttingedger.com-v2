import React from 'react';
import { DigitalTwinModel } from './twins';

/**
 * Clean model name shown directly under the active front model.
 * Only the model name — no secondary style subtitle or buttons.
 */
export function TwinNameLabel({ twin }: { twin: DigitalTwinModel }) {
    const [name] = twin.name.split(' — ');

    return (
        <div className="pointer-events-none absolute left-1/2 top-[98%] mt-5 flex gap-2.5 -translate-x-1/2 flex-col items-center text-center whitespace-nowrap">
            <p className="font-michroma text-base sm:text-xl font-bold tracking-[0.08em] text-ink leading-none drop-shadow-sm">
                {name}
            </p>
            {twin.isCopyrightSold && (
                <span className="rounded-full bg-red-600 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white shadow-[0_8px_18px_-8px_rgba(220,38,38,0.7)]">
                    Sold out
                </span>
            )}
        </div>
    );
}
