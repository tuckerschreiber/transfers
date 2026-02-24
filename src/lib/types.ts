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
  phone: string;
  faxNumber: string;
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
  prescriptionIds: string[];
  sourcePharmacyId: string;
  status: TransferStatus;
  createdAt: string;
}

export type UploadStatus =
  | "under_review"
  | "awaiting_patient"
  | "ready_to_fill"
  | "filled"
  | "rejected";

export interface DeliveryAddress {
  street: string;
  unit: string | null;
  city: string;
  province: string;
  postalCode: string;
}

export interface UploadedPrescription {
  id: string;
  patientName: string;
  patientEmail: string;
  imageUrl: string;
  uploadedAt: string;
  status: UploadStatus;
  medicationName: string;
  dose: string;
  quantity: number;
  prescriberName: string;
  dateWritten: string;
  province: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  insuranceGroupNumber: string | null;
  deliveryAddress: DeliveryAddress;
  pharmacyNotes: string | null;
  rejectionReason: string | null;
}
