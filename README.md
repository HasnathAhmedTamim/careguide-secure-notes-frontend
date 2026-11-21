# CareGuide Notes — Frontend

React + TypeScript app for private notes, community posts, and member discovery.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Default API: `http://localhost:5000/api` via `VITE_API_URL`.

## Features

- Login / Register
- Private notes (create, edit, delete)
- Community posts
- Browse people by interest
- View a member’s public posts
- Admin user management and all-notes view

Frontend route guards are UX-only. Authorization is enforced by the backend.

## Seed logins (after backend `npm run seed`)

- Admin: `admin@careguide.test` / `admin123`
- Member: `nabila@careguide.test` / `user1234`
- Member: `rafi@careguide.test` / `user1234`
