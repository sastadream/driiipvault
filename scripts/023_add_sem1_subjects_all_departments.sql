-- Add SEM-1 subjects for all departments
WITH sem1_departments AS (
  SELECT 
    s.id as semester_id,
    d.name as department_name,
    c.name as college_name
  FROM public.semesters s
  JOIN public.departments d ON s.department_id = d.id
  JOIN public.colleges c ON d.college_id = c.id
  WHERE s.name = 'SEM-1'
),
sem1_subjects AS (
  SELECT 
    semester_id,
    subject_name,
    subject_description
  FROM sem1_departments
  CROSS JOIN (VALUES 
    ('BEE', 'Basic Electrical Engineering'),
    ('BME', 'Basic Mechanical Engineering'),
    ('BE', 'Basic Electronics'),
    ('MATHS-1', 'Mathematics 1'),
    ('PHYSICS', 'Physics'),
    ('EGD', 'Engineering Graphics and Design'),
    ('IPDC', 'Introduction to Programming and Data Structures'),
    ('DT', 'Digital Techniques'),
    ('UHV', 'Universal Human Values'),
    ('PPS', 'Programming and Problem Solving'),
    ('BIOLOGY', 'Biology'),
    ('CHEMISTRY', 'Chemistry'),
    ('BASIC-CIVIL', 'Basic Civil Engineering'),
    ('ORGANIS-BEHAVIOUR', 'Organizational Behaviour'),
    ('ENGLISH-COMMU', 'English Communication')
  ) AS subjects(subject_name, subject_description)
)
INSERT INTO public.subjects (semester_id, name, description, created_by)
SELECT 
  semester_id,
  subject_name,
  subject_description,
  (SELECT id FROM auth.users LIMIT 1)
FROM sem1_subjects
ON CONFLICT (semester_id, name) DO NOTHING;


