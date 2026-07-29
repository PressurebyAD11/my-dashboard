# Tech Context

## Stack
- Vue 3 (Composition API, <script setup>)
- Vuetify 3 (Material Design component library)
- Chart.js via vue-chartjs (line charts, bar charts, doughnut)
- Node.js + Express (API server)
- Vite (build tool)
- Vercel (deployment)

## Architecture
- Monorepo: /client (Vue SPA) + /server (Express API)
- Vercel serverless functions for API routes in production
- Static JSON files as data source (simulates database)

## Key Decisions
- Vuetify chosen for rapid, professional UI without custom design system
- Chart.js chosen for lightweight, well-documented charting
- No database — JSON files keep POC simple and deployable
- Simple auth (env-based credentials) — not production security

## Dev Environment
- VS Code
- Node 18+
- npm workspaces for monorepo management