import { useTasks } from '../hooks/useTasks'

export function TaskList() {
  const { data: tasks, isLoading, isError } = useTasks()

  if (isLoading) {
    return <div className="panel">Loading tasks…</div>
  }

  if (isError) {
    return <div className="panel error">Unable to load tasks.</div>
  }

  if (!tasks?.length) {
    return <div className="panel">No tasks yet. Capture your first task to get started.</div>
  }

  return (
    <div className="panel">
      <h2>Tasks</h2>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id}>
            <div>
              <strong>{task.title}</strong>
              {task.description ? <p>{task.description}</p> : null}
            </div>
            <span className={`pill priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
