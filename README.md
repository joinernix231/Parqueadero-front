# Parking Management Frontend

A frontend built for real parking operations: vehicle check-in/check-out, occupancy tracking, ticket history, and reporting.

This is not a classroom CRUD demo. It is designed around real daily workflows where operators need speed, clarity, and reliable data.

---

## Quick Overview

This app helps teams:

- register entries and exits without friction,
- track active tickets in real time,
- keep a clean ticket history,
- and monitor operations from a practical dashboard.

---

## What Problem It Solves

Many parking operations still rely on paper, spreadsheets, or disconnected tools.  
That usually creates billing mistakes, delays at exit, and weak traceability.

This frontend centralizes the workflow so teams can work faster and with fewer errors.

---

## Real-World Context

The project is aimed at real use cases:

- private parking businesses,
- shopping malls,
- corporate buildings,
- and controlled-access facilities.

The goal is simple: easy for operators, trustworthy for management.

---

## Core Features

- Token-based authentication with protected routes
- Vehicle check-in by plate with spot assignment
- Check-out flow with confirmation and updated pricing
- Active tickets + searchable history
- Dashboard with occupancy and revenue indicators
- Reports with filters and export
- Clear UI feedback (loading, empty states, success, errors)

---

## Stack

- Angular 21 (standalone components)
- TypeScript
- RxJS
- Angular Material + Bootstrap
- ngx-echarts

Expected backend:

- Laravel API (`/api`)
- Bearer token authentication

---

## Architecture (Simple View)

```txt
src/app/
  core/      # auth, interceptors, guards, base HTTP layer
  shared/    # reusable components, utilities, shared services
  features/  # domain-based routing
  modules/   # current implementation of each domain flow
```

Business logic is kept in services/presenters instead of large templates, so the code stays maintainable as the product grows.

---

## How to Run

### 1) Start the backend

Make sure the Laravel API is available.  
Local example:

- `http://localhost:8080/api`

### 2) Start the frontend

```bash
cd parking-management-frontend
npm install
npm start
```

Application URL:

- `http://localhost:4200`

---

## Environment Configuration

Review:

- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`

Key values:

- `apiUrl`: backend base URL
- `timezone`: app timezone

---

## For Clients

If you need a parking platform (or a similar operations system), this project works as a strong production-ready base.

It can be adapted for:

- multi-location parking,
- custom pricing rules,
- payment integrations,
- camera/access integrations,
- and role-specific dashboards.

I can also tailor the architecture and UI flow to match your business process, not just deliver generic screens.

---

## Final Note

This project was built with a product mindset, not just to “look clean” in code.

It is practical, scalable, and ready to be extended in real client environments.
