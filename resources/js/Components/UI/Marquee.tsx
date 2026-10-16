import React from 'react';

interface MarqueeProps {
    children: React.ReactNode;
    direction?: 'left' | 'right';
    speed?: 'normal' | 'fast' | 'slow';
    pauseOnHover?: boolean;
    className?: string;
}

export function Marquee({
    children,
    direction = 'left',
    speed = 'normal',
    pauseOnHover = true,
    className = '',
}: MarqueeProps) {
    const speedClass = {
        slow: 'duration-[45s]',
        normal: 'duration-[28s]',
        fast: 'duration-[16s]',
    }[speed];

    const animationClass = direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right';

    return (
        <div
            className={`marquee-container relative flex overflow-hidden select-none ${
                pauseOnHover ? 'hover:[&_.marquee-track]:[animation-play-state:paused]' : ''
            } ${className}`}
        >
            <div
                className={`marquee-track flex shrink-0 items-center gap-8 ${animationClass} ${speedClass}`}
                style={{ willChange: 'transform' }}
            >
                {children}
                {children}
            </div>
            <div
                aria-hidden="true"
                className={`marquee-track flex shrink-0 items-center gap-8 ${animationClass} ${speedClass}`}
                style={{ willChange: 'transform' }}
            >
                {children}
                {children}
            </div>
        </div>
    );
}
