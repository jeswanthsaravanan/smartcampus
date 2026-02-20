package com.college.portal.repository;

import com.college.portal.model.Timetable;
import com.google.cloud.firestore.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Repository
@RequiredArgsConstructor
public class TimetableRepository {

    private final Firestore firestore;
    private static final String COLLECTION = "timetable";

    private static final List<String> DAY_ORDER = List.of(
            "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY");

    private Timetable fromDoc(DocumentSnapshot doc) {
        Timetable t = doc.toObject(Timetable.class);
        if (t != null)
            t.setId(doc.getId());
        return t;
    }

    private List<Timetable> toList(QuerySnapshot snapshot) {
        List<Timetable> list = new ArrayList<>();
        for (DocumentSnapshot doc : snapshot.getDocuments()) {
            Timetable t = fromDoc(doc);
            if (t != null)
                list.add(t);
        }
        list.sort(Comparator.comparingInt((Timetable t) -> {
            int idx = DAY_ORDER.indexOf(t.getDayOfWeek());
            return idx >= 0 ? idx : 99;
        }).thenComparingInt(Timetable::getPeriodNo));
        return list;
    }

    public List<Timetable> findByStudentId(String studentId) throws ExecutionException, InterruptedException {
        QuerySnapshot snapshot = firestore.collection(COLLECTION)
                .whereEqualTo("studentId", studentId)
                .get().get();
        return toList(snapshot);
    }

    public List<Timetable> findByStudentIdAndDayOfWeek(String studentId, String day)
            throws ExecutionException, InterruptedException {
        QuerySnapshot snapshot = firestore.collection(COLLECTION)
                .whereEqualTo("studentId", studentId)
                .whereEqualTo("dayOfWeek", day.toUpperCase())
                .get().get();
        return toList(snapshot);
    }

    public void save(Timetable timetable) throws ExecutionException, InterruptedException {
        if (timetable.getId() != null && !timetable.getId().isEmpty()) {
            firestore.collection(COLLECTION).document(timetable.getId()).set(timetable).get();
        } else {
            DocumentReference ref = firestore.collection(COLLECTION).document();
            timetable.setId(ref.getId());
            ref.set(timetable).get();
        }
    }

    public List<Timetable> findAll() throws ExecutionException, InterruptedException {
        QuerySnapshot snapshot = firestore.collection(COLLECTION).get().get();
        return toList(snapshot);
    }

    public List<Timetable> findByDayOfWeek(String day) throws ExecutionException, InterruptedException {
        QuerySnapshot snapshot = firestore.collection(COLLECTION)
                .whereEqualTo("dayOfWeek", day.toUpperCase())
                .get().get();
        return toList(snapshot);
    }

    public void deleteById(String id) throws ExecutionException, InterruptedException {
        firestore.collection(COLLECTION).document(id).delete().get();
    }
}
