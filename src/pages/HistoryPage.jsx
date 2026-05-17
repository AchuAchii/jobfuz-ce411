import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Award, CheckCircle, ChevronDown, ChevronUp, Clock, XCircle } from 'lucide-react';
import { getAttemptHistory, getAttemptDetail } from '../services/mcqSupabaseService';
import Button from '../components/ui/Button';
import AppShell from '../components/AppShell';

export default function HistoryPage() {
    const navigate = useNavigate();

    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedId, setExpandedId] = useState(null);
    const [details, setDetails] = useState({});

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            setLoading(true);
            const data = await getAttemptHistory();
            setAttempts(data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleDetail = async (attemptId) => {
        if (expandedId === attemptId) {
            setExpandedId(null);
            return;
        }
        setExpandedId(attemptId);
        if (!details[attemptId]) {
            try {
                const detail = await getAttemptDetail(attemptId);
                setDetails((prev) => ({ ...prev, [attemptId]: detail }));
            } catch (err) {
                console.error('Failed to load detail:', err);
            }
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '--';
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppShell maxWidth="max-w-[1800px]">
            <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="mb-5 inline-flex items-center gap-2 text-sm font-semibold transition-colors duration-200"
                style={{ color: 'rgb(var(--muted))' }}
            >
                <ArrowLeft size={16} />
                Back to dashboard
            </button>

            <Motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6">
                <section className="section-shell px-6 py-7 sm:px-8 sm:py-9">
                    <p className="page-kicker">Attempt history</p>
                    <h1 className="page-title">Review every MCQ session in one place.</h1>
                    <p className="page-subtitle mt-4">
                        A cleaner history view makes it easier to compare attempts, reopen reviews, and spot how technical confidence is changing over time.
                    </p>
                </section>

                <section className="section-shell px-6 py-7 sm:px-8 sm:py-9">
                    {loading && (
                        <div className="flex min-h-[260px] items-center justify-center">
                            <span className="h-10 w-10 rounded-full border-4 animate-spin" style={{ borderColor: 'rgb(var(--surface3))', borderTopColor: 'rgb(var(--brand))' }} />
                        </div>
                    )}

                    {error && (
                        <div className="danger-panel rounded-[20px] px-4 py-3 text-sm">
                            {error}
                        </div>
                    )}

                    {!loading && attempts.length === 0 && (
                        <div className="flex min-h-[320px] flex-col items-center justify-center gap-5 text-center">
                            <span className="flex h-16 w-16 items-center justify-center rounded-full" style={{ background: 'rgb(var(--surface2))', color: 'rgb(var(--brand))' }}>
                                <Clock size={28} />
                            </span>
                            <div>
                                <h2 className="text-2xl font-black tracking-[-0.04em]" style={{ color: 'rgb(var(--text))' }}>
                                    No attempts yet
                                </h2>
                                <p className="mt-2 max-w-md text-sm leading-7" style={{ color: 'rgb(var(--muted))' }}>
                                    Start an MCQ quiz to create your first history entry and review the answers later.
                                </p>
                            </div>
                            <Button variant="brand" size="lg" rounded="full" onClick={() => navigate('/mcq')}>
                                Start MCQ
                            </Button>
                        </div>
                    )}

                    <div className="grid gap-3">
                        {attempts.map((attempt) => {
                            const isExpanded = expandedId === attempt.id;
                            const detail = details[attempt.id];
                            const percentage = attempt.total_questions > 0
                                ? Math.round((attempt.score / attempt.total_questions) * 100)
                                : 0;
                            const passed = percentage >= 70;

                            return (
                                <div key={attempt.id} className="panel-surface overflow-hidden">
                                    <button
                                        type="button"
                                        onClick={() => toggleDetail(attempt.id)}
                                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                                    >
                                        <div className="flex items-center gap-4">
                                            <span
                                                className="flex h-12 w-12 items-center justify-center rounded-[18px]"
                                                style={attempt.completed_at
                                                    ? { background: passed ? 'rgb(var(--success-soft))' : 'rgb(var(--danger-soft))', color: passed ? 'rgb(var(--success))' : 'rgb(var(--danger))' }
                                                    : { background: 'rgb(var(--surface2))', color: 'rgb(var(--subtle))' }}
                                            >
                                                {attempt.completed_at ? <Award size={18} /> : <Clock size={18} />}
                                            </span>
                                            <div>
                                                <p className="text-sm font-semibold" style={{ color: 'rgb(var(--text))' }}>
                                                    {attempt.professions?.name_en || 'MCQ Quiz'}
                                                </p>
                                                <p className="text-xs uppercase tracking-[0.16em]" style={{ color: 'rgb(var(--subtle))' }}>
                                                    {formatDate(attempt.started_at)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            {attempt.completed_at && (
                                                <div className="text-right">
                                                    <p className="text-xl font-black tracking-[-0.05em]" style={{ color: passed ? 'rgb(var(--success))' : 'rgb(var(--danger))' }}>
                                                        {percentage}%
                                                    </p>
                                                    <p className="text-xs uppercase tracking-[0.16em]" style={{ color: 'rgb(var(--subtle))' }}>
                                                        {attempt.score}/{attempt.total_questions}
                                                    </p>
                                                </div>
                                            )}
                                            {isExpanded ? <ChevronUp size={16} style={{ color: 'rgb(var(--subtle))' }} /> : <ChevronDown size={16} style={{ color: 'rgb(var(--subtle))' }} />}
                                        </div>
                                    </button>

                                    <AnimatePresence>
                                        {isExpanded && (
                                            <Motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.22 }}
                                                className="overflow-hidden border-t"
                                                style={{ borderColor: 'rgb(var(--border))' }}
                                            >
                                                <div className="grid gap-3 px-5 py-5">
                                                    {!detail ? (
                                                        <div className="flex items-center justify-center py-8">
                                                            <span className="h-8 w-8 rounded-full border-4 animate-spin" style={{ borderColor: 'rgb(var(--surface3))', borderTopColor: 'rgb(var(--brand))' }} />
                                                        </div>
                                                    ) : (
                                                        detail.review.map((item) => (
                                                            <div
                                                                key={`${attempt.id}-${item.ordinal}`}
                                                                className="panel-muted p-4"
                                                                style={{
                                                                    borderColor: item.isCorrect ? 'rgb(var(--success) / 0.22)' : 'rgb(var(--danger) / 0.22)',
                                                                    background: item.isCorrect ? 'rgb(var(--success-soft) / 0.44)' : 'rgb(var(--danger-soft) / 0.38)',
                                                                }}
                                                            >
                                                                <div className="flex items-start gap-3">
                                                                    <span className="mt-1" style={{ color: item.isCorrect ? 'rgb(var(--success))' : 'rgb(var(--danger))' }}>
                                                                        {item.isCorrect ? <CheckCircle size={16} /> : <XCircle size={16} />}
                                                                    </span>
                                                                    <div className="grid gap-2">
                                                                        <p className="text-sm font-semibold leading-7" style={{ color: 'rgb(var(--text))' }}>
                                                                            {item.ordinal}. {item.question}
                                                                        </p>
                                                                        {item.options && item.options.map((option) => {
                                                                            const isUserChoice = option.id === item.userOptionId;
                                                                            const isCorrectOption = option.isCorrect;
                                                                            let color = 'rgb(var(--subtle))';
                                                                            if (isCorrectOption) color = 'rgb(var(--success))';
                                                                            else if (isUserChoice && !isCorrectOption) color = 'rgb(var(--danger))';

                                                                            return (
                                                                                <p key={option.id} className="text-xs leading-6" style={{ color }}>
                                                                                    {option.label}) {option.text}
                                                                                </p>
                                                                            );
                                                                        })}
                                                                        {item.explanation && (
                                                                            <p className="text-sm leading-7" style={{ color: 'rgb(var(--muted))' }}>
                                                                                {item.explanation}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </Motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </Motion.div>
        </AppShell>
    );
}

