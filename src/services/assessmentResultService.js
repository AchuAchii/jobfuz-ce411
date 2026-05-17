import { supabase } from '../lib/supabaseClient';

const STORAGE_PREFIX = 'jobfuz:assessment_results:';
const MAX_HISTORY_POINTS = 6;

function getStorageKey(userId) {
    return `${STORAGE_PREFIX}${userId}`;
}

function isFiniteNumber(value) {
    return typeof value === 'number' && Number.isFinite(value);
}

function readStoredResults(userId) {
    if (!userId) return {};

    try {
        const raw = localStorage.getItem(getStorageKey(userId));
        if (!raw) return {};

        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
        return {};
    }
}

function writeStoredResults(userId, results) {
    if (!userId) return;
    localStorage.setItem(getStorageKey(userId), JSON.stringify(results));
}

function mergeLocalRecord(previous = {}, payload = {}) {
    const previousHistory = Array.isArray(previous.scoreHistory)
        ? previous.scoreHistory.filter(isFiniteNumber)
        : [];

    const nextHistory = isFiniteNumber(payload.score)
        ? [...previousHistory, payload.score].slice(-MAX_HISTORY_POINTS)
        : previousHistory;

    return {
        ...previous,
        ...payload,
        completed: payload.completed ?? true,
        updatedAt: payload.updatedAt || new Date().toISOString(),
        scoreHistory: nextHistory,
    };
}

function toDbPayload(userId, stageId, payload) {
    return {
        user_id: userId,
        stage: stageId,
        profession_slug: payload.professionSlug || null,
        score: isFiniteNumber(payload.score) ? payload.score : null,
        status: payload.status || null,
        summary: payload.summary || null,
        display_value: payload.displayValue || null,
        result_json: {
            completed: payload.completed ?? true,
            insights: Array.isArray(payload.insights) ? payload.insights : [],
            detail: payload.detail || null,
        },
    };
}

function normalizeRemoteRows(rows = []) {
    const byStage = {};

    rows.forEach((row) => {
        const stageId = row.stage;
        if (!stageId) return;

        if (!byStage[stageId]) {
            byStage[stageId] = {
                score: isFiniteNumber(row.score) ? row.score : null,
                status: row.status || (isFiniteNumber(row.score) ? 'stable' : 'not-started'),
                summary: row.summary || '',
                displayValue: row.display_value || null,
                completed: row.result_json?.completed ?? true,
                updatedAt: row.created_at,
                insights: Array.isArray(row.result_json?.insights) ? row.result_json.insights.filter(Boolean) : [],
                detail: row.result_json?.detail || null,
                professionSlug: row.profession_slug || null,
                scoreHistory: [],
            };
        }

        if (isFiniteNumber(row.score)) {
            byStage[stageId].scoreHistory.unshift(row.score);
            byStage[stageId].scoreHistory = byStage[stageId].scoreHistory.slice(-MAX_HISTORY_POINTS);
        }
    });

    return byStage;
}

function cacheRemoteResults(userId, results) {
    if (!userId) return results;
    writeStoredResults(userId, results);
    return results;
}

export function loadCachedAssessmentResults(userId) {
    return readStoredResults(userId);
}

export async function fetchAssessmentResults(userId) {
    if (!userId || !supabase) return readStoredResults(userId);

    try {
        const { data, error } = await supabase
            .from('assessment_results')
            .select('stage, profession_slug, score, status, summary, display_value, result_json, created_at')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return cacheRemoteResults(userId, normalizeRemoteRows(data || []));
    } catch (error) {
        console.warn('Could not fetch assessment results from Supabase, using local cache instead:', error.message);
        return readStoredResults(userId);
    }
}

export async function saveAssessmentResult(userId, stageId, payload) {
    if (!userId || !stageId) return null;

    const results = readStoredResults(userId);
    const nextRecord = mergeLocalRecord(results[stageId], payload);
    results[stageId] = nextRecord;
    writeStoredResults(userId, results);

    if (!supabase) return nextRecord;

    try {
        const { error } = await supabase
            .from('assessment_results')
            .insert(toDbPayload(userId, stageId, nextRecord));

        if (error) throw error;
    } catch (error) {
        console.warn('Could not save assessment result to Supabase, kept local cache only:', error.message);
    }

    return nextRecord;
}

export function formatRelativeUpdated(dateString) {
    if (!dateString) return 'Not started';

    const timestamp = new Date(dateString).getTime();
    if (Number.isNaN(timestamp)) return 'Recently';

    const diffMs = Date.now() - timestamp;
    const diffMinutes = Math.max(0, Math.round(diffMs / 60000));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;

    const diffHours = Math.round(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.round(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;

    return new Date(timestamp).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });
}
