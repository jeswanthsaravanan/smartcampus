package com.college.portal.controller;

import com.college.portal.model.Notification;
import com.college.portal.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository notificationRepository;

    @GetMapping
    public ResponseEntity<?> getNotifications() {
        try {
            List<Notification> notifications = notificationRepository.findByIsActiveTrue();
            return ResponseEntity.ok(notifications.stream().map(this::mapToDto).toList());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getNotification(@PathVariable String id) {
        try {
            return notificationRepository.findByIsActiveTrue().stream()
                    .filter(n -> id.equals(n.getId()))
                    .findFirst()
                    .map(n -> ResponseEntity.ok(mapToDto(n)))
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    private Map<String, Object> mapToDto(Notification n) {
        LocalDateTime dt = n.getCreatedAt() != null
                ? LocalDateTime.ofInstant(Instant.ofEpochMilli(n.getCreatedAt()), ZoneId.systemDefault())
                : LocalDateTime.now();
        return Map.of(
                "id", n.getId() != null ? n.getId() : "",
                "title", n.getTitle() != null ? n.getTitle() : "",
                "message", n.getMessage() != null ? n.getMessage() : "",
                "date", dt.toLocalDate().toString(),
                "time", dt.toLocalTime().toString());
    }
}
