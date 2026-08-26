"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Marca = {
  id: string;
  nombre: string;
  montos: number[];
};

export default function Home() {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/giftcards/catalogo")
      .then((r) => r.json())
      .then((d) => {
        setMarcas(d);
        setLoading(false);
      });
  }, []);

  const handleComprar = async (marcaId: string, monto: number) => {
    const meRes = await fetch("/api/usuario/me");
    if (!meRes.ok) {
      router.push(`/login?next=${encodeURIComponent("/")}`);
      return;
    }
    const res = await fetch("/api/compra", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ marcaId, monto }),
    });
    if (res.ok) {
      const data = await res.json();
      const params = new URLSearchParams({
        marca: data.marca,
        marcaId: data.marcaId,
        monto: String(data.monto),
        codigo: data.codigo,
        fecha: data.fecha,
      });
      router.push(`/compra/exito?${params.toString()}`);
    }
  };

  if (loading) {
    return <div className="mx-auto max-w-5xl p-8 text-center">Cargando catálogo...</div>;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold">Catálogo de Giftcards</h1>
      <p className="mb-6 text-sm text-zinc-600">Elegí una marca y un monto para comprar tu giftcard.</p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {marcas.map((marca) => (
          <div key={marca.id} className="rounded-lg border bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold">{marca.nombre}</h2>
            <div className="flex flex-col gap-2">
              {marca.montos.map((monto) => (
                <div key={monto} className="flex items-center justify-between rounded border px-3 py-2">
                  <span className="font-medium">${monto}</span>
                  <button
                    onClick={() => handleComprar(marca.id, monto)}
                    className="rounded bg-zinc-900 px-4 py-1.5 text-sm text-white hover:bg-zinc-700"
                  >
                    Comprar
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
