/**
 * Date resolver utility — port of DateResolverService.java.
 * Resolves relative date strings ("today", "yesterday", "monday", etc.)
 * to actual dates for timetable and attendance queries.
 *
 * Uses Asia/Kolkata timezone for consistency with the original Java backend.
 */

const ZONE = 'Asia/Kolkata';

function nowInZone() {
    // Get current date in Asia/Kolkata
    const str = new Date().toLocaleDateString('en-CA', { timeZone: ZONE }); // "YYYY-MM-DD"
    return new Date(str + 'T00:00:00');
}

function getDayOfWeek(date) {
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    return days[date.getDay()];
}

function getDayIndex(dayName) {
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    return days.indexOf(dayName.toUpperCase());
}

function addDays(date, n) {
    const d = new Date(date);
    d.setDate(d.getDate() + n);
    return d;
}

function formatDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function formatDateDDMMYYYY(date) {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d}-${m}-${y}`;
}

/**
 * Try to parse an explicit date from the query string.
 * Supports: dd-MM-yyyy, dd/MM/yyyy, yyyy-MM-dd
 */
function tryParseExplicitDate(query) {
    const tokens = query.split(/\s+/);
    for (const token of tokens) {
        // yyyy-MM-dd
        let m = token.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (m) return new Date(`${m[1]}-${m[2]}-${m[3]}T00:00:00`);

        // dd-MM-yyyy
        m = token.match(/^(\d{2})-(\d{2})-(\d{4})$/);
        if (m) return new Date(`${m[3]}-${m[2]}-${m[1]}T00:00:00`);

        // dd/MM/yyyy
        m = token.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (m) return new Date(`${m[3]}-${m[2]}-${m[1]}T00:00:00`);
    }
    return null;
}

function getDayOfWeekFromQuery(query) {
    const q = query.toLowerCase();
    if (q.includes('monday') || q.includes('mon')) return 'MONDAY';
    if (q.includes('tuesday') || q.includes('tue')) return 'TUESDAY';
    if (q.includes('wednesday') || q.includes('wed')) return 'WEDNESDAY';
    if (q.includes('thursday') || q.includes('thu')) return 'THURSDAY';
    if (q.includes('friday') || q.includes('fri')) return 'FRIDAY';
    if (q.includes('saturday') || q.includes('sat')) return 'SATURDAY';
    if (q.includes('sunday') || q.includes('sun')) return 'SUNDAY';
    return null;
}

/**
 * Resolve to the NEXT future occurrence of this weekday (for timetable).
 */
function resolveDateForWeekday(now, targetDay) {
    const currentIdx = now.getDay(); // 0=Sun, 1=Mon...
    const targetIdx = getDayIndex(targetDay);

    if (currentIdx === targetIdx) return now;

    let daysUntil = targetIdx - currentIdx;
    if (daysUntil < 0) daysUntil += 7;
    return addDays(now, daysUntil);
}

/**
 * Resolve to the MOST RECENT PAST occurrence of this weekday (for attendance).
 * If today is that weekday, returns today.
 */
function resolvePastWeekday(now, targetDay) {
    const currentIdx = now.getDay();
    const targetIdx = getDayIndex(targetDay);

    if (currentIdx === targetIdx) return now;

    let daysBack = currentIdx - targetIdx;
    if (daysBack <= 0) daysBack += 7;
    return addDays(now, -daysBack);
}

/**
 * Resolve to PREVIOUS WEEK's occurrence of this weekday.
 */
function resolveLastWeekDay(now, targetDay) {
    const recent = resolvePastWeekday(now, targetDay);
    const diff = Math.floor((now - recent) / (1000 * 60 * 60 * 24));
    if (diff < 7 || recent.getTime() === now.getTime()) {
        return addDays(recent, -7);
    }
    return recent;
}

/**
 * Resolve date for TIMETABLE queries.
 * Weekday names resolve to the NEXT future occurrence.
 */
function resolveDate(query) {
    const now = nowInZone();
    const q = query.toLowerCase().trim();

    const explicit = tryParseExplicitDate(q);
    if (explicit) return explicit;

    if (q.includes('yesterday')) return addDays(now, -1);
    if (q.includes('tomorrow')) {
        if (q.includes('day after') || q.includes('next tomorrow')) return addDays(now, 2);
        return addDays(now, 1);
    }
    if (q.includes('today')) return now;

    const targetDay = getDayOfWeekFromQuery(q);
    if (targetDay) return resolveDateForWeekday(now, targetDay);

    return now;
}

/**
 * Resolve date for ATTENDANCE queries.
 * Weekday names resolve to the MOST RECENT PAST occurrence.
 */
function resolveDateForAttendance(query) {
    const now = nowInZone();
    const q = query.toLowerCase().trim();

    const explicit = tryParseExplicitDate(q);
    if (explicit) return explicit;

    if (q.includes('day before yesterday') || q.includes('two days ago')) return addDays(now, -2);
    if (q.includes('yesterday')) return addDays(now, -1);
    if (q.includes('today')) return now;

    const targetDay = getDayOfWeekFromQuery(q);
    if (targetDay) {
        if (q.includes('last week') || q.includes('last ')) {
            return resolveLastWeekDay(now, targetDay);
        }
        return resolvePastWeekday(now, targetDay);
    }

    return now;
}

/**
 * Check if the given date is in the future (after today).
 */
function isFutureDate(date) {
    const now = nowInZone();
    return date > now;
}

/**
 * Check if the query text refers to a future date concept.
 */
function isFutureDateQuery(query) {
    const q = query.toLowerCase().trim();

    if (q.includes('last week') || q.includes('last ')) return false;
    if (q.includes('tomorrow')) return true;
    if (q.includes('next week')) return true;
    if (q.includes('day after tomorrow')) return true;
    if (q.includes('overmorrow')) return true;
    if (q.includes('two days from now')) return true;
    if (q.includes('next') && getDayOfWeekFromQuery(q)) return true;

    const explicit = tryParseExplicitDate(q);
    if (explicit && isFutureDate(explicit)) return true;

    return false;
}

module.exports = {
    resolveDate,
    resolveDateForAttendance,
    isFutureDate,
    isFutureDateQuery,
    getDayOfWeek,
    formatDate,
    formatDateDDMMYYYY,
    nowInZone,
};
