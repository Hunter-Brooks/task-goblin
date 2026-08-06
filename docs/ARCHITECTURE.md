# Task Goblin — Architecture Document

**Version:** 0.4  
**Status:** Draft
**Implementation:** Milestones 1-4 Complete

---

# 1. Overview

Task Goblin is a local-first personal productivity application.

The MVP uses a client/server architecture:
React Frontend
|
|
Spring Boot REST API
|
|
SQLite Database

The application is designed to run locally on Windows initially, with future support for:

- Desktop packaging
- Android application
- Optional cloud synchronization

The architecture prioritizes:

- Fast development
- Simple maintenance
- Clear separation of responsibilities
- Future expansion without major rewrites

---

# 2. Repository Structure

Task Goblin uses a monorepo structure.
task-goblin/
├── backend/
├── frontend/
├── docs/
│ ├── PRD.md
│ └── ARCHITECTURE.md
├── README.md
└── .gitignore

---

# 3. Backend Architecture

## Technology Stack

- Java
- Spring Boot
- Spring Data JPA
- SQLite
- REST API

---

## Design Philosophy

The backend should remain simple.

The initial architecture intentionally avoids unnecessary abstraction.

MVP structure:
Controller
↓
Repository
↓
Database

A service layer should only be introduced when business logic becomes complex enough to justify it.

---

# 4. Backend Project Structure

backend/src/main/java/com/taskgoblin/backend/

├── TaskController.java ✅
├── InboxController.java ✅
├── DailyPlanController.java ✅
├── Task.java ✅
├── InboxItem.java ✅
├── DailyPlan.java ✅
├── TaskRepository.java ✅
├── InboxRepository.java ✅
├── DailyPlanRepository.java ✅
└── BackendApplication.java ✅

## Implementation Status

✅ **Implemented:** Task, InboxItem, DailyPlan entities and controllers
⏳ **Future:** Project, Habit (Milestones 5-6)

Note: Current implementation uses a flat package structure. Service layer and organizing into packages will be done when complexity justifies it.

---

# 5. Database Architecture

## Database

SQLite is used for the MVP.

Reasons:

- Local-first
- Simple setup
- No external dependencies
- Easy backups
- Easy migration later

Database location:
backend/data/task-goblin.db

---

# 6. Data Models

## Task

Core unit of work.

Fields:
id
title
description
status
priority
dueDate
projectId
recurrenceRule
createdAt
completedAt

---

## Project

Container for related tasks.

Fields:
id
name
description
status
createdAt

Rules:

- Projects cannot contain other projects.
- Projects are simple organizational containers.

---

## Inbox Item

Temporary capture location.

Fields:
id
content
createdAt
processed

Flow:
Inbox Item
↓
Task
Project
Habit
Someday
Delete

---

## Habit

Personal routines.

Fields:
id
name
timeOfDay
schedule
active
createdAt

---

## Daily Plan

Represents a user's planned day.

Fields:
id
date
started
createdAt

Big Three relationship:
DailyPlan
|
|
DailyPlanTask
|
|
Task

The database does not store three fixed columns.

Instead:
DailyPlanTask

dailyPlanId
taskId
position

This allows future flexibility while enforcing a maximum of three tasks in application logic.

---

# 7. API Architecture

## Base URL

/api

---

# Tasks

## Get Tasks

GET /api/tasks

---

## Create Task

POST /api/tasks

Example:

