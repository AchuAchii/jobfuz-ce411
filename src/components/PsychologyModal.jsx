
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Brain, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { evaluatePsychology, getPsychologyQuestions } from '../services/psychologyService';
import { PSYCHOLOGY_QUESTIONS } from '../data/professions';

export default function PsychologyModal({ isOpen, onClose, profession }) {
    const { t } = useLanguage();

    // Transform raw profession questions to match service structure
    const professionQuestions = (profession && PSYCHOLOGY_QUESTIONS[profession])
        ? PSYCHOLOGY_QUESTIONS[profession].map((q, idx) => ({
            id: idx + 1,
            question: q.question,
            options: q.options.map((opt, optIdx) => ({
                id: String.fromCharCode(97 + optIdx), // 'a', 'b', 'c', 'd'
                text: opt,
                value: [100, 85, 90, 95][optIdx] || 80 // Arbitrary scoring values
            }))
        }))
        : null;

    const questions = professionQuestions || getPsychologyQuestions();

    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState(new Array(questions.length).fill(null));
    const [result, setResult] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleAnswer = (optionId) => {
        const newAnswers = [...answers];
        newAnswers[currentStep] = optionId;
        setAnswers(newAnswers);
    };

    const handleNext = () => {
        if (currentStep < questions.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleSubmit();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const evaluation = evaluatePsychology(answers);
        setResult(evaluation);

        if (evaluation.passed) {
            // Achievement tracking removed
        }

        setIsSubmitting(false);
    };

    const progress = ((currentStep + 1) / questions.length) * 100;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white border border-gray-200 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-50 rounded-lg">
                                    <Brain className="w-5 h-5 text-purple-600" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">{t('psych.title')}</h2>
                            </div>
                            <button onClick={onClose} className="p-2 transition-colors rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-8">
                            {!result ? (
                                <div className="max-w-xl mx-auto">
                                    {/* Progress Bar */}
                                    <div className="mb-8">
                                        <div className="flex justify-between text-xs text-gray-500 mb-2">
                                            <span>Question {currentStep + 1} of {questions.length}</span>
                                            <span>{Math.round(progress)}%</span>
                                        </div>
                                        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-purple-600 transition-all duration-300"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Question */}
                                    <div className="mb-8 animate-in fade-in slide-in-from-right-4 duration-300" key={currentStep}>
                                        <h3 className="text-2xl font-black text-gray-900 mb-6">
                                            {questions[currentStep].question}
                                        </h3>
                                        <div className="space-y-3">
                                            {questions[currentStep].options.map((option) => (
                                                <button
                                                    key={option.id}
                                                    onClick={() => handleAnswer(option.id)}
                                                    className={`w-full p-4 text-left rounded-xl border transition-all duration-200 ${answers[currentStep] === option.id
                                                        ? 'bg-purple-50 border-purple-200 text-purple-900'
                                                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${answers[currentStep] === option.id
                                                            ? 'border-purple-600 bg-purple-600'
                                                            : 'border-gray-300'
                                                            }`}>
                                                            {answers[currentStep] === option.id && <div className="w-2 h-2 bg-white rounded-full" />}
                                                        </div>
                                                        <span className={answers[currentStep] === option.id ? 'font-medium' : ''}>{option.text}</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Navigation */}
                                    <div className="flex justify-between pt-6 border-t border-gray-100">
                                        <button
                                            onClick={handlePrev}
                                            disabled={currentStep === 0}
                                            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            <ArrowLeft className="w-4 h-4" /> Previous
                                        </button>
                                        <button
                                            onClick={handleNext}
                                            disabled={!answers[currentStep] || isSubmitting}
                                            className="px-6 py-2 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            {currentStep === questions.length - 1 ? (
                                                isSubmitting ? 'Submitting...' : t('psych.submit')
                                            ) : (
                                                <>Next <ArrowRight className="w-4 h-4" /></>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center animate-in zoom-in-95 duration-300">
                                    <div className="mb-6 inline-flex p-4 rounded-full bg-purple-50 text-purple-600 ring-1 ring-purple-100">
                                        <Brain className="w-12 h-12" />
                                    </div>
                                    <h3 className="text-3xl font-black text-gray-900 mb-2">Assessment Complete</h3>
                                    <p className="text-gray-500 mb-8 max-w-md mx-auto">{result.feedback}</p>

                                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4 max-w-2xl mx-auto mb-8">
                                        {result.results.map((item, idx) => (
                                            <div key={idx} className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-left">
                                                <div className="text-sm text-gray-500 mb-1">Q{idx + 1}: {item.question}</div>
                                                <div className="font-medium text-gray-900 mb-2">Your Answer: {item.userAnswer}</div>
                                                <div className="text-sm text-purple-700 bg-purple-50 p-3 rounded-lg">
                                                    💡 {item.feedback}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={onClose}
                                        className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800"
                                    >
                                        Return to Dashboard
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
