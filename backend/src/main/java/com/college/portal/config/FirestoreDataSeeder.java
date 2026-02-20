package com.college.portal.config;

import com.college.portal.model.*;
import com.college.portal.repository.*;
import com.google.cloud.firestore.Firestore;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

/**
 * Seeds Firestore with sample data matching the chatbot DEMO_DATA.
 *
 * HOW TO USE:
 * 1. Create a user in Firebase Console -> Authentication -> Users
 * 2. Copy their UID and paste it as STUDENT_UID below
 */
@Slf4j
@Component
@RequiredArgsConstructor
@Profile({ "dev", "default" })
public class FirestoreDataSeeder implements CommandLineRunner {

    private static final String STUDENT_UID = "REPLACE_WITH_YOUR_FIREBASE_USER_UID";

    private final Firestore firestore;
    private final StudentRepository studentRepository;
    private final TimetableRepository timetableRepository;
    private final ResultRepository resultRepository;
    private final AttendanceRepository attendanceRepository;
    private final NotificationRepository notificationRepository;

    @Override
    public void run(String... args) throws Exception {
        if ("REPLACE_WITH_YOUR_FIREBASE_USER_UID".equals(STUDENT_UID)) {
            log.warn("FirestoreDataSeeder: STUDENT_UID not set. Skipping data seeding.");
            log.warn("   Set the STUDENT_UID in FirestoreDataSeeder.java to seed sample data.");
            return;
        }

        if (studentRepository.findByUid(STUDENT_UID).isPresent()) {
            log.info("Firebase student profile already exists. Skipping seeder.");
            return;
        }

        log.info("Seeding Firestore with sample data for UID: {}", STUDENT_UID);
        seedStudent();
        seedTimetable();
        seedResults();
        seedAttendance();
        seedNotifications();
        log.info("Firestore data seeding complete!");
    }

    private void seedStudent() throws Exception {
        Student s = new Student();
        s.setUid(STUDENT_UID);
        s.setName("Sanga Prabha");
        s.setEmail("student@college.edu");
        s.setRole("STUDENT");
        s.setCreatedAt(System.currentTimeMillis());
        studentRepository.save(STUDENT_UID, s);
        log.info("  Student profile seeded");
    }

    private void seedTimetable() throws Exception {
        // MONDAY
        saveTimetable("MONDAY", 1, "08:30", "09:30", "ET3491 FIOT", "Ms. Tanaya Kanungo, AP/ECE");
        saveTimetable("MONDAY", 2, "09:30", "10:25", "CEC348 RS", "Mr. G. Thavaseelan, AP/ECE");
        saveTimetable("MONDAY", 3, "10:35", "11:30", "CEC348 RS", "Mr. G. Thavaseelan, AP/ECE");
        saveTimetable("MONDAY", 4, "11:30", "12:25", "CEC365 WSN", "Mr. E. Madhan Kumar, AP/ECE");
        saveTimetable("MONDAY", 5, "13:15", "14:10", "CS3491 AIML", "Ms. B. Devi, AP/AI&DS");
        saveTimetable("MONDAY", 6, "14:10", "15:05", "ET3491 FIOT LAB", "Ms. Tanaya Kanungo, AP/ECE");
        saveTimetable("MONDAY", 7, "15:05", "16:00", "ET3491 FIOT LAB", "Ms. Tanaya Kanungo, AP/ECE");

        // TUESDAY
        saveTimetable("TUESDAY", 1, "08:30", "09:30", "CEC365 WSN", "Mr. E. Madhan Kumar, AP/ECE");
        saveTimetable("TUESDAY", 2, "09:30", "10:25", "ET3491 FIOT", "Ms. Tanaya Kanungo, AP/ECE");
        saveTimetable("TUESDAY", 3, "10:35", "11:30", "OEE351 RES", "Mr. S. Jebanani, AP/MECH");
        saveTimetable("TUESDAY", 4, "11:30", "12:25", "MX3089 IS", "Mr. M. Nanachivayam, AP/EEE");
        saveTimetable("TUESDAY", 5, "13:15", "14:10", "CEC333 AWCT", "Ms. M.P. Nirmala, AP/ECE");
        saveTimetable("TUESDAY", 6, "14:10", "15:05", "CS3491 AIML LAB", "Ms. B. Devi, AP/AI&DS");
        saveTimetable("TUESDAY", 7, "15:05", "16:00", "CS3491 AIML LAB", "Ms. B. Devi, AP/AI&DS");

        // WEDNESDAY
        saveTimetable("WEDNESDAY", 1, "08:30", "09:30", "OEE351 RES", "Mr. S. Jebanani, AP/MECH");
        saveTimetable("WEDNESDAY", 2, "09:30", "10:25", "CEC333 AWCT", "Ms. M.P. Nirmala, AP/ECE");
        saveTimetable("WEDNESDAY", 3, "10:35", "11:30", "CS3491 AIML", "Ms. B. Devi, AP/AI&DS");
        saveTimetable("WEDNESDAY", 4, "11:30", "12:25", "CS3491 AIML", "Ms. B. Devi, AP/AI&DS");
        saveTimetable("WEDNESDAY", 5, "13:15", "14:10", "CEC348 RS", "Mr. G. Thavaseelan, AP/ECE");
        saveTimetable("WEDNESDAY", 6, "14:10", "15:05", "CEC348 RS", "Mr. G. Thavaseelan, AP/ECE");
        saveTimetable("WEDNESDAY", 7, "15:05", "16:00", "CEC365 WSN", "Mr. E. Madhan Kumar, AP/ECE");

        // THURSDAY
        saveTimetable("THURSDAY", 1, "08:30", "09:30", "CEC333 AWCT", "Ms. M.P. Nirmala, AP/ECE");
        saveTimetable("THURSDAY", 2, "09:30", "10:25", "CS3491 AIML", "Ms. B. Devi, AP/AI&DS");
        saveTimetable("THURSDAY", 3, "10:35", "11:30", "CEC333 AWCT", "Ms. M.P. Nirmala, AP/ECE");
        saveTimetable("THURSDAY", 4, "11:30", "12:25", "ET3491 FIOT", "Ms. Tanaya Kanungo, AP/ECE");
        saveTimetable("THURSDAY", 5, "13:15", "14:10", "OEE351 RES", "Mr. S. Jebanani, AP/MECH");
        saveTimetable("THURSDAY", 6, "14:10", "15:05", "CEC365 WSN", "Mr. E. Madhan Kumar, AP/ECE");
        saveTimetable("THURSDAY", 7, "15:05", "16:00", "MX3089 IS", "Mr. M. Nanachivayam, AP/EEE");

        // FRIDAY
        saveTimetable("FRIDAY", 1, "08:30", "09:30", "CEC348 RS", "Mr. G. Thavaseelan, AP/ECE");
        saveTimetable("FRIDAY", 2, "09:30", "10:25", "CEC333 AWCT", "Ms. M.P. Nirmala, AP/ECE");
        saveTimetable("FRIDAY", 3, "10:35", "12:25", "PT", "-");
        saveTimetable("FRIDAY", 5, "13:15", "14:10", "MX3089 IS", "Mr. M. Nanachivayam, AP/EEE");
        saveTimetable("FRIDAY", 6, "14:10", "15:05", "OEE351 RES", "Mr. S. Jebanani, AP/MECH");
        saveTimetable("FRIDAY", 7, "15:05", "16:00", "CEC365 WSN", "Mr. E. Madhan Kumar, AP/ECE");

        // SATURDAY
        saveTimetable("SATURDAY", 1, "08:30", "09:30", "ET3491 FIOT", "Ms. Tanaya Kanungo, AP/ECE");
        saveTimetable("SATURDAY", 2, "09:30", "10:25", "LIB", "-");
        saveTimetable("SATURDAY", 3, "10:35", "12:25", "Mini project/ Counseling", "-");
        saveTimetable("SATURDAY", 5, "13:15", "14:10", "OEE351 RES", "Mr. S. Jebanani, AP/MECH");
        saveTimetable("SATURDAY", 6, "14:10", "15:05", "CEC365 WSN", "Mr. E. Madhan Kumar, AP/ECE");

        log.info("  Timetable seeded");
    }

