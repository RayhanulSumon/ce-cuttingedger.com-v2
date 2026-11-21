import React from 'react';
import { DigitalTwinModel } from './twins';

/**
 * Unscaled editorial caption pill shown at the bottom of the Digital Twins stage,
 * displaying the active look counter, model name, and a matte Sold Out tag when exclusive rights are sold.
 */
export function TwinNameLabel({ twin, index, total }: { twin: DigitalTwinModel; index: number; total: number }) {
    const [name] = twin.name.split(' — ');
    const counter = `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;

    return (
        <div className="inline-flex items-center gap-2.5 whitespace-nowrap rounded-full border border-ink/10 bg-surface/85 px-4 py-1.5 shadow-[0_8px_24px_-12px_rgba(16,17,20,0.18)] backdrop-blur-md">
            <span className="text-2xs font-semibold tabular-nums tracking-[0.14em] text-subtle">{counter}</span>
            <span aria-hidden="true" className="h-3 w-px bg-ink/15" />
            <span className="font-display text-xs font-bold tracking-[0.02em] text-ink sm:text-sm">{name}</span>
            {twin.isCopyrightSold && (
                <span className="rounded-full border border-danger/25 bg-danger-soft px-2.5 py-0.5 text-2xs font-semibold uppercase tracking-[0.1em] text-danger">
                    Sold Out
                </span>
            )}
        </div>
    );
}
