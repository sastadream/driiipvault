-- Add url column to files table
ALTER TABLE public.files 
ADD COLUMN IF NOT EXISTS url TEXT;

-- Update existing files to have public URLs
UPDATE public.files 
SET url = (
  SELECT 
    CASE 
      WHEN file_path IS NOT NULL THEN 
        'https://bvztzeuetxikaevnuteo.supabase.co/storage/v1/object/public/files/' || file_path
      ELSE NULL 
    END
)
WHERE url IS NULL;
