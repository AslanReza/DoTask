import React, { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { confirmPasswordReset } from 'firebase/auth'
import { auth } from '../config/firebaseConfig'

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const oobCode = searchParams.get('oobCode')

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!oobCode) {
      setError('Invalid or missing reset code.')
      setLoading(false)
      return
    }

    try {
      await confirmPasswordReset(auth, oobCode, newPassword)
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900">
      <div className="max-w-md w-full bg-neutral-800 text-neutral-100 rounded-lg shadow-md p-8">
        <h2 className="text-3xl text-center mb-4 text-green-500">
          Reset Password
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success ? (
          <p className="text-green-500 text-center">
            Password reset successfully!{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-green-600 hover:underline"
            >
              Log In
            </button>
          </p>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-neutral-300"
              >
                New Password
              </label>
              <input
                type="password"
                id="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-neutral-700 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={loading}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default ResetPasswordPage
