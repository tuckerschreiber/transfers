import { NextRequest, NextResponse } from "next/server";
import { uploadedPrescriptions } from "@/lib/store";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const upload = uploadedPrescriptions.find((u) => u.id === id);

  if (!upload) {
    return NextResponse.json({ error: "Upload not found" }, { status: 404 });
  }

  if (body.status) upload.status = body.status;
  if (body.pharmacyNotes !== undefined) upload.pharmacyNotes = body.pharmacyNotes;
  if (body.rejectionReason !== undefined) upload.rejectionReason = body.rejectionReason;

  return NextResponse.json(upload);
}
