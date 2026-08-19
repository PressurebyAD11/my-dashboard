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
- Dynamic KPI summary (shipments, on-time rate, transit time, exceptions)
- Interactive filters (date range, region, exception status)
- Shipment volume and on-time delivery trend charts
- Regional performance comparison table
- Open exceptions panel with severity tracking

### Dashboard Logic & Demo Scenarios
The prototype uses intentionally varied data across each date range to demonstrate how the dashboard communicates different operational conditions. Rather than changing only the KPI values, the hero messaging, performance gap, supporting copy, and visual states respond to the underlying data.

The date ranges currently demonstrate:

- **7 Days - Target Unavailable:** Represents a window with no shipment activity. Total Shipments and Open Exceptions can validly display `0`, while calculated metrics such as On-Time Rate and Avg Transit Time display `—` because there is no shipment data to evaluate.
- **14 Days - Above Target:** Represents strong operational performance with 26 shipments, a 96.2% on-time delivery rate, 1.7-day average transit time, and 1 open exception.
- **30 Days - Below Target:** Represents a period where on-time delivery performance falls below the defined operational target.

These scenarios are intentional for the prototype and allow the dashboard to demonstrate how the interface responds to unavailable, strong, and underperforming operational conditions.

### Performance State Logic
On-time delivery is evaluated against a **90% target**.

When shipment data is available, the hero uses a consistent three-tier performance model:

- **Above Target:** On-time rate is above 92.0%.
- **On Target:** On-time rate is from 88.0% through 92.0%.
- **Below Target:** On-time rate is below 88.0%.

When there are no shipments in the selected period, the dashboard displays **Target Unavailable** instead of assigning a performance tier.

`Target Unavailable` is a data-availability state, not a fourth performance tier. It prevents the dashboard from presenting a false positive or negative performance assessment when there is no underlying shipment data.

The same principle applies to KPI cards: count metrics can legitimately display zero, while calculated metrics display an unavailable state when there is no data to calculate from.

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