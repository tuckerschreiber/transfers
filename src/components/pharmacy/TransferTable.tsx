"use client";

import { Transfer, TransferStatus, Prescription, Pharmacy } from "@/lib/types";

const STATUS_COLORS: Record<TransferStatus, string> = {
  submitted: "bg-gray-100 text-gray-600",
  reviewed: "bg-blue-100 text-blue-700",
  requested: "bg-amber-100 text-amber-700",
  transferred: "bg-emerald-100 text-emerald-700",
  completed: "bg-emerald-100 text-emerald-700",
};

interface TransferRow {
  transfer: Transfer;
  prescriptions: Prescription[];
  pharmacy: Pharmacy;
}

interface TransferTableProps {
  rows: TransferRow[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function TransferTable({ rows, selectedId, onSelect }: TransferTableProps) {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-200 text-xs text-gray-400 uppercase tracking-wider">
          <th className="text-left py-3 px-4 font-medium">Patient</th>
          <th className="text-left py-3 px-4 font-medium">Medication</th>
          <th className="text-left py-3 px-4 font-medium">Source Pharmacy</th>
          <th className="text-left py-3 px-4 font-medium">Status</th>
          <th className="text-left py-3 px-4 font-medium">Date</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(({ transfer, prescriptions, pharmacy }) => (
          <tr
            key={transfer.id}
            onClick={() => onSelect(transfer.id)}
            className={`border-b border-gray-100 cursor-pointer transition-colors ${
              selectedId === transfer.id ? "bg-gray-50" : "hover:bg-gray-50"
            }`}
          >
            <td className="py-3 px-4 text-sm font-medium text-gray-900">{prescriptions[0]?.patientName}</td>
            <td className="py-3 px-4 text-sm text-gray-600">
              {prescriptions[0]?.drugName}
              {prescriptions.length > 1 && (
                <span className="ml-1.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">
                  +{prescriptions.length - 1} more
                </span>
              )}
            </td>
            <td className="py-3 px-4 text-sm text-gray-600">{pharmacy.name}</td>
            <td className="py-3 px-4">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[transfer.status]}`}>
                {transfer.status}
              </span>
            </td>
            <td className="py-3 px-4 text-sm text-gray-400">
              {new Date(transfer.createdAt).toLocaleDateString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
