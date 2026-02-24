import { Pharmacy, Prescription, Transfer, UploadedPrescription } from "./types";

export const pharmacies: Pharmacy[] = [
  { id: "ph-1", name: "Yonge Drug Mart", address: "2399 Yonge St, Toronto", phone: "(416) 485-7722", faxNumber: "(416) 485-7723" },
  { id: "ph-2", name: "The Village Pharmacy", address: "2518 Yonge St, Toronto", phone: "(416) 489-3301", faxNumber: "(416) 489-3302" },
  { id: "ph-3", name: "Sam's IDA Pharmacy", address: "1920 Yonge St unit 101-Y, Toronto", phone: "(416) 544-8900", faxNumber: "(416) 544-8901" },
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
  {
    id: "rx-3",
    drugName: "Metformin",
    din: "02270048",
    dosage: "500mg twice daily",
    quantity: 60,
    refillsRemaining: 5,
    prescribingDoctor: "Dr. James Park",
    patientName: "Morgan Riley",
    patientDob: "1985-07-22",
  },
  {
    id: "rx-4",
    drugName: "Lisinopril",
    din: "02291134",
    dosage: "10mg once daily",
    quantity: 30,
    refillsRemaining: 3,
    prescribingDoctor: "Dr. James Park",
    patientName: "Morgan Riley",
    patientDob: "1985-07-22",
  },
];

export const transfers: Transfer[] = [
  {
    id: "tx-1",
    prescriptionIds: ["rx-1"],
    sourcePharmacyId: "ph-1",
    status: "submitted",
    createdAt: "2026-02-03T10:30:00Z",
  },
  {
    id: "tx-2",
    prescriptionIds: ["rx-2", "rx-3", "rx-4"],
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

export const uploadedPrescriptions: UploadedPrescription[] = [
  {
    id: "up-1",
    patientName: "Jordan Lee",
    patientEmail: "jordan.lee@email.com",
    imageUrl: "/sample-prescription.svg",
    uploadedAt: "2026-02-23T09:15:00Z",
    status: "under_review",
    medicationName: "Sertraline",
    dose: "50mg once daily",
    quantity: 30,
    prescriberName: "Dr. Emily Watson",
    dateWritten: "2026-02-20",
    province: "Ontario",
    insuranceProvider: "Sun Life",
    insurancePolicyNumber: "SL-2847561",
    insuranceGroupNumber: "GRP-104",
    deliveryAddress: {
      street: "45 King St W",
      unit: "Suite 1200",
      city: "Toronto",
      province: "Ontario",
      postalCode: "M5H 1J8",
    },
    pharmacyNotes: null,
    rejectionReason: null,
  },
  {
    id: "up-2",
    patientName: "Sam Patel",
    patientEmail: "sam.patel@email.com",
    imageUrl: "/sample-prescription.svg",
    uploadedAt: "2026-02-22T14:30:00Z",
    status: "awaiting_patient",
    medicationName: "Atorvastatin",
    dose: "20mg once daily",
    quantity: 90,
    prescriberName: "Dr. Michael Chang",
    dateWritten: "2026-02-18",
    province: "British Columbia",
    insuranceProvider: "Manulife",
    insurancePolicyNumber: "ML-9382014",
    insuranceGroupNumber: null,
    deliveryAddress: {
      street: "1055 W Georgia St",
      unit: null,
      city: "Vancouver",
      province: "British Columbia",
      postalCode: "V6E 3P3",
    },
    pharmacyNotes: "Requested clarification on dose — patient's previous Rx was 10mg",
    rejectionReason: null,
  },
  {
    id: "up-3",
    patientName: "Taylor Kim",
    patientEmail: "taylor.kim@email.com",
    imageUrl: "/sample-prescription.svg",
    uploadedAt: "2026-02-20T11:00:00Z",
    status: "filled",
    medicationName: "Pantoprazole",
    dose: "40mg once daily",
    quantity: 30,
    prescriberName: "Dr. Sarah Chen",
    dateWritten: "2026-02-15",
    province: "Ontario",
    insuranceProvider: "Great-West Life",
    insurancePolicyNumber: "GW-5519283",
    insuranceGroupNumber: "GRP-208",
    deliveryAddress: {
      street: "200 Bay St",
      unit: "Apt 3405",
      city: "Toronto",
      province: "Ontario",
      postalCode: "M5J 2J5",
    },
    pharmacyNotes: "Insurance verified. Co-pay $8.50. Filled and shipped.",
    rejectionReason: null,
  },
];

let uploadCounter = uploadedPrescriptions.length;
export function nextUploadId() {
  return `up-${++uploadCounter}`;
}
