import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Lightbulb, RefreshCw, XCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { evaluateEssay } from '../services/essayService';
import { saveAssessmentResult } from '../services/assessmentResultService';
import { ESSAY_PROMPTS } from '../data/professions';
import Button from '../components/ui/Button';
import AppShell from '../components/AppShell';

export default function EssayPage({ profession }) {
    const { t } = useLanguage();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [essay, setEssay] = useState('');
    const [result, setResult] = useState(null);
    const [phase, setPhase] = useState('write');

    const prompt = ESSAY_PROMPTS[profession]?.prompt || ESSAY_PROMPTS['software-dev'].prompt;
    const minChars = ESSAY_PROMPTS[profession]?.minCharacters || 500;
    const wordCount = essay.trim().split(/\s+/).filter(Boolean).length;

    const handleSubmit = async () => {
        if (essay.trim().length < minChars) return;
        const evaluation = evaluateEssay(essay, prompt);
        if (user?.id) {
            await saveAssessmentResult(user.id, 'essay', {
                score: evaluation.score,
                status: evaluation.score >= 80 ? 'stable' : evaluation.score >= 60 ? 'improving' : 'needs-work',
                summary: evaluation.feedback,
                insights: evaluation.improvements.slice(0, 3),
                professionSlug: profession || null,
                detail: {
                    prompt,
                    wordCount: evaluation.wordCount,
                    charCount: evaluation.charCount,
                },
            });
        }
        setResult(evaluation);
        setPhase('results');
    };

    const handleReset = () => {
        setEssay('');
        setResult(null);
        setPhase('write');
    };

    const scoreColor = (score) => {
        if (score >= 80) return 'rgb(var(--success))';
        if (score >= 60) return 'rgb(var(--warn))';
        return 'rgb(var(--danger))';
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
                {t('essay.back')}
            </button>

            <Motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6">
                <section className="section-shell px-6 py-7 sm:px-8 sm:py-9">
                    <p className="page-kicker">Written communication</p>
                    <h1 className="page-title">{t('essay.title')}</h1>
                    <p className="page-subtitle mt-4">
                        A calmer writing workspace that helps graduates practice reasoning, clarity, and professional tone without visual clutter.
                    </p>
                </section>

                <section className="section-shell px-6 py-7 sm:px-8 sm:py-9">
                    {phase === 'write' && (
                        <div className="grid gap-5">
                            <div className="panel-muted p-5">
                                <p className="page-kicker mb-2">Prompt</p>
                                <p className="text-sm leading-7" style={{ color: 'rgb(var(--text))' }}>{prompt}</p>
                            </div>

                            <textarea
                                value={essay}
                                onChange={(e) => setEssay(e.target.value)}
                                placeholder={t('essay.placeholder')}
                                rows={14}
                                className="w-full resize-y rounded-[var(--radius-lg)] border border-border bg-surface/90 px-5 py-4 text-sm leading-7 text-text shadow-card transition-all duration-[220ms] placeholder:text-subtle focus:border-border-strong focus:outline-none focus:ring-2 focus:ring-brand/15"
                            />

                            <div className="flex flex-col gap-3 rounded-[22px] border px-4 py-4 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: 'rgb(var(--border))', background: 'rgb(var(--surface2) / 0.82)' }}>
                                <div className="flex flex-wrap gap-4 text-sm">
                                    <span style={{ color: wordCount >= 300 && wordCount <= 600 ? 'rgb(var(--success))' : wordCount > 0 ? 'rgb(var(--warn))' : 'rgb(var(--subtle))' }}>
                                        {t('essay.word_count')}: {wordCount}
                                    </span>
                                    <span style={{ color: 'rgb(var(--subtle))' }}>{t('essay.target_range')}</span>
                                </div>
                                <span className="text-xs uppercase tracking-[0.16em]" style={{ color: 'rgb(var(--subtle))' }}>
                                    {essay.length} / {minChars} chars
                                </span>
                            </div>

                            <Button
                                variant="brand"
                                size="lg"
                                rounded="full"
                                onClick={handleSubmit}
                                disabled={essay.trim().length < minChars}
                                className="w-full justify-center"
                            >
                                {t('essay.submit')}
                            </Button>
                        </div>
                    )}

                    {phase === 'results' && result && (
                        <div className="grid gap-5">
                            <div className="panel-muted py-8 text-center">
                                <p className="text-[4.2rem] font-black tracking-[-0.08em]" style={{ color: scoreColor(result.score) }}>
                                    {result.score}
                                </p>
                                <p className="text-sm" style={{ color: 'rgb(var(--subtle))' }}>/ 100</p>
                                <p className="mx-auto mt-3 max-w-xl text-sm leading-7" style={{ color: 'rgb(var(--muted))' }}>
                                    {result.feedback}
                                </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="panel-muted p-4 text-center">
                                    <p className="page-kicker mb-2">{t('essay.word_count')}</p>
                                    <p className="text-[1.9rem] font-black tracking-[-0.05em]" style={{ color: 'rgb(var(--text))' }}>{result.wordCount}</p>
                                </div>
                                <div className="panel-muted p-4 text-center">
                                    <p className="page-kicker mb-2">Characters</p>
                                    <p className="text-[1.9rem] font-black tracking-[-0.05em]" style={{ color: 'rgb(var(--text))' }}>{result.charCount}</p>
                                </div>
                            </div>

                            <div className="grid gap-4 lg:grid-cols-2">
                                <div className="panel-surface p-5">
                                    <h3 className="mb-4 flex items-center gap-2 text-base font-black tracking-[-0.04em]" style={{ color: 'rgb(var(--success))' }}>
                                        <CheckCircle size={18} />
                                        Strengths
                                    </h3>
                                    <ul className="grid gap-3">
                                        {result.strengths.map((item) => (
                                            <li key={item} className="flex items-start gap-3 text-sm leading-7" style={{ color: 'rgb(var(--muted))' }}>
                                                <span className="mt-2 h-2 w-2 rounded-full" style={{ background: 'rgb(var(--success))' }} />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="panel-surface p-5">
                                    <h3 className="mb-4 flex items-center gap-2 text-base font-black tracking-[-0.04em]" style={{ color: 'rgb(var(--warn))' }}>
                                        <XCircle size={18} />
                                        {t('essay.actionable_feedback')}
                                    </h3>
                                    <ul className="grid gap-3">
                                        {result.improvements.map((item) => (
                                            <li key={item} className="flex items-start gap-3 text-sm leading-7" style={{ color: 'rgb(var(--muted))' }}>
                                                <span className="mt-2 h-2 w-2 rounded-full" style={{ background: 'rgb(var(--warn))' }} />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {result.suggestedOutline && (
                                <div className="panel-surface p-5">
                                    <h3 className="mb-4 flex items-center gap-2 text-base font-black tracking-[-0.04em]" style={{ color: 'rgb(var(--text))' }}>
                                        <Lightbulb size={18} />
                                        {t('essay.suggested_outline')}
                                    </h3>
                                    <p className="mb-3 text-xs uppercase tracking-[0.16em]" style={{ color: 'rgb(var(--subtle))' }}>
                                        {result.suggestedOutline.framework}
                                    </p>
                                    <ol className="grid gap-2">
                                        {result.suggestedOutline.steps.map((step, index) => (
                                            <li key={step} className="flex items-start gap-3 text-sm leading-7" style={{ color: 'rgb(var(--muted))' }}>
                                                <span className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: 'rgb(var(--subtle))' }}>
                                                    {index + 1}
                                                </span>
                                                {step}
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            )}

                            {result.sampleRewrite && (
                                <div className="panel-muted p-5">
                                    <h3 className="mb-3 flex items-center gap-2 text-base font-black tracking-[-0.04em]" style={{ color: 'rgb(var(--text))' }}>
                                        <RefreshCw size={18} />
                                        {t('essay.sample_rewrite')}
                                    </h3>
                                    <p className="text-sm italic leading-7" style={{ color: 'rgb(var(--muted))' }}>
                                        "{result.sampleRewrite}"
                                    </p>
                                </div>
                            )}

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Button variant="secondary" size="lg" rounded="full" className="flex-1 justify-center" onClick={handleReset}>
                                    Write again
                                </Button>
                                <Button variant="brand" size="lg" rounded="full" className="flex-1 justify-center" onClick={() => navigate('/dashboard')}>
                                    {t('essay.back')}
                                </Button>
                            </div>
                        </div>
                    )}
                </section>
            </Motion.div>
        </AppShell>
    );
}

