/**
 * Chatbot Logic - Intent Detection and Response Generation
 * All data is fetched from the backend (Firestore).
 * No hardcoded demo data — everything comes from the API.
 */

import { Calendar, Award, UserCheck, Bell } from 'lucide-react'
import { auth } from '../firebase'
import { API_BASE_URL } from '../config/api'

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

// ─── Subject aliases for fuzzy matching ─────────────────────────────
const SUBJECT_ALIASES = {
    'fiot': 'ET3491 FIOT',
    'iot': 'ET3491 FIOT',
    'embedded': 'ET3491 FIOT',
    'rs': 'CEC348 RS',
    'remote sensing': 'CEC348 RS',
    'remote': 'CEC348 RS',
    'wsn': 'CEC365 WSN',
    'wireless sensor': 'CEC365 WSN',
    'sensor network': 'CEC365 WSN',
    'aiml': 'CS3491 AIML',
    'ai': 'CS3491 AIML',
    'artificial intelligence': 'CS3491 AIML',
    'machine learning': 'CS3491 AIML',
    'ml': 'CS3491 AIML',
    'awct': 'CEC333 AWCT',
    'advanced wireless': 'CEC333 AWCT',
    'wireless communication': 'CEC333 AWCT',
    'res': 'OEE351 RES',
    'renewable': 'OEE351 RES',
    'renewable energy': 'OEE351 RES',
    'energy': 'OEE351 RES',
    'is': 'MX3089 IS',
    'industry safety': 'MX3089 IS',
    'safety': 'MX3089 IS',
    'fiot lab': 'ET3491 FIOT LAB',
    'iot lab': 'ET3491 FIOT LAB',
    'aiml lab': 'CS3491 AIML LAB',
    'ai lab': 'CS3491 AIML LAB',
    'pt': 'PT',
    'physical training': 'PT',
    'lib': 'LIB',
    'library': 'LIB',
    'mini project': 'Mini project/ Counseling',
    'counseling': 'Mini project/ Counseling',
    'counselling': 'Mini project/ Counseling',
}

/**
 * Extract a day-of-week name from a message string.
 */
function getDayOfWeekFromMessage(message) {
    const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    const lower = message.toLowerCase()
    for (const day of dayNames) {
        if (lower.includes(day)) return day
    }
    return null
}

/**
 * Parse an explicit date from a message string.
 */
function parseExplicitDate(message) {
    const tokens = message.split(/\s+/)
    for (const token of tokens) {
        const dmyMatch = token.match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/)
        if (dmyMatch) {
            const [, dd, mm, yyyy] = dmyMatch
            const date = new Date(parseInt(yyyy), parseInt(mm) - 1, parseInt(dd))
            if (!isNaN(date.getTime())) return date
        }
        const ymdMatch = token.match(/^(\d{4})-(\d{2})-(\d{2})$/)
        if (ymdMatch) {
            const [, yyyy, mm, dd] = ymdMatch
            const date = new Date(parseInt(yyyy), parseInt(mm) - 1, parseInt(dd))
            if (!isNaN(date.getTime())) return date
        }
    }
    return null
}

/**
 * Parse a period number from a message string.
 * Handles: "1st period", "2nd period", "period 3", "3rd", "5th period"
 */
function parsePeriodNumber(message) {
    const lower = message.toLowerCase()
    // "period 3", "period no 5"
    let match = lower.match(/period\s*(?:no\.?\s*)?(\d+)/)
    if (match) return parseInt(match[1])
    // "3rd period", "1st period", "5th"
    match = lower.match(/(\d+)\s*(?:st|nd|rd|th)\s*(?:period|class)?/)
    if (match) return parseInt(match[1])
    return null
}

/**
 * Parse a time from a message string.
 * Handles: "10:30", "10.30", "10:30 am", "2 pm", "14:00"
 */
