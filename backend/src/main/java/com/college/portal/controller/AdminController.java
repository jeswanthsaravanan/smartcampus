package com.college.portal.controller;

import com.college.portal.model.*;
import com.college.portal.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Admin-only controller for managing timetable, results, attendance,
 * notifications, and user roles.
 * Every endpoint verifies the caller has role=ADMIN in Firestore.
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final StudentRepository studentRepository;
    private final TimetableRepository timetableRepository;
    private final ResultRepository resultRepository;
    private final AttendanceRepository attendanceRepository;
    private final NotificationRepository notificationRepository;

    // ---- Helper: verify admin role ----
    private boolean isAdmin(Authentication auth) {
        try {
            String uid = (String) auth.getPrincipal();
            Optional<Student> student = studentRepository.findByUid(uid);
            return student.isPresent() && "ADMIN".equalsIgnoreCase(student.get().getRole());
        } catch (Exception e) {
            return false;
        }
    }

    private ResponseEntity<?> forbidden() {
        return ResponseEntity.status(403).body(Map.of("error", "Admin access required"));
    }

    // ============================================================
    // TIMETABLE CRUD
    // ============================================================

    @GetMapping("/timetable")
    public ResponseEntity<?> listTimetable(Authentication auth, @RequestParam(required = false) String day) {
        if (!isAdmin(auth))
            return forbidden();
        try {
            List<Timetable> entries;
            if (day != null && !day.isEmpty()) {
                entries = timetableRepository.findByDayOfWeek(day);
            } else {
                entries = timetableRepository.findAll();
            }
            return ResponseEntity.ok(entries);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/timetable")
    public ResponseEntity<?> createTimetable(Authentication auth, @RequestBody Timetable entry) {
        if (!isAdmin(auth))
            return forbidden();
        try {
            entry.setId(null);
            timetableRepository.save(entry);
            return ResponseEntity.ok(entry);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/timetable/{id}")
    public ResponseEntity<?> updateTimetable(Authentication auth, @PathVariable String id,
            @RequestBody Timetable entry) {
        if (!isAdmin(auth))
            return forbidden();
        try {
            entry.setId(id);
            timetableRepository.save(entry);
            return ResponseEntity.ok(entry);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/timetable/{id}")
    public ResponseEntity<?> deleteTimetable(Authentication auth, @PathVariable String id) {
        if (!isAdmin(auth))
            return forbidden();
        try {
            timetableRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    // ============================================================
    // RESULTS CRUD
    // ============================================================

    @GetMapping("/results")
    public ResponseEntity<?> listResults(Authentication auth) {
        if (!isAdmin(auth))
            return forbidden();
        try {
            List<Result> results = resultRepository.findAll();
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/results")
    public ResponseEntity<?> createResult(Authentication auth, @RequestBody Result result) {
        if (!isAdmin(auth))
            return forbidden();
        try {
            result.setId(null);
            resultRepository.save(result);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/results/{id}")
    public ResponseEntity<?> updateResult(Authentication auth, @PathVariable String id,
            @RequestBody Result result) {
        if (!isAdmin(auth))
            return forbidden();
        try {
            result.setId(id);
            resultRepository.save(result);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/results/{id}")
    public ResponseEntity<?> deleteResult(Authentication auth, @PathVariable String id) {
        if (!isAdmin(auth))
            return forbidden();
        try {
            resultRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    // ============================================================
    // ATTENDANCE CRUD
    // ============================================================

    @GetMapping("/attendance")
    public ResponseEntity<?> listAttendance(Authentication auth) {
        if (!isAdmin(auth))
            return forbidden();
        try {
            List<Attendance> records = attendanceRepository.findAll();
            return ResponseEntity.ok(records);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/attendance")
    public ResponseEntity<?> createAttendance(Authentication auth, @RequestBody Attendance attendance) {
        if (!isAdmin(auth))
            return forbidden();
        try {
            attendance.setId(null);
            attendanceRepository.save(attendance);
            return ResponseEntity.ok(attendance);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/attendance/{id}")
    public ResponseEntity<?> updateAttendance(Authentication auth, @PathVariable String id,
            @RequestBody Attendance attendance) {
        if (!isAdmin(auth))
            return forbidden();
        try {
            attendance.setId(id);
            attendanceRepository.save(attendance);
            return ResponseEntity.ok(attendance);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/attendance/{id}")
    public ResponseEntity<?> deleteAttendance(Authentication auth, @PathVariable String id) {
        if (!isAdmin(auth))
            return forbidden();
        try {
            attendanceRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    // ============================================================
    // NOTIFICATIONS CRUD
    // ============================================================

    @GetMapping("/notifications")
    public ResponseEntity<?> listNotifications(Authentication auth) {
        if (!isAdmin(auth))
            return forbidden();
        try {
            List<Notification> notifications = notificationRepository.findAll();
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/notifications")
    public ResponseEntity<?> createNotification(Authentication auth, @RequestBody Notification notification) {
        if (!isAdmin(auth))
            return forbidden();
        try {
            notification.setId(null);
            if (notification.getCreatedAt() == null) {
                notification.setCreatedAt(System.currentTimeMillis());
            }
            if (notification.getIsActive() == null) {
                notification.setIsActive(true);
            }
            notificationRepository.save(notification);
            return ResponseEntity.ok(notification);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/notifications/{id}")
    public ResponseEntity<?> updateNotification(Authentication auth, @PathVariable String id,
            @RequestBody Notification notification) {
        if (!isAdmin(auth))
            return forbidden();
        try {
            notification.setId(id);
            notificationRepository.save(notification);
            return ResponseEntity.ok(notification);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/notifications/{id}")
    public ResponseEntity<?> deleteNotification(Authentication auth, @PathVariable String id) {
        if (!isAdmin(auth))
            return forbidden();
        try {
            notificationRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    // ============================================================
    // USER / ADMIN MANAGEMENT
    // ============================================================

    @GetMapping("/users")
    public ResponseEntity<?> listUsers(Authentication auth) {
        if (!isAdmin(auth))
            return forbidden();
        try {
            List<Student> users = studentRepository.findAll();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/users/{uid}/role")
    public ResponseEntity<?> updateUserRole(Authentication auth, @PathVariable String uid,
            @RequestBody Map<String, String> body) {
        if (!isAdmin(auth))
            return forbidden();
        try {
            Optional<Student> existing = studentRepository.findByUid(uid);
            if (existing.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Student student = existing.get();
            String newRole = body.getOrDefault("role", "STUDENT").toUpperCase();

            if (!newRole.equals("ADMIN") && !newRole.equals("STUDENT")) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid role. Use ADMIN or STUDENT"));
            }

            student.setRole(newRole);
            student.setUpdatedAt(System.currentTimeMillis());
            studentRepository.save(uid, student);

            return ResponseEntity.ok(student);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/check")
    public ResponseEntity<?> checkAdmin(Authentication auth) {
        return ResponseEntity.ok(Map.of("isAdmin", isAdmin(auth)));
    }

    @PostMapping("/setup")
    public ResponseEntity<?> setupFirstAdmin(Authentication auth) {
        try {
            String uid = (String) auth.getPrincipal();

            List<Student> allUsers = studentRepository.findAll();
            boolean hasAdmin = allUsers.stream()
                    .anyMatch(s -> "ADMIN".equalsIgnoreCase(s.getRole()));

            if (hasAdmin) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "An admin already exists. Use the admin panel to manage roles."));
            }

            Optional<Student> student = studentRepository.findByUid(uid);
            if (student.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Your profile not found. Please log in first."));
            }

            Student s = student.get();
            s.setRole("ADMIN");
            s.setUpdatedAt(System.currentTimeMillis());
            studentRepository.save(uid, s);

            return ResponseEntity.ok(Map.of(
                    "message", "You are now an admin!",
                    "role", "ADMIN",
                    "uid", uid));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    // ============================================================
    // SEED ALL DATA (one-click upload)
    // ============================================================

    @PostMapping("/seed")
    public ResponseEntity<?> seedAllData(Authentication auth) {
        if (!isAdmin(auth))
            return forbidden();
        try {
            String uid = (String) auth.getPrincipal();
            int count = 0;

            // ---- TIMETABLE ----
            String[][] timetableData = {
                    // MONDAY
                    { "MONDAY", "1", "08:30", "09:30", "ET3491 FIOT", "Ms. Tanaya Kanungo, AP/ECE" },
                    { "MONDAY", "2", "09:30", "10:25", "CEC348 RS", "Mr. G. Thavaseelan, AP/ECE" },
                    { "MONDAY", "3", "10:35", "11:30", "CEC348 RS", "Mr. G. Thavaseelan, AP/ECE" },
                    { "MONDAY", "4", "11:30", "12:25", "CEC365 WSN", "Mr. E. Madhan Kumar, AP/ECE" },
                    { "MONDAY", "5", "13:15", "14:10", "CS3491 AIML", "Ms. B. Devi, AP/AI&DS" },
                    { "MONDAY", "6", "14:10", "15:05", "ET3491 FIOT LAB", "Ms. Tanaya Kanungo, AP/ECE" },
                    { "MONDAY", "7", "15:05", "16:00", "ET3491 FIOT LAB", "Ms. Tanaya Kanungo, AP/ECE" },
                    // TUESDAY
                    { "TUESDAY", "1", "08:30", "09:30", "CEC365 WSN", "Mr. E. Madhan Kumar, AP/ECE" },
                    { "TUESDAY", "2", "09:30", "10:25", "ET3491 FIOT", "Ms. Tanaya Kanungo, AP/ECE" },
                    { "TUESDAY", "3", "10:35", "11:30", "OEE351 RES", "Mr. S. Jebanani, AP/MECH" },
                    { "TUESDAY", "4", "11:30", "12:25", "MX3089 IS", "Mr. M. Nanachivayam, AP/EEE" },
                    { "TUESDAY", "5", "13:15", "14:10", "CEC333 AWCT", "Ms. M.P. Nirmala, AP/ECE" },
                    { "TUESDAY", "6", "14:10", "15:05", "CS3491 AIML LAB", "Ms. B. Devi, AP/AI&DS" },
                    { "TUESDAY", "7", "15:05", "16:00", "CS3491 AIML LAB", "Ms. B. Devi, AP/AI&DS" },
                    // WEDNESDAY
                    { "WEDNESDAY", "1", "08:30", "09:30", "OEE351 RES", "Mr. S. Jebanani, AP/MECH" },
                    { "WEDNESDAY", "2", "09:30", "10:25", "CEC333 AWCT", "Ms. M.P. Nirmala, AP/ECE" },
                    { "WEDNESDAY", "3", "10:35", "11:30", "CS3491 AIML", "Ms. B. Devi, AP/AI&DS" },
                    { "WEDNESDAY", "4", "11:30", "12:25", "CS3491 AIML", "Ms. B. Devi, AP/AI&DS" },
                    { "WEDNESDAY", "5", "13:15", "14:10", "CEC348 RS", "Mr. G. Thavaseelan, AP/ECE" },
                    { "WEDNESDAY", "6", "14:10", "15:05", "CEC348 RS", "Mr. G. Thavaseelan, AP/ECE" },
                    { "WEDNESDAY", "7", "15:05", "16:00", "CEC365 WSN", "Mr. E. Madhan Kumar, AP/ECE" },
                    // THURSDAY
                    { "THURSDAY", "1", "08:30", "09:30", "CEC333 AWCT", "Ms. M.P. Nirmala, AP/ECE" },
                    { "THURSDAY", "2", "09:30", "10:25", "CS3491 AIML", "Ms. B. Devi, AP/AI&DS" },
                    { "THURSDAY", "3", "10:35", "11:30", "CEC333 AWCT", "Ms. M.P. Nirmala, AP/ECE" },
                    { "THURSDAY", "4", "11:30", "12:25", "ET3491 FIOT", "Ms. Tanaya Kanungo, AP/ECE" },
                    { "THURSDAY", "5", "13:15", "14:10", "OEE351 RES", "Mr. S. Jebanani, AP/MECH" },
                    { "THURSDAY", "6", "14:10", "15:05", "CEC365 WSN", "Mr. E. Madhan Kumar, AP/ECE" },
                    { "THURSDAY", "7", "15:05", "16:00", "MX3089 IS", "Mr. M. Nanachivayam, AP/EEE" },
                    // FRIDAY
                    { "FRIDAY", "1", "08:30", "09:30", "CEC348 RS", "Mr. G. Thavaseelan, AP/ECE" },
                    { "FRIDAY", "2", "09:30", "10:25", "CEC333 AWCT", "Ms. M.P. Nirmala, AP/ECE" },
                    { "FRIDAY", "3", "10:35", "12:25", "PT", "-" },
                    { "FRIDAY", "5", "13:15", "14:10", "MX3089 IS", "Mr. M. Nanachivayam, AP/EEE" },
                    { "FRIDAY", "6", "14:10", "15:05", "OEE351 RES", "Mr. S. Jebanani, AP/MECH" },
                    { "FRIDAY", "7", "15:05", "16:00", "CEC365 WSN", "Mr. E. Madhan Kumar, AP/ECE" },
                    // SATURDAY
                    { "SATURDAY", "1", "08:30", "09:30", "ET3491 FIOT", "Ms. Tanaya Kanungo, AP/ECE" },
                    { "SATURDAY", "2", "09:30", "10:25", "LIB", "-" },
                    { "SATURDAY", "3", "10:35", "12:25", "Mini project/ Counseling", "-" },
                    { "SATURDAY", "5", "13:15", "14:10", "OEE351 RES", "Mr. S. Jebanani, AP/MECH" },
                    { "SATURDAY", "6", "14:10", "15:05", "CEC365 WSN", "Mr. E. Madhan Kumar, AP/ECE" },
            };

            for (String[] row : timetableData) {
                Timetable t = new Timetable(null, uid, row[0], Integer.parseInt(row[1]),
                        row[2], row[3], row[4], row[5]);
                timetableRepository.save(t);
                count++;
            }

            // ---- RESULTS ----
            String[][] resultsData = {
                    { "CEC348", "Remote Sensing", "85", "A", "Semester 6" },
                    { "CEC365", "Wireless Sensor Network", "78", "B+", "Semester 6" },
                    { "ET3491", "Embedded Systems", "92", "A+", "Semester 6" },
                    { "CS3491", "Artificial Intelligence", "71", "B", "Semester 6" },
                    { "CEC333", "Advanced Wireless", "88", "A", "Semester 6" },
                    { "OEE351", "Renewable Energy", "76", "B+", "Semester 6" },
                    { "MX3089", "Industry Safety", "82", "A", "Semester 6" },
            };

            for (String[] row : resultsData) {
                Result r = new Result();
                r.setStudentId(uid);
                r.setSubject(row[0]);
                r.setSubjectName(row[1]);
                r.setMarks(Integer.parseInt(row[2]));
                r.setMaxMarks(100);
                r.setGrade(row[3]);
                r.setSemester(row[4]);
                resultRepository.save(r);
                count++;
            }

            // ---- ATTENDANCE ----
            String[][] attendanceData = {
                    { "Remote Sensing", "40", "35" },
                    { "Wireless Sensor Network", "38", "30" },
                    { "Embedded Systems", "42", "40" },
                    { "Advanced Wireless", "35", "28" },
                    { "Artificial Intelligence", "40", "32" },
                    { "Renewable Energy", "36", "30" },
                    { "Industry Safety", "34", "30" },
            };

            for (String[] row : attendanceData) {
                Attendance a = new Attendance(null, uid, row[0],
                        Integer.parseInt(row[1]), Integer.parseInt(row[2]), null);
                attendanceRepository.save(a);
                count++;
            }

            // ---- NOTIFICATIONS ----
            String[][] notifData = {
                    { "Mid-Semester Exams Schedule",
                            "Mid-semester examinations will commence from March 15, 2026. Detailed schedule will be posted on the notice board." },
                    { "Annual Sports Day",
                            "Annual Sports Day will be held on February 20, 2026. All students are encouraged to participate." },
                    { "Library Book Submission",
                            "All borrowed library books must be returned by February 28, 2026 to avoid late fees." },
                    { "Campus Placement Drive",
                            "Tech Giants Inc. will be conducting a placement drive on March 5, 2026. Interested students should register by February 25." },
            };

            for (String[] row : notifData) {
                Notification n = new Notification(null, row[0], row[1], System.currentTimeMillis(), true);
                notificationRepository.save(n);
                count++;
            }

            return ResponseEntity.ok(Map.of(
                    "message", "All data seeded successfully!",
                    "records", count,
                    "uid", uid));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}
