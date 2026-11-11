import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface FullpageStageProps {
    index: number;
    direction: -1 | 0 | 1;
    sections: React.ReactNode[];
}

/**
 * Cinematic fullpage stage — both sides of every transition are visible.
 *
 * Z-index strategy (the key to feeling like a single screen):
 *   • The OUTGOING section stays on z=10 and slides visibly away.
 *   • The INCOMING section waits at z=5, revealed as the outgoing lifts off.
 *   • This "curtain pull" makes the EXIT animation dominant — you see the old
 *     panel leave, not just the new panel arrive.
 *
 * Going forward (direction=1): outgoing is now ABOVE active → slides up at z=10.
 * Going backward (direction=-1): outgoing is now BELOW active → slides down at z=10.
 * Initial load (direction=0): active is z=10, rest parked at z=1.
 */

const EASE     = [0.76, 0, 0.24, 1] as const; // symmetric strong ease-in-out
const DURATION = 1.05;                          // slow enough to feel deliberate

const SPRING = { stiffness: 200, damping: 32, mass: 1 };

export function FullpageStage({ index, direction, sections }: FullpageStageProps) {
    const count = sections.length;

    const rawProgress    = useMotionValue(index / Math.max(count - 1, 1));
    const smoothProgress = useSpring(rawProgress, SPRING);

    useEffect(() => {
        rawProgress.set(index / Math.max(count - 1, 1));
    }, [index, count, rawProgress]);

    return (
        <div className="fixed inset-0 overflow-hidden">
            {sections.map((section, i) => {
                const isActive = i === index;
                const isAbove  = i < index;
                const dist     = Math.abs(i - index);

                /* ── Y target ──────────────────────────────────────────────────
                 * Active = 0%. Everything else fully parked ±100%.
                 * No partial recession — clean, predictable positions.
                 * All transitions are animated by Framer Motion (no snap). */
                const yTarget = isActive ? '0%' : isAbove ? '-100%' : '100%';

                /* ── Z-index ───────────────────────────────────────────────────
                 * The outgoing section must be on top so its exit is visible.
                 *
                 * direction > 0 (scrolled DOWN to next section):
                 *   • The old section is now isAbove at dist=1 → z=10 (slides up, seen)
                 *   • New active comes from 100% at z=5 (revealed beneath)
                 *
                 * direction < 0 (scrolled UP to prev section):
                 *   • The old section is now !isAbove (below) at dist=1 → z=10 (slides down, seen)
                 *   • New active comes from -100% at z=5 (revealed beneath)
                 *
                 * direction = 0 (initial load, no transition yet):
                 *   • Active gets z=10, everything else z=1.
                 */
                let zIndex: number;
                if (direction === 0) {
                    zIndex = isActive ? 10 : 1;
                } else if (isActive) {
                    zIndex = 5;
                } else if (direction > 0 && isAbove && dist === 1) {
                    zIndex = 10; // outgoing slides UP, stays visible on top
                } else if (direction < 0 && !isAbove && dist === 1) {
                    zIndex = 10; // outgoing slides DOWN, stays visible on top
                } else {
                    zIndex = 1;
                }

                return (
                    <motion.section
                        key={i}
                        className="absolute inset-0"
                        initial={false}
                        animate={{ y: yTarget }}
                        transition={{ duration: DURATION, ease: EASE }}
                        style={{
                            zIndex,
                            willChange: dist <= 1 ? 'transform' : 'auto',
                        }}
                        aria-hidden={!isActive}
                        {...(!isActive ? { inert: true } : {})}
                    >
                        {section}
                    </motion.section>
                );
            })}

            {/* ── Bottom progress bar ─────────────────────────────────── */}
            <div
                aria-hidden="true"
                className="pointer-events-none fixed bottom-0 left-0 right-0 z-50 h-[2px] bg-black/8"
            >
                <motion.div
                    className="absolute inset-y-0 left-0 bg-[#1b1b1b]/35"
                    style={{ scaleX: smoothProgress, transformOrigin: 'left center' }}
                />
            </div>
        </div>
    );
}
