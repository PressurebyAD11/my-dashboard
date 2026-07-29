# Design Decisions

## Brand Colors
- Primary Navy: #1B2A4A
- Accent Orange: #F26522
- Success Green: #4CAF50
- Warning Amber: #FF9800
- Error Red: #F44336
- Background: #F5F7FA
- Surface: #FFFFFF

## Layout
- Fixed left sidebar with navigation (collapsed on smaller screens)
- Top bar with FastForward logo, page title, user avatar
- Main content area: KPI cards row → Charts row → Table/Panel row
- Filters bar sits above the main content, sticky

## Typography
- Vuetify defaults (Roboto) — clean, professional, no custom fonts needed

## Data Density
- High information density appropriate for ops tool
- Cards use large numbers with small labels
- Charts show trends, not just current values
- Table is scannable with status chips