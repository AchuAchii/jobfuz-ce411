import React, { useRef, useEffect } from 'react';
import { motion as Motion, useInView } from 'framer-motion';
import { ArrowRight, Compass, FileCheck2, GraduationCap, Sparkles, Stars, Target } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import Badge from './ui/Badge';
import Button from './ui/Button';

const STAGES = [
    {
        title: 'Resume signal',
        copy: 'Get ATS feedback that feels clear, specific, and recruiter-ready.',
        icon: FileCheck2,
    },
    {
        title: 'Confidence drills',
        copy: 'Practice interviews and written responses before applying anywhere.',
        icon: Target,
    },
    {
        title: 'Career direction',
        copy: 'Understand strengths, preferences, and what to improve next.',
        icon: Compass,
    },
    {
        title: 'New-grad friendly',
        copy: 'Built to guide first-job seekers with calm, structured feedback.',
        icon: GraduationCap,
    },
];

const METRICS = [
    { value: '5', label: 'guided stages' },
    { value: '<45m', label: 'to complete' },
    { value: 'Role-based', label: 'feedback style' },
];

export default function Hero({ onInView }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const { t } = useLanguage();
    const navigate = useNavigate();

    useEffect(() => {
        if (isInView && onInView) onInView();
    }, [isInView, onInView]);

    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section
            ref={ref}
            className="hero-panel relative flex w-full items-start overflow-hidden"
            style={{ background: 'transparent' }}
        >
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <div
                    className="absolute left-[8%] top-[10%] h-40 w-40 rounded-full blur-3xl"
                    style={{ background: 'rgb(var(--accent) / 0.14)' }}
                />
                <div
                    className="absolute bottom-[10%] right-[10%] h-56 w-56 rounded-full blur-3xl"
                    style={{ background: 'rgb(var(--brand) / 0.1)' }}
                />
            </div>

            <div className="hero-panel__content mx-auto flex w-full max-w-[1320px] flex-col gap-8 px-4 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start lg:gap-8">
                <Motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                    className="section-shell px-6 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-11"
                >
                    <div className="flex flex-wrap items-center gap-3">
                        <Badge variant="brand">
                            <Sparkles className="w-3.5 h-3.5" />
                            Career Readiness Studio
                        </Badge>
                        <Badge variant="muted">
                            <Stars className="w-3.5 h-3.5" />
                            Built for new graduates
                        </Badge>
                    </div>

                    <div className="mt-7 max-w-3xl">
                        <p className="page-kicker">Clear preparation for new graduates</p>
                        <h1 className="section-heading">
                            {t('hero.title')} <span style={{ color: 'rgb(var(--brand))' }}>{t('hero.highlight')}</span> before your first big application.
                        </h1>
                        <p className="section-copy">
                            Jobfuz helps recent graduates understand where they stand with resume feedback, role-based tests,
                            and practice tools that feel modern, credible, and easy to follow.
                        </p>
                    </div>

                    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                        <Button
                            variant="brand"
                            size="xl"
                            rounded="full"
                            onClick={() => navigate('/signup')}
                            className="group"
                        >
                            {t('hero.start')}
                            <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
                        </Button>
                        <Button
                            variant="secondary"
                            size="xl"
                            rounded="full"
                            onClick={() => scrollToSection('features')}
                        >
                            Explore the full flow
                        </Button>
                    </div>

                    <div className="mt-8 grid gap-3 sm:grid-cols-3">
                        {METRICS.map((metric) => (
                            <div key={metric.label} className="metric-chip">
                                <div>
                                    <strong>{metric.value}</strong>
                                    <span>{metric.label}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Motion.div>

                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.08 }}
                    className="section-shell p-5 sm:p-6 lg:p-7"
                >
                    <div className="flex items-center justify-between rounded-[22px] border px-4 py-3" style={{ borderColor: 'rgb(var(--border))', background: 'rgb(var(--surface2))' }}>
                        <div>
                            <p className="page-kicker mb-2">Assessment overview</p>
                            <h2 className="text-[1.4rem] font-bold leading-tight" style={{ color: 'rgb(var(--text))' }}>A clearer view of what to work on next.</h2>
                            <p className="mt-2 text-sm leading-7" style={{ color: 'rgb(var(--muted))' }}>
                                Start with one strong application signal, then practice the rest in sequence.
                            </p>
                        </div>
                        <span className="flex h-12 w-12 items-center justify-center rounded-full" style={{ background: 'rgb(var(--brand-soft))', color: 'rgb(var(--brand))' }}>
                            <Sparkles size={18} />
                        </span>
                    </div>

                    <div className="landing-stage-grid mt-5">
                        {STAGES.map((stage, index) => {
                            const Icon = stage.icon;
                            return (
                                <Motion.div
                                    key={stage.title}
                                    initial={{ opacity: 0, y: 14 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.45, delay: 0.12 + (index * 0.08) }}
                                    className="landing-stage-card"
                                >
                                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-[18px]" style={{ background: 'rgb(var(--brand-soft))', color: 'rgb(var(--brand))' }}>
                                        <Icon size={18} />
                                    </div>
                                    <strong>{stage.title}</strong>
                                    <span>{stage.copy}</span>
                                </Motion.div>
                            );
                        })}
                    </div>

                    <div className="mt-5 rounded-[24px] border p-4 sm:p-5" style={{ borderColor: 'rgb(var(--border))', background: 'rgb(var(--surface2))' }}>
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="page-kicker mb-2">Why this feels different</p>
                                <p className="text-sm leading-7" style={{ color: 'rgb(var(--muted))' }}>
                                    The interface stays calm and readable first. It should help users focus on progress, not on decoding the page.
                                </p>
                            </div>
                            <span className="hidden sm:flex h-14 w-14 items-center justify-center rounded-full border" style={{ borderColor: 'rgb(var(--border))', color: 'rgb(var(--accent))' }}>
                                <Stars size={18} />
                            </span>
                        </div>
                    </div>
                </Motion.div>
            </div>
        </section>
    );
}

