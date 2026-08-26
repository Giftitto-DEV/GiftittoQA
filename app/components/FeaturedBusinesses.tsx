"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronRight } from "lucide-react";
import { colors } from "@/lib/colors";
import { spacing, borderRadius, typography, shadows, transitions } from "@/lib/theme";

interface Business {
  id: string;
  business_name: string;
  logo_url?: string;
}

const NEGOCIOS: Business[] = [
  { id: "cinemax", business_name: "CineMax", logo_url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=200&q=80&auto=format&fit=crop" },
  { id: "gustoexpress", business_name: "GustoExpress", logo_url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&q=80&auto=format&fit=crop" },
  { id: "modaviva", business_name: "ModaViva", logo_url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&q=80&auto=format&fit=crop" },
  { id: "tecnoplus", business_name: "TecnoPlus", logo_url: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&q=80&auto=format&fit=crop" },
];

export function FeaturedBusinesses() {
  const cardWidth = 170;
  const gap = spacing.lg;
  const speed = 0.5;
  const trackRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const pausedRef = useRef(false);
  const posRef = useRef(0);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartPosRef = useRef(0);
  const wasDraggingRef = useRef(false);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    wasDraggingRef.current = false;
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartPosRef.current = posRef.current;
    pausedRef.current = true;
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const track = trackRef.current;
      if (!track) return;
      const delta = dragStartXRef.current - e.clientX;
      if (Math.abs(delta) > 10) wasDraggingRef.current = true;
      const halfWidth = track.scrollWidth / 2;
      let newPos = dragStartPosRef.current + delta;
      if (newPos < 0) newPos += halfWidth;
      if (newPos >= halfWidth) newPos -= halfWidth;
      posRef.current = newPos;
      track.style.transform = `translateX(-${posRef.current}px)`;
    };
    const onUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      pausedRef.current = false;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  const startScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const halfWidth = track.scrollWidth / 2;
    const tick = () => {
      if (!pausedRef.current) {
        posRef.current += speed;
        if (posRef.current >= halfWidth) posRef.current = 0;
        track.style.transform = `translateX(-${posRef.current}px)`;
      }
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);
  }, [speed]);

  useEffect(() => {
    startScroll();
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [startScroll]);

  const items = [...NEGOCIOS, ...NEGOCIOS, ...NEGOCIOS, ...NEGOCIOS];

  return (
    <section style={{ paddingTop: spacing.xxl, paddingBottom: spacing.lg }} className="fade-up">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.lg }}>
        <h2 style={{ ...typography.h4, color: colors.text, margin: 0 }}>Negocios destacados</h2>
        <span style={{ display: "flex", alignItems: "center", gap: spacing.xs, fontSize: 13, fontWeight: 600, color: colors.primary }}>
          Ver todo <ChevronRight size={16} />
        </span>
      </div>

      <div
        style={{ overflow: "hidden", paddingBottom: spacing.xs, cursor: "grab", userSelect: "none", touchAction: "pan-y" }}
        onMouseEnter={() => { if (!isDraggingRef.current) pausedRef.current = true; }}
        onMouseLeave={() => { if (!isDraggingRef.current) pausedRef.current = false; }}
        onPointerDown={handlePointerDown}
        onClickCapture={(e) => {
          if (wasDraggingRef.current) {
            e.stopPropagation();
            wasDraggingRef.current = false;
          }
        }}
      >
        <div ref={trackRef} style={{ display: "flex", gap, width: "max-content", willChange: "transform" }}>
          {items.map((business, i) => (
            <BusinessCard key={`${business.id}-${i}`} business={business} width={cardWidth} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BusinessCard({ business, width }: { business: Business; width: number }) {
  const [hovered, setHovered] = useState(false);
  const initial = business.business_name.charAt(0).toUpperCase();
  const gradientMap: Record<string, [string, string]> = {
    C: [colors.accent200, colors.accent400],
    G: [colors.secondary200, colors.secondary400],
    M: ["#E9D5FF", "#A855F7"],
    T: [colors.accent200, colors.accent500],
  };
  const gradient = gradientMap[initial] ?? [colors.primary200, colors.primary400];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width,
        flexShrink: 0,
        borderRadius: borderRadius.xl,
        backgroundColor: colors.card,
        boxShadow: hovered ? shadows.md : shadows.sm,
        overflow: "hidden",
        cursor: "pointer",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      <div
        style={{
          height: 80,
          background: business.logo_url ? `url(${business.logo_url}) center/cover no-repeat` : `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
          position: "relative",
        }}
      >
        {business.logo_url && <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.08)" }} />}
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: -24, position: "relative", zIndex: 2 }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", border: `3px solid ${colors.card}`, boxShadow: shadows.sm, backgroundColor: colors.backgroundSecondary, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {business.logo_url ? (
            <img src={business.logo_url} alt={business.business_name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span style={{ fontSize: 20, fontWeight: 700, color: colors.primary }}>{initial}</span>
          )}
        </div>
      </div>

      <div style={{ paddingTop: spacing.sm, paddingBottom: spacing.md, paddingLeft: spacing.sm, paddingRight: spacing.sm, textAlign: "center" }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: colors.text, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {business.business_name}
        </p>
      </div>
    </div>
  );
}
