'use client';

import React from 'react';
import { HeaderOrganism } from '@/components/ui/HeaderOrganism';
import { useParams, usePathname, useSearchParams } from 'next/navigation';

const navigationLinks = [
  { href: "/", label: "Главная" },
  { href: "/create-test", label: "Тесты" },
  { href: "/dashboard", label: "Дашборд" },
  { href: "/account", label: "Профиль" }
];

export default function GroupDetailLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const groupId = params?.id as string;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedTitle = searchParams.get('title');
  const isStatistics = pathname?.includes('/statistics');
  const groupLabel = `Группа ${groupId}`;

  return (
    <div className="min-h-screen bg-background">
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
      <main className="w-full">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}