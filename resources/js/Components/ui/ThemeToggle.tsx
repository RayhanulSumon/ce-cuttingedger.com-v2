import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export function ThemeToggle({ className = '' }: { className?: string }) {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            className={`relative inline-flex items-center justify-center p-2 rounded-full border border-white/10 dark:border-white/15 bg-white/5 dark:bg-[#12141a] hover:border-accent/60 hover:text-accent text-neutral-300 dark:text-neutral-200 transition-all duration-300 ${className}`}
        >
            <span className="sr-only">Toggle theme</span>
            {isDark ? (
                <Sun className="w-4 h-4 text-accent transition-transform duration-300 hover:rotate-90" />
            ) : (
                <Moon className="w-4 h-4 text-neutral-800 transition-transform duration-300 hover:-rotate-12" />
            )}
        </button>
    );
}
