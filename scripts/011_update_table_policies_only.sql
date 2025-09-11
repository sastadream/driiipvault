-- Update table-level policies only (storage policies need to be configured in Supabase dashboard)

-- Drop existing file table policies
DROP POLICY IF EXISTS "files_select_authenticated" ON files;
DROP POLICY IF EXISTS "files_insert_authenticated" ON files;
DROP POLICY IF EXISTS "files_delete_own" ON files;

-- Create new restrictive policies for files table
-- Allow anyone to view file metadata (but not download actual files)
CREATE POLICY "files_select_all" ON files
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow anyone to upload/insert file records
CREATE POLICY "files_insert_all" ON files
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- No delete policy - nobody can delete files
