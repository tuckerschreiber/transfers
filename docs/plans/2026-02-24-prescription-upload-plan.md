# Prescription Upload Flow — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a `/upload` route for prescription image upload with a 7-step wizard styled like felixforyou.ca, plus a "Prescription Uploads" tab on the pharmacy dashboard.

**Architecture:** New `/upload` page with multi-step form wizard (client-side state, no routing per step). New `UploadedPrescription` type and in-memory store array. New API routes (`/api/uploads`, `/api/uploads/[id]`). Pharmacy dashboard gets tab switcher, uploads table, and upload detail panel. Cross-page sync via 3-second polling.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Framer Motion, lucide-react. DM Sans from Google Fonts (Matter substitute).

---

### Task 1: Add DM Sans Font and Felix Design Tokens

**Files:**
- Modify: `src/app/globals.css`

**Step 1: Add DM Sans import and Felix CSS custom properties**

In `src/app/globals.css`, add DM Sans to the existing Google Fonts import and add Felix design tokens as CSS custom properties:

```css
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');

@import "tailwindcss";

body {
  font-family: 'Inter', system-ui, sans-serif;
}

/* Felix design tokens */
:root {
  --felix-primary: #DE781F;
  --felix-primary-hover: #c86a1a;
  --felix-dark-brown: #40231A;
  --felix-text-primary: #31302F;
  --felix-text-secondary: #5F5E5A;
  --felix-text-tertiary: #91908F;
  --felix-border: #E2E2E1;
  --felix-focus: #4d65ff;
  --felix-bg: #FFFFFF;
}

.felix-page {
  font-family: 'DM Sans', system-ui, sans-serif;
  color: var(--felix-text-primary);
  background: var(--felix-bg);
  -webkit-font-smoothing: antialiased;
}
```

**Step 2: Verify dev server runs**

Run: `npm run dev`
Expected: No errors. Existing pages unchanged.

**Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add DM Sans font and Felix design tokens"
```

---

### Task 2: Add Upload Types and Seed Data

**Files:**
- Modify: `src/lib/types.ts`
- Modify: `src/lib/store.ts`

**Step 1: Add UploadStatus and UploadedPrescription types**

Append to `src/lib/types.ts`:

```typescript
export type UploadStatus =
  | "under_review"
  | "awaiting_patient"
  | "ready_to_fill"
  | "filled"
  | "rejected";

export interface DeliveryAddress {
  street: string;
  unit: string | null;
  city: string;
  province: string;
  postalCode: string;
}

export interface UploadedPrescription {
  id: string;
  patientName: string;
  patientEmail: string;
  imageUrl: string;
  uploadedAt: string;
  status: UploadStatus;
  medicationName: string;
  dose: string;
  quantity: number;
  prescriberName: string;
  dateWritten: string;
  province: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  insuranceGroupNumber: string | null;
  deliveryAddress: DeliveryAddress;
  pharmacyNotes: string | null;
  rejectionReason: string | null;
}
```

**Step 2: Add seed data and ID helper**

Append to `src/lib/store.ts`:

```typescript
import { Pharmacy, Prescription, Transfer, UploadedPrescription } from "./types";

// ... existing code ...

export const uploadedPrescriptions: UploadedPrescription[] = [
  {
    id: "up-1",
    patientName: "Jordan Lee",
    patientEmail: "jordan.lee@email.com",
    imageUrl: "/sample-prescription.png",
    uploadedAt: "2026-02-23T09:15:00Z",
    status: "under_review",
    medicationName: "Sertraline",
    dose: "50mg once daily",
    quantity: 30,
    prescriberName: "Dr. Emily Watson",
    dateWritten: "2026-02-20",
    province: "Ontario",
    insuranceProvider: "Sun Life",
    insurancePolicyNumber: "SL-2847561",
    insuranceGroupNumber: "GRP-104",
    deliveryAddress: {
      street: "45 King St W",
      unit: "Suite 1200",
      city: "Toronto",
      province: "Ontario",
      postalCode: "M5H 1J8",
    },
    pharmacyNotes: null,
    rejectionReason: null,
  },
  {
    id: "up-2",
    patientName: "Sam Patel",
    patientEmail: "sam.patel@email.com",
    imageUrl: "/sample-prescription.png",
    uploadedAt: "2026-02-22T14:30:00Z",
    status: "awaiting_patient",
    medicationName: "Atorvastatin",
    dose: "20mg once daily",
    quantity: 90,
    prescriberName: "Dr. Michael Chang",
    dateWritten: "2026-02-18",
    province: "British Columbia",
    insuranceProvider: "Manulife",
    insurancePolicyNumber: "ML-9382014",
    insuranceGroupNumber: null,
    deliveryAddress: {
      street: "1055 W Georgia St",
      unit: null,
      city: "Vancouver",
      province: "British Columbia",
      postalCode: "V6E 3P3",
    },
    pharmacyNotes: "Requested clarification on dose — patient's previous Rx was 10mg",
    rejectionReason: null,
  },
  {
    id: "up-3",
    patientName: "Taylor Kim",
    patientEmail: "taylor.kim@email.com",
    imageUrl: "/sample-prescription.png",
    uploadedAt: "2026-02-20T11:00:00Z",
    status: "filled",
    medicationName: "Pantoprazole",
    dose: "40mg once daily",
    quantity: 30,
    prescriberName: "Dr. Sarah Chen",
    dateWritten: "2026-02-15",
    province: "Ontario",
    insuranceProvider: "Great-West Life",
    insurancePolicyNumber: "GW-5519283",
    insuranceGroupNumber: "GRP-208",
    deliveryAddress: {
      street: "200 Bay St",
      unit: "Apt 3405",
      city: "Toronto",
      province: "Ontario",
      postalCode: "M5J 2J5",
    },
    pharmacyNotes: "Insurance verified. Co-pay $8.50. Filled and shipped.",
    rejectionReason: null,
  },
];

let uploadCounter = uploadedPrescriptions.length;
export function nextUploadId() {
  return `up-${++uploadCounter}`;
}
```

Update the import line at the top of `store.ts` to include `UploadedPrescription`.

**Step 3: Verify build**

Run: `npm run build`
Expected: No TypeScript errors.

**Step 4: Commit**

```bash
git add src/lib/types.ts src/lib/store.ts
git commit -m "feat: add UploadedPrescription type and seed data"
```

---

### Task 3: Add Upload API Routes

**Files:**
- Create: `src/app/api/uploads/route.ts`
- Create: `src/app/api/uploads/[id]/route.ts`

**Step 1: Create GET and POST handler**

Create `src/app/api/uploads/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { uploadedPrescriptions, nextUploadId } from "@/lib/store";

