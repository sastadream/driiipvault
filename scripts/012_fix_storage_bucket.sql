-- Make the files bucket public so users can view files
update storage.buckets 
set public = true 
where id = 'files';

-- Drop existing restrictive policies
drop policy if exists "authenticated_users_can_upload" on storage.objects;
drop policy if exists "users_can_view_own_files" on storage.objects;
drop policy if exists "users_can_update_own_files" on storage.objects;
drop policy if exists "users_can_delete_own_files" on storage.objects;

-- Create new policies for public viewing but authenticated upload
create policy "authenticated_users_can_upload"
on storage.objects for insert
with check (
  bucket_id = 'files' 
  and auth.role() = 'authenticated'
);

create policy "anyone_can_view_files"
on storage.objects for select
using (bucket_id = 'files');
