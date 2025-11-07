"use client";

import * as React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Density } from "@/components/ui/action-panel";
import { cn } from "@/lib/utils";

export const SourceSwitcher: React.FC<{
  value?: "all" | "platform" | "mine";
  onChange?: (value: "all" | "platform" | "mine") => void;
  density?: Density;
}> = ({ value, onChange, density = "compact" }) => {
  const controlClass = density === "cozy" ? "h-10 px-3" : "h-9 px-3";
  const handleChange = (v: "all" | "platform" | "mine") => () => onChange?.(v);
  return (
    <TabsList className={cn("grid w-auto grid-cols-3")}
      aria-label="Переключатель источника"
      role="tablist"
    >
      <TabsTrigger value="all" className={controlClass} onClick={handleChange("all")}>Все</TabsTrigger>
      <TabsTrigger value="platform" className={controlClass} onClick={handleChange("platform")}>Тесты платформы</TabsTrigger>
      <TabsTrigger value="mine" className={controlClass} onClick={handleChange("mine")}>Мои тесты</TabsTrigger>
    </TabsList>
  );
};

SourceSwitcher.displayName = "SourceSwitcher";