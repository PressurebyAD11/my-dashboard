# FastForward Logistics — Operations Dashboard

Internal operations dashboard prototype for FastForward Logistics.
Built as a POC to replace spreadsheet-based reporting for the VP of Operations.

## Product Framing

### What's the problem we're solving for?
FastForward's operations team is relying on spreadsheets and disconnected reporting to understand day-to-day performance. That makes it hard for leadership to answer the basic questions quickly: Are shipments moving on time, where are delays building up, and what needs attention right now?

### Who are we designing for?
The primary user is the VP of Operations. The dashboard is also useful for operations managers and other internal leaders who need a fast, trustworthy view of shipment health during reviews and leadership meetings.

### What flows are we trying to implement?
The MVP focuses on a simple scan-and-drill workflow:
- Open the dashboard and get an immediate read on operational health from KPI cards.
- Filter by date range, region, and exception status to narrow the view.
- Review shipment volume and on-time delivery trends to understand movement over time.
- Compare regional performance to spot where issues are concentrated.
- Inspect open exceptions and severity so the team knows what to act on next.

### What is the path for growth past MVP?
After the MVP proves the core reporting workflow, the product can grow into a broader operations command center:
- Replace static demo data with live data integrations.
- Add alerting and exception routing so issues surface proactively.
- Expand drilldowns from summary metrics into shipment-level detail and history.
- Introduce role-based access, saved views, and user-specific defaults.
- Layer in exports, scheduled reports, and meeting-ready summaries for leadership.

## Features
- Real-time KPI summary (shipments, on-time rate, transit time, exceptions)
- Interactive filters (date range, region, exception status)
- Shipment volume and on-time delivery trend charts
- Regional performance comparison table
- Open exceptions panel with severity tracking

## Tech Stack
- Vue 3 + Vuetify 3
- Chart.js (via vue-chartjs)
- Node.js + Express
- Deployed on Vercel

## Local Development
```bash
# Install dependencies
npm install

# Start server
cd server && npm run dev

# Start client
cd client && npm run dev