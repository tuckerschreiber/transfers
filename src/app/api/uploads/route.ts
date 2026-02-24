import { NextRequest, NextResponse } from "next/server";
import { uploadedPrescriptions, nextUploadId } from "@/lib/store";

export async function GET() {
  return NextResponse.json(uploadedPrescriptions);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const newUpload = {
    id: nextUploadId(),
    patientName: body.patientName,
    patientEmail: body.patientEmail,
    imageUrl: body.imageUrl || "/sample-prescription.svg",
    uploadedAt: new Date().toISOString(),
    status: "under_review" as const,
    medicationName: body.medicationName,
    dose: body.dose,
    quantity: body.quantity,
    prescriberName: body.prescriberName,
    dateWritten: body.dateWritten,
    province: body.province,
    insuranceProvider: body.insuranceProvider,
    insurancePolicyNumber: body.insurancePolicyNumber,
    insuranceGroupNumber: body.insuranceGroupNumber || null,
    deliveryAddress: body.deliveryAddress,
    pharmacyNotes: null,
    rejectionReason: null,
  };

  uploadedPrescriptions.push(newUpload);
  return NextResponse.json(newUpload, { status: 201 });
}
