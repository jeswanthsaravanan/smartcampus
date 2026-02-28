const express = require('express');
const admin = require('firebase-admin');
const authenticate = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);

/**
 * GET /api/student/profile
 */
router.get('/profile', async (req, res) => {
    try {
        const db = admin.firestore();
        const doc = await db.collection('students').doc(req.user.uid).get();

        if (!doc.exists) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        return res.json(doc.data());
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

/**
 * PUT /api/student/profile
 * Partial update — only provided fields are changed.
 */
router.put('/profile', async (req, res) => {
    try {
        const uid = req.user.uid;
        const db = admin.firestore();
        const docRef = db.collection('students').doc(uid);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        const student = doc.data();
        const body = req.body;

        const updates = {};
        if (body.firstName !== undefined) { student.firstName = body.firstName; updates.firstName = body.firstName; }
        if (body.lastName !== undefined) { student.lastName = body.lastName; updates.lastName = body.lastName; }
        if (body.registerNumber !== undefined) updates.registerNumber = body.registerNumber;
        if (body.department !== undefined) updates.department = body.department;
        if (body.batch !== undefined) updates.batch = body.batch;
        if (body.year !== undefined) updates.year = typeof body.year === 'string' ? parseInt(body.year) : body.year;
        if (body.photoUrl !== undefined) updates.photoUrl = body.photoUrl;

        // Update display name from first+last
        let displayName = '';
        const fn = updates.firstName || student.firstName || '';
        const ln = updates.lastName || student.lastName || '';
        displayName = (fn + ' ' + ln).trim();
        updates.name = displayName;
        updates.updatedAt = Date.now();

        await docRef.update(updates);
        const updated = (await docRef.get()).data();
        return res.json(updated);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to update profile: ' + err.message });
    }
});

module.exports = router;
