package com.college.portal.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "results")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Result {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private Student student;
    
    @Column(nullable = false, length = 100)
    private String subject;
    
    @Column(nullable = false)
    private Integer marks;
    
    @Column(name = "max_marks")
    private Integer maxMarks = 100;
    
    @Column(length = 2)
    private String grade;
    
    @Column(length = 20)
    private String semester;
}
