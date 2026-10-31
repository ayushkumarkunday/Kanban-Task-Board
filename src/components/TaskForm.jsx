
import { useState } from 'react'

function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [dueDate, setDueDate] = useState('')

  function handleSubmit(e) {
    e.preventDefault()

    if (!title.trim()) return

    onAddTask({
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate,
      status: 'todo',
    })

    setTitle('')
    setDescription('')
    setPriority('Medium')
    setDueDate('')
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 rounded-xl bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-slate-800">
        Add New Task
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          className="rounded-lg border border-slate-300 p-3"
          required
        />

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="rounded-lg border border-slate-300 p-3"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description"
          rows={3}
          className="rounded-lg border border-slate-300 p-3 md:col-span-2"
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="rounded-lg border border-slate-300 p-3"
        >
          <option value="Low">Low Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="High">High Priority</option>
        </select>

        <button
          type="submit"
          className="rounded-lg bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700"
        >
          + Add Task
        </button>
      </div>
    </form>
  )
}

export default TaskForm
