import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { ArrowLeft, Bot, Send, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { INTERVIEW_PROMPTS } from '../data/professions';
import { saveAssessmentResult } from '../services/assessmentResultService';
import Button from '../components/ui/Button';
import AppShell from '../components/AppShell';

export default function InterviewPage({ profession }) {
    const { t } = useLanguage();
    const { user } = useAuth();
    const navigate = useNavigate();
    const messagesEnd = useRef(null);
    const inputRef = useRef(null);

    const prompts = INTERVIEW_PROMPTS[profession] || INTERVIEW_PROMPTS['software-dev'];
    const [messages, setMessages] = useState([
        { role: 'ai', text: prompts.initialMessage },
    ]);
    const [input, setInput] = useState('');
    const [questionIndex, setQuestionIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSend = () => {
        const trimmed = input.trim();
        if (!trimmed || isTyping || isComplete) return;

        setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
        setInput('');
        setIsTyping(true);

        setTimeout(() => {
            const nextIndex = questionIndex;
            if (nextIndex < prompts.questions.length) {
                const aiMsg = {
                    role: 'ai',
                    text: `Thank you for sharing that. ${nextIndex < prompts.questions.length - 1 ? 'Here is the next question:' : 'That was the last question.'}\n\n${prompts.questions[nextIndex]}`,
                };
                setMessages((prev) => [...prev, aiMsg]);
                setQuestionIndex((prev) => prev + 1);
            }

            if (nextIndex >= prompts.questions.length - 1) {
                setTimeout(() => {
                    if (user?.id) {
                        saveAssessmentResult(user.id, 'interview', {
                            displayValue: 'Done',
                            status: 'stable',
                            summary: 'Practice interview completed. Formal scoring is not available yet.',
                            insights: ['Practice session completed. Return later for richer interview scoring.'],
                            professionSlug: profession || null,
                            detail: {
                                questionCount: prompts.questions.length,
                            },
                        });
                    }
                    setMessages((prev) => [...prev, {
                        role: 'ai',
                        text: 'Thank you for completing this practice interview. Your completion is saved on the dashboard, and you can continue with another assessment whenever you are ready.',
                    }]);
                    setIsComplete(true);
                }, 1500);
            }

            setIsTyping(false);
        }, 1000 + Math.random() * 1000);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
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
                {t('chat.back')}
            </button>

            <Motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6">
                <section className="section-shell px-6 py-7 sm:px-8 sm:py-9">
                    <p className="page-kicker">AI interview</p>
                    <h1 className="page-title">{t('chat.title')}</h1>
                    <p className="page-subtitle mt-4">
                        A chat layout that feels more like a premium rehearsal space than a generic bot widget.
                    </p>
                </section>

                <section className="section-shell overflow-hidden">
                    <div className="border-b px-6 py-5 sm:px-8" style={{ borderColor: 'rgb(var(--border))' }}>
                        <p className="page-kicker mb-2">Live practice</p>
                        <p className="text-sm" style={{ color: 'rgb(var(--muted))' }}>{t('chat.hint')}</p>
                    </div>

                    <div className="flex h-[68vh] flex-col">
                        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
                            <div className="grid gap-4">
                                {messages.map((message, index) => (
                                    <Motion.div
                                        key={`${message.role}-${index}`}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
                                    >
                                        {message.role === 'ai' && (
                                            <span className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: 'rgb(var(--brand-soft))', color: 'rgb(var(--brand))' }}>
                                                <Bot size={17} />
                                            </span>
                                        )}

                                        <div
                                            className="max-w-[80%] rounded-[24px] px-4 py-3 text-sm leading-7 shadow-card"
                                            style={message.role === 'ai'
                                                ? { background: 'rgb(var(--surface2))', color: 'rgb(var(--text))' }
                                                : { background: 'linear-gradient(135deg, rgb(var(--brand)) 0%, rgb(var(--accent)) 100%)', color: 'rgb(var(--text-inverse))' }}
                                        >
                                            {message.text}
                                        </div>

                                        {message.role === 'user' && (
                                            <span className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: 'rgb(var(--surface2))', color: 'rgb(var(--text))' }}>
                                                <User size={17} />
                                            </span>
                                        )}
                                    </Motion.div>
                                ))}

                                {isTyping && (
                                    <div className="flex items-start gap-3">
                                        <span className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: 'rgb(var(--brand-soft))', color: 'rgb(var(--brand))' }}>
                                            <Bot size={17} />
                                        </span>
                                        <div className="rounded-[24px] px-4 py-3" style={{ background: 'rgb(var(--surface2))' }}>
                                            <div className="flex gap-1.5">
                                                <div className="h-2 w-2 animate-bounce rounded-full" style={{ background: 'rgb(var(--subtle))', animationDelay: '0ms' }} />
                                                <div className="h-2 w-2 animate-bounce rounded-full" style={{ background: 'rgb(var(--subtle))', animationDelay: '150ms' }} />
                                                <div className="h-2 w-2 animate-bounce rounded-full" style={{ background: 'rgb(var(--subtle))', animationDelay: '300ms' }} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEnd} />
                            </div>
                        </div>

                        <div className="border-t px-6 py-5 sm:px-8" style={{ borderColor: 'rgb(var(--border))' }}>
                            {isComplete ? (
                                <div className="flex justify-center">
                                    <Button variant="brand" size="lg" rounded="full" onClick={() => navigate('/dashboard')}>
                                        Return to dashboard
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex gap-3">
                                    <input
                                        ref={inputRef}
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder={t('chat.hint')}
                                        disabled={isTyping}
                                        className="flex-1 rounded-[var(--radius)] border border-border bg-surface/90 px-4 py-3 text-sm text-text shadow-card transition-all duration-[220ms] placeholder:text-subtle focus:border-border-strong focus:outline-none focus:ring-2 focus:ring-brand/15 disabled:opacity-50"
                                    />
                                    <Button
                                        variant="brand"
                                        size="lg"
                                        rounded="full"
                                        onClick={handleSend}
                                        disabled={!input.trim() || isTyping}
                                    >
                                        <Send size={16} />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </Motion.div>
        </AppShell>
    );
}

