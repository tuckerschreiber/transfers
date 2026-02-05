import { Pharmacy, Prescription, Transfer } from "./types";

export const pharmacies: Pharmacy[] = [
  { id: "ph-1", name: "Yonge Drug Mart", address: "2399 Yonge St, Toronto" },
  { id: "ph-2", name: "The Village Pharmacy", address: "2518 Yonge St, Toronto" },
  { id: "ph-3", name: "Sam's IDA Pharmacy", address: "1920 Yonge St unit 101-Y, Toronto" },
];

export const prescriptions: Prescription[] = [
  {
    id: "rx-1",
    drugName: "Nizatidine",
    din: "02242963",
    dosage: "150mg twice daily",
    quantity: 60,
    refillsRemaining: 2,
    prescribingDoctor: "Dr. Sarah Chen",
    patientName: "Alex Thompson",
    patientDob: "1990-03-15",
  },
  {
    id: "rx-2",
    drugName: "Amoxicillin",
    din: "02243127",
    dosage: "500mg three times daily",
    quantity: 30,
    refillsRemaining: 0,
    prescribingDoctor: "Dr. James Park",
    patientName: "Morgan Riley",
    patientDob: "1985-07-22",
  },
];

export const transfers: Transfer[] = [
  {
    id: "tx-1",
    prescriptionId: "rx-1",
    sourcePharmacyId: "ph-1",
    status: "requested",
    createdAt: "2026-02-03T10:30:00Z",
  },
  {
    id: "tx-2",
    prescriptionId: "rx-2",
    sourcePharmacyId: "ph-3",
    status: "submitted",
    createdAt: "2026-02-04T14:15:00Z",
  },
];

// Helper to get next ID
let transferCounter = transfers.length;
export function nextTransferId() {
  return `tx-${++transferCounter}`;
}
