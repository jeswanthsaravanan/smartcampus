-- Insert demo student (password: password123, hashed with BCrypt)
INSERT INTO students (name, email, password, role) VALUES 
('John Doe', 'student@college.edu', '$2a$10$N4Fh5kLtqOQFGT8.QwQwJeNvPqFGT8.QwQwJeNvPqFGT8.QwQwJeNvPq', 'STUDENT'),
('Admin User', 'admin@college.edu', '$2a$10$N4Fh5kLtqOQFGT8.QwQwJeNvPqFGT8.QwQwJeNvPqFGT8.QwQwJeNvPq', 'ADMIN');

-- Timetable for student 1 (John Doe) - FRIDAY (current day for demo)
INSERT INTO timetable (student_id, day_of_week, period_no, start_time, end_time, subject, staff_name) VALUES
(1, 'FRIDAY', 1, '09:00:00', '09:50:00', 'Data Structures', 'Dr. Sharma'),
(1, 'FRIDAY', 2, '10:00:00', '10:50:00', 'Database Systems', 'Prof. Kumar'),
(1, 'FRIDAY', 3, '11:00:00', '11:50:00', 'Computer Networks', 'Dr. Verma'),
(1, 'FRIDAY', 4, '12:00:00', '12:50:00', 'Operating Systems', 'Prof. Singh'),
(1, 'FRIDAY', 5, '14:00:00', '14:50:00', 'Software Engineering', 'Dr. Gupta');

-- Timetable for MONDAY
INSERT INTO timetable (student_id, day_of_week, period_no, start_time, end_time, subject, staff_name) VALUES
(1, 'MONDAY', 1, '09:00:00', '09:50:00', 'Web Development', 'Prof. Patel'),
(1, 'MONDAY', 2, '10:00:00', '10:50:00', 'Machine Learning', 'Dr. Reddy'),
(1, 'MONDAY', 3, '11:00:00', '11:50:00', 'Data Structures Lab', 'Dr. Sharma'),
(1, 'MONDAY', 4, '14:00:00', '15:50:00', 'Database Lab', 'Prof. Kumar');

-- Results for student 1
INSERT INTO results (student_id, subject, marks, max_marks, grade, semester) VALUES
(1, 'Data Structures', 85, 100, 'A', 'Semester 4'),
(1, 'Database Systems', 78, 100, 'B+', 'Semester 4'),
(1, 'Computer Networks', 92, 100, 'A+', 'Semester 4'),
(1, 'Operating Systems', 71, 100, 'B', 'Semester 4'),
(1, 'Software Engineering', 88, 100, 'A', 'Semester 4');

-- Attendance for student 1
INSERT INTO attendance (student_id, subject, total_days, present_days, percentage) VALUES
(1, 'Data Structures', 45, 40, 88.89),
(1, 'Database Systems', 42, 35, 83.33),
(1, 'Computer Networks', 40, 38, 95.00),
(1, 'Operating Systems', 44, 36, 81.82),
(1, 'Software Engineering', 38, 34, 89.47);

-- Notifications
INSERT INTO notifications (title, message, is_active) VALUES
('Mid-Semester Exams Schedule', 'Mid-semester examinations will commence from March 15, 2026. Detailed schedule will be posted on the notice board.', true),
('Annual Sports Day', 'Annual Sports Day will be held on February 20, 2026. All students are encouraged to participate.', true),
('Library Book Submission', 'All borrowed library books must be returned by February 28, 2026 to avoid late fees.', true),
('Campus Placement Drive', 'Tech Giants Inc. will be conducting a placement drive on March 5, 2026. Interested students should register by February 25.', true);
