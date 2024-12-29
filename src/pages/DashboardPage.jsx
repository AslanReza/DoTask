import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoMdLogOut } from 'react-icons/io'
import { FaTasks } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import { db } from '../config/firebaseConfig'
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore'
import { IoIosCreate } from 'react-icons/io'
import { RiArchiveDrawerFill } from 'react-icons/ri'
import { SiTicktick } from 'react-icons/si'
import { BsHourglassSplit } from 'react-icons/bs'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { FaSun } from "react-icons/fa6";
import { FaMoon } from "react-icons/fa6";

ChartJS.register(ArcElement, Tooltip, Legend)

const DashboardPage = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [userInfo, setUserInfo] = useState(null)
  const [taskStats, setTaskStats] = useState({
    created: 0,
    archived: 0,
    completed: 0,
    pending: 0,
  })
  const [activityLog, setActivityLog] = useState([])

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('theme')
    return savedMode === 'dark'
  })

  useEffect(() => {
    if (user) {
      fetchUserInfo(user.uid)
      fetchTaskStats(user.uid)
      fetchUserActivity(user.uid)
    }
  }, [user])

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.body.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDarkMode])

  const fetchTaskStats = async (userId) => {
    try {
      const tasksRef = collection(db, 'tasks')

      const tasksQuery = query(tasksRef, where('userId', '==', userId))
      const taskSnapshot = await getDocs(tasksQuery)

      let created = 0,
        archived = 0,
        completed = 0,
        pending = 0

      taskSnapshot.forEach((doc) => {
        const taskData = doc.data()
        created++
        if (taskData.status === 'archived') {
          archived++
        } else if (taskData.status === 'completed') {
          completed++
        } else {
          pending++
        }
      })

      setTaskStats({ created, archived, completed, pending })
    } catch (error) {
      console.error('Error fetching task stats:', error)
    }
  }

  const fetchUserInfo = async (userId) => {
    try {
      const userDocRef = doc(db, 'users', userId)
      const userDoc = await getDoc(userDocRef)
      if (userDoc.exists()) {
        setUserInfo(userDoc.data())
      }
    } catch (error) {
      console.error('Error fetching user info:', error)
    }
  }

  const fetchUserActivity = async (userId) => {
    try {
      const activityRef = collection(db, 'activity')
      const activityQuery = query(activityRef, where('userId', '==', userId))
      const activitySnapshot = await getDocs(activityQuery)

      const activityLog = activitySnapshot.docs.map((doc) => doc.data())
      setActivityLog(activityLog)
    } catch (error) {
      console.error('Error fetching user activity:', error)
    }
  }

  const chartData = {
    labels: ['Created', 'Pending', 'Completed', 'Archived'],
    datasets: [
      {
        data: [
          taskStats.created,
          taskStats.pending,
          taskStats.completed,
          taskStats.archived,
        ],
        backgroundColor: ['#60A5FA', '#FB923C', '#4ADE80', '#F472B6'],
        hoverBackgroundColor: ['#347acf', '#d27426', '#239a4e', '#b33274'],
        borderWidth: 2,
        borderColor: '#000',
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 10,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleColor: '#fff',
        bodyColor: '#fff',
      },
      datalabels: {
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#fff',
        align: 'start',
        anchor: 'end',
        offset: 10,
        color: '#fff',
        font: {
          weight: 'bold',
          size: 14,
        },
      },
    },
    cutout: '55%',
  }

  return (
    <div className="bg-neutral-900 text-neutral-200">
      {/* Navigation */}
      <nav className="flex w-full z-40 bg-neutral-800 shadow-md px-4 py-1 text-neutral-100 justify-between items-center">
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
        <div className="flex gap-2">
        <button
            onClick={() => setIsDarkMode((prevMode) => !prevMode)}
            className="bg-gray-600 p-2 rounded-full"
          >
            {isDarkMode ? <FaSun  className='text-yellow-300' /> : <FaMoon className='text-gray-100'/>}
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

      {/* Main content */}
      <div className="z-[-10] w-full justify-center items-center flex h-auto">
        <div className="bg-neutral-800 w-full sm:w-[80%] md:w-[50%] mt-6 mb-12 rounded-lg p-4">
          {/* Profile Header */}
          <div className="text-center mb-6 text-2xl">
            <h1>Dashboard</h1>
          </div>
          {/* User Info */}
          <div className="flex flex-col items-start gap-2 mb-4">
            <div className="flex justify-between w-full">
              <p className="font-semibold">Email:</p>
              <p>{user?.email || 'Not Provided'}</p>
            </div>
            <div className="flex justify-between w-full">
              <p className="font-semibold">Firebase ID:</p>
              <p>{user?.uid || 'Not Available'}</p>
            </div>
          </div>
          {/* Divider */}
          <div className="bg-neutral-700 p-[0.5px] my-3 rounded-full"></div>

          {/* Task Overview Section */}
          <h1 className="text-xl text-center mb-2">Task Overview</h1>
          <div className="flex flex-col sm:flex-row text-green-500 justify-between gap-4 mt-2">
            <div className="bg-neutral-700 p-3 rounded-lg w-full text-center">
              <p className="font-semibold">Created</p>
              <p>{taskStats.created}</p>
            </div>
            <div className="bg-neutral-700 p-3 rounded-lg w-full text-center">
              <p className="font-semibold">Completed</p>
              <p>{taskStats.completed}</p>
            </div>
            <div className="bg-neutral-700 p-3 rounded-lg w-full text-center">
              <p className="font-semibold">Pending</p>
              <p>{taskStats.pending}</p>
            </div>
            <div className="bg-neutral-700 p-3 rounded-lg w-full text-center">
              <p className="font-semibold">Archived</p>
              <p>{taskStats.archived}</p>
            </div>
          </div>
          {/* Divider */}
          <div className="bg-neutral-700 p-[0.5px] my-3 rounded-full"></div>

          {/* Task Stats Chart (Doughnut) */}
          <h1 className="text-xl text-center">Task Breakdown</h1>
          <div className="my-2 w-full flex  items-center flex-col justify-center h-64 ">
            <Doughnut options={chartOptions} data={chartData} />
          </div>

          {/* Divider */}
          <div className="bg-neutral-700 p-[0.5px] my-3 rounded-full"></div>

          {/* Task Stats */}
          <h1 className="text-xl text-neutral-100 text-center mb-0">
            Your Task Stats
          </h1>
          <div className="flex items-stretch flex-col justify-start my-4 p-4 bg-gradient-to-tr from-neutral-950 to-neutral-700 rounded-lg shadow-xl">
            <div className="flex flex-col">
              <div className="flex items-center cursor-pointer gap-2 text-white hover:bg-blue-700 p-2 rounded-lg transition duration-300 ease-in-out">
                <span className="text-3xl text-blue-400">
                  <IoIosCreate />
                </span>
                <p className="text-lg">
                  You have created{' '}
                  <strong className="text-3xl font-bold text-blue-400">
                    {taskStats.created}
                  </strong>{' '}
                  tasks.
                </p>
              </div>

              <div className="flex items-center cursor-pointer gap-2 text-white hover:bg-pink-700 p-2 rounded-lg transition duration-300 ease-in-out">
                <span className="text-3xl  text-pink-400">
                  <RiArchiveDrawerFill />
                </span>
                <p className="text-lg">
                  You have archived{' '}
                  <strong className="text-3xl font-bold text-pink-400">
                    {taskStats.archived}
                  </strong>{' '}
                  tasks.
                </p>
              </div>
              <div className="flex items-center cursor-pointer gap-2 text-white hover:bg-green-700 p-2 rounded-lg transition duration-300 ease-in-out">
                <span className="text-3xl text-green-400">
                  <SiTicktick />
                </span>
                <p className="text-lg">
                  You have completed{' '}
                  <strong className="text-3xl font-bold text-green-400">
                    {taskStats.completed}
                  </strong>{' '}
                  tasks.
                </p>
              </div>
              <div className="flex items-center cursor-pointer gap-2 text-white hover:bg-yellow-700 p-2 rounded-lg transition duration-300 ease-in-out">
                <span className="text-3xl text-orange-400">
                  <BsHourglassSplit />
                </span>
                <p className="text-lg">
                  You have{' '}
                  <strong className="text-3xl font-bold text-orange-400">
                    {taskStats.pending}
                  </strong>{' '}
                  pending tasks.
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="bg-neutral-700 p-[0.5px] my-3 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
