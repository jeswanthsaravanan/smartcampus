/**
 * Chatbot Logic - Intent Detection and Response Generation
 * Keyword-based chatbot for Smart College Portal
 */

import { Calendar, Award, UserCheck, Bell } from 'lucide-react'

// Module configurations
const MODULE_CONFIG = {
    timetable: {
        title: 'Time Table',
        icon: Calendar,
        gradient: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
        keywords: {
            // Separate current and next period keywords
            current: ['current period', 'current class', 'present period', 'ongoing class', 'what is my current', 'present class'],
            next: ['next period', 'next class', 'what is my next', 'upcoming period', 'upcoming class'],
            today: ['today', 'schedule', 'timetable', 'classes', 'all'],
            next_tomorrow: ['next tomorrow', 'day after tomorrow'],
            tomorrow: ['tomorrow']
        }
    },
    result: {
        title: 'Result',
        icon: Award,
        gradient: 'linear-gradient(135deg, #06b6d4 0%, #67e8f9 100%)',
        keywords: {
            all: ['result', 'marks', 'grade', 'exam', 'score', 'semester', 'show all'],
        }
    },
    attendance: {
        title: 'Attendance',
        icon: UserCheck,
        gradient: 'linear-gradient(135deg, #10b981 0%, #6ee7b7 100%)',
        keywords: {
            today: ['today attendance', 'today\'s attendance'],
            yesterday: ['yesterday attendance', 'yesterday\'s attendance'],
            status: ['attendance', 'present', 'absent', 'percentage', 'shortage', 'total', 'my'],
        }
    },
    notification: {
        title: 'Notification',
        icon: Bell,
        gradient: 'linear-gradient(135deg, #f59e0b 0%, #fcd34d 100%)',
        keywords: {
            all: ['notification', 'announcement', 'news', 'update', 'alert', 'show', 'latest'],
        }
    }
}

