import React from 'react';
import { DigitalTwinModel } from './twins';

/**
 * Clean model name shown directly under the active front model.
 * Only the model name — no secondary style subtitle or buttons.
 */
export function TwinNameLabel({ twin }: { twin: DigitalTwinModel }) {
    const [name] = twin.name.split(' — ');

    return (
        <div className="pointer-events-none absolute left-1/2 top-[98%] flex -translate-x-1/2 flex-col items-center text-center whitespace-nowrap">
            <p className="font-michroma text-[28px] sm:text-[34px] font-bold tracking-[0.08em] text-[#16191f] leading-none drop-shadow-sm">
                {name}
            </p>
        </div>
    );
}
