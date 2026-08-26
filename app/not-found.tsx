"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Gift, Home, Search, Frown, Sparkles } from "lucide-react";
import { colors } from "@/lib/colors";
import { spacing, borderRadius, shadows, typography } from "@/lib/theme";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: `${spacing.xxxxl}px ${spacing.lg}px`,
        backgroundColor: colors.backgroundSecondary,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <style>{`
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes wiggle{0%,100%{transform:rotate(-2deg)}50%{transform:rotate(2deg)}}
        @keyframes scaleIn404{0%{transform:scale(0.5);opacity:0}60%{transform:scale(1.08);opacity:1}100%{transform:scale(1);opacity:1}}
        @keyframes fadeUp404{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes burst{0%{transform:scale(0);opacity:1}100%{transform:scale(1.8);opacity:0}}
        @keyframes drift{0%{transform:translateY(0) rotate(0deg)}100%{transform:translateY(-100vh) rotate(180deg)}}
      `}</style>

      {/* Burbujas de fondo */}
      {mounted && (
        <>
          <div style={{ position: "absolute", top: "10%", left: "15%", width: 120, height: 120, borderRadius: "50%", background: `${colors.primary}08`, animation: "float 4s ease-in-out infinite" }} />
          <div style={{ position: "absolute", bottom: "20%", right: "10%", width: 180, height: 180, borderRadius: "50%", background: `${colors.secondary}08`, animation: "float 5s ease-in-out infinite 0.5s" }} />
          <div style={{ position: "absolute", top: "50%", right: "20%", width: 80, height: 80, borderRadius: "50%", background: `${colors.accent}10`, animation: "float 3.5s ease-in-out infinite 1s" }} />
        </>
      )}

      {/* Giftbox animada */}
      <div
        style={{
          position: "relative",
          width: 140,
          height: 140,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: mounted ? "scaleIn404 0.7s cubic-bezier(0.175,0.885,0.32,1.275) forwards" : "none",
          opacity: mounted ? 1 : 0,
        }}
      >
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", backgroundColor: `${colors.primary}12`, animation: "burst 2s ease-out infinite" }} />
        <div style={{ position: "absolute", inset: 8, borderRadius: "50%", backgroundColor: `${colors.primary}08`, animation: "burst 2s ease-out infinite 0.3s" }} />
        <div
          style={{
            width: 110,
            height: 110,
            borderRadius: borderRadius.xxl,
            backgroundColor: colors.card,
            boxShadow: shadows.xl,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 1,
            animation: "wiggle 2.5s ease-in-out infinite",
            border: `1px solid ${colors.borderLight}`,
          }}
        >
          <Gift size={54} color={colors.primary} />
          <div style={{ position: "absolute", top: -8, right: -8, width: 32, height: 32, borderRadius: "50%", backgroundColor: colors.primary, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: shadows.md, animation: "float 2s ease-in-out infinite" }}>
            <Frown size={16} color="#fff" />
          </div>
        </div>
        <Sparkles size={18} color={colors.accent} style={{ position: "absolute", top: 10, right: 18, animation: "float 2s ease-in-out infinite 0.2s" }} />
        <Sparkles size={12} color={colors.secondary} style={{ position: "absolute", bottom: 22, left: 14, animation: "float 2.5s ease-in-out infinite 0.6s" }} />
      </div>

      {/* Texto 404 */}
      <div style={{ textAlign: "center", marginTop: spacing.xl, animation: mounted ? "fadeUp404 0.5s ease 0.4s forwards" : "none", opacity: 0 }}>
        <h1 style={{ fontSize: 72, fontWeight: 800, color: colors.text, margin: 0, lineHeight: 1, letterSpacing: "-3px" }}>
          4<span style={{ color: colors.primary }}>0</span>4
        </h1>
        <p style={{ ...typography.h4, color: colors.text, margin: `${spacing.sm}px 0 ${spacing.xs}px` }}>¡Uy! Este regalo no existe</p>
        <p style={{ ...typography.bodySmall, color: colors.textSecondary, margin: 0, maxWidth: 380 }}>
          La página que buscás se perdió como un código sin canjear. Volvé al inicio y seguí regalando.
        </p>
      </div>

      {/* Botones */}
      <div style={{ display: "flex", gap: spacing.md, marginTop: spacing.xl, flexWrap: "wrap", justifyContent: "center", animation: mounted ? "fadeUp404 0.5s ease 0.6s forwards" : "none", opacity: 0 }}>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: spacing.sm,
            backgroundColor: colors.primary,
            color: "#fff",
            borderRadius: borderRadius.full,
            padding: `${spacing.md}px ${spacing.xl}px`,
            fontSize: 14,
            fontWeight: 700,
            textDecoration: "none",
            boxShadow: shadows.colored,
            transition: "transform 0.15s ease",
          }}
        >
          <Home size={18} /> Volver al inicio
        </Link>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: spacing.sm,
            backgroundColor: colors.card,
            color: colors.text,
            border: `1.5px solid ${colors.border}`,
            borderRadius: borderRadius.full,
            padding: `${spacing.md}px ${spacing.xl}px`,
            fontSize: 14,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          <Search size={18} /> Explorar regalos
        </Link>
      </div>

      <p style={{ marginTop: spacing.xl, fontSize: 11, color: colors.textTertiary, letterSpacing: "0.5px", animation: mounted ? "fadeUp404 0.5s ease 0.8s forwards" : "none", opacity: 0 }}>
        Error 404 • Giftitto
      </p>
    </div>
  );
}