// Demo data for the application
const DEMO_DATA = {
    timetable: {
        today: [
            { period: 1, time: '09:00 - 09:50', subject: 'Data Structures', staff: 'Dr. Sharma' },
            { period: 2, time: '10:00 - 10:50', subject: 'Database Systems', staff: 'Prof. Kumar' },
            { period: 'Interval', time: '10:50 - 11:00', subject: 'Morning Interval', staff: '-' },
            { period: 3, time: '11:00 - 11:50', subject: 'Computer Networks', staff: 'Dr. Verma' },
            { period: 4, time: '12:00 - 12:50', subject: 'Operating Systems', staff: 'Prof. Singh' },
            { period: 'Lunch', time: '12:50 - 14:00', subject: 'Lunch Break', staff: '-' },
            { period: 5, time: '14:00 - 14:50', subject: 'Software Engineering', staff: 'Dr. Gupta' },
        ],
        tomorrow: [
            { period: 1, time: '09:00 - 09:50', subject: 'Web Development', staff: 'Prof. Patel' },
            { period: 2, time: '10:00 - 10:50', subject: 'Machine Learning', staff: 'Dr. Reddy' },
            { period: 'Interval', time: '10:50 - 11:00', subject: 'Morning Interval', staff: '-' },
            { period: 3, time: '11:00 - 11:50', subject: 'Data Structures Lab', staff: 'Dr. Sharma' },
            { period: 'Lunch', time: '11:50 - 14:00', subject: 'Lunch Break', staff: '-' }, // Adjusted for Lab
            { period: 4, time: '14:00 - 15:50', subject: 'Database Lab', staff: 'Prof. Kumar' },
        ],
        dayAfterTomorrow: [
            { period: 1, time: '09:00 - 09:50', subject: 'Cloud Computing', staff: 'Dr. Cloud' },
            { period: 2, time: '10:00 - 10:50', subject: 'Artificial Intelligence', staff: 'Prof. AI' },
            { period: 'Interval', time: '10:50 - 11:00', subject: 'Morning Interval', staff: '-' },
            { period: 3, time: '11:00 - 11:50', subject: 'Project Work', staff: 'Dr. Mentor' }
        ]
    },
    results: [
        { subject: 'Data Structures', marks: 85, maxMarks: 100, grade: 'A', status: 'Pass' },
        { subject: 'Database Systems', marks: 78, maxMarks: 100, grade: 'B+', status: 'Pass' },
        { subject: 'Computer Networks', marks: 92, maxMarks: 100, grade: 'A+', status: 'Pass' },
        { subject: 'Operating Systems', marks: 71, maxMarks: 100, grade: 'B', status: 'Pass' },
        { subject: 'Software Engineering', marks: 88, maxMarks: 100, grade: 'A', status: 'Pass' },
    ],
    attendance: [
        { subject: 'Data Structures', total: 45, present: 40, percentage: 88.9 },
        { subject: 'Database Systems', total: 42, present: 35, percentage: 83.3 },
        { subject: 'Computer Networks', total: 40, present: 38, percentage: 95.0 },
        { subject: 'Operating Systems', total: 44, present: 36, percentage: 81.8 },
    ],
    // Subject name aliases for keyword matching
    subjectAliases: {
        'data structures': ['data structures', 'data structure', 'ds'],
        'database systems': ['database systems', 'database system', 'dbms', 'database'],
        'computer networks': ['computer networks', 'computer network', 'cn', 'networks'],
        'operating systems': ['operating systems', 'operating system', 'os'],
        'software engineering': ['software engineering', 'se', 'software']
    },
    // My personal attendance data
    myAttendance: {
        today: { totalClasses: 6, attended: 5, percentage: 83.3 },
        yesterday: { totalClasses: 5, attended: 5, percentage: 100 }
    },
    // Daily attendance records (different for today vs yesterday)
    dailyAttendance: {
        today: [
            { subject: 'Data Structures', status: 'Present', time: '09:00 - 09:50' },
            { subject: 'Database Systems', status: 'Present', time: '10:00 - 10:50' },
            { subject: 'Computer Networks', status: 'Absent', time: '11:00 - 11:50' },
            { subject: 'Operating Systems', status: 'Present', time: '12:00 - 12:50' },
            { subject: 'Software Engineering', status: 'Present', time: '14:00 - 14:50' },
            { subject: 'Data Structures Lab', status: 'Present', time: '15:00 - 16:50' }
        ],
        yesterday: [
            { subject: 'Web Development', status: 'Present', time: '09:00 - 09:50' },
            { subject: 'Machine Learning', status: 'Present', time: '10:00 - 10:50' },
            { subject: 'Data Structures Lab', status: 'Present', time: '11:00 - 12:50' },
            { subject: 'Database Lab', status: 'Present', time: '14:00 - 15:50' },
            { subject: 'Project Work', status: 'Present', time: '16:00 - 16:50' }
        ]
    },
    notifications: [
        {
            id: 1,
            title: 'Mid-Semester Exams Schedule',
            message: 'Mid-semester examinations will commence from March 15, 2026. Detailed schedule will be posted on the notice board.',
            date: '2026-02-07',
            type: 'important'
        },
        {
            id: 2,
            title: 'Annual Sports Day',
            message: 'Annual Sports Day will be held on February 20, 2026. All students are encouraged to participate.',
            date: '2026-02-06',
            type: 'event'
        },
        {
            id: 3,
            title: 'Library Book Submission',
            message: 'All borrowed library books must be returned by February 28, 2026 to avoid late fees.',
            date: '2026-02-05',
            type: 'reminder'
        },
        {
            id: 4,
            title: 'Campus Placement Drive',
            message: 'Tech Giants Inc. will be conducting a placement drive on March 5, 2026. Interested students should register by February 25.',
            date: '2026-02-04',
            type: 'career'
        },
    ]
}

export function getModuleInfo(module) {
    return MODULE_CONFIG[module] || MODULE_CONFIG.timetable
}

