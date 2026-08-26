"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState, useRef } from "react";
import { CheckCircle, Copy, Check, Gift, Mail, MessageCircle, ShoppingBag } from "lucide-react";
import { CouponCard } from "@/app/components/CouponCard";
import { colors } from "@/lib/colors";
import { spacing, borderRadius, typography } from "@/lib/theme";

const successAnimationCss = `
@keyframes scaleIn{0%{transform:scale(0.3);opacity:0}60%{transform:scale(1.1);opacity:1}80%{transform:scale(0.95)}100%{transform:scale(1)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes confettiFall{0%{transform:translateY(-10px) rotate(0deg);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
@keyframes pulseBtn{0%,100%{transform:scale(1)}50%{transform:scale(1.02)}}
.success-icon{animation:scaleIn 0.6s cubic-bezier(0.175,0.885,0.32,1.275) forwards}
.fade-up-1{opacity:0;animation:fadeUp 0.5s ease 0.4s forwards}
.fade-up-2{opacity:0;animation:fadeUp 0.5s ease 0.6s forwards}
.fade-up-3{opacity:0;animation:fadeUp 0.5s ease 0.8s forwards}
.fade-up-4{opacity:0;animation:fadeUp 0.5s ease 1s forwards}
.hover-lift{transition:transform 0.2s ease, box-shadow 0.2s ease}
.hover-lift:hover{transform:translateY(-2px);box-shadow:0 8px 16px rgba(0,0,0,0.1)}
`;

function ConfettiPiece({ index }: { index: number }) {
  const colorsList = ["#d9153d", "#15d9b1", "#FFD93D", "#3B82F6", "#10B981", "#F59E0B"];
  return (
    <div
      style={{
        position: "fixed",
        top: -10,
        left: `${(index * 7.3 + 5) % 95}%`,
        width: 6 + (index % 5),
        height: 6 + (index % 5),
        backgroundColor: colorsList[index % colorsList.length],
        borderRadius: index % 2 === 0 ? "50%" : 2,
        animation: `confettiFall ${2 + (index % 2)}s ease-in ${(index * 0.18) % 2}s forwards`,
        pointerEvents: "none",
        zIndex: 10,
      }}
    />
  );
}

function formatMonto(monto: number) {
  return `$${monto.toLocaleString("es-AR")}`;
}

const brandImagesByName: Record<string, string> = {
  CineMax: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80&auto=format&fit=crop",
  GustoExpress: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80&auto=format&fit=crop",
  ModaViva: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80&auto=format&fit=crop",
  TecnoPlus: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80&auto=format&fit=crop",
};

