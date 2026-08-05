import { TaskList } from '../features/tasks/components/TaskList'

export function TodayPage() {
  return (
    <div className="page-grid">
      <section>
        <h2>Today</h2>
        <p className="muted">Focus on today's work. Use quick capture (✚ or press Q) to add new items.</p>
      </section>
      <TaskList />
    </div>
  )
}
