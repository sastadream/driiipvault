-- Table to store BOOKs uploads, independent from academic subjects
create table if not exists public.books_files (
  id uuid primary key default gen_random_uuid(),
  semester text not null,
  subject text not null,
  name text not null,
  original_name text not null,
  file_path text not null,
  file_size bigint not null,
  mime_type text not null,
  description text,
  uploaded_by text, -- optional email or uid if available
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.books_files enable row level security;

-- Public can view
drop policy if exists books_files_select_public on public.books_files;
create policy books_files_select_public
on public.books_files for select
to public
using (true);

-- Public can insert (note: permissive policy; tighten if needed)
drop policy if exists books_files_insert_public on public.books_files;
create policy books_files_insert_public
on public.books_files for insert
to public
with check (true);

-- Helpful indexes
create index if not exists idx_books_files_sem_sub on public.books_files(semester, subject);
create index if not exists idx_books_files_created_at on public.books_files(created_at desc);

