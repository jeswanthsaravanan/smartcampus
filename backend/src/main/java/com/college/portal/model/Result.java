package com.college.portal.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Plain POJO - maps to Firestore 'results' collection.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Result {
    private String id; // Firestore document ID
    private String studentId; // Firebase Auth UID
    private String subject; // subject code
    private String subjectName; // human-readable name
    private Integer marks;
    private Integer maxMarks;
    private String grade;
    private String semester;
}
