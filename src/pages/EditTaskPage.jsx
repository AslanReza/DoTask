import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { db } from '../config/firebaseConfig'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

const EditTaskPage = () => {
  const { taskId } = useParams()
  const navigate = useNavigate()
  const [task, setTask] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'Optional',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const taskRef = doc(db, 'tasks', taskId)
        const taskSnap = await getDoc(taskRef)
        if (taskSnap.exists()) {
          setTask(taskSnap.data())
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
    setTask((prevTask) => ({ ...prevTask, [name]: value }))
  }

  const handleUpdateTask = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const taskRef = doc(db, 'tasks', taskId)
      await updateDoc(taskRef, { ...task, edited: true })
      navigate('/tasks')
    } catch (err) {
      setError('Failed to update task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-white px-6">
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
            <label
              htmlFor="title"
              className="block text-neutral-400 mb-2 text-lg"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={task.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-neutral-700 text-white rounded-md outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-neutral-400 mb-2 text-lg"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={task.description}
              onChange={handleInputChange}
              rows="5"
              className="w-full px-4 py-2 bg-neutral-700 text-white rounded-md outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="priority"
              className="block text-neutral-400 mb-2 text-lg"
            >
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={task.priority}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-neutral-700 text-white rounded-md outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="Critical">Critical</option>
              <option value="Important">Important</option>
              <option value="Optional">Optional</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="category"
              className="block text-neutral-400 mb-2 text-lg"
            >
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={task.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-neutral-700 text-white rounded-md outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-md text-lg ${
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
              className="px-6 py-2 rounded-md text-lg bg-red-500 hover:bg-red-600 text-white transition"
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
