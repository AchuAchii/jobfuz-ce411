import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { auth } from '../services/auth';
import { useAuth } from '../contexts/AuthContext';
import AuthShell from '../components/AuthShell';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function LoginPage({ onLogin }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [forgotStatus, setForgotStatus] = useState(null);
    const [forgotMsg, setForgotMsg] = useState('');

    useEffect(() => {
        if (user) {
            navigate('/dashboard', { replace: true });
        }
    }, [user, navigate]);

    if (user) return null;

    const from = location.state?.from;
    const redirectTo = from ? (from.pathname || '/dashboard') + (from.search || '') + (from.hash || '') : '/dashboard';

    const validate = () => {
        if (!email) return 'Email is required.';
        if (!password) return 'Password is required.';
        if (password.length < 6) return 'Password must be at least 6 characters.';
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setError('');
        setLoading(true);
        try {
            const data = await auth.signIn(email, password);
            onLogin(data.user, redirectTo);
        } catch (err) {
            setError(err.message || 'Authentication failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleForgot = async () => {
        if (!email.trim()) {
            setForgotMsg('Please enter your email address first.');
            setForgotStatus('error');
            return;
        }

        try {
            await auth.resetPassword(email.trim());
            setForgotMsg('Password reset link sent. Open the email to set a new password.');
            setForgotStatus('success');
        } catch (err) {
            setForgotMsg(err.message || 'Failed to send reset email.');
            setForgotStatus('error');
        }
    };

    return (
        <AuthShell
            eyebrow="Login"
            title="Sign in to continue your readiness journey."
            subtitle="Return to your dashboard, review your latest assessment signals, and keep improving where it matters most."
            asideTitle="A calmer way to prepare for your first job."
            asideBody="Recent graduates often need clarity more than hype. This experience stays polished, structured, and easy to trust from the first click."
        >
            {(error || forgotStatus) && (
                <div
                    role="status"
                    aria-live="polite"
                    className={`mb-5 rounded-[20px] px-4 py-3 text-sm leading-7 ${forgotStatus === 'success' ? 'success-panel' : 'danger-panel'}`}
                    style={!forgotStatus && error ? undefined : undefined}
                >
                    {error || forgotMsg}
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
                <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: 'rgb(var(--subtle))' }}>
                        Email
                    </label>
                    <Input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        startIcon={<Mail size={15} />}
                    />
                </div>

                <div>
                    <div className="mb-2 flex items-center justify-between">
                        <label className="block text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: 'rgb(var(--subtle))' }}>
                            Password
                        </label>
                        <button
                            type="button"
                            onClick={handleForgot}
                            disabled={loading}
                            className="text-xs font-semibold uppercase tracking-[0.14em] transition-opacity duration-200 disabled:opacity-50"
                            style={{ color: 'rgb(var(--brand))' }}
                        >
                            Forgot password
                        </button>
                    </div>
                    <Input
                        type={showPw ? 'text' : 'password'}
                        placeholder="At least 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        startIcon={<Lock size={15} />}
                        endIcon={showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                        onEndIconClick={() => setShowPw((current) => !current)}
                    />
                </div>

                <Button
                    type="submit"
                    variant="brand"
                    size="lg"
                    rounded="full"
                    className="mt-2 w-full justify-center"
                    disabled={loading}
                >
                    {loading ? 'Signing in...' : 'Log in now'}
                </Button>
            </form>

            <p className="mt-6 text-center text-sm leading-7" style={{ color: 'rgb(var(--muted))' }}>
                Do not have an account yet?{' '}
                <Link to="/signup" className="font-semibold" style={{ color: 'rgb(var(--brand))' }}>
                    Create one
                </Link>
            </p>
        </AuthShell>
    );
}
