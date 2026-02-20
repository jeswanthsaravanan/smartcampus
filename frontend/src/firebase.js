// ============================================================
// Firebase Configuration for Smart College Portal
// ============================================================

import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyDJWsYP9TcXLynAtHgqlTTtT1HhVKXtzrs",
    authDomain: "smartcampus0512.firebaseapp.com",
    projectId: "smartcampus0512",
    storageBucket: "smartcampus0512.firebasestorage.app",
    messagingSenderId: "638502402023",
    appId: "1:638502402023:web:12fd15a591304db482af42",
    measurementId: "G-HF65VSQDVF"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

// Export auth, firestore, and analytics instances
export const auth = getAuth(app)
export const db = getFirestore(app)
export { analytics }
export default app
