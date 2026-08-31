# Giftitto QA Mock Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers-subagent-driven-development (recommended) or superpowers-executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir un sitio Next.js mock de compra de giftcards con 4 páginas, 6 endpoints y 6 bugs plantados a propósito para evaluación de postulantes QA, sin persistencia real ni comentarios que delaten los bugs.

**Architecture:** App Router de Next.js con API Routes mock que usan constantes en `lib/mock-data.ts` y cookie `giftitto_session` (email plano) para sesión. Frontend client-components que consumen esos endpoints. Bugs implementados como variaciones sutiles de comportamiento/formato en cada página (sin comentarios). Validación intencionalmente rota en B5/B6.

**Tech Stack:** Next.js 16.3.3 (App Router), React 19, TypeScript, Tailwind CSS 4, `jsbarcode` + `lucide-react` para CouponCard, cookies via `next/headers` / `NextResponse.cookies`, deploy Vercel-compatible (sin dependencia de Docker en runtime).

---

## File Structure Map

```
lib/mock-data.ts                          # constantes USUARIOS_DEMO, MARCAS, GIFTCARDS_MOCK, generarCodigo()
lib/colors.ts                             # paleta copiada de GiftittoClient/src/styles/colors.ts
lib/theme.ts                              # spacing/borderRadius/shadows copiado de GiftittoClient
app/layout.tsx                            # layout root + Navbar global
app/components/Navbar.tsx                 # nav client: estado sesión, link Home/Cuenta/Login, logout
app/components/CouponCard.tsx             # COPIA exacta de GiftittoClient/src/components/CouponCard.tsx (adaptada a Next)
app/components/Barcode128.tsx             # COPIA exacta de GiftittoClient Barcode128 (jsbarcode)
app/components/BrandLogo.tsx              # COPIA exacta de GiftittoClient BrandLogo
app/page.tsx                              # Home: catálogo, B1 (formato $5000), B2 (sin disabled)
app/login/page.tsx                        # Login: form email+pass, B3 (sin feedback en 401), redirect si ya logueado
app/cuenta/page.tsx                       # Cuenta: IGUAL visual a GiftittoClient ProfilePage pero simplificada + B5
app/compra/exito/page.tsx                 # Éxito: IGUAL visual a GiftittoClient OrderSuccessPage con CouponCard real + B1/B4/B6
app/api/auth/login/route.ts               # POST {email,pass} -> set cookie o 401
app/api/auth/logout/route.ts              # POST -> clear cookie
app/api/usuario/me/route.ts               # GET -> usuario por cookie o 401
app/api/usuario/giftcards/route.ts        # GET -> GIFTCARDS_MOCK[email] o 401
app/api/giftcards/catalogo/route.ts       # GET -> MARCAS
app/api/compra/route.ts                   # POST {marcaId,monto} -> {marca,monto,codigo,fecha}
```

**Páginas y endpoints existentes a modificar/crear:** todo lo listado arriba. `app/page.tsx` y `app/layout.tsx` hoy son el boilerplate de create-next-app y serán reemplazados.

---

### Task 1: Fundaciones — mock-data, estilos y layout base

**Files:**
- Create: `lib/mock-data.ts`
- Create: `lib/colors.ts` (copia de GiftittoClient/src/styles/colors.ts)
- Create: `lib/theme.ts` (copia de GiftittoClient/src/styles/theme.ts)
- Create: `app/components/CouponCard.tsx` (copia adaptada GiftittoClient)
- Create: `app/components/Barcode128.tsx` (copia GiftittoClient)
- Create: `app/components/BrandLogo.tsx` (copia GiftittoClient)
- Modify: `app/layout.tsx`
- Create: `app/components/Navbar.tsx`

- [ ] **Step 1: Crear `lib/mock-data.ts` con constantes exactas del spec**

