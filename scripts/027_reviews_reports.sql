-- Reviews: 1-5 stars, optional text
create table if not exists public.file_reviews (
  id uuid primary key default gen_random_uuid(),
  file_id uuid not null references public.files(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  rating int not null check (rating between 1 and 5),
  review_text text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.file_reviews enable row level security;
drop policy if exists file_reviews_select_public on public.file_reviews;
create policy file_reviews_select_public on public.file_reviews for select to public using (true);
drop policy if exists file_reviews_insert_auth on public.file_reviews;
-- Require rating and a username in profiles to be present (enforced app-side; DB enforces auth only)
create policy file_reviews_insert_auth on public.file_reviews for insert to authenticated with check (true);

-- Reports: reason text, optional user_id
create table if not exists public.file_reports (
  id uuid primary key default gen_random_uuid(),
  file_id uuid not null references public.files(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  reason text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.file_reports enable row level security;
drop policy if exists file_reports_select_public on public.file_reports;
create policy file_reports_select_public on public.file_reports for select to public using (true);
drop policy if exists file_reports_insert_auth on public.file_reports;
create policy file_reports_insert_auth on public.file_reports for insert to authenticated with check (true);

-- Indexes for perf
create index if not exists idx_file_reviews_file on public.file_reviews(file_id);
create index if not exists idx_file_reports_file on public.file_reports(file_id);

