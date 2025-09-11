-- Add MATHS-1 subject to Robotic and Automation Engineering → SEM-1
INSERT INTO public.subjects (semester_id, name, description)
SELECT s.id, 'MATHS-1', 'Mathematics 1'
FROM public.semesters s
JOIN public.departments d ON s.department_id = d.id
WHERE d.name = 'Robotic and Automation Engineering' AND s.name = 'SEM-1'
ON CONFLICT (semester_id, name) DO NOTHING;
