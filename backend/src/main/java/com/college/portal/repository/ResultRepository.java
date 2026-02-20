package com.college.portal.repository;

import com.college.portal.model.Result;
import com.google.cloud.firestore.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Repository
@RequiredArgsConstructor
public class ResultRepository {

    private final Firestore firestore;
    private static final String COLLECTION = "results";

    public List<Result> findByStudentId(String studentId) throws ExecutionException, InterruptedException {
        QuerySnapshot snapshot = firestore.collection(COLLECTION)
                .whereEqualTo("studentId", studentId)
                .get().get();
        List<Result> list = new ArrayList<>();
        for (DocumentSnapshot doc : snapshot.getDocuments()) {
            Result r = doc.toObject(Result.class);
            if (r != null) {
                r.setId(doc.getId());
                list.add(r);
            }
        }
        return list;
    }

    public void save(Result result) throws ExecutionException, InterruptedException {
        if (result.getId() != null && !result.getId().isEmpty()) {
            firestore.collection(COLLECTION).document(result.getId()).set(result).get();
        } else {
            DocumentReference ref = firestore.collection(COLLECTION).document();
            result.setId(ref.getId());
            ref.set(result).get();
        }
    }

    public List<Result> findAll() throws ExecutionException, InterruptedException {
        QuerySnapshot snapshot = firestore.collection(COLLECTION).get().get();
        List<Result> list = new ArrayList<>();
        for (DocumentSnapshot doc : snapshot.getDocuments()) {
            Result r = doc.toObject(Result.class);
            if (r != null) {
                r.setId(doc.getId());
                list.add(r);
            }
        }
        return list;
    }

    public void deleteById(String id) throws ExecutionException, InterruptedException {
        firestore.collection(COLLECTION).document(id).delete().get();
    }
}
