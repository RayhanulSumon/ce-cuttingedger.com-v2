import React, { memo } from 'react';
import { Look, LOOKS } from './looks';
import { ACTOR_COUNT, RunwayCursorState } from './useRingRunway';

interface RunwayStageProps {
    looks?: Look[];
    actorCount?: number;
    stageRef: React.Ref<HTMLDivElement>;
    actorRefs: React.RefObject<(HTMLDivElement | null)[]>;
    cursorRef: React.Ref<HTMLSpanElement>;
    cursor: RunwayCursorState;
    /** Fade the ring out while the look view is open on top of it. */
    dimmed: boolean;
    handlers: Pick<
        React.HTMLAttributes<HTMLDivElement>,
        'onPointerMove' | 'onPointerLeave' | 'onPointerDown' | 'onPointerUp' | 'onPointerCancel'
    >;
}

const CONTACT_SHADOW =
    'pointer-events-none absolute bottom-0 left-[58%] h-[9%] max-h-[46px] min-h-[14px] w-[150%] -translate-x-1/2 translate-y-1/2 bg-[radial-gradient(closest-side,rgba(20,16,12,0.30),rgba(20,16,12,0.14)_45%,rgba(20,16,12,0.04)_75%,transparent)] blur-[2px]';

/** The ring's models. Positioned by `useRingRunway`, so this never needs to re-render unless looks change. */
const RingActors = memo(function RingActors({
    looks = LOOKS,
    actorCount = ACTOR_COUNT,
    actorRefs,
}: Pick<RunwayStageProps, 'looks' | 'actorCount' | 'actorRefs'>) {
    const activeLooks = looks.length > 0 ? looks : LOOKS;
    const lookCount = activeLooks.length;

    return (
        <>
            {Array.from({ length: actorCount }, (_, actorIndex) => {
                const look = activeLooks[actorIndex % lookCount];
                return (
                    <div
                        key={actorIndex}
                        ref={(el) => {
                            actorRefs.current[actorIndex] = el;
                        }}
                        data-actor-index={actorIndex}
                        className="absolute bottom-0 left-0 origin-bottom opacity-0 will-change-[transform,opacity]"
                    >
                        <span aria-hidden="true" className={CONTACT_SHADOW} />
                        <img
                            src={look.model}
                            srcSet={`${look.model} 640w, ${look.modelHiRes} 1080w`}
                            sizes="(min-width: 1800px) 540px, (min-width: 750px) 420px, 320px"
                            alt={look.name}
                            draggable={false}
                            decoding="async"
                            className="pointer-events-none absolute inset-0 block h-full w-full select-none object-contain object-bottom"
                        />
                    </div>
                );
            })}
        </>
    );
});

function cursorShape(cursor: RunwayCursorState, hidden: boolean): string {
    if (!cursor.on || hidden) {
        return 'scale-30 border-[#151413]/25 bg-white/40 text-[#151413] opacity-0';
    }
    if (cursor.dragging) {
        return 'scale-75 border-[#0e0e0e] bg-[#0e0e0e] text-white opacity-100';
    }
    if (cursor.mode === 'link') {
        return 'scale-20 border-transparent bg-[#0e0e0e] text-white opacity-100';
    }
    return 'scale-100 border-[#151413]/28 bg-white/70 text-[#151413] opacity-100';
}

/** Frosted follower cursor: "Drag" over the stage, "View" over the front model, a dot over side models. */
function RunwayCursor({ cursorRef, cursor, hidden }: { cursorRef: React.Ref<HTMLSpanElement>; cursor: RunwayCursorState; hidden: boolean }) {
    return (
        <span
            ref={cursorRef}
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 z-[1700] hidden h-0 w-0 will-change-transform lg:block"
        >
            <span
                className={`absolute -left-[42px] -top-[42px] grid h-[84px] w-[84px] place-items-center rounded-full border transition-[scale,opacity,background-color,border-color,color] duration-300 ${cursorShape(cursor, hidden)}`}
            >
                {cursor.mode !== 'link' && (
                    <span
                        className={`pl-[0.24em] text-[10px] font-medium uppercase transition-[letter-spacing] duration-300 ${
                            cursor.dragging ? 'tracking-[0.42em]' : 'tracking-[0.24em]'
                        }`}
                    >
                        {cursor.mode === 'view' && !cursor.dragging ? 'View' : 'Drag'}
                    </span>
                )}
            </span>
        </span>
    );
}

/** The 3D ring runway: atmosphere, the models and the custom cursor. */
export function RunwayStage({ looks, actorCount, stageRef, actorRefs, cursorRef, cursor, dimmed, handlers }: RunwayStageProps) {
    return (
        <div
            ref={stageRef}
            role="region"
            aria-roledescription="carousel"
            aria-label="Try the Look — drag or click a model to rotate the ring, click the front model to view outfit pins"
            {...handlers}
            className={`relative min-h-0 flex-1 touch-pan-y select-none overflow-x-clip ${
                cursor.on ? 'lg:cursor-none' : 'cursor-grab active:cursor-grabbing'
            }`}
        >
            <div
                aria-hidden="true"
                className="animate-rw-breathe pointer-events-none absolute -bottom-[16%] left-1/2 aspect-[2.4] w-[min(60%,680px)] bg-[radial-gradient(closest-side,rgba(255,255,255,0.55),rgba(255,255,255,0.18)_55%,rgba(255,255,255,0))]"
            />

            <div
                className="ring-actors absolute inset-0 [mask-image:linear-gradient(90deg,transparent,#000_9%,#000_91%,transparent)]"
                data-dimmed={dimmed}
            >
                <RingActors looks={looks} actorCount={actorCount} actorRefs={actorRefs} />
            </div>

            <RunwayCursor cursorRef={cursorRef} cursor={cursor} hidden={dimmed} />
        </div>
    );
}
