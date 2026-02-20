package com.college.portal.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Plain POJO - maps to Firestore 'timetable' collection.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Timetable {
    private String id; // Firestore document ID
    private String studentId; // Firebase Auth UID
    private String dayOfWeek; // e.g. "MONDAY"
    private Integer periodNo;
    private String startTime; // "09:00"
    private String endTime; // "09:50"
    private String subject; // subject code e.g. "22EC601"
    private String staffName;
}
