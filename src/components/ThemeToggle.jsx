import React from 'react';
import { MoonStar, SunMedium } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { cn } from '../lib/utils';

export default function ThemeToggle({ className, compact = false }) {
    const { theme, toggleTheme, isDark } = useTheme();

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            className={cn(
                'group inline-flex items-center gap-2.5 rounded-full border transition-all duration-200',
                compact ? 'px-3 py-2' : 'px-3.5 py-2.5',
                className,
            )}
            style={{
                background: 'rgb(var(--surface-elevated) / 0.88)',
                borderColor: 'rgb(var(--border))',
                color: 'rgb(var(--text))',
                boxShadow: 'var(--shadow-card)',
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
            }}
        >
            <span
                className="flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200"
                style={{
                    background: isDark ? 'rgb(var(--surface3))' : 'rgb(var(--brand-soft))',
                    color: isDark ? 'rgb(var(--accent))' : 'rgb(var(--brand))',
                }}
            >
                {isDark ? <MoonStar size={15} /> : <SunMedium size={15} />}
            </span>
            {!compact && (
                <span className="text-xs font-semibold tracking-[0.12em] uppercase" style={{ color: 'rgb(var(--muted))' }}>
                    {theme}
                </span>
            )}
        </button>
    );
}
