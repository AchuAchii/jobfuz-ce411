import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Brain, ClipboardList, Zap, TrendingUp } from 'lucide-react';

const FEATURES = [
    {
        icon: Brain,
        title: 'AI-Powered Scoring',
        desc: 'Our AI engine evaluates your resume, MCQ answers, essays, and interview performance in real time.',
    },
    {
        icon: ClipboardList,
        title: '5 Assessment Stages',
        desc: 'A comprehensive multi-stage process: Resume · MCQ · Essay · Work Style · AI Interview.',
    },
    {
        icon: Zap,
        title: 'Instant Feedback',
        desc: 'Get actionable scores and improvement suggestions within seconds — not days.',
    },
    {
        icon: TrendingUp,
        title: 'Career Insights',
        desc: 'Track your progress over time and understand exactly where to focus to land your target role.',
    },
];

const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] },
    }),
};

export default function AboutSection({ embedded = false }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <div
            ref={ref}
            className={`w-full max-w-6xl mx-auto px-4 sm:px-6 ${embedded ? '' : 'py-16'}`}
        >
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="text-center mb-6"
            >
                <span
                    className="inline-block text-xs font-bold uppercase tracking-widest mb-3 px-3 py-1 rounded-full"
                    style={{ background: 'rgb(var(--surface2))', color: 'rgb(var(--brand))' }}
                >
                    About Jobfuz
                </span>
                <h2
                    className="text-2xl md:text-3xl font-black tracking-tight mb-3"
                    style={{ color: 'rgb(var(--text))' }}
                >
                    Built for serious{' '}
                    <span style={{ color: 'rgb(var(--brand))' }}>career growth</span>
                </h2>
                <p
                    className="text-sm max-w-2xl mx-auto leading-relaxed"
                    style={{ color: 'rgb(var(--muted))' }}
                >
                    Jobfuz is an AI-powered career assessment platform designed to give every candidate a fair,
                    data-driven picture of their readiness — and a clear path to improvement.
                </p>
            </motion.div>

            {/* Feature Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {FEATURES.map((f, i) => (
                    <motion.div
                        key={f.title}
                        custom={i}
                        variants={cardVariants}
                        initial="hidden"
                        animate={isInView ? 'visible' : 'hidden'}
                        className="group p-6 rounded-2xl border transition-all duration-[200ms] cursor-default"
                        style={{
                            background: 'rgb(var(--bg))',
                            borderColor: 'rgb(var(--border))',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.borderColor = 'rgb(var(--brand))';
                            e.currentTarget.style.boxShadow = '0 0 0 1px rgb(var(--brand)), 0 8px 24px rgba(47,107,255,0.08)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.borderColor = 'rgb(var(--border))';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-colors duration-[200ms]"
                            style={{ background: 'rgb(var(--surface2))' }}
                        >
                            <f.icon
                                className="w-5 h-5"
                                style={{ color: 'rgb(var(--brand))' }}
                            />
                        </div>
                        <h3
                            className="text-sm font-bold mb-2"
                            style={{ color: 'rgb(var(--text))' }}
                        >
                            {f.title}
                        </h3>
                        <p
                            className="text-xs leading-relaxed"
                            style={{ color: 'rgb(var(--muted))' }}
                        >
                            {f.desc}
                        </p>
                    </motion.div>
                ))}
            </div>

            {/* Trust bar */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-6 flex flex-wrap justify-center gap-6 text-center"
            >
                {[
                    { val: '5', label: 'Assessment Stages' },
                    { val: 'AI', label: 'Powered Scoring' },
                    { val: '100%', label: 'Free to Start' },
                    { val: '24/7', label: 'Always Available' },
                ].map(({ val, label }) => (
                    <div key={label} className="flex flex-col items-center gap-1">
                        <span
                            className="text-xl font-black"
                            style={{ color: 'rgb(var(--brand))' }}
                        >
                            {val}
                        </span>
                        <span
                            className="text-xs font-medium"
                            style={{ color: 'rgb(var(--muted))' }}
                        >
                            {label}
                        </span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