export function getWelcomeMessage(module) {
    const messages = {
        timetable: `👋 Hi! I'm your Time Table assistant.\n\nYou can ask me questions like:\n• "What's my next period?"\n• "Show today's timetable"\n• "Tomorrow's schedule"\n\nHow can I help you today?`,
        result: `👋 Hi! I'm your Result assistant.\n\nYou can ask me questions like:\n• "Show my exam results"\n• "What are my semester marks?"\n• "My grades"\n\nWhat would you like to know?`,
        attendance: `👋 Hi! I'm your Attendance assistant.\n\nYou can ask me questions like:\n• "What is my attendance?"\n• "Do I have attendance shortage?"\n• "Show attendance percentage"\n\nHow can I assist you?`,
        notification: `👋 Hi! I'm your Notification assistant.\n\nI'll show you the latest college announcements and important updates.\n\nType "show notifications" or just say "latest" to see updates!`
    }
    return messages[module] || messages.timetable
}

function detectIntent(module, message) {
    const lowerMessage = message.toLowerCase()
    const config = MODULE_CONFIG[module]

    if (!config) return 'unknown'

    // Check specific phrases FIRST for better matching (order matters!)
    if (module === 'timetable') {
        // Check "next tomorrow" / "day after tomorrow" first
        if (lowerMessage.includes('next tomorrow') || lowerMessage.includes('day after tomorrow')) {
            return 'next_tomorrow'
        }
        // Check "current" keywords before "next" to avoid mixing
        if (lowerMessage.includes('current') || lowerMessage.includes('present') || lowerMessage.includes('ongoing')) {
            return 'current'
        }
        // Check "next" keywords
        if (lowerMessage.includes('next')) {
            return 'next'
        }
    }

    if (module === 'attendance') {
        // Check "yesterday" before "today" to avoid false matches
        if (lowerMessage.includes('yesterday')) {
            return 'yesterday'
        }
        if (lowerMessage.includes('today')) {
            return 'today'
        }
    }

    for (const [intent, keywords] of Object.entries(config.keywords)) {
        if (keywords.some(keyword => lowerMessage.includes(keyword))) {
            return intent
        }
    }

    return 'unknown'
}

/**
 * Get the CURRENTLY ONGOING period based on system time.
 * Returns the period only if time is within the class duration.
 */
function getCurrentOngoingPeriod() {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const currentTime = currentHour * 60 + currentMinute

    const schedule = DEMO_DATA.timetable.today

    for (let i = 0; i < schedule.length; i++) {
        const [startStr, endStr] = schedule[i].time.split(' - ')
        const [startHour, startMin] = startStr.split(':').map(Number)
        const [endHour, endMin] = endStr.split(':').map(Number)
        const startTime = startHour * 60 + startMin
        const endTime = endHour * 60 + endMin

        // Check if current time is WITHIN this period (strictly ongoing)
        if (currentTime >= startTime && currentTime < endTime) {
            return schedule[i]
        }
    }

    return null // No ongoing class
}

/**
 * Get the NEXT UPCOMING period based on system time.
 * Returns the next period that hasn't started yet.
 */
function getNextUpcomingPeriod() {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const currentTime = currentHour * 60 + currentMinute

    const schedule = DEMO_DATA.timetable.today

    for (let i = 0; i < schedule.length; i++) {
        const [startStr] = schedule[i].time.split(' - ')
        const [startHour, startMin] = startStr.split(':').map(Number)
        const startTime = startHour * 60 + startMin

        // Find the first period that hasn't started yet
        if (currentTime < startTime) {
            return schedule[i]
        }
    }

    return null // No upcoming class
}

