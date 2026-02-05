"use client";

import { Transfer, Prescription, Pharmacy, TransferStatus } from "@/lib/types";

const NEXT_STATUS: Partial<Record<TransferStatus, { status: TransferStatus; label: string }>> = {
  submitted: { status: "reviewed", label: "Mark as Reviewed" },
  reviewed: { status: "requested", label: "Request Transfer" },
  requested: { status: "transferred", label: "Confirm Transferred" },
  transferred: { status: "completed", label: "Mark Completed" },
};

interface PrescriptionDetailProps {
  transfer: Transfer;
  prescription: Prescription;
  pharmacy: Pharmacy;
  onAdvanceStatus: (transferId: string, newStatus: TransferStatus) => void;
}

export default function PrescriptionDetail({
  transfer,
  prescription,
  pharmacy,
  onAdvanceStatus,
}: PrescriptionDetailProps) {
  const next = NEXT_STATUS[transfer.status];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="font-bold text-lg text-gray-900 mb-4">Prescription Details</h3>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-400">Drug Name</span>
          <p className="font-medium text-gray-900">{prescription.drugName}</p>
        </div>
        <div>
          <span className="text-gray-400">DIN</span>
          <p className="font-medium text-gray-900">{prescription.din}</p>
        </div>
        <div>
          <span className="text-gray-400">Dosage</span>
          <p className="font-medium text-gray-900">{prescription.dosage}</p>
        </div>
        <div>
          <span className="text-gray-400">Quantity</span>
          <p className="font-medium text-gray-900">{prescription.quantity}</p>
        </div>
        <div>
          <span className="text-gray-400">Refills Remaining</span>
          <p className="font-medium text-gray-900">{prescription.refillsRemaining}</p>
        </div>
        <div>
          <span className="text-gray-400">Prescribing Doctor</span>
          <p className="font-medium text-gray-900">{prescription.prescribingDoctor}</p>
        </div>
        <div>
          <span className="text-gray-400">Patient</span>
          <p className="font-medium text-gray-900">{prescription.patientName}</p>
        </div>
        <div>
          <span className="text-gray-400">Date of Birth</span>
          <p className="font-medium text-gray-900">{prescription.patientDob}</p>
        </div>
        <div>
          <span className="text-gray-400">Source Pharmacy</span>
          <p className="font-medium text-gray-900">{pharmacy.name}</p>
        </div>
        <div>
          <span className="text-gray-400">Pharmacy Address</span>
          <p className="font-medium text-gray-900">{pharmacy.address}</p>
        </div>
      </div>

      {next && (
        <button
          onClick={() => onAdvanceStatus(transfer.id, next.status)}
          className="mt-6 w-full bg-[#1a1a1a] text-white py-3 rounded-lg font-semibold text-sm hover:bg-gray-800 transition-colors"
        >
          {next.label}
        </button>
      )}

      {transfer.status === "completed" && (
        <div className="mt-6 text-center text-sm text-emerald-600 font-medium">
          Transfer completed
        </div>
      )}
    </div>
  );
}
