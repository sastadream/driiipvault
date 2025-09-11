-- Remove existing policies
DROP POLICY IF EXISTS "authenticated_users_can_view_all_files" ON storage.objects;
DROP POLICY IF EXISTS "users_can_delete_own_files" ON storage.objects;

-- Create new restrictive policies
-- No one can download files from storage
CREATE POLICY "no_downloads_allowed" ON storage.objects
  FOR SELECT USING (false);

-- Users can still upload files
CREATE POLICY "authenticated_users_can_upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'files' AND 
    auth.role() = 'authenticated'
  );

-- No one can delete files
CREATE POLICY "no_deletes_allowed" ON storage.objects
  FOR DELETE USING (false);

-- No one can update files
CREATE POLICY "no_updates_allowed" ON storage.objects
  FOR UPDATE USING (false);
