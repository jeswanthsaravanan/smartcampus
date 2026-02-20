package com.college.portal.repository;

import com.college.portal.model.Student;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

@Repository
@RequiredArgsConstructor
public class StudentRepository {

    private final Firestore firestore;
    private static final String COLLECTION = "students";

    public Optional<Student> findByUid(String uid) throws ExecutionException, InterruptedException {
        DocumentSnapshot doc = firestore.collection(COLLECTION).document(uid).get().get();
        if (doc.exists()) {
            return Optional.of(doc.toObject(Student.class));
        }
        return Optional.empty();
    }

    public Optional<Student> findByEmail(String email) throws ExecutionException, InterruptedException {
        QuerySnapshot snapshot = firestore.collection(COLLECTION)
                .whereEqualTo("email", email)
                .limit(1)
                .get().get();
        if (!snapshot.isEmpty()) {
            return Optional.of(snapshot.getDocuments().get(0).toObject(Student.class));
        }
        return Optional.empty();
    }

    public void save(String uid, Student student) throws ExecutionException, InterruptedException {
        student.setUid(uid);
        firestore.collection(COLLECTION).document(uid).set(student).get();
    }

    public List<Student> findAll() throws ExecutionException, InterruptedException {
        QuerySnapshot snapshot = firestore.collection(COLLECTION).get().get();
        List<Student> list = new java.util.ArrayList<>();
        for (DocumentSnapshot doc : snapshot.getDocuments()) {
            Student s = doc.toObject(Student.class);
            if (s != null) {
                s.setUid(doc.getId());
                list.add(s);
            }
        }
        return list;
    }
}
