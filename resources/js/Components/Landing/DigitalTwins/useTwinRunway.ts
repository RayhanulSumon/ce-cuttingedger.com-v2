import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DIGITAL_TWINS, TWIN_Y0, TWIN_Y1 } from './twins';

export type TwinCursorMode = 'hidden' | 'ring' | 'drag' | 'buy';

interface TwinRunwayOptions {
    /** Run the animation loop (section is on screen and no overlay covers the runway). */
    running: boolean;
    /** Called when a model is clicked / tapped without dragging. */
    onOpenTwin: (index: number) => void;
}

/** Auto-advance interval in ms. Paused while dragging, and while the pointer rests on a model (not elsewhere on the stage). */
const AUTO_ADVANCE_MS = 2800;
/** Pointer travel (px) below which a press counts as a click rather than a drag. */
const CLICK_SLOP_PX = 6;
/** Exponential approach rate of the runway position towards its target (per ms). */
const FOLLOW_RATE = 0.0072;
const CURSOR_FOLLOW = 0.32;

// Depth stops from d = -1 (leaving front-right) to d = 5 (far back-left):
// x centre, feet line, height (all as fractions of the stage), blur in screen px, opacity.
const DEPTH_X = [1.2, 0.744, 0.496, 0.346, 0.235, 0.15, 0.085];
const DEPTH_FEET = [1.14, 0.89, 0.777, 0.704, 0.651, 0.616, 0.59];
const DEPTH_HEIGHT = [1.18, 0.832, 0.574, 0.436, 0.334, 0.258, 0.19];
const DEPTH_BLUR = [0, 0, 1.5, 4, 8, 12, 17];
const DEPTH_OPACITY = [1, 1, 1, 1, 0.86, 0.5, 0];
const LAST_STOP = DEPTH_X.length - 1;

const TWIN_COUNT = DIGITAL_TWINS.length;
/** Width / height of each model's sprite crop. */
const TWIN_ASPECTS = DIGITAL_TWINS.map((twin) => (twin.x1 - twin.x0) / (TWIN_Y1 - TWIN_Y0));
const wrap = (value: number, n: number) => ((value % n) + n) % n;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/**
 * Drives the Digital Twins runway: a diagonal queue of models that steps forward one look at a time.
 *
 * All per-frame work writes straight to element styles (transform / opacity / filter) —
 * React only re-renders when the front look or the cursor mode actually changes.
 */
