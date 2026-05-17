import React from 'react';
import { cn } from '../../lib/utils';

export default function Card({ hover = false, className, children, as, ...props }) {
    const Tag = as || 'div';

    return (
        <Tag
            className={cn(
                'rounded-[var(--radius-lg)] border border-border bg-surface/90 backdrop-blur-xl',
                'shadow-card transition-all duration-[220ms]',
                hover && 'hover:-translate-y-1 hover:border-border-strong hover:bg-surface hover:shadow-lift cursor-pointer',
                className,
            )}
            {...props}
        >
            {children}
        </Tag>
    );
}
