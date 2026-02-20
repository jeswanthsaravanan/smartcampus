package com.college.portal.controller;

import com.college.portal.model.Student;
import com.college.portal.repository.StudentRepository;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

/**
 * Auth controller with Firebase.
 * Login itself is handled on the FRONTEND via Firebase Auth SDK.
 * This endpoint registers a student profile in Firestore after first login.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final StudentRepository studentRepository;

    /**
     * Called by frontend after Firebase login to ensure student profile exists in
     * Firestore.
     * Request body: { "name": "...", "photoUrl": "...", "role": "STUDENT" }
     */
    @PostMapping("/register-profile")
    public ResponseEntity<?> registerProfile(
            Authentication authentication,
            @RequestBody Map<String, String> body) {
        try {
            String uid = (String) authentication.getPrincipal();
            String email = (String) authentication.getCredentials();

            Optional<Student> existing = studentRepository.findByUid(uid);
            if (existing.isPresent()) {
                // Update photo URL if it changed (Google may update profile photo)
                Student student = existing.get();
                String newPhoto = body.get("photoUrl");
                if (newPhoto != null && !newPhoto.equals(student.getPhotoUrl())) {
                    student.setPhotoUrl(newPhoto);
                    student.setUpdatedAt(System.currentTimeMillis());
                    studentRepository.save(uid, student);
                }
                return ResponseEntity.ok(student);
            }

            String fullName = body.getOrDefault("name", "Student");

            // Default admin email — auto-promote to ADMIN
            String DEFAULT_ADMIN_EMAIL = "sjeswanth1205@gmail.com";
            String role = DEFAULT_ADMIN_EMAIL.equalsIgnoreCase(email) ? "ADMIN" : body.getOrDefault("role", "STUDENT");

            Student student = new Student();
            student.setUid(uid);
            student.setEmail(email);
            student.setName(fullName);
            student.setRole(role);
            student.setPhotoUrl(body.get("photoUrl"));
            student.setCreatedAt(System.currentTimeMillis());
            student.setUpdatedAt(System.currentTimeMillis());

            // Try to split full name into first/last for Google sign-in
            if (fullName.contains(" ")) {
                int spaceIdx = fullName.indexOf(' ');
                student.setFirstName(fullName.substring(0, spaceIdx));
                student.setLastName(fullName.substring(spaceIdx + 1));
            } else {
                student.setFirstName(fullName);
                student.setLastName("");
            }

            studentRepository.save(uid, student);
            return ResponseEntity.ok(student);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to register profile: " + e.getMessage()));
        }
    }

    /**
     * Get current student's profile from Firestore.
     */
    @GetMapping("/me")
    public ResponseEntity<?> getMe(Authentication authentication) {
        try {
            String uid = (String) authentication.getPrincipal();
            return studentRepository.findByUid(uid)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // Firebase token revocation is optional; frontend just discards the token
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
}
