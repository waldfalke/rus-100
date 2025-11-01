"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { HeaderOrganism } from "@/components/ui/HeaderOrganism";
import { GroupCard } from "@/components/feature/GroupCard";
import { GroupFilters } from "@/components/feature/GroupFilters";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { H1, P } from "@/components/ui/typography";
import { 
  fontSize3Xl, 
  fontSizeBase, 
  fontWeightBold, 
  fontWeightNormal,
  lineHeightTight,
  lineHeightNormal,
  spacingLg,
  spacingXl,
  gridGap,
  radiusMd
} from "@/lib/tokens";
import ResponsiveContainer from "@/components/layout/ResponsiveContainer";
import TokenGrid from "@/components/layout/TokenGrid";

const mockGroups = [
  {
    id: "1",
    name: "Русский язык для начинающих",
    description: "Базовый курс русского языка для студентов начального уровня. Изучаем алфавит, основные слова и простые фразы.",
    status: "active" as const,
    participantCount: 24,
    testsCount: 8,
    createdAt: "2024-01-15T10:00:00Z"
  },
  {
    id: "2", 
    name: "Продвинутый русский",
    description: "Курс для студентов среднего и продвинутого уровня. Углубленное изучение грамматики и развитие навыков письма.",
    status: "active" as const,
    participantCount: 18,
    testsCount: 12,
    createdAt: "2024-02-01T14:30:00Z"
  },
  {
    id: "3",
    name: "Русская литература",
    description: "Изучение классических произведений русской литературы. Анализ текстов и развитие критического мышления.",
    status: "archived" as const,
    participantCount: 12,
    testsCount: 6,
    createdAt: "2023-12-10T09:15:00Z"
  },
  {
    id: "4",
    name: "Деловой русский",
    description: "Специализированный курс для изучения делового русского языка. Подготовка к работе в русскоязычной среде.",
    status: "draft" as const,
    participantCount: 0,
    testsCount: 3,
    createdAt: "2024-03-01T16:45:00Z"
  },
  {
    id: "5",
    name: "Разговорный русский",
    description: "Практический курс для развития разговорных навыков. Диалоги, ролевые игры и живое общение.",
    status: "active" as const,
    participantCount: 31,
    testsCount: 15,
    createdAt: "2024-01-20T11:20:00Z"
  },
  {
    id: "6",
    name: "Русский для детей",
    description: "Игровой курс русского языка для детей 6-12 лет. Изучение через песни, игры и интерактивные упражнения.",
    status: "draft" as const,
    participantCount: 15,
    testsCount: 5,
    createdAt: "2024-02-15T13:00:00Z"
  }
];

const navigationLinks = [
  { href: "/", label: "Главная" },
  { href: "/create-test", label: "Тесты" },
  { href: "/groups", label: "Все группы" },
  { href: "/account", label: "Профиль" }
];

interface GroupListProps {
  groups: typeof mockGroups;
  onEdit: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onOpen: (id: string) => void;
}

function GroupList({ groups, onEdit, onArchive, onDelete, onOpen }: GroupListProps) {
  if (groups.length === 0) {
    return (
      <div 
        className="text-center py-16"
        style={{
          backgroundColor: "hsl(var(--card))",
          borderRadius: radiusMd.fallback,
          border: "1px solid hsl(var(--border))"
        }}
      >
        <div className="max-w-md mx-auto">
          <div 
            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "hsl(var(--muted))" }}
          >
            <svg className="w-8 h-8" style={{ color: "hsl(var(--muted-foreground))" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 
            className="text-lg font-semibold mb-2"
            style={{ 
              color: "hsl(var(--foreground))",
              fontSize: fontSize3Xl.fallback,
              fontWeight: fontWeightBold.fallback,
              lineHeight: lineHeightTight.fallback
            }}
          >
            Групп не найдено
          </h3>
          <p 
            className="text-sm"
            style={{ 
              color: "hsl(var(--muted-foreground))",
              fontSize: fontSizeBase.fallback,
              fontWeight: fontWeightNormal.fallback,
              lineHeight: lineHeightNormal.fallback
            }}
          >
            Попробуйте изменить параметры поиска или создайте новую группу
          </p>
        </div>
      </div>
    );
  }

  return (
    <TokenGrid variant="groups">
      {groups.map((group) => (
        <GroupCard
          key={group.id}
          id={group.id}
          name={group.name}
          description={group.description}
          status={group.status}
          participantCount={group.participantCount}
          testsCount={group.testsCount}
          createdAt={group.createdAt}
          onEdit={onEdit}
          onArchive={onArchive}
          onDelete={onDelete}
          onOpen={onOpen}
        />
      ))}
    </TokenGrid>
  );
}

