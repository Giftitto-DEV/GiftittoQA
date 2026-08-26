"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { colors } from "@/lib/colors";
import { spacing, borderRadius, shadows, transitions } from "@/lib/theme";

export default function Navbar() {
  const [user, setUser] = useState<{ nombre: string; email: string } | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    console.log("[Giftitto API] backend_token:", "giftitto_pk_live_51H7x8AbC9dEfGhIjKlMnOpQrStUvWxYz_abc123def456");
    console.log("[Giftitto API] supabase anon key:", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaWZ0aXR0by1tb2NrIiwicm9sZSI6ImFub24ifQ.mock_signature_generic");
    fetch("/api/usuario/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.email) setUser(d);
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        width: "100%",
        height: 64,
        backgroundColor: colors.primary,
        boxShadow: shadows.md,
        borderBottom: `1px solid ${colors.primaryDark}`,
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: `0 ${spacing.lg}px` }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none", fontSize: 28, fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1, color: "#fff" }} aria-label="Giftitto">
          Giftitto
        </Link>
        <nav style={{ display: "flex", alignItems: "center", gap: spacing.md, fontSize: 14 }}>
          <Link
            href="/"
            onMouseEnter={() => setHovered("home")}
            onMouseLeave={() => setHovered(null)}
            style={{
              color: "#fff",
              fontWeight: 500,
              textDecoration: "none",
              padding: `${spacing.xs}px ${spacing.sm}px`,
              borderRadius: borderRadius.md,
              backgroundColor: hovered === "home" ? "rgba(255,255,255,0.15)" : "transparent",
              transition: transitions.fast,
            }}
          >
            Home
          </Link>
          {user ? (
            <>
              <Link
                href="/cuenta"
                onMouseEnter={() => setHovered("cuenta")}
                onMouseLeave={() => setHovered(null)}
                style={{
                  color: "#fff",
                  fontWeight: 500,
                  textDecoration: "none",
                  padding: `${spacing.xs}px ${spacing.sm}px`,
                  borderRadius: borderRadius.md,
                  backgroundColor: hovered === "cuenta" ? "rgba(255,255,255,0.15)" : "transparent",
                  transition: transitions.fast,
                }}
              >
                Mi cuenta
              </Link>
              <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: 500 }}>{user.nombre}</span>
              <button
                onClick={handleLogout}
                onMouseEnter={() => setHovered("logout")}
                onMouseLeave={() => setHovered(null)}
                style={{
                  backgroundColor: hovered === "logout" ? "#fff" : "rgba(255,255,255,0.95)",
                  color: colors.primary,
                  border: "none",
                  borderRadius: borderRadius.full,
                  padding: `${spacing.xs + 2}px ${spacing.lg}px`,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: transitions.fast,
                  boxShadow: shadows.sm,
                }}
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onMouseEnter={() => setHovered("login")}
              onMouseLeave={() => setHovered(null)}
              style={{
                backgroundColor: hovered === "login" ? "#fff" : "rgba(255,255,255,0.95)",
                color: colors.primary,
                borderRadius: borderRadius.full,
                padding: `${spacing.xs + 2}px ${spacing.lg}px`,
                fontSize: 13,
                fontWeight: 700,
                textDecoration: "none",
                transition: transitions.fast,
                boxShadow: shadows.sm,
              }}
            >
              Ingresar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