export async function processMessage(module, message, user) {
    const intent = detectIntent(module, message)

    // Try to fetch from backend first
    try {
        const token = localStorage.getItem('token')
        let endpoint = ''

        switch (module) {
            case 'timetable':
                if (intent === 'next') {
                    endpoint = '/api/timetable/next'
                } else if (intent === 'today') {
                    endpoint = '/api/timetable/query?day=today'
                } else if (intent === 'tomorrow') {
                    endpoint = '/api/timetable/query?day=tomorrow'
                } else if (intent === 'next_tomorrow') {
                    endpoint = '/api/timetable/query?day=next_tomorrow'
                } else if (intent === 'yesterday') {
                    endpoint = '/api/timetable/query?day=yesterday'
                } else {
                    endpoint = '/api/timetable/query?day=today'
                }
                break
            case 'result':
                endpoint = '/api/results'
                break
            case 'attendance':
                endpoint = '/api/attendance'
                break
            case 'notification':
                endpoint = '/api/notifications'
                break
        }

        const response = await fetch(endpoint, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })

        if (response.ok) {
            const data = await response.json()
            return formatResponse(module, intent, data)
        }
    } catch (error) {
        // Backend not available, use demo data
        console.log('Using demo data')
    }

    // Use demo data
    return generateDemoResponse(module, intent, message)
}

function generateDemoResponse(module, intent, message) {
    switch (module) {
        case 'timetable':
            return handleTimetableQuery(intent, message)
        case 'result':
            return handleResultQuery(intent, message)
        case 'attendance':
            return handleAttendanceQuery(intent, message)
        case 'notification':
            return handleNotificationQuery(intent)
        default:
            return {
                text: "I'm not sure how to help with that. Please try a different question.",
                data: null
            }
    }
}

function handleTimetableQuery(intent, message) {
    // First check if user is asking for a SPECIFIC TIME slot
    if (message) {
        const timeMatch = findClassByTime(message)
        if (timeMatch) {
            return {
                text: `📚 **Class at ${timeMatch.time}:**\n\n**${timeMatch.subject}**\nPeriod: ${timeMatch.period}\nFaculty: ${timeMatch.staff}`,
                data: null
            }
        }

        // Check if user is asking for a SPECIFIC PERIOD number
        const periodMatch = findClassByPeriod(message)
        if (periodMatch) {
            return {
                text: `📚 **Period ${periodMatch.period}:**\n\n**${periodMatch.subject}**\nTime: ${periodMatch.time}\nFaculty: ${periodMatch.staff}`,
                data: null
            }
        }
    }

    // Handle CURRENT period request (user wants the ongoing class)
    if (intent === 'current') {
        const current = getCurrentOngoingPeriod()

        if (current) {
            return {
                text: `📚 **Your Current Class:**\n\n**${current.subject}**\nTime: ${current.time}\nFaculty: ${current.staff}`,
                data: null
            }
        } else {
            return {
                text: "📭 You currently have no ongoing class.",
                data: null
            }
        }
    }

    // Handle NEXT period request (user wants the upcoming class)
    if (intent === 'next') {
        const next = getNextUpcomingPeriod()

        if (next) {
            return {
                text: `📅 **Your Next Class:**\n\n**${next.subject}**\nTime: ${next.time}\nFaculty: ${next.staff}`,
                data: null
            }
        } else {
            return {
                text: "🎉 No more classes for today! Enjoy your free time.",
                data: null
            }
        }
    }

    if (intent === 'tomorrow') {
        const schedule = DEMO_DATA.timetable.tomorrow
        return {
            text: "📅 Here's your schedule for tomorrow:",
            data: {
                type: 'table',
                headers: ['Period', 'Time', 'Subject', 'Faculty'],
                rows: schedule.map(s => [s.period, s.time, s.subject, s.staff])
            }
        }
    }

    if (intent === 'next_tomorrow') {
        const schedule = DEMO_DATA.timetable.dayAfterTomorrow
        return {
            text: "📅 Here's your schedule for the day after tomorrow:",
            data: {
                type: 'table',
                headers: ['Period', 'Time', 'Subject', 'Faculty'],
                rows: schedule.map(s => [s.period, s.time, s.subject, s.staff])
            }
        }
    }

    // Default: Today's timetable
    const schedule = DEMO_DATA.timetable.today
    return {
        text: "📅 Here's your timetable for today:",
        data: {
            type: 'table',
            headers: ['Period', 'Time', 'Subject', 'Faculty'],
            rows: schedule.map(s => [s.period, s.time, s.subject, s.staff])
        }
    }
}

