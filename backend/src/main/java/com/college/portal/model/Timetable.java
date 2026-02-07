package com.college.portal.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalTime;

@Entity
@Table(name = "timetable")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Timetable {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private Student student;
    
    @Column(name = "day_of_week", nullable = false, length = 15)
    private String dayOfWeek;
    
    @Column(name = "period_no", nullable = false)
    private Integer periodNo;
    
    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;
    
    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;
    
    @Column(nullable = false, length = 100)
    private String subject;
    
    @Column(name = "staff_name", nullable = false, length = 100)
    private String staffName;
}
