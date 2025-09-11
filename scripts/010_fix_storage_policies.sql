-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "authenticated_users_can_view_all_files" ON storage.objects;
DROP POLICY IF EXISTS "authenticated_users_can_upload" ON storage.objects;
DROP POLICY IF EXISTS "users_can_delete_own_files" ON storage.objects;
DROP POLICY IF EXISTS "users_can_view_own_files" ON storage.objects;

-- Create new restrictive policies
-- Allow uploads but no downloads or deletes
CREATE POLICY "upload_only_policy" ON storage.objects
  FOR INSERT 
  TO authenticated 
  WITH CHECK (bucket_id = 'files');

-- No select policy means no downloads allowed
-- No delete policy means no deletions allowed
-- No update policy means no updates allowed

-- Ensure RLS is enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
