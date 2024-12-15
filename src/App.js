import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import TasksPage from './pages/TasksPage'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-gray-800">
        <nav className="p-4 flex justify-between items-center bg-white shadow-md">
          <div className="font-bold text-xl">On Task</div>
          <div className="flex gap-4">
            <Link to={'/'} className="hover:text-blue-500">
              Tasks
            </Link>
            <Link to={'/new'} className="hover:text-blue-500">
              New Task
            </Link>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<TasksPage />} />
          <Route path="/new" element={<div>New Task Page</div>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
