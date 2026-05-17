import { supabase } from '../lib/supabaseClient';

/**
 * Start a new MCQ attempt — calls the Postgres RPC that handles
 * cycle management and non-repeating question selection.
 *
 * Returns: { attempt_id, cycle_no, total_questions, questions: [...] }
 * Each question has: { id, prompt, ordinal, options: [{ id, label, option_text }] }
 * NOTE: is_correct is never exposed here.
 */
export async function startAttempt(professionSlug, nQuestions = 10) {
    const { data, error } = await supabase.rpc('get_mcq_attempt_questions', {
        p_profession_slug: professionSlug,
        p_n_questions: nQuestions,
    });

    if (error) throw error;
    return data;
}

/**
 * Submit an answer for a question in an attempt.
 * Also checks correctness by looking up the option.
 */
export async function submitAnswer(attemptId, questionId, optionId) {
    // Fetch the selected option's correctness
    const { data: option, error: optErr } = await supabase
        .from('question_options')
        .select('is_correct')
        .eq('id', optionId)
        .single();

    if (optErr) throw optErr;

    // Fetch explanation and correct option for display
    const { data: question } = await supabase
        .from('questions')
        .select('explanation')
        .eq('id', questionId)
        .single();

    const { data: correctOpt } = await supabase
        .from('question_options')
        .select('id, label, option_text')
        .eq('question_id', questionId)
        .eq('is_correct', true)
        .single();

    const { error } = await supabase
        .from('mcq_attempt_answers')
        .insert({
            attempt_id: attemptId,
            question_id: questionId,
            option_id: optionId,
            is_correct: option.is_correct,
        });

    if (error) throw error;
    return {
        is_correct: option.is_correct,
        explanation: question?.explanation || null,
        correct_option: correctOpt || null,
    };
}

/**
 * Finish an attempt — calls the grading RPC.
 * Returns: { attempt_id, score, total_questions, percentage, passed }
 */
export async function finishAttempt(attemptId) {
    const { data, error } = await supabase.rpc('grade_mcq_attempt', {
        p_attempt_id: attemptId,
    });

    if (error) throw error;
    return data;
}

/**
 * Get the user's attempt history, optionally filtered by profession.
 */
export async function getAttemptHistory(professionSlug = null) {
    let query = supabase
        .from('mcq_attempts')
        .select(`
            id,
            score,
            total_questions,
            started_at,
            completed_at,
            professions ( slug, name_en )
        `)
        .order('started_at', { ascending: false });

    if (professionSlug) {
        // Filter by profession slug via join
        query = query.eq('professions.slug', professionSlug);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
}

/**
 * Get details for a specific attempt (questions, user answers, correct answers).
 * Only call this AFTER the attempt is completed.
 */
export async function getAttemptDetail(attemptId) {
    // Get attempt info
    const { data: attempt, error: aErr } = await supabase
        .from('mcq_attempts')
        .select('*, professions ( slug, name_en )')
        .eq('id', attemptId)
        .single();

    if (aErr) throw aErr;

    // Get questions for this attempt
    const { data: attemptQuestions, error: aqErr } = await supabase
        .from('mcq_attempt_questions')
        .select('question_id, ordinal')
        .eq('attempt_id', attemptId)
        .order('ordinal');

    if (aqErr) throw aqErr;

    // Get the actual question data + options + user answers
    const questionIds = attemptQuestions.map(aq => aq.question_id);

    const { data: questions, error: qErr } = await supabase
        .from('questions')
        .select('id, prompt, explanation')
        .in('id', questionIds);

    if (qErr) throw qErr;

    const { data: options, error: oErr } = await supabase
        .from('question_options')
        .select('id, question_id, label, option_text, is_correct')
        .in('question_id', questionIds)
        .order('label');

    if (oErr) throw oErr;

    const { data: answers, error: ansErr } = await supabase
        .from('mcq_attempt_answers')
        .select('question_id, option_id, is_correct')
        .eq('attempt_id', attemptId);

    if (ansErr) throw ansErr;

    // Build structured review data
    const review = attemptQuestions.map(aq => {
        const question = questions.find(q => q.id === aq.question_id);
        const qOptions = options.filter(o => o.question_id === aq.question_id);
        const userAnswer = answers.find(a => a.question_id === aq.question_id);
        const correctOption = qOptions.find(o => o.is_correct);

        return {
            ordinal: aq.ordinal,
            question: question?.prompt,
            explanation: question?.explanation,
            options: qOptions.map(o => ({
                id: o.id,
                label: o.label,
                text: o.option_text,
                isCorrect: o.is_correct,
            })),
            userOptionId: userAnswer?.option_id || null,
            isCorrect: userAnswer?.is_correct || false,
            correctOptionId: correctOption?.id || null,
        };
    });

    return {
        attempt,
        review,
    };
}
