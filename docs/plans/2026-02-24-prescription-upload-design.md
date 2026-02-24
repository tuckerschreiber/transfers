# Non-Patient Prescription Upload Flow — Design Document

## Overview

A new `/upload` route that allows users with a physical prescription to upload it to Felix and receive medication delivery without a treatment assessment. Styled pixel-perfect to felixforyou.ca. Includes a pharmacy dashboard tab for reviewing uploads.

## Page Structure & Navigation

### Route: `/upload`

Full-width web page (not inside iPhone frame) with Felix branding.

**Layout:**
- **Top nav bar**: Felix logo (left), minimal nav links (right). White background, `0.5px` bottom border in `#E2E2E1`.
- **Horizontal progress bar**: Below the nav. Thin bar showing 7 steps as labeled dots connected by a line. Current step dot filled `#DE781F`, completed steps filled with checkmarks, upcoming steps `#E2E2E1` outlines. Step labels below each dot in `#5F5E5A` at 14px.
- **Content area**: Centered column, max-width ~560px, white background, 48px top padding.
- **Continue/Back buttons**: Bottom of content area. "Continue" is primary (`#DE781F` background, white text, 12px border-radius). "Back" is text-only link in `#5F5E5A`.

**Progress bar step labels:**
1. Upload Rx
2. Confirm Details
3. Insurance
4. Delivery
5. Consent
6. Review
7. Submitted

## Patient Flow — 7 Steps

### Step 1: Upload Prescription
- Heading: "Upload your prescription" (`#31302F`, ~24px bold)
- Subtext: "Take a photo of your prescription or upload a file. Make sure all details are clearly visible." (`#5F5E5A`, 16px)
- **Drop zone**: Large dashed border rectangle (`#E2E2E1`, 12px radius). Camera icon + "Drag and drop your file here" + "or" + "browse files" link in `#DE781F`. Accepts JPG, PNG, PDF up to 10MB.
- **"Use sample prescription"**: Small text link below drop zone. Loads pre-made prescription image and pre-fills Step 2 fields. Demo fast-path.
- After upload: Drop zone replaced with image preview (thumbnail, filename, file size, "X" to remove).

### Step 2: Confirm Prescription Details
- Heading: "Confirm your prescription details"
- Subtext: "Our pharmacy team will verify these details match your uploaded prescription"
- Uploaded image thumbnail for reference
- Form fields (Felix input style):
  - Medication name (pre-filled if sample used)
  - Dose
  - Quantity
  - Prescriber name
  - Date written (date picker)

### Step 3: Insurance Details
- Heading: "Insurance information"
- Subtext: "We'll check your insurance coverage and let you know what you'll pay before we fill your prescription"
- Fields: Province (dropdown), Insurance provider (text), Policy/card number, Group number (optional)

### Step 4: Delivery Address
- Heading: "Delivery address"
- Fields: Street address, Unit/Apt (optional), City, Province (dropdown), Postal code
- All pre-filled with mock data for demo

### Step 5: Consent
- Heading: "Review and consent"
- Two checkboxes:
  - "I understand I'll be charged once my prescription is filled and insurance coverage is confirmed"
  - "I consent to pharmacist counseling as required"
- Both required to enable submit button

### Step 6: Review Summary
- Heading: "Review your submission"
- Summary cards showing all entered data in sections: Prescription, Insurance, Delivery
- Each section card has "Edit" link in `#DE781F` that jumps back to that step
- Primary button: "Submit prescription for review"

### Step 7: Confirmation
- Checkmark icon in `#DE781F`
- Heading: "Prescription received. We'll review it and get back to you."
- Subtext: "Our pharmacy team is reviewing your prescription. You'll receive an update within 24 hours."
- Bullet points: "We'll verify your prescription details", "Check your insurance coverage", "Send you the final price before filling"
- CTA: "Got it" — shows demo sidebar controls

## Pharmacy Dashboard — Uploads Tab

### Tab Switcher
Added to top of existing `/pharmacy` page. Two tabs: "Transfers" | "Prescription Uploads". Active tab has bottom border in `#DE781F`.

### Uploads Table Columns
- Patient name
- Uploaded image (40x40 thumbnail, rounded)
- Submitted date/time
- Medication (user-entered)
- Status badge (color-coded pill)

### Status Badges
- Under review — amber
- Awaiting patient response — purple
- Ready to fill — blue
- Filled — green
- Rejected — red

### Detail Panel (right side)
Two sections side-by-side or stacked:

**Left/Top:** Uploaded prescription image, expandable to full size on click. Upload date, file name.

**Right/Bottom:** Patient-entered details card (medication, dose, quantity, prescriber, date written). Insurance info. Delivery address.

