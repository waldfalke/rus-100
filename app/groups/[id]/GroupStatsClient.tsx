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

  const mockTableColumns = [
    { key: 'total', label: 'Успехи', type: 'score' as const, sortable: true },
    { key: 'grammar', label: 'Орфография', type: 'score' as const, sortable: true },
    { key: 'punctuation', label: 'Пунктуация', type: 'score' as const, sortable: true },
    { key: 'vocabulary', label: 'Грамматика', type: 'score' as const, sortable: true },
    { key: 'lexicon', label: 'Лексика', type: 'score' as const, sortable: true },
    { key: 'style', label: 'Стилистика', type: 'score' as const, sortable: true },
    { key: 'essay', label: 'Сочинение', type: 'score' as const, sortable: true },
    { key: 'summary', label: 'Изложение', type: 'score' as const, sortable: true },
    { key: 'dictation', label: 'Диктант', type: 'score' as const, sortable: true },
    { key: 'testing', label: 'Тестирование', type: 'score' as const, sortable: true },
    { key: 'final', label: 'Итоговая', type: 'score' as const, sortable: true }
  ];

  // Правильная структура данных согласно контракту ResponsiveStatsTable
  const mockTableData: Record<string, any> = {
    '1': { 'total': 85, 'grammar': 92, 'punctuation': 88, 'vocabulary': 90, 'lexicon': 85, 'style': 87, 'essay': 89, 'summary': 91, 'dictation': 86, 'testing': 88, 'final': 90 },
    '2': { 'total': 78, 'grammar': 85, 'punctuation': 82, 'vocabulary': 80, 'lexicon': 75, 'style': 79, 'essay': 81, 'summary': 83, 'dictation': 77, 'testing': 80, 'final': 82 },
    '3': { 'total': 92, 'grammar': 95, 'punctuation': 94, 'vocabulary': 93, 'lexicon': 91, 'style': 92, 'essay': 94, 'summary': 96, 'dictation': 90, 'testing': 93, 'final': 95 },
    '4': { 'total': 73, 'grammar': 78, 'punctuation': 75, 'vocabulary': 72, 'lexicon': 70, 'style': 74, 'essay': 76, 'summary': 78, 'dictation': 71, 'testing': 75, 'final': 77 },
    '5': { 'total': 88, 'grammar': 90, 'punctuation': 89, 'vocabulary': 87, 'lexicon': 86, 'style': 88, 'essay': 90, 'summary': 92, 'dictation': 85, 'testing': 89, 'final': 91 },
    '6': { 'total': 79, 'grammar': 83, 'punctuation': 76, 'vocabulary': 81, 'lexicon': 78, 'style': 80, 'essay': 82, 'summary': 84, 'dictation': 77, 'testing': 79, 'final': 81 },
    '7': { 'total': 91, 'grammar': 94, 'punctuation': 89, 'vocabulary': 92, 'lexicon': 90, 'style': 93, 'essay': 91, 'summary': 95, 'dictation': 88, 'testing': 92, 'final': 93 },
    '8': { 'total': 84, 'grammar': 87, 'punctuation': 82, 'vocabulary': 85, 'lexicon': 83, 'style': 86, 'essay': 84, 'summary': 88, 'dictation': 81, 'testing': 85, 'final': 86 },
    '9': { 'total': 76, 'grammar': 80, 'punctuation': 74, 'vocabulary': 78, 'lexicon': 75, 'style': 77, 'essay': 79, 'summary': 81, 'dictation': 73, 'testing': 76, 'final': 78 },
    '10': { 'total': 89, 'grammar': 92, 'punctuation': 87, 'vocabulary': 90, 'lexicon': 88, 'style': 91, 'essay': 89, 'summary': 93, 'dictation': 86, 'testing': 90, 'final': 91 },
    '11': { 'total': 82, 'grammar': 85, 'punctuation': 80, 'vocabulary': 83, 'lexicon': 81, 'style': 84, 'essay': 82, 'summary': 86, 'dictation': 79, 'testing': 83, 'final': 84 },
    '12': { 'total': 87, 'grammar': 90, 'punctuation': 85, 'vocabulary': 88, 'lexicon': 86, 'style': 89, 'essay': 87, 'summary': 91, 'dictation': 84, 'testing': 88, 'final': 89 },
    '13': { 'total': 75, 'grammar': 78, 'punctuation': 73, 'vocabulary': 76, 'lexicon': 74, 'style': 77, 'essay': 75, 'summary': 79, 'dictation': 72, 'testing': 76, 'final': 77 },
    '14': { 'total': 93, 'grammar': 96, 'punctuation': 91, 'vocabulary': 94, 'lexicon': 92, 'style': 95, 'essay': 93, 'summary': 97, 'dictation': 90, 'testing': 94, 'final': 95 },
    '15': { 'total': 80, 'grammar': 83, 'punctuation': 78, 'vocabulary': 81, 'lexicon': 79, 'style': 82, 'essay': 80, 'summary': 84, 'dictation': 77, 'testing': 81, 'final': 82 }
  };

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
                  columns={mockTableColumns}
                  data={mockTableData}
                />
              )}
            </TabsContent>
           </Tabs>
        </div>
      </main>
    </div>
  );
}