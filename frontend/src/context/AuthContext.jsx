import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

// Demo user for testing (in production, this comes from backend)
const DEMO_USERS = [
    {
        id: 1,
        name: 'John Doe',
        email: 'student@college.edu',
        password: 'password123',
        role: 'STUDENT'
    },
    {
        id: 2,
        name: 'Admin User',
        email: 'admin@college.edu',
        password: 'admin123',
        role: 'ADMIN'
    }
]

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Check for existing session on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        const token = localStorage.getItem('token')

        if (storedUser && token) {
            try {
                setUser(JSON.parse(storedUser))
            } catch (e) {
                localStorage.removeItem('user')
                localStorage.removeItem('token')
            }
        }
        setLoading(false)
    }, [])

    const login = async (email, password) => {
        setError(null)
        setLoading(true)

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 800))

            // Try backend first (when available)
            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                })

                if (response.ok) {
                    const data = await response.json()
                    const userData = {
                        id: data.id,
                        name: data.name,
                        email: data.email,
                        role: data.role
                    }

                    localStorage.setItem('user', JSON.stringify(userData))
                    localStorage.setItem('token', data.token)
                    setUser(userData)
                    setLoading(false)
                    return { success: true }
                }
            } catch (apiError) {
                // Backend not available, use demo authentication
                console.log('Backend not available, using demo mode')
            }

            // Demo authentication
            const demoUser = DEMO_USERS.find(
                u => u.email === email && u.password === password
            )

            if (demoUser) {
                const userData = {
                    id: demoUser.id,
                    name: demoUser.name,
                    email: demoUser.email,
                    role: demoUser.role
                }

                // Generate a mock token
                const mockToken = btoa(JSON.stringify({ userId: demoUser.id, exp: Date.now() + 86400000 }))

                localStorage.setItem('user', JSON.stringify(userData))
                localStorage.setItem('token', mockToken)
                setUser(userData)
                setLoading(false)
                return { success: true }
            }

            setError('Invalid email or password')
            setLoading(false)
            return { success: false, error: 'Invalid email or password' }

        } catch (err) {
            setError('An error occurred. Please try again.')
            setLoading(false)
            return { success: false, error: 'An error occurred. Please try again.' }
        }
    }

    const logout = () => {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        setUser(null)
    }

    const value = {
        user,
        loading,
        error,
        login,
        logout,
        isAuthenticated: !!user
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
