import React from 'react';
import { DigitalTwinModel } from './twins';

/**
 * Clean model name and style shown directly under the active model.
 * No buttons or stems — clean and compact within screen bounds.
 */
export function TwinNameLabel({ twin }: { twin: DigitalTwinModel }) {
    const [name, style] = twin.name.split(' — ');

    return (
        <div
            className="pointer-events-none absolute left-1/2 top-[98%] flex -translate-x-1/2 flex-col items-center text-center whitespace-nowrap"
        >
            <p className="font-michroma text-[28px] sm:text-[34px] font-bold tracking-[0.08em] text-[#16191f] leading-none drop-shadow-sm">
                {name}
            </p>
            <p className="mt-1 text-xs font-semibold text-[#5d6572]">{style}</p>
        </div>
    );
}
