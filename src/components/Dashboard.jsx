import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import {
    ArrowRight,
    Bot,
    Brain,
    Briefcase,
    CheckCircle,
    ChevronDown,
    FileCheck,
    FileText,
} from 'lucide-react';
import { getAttemptHistory } from '../services/mcqSupabaseService';
import {
    loadCachedAssessmentResults,
    fetchAssessmentResults,
    formatRelativeUpdated,
} from '../services/assessmentResultService';
import { PROFESSIONS } from '../data/professions';
import AppShell from './AppShell';

const BASE_STAGES = [
    {
        id: 'resume',
        label: 'Resume',
        subtitle: 'ATS and content quality',
        route: '/resume',
        icon: FileCheck,
        status: 'not-started',
        scoreNow: null,
        displayValue: null,
        trendPoints: [],
        avgScore: null,
        lastUpdated: 'Not started',
        isComplete: false,
        defaultInsight: 'Upload your resume to generate ATS feedback and a score.',
    },
    {
        id: 'mcq',
        label: 'MCQ',
        subtitle: 'Technical knowledge',
        route: '/mcq',
        icon: CheckCircle,
        status: 'not-started',
        scoreNow: null,
        displayValue: null,
        trendPoints: [],
        avgScore: null,
        lastUpdated: 'Not started',
        isComplete: false,
        defaultInsight: 'Start your first MCQ quiz to generate a score.',
    },
    {
        id: 'essay',
        label: 'Essay',
        subtitle: 'Written communication',
        route: '/essay',
        icon: FileText,
        status: 'not-started',
        scoreNow: null,
        displayValue: null,
        trendPoints: [],
        avgScore: null,
        lastUpdated: 'Not started',
        isComplete: false,
        defaultInsight: 'Submit an essay response to receive writing feedback.',
    },
    {
        id: 'workstyle',
        label: 'Work Style',
        subtitle: 'Personality and preferences',
        route: '/workstyle',
        icon: Brain,
        status: 'not-started',
        scoreNow: null,
        displayValue: null,
        trendPoints: [],
        avgScore: null,
        lastUpdated: 'Not started',
        isComplete: false,
        defaultInsight: 'Complete the work style questionnaire to unlock your profile summary.',
    },
    {
        id: 'interview',
        label: 'AI Interview',
        subtitle: 'Speaking and reasoning',
        route: '/interview',
        icon: Bot,
        status: 'not-started',
        scoreNow: null,
        displayValue: null,
        trendPoints: [],
        avgScore: null,
        lastUpdated: 'Not started',
        isComplete: false,
        defaultInsight: 'Complete your first AI mock interview to start practicing.',
    },
];

const STATUS_META = {
    'not-started': {
        label: 'Not started',
        bg: 'rgb(var(--surface2))',
        color: 'rgb(var(--subtle))',
    },
    improving: {
        label: 'Improving',
        bg: 'rgb(var(--brand-soft))',
        color: 'rgb(var(--brand))',
    },
    stable: {
        label: 'Stable',
        bg: 'rgb(var(--success-soft))',
        color: 'rgb(var(--success))',
    },
    'needs-work': {
        label: 'Needs work',
        bg: 'rgb(var(--warn-soft))',
        color: 'rgb(var(--warn))',
    },
};

const SEVERITY_META = {
    info: {
        label: 'Info',
        bg: 'rgb(var(--surface2))',
        color: 'rgb(var(--subtle))',
    },
    high: {
        label: 'High',
        bg: 'rgb(var(--danger-soft))',
        color: 'rgb(var(--danger))',
    },
    medium: {
        label: 'Medium',
        bg: 'rgb(var(--warn-soft))',
        color: 'rgb(var(--warn))',
    },
    low: {
        label: 'Low',
        bg: 'rgb(var(--success-soft))',
        color: 'rgb(var(--success))',
    },
};

