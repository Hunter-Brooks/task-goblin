import { useBigThree } from "../hooks/useDailyPlan";
import { useUpdateTask } from "../../tasks/hooks/useTasks";
import type { BigThreeTask } from "../../../api/dailyPlan";

export function BigThreeDisplay() {
  const { data: bigThree, isLoading, isError } = useBigThree();
  const updateTask = useUpdateTask();

  const handleToggleComplete = async (task: BigThreeTask) => {
    const newStatus = task.status === "COMPLETED" ? "ACTIVE" : "COMPLETED";
    await updateTask.mutateAsync({
      id: task.id,
      task: {
        ...task,
        status: newStatus as "ACTIVE" | "COMPLETED",
        priority: task.priority as "LOW" | "MEDIUM" | "HIGH",
      },
    });
  };

  if (isLoading) {
    return (
      <section className="big-three-section">
        <h2>🎯 Big Three</h2>
        <p className="muted">Loading...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="big-three-section">
        <h2>🎯 Big Three</h2>
        <p className="error">Unable to load Big Three</p>
      </section>
    );
  }

  if (!bigThree || bigThree.length === 0) {
    return (
      <section className="big-three-section">
        <h2>🎯 Big Three</h2>
        <p className="muted">
          No priorities set yet. Visit the Planning page to select your three
          most important tasks.
        </p>
      </section>
    );
  }

  return (
    <section className="big-three-section">
      <h2>🎯 Big Three</h2>
      <p className="muted">Your three most important tasks today</p>
      <ul className="big-three-list">
        {bigThree.map((task, index) => (
          <li
            key={task.id}
            className={`big-three-item ${task.status === "COMPLETED" ? "completed" : ""}`}
          >
            <span className="big-three-number">{index + 1}</span>
            <label className="task-checkbox">
              <input
                type="checkbox"
                checked={task.status === "COMPLETED"}
                onChange={() => handleToggleComplete(task)}
              />
            </label>
            <div className="big-three-content">
              <strong>{task.title}</strong>
              {task.description && <p>{task.description}</p>}
            </div>
            <span className={`pill priority-${task.priority.toLowerCase()}`}>
              {task.priority}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
