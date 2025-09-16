-- Add all 8 semesters for each department
WITH department_semesters AS (
  SELECT 
    d.id as department_id,
    d.name as department_name,
    c.name as college_name,
    sem.semester_name,
    sem.semester_description
  FROM public.departments d
  JOIN public.colleges c ON d.college_id = c.id
  CROSS JOIN (VALUES 
    ('SEM-1', 'First Semester'),
    ('SEM-2', 'Second Semester'),
    ('SEM-3', 'Third Semester'),
    ('SEM-4', 'Fourth Semester'),
    ('SEM-5', 'Fifth Semester'),
    ('SEM-6', 'Sixth Semester'),
    ('SEM-7', 'Seventh Semester'),
    ('SEM-8', 'Eighth Semester')
  ) AS sem(semester_name, semester_description)
)
INSERT INTO public.semesters (department_id, name, description, created_by)
SELECT 
  department_id,
  semester_name,
  semester_description,
  (SELECT id FROM auth.users LIMIT 1)
FROM department_semesters
ON CONFLICT (department_id, name) DO NOTHING;


