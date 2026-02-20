package com.college.portal.repository;

import com.college.portal.model.Notification;
import com.google.cloud.firestore.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Repository
@RequiredArgsConstructor
public class NotificationRepository {

    private final Firestore firestore;
    private static final String COLLECTION = "notifications";

    public List<Notification> findByIsActiveTrue() throws ExecutionException, InterruptedException {
        QuerySnapshot snapshot = firestore.collection(COLLECTION)
                .whereEqualTo("isActive", true)
                .orderBy("createdAt", Query.Direction.DESCENDING)
                .get().get();
        List<Notification> list = new ArrayList<>();
        for (DocumentSnapshot doc : snapshot.getDocuments()) {
            Notification n = doc.toObject(Notification.class);
            if (n != null) {
                n.setId(doc.getId());
                list.add(n);
            }
        }
        return list;
    }

    public void save(Notification notification) throws ExecutionException, InterruptedException {
        if (notification.getId() != null && !notification.getId().isEmpty()) {
            firestore.collection(COLLECTION).document(notification.getId()).set(notification).get();
        } else {
            DocumentReference ref = firestore.collection(COLLECTION).document();
            notification.setId(ref.getId());
            ref.set(notification).get();
        }
    }

    public List<Notification> findAll() throws ExecutionException, InterruptedException {
        QuerySnapshot snapshot = firestore.collection(COLLECTION)
                .orderBy("createdAt", Query.Direction.DESCENDING)
                .get().get();
        List<Notification> list = new ArrayList<>();
        for (DocumentSnapshot doc : snapshot.getDocuments()) {
            Notification n = doc.toObject(Notification.class);
            if (n != null) {
                n.setId(doc.getId());
                list.add(n);
            }
        }
        return list;
    }

    public void deleteById(String id) throws ExecutionException, InterruptedException {
        firestore.collection(COLLECTION).document(id).delete().get();
    }
}
