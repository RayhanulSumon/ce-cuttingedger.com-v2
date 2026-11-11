import React from 'react';
import { SECTIONS } from './shared';

interface SideDotsProps {
    index: number;
    goTo: (index: number) => void;
}

const DARK_SECTIONS = [7, 9];

export function SideDots({ index, goTo }: SideDotsProps) {
    const dark = DARK_SECTIONS.includes(index);

    return (
        <nav aria-label="Sections" className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-3 sm:flex">
            {SECTIONS.map((s, i) => (
                <button
                    key={s.id}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={s.label}
                    aria-current={i === index}
                    className="group flex items-center gap-3"
                >
                    <span
                        className={`pointer-events-none text-[10px] font-semibold uppercase tracking-widest opacity-0 transition-opacity group-hover:opacity-100 ${
                            dark ? 'text-white' : 'text-[#1d1d1d]'
                        }`}
                    >
                        {s.label}
                    </span>
                    <span
                        className={`block rounded-full transition-all duration-300 ${i === index ? 'h-6 w-1.5' : 'h-1.5 w-1.5 opacity-40 group-hover:opacity-80'} ${
                            dark ? 'bg-white' : 'bg-[#1d1d1d]'
                        }`}
                    />
                </button>
            ))}
        </nav>
    );
}

