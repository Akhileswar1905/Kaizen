-- Add transaction type to the existing expenses ledger.
-- Existing rows are treated as expenses so historical data remains unchanged.
alter table public.expenses
  add column if not exists type text not null default 'expense';

alter table public.expenses
  drop constraint if exists expenses_type_check;

alter table public.expenses
  add constraint expenses_type_check
  check (type in ('income', 'expense'));

create index if not exists expenses_user_type_date_idx
  on public.expenses (user_id, type, date desc);
