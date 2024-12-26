import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { db } from '../config/firebaseConfig'
import { useAuth } from '../context/AuthContext'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

const EditTaskPage = () => {
  const { taskId } = useParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { user } = useAuth()
  const navigate = useNavigate()

  const [task, setTask] = useState({
    userId: user.uid,
    title: '',
    description: '',
    priority: 'Optional',
    category: '',
    creator: '',
    createdAt: new Date(),
    archived: false,
    reminder: {
      date: '',
      email: '',
    },
  })

  const [reminderChecked, setReminderChecked] = useState(false)

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const taskRef = doc(db, 'tasks', taskId)
        const taskSnap = await getDoc(taskRef)
        if (taskSnap.exists()) {
          const fetchedTask = taskSnap.data()
          setTask({
            ...fetchedTask,
            reminder: fetchedTask.reminder || { date: '', email: '' },
          })
          setReminderChecked(!!fetchedTask.reminder)
        } else {
          setError('Task not found')
        }
      } catch (err) {
        setError('Failed to fetch task details')
      }
    }

    fetchTask()
  }, [taskId])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    console.log(`Updating ${name} to ${value}`) 
    setTask((prevTask) => ({ ...prevTask, [name]: value }))
  }

  const handleReminderChange = () => {
    setReminderChecked(!reminderChecked)
    setTask((prevTask) => ({
      ...prevTask,
      reminder: reminderChecked ? null : { date: '', email: '' },
    }))
  }

  const handleUpdateTask = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const taskRef = doc(db, 'tasks', taskId)
      const updatedTask = {
        ...task,
        reminder: reminderChecked ? task.reminder : null,
        edited: true,
      }
      await updateDoc(taskRef, updatedTask)
      navigate('/tasks')
    } catch (err) {
      setError('Failed to update task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col mb-10 mt-2 items-center justify-center min-h-screen bg-neutral-900 text-white px-6">
      <h1 className="text-4xl rubik-80s-fade-regular text-green-500 mb-6">
        Edit Task
      </h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {!error && (
        <form
          className="bg-neutral-800 p-6 rounded-lg shadow-lg w-full max-w-md"
          onSubmit={handleUpdateTask}
        >
          <div className="mb-4">
            <label className="text-gray-300 mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={task.title}
              onChange={handleInputChange}
              className="w-full text-neutral-100 px-4 py-2 border border-neutral-900 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-neutral-700"
              required
            />
          </div>
          <div className="mb-4">
            <label className="text-gray-300 mb-2">Description</label>
            <textarea
              name="description"
              value={task.description}
              onChange={handleInputChange}
              className="w-full text-neutral-100 px-4 py-2 border border-neutral-900 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-neutral-700 custom-scrollbar"
              rows="5"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="text-gray-300 mb-2">Priority</label>
            <select
              name="priority"
              value={task.priority}
              onChange={handleInputChange}
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
              name="creator"
              value={task.creator}
              onChange={handleInputChange}
              placeholder="Mention creator's name if Needed"
              className="w-full text-neutral-100 px-4 py-2 border border-neutral-900 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-neutral-700"
            />
          </div>
          <div className="mb-4">
            <label className="text-gray-300 mb-2">Category</label>
            <input
              type="text"
              name="category"
              value={task.category}
              onChange={handleInputChange}
              placeholder="Enter category (e.g., Work, Personal)"
              className="w-full text-neutral-100 px-4 py-2 border border-neutral-900 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-neutral-700"
            />
          </div>
          <div className="mb-4 flex items-center gap-2">
            <div
              onClick={handleReminderChange}
              className={`w-[22px] h-[22px] rounded-full cursor-pointer border-2 transition-all duration-300 ${
                reminderChecked
                  ? 'bg-green-500 border-green-800'
                  : 'bg-green-100 border-neutral-700'
              }`}
            ></div>
            <label className="text-gray-300">Set a reminder</label>
          </div>
          {reminderChecked && (
            <div className="mb-4">
              <label className="text-gray-300 mb-2">
                Reminder Date and Time
              </label>
              <input
                type="datetime-local"
                name="reminderDate"
                value={task.reminder?.date || ''}
                onChange={(e) =>
                  setTask((prevTask) => ({
                    ...prevTask,
                    reminder: { ...prevTask.reminder, date: e.target.value },
                  }))
                }
                className="w-full mb-1 text-neutral-100 px-4 py-2 border border-neutral-900 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-neutral-700"
                required
              />
              <label className="text-gray-300 mb-2">Email for Reminder</label>
              <input
                type="email"
                name="reminderEmail"
                value={task.reminder?.email || ''}
                onChange={(e) =>
                  setTask((prevTask) => ({
                    ...prevTask,
                    reminder: { ...prevTask.reminder, email: e.target.value },
                  }))
                }
                className="w-full text-neutral-100 px-4 py-2 border border-neutral-900 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-neutral-700"
                required
              />
            </div>
          )}
          <div className="flex w-full gap-2 items-center">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-1 flex-1 rounded-md text-lg ${
                loading
                  ? 'bg-green-700 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600'
              } text-white transition`}
            >
              {loading ? 'Updating...' : 'Update Task'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/tasks')}
              className="px-6 py-1 flex-3 rounded-md text-lg bg-red-500 hover:bg-red-600 text-white transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default EditTaskPage
