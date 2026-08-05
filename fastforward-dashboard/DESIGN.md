# DESIGN.md

## Overview
FastForward Operations Dashboard is a high-density internal operations surface. It should read as credible, fast, and controlled rather than expressive or consumer-friendly. The visual system supports executive scanning first, drilldown second.

## Design Attributes
- Glanceable
- Operational
- Polished
- Dense
- Trustworthy
- Restrained

## Color

### Core Palette
- Primary navy: #1B2A4A
- Accent orange: #F26522
- Success green: #4CAF50
- Warning amber: #FF9800
- Error red: #F44336
- Background: #F5F7FA
- Surface: #FFFFFF

### Usage
- Use navy for primary structure, app chrome, and high-importance actions.
- Use orange sparingly as the brand accent for active states and emphasis.
- Use semantic colors for operational status only; do not repurpose them decoratively.
- Keep backgrounds light and surfaces white so dense information remains legible.

## Typography
- Base system: Vuetify default Roboto stack.
- Large KPI numerals should carry the main visual weight.
- Labels and captions stay compact and subdued.
- Section titles should be clear and practical, never marketing-styled.

## Layout
- Fixed left navigation on larger screens; rail treatment on mobile.
- Top app bar holds brand identity, page title, and session actions.
- Main content order: filters, KPIs, charts, regional breakdown, exceptions.
- Prefer two-column analytical layouts on desktop and single-column stacking on smaller screens.
- Maintain generous container padding so dense modules do not collapse into clutter.

## Surfaces And Elevation
- Use light surfaces with subtle elevation.
- Cards are rounded but still restrained; avoid soft consumer-style pill treatments everywhere.
- Emphasize grouping through spacing and layout before stronger shadows.

## Components

### Filters
- Filters live in a dedicated card near the top of the page.
- Date range uses chips for fast toggling.
- Region and exception status use outlined selects.
- Reset stays visible and explicit.

### KPI Cards
- Lead with the number, then the label, then the trend/supporting text.
- Cards should feel scannable in a row, with consistent heights and alignment.

### Charts
- Charts support trend reading, not decoration.
- Keep legends, axes, and line treatments clean and minimal.
- Thresholds and status context should be obvious without over-annotating.

### Tables And Exception Panels
- Desktop tables should be highly scannable with clear row rhythm.
- Status chips should encode state consistently across table and panel views.
- Mobile fallback should favor cards or stacked rows with preserved status cues.

### Empty, Loading, And Error States
- Loading uses skeletons during initial load and filter updates.
- Empty states should be clear, specific, and action-oriented.
- Errors should appear inline with a retry path.
- Session expiration should use a short transient warning before redirect.

## Motion
- Motion is subtle and functional.
- Filter-change transitions should be brief and support perceived responsiveness.
- Disable transitions and chart animation when reduced-motion is requested.

## Responsiveness
- Designed first for laptop and presentation display use.
- Tablet keeps analytical density where possible.
- Mobile stacks content cleanly and preserves filter access, status meaning, and keyboard interaction.

## Accessibility
- Visible keyboard focus is required on interactive elements.
- Do not rely on color alone for operational status.
- Preserve readable contrast on status chips, app bar, and metric cards.
- Copy should stay direct and concise under time pressure.

## Do
- Prioritize scan speed over flourish.
- Use spacing to separate analytical groups clearly.
- Keep operational language short and concrete.
- Preserve consistency between dashboard modules.

## Do Not
- Introduce consumer-marketing visual tropes.
- Overuse accent orange or semantic colors.
- Hide critical state changes behind animation.
- Inflate the product into something more automated or data-rich than the current POC supports.