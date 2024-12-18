import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import NewTaskPage from './pages/NewTaskPage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import HomePage from './pages/HomePage'
import TasksPage from './pages/TasksPage'
import PrivateRoute from './components/PrivateRoute'
import Footer from './components/Footer'
import EditTaskPage from './pages/EditTaskPage'
import ArchivedTasksPage from './pages/ArchivedTasksPage'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Protected Routes */}
        <Route
          path="/tasks"
          element={
            <PrivateRoute>
              <TasksPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/new-task"
          element={
            <PrivateRoute>
              <NewTaskPage />
            </PrivateRoute>
          }
        />
        <Route path="/edit-task/:taskId" element={<EditTaskPage />} />
        <Route path="/archived-tasks" element={<ArchivedTasksPage />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
