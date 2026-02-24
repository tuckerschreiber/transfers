"use client";

import { CheckCircle, ClipboardCheck, Shield, DollarSign } from "lucide-react";

const bulletItems = [
  {
    icon: ClipboardCheck,
    text: "Our pharmacist will verify your prescription details",
  },
  {
    icon: Shield,
    text: "We'll confirm your insurance coverage and pricing",
  },
  {
    icon: DollarSign,
    text: "You'll only be charged once your order is ready to ship",
  },
];

export default function StepConfirmation() {
  return (
    <div className="flex flex-col items-center pt-12 text-center">
      {/* Checkmark icon */}
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
        style={{ backgroundColor: "rgba(222, 120, 31, 0.1)" }}
      >
        <CheckCircle size={32} style={{ color: "var(--tp-primary)" }} />
      </div>

      {/* Heading */}
      <h1
        className="text-[24px] font-bold mb-3"
        style={{ color: "var(--tp-text-primary)" }}
      >
        Prescription received. We&apos;ll review it and get back to you.
      </h1>

      {/* Subtext */}
      <p
        className="text-[16px] mb-8"
        style={{ color: "var(--tp-text-secondary)" }}
      >
        Our pharmacy team is reviewing your prescription. You&apos;ll receive an
        update within 24 hours.
      </p>

      {/* Bullet items */}
      <div className="flex flex-col gap-4 w-full max-w-[400px]">
        {bulletItems.map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-3 text-left">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: "rgba(222, 120, 31, 0.1)" }}
            >
              <Icon size={20} style={{ color: "var(--tp-primary)" }} />
            </div>
            <span
              className="text-[14px]"
              style={{ color: "var(--tp-text-primary)" }}
            >
              {text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
