"use client";

import React from "react";
import { HeaderOrganism, type HeaderOrganismProps } from "@/components/ui/HeaderOrganism";
import { getContentAlignmentStyles, getMainContentStyles } from "@/lib/tokens/layout";

interface PageLayoutProps {
  children: React.ReactNode;
  /** Header configuration */
  header?: HeaderOrganismProps;
  /** Additional className for the main content area */
  className?: string;
  /** Custom styles for the main content area */
  style?: React.CSSProperties;
  /** Whether to include the header (default: true) */
  includeHeader?: boolean;
}

/**
 * PageLayout - Универсальный компонент для layout страниц
 * 
 * Обеспечивает консистентные отступы, выравнивание и структуру для всех страниц.
 * Использует дизайн-токены для адаптивных отступов и размеров.
 * 
 * Особенности:
 * - Единое выравнивание header, breadcrumbs и main контента по левому краю
 * - Автоматические отступы от краев экрана с использованием contentAlignment токенов
 * - Адаптивная ширина контейнера с максимальным значением
 * - Консистентные вертикальные отступы
 * - Интеграция с HeaderOrganism
 * - Поддержка кастомизации через props
 */
export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  header,
  className = "",
  style = {},
  includeHeader = true
}) => {
  const alignmentStyles = getContentAlignmentStyles();
  const mainStyles = getMainContentStyles();

  return (
    <div className="font-sans min-h-screen bg-background flex flex-col">
      {/* Header */}
      {includeHeader && header && (
        <HeaderOrganism {...header} />
      )}

      {/* Main Content with consistent alignment */}
      <main 
        className={`${className}`}
        style={{
          ...mainStyles,
          ...alignmentStyles,
          ...style
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default PageLayout;