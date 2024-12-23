import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { onSnapshot } from 'firebase/firestore'
import { db } from '../config/firebaseConfig'
import { SiMattermost } from 'react-icons/si'
import { BsTelegram } from 'react-icons/bs'
import { FaGithub } from 'react-icons/fa'
import { FaWandMagicSparkles } from 'react-icons/fa6'
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore'
import { MdRemoveDone } from 'react-icons/md'
import { BiSolidMessageSquareEdit } from 'react-icons/bi'
import { useAuth } from '../context/AuthContext'
import { IoSettings } from 'react-icons/io5'
import { FaClipboardCheck } from 'react-icons/fa6'
import { MdAddTask } from 'react-icons/md'
import { IoMdLogOut } from 'react-icons/io'
import { MdOutlineArchive } from 'react-icons/md'
import { FaEdit, FaCheckCircle, FaShareAlt } from 'react-icons/fa'
import { RiDeleteBin2Fill } from 'react-icons/ri'

const TasksPage = () => {
  const [tasks, setTasks] = useState([])
  const [selectedTask, setSelectedTask] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [taskToShare, setTaskToShare] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState(null)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [copyMessage, setCopyMessage] = useState('')
  const [showIcons, setShowIcons] = useState(false)

  useEffect(() => {
    if (!user) {
      console.log('User is not authenticated')
      return
    }

    const fetchTasks = async () => {
      const tasksRef = collection(db, 'tasks')
      const q = query(
        tasksRef,
        where('userId', '==', user.uid),
        where('archived', '==', false)
      )

      try {
        const snapshot = await getDocs(q)
        if (snapshot.empty) {
          console.log('No tasks found using getDocs')
        } else {
          console.log('Tasks fetched using getDocs:', snapshot.docs)
          setTasks(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              edited: doc.data().edited || false,
              priority: doc.data().priority || 'Optional',
              ...doc.data(),
            }))
          )
        }
      } catch (error) {
        console.error('Error fetching tasks with getDocs:', error)
      }
    }

    fetchTasks()

    const tasksRef = collection(db, 'tasks')
    const queryInstance = query(
      tasksRef,
      where('userId', '==', user.uid),
      where('archived', '==', false)
    )

    const unsubscribe = onSnapshot(queryInstance, (snapshot) => {
      if (snapshot.empty) {
        console.log('No tasks found using onSnapshot')
      } else {
        console.log('Tasks fetched using onSnapshot:', snapshot.docs)
        setTasks(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            edited: doc.data().edited || false,
            priority: doc.data().priority || 'Optional',
            category: doc.data().category || '',
            ...doc.data(),
          }))
        )
      }
    })

    return () => unsubscribe()
  }, [user])

  const openTaskModal = (task) => {
    setSelectedTask(task)
    setShowModal(true)
  }

  const closeTaskModal = () => {
    setShowModal(false)
    setSelectedTask(null)
  }

  const openShareModal = (task) => {
    setTaskToShare(task)
    setShowShareModal(true)
  }

  const closeShareModal = () => {
    setShowShareModal(false)
    setTaskToShare(null)
  }

  const handleCompleteTask = async (taskId) => {
    const taskRef = doc(db, 'tasks', taskId)
    try {
      await updateDoc(taskRef, { completed: true })
      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, completed: true } : task
        )
      )
    } catch (error) {
      console.error('Error marking task as complete:', error)
    }
  }

  const handleUndoCompleteTask = async (taskId) => {
    const taskRef = doc(db, 'tasks', taskId)
    try {
      await updateDoc(taskRef, { completed: false })
      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, completed: false } : task
        )
      )
    } catch (error) {
      console.error('Error undoing task completion:', error)
    }
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    setCopyMessage('Copied!')
    setTimeout(() => setCopyMessage(''), 2000)
  }

  const handleArchiveTask = async (taskId) => {
    const taskRef = doc(db, 'tasks', taskId)
    try {
      await updateDoc(taskRef, { archived: true })
      setTasks(tasks.filter((task) => task.id !== taskId))
    } catch (error) {
      console.error('Error archiving task:', error)
    }
  }

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId))
      setTasks(tasks.filter((task) => task.id !== taskId))
      closeDeleteModal()
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const openDeleteModal = (task) => {
    setTaskToDelete(task)
    setShowDeleteModal(true)
  }

  const closeDeleteModal = () => {
    setShowDeleteModal(false)
    setTaskToDelete(null)
  }

  return (
    <div>
      {/* Navbar */}
      <nav className="flex w-full fixed top-0 bg-neutral-800 shadow-md px-4 py-1 text-neutral-100 justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl rubik-80s-fade-regular">
            <span className="text-sm text-green-500">On</span>Task
          </h1>
          <span className="text-neutral-400">|</span>
          <button
            onClick={() => navigate('/new-task')}
            className="text-2xl flex items-center flex-row-reverse gap-1 bg-green-600 rounded-full p-1"
          >
            <span className="text-xs inline-block">New Task</span>
            <MdAddTask />
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/archived-tasks')}
            className="bg-pink-600 p-1 hidden text-2xl items-center group sm:flex flex-row gap-1 rounded-full"
          >
            <span className="text-xs group-hover:inline-block hidden">
              Archived
            </span>
            <MdOutlineArchive />
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="bg-neutral-600 p-1 text-2xl items-center group flex flex-row gap-1 rounded-full"
          >
            <span className="text-xs group-hover:inline-block hidden">
              Profile
            </span>
            <IoSettings />
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

      {/* Task List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6 mt-16">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`bg-neutral-700 p-4 rounded-lg shadow-md relative ${
                task.completed
                  ? 'opacity-70 border-[2px] border-green-600'
                  : 'border-[2px] border-neutral-600'
              }`}
            >
              {task.edited && (
                <div className="absolute bottom-2 left-2 flex flex-row-reverse items-start text-yellow-500 text-xs  rounded-full">
                  <BiSolidMessageSquareEdit className="" />
                  <span className="text-[8px]">Edited</span>
                </div>
              )}
              <div className="flex flex-row justify-end absolute top-[-7px] right-1 gap-1">
                {/* Category Badge */}
                {task.category && (
                  <div className="bg-blue-500 text-white text-[8px] px-1 rounded-lg">
                    {task.category}
                  </div>
                )}
                {/* Priority Badge */}
                <div className="pr-2 text-white text-[8px]">
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
              </div>
              {/* Complete Icon */}
              <div className="absolute top-2 right-2 flex gap-3">
                {task.completed && (
                  <button
                    onClick={() => handleUndoCompleteTask(task.id)}
                    className="text-green-500 flex items-center gap-1 bg-neutral-800 rounded-full p-1 hover:bg-black hover:text-green-400"
                  >
                    <MdRemoveDone />
                  </button>
                )}
              </div>
              <h2
                onClick={() => openTaskModal(task)}
                className="font-semibold text-green-500 text-lg mb-2 cursor-pointer"
              >
                {task.title}
              </h2>
              <p className="text-gray-300 whitespace-pre-wrap mb-4">
                {task.description}
              </p>
              <div className=" flex flex-row absolute bottom-2 right-2 justify-end">
                {/* Tools button */}
                {!showIcons && (
                  <button
                    onClick={() => setShowIcons(true)}
                    className="text-gray-500 hover:text-gray-400 flex items-center justify-end"
                  >
                    <FaWandMagicSparkles className="text-xl" />
                  </button>
                )}

                {/* Icons container with staggered animations */}
                {showIcons && (
                  <div className="flex flex-row gap-2 items-center justify-end">
                    {/* Task Action Icons */}
                    <div className="flex flex-row items-center justify-end gap-2">
                      <div
                        className="group relative flex items-center animate-fall-down"
                        style={{ animationDelay: '0.1s' }}
                      >
                        <button
                          onClick={() => openDeleteModal(task)}
                          className="text-red-500 hover:text-red-400 flex items-center relative overflow-hidden"
                        >
                          <RiDeleteBin2Fill />
                          <span className="ml-1 max-w-0 overflow-hidden group-hover:max-w-[70px] transition-[max-width] duration-300 ease-in-out text-sm">
                            Delete
                          </span>
                        </button>
                      </div>
                      {!task.completed && (
                        <div
                          className="group relative flex items-center animate-fall-down"
                          style={{ animationDelay: '0.2s' }}
                        >
                          <button
                            onClick={() => handleCompleteTask(task.id)}
                            className="text-green-500 hover:text-green-400 flex items-center relative overflow-hidden"
                          >
                            <FaCheckCircle />
                            <span className="ml-1 max-w-0 overflow-hidden group-hover:max-w-[70px] transition-[max-width] duration-300 ease-in-out text-sm">
                              Complete
                            </span>
                          </button>
                        </div>
                      )}
                      <div
                        className="group relative flex items-center animate-fall-down"
                        style={{ animationDelay: '0.3s' }}
                      >
                        <button
                          onClick={() => handleArchiveTask(task.id)}
                          className="text-pink-500 hover:text-pink-400 flex items-center relative overflow-hidden"
                        >
                          <MdOutlineArchive className="scale-110" />
                          <span className="ml-1 max-w-0 overflow-hidden group-hover:max-w-[70px] transition-[max-width] duration-300 ease-in-out text-sm">
                            Archive
                          </span>
                        </button>
                      </div>
                      <div
                        className="group relative flex items-center animate-fall-down"
                        style={{ animationDelay: '0.4s' }}
                      >
                        <button
                          onClick={() => navigate(`/edit-task/${task.id}`)}
                          className="text-yellow-400 hover:text-yellow-300 flex items-center relative overflow-hidden"
                        >
                          <FaEdit />
                          <span className="ml-1 max-w-0 overflow-hidden group-hover:max-w-[70px] transition-[max-width] duration-300 ease-in-out text-sm">
                            Edit
                          </span>
                        </button>
                      </div>
                      <div
                        className="group relative flex items-center animate-fall-down"
                        style={{ animationDelay: '0.5s' }}
                      >
                        <button
                          onClick={() => openShareModal(task)}
                          className="text-blue-600 hover:text-blue-500 flex items-center relative overflow-hidden"
                        >
                          <FaShareAlt />
                          <span className="ml-1 max-w-0 overflow-hidden group-hover:max-w-[70px] transition-[max-width] duration-300 ease-in-out text-sm">
                            Share
                          </span>
                        </button>
                      </div>
                    </div>
                    {/* Close button */}
                    <button
                      onClick={() => setShowIcons(false)}
                      className="text-gray-500 hover:text-gray-400"
                    >
                      <FaWandMagicSparkles className="text-xl" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-white text-center col-span-full">
            No tasks found.
          </p>
        )}
      </div>

      {/* Modals */}
      {/* Share Modal */}
      {showShareModal && taskToShare && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          {copyMessage && (
            <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded-md shadow-lg z-50">
              {copyMessage}
            </div>
          )}
          <div className="bg-neutral-800 px-6 pb-6 pt-2 rounded-lg shadow-lg text-center text-white relative">
            <button
              onClick={closeShareModal}
              className="absolute top-0 right-2 text-red-500 text-2xl rounded-full"
            >
              &times;
            </button>
            <h1 className="text-2xl mb-4">Share Task</h1>
            <p className="text-lg mb-4">{taskToShare.title}</p>
            <div className="mb-4">
              <p className="text-gray-400 mb-2">Task Link:</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={`${window.location.origin}/tasks/${taskToShare.id}`}
                  readOnly
                  className="w-full text-xs text-neutral-100 px-4 py-2 border border-neutral-900 rounded-md bg-neutral-700 cursor-pointer"
                  onClick={(e) => e.target.select()}
                />
                <button
                  onClick={() =>
                    handleCopy(
                      `${window.location.origin}/tasks/${taskToShare.id}`
                    )
                  }
                  className="text-green-500 hover:text-green-400 text-lg p-1 rounded-full bg-neutral-950"
                  title="Copy to clipboard"
                >
                  <i>
                    <FaClipboardCheck />
                  </i>
                </button>
              </div>
            </div>

            {/* Social Media Buttons */}
            <div className="flex justify-center gap-6 mt-4">
              <button
                onClick={() =>
                  handleCopy(
                    `Check out this task: ${taskToShare.title}\n${window.location.origin}/tasks/${taskToShare.id}`
                  )
                }
                className="text-blue-500 hover:text-blue-400 flex items-center gap-2"
                title="Copy Mattermost link"
              >
                <i className="text-2xl">
                  <SiMattermost />
                </i>
              </button>

              <button
                onClick={() =>
                  handleCopy(
                    `Check out this task on GitHub: ${window.location.origin}/tasks/${taskToShare.id}`
                  )
                }
                className="text-gray-400 hover:text-gray-300 flex items-center gap-2"
                title="Copy GitHub link"
              >
                <i className="text-2xl">
                  <FaGithub />
                </i>
              </button>

              <button
                onClick={() =>
                  handleCopy(
                    `${taskToShare.title} - ${window.location.origin}/tasks/${taskToShare.id}`
                  )
                }
                className="text-blue-400 hover:text-blue-300 flex items-center gap-2"
                title="Copy Telegram link"
              >
                <i className="text-2xl">
                  <BsTelegram />
                </i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && taskToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-neutral-800 px-6 pb-6 pt-2 rounded-lg shadow-lg text-center text-white relative">
            <button
              onClick={closeDeleteModal}
              className="absolute top-0 right-2 text-red-500 text-2xl rounded-full"
            >
              &times;
            </button>
            <h2 className="text-2xl m-4 text-red-600">Are you sure?</h2>
            <p className="mb-4">{taskToDelete.title}</p>
            <div className="flex justify-center gap-1">
              <button
                onClick={() => handleDeleteTask(taskToDelete.id)}
                className="px-8 py-1 bg-red-600 hover:bg-red-700 rounded-md text-red-100"
              >
                Delete
              </button>
              <button
                onClick={closeDeleteModal}
                className="px-4 py-1 bg-green-600 hover:bg-green-700 rounded-md text-green-100"
              >
                Keep
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TasksPage
