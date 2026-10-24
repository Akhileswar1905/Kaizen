-- Time blocks (calendar-style planner) for Kaizen.
-- Run this once in the Supabase SQL editor.

create table if not exists public.time_blocks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null,
  block_date  date not null,
  start_time  time not null,
  end_time    time not null,
  color       text not null default 'blue',  -- blue | green | amber | rose | violet | slate
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  check (end_time > start_time)
);

create index if not exists time_blocks_user_date_idx
  on public.time_blocks (user_id, block_date);

alter table public.time_blocks enable row level security;

create policy "Users manage their own time blocks"
  on public.time_blocks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