function getAverageScore(history, fallbackScore) {
    if (Array.isArray(history) && history.length > 0) {
        return Math.round(history.reduce((sum, value) => sum + value, 0) / history.length);
    }

    return typeof fallbackScore === 'number' ? fallbackScore : null;
}

function getStatusFromScore(score, stableThreshold = 80, improvingThreshold = 60) {
    if (typeof score !== 'number') return 'not-started';
    if (score >= stableThreshold) return 'stable';
    if (score >= improvingThreshold) return 'improving';
    return 'needs-work';
}

function getSeverityFromScore(score) {
    if (typeof score !== 'number') return 'info';
    if (score < 60) return 'high';
    if (score < 80) return 'medium';
    return 'low';
}

function mergeSavedAssessmentData(stages, savedResults) {
    return stages.map((stage) => {
        if (stage.id === 'mcq') return stage;

        const saved = savedResults[stage.id];
        if (!saved) return stage;

        const scoreHistory = Array.isArray(saved.scoreHistory)
            ? saved.scoreHistory.filter((value) => typeof value === 'number' && Number.isFinite(value))
            : [];
        const hasScore = typeof saved.score === 'number' && Number.isFinite(saved.score);
        const displayValue = hasScore ? null : (saved.displayValue || (saved.completed ? 'Done' : null));

        return {
            ...stage,
            scoreNow: hasScore ? saved.score : null,
            displayValue,
            trendPoints: scoreHistory,
            avgScore: getAverageScore(scoreHistory, hasScore ? saved.score : null),
            status: saved.status || (hasScore ? getStatusFromScore(saved.score) : 'stable'),
            lastUpdated: formatRelativeUpdated(saved.updatedAt),
            isComplete: Boolean(saved.completed),
            summary: saved.summary || '',
            insights: Array.isArray(saved.insights) ? saved.insights.filter(Boolean) : [],
        };
    });
}

function mergeMCQData(stages, mcqAttempts) {
    const completedAttempts = (mcqAttempts || []).filter(
        (attempt) => attempt.completed_at && attempt.total_questions > 0,
    );

    if (completedAttempts.length === 0) return stages;

    const scores = completedAttempts.map((attempt) =>
        Math.round((attempt.score / attempt.total_questions) * 100),
    );
    const latestScore = scores[0];
    const latestAttempt = completedAttempts[0];

    return stages.map((stage) => {
        if (stage.id !== 'mcq') return stage;

        return {
            ...stage,
            scoreNow: latestScore,
            displayValue: null,
            trendPoints: scores.slice(0, 6).reverse(),
            avgScore: getAverageScore(scores, latestScore),
            status: getStatusFromScore(latestScore, 75, 55),
            lastUpdated: formatRelativeUpdated(latestAttempt.completed_at),
            isComplete: true,
        };
    });
}

function buildInsight(stage) {
    if (stage.id === 'mcq' && typeof stage.scoreNow === 'number') {
        if (stage.scoreNow >= 75) {
            return {
                stageId: stage.id,
                stage: stage.label,
                insight: 'Strong latest MCQ result. Review explanations once more to keep the momentum.',
                time: stage.lastUpdated,
                severity: 'low',
                route: stage.route,
            };
        }

        if (stage.scoreNow >= 55) {
            return {
                stageId: stage.id,
                stage: stage.label,
                insight: 'You are close. Revisit the missed questions and retake the quiz to push the score higher.',
                time: stage.lastUpdated,
                severity: 'medium',
                route: stage.route,
            };
        }

        return {
            stageId: stage.id,
            stage: stage.label,
            insight: 'The latest MCQ result is below target. Spend a little time on fundamentals before retrying.',
            time: stage.lastUpdated,
            severity: 'high',
            route: stage.route,
        };
    }

    const savedInsight = stage.insights?.[0] || stage.summary;
    if (savedInsight) {
        return {
            stageId: stage.id,
            stage: stage.label,
            insight: savedInsight,
            time: stage.lastUpdated,
            severity: getSeverityFromScore(stage.scoreNow),
            route: stage.route,
        };
    }

    return {
        stageId: stage.id,
        stage: stage.label,
        insight: stage.defaultInsight,
        time: 'Not started',
        severity: 'info',
        route: stage.route,
    };
}

