import { NextRequest, NextResponse } from "next/server";
import { transfers } from "@/lib/store";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const transfer = transfers.find((t) => t.id === id);

  if (!transfer) {
    return NextResponse.json({ error: "Transfer not found" }, { status: 404 });
  }

  if (body.status) {
    transfer.status = body.status;
  }

  return NextResponse.json(transfer);
}
