-- =============================================================
-- HirePilot AI — Database Schema
-- =============================================================

-- 1) professions
create table if not exists public.professions (
    id uuid primary key default gen_random_uuid(),
    slug text unique not null,
    name_en text not null,
    name_th text not null,
    created_at timestamptz default now()
);

-- 2) questions
create table if not exists public.questions (
    id uuid primary key default gen_random_uuid(),
    profession_id uuid not null references public.professions(id) on delete cascade,
    type text not null check (type in ('mcq')),
    difficulty int not null default 1 check (difficulty between 1 and 3),
    prompt text not null,
    explanation text,
    tags text[] default '{}',
    is_active boolean default true,
    created_at timestamptz default now()
);

create index if not exists idx_questions_profession_active
    on public.questions(profession_id, is_active);

-- 3) question_options
create table if not exists public.question_options (
    id uuid primary key default gen_random_uuid(),
    question_id uuid not null references public.questions(id) on delete cascade,
    label text not null,
    option_text text not null,
    is_correct boolean not null default false
);

-- 4) user_profiles
create table if not exists public.user_profiles (
    user_id uuid primary key references auth.users(id) on delete cascade,
    display_name text,
    preferred_language text default 'en',
    created_at timestamptz default now()
);

-- 5) mcq_cycles
create table if not exists public.mcq_cycles (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    profession_id uuid not null references public.professions(id) on delete cascade,
    cycle_no int not null default 1,
    started_at timestamptz default now(),
    ended_at timestamptz,
    unique (user_id, profession_id, cycle_no)
);

-- 6) mcq_attempts
create table if not exists public.mcq_attempts (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    profession_id uuid not null references public.professions(id) on delete cascade,
    cycle_id uuid references public.mcq_cycles(id) on delete set null,
    total_questions int not null,
    score int not null default 0,
    started_at timestamptz default now(),
    completed_at timestamptz
);

-- 7) mcq_attempt_questions
create table if not exists public.mcq_attempt_questions (
    attempt_id uuid not null references public.mcq_attempts(id) on delete cascade,
    question_id uuid not null references public.questions(id) on delete restrict,
    ordinal int not null,
    primary key (attempt_id, question_id)
);

-- 8) mcq_attempt_answers
create table if not exists public.mcq_attempt_answers (
    attempt_id uuid not null references public.mcq_attempts(id) on delete cascade,
    question_id uuid not null references public.questions(id) on delete restrict,
    option_id uuid not null references public.question_options(id) on delete restrict,
    is_correct boolean not null,
    answered_at timestamptz default now(),
    primary key (attempt_id, question_id)
);

-- 9) mcq_question_history
create table if not exists public.mcq_question_history (
    user_id uuid not null references auth.users(id) on delete cascade,
    profession_id uuid not null references public.professions(id) on delete cascade,
    cycle_no int not null,
    question_id uuid not null references public.questions(id) on delete restrict,
    served_at timestamptz default now(),
    primary key (user_id, profession_id, cycle_no, question_id)
);

create index if not exists idx_mcq_question_history_lookup
    on public.mcq_question_history(user_id, profession_id, cycle_no);
