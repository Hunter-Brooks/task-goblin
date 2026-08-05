import { Link } from "react-router-dom";
import { useInboxItems } from "../features/inbox/hooks/useInbox";

export function PlanningPage() {
  const { data: inboxItems } = useInboxItems();
  const unprocessedCount =
    inboxItems?.filter((item) => !item.processed).length || 0;

  return (
    <div className="planning-page">
      <header>
        <h1>Planning</h1>
        <p className="muted">Organize your work intentionally.</p>
      </header>

      <div className="planning-sections">
        <section className="panel">
          <h3>📥 Process Inbox</h3>
          {unprocessedCount > 0 ? (
            <div>
              <p>
                You have <strong>{unprocessedCount}</strong> unprocessed item
                {unprocessedCount === 1 ? "" : "s"} in your inbox.
              </p>
              <Link to="/inbox" className="btn-link">
                Go to Inbox →
              </Link>
            </div>
          ) : (
            <p className="muted">✅ Inbox is empty</p>
          )}
        </section>

        <section className="panel">
          <h3>🎯 Select Big Three</h3>
          <p className="muted">
            Choose your three most important tasks for today.
            <br />
            <small>Coming in Milestone 5</small>
          </p>
        </section>

        <section className="panel">
          <h3>📊 Priority Matrix</h3>
          <p className="muted">
            Organize tasks by urgency and importance.
            <br />
            <small>Coming in future milestone</small>
          </p>
        </section>
      </div>
    </div>
  );
}
