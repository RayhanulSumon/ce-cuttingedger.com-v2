import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Sparkles, MoveHorizontal } from 'lucide-react';

export interface BeforeAfterSliderProps {
    beforeImage: string;
    afterImage: string;
    beforeLabel?: string;
    afterLabel?: string;
    className?: string;
    initialPosition?: number;
    altText?: string;
}

export function BeforeAfterSlider({
    beforeImage,
    afterImage,
    beforeLabel = 'RAW STUDIO CAPTURE',
    afterLabel = 'FINAL RETOUCHED GRADE',
    className = '',
    initialPosition = 50,
    altText = 'Before and After Image Comparison',
}: BeforeAfterSliderProps) {
    const [sliderPosition, setSliderPosition] = useState<number>(initialPosition);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMove = useCallback((clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
        setSliderPosition(position);
    }, []);

    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (!isDragging) return;
        if (e.touches[0]) {
            handleMove(e.touches[0].clientX);
        }
    }, [isDragging, handleMove]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging) return;
        handleMove(e.clientX);
    }, [isDragging, handleMove]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchmove', handleTouchMove, { passive: true });
            window.addEventListener('touchend', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            setSliderPosition((prev) => Math.max(0, prev - 3));
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            setSliderPosition((prev) => Math.min(100, prev + 3));
        }
    };

    return (
        <div
            ref={containerRef}
            tabIndex={0}
            role="slider"
            aria-valuenow={Math.round(sliderPosition)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={altText}
            onKeyDown={handleKeyDown}
            onMouseDown={() => setIsDragging(true)}
            onTouchStart={() => setIsDragging(true)}
            className={`relative w-full aspect-[4/3] sm:aspect-[16/10] overflow-hidden rounded-3xl select-none cursor-ew-resize border border-white/10 bg-[#12141c] shadow-2xl focus:outline-none focus:ring-2 focus:ring-accent ${className}`}
        >
            {/* 1. Underlying AFTER Image (Right Side - Retouched Masterpiece) */}
            <img
                src={afterImage}
                alt={`${altText} - ${afterLabel}`}
                className="absolute inset-0 w-full h-full object-contain p-2 sm:p-4 object-center pointer-events-none select-none"
                loading="eager"
            />

            {/* After Tag Badge */}
            <div className="absolute top-4 right-4 z-20 pointer-events-none">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/85 backdrop-blur-md border border-accent/40 text-[11px] font-mono uppercase tracking-wider text-accent font-semibold shadow-lg">
                    <Sparkles className="w-3 h-3 text-accent" />
                    <span>{afterLabel}</span>
                </span>
            </div>

            {/* 2. Layered BEFORE Image (Left Side - Cleanly sliced with CSS clip-path) */}
            <div
                className="absolute inset-0 pointer-events-none select-none"
                style={{
                    clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                    WebkitClipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                }}
            >
                <img
                    src={beforeImage}
                    alt={`${altText} - ${beforeLabel}`}
                    className="w-full h-full object-contain p-2 sm:p-4 object-center pointer-events-none select-none"
                    loading="eager"
                />
            </div>

            {/* Before Tag Badge */}
            <div className="absolute top-4 left-4 z-20 pointer-events-none">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/85 backdrop-blur-md border border-white/20 text-[11px] font-mono uppercase tracking-wider text-neutral-300 font-semibold shadow-lg">
                    <span>{beforeLabel}</span>
                </span>
            </div>

            {/* 3. Draggable Divider Handle (Directly at Middle Pointer on Mount) */}
            <div
                className="absolute top-0 bottom-0 z-30 pointer-events-none flex items-center justify-center -translate-x-1/2"
                style={{ left: `${sliderPosition}%` }}
            >
                {/* Thin Vertical Divider Line */}
                <div className="w-[2px] h-full bg-white shadow-[0_0_10px_rgba(251,183,24,0.8)]" />

                {/* Circular Center Pill */}
                <div
                    className={`absolute w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#0a0b0e] border-2 border-accent text-accent flex items-center justify-center shadow-[0_0_20px_rgba(251,183,24,0.4)] transition-transform duration-150 ${
                        isDragging ? 'scale-115' : 'hover:scale-110'
                    }`}
                >
                    <MoveHorizontal className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                </div>
            </div>

            {/* Bottom Interaction Prompt */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none transition-opacity duration-300 opacity-75 hover:opacity-100">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono uppercase tracking-widest text-neutral-400 border border-white/10">
                    Drag or use arrow keys to compare
                </span>
            </div>
        </div>
    );
}
