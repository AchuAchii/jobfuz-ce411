-- =============================================================
-- HirePilot AI - Refresh MCQ attempt selection logic
-- =============================================================

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
    select id into v_profession_id
    from public.professions
    where slug = p_profession_slug;

    if v_profession_id is null then
        raise exception 'Profession not found: %', p_profession_slug;
    end if;

    select count(*) into v_total_active
    from public.questions
    where profession_id = v_profession_id and is_active = true;

    if v_total_active = 0 then
        raise exception 'No active questions for profession: %', p_profession_slug;
    end if;

    if p_n_questions > v_total_active then
        p_n_questions := v_total_active;
    end if;

    select id, cycle_no into v_cycle_id, v_cycle_no
    from public.mcq_cycles
    where user_id = v_user_id
      and profession_id = v_profession_id
      and ended_at is null
    order by cycle_no desc
    limit 1;

    if v_cycle_id is null then
        v_cycle_no := 1;
        insert into public.mcq_cycles (user_id, profession_id, cycle_no)
        values (v_user_id, v_profession_id, v_cycle_no)
        returning id into v_cycle_id;
    end if;

    v_remaining := v_total_active - (
        select count(*) from public.mcq_question_history
        where user_id = v_user_id
          and profession_id = v_profession_id
          and cycle_no = v_cycle_no
    );

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

    v_effective_n_questions := least(p_n_questions, v_remaining);

    insert into public.mcq_attempts (user_id, profession_id, cycle_id, total_questions)
    values (v_user_id, v_profession_id, v_cycle_id, v_effective_n_questions)
    returning id into v_attempt_id;

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
    ),
    inserted_aq as (
        insert into public.mcq_attempt_questions (attempt_id, question_id, ordinal)
        select v_attempt_id, n.id, n.ordinal
        from numbered n
        returning question_id, ordinal
    ),
    inserted_hist as (
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
