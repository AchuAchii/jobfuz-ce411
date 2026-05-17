import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, CheckCircle } from 'lucide-react';
import { auth } from '../services/auth';
import { useLanguage } from '../contexts/LanguageContext';
import Button from './ui/Button';
import Input from './ui/Input';

// ── Jobfuz LogoMark ───────────────────────────────────────────
function LogoMark() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="none" className="w-9 h-9 flex-shrink-0">
            <rect width="40" height="40" rx="10" fill="#0B1B3A" />
            <path d="M10 12h8v14c0 3-2 5-5 5s-5-2-5-5v-2h4v1.5c0 .8.5 1.5 1 1.5s1-.7 1-1.5V16h-4V12z" fill="#2F6BFF" />
            <path d="M22 12h10v4h-6v3h5v3h-5v6h-4V12z" fill="#64B0FF" />
        </svg>
    );
}

export default function LoginModal({ isOpen, onClose, onLogin }) {
    const { t } = useLanguage();
    const [mode, setMode] = useState('signin');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [confirmationSent, setConfirmationSent] = useState(false);

    const resetForm = () => { setName(''); setEmail(''); setPassword(''); setError(''); setLoading(false); setConfirmationSent(false); };
    const handleClose = () => { resetForm(); setMode('signin'); onClose(); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!email || !password) { setError('Email and password are required.'); return; }
        if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
        if (mode === 'signup' && !name.trim()) { setError('Name is required for sign up.'); return; }

        setLoading(true);
        try {
            if (mode === 'signup') {
                const data = await auth.signUp(email, password, name.trim());
                if (data.user && !data.session) { setConfirmationSent(true); setLoading(false); return; }
                onLogin(data.user);
            } else {
                const data = await auth.signIn(email, password);
                onLogin(data.user);
            }
            handleClose();
        } catch (err) {
            setError(err.message || 'Authentication failed.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                style={{ background: 'rgba(11,27,58,0.45)', backdropFilter: 'blur(12px)' }}
                onClick={handleClose}
            >
                <motion.div
                    initial={{ scale: 0.96, opacity: 0, y: 12 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.96, opacity: 0, y: 12 }}
                    transition={{ duration: 0.18 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-md p-8 relative rounded-[var(--radius-lg)] shadow-panel"
                    style={{
                        background: 'rgb(var(--surface))',
                        border: '1px solid rgb(var(--border))',
                    }}
                >
                    {/* Close */}
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 p-1.5 rounded-lg transition-all duration-[150ms] hover:bg-surface2"
                        style={{ color: 'rgb(var(--subtle))' }}
                    >
                        <X size={18} />
                    </button>

                    {/* Brand */}
                    <div className="flex items-center gap-2.5 mb-6">
                        <LogoMark />
                        <span className="text-lg font-black tracking-tight">
                            <span style={{ color: 'rgb(var(--text))' }}>Job</span>
                            <span style={{ color: 'rgb(var(--brand))' }}>fuz</span>
                        </span>
                    </div>

                    {confirmationSent ? (
                        <div className="text-center py-6">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                                style={{ background: 'rgb(var(--surface2))' }}>
                                <CheckCircle size={28} style={{ color: 'rgb(var(--brand))' }} />
                            </div>
                            <h3 className="text-lg font-bold mb-2" style={{ color: 'rgb(var(--text))' }}>Check your email</h3>
                            <p className="text-sm mb-6" style={{ color: 'rgb(var(--muted))' }}>
                                We sent a confirmation link to <strong style={{ color: 'rgb(var(--text))' }}>{email}</strong>
                            </p>
                            <Button variant="secondary" size="md" rounded="lg" onClick={handleClose} className="w-full">
                                Close
                            </Button>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold mb-1" style={{ color: 'rgb(var(--text))' }}>
                                {mode === 'signup' ? t('auth.create_account') : t('auth.welcome_back')}
                            </h2>
                            <p className="text-sm mb-6" style={{ color: 'rgb(var(--muted))' }}>
                                {mode === 'signup' ? t('auth.start_journey') : t('auth.sign_in_access')}
                            </p>

                            {error && (
                                <div className="mb-4 p-3 rounded-[var(--radius)] border border-danger/30 bg-danger/10 text-danger text-sm">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {mode === 'signup' && (
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5"
                                            style={{ color: 'rgb(var(--muted))' }}>{t('auth.name')}</label>
                                        <Input
                                            type="text"
                                            placeholder="Your full name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            startIcon={<User size={14} />}
                                        />
                                    </div>
                                )}
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5"
                                        style={{ color: 'rgb(var(--muted))' }}>{t('auth.email')}</label>
                                    <Input
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        startIcon={<Mail size={14} />}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5"
                                        style={{ color: 'rgb(var(--muted))' }}>{t('auth.password')}</label>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        startIcon={<Lock size={14} />}
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    variant="brand"
                                    size="md"
                                    rounded="lg"
                                    className="w-full mt-2"
                                    disabled={loading}
                                >
                                    {loading
                                        ? 'Please wait…'
                                        : mode === 'signup' ? t('auth.create_account') : t('auth.sign_in')}
                                </Button>
                            </form>

                            <p className="mt-5 text-center text-sm" style={{ color: 'rgb(var(--muted))' }}>
                                {mode === 'signup' ? (
                                    <>{t('auth.have_account')}{' '}
                                        <button onClick={() => { setMode('signin'); setError(''); }}
                                            className="font-semibold transition-colors duration-[150ms]"
                                            style={{ color: 'rgb(var(--brand))' }}>
                                            {t('auth.sign_in')}
                                        </button>
                                    </>
                                ) : (
                                    <>{t('auth.no_account')}{' '}
                                        <button onClick={() => { setMode('signup'); setError(''); }}
                                            className="font-semibold transition-colors duration-[150ms]"
                                            style={{ color: 'rgb(var(--brand))' }}>
                                            {t('auth.sign_up')}
                                        </button>
                                    </>
                                )}
                            </p>
                        </>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
