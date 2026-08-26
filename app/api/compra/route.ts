import { NextRequest, NextResponse } from "next/server";
import { MARCAS, generarCodigo } from "@/lib/mock-data";

export async function POST(request: NextRequest) {
  const { marcaId, monto } = await request.json();
  const marca = MARCAS.find((m) => m.id === marcaId);
  if (!marca) return NextResponse.json({ error: "Marca no encontrada" }, { status: 400 });
  if (!marca.montos.includes(monto)) return NextResponse.json({ error: "Monto no válido" }, { status: 400 });
  const codigo = generarCodigo();
  return NextResponse.json({ marca: marca.nombre, marcaId: marca.id, monto, codigo, fecha: new Date().toISOString() });
}
