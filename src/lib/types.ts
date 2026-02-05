export type TransferStatus =
  | "submitted"
  | "reviewed"
  | "requested"
  | "transferred"
  | "completed";

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
}

export interface Prescription {
  id: string;
  drugName: string;
  din: string;
  dosage: string;
  quantity: number;
  refillsRemaining: number;
  prescribingDoctor: string;
  patientName: string;
  patientDob: string;
}

export interface Transfer {
  id: string;
  prescriptionId: string;
  sourcePharmacyId: string;
  status: TransferStatus;
  createdAt: string;
}
