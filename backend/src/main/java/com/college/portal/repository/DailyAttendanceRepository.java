package com.college.portal.repository;

import com.college.portal.model.DailyAttendance;
import com.google.cloud.firestore.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Repository
@RequiredArgsConstructor
public class DailyAttendanceRepository {

    private final Firestore firestore;
    private static final String COLLECTION = "daily_attendance";

    public List<DailyAttendance> findByStudentIdAndDate(String studentId, String date)
            throws ExecutionException, InterruptedException {
        QuerySnapshot snapshot = firestore.collection(COLLECTION)
                .whereEqualTo("studentId", studentId)
                .whereEqualTo("attendanceDate", date)
                .orderBy("periodNo")
                .get().get();
        List<DailyAttendance> list = new ArrayList<>();
        for (DocumentSnapshot doc : snapshot.getDocuments()) {
            DailyAttendance da = doc.toObject(DailyAttendance.class);
            if (da != null) {
                da.setId(doc.getId());
                list.add(da);
            }
        }
        return list;
    }

    public List<DailyAttendance> findByStudentId(String studentId)
            throws ExecutionException, InterruptedException {
        QuerySnapshot snapshot = firestore.collection(COLLECTION)
                .whereEqualTo("studentId", studentId)
                .orderBy("attendanceDate", Query.Direction.DESCENDING)
                .orderBy("periodNo")
                .get().get();
        List<DailyAttendance> list = new ArrayList<>();
        for (DocumentSnapshot doc : snapshot.getDocuments()) {
            DailyAttendance da = doc.toObject(DailyAttendance.class);
            if (da != null) {
                da.setId(doc.getId());
                list.add(da);
            }
        }
        return list;
    }

    public void save(DailyAttendance da) throws ExecutionException, InterruptedException {
        if (da.getId() != null && !da.getId().isEmpty()) {
            firestore.collection(COLLECTION).document(da.getId()).set(da).get();
        } else {
            DocumentReference ref = firestore.collection(COLLECTION).document();
            da.setId(ref.getId());
            ref.set(da).get();
        }
    }
}
