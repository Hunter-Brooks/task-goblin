import { useState } from 'react'
import { useCreateTask } from '../hooks/useTasks'
import type { TaskPriority } from '../types/task'

const defaultPriority: TaskPriority = 'MEDIUM'

export function TaskForm() {
  const createTask = useCreateTask()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TaskPriority>(defaultPriority)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!title.trim()) {
      return
    }

    await createTask.mutateAsync({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
    })

    setTitle('')
    setDescription('')
    setPriority(defaultPriority)
  }

  return (
    <form className="panel task-form" onSubmit={handleSubmit}>
      <h2>Quick capture</h2>
      <label>
        Title
        <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="What needs doing?" />
      </label>
      <label>
        Description
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Optional details"
          rows={3}
        />
      </label>
      <label>
        Priority
        <select value={priority} onChange={(event) => setPriority(event.target.value as TaskPriority)}>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </label>
      <button type="submit" disabled={createTask.isPending}>
        {createTask.isPending ? 'Saving…' : 'Add task'}
      </button>
      {createTask.isError ? <p className="error">Unable to save task right now.</p> : null}
    </form>
  )
}
