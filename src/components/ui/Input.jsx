import React from 'react';
import { cn } from '../../lib/utils';

export default function Input({ startIcon, endIcon, onEndIconClick, className, ...props }) {
    const base = cn(
        'w-full rounded-[var(--radius)] border border-border',
        'bg-surface/90 text-text text-sm shadow-card',
        'placeholder:text-subtle',
        'transition-all duration-[220ms]',
        'focus:outline-none focus:border-border-strong focus:bg-surface',
        'focus:ring-2 focus:ring-brand/15',
        'disabled:opacity-45 disabled:cursor-not-allowed',
    );

    const pl = startIcon ? 'pl-11' : 'px-4';
    const pr = endIcon ? 'pr-11' : 'pr-4';

    return (
        <div className="relative">
            {startIcon && (
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle pointer-events-none">
                    {startIcon}
                </span>
            )}
            <input className={cn(base, pl, pr, 'py-3', className)} {...props} />
            {endIcon && (
                <button
                    type="button"
                    tabIndex={-1}
                    onClick={onEndIconClick}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-subtle hover:text-text transition-colors duration-[150ms]"
                >
                    {endIcon}
                </button>
            )}
        </div>
    );
}
