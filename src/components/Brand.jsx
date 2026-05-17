import React from 'react';
import { cn } from '../lib/utils';

export function LogoMark({ size = 40, className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 40 40"
            fill="none"
            className={className}
            style={{ width: size, height: size, flexShrink: 0 }}
            aria-hidden="true"
        >
            <rect width="40" height="40" rx="12" fill="rgb(var(--mark-bg))" />
            <path d="M10 12h8v14c0 3-2 5-5 5s-5-2-5-5v-2h4v1.5c0 .8.5 1.5 1 1.5s1-.7 1-1.5V16h-4V12z" fill="rgb(var(--brand))" />
            <path d="M22 12h10v4h-6v3h5v3h-5v6h-4V12z" fill="rgb(var(--accent))" />
        </svg>
    );
}

export function Wordmark({ className }) {
    return (
        <span className={cn('inline-flex items-baseline gap-0.5 font-black tracking-[-0.06em]', className)}>
            <span style={{ color: 'rgb(var(--text))' }}>Job</span>
            <span style={{ color: 'rgb(var(--brand))' }}>fuz</span>
        </span>
    );
}

export function BrandLockup({ size = 40, wordmarkClassName, className }) {
    return (
        <span className={cn('inline-flex items-center gap-3', className)}>
            <LogoMark size={size} />
            <Wordmark className={cn('text-[1.35rem]', wordmarkClassName)} />
        </span>
    );
}
