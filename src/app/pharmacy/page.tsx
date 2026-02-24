"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import TransferTable from "@/components/pharmacy/TransferTable";
import PrescriptionDetail from "@/components/pharmacy/PrescriptionDetail";
import UploadTable from "@/components/pharmacy/UploadTable";
import UploadDetail from "@/components/pharmacy/UploadDetail";
import Toast from "@/components/Toast";
import { Transfer, Prescription, Pharmacy, TransferStatus, UploadedPrescription, UploadStatus } from "@/lib/types";

interface TransferRow {
  transfer: Transfer;
  prescriptions: Prescription[];
  pharmacy: Pharmacy;
}

async function fetchTransferRows(): Promise<TransferRow[]> {
  const [transfers, pharmacies] = await Promise.all([
    fetch("/api/transfers").then((r) => r.json()),
    fetch("/api/pharmacies").then((r) => r.json()),
  ]);

  const pharmacyMap = Object.fromEntries(pharmacies.map((p: Pharmacy) => [p.id, p]));

  return Promise.all(
    transfers.map(async (t: Transfer) => {
      const prescriptions: Prescription[] = await Promise.all(
        t.prescriptionIds.map((id: string) =>
          fetch(`/api/prescriptions/${id}`).then((r) => r.json())
        )
      );
      return { transfer: t, prescriptions, pharmacy: pharmacyMap[t.sourcePharmacyId] };
    })
  );
}

export default function PharmacyDashboard() {
  const [tab, setTab] = useState<"transfers" | "uploads">("transfers");
  const [rows, setRows] = useState<TransferRow[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [uploads, setUploads] = useState<UploadedPrescription[]>([]);
  const [selectedUploadId, setSelectedUploadId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [actionLog, setActionLog] = useState<Record<string, Record<string, string>>>({});

  // Transfer polling
  useEffect(() => {
    if (tab !== "transfers") return;
    let active = true;
    const doFetch = async () => {
      const data = await fetchTransferRows();
      if (active) setRows(data);
    };
    doFetch();
    const interval = setInterval(doFetch, 3000);
    return () => { active = false; clearInterval(interval); };
  }, [tab]);

  // Upload polling
  useEffect(() => {
    if (tab !== "uploads") return;
    let active = true;
    const doFetch = async () => {
      const data = await fetch("/api/uploads").then((r) => r.json());
      if (active) setUploads(data);
    };
    doFetch();
    const interval = setInterval(doFetch, 3000);
    return () => { active = false; clearInterval(interval); };
  }, [tab]);

  const handleAdvanceStatus = async (transferId: string, newStatus: TransferStatus) => {
    await fetch(`/api/transfers/${transferId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    // Log timestamp
    setActionLog((prev) => ({
      ...prev,
      [transferId]: {
        ...(prev[transferId] || {}),
        [newStatus]: new Date().toISOString(),
      },
    }));

    const data = await fetchTransferRows();
    setRows(data);

    const labels: Record<string, string> = {
      requested: "Transfer fax sent",
      transferred: "Incoming fax received",
      completed: "Transfer approved",
    };
    setToastMessage(labels[newStatus] || `Status: ${newStatus}`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleUploadStatusChange = async (
    id: string,
    status: UploadStatus,
    extra?: { pharmacyNotes?: string; rejectionReason?: string }
  ) => {
    await fetch(`/api/uploads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, ...extra }),
    });
    const data = await fetch("/api/uploads").then((r) => r.json());
    setUploads(data);

    const labels: Record<string, string> = {
      ready_to_fill: "Approved \u2014 ready to fill",
      filled: "Prescription filled",
      rejected: "Prescription rejected",
      awaiting_patient: "Clarification requested",
    };
    setToastMessage(labels[status] || `Status: ${status}`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const selectedRow = rows.find((r) => r.transfer.id === selectedId);
  const selectedUpload = uploads.find((u) => u.id === selectedUploadId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900">Pharmacy Dashboard</h1>
        <div className="flex items-center gap-4">
          <Link href="/transfer-in" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            Transfer In
          </Link>
          <Link href="/upload" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            Upload Rx Demo
          </Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            &larr; Patient Demo
          </Link>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="bg-white px-8 pt-6 flex gap-6 border-b border-gray-200">
        <button
          onClick={() => { setTab("transfers"); setSelectedUploadId(null); }}
          className={`pb-3 text-[16px] font-medium transition-colors ${
            tab === "transfers"
              ? "text-gray-900 border-b-2 border-[#DE781F]"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Transfers
        </button>
        <button
          onClick={() => { setTab("uploads"); setSelectedId(null); }}
          className={`pb-3 text-[16px] font-medium transition-colors ${
            tab === "uploads"
              ? "text-gray-900 border-b-2 border-[#DE781F]"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Prescription Uploads
        </button>
      </div>

      <div className="p-8 flex gap-8">
        {/* Table */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden">
          {tab === "transfers" ? (
            <TransferTable rows={rows} selectedId={selectedId} onSelect={setSelectedId} />
          ) : (
            <UploadTable uploads={uploads} selectedId={selectedUploadId} onSelect={setSelectedUploadId} />
          )}
        </div>

        {/* Detail panel */}
        {tab === "transfers" && selectedRow && (
          <div className="w-[400px] shrink-0">
            <PrescriptionDetail
              transfer={selectedRow.transfer}
              prescriptions={selectedRow.prescriptions}
              pharmacy={selectedRow.pharmacy}
              actionLog={actionLog[selectedRow.transfer.id] || {}}
              onAdvanceStatus={handleAdvanceStatus}
            />
          </div>
        )}
        {tab === "uploads" && selectedUpload && (
          <div className="w-[400px] shrink-0">
            <UploadDetail
              key={`${selectedUpload.id}-${selectedUpload.pharmacyNotes}`}
              upload={selectedUpload}
              onUpdateStatus={handleUploadStatusChange}
            />
          </div>
        )}
      </div>

      <Toast message={toastMessage} isVisible={showToast} />
    </div>
  );
}
