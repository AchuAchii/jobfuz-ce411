import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Bot, Brain, CheckCircle, FileCheck, FileText } from 'lucide-react';
import Badge from './ui/Badge';

const STEPS = [
    {
        number: '01',
        icon: FileCheck,
        title: 'Submit your resume',
        description: 'Start with your strongest application artifact and uncover what recruiters are likely to notice first.',
    },
    {
        number: '02',
        icon: CheckCircle,
        title: 'Take a focused MCQ',
        description: 'Answer role-based questions that quickly surface where your knowledge feels steady or still shaky.',
    },
    {
        number: '03',
        icon: FileText,
        title: 'Practice written thinking',
        description: 'Use structured essay prompts to show reasoning, clarity, and professional communication.',
    },
    {
        number: '04',
        icon: Brain,
        title: 'Review work style',
        description: 'Reflect on how you collaborate, prioritize, and operate in a team environment.',
    },
    {
        number: '05',
        icon: Bot,
        title: 'Rehearse the interview',
        description: 'Finish with conversational practice so your first live interview feels more familiar.',
    },
];

export default function HowItWorks() {
    return (
        <section className="section-shell px-6 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-11">
            <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <Badge variant="muted" className="uppercase tracking-[0.18em]">Process</Badge>
                    <p className="page-kicker mt-6">A guided five-part flow</p>
                    <h2 className="section-heading max-w-3xl">Structured enough to feel credible, simple enough to finish.</h2>
                </div>
                <p className="section-copy max-w-xl">
                    The sequence is designed to move from application quality to technical proof, then into communication and self-awareness.
                </p>
            </div>

            <div className="grid gap-4">
                {STEPS.map((step, index) => {
                    const Icon = step.icon;
                    return (
                        <Motion.article
                            key={step.number}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            className="interactive-tile grid gap-4 p-5 md:grid-cols-[auto_minmax(0,0.7fr)_minmax(0,1fr)] md:items-center"
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-[2.2rem] font-black tracking-[-0.08em]" style={{ color: 'rgb(var(--brand))' }}>
                                    {step.number}
                                </span>
                                <span className="flex h-12 w-12 items-center justify-center rounded-[18px]" style={{ background: 'rgb(var(--brand-soft))', color: 'rgb(var(--brand))' }}>
                                    <Icon size={18} />
                                </span>
                            </div>
                            <h3 className="text-xl font-black tracking-[-0.04em]" style={{ color: 'rgb(var(--text))' }}>
                                {step.title}
                            </h3>
                            <p className="text-sm leading-7" style={{ color: 'rgb(var(--muted))' }}>
                                {step.description}
                            </p>
                        </Motion.article>
                    );
                })}
            </div>
        </section>
    );
}

