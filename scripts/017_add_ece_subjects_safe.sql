-- Add subjects to Electronics and Communication Engineering SEM-1 (safe version)
-- This script will only add subjects that don't already exist

DO $$
DECLARE
    dept_id INTEGER;
    sem_id INTEGER;
BEGIN
    -- Get Electronics and Communication Engineering department ID
    SELECT id INTO dept_id FROM departments WHERE name = 'Electronics and Communication Engineering';
    
    -- Get SEM-1 ID for this department
    SELECT id INTO sem_id FROM semesters WHERE department_id = dept_id AND name = 'SEM-1';
    
    -- Add subjects only if they don't exist
    INSERT INTO subjects (semester_id, name, description, created_at, updated_at)
    SELECT sem_id, subject_name, 'Electronics and Communication Engineering SEM-1 - ' || subject_name, NOW(), NOW()
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
    
    RAISE NOTICE 'Successfully added new subjects to Electronics and Communication Engineering SEM-1';
END $$;
