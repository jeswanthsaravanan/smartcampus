package com.college.portal.controller;

import com.college.portal.model.Attendance;
import com.college.portal.model.DailyAttendance;
import com.college.portal.repository.AttendanceRepository;
import com.college.portal.repository.DailyAttendanceRepository;
import com.college.portal.service.DateResolverService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceRepository attendanceRepository;
    private final DailyAttendanceRepository dailyAttendanceRepository;
    private final DateResolverService dateResolverService;

    @GetMapping
    public ResponseEntity<?> getAttendance(Authentication auth) {
        try {
            String uid = (String) auth.getPrincipal();
            List<Attendance> attendance = attendanceRepository.findByStudentId(uid);

            int totalClasses = attendance.stream().mapToInt(Attendance::getTotalDays).sum();
            int totalPresent = attendance.stream().mapToInt(Attendance::getPresentDays).sum();
            double overallPercentage = totalClasses > 0 ? (totalPresent * 100.0) / totalClasses : 0;

            List<String> shortageSubjects = attendance.stream()
                    .filter(a -> a.getPercentage() != null && a.getPercentage() < 75)
                    .map(Attendance::getSubject)
                    .toList();

            return ResponseEntity.ok(Map.of(
                    "attendance", attendance.stream().map(this::mapToDto).toList(),
                    "overallPercentage", String.format("%.1f", overallPercentage),
                    "totalClasses", totalClasses,
                    "totalPresent", totalPresent,
                    "hasShortage", !shortageSubjects.isEmpty(),
                    "shortageSubjects", shortageSubjects));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    private Map<String, Object> mapToDto(Attendance a) {
        double pct = a.getPercentage() != null ? a.getPercentage() : 0.0;
        return Map.of(
                "subject", a.getSubject() != null ? a.getSubject() : "Unknown",
                "total", a.getTotalDays() != null ? a.getTotalDays() : 0,
                "present", a.getPresentDays() != null ? a.getPresentDays() : 0,
                "percentage", String.format("%.2f", pct) + "%",
                "status", pct >= 75 ? "OK" : "Shortage");
    }

    @GetMapping("/daily")
    public ResponseEntity<?> getDailyAttendance(
            Authentication auth,
            @RequestParam(required = false, defaultValue = "today") String day) {
        try {
            String uid = (String) auth.getPrincipal();
            if (dateResolverService.isFutureDateQuery(day)) {
                Map<String, Object> err = new LinkedHashMap<>();
                err.put("error", true);
                err.put("message", "Attendance is not available for future dates.");
                return ResponseEntity.badRequest().body(err);
            }
            LocalDate targetDate = dateResolverService.resolveDateForAttendance(day);
            if (dateResolverService.isFutureDate(targetDate)) {
                Map<String, Object> err = new LinkedHashMap<>();
                err.put("error", true);
                err.put("message", "Attendance is not available for future dates.");
                return ResponseEntity.badRequest().body(err);
            }
            return getDailyAttendanceForDate(uid, targetDate);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/daily/{date}")
    public ResponseEntity<?> getDailyAttendanceByDate(Authentication auth, @PathVariable String date) {
        try {
            String uid = (String) auth.getPrincipal();
            LocalDate targetDate = LocalDate.parse(date, DateTimeFormatter.ISO_LOCAL_DATE);
            if (dateResolverService.isFutureDate(targetDate)) {
                Map<String, Object> err = new LinkedHashMap<>();
                err.put("error", true);
                err.put("message", "Attendance is not available for future dates.");
                return ResponseEntity.badRequest().body(err);
            }
            return getDailyAttendanceForDate(uid, targetDate);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    private ResponseEntity<?> getDailyAttendanceForDate(String uid, LocalDate date) throws Exception {
        List<DailyAttendance> records = dailyAttendanceRepository.findByStudentIdAndDate(uid, date.toString());

        int totalClasses = records.size();
        long attended = records.stream().filter(r -> "Present".equals(r.getStatus())).count();
        double percentage = totalClasses > 0 ? (attended * 100.0) / totalClasses : 0.0;

        String dayOfWeek = date.getDayOfWeek().getDisplayName(TextStyle.FULL, Locale.ENGLISH);
        String formattedDate = date.format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("date", formattedDate);
        response.put("dayOfWeek", dayOfWeek);
        response.put("totalClasses", totalClasses);
        response.put("attended", attended);
        response.put("percentage", String.format("%.1f", percentage));
        response.put("records", records.stream().map(this::mapDailyAttendanceToDto).toList());

        return ResponseEntity.ok(response);
    }

    private Map<String, Object> mapDailyAttendanceToDto(DailyAttendance da) {
        String subject = da.getSubject() != null ? da.getSubject() : "Unknown Subject";
        return Map.of(
                "period", da.getPeriodNo() != null ? da.getPeriodNo() : 0,
                "subject", subject,
                "status", da.getStatus() != null ? da.getStatus() : "Unknown",
                "time", da.getStartTime() != null ? da.getStartTime() : "--:--");
    }
}
