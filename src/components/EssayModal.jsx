
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { evaluateEssay } from '../services/essayService';
import { ESSAY_PROMPTS } from '../data/professions';

const overlayStyle = { background: 'rgba(11,27,58,0.45)', backdropFilter: 'blur(8px)' };

export default function EssayModal({ isOpen, onClose, profession }) {
    const { t } = useLanguage();
    const [essayText, setEssayText] = useState('');
    const [result, setResult] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const activePrompt = (profession && ESSAY_PROMPTS[profession])
        ? ESSAY_PROMPTS[profession].prompt
        : t('essay.prompt');

    const minChars = (profession && ESSAY_PROMPTS[profession])
        ? ESSAY_PROMPTS[profession].minCharacters
        : 500;

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise(r => setTimeout(r, 1500));
        setResult(evaluateEssay(essayText, activePrompt));
        setIsSubmitting(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={overlayStyle}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 8 }}
                        transition={{ duration: 0.18 }}
                        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl"
                        style={{
                            background: 'rgb(var(--surface))',
                            border: '1px solid rgb(var(--border))',
                            boxShadow: 'var(--shadow-panel)',
                        }}
                    >
                        {/* Sticky Header */}
                        <div
                            className="sticky top-0 z-10 flex items-center justify-between p-6 border-b"
                            style={{
                                background: 'rgba(255,255,255,0.95)',
                                backdropFilter: 'blur(12px)',
                                borderColor: 'rgb(var(--border))',
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg" style={{ background: 'rgb(var(--surface2))' }}>
                                    <FileText className="w-5 h-5" style={{ color: 'rgb(var(--brand))' }} />
                                </div>
                                <h2 className="text-xl font-bold" style={{ color: 'rgb(var(--text))' }}>
                                    {t('essay.title')}
                                </h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full transition-colors duration-150"
                                style={{ color: 'rgb(var(--muted))' }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgb(var(--surface2))'; e.currentTarget.style.color = 'rgb(var(--text))'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgb(var(--muted))'; }}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 md:p-8">
                            {!result ? (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Prompt card */}
                                    <div
                                        className="p-6 rounded-2xl"
                                        style={{ background: 'rgb(var(--bg))', border: '1px solid rgb(var(--border))' }}
                                    >
                                        <h3 className="text-base font-semibold mb-2" style={{ color: 'rgb(var(--text))' }}>
                                            Prompt
                                        </h3>
                                        <p className="text-sm leading-relaxed" style={{ color: 'rgb(var(--muted))' }}>
                                            {activePrompt}
                                        </p>
                                    </div>

                                    {/* Textarea */}
                                    <div>
                                        <textarea
                                            value={essayText}
                                            onChange={(e) => setEssayText(e.target.value)}
                                            placeholder={t('essay.placeholder')}
                                            rows={10}
                                            className="w-full p-4 text-sm rounded-xl resize-none leading-relaxed transition-colors duration-150"
                                            style={{
                                                background: 'rgb(var(--bg))',
                                                border: '1.5px solid rgb(var(--border))',
                                                color: 'rgb(var(--text))',
                                                outline: 'none',
                                                fontFamily: 'inherit',
                                            }}
                                            onFocus={e => e.target.style.borderColor = 'rgb(var(--brand))'}
                                            onBlur={e => e.target.style.borderColor = 'rgb(var(--border))'}
                                        />
                                        <div className="flex justify-between mt-2 text-xs">
                                            <span style={{ color: 'rgb(var(--muted))' }}>{t('essay.min_chars')}</span>
                                            <span style={{ color: essayText.length < 50 ? '#ef4444' : '#16a34a' }}>
                                                {essayText.length} chars
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-2">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting || essayText.length < 50}
                                            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-150 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            style={{ background: 'rgb(var(--brand))' }}
                                            onMouseEnter={e => !isSubmitting && (e.currentTarget.style.filter = 'brightness(1.1)')}
                                            onMouseLeave={e => (e.currentTarget.style.filter = 'none')}
                                        >
                                            {isSubmitting ? 'Processing…' : t('essay.submit')}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-8">
                                    {/* Score */}
                                    <div className="flex flex-col items-center text-center">
                                        <div
                                            className="w-24 h-24 rounded-full flex items-center justify-center mb-4"
                                            style={{
                                                background: result.score >= 70
                                                    ? 'rgba(22,163,74,0.1)'
                                                    : 'rgba(239,68,68,0.1)',
                                                color: result.score >= 70 ? '#16a34a' : '#ef4444',
                                            }}
                                        >
                                            <span className="text-3xl font-black">{result.score}</span>
                                        </div>
                                        <h3 className="text-2xl font-bold mb-2" style={{ color: 'rgb(var(--text))' }}>
                                            {result.score >= 70 ? 'Excellent Work!' : 'Needs Improvement'}
                                        </h3>
                                        <p className="text-sm max-w-xl" style={{ color: 'rgb(var(--muted))' }}>
                                            {result.feedback}
                                        </p>
                                    </div>

                                    {/* Feedback cards */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div
                                            className="p-6 rounded-2xl"
                                            style={{ background: 'rgba(22,163,74,0.06)', border: '1px solid rgba(22,163,74,0.2)' }}
                                        >
                                            <h4 className="flex items-center gap-2 font-semibold mb-4 text-sm text-green-700">
                                                <CheckCircle className="w-4 h-4" /> Strengths
                                            </h4>
                                            <ul className="space-y-2">
                                                {result.strengths.map((item, i) => (
                                                    <li key={i} className="text-sm flex items-start gap-2" style={{ color: 'rgb(var(--text))' }}>
                                                        <span className="mt-2 w-1 h-1 rounded-full bg-green-500 shrink-0" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div
                                            className="p-6 rounded-2xl"
                                            style={{ background: 'rgba(234,88,12,0.06)', border: '1px solid rgba(234,88,12,0.2)' }}
                                        >
                                            <h4 className="flex items-center gap-2 font-semibold mb-4 text-sm text-orange-700">
                                                <AlertCircle className="w-4 h-4" /> Improvements
                                            </h4>
                                            <ul className="space-y-2">
                                                {result.improvements.map((item, i) => (
                                                    <li key={i} className="text-sm flex items-start gap-2" style={{ color: 'rgb(var(--text))' }}>
                                                        <span className="mt-2 w-1 h-1 rounded-full bg-orange-400 shrink-0" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="flex justify-center gap-3 pt-4 border-t" style={{ borderColor: 'rgb(var(--border))' }}>
                                        <button
                                            onClick={() => setResult(null)}
                                            className="px-6 py-2 text-sm font-medium transition-colors duration-150"
                                            style={{ color: 'rgb(var(--muted))' }}
                                            onMouseEnter={e => e.currentTarget.style.color = 'rgb(var(--text))'}
                                            onMouseLeave={e => e.currentTarget.style.color = 'rgb(var(--muted))'}
                                        >
                                            Try Again
                                        </button>
                                        <button
                                            onClick={onClose}
                                            className="px-6 py-2 text-sm font-bold text-white rounded-lg transition-all duration-150"
                                            style={{ background: 'rgb(var(--brand))' }}
                                            onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.1)'}
                                            onMouseLeave={e => e.currentTarget.style.filter = 'none'}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
