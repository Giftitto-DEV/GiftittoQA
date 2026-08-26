# Bugs Plantados — Giftitto QA (Uso Interno)

> **No compartir con postulantes.** Este documento detalla los bugs intencionales implementados en `giftitto-qa`. El link que reciben los candidatos es solo el sitio corriendo, sin acceso a este archivo ni a comentarios en código.

**Última actualización:** 2026-08-26  
**Total bugs:** 10 (6 del spec original + 4 añadidos a pedido)  
**Stack:** Next.js App Router, `lib/mock-data.ts` + cookies `giftitto_session`, componentes copiados de `GiftittoClient`.

---

## Resumen rápido

| # | Nombre | Ubicación | Severidad | Visible sin devtools |
|---|--------|-----------|-----------|----------------------|
| B1 | Formato moneda inconsistente | Home vs Éxito/Detalle | Baja | Sí |
| B2 | Doble submit sin loading | Home → Comprar | Media | Sí (doble clic) |
| B3 | Login sin feedback | `/login` | Media | Sí |
| B4 | Texto compartir con fruta | `/compra/exito` → Compartir/WhatsApp/Email | Media | Sí |
| B5 | Cuenta sin control de acceso | `/cuenta` | Alta | Sí (incógnito) |
| B6 | Éxito sin validación de query | `/compra/exito` | Media/Alta | Sí (URL inventada) |
| B7 | Cupón sin imagen solo en ModaViva | `/compra/exito` CouponCard | Baja | Sí (comparar marcas) |
| B8 | Categorías siempre con error | Home → Categorías | Media | Sí (alert) |
| B9 | Token backend en console | Global (Navbar) | Media/Alta | No (requiere DevTools) |
| B10 | Producto sin imagen solo 1 tipo* | `/compra/exito` | Baja | Sí |

*B7 y B10 son el mismo: ModaViva sin header.

---

## Detalle

### B1 — Formato moneda inconsistente
- **Dónde:** `app/page.tsx` (`${monto}` crudo → `$5000`) vs `app/producto/[id]/page.tsx` y `app/compra/exito/page.tsx` (`$${monto.toLocaleString("es-AR")}` → `$5.000`) y `CouponCard`.
- **Reproducción:** Entrar a `/` ver `$5000`, comprar → en éxito/detalle ver `$5.000`.
- **Evalúa:** Atención al detalle / consistencia visual.
- **Sin comentario en código.**

### B2 — Botón Comprar no deshabilita
- **Dónde:** `app/page.tsx` `handleComprar` sin `disabled` ni `loading`.
- **Repro:** Logueado, doble clic rápido en `Comprar` → Network muestra 2× `POST /api/compra` y 2 `router.push` seguidos; a veces 2 códigos distintos.
- **Evalúa:** Estados de carga, doble submit.

### B3 — Login inválido sin mensaje
- **Dónde:** `app/login/page.tsx` `else { return; }` sin setear error.
- **Repro:** `demo@giftitto.com` / `wrong` → form no hace nada. Vacíos sí muestran “Completá este campo”. Válidas sí redirigen. Ya logueado → `/login` redirige a `/`.
- **Evalúa:** UX / manejo de errores.

### B4 — Compartir con texto fruta (nonsense)
- **Dónde:** `app/compra/exito/page.tsx` `captureAndShare` + `handleCompartir` usan `html2canvas` para foto del cupón (igual que GiftittoClient) pero texto es `Te regalo una banana split con el código ${codigo} - fruta fruta!` en vez de `Te regalo ${marca} ${monto} con el código`.
- **Repro:** Comprar → en éxito usar WhatsApp/Email/Compartir → la foto es correcta pero el texto compartido habla de banana, no de la marca/monto real. Compartir con `navigator.share({files, text})` o fallback descarga + `wa.me`/`mailto`.
- **Evalúa:** Testing de contenido compartido, coherencia.
- **Nota:** Reemplaza el B4 original de spec (link con `cod` truncado) a pedido de “texto cualquier fruta pero funcionando como GiftittoClient”.

