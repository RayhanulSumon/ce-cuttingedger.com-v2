import React, { useEffect, useState } from 'react';

export function CursorFollower() {
    const [position, setPosition] = useState({ x: -100, y: -100 });
    const [isHovered, setIsHovered] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const [label, setLabel] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Disable on touch devices or reduced motion
        if (window.matchMedia('(pointer: coarse)').matches || 
            window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const onMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
            if (!isVisible) setIsVisible(true);

            // Check if hovering interactive target
            const target = e.target as HTMLElement | null;
            if (target) {
                const interactive = target.closest('a, button, [role="button"], input, textarea, .cursor-interactive');
                const viewTarget = target.closest('[data-cursor-view]');

                if (viewTarget) {
                    setIsHovered(true);
                    setLabel(viewTarget.getAttribute('data-cursor-view') || 'VIEW');
                } else if (interactive) {
                    setIsHovered(true);
                    setLabel(null);
                } else {
                    setIsHovered(false);
                    setLabel(null);
                }
            }
        };

        const onMouseDown = () => setIsClicking(true);
        const onMouseUp = () => setIsClicking(false);
        const onMouseLeave = () => setIsVisible(false);

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);
        document.documentElement.addEventListener('mouseleave', onMouseLeave);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
            document.documentElement.removeEventListener('mouseleave', onMouseLeave);
        };
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <aside aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden hidden md:block">
            {/* Trailing Ring / Pill */}
            <div
                className={`fixed top-0 left-0 rounded-full flex items-center justify-center font-display text-[10px] font-bold tracking-widest uppercase transition-all duration-150 ease-out ${
                    label 
                        ? 'w-20 h-20 bg-[#d4ff00] text-black shadow-lg shadow-[#d4ff00]/40 scale-100'
                        : isHovered
                        ? 'w-12 h-12 border-2 border-[#d4ff00] bg-[#d4ff00]/10 backdrop-blur-[2px] scale-110'
                        : isClicking
                        ? 'w-7 h-7 border border-[#d4ff00] bg-[#d4ff00]/30 scale-90'
                        : 'w-8 h-8 border border-white/20 dark:border-white/30'
                }`}
                style={{
                    transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`,
                }}
            >
                {label && <span>{label}</span>}
            </div>

            {/* Sharp Center Pointer Dot */}
            {!label && (
                <div
                    className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-[#d4ff00] transition-transform duration-75 ease-out"
                    style={{
                        transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`,
                    }}
                />
            )}
        </aside>
    );
}
