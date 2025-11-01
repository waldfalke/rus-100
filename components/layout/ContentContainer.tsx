"use client";

import React from "react";
import { getPageLayoutStyles } from "@/lib/tokens/layout";

interface ContentContainerProps {
  children: React.ReactNode;
  /** Additional className */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Whether to include vertical padding (default: true) */
  includeVerticalPadding?: boolean;
  /** Whether to include horizontal padding (default: true) */
  includeHorizontalPadding?: boolean;
}

/**
 * ContentContainer - Контейнер для контента с консистентными отступами
 * 
 * Более легковесная альтернатива PageLayout для случаев, когда нужен
 * только контейнер с правильными отступами без полной структуры страницы.
 * 
 * Использует те же дизайн-токены, что и PageLayout для консистентности.
 */
export const ContentContainer: React.FC<ContentContainerProps> = ({
  children,
  className = "",
  style = {},
  includeVerticalPadding = true,
  includeHorizontalPadding = true
}) => {
  const layoutStyles = getPageLayoutStyles();
  
  // Создаем стили на основе настроек
  const containerStyles: React.CSSProperties = {
    maxWidth: layoutStyles.maxWidth,
    marginLeft: layoutStyles.marginLeft,
    marginRight: layoutStyles.marginRight,
    width: layoutStyles.width,
    ...(includeHorizontalPadding && {
      paddingLeft: layoutStyles.paddingLeft,
      paddingRight: layoutStyles.paddingRight
    }),
    ...(includeVerticalPadding && {
      paddingTop: layoutStyles.paddingTop,
      paddingBottom: layoutStyles.paddingBottom
    }),
    ...style
  };

  return (
    <div 
      className={className}
      style={containerStyles}
    >
      {children}
    </div>
  );
};

export default ContentContainer;