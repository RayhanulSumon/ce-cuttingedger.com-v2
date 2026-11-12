import React, { useCallback, useEffect, useState } from 'react';
import { DARK_SECTIONS, STAGE_TRANSITION_MS } from './shared';

interface FullpageStageProps {
    index: number;
    sections: React.ReactNode[];
}

interface StageView {
    index: number;
    /** Section still on screen while it animates out, or null once the stage has settled. */
    leaving: number | null;
    direction: 'forward' | 'backward' | 'none';
}

/**
 * Fullpage stage: every section is a stacked panel and only two of them are ever painted —
 * the active one and, during a change, the one leaving.
 *
 * The motion itself lives in app.css (`.fp-stage` / `.fp-panel`) as transform + opacity
 * keyframes, so it runs on the GPU compositor and is unaffected by React renders.
 * This component only decides which panel plays which role.
 */
export function FullpageStage({ index, sections }: FullpageStageProps) {
    const [view, setView] = useState<StageView>({ index, leaving: null, direction: 'none' });

    if (view.index !== index) {
        setView({ index, leaving: view.index, direction: index > view.index ? 'forward' : 'backward' });
    }

    const settle = useCallback(() => {
        setView((current) => (current.leaving === null ? current : { ...current, leaving: null, direction: 'none' }));
    }, []);

    // Safety net in case `animationend` never fires (tab hidden mid-transition, etc.).
    useEffect(() => {
        if (view.leaving === null) {
            return;
        }
        const timer = window.setTimeout(settle, STAGE_TRANSITION_MS + 200);
        return () => window.clearTimeout(timer);
    }, [view.leaving, view.index, settle]);

    const handleAnimationEnd = (event: React.AnimationEvent<HTMLElement>) => {
        const isPanelAnimation = event.target === event.currentTarget && event.animationName.startsWith('fp-');
        if (isPanelAnimation && event.pseudoElement === '') {
            settle();
        }
    };

    const count = sections.length;
    const progress = count > 1 ? index / (count - 1) : 0;
    const dark = DARK_SECTIONS.includes(index);

    return (
        <div
            className="fp-stage fixed inset-0 overflow-hidden"
            data-dir={view.direction}
            style={{ '--fp-duration': `${STAGE_TRANSITION_MS}ms` } as React.CSSProperties}
        >
            {sections.map((section, i) => {
                const state = i === view.index ? 'active' : i === view.leaving ? 'leaving' : 'idle';

                return (
                    <section
                        key={i}
                        className="fp-panel"
                        data-state={state}
                        aria-hidden={state !== 'active'}
                        inert={state !== 'active'}
                        onAnimationEnd={state === 'active' ? handleAnimationEnd : undefined}
                    >
                        {section}
                    </section>
                );
            })}

            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-50 h-[2px] bg-black/8">
                <div
                    className={`fp-progress absolute inset-0 ${dark ? 'bg-white/50' : 'bg-[#1b1b1b]/35'}`}
                    style={{ transform: `scaleX(${progress})` }}
                />
            </div>
        </div>
    );
}
