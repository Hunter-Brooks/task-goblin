import { usePreviousDayReview } from "../hooks/useDailyPlan";

interface ReviewModalProps {
  onClose: () => void;
  onContinue: () => void;
}

export function ReviewModal({ onClose, onContinue }: ReviewModalProps) {
  const { data: review, isLoading, isError } = usePreviousDayReview();

  if (isLoading) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="modal-content review-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <h2>Loading review...</h2>
        </div>
      </div>
    );
  }

  if (isError || !review) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="modal-content review-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <h2>Unable to load review</h2>
          <p className="muted">
            Couldn't load yesterday's summary. You can still start your day.
          </p>
          <div className="modal-actions">
            <button onClick={onContinue} className="btn-primary">
              Continue Anyway
            </button>
            <button onClick={onClose} className="btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  const reviewDate = new Date(review.date);
  const formattedDate = reviewDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content review-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>📅 Yesterday's Review</h2>
        <p className="review-date">{formattedDate}</p>

        {review.completedTasks.length > 0 && (
          <section className="review-section">
            <h3>✅ Completed ({review.completedTasks.length})</h3>
            <ul className="review-list">
              {review.completedTasks.map((task) => (
                <li key={task.id}>
                  <strong>{task.title}</strong>
                  {task.description && (
                    <p className="muted">{task.description}</p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {review.completedTasks.length === 0 && (
          <section className="review-section">
            <p className="muted">No tasks completed yesterday</p>
          </section>
        )}

        {review.unfinishedHighPriority.length > 0 && (
          <section className="review-section">
            <h3>
              ⚠️ Unfinished High Priority (
              {review.unfinishedHighPriority.length})
            </h3>
            <ul className="review-list">
              {review.unfinishedHighPriority.map((task) => (
                <li key={task.id}>
                  <strong>{task.title}</strong>
                  <span className="pill priority-high">HIGH</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {review.overdueTasks.length > 0 && (
          <section className="review-section">
            <h3>🔴 Overdue Tasks ({review.overdueTasks.length})</h3>
            <ul className="review-list">
              {review.overdueTasks.map((task) => (
                <li key={task.id}>
                  <strong>{task.title}</strong>
                  <span className="due-date overdue">
                    Due:{" "}
                    {(() => {
                      const [year, month, day] = task.dueDate
                        .split("-")
                        .map(Number);
                      return new Date(
                        year,
                        month - 1,
                        day,
                      ).toLocaleDateString();
                    })()}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="modal-actions">
          <button onClick={onContinue} className="btn-primary">
            Start Today
          </button>
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
