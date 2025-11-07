'use client';

import React, { Suspense } from 'react';
import { HeaderOrganism } from '@/components/ui/HeaderOrganism';
import { useParams, usePathname, useSearchParams } from 'next/navigation';

const navigationLinks = [
  { href: "/", label: "Главная" },
  { href: "/create-test", label: "Тесты" },
  { href: "/dashboard", label: "Дашборд" },
  { href: "/account", label: "Профиль" }
];

function GroupDetailChrome({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const groupId = params?.id as string;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedTitle = searchParams.get('title');
  const isStatistics = pathname?.includes('/statistics');
  const isEditPage = pathname === `/dashboard/${groupId}/edit`;
  const groupLabel = `Группа ${groupId}`;

  return (
    <div className="min-h-screen bg-background">
      {!isEditPage && (
        <HeaderOrganism 
          userName="Анна Петрова"
          userEmail="anna.petrova@example.com"
          navLinks={navigationLinks}
          breadcrumbItems={[
            { label: "Главная", href: "/" },
            { label: "Дашборд", href: "/dashboard" },
            { label: groupLabel, href: `/dashboard/${groupId}` },
            ...(isStatistics ? [{ label: selectedTitle ?? 'Статистика' }] : []),
          ]}
        />
      )}
      <main className="w-full">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function GroupDetailLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="px-4 py-3 text-sm text-muted-foreground">Загрузка…</div>}>
      <GroupDetailChrome>{children}</GroupDetailChrome>
    </Suspense>
  );
}