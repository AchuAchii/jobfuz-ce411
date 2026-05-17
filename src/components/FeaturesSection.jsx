import React from 'react';
import { motion as Motion } from 'framer-motion';
import { BarChart2, Bot, Brain, CheckSquare, Edit3, FileText } from 'lucide-react';
import Badge from './ui/Badge';

const FEATURES = [
    {
        icon: FileText,
        title: 'Resume review',
        description: 'Upload once and get a cleaner view of ATS alignment, missing keywords, and structure quality.',
    },
    {
        icon: CheckSquare,
        title: 'MCQ practice',
        description: 'Role-based technical quizzes help graduates benchmark knowledge before interviews start.',
    },
    {
        icon: Edit3,
        title: 'Essay scoring',
        description: 'Improve written clarity with structured prompts, actionable feedback, and sample rewrites.',
    },
    {
        icon: Brain,
        title: 'Work-style insight',
        description: 'Surface collaboration tendencies and professional preferences without making the experience feel clinical.',
    },
    {
        icon: Bot,
        title: 'AI interview flow',
        description: 'Rehearse answers in a guided mock interview so the first real one feels more familiar.',
    },
    {
        icon: BarChart2,
        title: 'Progress history',
        description: 'Track what improved, what still needs work, and which stage deserves attention next.',
    },
];

export default function FeaturesSection() {
    return (
        <section className="section-shell px-6 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-11">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45 }}
                    className="lg:sticky lg:top-28"
                >
                    <Badge variant="brand" className="uppercase tracking-[0.18em]">Assessment systems</Badge>
                    <p className="page-kicker mt-6">One ecosystem, multiple signals</p>
                    <h2 className="section-heading">
                        A full readiness workflow, not just one score.
                    </h2>
                    <p className="section-copy">
                        Each part of the platform supports a different piece of early-career confidence: technical recall,
                        written thinking, communication, self-awareness, and application quality.
                    </p>

                    <div className="mt-7 grid gap-3 sm:grid-cols-2">
                        <div className="panel-muted p-4">
                            <p className="page-kicker mb-2">Primary audience</p>
                            <p className="text-sm leading-7" style={{ color: 'rgb(var(--muted))' }}>
                                Students and recent graduates preparing for their first internships or full-time roles.
                            </p>
                        </div>
                        <div className="panel-muted p-4">
                            <p className="page-kicker mb-2">Design goal</p>
                            <p className="text-sm leading-7" style={{ color: 'rgb(var(--muted))' }}>
                                Feel trustworthy and modern while staying calm, readable, and never overly flashy.
                            </p>
                        </div>
                    </div>
                </Motion.div>

                <div className="grid gap-4 md:grid-cols-2">
                    {FEATURES.map((feature, index) => {
                        const Icon = feature.icon;

                        return (
                            <Motion.article
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                className="interactive-tile p-5 sm:p-6"
                            >
                                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-[18px]" style={{ background: 'rgb(var(--brand-soft))', color: 'rgb(var(--brand))' }}>
                                    <Icon size={19} />
                                </div>
                                <h3 className="mb-2 text-xl font-black tracking-[-0.04em]" style={{ color: 'rgb(var(--text))' }}>
                                    {feature.title}
                                </h3>
                                <p className="text-sm leading-7" style={{ color: 'rgb(var(--muted))' }}>
                                    {feature.description}
                                </p>
                            </Motion.article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

