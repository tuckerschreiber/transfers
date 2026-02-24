"use client";

import { Check } from "lucide-react";

interface StepConsentProps {
  priceConsent: boolean;
  counselingConsent: boolean;
  onPriceConsentChange: (value: boolean) => void;
  onCounselingConsentChange: (value: boolean) => void;
}

function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        textAlign: "left",
        width: "100%",
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          minWidth: 20,
          borderRadius: 4,
          border: checked ? "none" : "0.5px solid var(--felix-border)",
          backgroundColor: checked ? "var(--felix-primary)" : "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 2,
          transition: "background-color 0.15s, border 0.15s",
        }}
      >
        {checked && <Check size={14} color="white" strokeWidth={3} />}
      </div>
      <span
        style={{
          fontSize: 16,
          color: "var(--felix-text-primary)",
          lineHeight: 1.5,
        }}
      >
        {label}
      </span>
    </button>
  );
}

export default function StepConsent({
  priceConsent,
  counselingConsent,
  onPriceConsentChange,
  onCounselingConsentChange,
}: StepConsentProps) {
  return (
    <div>
      <h1
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: "var(--felix-text-primary)",
          marginBottom: 8,
        }}
      >
        Review and consent
      </h1>
      <p
        style={{
          fontSize: 16,
          color: "var(--felix-text-secondary)",
          marginBottom: 32,
          lineHeight: 1.5,
        }}
      >
        Please review and accept the following before submitting
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <Checkbox
          checked={priceConsent}
          onChange={onPriceConsentChange}
          label="I understand I'll be charged once my prescription is filled and insurance coverage is confirmed"
        />
        <Checkbox
          checked={counselingConsent}
          onChange={onCounselingConsentChange}
          label="I consent to pharmacist counseling as required"
        />
      </div>
    </div>
  );
}
