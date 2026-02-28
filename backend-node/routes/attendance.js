const express = require('express');
const admin = require('firebase-admin');
const authenticate = require('../middleware/auth');
const { resolveDateForAttendance, isFutureDateQuery, isFutureDate, formatDate, formatDateDDMMYYYY, getDayOfWeek } = require('../utils/dateResolver');

const router = express.Router();
router.use(authenticate);

function mapToDto(a) {
    const pct = a.percentage != null ? a.percentage : 0;
    return {
        subject: a.subject || 'Unknown',
        total: a.totalDays || 0,
        present: a.presentDays || 0,
        percentage: pct.toFixed(2) + '%',
        status: pct >= 75 ? 'OK' : 'Shortage',
    };
}

function mapDailyDto(da) {
    return {
        period: da.periodNo || 0,
        subject: da.subject || 'Unknown Subject',
        status: da.status || 'Unknown',
        time: da.startTime || '--:--',
    };
}

/**
 * GET /api/attendance
 * Overall attendance summary.
 */
router.get('/', async (req, res) => {
    try {
        const uid = req.user.uid;
        const db = admin.firestore();
        const snapshot = await db.collection('attendance')
            .where('studentId', '==', uid)
            .get();

        const attendance = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const totalClasses = attendance.reduce((sum, a) => sum + (a.totalDays || 0), 0);
        const totalPresent = attendance.reduce((sum, a) => sum + (a.presentDays || 0), 0);
        const overallPercentage = totalClasses > 0 ? (totalPresent * 100.0) / totalClasses : 0;

        const shortageSubjects = attendance
            .filter(a => a.percentage != null && a.percentage < 75)
            .map(a => a.subject);

        return res.json({
            attendance: attendance.map(mapToDto),
            overallPercentage: overallPercentage.toFixed(1),
            totalClasses,
            totalPresent,
            hasShortage: shortageSubjects.length > 0,
            shortageSubjects,
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

/**
 * GET /api/attendance/daily?day=today|yesterday|monday|...
 */
router.get('/daily', async (req, res) => {
    try {
        const uid = req.user.uid;
        const day = req.query.day || 'today';

        if (isFutureDateQuery(day)) {
            return res.status(400).json({ error: true, message: 'Attendance is not available for future dates.' });
        }

        const targetDate = resolveDateForAttendance(day);
        if (isFutureDate(targetDate)) {
            return res.status(400).json({ error: true, message: 'Attendance is not available for future dates.' });
        }

        return await getDailyAttendanceForDate(uid, targetDate, res);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

/**
 * GET /api/attendance/daily/:date
 */
router.get('/daily/:date', async (req, res) => {
    try {
        const uid = req.user.uid;
        const targetDate = new Date(req.params.date + 'T00:00:00');

        if (isFutureDate(targetDate)) {
            return res.status(400).json({ error: true, message: 'Attendance is not available for future dates.' });
        }

        return await getDailyAttendanceForDate(uid, targetDate, res);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

async function getDailyAttendanceForDate(uid, date, res) {
    const db = admin.firestore();
    const dateStr = formatDate(date);
    const snapshot = await db.collection('dailyAttendance')
        .where('studentId', '==', uid)
        .where('attendanceDate', '==', dateStr)
        .get();

    const records = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const totalClasses = records.length;
    const attended = records.filter(r => r.status === 'Present').length;
    const percentage = totalClasses > 0 ? (attended * 100.0) / totalClasses : 0;

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = dayNames[date.getDay()];

    return res.json({
        date: formatDateDDMMYYYY(date),
        dayOfWeek,
        totalClasses,
        attended,
        percentage: percentage.toFixed(1),
        records: records.map(mapDailyDto),
    });
}

module.exports = router;
