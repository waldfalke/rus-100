// Code Contracts: PENDING
// @token-status: COMPLETED (Minor hardcoded margins, otherwise uses tokens)
import React from 'react';
import Link from 'next/link'; // Используем Link для навигации

// Определяем тип для элемента хлебных крошек
interface BreadcrumbItem {
  label: string;
  href?: string; // Ссылка необязательна (для последнего элемента)
}

// Определяем props для компонента
interface BreadcrumbsBlockProps {
  items: BreadcrumbItem[];
}

export const BreadcrumbsBlock: React.FC<BreadcrumbsBlockProps> = ({ items }) => (
  <nav aria-label="breadcrumb" className="text-sm text-muted-foreground mb-4">
    <ol className="flex space-x-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-center">
          {index > 0 && (
            <span className="mx-2" aria-hidden="true">/</span> // Используем / как разделитель
          )}
          {item.href && index < items.length - 1 ? (
            <Link href={item.href} className="hover:underline hover:text-foreground">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-foreground" aria-current={index === items.length - 1 ? "page" : undefined}>
              {item.label}
            </span>
          )}
        </li>
      ))}
    </ol>
  </nav>
); 