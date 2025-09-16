-- Create colleges table
CREATE TABLE IF NOT EXISTS public.colleges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;

-- RLS policies for colleges
CREATE POLICY "colleges_select_authenticated"
  ON public.colleges FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "colleges_insert_authenticated"
  ON public.colleges FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = created_by);

CREATE POLICY "colleges_update_own"
  ON public.colleges FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "colleges_delete_own"
  ON public.colleges FOR DELETE
  USING (auth.uid() = created_by);

-- Insert all colleges
INSERT INTO public.colleges (name, code, description, created_by)
VALUES 
  ('GEC-GN', 'GEC-GN', 'Government Engineering College - Gandhinagar', (SELECT id FROM auth.users LIMIT 1)),
  ('GEC-PATAN', 'GEC-PATAN', 'Government Engineering College - Patan', (SELECT id FROM auth.users LIMIT 1)),
  ('GEC-BHARUCH', 'GEC-BHARUCH', 'Government Engineering College - Bharuch', (SELECT id FROM auth.users LIMIT 1)),
  ('GEC-BHAVNAGAR', 'GEC-BHAVNAGAR', 'Government Engineering College - Bhavnagar', (SELECT id FROM auth.users LIMIT 1)),
  ('NIRMA', 'NIRMA', 'Nirma University', (SELECT id FROM auth.users LIMIT 1)),
  ('PDEU', 'PDEU', 'Pandit Deendayal Energy University', (SELECT id FROM auth.users LIMIT 1)),
  ('LDRP', 'LDRP', 'LDRP Institute of Technology and Research', (SELECT id FROM auth.users LIMIT 1)),
  ('LJ', 'LJ', 'LJ Institute of Engineering and Technology', (SELECT id FROM auth.users LIMIT 1)),
  ('LD', 'LD', 'LD College of Engineering', (SELECT id FROM auth.users LIMIT 1)),
  ('GTU', 'GTU', 'Gujarat Technological University', (SELECT id FROM auth.users LIMIT 1)),
  ('DDU', 'DDU', 'Dharmsinh Desai University', (SELECT id FROM auth.users LIMIT 1))
ON CONFLICT (name) DO NOTHING;


