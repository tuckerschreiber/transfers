"use client";

import { useId } from "react";

interface FormSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
}

export default function FormSelect({
  label,
  value,
  onChange,
  options,
  required = false,
}: FormSelectProps) {
  const id = useId();

  return (
    <div style={{ marginBottom: 16 }}>
      <label
        htmlFor={id}
        style={{
          display: "block",
          fontSize: 14,
          color: "var(--tp-text-secondary)",
          marginBottom: 8,
        }}
      >
        {label}
        {required && (
          <span style={{ color: "var(--tp-primary)", marginLeft: 2 }}>*</span>
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
          border: "0.5px solid var(--tp-border)",
          borderRadius: 12,
          outline: "none",
          color: value ? "var(--tp-text-primary)" : "var(--tp-text-tertiary)",
          backgroundColor: "white",
          appearance: "none",
          boxSizing: "border-box",
          fontFamily: "inherit",
        }}
        onFocus={(e) => {
          e.currentTarget.style.border = "0.125rem solid var(--tp-focus)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.border = "0.5px solid var(--tp-border)";
        }}
      >
        <option value="" style={{ color: "var(--tp-text-tertiary)" }}>
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
