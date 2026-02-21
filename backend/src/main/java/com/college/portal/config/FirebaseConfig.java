package com.college.portal.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@Configuration
public class FirebaseConfig {

    @Value("${firebase.credentials.path}")
    private String credentialsPath;

    @Bean
    public FirebaseApp firebaseApp() throws IOException {
        if (!FirebaseApp.getApps().isEmpty()) {
            return FirebaseApp.getInstance();
        }

        InputStream serviceAccount = getClass().getClassLoader()
                .getResourceAsStream(credentialsPath);

        FirebaseOptions options;

        // 1. Check for Environment Variable (Render.com, etc.)
        String envCredentials = System.getenv("FIREBASE_CREDENTIALS");

        if (envCredentials != null && !envCredentials.trim().isEmpty()) {
            System.out.println("Using FIREBASE_CREDENTIALS environment variable for Firebase...");
            InputStream stream = new ByteArrayInputStream(envCredentials.getBytes(StandardCharsets.UTF_8));
            options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(stream))
                    .build();
        }
        // 2. Check for local file (Local Development)
        else if (serviceAccount != null) {
            System.out.println("Using local serviceAccountKey.json for Firebase...");
            options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();
        }
        // 3. Fallback to Google Default (Google Cloud Run)
        else {
            System.out.println(
                    "No serviceAccountKey.json or ENV found. Falling back to Google Application Default Credentials...");
            options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.getApplicationDefault())
                    .setProjectId("smartcampus0512")
                    .build();
        }

        return FirebaseApp.initializeApp(options);
    }

    @Bean
    public Firestore firestore(FirebaseApp firebaseApp) {
        return FirestoreClient.getFirestore(firebaseApp);
    }
}
