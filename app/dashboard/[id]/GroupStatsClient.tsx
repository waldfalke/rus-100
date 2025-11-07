'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toSlug } from '@/lib/utils/slug';
import { HeaderOrganism } from '@/components/ui/HeaderOrganism';
import { H1, H3 } from '@/components/ui/typography';
import ResponsiveContainer from '@/components/layout/ResponsiveContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponsiveStatsTable } from '@/components/stats-table';
import { Card, CardHeader, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  Users, 
  BookOpen, 
  Target, 
  Clock,
  BarChart3,
  Mail,
  MoreHorizontal,
  UserPlus,
  Edit,
  Archive
} from 'lucide-react';
import { StatisticsCard } from '@/components/ui/statistics-card';
import StatCard from '@/components/feature/StatCard';
import { getTaskStatisticsByGroupId, getTableStatisticsByGroupId, TableStats } from '@/data/statistics-adapter';

// Простейшая модель ученика для карточек вкладки "Ученики"
type SimpleStudent = { id: string; name: string; email: string };
type StudentCardProps = {
  student: SimpleStudent;
  isSelected: boolean;
  onSelect: (id: string) => void;
  groupId: string;
};

// Карточка ученика (имя, email, меню действий)
const StudentCard: React.FC<StudentCardProps> = ({ student, isSelected, onSelect, groupId }) => {
  const router = useRouter();
  return (
    <Card
      className={`group transition-all duration-200 hover:border-green-600 hover:shadow-md cursor-pointer relative ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={() => onSelect(student.id)}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3">
        <div className="flex items-center gap-3">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onSelect(student.id)}
              onClick={(e) => e.stopPropagation()}
            />
            <H3 className="truncate">{student.name}</H3>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem onClick={() => router.push(`/results?studentId=${student.id}`)}>
                Результаты
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/dashboard?studentId=${student.id}`)}>
                Дашборд ученика
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                console.log('Деактивировать ученика', student.id);
                alert('Ученика пометили как неактивного (заглушка)');
              }}>
                Деактивировать
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                const newName = prompt('Установить имя ученика', student.name);
                if (newName) {
                  console.log('Установить имя', student.id, newName);
                  alert(`Имя обновлено (заглушка): ${newName}`);
                }
              }}>
                Установить имя
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                console.log('Перенести ученика', student.id);
                alert('Откроется диалог переноса (заглушка)');
              }}>
                Перенести
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600" onClick={() => {
                if (confirm('Удалить ученика?')) {
                  console.log('Удалить ученика', student.id);
                  alert('Ученик удален (заглушка)');
                }
              }}>
                Удалить
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/dashboard/${groupId}/statistics?studentId=${student.id}`)}>
                📈 Статистика
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/answers?studentId=${student.id}`)}>
                Ответы
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span className="truncate">{student.email}</span>
          </div>
        </CardContent>
      </Card>
  );
};

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
    status: "active" as const,
    participantCount: 31,
    testsCount: 28,
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
  const tableStats: TableStats[] = getTableStatisticsByGroupId(groupId);

  const navigationLinks = [
    { href: "/", label: "Главная" },
    { href: "/create-test", label: "Тесты" },
    { href: "/dashboard", label: "Дашборд" },
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

  const [students] = useState<SimpleStudent[]>(mockTableStudents);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const handleStudentSelect = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const selectAllStudents = () => {
    setSelectedStudents(students.map((s) => s.id));
  };

  const addStudents = () => {
    console.log('Добавить учеников: открыть модал/навигацию');
  };

  const transferSelectedStudents = () => {
    console.log('Перенести выбранных учеников', selectedStudents);
  };


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

      <main className="w-full">

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* 1. Main Page Title with compact actions */}
          <div className="flex items-center justify-between mb-6">
            <H1 className="font-source-serif-pro text-app-h1-mobile md:text-app-h1 leading-tight font-semibold text-foreground">{groupName}</H1>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Дополнительно">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => router.push(`/dashboard/${groupId}/edit`)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Редактировать
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    if (confirm('Переместить группу в архив?')) {
                      alert('Группа перемещена в архив (заглушка)');
                    }
                  }}
                >
                  <Archive className="h-4 w-4 mr-2" />
                  В архив
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

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
                Тесты
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
                            <H3>
                              {category}
                            </H3>
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
            <TabsContent value="students" className="space-y-4">
              {/* Панель действий */}
              <div className="bg-white py-3 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center h-9 gap-2 shrink-0 px-3 border border-border rounded-md bg-background">
                    <Checkbox
                      id="select-all"
                      checked={students.length > 0 && selectedStudents.length === students.length}
                      onCheckedChange={(checked) => {
                        if (checked === true) {
                          selectAllStudents();
                        } else {
                          setSelectedStudents([]);
                        }
                      }}
                      className="data-[state=unchecked]:bg-muted"
                    />
                    <Label htmlFor="select-all" className="cursor-pointer text-sm">Выбрать всех</Label>
                  </div>
                  {selectedStudents.length > 0 && (
                    <Button variant="outline" size="sm" onClick={transferSelectedStudents}>Перенести</Button>
                  )}
                </div>
                <Button size="sm" onClick={addStudents}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Добавить учеников
                </Button>
              </div>

              {/* Список учеников */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {students.map((student) => (
                  <StudentCard
                    key={student.id}
                    student={student}
                    isSelected={selectedStudents.includes(student.id)}
                    onSelect={handleStudentSelect}
                    groupId={groupId}
                  />
                ))}
              </div>
            </TabsContent>

            {/* Таб "Тесты" */}
            <TabsContent value="table" className="space-y-6 table-tab-content">
              {isDraft || groupStatus === 'archived' ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <BarChart3 className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Тесты</h3>
                  <p className="text-gray-500 max-w-md">
                    Для этой группы пока нет данных о результатах тестирования.
                  </p>
                </div>
              ) : (
                <section className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tableStats.map((stat) => (
                    <Link
                      key={stat.id}
                      href={`/dashboard/${groupId}/statistics?title=${encodeURIComponent(toSlug(stat.title))}&stat=${encodeURIComponent(stat.id)}`}
                      className="block"
                    >
                      <StatCard
                        title={stat.title}
                        testsCompleted={stat.testsCompleted}
                        score={stat.score}
                        totalScore={stat.totalScore}
                        percentage={stat.percentage}
                      />
                    </Link>
                  ))}
                </section>
              )}
            </TabsContent>
           </Tabs>
        </div>
      </main>
  );
}