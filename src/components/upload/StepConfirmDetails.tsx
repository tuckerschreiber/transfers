"use client";

import FelixInput from "./FelixInput";

export interface PrescriptionDetails {
  medicationName: string;
  dose: string;
  quantity: string;
  prescriberName: string;
  dateWritten: string;
}

interface StepConfirmDetailsProps {
  previewUrl: string | null;
  details: PrescriptionDetails;
  onChange: (details: PrescriptionDetails) => void;
}

export default function StepConfirmDetails({
  previewUrl,
  details,
  onChange,
}: StepConfirmDetailsProps) {
  const update = (field: keyof PrescriptionDetails, value: string) => {
    onChange({ ...details, [field]: value });
  };

  return (
    <div>
      {/* Heading */}
      <h1
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: "var(--felix-text-primary)",
          margin: 0,
          marginBottom: 8,
        }}
      >
        Confirm your prescription details
      </h1>

      {/* Subtext */}
      <p
        style={{
          fontSize: 16,
          color: "var(--felix-text-secondary)",
          margin: 0,
          marginBottom: 24,
          lineHeight: 1.5,
        }}
      >
        Our pharmacy team will verify these details match your uploaded
        prescription.
      </p>

      {/* Image preview */}
      {previewUrl && (
        <div
          style={{
            marginBottom: 24,
            backgroundColor: "#F5F5F4",
            borderRadius: 12,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={previewUrl}
            alt="Prescription preview"
            style={{
              maxHeight: 200,
              maxWidth: "100%",
              objectFit: "contain",
              display: "block",
            }}
          />
        </div>
      )}

      {/* Form fields */}
      <FelixInput
        label="Medication name"
        value={details.medicationName}
        onChange={(v) => update("medicationName", v)}
        required
        placeholder="e.g. Sertraline"
      />
      <FelixInput
        label="Dose"
        value={details.dose}
        onChange={(v) => update("dose", v)}
        required
        placeholder="e.g. 50mg once daily"
      />
      <FelixInput
        label="Quantity"
        value={details.quantity}
        onChange={(v) => update("quantity", v)}
        type="number"
        required
        placeholder="e.g. 30"
      />
      <FelixInput
        label="Prescriber name"
        value={details.prescriberName}
        onChange={(v) => update("prescriberName", v)}
        required
        placeholder="e.g. Dr. Emily Watson"
      />
      <FelixInput
        label="Date written"
        value={details.dateWritten}
        onChange={(v) => update("dateWritten", v)}
        type="date"
        required
      />
    </div>
  );
}
