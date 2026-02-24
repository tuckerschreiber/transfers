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

          return (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`w-[10px] h-[10px] rounded-full flex items-center justify-center transition-colors duration-200 ${
                    isCompleted
                      ? "bg-[var(--tp-primary)]"
                      : isCurrent
                      ? "bg-[var(--tp-primary)]"
                      : "border-[1.5px] border-[var(--tp-border)] bg-white"
                  }`}
                >
                  {isCompleted && (
                    <Check className="w-[6px] h-[6px] text-white" strokeWidth={3} />
                  )}
                </div>
                <span
                  className={`text-[14px] mt-2 whitespace-nowrap transition-colors duration-200 ${
                    isCompleted || isCurrent
                      ? "text-[var(--tp-text-primary)] font-medium"
                      : "text-[var(--tp-text-tertiary)]"
                  }`}
                >
                  {label}
                </span>
              </div>

              {i < STEPS.length - 1 && (
                <div
                  className={`h-[2px] flex-1 mx-2 transition-colors duration-200 ${
                    i < currentStep
                      ? "bg-[var(--tp-primary)]"
                      : "bg-[var(--tp-border)]"
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
