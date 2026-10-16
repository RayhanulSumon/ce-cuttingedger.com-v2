import { useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

export function useTheme() {
    const [theme, setTheme] = useState<Theme>('dark');

    useEffect(() => {
        try {
            const saved = localStorage.getItem('cuttingedger_theme') as Theme | null;
            if (saved === 'light' || saved === 'dark') {
                setTheme(saved);
                applyTheme(saved);
            } else {
                const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const initialTheme = systemPrefersDark ? 'dark' : 'dark'; // Dark-first default
                setTheme(initialTheme);
                applyTheme(initialTheme);
            }
        } catch {
            applyTheme('dark');
        }
    }, []);

    const applyTheme = (newTheme: Theme) => {
        const root = document.documentElement;
        if (newTheme === 'dark') {
            root.classList.add('dark');
            root.classList.remove('light');
        } else {
            root.classList.remove('dark');
            root.classList.add('light');
        }
    };

    const toggleTheme = () => {
        const next = theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        applyTheme(next);
        try {
            localStorage.setItem('cuttingedger_theme', next);
        } catch {
            // ignore localStorage quota errors
        }
    };

    return { theme, toggleTheme, isDark: theme === 'dark' };
}
