"use client";

import React from "react";
import { containerMaxWidth } from "@/lib/tokens";
import { pagePaddingX, pagePaddingY } from "@/lib/tokens/contracts/layout";

type ResponsiveContainerProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export default function ResponsiveContainer({ children, className, style }: ResponsiveContainerProps) {
  const maxWidth = containerMaxWidth.fallback;
  const px = pagePaddingX.fallback;
  const py = pagePaddingY.fallback;

  return (
    <div
      className={className}
      style={{
        maxWidth,
        marginLeft: "auto",
        marginRight: "auto",
        paddingLeft: px,
        paddingRight: px,
        paddingTop: py,
        paddingBottom: py,
        width: "100%",
        ...style,
      }}
    >
      {children}
    </div>
  );
}