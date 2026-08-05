export type TaskStatus = 'ACTIVE' | 'COMPLETED'
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH'

export interface Task {
  id: number
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: string
  createdAt: string
  completedAt?: string | null
}

export interface TaskInput {
  title: string
  description?: string
  priority: TaskPriority
  dueDate?: string
}
