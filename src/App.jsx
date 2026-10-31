
import { useEffect, useState } from 'react'
import TaskForm from './components/TaskForm'

const columns = [
  { title: 'Todo', status: 'todo' },
  { title: 'In Progress', status: 'in-progress' },
  { title: 'Completed', status: 'completed' },
]

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('kanban-tasks')) || []
    } catch {
      return []
    }
  })

  const [search, setSearch] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  useEffect(() => {
    localStorage.setItem('kanban-tasks', JSON.stringify(tasks))
  }, [tasks])

  function addTask(newTask) {
    setTasks((current) => [...current, newTask])
  }

  function deleteTask(taskId) {
    setTasks((current) =>
      current.filter((task) => task.id !== taskId)
    )
  }

function updateTaskStatus(taskId, newStatus) {
  
  setStatusFilter('All')

  setTasks((current) =>
    current.map((task) =>
      task.id === taskId
        ? { ...task, status: newStatus }
        : task
    )
  )
}

  function editTask(task) {
    const title = prompt('Task title:', task.title)
    if (title === null || !title.trim()) return

    const description = prompt(
      'Task description:',
      task.description
    )
    if (description === null) return

    const priority = prompt(
      'Priority: Low, Medium, or High',
      task.priority
    )
    if (priority === null) return

    const normalized = priority.trim().toLowerCase()
    if (!['low', 'medium', 'high'].includes(normalized)) {
      alert('Please enter Low, Medium, or High.')
      return
    }

    const dueDate = prompt(
      'Due date (YYYY-MM-DD):',
      task.dueDate || ''
    )
    if (dueDate === null) return

    setTasks((current) =>
      current.map((item) =>
        item.id === task.id
          ? {
              ...item,
              title: title.trim(),
              description: description.trim(),
              priority:
                normalized[0].toUpperCase() + normalized.slice(1),
              dueDate: dueDate.trim(),
            }
          : item
      )
    )
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.trim().toLowerCase())

    const matchesPriority =
      priorityFilter === 'All' ||
      task.priority === priorityFilter

    const matchesStatus =
      statusFilter === 'All' ||
      task.status === statusFilter

    return matchesSearch && matchesPriority && matchesStatus
  })

  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-8">
      <header className="mx-auto mb-8 max-w-7xl">
        <h1 className="text-3xl font-bold text-slate-800">
          Kanban Task Board
        </h1>
        <p className="mt-2 text-slate-500">
          Organize your work and track your progress.
        </p>
      </header>

      <div className="mx-auto max-w-7xl">
        <TaskForm onAddTask={addTask} />

        <div className="mb-6 grid grid-cols-1 gap-3 rounded-xl bg-white p-4 shadow-sm md:grid-cols-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title..."
            className="min-w-0 rounded-lg border p-3"
          />

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="min-w-0 rounded-lg border p-3"
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="min-w-0 rounded-lg border p-3"
          >
            <option value="All">All Statuses</option>
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <p className="mb-4 text-sm text-slate-600">
          Showing {filteredTasks.length} of {tasks.length} tasks
        </p>

        {filteredTasks.length === 0 && (
          <p className="mb-5 rounded-xl bg-white p-6 text-center text-slate-500">
            {tasks.length === 0
              ? 'No tasks yet. Add your first task!'
              : 'No matching tasks found. Try changing your search or filters.'}
          </p>
        )}

        <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-3">
          {columns.map((column) => {
            const columnTasks = filteredTasks.filter(
              (task) => task.status === column.status
            )

            return (
              <section
                key={column.status}
                className="min-w-0 rounded-xl bg-slate-200 p-4"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-700">
                    {column.title}
                  </h2>
                  <span className="rounded-full bg-white px-3 py-1 text-sm">
                    {columnTasks.length}
                  </span>
                </div>

                {columnTasks.length === 0 ? (
                  <p className="rounded-lg border-2 border-dashed border-slate-300 p-5 text-center text-sm text-slate-500">
                    No tasks in this column
                  </p>
                ) : (
                  <div className="space-y-3">
                    {columnTasks.map((task) => (
                      <article
                        key={task.id}
                        className="min-w-0 break-words rounded-lg bg-white p-4 shadow-sm"
                      >
                        <h3 className="font-semibold text-slate-800">
                          {task.title}
                        </h3>

                        {task.description && (
                          <p className="mt-2 text-sm text-slate-600">
                            {task.description}
                          </p>
                        )}

                        <div className="mt-3 flex flex-wrap gap-2 text-xs">
                          <span className="rounded-full bg-blue-100 px-2 py-1 text-blue-700">
                            {task.priority}
                          </span>

                          {task.dueDate && (
                            <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600">
                              Due: {task.dueDate}
                            </span>
                          )}
                        </div>

                        <select
                          value={task.status}
                          onChange={(e) =>
                            updateTaskStatus(task.id, e.target.value)
                          }
                          aria-label={`Status for ${task.title}`}
                          className="mt-4 w-full rounded-lg border p-2 text-sm"
                        >
                          <option value="todo">Todo</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            onClick={() => editTask(task)}
                            className="rounded-lg bg-amber-100 px-3 py-2 text-sm text-amber-800 hover:bg-amber-200"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm('Delete this task?')) {
                                deleteTask(task.id)
                              }
                            }}
                            className="rounded-lg bg-red-500 px-3 py-2 text-sm text-white-700 hover:bg-red-200"
                          >
                            Delete
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            )
          })}
        </div>
      </div>
    </main>
  )
}

export default App

