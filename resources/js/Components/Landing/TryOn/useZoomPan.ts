import React, { useCallback, useEffect, useRef, useState } from 'react';

interface ZoomPanOptions {
    maxZoom: number;
    /** Zoom change per button press. */
    step: number;
    /** Zoom level a double-click jumps to from 100%. */
    focusZoom: number;
    /** Furthest the content may be panned from centre at a given zoom, in px. */
    panLimit: (zoom: number) => { x: number; y: number };
}

const WHEEL_STEP = 0.2;
const DRAG_SLOP_PX = 4;
const ZOOM_TRANSITION = 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/**
 * Zoom + drag-to-pan for a single element.
 *
 * The transform is written straight to the target's style, so panning tracks the pointer
 * 1:1 with no React render per move; only the zoom level is state (for the % read-out).
 *
 * Attach `containerRef` + `containerHandlers` to the interactive area and `targetRef`
 * to the element that should scale.
 */
export function useZoomPan({ maxZoom, step, focusZoom, panLimit }: ZoomPanOptions) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const targetRef = useRef<HTMLElement | null>(null);
    const [zoom, setZoomState] = useState(1);

    const options = useRef({ maxZoom, step, focusZoom, panLimit });
    options.current = { maxZoom, step, focusZoom, panLimit };

    const view = useRef({ zoom: 1, x: 0, y: 0, dragging: false, dragged: false, pressX: 0, pressY: 0, startX: 0, startY: 0 });

    const apply = useCallback((animate: boolean) => {
        const el = targetRef.current;
        if (!el) {
            return;
        }
        const v = view.current;
        const atRest = v.zoom === 1 && v.x === 0 && v.y === 0;
        el.style.transition = animate ? ZOOM_TRANSITION : 'none';
        el.style.transform = atRest ? '' : `translate3d(${v.x.toFixed(1)}px,${v.y.toFixed(1)}px,0) scale(${v.zoom})`;
    }, []);

    const setZoom = useCallback(
        (next: number) => {
            const v = view.current;
            v.zoom = clamp(Number(next.toFixed(2)), 1, options.current.maxZoom);
            const limit = options.current.panLimit(v.zoom);
            v.x = v.zoom === 1 ? 0 : clamp(v.x, -limit.x, limit.x);
            v.y = v.zoom === 1 ? 0 : clamp(v.y, -limit.y, limit.y);
            apply(true);
            setZoomState(v.zoom);
        },
        [apply],
    );

    const zoomIn = useCallback(() => setZoom(view.current.zoom + options.current.step), [setZoom]);
    const zoomOut = useCallback(() => setZoom(view.current.zoom - options.current.step), [setZoom]);
    const reset = useCallback(() => setZoom(1), [setZoom]);

    // React registers wheel listeners as passive, so preventDefault needs a native one.
    useEffect(() => {
        const container = containerRef.current;
        if (!container) {
            return;
        }
        const onWheel = (event: WheelEvent) => {
            event.preventDefault();
            event.stopPropagation();
            setZoom(view.current.zoom + (event.deltaY < 0 ? WHEEL_STEP : -WHEEL_STEP));
        };
        container.addEventListener('wheel', onWheel, { passive: false });
        return () => container.removeEventListener('wheel', onWheel);
    }, [setZoom]);

    const isControl = (target: EventTarget) => Boolean((target as HTMLElement).closest('button'));

    const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        const v = view.current;
        v.dragged = false;
        if (v.zoom <= 1 || isControl(event.target)) {
            return;
        }
        v.dragging = true;
        v.pressX = event.clientX;
        v.pressY = event.clientY;
        v.startX = v.x;
        v.startY = v.y;
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        const v = view.current;
        if (!v.dragging) {
            return;
        }
        const dx = event.clientX - v.pressX;
        const dy = event.clientY - v.pressY;
        if (Math.abs(dx) > DRAG_SLOP_PX || Math.abs(dy) > DRAG_SLOP_PX) {
            v.dragged = true;
        }
        const limit = options.current.panLimit(v.zoom);
        v.x = clamp(v.startX + dx, -limit.x, limit.x);
        v.y = clamp(v.startY + dy, -limit.y, limit.y);
        apply(false);
    };

    const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
        const v = view.current;
        if (!v.dragging) {
            return;
        }
        v.dragging = false;
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
    };

    const onDoubleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (isControl(event.target)) {
            return;
        }
        setZoom(view.current.zoom > 1 ? 1 : options.current.focusZoom);
    };

    /** Swallows the click that ends a pan, so releasing the drag never counts as "click outside". */
    const onClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
        if (view.current.dragged) {
            view.current.dragged = false;
            event.stopPropagation();
            event.preventDefault();
        }
    };

    return {
        containerRef,
        targetRef,
        zoom,
        zoomIn,
        zoomOut,
        reset,
        containerHandlers: {
            onPointerDown,
            onPointerMove,
            onPointerUp,
            onPointerCancel: onPointerUp,
            onDoubleClick,
            onClickCapture,
        },
    };
}
