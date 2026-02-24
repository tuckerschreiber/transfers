# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Prescription transfer demo prototype for Tucker's Pharmacy. A demo showing how patients transfer prescriptions from external pharmacies, with a "Domino's pizza tracker" style status view. Built to showcase rapid prototyping capability.

## Tech Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS v4 (CSS-based config via `@import "tailwindcss"` — no `tailwind.config.ts`)
- Framer Motion (animations)
- lucide-react (icons)

## Commands

- `npm run dev` — Start dev server on port 3000
- `npm run build` — Production build (also runs TypeScript checking)
- `npm run lint` — ESLint

## Architecture

**Two pages:**
- `/` — Patient demo: sidebar with demo controls + iPhone device frame (CSS mockup at 390x844) containing interactive mobile screens
- `/pharmacy` — Pharmacy dashboard: desktop admin view with transfer table and prescription detail panel

**Data layer:**
- `src/lib/types.ts` — Shared TypeScript types (TransferStatus, Pharmacy, Prescription, Transfer)
- `src/lib/store.ts` — In-memory data store with seed data. Resets on server restart. No database.
- `src/app/api/` — Mock API routes (pharmacies, transfers, prescriptions) that read/write the in-memory store

**Patient demo screens (inside phone frame):**
- HomeScreen → TransferModal (bottom sheet) → TrackerHomeScreen (progress tracker)
- Sidebar controls which screen is shown and overrides tracker state
- Sidebar state changes PATCH the API so pharmacy dashboard stays in sync

**Cross-page sync:**
- Sidebar tracker toggles PATCH `/api/transfers/tx-1`
- Pharmacy dashboard polls every 3 seconds
- Pharmacy dashboard action buttons advance transfer status via PATCH

**Component structure:**
- `src/components/patient/` — Mobile app components (HomeScreen, TransferModal, TrackerCard, BottomTabBar, etc.)
- `src/components/pharmacy/` — Dashboard components (TransferTable, PrescriptionDetail)
- `src/components/` — Shared (IPhoneFrame, DemoSidebar, Toast)
