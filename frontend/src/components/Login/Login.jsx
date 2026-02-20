import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Mail, Lock, Eye, EyeOff, GraduationCap, UserPlus, ArrowRight, Sparkles } from 'lucide-react'
import './Login.css'

function Login() {
    const [isLogin, setIsLogin] = useState(true)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isGoogleLoading, setIsGoogleLoading] = useState(false)
    const [error, setError] = useState('')

    const { login, loginWithGoogle, register } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!email || !password || (!isLogin && !name)) {
            setError('Please fill in all fields')
            return
        }

        setIsLoading(true)

        if (isLogin) {
            const result = await login(email, password)
            if (!result.success) {
                setError(result.error)
            }
        } else {
            const result = await register(name, email, password)
            if (!result.success) {
                setError(result.error)
            }
        }
        setIsLoading(false)
    }

    const handleGoogleSignIn = async () => {
        setError('')
        setIsGoogleLoading(true)
        const result = await loginWithGoogle()
        if (!result.success) {
            setError(result.error)
        }
        setIsGoogleLoading(false)
    }

    return (
        <div className="login-page">
            {/* Animated background */}
            <div className="login-bg">
                <div className="login-orb login-orb-1"></div>
                <div className="login-orb login-orb-2"></div>
                <div className="login-orb login-orb-3"></div>
                <div className="login-grid"></div>
            </div>

            <div className="login-wrapper">
                {/* Left side — branding panel */}
                <div className="login-branding">
                    <div className="branding-content">
                        <div className="branding-badge">
                            <Sparkles size={16} />
                            <span>AI-Powered Campus</span>
                        </div>
                        <h1 className="branding-title">
                            Smart<br />College<br />Portal
                        </h1>
                        <p className="branding-subtitle">
                            Your intelligent campus companion — timetables, attendance, results & more, all in one place.
                        </p>
                        <div className="branding-features">
                            <div className="feature-pill">
                                <div className="feature-dot"></div>
                                <span>Real-time Timetable</span>
                            </div>
                            <div className="feature-pill">
                                <div className="feature-dot"></div>
                                <span>Smart Chatbot</span>
                            </div>
                            <div className="feature-pill">
                                <div className="feature-dot"></div>
                                <span>Attendance Tracker</span>
                            </div>
                        </div>
                    </div>
                    <div className="branding-decoration">
                        <GraduationCap size={200} strokeWidth={0.8} />
                    </div>
                </div>

                {/* Right side — form card */}
                <div className="login-card-panel">
                    <div className="login-card">
                        <div className="card-header">
                            <div className="card-logo-mobile">
                                <GraduationCap size={32} />
                            </div>
                            <h2>{isLogin ? 'Welcome back' : 'Create account'}</h2>
                            <p>{isLogin ? 'Sign in to continue to your dashboard' : 'Register for a new student account'}</p>
                        </div>

                        {/* Google Sign-In Button */}
                        <button
                            type="button"
                            className="google-btn"
                            onClick={handleGoogleSignIn}
                            disabled={isGoogleLoading || isLoading}
                        >
                            {isGoogleLoading ? (
                                <div className="loader loader-sm"></div>
                            ) : (
                                <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                            )}
                            <span>{isGoogleLoading ? 'Signing in...' : 'Continue with Google'}</span>
                        </button>

                        {/* Divider */}
                        <div className="auth-divider">
                            <div className="divider-line"></div>
                            <span>or</span>
                            <div className="divider-line"></div>
                        </div>

                        {/* Email/Password Form */}
                        <form onSubmit={handleSubmit} className="login-form">
                            {error && (
                                <div className="error-banner animate-fade-in">
                                    <span className="error-icon">!</span>
                                    <span>{error}</span>
                                </div>
                            )}

                            {!isLogin && (
                                <div className="form-field">
                                    <label htmlFor="name">Full Name</label>
                                    <div className="field-input-wrap">
                                        <UserPlus className="field-icon" size={18} />
                                        <input
                                            type="text"
                                            id="name"
                                            placeholder="Your full name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            autoComplete="name"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="form-field">
                                <label htmlFor="email">Email Address</label>
                                <div className="field-input-wrap">
                                    <Mail className="field-icon" size={18} />
                                    <input
                                        type="email"
                                        id="email"
                                        placeholder="you@college.edu"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            <div className="form-field">
                                <label htmlFor="password">Password</label>
                                <div className="field-input-wrap">
                                    <Lock className="field-icon" size={18} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        autoComplete={isLogin ? 'current-password' : 'new-password'}
                                    />
                                    <button
                                        type="button"
                                        className="toggle-vis"
                                        onClick={() => setShowPassword(!showPassword)}
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={isLoading || isGoogleLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="loader loader-sm"></div>
                                        <span>{isLogin ? 'Signing in…' : 'Creating account…'}</span>
                                    </>
                                ) : (
                                    <>
                                        <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="switch-mode">
                            <span>{isLogin ? "Don't have an account?" : 'Already have an account?'}</span>
                            <button onClick={() => { setIsLogin(!isLogin); setError('') }}>
                                {isLogin ? 'Register' : 'Sign In'}
                            </button>
                        </div>
                    </div>

                    <p className="login-footer">© 2026 Smart College Portal</p>
                </div>
            </div>
        </div>
    )
}

export default Login
