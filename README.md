# Freitty Frontend

Client cabinet for the Freitty logistics platform. Three screens from the assignment mockup:

1. **Dashboard** — KPI cards, active orders, activity charts
2. **Order List** — tabs, filters (synced to the URL), cards / table / pipeline
3. **Order Detail** — Cross-Dock cabinet view (dock, expected vs actual, operations, supplies)

## Stack

React 19, Vite, TypeScript, Tailwind CSS 4, TanStack Query, React Router, Recharts.

All data comes from the NestJS API (`VITE_API_URL`). Nothing is hardcoded on the client except demo-scope placeholders (New Order / Settings / Top up).

## Local setup

```bash
cp .env.example .env
# VITE_API_URL=http://localhost:3000
npm install
npm run dev
```

App: http://localhost:5173

The API must be running (see `freitty-backend`).

## Deploy (Vercel)

1. Push this repo to GitHub (`gh repo create freitty-frontend --private --source=. --remote=origin --push`).
2. Import it on vercel.com.
3. Set `VITE_API_URL` to the Render API origin (no trailing slash), e.g. `https://freitty-api.onrender.com`.
4. `vercel.json` rewrites all routes to `index.html` (SPA).

Backend lives in a sibling repo: `~/Projects/freitty-backend`. Full steps: that repo’s `DEPLOY.md`.

## Presentation notes

- Layout, badges and order cards follow `Freitty_For_Candidate.html` (not pixel-perfect).
- KPI windows are computed against `DEMO_NOW=2026-04-17` on the API so the mockup week is reproducible.
- Filters live in the query string so a recruiter can share `/orders?tab=alerts&view=pipeline`.
