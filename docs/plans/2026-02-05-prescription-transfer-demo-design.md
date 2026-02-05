# Prescription Transfer Demo — Design

## Purpose

An internal demo prototype showing the prescription transfer feature for Felix (digital pharmacy). Demonstrates both the patient-facing mobile experience and the pharmacy-side workflow. Built to impress stakeholders and show how quickly the team can prototype.

## Architecture

Single Next.js app with two pages and mock API routes. All data lives in-memory on the server (resets on restart). No database, no external services.

**Tech stack:** Next.js (App Router), React, Tailwind CSS, Framer Motion

## Pages

### 1. Patient Demo (`/`)

Desktop layout with two zones:

- **Left sidebar (~300px):** Demo control panel
  - Title: "Prescription Transfer Demo"
  - "Current View" buttons: Home, Transfer Modal, Tracker
  - "Tracker State" radio toggles (visible when on tracker view): Submitted, Reviewed, Requested, Transferred, Completed
  - Each state shows its status message
  - Link to Pharmacy Dashboard

- **Center:** iPhone device frame (CSS mockup, ~390x844) containing the patient app

#### Screens inside the phone frame (fully interactive):

**Home (pre-transfer)**
- Top: "Home" header with Rx points badge (3,600)
- "Care" section: Existing prescription card (Smoking cessation, orders left: 3, next order: Oct 31)
- "For you" section: Horizontal scroll with "Transfer your prescriptions to Felix" CTA card (pill imagery, "Free delivery, auto refills & renewals") and "Everyday wellness" card
- Bottom tab bar: Home, Care, Shop, Profile (only Home functional)

**Transfer modal (bottom sheet)**
- Slides up over home screen
- Close (X) button top-left
- Title: "Transfer your prescription"
- Subtitle: "Search and select your current pharmacy."
- Address input field (pre-filled: "101 Peter St, Toronto, ON, M5V 0G6") with clear button
- "Choose a pharmacy below" label
- List of pharmacies with radio select:
  - Yonge Drug Mart — 2399 Yonge St, Toronto
  - The Village Pharmacy — 2518 Yonge St, Toronto
  - Sam's IDA Pharmacy — 1920 Yonge St unit 101-Y, Toronto
- "Continue" button (dark, full-width, bottom-pinned)
- Submitting creates a transfer via API and transitions to tracker view

**Home (tracker active)**
- Same layout as pre-transfer home, but:
- "Care" section now shows the transfer card:
  - Medication name: "Nizatidine"
  - Arrow icon to the right
  - Progress bar (green gradient with dot indicators)
  - Step labels: Reviewed, Requested, Transferred
  - Status message below (varies by state)
- Transfer CTA card removed from "For you" section

#### Tracker states & status messages:

| State | Progress | Message |
|-------|----------|---------|
| Submitted | Before first dot | Transfer request submitted. |
| Reviewed | First dot filled | Prescription reviewed by our team. |
| Requested | Second dot filled | Awaiting pharmacy transfer confirmation. |
| Transferred | Third dot filled | Prescription transferred successfully. |
| Completed | Full bar, all green | Your prescription is ready for fulfillment. |

### 2. Pharmacy Dashboard (`/pharmacy`)

Desktop layout, no phone frame. Clean admin-style interface.

- Top nav with link back to Patient Demo
- Table of incoming transfer requests:
  - Columns: Patient name, Medication, Source pharmacy, Status, Date submitted
  - Status shown as color-coded badge (gray=Submitted, blue=Reviewed, orange=Requested, green=Transferred/Completed)
- Clicking a row opens a detail panel with full prescription info:
  - Drug name, DIN, dosage, quantity, refills remaining
  - Prescribing doctor, patient name, date of birth
  - Source pharmacy name and address
  - Transfer request date
- Action buttons to advance status: "Mark as Reviewed", "Request Transfer", "Confirm Transferred", "Mark Completed"
- Advancing status here updates the patient-side tracker (shared in-memory state)

## API Routes

All Next.js route handlers. In-memory data store (simple JS object).

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/pharmacies` | GET | Returns nearby pharmacies (query param: `address`) |
| `/api/transfers` | GET | Returns all transfer requests with current status |
| `/api/transfers` | POST | Creates a new transfer request |
| `/api/transfers/[id]` | PATCH | Updates transfer status |
| `/api/prescriptions/[id]` | GET | Returns prescription details |

## Visual Design

**Patient app:**
- Light warm gray background (~#F5F5F0)
- White cards with rounded corners and subtle shadows
- Inter or system sans-serif font
- Green gradient progress bar with dot indicators
- Dark (#1A1A1A) "Continue" button
- Realistic iPhone frame with dynamic island, status bar, home indicator

**Pharmacy dashboard:**
- White background, clean table layout
- Color-coded status badges
- Structured detail panel

**Animations (Framer Motion):**
- Bottom sheet slides up with spring animation
- Progress bar animates between steps
- Screen transitions crossfade
- Toast notification when pharmacy advances status

## Seed Data

Pre-populated on server start:

- 1 existing prescription (Smoking cessation) for the Care section
- 3 pharmacies for the search results
- 1-2 existing transfer requests visible on the pharmacy dashboard (so it doesn't look empty on first load)
