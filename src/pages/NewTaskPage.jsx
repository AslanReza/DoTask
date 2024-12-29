import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { db } from '../config/firebaseConfig'
import { collection, addDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { IoMdLogOut } from 'react-icons/io'
import { FaTasks } from 'react-icons/fa'

const NewTaskPage = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('Optional')
  const [category, setCategory] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [reminderChecked, setReminderChecked] = useState(false)
  const [reminderDate, setReminderDate] = useState('')
  const [reminderEmail, setReminderEmail] = useState('') // Email state
  const [reminderFrequency, setReminderFrequency] = useState('once')
  const navigate = useNavigate()
  const { user, logout } = useAuth() // Access logged in user from context
  const [creator, setCreator] = useState('')

  // Set default email when the user is logged in
  useEffect(() => {
    if (user) {
      setReminderEmail(user.email) // Set email as default reminder value
    }
  }, [user])

  const handleCreateTask = async (e) => {
    e.preventDefault()

    setError('')
    if (!user) {
      setError('You must be logged in to create a task.')
      return
    }

    if (!title.trim() || !description.trim()) {
      setError('Both title and description are required.')
      return
    }

    const taskData = {
      userId: user.uid,
      title: title.trim(),
      description: description.trim(),
      priority,
      category: category || null,
      creator: creator.trim() || '',
      createdAt: new Date(),
      archived: false,
      reminder: reminderChecked
        ? {
            date: reminderDate,
            email: reminderEmail, // Store the email as part of reminder
            frequency: reminderFrequency,
          }
        : null,
      completed: false, // Ensure completed is false when creating the task
    }

    setLoading(true)
    try {
      await addDoc(collection(db, 'tasks'), taskData)
      navigate('/tasks')
    } catch (err) {
      setError(`Failed to create task. Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleReminderChange = () => {
    setReminderChecked(!reminderChecked)
    if (!reminderChecked) {
      setReminderDate('')
      setReminderFrequency('once') // Reset frequency when reminder is disabled
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
      <div className="flex justify-center m-4 items-center h-auto">
        <form
          onSubmit={handleCreateTask}
          className="bg-neutral-800 p-8 m-10 shadow-lg rounded-lg w-full max-w-md"
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
          <div className="mb-4">
            <label className="text-gray-300 mb-2">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full text-neutral-100 px-4 py-2 border border-neutral-900 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-neutral-700"
            >
              <option value="Urgent">Urgent</option>
              <option value="Important">Important</option>
              <option value="Optional">Optional</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="text-gray-300 mb-2">Author</label>
            <input
              type="text"
              value={creator}
              onChange={(e) => setCreator(e.target.value)}
              placeholder="Mention creator's name if Needed"
              className="w-full text-neutral-100 px-4 py-2 border border-neutral-900 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-neutral-700"
            />
          </div>
          <div className="mb-4">
            <label className="text-gray-300 mb-2">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Enter category (e.g., Work, Personal)"
              className="w-full text-neutral-100 px-4 py-2 border border-neutral-900 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-neutral-700"
            />
          </div>
          <div className="mb-4 flex items-center gap-2">
            <div
              onClick={handleReminderChange}
              className={`w-[22px] h-[22px] rounded-full cursor-pointer border-2 transition-all duration-300
                ${reminderChecked ? 'bg-green-500' : 'bg-green-100'} 
                ${reminderChecked ? 'border-green-800' : 'border-neutral-700'}`}
            >
              {reminderChecked && (
                <div className="w-full h-full bg-green-500 rounded-full" />
              )}
            </div>
            <label className="text-gray-300">Set a reminder</label>
          </div>

          {reminderChecked && (
            <div className="mb-4">
              <label className="text-gray-300 mb-2">
                Reminder Date and Time
              </label>
              <input
                type="datetime-local"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
                className="w-full mb-1 text-neutral-100 px-4 py-2 border border-neutral-900 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-neutral-700"
                required
              />
              <label className="text-gray-300 mb-2 mt-2">
                Email for Reminder
              </label>
              <input
                type="email"
                value={reminderEmail} // This will be default to logged user's email
                disabled // Make the input field read-only
                className="w-full text-neutral-100 px-4 py-2 border border-neutral-900 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-neutral-700"
                required
              />
              <div className="mt-4">
                <label className="text-gray-300 mb-2">Reminder Frequency</label>
                <select
                  value={reminderFrequency}
                  onChange={(e) => setReminderFrequency(e.target.value)}
                  className="w-full text-neutral-100 px-4 py-2 border border-neutral-900 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-neutral-700"
                >
                  <option value="once">Once</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Task'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default NewTaskPage
