-- Kaizen Learning Checklist
-- Run this file in the Supabase SQL Editor before using the checklist page.

create table if not exists public.learning_checklist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null,
  title text not null,
  description text not null default '',
  is_completed boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists learning_checklist_items_user_sort_idx
  on public.learning_checklist_items (user_id, category, sort_order);

alter table public.learning_checklist_items enable row level security;

drop policy if exists "Users manage their own learning checklist items"
  on public.learning_checklist_items;

create policy "Users manage their own learning checklist items"
  on public.learning_checklist_items
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
