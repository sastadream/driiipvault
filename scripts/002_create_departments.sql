-- Create departments table
create table if not exists public.departments (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references auth.users(id) on delete set null
);

-- Enable RLS
alter table public.departments enable row level security;

-- RLS policies for departments (all authenticated users can read, only creators can modify)
create policy "departments_select_authenticated"
  on public.departments for select
  using (auth.role() = 'authenticated');

create policy "departments_insert_authenticated"
  on public.departments for insert
  with check (auth.role() = 'authenticated' and auth.uid() = created_by);

create policy "departments_update_own"
  on public.departments for update
  using (auth.uid() = created_by);

create policy "departments_delete_own"
  on public.departments for delete
  using (auth.uid() = created_by);
