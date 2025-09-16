-- Add college_id column to departments table
ALTER TABLE public.departments 
ADD COLUMN IF NOT EXISTS college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE;

-- Update existing departments to belong to GEC-GN college
UPDATE public.departments 
SET college_id = (SELECT id FROM public.colleges WHERE name = 'GEC-GN')
WHERE college_id IS NULL;

-- Add all engineering departments for each college
WITH college_departments AS (
  SELECT 
    c.id as college_id,
    c.name as college_name,
    dept.name as department_name,
    dept.description as department_description
  FROM public.colleges c
  CROSS JOIN (VALUES 
    ('Biomedical Engineering', 'Biomedical Engineering Department'),
    ('Civil Engineering', 'Civil Engineering Department'),
    ('Computer Engineering', 'Computer Engineering Department'),
    ('Electrical Engineering', 'Electrical Engineering Department'),
    ('Electronics and Communication Engineering', 'Electronics and Communication Engineering Department'),
    ('Information Technology', 'Information Technology Department'),
    ('Instrumentation and Control Engineering', 'Instrumentation and Control Engineering Department'),
    ('Mechanical Engineering', 'Mechanical Engineering Department'),
    ('Metallurgy Engineering', 'Metallurgy Engineering Department'),
    ('Robotic and Automation Engineering', 'Robotic and Automation Engineering Department')
  ) AS dept(name, description)
  WHERE c.name != 'GEC-GN' -- Skip GEC-GN as it already has departments
)
INSERT INTO public.departments (college_id, name, description, created_by)
SELECT 
  college_id,
  department_name,
  department_description,
  (SELECT id FROM auth.users LIMIT 1)
FROM college_departments
ON CONFLICT (college_id, name) DO NOTHING;


