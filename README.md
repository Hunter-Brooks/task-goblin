# Task Goblin

Task Goblin is a local-first personal productivity app focused on quick capture, daily planning, and focused execution.

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
