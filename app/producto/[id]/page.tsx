"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Heart, Gift, Star, Store, MapPin, ChevronRight, Minus, Plus, Shield, RefreshCw, Zap, FileText } from "lucide-react";
import { colors } from "@/lib/colors";
import { spacing, borderRadius, typography, shadows, layout } from "@/lib/theme";
import { MARCAS } from "@/lib/mock-data";

const brandImages: Record<string, string> = {
  cinemax: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80&auto=format&fit=crop",
  gustoexpress: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80&auto=format&fit=crop",
  modaviva: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80&auto=format&fit=crop",
  tecnoplus: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80&auto=format&fit=crop",
};

const brandCity: Record<string, string> = {
  cinemax: "Buenos Aires",
  gustoexpress: "Córdoba",
  modaviva: "Rosario",
  tecnoplus: "Mendoza",
};

export default function ProductoDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id as string;
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"descripcion" | "ubicaciones" | "resenas">("descripcion");
  const [isFav, setIsFav] = useState(false);
  const [hoveredBuy, setHoveredBuy] = useState(false);

  const [marcaId, montoStr] = (id || "").split("-");
  const monto = Number(montoStr);
  const marca = MARCAS.find((m) => m.id === marcaId);
  const isValid = !!marca && marca.montos.includes(monto);

  if (!isValid || !marca) {
    return (
      <div style={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: spacing.lg, backgroundColor: colors.background }}>
        <p style={{ ...typography.body, color: colors.textSecondary }}>Producto no encontrado</p>
        <button onClick={() => router.back()} style={{ color: colors.primary, background: "none", border: "none", cursor: "pointer", fontSize: 15 }}>Volver</button>
      </div>
    );
  }

  const imageUrl = brandImages[marca.id];
  const title = `${marca.nombre} · Giftcard $${monto.toLocaleString("es-AR")}`;
  const price = monto;
  const formatPrice = (p: number) => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(p);

  const handleBuy = async () => {
    const meRes = await fetch("/api/usuario/me");
    if (!meRes.ok) {
      router.push(`/login?next=${encodeURIComponent(`/producto/${id}`)}`);
      return;
    }
    const res = await fetch("/api/compra", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ marcaId: marca.id, monto }),
    });
    if (res.ok) {
      const data = await res.json();
      const query = new URLSearchParams({ marca: data.marca, marcaId: data.marcaId, monto: String(data.monto), codigo: data.codigo, fecha: data.fecha });
      router.push(`/compra/exito?${query.toString()}`);
    }
  };

  const isDesktop = typeof window !== "undefined" ? window.innerWidth >= 900 : true;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: colors.background, display: "flex", flexDirection: "column" }}>
      <div style={{ maxWidth: layout.maxWidth, margin: "0 auto", width: "100%", padding: `${spacing.md}px ${spacing.lg}px`, display: "flex", alignItems: "center", gap: spacing.sm }}>
        <button onClick={() => router.back()} style={{ width: 36, height: 36, borderRadius: "50%", border: `1px solid ${colors.borderLight}`, backgroundColor: colors.card, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <ArrowLeft size={18} color={colors.text} />
        </button>
        <span style={{ fontSize: 13, color: colors.textSecondary }}>Detalle</span>
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ maxWidth: layout.maxWidth, margin: "0 auto", width: "100%", display: "flex", flexDirection: isDesktop ? "row" as const : "column" as const, gap: isDesktop ? spacing.xxxxl : "0", padding: isDesktop ? `0 ${spacing.lg}px ${spacing.xxxxl}px` : "0" }}>
          <div style={{ width: isDesktop ? "55%" : "100%", flexShrink: 0, position: isDesktop ? "sticky" as const : undefined, top: isDesktop ? spacing.lg : undefined, alignSelf: isDesktop ? "flex-start" as const : undefined }}>
            <div style={{ position: "relative", width: "100%", aspectRatio: isDesktop ? "4/3" : "16/10", backgroundColor: colors.backgroundSecondary, overflow: "hidden", borderRadius: isDesktop ? borderRadius.xxl : 0 }}>
              <img src={imageUrl} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.25) 0%, transparent 40%)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", top: spacing.lg, right: spacing.lg }}>
                <button onClick={() => setIsFav(!isFav)} style={{ width: 40, height: 40, borderRadius: borderRadius.full, backgroundColor: "rgba(255,255,255,0.9)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: shadows.md }}>
                  <Heart size={18} color={isFav ? colors.primary : colors.text} fill={isFav ? colors.primary : "transparent"} />
                </button>
              </div>
            </div>
          </div>

          <div style={{ width: isDesktop ? "45%" : "100%", padding: isDesktop ? "0" : `${spacing.xl}px ${spacing.lg}px`, paddingTop: isDesktop ? spacing.xs : spacing.xl, display: "flex", flexDirection: "column", gap: spacing.xl }}>
            <div>
              <p style={{ ...typography.overline, color: colors.primary, marginBottom: spacing.xs }}>{marca.nombre}</p>
              <h1 style={{ ...typography.h2, color: colors.text, margin: `0 0 ${spacing.sm}px` }}>{title}</h1>
              <div style={{ display: "flex", alignItems: "center", gap: spacing.md, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: spacing.xs }}>
                  <Star size={14} color={colors.accent} fill={colors.accent} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>4.8</span>
                  <span style={{ fontSize: 13, color: colors.textTertiary, textDecoration: "underline" }}>(124 reseñas)</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: spacing.xs }}>
                  <Heart size={14} color={colors.primary} fill={colors.primary} />
                  <span style={{ fontSize: 13, color: colors.textSecondary }}>89 favoritos</span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: spacing.xs }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: spacing.md }}>
                <span style={{ ...typography.h2, color: colors.text, margin: 0 }}>{formatPrice(price * quantity)}</span>
              </div>
              {quantity > 1 && <span style={{ fontSize: 13, color: colors.textSecondary }}>Precio unitario {formatPrice(price)}</span>}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: spacing.md }}>
              <div style={{ display: "flex", alignItems: "center", gap: spacing.md, justifyContent: "center" }}>
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} disabled={quantity <= 1} style={{ width: 40, height: 40, borderRadius: borderRadius.full, border: `1.5px solid ${quantity <= 1 ? colors.borderLight : colors.primary}`, backgroundColor: quantity <= 1 ? colors.backgroundSecondary : colors.primary50, cursor: quantity <= 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: quantity <= 1 ? 0.4 : 1 }}>
                  <Minus size={16} color={quantity <= 1 ? colors.textTertiary : colors.primary} />
                </button>
                <span style={{ fontWeight: 700, color: colors.text, minWidth: 24, textAlign: "center" }}>{quantity}</span>
                <button onClick={() => setQuantity((q) => Math.min(10, q + 1))} disabled={quantity >= 10} style={{ width: 40, height: 40, borderRadius: borderRadius.full, border: `1.5px solid ${quantity >= 10 ? colors.borderLight : colors.primary}`, backgroundColor: quantity >= 10 ? colors.backgroundSecondary : colors.primary50, cursor: quantity >= 10 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: quantity >= 10 ? 0.4 : 1 }}>
                  <Plus size={16} color={quantity >= 10 ? colors.textTertiary : colors.primary} />
                </button>
              </div>
              <button
                onClick={handleBuy}
                onMouseEnter={() => setHoveredBuy(true)}
                onMouseLeave={() => setHoveredBuy(false)}
                style={{
                  width: "100%",
                  backgroundColor: hoveredBuy ? colors.primaryDark : colors.primary,
                  color: "#fff",
                  border: "none",
                  borderRadius: borderRadius.xl,
                  padding: `${spacing.md + 2}px`,
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: hoveredBuy ? shadows.colored : shadows.sm,
                  transform: hoveredBuy ? "translateY(-1px)" : "translateY(0)",
                  transition: "all 0.2s ease",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: spacing.sm
                }}
              >
                <Gift size={20} /> Comprar — {formatPrice(price * quantity)}
              </button>
            </div>

            <div
              onClick={() => {}}
              style={{ display: "flex", alignItems: "center", gap: spacing.md, padding: spacing.lg, backgroundColor: colors.card, border: `1px solid ${colors.borderLight}`, borderRadius: borderRadius.xl, cursor: "pointer" }}
            >
              <div style={{ width: 44, height: 44, borderRadius: borderRadius.lg, overflow: "hidden", flexShrink: 0, backgroundColor: colors.primary100, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Store size={20} color={colors.primary} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: colors.text, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{marca.nombre}</p>
                <div style={{ display: "flex", alignItems: "center", gap: spacing.xs, marginTop: 2 }}>
                  <MapPin size={12} color={colors.textTertiary} />
                  <span style={{ fontSize: 12, color: colors.textSecondary }}>{brandCity[marca.id]}</span>
                </div>
              </div>
              <ChevronRight size={16} color={colors.textTertiary} />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", padding: `${spacing.lg}px 0`, borderTop: `1px solid ${colors.borderLight}`, borderBottom: `1px solid ${colors.borderLight}` }}>
              {[
                { icon: Shield, color: colors.success, title: "Pago seguro", sub: "Protegido" },
                { icon: RefreshCw, color: colors.info, title: "Cambios", sub: "Fácil" },
                { icon: Zap, color: colors.accent, title: "Entrega digital", sub: "Inmediata" },
              ].map((item) => (
                <div key={item.title} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: spacing.xs, flex: 1, textAlign: "center" }}>
                  <div style={{ width: 36, height: 36, borderRadius: borderRadius.lg, backgroundColor: `${item.color}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <item.icon size={18} color={item.color} />
                  </div>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: colors.text, margin: 0 }}>{item.title}</p>
                    <p style={{ fontSize: 11, color: colors.textTertiary, margin: 0 }}>{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: spacing.xs, borderBottom: `1px solid ${colors.borderLight}` }}>
              {[
                { key: "descripcion", label: "Descripción", icon: FileText },
                { key: "ubicaciones", label: "Ubicaciones", icon: MapPin },
                { key: "resenas", label: "Reseñas", icon: Star },
              ].map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    style={{
                      display: "flex", alignItems: "center", gap: spacing.xs, padding: `${spacing.md}px ${spacing.lg}px`, border: "none", cursor: "pointer", fontSize: 13, fontWeight: isActive ? 600 : 400, color: isActive ? colors.primary : colors.textSecondary, backgroundColor: isActive ? colors.primary50 : "transparent", borderBottom: isActive ? `2.5px solid ${colors.primary}` : "2.5px solid transparent", borderRadius: `${borderRadius.md}px ${borderRadius.md}px 0 0`, marginBottom: -1,
                    }}
                  >
                    <tab.icon size={14} /> {tab.label}
                  </button>
                );
              })}
            </div>

            <div style={{ paddingBottom: spacing.xxl }}>
              {activeTab === "descripcion" && (
                <div>
                  <p style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 1.6, margin: 0 }}>
                    Giftcard de {marca.nombre} por {formatPrice(price)}. Válida por 30 días desde la compra. Canjeable en todas las sucursales y online. Entrega digital inmediata con código único y barcode.
                  </p>
                  <div style={{ marginTop: spacing.lg, backgroundColor: colors.backgroundSecondary, borderRadius: borderRadius.lg, padding: spacing.lg }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: colors.text, margin: `0 0 ${spacing.xs}px` }}>Detalles</p>
                    <p style={{ fontSize: 12, color: colors.textSecondary, margin: 0 }}>• Monto: {formatPrice(price)}</p>
                    <p style={{ fontSize: 12, color: colors.textSecondary, margin: 0 }}>• Vencimiento: 30 días</p>
                    <p style={{ fontSize: 12, color: colors.textSecondary, margin: 0 }}>• Stock: 15 disponibles</p>
                  </div>
                </div>
              )}
              {activeTab === "ubicaciones" && (
                <div style={{ display: "flex", flexDirection: "column", gap: spacing.md }}>
                  {[1, 2].map((i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: spacing.md, padding: spacing.lg, border: `1px solid ${colors.borderLight}`, borderRadius: borderRadius.lg }}>
                      <MapPin size={18} color={colors.primary} />
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{marca.nombre} — Sucursal {i}</p>
                        <p style={{ fontSize: 12, color: colors.textSecondary, margin: 0 }}>{brandCity[marca.id]} — Av. Ejemplo 123{i}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === "resenas" && (
                <div style={{ display: "flex", flexDirection: "column", gap: spacing.lg }}>
                  <div style={{ display: "flex", alignItems: "center", gap: spacing.sm }}>
                    <Star size={18} color={colors.accent} fill={colors.accent} />
                    <span style={{ fontWeight: 600 }}>4.8</span>
                    <span style={{ color: colors.textTertiary }}>(124 reseñas)</span>
                  </div>
                  {[
                    { name: "María G.", text: "Excelente, llegó al instante y canje sin problemas." },
                    { name: "Juan P.", text: "Muy buena relación precio y la atención de la marca." },
                  ].map((r, i) => (
                    <div key={i} style={{ borderBottom: `1px solid ${colors.borderLight}`, paddingBottom: spacing.md }}>
                      <p style={{ fontSize: 13, fontWeight: 600, margin: `0 0 ${spacing.xs}px` }}>{r.name}</p>
                      <p style={{ fontSize: 13, color: colors.textSecondary, margin: 0 }}>{r.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
