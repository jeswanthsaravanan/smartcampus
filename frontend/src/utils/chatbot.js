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
            next: ['next', 'now', 'current', 'upcoming', 'period'],
            today: ['today', 'schedule', 'timetable', 'classes', 'all'],
            tomorrow: ['tomorrow'],
        }
    },
    result: {
        title: 'Result',
        icon: Award,
        gradient: 'linear-gradient(135deg, #06b6d4 0%, #67e8f9 100%)',
        keywords: {
            all: ['result', 'marks', 'grade', 'exam', 'score', 'semester', 'show', 'my'],
            subject: ['subject', 'course'],
        }
    },
    attendance: {
        title: 'Attendance',
        icon: UserCheck,
        gradient: 'linear-gradient(135deg, #10b981 0%, #6ee7b7 100%)',
        keywords: {
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
            { period: 3, time: '11:00 - 11:50', subject: 'Computer Networks', staff: 'Dr. Verma' },
            { period: 4, time: '12:00 - 12:50', subject: 'Operating Systems', staff: 'Prof. Singh' },
            { period: 5, time: '14:00 - 14:50', subject: 'Software Engineering', staff: 'Dr. Gupta' },
        ],
        tomorrow: [
            { period: 1, time: '09:00 - 09:50', subject: 'Web Development', staff: 'Prof. Patel' },
            { period: 2, time: '10:00 - 10:50', subject: 'Machine Learning', staff: 'Dr. Reddy' },
            { period: 3, time: '11:00 - 11:50', subject: 'Data Structures Lab', staff: 'Dr. Sharma' },
            { period: 4, time: '14:00 - 15:50', subject: 'Database Lab', staff: 'Prof. Kumar' },
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
        { subject: 'Software Engineering', total: 38, present: 34, percentage: 89.5 },
    ],
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

    for (const [intent, keywords] of Object.entries(config.keywords)) {
        if (keywords.some(keyword => lowerMessage.includes(keyword))) {
            return intent
        }
    }

    return 'unknown'
}

function getCurrentPeriod() {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const currentTime = currentHour * 60 + currentMinute

    const schedule = DEMO_DATA.timetable.today

    for (let i = 0; i < schedule.length; i++) {
        const [startStr] = schedule[i].time.split(' - ')
        const [startHour, startMin] = startStr.split(':').map(Number)
        const startTime = startHour * 60 + startMin

        // Find next upcoming or current period
        if (currentTime < startTime + 50) {
            return {
                current: currentTime >= startTime ? schedule[i] : null,
                next: currentTime < startTime ? schedule[i] : schedule[i + 1] || null
            }
        }
    }

    return { current: null, next: null }
}

export async function processMessage(module, message, user) {
    const intent = detectIntent(module, message)

    // Try to fetch from backend first
    try {
        const token = localStorage.getItem('token')
        let endpoint = ''

        switch (module) {
            case 'timetable':
                endpoint = intent === 'next' ? '/api/timetable/next' : '/api/timetable/today'
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
    return generateDemoResponse(module, intent)
}

function generateDemoResponse(module, intent) {
    switch (module) {
        case 'timetable':
            return handleTimetableQuery(intent)
        case 'result':
            return handleResultQuery(intent)
        case 'attendance':
            return handleAttendanceQuery(intent)
        case 'notification':
            return handleNotificationQuery(intent)
        default:
            return {
                text: "I'm not sure how to help with that. Please try a different question.",
                data: null
            }
    }
}

function handleTimetableQuery(intent) {
    if (intent === 'next' || intent === 'now') {
        const { current, next } = getCurrentPeriod()

        if (current) {
            return {
                text: `📚 You're currently in:\n\n**${current.subject}**\nTime: ${current.time}\nFaculty: ${current.staff}`,
                data: null
            }
        } else if (next) {
            return {
                text: `📅 Your next class is:\n\n**${next.subject}**\nTime: ${next.time}\nFaculty: ${next.staff}`,
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

function handleResultQuery(intent) {
    const results = DEMO_DATA.results
    const totalMarks = results.reduce((sum, r) => sum + r.marks, 0)
    const average = (totalMarks / results.length).toFixed(1)

    return {
        text: `📊 Here are your exam results:\n\n**Overall Average:** ${average}%`,
        data: {
            type: 'table',
            headers: ['Subject', 'Marks', 'Grade', 'Status'],
            rows: results.map(r => [r.subject, `${r.marks}/${r.maxMarks}`, r.grade, r.status])
        }
    }
}

function handleAttendanceQuery(intent) {
    const attendance = DEMO_DATA.attendance
    const totalClasses = attendance.reduce((sum, a) => sum + a.total, 0)
    const totalPresent = attendance.reduce((sum, a) => sum + a.present, 0)
    const overallPercentage = ((totalPresent / totalClasses) * 100).toFixed(1)

    const hasShortage = attendance.some(a => a.percentage < 75)
    const shortageSubjects = attendance.filter(a => a.percentage < 75)

    let statusMessage = `📊 **Overall Attendance:** ${overallPercentage}%\n\n`

    if (hasShortage) {
        statusMessage += `⚠️ **Shortage Alert:** You have low attendance in ${shortageSubjects.length} subject(s).`
    } else {
        statusMessage += `✅ You have no attendance shortage. Keep it up!`
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
    // Format backend response (for when backend is available)
    return {
        text: "Here's the information from the server:",
        data: data
    }
}
