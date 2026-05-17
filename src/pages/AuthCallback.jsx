import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import AuthShell from '../components/AuthShell';

export default function AuthCallback({ onLogin }) {
    const navigate = useNavigate();

    useEffect(() => {
        if (!supabase) {
            navigate('/login', { replace: true });
            return;
        }

        let cancelled = false;

        (async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (cancelled) return;
                if (session?.user) {
                    onLogin(session.user, '/dashboard');
                } else {
                    navigate('/login', { replace: true });
                }
            } catch {
                if (!cancelled) navigate('/login', { replace: true });
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [navigate, onLogin]);

    return (
        <AuthShell
            eyebrow="Authentication"
            title="Signing you into your workspace."
            subtitle="We are finishing the secure handoff and preparing your dashboard."
            asideTitle="Transitions should feel smooth too."
            asideBody="Even background auth states can stay consistent with the product's calm, credible visual language."
        >
            <div className="flex flex-col items-center justify-center gap-4 py-10">
                <span className="h-10 w-10 rounded-full border-4 animate-spin" style={{ borderColor: 'rgb(var(--surface3))', borderTopColor: 'rgb(var(--brand))' }} />
                <p className="text-sm" style={{ color: 'rgb(var(--muted))' }}>Signing you in...</p>
            </div>
        </AuthShell>
    );
}
