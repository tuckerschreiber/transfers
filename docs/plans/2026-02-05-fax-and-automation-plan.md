# Fax Document & Automated Transfer Pipeline — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a realistic fax document view and automated transfer pipeline to the pharmacy dashboard so transfers auto-advance with timed delays and the pharmacist only needs one final approval click.

**Architecture:** Two new components (FaxDocument, AutomationTimeline) integrate into the existing PrescriptionDetail panel. Auto-advance logic lives in the pharmacy page component using setTimeout chains that PATCH the API. The Pharmacy type gets a `faxNumber` and `phone` field for realism. No new API routes needed.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, Framer Motion, lucide-react

---

### Task 1: Add faxNumber and phone to Pharmacy type and seed data

**Files:**
- Modify: `src/lib/types.ts:8-12`
- Modify: `src/lib/store.ts:3-7`

**Step 1: Update the Pharmacy interface**

In `src/lib/types.ts`, update the Pharmacy interface to add `faxNumber` and `phone`:

```typescript
export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone: string;
  faxNumber: string;
}
```

**Step 2: Update seed pharmacy data**

In `src/lib/store.ts`, add phone and faxNumber to each pharmacy:

```typescript
export const pharmacies: Pharmacy[] = [
  { id: "ph-1", name: "Yonge Drug Mart", address: "2399 Yonge St, Toronto", phone: "(416) 485-7722", faxNumber: "(416) 485-7723" },
  { id: "ph-2", name: "The Village Pharmacy", address: "2518 Yonge St, Toronto", phone: "(416) 489-3301", faxNumber: "(416) 489-3302" },
  { id: "ph-3", name: "Sam's IDA Pharmacy", address: "1920 Yonge St unit 101-Y, Toronto", phone: "(416) 544-8900", faxNumber: "(416) 544-8901" },
];
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Successful build, no type errors.

**Step 4: Commit**

```bash
git add src/lib/types.ts src/lib/store.ts
git commit -m "feat: add phone and faxNumber to Pharmacy type and seed data"
```

---

### Task 2: Create the FaxDocument component

**Files:**
- Create: `src/components/pharmacy/FaxDocument.tsx`

**Step 1: Create the FaxDocument component**

Create `src/components/pharmacy/FaxDocument.tsx` with the following content. This is a styled component that renders a fax-like document with visual artifacts (scan lines, slight rotation, thermal paper appearance).

```tsx
"use client";

import { Prescription, Pharmacy } from "@/lib/types";

interface FaxDocumentProps {
  prescription: Prescription;
  sourcePharmacy: Pharmacy;
  receivedAt: string; // ISO timestamp
}

