"use client";

import Link from "next/link";
import type { UploadStatus } from "@/lib/types";

interface UploadDemoSidebarProps {
  uploadStatus: UploadStatus;
  onStatusChange: (status: UploadStatus) => void;
  onReset: () => void;
}

const STATUS_OPTIONS: { value: UploadStatus; label: string }[] = [
  { value: "under_review", label: "Under Review" },
  { value: "awaiting_patient", label: "Awaiting Patient" },
  { value: "ready_to_fill", label: "Ready to Fill" },
  { value: "filled", label: "Filled" },
  { value: "rejected", label: "Rejected" },
];

export default function UploadDemoSidebar({
  uploadStatus,
  onStatusChange,
  onReset,
}: UploadDemoSidebarProps) {
  return (
    <div
      className="w-[280px] h-screen flex flex-col p-6 shrink-0"
      style={{ backgroundColor: "var(--tp-text-primary)" }}
    >
      {/* Header */}
      <p className="text-[14px] uppercase tracking-wider text-white/50 mb-1">
        Demo Controls
      </p>
      <p className="text-[12px] text-white/30 mb-8">
        Change upload status to sync with pharmacy dashboard
      </p>

      {/* Upload Status */}
      <p className="text-[12px] uppercase tracking-wider text-white/50 mb-3">
        Upload Status
      </p>
      <div className="flex flex-col gap-1">
        {STATUS_OPTIONS.map(({ value, label }) => {
          const isActive = uploadStatus === value;
          return (
            <button
              key={value}
              onClick={() => onStatusChange(value)}
              className={`text-left px-3 py-2 rounded-[8px] text-[14px] transition-colors ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-white/50 hover:bg-white/5"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Bottom section */}
      <div className="mt-auto pt-6 border-t border-white/10 flex flex-col gap-3">
        <button
          onClick={onReset}
          className="w-full px-4 py-2.5 rounded-[8px] text-[14px] text-white/70 bg-white/5 hover:bg-white/10 transition-colors"
        >
          Start Over
        </button>
        <Link
          href="/pharmacy"
          target="_blank"
          className="text-[13px] text-white/40 hover:text-white/60 transition-colors text-center"
        >
          Open Pharmacy Dashboard &rarr;
        </Link>
      </div>
    </div>
  );
}