function parseTime(message) {
    const lower = message.toLowerCase()
    // HH:MM or HH.MM with optional am/pm
    let match = lower.match(/(\d{1,2})[:.:](\d{2})\s*(am|pm)?/)
    if (match) {
        let hours = parseInt(match[1])
        const mins = parseInt(match[2])
        const ampm = match[3]
        if (ampm === 'pm' && hours < 12) hours += 12
        if (ampm === 'am' && hours === 12) hours = 0
        return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
    }
    // Just "2 pm" or "2pm"
    match = lower.match(/(\d{1,2})\s*(am|pm)/)
    if (match) {
        let hours = parseInt(match[1])
        if (match[2] === 'pm' && hours < 12) hours += 12
        if (match[2] === 'am' && hours === 12) hours = 0
        return `${String(hours).padStart(2, '0')}:00`
    }
    return null
}

/**
 * Find a subject name from a message string using aliases.
 */
function findSubjectFromMessage(message) {
    const lower = message.toLowerCase()
    // Check longer aliases first (more specific)
    const sorted = Object.entries(SUBJECT_ALIASES).sort((a, b) => b[0].length - a[0].length)
    for (const [alias, subject] of sorted) {
        if (lower.includes(alias)) return subject
    }
    return null
}

// Module configurations
const MODULE_CONFIG = {
    timetable: {
        title: 'Time Table',
        icon: Calendar,
        gradient: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
    },
    result: {
        title: 'Result',
        icon: Award,
        gradient: 'linear-gradient(135deg, #06b6d4 0%, #67e8f9 100%)',
    },
    attendance: {
        title: 'Attendance',
        icon: UserCheck,
        gradient: 'linear-gradient(135deg, #10b981 0%, #6ee7b7 100%)',
    },
    notification: {
        title: 'Notification',
        icon: Bell,
        gradient: 'linear-gradient(135deg, #f59e0b 0%, #fcd34d 100%)',
    }
}

export function getModuleInfo(module) {
    return MODULE_CONFIG[module] || MODULE_CONFIG.timetable
}

export function getWelcomeMessage(module) {
    const messages = {
        timetable: `👋 Hi! I'm your Time Table assistant.\n\nYou can ask me questions like:\n• "What's my current period?"\n• "What is 3rd period?"\n• "What class at 10:30?"\n• "Show today's timetable"\n• "Tomorrow's schedule"\n• "When is AIML?"\n\nHow can I help you today?`,
        result: `👋 Hi! I'm your Result assistant.\n\nYou can ask me questions like:\n• "Show my exam results"\n• "What are my semester marks?"\n• "My grades"\n\nWhat would you like to know?`,
        attendance: `👋 Hi! I'm your Attendance assistant.\n\nYou can ask me questions like:\n• "What is my attendance?"\n• "Do I have attendance shortage?"\n• "Show attendance percentage"\n\nHow can I assist you?`,
        notification: `👋 Hi! I'm your Notification assistant.\n\nI'll show you the latest college announcements and important updates.\n\nType "show notifications" or just say "latest" to see updates!`
    }
    return messages[module] || messages.timetable
}

/**
 * Detect intent from a user message for a given module.
 * Returns an intent string like 'current', 'next', 'today', 'period', 'time', 'subject', etc.
 */
