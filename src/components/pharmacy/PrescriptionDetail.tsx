"use client";

import { useState } from "react";
import { Transfer, Prescription, Pharmacy, TransferStatus } from "@/lib/types";
import { AlertTriangle, Check, X } from "lucide-react";
import FaxDocument from "./FaxDocument";
import AutomationTimeline from "./AutomationTimeline";

const NEXT_ACTION: Partial<Record<TransferStatus, { status: TransferStatus; label: string }>> = {
  submitted: { status: "requested", label: "Send Transfer Fax" },
  requested: { status: "transferred", label: "Confirm Fax Received" },
  transferred: { status: "completed", label: "Approve & Dispense" },
};

interface PrescriptionDetailProps {
  transfer: Transfer;
  prescriptions: Prescription[];
  pharmacy: Pharmacy;
  actionLog: Record<string, string>;
  onAdvanceStatus: (transferId: string, newStatus: TransferStatus) => void;
}

export default function PrescriptionDetail({
  transfer,
  prescriptions,
  pharmacy,
  actionLog,
  onAdvanceStatus,
}: PrescriptionDetailProps) {
  const showFax = transfer.status === "transferred" || transfer.status === "completed";
  const next = NEXT_ACTION[transfer.status];
  const noRefillRx = prescriptions.filter((rx) => rx.refillsRemaining === 0);

  // Track renewal request state per prescription id: "pending" | "requested" | "declined"
  const [renewalState, setRenewalState] = useState<Record<string, "pending" | "requested" | "declined">>({});

  const handleRenewal = (rxId: string, action: "requested" | "declined") => {
    setRenewalState((prev) => ({ ...prev, [rxId]: action }));
  };

  // All no-refill prescriptions must be actioned before approving
  const hasUnresolvedRenewals = showFax && noRefillRx.some((rx) => !renewalState[rx.id]);

  return (
    <div className="space-y-4">
      {/* Before fax received: show basic transfer info (no prescription details) */}
      {/* After fax received: show the full fax document with prescription info */}
      {showFax ? (
        <FaxDocument
          prescriptions={prescriptions}
          sourcePharmacy={pharmacy}
          receivedAt={actionLog["transferred"] || transfer.createdAt}
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold text-lg text-gray-900 mb-4">Transfer Request</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Patient</span>
              <p className="font-medium text-gray-900">{prescriptions[0]?.patientName}</p>
            </div>
            <div>
              <span className="text-gray-400">Date of Birth</span>
              <p className="font-medium text-gray-900">{prescriptions[0]?.patientDob}</p>
            </div>
            <div>
              <span className="text-gray-400">Source Pharmacy</span>
              <p className="font-medium text-gray-900">{pharmacy.name}</p>
            </div>
            <div>
              <span className="text-gray-400">Pharmacy Fax</span>
              <p className="font-medium text-gray-900">{pharmacy.faxNumber}</p>
            </div>
            <div>
              <span className="text-gray-400">Prescriptions</span>
              <p className="font-medium text-gray-900">{prescriptions.length}</p>
            </div>
          </div>
        </div>
      )}

      {/* No-refill renewal flags — shown when fax is received */}
      {showFax && noRefillRx.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <h4 className="text-sm font-semibold text-amber-800">No Refills Remaining</h4>
          </div>
          {noRefillRx.map((rx) => {
            const state = renewalState[rx.id];
            return (
              <div key={rx.id} className="bg-white rounded-lg p-3 border border-amber-100">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{rx.drugName}</p>
                    <p className="text-xs text-gray-500">{rx.dosage}</p>
                  </div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                    0 refills
                  </span>
                </div>

                {!state && (
                  <div>
                    <p className="text-xs text-gray-600 mb-2">
                      Request renewal from {rx.prescribingDoctor}?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRenewal(rx.id, "requested")}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 text-white py-2 rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Yes, Request
                      </button>
                      <button
                        onClick={() => handleRenewal(rx.id, "declined")}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-gray-100 text-gray-600 py-2 rounded-lg text-xs font-semibold hover:bg-gray-200 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                        No
                      </button>
                    </div>
                  </div>
                )}

                {state === "requested" && (
                  <p className="text-xs text-emerald-600 font-medium">
                    Renewal requested from {rx.prescribingDoctor}
                  </p>
                )}

                {state === "declined" && (
                  <p className="text-xs text-gray-400 font-medium">
                    Renewal not requested
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Step timeline */}
      <AutomationTimeline
        currentStatus={transfer.status}
        actionLog={actionLog}
      />

      {/* Action button for current step */}
      {next && (
        <button
          onClick={() => onAdvanceStatus(transfer.id, next.status)}
          disabled={hasUnresolvedRenewals}
          className={`w-full py-3 rounded-lg font-semibold text-sm transition-colors ${
            hasUnresolvedRenewals
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-[#1a1a1a] text-white hover:bg-gray-800"
          }`}
        >
          {next.label}
        </button>
      )}

      {transfer.status === "completed" && (
        <div className="text-center text-sm text-emerald-600 font-medium py-2">
          Transfer completed &amp; approved
        </div>
      )}
    </div>
  );
}
