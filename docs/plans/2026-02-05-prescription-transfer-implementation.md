# Prescription Transfer Demo — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a polished internal demo prototype of a prescription transfer feature with a patient-facing mobile mockup and pharmacy dashboard.

**Architecture:** Single Next.js app (App Router) with two pages: a patient demo page (`/`) showing an iPhone frame with interactive screens, and a pharmacy dashboard (`/pharmacy`). Mock API routes with in-memory data store. No database.

**Tech Stack:** Next.js 14+, React 18, TypeScript, Tailwind CSS v4, Framer Motion, lucide-react (icons)

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`
- Create: `src/app/layout.tsx`, `src/app/globals.css`

**Step 1: Initialize Next.js project**

Run:
```bash
cd /Users/tucker.schreiber/Documents/transfers
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Accept defaults. This creates the full scaffold.

**Step 2: Install additional dependencies**

Run:
```bash
npm install framer-motion lucide-react
```

**Step 3: Verify it runs**

Run:
```bash
npm run dev
```

Visit http://localhost:3000 — should see the Next.js default page.

**Step 4: Clean up default content**

Replace `src/app/page.tsx` with a minimal placeholder:

```tsx
export default function Home() {
  return <div>Prescription Transfer Demo</div>;
}
```

Remove unused default CSS from `src/app/globals.css` (keep the Tailwind directives only).

**Step 5: Commit**

```bash
git init
git add -A
git commit -m "chore: scaffold Next.js project with Tailwind and Framer Motion"
```

---

### Task 2: In-Memory Data Store & Types

**Files:**
- Create: `src/lib/types.ts`
- Create: `src/lib/store.ts`

**Step 1: Define TypeScript types**

```ts
// src/lib/types.ts

export type TransferStatus =
  | "submitted"
  | "reviewed"
  | "requested"
  | "transferred"
  | "completed";

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
}

export interface Prescription {
  id: string;
  drugName: string;
  din: string;
  dosage: string;
  quantity: number;
  refillsRemaining: number;
  prescribingDoctor: string;
  patientName: string;
  patientDob: string;
}

export interface Transfer {
  id: string;
  prescriptionId: string;
  sourcePharmacyId: string;
  status: TransferStatus;
  createdAt: string;
}
```

**Step 2: Create in-memory store with seed data**

```ts
// src/lib/store.ts

import { Pharmacy, Prescription, Transfer } from "./types";

export const pharmacies: Pharmacy[] = [
  { id: "ph-1", name: "Yonge Drug Mart", address: "2399 Yonge St, Toronto" },
  { id: "ph-2", name: "The Village Pharmacy", address: "2518 Yonge St, Toronto" },
  { id: "ph-3", name: "Sam's IDA Pharmacy", address: "1920 Yonge St unit 101-Y, Toronto" },
];

export const prescriptions: Prescription[] = [
  {
    id: "rx-1",
    drugName: "Nizatidine",
    din: "02242963",
    dosage: "150mg twice daily",
    quantity: 60,
    refillsRemaining: 2,
    prescribingDoctor: "Dr. Sarah Chen",
    patientName: "Alex Thompson",
    patientDob: "1990-03-15",
  },
  {
    id: "rx-2",
    drugName: "Amoxicillin",
    din: "02243127",
    dosage: "500mg three times daily",
    quantity: 30,
    refillsRemaining: 0,
    prescribingDoctor: "Dr. James Park",
    patientName: "Morgan Riley",
    patientDob: "1985-07-22",
  },
];

export const transfers: Transfer[] = [
  {
    id: "tx-1",
    prescriptionId: "rx-1",
    sourcePharmacyId: "ph-1",
    status: "requested",
    createdAt: "2026-02-03T10:30:00Z",
  },
  {
    id: "tx-2",
    prescriptionId: "rx-2",
    sourcePharmacyId: "ph-3",
    status: "submitted",
    createdAt: "2026-02-04T14:15:00Z",
  },
];

// Helper to get next ID
let transferCounter = transfers.length;
export function nextTransferId() {
  return `tx-${++transferCounter}`;
}
```

**Step 3: Commit**

```bash
git add src/lib/types.ts src/lib/store.ts
git commit -m "feat: add TypeScript types and in-memory data store with seed data"
```

---

### Task 3: API Routes

