import React, { useCallback, useEffect, useRef, useState } from 'react';
import { LOOKS } from './looks';

export interface RunwayCursorState {
    on: boolean;
    /** `view` over the front model, `link` over a side model, `drag` over empty stage. */
    mode: 'drag' | 'view' | 'link';
    dragging: boolean;
}

interface RingRunwayOptions {
    /** Run the physics loop (section is on screen). */
    running: boolean;
    /** Accept drags and clicks on the stage (false while the look view covers it). */
    interactive: boolean;
    onLookChange: (lookIndex: number) => void;
    onFrontActorClick: () => void;
}

export const LOOK_COUNT = LOOKS.length;
/** Every look appears twice so the ring reads as a full circle of models. */
export const ACTOR_COUNT = LOOK_COUNT * 2;

const TAU = Math.PI * 2;
const ACTOR_STEP = TAU / ACTOR_COUNT;
/** Model image aspect ratio (9:16). */
const MODEL_ASPECT = 0.5625;
/** Extra scale given to the model standing at the front. */
const FRONT_SCALE = 1.08;
/** Critically damped spring pulling the ring towards its target slot. */
const SPRING_STIFFNESS = 150;
const SPRING_DAMPING = 2 * Math.sqrt(SPRING_STIFFNESS);
const SPRING_SUBSTEPS = 3;
const CURSOR_FOLLOW = 0.18;
const CLICK_SLOP_PX = 8;
const MOBILE_MAX_WIDTH = 749;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const mod = (value: number, n: number) => ((value % n) + n) % n;

/**
 * Drives the Try-On runway: twelve models standing on a perspective ring that the visitor
 * can drag, click or auto-play through.
 *
 * Actor styles (transform / opacity / filter) are written directly from the animation loop,
 * and only while the ring is actually moving — React state is limited to the current look
 * and the custom cursor's mode.
 */
