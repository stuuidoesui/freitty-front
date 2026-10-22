# Freitty Frontend

Client cabinet for the Freitty logistics platform. Three screens from the assignment mockup:

1. **Dashboard** — KPI cards, active orders, activity charts
2. **Order List** — tabs, filters (synced to the URL), cards / table / pipeline
3. **Order Detail** — Cross-Dock cabinet view (dock, expected vs actual, operations, supplies)

## Stack

React 19, Vite, TypeScript, Tailwind CSS 4, TanStack Query, React Router, Recharts, dnd-kit.

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

## Pipeline rule

In Pipeline view a client may drag **Draft → Ready** only. Other drops are ignored; the API also returns `403`.

## Deploy (Vercel)

- Root: this repo
- Env: `VITE_API_URL` = Render API origin, e.g. `https://freitty-api.onrender.com`
- `vercel.json` rewrites all routes to `index.html` (SPA)

## Presentation notes

- Layout, badges and order cards follow `Freitty_For_Candidate.html` (not pixel-perfect).
- KPI windows are computed against `DEMO_NOW=2026-04-17` on the API so the mockup week is reproducible.
- Filters live in the query string so a recruiter can share `/orders?tab=alerts&view=pipeline`.