export default function FaxDocument({ prescription, sourcePharmacy, receivedAt }: FaxDocumentProps) {
  const receivedDate = new Date(receivedAt);
  const dateStr = receivedDate.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const timeStr = receivedDate.toLocaleTimeString("en-CA", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <div className="relative">
      {/* Outer wrapper: slight rotation + shadow for "scanned document" feel */}
      <div
        className="relative bg-white border border-gray-300 shadow-md overflow-hidden"
        style={{ transform: "rotate(-0.4deg)" }}
      >
        {/* Scan line overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-10 opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 1px, #000 1px, #000 2px)",
          }}
        />

        {/* Fax header strip */}
        <div className="bg-gray-100 border-b border-gray-300 px-4 py-1.5 flex justify-between items-center text-[10px] font-mono text-gray-500">
          <span>FAX: {sourcePharmacy.faxNumber}</span>
          <span>{dateStr} {timeStr}</span>
          <span>PAGE 1 OF 1</span>
        </div>

        {/* Document body */}
        <div className="px-6 py-5 space-y-4 font-serif text-gray-800 text-sm">
          {/* Source pharmacy letterhead */}
          <div className="text-center border-b border-gray-200 pb-3">
            <p className="text-base font-bold uppercase tracking-wide">{sourcePharmacy.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">{sourcePharmacy.address}</p>
            <p className="text-xs text-gray-500">Tel: {sourcePharmacy.phone} &bull; Fax: {sourcePharmacy.faxNumber}</p>
          </div>

          {/* Title */}
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-widest border border-gray-400 inline-block px-4 py-1">
              Prescription Transfer
            </p>
          </div>

          {/* To / From */}
          <div className="grid grid-cols-2 gap-4 text-xs border-b border-gray-200 pb-3">
            <div>
              <p className="text-gray-400 uppercase text-[10px] mb-0.5">To</p>
              <p className="font-semibold">Felix Health Pharmacy</p>
              <p className="text-gray-500">Fax: (416) 555-0100</p>
            </div>
            <div>
              <p className="text-gray-400 uppercase text-[10px] mb-0.5">From</p>
              <p className="font-semibold">{sourcePharmacy.name}</p>
              <p className="text-gray-500">Fax: {sourcePharmacy.faxNumber}</p>
            </div>
          </div>

          {/* Patient info */}
          <div>
            <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">Patient Information</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              <div>
                <span className="text-gray-400">Name: </span>
                <span className="font-medium">{prescription.patientName}</span>
              </div>
              <div>
                <span className="text-gray-400">DOB: </span>
                <span className="font-medium">{prescription.patientDob}</span>
              </div>
            </div>
          </div>

          {/* Prescription details */}
          <div>
            <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">Prescription Details</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              <div>
                <span className="text-gray-400">Drug: </span>
                <span className="font-medium">{prescription.drugName}</span>
              </div>
              <div>
                <span className="text-gray-400">DIN: </span>
                <span className="font-medium">{prescription.din}</span>
              </div>
              <div>
                <span className="text-gray-400">Dosage: </span>
                <span className="font-medium">{prescription.dosage}</span>
              </div>
              <div>
                <span className="text-gray-400">Quantity: </span>
                <span className="font-medium">{prescription.quantity}</span>
              </div>
              <div>
                <span className="text-gray-400">Refills: </span>
                <span className="font-medium">{prescription.refillsRemaining}</span>
              </div>
              <div>
                <span className="text-gray-400">Prescriber: </span>
                <span className="font-medium">{prescription.prescribingDoctor}</span>
              </div>
            </div>
          </div>

          {/* Signature */}
          <div className="border-t border-gray-200 pt-3 mt-4">
            <div className="flex justify-between items-end text-xs">
              <div>
                <p className="text-gray-400 text-[10px] uppercase">Authorized by</p>
                <p className="font-medium italic mt-1" style={{ fontFamily: "cursive" }}>
                  R. Patel, RPh
                </p>
                <div className="w-36 border-b border-gray-400 mt-1" />
                <p className="text-[10px] text-gray-400 mt-0.5">Pharmacist Signature</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-[10px] uppercase">Date</p>
                <p className="font-medium mt-1">{dateStr}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom edge noise */}
        <div className="h-2 bg-gradient-to-b from-gray-50 to-gray-200 opacity-40" />
      </div>
    </div>
  );
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Successful build. Component isn't rendered yet but should compile.

**Step 3: Commit**

```bash
git add src/components/pharmacy/FaxDocument.tsx
git commit -m "feat: add FaxDocument component with fax-styled prescription view"
```

---

### Task 3: Create the AutomationTimeline component

**Files:**
- Create: `src/components/pharmacy/AutomationTimeline.tsx`

**Step 1: Create the AutomationTimeline component**

Create `src/components/pharmacy/AutomationTimeline.tsx`. This shows a vertical activity log of automated steps with timestamps and status badges.

```tsx
"use client";

import { TransferStatus } from "@/lib/types";
import { motion } from "framer-motion";
import { Bot, Send, FileText, CheckCircle } from "lucide-react";

interface AutomationStep {
  label: string;
  badge: string;
  icon: React.ElementType;
  completedAt?: string; // ISO timestamp, undefined if not yet completed
}

const AUTOMATION_STEPS: {
  status: TransferStatus;
  label: string;
  badge: string;
  icon: React.ElementType;
}[] = [
  { status: "reviewed", label: "Prescription verified", badge: "AI Auto-Review", icon: Bot },
  { status: "requested", label: "Transfer fax sent", badge: "Auto-Fax Sent", icon: Send },
  { status: "transferred", label: "Incoming fax received", badge: "Fax Received", icon: FileText },
  { status: "completed", label: "Approved & dispensing", badge: "Pharmacist Approved", icon: CheckCircle },
];

const STATUS_ORDER: TransferStatus[] = ["submitted", "reviewed", "requested", "transferred", "completed"];

function statusIndex(s: TransferStatus): number {
  return STATUS_ORDER.indexOf(s);
}

interface AutomationTimelineProps {
  currentStatus: TransferStatus;
  automationLog: Record<string, string>; // status -> ISO timestamp
}

export default function AutomationTimeline({ currentStatus, automationLog }: AutomationTimelineProps) {
  const currentIdx = statusIndex(currentStatus);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
        Processing Activity
      </h4>
      <div className="space-y-2">
        {AUTOMATION_STEPS.map((step, i) => {
          const stepIdx = statusIndex(step.status);
          const isCompleted = currentIdx >= stepIdx;
          const isCurrent = currentIdx === stepIdx - 1;
          const Icon = step.icon;
          const timestamp = automationLog[step.status];

          return (
            <motion.div
              key={step.status}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex items-center gap-3 py-1.5 px-2 rounded-lg text-xs ${
                isCompleted
                  ? "text-gray-900"
                  : isCurrent
                  ? "text-amber-600 bg-amber-50"
                  : "text-gray-300"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 ${isCompleted ? "text-emerald-500" : isCurrent ? "text-amber-500" : "text-gray-300"}`} />
              <span className="flex-1 font-medium">{step.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                  isCompleted
                    ? "bg-emerald-50 text-emerald-600"
                    : isCurrent
                    ? "bg-amber-50 text-amber-600"
                    : "bg-gray-50 text-gray-300"
                }`}
              >
                {step.badge}
              </span>
              <span className="w-16 text-right text-[10px] text-gray-400 font-mono tabular-nums">
                {isCompleted && timestamp
                  ? new Date(timestamp).toLocaleTimeString("en-CA", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })
                  : isCurrent
                  ? "..."
                  : "—"}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Successful build.

**Step 3: Commit**

```bash
git add src/components/pharmacy/AutomationTimeline.tsx
git commit -m "feat: add AutomationTimeline component for processing activity log"
```

---

### Task 4: Update PrescriptionDetail to integrate FaxDocument and AutomationTimeline

**Files:**
- Modify: `src/components/pharmacy/PrescriptionDetail.tsx`

**Step 1: Rewrite PrescriptionDetail**

Replace the entire contents of `src/components/pharmacy/PrescriptionDetail.tsx` with the version below. Key changes:
- When status is "transferred" or "completed", show FaxDocument instead of the plain grid
- Always show AutomationTimeline below
- Replace multi-step buttons with single "Approve & Dispense" at "transferred" status
- Add `automationLog` prop to pass timestamps

```tsx
"use client";

