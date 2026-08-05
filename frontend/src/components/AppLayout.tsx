import { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { GlobalQuickCapture } from "./GlobalQuickCapture";

const links = [
  { to: "/", label: "Today", end: true },
  { to: "/inbox", label: "Inbox" },
  { to: "/planning", label: "Planning" },
  { to: "/tasks", label: "Tasks" },
  { to: "/focus", label: "Focus" },
];

export function AppLayout() {
  const [showQuickCapture, setShowQuickCapture] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Only trigger if not typing in an input/textarea
      if (
        event.key === "q" &&
        !["INPUT", "TEXTAREA"].includes((event.target as HTMLElement).tagName)
      ) {
        event.preventDefault();
        setShowQuickCapture(true);
      }
      // ESC to close
      if (event.key === "Escape" && showQuickCapture) {
        setShowQuickCapture(false);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [showQuickCapture]);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">Task Goblin</p>
          <h1>Local-first productivity</h1>
          <p className="muted">
            Capture tasks quickly, plan your day, and focus on what matters
            next.
          </p>
        </div>
        <nav>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="content">
        <Outlet />
      </main>
      <button
        className="fab-quick-capture"
        onClick={() => setShowQuickCapture(true)}
        title="Quick Capture (Press Q)"
      >
        ✚
      </button>
      <GlobalQuickCapture
        isOpen={showQuickCapture}
        onClose={() => setShowQuickCapture(false)}
      />
    </div>
  );
}
