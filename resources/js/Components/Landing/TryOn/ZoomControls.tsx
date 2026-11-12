import React from 'react';
import { RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

interface ZoomControlsProps {
    zoom: number;
    maxZoom: number;
    /** What is being zoomed, for the button labels (e.g. "model", "piece"). */
    subject: string;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onReset: () => void;
}

const ICON_BUTTON =
    'grid h-6 w-6 place-items-center rounded-full text-[#151413] transition-colors hover:bg-[#151413]/10 disabled:pointer-events-none disabled:opacity-30';

/** Floating − / % / + pill shared by the model and garment viewers. */
export function ZoomControls({ zoom, maxZoom, subject, onZoomIn, onZoomOut, onReset }: ZoomControlsProps) {
    return (
        <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-[#151413]/15 bg-white/95 px-2.5 py-1 shadow-sm">
            <button type="button" onClick={onZoomOut} disabled={zoom <= 1} aria-label={`Zoom out ${subject}`} className={ICON_BUTTON}>
                <ZoomOut size={13} />
            </button>
            <span className="min-w-[38px] text-center text-[11px] font-semibold tabular-nums text-[#151413]">
                {Math.round(zoom * 100)}%
            </span>
            <button type="button" onClick={onZoomIn} disabled={zoom >= maxZoom} aria-label={`Zoom in ${subject}`} className={ICON_BUTTON}>
                <ZoomIn size={13} />
            </button>
            {zoom > 1 && (
                <button
                    type="button"
                    onClick={onReset}
                    aria-label={`Reset ${subject} zoom`}
                    className="ml-1 flex items-center gap-1 rounded-full bg-[#151413] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white transition-colors hover:bg-[#333]"
                >
                    <RotateCcw size={10} />
                    <span>Reset</span>
                </button>
            )}
        </div>
    );
}