```ts
// lib/mock-data.ts
export const USUARIOS_DEMO = [
  { email: "demo@giftitto.com", password: "demo123", nombre: "Usuario Demo" },
  { email: "ana@giftitto.com", password: "ana123", nombre: "Ana Pérez" },
] as const;

export const MARCAS = [
  { id: "cinemax", nombre: "CineMax", montos: [2000, 5000, 10000] },
  { id: "gustoexpress", nombre: "GustoExpress", montos: [1500, 3000, 6000] },
  { id: "modaviva", nombre: "ModaViva", montos: [2000, 4000, 8000] },
  { id: "tecnoplus", nombre: "TecnoPlus", montos: [5000, 10000, 20000] },
];

export const GIFTCARDS_MOCK: Record<string, { marca: string; monto: number; codigo: string }[]> = {
  "demo@giftitto.com": [
    { marca: "CineMax", monto: 5000, codigo: "GC-1001-A" },
    { marca: "GustoExpress", monto: 3000, codigo: "GC-1002-B" },
  ],
  "ana@giftitto.com": [
    { marca: "ModaViva", monto: 4000, codigo: "GC-2002-X" },
    { marca: "TecnoPlus", monto: 10000, codigo: "GC-2003-Y" },
  ],
};

export function generarCodigo() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "GC-";
  for (let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  return code;
}
```

- [ ] **Step 2: Actualizar `app/layout.tsx` para incluir Navbar, título y footer**

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
export const metadata: Metadata = { title: "Giftitto — Giftcards", description: "Compra giftcards mock para evaluación QA" };
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-zinc-50">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t bg-white py-4 text-center text-xs text-zinc-500">Giftitto — sitio demo para evaluación QA</footer>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Instalar dependencias necesarias para CouponCard**

```bash
npm install jsbarcode
npm install --save-dev @types/jsbarcode
# lucide-react ya suele estar, si no: npm install lucide-react
```

- [ ] **Step 4: Copiar `lib/colors.ts` y `lib/theme.ts` exactos de GiftittoClient**

Copiar contenido idéntico de `/Users/giftitto/Desktop/GiftittoClient/src/styles/colors.ts` → `lib/colors.ts` y `src/styles/theme.ts` → `lib/theme.ts` (ajustar import `from './colors'`).

- [ ] **Step 5: Copiar `app/components/Barcode128.tsx`, `BrandLogo.tsx` y `CouponCard.tsx` de GiftittoClient**

Copiar idénticos adaptando imports: `from '@/lib/colors'` y `from '@/lib/theme'`, quitar `useTranslation` si no se usa (reemplazar textos por strings fijos o pasar prop), mantener `forwardRef`, `Barcode128`, notches, `BrandLogo`. Verificar que `CouponCard` reciba props `code, businessName, title, expiresAt, businessLogoUrl, message, description, customImageUrl, productImageUrl`.

- [ ] **Step 6: Crear `app/components/Navbar.tsx` (client, fetch /api/usuario/me, logout)**

```tsx
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
export default function Navbar() {
  const [user, setUser] = useState<{ nombre: string; email: string } | null>(null);
  useEffect(() => {
    fetch("/api/usuario/me").then(r => r.ok ? r.json() : null).then(d => { if (d?.email) setUser(d); }).catch(()=>{});
  }, []);
  const handleLogout = async () => { await fetch("/api/auth/logout", { method: "POST" }); window.location.href = "/"; };
  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold">Giftitto</Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className="hover:underline">Home</Link>
          {user ? (<><Link href="/cuenta" className="hover:underline">Mi cuenta</Link><span className="text-zinc-600">{user.nombre}</span><button onClick={handleLogout} className="rounded bg-zinc-900 px-3 py-1.5 text-white">Cerrar sesión</button></>) : (<Link href="/login" className="rounded bg-zinc-900 px-3 py-1.5 text-white">Ingresar</Link>)}
        </nav>
      </div>
    </header>
  );
}
```

- [ ] **Step 7: Verificar build**

Run: `npm run build`
Expected: Compila sin errores (CouponCard puede requerir `'use client'` — si falla, agregar directiva)

- [ ] **Step 8: Commit**

```bash
git add lib/ app/components/ app/layout.tsx
git commit -m "feat: fundaciones mock-data, estilos y CouponCard copiado de GiftittoClient"
```

---

### Task 2: Endpoints API mock (6 rutas)

**Files:**
- Create: `app/api/auth/login/route.ts`
- Create: `app/api/auth/logout/route.ts`
- Create: `app/api/usuario/me/route.ts`
- Create: `app/api/usuario/giftcards/route.ts`
- Create: `app/api/giftcards/catalogo/route.ts`
- Create: `app/api/compra/route.ts`

