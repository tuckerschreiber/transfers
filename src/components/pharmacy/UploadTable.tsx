"use client";

import { UploadedPrescription, UploadStatus } from "@/lib/types";

const STATUS_COLORS: Record<UploadStatus, string> = {
  under_review: "bg-amber-100 text-amber-700",
  awaiting_patient: "bg-purple-100 text-purple-700",
  ready_to_fill: "bg-blue-100 text-blue-700",
  filled: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<UploadStatus, string> = {
  under_review: "Under Review",
  awaiting_patient: "Awaiting Patient",
  ready_to_fill: "Ready to Fill",
  filled: "Filled",
  rejected: "Rejected",
};

interface UploadTableProps {
  uploads: UploadedPrescription[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function UploadTable({ uploads, selectedId, onSelect }: UploadTableProps) {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-200 text-xs text-gray-400 uppercase tracking-wider">
          <th className="text-left py-3 px-4 font-medium">Patient</th>
          <th className="text-left py-3 px-4 font-medium">Image</th>
          <th className="text-left py-3 px-4 font-medium">Medication</th>
          <th className="text-left py-3 px-4 font-medium">Status</th>
          <th className="text-left py-3 px-4 font-medium">Submitted</th>
        </tr>
      </thead>
      <tbody>
        {uploads.map((upload) => (
          <tr
            key={upload.id}
            onClick={() => onSelect(upload.id)}
            className={`border-b border-gray-100 cursor-pointer transition-colors ${
              selectedId === upload.id ? "bg-gray-50" : "hover:bg-gray-50"
            }`}
          >
            <td className="py-3 px-4 text-sm font-medium text-gray-900">
              {upload.patientName}
            </td>
            <td className="py-3 px-4">
              <img
                src={upload.imageUrl}
                alt="Prescription"
                className="w-10 h-10 rounded-lg border border-gray-200 object-cover"
              />
            </td>
            <td className="py-3 px-4 text-sm text-gray-600">
              {upload.medicationName}
            </td>
            <td className="py-3 px-4">
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[upload.status]}`}
              >
                {STATUS_LABELS[upload.status]}
              </span>
            </td>
            <td className="py-3 px-4 text-sm text-gray-400">
              {new Date(upload.uploadedAt).toLocaleDateString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