/**
 * Find class by specific time from user message.
 * Matches time patterns like "10:00", "10:00 - 10:50", "09:00"
 */
function findClassByTime(message) {
    const schedule = DEMO_DATA.timetable.today

    // Try to extract time pattern from message (HH:MM format)
    const timeRegex = /(\d{1,2}:\d{2})/g
    const matches = message.match(timeRegex)

    if (matches && matches.length > 0) {
        const searchTime = matches[0] // Use first time found

        // Look for a class that contains this time
        for (const cls of schedule) {
            if (cls.time.includes(searchTime)) {
                return cls
            }
        }
    }

    return null
}

/**
 * Find class by period number from user message.
 * Matches patterns like "third period", "period 3", "3rd period", "1st class"
 */
function findClassByPeriod(message) {
    const schedule = DEMO_DATA.timetable.today
    const lowerMessage = message.toLowerCase()

    // Map of word numbers to digits
    const wordToNum = {
        'first': 1, '1st': 1,
        'second': 2, '2nd': 2,
        'third': 3, '3rd': 3,
        'fourth': 4, '4th': 4,
        'fifth': 5, '5th': 5,
        'sixth': 6, '6th': 6,
        'seventh': 7, '7th': 7,
        'eighth': 8, '8th': 8
    }

    // Check for word-based period numbers (e.g., "third period")
    for (const [word, num] of Object.entries(wordToNum)) {
        if (lowerMessage.includes(word)) {
            const cls = schedule.find(s => s.period === num)
            if (cls) return cls
        }
    }

    // Check for digit-based period numbers (e.g., "period 3", "3 period")
    const digitMatch = lowerMessage.match(/period\s*(\d+)|(\d+)\s*(?:st|nd|rd|th)?\s*period/)
    if (digitMatch) {
        const periodNum = parseInt(digitMatch[1] || digitMatch[2])
        const cls = schedule.find(s => s.period === periodNum)
        if (cls) return cls
    }

    return null
}

/**
 * Find subject from user message using aliases.
 * Matches against subject aliases for flexible keyword detection.
 */
function findSubjectFromMessage(message) {
    const lowerMessage = message.toLowerCase()
    const aliases = DEMO_DATA.subjectAliases
    const results = DEMO_DATA.results

    for (const [subjectName, aliasList] of Object.entries(aliases)) {
        for (const alias of aliasList) {
            if (lowerMessage.includes(alias)) {
                // Find the matching result
                return results.find(r => r.subject.toLowerCase() === subjectName)
            }
        }
    }

    return null
}

function handleResultQuery(intent, message) {
    const results = DEMO_DATA.results

    // Try to find specific subject from message using aliases
    if (message) {
        const specificSubject = findSubjectFromMessage(message)

        if (specificSubject) {
            return {
                text: `📊 **Result for ${specificSubject.subject}:**`,
                data: {
                    type: 'table',
                    headers: ['Subject', 'Marks', 'Grade', 'Status'],
                    rows: [[specificSubject.subject, `${specificSubject.marks}/${specificSubject.maxMarks}`, specificSubject.grade, specificSubject.status]]
                }
            }
        }
    }

    // Default: Show all results
    const totalMarks = results.reduce((sum, r) => sum + r.marks, 0)
    const average = (totalMarks / results.length).toFixed(1)

    return {
        text: `📊 **Your Exam Results:**\n\n**Overall Average:** ${average}%`,
        data: {
            type: 'table',
            headers: ['Subject', 'Marks', 'Grade', 'Status'],
            rows: results.map(r => [r.subject, `${r.marks}/${r.maxMarks}`, r.grade, r.status])
        }
    }
}

