import { TaskList } from '../features/tasks/components/TaskList'

export function TasksPage() {
  return (
    <section className="page-grid">
      <div>
        <h2>All tasks</h2>
        <p className="muted">A simple task list backed by the Spring Boot API.</p>
      </div>
      <TaskList />
    </section>
  )
}
