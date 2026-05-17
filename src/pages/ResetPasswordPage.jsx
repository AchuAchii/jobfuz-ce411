import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Eye, EyeOff, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../services/auth';
import AuthShell from '../components/AuthShell';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function ResetPasswordPage() {
    const navigate = useNavigate();
    const { user, loading } = useAuth();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const validate = () => {
        if (!password) return 'Please enter a new password.';
        if (password.length < 6) return 'Password must be at least 6 characters.';
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

        setSubmitting(true);
        setError('');
        try {
            await auth.updatePassword(password);
            setSuccess(true);
        } catch (err) {
            setError(err.message || 'Failed to update password. Please request a new reset link.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <AuthShell
                eyebrow="Password recovery"
                title="Verifying your recovery link."
                subtitle="We are checking the reset session so you can safely create a new password."
                asideTitle="Security should still feel smooth."
                asideBody="Even account recovery can stay polished and calm when the interface makes every state easy to understand."
            >
                <div className="flex flex-col items-center justify-center gap-4 py-10">
                    <span className="h-10 w-10 rounded-full border-4 animate-spin" style={{ borderColor: 'rgb(var(--surface3))', borderTopColor: 'rgb(var(--brand))' }} />
                    <p className="text-sm" style={{ color: 'rgb(var(--muted))' }}>Verifying your recovery link...</p>
                </div>
            </AuthShell>
        );
    }

    if (success) {
        return (
            <AuthShell
                eyebrow="Password updated"
                title="Your account is ready again."
                subtitle="The new password has been saved successfully. You can return to your dashboard now."
                asideTitle="A clean recovery flow matters."
                asideBody="Moments like password reset should reinforce trust, not create anxiety. The experience stays direct and reassuring."
            >
                <div className="flex flex-col items-center gap-5 text-center">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full" style={{ background: 'rgb(var(--success-soft))', color: 'rgb(var(--success))' }}>
                        <CheckCircle size={28} />
                    </span>
                    <Button
                        variant="brand"
                        size="lg"
                        rounded="full"
                        className="w-full justify-center"
                        onClick={() => navigate('/dashboard', { replace: true })}
                    >
                        Go to dashboard
                    </Button>
                </div>
            </AuthShell>
        );
    }

    if (!user) {
        return (
            <AuthShell
                eyebrow="Link expired"
                title="This reset link is no longer valid."
                subtitle="Please request a fresh recovery email from the login page and try again."
                asideTitle="Clear fallback states build confidence too."
                asideBody="When something expires or fails, the interface should explain the next step without making users guess."
            >
                <Button
                    variant="secondary"
                    size="lg"
                    rounded="full"
                    className="w-full justify-center"
                    onClick={() => navigate('/login', { replace: true })}
                >
                    Back to login
                </Button>
            </AuthShell>
        );
    }

    return (
        <AuthShell
            eyebrow="New password"
            title="Choose a password that gets you back in smoothly."
            subtitle="Set a new password to finish the recovery flow and return to your assessment workspace."
            asideTitle="Recovery should feel secure, not heavy."
            asideBody="A polished reset flow keeps the same calm product language as the rest of the experience."
        >
            {error && (
                <div role="alert" aria-live="polite" className="danger-panel mb-5 rounded-[20px] px-4 py-3 text-sm leading-7">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
                <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: 'rgb(var(--subtle))' }}>
                        New password
                    </label>
                    <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Minimum 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                        startIcon={<Lock size={15} />}
                        endIcon={showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        onEndIconClick={() => setShowPassword((value) => !value)}
                    />
                </div>

                <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: 'rgb(var(--subtle))' }}>
                        Confirm password
                    </label>
                    <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Repeat your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                        startIcon={<Lock size={15} />}
                        endIcon={showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        onEndIconClick={() => setShowConfirmPassword((value) => !value)}
                    />
                </div>

                <Button
                    type="submit"
                    variant="brand"
                    size="lg"
                    rounded="full"
                    className="mt-2 w-full justify-center"
                    disabled={submitting}
                >
                    {submitting ? 'Updating password...' : 'Save new password'}
                </Button>
            </form>

            <p className="mt-6 text-center text-sm leading-7" style={{ color: 'rgb(var(--muted))' }}>
                Need a fresh link?{' '}
                <Link to="/login" className="font-semibold" style={{ color: 'rgb(var(--brand))' }}>
                    Request it from login
                </Link>
            </p>
        </AuthShell>
    );
}
