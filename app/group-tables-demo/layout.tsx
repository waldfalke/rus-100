import React from "react";
import { PageLayout } from "@/components/layout/PageLayout";

export default function GroupTablesDemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageLayout
      header={{
        // Показываем шапку с дефолтной навигацией и хлебными крошками
        breadcrumbItems: [
          { label: "Главная", href: "/" },
          { label: "Дашборд", href: "/dashboard" },
          { label: "Таблицы группы", href: "/group-tables-demo" },
        ],
      }}
      className="pb-8"
    >
      {children}
    </PageLayout>
  );
}