- [ ] **Step 1: Crear `app/api/auth/login/route.ts`**

```ts
import { NextRequest, NextResponse } from "next/server";
import { USUARIOS_DEMO } from "@/lib/mock-data";
export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  const usuario = USUARIOS_DEMO.find(u => u.email === email && u.password === password);
  if (!usuario) return NextResponse.json({ ok: false, error: "Credenciales inválidas" }, { status: 401 });
  const res = NextResponse.json({ ok: true, user: { email: usuario.email, nombre: usuario.nombre } });
  res.cookies.set("giftitto_session", usuario.email, { httpOnly: false, path: "/", maxAge: 60*60*24*7, sameSite: "lax" });
  return res;
}
```

- [ ] **Step 2: Crear `app/api/auth/logout/route.ts`**

```ts
import { NextResponse } from "next/server";
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("giftitto_session", "", { path: "/", maxAge: 0 });
  return res;
}
```

- [ ] **Step 3: Crear `app/api/usuario/me/route.ts`**

```ts
import { NextRequest, NextResponse } from "next/server";
import { USUARIOS_DEMO } from "@/lib/mock-data";
export async function GET(request: NextRequest) {
  const email = request.cookies.get("giftitto_session")?.value;
  if (!email) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  const u = USUARIOS_DEMO.find(x => x.email === email);
  if (!u) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  return NextResponse.json({ email: u.email, nombre: u.nombre });
}
```

- [ ] **Step 4: Crear `app/api/usuario/giftcards/route.ts`**

```ts
import { NextRequest, NextResponse } from "next/server";
import { GIFTCARDS_MOCK, USUARIOS_DEMO } from "@/lib/mock-data";
export async function GET(request: NextRequest) {
  const email = request.cookies.get("giftitto_session")?.value;
  if (!email) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  if (!USUARIOS_DEMO.find(u => u.email === email)) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  return NextResponse.json(GIFTCARDS_MOCK[email] ?? []);
}
```

- [ ] **Step 5: Crear `app/api/giftcards/catalogo/route.ts`**

```ts
import { NextResponse } from "next/server";
import { MARCAS } from "@/lib/mock-data";
export async function GET() { return NextResponse.json(MARCAS); }
```

- [ ] **Step 6: Crear `app/api/compra/route.ts`**

```ts
import { NextRequest, NextResponse } from "next/server";
import { MARCAS, generarCodigo } from "@/lib/mock-data";
export async function POST(request: NextRequest) {
  const { marcaId, monto } = await request.json();
  const marca = MARCAS.find(m => m.id === marcaId);
  if (!marca) return NextResponse.json({ error: "Marca no encontrada" }, { status: 400 });
  if (!marca.montos.includes(monto)) return NextResponse.json({ error: "Monto no válido" }, { status: 400 });
  const codigo = generarCodigo();
  return NextResponse.json({ marca: marca.nombre, marcaId: marca.id, monto, codigo, fecha: new Date().toISOString() });
}
```

- [ ] **Step 7: Verificar endpoints con build + curl manual**

Run: `npm run build`
Expected: PASS, 6 rutas en output de build
Manual: `npm run dev` y probar `curl http://localhost:3000/api/giftcards/catalogo` y login

- [ ] **Step 8: Commit**

```bash
git add app/api/
git commit -m "feat: 6 endpoints mock (auth, usuario, catalogo, compra)"
```

---

### Task 3: Home (`/`) — catálogo y compra con B1 y B2

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Reemplazar `app/page.tsx` — client component que fetchea catálogo, muestra precios SIN separador (B1), Comprar sin disabled (B2)**

```tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
type Marca = { id: string; nombre: string; montos: number[] };
export default function Home() {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => { fetch("/api/giftcards/catalogo").then(r=>r.json()).then(d=>{ setMarcas(d); setLoading(false); }); }, []);
  const handleComprar = async (marcaId: string, monto: number) => {
    const meRes = await fetch("/api/usuario/me");
    if (!meRes.ok) { router.push(`/login?next=${encodeURIComponent("/")}`); return; }
    const res = await fetch("/api/compra", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ marcaId, monto }) });
    if (res.ok) {
      const data = await res.json();
      const params = new URLSearchParams({ marca: data.marca, marcaId: data.marcaId, monto: String(data.monto), codigo: data.codigo, fecha: data.fecha });
      router.push(`/compra/exito?${params.toString()}`);
    }
  };
  if (loading) return <div className="mx-auto max-w-5xl p-8 text-center">Cargando catálogo...</div>;
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold">Catálogo de Giftcards</h1>
      <p className="mb-6 text-sm text-zinc-600">Elegí una marca y un monto para comprar tu giftcard.</p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {marcas.map(marca => (
          <div key={marca.id} className="rounded-lg border bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold">{marca.nombre}</h2>
            <div className="flex flex-col gap-2">
              {marca.montos.map(monto => (
                <div key={monto} className="flex items-center justify-between rounded border px-3 py-2">
                  <span className="font-medium">${monto}</span>
                  <button onClick={() => handleComprar(marca.id, monto)} className="rounded bg-zinc-900 px-4 py-1.5 text-sm text-white hover:bg-zinc-700">Comprar</button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

Notas de bugs (no comentar en código):
- B1: `<span>${monto}</span>` sin `toLocaleString` ni separador — debe verse `$5000` mientras Éxito muestra `$5.000`.
- B2: botón sin `disabled`, sin estado `loading`, handler sin guard — doble clic dispara dos `fetch /api/compra` + dos `router.push`.

- [ ] **Step 2: Verificar manual**

Run: `npm run dev` → abrir `/`, verificar 4 marcas, cada una 3 montos, precios sin punto, clic rápido en Comprar hace dos requests (Network tab).

- [ ] **Step 3: Build**

Run: `npm run build` → PASS

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: Home con catalogo y flujo compra (B1 formato sin separador, B2 sin disabled)"
```

---

### Task 4: Login (`/login`) — con B3

**Files:**
- Create: `app/login/page.tsx`

- [ ] **Step 1: Crear `app/login/page.tsx` con validación de vacíos pero sin feedback en credenciales inválidas (B3)**

```tsx
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
  useEffect(() => { fetch("/api/usuario/me").then(r => { if (r.ok) router.replace("/"); }); }, [router]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const missingEmail = !email.trim();
    const missingPass = !password.trim();
    setEmailError(missingEmail); setPasswordError(missingPass);
    if (missingEmail || missingPass) return;
    const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
    if (res.ok) { router.push(next); router.refresh(); } else { return; }
  };
  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">Ingresar</h1>
      <form onSubmit={handleSubmit} className="rounded-lg border bg-white p-6 shadow-sm" noValidate>
        <div className="mb-4"><label className="mb-1 block text-sm font-medium">Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} className={`w-full rounded border px-3 py-2 text-sm ${emailError ? "border-red-500":""}`} placeholder="demo@giftitto.com"/>{emailError && <p className="mt-1 text-xs text-red-600">Completá este campo</p>}</div>
        <div className="mb-6"><label className="mb-1 block text-sm font-medium">Contraseña</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} className={`w-full rounded border px-3 py-2 text-sm ${passwordError ? "border-red-500":""}`} placeholder="••••••"/>{passwordError && <p className="mt-1 text-xs text-red-600">Completá este campo</p>}</div>
        <button type="submit" className="w-full rounded bg-zinc-900 py-2 text-sm font-medium text-white">Ingresar</button>
        <p className="mt-4 text-xs text-zinc-500">Usuarios demo: demo@giftitto.com / demo123 — ana@giftitto.com / ana123</p>
      </form>
    </div>
  );
}
export default function LoginPage() { return <Suspense fallback={<div className="p-8 text-center">Cargando...</div>}><LoginForm /></Suspense>; }
```

B3: en `else { return; }` no se setea ningún estado de error — el form "no hace nada" con credenciales inválidas. Sin comentarios.

AC vacíos: sí se valida y se muestra "Completá este campo". AC ya-logueado: `useEffect` redirect a `/`.

- [ ] **Step 2: Verificar**

Run: `npm run dev` → probar: vacío muestra error, credenciales malas no muestran nada, válidas redirigen, ya logueado entra a /login y va a /.

- [ ] **Step 3: Build + Commit**

```bash
npm run build
git add app/login/page.tsx
git commit -m "feat: Login con validacion vacios y B3 sin feedback en invalido"
```

