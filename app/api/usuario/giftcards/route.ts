import { NextRequest, NextResponse } from "next/server";
import { GIFTCARDS_MOCK, USUARIOS_DEMO } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  const email = request.cookies.get("giftitto_session")?.value;
  if (!email) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  if (!USUARIOS_DEMO.find((u) => u.email === email)) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  return NextResponse.json(GIFTCARDS_MOCK[email] ?? []);
}
