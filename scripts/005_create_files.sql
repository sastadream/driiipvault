-- Create files table for file metadata
create table if not exists public.files (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  name text not null,
  original_name text not null,
  file_path text not null,
  file_size bigint not null,
  mime_type text not null,
  description text,
  uploaded_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.files enable row level security;

-- RLS policies for files
create policy "files_select_authenticated"
  on public.files for select
  using (auth.role() = 'authenticated');

create policy "files_insert_own"
  on public.files for insert
  with check (auth.role() = 'authenticated' and auth.uid() = uploaded_by);

create policy "files_update_own"
  on public.files for update
  using (auth.uid() = uploaded_by);

create policy "files_delete_own"
  on public.files for delete
  using (auth.uid() = uploaded_by);

-- Create index for better query performance
create index if not exists files_subject_id_idx on public.files(subject_id);
create index if not exists files_uploaded_by_idx on public.files(uploaded_by);
