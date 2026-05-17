import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, PenTool, Brain, MessageSquare } from 'lucide-react';

const overlayStyle = { background: 'rgba(11,27,58,0.45)', backdropFilter: 'blur(8px)' };

// Tool card accent colours mapped to Jobfuz semantic palette (no pink/orange hardcodes)
const TOOLS = [
    {
        icon: CheckCircle,
        title: 'MCQ Test',
        desc: 'Practice technical questions',
        iconBg: 'rgb(var(--surface2))',
        iconColor: 'rgb(var(--brand))',
    },
    {
        icon: PenTool,
        title: 'Essay Writing',
        desc: 'Improve communication skills',
        iconBg: 'rgba(47,107,255,0.12)',
        iconColor: 'rgb(var(--brand))',
    },
    {
        icon: Brain,
        title: 'Psychology',
        desc: 'Behavioral assessment prep',
        iconBg: 'rgba(100,176,255,0.15)',
        iconColor: 'rgb(var(--brand2))',
    },
    {
        icon: MessageSquare,
        title: 'AI Interview',
        desc: 'Mock interview with AI',
        iconBg: 'rgba(22,163,74,0.1)',
        iconColor: '#16a34a',
    },
];

export default function PracticeModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0"
                    style={overlayStyle}
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="relative w-full max-w-4xl rounded-3xl overflow-hidden"
                    style={{
                        background: 'rgb(var(--surface))',
                        border: '1px solid rgb(var(--border))',
                        boxShadow: 'var(--shadow-panel)',
                    }}
                >
                    <div className="p-8">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-3xl font-black" style={{ color: 'rgb(var(--text))' }}>
                                    Practice Hub
                                </h2>
                                <p className="mt-1 text-sm" style={{ color: 'rgb(var(--muted))' }}>
                                    Sharpen your skills with our AI tools
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full transition-colors duration-150"
                                style={{ color: 'rgb(var(--muted))' }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgb(var(--surface2))'; e.currentTarget.style.color = 'rgb(var(--text))'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgb(var(--muted))'; }}
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Tool cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {TOOLS.map((tool, index) => {
                                const Icon = tool.icon;
                                return (
                                    <motion.button
                                        key={index}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex items-start gap-5 p-6 rounded-2xl border text-left transition-all duration-150 group"
                                        style={{
                                            borderColor: 'rgb(var(--border))',
                                            background: 'rgb(var(--bg))',
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.borderColor = 'rgb(var(--brand))';
                                            e.currentTarget.style.boxShadow = 'var(--shadow-lift)';
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.borderColor = 'rgb(var(--border))';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        <div
                                            className="p-4 rounded-xl shrink-0 transition-transform duration-150 group-hover:scale-110"
                                            style={{ background: tool.iconBg }}
                                        >
                                            <Icon className="w-7 h-7" style={{ color: tool.iconColor }} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold mb-1" style={{ color: 'rgb(var(--text))' }}>
                                                {tool.title}
                                            </h3>
                                            <p className="text-sm" style={{ color: 'rgb(var(--muted))' }}>
                                                {tool.desc}
                                            </p>
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