import { Transfer, Prescription, Pharmacy, TransferStatus } from "@/lib/types";
import FaxDocument from "./FaxDocument";
import AutomationTimeline from "./AutomationTimeline";

interface PrescriptionDetailProps {
  transfer: Transfer;
  prescription: Prescription;
  pharmacy: Pharmacy;
  automationLog: Record<string, string>;
  onAdvanceStatus: (transferId: string, newStatus: TransferStatus) => void;
}

export default function PrescriptionDetail({
  transfer,
  prescription,
  pharmacy,
  automationLog,
  onAdvanceStatus,
}: PrescriptionDetailProps) {
  const showFax = transfer.status === "transferred" || transfer.status === "completed";

  return (
    <div className="space-y-4">
      {/* Fax document or plain prescription detail */}
      {showFax ? (
        <FaxDocument
          prescription={prescription}
          sourcePharmacy={pharmacy}
          receivedAt={automationLog["transferred"] || transfer.createdAt}
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold text-lg text-gray-900 mb-4">Prescription Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Drug Name</span>
              <p className="font-medium text-gray-900">{prescription.drugName}</p>
            </div>
            <div>
              <span className="text-gray-400">DIN</span>
              <p className="font-medium text-gray-900">{prescription.din}</p>
            </div>
            <div>
              <span className="text-gray-400">Dosage</span>
              <p className="font-medium text-gray-900">{prescription.dosage}</p>
            </div>
            <div>
              <span className="text-gray-400">Quantity</span>
              <p className="font-medium text-gray-900">{prescription.quantity}</p>
            </div>
            <div>
              <span className="text-gray-400">Refills Remaining</span>
              <p className="font-medium text-gray-900">{prescription.refillsRemaining}</p>
            </div>
            <div>
              <span className="text-gray-400">Prescribing Doctor</span>
              <p className="font-medium text-gray-900">{prescription.prescribingDoctor}</p>
            </div>
            <div>
              <span className="text-gray-400">Patient</span>
              <p className="font-medium text-gray-900">{prescription.patientName}</p>
            </div>
            <div>
              <span className="text-gray-400">Date of Birth</span>
              <p className="font-medium text-gray-900">{prescription.patientDob}</p>
            </div>
            <div>
              <span className="text-gray-400">Source Pharmacy</span>
              <p className="font-medium text-gray-900">{pharmacy.name}</p>
            </div>
            <div>
              <span className="text-gray-400">Pharmacy Address</span>
              <p className="font-medium text-gray-900">{pharmacy.address}</p>
            </div>
          </div>
        </div>
      )}

      {/* Automation timeline */}
      <AutomationTimeline
        currentStatus={transfer.status}
        automationLog={automationLog}
      />

      {/* Action button: only at "transferred" status */}
      {transfer.status === "transferred" && (
        <button
          onClick={() => onAdvanceStatus(transfer.id, "completed")}
          className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold text-sm hover:bg-emerald-700 transition-colors"
        >
          Approve &amp; Dispense
        </button>
      )}

      {transfer.status === "completed" && (
        <div className="text-center text-sm text-emerald-600 font-medium py-2">
          Transfer completed &amp; approved
        </div>
      )}
    </div>
  );
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build will fail because `pharmacy/page.tsx` doesn't pass the new `automationLog` prop yet. That's expected — we'll fix it in Task 5.

**Step 3: Commit**

```bash
git add src/components/pharmacy/PrescriptionDetail.tsx
git commit -m "feat: integrate FaxDocument and AutomationTimeline into PrescriptionDetail"
```

---

### Task 5: Add auto-advance logic and automationLog state to pharmacy page

**Files:**
- Modify: `src/app/pharmacy/page.tsx`

**Step 1: Rewrite the pharmacy page**

Replace the entire contents of `src/app/pharmacy/page.tsx` with the version below. Key changes:
- Add `automationLogs` state: `Record<string, Record<string, string>>` mapping transfer ID to status→timestamp log
- Add `useEffect` that watches for transfers in "submitted" status and auto-advances them through the pipeline with setTimeout delays (2s → 3s → 5s)
- Pass `automationLog` to PrescriptionDetail
- Use `useRef` to track which transfers are already being auto-advanced (avoid duplicate chains)

```tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import TransferTable from "@/components/pharmacy/TransferTable";
import PrescriptionDetail from "@/components/pharmacy/PrescriptionDetail";
import Toast from "@/components/Toast";
import { Transfer, Prescription, Pharmacy, TransferStatus } from "@/lib/types";

interface TransferRow {
  transfer: Transfer;
  prescription: Prescription;
  pharmacy: Pharmacy;
}

const AUTO_ADVANCE_STEPS: { from: TransferStatus; to: TransferStatus; delay: number }[] = [
  { from: "submitted", to: "reviewed", delay: 2000 },
  { from: "reviewed", to: "requested", delay: 3000 },
  { from: "requested", to: "transferred", delay: 5000 },
];

export default function PharmacyDashboard() {
  const [rows, setRows] = useState<TransferRow[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [automationLogs, setAutomationLogs] = useState<Record<string, Record<string, string>>>({});
  const autoAdvancingRef = useRef<Set<string>>(new Set());

  const fetchData = useCallback(async () => {
    const [transfers, pharmacies] = await Promise.all([
      fetch("/api/transfers").then((r) => r.json()),
      fetch("/api/pharmacies").then((r) => r.json()),
    ]);

    const pharmacyMap = Object.fromEntries(pharmacies.map((p: Pharmacy) => [p.id, p]));

    const enriched: TransferRow[] = await Promise.all(
      transfers.map(async (t: Transfer) => {
        const prescription = await fetch(`/api/prescriptions/${t.prescriptionId}`).then((r) => r.json());
        return { transfer: t, prescription, pharmacy: pharmacyMap[t.sourcePharmacyId] };
      })
    );

    setRows(enriched);
  }, []);

  // Poll every 3 seconds
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Auto-advance transfers that are in "submitted" status
  useEffect(() => {
    rows.forEach((row) => {
      const { transfer } = row;
      if (transfer.status === "submitted" && !autoAdvancingRef.current.has(transfer.id)) {
        autoAdvancingRef.current.add(transfer.id);
        runAutoAdvance(transfer.id);
      }
    });
  }, [rows]);

  const runAutoAdvance = async (transferId: string) => {
    let cumulativeDelay = 0;

    for (const step of AUTO_ADVANCE_STEPS) {
      cumulativeDelay += step.delay;
      await new Promise((resolve) => setTimeout(resolve, step.delay));

      // PATCH status
      await fetch(`/api/transfers/${transferId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: step.to }),
      });

      // Log timestamp
      setAutomationLogs((prev) => ({
        ...prev,
        [transferId]: {
          ...(prev[transferId] || {}),
          [step.to]: new Date().toISOString(),
        },
      }));

      // Show toast
      const labels: Record<string, string> = {
        reviewed: "AI Auto-Review complete",
        requested: "Transfer fax sent",
        transferred: "Incoming fax received",
      };
      setToastMessage(labels[step.to] || `Status: ${step.to}`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);

      // Refresh data
      await fetchData();
    }
  };

  const handleAdvanceStatus = async (transferId: string, newStatus: TransferStatus) => {
    await fetch(`/api/transfers/${transferId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    // Log timestamp for manual steps
    setAutomationLogs((prev) => ({
      ...prev,
      [transferId]: {
        ...(prev[transferId] || {}),
        [newStatus]: new Date().toISOString(),
      },
    }));

    fetchData();

    const statusLabel = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
    setToastMessage(`Status updated to ${statusLabel}`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const selectedRow = rows.find((r) => r.transfer.id === selectedId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900">Pharmacy Dashboard</h1>
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
          &larr; Patient Demo
        </Link>
      </div>

      <div className="p-8 flex gap-8">
        {/* Table */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <TransferTable rows={rows} selectedId={selectedId} onSelect={setSelectedId} />
        </div>

        {/* Detail panel */}
        {selectedRow && (
          <div className="w-[400px] shrink-0">
            <PrescriptionDetail
              transfer={selectedRow.transfer}
              prescription={selectedRow.prescription}
              pharmacy={selectedRow.pharmacy}
              automationLog={automationLogs[selectedRow.transfer.id] || {}}
              onAdvanceStatus={handleAdvanceStatus}
            />
          </div>
        )}
      </div>

      <Toast message={toastMessage} isVisible={showToast} />
    </div>
  );
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Successful build.

**Step 3: Verify dev server**

Run: `npm run dev`
Open `http://localhost:3000/pharmacy` in the browser. The tx-2 transfer (status "submitted") should auto-advance through reviewed → requested → transferred with timed delays. The tx-1 transfer (status "requested") should also auto-advance once the dashboard detects it's not yet fully advanced (but since it starts at "requested", it won't re-trigger the full chain — the auto-advance only triggers on "submitted" status).

**Step 4: Commit**

```bash
git add src/app/pharmacy/page.tsx
git commit -m "feat: add auto-advance pipeline and automationLog state to pharmacy dashboard"
```

---

### Task 6: Add automation indicator badges to TransferTable

**Files:**
- Modify: `src/components/pharmacy/TransferTable.tsx`

**Step 1: Update TransferTable to show automation badges**

In `src/components/pharmacy/TransferTable.tsx`, add a small "Automated" badge next to the status badge for transfers that aren't in "submitted" or "completed" status (meaning they were auto-advanced).

Replace the status `<td>` cell (lines 49-53) with:

```tsx
<td className="py-3 px-4">
  <div className="flex items-center gap-1.5">
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[transfer.status]}`}>
      {transfer.status}
    </span>
    {transfer.status !== "submitted" && transfer.status !== "completed" && (
      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-violet-50 text-violet-600">
        Auto
      </span>
    )}
  </div>
</td>
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Successful build.

**Step 3: Commit**

```bash
git add src/components/pharmacy/TransferTable.tsx
git commit -m "feat: add automation indicator badges to TransferTable status column"
```

---

### Task 7: Visual QA and final verification

**Step 1: Run the full build**

Run: `npm run build`
Expected: Clean build with no errors or warnings.

**Step 2: Run lint**

Run: `npm run lint`
Expected: No lint errors.

**Step 3: Manual QA checklist**

Start the dev server (`npm run dev`) and verify:

1. **Pharmacy dashboard (`/pharmacy`):**
   - [ ] tx-2 (submitted) auto-advances: submitted → reviewed (2s) → requested (3s) → transferred (5s)
   - [ ] Toast notifications appear for each auto-advance step
   - [ ] Selecting tx-2 after it reaches "transferred" shows the FaxDocument
   - [ ] FaxDocument has: fax header strip, letterhead, prescription details, signature, scan line artifacts
   - [ ] AutomationTimeline shows below with timestamps and green checkmarks for completed steps
   - [ ] "Approve & Dispense" button appears at "transferred" status
   - [ ] Clicking "Approve & Dispense" advances to "completed"
   - [ ] "Auto" badges appear in the table next to status for in-progress statuses
   - [ ] tx-1 (starts at "requested") doesn't trigger auto-advance (only "submitted" triggers it)

2. **Patient demo (`/`):**
   - [ ] Patient-side screens still work normally
   - [ ] DemoSidebar tracker controls still work
   - [ ] Tracker progress reflects status changes made by pharmacy auto-advance

**Step 4: Final commit**

If any fixes were needed during QA, commit them:

```bash
git add -A
git commit -m "fix: visual QA fixes for fax document and automation pipeline"
```