---

### Task 5: Cuenta (`/cuenta`) — IGUAL a GiftittoClient ProfilePage pero simplificada + B5

**Files:**
- Create: `app/cuenta/page.tsx`

Visual: copiar estilo de GiftittoClient `ProfilePage` + `ProfileHeader` simplificado: usar `colors`/`spacing`/`borderRadius`/`shadows`, header con avatar inicial, nombre/email, card de infoRows (email, nombre), sección Mis giftcards con lista, botón Cerrar sesión rojo como en GiftittoClient. Sin friends/notifications/sections — solo lo esencial para QA.

- [ ] **Step 1: Crear `app/cuenta/page.tsx` — visual igual a GiftittoClient pero simplificada, con B5 (sin redirect, fallback demo)**

```tsx
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
        setGiftcards([{ marca: "CineMax", monto: 5000, codigo: "GC-1001-A" }, { marca: "GustoExpress", monto: 3000, codigo: "GC-1002-B" }]);
      }
      setLoading(false);
    });
  }, []);
  const handleLogout = async () => { await fetch("/api/auth/logout", { method: "POST" }); window.location.href = "/"; };
  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><div style={{ width: 36, height: 36, borderRadius: "50%", border: `3px solid ${colors.borderLight}`, borderTopColor: colors.primary, animation: "spin 0.8s linear infinite" }} /></div>;
  const initial = user?.nombre?.charAt(0)?.toUpperCase() ?? "U";
  return (
    <div style={{ minHeight: "100%", backgroundColor: colors.backgroundSecondary }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: `${spacing.xl}px ${spacing.lg}px` }}>
        {/* Header igual a ProfileHeader simplificado */}
        <div style={{ backgroundColor: colors.card, borderRadius: borderRadius.xl, border: `1px solid ${colors.borderLight}`, boxShadow: shadows.sm, padding: spacing.xl, display: "flex", alignItems: "center", gap: spacing.lg, marginBottom: spacing.lg }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", backgroundColor: colors.primary, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: "#fff", fontSize: 24, fontWeight: 700 }}>{initial}</span>
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: colors.text }}>{user?.nombre}</h1>
            <p style={{ margin: 0, fontSize: 14, color: colors.textSecondary }}>{user?.email}</p>
          </div>
        </div>
        {/* Info card estilo GiftittoClient */}
        <div style={{ backgroundColor: colors.card, borderRadius: borderRadius.xl, border: `1px solid ${colors.borderLight}`, boxShadow: shadows.sm, overflow: "hidden", marginBottom: spacing.lg }}>
          <div style={{ padding: `${spacing.md}px ${spacing.lg}px`, borderBottom: `1px solid ${colors.borderLight}` }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: colors.textSecondary, textTransform: "uppercase", letterSpacing: "0.4px" }}>Información</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: spacing.md, padding: `${spacing.md}px ${spacing.lg}px`, borderBottom: `1px solid ${colors.borderLight}` }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", backgroundColor: colors.backgroundSecondary, display: "flex", alignItems: "center", justifyContent: "center" }}><User size={16} color={colors.textSecondary} /></div>
            <div><p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: colors.textTertiary, textTransform: "uppercase" }}>Nombre</p><p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>{user?.nombre}</p></div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: spacing.md, padding: `${spacing.md}px ${spacing.lg}px` }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", backgroundColor: colors.backgroundSecondary, display: "flex", alignItems: "center", justifyContent: "center" }}><Mail size={16} color={colors.textSecondary} /></div>
            <div><p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: colors.textTertiary, textTransform: "uppercase" }}>Email</p><p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>{user?.email}</p></div>
          </div>
        </div>
        {/* Giftcards */}
        <div style={{ backgroundColor: colors.card, borderRadius: borderRadius.xl, border: `1px solid ${colors.borderLight}`, boxShadow: shadows.sm, overflow: "hidden", marginBottom: spacing.lg }}>
          <div style={{ padding: `${spacing.md}px ${spacing.lg}px`, borderBottom: `1px solid ${colors.borderLight}`, display: "flex", alignItems: "center", gap: 8 }}>
            <Gift size={16} color={colors.primary} /><p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: colors.textSecondary, textTransform: "uppercase", letterSpacing: "0.4px" }}>Mis giftcards</p>
          </div>
          {giftcards.map(gc => (
            <div key={gc.codigo} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: `${spacing.md}px ${spacing.lg}px`, borderBottom: `1px solid ${colors.borderLight}` }}>
              <span style={{ fontSize: 14, fontWeight: 500 }}>{gc.marca} — ${gc.monto.toLocaleString("es-AR")}</span><span style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 600, color: colors.primary }}>{gc.codigo}</span>
            </div>
          ))}
        </div>
        <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: spacing.sm, width: "100%", padding: spacing.md, backgroundColor: colors.card, border: `1px solid ${colors.errorLight}`, borderRadius: borderRadius.xl, cursor: "pointer", fontSize: 15, fontWeight: 600, color: colors.error }}>
          <LogOut size={18} color={colors.error} /> Cerrar sesión
        </button>
      </div>
    </div>
  );
}
```