export async function GET() {
  return NextResponse.json(uploadedPrescriptions);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const newUpload = {
    id: nextUploadId(),
    patientName: body.patientName,
    patientEmail: body.patientEmail,
    imageUrl: body.imageUrl || "/sample-prescription.png",
    uploadedAt: new Date().toISOString(),
    status: "under_review" as const,
    medicationName: body.medicationName,
    dose: body.dose,
    quantity: body.quantity,
    prescriberName: body.prescriberName,
    dateWritten: body.dateWritten,
    province: body.province,
    insuranceProvider: body.insuranceProvider,
    insurancePolicyNumber: body.insurancePolicyNumber,
    insuranceGroupNumber: body.insuranceGroupNumber || null,
    deliveryAddress: body.deliveryAddress,
    pharmacyNotes: null,
    rejectionReason: null,
  };

  uploadedPrescriptions.push(newUpload);
  return NextResponse.json(newUpload, { status: 201 });
}
```

**Step 2: Create PATCH handler**

Create `src/app/api/uploads/[id]/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { uploadedPrescriptions } from "@/lib/store";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const upload = uploadedPrescriptions.find((u) => u.id === id);

  if (!upload) {
    return NextResponse.json({ error: "Upload not found" }, { status: 404 });
  }

  if (body.status) upload.status = body.status;
  if (body.pharmacyNotes !== undefined) upload.pharmacyNotes = body.pharmacyNotes;
  if (body.rejectionReason !== undefined) upload.rejectionReason = body.rejectionReason;

  return NextResponse.json(upload);
}
```

**Step 3: Verify build**

Run: `npm run build`
Expected: No errors.

**Step 4: Manual API test**

Run dev server, then:
```bash
curl http://localhost:3000/api/uploads | jq '.[0].id'
```
Expected: `"up-1"`

**Step 5: Commit**

```bash
git add src/app/api/uploads/
git commit -m "feat: add uploads API routes (GET, POST, PATCH)"
```

---

### Task 4: Create Sample Prescription Image

**Files:**
- Create: `public/sample-prescription.png`

**Step 1: Generate a sample prescription image**

Create a simple SVG-based prescription image rendered to PNG, or use a placeholder. For the demo, create an SVG file at `public/sample-prescription.svg` that looks like a realistic prescription form:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
  <rect width="600" height="800" fill="white" stroke="#E2E2E1" stroke-width="2"/>
  <!-- Header -->
  <text x="300" y="50" text-anchor="middle" font-family="serif" font-size="24" font-weight="bold" fill="#31302F">Dr. Emily Watson, MD</text>
  <text x="300" y="75" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#5F5E5A">123 Medical Centre Dr, Toronto, ON M5G 1X5</text>
  <text x="300" y="92" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#5F5E5A">Tel: (416) 555-0123 | Fax: (416) 555-0124</text>
  <line x1="40" y1="110" x2="560" y2="110" stroke="#E2E2E1" stroke-width="1"/>
  <!-- Rx symbol -->
  <text x="50" y="170" font-family="serif" font-size="48" font-weight="bold" fill="#DE781F">℞</text>
  <!-- Patient info -->
  <text x="120" y="145" font-family="sans-serif" font-size="14" fill="#5F5E5A">Patient:</text>
  <text x="120" y="165" font-family="sans-serif" font-size="16" font-weight="bold" fill="#31302F">Jordan Lee</text>
  <text x="350" y="145" font-family="sans-serif" font-size="14" fill="#5F5E5A">Date:</text>
  <text x="350" y="165" font-family="sans-serif" font-size="16" font-weight="bold" fill="#31302F">February 20, 2026</text>
  <line x1="40" y1="185" x2="560" y2="185" stroke="#E2E2E1" stroke-width="1"/>
  <!-- Prescription -->
  <text x="60" y="230" font-family="sans-serif" font-size="18" font-weight="bold" fill="#31302F">Sertraline 50mg tablets</text>
  <text x="60" y="260" font-family="sans-serif" font-size="14" fill="#5F5E5A">Sig: Take one tablet by mouth once daily</text>
  <text x="60" y="285" font-family="sans-serif" font-size="14" fill="#5F5E5A">Qty: 30 (thirty)</text>
  <text x="60" y="310" font-family="sans-serif" font-size="14" fill="#5F5E5A">Refills: 3 (three)</text>
  <!-- Signature -->
  <line x1="60" y1="420" x2="280" y2="420" stroke="#31302F" stroke-width="1"/>
  <text x="60" y="445" font-family="sans-serif" font-size="12" fill="#5F5E5A">Prescriber Signature</text>
  <text x="60" y="410" font-family="cursive" font-size="24" fill="#31302F">E. Watson</text>
  <!-- License -->
  <text x="350" y="445" font-family="sans-serif" font-size="12" fill="#5F5E5A">CPSO# 87654</text>
</svg>
```

Also set `imageUrl` in seed data to `/sample-prescription.svg`.

**Step 2: Update seed data imageUrl**

In `src/lib/store.ts`, change all `imageUrl: "/sample-prescription.png"` to `imageUrl: "/sample-prescription.svg"`.

**Step 3: Verify image loads**

Run dev server, visit `http://localhost:3000/sample-prescription.svg`
Expected: Prescription image renders in browser.

**Step 4: Commit**

```bash
git add public/sample-prescription.svg src/lib/store.ts
git commit -m "feat: add sample prescription SVG image"
```

---

### Task 5: Create Upload Page Shell with Progress Bar

**Files:**
- Create: `src/app/upload/page.tsx`
- Create: `src/components/upload/ProgressBar.tsx`

**Step 1: Create the ProgressBar component**

Create `src/components/upload/ProgressBar.tsx`:

```typescript
"use client";

import { Check } from "lucide-react";

const STEPS = [
  "Upload Rx",
  "Confirm Details",
  "Insurance",
  "Delivery",
  "Consent",
  "Review",
  "Submitted",
];

interface ProgressBarProps {
  currentStep: number; // 0-indexed
}

export default function ProgressBar({ currentStep }: ProgressBarProps) {
  return (
    <div className="w-full py-6 px-8">
      <div className="max-w-3xl mx-auto flex items-center">
        {STEPS.map((label, i) => {
          const isCompleted = i < currentStep;
          const isCurrent = i === currentStep;
          const isUpcoming = i > currentStep;

          return (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              {/* Step dot + label */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-[10px] h-[10px] rounded-full flex items-center justify-center transition-colors duration-200 ${
                    isCompleted
                      ? "bg-[var(--felix-primary)]"
                      : isCurrent
                      ? "bg-[var(--felix-primary)]"
                      : "border-[1.5px] border-[var(--felix-border)] bg-white"
                  }`}
                >
                  {isCompleted && (
                    <Check className="w-[6px] h-[6px] text-white" strokeWidth={3} />
                  )}
                </div>
                <span
                  className={`text-[14px] mt-2 whitespace-nowrap transition-colors duration-200 ${
                    isCompleted || isCurrent
                      ? "text-[var(--felix-text-primary)] font-medium"
                      : "text-[var(--felix-text-tertiary)]"
                  }`}
                >
                  {label}
                </span>
              </div>

              {/* Connecting line */}
              {i < STEPS.length - 1 && (
                <div
                  className={`h-[2px] flex-1 mx-2 transition-colors duration-200 ${
                    i < currentStep
                      ? "bg-[var(--felix-primary)]"
                      : "bg-[var(--felix-border)]"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

**Step 2: Create the upload page shell**

Create `src/app/upload/page.tsx`:

```typescript
"use client";

import { useState } from "react";
import Link from "next/link";
import ProgressBar from "@/components/upload/ProgressBar";

export default function UploadPage() {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="felix-page min-h-screen flex flex-col">
      {/* Top nav */}
      <nav className="bg-white border-b" style={{ borderColor: "var(--felix-border)", borderWidth: "0.5px" }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-[20px] font-bold" style={{ color: "var(--felix-primary)" }}>
            felix
          </Link>
          <Link
            href="/pharmacy"
            className="text-[14px] transition-colors hover:underline"
            style={{ color: "var(--felix-text-secondary)" }}
          >
            Pharmacy Dashboard
          </Link>
        </div>
      </nav>

      {/* Progress bar */}
      <div className="bg-white border-b" style={{ borderColor: "var(--felix-border)", borderWidth: "0.5px" }}>
        <ProgressBar currentStep={currentStep} />
      </div>

      {/* Content area */}
      <div className="flex-1 flex justify-center pt-12 pb-24 px-6">
        <div className="w-full max-w-[560px]">
          {/* Step content will go here in subsequent tasks */}
          <div className="text-center text-[var(--felix-text-tertiary)]">
            Step {currentStep + 1} of 7
          </div>
        </div>
      </div>

      {/* Bottom buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t" style={{ borderColor: "var(--felix-border)", borderWidth: "0.5px" }}>
        <div className="max-w-[560px] mx-auto px-6 py-4 flex items-center justify-between">
          {currentStep > 0 ? (
            <button
              onClick={() => setCurrentStep((s) => s - 1)}
              className="text-[16px] transition-colors hover:underline"
              style={{ color: "var(--felix-text-secondary)" }}
            >
              Back
            </button>
          ) : (
            <div />
          )}
          {currentStep < 6 && (
            <button
              onClick={() => setCurrentStep((s) => s + 1)}
              className="px-6 py-3 rounded-[12px] text-[16px] font-medium text-white transition-colors"
              style={{ backgroundColor: "var(--felix-primary)" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--felix-primary-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--felix-primary)")}
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
```

**Step 3: Verify page renders**

Run dev server, visit `http://localhost:3000/upload`
Expected: Felix-styled page with progress bar, step counter, and Continue/Back buttons. Clicking Continue/Back advances/retreats the progress dots.

**Step 4: Commit**

```bash
git add src/app/upload/page.tsx src/components/upload/ProgressBar.tsx
git commit -m "feat: add upload page shell with horizontal progress bar"
```

---

### Task 6: Step 1 — Upload Prescription Screen

**Files:**
- Create: `src/components/upload/StepUpload.tsx`
- Modify: `src/app/upload/page.tsx`

**Step 1: Create the upload drop zone component**

Create `src/components/upload/StepUpload.tsx`:

```typescript
"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, X, FileText } from "lucide-react";

interface StepUploadProps {
  file: File | null;
  previewUrl: string | null;
  onFileSelect: (file: File, previewUrl: string) => void;
  onFileRemove: () => void;
  onUseSample: () => void;
}

export default function StepUpload({
  file,
  previewUrl,
  onFileSelect,
  onFileRemove,
  onUseSample,
}: StepUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (f: File) => {
      if (f.size > 10 * 1024 * 1024) {
        alert("File must be under 10MB");
        return;
      }
      const url = URL.createObjectURL(f);
      onFileSelect(f, url);
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  if (file && previewUrl) {
    return (
      <div>
        <h2 className="text-[24px] font-bold mb-2" style={{ color: "var(--felix-text-primary)" }}>
          Upload your prescription
        </h2>
        <p className="text-[16px] mb-8" style={{ color: "var(--felix-text-secondary)" }}>
          Take a photo of your prescription or upload a file. Make sure all details are clearly visible.
        </p>

        <div
          className="rounded-[12px] border p-4 flex items-center gap-4"
          style={{ borderColor: "var(--felix-border)" }}
        >
          {file.type === "application/pdf" ? (
            <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
              <FileText className="w-8 h-8" style={{ color: "var(--felix-text-tertiary)" }} />
            </div>
          ) : (
            <img src={previewUrl} alt="Prescription preview" className="w-16 h-16 rounded-lg object-cover" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-medium truncate" style={{ color: "var(--felix-text-primary)" }}>
              {file.name}
            </p>
            <p className="text-[14px]" style={{ color: "var(--felix-text-tertiary)" }}>
              {(file.size / 1024).toFixed(0)} KB
            </p>
          </div>
          <button
            onClick={onFileRemove}
            className="p-2 rounded-lg transition-colors hover:bg-gray-100"
          >
            <X className="w-5 h-5" style={{ color: "var(--felix-text-secondary)" }} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-[24px] font-bold mb-2" style={{ color: "var(--felix-text-primary)" }}>
        Upload your prescription
      </h2>
      <p className="text-[16px] mb-8" style={{ color: "var(--felix-text-secondary)" }}>
        Take a photo of your prescription or upload a file. Make sure all details are clearly visible.
      </p>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className="rounded-[12px] py-12 px-6 flex flex-col items-center cursor-pointer transition-colors"
        style={{
          border: `2px dashed ${isDragging ? "var(--felix-primary)" : "var(--felix-border)"}`,
          backgroundColor: isDragging ? "rgba(222, 120, 31, 0.05)" : "transparent",
        }}
      >
        <Upload className="w-10 h-10 mb-4" style={{ color: "var(--felix-text-tertiary)" }} />
        <p className="text-[16px] mb-1" style={{ color: "var(--felix-text-primary)" }}>
          Drag and drop your file here
        </p>
        <p className="text-[14px] mb-3" style={{ color: "var(--felix-text-tertiary)" }}>or</p>
        <span
          className="text-[16px] font-medium underline"
          style={{ color: "var(--felix-primary)" }}
        >
          browse files
        </span>
        <p className="text-[12px] mt-4" style={{ color: "var(--felix-text-tertiary)" }}>
          JPG, PNG, or PDF up to 10MB
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,application/pdf"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
      </div>

      <button
        onClick={onUseSample}
        className="mt-6 w-full text-center text-[14px] font-medium transition-colors hover:underline"
        style={{ color: "var(--felix-primary)" }}
      >
        Use sample prescription
      </button>
    </div>
  );
}
```

**Step 2: Wire into upload page**

In `src/app/upload/page.tsx`, add state for the upload form data and render `StepUpload` when `currentStep === 0`. Add form state:

```typescript
// Add to state in UploadPage:
const [file, setFile] = useState<File | null>(null);
const [previewUrl, setPreviewUrl] = useState<string | null>(null);

// Sample data for "Use sample prescription"
const SAMPLE_DATA = {
  medicationName: "Sertraline",
  dose: "50mg once daily",
  quantity: 30,
  prescriberName: "Dr. Emily Watson",
  dateWritten: "2026-02-20",
};
```

Render `StepUpload` in the content area when `currentStep === 0`. When "Use sample" is clicked, set previewUrl to `/sample-prescription.svg`, create a mock File object, and auto-advance to step 1.

**Step 3: Verify**

Visit `/upload`. Drop zone renders. Click "Use sample prescription" — advances to step 1 with sample loaded. Can also drag a real file onto the drop zone.

**Step 4: Commit**

```bash
git add src/components/upload/StepUpload.tsx src/app/upload/page.tsx
git commit -m "feat: add prescription upload step with drag-and-drop"
```

---

### Task 7: Step 2 — Confirm Prescription Details

**Files:**
- Create: `src/components/upload/StepConfirmDetails.tsx`
- Create: `src/components/upload/FelixInput.tsx`
- Modify: `src/app/upload/page.tsx`

**Step 1: Create reusable Felix-styled input component**

Create `src/components/upload/FelixInput.tsx`:

```typescript
"use client";

interface FelixInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

export default function FelixInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
}: FelixInputProps) {
  return (
    <div>
      <label
        className="block text-[14px] mb-2"
        style={{ color: "var(--felix-text-secondary)" }}
      >
        {label}
        {required && <span style={{ color: "var(--felix-primary)" }}> *</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-3 rounded-[12px] text-[16px] outline-none transition-colors"
        style={{
          border: "0.5px solid var(--felix-border)",
          color: "var(--felix-text-primary)",
        }}
        onFocus={(e) => (e.currentTarget.style.outline = "0.125rem solid var(--felix-focus)")}
        onBlur={(e) => (e.currentTarget.style.outline = "none")}
      />
    </div>
  );
}
```

**Step 2: Create confirm details step**

Create `src/components/upload/StepConfirmDetails.tsx`:

```typescript
"use client";

import FelixInput from "./FelixInput";

interface PrescriptionDetails {
  medicationName: string;
  dose: string;
  quantity: string;
  prescriberName: string;
  dateWritten: string;
}

interface StepConfirmDetailsProps {
  previewUrl: string | null;
  details: PrescriptionDetails;
  onChange: (details: PrescriptionDetails) => void;
}

export default function StepConfirmDetails({
  previewUrl,
  details,
  onChange,
}: StepConfirmDetailsProps) {
  const update = (field: keyof PrescriptionDetails, value: string) => {
    onChange({ ...details, [field]: value });
  };

  return (
    <div>
      <h2 className="text-[24px] font-bold mb-2" style={{ color: "var(--felix-text-primary)" }}>
        Confirm your prescription details
      </h2>
      <p className="text-[16px] mb-8" style={{ color: "var(--felix-text-secondary)" }}>
        Our pharmacy team will verify these details match your uploaded prescription
      </p>

      {/* Prescription image preview */}
      {previewUrl && (
        <div
          className="rounded-[12px] border overflow-hidden mb-8"
          style={{ borderColor: "var(--felix-border)" }}
        >
          <img
            src={previewUrl}
            alt="Uploaded prescription"
            className="w-full max-h-[200px] object-contain bg-gray-50"
          />
        </div>
      )}

      {/* Form fields */}
      <div className="space-y-5">
        <FelixInput
          label="Medication name"
          value={details.medicationName}
          onChange={(v) => update("medicationName", v)}
          required
        />
        <FelixInput
          label="Dose"
          value={details.dose}
          onChange={(v) => update("dose", v)}
          required
        />
        <FelixInput
          label="Quantity"
          value={details.quantity}
          onChange={(v) => update("quantity", v)}
          type="number"
          required
        />
        <FelixInput
          label="Prescriber name"
          value={details.prescriberName}
          onChange={(v) => update("prescriberName", v)}
          required
        />
        <FelixInput
          label="Date written"
          value={details.dateWritten}
          onChange={(v) => update("dateWritten", v)}
          type="date"
          required
        />
      </div>
    </div>
  );
}
```

**Step 3: Wire into upload page**

Add `prescriptionDetails` state to `src/app/upload/page.tsx` and render `StepConfirmDetails` when `currentStep === 1`.

**Step 4: Verify**

Click "Use sample prescription" → Step 2 shows prescription image and pre-filled form fields. Fields are editable.

**Step 5: Commit**

```bash
git add src/components/upload/FelixInput.tsx src/components/upload/StepConfirmDetails.tsx src/app/upload/page.tsx
git commit -m "feat: add confirm prescription details step"
```

---

### Task 8: Step 3 — Insurance Details

**Files:**
- Create: `src/components/upload/FelixSelect.tsx`
- Create: `src/components/upload/StepInsurance.tsx`
- Modify: `src/app/upload/page.tsx`

**Step 1: Create Felix-styled select component**

Create `src/components/upload/FelixSelect.tsx`:

```typescript
"use client";

interface FelixSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
}

export default function FelixSelect({
  label,
  value,
  onChange,
  options,
  required = false,
}: FelixSelectProps) {
  return (
    <div>
      <label
        className="block text-[14px] mb-2"
        style={{ color: "var(--felix-text-secondary)" }}
      >
        {label}
        {required && <span style={{ color: "var(--felix-primary)" }}> *</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-3 rounded-[12px] text-[16px] outline-none transition-colors appearance-none bg-white"
        style={{
          border: "0.5px solid var(--felix-border)",
          color: value ? "var(--felix-text-primary)" : "var(--felix-text-tertiary)",
        }}
        onFocus={(e) => (e.currentTarget.style.outline = "0.125rem solid var(--felix-focus)")}
        onBlur={(e) => (e.currentTarget.style.outline = "none")}
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
```

**Step 2: Create insurance step**

Create `src/components/upload/StepInsurance.tsx`:

```typescript
"use client";

import FelixInput from "./FelixInput";
import FelixSelect from "./FelixSelect";

const PROVINCES = [
  { value: "Alberta", label: "Alberta" },
  { value: "British Columbia", label: "British Columbia" },
  { value: "Manitoba", label: "Manitoba" },
  { value: "New Brunswick", label: "New Brunswick" },
  { value: "Newfoundland and Labrador", label: "Newfoundland and Labrador" },
  { value: "Nova Scotia", label: "Nova Scotia" },
  { value: "Ontario", label: "Ontario" },
  { value: "Prince Edward Island", label: "Prince Edward Island" },
  { value: "Quebec", label: "Quebec" },
  { value: "Saskatchewan", label: "Saskatchewan" },
];

interface InsuranceDetails {
  province: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  insuranceGroupNumber: string;
}

interface StepInsuranceProps {
  details: InsuranceDetails;
  onChange: (details: InsuranceDetails) => void;
}

export default function StepInsurance({ details, onChange }: StepInsuranceProps) {
  const update = (field: keyof InsuranceDetails, value: string) => {
    onChange({ ...details, [field]: value });
  };

  return (
    <div>
      <h2 className="text-[24px] font-bold mb-2" style={{ color: "var(--felix-text-primary)" }}>
        Insurance information
      </h2>
      <p className="text-[16px] mb-8" style={{ color: "var(--felix-text-secondary)" }}>
        We&apos;ll check your insurance coverage and let you know what you&apos;ll pay before we fill your prescription
      </p>

      <div className="space-y-5">
        <FelixSelect
          label="Province"
          value={details.province}
          onChange={(v) => update("province", v)}
          options={PROVINCES}
          required
        />
        <FelixInput
          label="Insurance provider"
          value={details.insuranceProvider}
          onChange={(v) => update("insuranceProvider", v)}
          required
        />
        <FelixInput
          label="Policy / card number"
          value={details.insurancePolicyNumber}
          onChange={(v) => update("insurancePolicyNumber", v)}
          required
        />
        <FelixInput
          label="Group number (optional)"
          value={details.insuranceGroupNumber}
          onChange={(v) => update("insuranceGroupNumber", v)}
        />
      </div>
    </div>
  );
}
```

**Step 3: Wire into upload page with state and render at `currentStep === 2`.**

**Step 4: Verify and commit**

```bash
git add src/components/upload/FelixSelect.tsx src/components/upload/StepInsurance.tsx src/app/upload/page.tsx
git commit -m "feat: add insurance details step"
```

---

### Task 9: Step 4 — Delivery Address

**Files:**
- Create: `src/components/upload/StepDelivery.tsx`
- Modify: `src/app/upload/page.tsx`

**Step 1: Create delivery step**

Create `src/components/upload/StepDelivery.tsx`:

```typescript
"use client";

import FelixInput from "./FelixInput";
import FelixSelect from "./FelixSelect";

const PROVINCES = [
  { value: "Alberta", label: "Alberta" },
  { value: "British Columbia", label: "British Columbia" },
  { value: "Manitoba", label: "Manitoba" },
  { value: "New Brunswick", label: "New Brunswick" },
  { value: "Newfoundland and Labrador", label: "Newfoundland and Labrador" },
  { value: "Nova Scotia", label: "Nova Scotia" },
  { value: "Ontario", label: "Ontario" },
  { value: "Prince Edward Island", label: "Prince Edward Island" },
  { value: "Quebec", label: "Quebec" },
  { value: "Saskatchewan", label: "Saskatchewan" },
];

interface DeliveryDetails {
  street: string;
  unit: string;
  city: string;
  province: string;
  postalCode: string;
}

interface StepDeliveryProps {
  details: DeliveryDetails;
  onChange: (details: DeliveryDetails) => void;
}

export default function StepDelivery({ details, onChange }: StepDeliveryProps) {
  const update = (field: keyof DeliveryDetails, value: string) => {
    onChange({ ...details, [field]: value });
  };

  return (
    <div>
      <h2 className="text-[24px] font-bold mb-2" style={{ color: "var(--felix-text-primary)" }}>
        Delivery address
      </h2>
      <p className="text-[16px] mb-8" style={{ color: "var(--felix-text-secondary)" }}>
        Where should we send your medication?
      </p>

      <div className="space-y-5">
        <FelixInput
          label="Street address"
          value={details.street}
          onChange={(v) => update("street", v)}
          required
        />
        <FelixInput
          label="Unit / Apartment (optional)"
          value={details.unit}
          onChange={(v) => update("unit", v)}
        />
        <div className="grid grid-cols-2 gap-4">
          <FelixInput
            label="City"
            value={details.city}
            onChange={(v) => update("city", v)}
            required
          />
          <FelixSelect
            label="Province"
            value={details.province}
            onChange={(v) => update("province", v)}
            options={PROVINCES}
            required
          />
        </div>
        <FelixInput
          label="Postal code"
          value={details.postalCode}
          onChange={(v) => update("postalCode", v)}
          required
        />
      </div>
    </div>
  );
}
```

**Step 2: Wire into upload page at `currentStep === 3`. Pre-fill with mock data:**

```typescript
const [deliveryDetails, setDeliveryDetails] = useState({
  street: "45 King St W",
  unit: "Suite 1200",
  city: "Toronto",
  province: "Ontario",
  postalCode: "M5H 1J8",
});
```

**Step 3: Verify and commit**

```bash
git add src/components/upload/StepDelivery.tsx src/app/upload/page.tsx
git commit -m "feat: add delivery address step"
```

---

### Task 10: Step 5 — Consent

**Files:**
- Create: `src/components/upload/StepConsent.tsx`
- Modify: `src/app/upload/page.tsx`

**Step 1: Create consent step**

Create `src/components/upload/StepConsent.tsx`:

```typescript
"use client";

import { Check } from "lucide-react";

interface StepConsentProps {
  priceConsent: boolean;
  counselingConsent: boolean;
  onPriceConsentChange: (value: boolean) => void;
  onCounselingConsentChange: (value: boolean) => void;
}

function FelixCheckbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <div
        className="mt-0.5 w-5 h-5 rounded-[4px] border flex items-center justify-center shrink-0 transition-colors"
        style={{
          borderColor: checked ? "var(--felix-primary)" : "var(--felix-border)",
          backgroundColor: checked ? "var(--felix-primary)" : "transparent",
        }}
        onClick={(e) => {
          e.preventDefault();
          onChange(!checked);
        }}
      >
        {checked && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
      </div>
      <span
        className="text-[16px] leading-relaxed"
        style={{ color: "var(--felix-text-primary)" }}
        onClick={() => onChange(!checked)}
      >
        {label}
      </span>
    </label>
  );
}

export default function StepConsent({
  priceConsent,
  counselingConsent,
  onPriceConsentChange,
  onCounselingConsentChange,
}: StepConsentProps) {
  return (
    <div>
      <h2 className="text-[24px] font-bold mb-2" style={{ color: "var(--felix-text-primary)" }}>
        Review and consent
      </h2>
      <p className="text-[16px] mb-8" style={{ color: "var(--felix-text-secondary)" }}>
        Please review and accept the following before submitting
      </p>

      <div className="space-y-6">
        <FelixCheckbox
          checked={priceConsent}
          onChange={onPriceConsentChange}
          label="I understand I'll be charged once my prescription is filled and insurance coverage is confirmed"
        />
        <FelixCheckbox
          checked={counselingConsent}
          onChange={onCounselingConsentChange}
          label="I consent to pharmacist counseling as required"
        />
      </div>
    </div>
  );
}
```

**Step 2: Wire into upload page at `currentStep === 4`. Disable "Continue" button when both checkboxes are not checked.**

**Step 3: Verify and commit**

```bash
git add src/components/upload/StepConsent.tsx src/app/upload/page.tsx
git commit -m "feat: add consent step with checkboxes"
```

---

### Task 11: Step 6 — Review Summary

**Files:**
- Create: `src/components/upload/StepReview.tsx`
- Modify: `src/app/upload/page.tsx`

**Step 1: Create review step**

Create `src/components/upload/StepReview.tsx`:

```typescript
"use client";

import { FileText } from "lucide-react";

interface StepReviewProps {
  previewUrl: string | null;
  prescriptionDetails: {
    medicationName: string;
    dose: string;
    quantity: string;
    prescriberName: string;
    dateWritten: string;
  };
  insuranceDetails: {
    province: string;
    insuranceProvider: string;
    insurancePolicyNumber: string;
    insuranceGroupNumber: string;
  };
  deliveryDetails: {
    street: string;
    unit: string;
    city: string;
    province: string;
    postalCode: string;
  };
  onEditStep: (step: number) => void;
}

function SummaryCard({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-[16px] border p-6"
      style={{ borderColor: "var(--felix-border)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[16px] font-semibold" style={{ color: "var(--felix-text-primary)" }}>
          {title}
        </h3>
        <button
          onClick={onEdit}
          className="text-[14px] font-medium transition-colors hover:underline"
          style={{ color: "var(--felix-primary)" }}
        >
          Edit
        </button>
      </div>
      {children}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-1.5">
      <span className="text-[14px]" style={{ color: "var(--felix-text-secondary)" }}>
        {label}
      </span>
      <span className="text-[14px] font-medium text-right" style={{ color: "var(--felix-text-primary)" }}>
        {value}
      </span>
    </div>
  );
}

export default function StepReview({
  previewUrl,
  prescriptionDetails,
  insuranceDetails,
  deliveryDetails,
  onEditStep,
}: StepReviewProps) {
  return (
    <div>
      <h2 className="text-[24px] font-bold mb-2" style={{ color: "var(--felix-text-primary)" }}>
        Review your submission
      </h2>
      <p className="text-[16px] mb-8" style={{ color: "var(--felix-text-secondary)" }}>
        Please confirm everything looks correct before submitting
      </p>

      <div className="space-y-4">
        {/* Prescription card */}
        <SummaryCard title="Prescription" onEdit={() => onEditStep(1)}>
          {previewUrl && (
            <div
              className="rounded-lg border overflow-hidden mb-4"
              style={{ borderColor: "var(--felix-border)" }}
            >
              <img
                src={previewUrl}
                alt="Prescription"
                className="w-full max-h-[120px] object-contain bg-gray-50"
              />
            </div>
          )}
          <DetailRow label="Medication" value={prescriptionDetails.medicationName} />
          <DetailRow label="Dose" value={prescriptionDetails.dose} />
          <DetailRow label="Quantity" value={prescriptionDetails.quantity} />
          <DetailRow label="Prescriber" value={prescriptionDetails.prescriberName} />
          <DetailRow label="Date written" value={prescriptionDetails.dateWritten} />
        </SummaryCard>

        {/* Insurance card */}
        <SummaryCard title="Insurance" onEdit={() => onEditStep(2)}>
          <DetailRow label="Province" value={insuranceDetails.province} />
          <DetailRow label="Provider" value={insuranceDetails.insuranceProvider} />
          <DetailRow label="Policy number" value={insuranceDetails.insurancePolicyNumber} />
          {insuranceDetails.insuranceGroupNumber && (
            <DetailRow label="Group number" value={insuranceDetails.insuranceGroupNumber} />
          )}
        </SummaryCard>

        {/* Delivery card */}
        <SummaryCard title="Delivery" onEdit={() => onEditStep(3)}>
          <DetailRow
            label="Address"
            value={[
              deliveryDetails.street,
              deliveryDetails.unit,
              `${deliveryDetails.city}, ${deliveryDetails.province}`,
              deliveryDetails.postalCode,
            ]
              .filter(Boolean)
              .join(", ")}
          />
        </SummaryCard>
      </div>
    </div>
  );
}
```

**Step 2: Wire into upload page at `currentStep === 5`. The "Continue" button text changes to "Submit prescription for review". Clicking it POSTs to `/api/uploads` and advances to step 6.**

The submit handler:
```typescript
const handleSubmit = async () => {
  const response = await fetch("/api/uploads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      patientName: "Demo User",
      patientEmail: "demo@felixforyou.ca",
      imageUrl: "/sample-prescription.svg",
      medicationName: prescriptionDetails.medicationName,
      dose: prescriptionDetails.dose,
      quantity: parseInt(prescriptionDetails.quantity),
      prescriberName: prescriptionDetails.prescriberName,
      dateWritten: prescriptionDetails.dateWritten,
      province: insuranceDetails.province,
      insuranceProvider: insuranceDetails.insuranceProvider,
      insurancePolicyNumber: insuranceDetails.insurancePolicyNumber,
      insuranceGroupNumber: insuranceDetails.insuranceGroupNumber || null,
      deliveryAddress: {
        street: deliveryDetails.street,
        unit: deliveryDetails.unit || null,
        city: deliveryDetails.city,
        province: deliveryDetails.province,
        postalCode: deliveryDetails.postalCode,
      },
    }),
  });
  const upload = await response.json();
  setSubmittedUploadId(upload.id);
  setCurrentStep(6);
};
```

**Step 3: Verify and commit**

```bash
git add src/components/upload/StepReview.tsx src/app/upload/page.tsx
git commit -m "feat: add review summary step with API submission"
```

---

### Task 12: Step 7 — Confirmation Screen with Demo Sidebar

**Files:**
- Create: `src/components/upload/StepConfirmation.tsx`
- Create: `src/components/upload/UploadDemoSidebar.tsx`
- Modify: `src/app/upload/page.tsx`

**Step 1: Create confirmation screen**

Create `src/components/upload/StepConfirmation.tsx`:

```typescript
"use client";

import { CheckCircle, ClipboardCheck, Shield, DollarSign } from "lucide-react";

export default function StepConfirmation() {
  return (
    <div className="text-center pt-8">
      <div
        className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
        style={{ backgroundColor: "rgba(222, 120, 31, 0.1)" }}
      >
        <CheckCircle className="w-8 h-8" style={{ color: "var(--felix-primary)" }} />
      </div>

      <h2 className="text-[24px] font-bold mb-3" style={{ color: "var(--felix-text-primary)" }}>
        Prescription received. We&apos;ll review it and get back to you.
      </h2>
      <p className="text-[16px] mb-10" style={{ color: "var(--felix-text-secondary)" }}>
        Our pharmacy team is reviewing your prescription. You&apos;ll receive an update within 24 hours.
      </p>

      <div className="space-y-4 text-left max-w-sm mx-auto">
        {[
          { icon: ClipboardCheck, text: "We'll verify your prescription details" },
          { icon: Shield, text: "Check your insurance coverage" },
          { icon: DollarSign, text: "Send you the final price before filling" },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: "rgba(222, 120, 31, 0.1)" }}
            >
              <Icon className="w-4 h-4" style={{ color: "var(--felix-primary)" }} />
            </div>
            <span className="text-[14px]" style={{ color: "var(--felix-text-primary)" }}>
              {text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Step 2: Create demo sidebar for status control**

Create `src/components/upload/UploadDemoSidebar.tsx`:

```typescript
"use client";

import { UploadStatus } from "@/lib/types";
import Link from "next/link";

const UPLOAD_STATES: { value: UploadStatus; label: string }[] = [
  { value: "under_review", label: "Under Review" },
  { value: "awaiting_patient", label: "Awaiting Patient" },
  { value: "ready_to_fill", label: "Ready to Fill" },
  { value: "filled", label: "Filled" },
  { value: "rejected", label: "Rejected" },
];

interface UploadDemoSidebarProps {
  uploadStatus: UploadStatus;
  onStatusChange: (status: UploadStatus) => void;
  onReset: () => void;
}

export default function UploadDemoSidebar({
  uploadStatus,
  onStatusChange,
  onReset,
}: UploadDemoSidebarProps) {
  return (
    <div
      className="w-[280px] shrink-0 border-r h-screen overflow-y-auto p-6 flex flex-col gap-6"
      style={{
        backgroundColor: "var(--felix-text-primary)",
        borderColor: "rgba(255,255,255,0.1)",
      }}
    >
      <div>
        <h2 className="text-[14px] font-semibold text-white/50 uppercase tracking-wider mb-1">
          Demo Controls
        </h2>
        <p className="text-[12px] text-white/30">
          Change upload status to sync with pharmacy dashboard
        </p>
      </div>

      <div>
        <h3 className="text-[12px] font-semibold text-white/40 uppercase tracking-wider mb-3">
          Upload Status
        </h3>
        <div className="flex flex-col gap-1">
          {UPLOAD_STATES.map((state) => (
            <button
              key={state.value}
              onClick={() => onStatusChange(state.value)}
              className={`text-left px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${
                uploadStatus === state.value
                  ? "bg-white/10 text-white"
                  : "text-white/50 hover:bg-white/5 hover:text-white/70"
              }`}
            >
              {state.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto space-y-3 pt-4 border-t border-white/10">
        <button
          onClick={onReset}
          className="w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium text-white/50 hover:bg-white/5 hover:text-white/70 transition-colors"
        >
          Start Over
        </button>
        <Link
          href="/pharmacy"
          target="_blank"
          className="block px-3 py-2 rounded-lg text-[13px] font-medium text-white/50 hover:bg-white/5 hover:text-white/70 transition-colors"
        >
          Open Pharmacy Dashboard &rarr;
        </Link>
      </div>
    </div>
  );
}
```

**Step 3: Wire into upload page**

When `currentStep === 6` (confirmation), show the demo sidebar on the left and the confirmation content on the right. Hide the progress bar and bottom buttons. The sidebar status change PATCHes `/api/uploads/[submittedUploadId]`.

Layout changes to the upload page when on confirmation step:
```typescript
// When currentStep === 6, wrap content in a flex layout with sidebar:
{currentStep === 6 ? (
  <div className="flex h-screen">
    <UploadDemoSidebar
      uploadStatus={uploadStatus}
      onStatusChange={async (status) => {
        setUploadStatus(status);
        if (submittedUploadId) {
          await fetch(`/api/uploads/${submittedUploadId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
          });
        }
      }}
      onReset={() => {
        setCurrentStep(0);
        setFile(null);
        setPreviewUrl(null);
        // reset all form state...
      }}
    />
    <div className="flex-1 flex items-center justify-center px-6">
      <div className="w-full max-w-[560px]">
        <StepConfirmation />
      </div>
    </div>
  </div>
) : (
  // ... existing layout with nav, progress bar, content, buttons
)}
```

**Step 4: Verify end-to-end patient flow**

Go through all 7 steps. On confirmation, sidebar appears. Status dropdown PATCHes the API. "Start Over" resets to step 1.

**Step 5: Commit**

```bash
git add src/components/upload/StepConfirmation.tsx src/components/upload/UploadDemoSidebar.tsx src/app/upload/page.tsx
git commit -m "feat: add confirmation screen and demo sidebar controls"
```

---

### Task 13: Pharmacy Dashboard — Tab Switcher and Uploads Table

**Files:**
- Create: `src/components/pharmacy/UploadTable.tsx`
- Modify: `src/app/pharmacy/page.tsx`

**Step 1: Create uploads table component**

Create `src/components/pharmacy/UploadTable.tsx`:

```typescript
"use client";

