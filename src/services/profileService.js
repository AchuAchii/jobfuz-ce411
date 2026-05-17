import { supabase } from '../lib/supabaseClient';

const LEGACY_PROFESSION_KEY = 'user_profession';

export function getProfessionStorageKey(userId) {
    return `jobfuz:user_profession:${userId}`;
}

export function readStoredProfession(userId) {
    if (!userId) return null;

    const scopedKey = getProfessionStorageKey(userId);
    const scopedProfession = localStorage.getItem(scopedKey);
    const legacyProfession = localStorage.getItem(LEGACY_PROFESSION_KEY);

    if (scopedProfession) return scopedProfession;

    if (legacyProfession) {
        localStorage.setItem(scopedKey, legacyProfession);
        localStorage.removeItem(LEGACY_PROFESSION_KEY);
        return legacyProfession;
    }

    return null;
}

export function writeStoredProfession(userId, professionSlug) {
    if (!userId) return;
    localStorage.setItem(getProfessionStorageKey(userId), professionSlug);
}

export async function fetchUserProfession(userId) {
    const cachedProfession = readStoredProfession(userId);
    if (!userId || !supabase) return cachedProfession;

    try {
        const { data, error } = await supabase
            .from('user_profiles')
            .select('profession_slug')
            .eq('user_id', userId)
            .maybeSingle();

        if (error) throw error;

        const remoteProfession = data?.profession_slug || null;
        if (remoteProfession) {
            writeStoredProfession(userId, remoteProfession);
            return remoteProfession;
        }

        if (cachedProfession) {
            await saveUserProfession(userId, cachedProfession);
            return cachedProfession;
        }

        return null;
    } catch (error) {
        console.warn('Could not fetch profession from Supabase, using local cache instead:', error.message);
        return cachedProfession;
    }
}

export async function saveUserProfession(userId, professionSlug) {
    if (!userId || !professionSlug) return;

    writeStoredProfession(userId, professionSlug);

    if (!supabase) return;

    try {
        const { error } = await supabase
            .from('user_profiles')
            .upsert(
                {
                    user_id: userId,
                    profession_slug: professionSlug,
                },
                { onConflict: 'user_id' }
            );

        if (error) throw error;
    } catch (error) {
        console.warn('Could not save profession to Supabase, kept local cache only:', error.message);
    }
}
