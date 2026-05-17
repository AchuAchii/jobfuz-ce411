-- =============================================================
-- HirePilot AI — RPC Functions
-- =============================================================

-- ---------------------------------------------------------------
-- get_mcq_attempt_questions(p_profession_slug, p_n_questions)
--
-- Returns: attempt_id uuid, questions jsonb[]
-- Each question: { id, prompt, ordinal, options: [{ id, label, option_text }] }
-- NOTE: is_correct is NOT returned to the client.
-- ---------------------------------------------------------------

create or replace function public.get_mcq_attempt_questions(
    p_profession_slug text,
    p_n_questions int default 10
)
returns jsonb
language plpgsql
security definer
as $$
declare
    v_user_id uuid := auth.uid();
    v_profession_id uuid;
    v_cycle_id uuid;
    v_cycle_no int;
    v_remaining int;
    v_total_active int;
    v_effective_n_questions int;
    v_attempt_id uuid;
    v_questions jsonb;
begin
    -- 1. Resolve profession
    select id into v_profession_id
    from public.professions
    where slug = p_profession_slug;

    if v_profession_id is null then
        raise exception 'Profession not found: %', p_profession_slug;
    end if;

    -- 2. Count total active questions for this profession
    select count(*) into v_total_active
    from public.questions
    where profession_id = v_profession_id and is_active = true;

    if v_total_active = 0 then
        raise exception 'No active questions for profession: %', p_profession_slug;
    end if;

    -- Clamp n_questions to available total
    if p_n_questions > v_total_active then
        p_n_questions := v_total_active;
    end if;

    -- 3. Find active cycle (latest where ended_at is null)
    select id, cycle_no into v_cycle_id, v_cycle_no
    from public.mcq_cycles
    where user_id = v_user_id
      and profession_id = v_profession_id
      and ended_at is null
    order by cycle_no desc
    limit 1;

    -- If no active cycle, create cycle 1
    if v_cycle_id is null then
        v_cycle_no := 1;
        insert into public.mcq_cycles (user_id, profession_id, cycle_no)
        values (v_user_id, v_profession_id, v_cycle_no)
        returning id into v_cycle_id;
    end if;

    -- 4. Count remaining unseen questions in current cycle
    v_remaining := v_total_active - (
        select count(*) from public.mcq_question_history
        where user_id = v_user_id
          and profession_id = v_profession_id
          and cycle_no = v_cycle_no
    );

    -- 5. Start a new cycle only after the user has seen every question once
    if v_remaining = 0 then
        update public.mcq_cycles
        set ended_at = now()
        where id = v_cycle_id;

        v_cycle_no := v_cycle_no + 1;
        insert into public.mcq_cycles (user_id, profession_id, cycle_no)
        values (v_user_id, v_profession_id, v_cycle_no)
        returning id into v_cycle_id;

        v_remaining := v_total_active;
    end if;

    -- 6. Allow the final attempt in a cycle to use the remaining unseen questions.
    v_effective_n_questions := least(p_n_questions, v_remaining);

    -- 7. Create the attempt
    insert into public.mcq_attempts (user_id, profession_id, cycle_id, total_questions)
    values (v_user_id, v_profession_id, v_cycle_id, v_effective_n_questions)
    returning id into v_attempt_id;

    -- 8. Select random unseen questions
    with selected_qs as (
        select q.id, q.prompt, q.explanation
        from public.questions q
        where q.profession_id = v_profession_id
          and q.is_active = true
          and q.id not in (
              select question_id from public.mcq_question_history
              where user_id = v_user_id
                and profession_id = v_profession_id
                and cycle_no = v_cycle_no
          )
        order by random()
        limit v_effective_n_questions
    ),
    numbered as (
        select *, row_number() over () as ordinal
        from selected_qs
    )
    -- 9. Insert into attempt_questions + question_history and build response
    , inserted_aq as (
        insert into public.mcq_attempt_questions (attempt_id, question_id, ordinal)
        select v_attempt_id, n.id, n.ordinal
        from numbered n
        returning question_id, ordinal
    )
    , inserted_hist as (
        insert into public.mcq_question_history (user_id, profession_id, cycle_no, question_id)
        select v_user_id, v_profession_id, v_cycle_no, n.id
        from numbered n
        returning question_id
    )
    select jsonb_agg(
        jsonb_build_object(
            'id', n.id,
            'prompt', n.prompt,
            'ordinal', n.ordinal,
            'options', (
                select jsonb_agg(
                    jsonb_build_object(
                        'id', o.id,
                        'label', o.label,
                        'option_text', o.option_text
                    )
                    order by o.label
                )
                from public.question_options o
                where o.question_id = n.id
            )
        )
        order by n.ordinal
    )
    into v_questions
    from numbered n;

    return jsonb_build_object(
        'attempt_id', v_attempt_id,
        'cycle_no', v_cycle_no,
        'total_questions', v_effective_n_questions,
        'questions', coalesce(v_questions, '[]'::jsonb)
    );
end;
$$;

-- ---------------------------------------------------------------
-- grade_mcq_attempt(p_attempt_id)
--
-- Computes score from mcq_attempt_answers vs question_options.is_correct,
-- updates mcq_attempts.score + completed_at.
-- Returns: { attempt_id, score, total_questions, percentage, passed }
-- ---------------------------------------------------------------

create or replace function public.grade_mcq_attempt(
    p_attempt_id uuid
)
returns jsonb
language plpgsql
security definer
as $$
declare
    v_user_id uuid := auth.uid();
    v_score int;
    v_total int;
    v_percentage numeric;
    v_attempt record;
begin
    -- Verify ownership
    select * into v_attempt
    from public.mcq_attempts
    where id = p_attempt_id and user_id = v_user_id;

    if v_attempt is null then
        raise exception 'Attempt not found or not owned by user';
    end if;

    -- Count correct answers
    select count(*) into v_score
    from public.mcq_attempt_answers
    where attempt_id = p_attempt_id and is_correct = true;

    v_total := v_attempt.total_questions;
    v_percentage := case when v_total > 0 then round((v_score::numeric / v_total) * 100) else 0 end;

    -- Update attempt
    update public.mcq_attempts
    set score = v_score, completed_at = now()
    where id = p_attempt_id;

    return jsonb_build_object(
        'attempt_id', p_attempt_id,
        'score', v_score,
        'total_questions', v_total,
        'percentage', v_percentage,
        'passed', v_percentage >= 70
    );
end;
$$;
