# BRIEF.md — FastForward Logistics Operations Dashboard

## Client
FastForward Logistics — mid-size freight and supply chain company

## Stakeholder
VP of Operations — needs a single dashboard for leadership meetings

## Problem Statement
The ops team is drowning in spreadsheets. Leadership has no unified view of
operational health. The VP needs to pull up one screen in meetings and
immediately understand: Are we shipping on time? Where are we struggling?
What needs attention right now?

## Solution
A password-protected internal operations dashboard that surfaces:
1. **KPI Summary** — total shipments, on-time delivery %, avg transit time, open exceptions count
2. **Shipment Volume Trend** — daily/weekly volume over the last 30 days
3. **On-Time Delivery Rate** — trend line with target threshold
4. **Regional Performance** — table/map showing metrics by region
5. **Open Exceptions** — filterable list of shipments needing attention

## Interactive Elements
- Date range selector (7d / 14d / 30d)
- Region filter (dropdown, multi-select)
- Exception status filter (open / in-progress / resolved)
- KPI cards clickable to drill into relevant section

## Design Principles
- **Glanceable**: VP should get the story in 5 seconds
- **Ops-appropriate tone**: Professional, dense but not cluttered
- **FastForward branded**: Uses company colors (navy, orange, white)
- **Responsive**: Works on laptop and conference room display

## Tech Stack
- Frontend: Vue 3 + Vuetify 3 + Chart.js (vue-chartjs)
- Backend: Node.js + Express (serves static JSON data)
- Deployment: Vercel
- Auth: Simple token-based login gate

## Success Criteria
- Site is live and password-protected
- All 5 dashboard sections render with realistic dummy data
- Filters update displayed data dynamically
- A non-technical VP could use it without instructions

## Out of Scope (POC)
- Real database or live data integrations
- User management / role-based access
- Mobile-native experience
- Export/PDF functionality