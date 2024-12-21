import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { db } from '../config/firebaseConfig'
import { collection, addDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { FaCircleQuestion } from 'react-icons/fa6'
import { IoMdLogOut } from 'react-icons/io'
import { FaTasks } from 'react-icons/fa'

const NewTaskPage = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleCreateTask = async (e) => {
    e.preventDefault()

    // Clear any existing errors
    setError('')

    if (!user) {
      console.error('Error: User not authenticated.')
      setError('You must be logged in to create a task.')
      return
    }

    if (!title.trim() || !description.trim()) {
      console.error('Error: Title or description is empty.')
      setError('Both title and description are required.')
      return
    }

    const taskData = {
      userId: user.uid,
      title: title.trim(),
      description: description.trim(),
      createdAt: new Date(),
      archived: false, // Ensure this field is set to false by default
    }

    console.log('Attempting to create task:', taskData)

    setLoading(true)
    try {
      await addDoc(collection(db, 'tasks'), taskData)
      console.log('Task successfully created.')
      navigate('/tasks')
    } catch (err) {
      console.error('Error creating task:', err.message, err)
      setError(
        `Failed to create task. Error: ${err.message}. Check Firestore rules and console logs.`
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <nav className="flex w-full fixed top-0 bg-neutral-800 shadow-md px-4 py-1 text-neutral-100 justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl rubik-80s-fade-regular">
              <span className="text-sm text-green-500">On</span>Task
            </h1>
            <span className="text-neutral-400">|</span>
            <button
              onClick={() => navigate('/tasks')}
              className="text-2xl flex items-center flex-row-reverse gap-2 bg-green-600 rounded-full p-1"
            >
              <span className="text-xs inline-block">Tasks</span>
              <FaTasks />
            </button>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/faqs')}
            className="bg-blue-800 p-1 text-2xl items-center group flex flex-row gap-1 rounded-full"
          >
            <span className="text-xs group-hover:inline-block hidden">FAQ</span>
            <FaCircleQuestion />
          </button>
          <button
            onClick={logout}
            className="bg-red-500 p-1 text-2xl items-center group flex flex-row gap-1 rounded-full"
          >
            <span className="text-xs group-hover:inline-block hidden">
              Log Out
            </span>
            <IoMdLogOut />
          </button>
        </div>
      </nav>
      <div className="flex justify-center items-center h-screen">
        <form
          onSubmit={handleCreateTask}
          className="bg-neutral-800 p-8 shadow-lg rounded-lg w-full max-w-md"
        >
          <h1 className="text-2xl mb-4 text-center text-green-500">New Task</h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="mb-4">
            <label className="flex gap-1 items-center text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-neutral-100 px-4 py-2 border border-neutral-900 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-neutral-700"
              required
            />
          </div>
          <div className="mb-4">
            <label className="flex gap-1 items-center text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-neutral-100 px-4 py-2 border border-neutral-900 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-neutral-700 custom-scrollbar"
              rows="5"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Task'}
          </button>
        </form>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #202020;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #2f855a;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #38a169;
        }
      `}</style>
    </div>
  )
}

export default NewTaskPage
