# Data Schema

## shipments.json
Array of shipment records:
| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique shipment ID (e.g., "FF-2026-00142") |
| origin | string | Origin city |
| destination | string | Destination city |
| region | string | One of: Northeast, Southeast, Midwest, West, Southwest |
| status | string | delivered, in-transit, delayed, exception |
| scheduledDelivery | ISO date | When it was supposed to arrive |
| actualDelivery | ISO date | When it actually arrived (null if not yet) |
| carrier | string | Carrier name |
| weight | number | Weight in lbs |
| createdAt | ISO date | When shipment was created |

## regions.json
| Field | Type | Description |
|-------|------|-------------|
| id | string | Region identifier |
| name | string | Display name |
| totalShipments | number | Total shipments this period |
| onTimeRate | number | Percentage (0-100) |
| avgTransitDays | number | Average transit time |
| openExceptions | number | Current open exceptions |

## exceptions.json
| Field | Type | Description |
|-------|------|-------------|
| id | string | Exception ID |
| shipmentId | string | Related shipment |
| type | string | weather-delay, carrier-issue, customs-hold, damaged, address-error |
| severity | string | low, medium, high, critical |
| status | string | open, in-progress, resolved |
| region | string | Region |
| createdAt | ISO date | When exception was flagged |
| description | string | Human-readable description |
| assignedTo | string | Ops team member name |