const express = require('express');
const admin = require('firebase-admin');
const authenticate = require('../middleware/auth');
const { resolveDate, getDayOfWeek, formatDate } = require('../utils/dateResolver');

const router = express.Router();
router.use(authenticate);

const COLLECTION = 'timetable';
const DAY_ORDER = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

function sortTimetable(list) {
    return list.sort((a, b) => {
        const dayDiff = (DAY_ORDER.indexOf(a.dayOfWeek) ?? 99) - (DAY_ORDER.indexOf(b.dayOfWeek) ?? 99);
        if (dayDiff !== 0) return dayDiff;
        return (a.periodNo || 0) - (b.periodNo || 0);
    });
}

function mapToDto(t) {
    return {
        id: t.id || '',
        period: t.periodNo || 0,
        time: `${t.startTime} - ${t.endTime}`,
        subject: t.subject || '',
        subjectCode: t.subject || '',
        staff: t.staffName || '',
        day: t.dayOfWeek || '',
    };
}

async function getByStudentAndDay(uid, day) {
    const db = admin.firestore();
    const snapshot = await db.collection(COLLECTION)
        .where('studentId', '==', uid)
        .where('dayOfWeek', '==', day.toUpperCase())
        .get();

    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return sortTimetable(list);
}

/**
 * GET /api/timetable/today
 */
router.get('/today', async (req, res) => {
    try {
        const uid = req.user.uid;
        const dayOfWeek = getDayOfWeek(new Date(new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }) + 'T00:00:00'));
        const timetable = await getByStudentAndDay(uid, dayOfWeek);
        return res.json(timetable.map(mapToDto));
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

/**
 * GET /api/timetable/next
 */
router.get('/next', async (req, res) => {
    try {
        const uid = req.user.uid;
        const now = new Date();
        const nowStr = now.toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false });
        const dayOfWeek = getDayOfWeek(new Date(now.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }) + 'T00:00:00'));

        const todaySchedule = await getByStudentAndDay(uid, dayOfWeek);

        for (const period of todaySchedule) {
            if (period.endTime > nowStr) {
                const isCurrent = period.startTime <= nowStr;
                return res.json({ period: mapToDto(period), isCurrent });
            }
        }

        return res.json({ message: 'No more classes today' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

/**
 * GET /api/timetable/query?day=today|yesterday|tomorrow|monday|...
 */
router.get('/query', async (req, res) => {
    try {
        const uid = req.user.uid;
        const day = (req.query.day || 'today').toLowerCase().trim();

        // Check if the day parameter is itself a weekday name
        const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        let dayOfWeek;

        if (weekdays.includes(day)) {
            // Directly use the named day
            dayOfWeek = day.toUpperCase();
        } else {
            // Resolve relative days to a date, then get the day of week
            let date;
            switch (day) {
                case 'yesterday': date = new Date(); date.setDate(date.getDate() - 1); break;
                case 'day_before_yesterday': date = new Date(); date.setDate(date.getDate() - 2); break;
                case 'tomorrow': date = new Date(); date.setDate(date.getDate() + 1); break;
                case 'day_after_tomorrow': case 'next_tomorrow': date = new Date(); date.setDate(date.getDate() + 2); break;
                default: date = new Date(); break;
            }
            dayOfWeek = getDayOfWeek(date);
        }

        const timetable = await getByStudentAndDay(uid, dayOfWeek);

        if (timetable.length === 0) {
            return res.json({ message: `No timetable available for ${day} (${dayOfWeek})` });
        }

        return res.json(timetable.map(mapToDto));
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

/**
 * GET /api/timetable/by-date/:date
 */
router.get('/by-date/:date', async (req, res) => {
    try {
        const uid = req.user.uid;
        const date = new Date(req.params.date + 'T00:00:00');
        const dayOfWeek = getDayOfWeek(date);
        const timetable = await getByStudentAndDay(uid, dayOfWeek);
        return res.json(timetable.map(mapToDto));
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

/**
 * GET /api/timetable
 * Get ALL timetable entries for the student.
 */
router.get('/', async (req, res) => {
    try {
        const uid = req.user.uid;
        const db = admin.firestore();
        const snapshot = await db.collection(COLLECTION)
            .where('studentId', '==', uid)
            .get();

        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return res.json(sortTimetable(list).map(mapToDto));
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;
