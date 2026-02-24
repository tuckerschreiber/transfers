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
