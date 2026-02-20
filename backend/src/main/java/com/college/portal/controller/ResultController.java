package com.college.portal.controller;

import com.college.portal.model.Result;
import com.college.portal.repository.ResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/results")
@RequiredArgsConstructor
public class ResultController {

    private final ResultRepository resultRepository;

    @GetMapping
    public ResponseEntity<?> getResults(Authentication auth) {
        try {
            String uid = (String) auth.getPrincipal();
            return getResultsByUid(uid);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/semester/{semester}")
    public ResponseEntity<?> getResultsBySemester(Authentication auth, @PathVariable String semester) {
        try {
            String uid = (String) auth.getPrincipal();
            List<Result> results = resultRepository.findByStudentId(uid).stream()
                    .filter(r -> semester.equals(r.getSemester()))
                    .toList();
            return ResponseEntity.ok(results.stream().map(this::mapToDto).toList());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    private ResponseEntity<?> getResultsByUid(String uid) throws Exception {
        List<Result> results = resultRepository.findByStudentId(uid);
        double average = results.stream()
                .mapToInt(Result::getMarks)
                .average()
                .orElse(0);
        return ResponseEntity.ok(Map.of(
                "results", results.stream().map(this::mapToDto).toList(),
                "average", String.format("%.1f", average),
                "totalSubjects", results.size()));
    }

    private Map<String, Object> mapToDto(Result r) {
        String status = r.getMarks() != null && r.getMarks() >= 50 ? "Pass" : "Fail";
        String code = r.getSubject() != null ? r.getSubject() : "N/A";
        String name = r.getSubjectName() != null ? r.getSubjectName() : code;
        return Map.of(
                "subjectCode", code,
                "subjectName", name,
                "marks",
                (r.getMarks() != null ? r.getMarks() : 0) + " / " + (r.getMaxMarks() != null ? r.getMaxMarks() : 100),
                "grade", r.getGrade() != null ? r.getGrade() : "N/A",
                "status", status,
                "semester", r.getSemester() != null ? r.getSemester() : "N/A");
    }
}
