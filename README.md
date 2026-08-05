# Task Goblin

Task Goblin is a local-first personal productivity app focused on quick capture, daily planning, and focused execution.

## Current Status

**Milestones 1-4 Complete** ✅

- ✅ **Milestone 1:** Complete Task Management (create, edit, delete, complete, due dates)
- ✅ **Milestone 2:** Inbox System (quick capture, convert to tasks, global quick capture with FAB and keyboard shortcuts)
- ✅ **Milestone 3:** Today Experience (personalized greeting, all tasks sorted by priority, Big Three placeholder)
- ✅ **Milestone 4:** Daily Planning (start day flow, review workflow, planning page structure)

See [DEVELOPMENT_ROADMAP.md](docs/DEVELOPMENT_ROADMAP.md) for detailed feature breakdown and future milestones.

## Features

### Current Features

- **Task Management:** Create, edit, delete, and complete tasks with priorities and due dates
- **Quick Capture:** Global quick capture accessible via FAB button (✚) or keyboard shortcut (Q)
- **Inbox:** Capture ideas quickly and convert them to tasks during planning
- **Today View:** Personalized greeting with all tasks sorted by priority
- **Daily Planning:** Start day flow with review of yesterday's work, unfinished priorities, and overdue tasks
- **Navigation:** Clean sidebar navigation between Today, Tasks, Inbox, and Planning pages

### Coming Soon

- Big Three daily priorities (Milestone 5)
- Projects and organization (Milestone 6)
- Focus Mode and Habits (Milestone 7)

## Structure

- `backend/` – Spring Boot REST API with SQLite persistence
- `frontend/` – React + TypeScript + Vite client
- `docs/` – project documentation

## Run the backend

```bash
cd backend
./mvnw spring-boot:run
```

If Maven Wrapper is unavailable in your environment, use your installed Maven:

```bash
mvn spring-boot:run
```

The backend defaults to `http://localhost:8080` and stores data in `backend/data/task-goblin.db`. Override with environment variables such as `TASK_GOBLIN_DB_URL`, `TASK_GOBLIN_DDL_AUTO`, `TASK_GOBLIN_SHOW_SQL`, `TASK_GOBLIN_CORS_ALLOWED_ORIGIN`, and `SERVER_PORT`.

## Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Set `VITE_API_BASE_URL` if your API is not running at `http://localhost:8080`.
