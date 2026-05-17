import React, { useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

export default function Toast({ message, onClose, type = 'info' }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const bgStyle =
        type === 'success'
            ? { background: 'rgb(var(--success-soft))', color: 'rgb(var(--success))' }
            : type === 'error'
                ? { background: 'rgb(var(--danger-soft))', color: 'rgb(var(--danger))' }
                : { background: 'rgb(var(--brand-soft))', color: 'rgb(var(--brand))' };

    const IconComp = type === 'success' ? CheckCircle : type === 'error' ? AlertCircle : Info;

    return (
        <AnimatePresence>
            <Motion.div
                key="toast"
                initial={{ opacity: 0, y: 32, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.98 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="fixed bottom-6 left-1/2 z-[9999] flex -translate-x-1/2 items-center gap-3 rounded-full border px-5 py-3 shadow-panel backdrop-blur-xl"
                style={{
                    ...bgStyle,
                    borderColor: 'rgb(var(--border))',
                }}
            >
                <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: 'rgb(var(--surface-elevated) / 0.72)' }}>
                    <IconComp className="h-4 w-4" />
                </div>
                <span className="text-sm font-semibold whitespace-nowrap">{message}</span>
            </Motion.div>
        </AnimatePresence>
    );
}

