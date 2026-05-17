import { supabase } from '../lib/supabaseClient';

function normalizeAuthError(error) {
    const message = error?.message || '';
    if (message.includes('Failed to fetch') || message.includes('fetch') || message.includes('Load failed')) {
        return new Error('Unable to reach the authentication server. Check your Supabase URL, anon key, and network connection.');
    }
    return error;
}

function buildDisplayName(firstName, lastName) {
    return [firstName, lastName].filter(Boolean).join(' ').trim();
}

export const auth = {
    /**
     * Sign up with email + password. Optionally creates a user_profiles row.
     */
    async signUp(email, password, firstName, lastName) {
        try {
            if (!supabase) throw new Error('Supabase not configured');
            const displayName = buildDisplayName(firstName, lastName);
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        first_name: firstName,
                        last_name: lastName,
                        display_name: displayName,
                    },
                },
            });

            if (error) throw error;

            if (data.user) {
                try {
                    const payload = {
                        user_id: data.user.id,
                        first_name: firstName,
                        last_name: lastName,
                        display_name: displayName,
                    };

                    const { error: profileError } = await supabase.from('user_profiles').upsert(payload);
                    if (profileError) throw profileError;
                } catch {
                    try {
                        await supabase.from('user_profiles').upsert({
                            user_id: data.user.id,
                            display_name: displayName,
                        });
                    } catch (legacyError) {
                        console.warn('Could not create user profile (table may not exist):', legacyError.message);
                    }
                }
            }

            return data;
        } catch (error) {
            throw normalizeAuthError(error);
        }
    },

    /**
     * Sign in with email + password.
     */
    async signIn(email, password) {
        try {
            if (!supabase) throw new Error('Supabase not configured');
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            return data;
        } catch (error) {
            throw normalizeAuthError(error);
        }
    },

    /**
     * Sign out.
     */
    async signOut() {
        if (!supabase) return;
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    /**
     * Sign in with Google OAuth.
     */
    async signInWithGoogle() {
        try {
            if (!supabase) throw new Error('Supabase not configured');
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: window.location.origin + '/auth/callback' },
            });
            if (error) throw error;
            return data;
        } catch (error) {
            throw normalizeAuthError(error);
        }
    },

    /**
     * Send password reset email.
     */
    async resetPassword(email) {
        try {
            if (!supabase) throw new Error('Supabase not configured');
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin + '/reset-password',
            });
            if (error) throw error;
        } catch (error) {
            throw normalizeAuthError(error);
        }
    },

    /**
     * Update password after a recovery flow.
     */
    async updatePassword(password) {
        try {
            if (!supabase) throw new Error('Supabase not configured');
            const { data, error } = await supabase.auth.updateUser({ password });
            if (error) throw error;
            return data;
        } catch (error) {
            throw normalizeAuthError(error);
        }
    },

    /**
     * Get current session.
     */
    async getSession() {
        if (!supabase) return null;
        const { data: { session } } = await supabase.auth.getSession();
        return session;
    },

    /**
     * Get current user's profile from user_profiles table.
     */
    async getProfile() {
        if (!supabase) return null;
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return null;

            const { data } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('user_id', session.user.id)
                .single();

            return data;
        } catch (e) {
            console.warn('Could not fetch profile:', e.message);
            return null;
        }
    },
};
