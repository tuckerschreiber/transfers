# Fax Document & Automated Transfer Pipeline

## Goal

Make the pharmacy dashboard feel realistic by showing incoming prescription faxes and automating the transfer intake process so pharmacists only need to do a final approval.

## Fax Document Component

When a transfer reaches "transferred" status, the pharmacy detail panel shows a styled fax document containing:

- **Fax header strip**: date/time received, source pharmacy fax number, "PAGE 1 OF 1"
- **Source pharmacy letterhead**: name, address, phone
- **"PRESCRIPTION TRANSFER" title**
- **Patient info**: name, DOB
- **Prescription details**: drug, DIN, dosage, quantity, refills, prescribing doctor
- **Signature line**: "Authorized by: [pharmacist name]"
- **Visual artifacts**: slight rotation (~0.5deg), subtle scan lines or grain to feel like a real fax scan

The fax document appears in place of the plain prescription detail view once the transfer reaches "transferred" or "completed" status.

## Automated Transfer Pipeline

Transfers auto-advance through statuses with timed delays when the pharmacy dashboard is open. The pharmacist only manually approves the final step.

### Flow

| Step | From | To | Delay | Badge | What "happens" |
|------|------|----|-------|-------|-----------------|
| 1 | submitted | reviewed | ~2s | AI Auto-Review | System verifies patient info and prescription validity |
| 2 | reviewed | requested | ~3s | Auto-Fax Sent | System sends transfer request fax to source pharmacy |
| 3 | requested | transferred | ~5s | Fax Received | Incoming fax received and parsed, fax document appears |
| 4 | transferred | completed | Manual | Approve & Dispense | Pharmacist reviews fax, clicks to approve |

### Automation Timeline

A small activity log in the detail panel shows each automated step with a timestamp and badge:

```
AI Auto-Review       2:34:01 PM  ✓
Auto-Fax Sent        2:34:04 PM  ✓
Fax Received         2:34:09 PM  ✓
Awaiting Approval    —
```

### Auto-Advance Mechanics

- Client-side logic (setTimeout + PATCH calls to `/api/transfers/[id]`)
- Triggers when pharmacy dashboard is open and a transfer is in "submitted" status
- Each step fires a PATCH to update status, which the polling picks up
- DemoSidebar controls still work as manual overrides

## Changes

### New Components

1. **`src/components/pharmacy/FaxDocument.tsx`** — Fax-styled prescription document with scan artifacts
2. **`src/components/pharmacy/AutomationTimeline.tsx`** — Activity log showing automated step history with badges

### Modified Components

3. **`src/components/pharmacy/PrescriptionDetail.tsx`** — Integrate FaxDocument and AutomationTimeline. Replace multi-step manual buttons with single "Approve & Dispense" at final stage.
4. **`src/components/pharmacy/TransferTable.tsx`** — Add "Automated" indicator badges next to status badges.
5. **`src/app/pharmacy/page.tsx`** — Add auto-advance logic (setTimeout chain that PATCHes transfer status).

### Unchanged

- Patient-side components (HomeScreen, TransferModal, TrackerCard)
- DemoSidebar (still works as override)
- API routes (still just PATCH status)
- Data model / types
