# Parking Management System - Frontend

Angular client for the Parking Management System.  
It consumes the backend REST API and handles UI flows (tickets, dashboard, filters, and reports).

## Features

- Entry/exit and ticket status views
- Dashboard charts (occupancy and revenue metrics based on available data)
- Ticket history with filters
- Export/chart tooling available (`xlsx`, `echarts`)
- Shared HTTP layer with configurable API base URL

## Stack

- Angular 21
- Angular Material + Bootstrap
- RxJS
- `ngx-echarts`
- Environment-based API URL (`environment.ts` / `environment.prod.ts`)

## Architecture

The frontend authenticates, stores the token, and calls `/api/...` routes through a shared HTTP layer.  
Business rules (pricing/ticket calculations) stay in the backend.

## Local setup

```bash
cd parking-management-frontend
npm install
npm start
```

Dev server: `http://localhost:4200/`

Set `apiUrl` in `src/environments/environment.ts`.  
For local Docker backend, a common value is `http://localhost:8080/api`.

## Build

```bash
npm run build
```

The compiled output is generated in `dist/`.

## Testing

Unit tests:

```bash
ng test
```

End-to-end tests:

```bash
ng e2e
```

## Angular CLI basics

Development server:

```bash
ng serve
```

Generate components:

```bash
ng generate component component-name
```

More CLI help:

```bash
ng generate --help
```

## Deployment notes

- Build with `npm run build`
- Host static files (Nginx, S3 + CDN, etc.)
- Make sure `environment.prod.ts` points to the production backend API
