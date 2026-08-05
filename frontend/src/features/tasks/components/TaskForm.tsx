import { useEffect, useState } from "react";
import { useCreateTask, useUpdateTask } from "../hooks/useTasks";
import type { Task, TaskPriority } from "../types/task";

const defaultPriority: TaskPriority = "MEDIUM";

interface TaskFormProps {
  task?: Task;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export function TaskForm({ task, onCancel, onSuccess }: TaskFormProps) {
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [priority, setPriority] = useState<TaskPriority>(
    task?.priority ?? defaultPriority,
  );
  const [dueDate, setDueDate] = useState(task?.dueDate ?? "");

  const isEditing = !!task;

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description ?? "");
      setPriority(task.priority);
      setDueDate(task.dueDate ?? "");
    }
  }, [task]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) {
      return;
    }

    if (isEditing) {
      await updateTask.mutateAsync({
        id: task.id,
        task: {
          ...task,
          title: title.trim(),
          description: description.trim() || undefined,
          priority,
          dueDate: dueDate || undefined,
        },
      });
      onCancel?.();
    } else {
      await createTask.mutateAsync({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        dueDate: dueDate || undefined,
      });

      setTitle("");
      setDescription("");
      setPriority(defaultPriority);
      setDueDate("");
      onSuccess?.();
    }
  };

  return (
    <form className="panel task-form" onSubmit={handleSubmit}>
      <h2>{isEditing ? "Edit task" : "Quick capture"}</h2>
      <label>
        Title
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="What needs doing?"
        />
      </label>
      <label>
        Description
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Optional details"
          rows={3}
        />
      </label>
      <label>
        Priority
        <select
          value={priority}
          onChange={(event) => setPriority(event.target.value as TaskPriority)}
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </label>
      <label>
        Due Date{" "}
        <span style={{ color: "#9ca3af", fontWeight: "normal" }}>
          (optional)
        </span>
        <input
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
        />
      </label>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button
          type="submit"
          disabled={createTask.isPending || updateTask.isPending}
        >
          {createTask.isPending || updateTask.isPending
            ? "Saving…"
            : isEditing
              ? "Update task"
              : "Add task"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
      {(createTask.isError || updateTask.isError) && (
        <p className="error">Unable to save task right now.</p>
      )}
    </form>
  );
}