### Action Area
- **Status dropdown**: Direct status change
- **Notes field**: Free-text textarea, persists per upload
- **Rejection reason dropdown**: Appears when status → "Rejected". Options: Prescription expired, Prescription illegible, Medication not in formulary, Controlled substance, Missing required information
- **Primary action button** (context-dependent):
  - Under review → "Approve — Ready to Fill"
  - Ready to fill → "Mark as Filled"
  - Any status → "Request Clarification" (secondary, sets Awaiting patient response)

### Timeline
Same `AutomationTimeline` pattern as transfers, showing status changes with timestamps.

## Data Model & API

### New Type: `UploadedPrescription`

```typescript
type UploadStatus = "under_review" | "awaiting_patient" | "ready_to_fill" | "filled" | "rejected"

interface UploadedPrescription {
  id: string
  patientName: string
  patientEmail: string
  imageUrl: string
  uploadedAt: string
  status: UploadStatus
  medicationName: string
  dose: string
  quantity: number
  prescriberName: string
  dateWritten: string
  province: string
  insuranceProvider: string
  insurancePolicyNumber: string
  insuranceGroupNumber: string | null
  deliveryAddress: {
    street: string
    unit: string | null
    city: string
    province: string
    postalCode: string
  }
  pharmacyNotes: string | null
  rejectionReason: string | null
}
```

### Seed Data
2-3 pre-existing uploads: one "under_review", one "awaiting_patient", one "filled".

### API Routes
- **GET `/api/uploads`** — All uploads. Pharmacy dashboard polls this.
- **POST `/api/uploads`** — Create upload. Returns `status: "under_review"`.
- **PATCH `/api/uploads/[id]`** — Update status, notes, rejection reason. Used by pharmacy actions and demo sidebar.

No changes to existing transfer API routes.

### Sample Prescription Image
Static PNG at `/public/sample-prescription.png` — mock prescription matching seed data fields.

## Cross-Page Sync & Demo Controls

### Demo Sidebar on `/upload`
Appears after Step 7 submission. Same style as existing `DemoSidebar` (dark `#31302F` background, white text).

Contents:
- "Demo Controls" heading
- Status dropdown (under_review → awaiting_patient → ready_to_fill → filled → rejected). PATCHes `/api/uploads/[id]`.
- "Open Pharmacy Dashboard →" link (new tab)
- "Start Over" reset button

### Polling
Pharmacy "Prescription Uploads" tab polls `GET /api/uploads` every 3 seconds (same as transfers).

### Demo Flow
1. Open `/upload` on one screen, `/pharmacy` on another
2. Walk through 7-step upload flow
3. Submission appears in pharmacy "Prescription Uploads" tab
4. Advance status via sidebar or pharmacy action buttons
5. Pharmacy dashboard updates on next poll cycle

## Visual Design Tokens

### Font
`"matter", "DM Sans", system-ui, sans-serif`. Load DM Sans from Google Fonts. Attempt Matter from Webflow CDN if extractable.

### Colors
| Token | Value |
|-------|-------|
| Primary/CTA | `#DE781F` |
| Dark brown | `#40231A` |
| Text primary | `#31302F` |
| Text secondary | `#5F5E5A` |
| Text tertiary | `#91908F` |
| Border | `#E2E2E1` |
| Focus ring | `#4d65ff` |
| Background | `#FFFFFF` |

### Inputs
- Border: `0.5px solid #E2E2E1`
- Radius: `12px`
- Padding: `12px`
- Font: `16px`
- Focus: `0.125rem solid #4d65ff`, offset `0.125rem`
- Label: `14px`, `#5F5E5A`, 8px margin-bottom

### Primary Button
- Background: `#DE781F`
- Text: white, `16px`, weight 500
- Radius: `12px`
- Padding: `12px 24px`
- Hover: darken ~10%
- Transition: `0.2s ease-out`

### Progress Bar
- Line: `2px` height, `#E2E2E1`
- Dots: `10px` circles. Completed: `#DE781F` + white checkmark. Current: `#DE781F`. Upcoming: `#E2E2E1` stroke.
- Labels: `14px`. Current/completed: `#31302F`. Upcoming: `#91908F`.

### Cards
- Border: `1px solid #E2E2E1`
- Radius: `16px`
- Padding: `24px`

### Upload Drop Zone
- Border: `2px dashed #E2E2E1`
- Radius: `12px`
- Padding: `48px`
- Hover: border → `#DE781F`
- Drag-over: `rgba(222, 120, 31, 0.05)` background

### Pharmacy Tab Switcher
- Text: `16px`, weight 500
- Active: `#31302F`, `2px` bottom border `#DE781F`
- Inactive: `#91908F`, no border
- Gap: `24px`
