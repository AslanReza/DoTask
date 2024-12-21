import React, { useState } from 'react'
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { auth } from '../config/firebaseConfig'
import { useNavigate } from 'react-router-dom'
import { RiLockPasswordFill } from 'react-icons/ri'
import { MdEmail } from 'react-icons/md'
import { Link } from 'react-router-dom'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetEmailSent, setResetEmailSent] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await signInWithEmailAndPassword(auth, email, password)
      console.log('Login successful!')
      navigate('/tasks')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordReset = async () => {
    if (!resetEmail) {
      setError('Please enter your email address to reset your password.')
      return
    }

    try {
      await sendPasswordResetEmail(auth, resetEmail)
      setResetEmailSent(true)
      setError('')
      setShowResetModal(false)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="bg-neutral-900">
      <nav className="flex w-full fixed top-0 bg-neutral-800 shadow-md px-4 py-1 text-neutral-100  justify-center items-center">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Link to={'/'} className="text-2xl rubik-80s-fade-regular">
              <span className="text-sm text-green-500">On</span>Task
            </Link>
          </div>
        </div>
      </nav>
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-sm p-8 bg-neutral-800 shadow-lg rounded-3xl">
          <h1 className="text-4xl text-center mb-6 text-green-500">Login</h1>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {resetEmailSent && (
            <p className="text-green-500 text-center mb-4">
              Password reset email sent!
            </p>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="flex gap-1 items-center text-gray-300 mb-2"
              >
                Email
                <MdEmail />
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-neutral-100 px-4 py-2 border border-neutral-900 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-neutral-700"
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="flex gap-1 items-center text-gray-300 mb-2"
              >
                Password
                <RiLockPasswordFill />
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 text-neutral-100 py-2 border border-neutral-900 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-neutral-700"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-4 text-sm text-center">
            <p className="text-gray-700">
              Don't have an account?{' '}
              <a href="/signup" className="text-green-600 hover:underline">
                Sign Up
              </a>
            </p>
            <p className="text-gray-700 mt-2">
              Forgot your password?{' '}
              <button
                onClick={() => setShowResetModal(true)}
                className="text-green-600 hover:underline"
              >
                Reset Password
              </button>
            </p>
          </div>
        </div>
      </div>

      {showResetModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-neutral-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl mb-4 text-green-500">Reset Password</h2>
            <input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="w-full px-4 py-2 mb-4 border border-neutral-900 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-neutral-700 text-neutral-100"
            />
            <button
              onClick={handlePasswordReset}
              className="w-full py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Reset
            </button>
            <button
              onClick={() => setShowResetModal(false)}
              className="w-full py-2 mt-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default LoginPage
