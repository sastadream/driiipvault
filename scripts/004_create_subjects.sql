-- Create subjects table
create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  semester_id uuid not null references public.semesters(id) on delete cascade,
  name text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references auth.users(id) on delete set null,
  unique(semester_id, name)
);

-- Enable RLS
alter table public.subjects enable row level security;

-- RLS policies for subjects
create policy "subjects_select_authenticated"
  on public.subjects for select
  using (auth.role() = 'authenticated');

create policy "subjects_insert_authenticated"
  on public.subjects for insert
  with check (auth.role() = 'authenticated' and auth.uid() = created_by);

create policy "subjects_update_own"
  on public.subjects for update
  using (auth.uid() = created_by);

create policy "subjects_delete_own"
  on public.subjects for delete
  using (auth.uid() = created_by);
