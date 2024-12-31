import React, { useEffect, useState } from 'react'
import { db } from '../config/firebaseConfig'
import { fetchArchivedTaskCount } from '../utilities/taskStats'
import { useAuth } from '../context/AuthContext'
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore'
import { RiDeleteBin2Fill } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'
import { MdOutlineUnarchive } from 'react-icons/md'
import { FaTasks } from 'react-icons/fa'

const ArchivedTasksPage = () => {
  const [archivedTasks, setArchivedTasks] = useState([])
  const [archivedCount, setArchivedCount] = useState(0)
  const { user } = useAuth()
  const navigate = useNavigate()

  // Fetch archived tasks
  useEffect(() => {
    const fetchArchivedTasks = async () => {
      const tasksRef = collection(db, 'tasks')
      const q = query(tasksRef, where('archived', '==', true))
      const querySnapshot = await getDocs(q)
      setArchivedTasks(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      )
    }

    fetchArchivedTasks()
  }, [])

  // Sync the archived task count
  useEffect(() => {
    if (user) {
      const syncArchivedCount = async () => {
        const count = await fetchArchivedTaskCount(user.uid)
        setArchivedCount(count)
        localStorage.setItem('archivedTaskCount', count)
      }

      syncArchivedCount()
      const intervalId = setInterval(syncArchivedCount, 1000)

      return () => clearInterval(intervalId)
    }
  }, [user])

  // Handle deleting a task
  const handleDeleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId))
      setArchivedTasks(archivedTasks.filter((task) => task.id !== taskId))

      // Check if no tasks are left and navigate to the /tasks page
      if (archivedTasks.length === 1) {
        navigate('/tasks')
      }
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  // Handle unarchiving a task
  const handleUnarchiveTask = async (taskId) => {
    const taskRef = doc(db, 'tasks', taskId)
    try {
      await updateDoc(taskRef, { status: 'pending', archived: false })

      const updatedArchivedTasks = archivedTasks.filter(
        (task) => task.id !== taskId
      )
      setArchivedTasks(updatedArchivedTasks)

      // Check if no tasks are left and navigate to the /tasks page
      if (updatedArchivedTasks.length === 0) {
        navigate('/tasks')
      }
    } catch (error) {
      console.error('Error unarchiving task:', error)
    }
  }

  return (
    <div>
      <nav className="flex w-full fixed z-10 top-0 bg-neutral-800 shadow-md px-4 py-1 text-neutral-100 justify-between items-center">
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
        <div className="flex items-center gap-2">
          <span className="bg-pink-600 py-1 px-3 text-sm items-center sm:flex flex-row rounded-full">
            {archivedCount}
          </span>
        </div>
      </nav>

      {archivedTasks.length === 0 ? (
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <h1 className="text-xl text-neutral-100 mb-4">
              No archived tasks found.
            </h1>
            <button
              onClick={() => navigate('/tasks')}
              className="bg-green-600 text-white py-2 px-6 rounded-full text-lg"
            >
              Go to Tasks
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 mb-6 gap-6 p-6 mt-16">
          {archivedTasks.map((task) => (
            <div
              key={task.id}
              className="bg-neutral-700 relative border-pink-600 border-[2px] p-4 rounded-lg shadow-md"
            >
              <h2 className="font-semibold text-green-500 text-lg mb-2">
                {task.title}
              </h2>
              <p className="text-gray-300 whitespace-pre-wrap mb-4">
                {task.description}
              </p>
              <div className="flex flex-row justify-end absolute top-[-7px] right-1 gap-1">
                {task.category && (
                  <div className="bg-blue-500 text-white text-[8px] px-1 rounded-lg">
                    {task.category}
                  </div>
                )}
                <div className="text-white text-[8px]">
                  {task.priority === 'Critical' ? (
                    <span className="bg-red-500 px-1 rounded-lg">Urgent</span>
                  ) : task.priority === 'Important' ? (
                    <span className="bg-yellow-500 px-1 rounded-lg">
                      Important
                    </span>
                  ) : (
                    <span className="bg-green-500 px-1 rounded-lg">
                      Optional
                    </span>
                  )}
                </div>
                {task.creator && (
                  <div className="bg-neutral-500 text-white text-[8px] px-1 rounded-lg">
                    {task.creator || ''}
                  </div>
                )}
              </div>

              <div className="flex justify-end absolute right-2 bottom-2 items-center text-xl gap-2">
                <div className="group relative flex items-center">
                  <button
                    onClick={() => handleUnarchiveTask(task.id)}
                    className="text-pink-500 hover:text-pink-400 flex items-center relative overflow-hidden"
                  >
                    <MdOutlineUnarchive className="scale-150" />
                    <span
                      onClick={() => handleUnarchiveTask(task.id)}
                      className="ml-2 max-w-0 overflow-hidden group-hover:max-w-[70px] transition-[max-width] duration-300 ease-in-out text-sm"
                    >
                      {task.archived ? 'Unarchive' : 'Archive'}
                    </span>
                  </button>
                </div>
                <div className="group relative flex items-center">
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-red-500 hover:text-red-400 flex items-center relative overflow-hidden"
                  >
                    <RiDeleteBin2Fill className="scale-125" />
                    <span className="ml-1 max-w-0 overflow-hidden group-hover:max-w-[70px] transition-[max-width] duration-300 ease-in-out text-sm">
                      Delete
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ArchivedTasksPage
