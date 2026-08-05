# Task Goblin — Development Roadmap

**Version:** 0.1  
**Status:** Active Development

---

# Overview

This document tracks the implementation plan for Task Goblin.

The goal is to build the app incrementally, prioritizing the core workflow:

Capture
↓
Plan
↓
Focus
↓
Review

Development should prioritize working features over premature architecture improvements.

---

# Current Status

## Completed Foundation

### Backend

✅ Spring Boot application  
✅ Java backend  
✅ SQLite database  
✅ Spring Data JPA  
✅ REST API  
✅ Task CRUD operations  
✅ Task validation  
✅ Environment-based configuration  
✅ Backend integration tests

### Frontend

✅ React + TypeScript + Vite  
✅ React Router  
✅ TanStack Query  
✅ Feature-based structure  
✅ Navigation shell  
✅ Task creation UI  
✅ Task list UI  
✅ API integration  
✅ Loading/error states

---

# Current Gaps

The application currently functions as a basic task manager.

The missing features that make Task Goblin unique are:

- Quick capture
- Inbox workflow
- Daily planning
- Big Three
- Today-focused experience
- Review workflow

---

# Milestone 1 — Complete Task Management

## Goal

Turn the existing task CRUD system into a usable task manager.

## Status

🔄 Next Up

---

## Backend

Existing functionality is sufficient.

No new entities required.

---

## Frontend Tasks

### Task Completion

Add:

- Complete/uncomplete checkbox
- Completed visual state
- Status updates

Example:

☐ Build API

↓

☑ Build API

---

### Task Editing

Add:

- Edit button
- Edit modal/form
- Update API integration

---

### Task Deletion

Add:

- Delete button
- Confirmation prompt
- Remove from list

---

### Due Dates

Add:

- Due date picker
- Display due dates
- Highlight overdue tasks

---

# Milestone 2 — Inbox System

## Goal

Implement frictionless capture.

The user should be able to record thoughts without deciding where they belong.

---

## Backend

Create:

## InboxItem

id
content
createdAt
processed

---

## API

Add:

GET /api/inbox
POST /api/inbox
DELETE /api/inbox/{id}
PUT /api/inbox/{id}/process

---

## Frontend

Create:

features/inbox/

Add:

- Quick capture input
- Inbox list
- Process workflow

---

## Inbox Flow

Random thought

"Buy keyboard switches"

    ↓

Inbox

    ↓

Daily Planning

    ↓

Task

---

# Milestone 3 — Today Experience

## Goal

Make Today the primary experience.

The user should immediately know:

"What should I do right now?"

---

## Today Page

Add:

## Good Morning

Contains:

- Date
- Start Day button
- Review entry point

---

## Morning Habits

Initial examples:

- Brush teeth
- Take medication
- Make bed

---

## Big Three Placeholder

Prepare UI for:

- Three daily priorities
- Completion tracking

---

## Today Task Filtering

Add:

- Tasks assigned to today
- Due today tasks
- Important tasks

---

# Milestone 4 — Daily Planning

## Goal

Create the planning workflow.

---

## Start Day Flow

User chooses:

Ready for today?

Not automatic midnight reset.

---

## Daily Review

Show:

- Completed tasks
- Completed habits
- Previous Big Three
- Unfinished important items

---

## Planning Steps

1. Review yesterday
2. Process Inbox
3. Review overdue tasks
4. Use Priority Matrix
5. Select Big Three

---

# Milestone 5 — Big Three System

## Goal

Create focused daily priorities.

---

Rules:

- Exactly three priorities.
- Selected during planning.
- Do not automatically refill.
- Reviewed the next day.

---

Data Model:

DailyPlan

id
date
started

DailyPlanTask

dailyPlanId
taskId
position

---

# Milestone 6 — Organization

## Goal

Improve long-term task management.

---

## Projects

Add:

- Project entity
- Project filtering
- Project assignment

Rules:

- Tasks can exist without projects.
- No nested projects.
- Keep projects simple.

---

# Milestone 7 — Habits

## Goal

Track repeated personal routines.

---

Examples:

- Exercise
- Reading
- Morning routine

---

Separate from recurring tasks.

---

# Milestone 8 — Focus Mode

## Goal

Help complete important work.

Features:

- Current task view
- Minimal distractions
- Optional timer
- Task completion

---

# Milestone 9 — Review & Intelligence

## Goal

Learn from usage.

---

Future AI features:

- Identify repeatedly postponed tasks
- Suggest task prioritization
- Analyze productivity patterns
- Summarize completed work

---

# Back Burner Features

Not part of MVP:

## Quick Capture

- Global shortcut
- Voice capture
- Mobile widget
- SMS capture

---

## Sync

- Cloud sync
- Multi-device support
- Shared accounts

---

## Calendar

- External calendar integration
- Schedule syncing

---

## Desktop Packaging

Future:

- Electron
- Tauri

---

## Android App

Future:

Focus on:

- Quick capture
- Today view
- Task completion

---

# Development Rules

1. Build user-facing value before refactoring.
2. Avoid adding complexity without a clear need.
3. Keep the app personal and lightweight.
4. Preserve the Capture → Plan → Focus workflow.
5. Do not optimize for features we are not using yet.

---

# Current Next Action

Complete Milestone 1:

**Make tasks fully manageable before adding new systems.**
