import { Link } from "react-router-dom";
import { useInboxItems } from "../features/inbox/hooks/useInbox";
import { BigThreeSelector } from "../features/planning/components/BigThreeSelector";

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

        <BigThreeSelector />

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
