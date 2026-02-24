"use client";

import { TransferStatus } from "@/lib/types";
import { motion } from "framer-motion";
import { Send, FileText, CheckCircle } from "lucide-react";

const STEPS: {
  status: TransferStatus;
  label: string;
  icon: React.ElementType;
}[] = [
  { status: "requested", label: "Transfer fax sent", icon: Send },
  { status: "transferred", label: "Incoming fax received", icon: FileText },
  { status: "completed", label: "Approved & dispensing", icon: CheckCircle },
];

const STATUS_ORDER: TransferStatus[] = ["submitted", "reviewed", "requested", "transferred", "completed"];

function statusIndex(s: TransferStatus): number {
  return STATUS_ORDER.indexOf(s);
}

interface AutomationTimelineProps {
  currentStatus: TransferStatus;
  actionLog: Record<string, string>; // status -> ISO timestamp
}

export default function AutomationTimeline({ currentStatus, actionLog }: AutomationTimelineProps) {
  const currentIdx = statusIndex(currentStatus);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
        Transfer Progress
      </h4>
      <div className="space-y-1">
        {STEPS.map((step, i) => {
          const stepIdx = statusIndex(step.status);
          const isCompleted = currentIdx >= stepIdx;
          const isCurrent = currentIdx === stepIdx - 1;
          const Icon = step.icon;
          const timestamp = actionLog[step.status];

          return (
            <motion.div
              key={step.status}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex items-center gap-3 py-2 px-2 rounded-lg text-xs ${
                isCompleted
                  ? "text-gray-900"
                  : isCurrent
                  ? "text-amber-600 bg-amber-50"
                  : "text-gray-300"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 ${isCompleted ? "text-emerald-500" : isCurrent ? "text-amber-500" : "text-gray-300"}`} />
              <span className="flex-1 font-medium">{step.label}</span>
              <span className="text-[10px] text-gray-400 font-mono tabular-nums">
                {isCompleted && timestamp
                  ? new Date(timestamp).toLocaleTimeString("en-CA", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })
                  : isCurrent
                  ? "Pending"
                  : "—"}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
