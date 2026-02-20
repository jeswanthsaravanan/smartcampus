package com.college.portal.controller;

import com.college.portal.model.Timetable;
import com.college.portal.repository.TimetableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/timetable")
@RequiredArgsConstructor
public class TimetableController {

    private final TimetableRepository timetableRepository;
    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("HH:mm");

    @GetMapping("/today")
    public ResponseEntity<?> getTodayTimetable(Authentication auth) {
        try {
            String uid = (String) auth.getPrincipal();
            String dayOfWeek = LocalDate.now().getDayOfWeek().name();
            List<Timetable> timetable = timetableRepository.findByStudentIdAndDayOfWeek(uid, dayOfWeek);
            return ResponseEntity.ok(timetable.stream().map(this::mapToDto).toList());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/next")
    public ResponseEntity<?> getNextPeriod(Authentication auth) {
        try {
            String uid = (String) auth.getPrincipal();
            String dayOfWeek = LocalDate.now().getDayOfWeek().name();
            LocalTime now = LocalTime.now();

            List<Timetable> todaySchedule = timetableRepository.findByStudentIdAndDayOfWeek(uid, dayOfWeek);

            for (Timetable period : todaySchedule) {
                LocalTime endTime = LocalTime.parse(period.getEndTime(), TIME_FMT);
                if (endTime.isAfter(now)) {
                    LocalTime startTime = LocalTime.parse(period.getStartTime(), TIME_FMT);
                    boolean isCurrent = !startTime.isAfter(now);
                    return ResponseEntity.ok(Map.of("period", mapToDto(period), "isCurrent", isCurrent));
                }
            }
            return ResponseEntity.ok(Map.of("message", "No more classes today"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/query")
    public ResponseEntity<?> getTimetableByDay(Authentication auth, @RequestParam String day) {
        try {
            String uid = (String) auth.getPrincipal();
            LocalDate date = switch (day.toLowerCase()) {
                case "yesterday" -> LocalDate.now().minusDays(1);
                case "day_before_yesterday" -> LocalDate.now().minusDays(2);
                case "tomorrow" -> LocalDate.now().plusDays(1);
                case "day_after_tomorrow", "next_tomorrow" -> LocalDate.now().plusDays(2);
                default -> LocalDate.now();
            };
            String dayOfWeek = date.getDayOfWeek().name();
            List<Timetable> timetable = timetableRepository.findByStudentIdAndDayOfWeek(uid, dayOfWeek);

            if (timetable.isEmpty()) {
                return ResponseEntity
                        .ok(Map.of("message", "No timetable available for " + day + " (" + dayOfWeek + ")"));
            }
            return ResponseEntity.ok(timetable.stream().map(this::mapToDto).toList());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllTimetable(Authentication auth) {
        try {
            String uid = (String) auth.getPrincipal();
            List<Timetable> timetable = timetableRepository.findByStudentId(uid);
            return ResponseEntity.ok(timetable.stream().map(this::mapToDto).toList());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/by-date/{date}")
    public ResponseEntity<?> getTimetableByDate(Authentication auth, @PathVariable String date) {
        try {
            String uid = (String) auth.getPrincipal();
            LocalDate localDate = LocalDate.parse(date);
            String dayOfWeek = localDate.getDayOfWeek().name();
            List<Timetable> timetable = timetableRepository.findByStudentIdAndDayOfWeek(uid, dayOfWeek);
            return ResponseEntity.ok(timetable.stream().map(this::mapToDto).toList());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    private Map<String, Object> mapToDto(Timetable t) {
        return Map.of(
                "id", t.getId() != null ? t.getId() : "",
                "period", t.getPeriodNo() != null ? t.getPeriodNo() : 0,
                "time", t.getStartTime() + " - " + t.getEndTime(),
                "subject", t.getSubject() != null ? t.getSubject() : "",
                "subjectCode", t.getSubject() != null ? t.getSubject() : "",
                "staff", t.getStaffName() != null ? t.getStaffName() : "",
                "day", t.getDayOfWeek() != null ? t.getDayOfWeek() : "");
    }
}
