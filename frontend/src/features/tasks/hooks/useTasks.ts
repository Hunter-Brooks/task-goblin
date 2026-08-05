import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createTask, fetchTasks } from '../../../api/tasks'
import type { TaskInput } from '../types/task'

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
