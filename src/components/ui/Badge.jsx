import React from 'react';
import { cn } from '../../lib/utils';

const variants = {
    default: 'border border-border bg-surface2/90 text-text',
    muted: 'border border-border bg-surface/90 text-muted',
    brand: 'border border-brand/20 bg-brand-dim text-brand',
    success: 'border border-success/30 bg-success/10 text-success',
    warning: 'border border-warn/30 text-warn',
    error: 'border border-danger/30 bg-danger/10 text-danger',
};

export default function Badge({ variant = 'default', className, children, ...props }) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold',
                variants[variant] ?? variants.default,
                className,
            )}
            {...props}
        >
            {children}
        </span>
    );
}
