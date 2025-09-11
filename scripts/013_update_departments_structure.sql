-- Clear existing data and insert new department structure
-- Clear existing data
DELETE FROM public.files;
DELETE FROM public.subjects;
DELETE FROM public.semesters;
DELETE FROM public.departments;

-- Insert the 10 specific departments
INSERT INTO public.departments (name, description) VALUES
  ('Biomedical Engineering', 'Biomedical Engineering Department'),
  ('Computer Engineering', 'Computer Engineering Department'),
  ('Electronics and Communication Engineering', 'Electronics and Communication Engineering Department'),
  ('Information Technology', 'Information Technology Department'),
  ('Instrumentation and Control Engineering', 'Instrumentation and Control Engineering Department'),
  ('Metallurgy Engineering', 'Metallurgy Engineering Department'),
  ('Mechanical Engineering', 'Mechanical Engineering Department'),
  ('Civil Engineering', 'Civil Engineering Department'),
  ('Robotic and Automation Engineering', 'Robotic and Automation Engineering Department'),
  ('Electrical Engineering', 'Electrical Engineering Department')
ON CONFLICT (name) DO NOTHING;

-- Insert SEM-1 to SEM-8 for all departments
INSERT INTO public.semesters (department_id, name, description)
SELECT d.id, s.name, s.description
FROM public.departments d
CROSS JOIN (
  VALUES 
    ('SEM-1', 'Semester 1'),
    ('SEM-2', 'Semester 2'),
    ('SEM-3', 'Semester 3'),
    ('SEM-4', 'Semester 4'),
    ('SEM-5', 'Semester 5'),
    ('SEM-6', 'Semester 6'),
    ('SEM-7', 'Semester 7'),
    ('SEM-8', 'Semester 8')
) AS s(name, description)
ON CONFLICT (department_id, name) DO NOTHING;

-- Insert subjects only for Robotic and Automation Engineering → SEM-1
INSERT INTO public.subjects (semester_id, name, description)
SELECT s.id, subj.name, subj.description
FROM public.semesters s
JOIN public.departments d ON s.department_id = d.id
CROSS JOIN (
  VALUES 
    ('BME', 'Basic Mechanical Engineering'),
    ('BEE', 'Basic Electrical Engineering'),
    ('IPDC', 'Introduction to Programming and Data Structures in C'),
    ('DESIGN THINKING', 'Design Thinking and Innovation')
) AS subj(name, description)
WHERE d.name = 'Robotic and Automation Engineering' AND s.name = 'SEM-1'
ON CONFLICT (semester_id, name) DO NOTHING;
