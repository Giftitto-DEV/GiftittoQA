"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Gift, Star } from "lucide-react";
import { colors } from "@/lib/colors";
import { spacing, borderRadius, shadows, typography, layout } from "@/lib/theme";
import { CategoryRow } from "./components/CategoryRow";
import { FeaturedBusinesses } from "./components/FeaturedBusinesses";

type Marca = {
  id: string;
  nombre: string;
  montos: number[];
};

const brandImages: Record<string, string> = {
  cinemax: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80&auto=format&fit=crop",
  gustoexpress: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80&auto=format&fit=crop",
  modaviva: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80&auto=format&fit=crop",
  tecnoplus: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80&auto=format&fit=crop",
};

const brandLogos: Record<string, string> = {
  cinemax: "C",
  gustoexpress: "G",
  modaviva: "M",
  tecnoplus: "T",
};

export default function Home() {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
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
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: colors.backgroundSecondary }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", border: `3px solid ${colors.borderLight}`, borderTopColor: colors.primary, animation: "spin 0.8s linear infinite" }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: colors.backgroundSecondary }}>
      <div style={{ maxWidth: layout.maxWidth, margin: "0 auto", padding: `0 ${layout.contentPaddingMobile}px ${spacing.xxxxl}px` }}>
        <CategoryRow />

        <FeaturedBusinesses />

        <div className="fade-up" style={{ display: "flex", alignItems: "center", gap: spacing.sm, marginBottom: spacing.lg, marginTop: spacing.xl, animationDelay: "0.35s" }}>
          <h2 style={{ ...typography.h3, color: colors.text, margin: 0 }}>Regalos disponibles</h2>
          <span style={{ fontSize: 12, fontWeight: 600, color: colors.textTertiary, backgroundColor: colors.card, borderRadius: borderRadius.full, padding: `2px ${spacing.sm}px`, border: `1px solid ${colors.borderLight}` }}>
            {marcas.reduce((acc, m) => acc + m.montos.length, 0)} giftcards
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          {marcas.flatMap((marca, marcaIdx) =>
            marca.montos.map((monto, montoIdx) => {
              const cardId = `${marca.id}-${monto}`;
              const isHovered = hoveredId === cardId;
              const globalIdx = marcaIdx * 3 + montoIdx;
              const imgUrl = brandImages[marca.id];
              return (
                <div
                  key={cardId}
                  className="fade-up"
                  onClick={() => router.push(`/producto/${cardId}`)}
                  onMouseEnter={() => setHoveredId(cardId)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    backgroundColor: colors.card,
                    borderRadius: borderRadius.xl,
                    overflow: "hidden",
                    cursor: "pointer",
                    boxShadow: isHovered ? shadows.lg : shadows.sm,
                    transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                    transition: "transform 0.25s ease, box-shadow 0.25s ease",
                    display: "flex",
                    flexDirection: "column",
                    animationDelay: `${0.1 + globalIdx * 0.06}s`,
                  }}
                >
                  <div style={{ position: "relative", width: "100%", height: 170, overflow: "hidden", backgroundColor: colors.borderLight }}>
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={marca.nombre}
                        loading="lazy"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.3s ease",
                          transform: isHovered ? "scale(1.05)" : "scale(1)",
                        }}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Gift size={36} color="rgba(255,255,255,0.9)" />
                      </div>
                    )}
                    <div style={{ position: "absolute", bottom: spacing.sm, left: spacing.md, width: 34, height: 34, borderRadius: "50%", border: `2px solid ${colors.card}`, backgroundColor: colors.card, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: shadows.xs }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: colors.primary }}>{brandLogos[marca.id] ?? marca.nombre.charAt(0)}</span>
                    </div>
                    <div style={{ position: "absolute", top: spacing.sm, right: spacing.sm, backgroundColor: colors.primary, color: "#fff", fontSize: 11, fontWeight: 700, borderRadius: borderRadius.full, padding: `3px ${spacing.sm}px` }}>
                      Nuevo
                    </div>
                  </div>

                  <div style={{ padding: spacing.lg, flex: 1, display: "flex", flexDirection: "column" }}>
                    <p style={{ fontSize: 12, fontWeight: 500, color: colors.textSecondary, textTransform: "uppercase", letterSpacing: "0.5px", margin: 0, marginBottom: spacing.xs, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {marca.nombre}
                    </p>
                    <p style={{ fontSize: 15, fontWeight: 600, color: colors.text, margin: 0, marginBottom: spacing.sm, lineHeight: "20px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {marca.nombre} · Giftcard
                    </p>

                    <div style={{ display: "flex", alignItems: "center", gap: spacing.xs, marginBottom: spacing.sm }}>
                      <Star size={14} color={colors.accent} fill={colors.accent} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>4.8</span>
                      <span style={{ fontSize: 13, color: colors.textTertiary }}>(124)</span>
                    </div>

                    <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: spacing.sm }}>
                      <span style={{ fontSize: 18, fontWeight: 700, color: colors.text }}>${monto}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleComprar(marca.id, monto);
                        }}
                        style={{
                          backgroundColor: isHovered ? colors.primaryDark : colors.primary,
                          color: "#fff",
                          border: "none",
                          borderRadius: borderRadius.lg,
                          padding: `${spacing.sm}px ${spacing.md}px`,
                          fontSize: 13,
                          fontWeight: 700,
                          cursor: "pointer",
                          fontFamily: "inherit",
                          transition: "background-color 0.2s ease, transform 0.15s ease",
                          transform: isHovered ? "scale(1.03)" : "scale(1)",
                          boxShadow: isHovered ? shadows.colored : "none",
                        }}
                      >
                        Comprar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
