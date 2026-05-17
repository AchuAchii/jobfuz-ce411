import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { auth } from '../services/auth';
import { useAuth } from '../contexts/AuthContext';
import AuthShell from '../components/AuthShell';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function SignupPage({ onLogin }) {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [showConfirmPw, setShowConfirmPw] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [confirmationSent, setConfirmationSent] = useState(false);

    useEffect(() => {
        if (user) {
            navigate('/dashboard', { replace: true });
        }
    }, [user, navigate]);

    if (user) return null;

    const validate = () => {
        if (!firstName.trim()) return 'First name is required.';
        if (!lastName.trim()) return 'Last name is required.';
        if (!email) return 'Email is required.';
        if (!password) return 'Password is required.';
        if (password.length < 6) return 'Password must be at least 6 characters.';
        if (!confirmPassword) return 'Please confirm your password.';
        if (password !== confirmPassword) return 'Passwords do not match.';
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
            const data = await auth.signUp(email, password, firstName.trim(), lastName.trim());
            if (data.user && !data.session) {
                setConfirmationSent(true);
                return;
            }
            onLogin(data.user, '/dashboard');
        } catch (err) {
            setError(err.message || 'Sign up failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (confirmationSent) {
        return (
            <AuthShell
                eyebrow="Account created"
                title="Check your inbox to finish the setup."
                subtitle={`We sent a confirmation link to ${email}. Once you confirm it, you can return and continue to your dashboard.`}
                asideTitle="One more step, then the studio is ready."
                asideBody="Email verification keeps account access secure while preserving the calm, guided experience across the rest of the product."
            >
                <div className="flex flex-col items-center gap-5 text-center">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full" style={{ background: 'rgb(var(--success-soft))', color: 'rgb(var(--success))' }}>
                        <CheckCircle size={28} />
                    </span>
                    <Button variant="secondary" size="lg" rounded="full" className="w-full justify-center" onClick={() => navigate('/login')}>
                        Back to login
                    </Button>
                </div>
            </AuthShell>
        );
    }

    return (
        <AuthShell
            eyebrow="Create account"
            title="Start with a polished setup that feels quick and clear."
            subtitle="Create your account, choose a career path, and move directly into a more structured readiness flow."
            asideTitle="Designed to feel modern, not intimidating."
            asideBody="The signup experience should reassure new graduates that the platform is thoughtful and credible before they even begin the first assessment."
        >
            {error && (
                <div role="alert" aria-live="polite" className="danger-panel mb-5 rounded-[20px] px-4 py-3 text-sm leading-7">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: 'rgb(var(--subtle))' }}>
                            First name
                        </label>
                        <Input
                            type="text"
                            placeholder="First name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            autoComplete="given-name"
                            startIcon={<User size={15} />}
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: 'rgb(var(--subtle))' }}>
                            Last name
                        </label>
                        <Input
                            type="text"
                            placeholder="Last name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            autoComplete="family-name"
                            startIcon={<User size={15} />}
                        />
                    </div>
                </div>

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
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: 'rgb(var(--subtle))' }}>
                        Password
                    </label>
                    <Input
                        type={showPw ? 'text' : 'password'}
                        placeholder="Minimum 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                        startIcon={<Lock size={15} />}
                        endIcon={showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                        onEndIconClick={() => setShowPw((value) => !value)}
                    />
                </div>

                <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: 'rgb(var(--subtle))' }}>
                        Confirm password
                    </label>
                    <Input
                        type={showConfirmPw ? 'text' : 'password'}
                        placeholder="Repeat your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                        startIcon={<Lock size={15} />}
                        endIcon={showConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
                        onEndIconClick={() => setShowConfirmPw((value) => !value)}
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
                    {loading ? 'Creating account...' : 'Create account'}
                </Button>
            </form>

            <p className="mt-6 text-center text-sm leading-7" style={{ color: 'rgb(var(--muted))' }}>
                Already have an account?{' '}
                <Link to="/login" className="font-semibold" style={{ color: 'rgb(var(--brand))' }}>
                    Log in
                </Link>
            </p>
        </AuthShell>
    );
}
