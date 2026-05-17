
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { INTERVIEW_PROMPTS } from '../data/professions';

export default function AIInterviewModal({ isOpen, onClose, profession }) {
    const { t } = useLanguage();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [questionIndex, setQuestionIndex] = useState(0);
    const messagesEndRef = useRef(null);

    const interviewContent = (profession && INTERVIEW_PROMPTS[profession])
        ? INTERVIEW_PROMPTS[profession]
        : {
            initialMessage: t('chat.intro'),
            questions: [
                "Can you tell me more about your background?",
                "What are your key strengths?",
                "Where do you see yourself in 5 years?",
                "Do you have any questions for me?"
            ]
        };

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{ id: 1, sender: 'ai', text: interviewContent.initialMessage }]);
            setQuestionIndex(0);
        }
    }, [isOpen, profession]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (!isOpen) return null;

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), sender: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        setTimeout(() => {
            const nextResponse = questionIndex < interviewContent.questions.length
                ? interviewContent.questions[questionIndex]
                : "Thank you for sharing all that. I have gathered enough information for now. Excellent work!";

            setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: nextResponse }]);
            setQuestionIndex(prev => prev + 1);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ background: 'rgba(11,27,58,0.45)', backdropFilter: 'blur(8px)' }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 8 }}
                        transition={{ duration: 0.18 }}
                        className="w-full max-w-2xl h-[600px] flex flex-col overflow-hidden rounded-3xl"
                        style={{
                            background: 'rgb(var(--surface))',
                            border: '1px solid rgb(var(--border))',
                            boxShadow: 'var(--shadow-panel)',
                        }}
                    >
                        {/* Header */}
                        <div
                            className="flex items-center justify-between p-4 border-b shrink-0"
                            style={{ borderColor: 'rgb(var(--border))' }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg" style={{ background: 'rgb(var(--surface2))' }}>
                                    <Bot className="w-5 h-5" style={{ color: 'rgb(var(--brand))' }} />
                                </div>
                                <div>
                                    <h2 className="text-base font-bold" style={{ color: 'rgb(var(--text))' }}>
                                        {t('chat.title')}
                                    </h2>
                                    <div className="flex items-center gap-1.5 text-xs" style={{ color: '#16a34a' }}>
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        Online
                                    </div>
                                </div>
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

                        {/* Chat Area */}
                        <div data-noscrolllock className="flex-1 overflow-y-auto p-4 space-y-4" style={{ background: 'rgb(var(--bg))' }}>
                            {messages.map(msg => (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={msg.id}
                                    className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                                >
                                    {/* Avatar */}
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                                        style={{
                                            background: msg.sender === 'user' ? 'rgb(var(--text))' : 'rgb(var(--surface2))',
                                            color: msg.sender === 'user' ? '#fff' : 'rgb(var(--brand))',
                                        }}
                                    >
                                        {msg.sender === 'user'
                                            ? <User className="w-4 h-4" />
                                            : <Bot className="w-4 h-4" />}
                                    </div>

                                    {/* Bubble */}
                                    <div
                                        className={`p-3 rounded-2xl max-w-[80%] text-sm ${msg.sender === 'user' ? 'rounded-tr-none' : 'rounded-tl-none'}`}
                                        style={msg.sender === 'user'
                                            ? { background: 'rgb(var(--text))', color: '#fff' }
                                            : {
                                                background: 'rgb(var(--surface))',
                                                border: '1px solid rgb(var(--border))',
                                                color: 'rgb(var(--text))',
                                            }
                                        }
                                    >
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                            {isTyping && (
                                <div className="flex items-center gap-2 p-3 text-xs" style={{ color: 'rgb(var(--muted))' }}>
                                    <Bot className="w-3 h-3" /> AI is typing…
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t shrink-0" style={{ borderColor: 'rgb(var(--border))', background: 'rgb(var(--surface))' }}>
                            <form onSubmit={handleSend} className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={t('chat.hint')}
                                    className="w-full pl-4 pr-12 py-3 text-sm rounded-xl transition-colors duration-150"
                                    style={{
                                        background: 'rgb(var(--bg))',
                                        border: '1.5px solid rgb(var(--border))',
                                        color: 'rgb(var(--text))',
                                        outline: 'none',
                                    }}
                                    onFocus={e => e.target.style.borderColor = 'rgb(var(--brand))'}
                                    onBlur={e => e.target.style.borderColor = 'rgb(var(--border))'}
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim()}
                                    className="absolute right-2 top-2 p-1.5 rounded-lg text-white transition-all duration-150 disabled:opacity-40"
                                    style={{ background: 'rgb(var(--brand))' }}
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
