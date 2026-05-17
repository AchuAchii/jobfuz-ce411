import React, { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Badge from './ui/Badge';

const ITEMS = [
    {
        q: 'Is Jobfuz free to start?',
        a: 'Yes. Users can create an account and begin the assessment flow without entering payment details.',
    },
    {
        q: 'How long does the full flow take?',
        a: 'Most graduates can complete the five-stage experience in roughly 30 to 45 minutes, depending on how much time they spend reflecting on each response.',
    },
    {
        q: 'What makes the scoring feel useful?',
        a: 'Each stage aims to surface a practical next step. Instead of only showing a score, the experience also highlights strengths, likely gaps, and areas to revisit.',
    },
    {
        q: 'Can users come back and retake stages?',
        a: 'Yes. Progress is designed to be revisited so graduates can compare outcomes, strengthen weaker areas, and practice again later.',
    },
];

function FAQItem({ q, a, isOpen, onToggle }) {
    return (
        <div className="border-b last:border-b-0" style={{ borderColor: 'rgb(var(--border))' }}>
            <button
                type="button"
                onClick={onToggle}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
                aria-expanded={isOpen}
            >
                <span className="text-base font-semibold leading-7" style={{ color: 'rgb(var(--text))' }}>{q}</span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full border" style={{ borderColor: 'rgb(var(--border))', background: isOpen ? 'rgb(var(--brand-soft))' : 'rgb(var(--surface2))', color: isOpen ? 'rgb(var(--brand))' : 'rgb(var(--subtle))' }}>
                    <ChevronDown
                        className="transition-transform duration-200"
                        style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        size={16}
                    />
                </span>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <Motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-5 text-sm leading-7" style={{ color: 'rgb(var(--muted))' }}>
                            {a}
                        </p>
                    </Motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function FAQ() {
    const [openIdx, setOpenIdx] = useState(0);

    return (
        <section className="section-shell px-6 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-11">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:items-start">
                <div>
                    <Badge variant="brand" className="uppercase tracking-[0.18em]">FAQ</Badge>
                    <p className="page-kicker mt-6">Before users begin</p>
                    <h2 className="section-heading max-w-2xl">A few answers that make the product feel easier to trust.</h2>
                    <p className="section-copy max-w-xl">
                        The FAQ is part of the first impression. It should feel concise, candid, and reassuring for students who are new to job-readiness tools.
                    </p>
                </div>

                <div className="panel-surface px-6">
                    {ITEMS.map((item, index) => (
                        <FAQItem
                            key={item.q}
                            q={item.q}
                            a={item.a}
                            isOpen={openIdx === index}
                            onToggle={() => setOpenIdx(openIdx === index ? -1 : index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

