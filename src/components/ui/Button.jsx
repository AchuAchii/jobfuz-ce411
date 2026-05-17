import React from 'react';
import { cn } from '../../lib/utils';

const variants = {
    primary: 'bg-brand text-text-inverse font-semibold shadow-card hover:bg-brand-hover hover:-translate-y-0.5 active:translate-y-0',
    secondary: 'border border-border bg-surface text-text font-semibold hover:border-border-strong hover:bg-surface2 hover:-translate-y-0.5 active:translate-y-0',
    ghost: 'text-muted hover:bg-surface2 hover:text-text active:bg-surface3',
    danger: 'border border-danger/30 bg-danger/10 text-danger font-semibold hover:bg-danger/20 hover:-translate-y-0.5 active:translate-y-0',
    brand: 'bg-brand-gradient text-text-inverse font-semibold shadow-lift hover:brightness-105 hover:-translate-y-0.5 active:translate-y-0',
};

const sizes = {
    sm: 'px-3.5 py-2 text-xs gap-1.5',
    md: 'px-4.5 py-2.5 text-sm gap-2',
    lg: 'px-5.5 py-3 text-sm gap-2',
    xl: 'px-7 py-4 text-base gap-2.5',
};

const rounds = {
    none: '',
    sm: 'rounded-xl',
    md: 'rounded-[var(--radius)]',
    lg: 'rounded-[var(--radius-lg)]',
    xl: 'rounded-[var(--radius-lg)]',
    full: 'rounded-full',
};

export default function Button({
    as: Tag = 'button',
    variant = 'primary',
    size = 'md',
    rounded = 'md',
    className,
    children,
    disabled,
    ...props
}) {
    const isNativeButton = Tag === 'button';

    const cls = cn(
        'inline-flex items-center justify-center whitespace-nowrap',
        'cursor-pointer select-none font-medium',
        'transition-all duration-[220ms]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
        isNativeButton && 'disabled:opacity-45 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none',
        disabled && !isNativeButton && 'opacity-45 cursor-not-allowed',
        variants[variant] ?? variants.primary,
        sizes[size] ?? sizes.md,
        rounds[rounded] ?? rounds.md,
        className,
    );

    if (!isNativeButton) {
        const { type: _type, ...rest } = props;
        return (
            <Tag
                className={cls}
                role="button"
                tabIndex={disabled ? -1 : 0}
                aria-disabled={disabled}
                onKeyDown={(e) => {
                    if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        e.currentTarget.click();
                    }
                }}
                {...rest}
            >
                {children}
            </Tag>
        );
    }

    return (
        <button disabled={disabled} className={cls} {...props}>
            {children}
        </button>
    );
}
