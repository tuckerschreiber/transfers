"use client";

import FormInput from "./FormInput";
import FormSelect from "./FormSelect";

export interface DeliveryDetails {
  street: string;
  unit: string;
  city: string;
  province: string;
  postalCode: string;
}

const PROVINCES = [
  { value: "Alberta", label: "Alberta" },
  { value: "British Columbia", label: "British Columbia" },
  { value: "Manitoba", label: "Manitoba" },
  { value: "New Brunswick", label: "New Brunswick" },
  { value: "Newfoundland and Labrador", label: "Newfoundland and Labrador" },
  { value: "Nova Scotia", label: "Nova Scotia" },
  { value: "Ontario", label: "Ontario" },
  { value: "Prince Edward Island", label: "Prince Edward Island" },
  { value: "Quebec", label: "Quebec" },
  { value: "Saskatchewan", label: "Saskatchewan" },
];

interface StepDeliveryProps {
  details: DeliveryDetails;
  onChange: (details: DeliveryDetails) => void;
}

export default function StepDelivery({ details, onChange }: StepDeliveryProps) {
  const update = (field: keyof DeliveryDetails, value: string) => {
    onChange({ ...details, [field]: value });
  };

  return (
    <div>
      <h1
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: "var(--tp-text-primary)",
          marginBottom: 8,
        }}
      >
        Delivery address
      </h1>
      <p
        style={{
          fontSize: 16,
          color: "var(--tp-text-secondary)",
          marginBottom: 32,
          lineHeight: 1.5,
        }}
      >
        Where should we send your medication?
      </p>

      <FormInput
        label="Street address"
        value={details.street}
        onChange={(v) => update("street", v)}
        required
      />
      <FormInput
        label="Unit / Apartment (optional)"
        value={details.unit}
        onChange={(v) => update("unit", v)}
      />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <FormInput
          label="City"
          value={details.city}
          onChange={(v) => update("city", v)}
          required
        />
        <FormSelect
          label="Province"
          value={details.province}
          onChange={(v) => update("province", v)}
          options={PROVINCES}
          required
        />
      </div>
      <FormInput
        label="Postal code"
        value={details.postalCode}
        onChange={(v) => update("postalCode", v)}
        required
      />
    </div>
  );
}
