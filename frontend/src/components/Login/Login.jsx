import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Mail, Lock, LogIn, Eye, EyeOff, GraduationCap } from 'lucide-react'
import './Login.css'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const { login } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!email || !password) {
            setError('Please fill in all fields')
            return
        }

        setIsLoading(true)
        const result = await login(email, password)

        if (!result.success) {
            setError(result.error)
        }
        setIsLoading(false)
    }

    return (
        <div className="login-page">
            {/* Animated background elements */}
            <div className="login-bg-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>

            <div className="login-container animate-slide-up">
                <div className="login-card glass-card">
                    {/* Logo Section */}
                    <div className="login-header">
                        <div className="login-logo">
                            <GraduationCap size={48} />
                        </div>
                        <h1>Smart College Portal</h1>
                        <p>Sign in to access your student dashboard</p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="login-form">
                        {error && (
                            <div className="error-message animate-fade-in">
                                {error}
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email Address</label>
                            <div className="input-wrapper">
                                <Mail className="input-icon" size={20} />
                                <input
                                    type="email"
                                    id="email"
                                    className="form-input"
                                    placeholder="student@college.edu"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Password</label>
                            <div className="input-wrapper">
                                <Lock className="input-icon" size={20} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    className="form-input"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-primary login-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <div className="loader loader-sm"></div>
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    <LogIn size={20} />
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>

                    {/* Demo Credentials */}
                    <div className="demo-credentials">
                        <p className="demo-title">Demo Credentials</p>
                        <div className="demo-info">
                            <span>Email: <code>student@college.edu</code></span>
                            <span>Password: <code>password123</code></span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <p className="login-footer">
                    © 2026 Smart College Portal. All rights reserved.
                </p>
            </div>
        </div>
    )
}

export default Login
