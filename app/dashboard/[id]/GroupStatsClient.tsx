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
import { ActionPanel } from '@/components/ui/action-panel';
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
  Archive,
  ArrowRightLeft,
  FileText,
  ChevronRight
} from 'lucide-react';
import { StatisticsCard } from '@/components/ui/statistics-card';
import StatCard from '@/components/feature/StatCard';
import { TestSubmissionCard, TestSubmission, ScoreDisplay } from '@/components/answer-card';
import { MultiTagPicker, Option as MultiOption } from '@/components/ui/multi-tag-picker';
import { DateRangePopover } from '@/components/ui/date-range-popover';
import { pluralizeWord } from '@/lib/utils/pluralization';
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
    <div
      className={`group flex items-center justify-between p-3 rounded-lg transition-all duration-200 hover:bg-gray-50 cursor-pointer ${
        isSelected ? 'bg-blue-50' : ''
      }`}
      onClick={() => onSelect(student.id)}
    >
      <div className="flex items-center gap-4 flex-1 truncate">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onSelect(student.id)}
          onClick={(e) => e.stopPropagation()}
          aria-label={`Выбрать ${student.name}`}
        />
        <div className="flex flex-1 items-baseline gap-x-4 truncate">
          <p className="font-medium truncate">{student.name}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{student.email}</span>
          </div>
        </div>
      </div>
      <div className="ml-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Действия с учеником</span>
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
      </div>
    </div>
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
  const [activeTab, setActiveTab] = useState<'skills' | 'students' | 'table' | 'answers'>(isDraft ? 'table' : 'skills');
  const [testsSource, setTestsSource] = useState<'all' | 'platform' | 'mine'>('platform');
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

  // Фильтры для вкладки "Ответы"
  const [selectedStudentIdsAnswers, setSelectedStudentIdsAnswers] = useState<string[]>([]);
  const [selectedTestIdsAnswers, setSelectedTestIdsAnswers] = useState<string[]>([]);
  const [startDateAnswers, setStartDateAnswers] = useState<Date | undefined>(undefined);
  const [endDateAnswers, setEndDateAnswers] = useState<Date | undefined>(undefined);

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

  // ----- Лента решённых тестов (моки и компоненты) -----
  interface TestAnswerItem {
    id: string;
    index: number;
    question: string;
    response: string;
    expected?: string;
    isCorrect: boolean;
    timeSpent: number;
  }

  interface TestSubmissionItem {
    id: string;
    studentId: string;
    studentName: string;
    studentAvatar?: string;
    testId: string;
    testTitle: string;
    testType: 'grammar' | 'vocabulary' | 'reading' | 'listening' | 'mixed';
    difficulty: 'easy' | 'medium' | 'hard';
    submittedAt: string;
    totalAnswers: number;
    correctAnswers: number;
    incorrectAnswers: number;
    scorePercent: number;
    answers: TestAnswerItem[];
  }

  interface GroupTestFeedData {
    submissions: TestSubmissionItem[];
    totalTests: number;
    totalAnswers: number;
    correctAnswers: number;
    incorrectAnswers: number;
    averageScore?: number;
  }

  const mockTestFeed: GroupTestFeedData = {
    totalTests: 3,
    totalAnswers: 42,
    correctAnswers: 31,
    incorrectAnswers: 11,
    averageScore: 78.2,
    submissions: [
      {
        id: 'sub-1',
        studentId: '1',
        studentName: 'Иванов Алексей',
        studentAvatar: undefined,
        testId: 'task-1',
        testTitle: 'Падежи существительных - Тест 1',
        testType: 'grammar',
        difficulty: 'medium',
        submittedAt: '2024-12-17T14:50:05Z',
        totalAnswers: 25,
        correctAnswers: 22,
        incorrectAnswers: 3,
        scorePercent: 88,
        answers: [
          { id: 'a-1', index: 1, question: 'Определите падеж слова «лес».', response: 'Родительный', expected: 'Родительный', isCorrect: true, timeSpent: 45 }
        ]
      },
      {
        id: 'sub-2',
        studentId: '2',
        studentName: 'Петрова Мария',
        testId: 'task-2',
        testTitle: 'Синонимы и антонимы',
        testType: 'vocabulary',
        difficulty: 'easy',
        submittedAt: '2024-12-17T14:40:12Z',
        totalAnswers: 20,
        correctAnswers: 19,
        incorrectAnswers: 1,
        scorePercent: 95,
        answers: [
          { id: 'b-1', index: 1, question: 'Синоним к слову «большой».', response: 'огромный', expected: 'огромный', isCorrect: true, timeSpent: 20 }
        ]
      },
      {
        id: 'sub-3',
        studentId: '3',
        studentName: 'Сидоров Дмитрий',
        testId: 'task-3',
        testTitle: 'Анализ текста Пушкина',
        testType: 'reading',
        difficulty: 'hard',
        submittedAt: '2024-12-17T14:15:48Z',
        totalAnswers: 10,
        correctAnswers: 6,
        incorrectAnswers: 4,
        scorePercent: 60,
        answers: [
          { id: 'c-1', index: 1, question: 'Определите основную тему отрывка.', response: 'Любовь к родине', expected: 'Свобода и долг', isCorrect: false, timeSpent: 120 }
        ]
      }
    ]
  };

  // Options for answers tab filters
  const studentOptionsAnswers: MultiOption[] = students.map((s) => ({ value: s.id, label: s.name }));
  const testOptionsAnswers: MultiOption[] = Array.from(
    new Map(mockTestFeed.submissions.map((s) => [s.testId, s.testTitle])).entries()
  ).map(([value, label]) => ({ value, label }));

  // удалено: локальная реализация карточки отправки теста, заменяем на общий компонент

  interface TestFeedProps {
    data: GroupTestFeedData;
    students: SimpleStudent[];
    selectedStudentIds: string[];
    selectedTestIds: string[];
    startDate: Date | undefined;
    endDate: Date | undefined;
  }

  const TestFeed: React.FC<TestFeedProps> = ({
    data,
    students,
    selectedStudentIds,
    selectedTestIds,
    startDate,
    endDate,
  }) => {
    const emailById: Record<string, string> = Object.fromEntries(students.map((s) => [s.id, s.email]));
    const mappedSubmissions: TestSubmission[] = data.submissions.map((sub) => ({
      id: sub.id,
      studentId: sub.studentId,
      studentName: sub.studentName,
      studentEmail: emailById[sub.studentId] || '',
      testId: sub.testId,
      testTitle: sub.testTitle,
      submittedAt: sub.submittedAt,
      totalQuestions: sub.totalAnswers,
      correctAnswers: sub.correctAnswers,
      scorePercent: sub.scorePercent,
    }));

    const studentOptions: MultiOption[] = students.map((s) => ({ value: s.id, label: s.name }));
    const testOptions: MultiOption[] = Array.from(
      new Map(data.submissions.map((s) => [s.testId, s.testTitle])).entries()
    ).map(([value, label]) => ({ value, label }));

    const inRange = (submittedAt: string) => {
      const dt = new Date(submittedAt);
      if (startDate && dt < startDate) return false;
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (dt > end) return false;
      }
      return true;
    };

    const filtered = mappedSubmissions.filter((sub) => {
      if (selectedStudentIds.length > 0 && !selectedStudentIds.includes(sub.studentId)) return false;
      if (selectedTestIds.length > 0 && !selectedTestIds.includes(sub.testId)) return false;
      if (!inRange(sub.submittedAt)) return false;
      return true;
    });

    const stats = {
      totalTests: new Set(filtered.map((s) => s.testId)).size,
      totalAnswers: filtered.reduce((sum, s) => sum + (s.totalQuestions ?? 0), 0),
      correctAnswers: filtered.reduce((sum, s) => sum + (s.correctAnswers ?? 0), 0),
      incorrectAnswers: filtered.reduce((sum, s) => sum + ((s.totalQuestions ?? 0) - (s.correctAnswers ?? 0)), 0),
    };

    return (
      <div className="space-y-4">
        <Card className="mb-6">
          <CardContent className="p-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="font-bold text-lg">{stats.totalTests}</p>
                <p className="text-sm text-muted-foreground">{pluralizeWord(stats.totalTests, 'тест', 'теста', 'тестов')}</p>
              </div>
              <div>
                <p className="font-bold text-lg">{stats.totalAnswers}</p>
                <p className="text-sm text-muted-foreground">{pluralizeWord(stats.totalAnswers, 'ответ', 'ответа', 'ответов')}</p>
              </div>
              <div>
                <p className="font-bold text-lg text-green-700">{stats.correctAnswers}</p>
                <p className="text-sm text-muted-foreground">{pluralizeWord(stats.correctAnswers, 'правильный', 'правильных', 'правильных')}</p>
              </div>
              <div>
                <p className="font-bold text-lg text-red-700">{stats.incorrectAnswers}</p>
                <p className="text-sm text-muted-foreground">{pluralizeWord(stats.incorrectAnswers, 'неправильный', 'неправильных', 'неправильных')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Последние тесты</h3>
          {filtered.map((sub) => (
            <TestSubmissionCard key={sub.id} submission={sub} />
          ))}
          {filtered.length === 0 && (
            <div className="text-sm text-muted-foreground">Нет данных по выбранным фильтрам</div>
          )}
        </div>
      </div>
    );
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
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'skills' | 'students' | 'table' | 'answers')} className="space-y-8">
            <TabsList className="flex w-full bg-muted p-1 rounded-xl">
              {!isDraft && (
                <TabsTrigger 
                  value="skills" 
                  className="flex-1 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  Навыки
                </TabsTrigger>
              )}
              <TabsTrigger 
                value="students"
                className="flex-1 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Ученики
              </TabsTrigger>
              <TabsTrigger
                value="table"
                className="flex-1 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Тесты
              </TabsTrigger>
              <TabsTrigger
                value="answers"
                className="flex-1 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Ответы
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
              <ActionPanel
                filterGroups={[]}
                selectAll={{
                  label: 'Выбрать всех',
                  checked: students.length > 0 && selectedStudents.length === students.length,
                  onToggle: (checked) => {
                    if (checked) {
                      selectAllStudents();
                    } else {
                      setSelectedStudents([]);
                    }
                  },
                }}
                secondaryActions={selectedStudents.length > 0 ? [
                  {
                    id: 'transfer',
                    label: 'Перенести',
                    icon: ArrowRightLeft,
                    onClick: transferSelectedStudents,
                  },
                ] : []}
                primaryAction={{
                  label: 'Добавить учеников',
                  icon: UserPlus,
                  onClick: addStudents,
                }}
                density="compact"
              />
              {/* Список учеников */}
              <div className="border rounded-lg bg-card">
                {students.map((student, index) => (
                  <div key={student.id} className={index > 0 ? 'border-t' : ''}>
                    <StudentCard
                      student={student}
                      isSelected={selectedStudents.includes(student.id)}
                      onSelect={handleStudentSelect}
                      groupId={groupId}
                    />
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Таб "Тесты" */}
            <TabsContent value="table" className="space-y-6 table-tab-content">
              <ActionPanel
                filterGroups={[
                  {
                    id: 'source',
                    controls: [
                      { type: 'chip', id: 'all', label: 'Все', selected: testsSource === 'all', onToggle: () => setTestsSource('all') },
                      { type: 'chip', id: 'platform', label: 'Тесты платформы', selected: testsSource === 'platform', onToggle: () => setTestsSource('platform') },
                      { type: 'chip', id: 'mine', label: 'Мои тесты', selected: testsSource === 'mine', onToggle: () => setTestsSource('mine') },
                    ],
                  },
                ]}
                primaryAction={{
                  label: 'Создать тест',
                  icon: BookOpen,
                  onClick: () => router.push('/create-test'),
                }}
                density="compact"
              />
              
              {testsSource === 'mine' ? (
                <div className="space-y-6">
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Мои тесты пусты</h3>
                    <p className="text-muted-foreground mb-4">
                      Здесь появятся тесты, которые вы создадите
                    </p>
                    <Button size="sm" onClick={() => router.push('/create-test')}>
                      <BookOpen className="h-4 w-4 mr-2" />
                      Создать тест
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {(isDraft || groupStatus === 'archived' || tableStats.length === 0) ? (
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
                    <section className="mt-6 md:mt-8">
                      <div className="border rounded-lg bg-card">
                        {tableStats.map((stat, index) => (
                          <Link
                            key={stat.id}
                            href={`/dashboard/${groupId}/statistics?title=${encodeURIComponent(toSlug(stat.title))}&stat=${encodeURIComponent(stat.id)}`}
                            className={`block ${index > 0 ? 'border-t' : ''}`}
                          >
                            <div className="group flex justify-between items-center p-3 transition-all duration-200 hover:bg-gray-50">
                              <div className="flex-1 truncate mr-4">
                                <div className="flex items-center gap-3">
                                  <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                  <p className="font-medium truncate">{stat.title}</p>
                                </div>
                                <div className="flex sm:hidden items-center flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-2">
                                  <span>{stat.testsCompleted} {pluralizeWord(stat.testsCompleted, 'тест', 'теста', 'тестов')}</span>
                                  <span>{stat.score} / {stat.totalScore} {pluralizeWord(stat.totalScore, 'балл', 'балла', 'баллов')}</span>
                                  <span className="font-bold text-foreground">{stat.percentage}%</span>
                                </div>
                              </div>
                              <div className="flex items-center shrink-0">
                                <div className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground">
                                  <span className="w-28 hidden md:inline">{stat.testsCompleted} {pluralizeWord(stat.testsCompleted, 'тест', 'теста', 'тестов')}</span>
                                  <span className="w-44 hidden sm:inline">{stat.score} / {stat.totalScore} {pluralizeWord(stat.totalScore, 'балл', 'балла', 'баллов')}</span>
                                  <span className="w-16 font-bold text-foreground">{stat.percentage}%</span>
                                </div>
                                <div className="ml-4">
                                  <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              )}
            </TabsContent>
            {/* Таб "Ответы" */}
            <TabsContent value="answers" className="space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <ActionPanel
                  filterGroups={[
                    {
                      id: 'answers-filters',
                      controls: [
                        {
                          type: 'multiselect',
                          id: 'students',
                          label: 'Ученики',
                          values: selectedStudentIdsAnswers,
                          options: studentOptionsAnswers,
                          onChange: setSelectedStudentIdsAnswers,
                        },
                        {
                          type: 'multiselect',
                          id: 'tests',
                          label: 'Тесты',
                          values: selectedTestIdsAnswers,
                          options: testOptionsAnswers,
                          onChange: setSelectedTestIdsAnswers,
                        },
                      ],
                    },
                  ]}
                  primaryAction={{
                    label: 'Экспорт',
                    icon: BookOpen,
                    onClick: () => console.log('Export answers'),
                  }}
                  density="compact"
                />
                <DateRangePopover
                  startDate={startDateAnswers}
                  endDate={endDateAnswers}
                  onChange={(start, end) => {
                    setStartDateAnswers(start);
                    setEndDateAnswers(end);
                  }}
                  triggerClassName="h-9 px-3"
                />
              </div>
              <TestFeed
                data={mockTestFeed}
                students={students}
                selectedStudentIds={selectedStudentIdsAnswers}
                selectedTestIds={selectedTestIdsAnswers}
                startDate={startDateAnswers}
                endDate={endDateAnswers}
              />
            </TabsContent>
           </Tabs>
        </div>
      </main>
  );
}