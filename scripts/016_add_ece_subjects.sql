-- Add subjects for Electronics and Communication Engineering SEM-1
INSERT INTO subjects (name, semester_id) VALUES 
('Maths-1', (SELECT s.id FROM semesters s 
              JOIN departments d ON s.department_id = d.id 
              WHERE d.name = 'Electronics and Communication Engineering' AND s.name = 'SEM-1')),
('BEE', (SELECT s.id FROM semesters s 
         JOIN departments d ON s.department_id = d.id 
         WHERE d.name = 'Electronics and Communication Engineering' AND s.name = 'SEM-1')),
('DFW', (SELECT s.id FROM semesters s 
         JOIN departments d ON s.department_id = d.id 
         WHERE d.name = 'Electronics and Communication Engineering' AND s.name = 'SEM-1')),
('PPS', (SELECT s.id FROM semesters s 
         JOIN departments d ON s.department_id = d.id 
         WHERE d.name = 'Electronics and Communication Engineering' AND s.name = 'SEM-1')),
('BME', (SELECT s.id FROM semesters s 
         JOIN departments d ON s.department_id = d.id 
         WHERE d.name = 'Electronics and Communication Engineering' AND s.name = 'SEM-1')),
('IPDC', (SELECT s.id FROM semesters s 
          JOIN departments d ON s.department_id = d.id 
          WHERE d.name = 'Electronics and Communication Engineering' AND s.name = 'SEM-1'));
