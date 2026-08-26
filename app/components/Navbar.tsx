"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState<{ nombre: string; email: string } | null>(null);

  useEffect(() => {
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
    <header className="w-full border-b bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Giftitto
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          {user ? (
            <>
              <Link href="/cuenta" className="hover:underline">
                Mi cuenta
              </Link>
              <span className="text-zinc-600">{user.nombre}</span>
              <button onClick={handleLogout} className="rounded bg-zinc-900 px-3 py-1.5 text-white hover:bg-zinc-700">
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link href="/login" className="rounded bg-zinc-900 px-3 py-1.5 text-white hover:bg-zinc-700">
              Ingresar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
