import React, { forwardRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@inertiajs/react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    withArrow?: boolean;
    href?: string;
    isExternal?: boolean;
    children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    variant = 'primary',
    size = 'md',
    withArrow = false,
    href,
    isExternal = false,
    className = '',
    children,
    ...props
}, ref) => {
    const sizeClasses = {
        sm: 'px-4 py-2 text-xs font-semibold tracking-wider uppercase',
        md: 'px-6 py-3.5 text-xs md:text-sm font-bold tracking-wider uppercase',
        lg: 'px-8 py-4 text-sm md:text-base font-bold tracking-wider uppercase',
    };

    const variantClasses = {
        primary: 'bg-[#d4ff00] text-black hover:bg-[#c2eb00] hover:shadow-[0_0_25px_rgba(212,255,0,0.35)] font-display active:scale-95',
        secondary: 'bg-white/10 dark:bg-white/5 text-neutral-900 dark:text-white border border-black/10 dark:border-white/10 hover:border-[#d4ff00]/60 hover:text-[#d4ff00] dark:hover:text-[#d4ff00] backdrop-blur-md active:scale-95',
        outline: 'border border-black/20 dark:border-white/20 text-neutral-900 dark:text-white hover:border-[#d4ff00] hover:text-[#d4ff00] bg-transparent active:scale-95',
        ghost: 'text-neutral-700 dark:text-neutral-300 hover:text-[#d4ff00] dark:hover:text-[#d4ff00] bg-transparent',
    };

    const baseClasses = `group relative inline-flex items-center justify-center gap-2 rounded-full transition-all duration-300 overflow-hidden select-none cursor-pointer ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

    const content = (
        <>
            <span className="relative z-10 flex items-center gap-2">
                {children}
                {withArrow && (
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                )}
            </span>
        </>
    );

    if (href) {
        if (isExternal) {
            return (
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={baseClasses}
                >
                    {content}
                </a>
            );
        }
        return (
            <Link href={href} className={baseClasses}>
                {content}
            </Link>
        );
    }

    return (
        <button ref={ref} className={baseClasses} {...props}>
            {content}
        </button>
    );
});

Button.displayName = 'Button';
