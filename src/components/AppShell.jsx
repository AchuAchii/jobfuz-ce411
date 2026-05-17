import React from 'react';
import { cn } from '../lib/utils';

export default function AppShell({ children, className, maxWidth = 'max-w-7xl' }) {
    return (
        <div className="min-h-screen relative overflow-hidden" style={{ background: 'rgb(var(--bg))' }}>
            <div
                aria-hidden="true"
                className="pointer-events-none fixed inset-0 z-0"
                style={{
                    background: [
                        'radial-gradient(circle at 12% 12%, rgb(var(--accent) / 0.12) 0%, transparent 22%)',
                        'radial-gradient(circle at 88% 4%, rgb(var(--brand) / 0.12) 0%, transparent 20%)',
                        'linear-gradient(180deg, transparent 0%, rgb(var(--surface2) / 0.28) 100%)',
                    ].join(','),
                }}
            />
            <div
                aria-hidden="true"
                className="pointer-events-none fixed inset-x-0 top-0 z-0 h-64"
                style={{
                    background: 'linear-gradient(180deg, rgb(var(--surface-elevated) / 0.4), transparent)',
                }}
            />
            <div className={cn('relative z-10 py-6 px-4 sm:px-6 lg:px-10', className)}>
                <div className={cn(maxWidth, 'mx-auto w-full')}>
                    {children}
                </div>
            </div>
        </div>
    );
}
