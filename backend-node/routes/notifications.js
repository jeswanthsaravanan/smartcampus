const express = require('express');
const admin = require('firebase-admin');
const authenticate = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);

function mapToDto(n) {
    const ts = n.createdAt || Date.now();
    const dt = new Date(ts);
    return {
        id: n.id || '',
        title: n.title || '',
        message: n.message || '',
        date: dt.toISOString().split('T')[0],
        time: dt.toTimeString().split(' ')[0],
    };
}

/**
 * GET /api/notifications
 */
router.get('/', async (req, res) => {
    try {
        const db = admin.firestore();
        const snapshot = await db.collection('notifications')
            .where('isActive', '==', true)
            .get();

        const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return res.json(notifications.map(mapToDto));
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

/**
 * GET /api/notifications/:id
 */
router.get('/:id', async (req, res) => {
    try {
        const db = admin.firestore();
        const snapshot = await db.collection('notifications')
            .where('isActive', '==', true)
            .get();

        const match = snapshot.docs.find(doc => doc.id === req.params.id);
        if (!match) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        return res.json(mapToDto({ id: match.id, ...match.data() }));
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;
