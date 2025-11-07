// Code Contracts: PENDING
// Unified Breadcrumbs component built on shadcn primitives with responsive behavior
import * as React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb";
import { cn } from "@/lib/utils";

export interface CrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: CrumbItem[];
  className?: string;
  separator?: React.ReactNode;
}

export function Breadcrumbs({ items, className, separator }: BreadcrumbsProps) {
  // Находим предыдущую страницу для мобильной ссылки
  const previousPage = items.length > 1 ? items[items.length - 2] : null;
  
  return (
    <div className={cn("mb-4", className)}>
      {/* Мобильная версия - простая ссылка назад */}
      <div className="block sm:hidden">
        {previousPage && previousPage.href ? (
          <Link 
            href={previousPage.href}
            className="inline-flex items-center text-primary hover:underline text-sm font-medium"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span className="truncate max-w-[70vw]" title={previousPage.label}>
              {previousPage.label}
            </span>
          </Link>
        ) : (
          <span className="inline-flex items-center text-muted-foreground text-sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Назад
          </span>
        )}
      </div>

      {/* Десктопная версия - полные breadcrumbs */}
      <Breadcrumb className="hidden sm:block">
        <BreadcrumbList>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <React.Fragment key={`${item.label}-${index}`}>
                {index > 0 && (
                  <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
                )}
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>
                      <span className="max-w-[240px] sm:max-w-[300px] truncate align-middle" title={item.label}>
                        {item.label}
                      </span>
                    </BreadcrumbPage>
                  ) : item.href ? (
                    <BreadcrumbLink href={item.href}>
                      <span className="max-w-[240px] sm:max-w-[300px] truncate align-middle" title={item.label}>
                        {item.label}
                      </span>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbLink asChild>
                      <span className="max-w-[240px] sm:max-w-[300px] truncate align-middle" title={item.label}>
                        {item.label}
                      </span>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}