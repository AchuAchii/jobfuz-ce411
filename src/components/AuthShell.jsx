import React from 'react';
import { motion as Motion } from 'framer-motion';
import { ArrowUpRight, Award, Compass, Sparkles } from 'lucide-react';
import { BrandLockup } from './Brand';
import ThemeToggle from './ThemeToggle';

const DEFAULT_STATS = [
    { label: 'Assessment flow', value: '5 stages' },
    { label: 'Focus', value: 'Career readiness' },
    { label: 'Tone', value: 'Calm + credible' },
];

export default function AuthShell({
    eyebrow = 'Career Readiness Studio',
    title,
    subtitle,
    children,
    asideTitle = 'Build confidence before your first big application.',
    asideBody = 'Jobfuz helps new graduates turn uncertainty into a clear readiness plan through structured AI-guided assessments.',
    stats = DEFAULT_STATS,
}) {
    return (
        <div className="auth-shell">
            <div className="auth-shell__backdrop" aria-hidden="true" />
            <div className="auth-shell__grid">
                <Motion.aside
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="auth-shell__story"
                >
                    <div className="auth-shell__story-top">
                        <BrandLockup size={42} wordmarkClassName="text-[1.55rem]" />
                        <ThemeToggle />
                    </div>

                    <div className="auth-shell__story-copy">
                        <span className="eyebrow-chip">
                            <Sparkles size={14} />
                            {eyebrow}
                        </span>
                        <h1>{asideTitle}</h1>
                        <p>{asideBody}</p>
                    </div>

                    <div className="auth-shell__story-panel">
                        <div className="auth-shell__story-header">
                            <span className="eyebrow-chip eyebrow-chip--ghost">
                                <Compass size={14} />
                                Guided Progress
                            </span>
                            <span className="auth-shell__story-link">
                                Launch career plan
                                <ArrowUpRight size={14} />
                            </span>
                        </div>

                        <div className="auth-shell__story-metric">
                            <div>
                                <p className="auth-shell__metric-label">Designed for first-job confidence</p>
                                <h2>Structured, credible, easy to trust.</h2>
                            </div>
                            <div className="auth-shell__metric-badge">
                                <Award size={16} />
                                Flagship experience
                            </div>
                        </div>

                        <div className="auth-shell__story-stats">
                            {stats.map((item) => (
                                <div key={item.label} className="auth-shell__story-stat">
                                    <span>{item.label}</span>
                                    <strong>{item.value}</strong>
                                </div>
                            ))}
                        </div>
                    </div>
                </Motion.aside>

                <Motion.main
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.45, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                    className="auth-shell__main"
                >
                    <div className="auth-card">
                        <div className="auth-card__heading">
                            <span className="eyebrow-chip eyebrow-chip--ghost">{eyebrow}</span>
                            <h2>{title}</h2>
                            <p>{subtitle}</p>
                        </div>
                        {children}
                    </div>
                </Motion.main>
            </div>
        </div>
    );
}

