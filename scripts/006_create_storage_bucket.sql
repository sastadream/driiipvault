-- Create storage bucket for file uploads
insert into storage.buckets (id, name, public)
values ('files', 'files', false)
on conflict (id) do nothing;

-- Create storage policies
create policy "authenticated_users_can_upload"
on storage.objects for insert
with check (
  bucket_id = 'files' 
  and auth.role() = 'authenticated'
);

create policy "users_can_view_own_files"
on storage.objects for select
using (
  bucket_id = 'files' 
  and auth.role() = 'authenticated'
);

create policy "users_can_update_own_files"
on storage.objects for update
using (
  bucket_id = 'files' 
  and auth.role() = 'authenticated'
);

create policy "users_can_delete_own_files"
on storage.objects for delete
using (
  bucket_id = 'files' 
  and auth.role() = 'authenticated'
);
