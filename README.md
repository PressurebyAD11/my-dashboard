# FastForward Logistics — Operations Dashboard

Internal operations dashboard prototype for FastForward Logistics.
Built as a POC to replace spreadsheet-based reporting for the VP of Operations.

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