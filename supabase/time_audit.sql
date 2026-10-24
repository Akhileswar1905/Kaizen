-- Time Audit (Eisenhower matrix) tables for Kaizen.
-- Run this once in the Supabase SQL editor.

create table if not exists public.time_audit_entries (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  entry_date  date not null,
  slot        text not null,            -- 30 minute slot start, "HH:mm" (24h)
  task        text not null default '',
  urgent      boolean,                  -- null = not answered yet
  important   boolean,                  -- null = not answered yet
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (user_id, entry_date, slot)
);

create table if not exists public.time_audit_days (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  entry_date  date not null,
  happy       boolean,                  -- "Do I feel happy with how the day went?"
  updated_at  timestamptz not null default now(),
  unique (user_id, entry_date)
);

alter table public.time_audit_entries enable row level security;
alter table public.time_audit_days enable row level security;

create policy "Users manage their own time audit entries"
  on public.time_audit_entries for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage their own time audit days"
  on public.time_audit_days for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
