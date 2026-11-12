import React from 'react';
import { motion } from 'framer-motion';
import { DARK_SECTIONS, SECTIONS } from './shared';

interface SideDotsProps {
    index: number;
    goTo: (index: number) => void;
    /** When true, fades out and disables pointer events (e.g. while a fullscreen modal is open). */
    hidden?: boolean;
}

export function SideDots({ index, goTo, hidden = false }: SideDotsProps) {
    const dark = DARK_SECTIONS.includes(index);
    const count = SECTIONS.length;

    // Progress ratio of the vertical track filled (0–1)
    const fillRatio = count > 1 ? index / (count - 1) : 0;

    return (
        <nav
            aria-label="Sections"
            className={`fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-0 sm:flex transition-opacity duration-300 ${hidden ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
        >
            {/* Vertical track + animated fill line */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute right-[5px] top-0 bottom-0 w-[1.5px]"
                style={{ background: dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)' }}
            >
                <motion.div
                    className="absolute top-0 left-0 right-0 origin-top"
                    style={{ background: dark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.65)' }}
                    animate={{ scaleY: fillRatio }}
                    initial={false}
                    transition={{ duration: 0.72, ease: [0.65, 0, 0.35, 1] }}
                />
            </div>

            {SECTIONS.map((s, i) => {
                const isActive = i === index;
                return (
                    <button
                        key={s.id}
                        type="button"
                        onClick={() => goTo(i)}
                        aria-label={s.label}
                        aria-current={isActive ? 'true' : undefined}
                        className="group relative flex items-center gap-3 py-3"
                    >
                        {/* Hover label */}
                        <span
                            className={`pointer-events-none select-none text-[9px] font-semibold uppercase tracking-[0.22em] opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 ${
                                dark ? 'text-white' : 'text-[#1d1d1d]'
                            }`}
                        >
                            {s.label}
                        </span>

                        {/* Dot */}
                        <span className="relative flex h-3 w-3 items-center justify-center">
                            {/* Outer ring slides to active dot via layout animation */}
                            {isActive && (
                                <motion.span
                                    layoutId="side-dot-ring"
                                    className={`absolute inset-[-3px] rounded-full border ${
                                        dark ? 'border-white/60' : 'border-[#1d1d1d]/40'
                                    }`}
                                    transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
                                />
                            )}
                            {/* Inner fill */}
                            <motion.span
                                className={`block h-1.5 w-1.5 rounded-full ${dark ? 'bg-white' : 'bg-[#1d1d1d]'}`}
                                animate={{ scale: isActive ? 1 : 0.66, opacity: isActive ? 1 : 0.35 }}
                                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                            />
                        </span>
                    </button>
                );
            })}
        </nav>
    );
}
