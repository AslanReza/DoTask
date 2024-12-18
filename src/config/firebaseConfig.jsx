// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: 'ontask-616ee.firebaseapp.com',
  projectId: 'ontask-616ee',
  storageBucket: 'ontask-616ee.firebasestorage.app',
  messagingSenderId: '927525621270',
  appId: '1:927525621270:web:ca0515366f61a06b086f37',
  measurementId: 'G-TP90ECKZ71',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
