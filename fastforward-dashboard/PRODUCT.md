# PRODUCT.md

## Platform
web

## Product
FastForward Operations Dashboard

## Users
- Primary: VP of Operations reviewing weekly operational health before and during leadership meetings.
- Secondary: Regional operations managers isolating region-specific issues during discussion.
- Tertiary: Executives who need a fast read of logistics performance during presentations.

## User Situation
Users open the dashboard shortly before leadership standups or while screensharing live. They are reading quickly, often under time pressure, and need to spot exceptions, trend changes, and regional outliers without digging through spreadsheets.

## Core Job
Turn fragmented shipment operations data into a 5-second leadership readout with drilldown by region and exception state.

## Product Purpose
Replace spreadsheet-driven status reporting with a single internal dashboard that shows shipment health, on-time performance, exception load, and regional variance in one place.

## Positioning
Turns fragmented shipment ops data into a 5-second leadership readout with drilldown by region and exception state.

## Operating Context
- Internal-only operations tool for leadership review and decision support.
- Used on laptops and conference-room displays.
- Current phase is a polished POC intended to demonstrate value before deeper investment.

## What It Must Make Possible
- See current operational health at a glance.
- Compare shipment volume and on-time trends over recent time windows.
- Isolate issues by region and exception status during live discussion.
- Present a credible, polished view to non-technical leadership without explanation.

## Capabilities In Scope
- KPI summary for total shipments, on-time delivery rate, average transit time, and open exceptions.
- Shipment volume trend across the last 7, 14, or 30 days.
- On-time delivery trend with clear performance readout.
- Regional performance breakdown.
- Filterable exception list with reset affordances.
- Password-protected access for demo use.

## Constraints
- Static mocked data for the current POC.
- No real database or live integrations yet.
- No user management or role-based permissions.
- Must stay presentation-ready for leadership demos.

## Brand Commitments
- Professional, operations-appropriate tone.
- Dense but not cluttered information design.
- FastForward brand colors and terminology should stay intact.
- Glanceability matters more than decorative flourish.

## Evidence On Hand
- Existing dashboard brief and project context in the repository.
- Mock shipment, regional, and exception datasets already wired into the app.
- Implemented login-gated dashboard flow and responsive layout.

## Evidence Gaps And Do-Not-Invent Rules
- No production customer metrics, testimonials, or live SLA claims.
- No real-time integrations, predictive analytics, or automated root-cause analysis.
- Do not imply broad enterprise rollout; this is still an internal POC.

## Design Principles
- Make the story legible within five seconds.
- Preserve trust through accurate, restrained status communication.
- Support discussion flow: scan, notice a problem, filter, explain.
- Keep leadership-facing polish high even when data is mocked.

## Accessibility Needs
- Readable at conference-room distance on large displays.
- Strong status differentiation beyond color alone.
- Keyboard-reachable controls and visible focus states.
- Reduced-motion support for transitions and chart animation.