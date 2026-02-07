import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './components/Login/Login'
import Dashboard from './components/Dashboard/Dashboard'
import ChatWindow from './components/Chat/ChatWindow'

// Protected Route Component
function ProtectedRoute({ children }) {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full" style={{ minHeight: '100vh' }}>
                <div className="loader"></div>
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return children
}

// Public Route (redirects to dashboard if already logged in)
function PublicRoute({ children }) {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full" style={{ minHeight: '100vh' }}>
                <div className="loader"></div>
            </div>
        )
    }

    if (user) {
        return <Navigate to="/dashboard" replace />
    }

    return children
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/login"
                        element={
                            <PublicRoute>
                                <Login />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/chat/:module"
                        element={
                            <ProtectedRoute>
                                <ChatWindow />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default App
