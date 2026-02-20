import { createContext, useContext, useState, useEffect } from 'react'
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    getIdToken
} from 'firebase/auth'
import { auth } from '../firebase'

const googleProvider = new GoogleAuthProvider()

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        // Subscribe to Firebase auth state changes
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Get fresh token and profile data if needed
                try {
                    const token = await firebaseUser.getIdToken()

                    // Fetch profile from backend to ensure Firestore has it
                    // and to get additional fields (name, role)
                    const response = await fetch('/api/auth/me', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })

                    if (response.ok) {
                        const userData = await response.json()
                        setUser({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            ...userData,
                            token // Store token for subsequent API calls
                        })
                    } else {
                        // Profile might not exist yet (first login)
                        setUser({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            token
                        })
                    }
                } catch (err) {
                    console.error("Error fetching user profile:", err)
                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email
                    })
                }
            } else {
                setUser(null)
            }
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    const login = async (email, password) => {
        setError(null)
        setLoading(true)

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const firebaseUser = userCredential.user
            const token = await firebaseUser.getIdToken()

            // After login, we can try to get the profile
            const response = await fetch('/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            let userData = {}
            if (response.ok) {
                userData = await response.json()
            }

            setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                ...userData,
                token
            })

            setLoading(false)
            return { success: true }
        } catch (err) {
            let message = 'Invalid email or password'
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                message = 'Invalid email or password'
            } else if (err.code === 'auth/network-request-failed') {
                message = 'Network error. Please check your connection.'
            }

            setError(message)
            setLoading(false)
            return { success: false, error: message }
        }
    }

    const loginWithGoogle = async () => {
        setError(null)
        setLoading(true)

        try {
            const userCredential = await signInWithPopup(auth, googleProvider)
            const firebaseUser = userCredential.user
            const token = await firebaseUser.getIdToken()

            // Always call register-profile for Google sign-in
            // Backend handles both new and existing users, and syncs photo/name each time
            const regResponse = await fetch('/api/auth/register-profile', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: firebaseUser.displayName || 'Student',
                    photoUrl: firebaseUser.photoURL || ''
                })
            })

            let userData = {}
            if (regResponse.ok) {
                userData = await regResponse.json()
            }

            setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                ...userData,
                token
            })

            setLoading(false)
            return { success: true }
        } catch (err) {
            let message = 'Google sign-in failed. Please try again.'
            if (err.code === 'auth/popup-closed-by-user') {
                message = 'Sign-in cancelled'
            } else if (err.code === 'auth/network-request-failed') {
                message = 'Network error. Please check your connection.'
            }

            setError(message)
            setLoading(false)
            return { success: false, error: message }
        }
    }

    const register = async (name, email, password) => {
        setError(null)
        setLoading(true)

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const firebaseUser = userCredential.user
            const token = await firebaseUser.getIdToken()

            // Register profile on backend
            const response = await fetch('/api/auth/register-profile', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name })
            })

            if (!response.ok) {
                throw new Error('Failed to register profile on server')
            }

            const userData = await response.json()
            setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                ...userData,
                token
            })

            setLoading(false)
            return { success: true }
        } catch (err) {
            let message = err.message
            if (err.code === 'auth/email-already-in-use') {
                message = 'Email already in use'
            } else if (err.code === 'auth/weak-password') {
                message = 'Password is too weak'
            }

            setError(message)
            setLoading(false)
            return { success: false, error: message }
        }
    }

    const logout = async () => {
        try {
            await signOut(auth)
            setUser(null)
        } catch (err) {
            console.error("Logout error:", err)
        }
    }

    const getAuthToken = async () => {
        if (auth.currentUser) {
            return await auth.currentUser.getIdToken(true)
        }
        return null
    }

    const value = {
        user,
        loading,
        error,
        login,
        loginWithGoogle,
        register,
        logout,
        getAuthToken,
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
