import { NextRequest, NextResponse } from "next/server";
import { USUARIOS_DEMO } from "@/lib/mock-data";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  const usuario = USUARIOS_DEMO.find((u) => u.email === email && u.password === password);
  if (!usuario) return NextResponse.json({ ok: false, error: "Credenciales inválidas" }, { status: 401 });
  const res = NextResponse.json({ ok: true, user: { email: usuario.email, nombre: usuario.nombre } });
  res.cookies.set("giftitto_session", usuario.email, { httpOnly: false, path: "/", maxAge: 60 * 60 * 24 * 7, sameSite: "lax" });
  return res;
}
