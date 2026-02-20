package com.college.portal.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Plain POJO - maps to Firestore 'daily_attendance' collection.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DailyAttendance {
    private String id; // Firestore document ID
    private String studentId; // Firebase Auth UID
    private String attendanceDate; // "YYYY-MM-DD"
    private Integer periodNo;
    private String subject; // subject code
    private String status; // "Present" or "Absent"
    private String startTime; // "09:00"
    private String endTime; // "09:50"
}
