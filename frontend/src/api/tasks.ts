import type { Task, TaskInput } from '../features/tasks/types/task'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

export async function fetchTasks(): Promise<Task[]> {
  const response = await fetch(`${API_BASE_URL}/api/tasks`)
  if (!response.ok) {
    throw new Error('Failed to load tasks')
  }
  return response.json()
}

export async function createTask(task: TaskInput): Promise<Task> {
  const response = await fetch(`${API_BASE_URL}/api/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  })

  if (!response.ok) {
    throw new Error('Failed to create task')
  }

  return response.json()
}