```json
{
  "title": "Build Task Goblin",
  "priority": "HIGH"
}

Get Task
GET /api/tasks/{id}

Update Task
PUT /api/tasks/{id}

Delete Task
DELETE /api/tasks/{id}
Inbox
Get Inbox
GET /api/inbox
Create Inbox Item
POST /api/inbox

Example:

{
  "content": "Schedule dentist appointment"
}
Process Inbox Item
PUT /api/inbox/{id}/process

Converts inbox item into:

Task
Project
Habit
Someday
Daily Planning
Start Day
POST /api/daily-plan/start

Responsibilities:

Create daily plan
Retrieve previous day review
Identify unfinished Big Three items
Get Today's Plan
GET /api/daily-plan/today
Update Big Three
PUT /api/daily-plan/big-three

Delete Today's Plan

DELETE /api/daily-plan/today

Used for:

Testing reset
Day restart scenarios
Development workflows

Review
Get Previous Day Review
GET /api/review/previous-day

Returns:

Completed tasks
Completed habits
Previous Big Three
Unfinished important items
Overdue tasks
8. Frontend Architecture
Technology Stack
React
TypeScript
Vite
React Router
TanStack Query
Zustand
9. Frontend Design Philosophy

The frontend is responsible for:

Displaying information
User interaction
Navigation
Local UI state

The frontend should not own business rules.

Example:

Good:

User clicks complete task

React
 ↓
API Request

Spring Boot
 ↓
Update database

Bad:

React
 ↓
Decides recurring rules
 ↓
Updates multiple records
10. Frontend Structure

Feature-based organization.

frontend/src/

├── api/
│   ├── tasks.ts ✅
│   └── inbox.ts ✅
│
├── components/
│   ├── AppLayout.tsx ✅
│   └── GlobalQuickCapture.tsx ✅
│
├── features/
│   ├── tasks/
│   │   ├── components/
│   │   │   ├── TaskForm.tsx ✅
│   │   │   ├── TaskList.tsx ✅
│   │   │   └── TodayTaskList.tsx ✅
│   │   ├── hooks/
│   │   │   └── useTasks.ts ✅
│   │   └── types/
│   │       └── task.ts ✅
│   │
│   └── inbox/
│       ├── components/
│       │   ├── InboxForm.tsx ✅
│       │   └── InboxList.tsx ✅
│       ├── hooks/
│       │   └── useInbox.ts ✅
│       └── types/
│           └── inbox.ts ✅
│
├── pages/
│   ├── TodayPage.tsx ✅
│   ├── TasksPage.tsx ✅
│   ├── InboxPage.tsx ✅
│   ├── PlanningPage.tsx ⏳
│   └── FocusPage.tsx ⏳
│
├── index.css ✅
└── main.tsx ✅

## Implementation Status

✅ **Milestones 1-5 Complete:** Task management, Inbox system, Today experience, Daily Planning, Big Three System
⏳ **Future:** Projects (Milestone 6), Habits (Milestone 7), Focus Mode (Milestone 8)
11. Navigation

Primary navigation remains intentionally small.

Today
Planning
Tasks
Focus

Inbox is accessible globally.

It is not a primary destination because capture should be quick, not a place users live.

12. State Management
Server State

Use:

TanStack Query

Responsible for:

Tasks
Projects
Habits
Inbox
Daily Plans
Client State

Use:

Zustand

Responsible for:

UI preferences
Selected task
Focus mode state
Temporary interface state
13. Configuration

Configuration uses a layered approach.

Priority:

Default configuration
Local configuration
Environment variables

Example:

application.properties

        ↓

application-local.properties

        ↓

Environment Variables
14. Future Architecture
Desktop Application

Future:

Desktop App
      |
React
      |
Spring Boot
      |
SQLite

Possible technologies:

Electron
Tauri
Android Application

Future:

Android App
        |
        |
Spring Boot API
        |
        |
Database

Initial Android focus:

Quick capture
Today view
Focus mode
Task completion
15. Architecture Non-Goals

The architecture should avoid:

Microservices
Cloud infrastructure
Authentication systems
Multi-user support
Complex permissions
Enterprise patterns

Task Goblin is a personal productivity tool first.

16. Architecture Rules
Prefer simplicity over abstraction.
Do not build future features prematurely.
Keep business logic out of the frontend.
Keep the backend easy to expand.
Optimize for a working personal tool.
```
