import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft, CheckCircle, FileText, Upload, XCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { extractTextFromPDF, analyzeResume } from '../services/resumeService';
import { saveAssessmentResult } from '../services/assessmentResultService';
import Button from '../components/ui/Button';
import AppShell from '../components/AppShell';

export default function ResumePage({ profession }) {
    const { t } = useLanguage();
    const { user } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [step, setStep] = useState('upload');
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [dragOver, setDragOver] = useState(false);

    const handleFile = (nextFile) => {
        if (!nextFile) return;
        if (nextFile.type !== 'application/pdf') {
            setError('Please select a PDF file.');
            return;
        }
        if (nextFile.size > 5 * 1024 * 1024) {
            setError('File size must be under 5MB.');
            return;
        }
        setFile(nextFile);
        setError('');
    };

    const handleUpload = async () => {
        if (!file) return;
        try {
            setStep('parsing');
            const text = await extractTextFromPDF(file);
            if (!text || text.trim().length < 20) {
                setError(t('resume.error'));
                setStep('error');
                return;
            }
            setStep('analyzing');
            await new Promise((resolve) => setTimeout(resolve, 800));
            const analysis = analyzeResume(text, profession);
            if (user?.id) {
                await saveAssessmentResult(user.id, 'resume', {
                    score: analysis.score,
                    status: analysis.score >= 80 ? 'stable' : analysis.score >= 60 ? 'improving' : 'needs-work',
                    summary: analysis.strengths[0] || 'Resume analysis completed.',
                    insights: analysis.improvements.slice(0, 3),
                    professionSlug: profession || null,
                    detail: analysis,
                });
            }
            setResult(analysis);
            setStep('results');
        } catch (err) {
            console.error('PDF parsing error:', err);
            setError(t('resume.error'));
            setStep('error');
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };
    const handleDragLeave = () => setDragOver(false);
    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        handleFile(e.dataTransfer.files[0]);
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
                {t('resume.back')}
            </button>

            <Motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6">
                <section className="section-shell px-6 py-7 sm:px-8 sm:py-9">
                    <p className="page-kicker">Resume analysis</p>
                    <h1 className="page-title">{t('resume.title')}</h1>
                    <p className="page-subtitle mt-4">
                        Upload a PDF resume to receive a cleaner view of ATS compatibility, strengths, missing keywords, and next improvements.
                    </p>
                </section>

                <section className="section-shell px-6 py-7 sm:px-8 sm:py-9">
                    {step === 'upload' && (
                        <div className="grid gap-5">
                            <input
                                ref={fileInputRef}
                                id="resume-file-input"
                                type="file"
                                accept=".pdf,application/pdf"
                                className="sr-only"
                                onChange={(e) => handleFile(e.target.files[0])}
                            />

                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className="rounded-[28px] border-2 border-dashed px-6 py-12 text-center transition-all duration-200"
                                style={{
                                    borderColor: dragOver ? 'rgb(var(--brand))' : 'rgb(var(--border))',
                                    background: dragOver ? 'rgb(var(--brand-soft))' : 'rgb(var(--surface2) / 0.55)',
                                }}
                            >
                                <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full" style={{ background: 'rgb(var(--surface-elevated))', color: 'rgb(var(--brand))' }}>
                                    <Upload size={26} />
                                </span>
                                <p className="text-lg font-black tracking-[-0.04em]" style={{ color: 'rgb(var(--text))' }}>
                                    {t('resume.upload_title')}
                                </p>
                                <p className="mt-2 text-sm" style={{ color: 'rgb(var(--muted))' }}>
                                    {t('resume.upload_desc')}
                                </p>
                                <Button
                                    variant="brand"
                                    size="lg"
                                    rounded="full"
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="mt-6"
                                >
                                    {t('resume.select_file')}
                                </Button>
                            </div>

                            {file && (
                                <div className="panel-muted flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-11 w-11 items-center justify-center rounded-[18px]" style={{ background: 'rgb(var(--surface-elevated))', color: 'rgb(var(--brand))' }}>
                                            <FileText size={18} />
                                        </span>
                                        <div>
                                            <p className="text-sm font-semibold" style={{ color: 'rgb(var(--text))' }}>{file.name}</p>
                                            <p className="text-xs uppercase tracking-[0.16em]" style={{ color: 'rgb(var(--subtle))' }}>
                                                {(file.size / 1024).toFixed(0)} KB
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant="brand" size="lg" rounded="full" onClick={handleUpload}>
                                        Analyze resume
                                    </Button>
                                </div>
                            )}

                            {error && <p className="danger-panel rounded-[18px] px-4 py-3 text-sm">{error}</p>}
                        </div>
                    )}

                    {(step === 'parsing' || step === 'analyzing') && (
                        <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
                            <span className="mb-4 h-12 w-12 rounded-full border-4 animate-spin" style={{ borderColor: 'rgb(var(--surface3))', borderTopColor: 'rgb(var(--brand))' }} />
                            <p className="text-sm" style={{ color: 'rgb(var(--muted))' }}>
                                {step === 'parsing' ? t('resume.parsing') : t('resume.scoring')}
                            </p>
                        </div>
                    )}

                    {step === 'error' && (
                        <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 text-center">
                            <span className="flex h-16 w-16 items-center justify-center rounded-full" style={{ background: 'rgb(var(--warn-soft))', color: 'rgb(var(--warn))' }}>
                                <AlertTriangle size={28} />
                            </span>
                            <p className="max-w-lg text-sm leading-7" style={{ color: 'rgb(var(--muted))' }}>{error}</p>
                            <Button
                                variant="secondary"
                                size="lg"
                                rounded="full"
                                onClick={() => {
                                    setStep('upload');
                                    setFile(null);
                                    setError('');
                                }}
                            >
                                {t('resume.try_again')}
                            </Button>
                        </div>
                    )}

                    {step === 'results' && result && (
                        <div className="grid gap-5">
                            <div className="panel-muted py-8 text-center">
                                <p className="page-kicker mb-2">{t('resume.ats_score')}</p>
                                <p className="text-[4.2rem] font-black tracking-[-0.08em]" style={{ color: scoreColor(result.score) }}>
                                    {result.score}
                                </p>
                                <p className="text-sm" style={{ color: 'rgb(var(--subtle))' }}>/ 100</p>
                            </div>

                            <div className="grid gap-4 lg:grid-cols-2">
                                <div className="panel-surface p-5">
                                    <h3 className="mb-4 flex items-center gap-2 text-base font-black tracking-[-0.04em]" style={{ color: 'rgb(var(--success))' }}>
                                        <CheckCircle size={18} />
                                        {t('resume.strengths')}
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
                                        {t('resume.improvements')}
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

                            {result.missingKeywords.length > 0 && (
                                <div className="panel-surface p-5">
                                    <h3 className="mb-4 text-base font-black tracking-[-0.04em]" style={{ color: 'rgb(var(--text))' }}>
                                        {t('resume.missing_keywords')}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {result.missingKeywords.map((keyword) => (
                                            <span
                                                key={keyword}
                                                className="rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em]"
                                                style={{ borderColor: 'rgb(var(--border))', background: 'rgb(var(--surface2))', color: 'rgb(var(--muted))' }}
                                            >
                                                {keyword}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    rounded="full"
                                    className="flex-1 justify-center"
                                    onClick={() => {
                                        setStep('upload');
                                        setFile(null);
                                        setResult(null);
                                    }}
                                >
                                    {t('resume.try_again')}
                                </Button>
                                <Button
                                    variant="brand"
                                    size="lg"
                                    rounded="full"
                                    className="flex-1 justify-center"
                                    onClick={() => navigate('/dashboard')}
                                >
                                    {t('resume.continue')}
                                </Button>
                            </div>
                        </div>
                    )}
                </section>
            </Motion.div>
        </AppShell>
    );
}

