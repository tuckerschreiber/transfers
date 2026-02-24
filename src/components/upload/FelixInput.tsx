"use client";

import { useId } from "react";

interface FelixInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

export default function FelixInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
}: FelixInputProps) {
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
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          fontSize: 16,
          padding: 12,
          border: "0.5px solid var(--felix-border)",
          borderRadius: 12,
          outline: "none",
          color: "var(--felix-text-primary)",
          boxSizing: "border-box",
          fontFamily: "inherit",
        }}
        onFocus={(e) => {
          e.currentTarget.style.border = "0.125rem solid var(--felix-focus)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.border = "0.5px solid var(--felix-border)";
        }}
      />
    </div>
  );
}
