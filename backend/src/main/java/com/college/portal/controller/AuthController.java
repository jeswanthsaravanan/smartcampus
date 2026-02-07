package com.college.portal.controller;

import com.college.portal.dto.LoginRequest;
import com.college.portal.dto.LoginResponse;
import com.college.portal.model.Student;
import com.college.portal.repository.StudentRepository;
import com.college.portal.security.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        Student student = studentRepository.findByEmail(request.getEmail())
                .orElse(null);
        
        if (student == null || !passwordEncoder.matches(request.getPassword(), student.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid email or password"));
        }
        
        String token = jwtUtil.generateToken(
                student.getEmail(),
                student.getId(),
                student.getRole().name()
        );
        
        LoginResponse response = LoginResponse.builder()
                .id(student.getId())
                .name(student.getName())
                .email(student.getEmail())
                .role(student.getRole().name())
                .token(token)
                .build();
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // For stateless JWT, logout is handled client-side by removing the token
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
}
