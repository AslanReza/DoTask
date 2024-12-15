import React from 'react'
const tasks = [
  { id: 1, title: 'Task 1', description: 'Text 1' },
  { id: 2, title: 'Task 2', description: 'Text 2' },
  { id: 3, title: 'Task 3', description: 'Text 3' },
]
const TasksPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Tasks</h1>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <div key={task.id} className="p-4 bg-white shadow-neu rounded-lg">
            <h2 className="font-semibold text-lg mb-2">{task.title}</h2>
            <p className="text-gray-600">{task.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TasksPage
