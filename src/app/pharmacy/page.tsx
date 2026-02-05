"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import TransferTable from "@/components/pharmacy/TransferTable";
import PrescriptionDetail from "@/components/pharmacy/PrescriptionDetail";
import Toast from "@/components/Toast";
import { Transfer, Prescription, Pharmacy, TransferStatus } from "@/lib/types";

interface TransferRow {
  transfer: Transfer;
  prescription: Prescription;
  pharmacy: Pharmacy;
}

export default function PharmacyDashboard() {
  const [rows, setRows] = useState<TransferRow[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const fetchData = useCallback(async () => {
    const [transfers, pharmacies] = await Promise.all([
      fetch("/api/transfers").then((r) => r.json()),
      fetch("/api/pharmacies").then((r) => r.json()),
    ]);

    const pharmacyMap = Object.fromEntries(pharmacies.map((p: Pharmacy) => [p.id, p]));

    const enriched: TransferRow[] = await Promise.all(
      transfers.map(async (t: Transfer) => {
        const prescription = await fetch(`/api/prescriptions/${t.prescriptionId}`).then((r) => r.json());
        return { transfer: t, prescription, pharmacy: pharmacyMap[t.sourcePharmacyId] };
      })
    );

    setRows(enriched);
  }, []);

  // Poll every 3 seconds to pick up changes from patient demo sidebar
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleAdvanceStatus = async (transferId: string, newStatus: TransferStatus) => {
    await fetch(`/api/transfers/${transferId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchData();

    // Show toast notification
    const statusLabel = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
    setToastMessage(`Status updated to ${statusLabel}`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const selectedRow = rows.find((r) => r.transfer.id === selectedId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900">Pharmacy Dashboard</h1>
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
          &larr; Patient Demo
        </Link>
      </div>

      <div className="p-8 flex gap-8">
        {/* Table */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <TransferTable rows={rows} selectedId={selectedId} onSelect={setSelectedId} />
        </div>

        {/* Detail panel */}
        {selectedRow && (
          <div className="w-[400px] shrink-0">
            <PrescriptionDetail
              transfer={selectedRow.transfer}
              prescription={selectedRow.prescription}
              pharmacy={selectedRow.pharmacy}
              onAdvanceStatus={handleAdvanceStatus}
            />
          </div>
        )}
      </div>

      <Toast message={toastMessage} isVisible={showToast} />
    </div>
  );
}
