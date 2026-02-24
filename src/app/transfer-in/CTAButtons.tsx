"use client";

import Link from "next/link";

export default function CTAButtons() {
  return (
    <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
      <Link
        href="/upload"
        className="inline-block px-8 py-4 rounded-[12px] text-[16px] font-medium text-white transition-colors"
        style={{ backgroundColor: "var(--felix-primary)" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "var(--felix-primary-hover)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "var(--felix-primary)";
        }}
      >
        Upload your prescription
      </Link>
      <button
        onClick={() => {
          document
            .getElementById("how-it-works")
            ?.scrollIntoView({ behavior: "smooth" });
        }}
        className="text-[16px] font-medium transition-colors hover:underline"
        style={{ color: "var(--felix-text-secondary)" }}
      >
        Learn how it works
      </button>
    </div>
  );
}
