import { useState, useEffect } from "react";
import { useTasks } from "../../tasks/hooks/useTasks";
import { useBigThree, useUpdateBigThree } from "../hooks/useDailyPlan";

export function BigThreeSelector() {
  const { data: tasks } = useTasks();
  const { data: bigThree } = useBigThree();
  const updateBigThree = useUpdateBigThree();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Initialize selected IDs when Big Three data loads
  useEffect(() => {
    if (bigThree) {
      setSelectedIds(bigThree.map((task) => task.id));
    }
  }, [bigThree]);

  // Filter to show only active tasks
  const activeTasks =
    tasks?.filter((task) => task.status !== "COMPLETED") || [];

  // Sort by priority: HIGH > MEDIUM > LOW
  const priorityOrder = { HIGH: 1, MEDIUM: 2, LOW: 3 };
  const sortedTasks = activeTasks.sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority],
  );

  const handleToggleTask = (taskId: number) => {
    setSelectedIds((prev) => {
      if (prev.includes(taskId)) {
        // Remove from selection
        return prev.filter((id) => id !== taskId);
      } else if (prev.length < 3) {
        // Add to selection (max 3)
        return [...prev, taskId];
      }
      // Already have 3, don't add
      return prev;
    });
  };

  const handleSave = async () => {
    await updateBigThree.mutateAsync(selectedIds);
  };

  const hasChanges =
    JSON.stringify(selectedIds.sort()) !==
    JSON.stringify((bigThree?.map((t) => t.id) || []).sort());

  const formatDueDate = (dateString?: string) => {
    if (!dateString) return null;
    // Parse date as local date to avoid timezone issues
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(date);
    dueDate.setHours(0, 0, 0, 0);

    const isOverdue = dueDate < today;
    const isToday = dueDate.getTime() === today.getTime();

    let className = "due-date";
    if (isOverdue) className += " overdue";
    if (isToday) className += " today";

    return (
      <span className={className}>
        {isOverdue ? "⚠️ " : ""}
        {date.toLocaleDateString()}
      </span>
    );
  };

  return (
    <section className="panel">
      <h3>🎯 Select Big Three</h3>
      <p className="muted">
        Choose up to three tasks that matter most today. Click to
        select/deselect.
      </p>

      {sortedTasks.length === 0 ? (
        <p className="muted">
          No active tasks available. Create some tasks first!
        </p>
      ) : (
        <>
          <ul className="big-three-selector-list">
            {sortedTasks.map((task) => {
              const isSelected = selectedIds.includes(task.id);
              const position = isSelected
                ? selectedIds.indexOf(task.id) + 1
                : null;

              return (
                <li
                  key={task.id}
                  className={`big-three-selector-item ${isSelected ? "selected" : ""}`}
                  onClick={() => handleToggleTask(task.id)}
                >
                  <div className="selector-checkbox">
                    {isSelected && (
                      <span className="selection-number">{position}</span>
                    )}
                    {!isSelected && <span className="checkbox-empty">☐</span>}
                  </div>
                  <div className="selector-content">
                    <strong>{task.title}</strong>
                    {task.description && <p>{task.description}</p>}
                    {task.dueDate && <div>{formatDueDate(task.dueDate)}</div>}
                  </div>
                  <span
                    className={`pill priority-${task.priority.toLowerCase()}`}
                  >
                    {task.priority}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="big-three-selector-footer">
            <p className="muted">Selected: {selectedIds.length}/3</p>
            {hasChanges && (
              <button
                onClick={handleSave}
                disabled={updateBigThree.isPending}
                className="btn-primary"
              >
                {updateBigThree.isPending ? "Saving..." : "Save Big Three"}
              </button>
            )}
          </div>
        </>
      )}
    </section>
  );
}
