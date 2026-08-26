"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { colors } from "@/lib/colors";
import { spacing, borderRadius, typography, transitions, shadows } from "@/lib/theme";

const BUCKET = "https://apyoplvridsszjolarem.supabase.co/storage/v1/object/public/category-images";

const CATEGORY_IMAGES: Record<string, string> = {
  consumible: `${BUCKET}/CONSUMIBLE.webp`,
  gift_card: `${BUCKET}/GIFTCARD.webp`,
  experiencia: `${BUCKET}/EXPERIENCIA.webp`,
  gastronomia: `${BUCKET}/GASTRONOMIA.webp`,
  cafe: `${BUCKET}/CAFE.webp`,
  comida: `${BUCKET}/COMIDA.webp`,
  entretenimiento: `${BUCKET}/ENTRETENIMIENTO.webp`,
  belleza: `${BUCKET}/BELLEZA.webp`,
  fitness: `${BUCKET}/FITNESS.webp`,
  tecnologia: `${BUCKET}/TECNOLOGIA.webp`,
  moda: `${BUCKET}/MODA.webp`,
  hogar: `${BUCKET}/HOGAR.webp`,
  alcohol: `${BUCKET}/BEBIDAS.webp`,
  bebidas: `${BUCKET}/BEBIDAS.webp`,
};

export const GIFT_CATEGORIES = [
  { id: "consumible", name: "Consumible" },
  { id: "gift_card", name: "Gift Card" },
  { id: "experiencia", name: "Experiencia" },
  { id: "gastronomia", name: "Gastronomia" },
  { id: "cafe", name: "Cafe" },
  { id: "comida", name: "Comida" },
  { id: "entretenimiento", name: "Entretenimiento" },
  { id: "belleza", name: "Belleza" },
  { id: "fitness", name: "Fitness" },
  { id: "tecnologia", name: "Tecnologia" },
  { id: "moda", name: "Moda" },
  { id: "hogar", name: "Hogar" },
  { id: "alcohol", name: "Alcohol" },
] as const;

export function CategoryRow() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const imgSize = 64;
  const cardWidth = 110;

  return (
    <div style={{ paddingTop: spacing.xxl, paddingBottom: spacing.sm }} className="fade-up">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.lg }}>
        <h4 style={{ ...typography.h4, color: colors.text, margin: 0 }}>Categorías</h4>
        <span style={{ display: "flex", alignItems: "center", gap: spacing.xs, fontSize: 13, fontWeight: 600, color: colors.primary }}>
          Ver todo <ChevronRight size={16} />
        </span>
      </div>
      <div style={{ display: "flex", gap: 12, overflowX: "auto", scrollbarWidth: "none", paddingBottom: spacing.sm }}>
        {GIFT_CATEGORIES.map((category, idx) => {
          const img = CATEGORY_IMAGES[category.id];
          return (
            <div
              key={category.id}
              className="fade-up"
              onMouseEnter={() => setHoveredId(category.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                flexShrink: 0,
                width: cardWidth,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: spacing.xs,
                padding: `${spacing.sm}px ${spacing.xs}px ${spacing.md}px`,
                backgroundColor: colors.card,
                borderRadius: borderRadius.xl,
                cursor: "pointer",
                boxShadow: hoveredId === category.id ? shadows.md : shadows.sm,
                transform: hoveredId === category.id ? "translateY(-2px)" : "translateY(0)",
                transition: transitions.fast,
                minHeight: 114,
                animationDelay: `${0.05 + idx * 0.04}s`,
              }}
            >
              {img ? (
                <img src={img} alt={category.name} style={{ width: imgSize, height: imgSize, objectFit: "contain" }} loading="lazy" />
              ) : (
                <div style={{ width: imgSize, height: imgSize, borderRadius: borderRadius.lg, backgroundColor: colors.backgroundSecondary }} />
              )}
              <span style={{ fontSize: 11, fontWeight: 600, color: colors.text, textAlign: "center", lineHeight: "14px", margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {category.name}
              </span>
            </div>
          );
        })}
      </div>
      <style>{`div::-webkit-scrollbar{display:none}`}</style>
    </div>
  );
}
