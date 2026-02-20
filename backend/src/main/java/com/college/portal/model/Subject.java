package com.college.portal.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Plain POJO - maps to Firestore 'subjects' collection.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Subject {
    private String id; // Firestore document ID
    private String code; // e.g. "22EC601"
    private String name; // e.g. "Digital Signal Processing"
}
