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
- Filters bar sits above the main content (not sticky)
- Tablet layout splits chart row into two columns; lower row remains stacked until larger screens
- Mobile layout uses card/list presentation for regional and exception datasets

## Typography
- Vuetify defaults (Roboto) — clean, professional, no custom fonts needed

## Data Density
- High information density appropriate for ops tool
- Cards use large numbers with small labels
- Charts show trends, not just current values
- Desktop table is scannable with status chips

## Loading and Error Handling
- Dashboard uses skeleton loaders during every data fetch, including filter changes
- API failures show an inline error alert with a retry action
- Session expiration (401) triggers a short snackbar message, then auth state is cleared and user is redirected to login

## Empty State Strategy
- Dashboard-level empty state appears when selected filters return no shipments/exceptions
- Chart components render a graceful no-data message when the underlying series is all zeros

## Motion and Accessibility
- Subtle filter-change transitions are enabled by default for perceived responsiveness
- If the user prefers reduced motion, transitions and chart animations are disabled
- Interactive mobile cards and table states include visible keyboard focus treatments and keyboard activation support