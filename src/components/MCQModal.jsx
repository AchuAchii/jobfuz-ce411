import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const QUESTIONS = [
    {
        question: "What does HTML stand for?",
        options: ["Hyper Text Preprocessor", "Hyper Text Markup Language", "Hyper Text Multiple Language", "Hyper Tool Multi Language"],
        answer: 1,
    },
    {
        question: "Which CSS property controls the text size?",
        options: ["font-style", "text-style", "font-size", "text-size"],
        answer: 2,
    },
    {
        question: "Inside which HTML element do we put the JavaScript?",
        options: ["<js>", "<scripting>", "<script>", "<javascript>"],
        answer: 2,
    },
];

export default function MCQModal({ isOpen, onClose }) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const { t } = useLanguage();

    const handleAnswer = (index) => {
        if (index === QUESTIONS[currentQuestion].answer) setScore(s => s + 1);
        if (currentQuestion < QUESTIONS.length - 1) setCurrentQuestion(q => q + 1);
        else setShowResult(true);
    };

    const resetQuiz = () => { setCurrentQuestion(0); setScore(0); setShowResult(false); };

    const overlayStyle = { background: 'rgba(11,27,58,0.45)', backdropFilter: 'blur(8px)' };
    const modalStyle = {
        background: 'rgb(var(--surface))',
        border: '1px solid rgb(var(--border))',
        boxShadow: 'var(--shadow-panel)',
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50"
                        style={overlayStyle}
                    />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96, y: 8 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: 8 }}
                            transition={{ duration: 0.18 }}
                            className="relative w-full max-w-xl rounded-3xl overflow-hidden pointer-events-auto"
                            style={modalStyle}
                        >
                            <div className="p-8">
                                {/* Close */}
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 rounded-full transition-colors duration-150"
                                    style={{ color: 'rgb(var(--muted))' }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgb(var(--surface2))'; e.currentTarget.style.color = 'rgb(var(--text))'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgb(var(--muted))'; }}
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                {!showResult ? (
                                    <>
                                        <h2 className="text-xl font-bold mb-3" style={{ color: 'rgb(var(--text))' }}>
                                            {t('mcq.title')}
                                        </h2>

                                        {/* Progress */}
                                        <div className="flex items-center gap-2 mb-6">
                                            <span className="text-sm font-medium" style={{ color: 'rgb(var(--brand))' }}>
                                                {t('mcq.q_of', { current: currentQuestion + 1, total: QUESTIONS.length })}
                                            </span>
                                            <div className="flex-1 h-1 rounded-full" style={{ background: 'rgb(var(--surface2))' }}>
                                                <div
                                                    className="h-full rounded-full transition-all duration-300"
                                                    style={{
                                                        width: `${((currentQuestion + 1) / QUESTIONS.length) * 100}%`,
                                                        background: 'rgb(var(--brand))',
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <h3 className="text-2xl font-black mb-8" style={{ color: 'rgb(var(--text))' }}>
                                            {QUESTIONS[currentQuestion].question}
                                        </h3>

                                        <div className="space-y-3">
                                            {QUESTIONS[currentQuestion].options.map((option, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handleAnswer(index)}
                                                    className="w-full text-left p-4 rounded-xl border text-sm font-medium transition-all duration-150"
                                                    style={{
                                                        borderColor: 'rgb(var(--border))',
                                                        color: 'rgb(var(--text))',
                                                        background: 'rgb(var(--bg))',
                                                    }}
                                                    onMouseEnter={e => {
                                                        e.currentTarget.style.borderColor = 'rgb(var(--brand))';
                                                        e.currentTarget.style.background = 'rgb(var(--surface2))';
                                                    }}
                                                    onMouseLeave={e => {
                                                        e.currentTarget.style.borderColor = 'rgb(var(--border))';
                                                        e.currentTarget.style.background = 'rgb(var(--bg))';
                                                    }}
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-8">
                                        <div
                                            className="mb-6 inline-flex p-4 rounded-full"
                                            style={{ background: 'rgb(var(--surface2))' }}
                                        >
                                            {score >= 2
                                                ? <CheckCircle className="w-12 h-12 text-green-500" />
                                                : <AlertCircle className="w-12 h-12 text-yellow-500" />
                                            }
                                        </div>
                                        <h2 className="text-3xl font-black mb-2" style={{ color: 'rgb(var(--text))' }}>
                                            {t('mcq.result')}
                                        </h2>
                                        <p className="mb-8 text-sm" style={{ color: 'rgb(var(--muted))' }}>
                                            {t('mcq.score')}:{' '}
                                            <span className="font-bold" style={{ color: 'rgb(var(--text))' }}>{score}</span>
                                            {' '}/ <span className="font-bold" style={{ color: 'rgb(var(--text))' }}>{QUESTIONS.length}</span>
                                        </p>
                                        <div className="flex gap-3 justify-center">
                                            <button
                                                onClick={resetQuiz}
                                                className="px-6 py-2 rounded-full text-sm font-semibold border transition-colors duration-150"
                                                style={{
                                                    borderColor: 'rgb(var(--border))',
                                                    color: 'rgb(var(--muted))',
                                                    background: 'transparent',
                                                }}
                                                onMouseEnter={e => { e.currentTarget.style.background = 'rgb(var(--surface2))'; e.currentTarget.style.color = 'rgb(var(--text))'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgb(var(--muted))'; }}
                                            >
                                                {t('resume.try_again')}
                                            </button>
                                            <button
                                                onClick={onClose}
                                                className="px-6 py-2 rounded-full text-sm font-bold text-white transition-all duration-150"
                                                style={{ background: 'rgb(var(--brand))' }}
                                                onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.1)'}
                                                onMouseLeave={e => e.currentTarget.style.filter = 'none'}
                                            >
                                                {t('mcq.close')}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
