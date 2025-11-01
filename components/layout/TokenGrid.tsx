"use client";

import React from "react";
import { gridGap } from "@/lib/tokens";
import { gridMinItemWidthGroups, gridMinItemWidthTestForm } from "@/lib/tokens/contracts/layout";

export type TokenGridVariant = "groups" | "tests" | "generic";

type TokenGridProps = {
  children: React.ReactNode;
  variant?: TokenGridVariant;
  className?: string;
  style?: React.CSSProperties;
  /** override min item width (e.g., '22rem' or '320px') */
  minItemWidth?: string;
  /** use auto-fit instead of auto-fill */
  autoFit?: boolean;
  /** override gap value */
  gap?: string;
};

export default function TokenGrid({
  children,
  variant = "generic",
  className,
  style,
  minItemWidth,
  autoFit = false,
  gap,
}: TokenGridProps) {
  const defaultMin =
    variant === "groups"
      ? gridMinItemWidthGroups.fallback
      : variant === "tests"
      ? gridMinItemWidthTestForm.fallback
      : "20rem";

  const min = minItemWidth ?? defaultMin;
  const template = `repeat(${autoFit ? "auto-fit" : "auto-fill"}, minmax(${min}, 1fr))`;
  const gridGapVal = gap ?? gridGap.fallback;

  return (
    <div
      className={className}
      style={{ display: "grid", gridTemplateColumns: template, gap: gridGapVal, ...style }}
    >
      {children}
    </div>
  );
}