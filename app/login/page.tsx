"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

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
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">Ingresar</h1>
      <form onSubmit={handleSubmit} className="rounded-lg border bg-white p-6 shadow-sm" noValidate>
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full rounded border px-3 py-2 text-sm ${emailError ? "border-red-500" : ""}`}
            placeholder="demo@giftitto.com"
          />
          {emailError && <p className="mt-1 text-xs text-red-600">Completá este campo</p>}
        </div>
        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full rounded border px-3 py-2 text-sm ${passwordError ? "border-red-500" : ""}`}
            placeholder="••••••"
          />
          {passwordError && <p className="mt-1 text-xs text-red-600">Completá este campo</p>}
        </div>
        <button type="submit" className="w-full rounded bg-zinc-900 py-2 text-sm font-medium text-white hover:bg-zinc-700">
          Ingresar
        </button>
        <p className="mt-4 text-xs text-zinc-500">Usuarios demo: demo@giftitto.com / demo123 — ana@giftitto.com / ana123</p>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Cargando...</div>}>
      <LoginForm />
    </Suspense>
  );
}
