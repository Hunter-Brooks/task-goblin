import { TaskForm } from '../features/tasks/components/TaskForm'
import { TaskList } from '../features/tasks/components/TaskList'

export function TodayPage() {
  return (
    <div className="page-grid">
      <section>
        <h2>Today</h2>
        <p className="muted">Capture tasks and keep today’s work visible.</p>
      </section>
      <TaskForm />
      <TaskList />
    </div>
  )
}
