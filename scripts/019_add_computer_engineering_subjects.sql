-- Add Computer Engineering subjects for Semester 1
-- This script adds subjects: EGD, MATHS, PHYSICS, BEE, IPDC, DT

-- First, ensure Computer Engineering department exists
INSERT INTO public.departments (id, name, description, created_by)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000'::uuid,
  'Computer Engineering',
  'Computer Engineering Department',
  (SELECT id FROM auth.users LIMIT 1)
)
ON CONFLICT (name) DO NOTHING;

-- Ensure Semester 1 exists for Computer Engineering
INSERT INTO public.semesters (id, department_id, name, description, created_by)
VALUES (
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  '550e8400-e29b-41d4-a716-446655440000'::uuid,
  'Semester 1',
  'First Semester',
  (SELECT id FROM auth.users LIMIT 1)
)
ON CONFLICT (department_id, name) DO NOTHING;

-- Add subjects for Computer Engineering Semester 1
INSERT INTO public.subjects (semester_id, name, description, created_by)
VALUES 
  (
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    'EGD',
    'Engineering Graphics and Design',
    (SELECT id FROM auth.users LIMIT 1)
  ),
  (
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    'MATHS',
    'Mathematics',
    (SELECT id FROM auth.users LIMIT 1)
  ),
  (
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    'PHYSICS',
    'Physics',
    (SELECT id FROM auth.users LIMIT 1)
  ),
  (
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    'BEE',
    'Basic Electrical Engineering',
    (SELECT id FROM auth.users LIMIT 1)
  ),
  (
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    'IPDC',
    'Introduction to Programming and Data Structures',
    (SELECT id FROM auth.users LIMIT 1)
  ),
  (
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    'DT',
    'Digital Techniques',
    (SELECT id FROM auth.users LIMIT 1)
  )
ON CONFLICT (semester_id, name) DO NOTHING;
