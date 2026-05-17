import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileText, CheckCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function ResumeModal({ isOpen, onClose }) {
    const [step, setStep] = useState('upload'); // upload, scanning, result
    const [progress, setProgress] = useState(0);
    const { t } = useLanguage();

    useEffect(() => {
        if (isOpen) {
            setStep('upload');
            setProgress(0);
        }
    }, [isOpen]);

    const handleUpload = () => {
        setStep('scanning');
        let p = 0;
        const interval = setInterval(() => {
            p += 2;
            setProgress(p);
            if (p >= 100) {
                clearInterval(interval);
                setTimeout(() => setStep('result'), 500);
            }
        }, 50);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50"
                    />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-2xl bg-white border border-gray-200 rounded-3xl shadow-2xl pointer-events-auto overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="relative p-8 flex-1 overflow-y-auto">
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <h2 className="text-2xl font-black text-gray-900 mb-6">{t('resume.title')}</h2>

                                {step === 'upload' && (
                                    <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-2xl hover:border-green-500 hover:bg-green-50/10 transition-colors cursor-pointer" onClick={handleUpload}>
                                        <div className="p-4 bg-green-50 rounded-full mb-4">
                                            <Upload className="w-8 h-8 text-green-600" />
                                        </div>
                                        <p className="text-lg font-bold text-gray-900 mb-2">{t('resume.upload_title')}</p>
                                        <p className="text-sm text-gray-500">{t('resume.upload_desc')}</p>
                                        <button className="mt-6 bg-gray-900 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-gray-800 transition-colors">
                                            {t('resume.select_file')}
                                        </button>
                                    </div>
                                )}

                                {step === 'scanning' && (
                                    <div className="flex flex-col items-center justify-center h-64">
                                        <Loader2 className="w-12 h-12 text-green-600 animate-spin mb-6" />
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{t('resume.analyzing')}</h3>
                                        <p className="text-gray-500 mb-6">Checking ATS compatibility and keywords...</p>
                                        <div className="w-full max-w-md h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-green-500"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {step === 'result' && (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                            <div className="relative w-24 h-24 flex items-center justify-center">
                                                <svg className="w-full h-full transform -rotate-90">
                                                    <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-200" />
                                                    <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-green-500" strokeDasharray={`${2 * Math.PI * 40}`} strokeDashoffset={`${2 * Math.PI * 40 * (1 - 0.85)}`} />
                                                </svg>
                                                <span className="absolute text-2xl font-bold text-gray-900">85</span>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-1">{t('mcq.great_job')}</h3>
                                                <p className="text-gray-500 text-sm">{t('resume.feedback')}</p>
                                            </div>
                                        </div>

                                        <div className="grid gap-4">
                                            <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl border border-green-100">
                                                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                                                <div>
                                                    <h4 className="font-bold text-green-800 text-sm mb-1">Strong Action Verbs</h4>
                                                    <p className="text-green-600 text-xs">Good use of "Led", "Developed", "Optimized".</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl border border-green-100">
                                                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                                                <div>
                                                    <h4 className="font-bold text-green-800 text-sm mb-1">Clear Formatting</h4>
                                                    <p className="text-green-600 text-xs">Headers and bullet points are easy to parse.</p>
                                                </div>
                                            </div>
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