function detectIntent(module, message) {
    const lower = message.toLowerCase()

    if (module === 'timetable') {
        // ── Multi-word relative day phrases first (most specific) ──
        if (lower.includes('day before yesterday') || lower.includes('two days ago'))
            return 'day_before_yesterday'
        if (lower.includes('day after tomorrow') || lower.includes('overmorrow') || lower.includes('two days from now'))
            return 'day_after_tomorrow'

        // ── Current period ──
        if (lower.includes('current') || lower.includes('present') || lower.includes('ongoing')
            || lower.match(/what('?s| is)\s+(my\s+)?class\s+now/)
            || lower.includes('right now') || lower.includes('happening now'))
            return 'current'

        // ── Next period ──
        if (lower.match(/next\s+(period|class)/) || lower.includes('upcoming') || lower.includes('after this'))
            return 'next'

        // ── Specific period number ("what is 3rd period", "period 5") ──
        if (parsePeriodNumber(lower) !== null)
            return 'period'

        // ── Specific time ("what class at 10:30", "class at 2pm") ──
        if (parseTime(lower) !== null && (lower.includes('class') || lower.includes('period') || lower.includes('what') || lower.includes('which')))
            return 'time'

        // ── Subject query ("when is AIML", "AIML class", "what time is RS") ──
        if (findSubjectFromMessage(lower) !== null &&
            (lower.includes('when') || lower.includes('what time') || lower.includes('which period') || lower.includes('class')))
            return 'subject'

        // ── Single-word relative days ──
        if (lower.includes('yesterday') || lower.includes('previous day'))
            return 'yesterday'
        if (lower.includes('tomorrow') || lower.includes('tommorow') || lower.includes('tmrw') || lower.includes('tmr'))
            return 'tomorrow'

        // ── Specific named day (avoid false positive from "next") ──
        const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        for (const day of dayNames) {
            if (lower.includes(day)) return day
        }

        // ── "today", "show timetable", "full schedule", "all classes" ──
        if (lower.includes('today') || lower.includes('timetable') || lower.includes('schedule')
            || lower.includes('full') || lower.match(/\ball\b/) || lower.includes('show'))
            return 'today'

        // ── Default: if it just says "next" alone (e.g. "next period?" without saying "period")
        if (lower.includes('next'))
            return 'next'

        // ── Unrecognized → try to be helpful ──
        return 'unknown'
    }

    if (module === 'attendance') {
        // Future dates
        if (lower.includes('day after tomorrow') || lower.includes('overmorrow'))
            return 'future_date'
        if (lower.includes('tomorrow') || lower.includes('tommorow') || lower.includes('tmrw'))
            return 'future_date'
        if (lower.includes('last week') || (lower.includes('last ') && getDayOfWeekFromMessage(lower)))
            return 'last_week_day'
        if (lower.includes('next week') || (lower.includes('next') && getDayOfWeekFromMessage(lower)))
            return 'future_date'
        const explicitDate = parseExplicitDate(lower)
        if (explicitDate) {
            return explicitDate > new Date() ? 'future_date' : 'explicit_date'
        }
        if (lower.includes('day before yesterday') || lower.includes('two days ago'))
            return 'day_before_yesterday'
        if (lower.includes('yesterday'))
            return 'yesterday'
        if (lower.includes('today'))
            return 'today'
        // Day-specific attendance
        const day = getDayOfWeekFromMessage(lower)
        if (day) return day
        // Only show overall attendance if the message is actually about attendance
        const attendanceKeywords = ['attendance', 'present', 'absent', 'shortage', 'percentage', 'status', 'how many', 'classes attended', 'show', 'my', 'what', 'check', 'total']
        if (attendanceKeywords.some(k => lower.includes(k))) return 'status'
        return 'unknown'
    }

    if (module === 'result') {
        const resultKeywords = ['result', 'results', 'marks', 'grade', 'grades', 'score', 'scores', 'exam', 'semester', 'performance', 'show', 'my', 'what', 'check', 'how', 'cgpa', 'gpa', 'pass', 'fail']
        if (resultKeywords.some(k => lower.includes(k))) return 'all'
        return 'unknown'
    }
    if (module === 'notification') {
        const notifKeywords = ['notification', 'notifications', 'notice', 'announcement', 'update', 'updates', 'latest', 'new', 'show', 'what', 'any', 'check', 'alert', 'alerts', 'news']
        if (notifKeywords.some(k => lower.includes(k))) return 'all'
        return 'unknown'
    }

    return 'unknown'
}

// ─── Auth & API helpers ──────────────────────────────────────────────

async function getAuthToken() {
    const token = await auth.currentUser?.getIdToken()
    if (!token) throw new Error('Not authenticated')
    return token
}

async function apiFetch(endpoint) {
    const token = await getAuthToken()
    const fullUrl = endpoint.startsWith('/api') ? `${API_BASE_URL}${endpoint}` : endpoint
    const response = await fetch(fullUrl, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    // Check if the response is JSON before parsing
    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
        throw new Error('Server returned an unexpected response. Please ensure the backend is running and accessible.')
    }
    const data = await response.json()
    if (!response.ok) {
        if (data && data.message) throw new Error(data.message)
        throw new Error('Backend request failed')
    }
    return data
}

// ─── Main entry point ───────────────────────────────────────────────

export async function processMessage(module, message, user) {
    const intent = detectIntent(module, message)
    const lower = message.toLowerCase()

    try {
        // ── TIMETABLE ──
        if (module === 'timetable') {
            // Current / Next period
            if (intent === 'current' || intent === 'next') {
                const data = await apiFetch('/api/timetable/next')
                return formatCurrentNext(intent, data)
            }

            // Specific period number
            if (intent === 'period') {
                const periodNo = parsePeriodNumber(lower)
                const data = await apiFetch('/api/timetable/query?day=today')
                return formatPeriodQuery(periodNo, data)
            }

            // Specific time
            if (intent === 'time') {
                const time = parseTime(lower)
                const data = await apiFetch('/api/timetable/query?day=today')
                return formatTimeQuery(time, data)
            }

            // Subject query
            if (intent === 'subject') {
                const subject = findSubjectFromMessage(lower)
                const data = await apiFetch('/api/timetable/query?day=today')
                return formatSubjectQuery(subject, data)
            }

            // Day-based queries
            if (intent === 'unknown') {
                // Try to help the user
                return {
                    text: `🤔 I didn't quite understand that. Try asking:\n• "What's my current period?"\n• "What is 3rd period?"\n• "What class at 10:30?"\n• "Show today's timetable"\n• "Tomorrow's schedule"\n• "When is AIML?"`,
                    data: null
                }
            }

            // Map intent to API query parameter
            let dayParam = intent
            if (['today', 'yesterday', 'tomorrow', 'day_after_tomorrow', 'day_before_yesterday', 'next_tomorrow'].includes(intent)) {
                dayParam = intent
            }
            // Named days (monday, tuesday, etc.) → pass directly
            const data = await apiFetch(`/api/timetable/query?day=${dayParam}`)
            return formatDayTimetable(intent, data)
        }

        // ── RESULT ──
        if (module === 'result') {
            if (intent === 'unknown') {
                return {
                    text: `🤔 I didn't quite understand that. Try asking:\n• "Show my exam results"\n• "What are my marks?"\n• "My grades"\n• "Show semester results"`,
                    data: null
                }
            }
            const data = await apiFetch('/api/results')
            return formatResults(data)
        }

        // ── ATTENDANCE ──
        if (module === 'attendance') {
            if (intent === 'unknown') {
                return {
                    text: `🤔 I didn't quite understand that. Try asking:\n• "What is my attendance?"\n• "Do I have attendance shortage?"\n• "Show attendance percentage"\n• "Monday attendance"\n• "Yesterday's attendance"`,
                    data: null
                }
            }
            if (intent === 'future_date') {
                return {
                    text: '⚠️ **Attendance is not available for future dates.**\n\nI can only show attendance for today or past dates. Try asking:\n• "Today\'s attendance"\n• "Yesterday\'s attendance"\n• "Monday attendance"',
                    data: null
                }
            }
            if (intent === 'explicit_date') {
                const parsedDate = parseExplicitDate(lower)
                if (parsedDate) {
                    const yyyy = parsedDate.getFullYear()
                    const mm = String(parsedDate.getMonth() + 1).padStart(2, '0')
                    const dd = String(parsedDate.getDate()).padStart(2, '0')
                    const data = await apiFetch(`/api/attendance/daily/${yyyy}-${mm}-${dd}`)
                    return formatDailyAttendance(data)
                }
            }
            if (intent === 'last_week_day') {
                const data = await apiFetch(`/api/attendance/daily?day=${encodeURIComponent(lower.trim())}`)
                return formatDailyAttendance(data)
            }
            if (['today', 'yesterday', 'day_before_yesterday'].includes(intent)) {
                const data = await apiFetch(`/api/attendance/daily?day=${intent}`)
                return formatDailyAttendance(data)
            }
            // Named days
            const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
            if (dayNames.includes(intent)) {
                const data = await apiFetch(`/api/attendance/daily?day=${intent}`)
                return formatDailyAttendance(data)
            }
            // Overall attendance
            const data = await apiFetch('/api/attendance')
            return formatOverallAttendance(data)
        }

        // ── NOTIFICATION ──
        if (module === 'notification') {
            if (intent === 'unknown') {
                return {
                    text: `🤔 I didn't quite understand that. Try asking:\n• "Show notifications"\n• "Any new updates?"\n• "Latest announcements"`,
                    data: null
                }
            }
            const data = await apiFetch('/api/notifications')
            return formatNotifications(data)
        }

    } catch (error) {
        console.error('Backend error:', error.message)
        return {
            text: `⚠️ **Could not fetch data from server.**\n\n${error.message || 'Please make sure the backend is running and try again.'}`,
            data: null
        }
    }

    return {
        text: "🤔 I'm not sure how to help with that. Try rephrasing your question!",
        data: null
    }
}

// ─── Timetable formatters ────────────────────────────────────────────

function formatCurrentNext(intent, data) {
    const period = data.period
    if (period) {
        const emoji = data.isCurrent ? '📚' : '📅'
        const label = data.isCurrent ? 'Current Class' : 'Next Class'
        return {
            text: `${emoji} **Your ${label}:**\n\n🔹 **${period.subject}**\n⏰ Time: ${period.time}\n👨‍🏫 Faculty: ${period.staff}\n📌 Period: ${period.period}`,
            data: null
        }
    }
    return {
        text: data.message || '📭 No more classes today.',
        data: null
    }
}

function formatPeriodQuery(periodNo, data) {
    if (!Array.isArray(data)) {
        return { text: data.message || '📭 No timetable available for today.', data: null }
    }
    const match = data.find(s => s.period === periodNo)
    if (match) {
        return {
            text: `📚 **Period ${periodNo} Today:**\n\n🔹 **${match.subject}**\n⏰ Time: ${match.time}\n👨‍🏫 Faculty: ${match.staff}`,
            data: null
        }
    }
    return {
        text: `📭 No class scheduled for period ${periodNo} today.\n\nToday's periods: ${data.map(s => s.period).join(', ')}`,
        data: null
    }
}

function formatTimeQuery(time, data) {
    if (!Array.isArray(data)) {
        return { text: data.message || '📭 No timetable available for today.', data: null }
    }
    // Find the class that spans the given time
    const match = data.find(s => {
        const [startStr, endStr] = s.time.split(' - ')
        return startStr && endStr && time >= startStr.trim() && time < endStr.trim()
    })
    if (match) {
        return {
            text: `📚 **Class at ${time}:**\n\n🔹 **${match.subject}**\n⏰ Time: ${match.time}\n👨‍🏫 Faculty: ${match.staff}\n📌 Period: ${match.period}`,
            data: null
        }
    }
    // Find the next class after the given time
    const nextClass = data.find(s => {
        const startStr = s.time.split(' - ')[0]
        return startStr && startStr.trim() > time
    })
    if (nextClass) {
        return {
            text: `📭 No class at ${time}.\n\n📅 **Next class after ${time}:**\n🔹 **${nextClass.subject}**\n⏰ Time: ${nextClass.time}\n👨‍🏫 Faculty: ${nextClass.staff}`,
            data: null
        }
    }
    return {
        text: `📭 No class at or after ${time} today.`,
        data: null
    }
}

function formatSubjectQuery(subject, data) {
    if (!Array.isArray(data)) {
        return { text: data.message || '📭 No timetable available for today.', data: null }
    }
    const matches = data.filter(s =>
        s.subject && s.subject.toLowerCase().includes(subject.toLowerCase())
    )
    if (matches.length > 0) {
        let text = `📚 **${subject} Today:**\n\n`
        matches.forEach(m => {
            text += `🔹 **Period ${m.period}** — ${m.time}\n   👨‍🏫 ${m.staff}\n`
        })
        return { text: text.trim(), data: null }
    }
    return {
        text: `📭 **${subject}** is not scheduled for today.\n\nTry asking "show timetable" to see all classes.`,
        data: null
    }
}

function formatDayTimetable(intent, data) {
    const labelMap = {
        today: "today's timetable",
        yesterday: "yesterday's timetable",
        tomorrow: "tomorrow's schedule",
        day_after_tomorrow: "the day after tomorrow's schedule",
        next_tomorrow: "the day after tomorrow's schedule",
        day_before_yesterday: "the day before yesterday's timetable",
    }
    const label = labelMap[intent] || `the timetable for ${intent.charAt(0).toUpperCase() + intent.slice(1)}`

    if (Array.isArray(data)) {
        if (data.length === 0) {
            return { text: `📭 No classes scheduled for ${label}.`, data: null }
        }
        return {
            text: `📅 Here is ${label}:`,
            data: {
                type: 'table',
                headers: ['Period', 'Time', 'Subject', 'Faculty'],
                rows: data.map(s => [s.period, s.time, s.subject, s.staff])
            }
        }
    }

    if (data.message) {
        return { text: `📭 ${data.message}`, data: null }
    }

    return { text: `📭 No data available for ${label}.`, data: null }
}

// ─── Result formatter ────────────────────────────────────────────────

function formatResults(data) {
    const results = data.results || []
    const average = data.average || '0.0'

    return {
        text: `📊 **Your Exam Results:**\n\n**Overall Average:** ${average}%`,
        data: {
            type: 'table',
            headers: ['Subject Code', 'Subject Name', 'Marks', 'Grade', 'Status'],
            rows: results.map(r => [
                r.subjectCode,
                r.subjectName,
                r.marks,
                r.grade,
                r.status
            ])
        }
    }
}

// ─── Attendance formatters ───────────────────────────────────────────

function formatDailyAttendance(data) {
    if (data.error && data.message) {
        return { text: `⚠️ **${data.message}**`, data: null }
    }

    if (data.dayOfWeek !== undefined) {
        const dayOfWeek = data.dayOfWeek || ''
        const date = data.date || ''
        const attended = data.attended || 0
        const totalClasses = data.totalClasses || 0
        const percentage = data.percentage || '0.0'
        const records = data.records || []

        let statusEmoji = '✅'
        if (parseFloat(percentage) < 75) statusEmoji = '⚠️'
        if (totalClasses === 0) statusEmoji = '📭'

        const headerText = totalClasses === 0
            ? `📅 **No attendance records found for ${dayOfWeek}, ${date}.**\n\nThis could be a holiday or no classes were scheduled.`
            : `📅 **Attendance for ${dayOfWeek}, ${date}:**\n\n${statusEmoji} **Your Attendance:** ${attended}/${totalClasses} (${percentage}%)`

        return {
            text: headerText,
            data: totalClasses > 0 ? {
                type: 'table',
                headers: ['Period', 'Subject', 'Status', 'Time'],
                rows: records.map(r => [r.period, r.subject, r.status, r.time])
            } : null
        }
    }

    return formatOverallAttendance(data)
}

function formatOverallAttendance(data) {
    const attendance = data.attendance || []
    const overallPercentage = data.overallPercentage || '0.0'

    return {
        text: `📊 **Your Attendance Summary:**\n\n📈 **Overall Attendance:** ${overallPercentage}%`,
        data: {
            type: 'table',
            headers: ['Subject', 'Present', 'Total', 'Percentage'],
            rows: attendance.map(a => [a.subject, a.present, a.total, a.percentage])
        }
    }
}

// ─── Notification formatter ──────────────────────────────────────────

function formatNotifications(data) {
    if (Array.isArray(data)) {
        if (data.length === 0) {
            return { text: '📭 **No notifications at this time.**', data: null }
        }
        let text = "📢 **Latest Notifications:**\n\n"
        data.slice(0, 5).forEach((n, i) => {
            text += `**${i + 1}. ${n.title}**\n${n.message}\n📅 ${n.date || n.createdAt || ''}\n\n`
        })
        return { text: text.trim(), data: null }
    }
    return { text: '📭 No notification data available.', data: null }
}