**Files:**
- Create: `src/app/api/pharmacies/route.ts`
- Create: `src/app/api/transfers/route.ts`
- Create: `src/app/api/transfers/[id]/route.ts`
- Create: `src/app/api/prescriptions/[id]/route.ts`

**Step 1: Pharmacies endpoint**

```ts
// src/app/api/pharmacies/route.ts
import { NextResponse } from "next/server";
import { pharmacies } from "@/lib/store";

export async function GET() {
  return NextResponse.json(pharmacies);
}
```

**Step 2: Transfers endpoints**

```ts
// src/app/api/transfers/route.ts
import { NextRequest, NextResponse } from "next/server";
import { transfers, nextTransferId, prescriptions } from "@/lib/store";

export async function GET() {
  // Join transfer data with prescription and pharmacy info
  return NextResponse.json(transfers);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { prescriptionId, sourcePharmacyId } = body;

  const newTransfer = {
    id: nextTransferId(),
    prescriptionId,
    sourcePharmacyId,
    status: "submitted" as const,
    createdAt: new Date().toISOString(),
  };

  transfers.push(newTransfer);
  return NextResponse.json(newTransfer, { status: 201 });
}
```

```ts
// src/app/api/transfers/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { transfers } from "@/lib/store";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const transfer = transfers.find((t) => t.id === id);

  if (!transfer) {
    return NextResponse.json({ error: "Transfer not found" }, { status: 404 });
  }

  if (body.status) {
    transfer.status = body.status;
  }

  return NextResponse.json(transfer);
}
```

```ts
// src/app/api/prescriptions/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prescriptions } from "@/lib/store";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const prescription = prescriptions.find((p) => p.id === id);

  if (!prescription) {
    return NextResponse.json({ error: "Prescription not found" }, { status: 404 });
  }

  return NextResponse.json(prescription);
}
```

**Step 3: Test all endpoints**

Run `npm run dev` and test with curl:

```bash
curl http://localhost:3000/api/pharmacies
curl http://localhost:3000/api/transfers
curl http://localhost:3000/api/prescriptions/rx-1
curl -X POST http://localhost:3000/api/transfers -H "Content-Type: application/json" -d '{"prescriptionId":"rx-1","sourcePharmacyId":"ph-2"}'
curl -X PATCH http://localhost:3000/api/transfers/tx-1 -H "Content-Type: application/json" -d '{"status":"transferred"}'
```

**Step 4: Commit**

```bash
git add src/app/api
git commit -m "feat: add mock API routes for pharmacies, transfers, and prescriptions"
```

---

### Task 4: Demo Layout Shell & iPhone Frame

**Files:**
- Create: `src/components/IPhoneFrame.tsx`
- Create: `src/components/DemoSidebar.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css`

**Step 1: Build the iPhone frame component**

A pure CSS device mockup. Renders children inside a ~390x844 viewport with:
- Rounded corners (border-radius ~50px)
- Dynamic island notch at top
- Home indicator bar at bottom
- Dark bezel border
- Status bar with time, signal, wifi, battery icons

```tsx
// src/components/IPhoneFrame.tsx
"use client";

export default function IPhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto" style={{ width: 390, height: 844 }}>
      {/* Device bezel */}
      <div className="absolute inset-0 rounded-[50px] border-[8px] border-[#1a1a1a] bg-[#1a1a1a] shadow-2xl overflow-hidden">
        {/* Screen area */}
        <div className="relative h-full w-full bg-[#F5F5F0] rounded-[42px] overflow-hidden">
          {/* Dynamic island */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[120px] h-[34px] bg-black rounded-full z-50" />

          {/* Status bar */}
          <div className="relative z-40 flex justify-between items-center px-8 pt-4 h-[54px]">
            <span className="text-sm font-semibold">9:41</span>
            <div className="flex items-center gap-1">
              <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
                <rect x="0" y="6" width="3" height="6" rx="0.5" />
                <rect x="4.5" y="4" width="3" height="8" rx="0.5" />
                <rect x="9" y="1.5" width="3" height="10.5" rx="0.5" />
                <rect x="13.5" y="0" width="2.5" height="12" rx="0.5" opacity="0.3" />
              </svg>
              <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
                <path d="M8 3.5C9.8 3.5 11.4 4.2 12.6 5.3L14 3.9C12.4 2.4 10.3 1.5 8 1.5S3.6 2.4 2 3.9L3.4 5.3C4.6 4.2 6.2 3.5 8 3.5Z" />
                <path d="M8 7C9 7 9.9 7.4 10.5 8L12 6.5C11 5.6 9.6 5 8 5S5 5.6 4 6.5L5.5 8C6.1 7.4 7 7 8 7Z" />
                <circle cx="8" cy="10.5" r="1.5" />
              </svg>
              <svg width="27" height="13" viewBox="0 0 27 13" fill="currentColor">
                <rect x="0" y="1" width="23" height="11" rx="2" stroke="currentColor" strokeWidth="1" fill="none" />
                <rect x="1.5" y="2.5" width="19" height="8" rx="1" />
                <rect x="24" y="4.5" width="2.5" height="4" rx="1" opacity="0.4" />
              </svg>
            </div>
          </div>

          {/* App content */}
          <div className="h-[calc(100%-54px)] overflow-y-auto">
            {children}
          </div>

          {/* Home indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[134px] h-[5px] bg-black rounded-full opacity-20 z-50" />
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Build the demo sidebar**

```tsx
// src/components/DemoSidebar.tsx
"use client";

