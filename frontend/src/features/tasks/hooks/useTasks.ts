import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createTask, fetchTasks, updateTask, deleteTask } from '../../../api/tasks'
import type { Task, TaskInput } from '../types/task'

export function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (task: TaskInput) => createTask(task),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, task }: { id: number; task: Partial<Task> }) => updateTask(id, task),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteTask(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}
