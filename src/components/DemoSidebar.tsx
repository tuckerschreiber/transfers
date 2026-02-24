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
      <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col gap-2">
        <Link
          href="/transfer-in"
          className="block text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          Open Transfer In Page &rarr;
        </Link>
        <Link
          href="/pharmacy"
          className="block text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          Open Pharmacy Dashboard &rarr;
        </Link>
        <Link
          href="/upload"
          className="block text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          Open Upload Rx Demo &rarr;
        </Link>
      </div>
    </div>
  );
}
