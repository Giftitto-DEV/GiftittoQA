import { colors } from "@/lib/colors";

interface BrandLogoProps {
  variant?: "dark" | "light";
  size?: number;
  style?: React.CSSProperties;
}

export function BrandLogo({ variant = "dark", size = 22, style }: BrandLogoProps) {
  const baseColor = variant === "light" ? colors.textInverse : colors.text;
  const accent = colors.primary;

  const rootStyle: React.CSSProperties = {
    fontSize: size,
    fontWeight: 800,
    letterSpacing: "-0.5px",
    lineHeight: 1,
    fontFamily: "inherit",
    color: baseColor,
    display: "inline-flex",
    ...style,
  };

  return (
    <span style={rootStyle} aria-label="Giftitto">
      <span style={{ color: baseColor }}>Gift</span>
      <span style={{ color: accent }}>it</span>
      <span style={{ color: baseColor }}>to</span>
    </span>
  );
}