function ExitoContent() {
  const params = useSearchParams();
  const marca = params.get("marca") || "";
  const monto = Number(params.get("monto") || 0);
  const codigo = params.get("codigo") || "";
  const fecha = params.get("fecha") || "";
  const [copied, setCopied] = useState(false);
  const [showConfetti] = useState(true);
  const couponRef = useRef<HTMLDivElement>(null);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codigo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCompartir = async () => {
    const truncated = codigo.slice(0, 4);
    const shareUrl = `${window.location.origin}/compra/exito?marca=${encodeURIComponent(marca)}&monto=${monto}&cod=${encodeURIComponent(truncated)}&fecha=${encodeURIComponent(fecha)}`;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sendByWhatsApp = () => {
    const text = encodeURIComponent(`Te comparto mi giftcard ${marca} ${formatMonto(monto)} - Código: ${codigo}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const sendByEmail = () => {
    const subject = encodeURIComponent(`Te comparto mi giftcard ${marca}`);
    const body = encodeURIComponent(`${marca} ${formatMonto(monto)}\nCódigo: ${codigo}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const expiresAt = fecha ? new Date(new Date(fecha).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString() : undefined;
  const productImageUrl = marca === "ModaViva" ? undefined : brandImagesByName[marca];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: colors.backgroundSecondary, display: "flex", flexDirection: "column" }}>
      <style>{successAnimationCss}</style>
      {showConfetti && Array.from({ length: 18 }, (_, i) => <ConfettiPiece key={i} index={i} />)}
      <div
        style={{
          flex: 1,
          padding: spacing.lg,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: spacing.xl,
          maxWidth: 560,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <div style={{ paddingTop: spacing.xxxl, display: "flex", flexDirection: "column", alignItems: "center", gap: spacing.lg }}>
          <div
            className="success-icon"
            style={{
              width: 96,
              height: 96,
              borderRadius: 9999,
              backgroundColor: colors.success50,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 0 0 16px ${colors.success50}`,
            }}
          >
            <CheckCircle size={56} color={colors.success} />
          </div>
          <div className="fade-up-1" style={{ textAlign: "center" }}>
            <h1 style={{ ...typography.h3, color: colors.text, margin: `0 0 ${spacing.sm}px` }}>¡Tu giftcard está lista!</h1>
            <p style={{ ...typography.body, color: colors.textSecondary, margin: 0 }}>
              {monto ? `${formatMonto(monto)} en ${marca}` : "Giftcard"}
            </p>
          </div>
        </div>

        <div className="fade-up-2" style={{ width: "100%" }}>
          <div className="hover-lift">
            <CouponCard ref={couponRef} code={codigo || "GC-XXXX"} businessName={marca || "Giftitto"} title={`${marca || "Giftcard"} ${monto ? formatMonto(monto) : ""}`} expiresAt={expiresAt} productImageUrl={productImageUrl} />
          </div>

          <div className="fade-up-3" style={{ display: "flex", gap: spacing.sm, marginTop: spacing.lg }}>
            <button
              onClick={handleCopy}
              className="hover-lift"
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: spacing.sm,
                backgroundColor: copied ? colors.success : colors.primary,
                color: "#fff",
                border: "none",
                borderRadius: borderRadius.lg,
                padding: `${spacing.md}px`,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copiado" : "Copiar código"}
            </button>
            <button
              onClick={handleCompartir}
              className="hover-lift"
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: spacing.sm,
                backgroundColor: "transparent",
                color: colors.text,
                border: `1.5px solid ${colors.border}`,
                borderRadius: borderRadius.lg,
                padding: `${spacing.md}px`,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              <Gift size={16} /> Compartir
            </button>
          </div>

          <div className="fade-up-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: spacing.sm, marginTop: spacing.sm }}>
            <button
              onClick={sendByWhatsApp}
              className="hover-lift"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                backgroundColor: colors.card,
                border: `1px solid ${colors.border}`,
                borderRadius: borderRadius.lg,
                padding: `${spacing.md}px`,
                cursor: "pointer",
              }}
            >
              <MessageCircle size={18} color="#25D366" />
              <span style={{ fontSize: 12, fontWeight: 500 }}>WhatsApp</span>
            </button>
            <button
              onClick={sendByEmail}
              className="hover-lift"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                backgroundColor: colors.card,
                border: `1px solid ${colors.border}`,
                borderRadius: borderRadius.lg,
                padding: `${spacing.md}px`,
                cursor: "pointer",
              }}
            >
              <Mail size={18} color={colors.primary} />
              <span style={{ fontSize: 12, fontWeight: 500 }}>Email</span>
            </button>
          </div>

          <button
            onClick={() => (window.location.href = "/")}
            className="fade-up-4 hover-lift"
            style={{
              width: "100%",
              marginTop: spacing.lg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: spacing.sm,
              backgroundColor: colors.primary,
              color: "#fff",
              border: "none",
              borderRadius: borderRadius.xl,
              padding: `${spacing.lg}px`,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            <ShoppingBag size={20} /> Seguir comprando
          </button>
          <p className="fade-up-4" style={{ textAlign: "center", fontSize: 12, color: colors.textTertiary, marginTop: spacing.md }}>Refrescá la página: el cupón se mantiene por URL.</p>
        </div>
      </div>
    </div>
  );
}

export default function ExitoPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Cargando...</div>}>
      <ExitoContent />
    </Suspense>
  );
}
