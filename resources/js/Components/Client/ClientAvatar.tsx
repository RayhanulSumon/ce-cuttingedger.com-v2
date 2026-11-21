import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export type ClientAvatarSize = 'sm' | 'md' | 'lg' | 'xl';

const SIZE_CLASSES: Record<ClientAvatarSize, string> = {
    sm: 'h-7 w-7 text-2xs',
    md: 'h-9 w-9 text-xs',
    lg: 'h-12 w-12 text-sm',
    xl: 'h-20 w-20 text-xl',
};

function getInitials(name?: string | null): string {
    const trimmed = (name || '').trim();
    if (!trimmed) {
        return 'C';
    }
    const parts = trimmed.split(/\s+/).filter(Boolean);
    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }
    return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
}

interface ClientAvatarProps {
    src?: string | null;
    name?: string | null;
    size?: ClientAvatarSize;
    className?: string;
}

/** Circular client avatar displaying an uploaded/OAuth photo with clean initials fallback. */
export function ClientAvatar({ src, name, size = 'md', className }: ClientAvatarProps) {
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setHasError(false);
    }, [src]);

    const sizeClass = SIZE_CLASSES[size];
    const initials = getInitials(name);

    if (src && !hasError) {
        return (
            <img
                src={src}
                alt={name ? `${name} avatar` : 'Client avatar'}
                onError={() => setHasError(true)}
                className={cn(
                    'shrink-0 rounded-full border border-line bg-surface-2 object-cover',
                    sizeClass,
                    className
                )}
            />
        );
    }

    return (
        <span
            aria-label={name ? `${name} avatar` : 'Client avatar'}
            className={cn(
                'inline-flex shrink-0 select-none items-center justify-center rounded-full border border-primary/15 bg-primary/10 font-bold text-primary',
                sizeClass,
                className
            )}
        >
            {initials}
        </span>
    );
}
