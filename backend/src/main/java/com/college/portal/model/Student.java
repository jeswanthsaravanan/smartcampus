package com.college.portal.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Plain POJO - maps to Firestore 'students' collection.
 * Document ID = Firebase Auth UID.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student {
    private String uid; // Firebase Auth UID (document ID)
    private String firstName;
    private String lastName;
    private String name; // kept for backward compatibility (display name)
    private String email;
    private String role; // "STUDENT" or "ADMIN"
    private String registerNumber;
    private String department;
    private String batch; // e.g. "2023-2027"
    private Integer year; // current year of study e.g. 1,2,3,4
    private String photoUrl; // Google profile photo URL
    private Long createdAt; // epoch millis
    private Long updatedAt; // epoch millis
}
