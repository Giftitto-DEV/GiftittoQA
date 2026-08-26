import { NextResponse } from "next/server";
import { MARCAS } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json(MARCAS);
}