export function useRingRunway({ running, interactive, onLookChange, onFrontActorClick }: RingRunwayOptions) {
    const stageRef = useRef<HTMLDivElement | null>(null);
    const actorRefs = useRef<(HTMLDivElement | null)[]>([]);
    const cursorRef = useRef<HTMLSpanElement | null>(null);
    const callbacks = useRef({ onLookChange, onFrontActorClick });
    callbacks.current = { onLookChange, onFrontActorClick };

    const [cursor, setCursor] = useState<RunwayCursorState>({ on: false, mode: 'drag', dragging: false });

    const sim = useRef({
        width: 0,
        height: 0,
        centerX: 0,
        radius: 0,
        perspective: 0,
        floor: 0,
        horizon: 0,
        modelHeight: 480,
        dragUnit: 180,
        position: 0,
        target: 0,
        velocity: 0,
        lastTime: 0,
        dirty: true,
        dragging: false,
        pressX: 0,
        pressTarget: 0,
        travelled: 0,
        lookIndex: 0,
        cursorX: 0,
        cursorY: 0,
        pointerX: 0,
        pointerY: 0,
        cursorOn: false,
    });

    const placeRing = useCallback(() => {
        const s = sim.current;
        if (!s.width || !s.height) {
            return;
        }
        const modelWidth = s.modelHeight * MODEL_ASPECT;

        for (let a = 0; a < ACTOR_COUNT; a++) {
            const el = actorRefs.current[a];
            if (!el) {
                continue;
            }
            let angle = ((a - s.position) * ACTOR_STEP) % TAU;
            if (angle > Math.PI) {
                angle -= TAU;
            } else if (angle < -Math.PI) {
                angle += TAU;
            }

            const depth = s.radius * (1 - Math.cos(angle));
            const slotsFromFront = Math.abs(angle) / ACTOR_STEP;
            const projection = s.perspective / (s.perspective + depth);
            const scale = projection * (1 + (FRONT_SCALE - 1) * clamp(1 - slotsFromFront, 0, 1));
            const x = s.centerX + s.radius * Math.sin(angle) * projection;
            const feet = s.horizon + (s.floor - s.horizon) * projection;

            let opacity = clamp((Math.cos(angle) + 0.55) / 0.3, 0, 1);
            const halfWidth = modelWidth * scale * 0.5;
            if (x + halfWidth < -4 || x - halfWidth > s.width + 4) {
                opacity = 0;
            }

            const style = el.style;
            if (opacity < 0.01) {
                style.visibility = 'hidden';
                el.dataset.frontActor = 'false';
                continue;
            }

            const rawBlur = slotsFromFront <= 1 ? 1.8 * slotsFromFront : Math.min(1.8 + (slotsFromFront - 1) * 2, 6.5);
            // Quantised so the filter is re-rasterised a handful of times per step, not every frame.
            const blur = Math.round(rawBlur * 2) / 2;

            style.visibility = 'visible';
            style.transform = `translate3d(${x.toFixed(2)}px,${(feet - s.height).toFixed(2)}px,0) translateX(-50%) scale(${scale.toFixed(4)})`;
            style.opacity = opacity.toFixed(3);
            style.zIndex = String(Math.round(scale * 1000));
            style.pointerEvents = opacity < 0.5 ? 'none' : 'auto';
            style.filter = blur > 0 ? `blur(${blur}px)` : 'none';
            el.dataset.frontActor = slotsFromFront < 0.35 ? 'true' : 'false';
        }
    }, []);

    const measure = useCallback(() => {
        const stage = stageRef.current;
        if (!stage) {
            return;
        }
        const width = stage.clientWidth;
        const height = stage.clientHeight;
        if (!width || !height) {
            return;
        }
        const mobile = window.innerWidth <= MOBILE_MAX_WIDTH;
        const s = sim.current;
        s.width = width;
        s.height = height;
        s.modelHeight = Math.max(200, Math.round((height - 34 - 18) / FRONT_SCALE));
        s.centerX = width * 0.5;
        s.radius = width * (mobile ? 0.72 : 0.62);
        s.perspective = width * (mobile ? 1.9 : 1.65);
        s.floor = height - 34;
        s.horizon = height * 0.36;
        s.dragUnit = Math.max(mobile ? 90 : 120, width * 0.3);

        // Layout size is fixed per measure; depth is expressed purely through transform scale.
        const modelWidth = Math.round(s.modelHeight * MODEL_ASPECT);
        actorRefs.current.forEach((el) => {
            if (el) {
                el.style.height = `${s.modelHeight}px`;
                el.style.width = `${modelWidth}px`;
            }
        });

        placeRing();
    }, [placeRing]);

    useEffect(() => {
        measure();
        const stage = stageRef.current;
        if (!stage) {
            return;
        }
        const observer = new ResizeObserver(measure);
        observer.observe(stage);
        return () => observer.disconnect();
    }, [measure]);

    useEffect(() => {
        if (!running) {
            return;
        }
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const s = sim.current;
        s.lastTime = 0;
        s.dirty = true;
        let frame = 0;

        const tick = (now: number) => {
            const dt = s.lastTime ? Math.min(0.034, (now - s.lastTime) / 1000) : 1 / 60;
            s.lastTime = now;

            if (s.position !== s.target || s.velocity !== 0 || s.dirty) {
                if (reduced) {
                    s.position = s.target;
                    s.velocity = 0;
                } else {
                    const h = dt / SPRING_SUBSTEPS;
                    for (let i = 0; i < SPRING_SUBSTEPS; i++) {
                        const acceleration = -SPRING_STIFFNESS * (s.position - s.target) - SPRING_DAMPING * s.velocity;
                        s.velocity += acceleration * h;
                        s.position += s.velocity * h;
                    }
                    if (Math.abs(s.position - s.target) <= 0.0005 && Math.abs(s.velocity) <= 0.0005) {
                        s.position = s.target;
                        s.velocity = 0;
                    }
                }
                s.dirty = false;
                placeRing();
            }

            const dx = s.pointerX - s.cursorX;
            const dy = s.pointerY - s.cursorY;
            if (cursorRef.current && (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05)) {
                const follow = reduced ? 1 : CURSOR_FOLLOW;
                s.cursorX += dx * follow;
                s.cursorY += dy * follow;
                cursorRef.current.style.transform = `translate3d(${s.cursorX.toFixed(1)}px,${s.cursorY.toFixed(1)}px,0)`;
            }

            frame = requestAnimationFrame(tick);
        };

        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [running, placeRing]);

    const reportLook = (target: number) => {
        const lookIndex = mod(Math.round(target), LOOK_COUNT);
        if (lookIndex !== sim.current.lookIndex) {
            sim.current.lookIndex = lookIndex;
            callbacks.current.onLookChange(lookIndex);
        }
    };

    const moveTo = useCallback((target: number) => {
        sim.current.target = target;
        reportLook(target);
    }, []);

    const stepLook = useCallback((delta: number) => moveTo(Math.round(sim.current.target) + delta), [moveTo]);

    /** Rotates to a look by the shortest way round. */
    const goToLook = useCallback(
        (lookIndex: number) => {
            const current = Math.round(sim.current.target);
            let delta = mod(lookIndex - current, LOOK_COUNT);
            if (delta > LOOK_COUNT / 2) {
                delta -= LOOK_COUNT;
            }
            moveTo(current + delta);
        },
        [moveTo],
    );

    const isDragging = useCallback(() => sim.current.dragging, []);

    /** Screen rect of the model currently standing at the front, or null while the ring is between slots. */
    const getFrontActorRect = useCallback((): DOMRect | null => {
        const front = actorRefs.current.find((el) => el?.dataset.frontActor === 'true');
        return front ? front.getBoundingClientRect() : null;
    }, []);

    const actorAt = (clientX: number, clientY: number): HTMLElement | null => {
        for (const el of document.elementsFromPoint(clientX, clientY)) {
            const actor = el instanceof HTMLElement ? el.closest<HTMLElement>('[data-actor-index]') : null;
            if (actor) {
                return actor;
            }
        }
        return null;
    };

    const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        if (!stageRef.current) {
            return;
        }
        const s = sim.current;
        const rect = stageRef.current.getBoundingClientRect();
        s.pointerX = event.clientX - rect.left;
        s.pointerY = event.clientY - rect.top;

        // First contact: jump the cursor to the pointer instead of sweeping in from the corner.
        if (!s.cursorOn && event.pointerType === 'mouse') {
            s.cursorX = s.pointerX;
            s.cursorY = s.pointerY;
            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate3d(${s.cursorX.toFixed(1)}px,${s.cursorY.toFixed(1)}px,0)`;
            }
        }

        if (s.dragging) {
            const dx = event.clientX - s.pressX;
            s.travelled = Math.max(s.travelled, Math.abs(dx));
            s.target = s.pressTarget - dx / s.dragUnit;
            reportLook(s.target);
            return;
        }

        if (event.pointerType === 'mouse') {
            s.cursorOn = true;
            const actor = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-actor-index]');
            const mode: RunwayCursorState['mode'] = !actor ? 'drag' : actor.dataset.frontActor === 'true' ? 'view' : 'link';
            setCursor((previous) =>
                previous.on && previous.mode === mode && !previous.dragging ? previous : { on: true, mode, dragging: false },
            );
        }
    };

    const onPointerLeave = () => {
        sim.current.cursorOn = false;
        setCursor((previous) => (previous.on || previous.dragging ? { ...previous, on: false, dragging: false } : previous));
    };

    const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        if (!interactive) {
            return;
        }
        const s = sim.current;
        s.dragging = true;
        s.pressX = event.clientX;
        s.pressTarget = s.target;
        s.travelled = 0;
        event.currentTarget.setPointerCapture(event.pointerId);
        if (event.pointerType === 'mouse') {
            setCursor((previous) => ({ ...previous, on: true, dragging: true }));
        }
    };

    const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
        const s = sim.current;
        if (!s.dragging) {
            return;
        }
        s.dragging = false;

        const settled = Math.round(s.target);
        const isClick = s.travelled < CLICK_SLOP_PX && event.type !== 'pointercancel';
        // Pointer capture retargets the event to the stage, so hit-test the release point instead.
        const actor = isClick ? actorAt(event.clientX, event.clientY) : null;

        if (actor?.dataset.frontActor === 'true') {
            moveTo(settled);
            callbacks.current.onFrontActorClick();
        } else if (actor) {
            let delta = mod(Number(actor.dataset.actorIndex) - settled, ACTOR_COUNT);
            if (delta > ACTOR_COUNT / 2) {
                delta -= ACTOR_COUNT;
            }
            moveTo(settled + delta);
        } else {
            moveTo(settled);
        }

        if (event.pointerType === 'mouse') {
            setCursor((previous) => ({ ...previous, dragging: false }));
        }
    };

    return {
        stageRef,
        actorRefs,
        cursorRef,
        cursor,
        stepLook,
        goToLook,
        isDragging,
        getFrontActorRect,
        stageHandlers: {
            onPointerMove,
            onPointerLeave,
            onPointerDown,
            onPointerUp,
            onPointerCancel: onPointerUp,
        },
    };
}
