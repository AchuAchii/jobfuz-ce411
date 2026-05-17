-- =============================================================
-- Public contact form submissions
-- =============================================================

create table if not exists public.contact_messages (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    email text not null,
    message text not null,
    source text not null default 'website',
    status text not null default 'new' check (status in ('new', 'reviewed', 'closed')),
    created_at timestamptz not null default now()
);

create index if not exists idx_contact_messages_status_created
    on public.contact_messages(status, created_at desc);

alter table public.contact_messages enable row level security;

create policy "Public can insert contact messages"
    on public.contact_messages for insert
    to anon, authenticated
    with check (true);
