"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { colors } from "@/lib/colors";
import { spacing, borderRadius, shadows } from "@/lib/theme";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    fetch("/api/usuario/me").then((r) => {
      if (r.ok) router.replace("/");
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const missingEmail = !email.trim();
    const missingPass = !password.trim();
    setEmailError(missingEmail);
    setPasswordError(missingPass);
    if (missingEmail || missingPass) return;
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      router.push(next);
      router.refresh();
    } else {
      return;
    }
  };

  return (
    <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", padding: `${spacing.xl}px`, backgroundColor: colors.backgroundSecondary }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <h1 className="fade-up" style={{ fontSize: 28, fontWeight: 700, color: colors.text, margin: `0 0 ${spacing.lg}px`, textAlign: "center", animationDelay: "0.05s" }}>
          Bienvenido de vuelta
        </h1>
        <p className="fade-up" style={{ fontSize: 14, color: colors.textSecondary, textAlign: "center", margin: `0 0 ${spacing.xl}px`, animationDelay: "0.12s" }}>
          Ingresá para seguir comprando giftcards
        </p>
        <form
          onSubmit={handleSubmit}
          className="fade-up"
          style={{
            backgroundColor: colors.card,
            borderRadius: borderRadius.xl,
            border: `1px solid ${colors.borderLight}`,
            boxShadow: shadows.lg,
            padding: spacing.xl,
            animationDelay: "0.18s",
            opacity: 1,
          }}
          noValidate
        >
          <div style={{ marginBottom: spacing.lg }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: colors.text, marginBottom: spacing.xs }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              placeholder="demo@giftitto.com"
              style={{
                width: "100%",
                borderRadius: borderRadius.lg,
                border: `1.5px solid ${emailError ? colors.error : focused === "email" ? colors.primary : colors.border}`,
                padding: `${spacing.sm + 2}px ${spacing.md}px`,
                fontSize: 14,
                outline: "none",
                transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                boxShadow: focused === "email" ? `0 0 0 3px ${colors.primary}18` : "none",
              }}
            />
            {emailError && <p style={{ margin: `6px 0 0`, fontSize: 12, color: colors.error, animation: "fadeUp 0.3s ease" }}>Completá este campo</p>}
          </div>
          <div style={{ marginBottom: spacing.xl }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: colors.text, marginBottom: spacing.xs }}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocused("pass")}
              onBlur={() => setFocused(null)}
              placeholder="••••••"
              style={{
                width: "100%",
                borderRadius: borderRadius.lg,
                border: `1.5px solid ${passwordError ? colors.error : focused === "pass" ? colors.primary : colors.border}`,
                padding: `${spacing.sm + 2}px ${spacing.md}px`,
                fontSize: 14,
                outline: "none",
                transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                boxShadow: focused === "pass" ? `0 0 0 3px ${colors.primary}18` : "none",
              }}
            />
            {passwordError && <p style={{ margin: `6px 0 0`, fontSize: 12, color: colors.error, animation: "fadeUp 0.3s ease" }}>Completá este campo</p>}
          </div>
          <button
            type="submit"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              width: "100%",
              backgroundColor: hovered ? colors.primaryDark : colors.primary,
              color: "#fff",
              border: "none",
              borderRadius: borderRadius.lg,
              padding: `${spacing.md}px`,
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              transition: "background-color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease",
              transform: hovered ? "translateY(-1px)" : "translateY(0)",
              boxShadow: hovered ? shadows.colored : shadows.sm,
            }}
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: "center", animation: "pulse 1s ease infinite" }}>Cargando...</div>}>
      <LoginForm />
    </Suspense>
  );
}