    private void saveTimetable(String day, int period, String start, String end, String subject, String staff)
            throws Exception {
        Timetable t = new Timetable(null, STUDENT_UID, day, period, start, end, subject, staff);
        timetableRepository.save(t);
    }

    private void seedResults() throws Exception {
        saveResult("CEC348", "Remote Sensing", 85, "A", "Semester 6");
        saveResult("CEC365", "Wireless Sensor Network", 78, "B+", "Semester 6");
        saveResult("ET3491", "Embedded Systems", 92, "A+", "Semester 6");
        saveResult("CS3491", "Artificial Intelligence", 71, "B", "Semester 6");
        saveResult("CEC333", "Advanced Wireless", 88, "A", "Semester 6");
        saveResult("OEE351", "Renewable Energy", 76, "B+", "Semester 6");
        saveResult("MX3089", "Industry Safety", 82, "A", "Semester 6");
        log.info("  Results seeded");
    }

    private void saveResult(String subjectCode, String subjectName, int marks, String grade, String semester)
            throws Exception {
        Result r = new Result();
        r.setStudentId(STUDENT_UID);
        r.setSubject(subjectCode);
        r.setSubjectName(subjectName);
        r.setMarks(marks);
        r.setMaxMarks(100);
        r.setGrade(grade);
        r.setSemester(semester);
        resultRepository.save(r);
    }

    private void seedAttendance() throws Exception {
        saveAttendance("Remote Sensing", 40, 35);
        saveAttendance("Wireless Sensor Network", 38, 30);
        saveAttendance("Embedded Systems", 42, 40);
        saveAttendance("Advanced Wireless", 35, 28);
        saveAttendance("Artificial Intelligence", 40, 32);
        saveAttendance("Renewable Energy", 36, 30);
        saveAttendance("Industry Safety", 34, 30);
        log.info("  Attendance seeded");
    }

    private void saveAttendance(String subject, int total, int present) throws Exception {
        Attendance a = new Attendance(null, STUDENT_UID, subject, total, present, null);
        attendanceRepository.save(a);
    }

    private void seedNotifications() throws Exception {
        saveNotification("Mid-Semester Exams Schedule",
                "Mid-semester examinations will commence from March 15, 2026. Detailed schedule will be posted on the notice board.");
        saveNotification("Annual Sports Day",
                "Annual Sports Day will be held on February 20, 2026. All students are encouraged to participate.");
        saveNotification("Library Book Submission",
                "All borrowed library books must be returned by February 28, 2026 to avoid late fees.");
        saveNotification("Campus Placement Drive",
                "Tech Giants Inc. will be conducting a placement drive on March 5, 2026. Interested students should register by February 25.");
        log.info("  Notifications seeded");
    }

    private void saveNotification(String title, String message) throws Exception {
        Notification n = new Notification(null, title, message, System.currentTimeMillis(), true);
        notificationRepository.save(n);
    }
}