### B5 — Cuenta sin control de acceso
- **Dónde:** `app/cuenta/page.tsx` fallback `else { setUser(Usuario Demo) }` en vez de `router.push("/login")`.
- **Repro:** Incógnito → `/cuenta` → muestra `Usuario Demo` + 2 giftcards, no redirige. Con login muestra usuario real (`ana@`). Logout borra cookie y va a `/`.
- **Evalúa:** Control de acceso.
- **Visual:** Igual a `GiftittoClient` ProfilePage simplificada (header avatar, card Información, Mis giftcards, botón rojo) para no delatar.

### B6 — Éxito sin validación
- **Dónde:** `app/compra/exito/page.tsx` lee `searchParams` sin validar contra `MARCAS`.
- **Repro:** Ir directo a `/compra/exito?marca=Fake&monto=999999&codigo=INVENTADO&fecha=...` → renderiza `CouponCard` con barcode y todo como compra válida. Refresh mantiene por URL.
- **Evalúa:** Validación entrada, mentalidad atacante.

### B7 — Cupón sin imagen solo para 1 tipo
- **Dónde:** `app/compra/exito/page.tsx` `productImageUrl = marca === "ModaViva" ? undefined : brandImagesByName[marca]`.
- **Repro:** Comprar `ModaViva $4000` → cupón sin header imagen; comprar `CineMax/GustoExpress/TecnoPlus` → con imagen. Todos los productos en Home/Detalle sí tienen imagen.
- **Evalúa:** Consistencia visual por tipo de producto.
- **Sutil:** Solo 1 marca afectada.

### B8 — Categorías con alert de error
- **Dónde:** `app/components/CategoryRow.tsx` `onClick={() => alert('Error: No se pudo cargar la categoría "X". Intenta nuevamente más tarde.')}`.
- **Repro:** En Home clickear cualquier categoría (Consumible, Tecnología, etc.) → `alert` nativo con error. Imágenes vienen del bucket real `category-images` de Supabase.
- **Evalúa:** Manejo de errores, UX.

### B9 — Token backend en console
- **Dónde:** `app/components/Navbar.tsx` `useEffect` con `console.log("[Giftitto API] backend_token:", "giftitto_pk_live_...")` y `supabase anon key` mock.
- **Repro:** Abrir DevTools → Console en cualquier página → aparecen 2 logs con keys genéricas (no reales). Visible solo con devtools, como fuga accidental.
- **Evalúa:** Seguridad, revisión de logs.

### B10 — (Duplicado de B7 para trazabilidad)
- Mismo que B7, listado separado si se quiere contar como “1 producto sin imagen”.

---

## Qué NO es bug (funciona igual que GiftittoClient)

- Navbar rojo `#d9153d` con logo todo blanco (no rojo sobre rojo)
- Home con `CategoryRow` + `FeaturedBusinesses` carrusel infinito (auto-scroll + drag) con 4 negocios del proyecto
- Home cards con imagen real por marca (Unsplash) + `FeaturedBusinesses` y `GiftCardItem` con hover `translateY(-4px)`
- Detalle `/producto/[id]` igual a `GiftDetailPage` (ImageSection, PriceBlock, BusinessCard, TrustIndicators, Tabs, quantity, Comprar)
- Cuenta visual `ProfilePage` simplificada con `colors`/`spacing`/`shadows`
- Éxito con `CouponCard` + `Barcode128` + `BrandLogo` + confetti + foto compartida vía `html2canvas`
- Animaciones globales `fadeUp`/`scaleIn`/`spin`/`pulse` en todas las vistas
- `docs/design.md` con paleta GiftittoClient

---

## Verificación DoD

- [x] 4 páginas + detalle cumplen AC (salvo bugs)
- [x] 6 endpoints mock OK
- [x] 8-10 bugs reproducibles solo con navegador (B9 requiere console)
- [x] Sin `// bug` en código
- [x] `npm run build` y `npm run lint` pasan (warnings `no-img-element` esperados)

---

## Cómo usar para evaluar

1. Mandar link del sitio sin este doc.
2. Pedir reporte con pasos, severidad, evidencia.
3. Comparar contra esta lista: postulante ideal encuentra B1, B3, B5, B6 + al menos 1 de los sutiles (B4 fruta, B7 imagen, B8 categorías).

