-- Insert sample departments
insert into public.departments (name, description) values
  ('Computer Science', 'Computer Science and Engineering Department'),
  ('Mathematics', 'Mathematics Department'),
  ('Physics', 'Physics Department'),
  ('Chemistry', 'Chemistry Department')
on conflict (name) do nothing;

-- Insert sample semesters for Computer Science
insert into public.semesters (department_id, name, description)
select d.id, s.name, s.description
from public.departments d
cross join (
  values 
    ('Semester 1', 'First semester courses'),
    ('Semester 2', 'Second semester courses'),
    ('Semester 3', 'Third semester courses'),
    ('Semester 4', 'Fourth semester courses'),
    ('Semester 5', 'Fifth semester courses'),
    ('Semester 6', 'Sixth semester courses'),
    ('Semester 7', 'Seventh semester courses'),
    ('Semester 8', 'Eighth semester courses')
) as s(name, description)
where d.name = 'Computer Science'
on conflict (department_id, name) do nothing;

-- Insert sample subjects for Computer Science Semester 1
insert into public.subjects (semester_id, name, description)
select s.id, subj.name, subj.description
from public.semesters s
join public.departments d on s.department_id = d.id
cross join (
  values 
    ('Programming Fundamentals', 'Introduction to programming concepts'),
    ('Mathematics I', 'Calculus and linear algebra'),
    ('Physics I', 'Mechanics and thermodynamics'),
    ('English', 'Technical writing and communication'),
    ('Computer Fundamentals', 'Basic computer concepts and architecture')
) as subj(name, description)
where d.name = 'Computer Science' and s.name = 'Semester 1'
on conflict (semester_id, name) do nothing;
