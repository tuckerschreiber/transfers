import { NextRequest, NextResponse } from "next/server";
import { prescriptions } from "@/lib/store";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const prescription = prescriptions.find((p) => p.id === id);

  if (!prescription) {
    return NextResponse.json(
      { error: "Prescription not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(prescription);
}
