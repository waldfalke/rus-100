'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HeaderOrganism } from '@/components/ui/HeaderOrganism';
import { H1 } from '@/components/ui/typography';
import ResponsiveContainer from '@/components/layout/ResponsiveContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponsiveStatsTable } from '@/components/ui/responsive-stats-table';
import { 
  Users, 
  BookOpen, 
  Target, 
  Clock,
  BarChart3
} from 'lucide-react';
import { StatisticsCard } from '@/components/ui/statistics-card';
import { getTaskStatisticsByGroupId } from '@/data/statistics-adapter';

// Импортируем данные о группах для определения статуса
const mockGroups = [
  {
    id: "1",
    name: "Русский-Годовой, 2025",
    description: "Основной курс русского языка для подготовки к экзаменам",
    status: "active" as const,
    participantCount: 24,
    testsCount: 12,
    createdAt: "2024-01-15T09:00:00Z"
  },
  {
    id: "2",
    name: "Подготовка к ЕГЭ",
    description: "Интенсивный курс подготовки к единому государственному экзамену",
    status: "active" as const,
    participantCount: 18,
    testsCount: 8,
    createdAt: "2024-02-01T10:30:00Z"
  },
  {
    id: "3",
    name: "Орфография и пунктуация",
    description: "Углубленное изучение правил русской орфографии и пунктуации",
    status: "active" as const,
    participantCount: 22,
    testsCount: 15,
    createdAt: "2024-03-10T14:15:00Z"
  },
  {
    id: "4",
    name: "Литературное чтение",
    description: "Анализ произведений русской классической литературы",
    status: "archived" as const,
    participantCount: 16,
    testsCount: 10,
    createdAt: "2023-09-01T08:00:00Z"
  },
  {
    id: "5",
    name: "Развитие речи",
    description: "Практические занятия по развитию устной и письменной речи",
    status: "archived" as const,
    participantCount: 20,
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
const getGroupNameById = (id: string): string => {
  const groupNames: Record<string, string> = {
    '1': 'Работа с текстом, Нормы, Орфография, Пунктуация'
  };
  return groupNames[id] || `Группа ${id}`;
};

const getGroupStatusById = (id: string): string => {
  const group = mockGroups.find(g => g.id === id);
  return group?.status || 'active';
};

export default function GroupStatsClient({ groupId }: { groupId: string }) {
  const router = useRouter();
  const groupName = getGroupNameById(groupId);
  const groupStatus = getGroupStatusById(groupId);
  const isDraft = groupStatus === 'draft';
  
  // Устанавливаем активный таб по умолчанию: для черновиков - "table", для остальных - "skills"
  const [activeTab, setActiveTab] = useState(isDraft ? 'table' : 'skills');

  const navigationLinks = [
    { href: "/", label: "Главная" },
    { href: "/create-test", label: "Тесты" },
    { href: "/groups", label: "Все группы" },
    { href: "/account", label: "Профиль" }
  ];

  // Mock данные для ResponsiveStatsTable
  const mockTableStudents = [
    { id: '1', name: 'Иванов Алексей', email: 'ivanov@example.com' },
    { id: '2', name: 'Петрова Мария', email: 'petrova@example.com' },
    { id: '3', name: 'Сидоров Дмитрий', email: 'sidorov@example.com' },
    { id: '4', name: 'Козлова Анна', email: 'kozlova@example.com' },
    { id: '5', name: 'Морозов Игорь', email: 'morozov@example.com' },
    { id: '6', name: 'Васильева Елена', email: 'vasileva@example.com' },
    { id: '7', name: 'Николаев Павел', email: 'nikolaev@example.com' },
    { id: '8', name: 'Смирнова Ольга', email: 'smirnova@example.com' },
    { id: '9', name: 'Федоров Андрей', email: 'fedorov@example.com' },
    { id: '10', name: 'Кузнецова Татьяна', email: 'kuznetsova@example.com' },
    { id: '11', name: 'Попов Максим', email: 'popov@example.com' },
    { id: '12', name: 'Лебедева Наталья', email: 'lebedeva@example.com' },
    { id: '13', name: 'Волков Сергей', email: 'volkov@example.com' },
    { id: '14', name: 'Соколова Юлия', email: 'sokolova@example.com' },
    { id: '15', name: 'Новиков Владимир', email: 'novikov@example.com' }
  ];

  // Новая структура с группами колонок (по примеру из референса)
  const mockColumnGroups = [
    {
      name: 'Работа с текстом',
      key: 'text-work-1',
      columns: [
        { key: 'text1_total', label: 'Всего', type: 'score' as const, sortable: true },
        { key: 'text1_1', label: '№1', type: 'score' as const, sortable: true },
        { key: 'text1_2', label: '№2', type: 'score' as const, sortable: true },
        { key: 'text1_3', label: '№3', type: 'score' as const, sortable: true },
      ],
      collapsed: false
    },
    {
      name: 'Нормы',
      key: 'norms',
      columns: [
        { key: 'norms_total', label: 'Всего', type: 'score' as const, sortable: true },
        { key: 'norms_4', label: '№4', type: 'score' as const, sortable: true },
        { key: 'norms_5', label: '№5', type: 'score' as const, sortable: true },
        { key: 'norms_6', label: '№6', type: 'score' as const, sortable: true },
        { key: 'norms_7', label: '№7', type: 'score' as const, sortable: true },
        { key: 'norms_8', label: '№8', type: 'score' as const, sortable: true },
      ],
      collapsed: false
    },
    {
      name: 'Орфография',
      key: 'orfography',
      columns: [
        { key: 'orf_total', label: 'Всего', type: 'score' as const, sortable: true },
        { key: 'orf_9', label: '№9', type: 'score' as const, sortable: true },
        { key: 'orf_10', label: '№10', type: 'score' as const, sortable: true },
        { key: 'orf_11', label: '№11', type: 'score' as const, sortable: true },
        { key: 'orf_12', label: '№12', type: 'score' as const, sortable: true },
        { key: 'orf_13', label: '№13', type: 'score' as const, sortable: true },
        { key: 'orf_14', label: '№14', type: 'score' as const, sortable: true },
        { key: 'orf_15', label: '№15', type: 'score' as const, sortable: true },
      ],
      collapsed: false
    },
    {
      name: 'Пунктуация',
      key: 'punctuation',
      columns: [
        { key: 'punct_total', label: 'Всего', type: 'score' as const, sortable: true },
        { key: 'punct_16', label: '№16', type: 'score' as const, sortable: true },
        { key: 'punct_17', label: '№17', type: 'score' as const, sortable: true },
        { key: 'punct_18', label: '№18', type: 'score' as const, sortable: true },
        { key: 'punct_19', label: '№19', type: 'score' as const, sortable: true },
        { key: 'punct_20', label: '№20', type: 'score' as const, sortable: true },
        { key: 'punct_21', label: '№21', type: 'score' as const, sortable: true },
      ],
      collapsed: false
    },
    {
      name: 'Работа с текстом',
      key: 'text-work-2',
      columns: [
        { key: 'text2_total', label: 'Всего', type: 'score' as const, sortable: true },
        { key: 'text2_22', label: '№22', type: 'score' as const, sortable: true },
        { key: 'text2_23', label: '№23', type: 'score' as const, sortable: true },
        { key: 'text2_24', label: '№24', type: 'score' as const, sortable: true },
        { key: 'text2_25', label: '№25', type: 'score' as const, sortable: true },
        { key: 'text2_fraz', label: 'Фразеологизмы', type: 'score' as const, sortable: true },
        { key: 'text2_26', label: '№26', type: 'score' as const, sortable: true },
      ],
      collapsed: false
    },
  ];

  // Генератор моков данных для группированных колонок
  const generateStudentData = (studentId: number) => {
    const baseScore = 60 + (studentId * 2); // Базовый балл от 62 до 90
    const randomVariation = () => Math.floor(Math.random() * 20) - 10; // ±10

    return {
      // Работа с текстом 1
      'text1_total': baseScore + randomVariation(),
      'text1_1': baseScore + randomVariation(),
      'text1_2': baseScore + randomVariation(),
      'text1_3': baseScore + randomVariation(),
      // Нормы
      'norms_total': baseScore + randomVariation(),
      'norms_4': baseScore + randomVariation(),
      'norms_5': baseScore + randomVariation(),
      'norms_6': baseScore + randomVariation(),
      'norms_7': baseScore + randomVariation(),
      'norms_8': baseScore + randomVariation(),
      // Орфография
      'orf_total': baseScore + randomVariation(),
      'orf_9': baseScore + randomVariation(),
      'orf_10': baseScore + randomVariation(),
      'orf_11': baseScore + randomVariation(),
      'orf_12': baseScore + randomVariation(),
      'orf_13': baseScore + randomVariation(),
      'orf_14': baseScore + randomVariation(),
      'orf_15': baseScore + randomVariation(),
      // Пунктуация
      'punct_total': baseScore + randomVariation(),
      'punct_16': baseScore + randomVariation(),
      'punct_17': baseScore + randomVariation(),
      'punct_18': baseScore + randomVariation(),
      'punct_19': baseScore + randomVariation(),
      'punct_20': baseScore + randomVariation(),
      'punct_21': baseScore + randomVariation(),
      // Работа с текстом 2
      'text2_total': baseScore + randomVariation(),
      'text2_22': baseScore + randomVariation(),
      'text2_23': baseScore + randomVariation(),
      'text2_24': baseScore + randomVariation(),
      'text2_25': baseScore + randomVariation(),
      'text2_fraz': baseScore + randomVariation(),
      'text2_26': baseScore + randomVariation(),
    };
  };

  // Создаем данные для всех студентов
  const mockTableDataGrouped: Record<string, any> = {};
  for (let i = 1; i <= 15; i++) {
    mockTableDataGrouped[i.toString()] = generateStudentData(i);
  }

  return (
    <div className="min-h-screen bg-background">
      <HeaderOrganism 
        userName="Анна Петрова"
        userEmail="anna.petrova@example.com"
        navLinks={navigationLinks}
        breadcrumbItems={[{ label: "Главная", href: "/" }, { label: "Все группы", href: "/groups" }, { label: groupName }]}
      />
      
      <main className="w-full">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* 1. Main Page Title */}
          <H1 className="font-source-serif-pro text-app-h1-mobile md:text-app-h1 leading-tight font-semibold text-foreground mb-6">{groupName}</H1>

          {/* Табы для навигации */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="flex w-full bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
              {/* Показываем таб "Навыки" только для не-черновиков */}
              {!isDraft && (
                <TabsTrigger 
                  value="skills" 
                  className="flex-shrink-0 data-[state=active]:bg-gray-50 data-[state=active]:text-green-700 data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-green-200 text-gray-600 hover:text-gray-900 transition-all duration-200 font-medium"
                >
                  Навыки
                </TabsTrigger>
              )}
              <TabsTrigger 
                value="students"
                className="flex-shrink-0 data-[state=active]:bg-gray-50 data-[state=active]:text-green-700 data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-green-200 text-gray-600 hover:text-gray-900 transition-all duration-200 font-medium"
              >
                Ученики
              </TabsTrigger>
              <TabsTrigger 
                value="table"
                className="flex-shrink-0 data-[state=active]:bg-gray-50 data-[state=active]:text-green-700 data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-green-200 text-gray-600 hover:text-gray-900 transition-all duration-200 font-medium"
              >
                Таблица результатов
              </TabsTrigger>
            </TabsList>

            {/* Таб "Навыки" - только для не-черновиков */}
            {!isDraft && (
              <TabsContent value="skills" className="space-y-6">
                {(() => {
                  const groupedTasks = getTaskStatisticsByGroupId(groupId);
                  const hasAnyTasks = Object.keys(groupedTasks).length > 0;
                  
                  if (!hasAnyTasks) {
                    return (
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <Target className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Навыки группы</h3>
                        <p className="text-gray-500 max-w-md">
                          Для этой группы пока нет данных о выполнении заданий.
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-8">
                      {Object.entries(groupedTasks).map(([category, tasks]) => (
                        <div key={category} className="space-y-4">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-muted-foreground" />
                            <h3 className="text-lg font-semibold text-foreground">
                              {category}
                            </h3>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {tasks.map((task) => (
                              <StatisticsCard 
                                key={task.id} 
                                data={task}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </TabsContent>
            )}

            {/* Таб "Ученики" */}
            <TabsContent value="students" className="space-y-6">
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ученики группы</h3>
                <p className="text-gray-500 max-w-md">
                  Здесь будет список всех учеников группы с возможностью просмотра их прогресса.
                </p>
              </div>
            </TabsContent>

            {/* Таб "Таблица результатов" - крутая таблица! */}
            <TabsContent value="table" className="space-y-6">
              {isDraft || groupStatus === 'archived' ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <BarChart3 className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Таблица результатов</h3>
                  <p className="text-gray-500 max-w-md">
                    Для этой группы пока нет данных о результатах тестирования.
                  </p>
                </div>
              ) : (
                <ResponsiveStatsTable
                  students={mockTableStudents}
                  columnGroups={mockColumnGroups}
                  data={mockTableDataGrouped}
                />
              )}
            </TabsContent>
           </Tabs>
        </div>
      </main>
    </div>
  );
}