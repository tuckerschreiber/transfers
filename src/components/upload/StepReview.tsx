"use client";

import Image from "next/image";

interface StepReviewProps {
  previewUrl: string | null;
  prescriptionDetails: {
    medicationName: string;
    dose: string;
    quantity: string;
    prescriberName: string;
    dateWritten: string;
  };
  insuranceDetails: {
    province: string;
    insuranceProvider: string;
    insurancePolicyNumber: string;
    insuranceGroupNumber: string;
  };
  deliveryDetails: {
    street: string;
    unit: string;
    city: string;
    province: string;
    postalCode: string;
  };
  onEditStep: (step: number) => void;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-[14px]" style={{ color: "var(--felix-text-secondary)" }}>
        {label}
      </span>
      <span className="text-[14px] font-medium" style={{ color: "var(--felix-text-primary)" }}>
        {value}
      </span>
    </div>
  );
}

function CardHeader({ title, onEdit }: { title: string; onEdit: () => void }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-[16px] font-semibold" style={{ color: "var(--felix-text-primary)" }}>
        {title}
      </h3>
      <button
        onClick={onEdit}
        className="text-[14px] transition-colors hover:underline"
        style={{ color: "var(--felix-primary)" }}
      >
        Edit
      </button>
    </div>
  );
}

export default function StepReview({
  previewUrl,
  prescriptionDetails,
  insuranceDetails,
  deliveryDetails,
  onEditStep,
}: StepReviewProps) {
  const fullAddress = [
    deliveryDetails.street,
    deliveryDetails.unit,
    deliveryDetails.city,
    deliveryDetails.province,
    deliveryDetails.postalCode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div>
      <h1
        className="text-[24px] font-bold mb-2"
        style={{ color: "var(--felix-text-primary)" }}
      >
        Review your submission
      </h1>
      <p
        className="text-[16px] mb-8"
        style={{ color: "var(--felix-text-secondary)" }}
      >
        Please confirm everything looks correct before submitting
      </p>

      <div className="flex flex-col gap-4">
        {/* Prescription card */}
        <div
          className="rounded-[16px] p-6"
          style={{ border: "1px solid var(--felix-border)" }}
        >
          <CardHeader title="Prescription" onEdit={() => onEditStep(1)} />
          {previewUrl && (
            <div className="mb-3 overflow-hidden rounded-[8px]">
              <Image
                src={previewUrl}
                alt="Prescription"
                width={200}
                height={120}
                className="object-contain"
                style={{ maxHeight: 120 }}
              />
            </div>
          )}
          <DetailRow label="Medication" value={prescriptionDetails.medicationName} />
          <DetailRow label="Dose" value={prescriptionDetails.dose} />
          <DetailRow label="Quantity" value={prescriptionDetails.quantity} />
          <DetailRow label="Prescriber" value={prescriptionDetails.prescriberName} />
          <DetailRow label="Date written" value={prescriptionDetails.dateWritten} />
        </div>

        {/* Insurance card */}
        <div
          className="rounded-[16px] p-6"
          style={{ border: "1px solid var(--felix-border)" }}
        >
          <CardHeader title="Insurance" onEdit={() => onEditStep(2)} />
          <DetailRow label="Province" value={insuranceDetails.province} />
          <DetailRow label="Provider" value={insuranceDetails.insuranceProvider} />
          <DetailRow label="Policy number" value={insuranceDetails.insurancePolicyNumber} />
          {insuranceDetails.insuranceGroupNumber && (
            <DetailRow label="Group number" value={insuranceDetails.insuranceGroupNumber} />
          )}
        </div>

        {/* Delivery card */}
        <div
          className="rounded-[16px] p-6"
          style={{ border: "1px solid var(--felix-border)" }}
        >
          <CardHeader title="Delivery" onEdit={() => onEditStep(3)} />
          <DetailRow label="Address" value={fullAddress} />
        </div>
      </div>
    </div>
  );
}
