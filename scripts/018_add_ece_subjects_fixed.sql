-- Add subjects to Electronics and Communication Engineering SEM-1
-- This script safely adds subjects without duplicates and uses proper UUID casting

DO $$
DECLARE
    dept_id uuid;
    sem_id uuid;
BEGIN
    -- Get the department ID for Electronics and Communication Engineering
    SELECT id INTO dept_id 
    FROM departments 
    WHERE name = 'Electronics and Communication Engineering';
    
    -- Get the semester ID for SEM-1 in this department
    SELECT id INTO sem_id 
    FROM semesters 
    WHERE department_id = dept_id AND name = 'SEM-1';
    
    -- Insert subjects only if they don't exist
    INSERT INTO subjects (id, name, description, semester_id, created_by, created_at)
    SELECT 
        gen_random_uuid(),
        subject_name,
        subject_name || ' for Electronics and Communication Engineering SEM-1',
        sem_id,
        (SELECT id FROM profiles LIMIT 1), -- Use first available profile as creator
        NOW()
    FROM (VALUES 
        ('Maths-1'),
        ('BEE'),
        ('DFW'),
        ('PPS'),
        ('BME'),
        ('IPDC')
    ) AS new_subjects(subject_name)
    WHERE NOT EXISTS (
        SELECT 1 FROM subjects 
        WHERE semester_id = sem_id AND name = new_subjects.subject_name
    );
    
    RAISE NOTICE 'Successfully added subjects to Electronics and Communication Engineering SEM-1';
END $$;
