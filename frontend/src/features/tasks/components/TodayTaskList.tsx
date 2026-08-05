import { useState } from 'react'
import { useTasks, useUpdateTask, useDeleteTask } from '../hooks/useTasks'
import { TaskForm } from './TaskForm'
import type { Task } from '../types/task'

export function TodayTaskList() {
  const { data: tasks, isLoading, isError } = useTasks()
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  if (isLoading) {
    return <div className="panel">Loading tasks…</div>
  }

  if (isError) {
    return <div className="panel error">Unable to load tasks.</div>
  }

  // Filter for today-relevant tasks
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todayTasks = tasks?.filter((task) => {
    if (task.status === 'COMPLETED') return false

    // Include high-priority tasks
    if (task.priority === 'HIGH') return true

    // Include tasks due today or overdue
    if (task.dueDate) {
      const dueDate = new Date(task.dueDate)
      dueDate.setHours(0, 0, 0, 0)
      if (dueDate <= today) return true
    }

    return false
  }) || []

  const handleToggleComplete = async (task: Task) => {
    const newStatus = task.status === 'COMPLETED' ? 'ACTIVE' : 'COMPLETED'
    await updateTask.mutateAsync({
      id: task.id,
      task: {
        ...task,
        status: newStatus,
      },
    })
  }

  const handleDelete = async (task: Task) => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      await deleteTask.mutateAsync(task.id)
    }
  }

  const formatDueDate = (dateString?: string) => {
    if (!dateString) return null
    const date = new Date(dateString)
    const dueDate = new Date(date)
    dueDate.setHours(0, 0, 0, 0)
    
    const isOverdue = dueDate < today
    const isToday = dueDate.getTime() === today.getTime()
    
    let className = 'due-date'
    if (isOverdue) className += ' overdue'
    if (isToday) className += ' today'
    
    return (
      <span className={className}>
        {isOverdue ? '⚠️ ' : ''}
        {date.toLocaleDateString()}
      </span>
    )
  }

  if (editingTask) {
    return <TaskForm task={editingTask} onCancel={() => setEditingTask(null)} />
  }

  if (!todayTasks.length) {
    return (
      <div className="panel">
        <h3>No tasks for today</h3>
        <p className="muted">All clear! Use quick capture (✚ or press Q) to add new items.</p>
      </div>
    )
  }

  return (
    <div className="panel">
      <h3>Today's Tasks</h3>
      <ul className="task-list">
        {todayTasks.map((task) => (
          <li key={task.id} className={task.status === 'COMPLETED' ? 'completed' : ''}>
            <div className="task-item">
              <label className="task-checkbox">
                <input
                  type="checkbox"
                  checked={task.status === 'COMPLETED'}
                  onChange={() => handleToggleComplete(task)}
                />
              </label>
              <div className="task-content">
                <div>
                  <strong>{task.title}</strong>
                  {task.description && <p>{task.description}</p>}
                  {task.dueDate && <div>{formatDueDate(task.dueDate)}</div>}
                </div>
                <div className="task-meta">
                  <span className={`pill priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
                </div>
              </div>
              <div className="task-actions">
                <button onClick={() => setEditingTask(task)} className="btn-icon" title="Edit task">
                  ✏️
                </button>
                <button onClick={() => handleDelete(task)} className="btn-icon" title="Delete task">
                  🗑️
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
