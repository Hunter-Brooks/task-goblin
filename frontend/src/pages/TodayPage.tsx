import { TodayTaskList } from "../features/tasks/components/TodayTaskList";

export function TodayPage() {
  const now = new Date();
  const dateString = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const hour = now.getHours();
  let greeting = "Good evening";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 18) greeting = "Good afternoon";

  return (
    <div className="today-page">
      <header className="today-header">
        <div className="greeting-section">
          <h1>{greeting}</h1>
          <p className="today-date">{dateString}</p>
        </div>
      </header>

      <div className="today-content">
        <section className="big-three-placeholder">
          <h3>🎯 Big Three</h3>
          <p className="muted">
            Your three most important tasks will appear here.
            <br />
            <small>Coming in Milestone 5</small>
          </p>
        </section>

        <TodayTaskList />
      </div>
    </div>
  );
}