import { TransferStatus } from "@/lib/types";
import Link from "next/link";

type DemoView = "home" | "transfer-modal" | "tracker";

const TRACKER_STATES: { value: TransferStatus; label: string; message: string }[] = [
  { value: "submitted", label: "Submitted", message: "Transfer request submitted." },
  { value: "reviewed", label: "Reviewed", message: "Prescription reviewed by our team." },
  { value: "requested", label: "Requested", message: "Awaiting pharmacy transfer confirmation." },
  { value: "transferred", label: "Transferred", message: "Prescription transferred successfully." },
  { value: "completed", label: "Completed", message: "Your prescription is ready for fulfillment." },
];

interface DemoSidebarProps {
  currentView: DemoView;
  onViewChange: (view: DemoView) => void;
  trackerState: TransferStatus;
  onTrackerStateChange: (state: TransferStatus) => void;
}

export default function DemoSidebar({
  currentView,
  onViewChange,
  trackerState,
  onTrackerStateChange,
}: DemoSidebarProps) {
  return (
    <div className="w-[300px] shrink-0 border-r border-gray-200 bg-white p-6 flex flex-col gap-8 h-screen overflow-y-auto">
      <div>
        <h1 className="text-lg font-bold text-gray-900">Prescription Transfer</h1>
        <p className="text-sm text-gray-500 mt-1">Interactive prototype demo</p>
      </div>

      {/* View Switcher */}
      <div>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Current View</h2>
        <div className="flex flex-col gap-1.5">
          {([
            { value: "home" as const, label: "Home" },
            { value: "transfer-modal" as const, label: "Transfer Modal" },
            { value: "tracker" as const, label: "Tracker" },
          ]).map((view) => (
            <button
              key={view.value}
              onClick={() => onViewChange(view.value)}
              className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === view.value
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {view.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tracker State */}
      {currentView === "tracker" && (
        <div>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Tracker State</h2>
          <div className="flex flex-col gap-1">
            {TRACKER_STATES.map((state) => (
              <button
                key={state.value}
                onClick={() => onTrackerStateChange(state.value)}
                className={`text-left px-3 py-2.5 rounded-lg transition-colors ${
                  trackerState === state.value
                    ? "bg-emerald-50 border border-emerald-200"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className={`text-sm font-medium ${
                  trackerState === state.value ? "text-emerald-700" : "text-gray-700"
                }`}>
                  {state.label}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">{state.message}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Links */}
      <div className="mt-auto pt-4 border-t border-gray-100">
        <Link
          href="/pharmacy"
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          Open Pharmacy Dashboard →
        </Link>
      </div>
    </div>
  );
}
```

**Step 3: Wire up the main page**

```tsx
// src/app/page.tsx
"use client";

import { useState } from "react";
import IPhoneFrame from "@/components/IPhoneFrame";
import DemoSidebar from "@/components/DemoSidebar";
import { TransferStatus } from "@/lib/types";

type DemoView = "home" | "transfer-modal" | "tracker";

export default function Home() {
  const [currentView, setCurrentView] = useState<DemoView>("home");
  const [trackerState, setTrackerState] = useState<TransferStatus>("submitted");

  return (
    <div className="flex h-screen bg-gray-50">
      <DemoSidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        trackerState={trackerState}
        onTrackerStateChange={setTrackerState}
      />
      <div className="flex-1 flex items-center justify-center">
        <IPhoneFrame>
          <div className="p-4 pt-2 text-gray-900">
            <p className="text-sm text-gray-400">
              Current: {currentView} / {trackerState}
            </p>
          </div>
        </IPhoneFrame>
      </div>
    </div>
  );
}
```

**Step 4: Update globals.css**

Ensure `src/app/globals.css` has only Tailwind directives plus Inter font import:

```css
@import "tailwindcss";

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body {
  font-family: 'Inter', system-ui, sans-serif;
}
```

**Step 5: Verify layout renders**

Run `npm run dev`, visit http://localhost:3000. Should see sidebar on left, iPhone frame centered in remaining space, placeholder text inside frame.

**Step 6: Commit**

```bash
git add src/components/IPhoneFrame.tsx src/components/DemoSidebar.tsx src/app/page.tsx src/app/globals.css
git commit -m "feat: add demo layout shell with iPhone frame and sidebar controls"
```

---

### Task 5: Patient App — Home Screen (Pre-Transfer)

**Files:**
- Create: `src/components/patient/HomeScreen.tsx`
- Create: `src/components/patient/BottomTabBar.tsx`
- Create: `src/components/patient/PrescriptionCard.tsx`
- Create: `src/components/patient/TransferCTACard.tsx`

**Step 1: Build the bottom tab bar**

```tsx
// src/components/patient/BottomTabBar.tsx
"use client";

import { Home, Heart, ShoppingBag, User } from "lucide-react";

const tabs = [
  { icon: Home, label: "Home", active: true },
  { icon: Heart, label: "Care", active: false },
  { icon: ShoppingBag, label: "Shop", active: false },
  { icon: User, label: "Profile", active: false },
];

export default function BottomTabBar() {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 pb-6 pt-2 z-40">
      <div className="flex justify-between">
        {tabs.map((tab) => (
          <button key={tab.label} className="flex flex-col items-center gap-0.5">
            <tab.icon
              size={22}
              strokeWidth={tab.active ? 2.5 : 1.5}
              className={tab.active ? "text-gray-900" : "text-gray-400"}
            />
            <span className={`text-[10px] ${tab.active ? "text-gray-900 font-medium" : "text-gray-400"}`}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
```

**Step 2: Build the existing prescription card**

```tsx
// src/components/patient/PrescriptionCard.tsx
"use client";

import { ArrowRight } from "lucide-react";

export default function PrescriptionCard() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-orange-500 text-sm font-semibold">fx</span>
          <span className="font-semibold text-gray-900">Smoking cessation</span>
        </div>
        <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center">
          <ArrowRight size={14} className="text-gray-600" />
        </button>
      </div>
      <div className="mt-3 flex justify-between text-xs">
        <span className="text-gray-400 uppercase tracking-wider">Orders left</span>
        <span className="text-gray-900 font-medium">3</span>
      </div>
      <div className="flex justify-between text-xs mt-1">
        <span className="text-gray-400 uppercase tracking-wider">Next order</span>
        <span className="text-gray-900 font-medium">Oct 31</span>
      </div>
    </div>
  );
}
```

**Step 3: Build the transfer CTA card**

```tsx
// src/components/patient/TransferCTACard.tsx
"use client";

interface TransferCTACardProps {
  onPress: () => void;
}

export default function TransferCTACard({ onPress }: TransferCTACardProps) {
  return (
    <button onClick={onPress} className="bg-white rounded-2xl p-5 shadow-sm text-left w-[200px] shrink-0">
      <h3 className="font-semibold text-gray-900 text-[15px] leading-tight">
        Transfer your prescriptions to Felix
      </h3>
      <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
        Free delivery, auto refills & renewals.
      </p>
      {/* Pill imagery placeholder - colored circles */}
      <div className="flex gap-2 mt-4">
        <div className="w-12 h-12 rounded-full bg-cyan-200" />
        <div className="w-12 h-12 rounded-full bg-amber-300" />
        <div className="w-12 h-12 rounded-full bg-gray-100" />
      </div>
    </button>
  );
}
```

**Step 4: Compose the home screen**

```tsx
// src/components/patient/HomeScreen.tsx
"use client";

import PrescriptionCard from "./PrescriptionCard";
import TransferCTACard from "./TransferCTACard";
import BottomTabBar from "./BottomTabBar";

interface HomeScreenProps {
  onTransferPress: () => void;
}

export default function HomeScreen({ onTransferPress }: HomeScreenProps) {
  return (
    <div className="relative h-full">
      <div className="px-5 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between pt-2 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Home</h1>
          <div className="flex items-center gap-1.5 bg-purple-50 rounded-full px-3 py-1.5">
            <span className="text-purple-600 text-xs font-semibold">fx</span>
            <span className="text-sm font-semibold text-gray-900">3,600</span>
          </div>
        </div>

        {/* Care section */}
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Care</h2>
        <PrescriptionCard />

        {/* For you section */}
        <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">For you</h2>
        <div className="flex gap-3 overflow-x-auto -mx-5 px-5 pb-2">
          <TransferCTACard onPress={onTransferPress} />
          <div className="bg-white rounded-2xl p-5 shadow-sm w-[200px] shrink-0">
            <h3 className="font-semibold text-gray-900 text-[15px] leading-tight">
              Everyday wellness
            </h3>
            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
              Hand-picked products that support your health and wellbeing.
            </p>
          </div>
        </div>
      </div>
      <BottomTabBar />
    </div>
  );
}
```

**Step 5: Wire into main page (replace placeholder)**

Update `src/app/page.tsx` to render `<HomeScreen />` inside the iPhone frame when `currentView === "home"`.

**Step 6: Verify visually**

Run `npm run dev`. The home screen should render inside the phone frame matching the design mockup.

**Step 7: Commit**

```bash
git add src/components/patient/
git commit -m "feat: add patient home screen with prescription card and transfer CTA"
```

---

### Task 6: Patient App — Transfer Modal (Bottom Sheet)

**Files:**
- Create: `src/components/patient/TransferModal.tsx`

**Step 1: Build the transfer modal**

A Framer Motion animated bottom sheet. Contains: close button, title, subtitle, address input, pharmacy list with radio selection, continue button. The pharmacy list is fetched from `/api/pharmacies`.

```tsx
// src/components/patient/TransferModal.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Pharmacy } from "@/lib/types";

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (pharmacyId: string) => void;
}

export default function TransferModal({ isOpen, onClose, onSubmit }: TransferModalProps) {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [address, setAddress] = useState("101 Peter St, Toronto, ON, M5V 0G6");

  useEffect(() => {
    if (isOpen) {
      fetch("/api/pharmacies")
        .then((r) => r.json())
        .then(setPharmacies);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black z-40"
            onClick={onClose}
          />
          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 flex flex-col"
            style={{ height: "92%" }}
          >
            {/* Close button */}
            <button onClick={onClose} className="p-5 self-start">
              <X size={20} className="text-gray-900" />
            </button>

            <div className="px-5 flex-1 overflow-y-auto pb-24">
              <h2 className="text-2xl font-bold text-gray-900">Transfer your prescription</h2>
              <p className="text-gray-500 mt-1">Search and select your current pharmacy.</p>

              {/* Address input */}
              <div className="mt-6 flex items-center bg-gray-100 rounded-full px-4 py-3">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-gray-900 outline-none"
                />
                {address && (
                  <button onClick={() => setAddress("")}>
                    <X size={16} className="text-gray-400" />
                  </button>
                )}
              </div>

              {/* Pharmacy list */}
              <p className="text-sm text-gray-500 mt-6 mb-3">Choose a pharmacy below</p>
              <div className="flex flex-col gap-2">
                {pharmacies.map((pharmacy) => (
                  <button
                    key={pharmacy.id}
                    onClick={() => setSelectedId(pharmacy.id)}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-colors ${
                      selectedId === pharmacy.id
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-semibold text-gray-900 text-sm">{pharmacy.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{pharmacy.address}</div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedId === pharmacy.id ? "border-gray-900" : "border-gray-300"
                    }`}>
                      {selectedId === pharmacy.id && (
                        <div className="w-2.5 h-2.5 rounded-full bg-gray-900" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Continue button */}
            <div className="absolute bottom-0 left-0 right-0 p-5 bg-white">
              <button
                onClick={() => selectedId && onSubmit(selectedId)}
                disabled={!selectedId}
                className="w-full bg-[#1a1a1a] text-white py-4 rounded-full font-semibold text-sm disabled:opacity-40 transition-opacity"
              >
                Continue
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

**Step 2: Wire into main page**

Update `src/app/page.tsx`:
- When `currentView === "home"`, render `<HomeScreen>` with `onTransferPress` opening the modal
- When `currentView === "transfer-modal"`, also show the modal open over home
- On submit: POST to `/api/transfers`, then switch to tracker view

**Step 3: Verify the full flow**

Click the CTA card → modal slides up → select pharmacy → hit Continue → view transitions to tracker.

**Step 4: Commit**

```bash
git add src/components/patient/TransferModal.tsx src/app/page.tsx
git commit -m "feat: add animated transfer modal with pharmacy selection"
```

---

### Task 7: Patient App — Tracker View

**Files:**
- Create: `src/components/patient/TrackerCard.tsx`
- Create: `src/components/patient/TrackerHomeScreen.tsx`

**Step 1: Build the progress tracker component**

```tsx
// src/components/patient/TrackerCard.tsx
"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { TransferStatus } from "@/lib/types";

const STEPS = ["reviewed", "requested", "transferred"] as const;
const STATUS_ORDER: TransferStatus[] = ["submitted", "reviewed", "requested", "transferred", "completed"];

const STATUS_MESSAGES: Record<TransferStatus, string> = {
  submitted: "Transfer request submitted.",
  reviewed: "Prescription reviewed by our team.",
  requested: "Awaiting pharmacy transfer confirmation.",
  transferred: "Prescription transferred successfully.",
  completed: "Your prescription is ready for fulfillment.",
};

interface TrackerCardProps {
  drugName: string;
  status: TransferStatus;
}

export default function TrackerCard({ drugName, status }: TrackerCardProps) {
  const statusIndex = STATUS_ORDER.indexOf(status);

  // Map status to progress percentage (0-100)
  const progressPercent =
    status === "submitted" ? 5 :
    status === "reviewed" ? 33 :
    status === "requested" ? 66 :
    100; // transferred or completed

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="font-semibold text-gray-900">{drugName}</span>
        <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center">
          <ArrowRight size={14} className="text-gray-600" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="relative h-1.5 bg-gray-200 rounded-full mb-2">
        <motion.div
          className="absolute top-0 left-0 h-full rounded-full"
          style={{ background: "linear-gradient(90deg, #a3d9a5, #7bc47f)" }}
          initial={{ width: "0%" }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        {/* Dots */}
        {STEPS.map((step, i) => {
          const dotPosition = (i + 1) * 33;
          const isActive = statusIndex >= STATUS_ORDER.indexOf(step);
          return (
            <motion.div
              key={step}
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2"
              style={{ left: `${dotPosition}%`, marginLeft: -6 }}
              animate={{
                backgroundColor: isActive ? "#7bc47f" : "#e5e7eb",
                borderColor: isActive ? "#7bc47f" : "#e5e7eb",
              }}
              transition={{ duration: 0.3 }}
            />
          );
        })}
      </div>

      {/* Step labels */}
      <div className="flex justify-between text-[10px] text-gray-400 mb-3 px-1">
        {STEPS.map((step) => (
          <span key={step} className="capitalize">{step}</span>
        ))}
      </div>

      {/* Status message */}
      <p className="text-sm text-gray-500">{STATUS_MESSAGES[status]}</p>
    </div>
  );
}
```

**Step 2: Build the tracker home screen**

```tsx
// src/components/patient/TrackerHomeScreen.tsx
"use client";

import TrackerCard from "./TrackerCard";
import BottomTabBar from "./BottomTabBar";
import { TransferStatus } from "@/lib/types";

interface TrackerHomeScreenProps {
  status: TransferStatus;
}

export default function TrackerHomeScreen({ status }: TrackerHomeScreenProps) {
  return (
    <div className="relative h-full">
      <div className="px-5 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between pt-2 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Home</h1>
          <div className="flex items-center gap-1.5 bg-purple-50 rounded-full px-3 py-1.5">
            <span className="text-purple-600 text-xs font-semibold">fx</span>
            <span className="text-sm font-semibold text-gray-900">3,600</span>
          </div>
        </div>

        {/* Care section with tracker */}
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Care</h2>
        <TrackerCard drugName="Nizatidine" status={status} />

        {/* For you section (without transfer CTA) */}
        <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">For you</h2>
        <div className="flex gap-3 overflow-x-auto -mx-5 px-5 pb-2">
          <div className="bg-white rounded-2xl p-5 shadow-sm w-[200px] shrink-0">
            <h3 className="font-semibold text-gray-900 text-[15px] leading-tight">
              Everyday wellness
            </h3>
            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
              Hand-picked products that support your health and wellbeing.
            </p>
          </div>
        </div>
      </div>
      <BottomTabBar />
    </div>
  );
}
```

**Step 3: Wire into main page**

Update `src/app/page.tsx` so when `currentView === "tracker"`, render `<TrackerHomeScreen status={trackerState} />`. The sidebar tracker state toggles should animate the progress bar in real time.

**Step 4: Verify**

Toggle through all 5 tracker states in the sidebar. Progress bar and messages should update with smooth animations.

**Step 5: Commit**

```bash
git add src/components/patient/TrackerCard.tsx src/components/patient/TrackerHomeScreen.tsx src/app/page.tsx
git commit -m "feat: add transfer tracker with animated progress bar and state controls"
```

---

### Task 8: Pharmacy Dashboard

**Files:**
- Create: `src/app/pharmacy/page.tsx`
- Create: `src/components/pharmacy/TransferTable.tsx`
- Create: `src/components/pharmacy/PrescriptionDetail.tsx`

**Step 1: Build the transfer table**

```tsx
// src/components/pharmacy/TransferTable.tsx
"use client";

import { Transfer, TransferStatus, Prescription, Pharmacy } from "@/lib/types";

const STATUS_COLORS: Record<TransferStatus, string> = {
  submitted: "bg-gray-100 text-gray-600",
  reviewed: "bg-blue-100 text-blue-700",
  requested: "bg-amber-100 text-amber-700",
  transferred: "bg-emerald-100 text-emerald-700",
  completed: "bg-emerald-100 text-emerald-700",
};

interface TransferRow {
  transfer: Transfer;
  prescription: Prescription;
  pharmacy: Pharmacy;
}

interface TransferTableProps {
  rows: TransferRow[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function TransferTable({ rows, selectedId, onSelect }: TransferTableProps) {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-200 text-xs text-gray-400 uppercase tracking-wider">
          <th className="text-left py-3 px-4 font-medium">Patient</th>
          <th className="text-left py-3 px-4 font-medium">Medication</th>
          <th className="text-left py-3 px-4 font-medium">Source Pharmacy</th>
          <th className="text-left py-3 px-4 font-medium">Status</th>
          <th className="text-left py-3 px-4 font-medium">Date</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(({ transfer, prescription, pharmacy }) => (
          <tr
            key={transfer.id}
            onClick={() => onSelect(transfer.id)}
            className={`border-b border-gray-100 cursor-pointer transition-colors ${
              selectedId === transfer.id ? "bg-gray-50" : "hover:bg-gray-50"
            }`}
          >
            <td className="py-3 px-4 text-sm font-medium text-gray-900">{prescription.patientName}</td>
            <td className="py-3 px-4 text-sm text-gray-600">{prescription.drugName}</td>
            <td className="py-3 px-4 text-sm text-gray-600">{pharmacy.name}</td>
            <td className="py-3 px-4">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[transfer.status]}`}>
                {transfer.status}
              </span>
            </td>
            <td className="py-3 px-4 text-sm text-gray-400">
              {new Date(transfer.createdAt).toLocaleDateString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

**Step 2: Build the prescription detail panel**

```tsx
// src/components/pharmacy/PrescriptionDetail.tsx
"use client";

import { Transfer, Prescription, Pharmacy, TransferStatus } from "@/lib/types";

const NEXT_STATUS: Partial<Record<TransferStatus, { status: TransferStatus; label: string }>> = {
  submitted: { status: "reviewed", label: "Mark as Reviewed" },
  reviewed: { status: "requested", label: "Request Transfer" },
  requested: { status: "transferred", label: "Confirm Transferred" },
  transferred: { status: "completed", label: "Mark Completed" },
};

interface PrescriptionDetailProps {
  transfer: Transfer;
  prescription: Prescription;
  pharmacy: Pharmacy;
  onAdvanceStatus: (transferId: string, newStatus: TransferStatus) => void;
}

export default function PrescriptionDetail({
  transfer,
  prescription,
  pharmacy,
  onAdvanceStatus,
}: PrescriptionDetailProps) {
  const next = NEXT_STATUS[transfer.status];

  return (
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

      {next && (
        <button
          onClick={() => onAdvanceStatus(transfer.id, next.status)}
          className="mt-6 w-full bg-[#1a1a1a] text-white py-3 rounded-lg font-semibold text-sm hover:bg-gray-800 transition-colors"
        >
          {next.label}
        </button>
      )}

      {transfer.status === "completed" && (
        <div className="mt-6 text-center text-sm text-emerald-600 font-medium">
          Transfer completed
        </div>
      )}
    </div>
  );
}
```

**Step 3: Build the pharmacy dashboard page**

```tsx
// src/app/pharmacy/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import TransferTable from "@/components/pharmacy/TransferTable";
import PrescriptionDetail from "@/components/pharmacy/PrescriptionDetail";
import { Transfer, Prescription, Pharmacy, TransferStatus } from "@/lib/types";

interface TransferRow {
  transfer: Transfer;
  prescription: Prescription;
  pharmacy: Pharmacy;
}

export default function PharmacyDashboard() {
  const [rows, setRows] = useState<TransferRow[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

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

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAdvanceStatus = async (transferId: string, newStatus: TransferStatus) => {
    await fetch(`/api/transfers/${transferId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchData();
  };

  const selectedRow = rows.find((r) => r.transfer.id === selectedId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900">Pharmacy Dashboard</h1>
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
          ← Patient Demo
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
              onAdvanceStatus={handleAdvanceStatus}
            />
          </div>
        )}
      </div>
    </div>
  );
}
```

**Step 4: Verify the dashboard**

Visit http://localhost:3000/pharmacy. Should see 2 seed transfers in the table. Click a row to see details. Click action button to advance status.

**Step 5: Commit**

```bash
git add src/app/pharmacy/ src/components/pharmacy/
git commit -m "feat: add pharmacy dashboard with transfer table and prescription detail panel"
```

---

### Task 9: Polish & Animations

**Files:**
- Modify: `src/app/page.tsx` (add crossfade transitions between views)
- Modify: `src/components/pharmacy/PrescriptionDetail.tsx` (add toast on status advance)
- Create: `src/components/Toast.tsx`

**Step 1: Add crossfade transitions between phone views**

Wrap the view switcher in `src/app/page.tsx` with Framer Motion `AnimatePresence` and `motion.div` for crossfade:

```tsx
<AnimatePresence mode="wait">
  <motion.div
    key={currentView}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
  >
    {/* current screen */}
  </motion.div>
</AnimatePresence>
```

**Step 2: Add a simple toast component**

```tsx
// src/components/Toast.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ToastProps {
  message: string;
  isVisible: boolean;
}

export default function Toast({ message, isVisible }: ToastProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 right-6 bg-gray-900 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium z-50"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

**Step 3: Wire toast into pharmacy dashboard**

Show toast for 2 seconds when a status is advanced (e.g., "Status updated to Reviewed").

**Step 4: Verify all animations**

- Crossfade between home/tracker views
- Bottom sheet spring animation
- Progress bar animation
- Toast appears on pharmacy dashboard

**Step 5: Commit**

```bash
git add src/app/page.tsx src/components/Toast.tsx src/app/pharmacy/page.tsx src/components/pharmacy/PrescriptionDetail.tsx
git commit -m "feat: add polish animations - crossfade transitions, toast notifications"
```

---

### Task 10: Final Integration & Cleanup

**Files:**
- Modify: `src/app/page.tsx` (ensure sidebar state syncs with API)
- All files: final review and cleanup

**Step 1: Sync sidebar tracker state with API**

When the sidebar tracker state changes, also PATCH the transfer via the API so both the patient demo and pharmacy dashboard stay in sync. Add a `useEffect` that calls the PATCH endpoint when `trackerState` changes.

**Step 2: Auto-refresh pharmacy dashboard**

Add a 3-second polling interval on the pharmacy page so it picks up changes made from the patient demo sidebar.

**Step 3: Full end-to-end test**

1. Visit `/` — see home screen with transfer CTA
2. Click CTA → modal opens → select pharmacy → Continue
3. View transitions to tracker showing "Submitted"
4. Toggle sidebar states — progress bar animates
5. Visit `/pharmacy` — see the transfer in the table
6. Click row → see prescription details
7. Advance status from pharmacy → patient tracker updates
8. All animations are smooth

**Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete prescription transfer demo with full integration"
```
