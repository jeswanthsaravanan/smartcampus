const express = require('express');
const admin = require('firebase-admin');
const authenticate = require('../middleware/auth');
const adminCheck = require('../middleware/adminCheck');

const router = express.Router();
router.use(authenticate);
router.use(adminCheck);

// ============================================================
// TIMETABLE CRUD
// ============================================================

router.get('/timetable', async (req, res) => {
    try {
        const db = admin.firestore();
        let query = db.collection('timetable');
        if (req.query.day) {
            query = query.where('dayOfWeek', '==', req.query.day.toUpperCase());
        }
        const snapshot = await query.get();
        const entries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return res.json(entries);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.post('/timetable', async (req, res) => {
    try {
        const db = admin.firestore();
        const entry = req.body;
        delete entry.id;
        const ref = await db.collection('timetable').add(entry);
        return res.json({ id: ref.id, ...entry });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.put('/timetable/:id', async (req, res) => {
    try {
        const db = admin.firestore();
        const entry = req.body;
        entry.id = req.params.id;
        await db.collection('timetable').doc(req.params.id).set(entry);
        return res.json(entry);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.delete('/timetable/:id', async (req, res) => {
    try {
        const db = admin.firestore();
        await db.collection('timetable').doc(req.params.id).delete();
        return res.json({ message: 'Deleted successfully' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// ============================================================
// RESULTS CRUD
// ============================================================

router.get('/results', async (req, res) => {
    try {
        const db = admin.firestore();
        const snapshot = await db.collection('results').get();
        const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return res.json(results);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.post('/results', async (req, res) => {
    try {
        const db = admin.firestore();
        const result = req.body;
        delete result.id;
        const ref = await db.collection('results').add(result);
        return res.json({ id: ref.id, ...result });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.put('/results/:id', async (req, res) => {
    try {
        const db = admin.firestore();
        const result = req.body;
        result.id = req.params.id;
        await db.collection('results').doc(req.params.id).set(result);
        return res.json(result);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.delete('/results/:id', async (req, res) => {
    try {
        const db = admin.firestore();
        await db.collection('results').doc(req.params.id).delete();
        return res.json({ message: 'Deleted successfully' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// ============================================================
// ATTENDANCE CRUD
// ============================================================

router.get('/attendance', async (req, res) => {
    try {
        const db = admin.firestore();
        const snapshot = await db.collection('attendance').get();
        const records = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return res.json(records);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.post('/attendance', async (req, res) => {
    try {
        const db = admin.firestore();
        const record = req.body;
        delete record.id;
        const ref = await db.collection('attendance').add(record);
        return res.json({ id: ref.id, ...record });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.put('/attendance/:id', async (req, res) => {
    try {
        const db = admin.firestore();
        const record = req.body;
        record.id = req.params.id;
        await db.collection('attendance').doc(req.params.id).set(record);
        return res.json(record);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.delete('/attendance/:id', async (req, res) => {
    try {
        const db = admin.firestore();
        await db.collection('attendance').doc(req.params.id).delete();
        return res.json({ message: 'Deleted successfully' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// ============================================================
// NOTIFICATIONS CRUD
// ============================================================

router.get('/notifications', async (req, res) => {
    try {
        const db = admin.firestore();
        const snapshot = await db.collection('notifications').get();
        const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return res.json(notifications);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.post('/notifications', async (req, res) => {
    try {
        const db = admin.firestore();
        const notification = req.body;
        delete notification.id;
        if (!notification.createdAt) notification.createdAt = Date.now();
        if (notification.isActive === undefined) notification.isActive = true;
        const ref = await db.collection('notifications').add(notification);
        return res.json({ id: ref.id, ...notification });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.put('/notifications/:id', async (req, res) => {
    try {
        const db = admin.firestore();
        const notification = req.body;
        notification.id = req.params.id;
        await db.collection('notifications').doc(req.params.id).set(notification);
        return res.json(notification);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.delete('/notifications/:id', async (req, res) => {
    try {
        const db = admin.firestore();
        await db.collection('notifications').doc(req.params.id).delete();
        return res.json({ message: 'Deleted successfully' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// ============================================================
// USER / ADMIN MANAGEMENT
// ============================================================

router.get('/users', async (req, res) => {
    try {
        const db = admin.firestore();
        const snapshot = await db.collection('students').get();
        const users = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
        return res.json(users);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.put('/users/:uid/role', async (req, res) => {
    try {
        const db = admin.firestore();
        const targetUid = req.params.uid;
        const docRef = db.collection('students').doc(targetUid);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: 'User not found' });
        }

        const newRole = (req.body.role || 'STUDENT').toUpperCase();
        if (newRole !== 'ADMIN' && newRole !== 'STUDENT') {
            return res.status(400).json({ error: 'Invalid role. Use ADMIN or STUDENT' });
        }

        await docRef.update({ role: newRole, updatedAt: Date.now() });
        const updated = (await docRef.get()).data();
        return res.json({ uid: targetUid, ...updated });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Check admin status (this endpoint still uses adminCheck middleware,
// so if we reach here, the user IS admin)
router.get('/check', (req, res) => {
    return res.json({ isAdmin: true });
});

// ============================================================
// FIRST-TIME ADMIN SETUP
// (We need to bypass the adminCheck for this one)
// ============================================================
// Note: This is handled separately below, before the adminCheck middleware

// ============================================================
// SEED ALL DATA
// ============================================================

router.post('/seed', async (req, res) => {
    try {
        const uid = req.user.uid;
        const db = admin.firestore();
        let count = 0;

        // ---- TIMETABLE ----
        const timetableData = [
            // MONDAY
            ['MONDAY', 1, '08:30', '09:30', 'ET3491 FIOT', 'Ms. Tanaya Kanungo, AP/ECE'],
            ['MONDAY', 2, '09:30', '10:25', 'CEC348 RS', 'Mr. G. Thavaseelan, AP/ECE'],
            ['MONDAY', 3, '10:35', '11:30', 'CEC348 RS', 'Mr. G. Thavaseelan, AP/ECE'],
            ['MONDAY', 4, '11:30', '12:25', 'CEC365 WSN', 'Mr. E. Madhan Kumar, AP/ECE'],
            ['MONDAY', 5, '13:15', '14:10', 'CS3491 AIML', 'Ms. B. Devi, AP/AI&DS'],
            ['MONDAY', 6, '14:10', '15:05', 'ET3491 FIOT LAB', 'Ms. Tanaya Kanungo, AP/ECE'],
            ['MONDAY', 7, '15:05', '16:00', 'ET3491 FIOT LAB', 'Ms. Tanaya Kanungo, AP/ECE'],
            // TUESDAY
            ['TUESDAY', 1, '08:30', '09:30', 'CEC365 WSN', 'Mr. E. Madhan Kumar, AP/ECE'],
            ['TUESDAY', 2, '09:30', '10:25', 'ET3491 FIOT', 'Ms. Tanaya Kanungo, AP/ECE'],
            ['TUESDAY', 3, '10:35', '11:30', 'OEE351 RES', 'Mr. S. Jebanani, AP/MECH'],
            ['TUESDAY', 4, '11:30', '12:25', 'MX3089 IS', 'Mr. M. Nanachivayam, AP/EEE'],
            ['TUESDAY', 5, '13:15', '14:10', 'CEC333 AWCT', 'Ms. M.P. Nirmala, AP/ECE'],
            ['TUESDAY', 6, '14:10', '15:05', 'CS3491 AIML LAB', 'Ms. B. Devi, AP/AI&DS'],
            ['TUESDAY', 7, '15:05', '16:00', 'CS3491 AIML LAB', 'Ms. B. Devi, AP/AI&DS'],
            // WEDNESDAY
            ['WEDNESDAY', 1, '08:30', '09:30', 'OEE351 RES', 'Mr. S. Jebanani, AP/MECH'],
            ['WEDNESDAY', 2, '09:30', '10:25', 'CEC333 AWCT', 'Ms. M.P. Nirmala, AP/ECE'],
            ['WEDNESDAY', 3, '10:35', '11:30', 'CS3491 AIML', 'Ms. B. Devi, AP/AI&DS'],
            ['WEDNESDAY', 4, '11:30', '12:25', 'CS3491 AIML', 'Ms. B. Devi, AP/AI&DS'],
            ['WEDNESDAY', 5, '13:15', '14:10', 'CEC348 RS', 'Mr. G. Thavaseelan, AP/ECE'],
            ['WEDNESDAY', 6, '14:10', '15:05', 'CEC348 RS', 'Mr. G. Thavaseelan, AP/ECE'],
            ['WEDNESDAY', 7, '15:05', '16:00', 'CEC365 WSN', 'Mr. E. Madhan Kumar, AP/ECE'],
            // THURSDAY
            ['THURSDAY', 1, '08:30', '09:30', 'CEC333 AWCT', 'Ms. M.P. Nirmala, AP/ECE'],
            ['THURSDAY', 2, '09:30', '10:25', 'CS3491 AIML', 'Ms. B. Devi, AP/AI&DS'],
            ['THURSDAY', 3, '10:35', '11:30', 'CEC333 AWCT', 'Ms. M.P. Nirmala, AP/ECE'],
            ['THURSDAY', 4, '11:30', '12:25', 'ET3491 FIOT', 'Ms. Tanaya Kanungo, AP/ECE'],
            ['THURSDAY', 5, '13:15', '14:10', 'OEE351 RES', 'Mr. S. Jebanani, AP/MECH'],
            ['THURSDAY', 6, '14:10', '15:05', 'CEC365 WSN', 'Mr. E. Madhan Kumar, AP/ECE'],
            ['THURSDAY', 7, '15:05', '16:00', 'MX3089 IS', 'Mr. M. Nanachivayam, AP/EEE'],
            // FRIDAY
            ['FRIDAY', 1, '08:30', '09:30', 'CEC348 RS', 'Mr. G. Thavaseelan, AP/ECE'],
            ['FRIDAY', 2, '09:30', '10:25', 'CEC333 AWCT', 'Ms. M.P. Nirmala, AP/ECE'],
            ['FRIDAY', 3, '10:35', '12:25', 'PT', '-'],
            ['FRIDAY', 5, '13:15', '14:10', 'MX3089 IS', 'Mr. M. Nanachivayam, AP/EEE'],
            ['FRIDAY', 6, '14:10', '15:05', 'OEE351 RES', 'Mr. S. Jebanani, AP/MECH'],
            ['FRIDAY', 7, '15:05', '16:00', 'CEC365 WSN', 'Mr. E. Madhan Kumar, AP/ECE'],
            // SATURDAY
            ['SATURDAY', 1, '08:30', '09:30', 'ET3491 FIOT', 'Ms. Tanaya Kanungo, AP/ECE'],
            ['SATURDAY', 2, '09:30', '10:25', 'LIB', '-'],
            ['SATURDAY', 3, '10:35', '12:25', 'Mini project/ Counseling', '-'],
            ['SATURDAY', 5, '13:15', '14:10', 'OEE351 RES', 'Mr. S. Jebanani, AP/MECH'],
            ['SATURDAY', 6, '14:10', '15:05', 'CEC365 WSN', 'Mr. E. Madhan Kumar, AP/ECE'],
        ];

        for (const [dayOfWeek, periodNo, startTime, endTime, subject, staffName] of timetableData) {
            await db.collection('timetable').add({
                studentId: uid, dayOfWeek, periodNo, startTime, endTime, subject, staffName,
            });
            count++;
        }

        // ---- RESULTS ----
        const resultsData = [
            ['CEC348', 'Remote Sensing', 85, 'A', 'Semester 6'],
            ['CEC365', 'Wireless Sensor Network', 78, 'B+', 'Semester 6'],
            ['ET3491', 'Embedded Systems', 92, 'A+', 'Semester 6'],
            ['CS3491', 'Artificial Intelligence', 71, 'B', 'Semester 6'],
            ['CEC333', 'Advanced Wireless', 88, 'A', 'Semester 6'],
            ['OEE351', 'Renewable Energy', 76, 'B+', 'Semester 6'],
            ['MX3089', 'Industry Safety', 82, 'A', 'Semester 6'],
        ];

        for (const [subject, subjectName, marks, grade, semester] of resultsData) {
            await db.collection('results').add({
                studentId: uid, subject, subjectName, marks, maxMarks: 100, grade, semester,
            });
            count++;
        }

        // ---- ATTENDANCE ----
        const attendanceData = [
            ['Remote Sensing', 40, 35],
            ['Wireless Sensor Network', 38, 30],
            ['Embedded Systems', 42, 40],
            ['Advanced Wireless', 35, 28],
            ['Artificial Intelligence', 40, 32],
            ['Renewable Energy', 36, 30],
            ['Industry Safety', 34, 30],
        ];

        for (const [subject, totalDays, presentDays] of attendanceData) {
            const percentage = (presentDays * 100.0) / totalDays;
            await db.collection('attendance').add({
                studentId: uid, subject, totalDays, presentDays, percentage,
            });
            count++;
        }

        // ---- NOTIFICATIONS ----
        const notifData = [
            ['Mid-Semester Exams Schedule', 'Mid-semester examinations will commence from March 15, 2026. Detailed schedule will be posted on the notice board.'],
            ['Annual Sports Day', 'Annual Sports Day will be held on February 20, 2026. All students are encouraged to participate.'],
            ['Library Book Submission', 'All borrowed library books must be returned by February 28, 2026 to avoid late fees.'],
            ['Campus Placement Drive', 'Tech Giants Inc. will be conducting a placement drive on March 5, 2026. Interested students should register by February 25.'],
        ];

        for (const [title, message] of notifData) {
            await db.collection('notifications').add({
                title, message, createdAt: Date.now(), isActive: true,
            });
            count++;
        }

        return res.json({ message: 'All data seeded successfully!', records: count, uid });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// ============================================================
// CLEAR ALL DATA
// ============================================================

router.delete('/clear-all', async (req, res) => {
    try {
        const db = admin.firestore();
        let total = 0;

        const collections = ['timetable', 'results', 'attendance', 'notifications', 'dailyAttendance'];
        for (const name of collections) {
            const snapshot = await db.collection(name).get();
            const batch = db.batch();
            snapshot.docs.forEach(doc => batch.delete(doc.ref));
            if (!snapshot.empty) await batch.commit();
            total += snapshot.size;
        }

        return res.json({ message: 'All data cleared!', deletedRecords: total });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;

// ============================================================
// SETUP ENDPOINT (bypasses adminCheck)
// This is mounted separately in server.js if needed,
// but we handle it here with a separate un-protected router.
// ============================================================
// The setup endpoint is special — it needs auth but NOT adminCheck.
// We export it as a separate router.
module.exports.setupRouter = (() => {
    const setupRouter = express.Router();
    setupRouter.use(authenticate);

    setupRouter.post('/setup', async (req, res) => {
        try {
            const uid = req.user.uid;
            const db = admin.firestore();

            const snapshot = await db.collection('students').get();
            const allUsers = snapshot.docs.map(doc => doc.data());
            const hasAdmin = allUsers.some(s => (s.role || '').toUpperCase() === 'ADMIN');

            if (hasAdmin) {
                return res.status(400).json({ error: 'An admin already exists. Use the admin panel to manage roles.' });
            }

            const doc = await db.collection('students').doc(uid).get();
            if (!doc.exists) {
                return res.status(400).json({ error: 'Your profile not found. Please log in first.' });
            }

            await db.collection('students').doc(uid).update({
                role: 'ADMIN',
                updatedAt: Date.now(),
            });

            return res.json({ message: 'You are now an admin!', role: 'ADMIN', uid });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    });

    // Check endpoint without admin requirement
    setupRouter.get('/check', async (req, res) => {
        try {
            const db = admin.firestore();
            const doc = await db.collection('students').doc(req.user.uid).get();
            const isAdmin = doc.exists && (doc.data().role || '').toUpperCase() === 'ADMIN';
            return res.json({ isAdmin });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    });

    return setupRouter;
})();
