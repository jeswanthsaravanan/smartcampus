package com.college.portal.repository;

import com.college.portal.model.Subject;
import com.google.cloud.firestore.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

@Repository
@RequiredArgsConstructor
public class SubjectRepository {

    private final Firestore firestore;
    private static final String COLLECTION = "subjects";

    public List<Subject> findAll() throws ExecutionException, InterruptedException {
        QuerySnapshot snapshot = firestore.collection(COLLECTION).get().get();
        List<Subject> list = new ArrayList<>();
        for (DocumentSnapshot doc : snapshot.getDocuments()) {
            Subject s = doc.toObject(Subject.class);
            if (s != null) {
                s.setId(doc.getId());
                list.add(s);
            }
        }
        return list;
    }

    public Optional<Subject> findByCode(String code) throws ExecutionException, InterruptedException {
        QuerySnapshot snapshot = firestore.collection(COLLECTION)
                .whereEqualTo("code", code)
                .limit(1)
                .get().get();
        if (!snapshot.isEmpty()) {
            Subject s = snapshot.getDocuments().get(0).toObject(Subject.class);
            s.setId(snapshot.getDocuments().get(0).getId());
            return Optional.of(s);
        }
        return Optional.empty();
    }

    public void save(Subject subject) throws ExecutionException, InterruptedException {
        if (subject.getId() != null && !subject.getId().isEmpty()) {
            firestore.collection(COLLECTION).document(subject.getId()).set(subject).get();
        } else {
            DocumentReference ref = firestore.collection(COLLECTION).document();
            subject.setId(ref.getId());
            ref.set(subject).get();
        }
    }
}
