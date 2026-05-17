-- =============================================================
-- HirePilot AI - Profile profession + assessment result history
-- =============================================================

alter table public.user_profiles
    add column if not exists profession_slug text references public.professions(slug) on delete set null;

create table if not exists public.assessment_results (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    profession_slug text references public.professions(slug) on delete set null,
    stage text not null check (stage in ('resume', 'essay', 'workstyle', 'interview')),
    score int check (score between 0 and 100),
    status text check (status in ('not-started', 'needs-work', 'improving', 'stable')),
    summary text,
    display_value text,
    result_json jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now()
);

create index if not exists idx_assessment_results_user_stage_created
    on public.assessment_results(user_id, stage, created_at desc);

alter table public.assessment_results enable row level security;

create policy "Users can view own assessment results"
    on public.assessment_results for select
    to authenticated
    using (auth.uid() = user_id);

create policy "Users can insert own assessment results"
    on public.assessment_results for insert
    to authenticated
    with check (auth.uid() = user_id);
