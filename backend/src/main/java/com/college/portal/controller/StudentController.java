package com.college.portal.controller;

import com.college.portal.model.Student;
import com.college.portal.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentController {

    private final StudentRepository studentRepository;

    /**
     * Get current student's full profile.
     */
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication auth) {
        try {
            String uid = (String) auth.getPrincipal();
            Optional<Student> student = studentRepository.findByUid(uid);
            return student
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Update student profile fields.
     * Accepts partial updates — only provided fields are changed.
     */
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(Authentication auth, @RequestBody Map<String, Object> body) {
        try {
            String uid = (String) auth.getPrincipal();
            Optional<Student> existing = studentRepository.findByUid(uid);

            if (existing.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Student student = existing.get();

            if (body.containsKey("firstName")) {
                student.setFirstName((String) body.get("firstName"));
            }
            if (body.containsKey("lastName")) {
                student.setLastName((String) body.get("lastName"));
            }
            if (body.containsKey("registerNumber")) {
                student.setRegisterNumber((String) body.get("registerNumber"));
            }
            if (body.containsKey("department")) {
                student.setDepartment((String) body.get("department"));
            }
            if (body.containsKey("batch")) {
                student.setBatch((String) body.get("batch"));
            }
            if (body.containsKey("year")) {
                Object yearVal = body.get("year");
                if (yearVal instanceof Number) {
                    student.setYear(((Number) yearVal).intValue());
                } else if (yearVal instanceof String) {
                    student.setYear(Integer.parseInt((String) yearVal));
                }
            }
            if (body.containsKey("photoUrl")) {
                student.setPhotoUrl((String) body.get("photoUrl"));
            }

            // Update display name from first+last
            String displayName = "";
            if (student.getFirstName() != null)
                displayName += student.getFirstName();
            if (student.getLastName() != null)
                displayName += " " + student.getLastName();
            student.setName(displayName.trim());

            student.setUpdatedAt(System.currentTimeMillis());
            studentRepository.save(uid, student);

            return ResponseEntity.ok(student);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to update profile: " + e.getMessage()));
        }
    }
}
