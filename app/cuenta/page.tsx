"use client";

import { useEffect, useState } from "react";
import { colors } from "@/lib/colors";
import { spacing, borderRadius, shadows } from "@/lib/theme";
import { LogOut, Gift, Mail, User } from "lucide-react";

export default function CuentaPage() {
  const [user, setUser] = useState<{ nombre: string; email: string } | null>(null);
  const [giftcards, setGiftcards] = useState<{ marca: string; monto: number; codigo: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetch("/api/usuario/me"), fetch("/api/usuario/giftcards")]).then(async ([meRes, gcRes]) => {
      if (meRes.ok && gcRes.ok) {
        setUser(await meRes.json());
        setGiftcards(await gcRes.json());
      } else {
        setUser({ nombre: "Usuario Demo", email: "demo@giftitto.com" });
        setGiftcards([
          { marca: "CineMax", monto: 5000, codigo: "GC-1001-A" },
          { marca: "GustoExpress", monto: 3000, codigo: "GC-1002-B" },
        ]);
      }
      setLoading(false);
    });
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: `3px solid ${colors.borderLight}`,
            borderTopColor: colors.primary,
            animation: "spin 0.8s linear infinite",
          }}
        />
      </div>
    );
  }

  const initial = user?.nombre?.charAt(0)?.toUpperCase() ?? "U";

  return (
    <div style={{ minHeight: "100%", backgroundColor: colors.backgroundSecondary }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: `${spacing.xl}px ${spacing.lg}px` }}>
        <div
          style={{
            backgroundColor: colors.card,
            borderRadius: borderRadius.xl,
            border: `1px solid ${colors.borderLight}`,
            boxShadow: shadows.sm,
            padding: spacing.xl,
            display: "flex",
            alignItems: "center",
            gap: spacing.lg,
            marginBottom: spacing.lg,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              backgroundColor: colors.primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span style={{ color: "#fff", fontSize: 24, fontWeight: 700 }}>{initial}</span>
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: colors.text }}>{user?.nombre}</h1>
            <p style={{ margin: 0, fontSize: 14, color: colors.textSecondary }}>{user?.email}</p>
          </div>
        </div>

        <div
          style={{
            backgroundColor: colors.card,
            borderRadius: borderRadius.xl,
            border: `1px solid ${colors.borderLight}`,
            boxShadow: shadows.sm,
            overflow: "hidden",
            marginBottom: spacing.lg,
          }}
        >
          <div style={{ padding: `${spacing.md}px ${spacing.lg}px`, borderBottom: `1px solid ${colors.borderLight}` }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: colors.textSecondary, textTransform: "uppercase", letterSpacing: "0.4px" }}>Información</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: spacing.md, padding: `${spacing.md}px ${spacing.lg}px`, borderBottom: `1px solid ${colors.borderLight}` }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", backgroundColor: colors.backgroundSecondary, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <User size={16} color={colors.textSecondary} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: colors.textTertiary, textTransform: "uppercase" }}>Nombre</p>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>{user?.nombre}</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: spacing.md, padding: `${spacing.md}px ${spacing.lg}px` }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", backgroundColor: colors.backgroundSecondary, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Mail size={16} color={colors.textSecondary} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: colors.textTertiary, textTransform: "uppercase" }}>Email</p>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>{user?.email}</p>
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: colors.card,
            borderRadius: borderRadius.xl,
            border: `1px solid ${colors.borderLight}`,
            boxShadow: shadows.sm,
            overflow: "hidden",
            marginBottom: spacing.lg,
          }}
        >
          <div style={{ padding: `${spacing.md}px ${spacing.lg}px`, borderBottom: `1px solid ${colors.borderLight}`, display: "flex", alignItems: "center", gap: 8 }}>
            <Gift size={16} color={colors.primary} />
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: colors.textSecondary, textTransform: "uppercase", letterSpacing: "0.4px" }}>Mis giftcards</p>
          </div>
          {giftcards.map((gc) => (
            <div key={gc.codigo} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: `${spacing.md}px ${spacing.lg}px`, borderBottom: `1px solid ${colors.borderLight}` }}>
              <span style={{ fontSize: 14, fontWeight: 500 }}>
                {gc.marca} — ${gc.monto.toLocaleString("es-AR")}
              </span>
              <span style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 600, color: colors.primary }}>{gc.codigo}</span>
            </div>
          ))}
        </div>

        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: spacing.sm,
            width: "100%",
            padding: spacing.md,
            backgroundColor: colors.card,
            border: `1px solid ${colors.errorLight}`,
            borderRadius: borderRadius.xl,
            cursor: "pointer",
            fontSize: 15,
            fontWeight: 600,
            color: colors.error,
          }}
        >
          <LogOut size={18} color={colors.error} /> Cerrar sesión
        </button>
      </div>
    </div>
  );
}
