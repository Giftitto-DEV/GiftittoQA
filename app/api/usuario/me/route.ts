import { NextRequest, NextResponse } from "next/server";
import { USUARIOS_DEMO } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  const email = request.cookies.get("giftitto_session")?.value;
  if (!email) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  const u = USUARIOS_DEMO.find((x) => x.email === email);
  if (!u) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  return NextResponse.json({ email: u.email, nombre: u.nombre });
}
