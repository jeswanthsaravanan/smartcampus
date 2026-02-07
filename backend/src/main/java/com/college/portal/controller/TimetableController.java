package com.college.portal.controller;

import com.college.portal.model.Student;
import com.college.portal.model.Timetable;
import com.college.portal.repository.TimetableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/timetable")
@RequiredArgsConstructor
public class TimetableController {
    
    private final TimetableRepository timetableRepository;
    
    @GetMapping("/today")
    public ResponseEntity<?> getTodayTimetable(@AuthenticationPrincipal Student student) {
        String dayOfWeek = LocalDate.now().getDayOfWeek().name();
        List<Timetable> timetable = timetableRepository
                .findByStudentIdAndDayOfWeekOrderByPeriodNo(student.getId(), dayOfWeek);
        
        return ResponseEntity.ok(timetable.stream().map(this::mapToDto).toList());
    }
    
    @GetMapping("/next")
    public ResponseEntity<?> getNextPeriod(@AuthenticationPrincipal Student student) {
        String dayOfWeek = LocalDate.now().getDayOfWeek().name();
        LocalTime now = LocalTime.now();
        
        List<Timetable> todaySchedule = timetableRepository
                .findByStudentIdAndDayOfWeekOrderByPeriodNo(student.getId(), dayOfWeek);
        
        for (Timetable period : todaySchedule) {
            if (period.getEndTime().isAfter(now)) {
                boolean isCurrent = period.getStartTime().isBefore(now) || period.getStartTime().equals(now);
                return ResponseEntity.ok(Map.of(
                        "period", mapToDto(period),
                        "isCurrent", isCurrent
                ));
            }
        }
        
        return ResponseEntity.ok(Map.of("message", "No more classes today"));
    }
    
    @GetMapping
    public ResponseEntity<?> getAllTimetable(@AuthenticationPrincipal Student student) {
        List<Timetable> timetable = timetableRepository
                .findByStudentIdOrderByDayOfWeekAscPeriodNoAsc(student.getId());
        
        return ResponseEntity.ok(timetable.stream().map(this::mapToDto).toList());
    }
    
    private Map<String, Object> mapToDto(Timetable t) {
        return Map.of(
                "period", t.getPeriodNo(),
                "time", t.getStartTime() + " - " + t.getEndTime(),
                "subject", t.getSubject(),
                "staff", t.getStaffName(),
                "day", t.getDayOfWeek()
        );
    }
}
