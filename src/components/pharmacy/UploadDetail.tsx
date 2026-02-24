"use client";

import { useState } from "react";
import { UploadedPrescription, UploadStatus } from "@/lib/types";
import { X } from "lucide-react";

const REJECTION_REASONS = [
  "Prescription expired",
  "Prescription illegible",
  "Medication not in formulary",
  "Controlled substance",
  "Missing required information",
];

interface UploadDetailProps {
  upload: UploadedPrescription;
  onUpdateStatus: (
    id: string,
    status: UploadStatus,
    extra?: { pharmacyNotes?: string; rejectionReason?: string }
  ) => void;
}

export default function UploadDetail({ upload, onUpdateStatus }: UploadDetailProps) {
  const [notes, setNotes] = useState(upload.pharmacyNotes || "");
  const [rejectionReason, setRejectionReason] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);

  const isFinal = upload.status === "filled" || upload.status === "rejected";

  return (
    <div className="space-y-4">
      {/* Uploaded Prescription image */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-bold text-lg text-gray-900 mb-4">Uploaded Prescription</h3>
        <img
          src={upload.imageUrl}
          alt="Prescription"
          className="w-full rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => setShowImageModal(true)}
        />
        <p className="text-xs text-gray-400 mt-2">
          Uploaded {new Date(upload.uploadedAt).toLocaleDateString()}
        </p>
      </div>

      {/* Prescription Details */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-bold text-lg text-gray-900 mb-4">Prescription Details</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Medication</span>
            <p className="font-medium text-gray-900">{upload.medicationName}</p>
          </div>
          <div>
            <span className="text-gray-400">Dose</span>
            <p className="font-medium text-gray-900">{upload.dose}</p>
          </div>
          <div>
            <span className="text-gray-400">Quantity</span>
            <p className="font-medium text-gray-900">{upload.quantity}</p>
          </div>
          <div>
            <span className="text-gray-400">Prescriber</span>
            <p className="font-medium text-gray-900">{upload.prescriberName}</p>
          </div>
          <div>
            <span className="text-gray-400">Date Written</span>
            <p className="font-medium text-gray-900">
              {new Date(upload.dateWritten).toLocaleDateString()}
            </p>
          </div>
          <div>
            <span className="text-gray-400">Patient</span>
            <p className="font-medium text-gray-900">{upload.patientName}</p>
          </div>
        </div>
      </div>

      {/* Insurance & Delivery */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-bold text-lg text-gray-900 mb-4">Insurance &amp; Delivery</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Province</span>
            <p className="font-medium text-gray-900">{upload.province}</p>
          </div>
          <div>
            <span className="text-gray-400">Provider</span>
            <p className="font-medium text-gray-900">{upload.insuranceProvider}</p>
          </div>
          <div>
            <span className="text-gray-400">Policy #</span>
            <p className="font-medium text-gray-900">{upload.insurancePolicyNumber}</p>
          </div>
          {upload.insuranceGroupNumber && (
            <div>
              <span className="text-gray-400">Group #</span>
              <p className="font-medium text-gray-900">{upload.insuranceGroupNumber}</p>
            </div>
          )}
          <div className="col-span-2">
            <span className="text-gray-400">Delivery Address</span>
            <p className="font-medium text-gray-900">
              {upload.deliveryAddress.street}
              {upload.deliveryAddress.unit && `, Unit ${upload.deliveryAddress.unit}`}
              , {upload.deliveryAddress.city}, {upload.deliveryAddress.province}{" "}
              {upload.deliveryAddress.postalCode}
            </p>
          </div>
        </div>
      </div>

      {/* Pharmacy Notes */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-bold text-lg text-gray-900 mb-4">Pharmacy Notes</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes about this prescription..."
          className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-900 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-gray-200"
          rows={3}
        />
        <button
          onClick={() =>
            onUpdateStatus(upload.id, upload.status, { pharmacyNotes: notes })
          }
          className="mt-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          Save notes
        </button>
      </div>

      {/* Reject Prescription */}
      {!isFinal && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold text-lg text-gray-900 mb-4">Reject Prescription</h3>
          <select
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200 mb-3"
          >
            <option value="">Select reason...</option>
            {REJECTION_REASONS.map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </select>
          <button
            onClick={() =>
              onUpdateStatus(upload.id, "rejected", { rejectionReason })
            }
            disabled={!rejectionReason}
            className={`w-full py-3 rounded-lg font-semibold text-sm transition-colors ${
              rejectionReason
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Reject
          </button>
        </div>
      )}

      {/* Request Clarification */}
      {!isFinal && upload.status !== "awaiting_patient" && (
        <button
          onClick={() => onUpdateStatus(upload.id, "awaiting_patient")}
          className="w-full py-3 rounded-lg font-semibold text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
        >
          Request Clarification
        </button>
      )}

      {/* Primary action button */}
      {upload.status === "under_review" && (
        <button
          onClick={() => onUpdateStatus(upload.id, "ready_to_fill")}
          className="w-full py-3 rounded-lg font-semibold text-sm bg-[#1a1a1a] text-white hover:bg-gray-800 transition-colors"
        >
          Approve — Ready to Fill
        </button>
      )}
      {upload.status === "ready_to_fill" && (
        <button
          onClick={() => onUpdateStatus(upload.id, "filled")}
          className="w-full py-3 rounded-lg font-semibold text-sm bg-[#1a1a1a] text-white hover:bg-gray-800 transition-colors"
        >
          Mark as Filled
        </button>
      )}

      {/* Status messages */}
      {upload.status === "filled" && (
        <div className="text-center text-sm text-emerald-600 font-medium py-2">
          Prescription filled &amp; shipped
        </div>
      )}
      {upload.status === "rejected" && (
        <div className="text-center text-sm text-red-600 font-medium py-2">
          Rejected: {upload.rejectionReason}
        </div>
      )}

      {/* Image modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-8"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-3xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute -top-3 -right-3 bg-white rounded-full p-1.5 shadow-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
            <img
              src={upload.imageUrl}
              alt="Prescription"
              className="max-w-full max-h-[80vh] rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
