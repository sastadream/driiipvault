-- Drop existing restrictive policies
drop policy if exists "users_can_view_own_files" on storage.objects;
drop policy if exists "users_can_update_own_files" on storage.objects;
drop policy if exists "users_can_delete_own_files" on storage.objects;

-- Allow all authenticated users to view/download any file
create policy "authenticated_users_can_view_all_files"
on storage.objects for select
using (
  bucket_id = 'files' 
  and auth.role() = 'authenticated'
);

-- Only allow file owners to delete their own files
create policy "users_can_delete_own_files"
on storage.objects for delete
using (
  bucket_id = 'files' 
  and auth.role() = 'authenticated'
  and auth.uid()::text = (storage.foldername(name))[1]
);

-- Only allow file owners to update their own files
create policy "users_can_update_own_files"
on storage.objects for update
using (
  bucket_id = 'files' 
  and auth.role() = 'authenticated'
  and auth.uid()::text = (storage.foldername(name))[1]
);
