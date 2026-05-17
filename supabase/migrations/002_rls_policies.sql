-- =============================================================
-- HirePilot AI — Row Level Security Policies
-- =============================================================

-- Enable RLS on all tables
alter table public.professions enable row level security;
alter table public.questions enable row level security;
alter table public.question_options enable row level security;
alter table public.user_profiles enable row level security;
alter table public.mcq_cycles enable row level security;
alter table public.mcq_attempts enable row level security;
alter table public.mcq_attempt_questions enable row level security;
alter table public.mcq_attempt_answers enable row level security;
alter table public.mcq_question_history enable row level security;

-- ---- Question bank: readable by all authenticated users ----

create policy "Professions readable by authenticated"
    on public.professions for select
    to authenticated
    using (true);

create policy "Questions readable by authenticated"
    on public.questions for select
    to authenticated
    using (true);

create policy "Question options readable by authenticated"
    on public.question_options for select
    to authenticated
    using (true);

-- ---- User-owned tables: only owner can CRUD ----

-- user_profiles
create policy "Users can view own profile"
    on public.user_profiles for select
    to authenticated
    using (auth.uid() = user_id);

create policy "Users can insert own profile"
    on public.user_profiles for insert
    to authenticated
    with check (auth.uid() = user_id);

create policy "Users can update own profile"
    on public.user_profiles for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- mcq_cycles
create policy "Users can view own cycles"
    on public.mcq_cycles for select
    to authenticated
    using (auth.uid() = user_id);

create policy "Users can insert own cycles"
    on public.mcq_cycles for insert
    to authenticated
    with check (auth.uid() = user_id);

create policy "Users can update own cycles"
    on public.mcq_cycles for update
    to authenticated
    using (auth.uid() = user_id);

-- mcq_attempts
create policy "Users can view own attempts"
    on public.mcq_attempts for select
    to authenticated
    using (auth.uid() = user_id);

create policy "Users can insert own attempts"
    on public.mcq_attempts for insert
    to authenticated
    with check (auth.uid() = user_id);

create policy "Users can update own attempts"
    on public.mcq_attempts for update
    to authenticated
    using (auth.uid() = user_id);

-- mcq_attempt_questions
create policy "Users can view own attempt questions"
    on public.mcq_attempt_questions for select
    to authenticated
    using (
        exists (
            select 1 from public.mcq_attempts a
            where a.id = attempt_id and a.user_id = auth.uid()
        )
    );

create policy "Users can insert own attempt questions"
    on public.mcq_attempt_questions for insert
    to authenticated
    with check (
        exists (
            select 1 from public.mcq_attempts a
            where a.id = attempt_id and a.user_id = auth.uid()
        )
    );

-- mcq_attempt_answers
create policy "Users can view own attempt answers"
    on public.mcq_attempt_answers for select
    to authenticated
    using (
        exists (
            select 1 from public.mcq_attempts a
            where a.id = attempt_id and a.user_id = auth.uid()
        )
    );

create policy "Users can insert own attempt answers"
    on public.mcq_attempt_answers for insert
    to authenticated
    with check (
        exists (
            select 1 from public.mcq_attempts a
            where a.id = attempt_id and a.user_id = auth.uid()
        )
    );

-- mcq_question_history
create policy "Users can view own question history"
    on public.mcq_question_history for select
    to authenticated
    using (auth.uid() = user_id);

create policy "Users can insert own question history"
    on public.mcq_question_history for insert
    to authenticated
    with check (auth.uid() = user_id);
