import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext({ user: null, session: null, loading: true });

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(() => Boolean(supabase));

    useEffect(() => {
        if (!supabase) return;

        let cancelled = false;

        supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
            if (cancelled) return;
            setSession(initialSession);
            setUser(initialSession?.user ?? null);
            setLoading(false);
        }).catch(() => {
            if (cancelled) return;
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, nextSession) => {
                if (cancelled) return;
                setSession(nextSession);
                setUser(nextSession?.user ?? null);
                setLoading(false);
            }
        );

        return () => {
            cancelled = true;
            subscription.unsubscribe();
        };
    }, []);

    const value = { user, session, loading };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
