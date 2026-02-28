const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Load .env file in development
dotenv.config();

// ─── Firebase Admin SDK Initialization ───────────────────────────
function initializeFirebase() {
    if (admin.apps.length > 0) return;

    // 1. Check for FIREBASE_CREDENTIALS environment variable (Render, Railway, etc.)
    const envCredentials = process.env.FIREBASE_CREDENTIALS;
    if (envCredentials && envCredentials.trim()) {
        console.log('Using FIREBASE_CREDENTIALS environment variable for Firebase...');
        const serviceAccount = JSON.parse(envCredentials);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
        return;
    }

    // 2. Check for local serviceAccountKey.json file (local development)
    const localKeyPath = path.join(__dirname, 'serviceAccountKey.json');
    if (fs.existsSync(localKeyPath)) {
        console.log('Using local serviceAccountKey.json for Firebase...');
        const serviceAccount = require(localKeyPath);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
        return;
    }

    // 3. Fallback to Google Application Default Credentials
    console.log('No serviceAccountKey.json or ENV found. Falling back to Google Application Default Credentials...');
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: 'smartcampus0512',
    });
}

initializeFirebase();

// ─── Express App Setup ───────────────────────────────────────────
const app = express();

// CORS
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:3000').split(',');
app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['*'],
    credentials: true,
    maxAge: 3600,
}));

// Body parser
app.use(express.json());

// ─── Routes ──────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/timetable', require('./routes/timetable'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/results', require('./routes/results'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/student', require('./routes/student'));
app.use('/api/admin', require('./routes/admin').setupRouter);
app.use('/api/admin', require('./routes/admin'));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Start Server ────────────────────────────────────────────────
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
