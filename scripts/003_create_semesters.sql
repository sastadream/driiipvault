-- Create semesters table
create table if not exists public.semesters (
  id uuid primary key default gen_random_uuid(),
  department_id uuid not null references public.departments(id) on delete cascade,
  name text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references auth.users(id) on delete set null,
  unique(department_id, name)
);

-- Enable RLS
alter table public.semesters enable row level security;

-- RLS policies for semesters
create policy "semesters_select_authenticated"
  on public.semesters for select
  using (auth.role() = 'authenticated');

create policy "semesters_insert_authenticated"
  on public.semesters for insert
  with check (auth.role() = 'authenticated' and auth.uid() = created_by);

create policy "semesters_update_own"
  on public.semesters for update
  using (auth.uid() = created_by);

create policy "semesters_delete_own"
  on public.semesters for delete
  using (auth.uid() = created_by);
