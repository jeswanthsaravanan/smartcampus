import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
    Calendar,
    Award,
    UserCheck,
    Bell,
    LogOut,
    MessageSquare,
    ChevronRight,
    GraduationCap
} from 'lucide-react'
import './Dashboard.css'

const menuItems = [
    {
        id: 'timetable',
        title: 'Time Table',
        description: 'Check your class schedule and upcoming periods',
        icon: Calendar,
        color: '#7c3aed',
        gradient: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)'
    },
    {
        id: 'result',
        title: 'Result',
        description: 'View your exam marks, grades and performance',
        icon: Award,
        color: '#06b6d4',
        gradient: 'linear-gradient(135deg, #06b6d4 0%, #67e8f9 100%)'
    },
    {
        id: 'attendance',
        title: 'Attendance',
        description: 'Track your attendance and shortage status',
        icon: UserCheck,
        color: '#10b981',
        gradient: 'linear-gradient(135deg, #10b981 0%, #6ee7b7 100%)'
    },
    {
        id: 'notification',
        title: 'Notification',
        description: 'College announcements and important updates',
        icon: Bell,
        color: '#f59e0b',
        gradient: 'linear-gradient(135deg, #f59e0b 0%, #fcd34d 100%)'
    }
]

function Dashboard() {
    const navigate = useNavigate()
    const { user, logout } = useAuth()

    const handleMenuClick = (moduleId) => {
        navigate(`/chat/${moduleId}`)
    }

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div className="dashboard-page">
            {/* Header */}
            <header className="dashboard-header glass-card">
                <div className="header-content">
                    <div className="header-left">
                        <div className="header-logo">
                            <GraduationCap size={28} />
                        </div>
                        <div className="header-info">
                            <h1>Smart College Portal</h1>
                            <p>Welcome back, {user?.name || 'Student'}</p>
                        </div>
                    </div>
                    <button
                        className="logout-btn btn-secondary"
                        onClick={handleLogout}
                    >
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="dashboard-main">
                {/* Welcome Section */}
                <section className="welcome-section animate-slide-up">
                    <div className="welcome-card glass-card">
                        <div className="welcome-content">
                            <MessageSquare size={32} className="welcome-icon" />
                            <div>
                                <h2>Chat-Based Assistant</h2>
                                <p>
                                    Select a module below to start chatting. Ask questions naturally
                                    and get instant responses about your schedule, results, and more.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Menu Grid */}
                <section className="menu-section">
                    <h3 className="section-title">Quick Access</h3>
                    <div className="menu-grid">
                        {menuItems.map((item, index) => (
                            <button
                                key={item.id}
                                className="menu-card glass-card animate-slide-up"
                                style={{ animationDelay: `${index * 100}ms` }}
                                onClick={() => handleMenuClick(item.id)}
                            >
                                <div
                                    className="menu-icon-wrapper"
                                    style={{ background: item.gradient }}
                                >
                                    <item.icon size={28} />
                                </div>
                                <div className="menu-info">
                                    <h4>{item.title}</h4>
                                    <p>{item.description}</p>
                                </div>
                                <ChevronRight className="menu-arrow" size={20} />
                            </button>
                        ))}
                    </div>
                </section>

                {/* Quick Stats (Optional) */}
                <section className="stats-section animate-slide-up" style={{ animationDelay: '400ms' }}>
                    <h3 className="section-title">Today's Overview</h3>
                    <div className="stats-grid">
                        <div className="stat-card glass-card">
                            <div className="stat-value">5</div>
                            <div className="stat-label">Classes Today</div>
                        </div>
                        <div className="stat-card glass-card">
                            <div className="stat-value">87%</div>
                            <div className="stat-label">Attendance</div>
                        </div>
                        <div className="stat-card glass-card">
                            <div className="stat-value">3</div>
                            <div className="stat-label">New Alerts</div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default Dashboard
