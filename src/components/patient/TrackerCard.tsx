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
