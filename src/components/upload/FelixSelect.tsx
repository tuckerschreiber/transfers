"use client";

import { useId } from "react";

interface FelixSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
}

export default function FelixSelect({
  label,
  value,
  onChange,
  options,
  required = false,
}: FelixSelectProps) {
  const id = useId();

  return (
    <div style={{ marginBottom: 16 }}>
      <label
        htmlFor={id}
        style={{
          display: "block",
          fontSize: 14,
          color: "var(--felix-text-secondary)",
          marginBottom: 8,
        }}
      >
        {label}
        {required && (
          <span style={{ color: "var(--felix-primary)", marginLeft: 2 }}>*</span>
        )}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          fontSize: 16,
          padding: 12,
          border: "0.5px solid var(--felix-border)",
          borderRadius: 12,
          outline: "none",
          color: value ? "var(--felix-text-primary)" : "var(--felix-text-tertiary)",
          backgroundColor: "white",
          appearance: "none",
          boxSizing: "border-box",
          fontFamily: "inherit",
        }}
        onFocus={(e) => {
          e.currentTarget.style.border = "0.125rem solid var(--felix-focus)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.border = "0.5px solid var(--felix-border)";
        }}
      >
        <option value="" style={{ color: "var(--felix-text-tertiary)" }}>
          Select...
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
