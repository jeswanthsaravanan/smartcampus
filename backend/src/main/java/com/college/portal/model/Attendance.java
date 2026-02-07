package com.college.portal.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "attendance")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Attendance {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private Student student;
    
    @Column(nullable = false, length = 100)
    private String subject;
    
    @Column(name = "total_days", nullable = false)
    private Integer totalDays;
    
    @Column(name = "present_days", nullable = false)
    private Integer presentDays;
    
    @Column(precision = 5, scale = 2)
    private BigDecimal percentage;
    
    @PrePersist
    @PreUpdate
    public void calculatePercentage() {
        if (totalDays != null && totalDays > 0 && presentDays != null) {
            this.percentage = BigDecimal.valueOf(
                (presentDays * 100.0) / totalDays
            ).setScale(2, java.math.RoundingMode.HALF_UP);
        }
    }
}
