"use client";
import { useState, useEffect, forwardRef } from "react";
import { Gift } from "lucide-react";
import { Barcode128 } from "./Barcode128";
import { BrandLogo } from "./BrandLogo";
import { colors } from "@/lib/colors";
import { spacing, borderRadius, shadows } from "@/lib/theme";

interface CouponCardProps {
  code: string;
  expiresAt?: string;
  businessName: string;
  businessLogoUrl?: string;
  title: string;
  message?: string;
  description?: string;
  customImageUrl?: string;
  productImageUrl?: string;
  stickerEmojis?: string;
  cardTheme?: { preview_url?: string; background_color?: string } | null;
}

export const CouponCard = forwardRef<HTMLDivElement, CouponCardProps>(
  (
    {
      code,
      expiresAt,
      businessName,
      businessLogoUrl,
      title,
      message,
      description,
      customImageUrl,
      productImageUrl,
      stickerEmojis,
      cardTheme,
    },
    ref
  ) => {
    const [logoError, setLogoError] = useState(false);

    useEffect(() => {
      setLogoError(false);
    }, [businessLogoUrl]);

    const headerUrl = customImageUrl || cardTheme?.preview_url || productImageUrl;
    const headerBgColor = cardTheme?.background_color || colors.backgroundSecondary;

    const truncatedDesc =
      description && description.length > 120
        ? description.slice(0, 117).replace(/\s+\S*$/, "") + "..."
        : description;

    const formatExpiry = (dateStr?: string) => {
      if (!dateStr) return "-";
      const datePart = dateStr.split("T")[0];
      const [y, m, d] = datePart.split("-").map(Number);
      const dt = new Date(y, m - 1, d);
      const weekdays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
      const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
      const wd = weekdays[dt.getDay()];
      const day = String(dt.getDate()).padStart(2, "0");
      const month = months[dt.getMonth()];
      const year = dt.getFullYear();
      return `${wd}, ${day}-${month}-${year}`;
    };

    return (
      <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
        <div
          ref={ref}
          style={{
            width: "100%",
            maxWidth: 380,
            position: "relative",
            padding: 8,
            background: colors.primary,
            borderRadius: 28,
            boxShadow: shadows.xl,
          }}
        >
          <div style={{ background: "#fff", borderRadius: 22, overflow: "hidden", position: "relative" }}>
            {headerUrl && (
              <div style={{ width: "100%", maxHeight: 238, overflow: "hidden", backgroundColor: headerBgColor, position: "relative" }}>
                <img src={headerUrl} alt="" crossOrigin="anonymous" style={{ width: "100%", height: "auto", display: "block" }} />
                {stickerEmojis && (
                  <div style={{ position: "absolute", top: spacing.sm, right: spacing.sm, display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {stickerEmojis.split(" ").filter(Boolean).map((e, i) => (
                      <span key={i} style={{ fontSize: 24, filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4))" }}>
                        {e}
                      </span>
                    ))}
                  </div>
                )}
                {message && (
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: `${spacing.sm}px ${spacing.md}px`, background: "rgba(0,0,0,0.8)" }}>
                    <p style={{ color: "#fff", fontSize: 12, lineHeight: 1.4, margin: 0, fontStyle: "italic" }}>&quot;{message}&quot;</p>
                  </div>
                )}
              </div>
            )}

            <div style={{ padding: `${spacing.xl}px ${spacing.xl}px ${spacing.xxl}px`, position: "relative", display: "flex", gap: spacing.md }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", color: colors.textTertiary, textTransform: "uppercase", margin: 0, marginBottom: spacing.xs }}>
                  {businessName}
                </p>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: colors.text, margin: 0, lineHeight: 1.2 }}>{title}</h2>
                {truncatedDesc && (
                  <p style={{ fontSize: 13, lineHeight: 1.5, color: colors.textSecondary, margin: 0, marginTop: spacing.sm }}>{truncatedDesc}</p>
                )}
              </div>
              {businessLogoUrl && !logoError ? (
                <img
                  src={businessLogoUrl}
                  alt={businessName}
                  crossOrigin="anonymous"
                  onError={() => setLogoError(true)}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    objectFit: "cover",
                    flexShrink: 0,
                    border: `2px solid ${colors.borderLight}`,
                    alignSelf: "flex-start",
                    marginTop: 2,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    backgroundColor: colors.primary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    alignSelf: "flex-start",
                    marginTop: 2,
                  }}
                >
                  <Gift size={22} color="#fff" />
                </div>
              )}
            </div>

            <div style={{ position: "relative", height: 24, backgroundColor: "#fff" }}>
              <div style={{ position: "absolute", left: -16, top: 0, width: 32, height: 24, borderRadius: "0 24px 24px 0", backgroundColor: colors.primary }} />
              <div style={{ position: "absolute", right: -16, top: 0, width: 32, height: 24, borderRadius: "24px 0 0 24px", backgroundColor: colors.primary }} />
              <div style={{ position: "absolute", top: "50%", left: 24, right: 24, borderTop: `2px dashed ${colors.borderLight}` }} />
            </div>

            <div style={{ padding: `${spacing.lg}px ${spacing.xl}px ${spacing.xs}px`, display: "flex", justifyContent: "center" }}>
              <Barcode128 value={code} height={60} width={2} lineColor="#1a1a1a" />
            </div>

            <div style={{ padding: `0 ${spacing.xl}px` }}>
              <div style={{ backgroundColor: colors.primary50, borderRadius: borderRadius.xl, padding: `${spacing.md}px ${spacing.lg}px`, textAlign: "center" }}>
                <p style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 24, fontWeight: 800, color: colors.primary, letterSpacing: "3px", margin: 0, wordBreak: "break-all" }}>
                  {code}
                </p>
              </div>
            </div>

            <div
              style={{
                margin: `${spacing.sm}px ${spacing.xl}px 0`,
                padding: `${spacing.md}px ${spacing.lg}px`,
                backgroundColor: colors.backgroundSecondary,
                borderRadius: borderRadius.lg,
                display: "flex",
                alignItems: "center",
              }}
            >
              <div style={{ flex: 1, textAlign: "center" }}>
                <p style={{ fontSize: 11, color: colors.textSecondary, margin: 0, marginBottom: 2, textTransform: "capitalize" }}>Canjeable en</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: colors.text, margin: 0, wordBreak: "break-word" }}>{businessName}</p>
              </div>
              <div style={{ width: 1, height: 32, backgroundColor: colors.borderLight, margin: `0 ${spacing.md}px` }} />
              <div style={{ flex: 1, textAlign: "center" }}>
                <p style={{ fontSize: 11, color: colors.textSecondary, margin: 0, marginBottom: 2 }}>Vence</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: colors.text, margin: 0 }}>{formatExpiry(expiresAt)}</p>
              </div>
            </div>

            <div style={{ padding: `${spacing.lg}px ${spacing.xl}px ${spacing.xl}px`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BrandLogo variant="dark" size={15} />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

CouponCard.displayName = "CouponCard";
