"use client";

import { Prescription, Pharmacy } from "@/lib/types";

interface FaxDocumentProps {
  prescriptions: Prescription[];
  sourcePharmacy: Pharmacy;
  receivedAt: string; // ISO timestamp
}

export default function FaxDocument({ prescriptions, sourcePharmacy, receivedAt }: FaxDocumentProps) {
  const receivedDate = new Date(receivedAt);
  const dateStr = receivedDate.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const timeStr = receivedDate.toLocaleTimeString("en-CA", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const patient = prescriptions[0];
  const pageCount = prescriptions.length > 2 ? 2 : 1;

  return (
    <div className="relative">
      {/* Outer wrapper: slight rotation + shadow for "scanned document" feel */}
      <div
        className="relative bg-white border border-gray-300 shadow-md overflow-hidden"
        style={{ transform: "rotate(-0.4deg)" }}
      >
        {/* Scan line overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-10 opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 1px, #000 1px, #000 2px)",
          }}
        />

        {/* Fax header strip */}
        <div className="bg-gray-100 border-b border-gray-300 px-4 py-1.5 flex justify-between items-center text-[10px] font-mono text-gray-500">
          <span>FAX: {sourcePharmacy.faxNumber}</span>
          <span>{dateStr} {timeStr}</span>
          <span>PAGE 1 OF {pageCount}</span>
        </div>

        {/* Document body */}
        <div className="px-6 py-5 space-y-4 font-serif text-gray-800 text-sm">
          {/* Source pharmacy letterhead */}
          <div className="text-center border-b border-gray-200 pb-3">
            <p className="text-base font-bold uppercase tracking-wide">{sourcePharmacy.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">{sourcePharmacy.address}</p>
            <p className="text-xs text-gray-500">Tel: {sourcePharmacy.phone} &bull; Fax: {sourcePharmacy.faxNumber}</p>
          </div>

          {/* Title */}
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-widest border border-gray-400 inline-block px-4 py-1">
              Prescription Transfer
            </p>
          </div>

          {/* To / From */}
          <div className="grid grid-cols-2 gap-4 text-xs border-b border-gray-200 pb-3">
            <div>
              <p className="text-gray-400 uppercase text-[10px] mb-0.5">To</p>
              <p className="font-semibold">Felix Health Pharmacy</p>
              <p className="text-gray-500">Fax: (416) 555-0100</p>
            </div>
            <div>
              <p className="text-gray-400 uppercase text-[10px] mb-0.5">From</p>
              <p className="font-semibold">{sourcePharmacy.name}</p>
              <p className="text-gray-500">Fax: {sourcePharmacy.faxNumber}</p>
            </div>
          </div>

          {/* Patient info */}
          {patient && (
            <div>
              <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">Patient Information</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div>
                  <span className="text-gray-400">Name: </span>
                  <span className="font-medium">{patient.patientName}</span>
                </div>
                <div>
                  <span className="text-gray-400">DOB: </span>
                  <span className="font-medium">{patient.patientDob}</span>
                </div>
              </div>
            </div>
          )}

          {/* Prescription details — one block per prescription */}
          {prescriptions.map((rx, i) => (
            <div key={rx.id}>
              <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">
                {prescriptions.length > 1 ? `Prescription ${i + 1} of ${prescriptions.length}` : "Prescription Details"}
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div>
                  <span className="text-gray-400">Drug: </span>
                  <span className="font-medium">{rx.drugName}</span>
                </div>
                <div>
                  <span className="text-gray-400">DIN: </span>
                  <span className="font-medium">{rx.din}</span>
                </div>
                <div>
                  <span className="text-gray-400">Dosage: </span>
                  <span className="font-medium">{rx.dosage}</span>
                </div>
                <div>
                  <span className="text-gray-400">Quantity: </span>
                  <span className="font-medium">{rx.quantity}</span>
                </div>
                <div>
                  <span className="text-gray-400">Refills: </span>
                  <span className="font-medium">{rx.refillsRemaining}</span>
                </div>
                <div>
                  <span className="text-gray-400">Prescriber: </span>
                  <span className="font-medium">{rx.prescribingDoctor}</span>
                </div>
              </div>
              {i < prescriptions.length - 1 && (
                <div className="border-b border-dashed border-gray-200 mt-3" />
              )}
            </div>
          ))}

          {/* Signature */}
          <div className="border-t border-gray-200 pt-3 mt-4">
            <div className="flex justify-between items-end text-xs">
              <div>
                <p className="text-gray-400 text-[10px] uppercase">Authorized by</p>
                <p className="font-medium italic mt-1" style={{ fontFamily: "cursive" }}>
                  R. Patel, RPh
                </p>
                <div className="w-36 border-b border-gray-400 mt-1" />
                <p className="text-[10px] text-gray-400 mt-0.5">Pharmacist Signature</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-[10px] uppercase">Date</p>
                <p className="font-medium mt-1">{dateStr}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom edge noise */}
        <div className="h-2 bg-gradient-to-b from-gray-50 to-gray-200 opacity-40" />
      </div>
    </div>
  );
}
