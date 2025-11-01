// @typography-status: COMPLETED
// @token-status: COMPLETED

import { cn } from "@/lib/utils"
import React from "react"

// Используем дженерики для корректной типизации пропсов в зависимости от элемента, переданного в 'as'
type TypographyProps<T extends React.ElementType = 'div'> = {
  variant: "h1" | "h2" | "h3" | "p" | "small" | "lead" | "blockquote" | "list" | "inlineCode" | "hint" | "caption";
  as?: T;
  children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'variant' | 'children'> // Исключаем уже определенные пропсы

/**
 * Компонент Typography - основной компонент типографической системы RUS100
 * Использует шрифты Inter и Bitter с оптимизированными размерами для кириллического текста
 */
export function Typography<T extends React.ElementType = 'div'>({ 
  variant, 
  as, 
  children, 
  className, 
  ...props 
}: TypographyProps<T>) {
  const Component = as || 'div'; // Устанавливаем 'div' по умолчанию, если 'as' не предоставлен

  const variants = {
    h1: "font-source-serif-pro text-app-h1-mobile md:text-app-h1 leading-tight font-bold text-foreground", // Более жирный шрифт для заголовков
    h2: "font-source-serif-pro text-app-h2-mobile md:text-app-h2 leading-tight font-semibold text-foreground",
    h3: "font-source-serif-pro text-app-h3-mobile md:text-app-h3 leading-snug font-medium text-foreground",
    h4: "font-inter text-app-large leading-cyr-text font-medium text-foreground", // Обновлен размер
    h5: "font-inter text-app-body leading-cyr-text font-medium text-foreground", // Более жирный
    h6: "font-inter text-app-medium leading-cyr-text font-medium text-foreground", // Новый размер
    p: "font-inter text-app-body leading-cyr-text font-normal text-foreground",
    small: "font-inter text-app-small leading-5 font-normal text-muted-foreground",
    caption: "font-inter text-app-caption leading-4 font-normal text-muted-foreground",
    lead: "font-inter text-app-large leading-relaxed font-normal text-foreground", // Использует app-large
    blockquote: "font-inter text-app-body italic border-l-4 pl-4 border-muted text-foreground font-medium", // Более жирный
    list: "font-inter text-app-body leading-cyr-text list-disc pl-5 space-y-2 text-foreground",
    inlineCode: "font-mono text-app-small bg-muted px-1.5 py-0.5 rounded text-foreground font-medium", // Более жирный код
    hint: "font-inter text-app-caption text-muted-foreground",
  };

  // Filter out deprecated variants to avoid applying empty class strings
  // const effectiveClassName = variants[variant] ? cn(variants[variant], className) : className;

  // More robust className generation:
  // Ensure baseClass is always a string, even if variant is somehow not found (should not happen for defined variants)
  const baseClass = variants[variant] || ""; 
  const effectiveClassName = cn(baseClass, className);

  return (
    <Component 
      className={effectiveClassName}
      {...props}
    >
      {children}
    </Component>
  );
}

// Дополнительные компоненты для удобства использования

export function H1(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <Typography variant="h1" as="h1" {...props} />
  );
}

export function H2(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <Typography variant="h2" as="h2" {...props} />
  );
}

export function H3(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <Typography variant="h3" as="h3" {...props} />
  );
}

export function P(props: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <Typography variant="p" as="p" {...props} />
  );
}

export function Small(props: React.HTMLAttributes<HTMLElement>) {
  return (
    <Typography variant="small" as="small" {...props} />
  );
}

export function Lead(props: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <Typography variant="lead" as="p" {...props} />
  );
}

export function Blockquote(props: React.HTMLAttributes<HTMLQuoteElement>) {
  return (
    <Typography variant="blockquote" as="blockquote" {...props} />
  );
}

export function List(props: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <Typography variant="list" as="ul" {...props} />
  );
}

export function InlineCode(props: React.HTMLAttributes<HTMLElement>) {
  return (
    <Typography variant="inlineCode" as="code" {...props} />
  );
}

export function Hint(props: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <Typography variant="hint" as="p" {...props} />
  );
}