function Sparkline({ points = [], color = 'rgb(var(--brand))', width = 100, height = 36 }) {
    if (!points || points.length < 2) {
        return (
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
                <line
                    x1="0"
                    y1={height / 2}
                    x2={width}
                    y2={height / 2}
                    stroke={color}
                    strokeOpacity="0.3"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                />
            </svg>
        );
    }

    const clamped = points.map((value) => Math.min(100, Math.max(0, value)));
    const minValue = Math.min(...clamped);
    const maxValue = Math.max(...clamped);
    const range = maxValue - minValue || 1;
    const pad = 3;
    const innerHeight = height - pad * 2;

    const coordinates = clamped.map((value, index) => {
        const x = (index / (clamped.length - 1)) * width;
        const y = pad + innerHeight - ((value - minValue) / range) * innerHeight;
        return [x, y];
    });

    const linePath = coordinates
        .map(([x, y], index) => `${index === 0 ? 'M' : 'L'} ${x} ${y}`)
        .join(' ');
    const areaPath = [
        `M ${coordinates[0][0]} ${height}`,
        ...coordinates.map(([x, y]) => `L ${x} ${y}`),
        `L ${coordinates[coordinates.length - 1][0]} ${height}`,
        'Z',
    ].join(' ');
    const gradientId = `sg-${color.replace(/[^a-zA-Z0-9]/g, '')}`;

    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
            <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.22" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={areaPath} fill={`url(#${gradientId})`} />
            <path
                d={linePath}
                fill="none"
                stroke={color}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx={coordinates[coordinates.length - 1][0]} cy={coordinates[coordinates.length - 1][1]} r="2.5" fill={color} />
        </svg>
    );
}

function StatusBadge({ status }) {
    const meta = STATUS_META[status] || STATUS_META['not-started'];

    return (
        <span
            className="inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em]"
            style={{ background: meta.bg, color: meta.color }}
        >
            {meta.label}
        </span>
    );
}

function SeverityBadge({ severity }) {
    const meta = SEVERITY_META[severity] || SEVERITY_META.info;

    return (
        <span
            className="inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em]"
            style={{ background: meta.bg, color: meta.color }}
        >
            {meta.label}
        </span>
    );
}

function StageCard({ stage, onClick }) {
    const Icon = stage.icon;
    const hasScore = typeof stage.scoreNow === 'number' && Number.isFinite(stage.scoreNow);
    const hasDisplayValue = hasScore || Boolean(stage.displayValue);
    const valueText = hasScore ? `${stage.scoreNow}` : (stage.displayValue || '-');
    const sparkColor = !hasDisplayValue
        ? 'rgb(var(--subtle))'
        : stage.status === 'improving'
            ? 'rgb(var(--brand))'
            : stage.status === 'stable'
                ? 'rgb(var(--success))'
                : stage.status === 'needs-work'
                    ? 'rgb(var(--warn))'
                    : 'rgb(var(--subtle))';

    return (
        <Motion.button
            whileHover={{ y: -2 }}
            type="button"
            onClick={onClick}
            className="interactive-tile flex h-full flex-col p-5 text-left"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-[18px]" style={{ background: 'rgb(var(--brand-soft))', color: 'rgb(var(--brand))' }}>
                        <Icon size={18} />
                    </span>
                    <div>
                        <p className="text-base font-black tracking-[-0.04em]" style={{ color: 'rgb(var(--text))' }}>
                            {stage.label}
                        </p>
                        <p className="text-xs uppercase tracking-[0.16em]" style={{ color: 'rgb(var(--subtle))' }}>
                            {stage.subtitle}
                        </p>
                    </div>
                </div>
                <StatusBadge status={stage.status} />
            </div>

            <div className="mt-6 flex items-end justify-between gap-4">
                <div>
                    <p className={`font-black tracking-[-0.06em] ${hasScore ? 'text-[2.5rem]' : 'text-[2rem]'}`} style={{ color: hasDisplayValue ? 'rgb(var(--text))' : 'rgb(var(--subtle))' }}>
                        {valueText}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs" style={{ color: 'rgb(var(--subtle))' }}>
                        <span>Avg {stage.avgScore ?? '-'}</span>
                        <span>{stage.lastUpdated}</span>
                    </div>
                </div>
                <Sparkline points={stage.trendPoints} color={sparkColor} width={86} height={36} />
            </div>
        </Motion.button>
    );
}

