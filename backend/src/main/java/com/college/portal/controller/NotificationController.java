package com.college.portal.controller;

import com.college.portal.model.Notification;
import com.college.portal.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    
    private final NotificationRepository notificationRepository;
    
    @GetMapping
    public ResponseEntity<?> getNotifications() {
        List<Notification> notifications = notificationRepository.findByIsActiveTrueOrderByCreatedAtDesc();
        
        return ResponseEntity.ok(notifications.stream().map(this::mapToDto).toList());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getNotification(@PathVariable Long id) {
        return notificationRepository.findById(id)
                .map(n -> ResponseEntity.ok(mapToDto(n)))
                .orElse(ResponseEntity.notFound().build());
    }
    
    private Map<String, Object> mapToDto(Notification n) {
        return Map.of(
                "id", n.getId(),
                "title", n.getTitle(),
                "message", n.getMessage(),
                "date", n.getCreatedAt().toLocalDate().toString(),
                "time", n.getCreatedAt().toLocalTime().toString()
        );
    }
}
