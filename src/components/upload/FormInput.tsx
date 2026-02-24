"use client";

import { useId } from "react";

interface FormInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

export default function FormInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
}: FormInputProps) {
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
          border: "0.5px solid var(--tp-border)",
          borderRadius: 12,
          outline: "none",
          color: "var(--tp-text-primary)",
          boxSizing: "border-box",
          fontFamily: "inherit",
        }}
        onFocus={(e) => {
          e.currentTarget.style.border = "0.125rem solid var(--tp-focus)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.border = "0.5px solid var(--tp-border)";
        }}
      />
    </div>
  );
}
