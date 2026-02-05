import { NextResponse } from "next/server";
import { pharmacies } from "@/lib/store";

export async function GET() {
  return NextResponse.json(pharmacies);
}
