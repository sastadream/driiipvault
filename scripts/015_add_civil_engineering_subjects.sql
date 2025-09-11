-- Add subjects for Civil Engineering SEM-1
INSERT INTO subjects (name, semester_id) 
SELECT 
    subject_name,
    s.id
FROM (
    VALUES 
        ('Maths-1'),
        ('Physics'),
        ('EGD'),
        ('PPS'),
        ('DESIGN THINKING')
) AS new_subjects(subject_name)
CROSS JOIN semesters s
JOIN departments d ON s.department_id = d.id
WHERE d.name = 'Civil Engineering' 
AND s.name = 'SEM-1';

-- Verify the subjects were added
SELECT 
    d.name as department,
    s.name as semester,
    sub.name as subject
FROM subjects sub
JOIN semesters s ON sub.semester_id = s.id
JOIN departments d ON s.department_id = d.id
WHERE d.name = 'Civil Engineering' 
AND s.name = 'SEM-1'
ORDER BY sub.name;
