package com.college.portal.controller;

import com.college.portal.model.Attendance;
import com.college.portal.model.Student;
import com.college.portal.repository.AttendanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {
    
    private final AttendanceRepository attendanceRepository;
    
    @GetMapping
    public ResponseEntity<?> getAttendance(@AuthenticationPrincipal Student student) {
        List<Attendance> attendance = attendanceRepository.findByStudentId(student.getId());
        
        int totalClasses = attendance.stream().mapToInt(Attendance::getTotalDays).sum();
        int totalPresent = attendance.stream().mapToInt(Attendance::getPresentDays).sum();
        double overallPercentage = totalClasses > 0 ? (totalPresent * 100.0) / totalClasses : 0;
        
        List<String> shortageSubjects = attendance.stream()
                .filter(a -> a.getPercentage().compareTo(BigDecimal.valueOf(75)) < 0)
                .map(Attendance::getSubject)
                .toList();
        
        return ResponseEntity.ok(Map.of(
                "attendance", attendance.stream().map(this::mapToDto).toList(),
                "overallPercentage", String.format("%.1f", overallPercentage),
                "totalClasses", totalClasses,
                "totalPresent", totalPresent,
                "hasShortage", !shortageSubjects.isEmpty(),
                "shortageSubjects", shortageSubjects
        ));
    }
    
    private Map<String, Object> mapToDto(Attendance a) {
        return Map.of(
                "subject", a.getSubject(),
                "total", a.getTotalDays(),
                "present", a.getPresentDays(),
                "percentage", a.getPercentage() + "%",
                "status", a.getPercentage().compareTo(BigDecimal.valueOf(75)) >= 0 ? "OK" : "Shortage"
        );
    }
}