B5: en `else` no hay `router.push("/login")` sino fallback demo — visual idéntico a caso logueado, el postulante no nota la diferencia sin entender control de acceso. Sin comentarios.

- [ ] **Step 2: Verificar**

Abrir `/cuenta` sin sesión → muestra Usuario Demo con estilo GiftittoClient (bug). Con sesión ana@ → muestra Ana Pérez. Ver que colores/spacing coinciden con GiftittoClient.

- [ ] **Step 3: Build + Commit**

```bash
npm run build
git add app/cuenta/page.tsx
git commit -m "feat: Cuenta visual GiftittoClient simplificada con B5"
```

---

### Task 6: Éxito de compra (`/compra/exito`) — IGUAL a GiftittoClient OrderSuccessPage + CouponCard + B1/B4/B6

**Files:**
- Create: `app/compra/exito/page.tsx`

Visual: copiar estructura de `OrderSuccessPage.tsx` simplificada para mock: animación success-icon + confetti, `CouponCard` real (con `code`, `businessName=marca`, `title=marca`, `expiresAt=fecha+30días`), botones Copiar / Compartir / Descargar (puede omitir html2canvas y solo simular), y navegación. Mantener `successAnimationCss`, `ConfettiPiece`, `colors`/`spacing`. Datos vienen de query `?marca=&monto=&codigo=&fecha=` (generados por /api/compra). Sin fetch a Supabase — directo de URL.

- [ ] **Step 1: Crear `app/compra/exito/page.tsx` — visual idéntica a GiftittoClient, con monto formateado con punto (B1), compartir truncado (B4), sin validación (B6)**

