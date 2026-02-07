package com.college.portal.repository;

import com.college.portal.model.Timetable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TimetableRepository extends JpaRepository<Timetable, Long> {
    List<Timetable> findByStudentIdAndDayOfWeekOrderByPeriodNo(Long studentId, String dayOfWeek);
    List<Timetable> findByStudentIdOrderByDayOfWeekAscPeriodNoAsc(Long studentId);
}
