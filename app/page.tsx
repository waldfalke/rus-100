"use client";

import React from "react";
import { TopNavBlock } from "@/components/ui/TopNavBlock";
import { H1 } from "@/components/ui/typography";
import ResponsiveContainer from "@/components/layout/ResponsiveContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  BookOpen, 
  Users, 
  User, 
  FileText, 
  BarChart3, 
  CheckSquare, 
  MessageSquare,
  Settings,
  Palette,
  TestTube,
  Folder,
  Calendar,
  TrendingUp
} from "lucide-react";

interface NavLink {
  href: string;
  label: string;
}

const navigationLinks: NavLink[] = [
  { href: "/", label: "Главная" },
  { href: "/create-test", label: "Тесты" },
  { href: "/groups", label: "Все группы" },
  { href: "/account", label: "Профиль" }
];

interface PageLink {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
}

const allPages: PageLink[] = [
  // Основные страницы
  {
    href: "/create-test",
    title: "Создание теста",
    description: "Создание и прохождение тестов по русскому языку",
    icon: <BookOpen className="h-6 w-6" />,
    category: "Основные"
  },
  {
    href: "/groups",
    title: "Все группы",
    description: "Управление учебными группами и студентами",
    icon: <Users className="h-6 w-6" />,
    category: "Основные"
  },
  {
    href: "/account",
    title: "Профиль",
    description: "Настройки пользователя и личная информация",
    icon: <User className="h-6 w-6" />,
    category: "Основные"
  },
  
  // Учебные материалы
  {
    href: "/tasks",
    title: "Задания",
    description: "Интерактивные упражнения и задания",
    icon: <CheckSquare className="h-6 w-6" />,
    category: "Обучение"
  },
  {
    href: "/results",
    title: "Результаты",
    description: "Просмотр результатов тестов и прогресса",
    icon: <BarChart3 className="h-6 w-6" />,
    category: "Обучение"
  },
  {
    href: "/dashboard",
    title: "Дашборд",
    description: "Общая статистика и обзор активности",
    icon: <BarChart3 className="h-6 w-6" />,
    category: "Обучение"
  },
  {
    href: "/answers",
    title: "Ответы",
    description: "Проверка и оценка ответов студентов",
    icon: <MessageSquare className="h-6 w-6" />,
    category: "Обучение"
  },
  
  // Дополнительные страницы
  {
    href: "/statistics",
    title: "Статистика",
    description: "Подробная аналитика и отчеты",
    icon: <BarChart3 className="h-6 w-6" />,
    category: "Дополнительно"
  }
];

export default function HomePage() {
  const groupedPages = allPages.reduce((acc, page) => {
    if (!acc[page.category]) {
      acc[page.category] = [];
    }
    acc[page.category].push(page);
    return acc;
  }, {} as Record<string, PageLink[]>);

  return (
    <div className="min-h-screen bg-background">
      <TopNavBlock 
        userName="Анна Петрова"
        userEmail="anna.petrova@example.com"
        navLinks={navigationLinks}
      />
      
      <ResponsiveContainer>
        <div className="space-y-8 py-8">
          <div className="text-center">
            <H1>Система изучения русского языка</H1>
            <p className="text-muted-foreground mt-4 text-lg">
              Выберите нужный раздел для работы с системой
            </p>
          </div>

          {Object.entries(groupedPages).map(([category, pages]) => (
            <div key={category} className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pages.map((page) => (
                  <Card key={page.href} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                          {page.icon}
                        </div>
                        <CardTitle className="text-lg">{page.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-4">
                        {page.description}
                      </CardDescription>
                      <Link href={page.href}>
                        <Button className="w-full">
                          Перейти
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ResponsiveContainer>
    </div>
  );
}