import React, { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../config/firebaseConfig'
import { RiLockPasswordFill, RiEyeCloseFill, RiEyeFill } from 'react-icons/ri'
import { MdEmail } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

const SignUpPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [passwordVisible, setPasswordVisible] = useState(false) // State for password visibility
  const navigate = useNavigate()

  // Email validation regex (simple example)
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/

  // Password strength check function
  const calculatePasswordStrength = (password) => {
    const lengthCriteria = password.length >= 8
    const hasNumber = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)

    let strength = 0
    if (lengthCriteria) strength += 20
    if (hasNumber) strength += 20
    if (hasSpecialChar) strength += 20
    if (hasUpperCase) strength += 20
    if (hasLowerCase) strength += 20

    return strength
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.')
      setLoading(false)
      return
    }

    if (passwordStrength < 80) {
      setError('Password must meet the required strength.')
      setLoading(false)
      return
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password)
      console.log('User created successfully!')
      navigate('/login')
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError(
          'This email is already associated with an existing account. Please use a different email.'
        )
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value
    setPassword(newPassword)
    setPasswordStrength(calculatePasswordStrength(newPassword)) // Update password strength
  }

  return (
    <div className="bg-neutral-900">
      <nav className="flex w-full fixed top-0 bg-neutral-800 shadow-md px-4 py-1 text-neutral-100 justify-center items-center">
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
          <h1 className="text-4xl text-center text-green-500 mb-6">Sign Up</h1>

          {/* Display error if there is one */}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSignUp}>
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
                className="w-full px-4 text-neutral-100 py-2 border border-neutral-900 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-neutral-700"
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
              <div className="relative">
                <input
                  type={passwordVisible ? 'text' : 'password'} // Toggle password visibility
                  id="password"
                  value={password}
                  onChange={handlePasswordChange} // Handle password change
                  className="w-full px-4 text-neutral-100 py-2 border border-neutral-900 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-neutral-700 pr-10" // Added padding for the icon
                  required
                />
                <span
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => setPasswordVisible(!passwordVisible)} // Toggle the visibility state
                >
                  {passwordVisible ? (
                    <RiEyeFill size={24} color="#fff" />
                  ) : (
                    <RiEyeCloseFill size={24} color="#fff" />
                  )}
                </span>
              </div>

              {/* Password strength progress bar */}
              <div className="mt-2 w-full bg-neutral-600 h-2 rounded-full">
                <div
                  style={{
                    width: `${passwordStrength}%`,
                    backgroundColor:
                      passwordStrength < 40
                        ? 'red'
                        : passwordStrength < 70
                        ? 'yellow'
                        : 'green',
                  }}
                  className="h-full rounded-full"
                ></div>
              </div>
              <div className="mt-1 text-xs text-gray-400">
                Password strength: {passwordStrength}%
                {passwordStrength < 40
                  ? ' (Weak)'
                  : passwordStrength < 70
                  ? ' (Medium)'
                  : ' (Strong)'}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-4 text-sm text-center">
            <p className="text-gray-700">
              Already have an account?{' '}
              <a href="/login" className="text-green-600 hover:underline">
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
