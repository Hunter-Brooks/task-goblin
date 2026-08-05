import { useState } from "react";
import { TaskList } from "../features/tasks/components/TaskList";
import { TaskForm } from "../features/tasks/components/TaskForm";

export function TasksPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <section className="page-grid">
      <div>
        <h2>All tasks</h2>
        <p className="muted">
          A simple task list backed by the Spring Boot API.
        </p>
      </div>
      {!showForm && (
        <button className="btn-add-task" onClick={() => setShowForm(true)}>
          + Add Task
        </button>
      )}
      {showForm && (
        <TaskForm
          onCancel={() => setShowForm(false)}
          onSuccess={() => setShowForm(false)}
        />
      )}
      <TaskList />
    </section>
  );
}
