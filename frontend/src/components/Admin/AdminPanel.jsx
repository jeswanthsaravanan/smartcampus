import { useState, useEffect, useCallback } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
    ArrowLeft, Shield, Calendar, Users, Plus, Pencil, Trash2,
    Save, X, Loader2, CheckCircle, AlertCircle, ChevronDown,
    Award, UserCheck, Bell, Database
} from 'lucide-react'
import './AdminPanel.css'

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']

const EMPTY_TIMETABLE = {
    dayOfWeek: 'MONDAY', periodNo: 1, startTime: '09:00', endTime: '09:50',
    subject: '', staffName: '', studentId: ''
}
const EMPTY_RESULT = {
    studentId: '', subject: '', subjectName: '', marks: 0, maxMarks: 100, grade: '', semester: ''
}
const EMPTY_ATTENDANCE = {
    studentId: '', subject: '', totalDays: 0, presentDays: 0
}
const EMPTY_NOTIFICATION = {
    title: '', message: '', isActive: true
}

function AdminPanel() {
    const navigate = useNavigate()
    const { user, getAuthToken } = useAuth()
    const [activeTab, setActiveTab] = useState('timetable')
    const [isAdmin, setIsAdmin] = useState(null)
    const [toast, setToast] = useState(null)
    const [setupAvailable, setSetupAvailable] = useState(false)
    const [seeding, setSeeding] = useState(false)

    // --- Timetable state ---
    const [entries, setEntries] = useState([])
    const [loadingEntries, setLoadingEntries] = useState(true)
    const [filterDay, setFilterDay] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [form, setForm] = useState({ ...EMPTY_TIMETABLE })
    const [saving, setSaving] = useState(false)

    // --- Users state ---
    const [users, setUsers] = useState([])
    const [loadingUsers, setLoadingUsers] = useState(false)

    // --- Results state ---
    const [results, setResults] = useState([])
    const [loadingResults, setLoadingResults] = useState(false)
    const [showResultForm, setShowResultForm] = useState(false)
    const [editingResultId, setEditingResultId] = useState(null)
    const [resultForm, setResultForm] = useState({ ...EMPTY_RESULT })
    const [savingResult, setSavingResult] = useState(false)

    // --- Attendance state ---
    const [attendance, setAttendance] = useState([])
    const [loadingAttendance, setLoadingAttendance] = useState(false)
    const [showAttendanceForm, setShowAttendanceForm] = useState(false)
    const [editingAttendanceId, setEditingAttendanceId] = useState(null)
    const [attendanceForm, setAttendanceForm] = useState({ ...EMPTY_ATTENDANCE })
    const [savingAttendance, setSavingAttendance] = useState(false)

    // --- Notifications state ---
    const [notifications, setNotifications] = useState([])
    const [loadingNotifications, setLoadingNotifications] = useState(false)
    const [showNotifForm, setShowNotifForm] = useState(false)
    const [editingNotifId, setEditingNotifId] = useState(null)
    const [notifForm, setNotifForm] = useState({ ...EMPTY_NOTIFICATION })
    const [savingNotif, setSavingNotif] = useState(false)

    const showToast = (type, message) => {
        setToast({ type, message })
        setTimeout(() => setToast(null), 3000)
    }

    const apiCall = useCallback(async (url, options = {}) => {
        const token = await getAuthToken()
        const res = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                ...(options.headers || {})
            }
        })
        return res
    }, [getAuthToken])

    // Check admin status
    useEffect(() => {
        (async () => {
            try {
                const res = await apiCall('/api/admin/check')
                const data = await res.json()
                setIsAdmin(data.isAdmin)
                if (!data.isAdmin) {
                    const allUsers = await apiCall('/api/admin/users')
                    if (allUsers.status === 403) {
                        setSetupAvailable(true)
                    }
                }
            } catch {
                setIsAdmin(false)
            }
        })()
    }, [apiCall])

    // Load data when tab changes
    useEffect(() => {
        if (!isAdmin) return
        if (activeTab === 'timetable') fetchEntries()
        else if (activeTab === 'users') fetchUsers()
        else if (activeTab === 'results') fetchResults()
        else if (activeTab === 'attendance') fetchAttendance()
        else if (activeTab === 'notifications') fetchNotifications()
    }, [activeTab, isAdmin])

    // === TIMETABLE ===
    const fetchEntries = async () => {
        setLoadingEntries(true)
        try {
            const url = filterDay ? `/api/admin/timetable?day=${filterDay}` : '/api/admin/timetable'
            const res = await apiCall(url)
            const data = await res.json()
            setEntries(Array.isArray(data) ? data : [])
        } catch { setEntries([]) }
        setLoadingEntries(false)
    }

    useEffect(() => { if (isAdmin && activeTab === 'timetable') fetchEntries() }, [filterDay])

    const handleTimetableSave = async () => {
        setSaving(true)
        try {
            const url = editingId ? `/api/admin/timetable/${editingId}` : '/api/admin/timetable'
            const method = editingId ? 'PUT' : 'POST'
            await apiCall(url, { method, body: JSON.stringify(form) })
            showToast('success', editingId ? 'Entry updated!' : 'Entry created!')
            setShowForm(false); setEditingId(null); setForm({ ...EMPTY_TIMETABLE })
            fetchEntries()
        } catch { showToast('error', 'Failed to save entry') }
        setSaving(false)
    }

    const handleTimetableDelete = async (id) => {
        try {
            await apiCall(`/api/admin/timetable/${id}`, { method: 'DELETE' })
            showToast('success', 'Deleted!')
            fetchEntries()
        } catch { showToast('error', 'Failed to delete') }
    }

    const editTimetable = (entry) => {
        setForm({ ...entry }); setEditingId(entry.id); setShowForm(true)
    }

    // === RESULTS ===
    const fetchResults = async () => {
        setLoadingResults(true)
        try {
            const res = await apiCall('/api/admin/results')
            const data = await res.json()
            setResults(Array.isArray(data) ? data : [])
        } catch { setResults([]) }
        setLoadingResults(false)
    }

    const handleResultSave = async () => {
        setSavingResult(true)
        try {
            const url = editingResultId ? `/api/admin/results/${editingResultId}` : '/api/admin/results'
            const method = editingResultId ? 'PUT' : 'POST'
            await apiCall(url, { method, body: JSON.stringify(resultForm) })
            showToast('success', editingResultId ? 'Result updated!' : 'Result created!')
            setShowResultForm(false); setEditingResultId(null); setResultForm({ ...EMPTY_RESULT })
            fetchResults()
        } catch { showToast('error', 'Failed to save result') }
        setSavingResult(false)
    }

    const handleResultDelete = async (id) => {
        try {
            await apiCall(`/api/admin/results/${id}`, { method: 'DELETE' })
            showToast('success', 'Deleted!')
            fetchResults()
        } catch { showToast('error', 'Failed to delete') }
    }

    const editResult = (r) => {
        setResultForm({ ...r }); setEditingResultId(r.id); setShowResultForm(true)
    }

    // === ATTENDANCE ===
    const fetchAttendance = async () => {
        setLoadingAttendance(true)
        try {
            const res = await apiCall('/api/admin/attendance')
            const data = await res.json()
            setAttendance(Array.isArray(data) ? data : [])
        } catch { setAttendance([]) }
        setLoadingAttendance(false)
    }

    const handleAttendanceSave = async () => {
        setSavingAttendance(true)
        try {
            const url = editingAttendanceId ? `/api/admin/attendance/${editingAttendanceId}` : '/api/admin/attendance'
            const method = editingAttendanceId ? 'PUT' : 'POST'
            await apiCall(url, { method, body: JSON.stringify(attendanceForm) })
            showToast('success', editingAttendanceId ? 'Attendance updated!' : 'Attendance created!')
            setShowAttendanceForm(false); setEditingAttendanceId(null); setAttendanceForm({ ...EMPTY_ATTENDANCE })
            fetchAttendance()
        } catch { showToast('error', 'Failed to save attendance') }
        setSavingAttendance(false)
    }

    const handleAttendanceDelete = async (id) => {
        try {
            await apiCall(`/api/admin/attendance/${id}`, { method: 'DELETE' })
            showToast('success', 'Deleted!')
            fetchAttendance()
        } catch { showToast('error', 'Failed to delete') }
    }

    const editAttendance = (a) => {
        setAttendanceForm({ ...a }); setEditingAttendanceId(a.id); setShowAttendanceForm(true)
    }

    // === NOTIFICATIONS ===
    const fetchNotifications = async () => {
        setLoadingNotifications(true)
        try {
            const res = await apiCall('/api/admin/notifications')
            const data = await res.json()
            setNotifications(Array.isArray(data) ? data : [])
        } catch { setNotifications([]) }
        setLoadingNotifications(false)
    }

    const handleNotifSave = async () => {
        setSavingNotif(true)
        try {
            const url = editingNotifId ? `/api/admin/notifications/${editingNotifId}` : '/api/admin/notifications'
            const method = editingNotifId ? 'PUT' : 'POST'
            await apiCall(url, { method, body: JSON.stringify(notifForm) })
            showToast('success', editingNotifId ? 'Notification updated!' : 'Notification created!')
            setShowNotifForm(false); setEditingNotifId(null); setNotifForm({ ...EMPTY_NOTIFICATION })
            fetchNotifications()
        } catch { showToast('error', 'Failed to save notification') }
        setSavingNotif(false)
    }

    const handleNotifDelete = async (id) => {
        try {
            await apiCall(`/api/admin/notifications/${id}`, { method: 'DELETE' })
            showToast('success', 'Deleted!')
            fetchNotifications()
        } catch { showToast('error', 'Failed to delete') }
    }

    const editNotif = (n) => {
        setNotifForm({ ...n }); setEditingNotifId(n.id); setShowNotifForm(true)
    }

    // === USERS ===
    const fetchUsers = async () => {
        setLoadingUsers(true)
        try {
            const res = await apiCall('/api/admin/users')
            const data = await res.json()
            setUsers(Array.isArray(data) ? data : [])
        } catch { setUsers([]) }
        setLoadingUsers(false)
    }

    const toggleRole = async (uid, currentRole) => {
        const newRole = currentRole === 'ADMIN' ? 'STUDENT' : 'ADMIN'
        try {
            await apiCall(`/api/admin/users/${uid}/role`, {
                method: 'PUT', body: JSON.stringify({ role: newRole })
            })
            showToast('success', `Role updated to ${newRole}`)
            fetchUsers()
        } catch { showToast('error', 'Failed to update role') }
    }

    const handleSetup = async () => {
        try {
            const res = await apiCall('/api/admin/setup', { method: 'POST' })
            const data = await res.json()
            if (res.ok) {
                showToast('success', data.message)
                setIsAdmin(true)
                setSetupAvailable(false)
            } else {
                showToast('error', data.error)
            }
        } catch { showToast('error', 'Setup failed') }
    }

    // Loading
    if (isAdmin === null) {
        return (
            <div className="admin-page">
                <div className="admin-loading"><Loader2 className="spin" size={32} /><p>Checking admin access...</p></div>
            </div>
        )
    }

    // Setup screen
    if (isAdmin === false && setupAvailable) {
        return (
            <div className="admin-page">
                <div className="admin-setup">
                    <Shield size={48} />
                    <h2>Admin Setup</h2>
                    <p>No admin exists yet. Click below to become the first admin.</p>
                    <button className="btn-primary" onClick={handleSetup}>Become Admin</button>
                    <button className="btn-secondary" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
                </div>
                {toast && <div className={`admin-toast ${toast.type}`}>{toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}{toast.message}</div>}
            </div>
        )
    }

    if (isAdmin === false && !setupAvailable) {
        return <Navigate to="/dashboard" replace />
    }

    // Group timetable by day
    const grouped = {}
    DAYS.forEach(d => { grouped[d] = [] })
    entries.forEach(e => { if (grouped[e.dayOfWeek]) grouped[e.dayOfWeek].push(e) })
    Object.values(grouped).forEach(arr => arr.sort((a, b) => a.periodNo - b.periodNo))

    return (
        <div className="admin-page">
            <header className="admin-header glass-card">
                <button className="back-btn" onClick={() => navigate('/dashboard')}><ArrowLeft size={20} /></button>
                <Shield size={24} /><h1>Admin Panel</h1>
                <button className="btn-primary" disabled={seeding}
                    onClick={async () => {
                        setSeeding(true)
                        try {
                            const res = await apiCall('/api/admin/seed', { method: 'POST' })
                            const data = await res.json()
                            if (res.ok) {
                                showToast(`✅ ${data.message} (${data.records} records)`, 'success')
                                fetchEntries(); fetchResults(); fetchAttendance(); fetchNotifications(); fetchUsers()
                            } else {
                                showToast(data.error || 'Seed failed', 'error')
                            }
                        } catch (e) { showToast('Seed failed: ' + e.message, 'error') }
                        setSeeding(false)
                    }}>
                    {seeding ? <Loader2 size={16} className="spin" /> : <Database size={16} />}
                    {seeding ? 'Seeding...' : 'Seed Data'}
                </button>
            </header>

            <div className="admin-tabs">
                {[
                    { id: 'timetable', icon: Calendar, label: 'Timetable' },
                    { id: 'results', icon: Award, label: 'Results' },
                    { id: 'attendance', icon: UserCheck, label: 'Attendance' },
                    { id: 'notifications', icon: Bell, label: 'Notifications' },
                    { id: 'users', icon: Users, label: 'Users' }
                ].map(tab => (
                    <button key={tab.id} className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}>
                        <tab.icon size={16} />{tab.label}
                    </button>
                ))}
            </div>

            <main className="admin-content">
                {/* ============== TIMETABLE TAB ============== */}
                {activeTab === 'timetable' && (
                    <div className="admin-section">
                        <div className="section-header">
                            <h2>Timetable Manager</h2>
                            <div className="section-actions">
                                <select value={filterDay} onChange={e => setFilterDay(e.target.value)} className="filter-select">
                                    <option value="">All Days</option>
                                    {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                                <button className="btn-primary" onClick={() => { setForm({ ...EMPTY_TIMETABLE }); setEditingId(null); setShowForm(true) }}>
                                    <Plus size={16} />Add Entry
                                </button>
                            </div>
                        </div>

                        {showForm && (
                            <div className="inline-form glass-card">
                                <h3>{editingId ? 'Edit Entry' : 'Add Entry'}</h3>
                                <div className="form-grid">
                                    <select value={form.dayOfWeek} onChange={e => setForm({ ...form, dayOfWeek: e.target.value })}>
                                        {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                    <input type="number" placeholder="Period" value={form.periodNo} min={1} max={8}
                                        onChange={e => setForm({ ...form, periodNo: parseInt(e.target.value) || 1 })} />
                                    <input type="time" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} />
                                    <input type="time" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} />
                                    <input placeholder="Subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
                                    <input placeholder="Staff" value={form.staffName} onChange={e => setForm({ ...form, staffName: e.target.value })} />
                                </div>
                                <div className="form-actions">
                                    <button className="btn-primary" onClick={handleTimetableSave} disabled={saving}>
                                        {saving ? <Loader2 size={14} className="spin" /> : <Save size={14} />}{editingId ? 'Update' : 'Create'}
                                    </button>
                                    <button className="btn-secondary" onClick={() => { setShowForm(false); setEditingId(null) }}><X size={14} />Cancel</button>
                                </div>
                            </div>
                        )}

                        {loadingEntries ? <div className="admin-loading"><Loader2 className="spin" size={24} /></div> : (
                            Object.entries(grouped).filter(([, arr]) => arr.length > 0).map(([day, arr]) => (
                                <div key={day} className="day-group">
                                    <h3 className="day-title">{day}</h3>
                                    <table className="data-table">
                                        <thead><tr><th>Period</th><th>Time</th><th>Subject</th><th>Staff</th><th>Actions</th></tr></thead>
                                        <tbody>
                                            {arr.map(e => (
                                                <tr key={e.id}>
                                                    <td>{e.periodNo}</td><td>{e.startTime} - {e.endTime}</td><td>{e.subject}</td><td>{e.staffName}</td>
                                                    <td className="action-cell">
                                                        <button className="icon-btn edit" onClick={() => editTimetable(e)}><Pencil size={14} /></button>
                                                        <button className="icon-btn delete" onClick={() => handleTimetableDelete(e.id)}><Trash2 size={14} /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* ============== RESULTS TAB ============== */}
                {activeTab === 'results' && (
                    <div className="admin-section">
                        <div className="section-header">
                            <h2>Results Manager</h2>
                            <button className="btn-primary" onClick={() => { setResultForm({ ...EMPTY_RESULT }); setEditingResultId(null); setShowResultForm(true) }}>
                                <Plus size={16} />Add Result
                            </button>
                        </div>

                        {showResultForm && (
                            <div className="inline-form glass-card">
                                <h3>{editingResultId ? 'Edit Result' : 'Add Result'}</h3>
                                <div className="form-grid">
                                    <input placeholder="Student ID (UID)" value={resultForm.studentId}
                                        onChange={e => setResultForm({ ...resultForm, studentId: e.target.value })} />
                                    <input placeholder="Subject Code" value={resultForm.subject}
                                        onChange={e => setResultForm({ ...resultForm, subject: e.target.value })} />
                                    <input placeholder="Subject Name" value={resultForm.subjectName}
                                        onChange={e => setResultForm({ ...resultForm, subjectName: e.target.value })} />
                                    <input type="number" placeholder="Marks" value={resultForm.marks}
                                        onChange={e => setResultForm({ ...resultForm, marks: parseInt(e.target.value) || 0 })} />
                                    <input type="number" placeholder="Max Marks" value={resultForm.maxMarks}
                                        onChange={e => setResultForm({ ...resultForm, maxMarks: parseInt(e.target.value) || 100 })} />
                                    <input placeholder="Grade (A+, A, B+...)" value={resultForm.grade}
                                        onChange={e => setResultForm({ ...resultForm, grade: e.target.value })} />
                                    <input placeholder="Semester" value={resultForm.semester}
                                        onChange={e => setResultForm({ ...resultForm, semester: e.target.value })} />
                                </div>
                                <div className="form-actions">
                                    <button className="btn-primary" onClick={handleResultSave} disabled={savingResult}>
                                        {savingResult ? <Loader2 size={14} className="spin" /> : <Save size={14} />}{editingResultId ? 'Update' : 'Create'}
                                    </button>
                                    <button className="btn-secondary" onClick={() => { setShowResultForm(false); setEditingResultId(null) }}><X size={14} />Cancel</button>
                                </div>
                            </div>
                        )}

                        {loadingResults ? <div className="admin-loading"><Loader2 className="spin" size={24} /></div> : (
                            <table className="data-table">
                                <thead><tr><th>Code</th><th>Subject</th><th>Marks</th><th>Grade</th><th>Semester</th><th>Student</th><th>Actions</th></tr></thead>
                                <tbody>
                                    {results.map(r => (
                                        <tr key={r.id}>
                                            <td>{r.subject}</td><td>{r.subjectName || '-'}</td>
                                            <td>{r.marks}/{r.maxMarks}</td><td><span className="grade-badge">{r.grade}</span></td>
                                            <td>{r.semester}</td><td className="uid-cell">{r.studentId?.substring(0, 8)}...</td>
                                            <td className="action-cell">
                                                <button className="icon-btn edit" onClick={() => editResult(r)}><Pencil size={14} /></button>
                                                <button className="icon-btn delete" onClick={() => handleResultDelete(r.id)}><Trash2 size={14} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                    {results.length === 0 && <tr><td colSpan={7} className="empty-row">No results found</td></tr>}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {/* ============== ATTENDANCE TAB ============== */}
                {activeTab === 'attendance' && (
                    <div className="admin-section">
                        <div className="section-header">
                            <h2>Attendance Manager</h2>
                            <button className="btn-primary" onClick={() => { setAttendanceForm({ ...EMPTY_ATTENDANCE }); setEditingAttendanceId(null); setShowAttendanceForm(true) }}>
                                <Plus size={16} />Add Record
                            </button>
                        </div>

                        {showAttendanceForm && (
                            <div className="inline-form glass-card">
                                <h3>{editingAttendanceId ? 'Edit Attendance' : 'Add Attendance'}</h3>
                                <div className="form-grid">
                                    <input placeholder="Student ID (UID)" value={attendanceForm.studentId}
                                        onChange={e => setAttendanceForm({ ...attendanceForm, studentId: e.target.value })} />
                                    <input placeholder="Subject Name" value={attendanceForm.subject}
                                        onChange={e => setAttendanceForm({ ...attendanceForm, subject: e.target.value })} />
                                    <input type="number" placeholder="Total Days" value={attendanceForm.totalDays}
                                        onChange={e => setAttendanceForm({ ...attendanceForm, totalDays: parseInt(e.target.value) || 0 })} />
                                    <input type="number" placeholder="Present Days" value={attendanceForm.presentDays}
                                        onChange={e => setAttendanceForm({ ...attendanceForm, presentDays: parseInt(e.target.value) || 0 })} />
                                </div>
                                <div className="form-actions">
                                    <button className="btn-primary" onClick={handleAttendanceSave} disabled={savingAttendance}>
                                        {savingAttendance ? <Loader2 size={14} className="spin" /> : <Save size={14} />}{editingAttendanceId ? 'Update' : 'Create'}
                                    </button>
                                    <button className="btn-secondary" onClick={() => { setShowAttendanceForm(false); setEditingAttendanceId(null) }}><X size={14} />Cancel</button>
                                </div>
                            </div>
                        )}

                        {loadingAttendance ? <div className="admin-loading"><Loader2 className="spin" size={24} /></div> : (
                            <table className="data-table">
                                <thead><tr><th>Subject</th><th>Total</th><th>Present</th><th>Percentage</th><th>Student</th><th>Actions</th></tr></thead>
                                <tbody>
                                    {attendance.map(a => {
                                        const pct = a.percentage ?? (a.totalDays > 0 ? ((a.presentDays / a.totalDays) * 100).toFixed(1) : '0.0')
                                        return (
                                            <tr key={a.id}>
                                                <td>{a.subject}</td><td>{a.totalDays}</td><td>{a.presentDays}</td>
                                                <td><span className={`pct-badge ${parseFloat(pct) < 75 ? 'low' : 'ok'}`}>{typeof pct === 'number' ? pct.toFixed(1) : pct}%</span></td>
                                                <td className="uid-cell">{a.studentId?.substring(0, 8)}...</td>
                                                <td className="action-cell">
                                                    <button className="icon-btn edit" onClick={() => editAttendance(a)}><Pencil size={14} /></button>
                                                    <button className="icon-btn delete" onClick={() => handleAttendanceDelete(a.id)}><Trash2 size={14} /></button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                    {attendance.length === 0 && <tr><td colSpan={6} className="empty-row">No attendance records</td></tr>}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {/* ============== NOTIFICATIONS TAB ============== */}
                {activeTab === 'notifications' && (
                    <div className="admin-section">
                        <div className="section-header">
                            <h2>Notifications Manager</h2>
                            <button className="btn-primary" onClick={() => { setNotifForm({ ...EMPTY_NOTIFICATION }); setEditingNotifId(null); setShowNotifForm(true) }}>
                                <Plus size={16} />Add Notification
                            </button>
                        </div>

                        {showNotifForm && (
                            <div className="inline-form glass-card">
                                <h3>{editingNotifId ? 'Edit Notification' : 'Add Notification'}</h3>
                                <div className="form-grid form-grid-wide">
                                    <input placeholder="Title" value={notifForm.title}
                                        onChange={e => setNotifForm({ ...notifForm, title: e.target.value })} />
                                    <textarea placeholder="Message" rows={3} value={notifForm.message}
                                        onChange={e => setNotifForm({ ...notifForm, message: e.target.value })} />
                                    <label className="toggle-label">
                                        <input type="checkbox" checked={notifForm.isActive ?? true}
                                            onChange={e => setNotifForm({ ...notifForm, isActive: e.target.checked })} />
                                        Active
                                    </label>
                                </div>
                                <div className="form-actions">
                                    <button className="btn-primary" onClick={handleNotifSave} disabled={savingNotif}>
                                        {savingNotif ? <Loader2 size={14} className="spin" /> : <Save size={14} />}{editingNotifId ? 'Update' : 'Create'}
                                    </button>
                                    <button className="btn-secondary" onClick={() => { setShowNotifForm(false); setEditingNotifId(null) }}><X size={14} />Cancel</button>
                                </div>
                            </div>
                        )}

                        {loadingNotifications ? <div className="admin-loading"><Loader2 className="spin" size={24} /></div> : (
                            <div className="notif-list">
                                {notifications.map(n => (
                                    <div key={n.id} className={`notif-card glass-card ${n.isActive ? '' : 'inactive'}`}>
                                        <div className="notif-header">
                                            <h4>{n.title}</h4>
                                            <div className="notif-actions">
                                                <span className={`status-badge ${n.isActive ? 'active' : 'inactive'}`}>
                                                    {n.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                                <button className="icon-btn edit" onClick={() => editNotif(n)}><Pencil size={14} /></button>
                                                <button className="icon-btn delete" onClick={() => handleNotifDelete(n.id)}><Trash2 size={14} /></button>
                                            </div>
                                        </div>
                                        <p className="notif-message">{n.message}</p>
                                        <span className="notif-date">{n.createdAt ? new Date(n.createdAt).toLocaleDateString() : '-'}</span>
                                    </div>
                                ))}
                                {notifications.length === 0 && <p className="empty-message">No notifications</p>}
                            </div>
                        )}
                    </div>
                )}

                {/* ============== USERS TAB ============== */}
                {activeTab === 'users' && (
                    <div className="admin-section">
                        <div className="section-header"><h2>User Manager</h2></div>
                        {loadingUsers ? <div className="admin-loading"><Loader2 className="spin" size={24} /></div> : (
                            <table className="data-table">
                                <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Action</th></tr></thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u.uid}>
                                            <td className="user-cell">
                                                {u.photoUrl ? <img src={u.photoUrl} alt="" className="user-avatar" referrerPolicy="no-referrer" /> : <div className="user-avatar-placeholder"><Users size={14} /></div>}
                                                {u.name || 'Unknown'}
                                            </td>
                                            <td>{u.email}</td>
                                            <td><span className={`role-badge ${u.role?.toLowerCase()}`}>{u.role}</span></td>
                                            <td>
                                                <button className={`btn-sm ${u.role === 'ADMIN' ? 'btn-warning' : 'btn-success'}`}
                                                    onClick={() => toggleRole(u.uid, u.role)}>
                                                    {u.role === 'ADMIN' ? 'Demote' : 'Promote'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </main>

            {toast && (
                <div className={`admin-toast ${toast.type}`}>
                    {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                    {toast.message}
                </div>
            )}
        </div>
    )
}

export default AdminPanel