export default function GroupsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const router = useRouter();
  
  // Фильтрация групп
  const filteredGroups = mockGroups.filter((group) => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (group.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    
    const matchesTab = activeTab === "all" || 
                      (activeTab === "active" && (group.status === "active" || group.status === "draft")) ||
                      (activeTab === "archived" && group.status === "archived");
    
    return matchesSearch && matchesTab;
  });

  // Сортировка групп: черновики всегда вверху в табе "Активные"
  const sortedGroups = [...filteredGroups].sort((a, b) => {
    if (activeTab === "active") {
      // В табе "Активные": сначала черновики, потом активные
      if (a.status === "draft" && b.status !== "draft") return -1;
      if (a.status !== "draft" && b.status === "draft") return 1;
    }
    // Для остальных случаев сортируем по дате создания (новые сверху)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Обработчики действий
  const handleEdit = (id: string) => {
    console.log("Edit group:", id);
  };

  const handleArchive = (id: string) => {
    console.log("Archive group:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete group:", id);
  };

  // Обработчик поиска
  const handleSearch = (query: string) => {
    console.log('Поиск по запросу:', query);
    // Здесь можно добавить логику поиска
  };

  const handleCreateGroup = () => {
    // TODO: Implement group creation logic
    console.log("Create group clicked");
  };

  const handleOpen = (id: string) => {
    router.push(`/groups/${id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <HeaderOrganism 
        userName="Анна Петрова"
        userEmail="anna.petrova@example.com"
        navLinks={navigationLinks}
        breadcrumbItems={[{ label: "Главная", href: "/" }, { label: "Группы" }]}
      />
      
      <main className="w-full">
         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* 1. Main Page Title "Группы" */}
          <H1 className="font-source-serif-pro text-app-h1-mobile md:text-app-h1 leading-tight font-semibold text-foreground mb-2">Группы</H1>
          {/* 2. Page Subtitle/Description */}
          <P className="font-inter text-app-body leading-cyr-text font-normal text-muted-foreground mb-6">
            Управляйте учебными группами, добавляйте студентов и отслеживайте прогресс.
          </P>

        {/* Фильтры и поиск */}
        <div className="mb-8">
          <GroupFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSearch={handleSearch}
            onCreateGroup={handleCreateGroup}
          />
        </div>

        {/* Sticky navigation tabs */}
        <div className="sticky top-0 z-30 bg-muted rounded-t-xl border-b border-border mb-4">
          <Tabs 
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full max-w-full"
          >
            <TabsList className="grid w-full grid-cols-3 gap-1.5 p-1.5 items-center">
              <TabsTrigger
                value="active"
                className="font-inter text-app-small leading-5 font-normal py-1.5 px-4 rounded-md transition-all duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=active]:hover:bg-primary/90 data-[state=inactive]:bg-background data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-accent data-[state=inactive]:hover:text-accent-foreground"
              >
                Активные
              </TabsTrigger>
              <TabsTrigger
                value="archived"
                className="font-inter text-app-small leading-5 font-normal py-1.5 px-4 rounded-md transition-all duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=active]:hover:bg-primary/90 data-[state=inactive]:bg-background data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-accent data-[state=inactive]:hover:text-accent-foreground"
              >
                Архивные
              </TabsTrigger>
              <TabsTrigger
                value="all"
                className="font-inter text-app-small leading-5 font-normal py-1.5 px-4 rounded-md transition-all duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=active]:hover:bg-primary/90 data-[state=inactive]:bg-background data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-accent data-[state=inactive]:hover:text-accent-foreground"
              >
                Все
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Список групп */}
        <GroupList
          groups={sortedGroups}
          onEdit={handleEdit}
          onArchive={handleArchive}
          onDelete={handleDelete}
          onOpen={handleOpen}
        />
        </div>
      </main>
    </div>
  );
}