export function useTwinRunway({ running, onOpenTwin }: TwinRunwayOptions) {
    const stageRef = useRef<HTMLElement | null>(null);
    const modelRefs = useRef<(HTMLDivElement | null)[]>([]);
    const cursorRef = useRef<HTMLDivElement | null>(null);
    const onOpenTwinRef = useRef(onOpenTwin);
    onOpenTwinRef.current = onOpenTwin;

    const [activeTwinIndex, setActiveTwinIndex] = useState(0);
    const [cursorMode, setCursorMode] = useState<TwinCursorMode>('hidden');
    const [hoveredTwinIndex, setHoveredTwinIndex] = useState<number | null>(null);

    const sim = useRef({
        width: 0,
        height: 0,
        baseHeight: 0,
        position: 0,
        target: 0,
        lastTime: 0,
        dirty: true,
        pointerX: 0,
        pointerY: 0,
        cursorX: 0,
        cursorY: 0,
        pressed: false,
        pressX: 0,
        pressTarget: 0,
        travelled: 0,
        hoveredModel: -1,
    });

    const paint = useCallback(() => {
        const s = sim.current;
        if (!s.width || !s.height || !s.baseHeight) {
            return;
        }

        DIGITAL_TWINS.forEach((_, i) => {
            const el = modelRefs.current[i];
            if (!el) {
                return;
            }
            let depth = wrap(i - s.position, TWIN_COUNT);
            if (depth > TWIN_COUNT - 1) {
                depth -= TWIN_COUNT;
            }
            const stop = clamp(depth + 1, 0, LAST_STOP);
            const lower = Math.floor(stop);
            const upper = Math.min(LAST_STOP, lower + 1);
            const t = stop - lower;
            const mix = (stops: number[]) => stops[lower] + (stops[upper] - stops[lower]) * t;

            const opacity = mix(DEPTH_OPACITY);
            if (opacity < 0.01) {
                el.style.visibility = 'hidden';
                return;
            }

            const height = mix(DEPTH_HEIGHT) * s.height;
            const scale = height / s.baseHeight;
            const x = mix(DEPTH_X) * s.width - height * TWIN_ASPECTS[i] * 0.5;
            const y = mix(DEPTH_FEET) * s.height - height;
            // Quantised so the filter only changes a few times per step instead of every frame.
            const blur = Math.round(mix(DEPTH_BLUR) * 2) / 2;

            el.style.visibility = 'visible';
            el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) scale(${scale.toFixed(4)})`;
            el.style.filter = blur < 0.5 ? 'none' : `blur(${(blur / scale).toFixed(1)}px)`;
            el.style.opacity = opacity.toFixed(3);
            el.style.zIndex = String(100 - Math.round(depth * 10));
        });

        const front = wrap(Math.round(s.position), TWIN_COUNT);
        setActiveTwinIndex((previous) => (previous === front ? previous : front));
    }, []);

    const measure = useCallback(() => {
        const stage = stageRef.current;
        if (!stage) {
            return;
        }
        const s = sim.current;
        s.width = stage.clientWidth;
        s.height = stage.clientHeight;
        s.baseHeight = s.height * 1.2;

        // Layout size is fixed per measure; depth is expressed purely through transform scale.
        TWIN_ASPECTS.forEach((aspect, i) => {
            const el = modelRefs.current[i];
            if (el) {
                el.style.width = `${(s.baseHeight * aspect).toFixed(1)}px`;
                el.style.height = `${s.baseHeight.toFixed(1)}px`;
            }
        });

        s.dirty = true;
        paint();
    }, [paint]);

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

    // Animation loop: eases the runway towards its target and trails the custom cursor.
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
            const dt = s.lastTime ? Math.min(50, now - s.lastTime) : 16;
            s.lastTime = now;
            const before = s.position;

            s.position = reduced ? s.target : s.position + (s.target - s.position) * (1 - Math.exp(-dt * FOLLOW_RATE));
            if (Math.abs(s.target - s.position) < 0.0004) {
                s.position = s.target;
            }
            if (s.position !== before || s.dirty) {
                s.dirty = false;
                paint();
            }

            const dx = s.pointerX - s.cursorX;
            const dy = s.pointerY - s.cursorY;
            if (cursorRef.current && (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05)) {
                s.cursorX += dx * CURSOR_FOLLOW;
                s.cursorY += dy * CURSOR_FOLLOW;
                cursorRef.current.style.transform = `translate3d(${s.cursorX.toFixed(1)}px,${s.cursorY.toFixed(1)}px,0)`;
            }

            frame = requestAnimationFrame(tick);
        };

        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [running, paint]);

    useEffect(() => {
        if (!running) {
            return;
        }
        const timer = window.setInterval(() => {
            const s = sim.current;
            if (!s.pressed && s.hoveredModel < 0 && !document.hidden) {
                s.target = Math.round(s.target) + 1;
            }
        }, AUTO_ADVANCE_MS);
        return () => window.clearInterval(timer);
    }, [running]);

    /** Steps the runway by whole looks. The queue is circular, so the target is never clamped. */
    const stepLook = useCallback((delta: number) => {
        sim.current.target = Math.round(sim.current.target) + delta;
    }, []);

    /** Brings a twin to the front by the shortest way round. */
    const focusTwin = useCallback((index: number) => {
        const s = sim.current;
        const current = Math.round(s.target);
        let delta = wrap(index - current, TWIN_COUNT);
        if (delta > TWIN_COUNT / 2) {
            delta -= TWIN_COUNT;
        }
        s.target = current + delta;
        s.dirty = true;
    }, []);

    /** Records which model the pointer is on: pauses auto-advance and drives the pose preview. */
    const setHoveredModel = (index: number) => {
        sim.current.hoveredModel = index;
        setHoveredTwinIndex(index >= 0 ? index : null);
    };

    const modelIndexAt = (target: EventTarget | null): number => {
        const el = (target as HTMLElement | null)?.closest<HTMLElement>('[data-twin-model]');
        return el ? Number(el.dataset.twinModel) : -1;
    };

    /** Only the front model is "buyable"; blurred background models behave as drag handles. */
    const applyHover = (modelIndex: number) => {
        const isFront = modelIndex >= 0 && modelIndex === wrap(Math.round(sim.current.position), TWIN_COUNT);
        setHoveredModel(isFront ? modelIndex : -1);
        setCursorMode(isFront ? 'buy' : modelIndex >= 0 ? 'drag' : 'ring');
    };

    const onPointerEnter = (event: React.PointerEvent<HTMLElement>) => {
        if (event.pointerType !== 'mouse' || !stageRef.current) {
            return;
        }
        const rect = stageRef.current.getBoundingClientRect();
        const s = sim.current;
        s.pointerX = s.cursorX = event.clientX - rect.left;
        s.pointerY = s.cursorY = event.clientY - rect.top;
        if (cursorRef.current) {
            cursorRef.current.style.transform = `translate3d(${s.cursorX.toFixed(1)}px,${s.cursorY.toFixed(1)}px,0)`;
        }
        setCursorMode('ring');
    };

    const onPointerLeave = () => {
        setHoveredModel(-1);
        setCursorMode('hidden');
    };

    const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
        if (!stageRef.current) {
            return;
        }
        const s = sim.current;
        const rect = stageRef.current.getBoundingClientRect();
        s.pointerX = event.clientX - rect.left;
        s.pointerY = event.clientY - rect.top;

        if (s.pressed) {
            const pull = Math.max(150, s.width * 0.2);
            const dx = event.clientX - s.pressX;
            s.travelled = Math.max(s.travelled, Math.abs(dx));
            // Inverted: drag right → advance forward (natural carousel direction).
            s.target = s.pressTarget + dx / pull;
            return;
        }

        if (event.pointerType === 'mouse') {
            applyHover(modelIndexAt(event.target));
        }
    };

    const onPointerDown = (event: React.PointerEvent<HTMLElement>) => {
        if ((event.target as HTMLElement | null)?.closest('button, a')) {
            return;
        }
        const s = sim.current;
        s.pressed = true;
        s.pressX = event.clientX;
        s.pressTarget = s.target;
        s.travelled = 0;
        event.currentTarget.setPointerCapture(event.pointerId);
        if (event.pointerType === 'mouse') {
            setCursorMode('drag');
        }
    };

    const onPointerUp = (event: React.PointerEvent<HTMLElement>) => {
        const s = sim.current;
        if (!s.pressed) {
            return;
        }
        s.pressed = false;
        s.target = Math.round(s.target);

        // Pointer capture retargets the event to the stage, so hit-test the release point instead.
        const hit = document
            .elementsFromPoint(event.clientX, event.clientY)
            .find((el): el is HTMLElement => el instanceof HTMLElement && el.dataset.twinModel !== undefined);
        const hitIndex = hit ? Number(hit.dataset.twinModel) : -1;

        if (s.travelled < CLICK_SLOP_PX && hitIndex >= 0 && event.type !== 'pointercancel') {
            const isFront = hitIndex === wrap(Math.round(s.position), TWIN_COUNT);
            focusTwin(hitIndex);
            if (isFront) {
                onOpenTwinRef.current(hitIndex);
            }
        }
        if (event.pointerType === 'mouse') {
            applyHover(hitIndex);
        }
    };

    return {
        stageRef,
        modelRefs,
        cursorRef,
        activeTwinIndex,
        cursorMode,
        hoveredTwinIndex,
        stepLook,
        focusTwin,
        stageHandlers: {
            onPointerEnter,
            onPointerLeave,
            onPointerMove,
            onPointerDown,
            onPointerUp,
            onPointerCancel: onPointerUp,
        },
    };
}
