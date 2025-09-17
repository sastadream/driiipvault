-- Favorites table
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  entity_type text check (entity_type in ('college','department','semester','subject','file')) not null,
  entity_id uuid not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, entity_type, entity_id)
);

alter table public.favorites enable row level security;

create policy if not exists "favorites_select_own"
on public.favorites for select
using (auth.uid() = user_id);

create policy if not exists "favorites_insert_own"
on public.favorites for insert
with check (auth.uid() = user_id);

create policy if not exists "favorites_delete_own"
on public.favorites for delete
using (auth.uid() = user_id);

-- Views tracking for files
alter table public.files add column if not exists views bigint default 0;

create or replace function public.increment_file_views(fid uuid)
returns void language sql as $$
  update public.files set views = coalesce(views,0) + 1 where id = fid;
$$;

-- Helpful indexes
create index if not exists idx_favorites_user on public.favorites(user_id);
create index if not exists idx_favorites_entity on public.favorites(entity_type, entity_id);

