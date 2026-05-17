import { supabase } from '../lib/supabaseClient';

function normalizeContactError(error) {
    const message = error?.message || '';

    if (!supabase) {
        return new Error('Contact form is not configured yet.');
    }

    if (message.includes('Failed to fetch') || message.includes('fetch') || message.includes('Load failed')) {
        return new Error('Unable to reach the contact server right now. Please try again in a moment.');
    }

    if (message.includes('relation') && message.includes('contact_messages')) {
        return new Error('Contact form database is not ready yet. Please run the latest Supabase migration.');
    }

    return error;
}

export async function submitContactMessage({ name, email, message }) {
    try {
        if (!supabase) throw new Error('Contact form is not configured yet.');

        const payload = {
            name: name.trim(),
            email: email.trim(),
            message: message.trim(),
            source: 'website',
        };

        const { error } = await supabase
            .from('contact_messages')
            .insert(payload);

        if (error) throw error;
    } catch (error) {
        throw normalizeContactError(error);
    }
}
