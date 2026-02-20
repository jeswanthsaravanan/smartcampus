-- =====================================================
-- Smart College Student Portal - Database Schema
-- MySQL Database Script
-- =====================================================

-- Create database
CREATE DATABASE IF NOT EXISTS college_portal;
USE college_portal;

-- =====================================================
-- Students Table
-- =====================================================
CREATE TABLE students (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('STUDENT', 'ADMIN') DEFAULT 'STUDENT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Timetable Table
-- =====================================================
CREATE TABLE timetable (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT NOT NULL,
    day_of_week VARCHAR(15) NOT NULL,
    period_no INT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    subject VARCHAR(100) NOT NULL,
    staff_name VARCHAR(100) NOT NULL,
    
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    INDEX idx_student_day (student_id, day_of_week)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Results Table
-- =====================================================
CREATE TABLE results (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT NOT NULL,
    subject VARCHAR(100) NOT NULL,
    marks INT NOT NULL,
    max_marks INT DEFAULT 100,
    grade VARCHAR(2),
    semester VARCHAR(20),
    
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    INDEX idx_student (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Attendance Table
-- =====================================================
CREATE TABLE attendance (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT NOT NULL,
    subject VARCHAR(100) NOT NULL,
    total_days INT NOT NULL,
    present_days INT NOT NULL,
    percentage DECIMAL(5,2),
    
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    INDEX idx_student (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Notifications Table
-- =====================================================
CREATE TABLE notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Sample Data (Optional - for testing)
-- Note: Password is BCrypt hash of 'password123'
-- =====================================================

-- Insert demo student
INSERT INTO students (name, email, password, role) VALUES 
('John Doe', 'student@college.edu', '$2a$10$rBVHPQqMBXK2vRNs5PMgKOp8FXNT1vQXu6aEBPh8rYXtL7VwBCqHm', 'STUDENT'),
('Admin User', 'admin@college.edu', '$2a$10$rBVHPQqMBXK2vRNs5PMgKOp8FXNT1vQXu6aEBPh8rYXtL7VwBCqHm', 'ADMIN');

-- Insert timetable for student 1 (TUESDAY)
INSERT INTO timetable (student_id, day_of_week, period_no, start_time, end_time, subject, staff_name) VALUES
(1, 'TUESDAY', 1, '09:00:00', '09:50:00', '22EC601', 'TBA'),
(1, 'TUESDAY', 2, '10:00:00', '10:50:00', '22EC602', 'TBA'),
(1, 'TUESDAY', 3, '11:00:00', '12:50:00', '22EC601 A1 / 22EC602 A2 (LAB)', 'LAB'),
(1, 'TUESDAY', 5, '14:00:00', '14:50:00', 'LIBRARY', '-'),
(1, 'TUESDAY', 6, '15:00:00', '15:50:00', '22EC981', 'TBA'),
(1, 'TUESDAY', 7, '16:00:00', '16:50:00', 'SPORTS / 22CB003', '-');

-- Insert timetable for student 1 (WEDNESDAY)
INSERT INTO timetable (student_id, day_of_week, period_no, start_time, end_time, subject, staff_name) VALUES
(1, 'WEDNESDAY', 1, '09:00:00', '09:50:00', '22EC602', 'TBA'),
(1, 'WEDNESDAY', 2, '10:00:00', '10:50:00', '22EC919', 'TBA'),
(1, 'WEDNESDAY', 3, '11:00:00', '11:50:00', '22EC913', 'TBA'),
(1, 'WEDNESDAY', 4, '12:00:00', '12:50:00', '22EC601', 'TBA'),
(1, 'WEDNESDAY', 5, '14:00:00', '14:50:00', '22EC981', 'TBA'),
(1, 'WEDNESDAY', 6, '15:00:00', '16:50:00', '22EC919 A1 / 22EC611 A2 (LAB)', 'LAB');

-- Insert timetable for student 1 (THURSDAY)
INSERT INTO timetable (student_id, day_of_week, period_no, start_time, end_time, subject, staff_name) VALUES
(1, 'THURSDAY', 1, '09:00:00', '09:50:00', '22CB003', 'TBA'),
(1, 'THURSDAY', 2, '10:00:00', '10:50:00', '22EC601', 'TBA'),
(1, 'THURSDAY', 3, '11:00:00', '11:50:00', '22EC913', 'TBA'),
(1, 'THURSDAY', 4, '12:00:00', '13:50:00', '22EC919 A2 / 22EC611 A1 (LAB)', 'LAB'),
(1, 'THURSDAY', 6, '15:00:00', '16:50:00', 'PLACEMENT', '-');

-- Insert timetable for student 1 (FRIDAY)
INSERT INTO timetable (student_id, day_of_week, period_no, start_time, end_time, subject, staff_name) VALUES
(1, 'FRIDAY', 1, '09:00:00', '09:50:00', '22CB003', 'TBA'),
(1, 'FRIDAY', 2, '10:00:00', '10:50:00', '22EC919', 'TBA'),
(1, 'FRIDAY', 3, '11:00:00', '11:50:00', '22EC913', 'TBA'),
(1, 'FRIDAY', 4, '12:00:00', '12:50:00', '22EC981', 'TBA'),
(1, 'FRIDAY', 5, '14:00:00', '14:50:00', '22EC602', 'TBA'),
(1, 'FRIDAY', 6, '15:00:00', '16:50:00', '22EC601 A2 / 22EC602 A1 (LAB)', 'LAB');

-- Insert timetable for student 1 (SATURDAY)
INSERT INTO timetable (student_id, day_of_week, period_no, start_time, end_time, subject, staff_name) VALUES
(1, 'SATURDAY', 1, '09:00:00', '09:50:00', '22EC919', 'TBA'),
(1, 'SATURDAY', 2, '10:00:00', '10:50:00', '22EC601', 'TBA'),
(1, 'SATURDAY', 3, '11:00:00', '11:50:00', '22EC913', 'TBA'),
(1, 'SATURDAY', 4, '12:00:00', '12:50:00', '22EC919', 'TBA'),
(1, 'SATURDAY', 5, '14:00:00', '14:50:00', '22EC602', 'TBA'),
(1, 'SATURDAY', 6, '15:00:00', '15:50:00', '22CB003', 'TBA'),
(1, 'SATURDAY', 7, '16:00:00', '16:50:00', 'PLACEMENT', '-');

-- Insert results
INSERT INTO results (student_id, subject, marks, max_marks, grade, semester) VALUES
(1, 'Data Structures', 85, 100, 'A', 'Semester 4'),
(1, 'Database Systems', 78, 100, 'B+', 'Semester 4'),
(1, 'Computer Networks', 92, 100, 'A+', 'Semester 4'),
(1, 'Operating Systems', 71, 100, 'B', 'Semester 4'),
(1, 'Software Engineering', 88, 100, 'A', 'Semester 4');

-- Insert attendance
INSERT INTO attendance (student_id, subject, total_days, present_days, percentage) VALUES
(1, 'Data Structures', 45, 40, 88.89),
(1, 'Database Systems', 42, 35, 83.33),
(1, 'Computer Networks', 40, 38, 95.00),
(1, 'Operating Systems', 44, 36, 81.82),
(1, 'Software Engineering', 38, 34, 89.47);

-- Insert notifications
INSERT INTO notifications (title, message, is_active) VALUES
('Mid-Semester Exams Schedule', 'Mid-semester examinations will commence from March 15, 2026. Detailed schedule will be posted on the notice board.', true),
('Annual Sports Day', 'Annual Sports Day will be held on February 20, 2026. All students are encouraged to participate.', true),
('Library Book Submission', 'All borrowed library books must be returned by February 28, 2026 to avoid late fees.', true),
('Campus Placement Drive', 'Tech Giants Inc. will be conducting a placement drive on March 5, 2026. Interested students should register by February 25.', true);
