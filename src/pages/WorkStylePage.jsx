import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, CheckCircle, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { getWorkStyleQuestions, evaluateWorkStyle } from '../services/workStyleService';
import { saveAssessmentResult } from '../services/assessmentResultService';
import Button from '../components/ui/Button';
import AppShell from '../components/AppShell';

export default function WorkStylePage({ profession }) {
    const { t } = useLanguage();
    const { user } = useAuth();
    const navigate = useNavigate();
    const questions = getWorkStyleQuestions();
    const [answers, setAnswers] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [result, setResult] = useState(null);
    const [phase, setPhase] = useState('quiz');

    const handleSelect = (optionId) => {
        const nextAnswers = [...answers];
        nextAnswers[currentIndex] = optionId;
        setAnswers(nextAnswers);
    };

    const handleNext = () => {
        if (currentIndex + 1 < questions.length) setCurrentIndex((prev) => prev + 1);
    };

    const handlePrev = () => {
        if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
    };

    const handleSubmit = async () => {
        const evaluation = evaluateWorkStyle(answers, profession);
        if (user?.id) {
            await saveAssessmentResult(user.id, 'workstyle', {
                displayValue: 'Done',
                status: 'stable',
                summary: evaluation.summary,
                insights: evaluation.results.map((item) => item.feedback).filter(Boolean).slice(0, 3),
                professionSlug: profession || null,
                detail: {
                    dominantTraits: evaluation.dominantTraits,
                    answers,
                },
            });
        }
        setResult(evaluation);
        setPhase('results');
    };

    const allAnswered = answers.filter((answer) => answer !== undefined).length === questions.length;
    const currentQuestion = questions[currentIndex];

    return (
        <AppShell maxWidth="max-w-[1800px]">
            <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="mb-5 inline-flex items-center gap-2 text-sm font-semibold transition-colors duration-200"
                style={{ color: 'rgb(var(--muted))' }}
            >
                <ArrowLeft size={16} />
                {t('workstyle.back')}
            </button>

            <div className="grid gap-6">
                <section className="section-shell px-6 py-7 sm:px-8 sm:py-9">
                    <p className="page-kicker">Work style questionnaire</p>
                    <h1 className="page-title">{t('workstyle.title')}</h1>
                    <p className="page-subtitle mt-4">
                        A more editorial, easier-to-read questionnaire that helps users reflect on professional tendencies without feeling clinical or overwhelming.
                    </p>
                </section>

                <section className="section-shell px-6 py-7 sm:px-8 sm:py-9">
                    <div className="warn-panel mb-5 flex items-start gap-3 rounded-[22px] px-4 py-4 text-sm leading-7">
                        <AlertCircle className="mt-0.5 shrink-0" size={16} />
                        <p>{t('workstyle.disclaimer')}</p>
                    </div>

                    {phase === 'quiz' && currentQuestion && (
                        <div className="grid gap-6">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <p className="page-kicker">Question {currentIndex + 1} of {questions.length}</p>
                                <span className="rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]" style={{ borderColor: 'rgb(var(--border))', color: 'rgb(var(--subtle))' }}>
                                    {answers.filter((answer) => answer !== undefined).length} answered
                                </span>
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

                            <div className="panel-muted p-5">
                                <p className="text-lg font-black tracking-[-0.04em]" style={{ color: 'rgb(var(--text))' }}>
                                    {currentQuestion.question}
                                </p>
                            </div>

                            <div className="grid gap-3">
                                {currentQuestion.options.map((option) => (
                                    <button
                                        key={option.id}
                                        type="button"
                                        onClick={() => handleSelect(option.id)}
                                        className={`choice-tile ${answers[currentIndex] === option.id ? 'choice-tile--active' : ''}`}
                                    >
                                        <p className="text-sm leading-7" style={{ color: 'rgb(var(--text))' }}>
                                            {option.text}
                                        </p>
                                    </button>
                                ))}
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    rounded="full"
                                    onClick={handlePrev}
                                    disabled={currentIndex === 0}
                                >
                                    Previous
                                </Button>

                                {currentIndex + 1 < questions.length ? (
                                    <Button
                                        variant="brand"
                                        size="lg"
                                        rounded="full"
                                        onClick={handleNext}
                                        disabled={answers[currentIndex] === undefined}
                                    >
                                        Next
                                    </Button>
                                ) : (
                                    <Button
                                        variant="brand"
                                        size="lg"
                                        rounded="full"
                                        onClick={handleSubmit}
                                        disabled={!allAnswered}
                                    >
                                        {t('workstyle.submit')}
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}

                    {phase === 'results' && result && (
                        <div className="grid gap-5">
                            <div className="panel-muted p-5">
                                <h3 className="mb-3 flex items-center gap-2 text-base font-black tracking-[-0.04em]" style={{ color: 'rgb(var(--text))' }}>
                                    <User size={18} />
                                    {t('workstyle.tendency')}
                                </h3>
                                <p className="text-sm leading-7" style={{ color: 'rgb(var(--muted))' }}>
                                    {result.summary}
                                </p>
                            </div>

                            {result.dominantTraits.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {result.dominantTraits.map((trait) => (
                                        <span
                                            key={trait}
                                            className="rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em]"
                                            style={{ borderColor: 'rgb(var(--border))', background: 'rgb(var(--surface2))', color: 'rgb(var(--muted))' }}
                                        >
                                            {trait}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="grid gap-3">
                                {result.results.map((item) => (
                                    <div key={item.question} className="panel-surface p-4">
                                        <p className="text-sm font-semibold leading-7" style={{ color: 'rgb(var(--text))' }}>
                                            {item.question}
                                        </p>
                                        <p className="mt-1 text-xs uppercase tracking-[0.16em]" style={{ color: 'rgb(var(--subtle))' }}>
                                            Your response: {item.userAnswer}
                                        </p>
                                        <p className="mt-3 flex items-start gap-3 text-sm leading-7" style={{ color: 'rgb(var(--muted))' }}>
                                            <CheckCircle className="mt-0.5 shrink-0" size={16} style={{ color: 'rgb(var(--success))' }} />
                                            {item.feedback}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="warn-panel rounded-[22px] px-4 py-4 text-sm leading-7">
                                {result.disclaimer}
                            </div>

                            <Button variant="brand" size="lg" rounded="full" className="w-full justify-center" onClick={() => navigate('/dashboard')}>
                                {t('workstyle.back')}
                            </Button>
                        </div>
                    )}
                </section>
            </div>
        </AppShell>
    );
}
