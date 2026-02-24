"use client";

import FelixInput from "./FelixInput";
import FelixSelect from "./FelixSelect";

export interface InsuranceDetails {
  province: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  insuranceGroupNumber: string;
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

interface StepInsuranceProps {
  details: InsuranceDetails;
  onChange: (details: InsuranceDetails) => void;
}

export default function StepInsurance({ details, onChange }: StepInsuranceProps) {
  const update = (field: keyof InsuranceDetails, value: string) => {
    onChange({ ...details, [field]: value });
  };

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
        Insurance information
      </h1>
      <p
        style={{
          fontSize: 16,
          color: "var(--felix-text-secondary)",
          marginBottom: 32,
          lineHeight: 1.5,
        }}
      >
        We&apos;ll check your insurance coverage and let you know what you&apos;ll pay
        before we fill your prescription
      </p>

      <FelixSelect
        label="Province"
        value={details.province}
        onChange={(v) => update("province", v)}
        options={PROVINCES}
        required
      />
      <FelixInput
        label="Insurance provider"
        value={details.insuranceProvider}
        onChange={(v) => update("insuranceProvider", v)}
      />
      <FelixInput
        label="Policy / card number"
        value={details.insurancePolicyNumber}
        onChange={(v) => update("insurancePolicyNumber", v)}
        required
      />
      <FelixInput
        label="Group number (optional)"
        value={details.insuranceGroupNumber}
        onChange={(v) => update("insuranceGroupNumber", v)}
      />
    </div>
  );
}