```tsx
"use client";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, useRef } from "react";
import { CheckCircle, Copy, Check, Gift, Download, Mail, MessageCircle, ShoppingBag } from "lucide-react";
import { CouponCard } from "@/app/components/CouponCard";
import { colors } from "@/lib/colors";
import { spacing, borderRadius, shadows, typography } from "@/lib/theme";
const successAnimationCss = `@keyframes scaleIn{0%{transform:scale(0.3);opacity:0}60%{transform:scale(1.1);opacity:1}80%{transform:scale(0.95)}100%{transform:scale(1)}}@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes confettiFall{0%{transform:translateY(-10px) rotate(0deg);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}.success-icon{animation:scaleIn 0.6s cubic-bezier(0.175,0.885,0.32,1.275) forwards}.fade-up-1{opacity:0;animation:fadeUp 0.5s ease 0.4s forwards}.fade-up-3{opacity:0;animation:fadeUp 0.5s ease 0.8s forwards}`;
function ConfettiPiece({ index }: { index: number }) {
  const colorsList = ["#d9153d","#15d9b1","#FFD93D","#3B82F6","#10B981","#F59E0B"];
  return <div style={{ position: "fixed", top: -10, left: `${(index*7.3+5)%95}%`, width: 6+(index%5), height: 6+(index%5), backgroundColor: colorsList[index%colorsList.length], borderRadius: index%2===0?"50%":2, animation: `confettiFall ${2+(index%2)}s ease-in ${(index*0.18)%2}s forwards`, pointerEvents: "none", zIndex: 10 }} />;
}
function formatMonto(monto: number) { return `$${monto.toLocaleString("es-AR")}`; }
function ExitoContent() {
  const params = useSearchParams();
  const marca = params.get("marca") || "";
  const monto = Number(params.get("monto") || 0);
  const codigo = params.get("codigo") || "";
  const fecha = params.get("fecha") || "";
  const [copied, setCopied] = useState(false);
  const [showConfetti] = useState(true);
  const couponRef = useRef<HTMLDivElement>(null);
  const handleCopy = async () => { await navigator.clipboard.writeText(codigo); setCopied(true); setTimeout(()=>setCopied(false), 2500); };
  const handleCompartir = async () => {
    const truncated = codigo.slice(0, 4);
    const shareUrl = `${window.location.origin}/compra/exito?marca=${encodeURIComponent(marca)}&monto=${monto}&cod=${encodeURIComponent(truncated)}&fecha=${encodeURIComponent(fecha)}`;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true); setTimeout(()=>setCopied(false), 2000);
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
  const expiresAt = fecha ? new Date(new Date(fecha).getTime() + 30*24*60*60*1000).toISOString() : undefined;
  return (
    <div style={{ minHeight: "100vh", backgroundColor: colors.backgroundSecondary, display: "flex", flexDirection: "column" }}>
      <style>{successAnimationCss}</style>
      {showConfetti && Array.from({ length: 18 }, (_, i) => <ConfettiPiece key={i} index={i} />)}
      <div style={{ flex: 1, padding: spacing.lg, display: "flex", flexDirection: "column", alignItems: "center", gap: spacing.xl, maxWidth: 560, margin: "0 auto", width: "100%" }}>
        <div style={{ paddingTop: spacing.xxxl, display: "flex", flexDirection: "column", alignItems: "center", gap: spacing.lg }}>
          <div className="success-icon" style={{ width: 96, height: 96, borderRadius: 9999, backgroundColor: colors.success50, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 0 16px ${colors.success50}` }}>
            <CheckCircle size={56} color={colors.success} />
          </div>
          <div className="fade-up-1" style={{ textAlign: "center" }}>
            <h1 style={{ ...typography.h3, color: colors.text, margin: `0 0 ${spacing.sm}px` }}>¡Tu giftcard está lista!</h1>
            <p style={{ ...typography.body, color: colors.textSecondary, margin: 0 }}>{formatMonto(monto)} en {marca}</p>
          </div>
        </div>
        <div className="fade-up-3" style={{ width: "100%" }}>
          <CouponCard ref={couponRef} code={codigo} businessName={marca} title={`${marca} ${formatMonto(monto)}`} expiresAt={expiresAt} />
          <div style={{ display: "flex", gap: spacing.sm, marginTop: spacing.lg }}>
            <button onClick={handleCopy} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: spacing.sm, backgroundColor: copied ? colors.success : colors.primary, color: "#fff", border: "none", borderRadius: borderRadius.lg, padding: `${spacing.md}px`, cursor: "pointer", fontWeight: 600 }}>
              {copied ? <Check size={16} /> : <Copy size={16} />}{copied ? "Copiado" : "Copiar código"}
            </button>
            <button onClick={handleCompartir} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: spacing.sm, backgroundColor: "transparent", color: colors.text, border: `1.5px solid ${colors.border}`, borderRadius: borderRadius.lg, padding: `${spacing.md}px`, cursor: "pointer", fontWeight: 600 }}>
              <Gift size={16} /> Compartir
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: spacing.sm, marginTop: spacing.sm }}>
            <button onClick={sendByWhatsApp} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, backgroundColor: colors.card, border: `1px solid ${colors.border}`, borderRadius: borderRadius.lg, padding: `${spacing.md}px`, cursor: "pointer" }}><MessageCircle size={18} color="#25D366" /><span style={{ fontSize: 12, fontWeight: 500 }}>WhatsApp</span></button>
            <button onClick={sendByEmail} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, backgroundColor: colors.card, border: `1px solid ${colors.border}`, borderRadius: borderRadius.lg, padding: `${spacing.md}px`, cursor: "pointer" }}><Mail size={18} color={colors.primary} /><span style={{ fontSize: 12, fontWeight: 500 }}>Email</span></button>
          </div>
          <button onClick={() => window.location.href = "/"} style={{ width: "100%", marginTop: spacing.lg, display: "flex", alignItems: "center", justifyContent: "center", gap: spacing.sm, backgroundColor: colors.primary, color: "#fff", border: "none", borderRadius: borderRadius.xl, padding: `${spacing.lg}px`, cursor: "pointer", fontWeight: 600 }}><ShoppingBag size={20} /> Seguir comprando</button>
          <p style={{ textAlign: "center", fontSize: 12, color: colors.textTertiary, marginTop: spacing.md }}>Refrescá la página: el cupón se mantiene por URL.</p>
        </div>
      </div>
    </div>
  );
}
export default function ExitoPage() { return <Suspense fallback={<div className="p-8 text-center">Cargando...</div>}><ExitoContent /></Suspense>; }
```

Bugs visibles con visual real:
- B1: `formatMonto` con `toLocaleString("es-AR")` → `$5.000` mientras Home sin separador `$5000`. Diferencia sutil con CouponCard.
- B4: `handleCompartir` usa `cod` y `slice(0,4)` — link compartido muestra código truncado, no coincide con CouponCard original.
- B6: sin validación — cualquier `?marca=Fake&monto=999999&codigo=XYZ` renderiza CouponCard como si fuera válido, con barcode y todo.

- [ ] **Step 2: Verificar**

Flujo Home Comprar → éxito muestra CouponCard real con misma estética GiftittoClient, monto `$5.000`; Compartir copia `cod=GC-1`; abrir link muestra código truncado. `/compra/exito?marca=Fake&monto=1&codigo=INVENTADO` muestra cupón válido.

- [ ] **Step 3: Build + Commit**

```bash
npm run build
git add app/compra/exito/page.tsx
git commit -m "feat: Exito con CouponCard igual a GiftittoClient y bugs B4/B6"
```

---

### Task 7: Verificación final y DoD

**Files:**
- (no nuevos, verificación)

- [ ] **Step 1: Checklist DoD**

Verificar:
- `npm run build` y `npm run lint` pasan
- 4 páginas cumplen AC salvo bugs intencionales
- 6 endpoints responden según spec (probar con curl)
- 6 bugs reproducibles solo con navegador (sin devtools):
  - B1 Home $5000 vs Éxito $5.000
  - B2 doble clic Home dispara dos compras
  - B3 login inválido sin feedback
  - B4 compartir link no coincide
  - B5 /cuenta sin login muestra demo
  - B6 /compra/exito con params inventados válido
- No hay comentarios `// bug` en código
- `git log --oneline` muestra commits por task

