"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import type { Density } from "@/components/ui/action-panel";

export const SourceSwitcher: React.FC<{
  value?: "all" | "platform" | "mine";
  onChange?: (value: "all" | "platform" | "mine") => void;
  density?: Density;
  labelAll?: string;
  labelPlatform?: string;
  labelMine?: string;
}> = ({
  value = "platform",
  onChange,
  density = "compact",
  labelAll = "Все",
  labelPlatform = "Тесты платформы",
  labelMine = "Мои тесты",
}) => {
  const controlClass = density === "cozy" ? "h-10 px-3" : "h-9 px-3";
  const handleChange = (v: "all" | "platform" | "mine") => () => onChange?.(v);

  return (
    <div
      className="inline-flex items-center gap-1"
      role="tablist"
      aria-label="Переключатель источника"
    >
      <Button
        variant={value === "all" ? "default" : "ghost"}
        className={controlClass}
        onClick={handleChange("all")}
        role="tab"
        aria-selected={value === "all"}
      >
        {labelAll}
      </Button>
      <Button
        variant={value === "platform" ? "default" : "ghost"}
        className={controlClass}
        onClick={handleChange("platform")}
        role="tab"
        aria-selected={value === "platform"}
      >
        {labelPlatform}
      </Button>
      <Button
        variant={value === "mine" ? "default" : "ghost"}
        className={controlClass}
        onClick={handleChange("mine")}
        role="tab"
        aria-selected={value === "mine"}
      >
        {labelMine}
      </Button>
    </div>
  );
};

SourceSwitcher.displayName = "SourceSwitcher";