const express = require('express');
const admin = require('firebase-admin');
const authenticate = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);

function mapToDto(r) {
    const marks = r.marks != null ? r.marks : 0;
    const maxMarks = r.maxMarks != null ? r.maxMarks : 100;
    const status = marks >= 50 ? 'Pass' : 'Fail';
    const code = r.subject || 'N/A';
    const name = r.subjectName || code;

    return {
        subjectCode: code,
        subjectName: name,
        marks: `${marks} / ${maxMarks}`,
        grade: r.grade || 'N/A',
        status,
        semester: r.semester || 'N/A',
    };
}

/**
 * GET /api/results
 */
router.get('/', async (req, res) => {
    try {
        const uid = req.user.uid;
        const db = admin.firestore();
        const snapshot = await db.collection('results')
            .where('studentId', '==', uid)
            .get();

        const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const marks = results.map(r => r.marks || 0);
        const average = marks.length > 0 ? marks.reduce((a, b) => a + b, 0) / marks.length : 0;

        return res.json({
            results: results.map(mapToDto),
            average: average.toFixed(1),
            totalSubjects: results.length,
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

/**
 * GET /api/results/semester/:semester
 */
router.get('/semester/:semester', async (req, res) => {
    try {
        const uid = req.user.uid;
        const semester = req.params.semester;
        const db = admin.firestore();
        const snapshot = await db.collection('results')
            .where('studentId', '==', uid)
            .get();

        const results = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(r => r.semester === semester);

        return res.json(results.map(mapToDto));
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;
