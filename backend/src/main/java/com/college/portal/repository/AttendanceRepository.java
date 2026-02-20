package com.college.portal.repository;

import com.college.portal.model.Attendance;
import com.google.cloud.firestore.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Repository
@RequiredArgsConstructor
public class AttendanceRepository {

    private final Firestore firestore;
    private static final String COLLECTION = "attendance";

    public List<Attendance> findByStudentId(String studentId) throws ExecutionException, InterruptedException {
        QuerySnapshot snapshot = firestore.collection(COLLECTION)
                .whereEqualTo("studentId", studentId)
                .get().get();
        List<Attendance> list = new ArrayList<>();
        for (DocumentSnapshot doc : snapshot.getDocuments()) {
            Attendance a = doc.toObject(Attendance.class);
            if (a != null) {
                a.setId(doc.getId());
                list.add(a);
            }
        }
        return list;
    }

    public void save(Attendance attendance) throws ExecutionException, InterruptedException {
        // Compute percentage before saving
        if (attendance.getTotalDays() != null && attendance.getTotalDays() > 0
                && attendance.getPresentDays() != null) {
            double pct = (attendance.getPresentDays() * 100.0) / attendance.getTotalDays();
            attendance.setPercentage(Math.round(pct * 100.0) / 100.0);
        }
        if (attendance.getId() != null && !attendance.getId().isEmpty()) {
            firestore.collection(COLLECTION).document(attendance.getId()).set(attendance).get();
        } else {
            DocumentReference ref = firestore.collection(COLLECTION).document();
            attendance.setId(ref.getId());
            ref.set(attendance).get();
        }
    }

    public List<Attendance> findAll() throws ExecutionException, InterruptedException {
        QuerySnapshot snapshot = firestore.collection(COLLECTION).get().get();
        List<Attendance> list = new ArrayList<>();
        for (DocumentSnapshot doc : snapshot.getDocuments()) {
            Attendance a = doc.toObject(Attendance.class);
            if (a != null) {
                a.setId(doc.getId());
                list.add(a);
            }
        }
        return list;
    }

    public void deleteById(String id) throws ExecutionException, InterruptedException {
        firestore.collection(COLLECTION).document(id).delete().get();
    }
}