- [ ] **Step 2: Probar accesibilidad pública (Vercel)**

Si deploy Vercel configurado: `git push` y verificar URL pública carga. Si solo local: confirmar `npm run dev` accesible y nota de Docker para entorno local.

- [ ] **Step 3: Tag / entrega**

No se requiere tag, pero asegurar repo limpio: `git status` sin cambios pendientes.

---

## Self-Review

**Spec coverage:**
- §5.1 Home → Task 3 ✓
- §5.2 Login → Task 4 ✓
- §5.3 Cuenta → Task 5 ✓
- §5.4 Éxito → Task 6 ✓
- §7 Endpoints → Task 2 ✓
- §6 Bugs B1-B6 → Tasks 3-6 distribuidos ✓ (B1 en 3+6, B2 en 3, B3 en 4, B4 en 6, B5 en 5, B6 en 6)
- §8 Modelo mock → Task 1 ✓
- §9 DoD → Task 7 ✓

**Placeholder scan:** Ningún "TBD"/"TODO" — cada step tiene código completo y comandos exactos.

**Type consistency:** `MARCAS`, `USUARIOS_DEMO`, `GIFTCARDS_MOCK`, `generarCodigo()` definidos en Task 1 y usados con mismos nombres/tipos en Tasks 2-6. Cookie `giftitto_session` consistente. Query params `marca, marcaId, monto, codigo, fecha` consistentes salvo B4 intencional (`cod`).

---

## Preguntas abiertas (heredadas del spec §10)

- ¿Dónde reportan los postulantes? No se implementa form en esta iteración (confirmado).
- Docker/Vercel: Dockerfile/docker-compose queda como mejora fuera de este plan si se quiere paridad local; Vercel ignora Dockerfile y buildea desde Next.js — no bloquea este plan.

