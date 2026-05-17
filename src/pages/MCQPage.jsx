import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ArrowLeft, BookOpen, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { startAttempt, submitAnswer, finishAttempt } from '../services/mcqSupabaseService';
import Button from '../components/ui/Button';
import AppShell from '../components/AppShell';

const QUESTIONS_PER_ATTEMPT = 10;

export default function MCQPage({ profession }) {
    const { t } = useLanguage();
    const navigate = useNavigate();

    const [phase, setPhase] = useState('start');
    const [attemptId, setAttemptId] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOptionId, setSelectedOptionId] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [answerResult, setAnswerResult] = useState(null);
    const [result, setResult] = useState(null);
    const [timeLeft, setTimeLeft] = useState(600);
    const [timerEnabled, setTimerEnabled] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [answeredQuestions, setAnsweredQuestions] = useState([]);

    const handleStart = async () => {
        setError('');
        setPhase('loading');
        try {
            const data = await startAttempt(profession, QUESTIONS_PER_ATTEMPT);
            setAttemptId(data.attempt_id);
            setQuestions(data.questions || []);
            setCurrentIndex(0);
            setSelectedOptionId(null);
            setShowExplanation(false);
            setAnswerResult(null);
            setAnsweredQuestions([]);
            setTimeLeft(600);
            setPhase('quiz');
        } catch (err) {
            setError(err.message || 'Failed to start quiz.');
            setPhase('start');
        }
    };

    const handleSelect = (optionId) => {
        if (showExplanation) return;
        setSelectedOptionId(optionId);
    };

    const handleConfirm = async () => {
        if (selectedOptionId === null || submitting) return;
        setSubmitting(true);
        try {
            const currentQ = questions[currentIndex];
            const res = await submitAnswer(attemptId, currentQ.id, selectedOptionId);
            setAnswerResult(res);
            setShowExplanation(true);
            setAnsweredQuestions((prev) => [
                ...prev,
                {
                    question: currentQ,
                    selectedOptionId,
                    isCorrect: res.is_correct,
                    explanation: res.explanation,
                    correctOption: res.correct_option,
                },
            ]);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleNext = () => {
        setShowExplanation(false);
        setSelectedOptionId(null);
        setAnswerResult(null);
        if (currentIndex + 1 >= questions.length) handleFinish();
        else setCurrentIndex((prev) => prev + 1);
    };

    const handleFinish = useCallback(async () => {
        if (!attemptId) return;
        setPhase('loading');
        try {
            const graded = await finishAttempt(attemptId);
            setResult(graded);
            setPhase('results');
        } catch (err) {
            setError(err.message);
            setPhase('results');
        }
    }, [attemptId]);

    useEffect(() => {
        if (phase !== 'quiz' || !timerEnabled) return undefined;
        if (timeLeft <= 0) {
            handleFinish();
            return undefined;
        }
        const interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        return () => clearInterval(interval);
    }, [phase, timeLeft, timerEnabled, handleFinish]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    const currentQuestion = questions[currentIndex];

    return (
        <AppShell maxWidth="max-w-[1800px]">
            {!profession ? (
                <div className="section-shell flex min-h-[60vh] flex-col items-center justify-center gap-5 px-6 py-10 text-center">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full" style={{ background: 'rgb(var(--surface2))', color: 'rgb(var(--brand))' }}>
                        <BookOpen size={28} />
                    </span>
                    <div>
                        <h2 className="text-2xl font-black tracking-[-0.04em]" style={{ color: 'rgb(var(--text))' }}>
                            Career path required
                        </h2>
                        <p className="mt-2 max-w-md text-sm leading-7" style={{ color: 'rgb(var(--muted))' }}>
                            Please choose a target profession first so the quiz can deliver the right question set.
                        </p>
                    </div>
                    <Button variant="brand" size="lg" rounded="full" onClick={() => navigate('/dashboard')}>
                        Select career path
                    </Button>
                </div>
            ) : (
                <>
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard')}
                        className="mb-5 inline-flex items-center gap-2 text-sm font-semibold transition-colors duration-200"
                        style={{ color: 'rgb(var(--muted))' }}
                    >
                        <ArrowLeft size={16} />
                        {t('mcq.back')}
                    </button>

                    <Motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6">
                        <section className="section-shell px-6 py-7 sm:px-8 sm:py-9">
                            <p className="page-kicker">Technical assessment</p>
                            <h1 className="page-title">{t('mcq.title')}</h1>
                            <p className="page-subtitle mt-4">
                                A focused quiz flow with guided review, visible timing, and a calmer presentation for role-based technical practice.
                            </p>
                        </section>

                        <section className="section-shell px-6 py-7 sm:px-8 sm:py-9">
                            {error && (
                                <div className="danger-panel mb-5 flex items-start gap-3 rounded-[20px] px-4 py-3 text-sm">
                                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                                    <p>{error}</p>
                                </div>
                            )}

                            {phase === 'start' && (
                                <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
                                    <span className="flex h-16 w-16 items-center justify-center rounded-full" style={{ background: 'rgb(var(--brand-soft))', color: 'rgb(var(--brand))' }}>
                                        <BookOpen size={28} />
                                    </span>
                                    <p className="page-kicker mt-6">Before you begin</p>
                                    <h2 className="text-[2rem] font-black tracking-[-0.05em]" style={{ color: 'rgb(var(--text))' }}>
                                        A short, structured technical check-in.
                                    </h2>
                                    <p className="mt-3 max-w-xl text-sm leading-7" style={{ color: 'rgb(var(--muted))' }}>
                                        {t('mcq.instructions')} Each attempt pulls {QUESTIONS_PER_ATTEMPT} questions and keeps the experience focused.
                                    </p>

                                    <label className="mt-6 inline-flex items-center gap-2 rounded-full border px-4 py-3 text-sm font-semibold" style={{ borderColor: 'rgb(var(--border))', background: 'rgb(var(--surface2))', color: 'rgb(var(--muted))' }}>
                                        <input type="checkbox" checked={timerEnabled} onChange={(e) => setTimerEnabled(e.target.checked)} className="rounded" />
                                        <Clock size={14} />
                                        {t('mcq.time_remaining')}
                                    </label>

                                    <Button variant="brand" size="lg" rounded="full" onClick={handleStart} className="mt-6">
                                        {t('mcq.start')}
                                    </Button>
                                </div>
                            )}

                            {phase === 'loading' && (
                                <div className="flex min-h-[360px] flex-col items-center justify-center py-12 text-center">
                                    <span className="mb-4 h-12 w-12 rounded-full border-4 animate-spin" style={{ borderColor: 'rgb(var(--surface3))', borderTopColor: 'rgb(var(--brand))' }} />
                                    <p className="text-sm" style={{ color: 'rgb(var(--muted))' }}>Preparing your questions...</p>
                                </div>
                            )}

                            {phase === 'quiz' && currentQuestion && (
                                <div className="grid gap-6">
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className="page-kicker">{t('mcq.q_of', { current: currentIndex + 1, total: questions.length })}</p>
                                            <p className="text-sm" style={{ color: 'rgb(var(--muted))' }}>Select an answer, then confirm it to reveal feedback.</p>
                                        </div>
                                        {timerEnabled && (
                                            <div className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold" style={{ borderColor: 'rgb(var(--border))', background: 'rgb(var(--surface2))', color: timeLeft < 60 ? 'rgb(var(--danger))' : 'rgb(var(--text))' }}>
                                                <Clock size={14} />
                                                {formatTime(timeLeft)}
                                            </div>
                                        )}
                                    </div>

                                    <div className="h-2 w-full rounded-full" style={{ background: 'rgb(var(--surface3))' }}>
                                        <div
                                            className="h-2 rounded-full transition-all duration-300"
                                            style={{
                                                width: `${((currentIndex + 1) / questions.length) * 100}%`,
                                                background: 'linear-gradient(135deg, rgb(var(--brand)) 0%, rgb(var(--accent)) 100%)',
                                            }}
                                        />
                                    </div>

                                    <AnimatePresence mode="wait">
                                        <Motion.div
                                            key={currentIndex}
                                            initial={{ opacity: 0, x: 16 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -16 }}
                                            className="grid gap-5"
                                        >
                                            <div className="panel-muted p-5">
                                                <p className="text-lg font-black tracking-[-0.04em]" style={{ color: 'rgb(var(--text))' }}>
                                                    {currentQuestion.prompt}
                                                </p>
                                            </div>

                                            <div className="grid gap-3">
                                                {(currentQuestion.options || []).map((option) => {
                                                    let optionClassName = 'choice-tile';
                                                    if (showExplanation && answerResult) {
                                                        if (answerResult.correct_option && option.id === answerResult.correct_option.id) {
                                                            optionClassName += ' choice-tile--success';
                                                        } else if (option.id === selectedOptionId && !answerResult.is_correct) {
                                                            optionClassName += ' choice-tile--danger';
                                                        }
                                                    } else if (option.id === selectedOptionId) {
                                                        optionClassName += ' choice-tile--active';
                                                    }

                                                    return (
                                                        <button
                                                            key={option.id}
                                                            type="button"
                                                            onClick={() => handleSelect(option.id)}
                                                            disabled={showExplanation}
                                                            className={optionClassName}
                                                        >
                                                            <span className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: 'rgb(var(--subtle))' }}>
                                                                {option.label}
                                                            </span>
                                                            <p className="mt-2 text-sm leading-7" style={{ color: 'rgb(var(--text))' }}>
                                                                {option.option_text}
                                                            </p>
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {showExplanation && answerResult && (
                                                <Motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                                                    <div className={`${answerResult.is_correct ? 'success-panel' : 'danger-panel'} rounded-[22px] px-5 py-4`}>
                                                        <p className="text-sm font-semibold uppercase tracking-[0.16em]">
                                                            {answerResult.is_correct ? t('mcq.correct') : t('mcq.incorrect')}
                                                        </p>
                                                        {!answerResult.is_correct && answerResult.correct_option && (
                                                            <p className="mt-2 text-sm leading-7">
                                                                Correct answer: <strong>{answerResult.correct_option.label}) {answerResult.correct_option.option_text}</strong>
                                                            </p>
                                                        )}
                                                        {answerResult.explanation && (
                                                            <p className="mt-2 text-sm leading-7" style={{ color: 'rgb(var(--muted))' }}>
                                                                {answerResult.explanation}
                                                            </p>
                                                        )}
                                                    </div>
                                                </Motion.div>
                                            )}
                                        </Motion.div>
                                    </AnimatePresence>

                                    <div className="flex justify-end">
                                        {!showExplanation ? (
                                            <Button
                                                variant="brand"
                                                size="lg"
                                                rounded="full"
                                                onClick={handleConfirm}
                                                disabled={selectedOptionId === null || submitting}
                                            >
                                                {submitting ? 'Submitting...' : t('mcq.submit')}
                                            </Button>
                                        ) : (
                                            <Button variant="brand" size="lg" rounded="full" onClick={handleNext}>
                                                {currentIndex + 1 >= questions.length ? t('mcq.result') : t('mcq.next')}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {phase === 'results' && result && (
                                <div className="grid gap-5">
                                    <div className="panel-muted py-8 text-center">
                                        <p className="text-[4.2rem] font-black tracking-[-0.08em]" style={{ color: result.passed ? 'rgb(var(--success))' : 'rgb(var(--danger))' }}>
                                            {result.percentage}%
                                        </p>
                                        <p className="text-sm" style={{ color: 'rgb(var(--muted))' }}>
                                            {result.score}/{result.total_questions} correct
                                        </p>
                                        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: result.passed ? 'rgb(var(--success))' : 'rgb(var(--danger))' }}>
                                            {result.passed ? t('mcq.passed') : t('mcq.failed')}
                                        </p>
                                    </div>

                                    {answeredQuestions.length > 0 && (
                                        <div className="grid gap-3">
                                            {answeredQuestions.map((item, index) => (
                                                <div
                                                    key={`${item.question.id}-${index}`}
                                                    className="panel-surface p-4"
                                                    style={{
                                                        borderColor: item.isCorrect ? 'rgb(var(--success) / 0.25)' : 'rgb(var(--danger) / 0.25)',
                                                        background: item.isCorrect ? 'rgb(var(--success-soft) / 0.48)' : 'rgb(var(--danger-soft) / 0.42)',
                                                    }}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <span className="mt-1" style={{ color: item.isCorrect ? 'rgb(var(--success))' : 'rgb(var(--danger))' }}>
                                                            {item.isCorrect ? <CheckCircle size={16} /> : <XCircle size={16} />}
                                                        </span>
                                                        <div className="grid gap-2">
                                                            <p className="text-sm font-semibold leading-7" style={{ color: 'rgb(var(--text))' }}>
                                                                {index + 1}. {item.question.prompt}
                                                            </p>
                                                            <div className="grid gap-1">
                                                                {(item.question.options || []).map((option) => {
                                                                    const isSelected = option.id === item.selectedOptionId;
                                                                    const isCorrectOption = item.correctOption && option.id === item.correctOption.id;
                                                                    let optionColor = 'rgb(var(--subtle))';
                                                                    if (isCorrectOption) optionColor = 'rgb(var(--success))';
                                                                    else if (isSelected && !item.isCorrect) optionColor = 'rgb(var(--danger))';

                                                                    return (
                                                                        <p key={option.id} className="text-xs leading-6" style={{ color: optionColor }}>
                                                                            {option.label}) {option.option_text}
                                                                        </p>
                                                                    );
                                                                })}
                                                            </div>
                                                            {!item.isCorrect && item.explanation && (
                                                                <p className="text-sm leading-7" style={{ color: 'rgb(var(--muted))' }}>
                                                                    {item.explanation}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-3 sm:flex-row">
                                        <Button variant="secondary" size="lg" rounded="full" className="flex-1 justify-center" onClick={handleStart}>
                                            {t('mcq.start')}
                                        </Button>
                                        <Button variant="secondary" size="lg" rounded="full" className="flex-1 justify-center" onClick={() => navigate('/history')}>
                                            View history
                                        </Button>
                                        <Button variant="brand" size="lg" rounded="full" className="flex-1 justify-center" onClick={() => navigate('/dashboard')}>
                                            {t('mcq.back')}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </section>
                    </Motion.div>
                </>
            )}
        </AppShell>
    );
}

