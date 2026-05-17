import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Upload, Download, Trash2 } from 'lucide-react';

const overlayStyle = { background: 'rgba(11,27,58,0.45)', backdropFilter: 'blur(8px)' };
const modalStyle = {
    background: 'rgb(var(--surface))',
    border: '1px solid rgb(var(--border))',
    boxShadow: 'var(--shadow-panel)',
};

export default function MyDocsModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    const docs = [
        { id: 1, name: 'Senior_Frontend_Resume.pdf', date: '2 hours ago', type: 'resume' },
        { id: 2, name: 'Google_Cover_Letter.pdf', date: '1 day ago', type: 'cover_letter' },
        { id: 3, name: 'Portfolio_2024.pdf', date: '3 days ago', type: 'portfolio' },
    ];

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
                    className="relative w-full max-w-2xl rounded-3xl overflow-hidden"
                    style={modalStyle}
                >
                    <div className="p-8">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-3xl font-black" style={{ color: 'rgb(var(--text))' }}>
                                    My Documents
                                </h2>
                                <p className="mt-1 text-sm" style={{ color: 'rgb(var(--muted))' }}>
                                    Manage your resumes and cover letters
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

                        {/* Doc list */}
                        <div className="space-y-3">
                            {docs.map((doc) => (
                                <div
                                    key={doc.id}
                                    className="group flex items-center justify-between p-4 rounded-2xl border transition-all duration-150"
                                    style={{ borderColor: 'rgb(var(--border))', background: 'rgb(var(--bg))' }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.borderColor = 'rgb(var(--brand))';
                                        e.currentTarget.style.boxShadow = 'var(--shadow-card)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.borderColor = 'rgb(var(--border))';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-xl transition-colors duration-150" style={{ background: 'rgb(var(--surface2))' }}>
                                            <FileText className="w-6 h-6" style={{ color: 'rgb(var(--brand))' }} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm" style={{ color: 'rgb(var(--text))' }}>{doc.name}</h3>
                                            <p className="text-xs mt-0.5" style={{ color: 'rgb(var(--muted))' }}>{doc.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            className="p-2 rounded-lg transition-colors duration-150"
                                            style={{ color: 'rgb(var(--muted))' }}
                                            onMouseEnter={e => { e.currentTarget.style.background = 'rgb(var(--surface2))'; e.currentTarget.style.color = 'rgb(var(--brand))'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgb(var(--muted))'; }}
                                        >
                                            <Download className="w-5 h-5" />
                                        </button>
                                        <button
                                            className="p-2 rounded-lg transition-colors duration-150"
                                            style={{ color: 'rgb(var(--muted))' }}
                                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#ef4444'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgb(var(--muted))'; }}
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* Upload */}
                            <button
                                className="w-full py-4 border-2 border-dashed rounded-2xl text-sm font-medium flex items-center justify-center gap-2 transition-all duration-150 mt-6"
                                style={{ borderColor: 'rgb(var(--border))', color: 'rgb(var(--muted))' }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgb(var(--brand))'; e.currentTarget.style.color = 'rgb(var(--brand))'; e.currentTarget.style.background = 'rgb(var(--surface2))'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgb(var(--border))'; e.currentTarget.style.color = 'rgb(var(--muted))'; e.currentTarget.style.background = 'transparent'; }}
                            >
                                <Upload className="w-5 h-5" />
                                Upload New Document
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