function handleAttendanceQuery(intent, message) {
    const attendance = DEMO_DATA.attendance
    const myAttendance = DEMO_DATA.myAttendance
    const dailyAttendance = DEMO_DATA.dailyAttendance

    // Handle YESTERDAY's attendance
    if (intent === 'yesterday') {
        const yesterdayData = dailyAttendance.yesterday
        const myYesterday = myAttendance.yesterday

        return {
            text: `📅 **Yesterday's Attendance:**\n\n**Your Attendance:** ${myYesterday.attended}/${myYesterday.totalClasses} (${myYesterday.percentage}%)`,
            data: {
                type: 'table',
                headers: ['Subject', 'Status', 'Time'],
                rows: yesterdayData.map(a => [a.subject, a.status, a.time])
            }
        }
    }

    // Handle TODAY's attendance
    if (intent === 'today') {
        const todayData = dailyAttendance.today
        const myToday = myAttendance.today

        return {
            text: `📅 **Today's Attendance:**\n\n**Your Attendance:** ${myToday.attended}/${myToday.totalClasses} (${myToday.percentage}%)`,
            data: {
                type: 'table',
                headers: ['Subject', 'Status', 'Time'],
                rows: todayData.map(a => [a.subject, a.status, a.time])
            }
        }
    }

    // Default: Overall attendance with personal stats
    const totalClasses = attendance.reduce((sum, a) => sum + a.total, 0)
    const totalPresent = attendance.reduce((sum, a) => sum + a.present, 0)
    const overallPercentage = ((totalPresent / totalClasses) * 100).toFixed(1)

    const hasShortage = attendance.some(a => a.percentage < 75)
    const shortageSubjects = attendance.filter(a => a.percentage < 75)

    let statusMessage = `📊 **Your Attendance Summary:**\n\n`
    statusMessage += `📌 **Total Classes:** ${totalClasses}\n`
    statusMessage += `✅ **Classes Attended:** ${totalPresent}\n`
    statusMessage += `📈 **Overall Attendance:** ${overallPercentage}%\n\n`

    if (hasShortage) {
        statusMessage += `⚠️ **Shortage Alert:** Low attendance in ${shortageSubjects.length} subject(s).`
    } else {
        statusMessage += `✅ No attendance shortage. Keep it up!`
    }

    return {
        text: statusMessage,
        data: {
            type: 'table',
            headers: ['Subject', 'Present', 'Total', 'Percentage'],
            rows: attendance.map(a => [
                a.subject,
                a.present,
                a.total,
                `${a.percentage.toFixed(1)}%`
            ])
        }
    }
}

function handleNotificationQuery(intent) {
    const notifications = DEMO_DATA.notifications

    let text = "📢 **Latest Notifications:**\n\n"

    notifications.slice(0, 3).forEach((n, i) => {
        text += `**${i + 1}. ${n.title}**\n${n.message}\n📅 ${n.date}\n\n`
    })

    return {
        text: text.trim(),
        data: null
    }
}

function formatResponse(module, intent, data) {
    if (module === 'timetable') {
        if (intent === 'next' || intent === 'current') {
            const period = data.period
            // Handle API response format
            if (period) {
                return {
                    text: data.isCurrent
                        ? `📚 **Your Current Class:**\n\n**${period.subject}**\nTime: ${period.time}\nFaculty: ${period.staff}`
                        : `📅 **Your Next Class:**\n\n**${period.subject}**\nTime: ${period.time}\nFaculty: ${period.staff}`,
                    data: null
                }
            }
            return {
                text: data.message || "No class found.",
                data: null
            }
        }

        // Handle list of timetable entries (today, tomorrow, etc.)
        if (Array.isArray(data)) {
            return {
                text: `📅 Here is the timetable:`,
                data: {
                    type: 'table',
                    headers: ['Period', 'Time', 'Subject', 'Faculty'],
                    rows: data.map(s => [s.period, s.time, s.subject, s.staff])
                }
            }
        }

        // Handle "No timetable available" message
        if (data.message) {
            return {
                text: `📭 ${data.message}`,
                data: null
            }
        }
    }

    // Default formatting
    return {
        text: "Here's the information from the server:",
        data: data
    }
}
