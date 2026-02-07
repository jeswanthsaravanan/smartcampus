package com.college.portal.controller;

import com.college.portal.model.Result;
import com.college.portal.model.Student;
import com.college.portal.repository.ResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/results")
@RequiredArgsConstructor
public class ResultController {
    
    private final ResultRepository resultRepository;
    
    @GetMapping
    public ResponseEntity<?> getResults(@AuthenticationPrincipal Student student) {
        List<Result> results = resultRepository.findByStudentId(student.getId());
        
        double average = results.stream()
                .mapToInt(Result::getMarks)
                .average()
                .orElse(0);
        
        return ResponseEntity.ok(Map.of(
                "results", results.stream().map(this::mapToDto).toList(),
                "average", String.format("%.1f", average),
                "totalSubjects", results.size()
        ));
    }
    
    @GetMapping("/semester/{semester}")
    public ResponseEntity<?> getResultsBySemester(
            @AuthenticationPrincipal Student student,
            @PathVariable String semester) {
        List<Result> results = resultRepository.findByStudentIdAndSemester(student.getId(), semester);
        
        return ResponseEntity.ok(results.stream().map(this::mapToDto).toList());
    }
    
    private Map<String, Object> mapToDto(Result r) {
        String status = r.getMarks() >= 40 ? "Pass" : "Fail";
        return Map.of(
                "subject", r.getSubject(),
                "marks", r.getMarks() + "/" + r.getMaxMarks(),
                "grade", r.getGrade() != null ? r.getGrade() : "N/A",
                "status", status,
                "semester", r.getSemester() != null ? r.getSemester() : "N/A"
        );
    }
}
