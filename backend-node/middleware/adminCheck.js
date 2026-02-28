const admin = require('firebase-admin');

/**
 * Admin check middleware.
 * Verifies the current user has role=ADMIN in the Firestore students collection.
 * Must be used AFTER the authenticate middleware.
 */
async function adminCheck(req, res, next) {
    try {
        const DEFAULT_ADMIN_EMAIL = 'sjeswanth1205@gmail.com';
        if (req.user.email && req.user.email.toLowerCase() === DEFAULT_ADMIN_EMAIL.toLowerCase()) {
            return next();
        }

        const db = admin.firestore();
        const doc = await db.collection('students').doc(req.user.uid).get();

        if (!doc.exists || (doc.data().role || '').toUpperCase() !== 'ADMIN') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        next();
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

module.exports = adminCheck;
