# CareGuide Secure Notes — Frontend

Functional React + TypeScript UI for the CareGuide secure notes API.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Default API: `http://localhost:5000/api` via `VITE_API_URL`.

## Pages

- Login / Register
- User dashboard
- Notes list / create / edit
- Public posts
- Aggregations: users by interests
- Aggregations: user posts (`$lookup`)
- Admin dashboard
- Admin user management
- Admin all notes

Frontend route guards are UX-only. Authorization is enforced by the backend.
