import { NextRequest, NextResponse } from "next/server";
import { transfers, nextTransferId } from "@/lib/store";

export async function GET() {
  return NextResponse.json(transfers);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { prescriptionId, sourcePharmacyId } = body;

  const newTransfer = {
    id: nextTransferId(),
    prescriptionId,
    sourcePharmacyId,
    status: "submitted" as const,
    createdAt: new Date().toISOString(),
  };

  transfers.push(newTransfer);
  return NextResponse.json(newTransfer, { status: 201 });
}
