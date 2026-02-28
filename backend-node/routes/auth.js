const express = require('express');
const admin = require('firebase-admin');
const authenticate = require('../middleware/auth');

const router = express.Router();

// All auth routes use the authenticate middleware, but failures are handled gracefully
// (the Java backend permitted /api/auth/** but still ran the token filter)
router.use(authenticate);

/**
 * POST /api/auth/register-profile
 * Register or update student profile after Firebase login.
 * Body: { name, photoUrl, role? }
 */
router.post('/register-profile', async (req, res) => {
    try {
        const { uid, email } = req.user;
        const { name, photoUrl, role } = req.body;
        const db = admin.firestore();
        const docRef = db.collection('students').doc(uid);
        const doc = await docRef.get();

        if (doc.exists) {
            // Update photo URL if it changed
            const student = doc.data();
            if (photoUrl && photoUrl !== student.photoUrl) {
                await docRef.update({ photoUrl, updatedAt: Date.now() });
            }
            const updated = (await docRef.get()).data();
            return res.json({ uid, ...updated });
        }

        // New user — create profile
        const fullName = name || 'Student';
        const DEFAULT_ADMIN_EMAIL = 'sjeswanth1205@gmail.com';
        const assignedRole = DEFAULT_ADMIN_EMAIL.toLowerCase() === email.toLowerCase()
            ? 'ADMIN'
            : (role || 'STUDENT');

        let firstName = fullName;
        let lastName = '';
        if (fullName.includes(' ')) {
            const spaceIdx = fullName.indexOf(' ');
            firstName = fullName.substring(0, spaceIdx);
            lastName = fullName.substring(spaceIdx + 1);
        }

        const student = {
            uid,
            email,
            name: fullName,
            firstName,
            lastName,
            role: assignedRole,
            photoUrl: photoUrl || null,
            registerNumber: null,
            department: null,
            batch: null,
            year: null,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };

        await docRef.set(student);
        return res.json(student);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to register profile: ' + err.message });
    }
});

/**
 * GET /api/auth/me
 * Get current student's profile from Firestore.
 */
router.get('/me', async (req, res) => {
    try {
        const db = admin.firestore();
        const doc = await db.collection('students').doc(req.user.uid).get();

        if (!doc.exists) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        return res.json({ uid: req.user.uid, ...doc.data() });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

/**
 * POST /api/auth/logout
 * No-op — frontend discards the token.
 */
router.post('/logout', (req, res) => {
    return res.json({ message: 'Logged out successfully' });
});

module.exports = router;