import { UploadedPrescription, UploadStatus } from "@/lib/types";

const STATUS_COLORS: Record<UploadStatus, string> = {
  under_review: "bg-amber-100 text-amber-700",
  awaiting_patient: "bg-purple-100 text-purple-700",
  ready_to_fill: "bg-blue-100 text-blue-700",
  filled: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<UploadStatus, string> = {
  under_review: "Under Review",
  awaiting_patient: "Awaiting Patient",
  ready_to_fill: "Ready to Fill",
  filled: "Filled",
  rejected: "Rejected",
};

interface UploadTableProps {
  uploads: UploadedPrescription[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function UploadTable({ uploads, selectedId, onSelect }: UploadTableProps) {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-200 text-xs text-gray-400 uppercase tracking-wider">
          <th className="text-left py-3 px-4 font-medium">Patient</th>
          <th className="text-left py-3 px-4 font-medium">Image</th>
          <th className="text-left py-3 px-4 font-medium">Medication</th>
          <th className="text-left py-3 px-4 font-medium">Status</th>
          <th className="text-left py-3 px-4 font-medium">Submitted</th>
        </tr>
      </thead>
      <tbody>
        {uploads.map((upload) => (
          <tr
            key={upload.id}
            onClick={() => onSelect(upload.id)}
            className={`border-b border-gray-100 cursor-pointer transition-colors ${
              selectedId === upload.id ? "bg-gray-50" : "hover:bg-gray-50"
            }`}
          >
            <td className="py-3 px-4 text-sm font-medium text-gray-900">
              {upload.patientName}
            </td>
            <td className="py-3 px-4">
              <img
                src={upload.imageUrl}
                alt="Rx"
                className="w-10 h-10 rounded-lg object-cover border border-gray-200"
              />
            </td>
            <td className="py-3 px-4 text-sm text-gray-600">
              {upload.medicationName}
            </td>
            <td className="py-3 px-4">
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[upload.status]}`}
              >
                {STATUS_LABELS[upload.status]}
              </span>
            </td>
            <td className="py-3 px-4 text-sm text-gray-400">
              {new Date(upload.uploadedAt).toLocaleDateString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

**Step 2: Add tab switcher and uploads state to pharmacy page**

Modify `src/app/pharmacy/page.tsx` to add:
- A `tab` state: `"transfers" | "uploads"`
- A tab switcher UI at the top of the content area (below the nav bar)
- Fetch and poll `GET /api/uploads` when `tab === "uploads"`
- Render `UploadTable` when uploads tab is active
- A `selectedUploadId` state

The tab switcher:
```tsx
<div className="px-8 pt-6 flex gap-6">
  <button
    onClick={() => setTab("transfers")}
    className={`pb-2 text-[16px] font-medium transition-colors ${
      tab === "transfers"
        ? "text-gray-900 border-b-2 border-[#DE781F]"
        : "text-gray-400 hover:text-gray-600"
    }`}
  >
    Transfers
  </button>
  <button
    onClick={() => setTab("uploads")}
    className={`pb-2 text-[16px] font-medium transition-colors ${
      tab === "uploads"
        ? "text-gray-900 border-b-2 border-[#DE781F]"
        : "text-gray-400 hover:text-gray-600"
    }`}
  >
    Prescription Uploads
  </button>
</div>
```

Polling for uploads (same pattern as transfers):
```typescript
const [uploads, setUploads] = useState<UploadedPrescription[]>([]);

useEffect(() => {
  if (tab !== "uploads") return;
  let active = true;
  const doFetch = async () => {
    const data = await fetch("/api/uploads").then((r) => r.json());
    if (active) setUploads(data);
  };
  doFetch();
  const interval = setInterval(doFetch, 3000);
  return () => { active = false; clearInterval(interval); };
}, [tab]);
```

**Step 3: Verify**

Visit `/pharmacy`. Tab switcher appears. "Prescription Uploads" tab shows 3 seed uploads in the table. Clicking a row selects it. Switching back to "Transfers" shows the existing transfer table.

**Step 4: Commit**

```bash
git add src/components/pharmacy/UploadTable.tsx src/app/pharmacy/page.tsx
git commit -m "feat: add pharmacy dashboard tab switcher and uploads table"
```

---

### Task 14: Pharmacy Dashboard — Upload Detail Panel

**Files:**
- Create: `src/components/pharmacy/UploadDetail.tsx`
- Modify: `src/app/pharmacy/page.tsx`

**Step 1: Create upload detail panel**

Create `src/components/pharmacy/UploadDetail.tsx`:

```typescript
"use client";

import { useState } from "react";
import { UploadedPrescription, UploadStatus } from "@/lib/types";

const STATUS_LABELS: Record<UploadStatus, string> = {
  under_review: "Under Review",
  awaiting_patient: "Awaiting Patient",
  ready_to_fill: "Ready to Fill",
  filled: "Filled",
  rejected: "Rejected",
};

const REJECTION_REASONS = [
  "Prescription expired",
  "Prescription illegible",
  "Medication not in formulary",
  "Controlled substance",
  "Missing required information",
];

const NEXT_ACTION: Partial<Record<UploadStatus, { status: UploadStatus; label: string }>> = {
  under_review: { status: "ready_to_fill", label: "Approve — Ready to Fill" },
  ready_to_fill: { status: "filled", label: "Mark as Filled" },
};

interface UploadDetailProps {
  upload: UploadedPrescription;
  onUpdateStatus: (id: string, status: UploadStatus, extra?: { pharmacyNotes?: string; rejectionReason?: string }) => void;
}

export default function UploadDetail({ upload, onUpdateStatus }: UploadDetailProps) {
  const [notes, setNotes] = useState(upload.pharmacyNotes || "");
  const [rejectionReason, setRejectionReason] = useState(upload.rejectionReason || "");
  const [showImageModal, setShowImageModal] = useState(false);
  const next = NEXT_ACTION[upload.status];

  return (
    <div className="space-y-4">
      {/* Prescription image */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Uploaded Prescription
        </h4>
        <img
          src={upload.imageUrl}
          alt="Prescription"
          className="w-full rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => setShowImageModal(true)}
        />
        <p className="text-xs text-gray-400 mt-2">
          Uploaded {new Date(upload.uploadedAt).toLocaleString()}
        </p>
      </div>

      {/* Patient-entered details */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Prescription Details
        </h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-400">Medication</span>
            <p className="font-medium text-gray-900">{upload.medicationName}</p>
          </div>
          <div>
            <span className="text-gray-400">Dose</span>
            <p className="font-medium text-gray-900">{upload.dose}</p>
          </div>
          <div>
            <span className="text-gray-400">Quantity</span>
            <p className="font-medium text-gray-900">{upload.quantity}</p>
          </div>
          <div>
            <span className="text-gray-400">Prescriber</span>
            <p className="font-medium text-gray-900">{upload.prescriberName}</p>
          </div>
          <div>
            <span className="text-gray-400">Date Written</span>
            <p className="font-medium text-gray-900">{upload.dateWritten}</p>
          </div>
          <div>
            <span className="text-gray-400">Patient</span>
            <p className="font-medium text-gray-900">{upload.patientName}</p>
          </div>
        </div>
      </div>

      {/* Insurance & delivery */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Insurance & Delivery
        </h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-400">Province</span>
            <p className="font-medium text-gray-900">{upload.province}</p>
          </div>
          <div>
            <span className="text-gray-400">Provider</span>
            <p className="font-medium text-gray-900">{upload.insuranceProvider}</p>
          </div>
          <div>
            <span className="text-gray-400">Policy #</span>
            <p className="font-medium text-gray-900">{upload.insurancePolicyNumber}</p>
          </div>
          {upload.insuranceGroupNumber && (
            <div>
              <span className="text-gray-400">Group #</span>
              <p className="font-medium text-gray-900">{upload.insuranceGroupNumber}</p>
            </div>
          )}
          <div className="col-span-2">
            <span className="text-gray-400">Delivery Address</span>
            <p className="font-medium text-gray-900">
              {upload.deliveryAddress.street}
              {upload.deliveryAddress.unit && `, ${upload.deliveryAddress.unit}`}
              , {upload.deliveryAddress.city}, {upload.deliveryAddress.province}{" "}
              {upload.deliveryAddress.postalCode}
            </p>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Pharmacy Notes
        </h4>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes about this prescription..."
          className="w-full text-sm border border-gray-200 rounded-lg p-3 resize-none h-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => onUpdateStatus(upload.id, upload.status, { pharmacyNotes: notes })}
          className="mt-2 text-xs font-medium text-blue-600 hover:underline"
        >
          Save notes
        </button>
      </div>

      {/* Rejection reason (only when rejecting) */}
      {upload.status !== "filled" && upload.status !== "rejected" && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Reject Prescription
          </h4>
          <select
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="w-full text-sm border border-gray-200 rounded-lg p-2.5 mb-2"
          >
            <option value="">Select reason...</option>
            {REJECTION_REASONS.map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              if (!rejectionReason) return;
              onUpdateStatus(upload.id, "rejected", { rejectionReason });
            }}
            disabled={!rejectionReason}
            className={`w-full py-2 rounded-lg text-sm font-semibold transition-colors ${
              rejectionReason
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Reject
          </button>
        </div>
      )}

      {/* Request clarification button */}
      {upload.status !== "filled" && upload.status !== "rejected" && upload.status !== "awaiting_patient" && (
        <button
          onClick={() => onUpdateStatus(upload.id, "awaiting_patient")}
          className="w-full py-3 rounded-lg text-sm font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        >
          Request Clarification
        </button>
      )}

      {/* Primary action button */}
      {next && (
        <button
          onClick={() => onUpdateStatus(upload.id, next.status)}
          className="w-full py-3 rounded-lg font-semibold text-sm bg-[#1a1a1a] text-white hover:bg-gray-800 transition-colors"
        >
          {next.label}
        </button>
      )}

      {upload.status === "filled" && (
        <div className="text-center text-sm text-emerald-600 font-medium py-2">
          Prescription filled &amp; shipped
        </div>
      )}

      {upload.status === "rejected" && (
        <div className="text-center text-sm text-red-600 font-medium py-2">
          Rejected: {upload.rejectionReason}
        </div>
      )}

      {/* Image modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-8"
          onClick={() => setShowImageModal(false)}
        >
          <img
            src={upload.imageUrl}
            alt="Prescription full size"
            className="max-w-full max-h-full rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
```

**Step 2: Wire into pharmacy page**

In `src/app/pharmacy/page.tsx`, when `tab === "uploads"` and a row is selected, render `UploadDetail` in the right panel. Add a handler:

```typescript
const handleUploadStatusChange = async (
  id: string,
  status: UploadStatus,
  extra?: { pharmacyNotes?: string; rejectionReason?: string }
) => {
  await fetch(`/api/uploads/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, ...extra }),
  });
  const data = await fetch("/api/uploads").then((r) => r.json());
  setUploads(data);

  const labels: Record<string, string> = {
    ready_to_fill: "Approved — ready to fill",
    filled: "Prescription filled",
    rejected: "Prescription rejected",
    awaiting_patient: "Clarification requested",
  };
  setToastMessage(labels[status] || `Status: ${status}`);
  setShowToast(true);
  setTimeout(() => setShowToast(false), 2000);
};
```

**Step 3: Verify end-to-end**

1. Visit `/upload`, complete all 7 steps
2. Open `/pharmacy`, switch to "Prescription Uploads" tab
3. New upload appears in the table
4. Click it — detail panel shows image, details, insurance, delivery
5. Click "Approve — Ready to Fill" — status updates, toast appears
6. Back on `/upload`, change status via sidebar — pharmacy dashboard updates on next poll

**Step 4: Commit**

```bash
git add src/components/pharmacy/UploadDetail.tsx src/app/pharmacy/page.tsx
git commit -m "feat: add pharmacy upload detail panel with actions"
```

---

### Task 15: Add Navigation Links Between Pages

**Files:**
- Modify: `src/components/DemoSidebar.tsx`
- Modify: `src/app/pharmacy/page.tsx`

**Step 1: Add "Upload Rx Demo" link to existing DemoSidebar**

In `src/components/DemoSidebar.tsx`, add a link to `/upload` in the bottom links section alongside the pharmacy dashboard link:

```tsx
<Link
  href="/upload"
  className="block text-sm text-gray-500 hover:text-gray-900 transition-colors"
>
  Open Upload Rx Demo &rarr;
</Link>
```

**Step 2: Add "Upload Rx Demo" link to pharmacy nav**

In `src/app/pharmacy/page.tsx`, update the top nav to include links to both the patient demo and the upload demo:

```tsx
<div className="flex items-center gap-4">
  <Link href="/upload" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
    Upload Rx Demo
  </Link>
  <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
    &larr; Patient Demo
  </Link>
</div>
```

**Step 3: Verify**

All three pages link to each other. Navigation works.

**Step 4: Commit**

```bash
git add src/components/DemoSidebar.tsx src/app/pharmacy/page.tsx
git commit -m "feat: add cross-page navigation links"
```

---

### Task 16: Final Polish and Build Verification

**Files:**
- Possibly modify: `src/app/upload/page.tsx` (any fixes)

**Step 1: Run build**

Run: `npm run build`
Expected: No TypeScript errors, no build warnings.

**Step 2: Run lint**

Run: `npm run lint`
Expected: No lint errors.

**Step 3: Manual QA walkthrough**

1. `/upload` — Complete all 7 steps with "Use sample prescription"
2. `/upload` — Complete all 7 steps with real image drag-and-drop
3. `/upload` — Verify Back button works on each step
4. `/upload` — Verify "Edit" links on review step jump to correct step
5. `/upload` — Verify demo sidebar status changes PATCH the API
6. `/pharmacy` — Verify tab switcher works
7. `/pharmacy` — Verify uploads table shows seed data + new submissions
8. `/pharmacy` — Verify detail panel actions (approve, reject, clarify, notes)
9. `/pharmacy` — Verify cross-page sync (change status on `/upload`, see it on `/pharmacy`)
10. `/` — Verify existing transfer demo still works unchanged

**Step 4: Fix any issues found**

**Step 5: Final commit**

```bash
git add -A
git commit -m "feat: prescription upload flow — final polish"
```
