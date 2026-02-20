import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
    ArrowLeft, Save, User, Mail, Hash, Building2, CalendarRange,
    GraduationCap, Camera, CheckCircle, AlertCircle, Loader2
} from 'lucide-react'
import './Profile.css'

const DEPARTMENTS = [
    'Computer Science & Engineering',
    'Information Technology',
    'Electronics & Communication',
    'Electrical & Electronics',
    'Mechanical Engineering',
    'Civil Engineering',
    'Chemical Engineering',
    'Biomedical Engineering',
    'Artificial Intelligence & Data Science',
    'Cyber Security',
    'Other'
]

const BATCH_OPTIONS = [
    '2021-2025', '2022-2026', '2023-2027', '2024-2028', '2025-2029'
]

const YEAR_OPTIONS = [
    { value: 1, label: '1st Year' },
    { value: 2, label: '2nd Year' },
    { value: 3, label: '3rd Year' },
    { value: 4, label: '4th Year' }
]

function Profile() {
    const navigate = useNavigate()
    const { user, getAuthToken } = useAuth()

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        registerNumber: '',
        department: '',
        batch: '',
        year: ''
    })
    const [photoUrl, setPhotoUrl] = useState('')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [toast, setToast] = useState(null) // { type: 'success' | 'error', message }

    // Fetch profile on mount
    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        try {
            const token = await getAuthToken()
            const res = await fetch('/api/student/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                setForm({
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    registerNumber: data.registerNumber || '',
                    department: data.department || '',
                    batch: data.batch || '',
                    year: data.year || ''
                })
                setPhotoUrl(data.photoUrl || '')
            }
        } catch (err) {
            console.error('Failed to fetch profile:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }))
    }

    const handleSave = async () => {
        setSaving(true)
        setToast(null)

        try {
            const token = await getAuthToken()
            const payload = {
                ...form,
                year: form.year ? Number(form.year) : null
            }

            const res = await fetch('/api/student/profile', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })

            if (res.ok) {
                setToast({ type: 'success', message: 'Profile saved successfully!' })
                setTimeout(() => setToast(null), 3000)
            } else {
                throw new Error('Failed to save')
            }
        } catch (err) {
            setToast({ type: 'error', message: 'Failed to save profile. Please try again.' })
            setTimeout(() => setToast(null), 4000)
        } finally {
            setSaving(false)
        }
    }

    const displayEmail = user?.email || ''
    const initials = (form.firstName?.[0] || '') + (form.lastName?.[0] || '')

    if (loading) {
        return (
            <div className="profile-page">
                <div className="profile-loading">
                    <div className="loader"></div>
                    <p>Loading profile…</p>
                </div>
            </div>
        )
    }

    return (
        <div className="profile-page">
            {/* Toast notification */}
            {toast && (
                <div className={`profile-toast profile-toast-${toast.type} animate-fade-in`}>
                    {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    <span>{toast.message}</span>
                </div>
            )}

            <div className="profile-container">
                {/* Header bar */}
                <div className="profile-top-bar">
                    <button className="profile-back-btn" onClick={() => navigate('/dashboard')}>
                        <ArrowLeft size={20} />
                        <span>Back</span>
                    </button>
                    <button
                        className="profile-save-btn"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? (
                            <><Loader2 size={18} className="animate-spin" /> Saving…</>
                        ) : (
                            <><Save size={18} /> Save Changes</>
                        )}
                    </button>
                </div>

                {/* Profile hero */}
                <div className="profile-hero glass-card">
                    <div className="profile-avatar-section">
                        <div className="profile-avatar">
                            {photoUrl ? (
                                <img src={photoUrl} alt="Profile" referrerPolicy="no-referrer" />
                            ) : (
                                <div className="avatar-placeholder">
                                    {initials || <User size={40} />}
                                </div>
                            )}
                            <div className="avatar-badge">
                                <Camera size={14} />
                            </div>
                        </div>
                        <div className="profile-identity">
                            <h1>
                                {form.firstName || form.lastName
                                    ? `${form.firstName} ${form.lastName}`.trim()
                                    : 'Student'}
                            </h1>
                            <p className="profile-email">
                                <Mail size={14} />
                                {displayEmail}
                            </p>
                            {form.department && (
                                <span className="profile-dept-badge">
                                    <Building2 size={12} />
                                    {form.department}
                                </span>
                            )}
                        </div>
                    </div>
                    <p className="photo-hint">
                        <Camera size={14} /> Profile photo syncs from your Google account
                    </p>
                </div>

                {/* Form sections */}
                <div className="profile-sections">
                    {/* Personal Info */}
                    <section className="profile-section glass-card">
                        <div className="section-header">
                            <User size={20} />
                            <h2>Personal Information</h2>
                        </div>
                        <div className="form-row">
                            <div className="form-field-profile">
                                <label>First Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter first name"
                                    value={form.firstName}
                                    onChange={(e) => handleChange('firstName', e.target.value)}
                                />
                            </div>
                            <div className="form-field-profile">
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter last name"
                                    value={form.lastName}
                                    onChange={(e) => handleChange('lastName', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-field-profile full-width">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    value={displayEmail}
                                    disabled
                                    className="field-disabled"
                                />
                                <span className="field-note">Email is linked to your login and cannot be changed</span>
                            </div>
                        </div>
                    </section>

                    {/* Academic Info */}
                    <section className="profile-section glass-card">
                        <div className="section-header">
                            <GraduationCap size={20} />
                            <h2>Academic Details</h2>
                        </div>
                        <div className="form-row">
                            <div className="form-field-profile">
                                <label>Register Number</label>
                                <div className="input-with-icon">
                                    <Hash size={16} />
                                    <input
                                        type="text"
                                        placeholder="e.g. 2023CSE001"
                                        value={form.registerNumber}
                                        onChange={(e) => handleChange('registerNumber', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="form-field-profile">
                                <label>Department</label>
                                <div className="input-with-icon">
                                    <Building2 size={16} />
                                    <select
                                        value={form.department}
                                        onChange={(e) => handleChange('department', e.target.value)}
                                    >
                                        <option value="">Select department</option>
                                        {DEPARTMENTS.map(d => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-field-profile">
                                <label>Batch</label>
                                <div className="input-with-icon">
                                    <CalendarRange size={16} />
                                    <select
                                        value={form.batch}
                                        onChange={(e) => handleChange('batch', e.target.value)}
                                    >
                                        <option value="">Select batch</option>
                                        {BATCH_OPTIONS.map(b => (
                                            <option key={b} value={b}>{b}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-field-profile">
                                <label>Year of Study</label>
                                <div className="input-with-icon">
                                    <GraduationCap size={16} />
                                    <select
                                        value={form.year}
                                        onChange={(e) => handleChange('year', e.target.value)}
                                    >
                                        <option value="">Select year</option>
                                        {YEAR_OPTIONS.map(y => (
                                            <option key={y.value} value={y.value}>{y.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default Profile
