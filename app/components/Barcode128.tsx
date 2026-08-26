"use client";
import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

interface Barcode128Props {
  value: string;
  height?: number;
  width?: number;
  lineColor?: string;
  background?: string;
  displayValue?: boolean;
  margin?: number;
}

export function Barcode128({
  value,
  height = 60,
  width = 2,
  lineColor = "#1a1a1a",
  background = "transparent",
  displayValue = false,
  margin = 0,
}: Barcode128Props) {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!ref.current || !value) return;
    try {
      JsBarcode(ref.current, value, {
        format: "CODE128",
        height,
        width,
        lineColor,
        background,
        displayValue,
        margin,
      });
    } catch (err) {
      console.error("Barcode render error:", err);
    }
  }, [value, height, width, lineColor, background, displayValue, margin]);

  if (!value) return null;
  return <svg ref={ref} aria-label={`barcode-${value}`} />;
}
