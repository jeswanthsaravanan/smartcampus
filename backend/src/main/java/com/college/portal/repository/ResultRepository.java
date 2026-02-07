package com.college.portal.repository;

import com.college.portal.model.Result;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ResultRepository extends JpaRepository<Result, Long> {
    List<Result> findByStudentId(Long studentId);
    List<Result> findByStudentIdAndSemester(Long studentId, String semester);
}
