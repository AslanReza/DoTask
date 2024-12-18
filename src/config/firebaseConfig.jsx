// Import Firebase
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Firebase configuration object
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: 'ontask-7a3d6.firebaseapp.com',
  projectId: 'ontask-7a3d6',
  storageBucket: 'ontask-7a3d6.firebasestorage.app',
  measurementId: 'G-T38WMCHC99',
  messagingSenderId: '743462603921',
  appId: '1:743462603921:web:d8610f6f0494fe05b44330',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Export Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