function SummaryCard({ label, value, description }) {
    return (
        <div className="panel-muted p-4 sm:p-5">
            <p className="page-kicker mb-2">{label}</p>
            <p className="text-[1.85rem] font-black tracking-[-0.06em]" style={{ color: 'rgb(var(--text))' }}>{value}</p>
            <p className="mt-2 text-sm leading-7" style={{ color: 'rgb(var(--muted))' }}>{description}</p>
        </div>
    );
}

export default function Dashboard({ user, profession, onChangeProfession }) {
    const navigate = useNavigate();
    const [mcqAttempts, setMcqAttempts] = useState([]);
    const [loadingMcq, setLoadingMcq] = useState(true);
    const [assessmentResults, setAssessmentResults] = useState(() => (
        user?.id ? loadCachedAssessmentResults(user.id) : {}
    ));
    const onChangeProfessionRef = useRef(onChangeProfession);

    const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'User';
    const initials = displayName.slice(0, 2).toUpperCase();

    useEffect(() => {
        onChangeProfessionRef.current = onChangeProfession;
    }, [onChangeProfession]);

    useEffect(() => {
        if (!user?.id) {
            setAssessmentResults({});
            return;
        }

        let cancelled = false;
        setAssessmentResults(loadCachedAssessmentResults(user.id));

        (async () => {
            const remoteResults = await fetchAssessmentResults(user.id);
            if (!cancelled) {
                setAssessmentResults(remoteResults || {});
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [user?.id]);

    useEffect(() => {
        let cancelled = false;

        async function loadMcqHistory() {
            try {
                const data = await getAttemptHistory();
                if (!cancelled) setMcqAttempts(data || []);
            } catch {
                if (!cancelled) setMcqAttempts([]);
            } finally {
                if (!cancelled) setLoadingMcq(false);
            }
        }

        loadMcqHistory();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (user && !profession && onChangeProfessionRef.current) {
            const timeoutId = setTimeout(() => onChangeProfessionRef.current?.(), 400);
            return () => clearTimeout(timeoutId);
        }

        return undefined;
    }, [user, profession]);

    const stages = mergeMCQData(mergeSavedAssessmentData(BASE_STAGES, assessmentResults), mcqAttempts);
    const insights = stages.map(buildInsight);
    const completedCount = stages.filter((stage) => stage.isComplete).length;
    const numericScores = stages.map((stage) => stage.scoreNow).filter((value) => typeof value === 'number');
    const averageScore = numericScores.length > 0
        ? Math.round(numericScores.reduce((sum, value) => sum + value, 0) / numericScores.length)
        : '--';

    return (
        <AppShell maxWidth="max-w-[1800px]">
            <Motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="grid gap-6">
                <section className="section-shell px-6 py-7 sm:px-8 sm:py-9">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="page-kicker">Jobfuz score center</p>
                            <h1 className="page-title">
                                Welcome back, <span style={{ color: 'rgb(var(--brand))' }}>{displayName}</span>
                            </h1>
                            <p className="page-subtitle mt-4">
                                This dashboard turns every assessment into a clearer readiness picture so you always know what to do next.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                type="button"
                                onClick={onChangeProfession}
                                className="inline-flex items-center gap-2 rounded-full border px-4 py-3 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
                                style={{
                                    background: profession ? 'rgb(var(--brand-soft))' : 'rgb(var(--warn-soft))',
                                    color: profession ? 'rgb(var(--brand))' : 'rgb(var(--warn))',
                                    borderColor: profession ? 'rgb(var(--brand) / 0.18)' : 'rgb(var(--warn) / 0.25)',
                                }}
                            >
                                <Briefcase size={15} />
                                {profession
                                    ? (PROFESSIONS.find((item) => item.id === profession)?.label || profession)
                                    : 'Select career path'}
                                <ChevronDown size={14} />
                            </button>

                            <div className="flex h-12 w-12 items-center justify-center rounded-full border" style={{ borderColor: 'rgb(var(--border))', background: 'rgb(var(--surface2))', color: 'rgb(var(--text))' }}>
                                <span className="text-sm font-bold">{initials}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-7 grid gap-4 lg:grid-cols-3">
                        <SummaryCard
                            label="Completed stages"
                            value={`${completedCount} / ${stages.length}`}
                            description="A quick view of how much of the readiness flow has already been finished."
                        />
                        <SummaryCard
                            label="Average score"
                            value={averageScore}
                            description="A blended view across all completed numerical stages so far."
                        />
                        <SummaryCard
                            label="Latest signal"
                            value={loadingMcq ? 'Loading...' : insights[0]?.stage || 'Resume'}
                            description="The next place to focus, based on your latest stored progress."
                        />
                    </div>
                </section>

                <section className="section-shell px-6 py-7 sm:px-8 sm:py-9">
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p className="page-kicker">Assessment progress</p>
                            <h2 className="text-[1.9rem] font-black tracking-[-0.05em]" style={{ color: 'rgb(var(--text))' }}>
                                Track every stage in one place
                            </h2>
                        </div>
                        <p className="text-sm" style={{ color: 'rgb(var(--subtle))' }}>
                            {loadingMcq ? 'Loading your MCQ history...' : `${stages.length} stages ready`}
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                        {stages.map((stage) => (
                            <StageCard key={stage.id} stage={stage} onClick={() => navigate(stage.route)} />
                        ))}
                    </div>
                </section>

                <section className="section-shell px-6 py-7 sm:px-8 sm:py-9">
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p className="page-kicker">Latest insights</p>
                            <h2 className="text-[1.9rem] font-black tracking-[-0.05em]" style={{ color: 'rgb(var(--text))' }}>
                                Recommended next actions
                            </h2>
                        </div>
                        <span className="rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]" style={{ borderColor: 'rgb(var(--border))', color: 'rgb(var(--subtle))' }}>
                            {insights.length} suggestions
                        </span>
                    </div>

                    <div className="grid gap-3">
                        {insights.map((insight) => (
                            <div
                                key={insight.stageId}
                                className="interactive-tile grid gap-4 p-4 md:grid-cols-[minmax(0,0.16fr)_minmax(0,1fr)_auto] md:items-center"
                            >
                                <div>
                                    <p className="text-sm font-semibold" style={{ color: 'rgb(var(--text))' }}>{insight.stage}</p>
                                    <p className="text-xs uppercase tracking-[0.16em]" style={{ color: 'rgb(var(--subtle))' }}>{insight.time}</p>
                                </div>

                                <p className="text-sm leading-7" style={{ color: 'rgb(var(--muted))' }}>
                                    {insight.insight}
                                </p>

                                <div className="flex items-center gap-3 justify-self-start md:justify-self-end">
                                    <SeverityBadge severity={insight.severity} />
                                    <button
                                        type="button"
                                        onClick={() => navigate(insight.route)}
                                        className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
                                        style={{ background: 'rgb(var(--brand-soft))', color: 'rgb(var(--brand))' }}
                                    >
                                        Open
                                        <ArrowRight size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </Motion.div>
        </AppShell>
    );
}

