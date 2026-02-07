package com.college.portal.config;

import com.college.portal.model.*;
import com.college.portal.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.math.BigDecimal;
import java.time.LocalTime;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {
    
    private final PasswordEncoder passwordEncoder;
    
    @Bean
    public CommandLineRunner initData(
            StudentRepository studentRepo,
            TimetableRepository timetableRepo,
            ResultRepository resultRepo,
            AttendanceRepository attendanceRepo,
            NotificationRepository notificationRepo) {
        
        return args -> {
            // Only initialize if no students exist
            if (studentRepo.count() > 0) {
                log.info("Database already initialized, skipping...");
                return;
            }
            
            log.info("Initializing demo data...");
            
            // Create demo students with hashed passwords
            Student student = new Student();
            student.setName("John Doe");
            student.setEmail("student@college.edu");
            student.setPassword(passwordEncoder.encode("password123"));
            student.setRole(Student.Role.STUDENT);
            student = studentRepo.save(student);
            
            Student admin = new Student();
            admin.setName("Admin User");
            admin.setEmail("admin@college.edu");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Student.Role.ADMIN);
            studentRepo.save(admin);
            
            // Create timetable for FRIDAY
            createTimetableEntry(timetableRepo, student, "FRIDAY", 1, "09:00", "09:50", "Data Structures", "Dr. Sharma");
            createTimetableEntry(timetableRepo, student, "FRIDAY", 2, "10:00", "10:50", "Database Systems", "Prof. Kumar");
            createTimetableEntry(timetableRepo, student, "FRIDAY", 3, "11:00", "11:50", "Computer Networks", "Dr. Verma");
            createTimetableEntry(timetableRepo, student, "FRIDAY", 4, "12:00", "12:50", "Operating Systems", "Prof. Singh");
            createTimetableEntry(timetableRepo, student, "FRIDAY", 5, "14:00", "14:50", "Software Engineering", "Dr. Gupta");
            
            // Create timetable for MONDAY
            createTimetableEntry(timetableRepo, student, "MONDAY", 1, "09:00", "09:50", "Web Development", "Prof. Patel");
            createTimetableEntry(timetableRepo, student, "MONDAY", 2, "10:00", "10:50", "Machine Learning", "Dr. Reddy");
            createTimetableEntry(timetableRepo, student, "MONDAY", 3, "11:00", "11:50", "Data Structures Lab", "Dr. Sharma");
            createTimetableEntry(timetableRepo, student, "MONDAY", 4, "14:00", "15:50", "Database Lab", "Prof. Kumar");
            
            // Create results
            createResult(resultRepo, student, "Data Structures", 85, "A", "Semester 4");
            createResult(resultRepo, student, "Database Systems", 78, "B+", "Semester 4");
            createResult(resultRepo, student, "Computer Networks", 92, "A+", "Semester 4");
            createResult(resultRepo, student, "Operating Systems", 71, "B", "Semester 4");
            createResult(resultRepo, student, "Software Engineering", 88, "A", "Semester 4");
            
            // Create attendance
            createAttendance(attendanceRepo, student, "Data Structures", 45, 40);
            createAttendance(attendanceRepo, student, "Database Systems", 42, 35);
            createAttendance(attendanceRepo, student, "Computer Networks", 40, 38);
            createAttendance(attendanceRepo, student, "Operating Systems", 44, 36);
            createAttendance(attendanceRepo, student, "Software Engineering", 38, 34);
            
            // Create notifications
            createNotification(notificationRepo, "Mid-Semester Exams Schedule", 
                "Mid-semester examinations will commence from March 15, 2026. Detailed schedule will be posted on the notice board.");
            createNotification(notificationRepo, "Annual Sports Day", 
                "Annual Sports Day will be held on February 20, 2026. All students are encouraged to participate.");
            createNotification(notificationRepo, "Library Book Submission", 
                "All borrowed library books must be returned by February 28, 2026 to avoid late fees.");
            createNotification(notificationRepo, "Campus Placement Drive", 
                "Tech Giants Inc. will be conducting a placement drive on March 5, 2026. Interested students should register by February 25.");
            
            log.info("Demo data initialized successfully!");
        };
    }
    
    private void createTimetableEntry(TimetableRepository repo, Student student, String day, 
            int period, String start, String end, String subject, String staff) {
        Timetable t = new Timetable();
        t.setStudent(student);
        t.setDayOfWeek(day);
        t.setPeriodNo(period);
        t.setStartTime(LocalTime.parse(start));
        t.setEndTime(LocalTime.parse(end));
        t.setSubject(subject);
        t.setStaffName(staff);
        repo.save(t);
    }
    
    private void createResult(ResultRepository repo, Student student, String subject, 
            int marks, String grade, String semester) {
        Result r = new Result();
        r.setStudent(student);
        r.setSubject(subject);
        r.setMarks(marks);
        r.setMaxMarks(100);
        r.setGrade(grade);
        r.setSemester(semester);
        repo.save(r);
    }
    
    private void createAttendance(AttendanceRepository repo, Student student, 
            String subject, int total, int present) {
        Attendance a = new Attendance();
        a.setStudent(student);
        a.setSubject(subject);
        a.setTotalDays(total);
        a.setPresentDays(present);
        a.setPercentage(BigDecimal.valueOf((present * 100.0) / total));
        repo.save(a);
    }
    
    private void createNotification(NotificationRepository repo, String title, String message) {
        Notification n = new Notification();
        n.setTitle(title);
        n.setMessage(message);
        n.setIsActive(true);
        repo.save(n);
    }
}
