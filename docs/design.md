# Giftitto Design System — Colores y Tema

> Fuente: copia exacta de `GiftittoClient/src/styles/colors.ts` y `src/styles/theme.ts` para mantener paridad visual entre `giftitto-qa` (mock QA) y `GiftittoClient` (producción).

## Paleta Principal

| Token | Hex | Uso |
|-------|-----|-----|
| `primary` | `#d9153d` | CTAs, badges descuento, CouponCard borde, Navbar activo |
| `primaryDark` | `#B01131` | hover primary |
| `primaryLight` | `#E54361` | gradients |
| `primary50` | `#FDF2F4` | fondos suaves, estados hover radio/checkbox |
| `primary100` | `#FCE4E9` | avatar fallback |
| `secondary` | `#15d9b1` | acento secundario, distancia activa |
| `accent` | `#FFD93D` | favoritos, rating stars |
| `success` | `#10B981` | icono éxito OrderSuccess, badge copiado |
| `success50` | `#ECFDF5` | fondo icono éxito |
| `warning` | `#F59E0B` | pending, stock bajo |
| `error` | `#EF4444` | logout, agotado |
| `errorLight` | `#F87171` | borde botón cerrar sesión |
| `info` | `#3B82F6` | info |

## Neutros y Fondos

| Token | Hex |
|-------|-----|
| `background` | `#FFFFFF` |
| `backgroundSecondary` | `#F9F9F9` — fondo de Home / Cuenta / Éxito |
| `card` | `#FFFFFF` — cards, modales |
| `text` | `#1F2937` |
| `textSecondary` | `#6B7280` |
| `textTertiary` | `#9CA3AF` |
| `textInverse` | `#FFFFFF` |
| `border` | `#E5E7EB` |
| `borderLight` | `#F3F4F6` |
| `borderDark` | `#D1D5DB` |

## Gradients

- `primary: ['#d9153d', '#E54361', '#F5AEBD']`
- `sunset: ['#d9153d', '#FFD93D']`
- `ocean: ['#15d9b1', '#3B82F6']`

## Spacing

```ts
spacing.xs=4, sm=8, md=12, lg=16, xl=20, xxl=24, xxxl=32, xxxxl=40
```

## Border Radius

```ts
sm=4, md=8, lg=12, xl=16, xxl=20, full=9999
// CouponCard usa 28/22, Home cards usan xl (16)
```

## Shadows

- `sm: 0 2px 3px rgba(0,0,0,0.05)`
- `md: 0 4px 6px rgba(0,0,0,0.08)`
- `lg: 0 8px 12px rgba(0,0,0,0.12)`
- `xl: 0 12px 16px rgba(0,0,0,0.15)`

## Typography (theme.ts)

- `h3: 24/32 600`, `h4: 20/28 600`, `h5: 18/26 600`
- `body: 16/24 400`, `bodySmall: 14/20`, `caption: 12/16`
- `overline: 12/16 600 uppercase 1px`

## Uso en giftitto-qa

- **Home** (`app/page.tsx`): `GiftCardItem`-style grid, `card` + `shadows`, hover `translateY(-4px)`, precio `text` 18 bold sin separador (B1)
- **Cuenta** (`app/cuenta/page.tsx`): `ProfileHeader` simplificado, cards `borderLight` + `shadows.sm`, botón logout `errorLight`
- **Éxito / CouponCard** (`app/compra/exito/page.tsx` + `app/components/CouponCard.tsx`): borde `primary`, `primary50` para código, `success`/`success50` para éxito, `Barcode128` + `BrandLogo`
- **Navbar / Layout**: `backgroundSecondary` fondo, `card` header

## Import

```ts
import { colors } from "@/lib/colors";
import { spacing, borderRadius, shadows, typography, layout } from "@/lib/theme";
```

Archivo fuente en este repo: `lib/colors.ts`, `lib/theme.ts` (copias 1:1 de GiftittoClient).

