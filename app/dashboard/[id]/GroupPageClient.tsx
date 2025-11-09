'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  UserPlus,
  Download,
  Search,
  Filter,
  Grid3X3,
  List,
  MoreHorizontal,
  Settings,
  Mail,
  BookOpen,
  TrendingUp,
  TrendingDown,
  Clock,
  Star,
  ChevronLeft,
  Edit,
  Archive,
  Trash2,
  Copy,
  Target,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CustomTestsStats } from '@/components/CustomTestsStats';
import { StatisticsCard, StatisticsCardData } from '@/components/ui/statistics-card';
import { TestSubmissionCard, TestSubmission } from '@/components/answer-card';
import { pluralizeWord } from '@/lib/utils/pluralization';
import { MultiTagPicker, Option as MultiOption } from '@/components/ui/multi-tag-picker';
import { DateRangePopover } from '@/components/ui/date-range-popover';
import { Label } from '@/components/ui/label';
import { ActionPanel } from '@/components/ui/action-panel';

// Типы данных согласно контракту GRP-001
// Интерфейсы для статистики заданий
interface TaskStats {
  taskId: string;
  taskTitle: string;
  taskType: 'grammar' | 'vocabulary' | 'reading' | 'listening';
  assignedStudents: number;
  completedStudents: number;
  averageScore: number;
  averageTime: number; // в минутах
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: string;
  dueDate?: string;
}

interface TaskStatsData {
  totalTasks: number;
  completedTasks: number;
  averageCompletionRate: number;
  tasks: TaskStats[];
}

interface GroupData {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'archived' | 'draft';
  studentCount: number;
  createdAt: string;
  lastActivity?: string;
  isOwner: boolean;
  settings: {
    allowSelfEnrollment: boolean;
    maxStudents?: number;
    isPublic: boolean;
  };
}

interface GroupStats {
  totalStudents: number;
  activeStudents: number;
  averageProgress: number;
  completedTests: number;
  totalTests: number;
  averageScore: number;
}

interface GroupStudent {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'pending';
  progress: number;
  lastActivity?: string;
  joinedAt: string;
  testsCompleted: number;
  averageScore: number;
  tags: string[];
}

interface StudentFilters {
  search: string;
  status: 'all' | 'active' | 'inactive' | 'pending';
  sortBy: 'name' | 'progress' | 'activity' | 'score';
  sortOrder: 'asc' | 'desc';
  tags: string[];
}

// Интерфейсы для статистики навыков
interface SkillData {
  skillId: string;
  skillTitle: string;
  completedRuns: number;
  totalRuns: number;
  averageScore: number;
  deltaPercent: number;
  severity: 1 | 2 | 3;
}

interface GroupStatsData {
  groupId: string;
  groupName: string;
  totalStudents: number;
  skills: {
    grammar: SkillData[];
    vocabulary: SkillData[];
    reading: SkillData[];
    listening: SkillData[];
  };
}

// Утилиты для семантических цветов статистики
const getScoreColor = (score: number) => {
  if (score >= 90) return 'success';
  if (score >= 75) return 'amber';
  if (score >= 50) return 'orange';
  return 'danger';
};

const getProgressColorClasses = (score: number) => {
  const colorType = getScoreColor(score);
  switch (colorType) {
    case 'success': return 'bg-green-500';
    case 'amber': return 'bg-yellow-500';
    case 'orange': return 'bg-orange-500';
    case 'danger': return 'bg-red-500';
    default: return 'bg-gray-400';
  }
};

const getDeltaColorClasses = (delta: number) => {
  if (delta > 0) return 'bg-green-50 text-green-700 border-green-200';
  if (delta < 0) return 'bg-red-50 text-red-700 border-red-200';
  return 'bg-gray-50 text-gray-700 border-gray-200';
};

// Компонент карточки навыка
function SkillCard({ skill, onClick }: { skill: SkillData; onClick?: (skillId: string) => void }) {
  const isPositiveChange = skill.deltaPercent > 0;
  const isNegativeChange = skill.deltaPercent < 0;
  const isSmallSample = skill.totalRuns < 3;
  const progressColorClass = getProgressColorClasses(skill.averageScore);
  const deltaColorClass = getDeltaColorClasses(skill.deltaPercent);
  
  const getSeverityColor = (severity: number) => {
    switch (severity) {
      case 1: return 'bg-green-50 text-green-700 border-green-200';
      case 2: return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 3: return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getSeverityLabel = (severity: number) => {
    switch (severity) {
      case 1: return 'Хорошо';
      case 2: return 'Внимание';
      case 3: return 'Проблема';
      default: return 'Неизвестно';
    }
  };

  return (
    <Card
      className={cn(
        "transition-all duration-200 hover:border-green-600 hover:shadow-md cursor-pointer border-l-4",
        skill.severity === 1 && "border-l-green-500",
        skill.severity === 2 && "border-l-yellow-500",
        skill.severity === 3 && "border-l-red-500"
      )}
      onClick={() => onClick?.(skill.skillId)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base font-medium text-gray-900 mb-1">
              {skill.skillTitle}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{skill.completedRuns}/{skill.totalRuns} выполнено</span>
              {isSmallSample && (
                <Badge variant="outline" className="text-xs px-2 py-2 bg-amber-50 text-amber-700 border-amber-200">
                  <Info className="h-3 w-3 mr-1" />
                  Мало данных
                </Badge>
              )}
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={cn("text-xs px-2 py-1", getSeverityColor(skill.severity))}
          >
            {getSeverityLabel(skill.severity)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Прогресс-бар */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Средний балл</span>
              <span className="font-medium text-gray-900">{skill.averageScore}%</span>
            </div>
            <Progress 
              value={skill.averageScore} 
              className={cn("h-2", progressColorClass)}
            />
          </div>
          
          {/* Изменение */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Изменение</span>
            <div className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border",
              deltaColorClass
            )}>
              {isPositiveChange && <TrendingUp className="h-3 w-3" />}
              {isNegativeChange && <TrendingDown className="h-3 w-3" />}
              {skill.deltaPercent > 0 ? '+' : ''}{skill.deltaPercent}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Компонент секции навыков
function SkillSection({ 
  title, 
  skills, 
  icon: Icon,
  onSkillClick 
}: { 
  title: string; 
  skills: SkillData[];
  icon: React.ComponentType<{ className?: string }>;
  onSkillClick?: (skillId: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <Badge variant="secondary" className="ml-2">
          {skills.length}
        </Badge>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {skills.map((skill) => (
          <SkillCard 
            key={skill.skillId} 
            skill={skill} 
            onClick={onSkillClick}
          />
        ))}
      </div>
    </div>
  );
}

// Компонент заголовка группы
function GroupHeader({ 
  group, 
  onAction 
}: { 
  group: GroupData; 
  onAction: (action: string) => void;
}) {
  return (
    <div className="bg-white p-6 rounded-lg border mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => onAction('back')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">{group.name}</h1>
              <Badge variant={group.status === 'active' ? 'default' : 'secondary'}>
                {group.status === 'active' ? 'Активная' : 
                 group.status === 'draft' ? 'Черновик' : 'Архивная'}
              </Badge>
            </div>
            {group.description && (
              <p className="text-muted-foreground">{group.description}</p>
            )}
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {group.studentCount} учеников
              </span>
              <span>Создана {new Date(group.createdAt).toLocaleDateString('ru-RU')}</span>
              {group.lastActivity && (
                <span>Активность {new Date(group.lastActivity).toLocaleDateString('ru-RU')}</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button onClick={() => onAction('invite')}>
            <UserPlus className="h-4 w-4 mr-2" />
            Пригласить
          </Button>
          <Button variant="outline" onClick={() => onAction('export')}>
            <Download className="h-4 w-4 mr-2" />
            Экспорт
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onAction('edit')}>
                <Edit className="h-4 w-4 mr-2" />
                Редактировать
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('duplicate')}>
                <Copy className="h-4 w-4 mr-2" />
                Дублировать
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('archive')}>
                <Archive className="h-4 w-4 mr-2" />
                Архивировать группу
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('delete')} className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Удалить группу
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

// Компонент статистики группы
function GroupStatsOverview({ stats }: { stats: GroupStats }) {
  // Подготавливаем данные для StatisticsCard
  const statisticsData: StatisticsCardData[] = [
    {
      id: 'total-students',
      questionNumber: 'Всего учеников',
      title: 'Общее количество студентов в группе',
      completedWorkouts: stats.totalStudents,
      averageScore: stats.totalStudents,
      changePercent: 0, // Можно добавить логику для расчета изменений
      level: 1,
      details: {
        totalStats: {
          title: 'Статистика учеников',
          items: [
            {
              name: 'Активные ученики',
              correct: stats.activeStudents,
              total: stats.totalStudents,
              percentage: Math.round((stats.activeStudents / stats.totalStudents) * 100)
            }
          ]
        }
      }
    },
    {
      id: 'active-students',
      questionNumber: 'Активные',
      title: 'Количество активных студентов',
      completedWorkouts: stats.activeStudents,
      averageScore: stats.activeStudents,
      changePercent: 5, // Пример положительного изменения
      level: 2,
      details: {
        totalStats: {
          title: 'Активность',
          items: [
            {
              name: 'Процент активности',
              correct: stats.activeStudents,
              total: stats.totalStudents,
              percentage: Math.round((stats.activeStudents / stats.totalStudents) * 100)
            }
          ]
        }
      }
    },
    {
      id: 'average-progress',
      questionNumber: 'Средний прогресс',
      title: 'Средний прогресс всех студентов',
      completedWorkouts: stats.averageProgress,
      averageScore: stats.averageProgress,
      changePercent: 3, // Пример положительного изменения
      level: 2,
      details: {
        totalStats: {
          title: 'Прогресс',
          items: [
            {
              name: 'Общий прогресс',
              correct: stats.averageProgress,
              total: 100,
              percentage: stats.averageProgress
            }
          ]
        }
      }
    },
    {
      id: 'completed-tests',
      questionNumber: 'Тесты выполнено',
      title: 'Количество выполненных тестов',
      completedWorkouts: stats.completedTests,
      averageScore: Math.round((stats.completedTests / stats.totalTests) * 100),
      changePercent: -2, // Пример отрицательного изменения
      level: 3,
      details: {
        totalStats: {
          title: 'Тестирование',
          items: [
            {
              name: 'Выполнено тестов',
              correct: stats.completedTests,
              total: stats.totalTests,
              percentage: Math.round((stats.completedTests / stats.totalTests) * 100)
            }
          ]
        }
      }
    },
    {
      id: 'average-score',
      questionNumber: 'Средний балл',
      title: 'Средний балл по всем тестам',
      completedWorkouts: stats.averageScore,
      averageScore: stats.averageScore,
      changePercent: 7, // Пример положительного изменения
      level: 1,
      details: {
        totalStats: {
          title: 'Оценки',
          items: [
            {
              name: 'Средний балл',
              correct: stats.averageScore,
              total: 100,
              percentage: stats.averageScore
            }
          ]
        }
      }
    },
    {
      id: 'settings',
      questionNumber: 'Настройки',
      title: 'Управление группой',
      completedWorkouts: 1,
      averageScore: 100,
      changePercent: 0,
      level: 1,
      details: {
        totalStats: {
          title: 'Управление',
          items: [
            {
              name: 'Доступные настройки',
              correct: 1,
              total: 1,
              percentage: 100
            }
          ]
        }
      }
    }
  ];

  const handleCardClick = (id: string) => {
    console.log('Clicked card:', id);
    // Здесь можно добавить логику для обработки кликов по карточкам
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {statisticsData.map((data) => (
        <StatisticsCard
          key={data.id}
          data={data}
          onCardClick={handleCardClick}
        />
      ))}
    </div>
  );
}

// Компонент панели фильтров учеников
function StudentsFilterBar({ 
  filters, 
  onFiltersChange,
  viewMode,
  onViewModeChange
}: { 
  filters: StudentFilters; 
  onFiltersChange: (filters: StudentFilters) => void;
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
}) {
  return (
    <div className="rounded-lg border mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Поиск учеников..."
              value={filters.search}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select 
          value={filters.status} 
          onValueChange={(value) => onFiltersChange({ ...filters, status: value as any })}
        >
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue placeholder="Статус" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="active">Активные</SelectItem>
            <SelectItem value="inactive">Неактивные</SelectItem>
            <SelectItem value="pending">Ожидающие</SelectItem>
          </SelectContent>
        </Select>
        
        <Select 
          value={filters.sortBy} 
          onValueChange={(value) => onFiltersChange({ ...filters, sortBy: value as any })}
        >
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue placeholder="Сортировка" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">По имени</SelectItem>
            <SelectItem value="progress">По прогрессу</SelectItem>
            <SelectItem value="activity">По активности</SelectItem>
            <SelectItem value="score">По баллам</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('table')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Интерфейсы для фильтрации тестов
interface TestFilters {
  search: string;
  type: 'all' | 'grammar' | 'vocabulary' | 'reading' | 'listening' | 'mixed';
  status: 'all' | 'published' | 'draft' | 'archived';
  difficulty: 'all' | 'easy' | 'medium' | 'hard';
  sortBy: 'title' | 'created' | 'updated' | 'score';
  sortOrder: 'asc' | 'desc';
}

// Компонент фильтрации тестов
function TestsFilterBar({ 
  filters, 
  onFiltersChange 
}: { 
  filters: TestFilters; 
  onFiltersChange: (filters: TestFilters) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Поиск тестов..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="flex gap-2">
        <Select
          value={filters.type}
          onValueChange={(value) => onFiltersChange({ ...filters, type: value as TestFilters['type'] })}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Тип" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все типы</SelectItem>
            <SelectItem value="grammar">Грамматика</SelectItem>
            <SelectItem value="vocabulary">Лексика</SelectItem>
            <SelectItem value="reading">Чтение</SelectItem>
            <SelectItem value="listening">Аудирование</SelectItem>
            <SelectItem value="mixed">Смешанный</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.status}
          onValueChange={(value) => onFiltersChange({ ...filters, status: value as TestFilters['status'] })}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Статус" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все</SelectItem>
            <SelectItem value="published">Опубликован</SelectItem>
            <SelectItem value="draft">Черновик</SelectItem>
            <SelectItem value="archived">Архив</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.difficulty}
          onValueChange={(value) => onFiltersChange({ ...filters, difficulty: value as TestFilters['difficulty'] })}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Сложность" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все</SelectItem>
            <SelectItem value="easy">Легкий</SelectItem>
            <SelectItem value="medium">Средний</SelectItem>
            <SelectItem value="hard">Сложный</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

// Компонент карточки теста
function CustomTestCard({ 
  test, 
  onAction 
}: { 
  test: CustomTest; 
  onAction: (action: string, testId: string) => void;
}) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'grammar': return <BookOpen className="h-4 w-4 text-muted-foreground" />;
      case 'vocabulary': return <Target className="h-4 w-4 text-muted-foreground" />;
      case 'reading': return <BookOpen className="h-4 w-4 text-muted-foreground" />;
      case 'listening': return <Clock className="h-4 w-4 text-muted-foreground" />;
      case 'mixed': return <Grid3X3 className="h-4 w-4 text-muted-foreground" />;
      default: return <BookOpen className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return 'Опубликован';
      case 'draft': return 'Черновик';
      case 'archived': return 'Архив';
      default: return 'Неизвестно';
    }
  };

  return (
    <div className="group flex items-center justify-between p-3 transition-all duration-200 hover:bg-gray-50">
      <div className="flex items-center gap-3 flex-1 truncate">
        {getTypeIcon(test.type)}
        <div className="truncate">
          <p className="font-medium truncate">{test.title}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 text-sm mx-4">
        <Badge variant="outline" className={getStatusColor(test.status)}>{getStatusText(test.status)}</Badge>
        <span className="hidden lg:inline w-24 text-muted-foreground">{test.questionsCount} {pluralizeWord(test.questionsCount, 'вопрос', 'вопроса', 'вопросов')}</span>
        <span className="hidden md:inline w-28 text-muted-foreground">{test.completedStudents} / {test.assignedStudents} выполнили</span>
        {test.averageScore != null && <span className="font-bold w-12 text-foreground">{test.averageScore}%</span>}
      </div>
      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onAction('edit', test.id)}>
              <Edit className="h-4 w-4 mr-2" />
              Редактировать
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction('duplicate', test.id)}>
              <Copy className="h-4 w-4 mr-2" />
              Дублировать
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction('archive', test.id)}>
              <Archive className="h-4 w-4 mr-2" />
              Архивировать
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onAction('delete', test.id)}
              className="text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Удалить
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

// Компонент карточки ученика
function StudentCard({ 
  student, 
  isSelected, 
  onSelect,
  groupId
}: { 
  student: GroupStudent; 
  isSelected: boolean;
  onSelect: (studentId: string) => void;
  groupId: string;
}) {
  const router = useRouter();
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Активен';
      case 'inactive': return 'Неактивен';
      case 'pending': return 'Ожидает';
      default: return 'Неизвестно';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatLastActivity = (dateString?: string) => {
    if (!dateString) return 'Нет данных';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  return (
    <Card
      className={`cursor-pointer transition-all hover:border-green-600 hover:shadow-md ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={() => onSelect(student.id)}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{student.name}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Mail className="h-4 w-4" />
              {student.email}
            </CardDescription>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Clock className="h-4 w-4" />
              Активность: {formatLastActivity(student.lastActivity)}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <h2 className={`text-2xl font-bold ${getScoreColor(student.averageScore)}`}>
              {student.averageScore}
            </h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Открыть меню</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56" onClick={(e) => e.stopPropagation()}>
                <DropdownMenuItem onClick={() => router.push(`/results?studentId=${student.id}`)}>Результаты</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`/dashboard?studentId=${student.id}`)}>Дашборд ученика</DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  // Заглушка: деактивация ученика
                  console.log('Деактивировать ученика', student.id);
                  alert('Ученика пометили как неактивного (заглушка)');
                }}>Деактивировать</DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  const newName = prompt('Установить имя ученика', student.name);
                  if (newName) {
                    console.log('Установить имя', student.id, newName);
                    alert(`Имя обновлено (заглушка): ${newName}`);
                  }
                }}>Установить имя</DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  console.log('Перенести ученика', student.id);
                  alert('Откроется диалог переноса (заглушка)');
                }}>Перенести</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600" onClick={() => {
                  if (confirm('Удалить ученика?')) {
                    console.log('Удалить ученика', student.id);
                    alert('Ученик удален (заглушка)');
                  }
                }}>Удалить</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`/dashboard/${groupId}/statistics?studentId=${student.id}`)}>📈 Статистика</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`/answers?studentId=${student.id}`)}>Ответы</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <Badge className={getStatusColor(student.status)}>
            {getStatusText(student.status)}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            {student.testsCompleted} тестов
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Target className="h-3 w-3" />
            {student.progress}% прогресс
          </Badge>
          {student.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
          {student.tags.length > 2 && (
            <Badge variant="secondary">
              +{student.tags.length - 2} тегов
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Прогресс обучения</span>
              <span>{student.progress}%</span>
            </div>
            <Progress value={student.progress} className="h-2" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Подробнее
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src={student.avatar} />
              <AvatarFallback className="text-xs">
                {student.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Основной компонент страницы группы
export default function GroupPageClient() {
  const params = useParams();
  const groupId = params?.id as string;
  const router = useRouter();
  
  if (!groupId) {
    return <div>Group ID not found</div>;
  }
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [group, setGroup] = useState<GroupData | null>(null);
  const [stats, setStats] = useState<GroupStats | null>(null);
  const [students, setStudents] = useState<GroupStudent[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [filters, setFilters] = useState<StudentFilters>({
    search: '',
    status: 'all',
    sortBy: 'name',
    sortOrder: 'asc',
    tags: []
  });
  const [mainTab, setMainTab] = useState<'students' | 'tests' | 'answers' | 'analytics' | 'settings'>('students');
  const [testsSource, setTestsSource] = useState<'all' | 'platform' | 'mine'>('platform');

  // Mock данные для статистики навыков
  const mockStatsData: GroupStatsData = {
    groupId: groupId,
    groupName: `Группа ${groupId}`,
    totalStudents: 24,
    skills: {
      grammar: [
        {
          skillId: 'gram-1',
          skillTitle: 'Падежи существительных',
          completedRuns: 156,
          totalRuns: 180,
          averageScore: 92,
          deltaPercent: 5,
          severity: 2
        },
        {
          skillId: 'gram-2',
          skillTitle: 'Спряжение глаголов',
          completedRuns: 142,
          totalRuns: 160,
          averageScore: 45,
          deltaPercent: -3,
          severity: 3
        },
        {
          skillId: 'gram-3',
          skillTitle: 'Согласование прилагательных',
          completedRuns: 98,
          totalRuns: 120,
          averageScore: 82,
          deltaPercent: 8,
          severity: 1
        },
        {
          skillId: 'gram-4',
          skillTitle: 'Причастные обороты',
          completedRuns: 2,
          totalRuns: 5,
          averageScore: 15,
          deltaPercent: -12,
          severity: 3
        }
      ],
      vocabulary: [
        {
          skillId: 'vocab-1',
          skillTitle: 'Синонимы и антонимы',
          completedRuns: 203,
          totalRuns: 240,
          averageScore: 95,
          deltaPercent: 12,
          severity: 1
        },
        {
          skillId: 'vocab-2',
          skillTitle: 'Фразеологизмы',
          completedRuns: 87,
          totalRuns: 100,
          averageScore: 58,
          deltaPercent: -7,
          severity: 3
        },
        {
          skillId: 'vocab-3',
          skillTitle: 'Паронимы',
          completedRuns: 1,
          totalRuns: 2,
          averageScore: 78,
          deltaPercent: 0,
          severity: 2
        }
      ],
      reading: [
        {
          skillId: 'read-1',
          skillTitle: 'Понимание основной мысли',
          completedRuns: 134,
          totalRuns: 150,
          averageScore: 73,
          deltaPercent: 2,
          severity: 2
        },
        {
          skillId: 'read-2',
          skillTitle: 'Анализ художественного текста',
          completedRuns: 76,
          totalRuns: 90,
          averageScore: 69,
          deltaPercent: -1,
          severity: 3
        }
      ],
      listening: [
        {
          skillId: 'listen-1',
          skillTitle: 'Восприятие диалогов',
          completedRuns: 112,
          totalRuns: 130,
          averageScore: 81,
          deltaPercent: 6,
          severity: 1
        }
      ]
    }
  };

  // Загрузка данных группы
  useEffect(() => {
    const loadGroupData = async () => {
      try {
        setIsLoading(true);
        
        // Моковые данные для демонстрации
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setGroup({
          id: groupId,
          name: 'Русский язык 10А',
          description: 'Основная группа для изучения русского языка в 10 классе',
          status: 'active',
          studentCount: 25,
          createdAt: '2024-09-01T00:00:00Z',
          lastActivity: '2024-12-20T14:30:00Z',
          isOwner: true,
          settings: {
            allowSelfEnrollment: true,
            maxStudents: 30,
            isPublic: false
          }
        });
        
        setStats({
          totalStudents: 25,
          activeStudents: 23,
          averageProgress: 67,
          completedTests: 156,
          totalTests: 200,
          averageScore: 78
        });
        
        setStudents([
          {
            id: '1',
            name: 'Анна Петрова',
            email: 'anna.petrova@example.com',
            status: 'active',
            progress: 85,
            lastActivity: '2024-12-20T10:30:00Z',
            joinedAt: '2024-09-01T00:00:00Z',
            testsCompleted: 12,
            averageScore: 92,
            tags: ['отличница', 'активная']
          },
          {
            id: '2',
            name: 'Михаил Иванов',
            email: 'mikhail.ivanov@example.com',
            status: 'active',
            progress: 72,
            lastActivity: '2024-12-19T16:45:00Z',
            joinedAt: '2024-09-01T00:00:00Z',
            testsCompleted: 10,
            averageScore: 78,
            tags: ['старательный']
          },
          {
            id: '3',
            name: 'Елена Сидорова',
            email: 'elena.sidorova@example.com',
            status: 'pending',
            progress: 0,
            joinedAt: '2024-12-15T00:00:00Z',
            testsCompleted: 0,
            averageScore: 0,
            tags: ['новичок']
          }
        ]);
        
      } catch (err) {
        setError('Ошибка загрузки данных группы');
      } finally {
        setIsLoading(false);
      }
    };

    if (groupId) {
      loadGroupData();
    }
  }, [groupId]);

  const handleAction = (action: string) => {
    console.log(`Action: ${action} for group ${groupId}`);
    // Здесь будет логика обработки действий
  };

  const handleStudentSelect = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSkillClick = (skillId: string) => {
    console.log('Clicked skill:', skillId);
    // Здесь будет переход к детальной аналитике навыка
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
        <Skeleton className="h-16 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !group || !stats) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            {error || 'Группа не найдена'}
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Попробовать снова
          </Button>
        </div>
      </div>
    );
  }

  // Фильтрация и сортировка учеников
  const filteredStudents = students
    .filter(student => {
      if (filters.search && !student.name.toLowerCase().includes(filters.search.toLowerCase()) &&
          !student.email.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.status !== 'all' && student.status !== filters.status) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      const order = filters.sortOrder === 'asc' ? 1 : -1;
      switch (filters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name) * order;
        case 'progress':
          return (a.progress - b.progress) * order;
        case 'score':
          return (a.averageScore - b.averageScore) * order;
        case 'activity':
          const aTime = a.lastActivity ? new Date(a.lastActivity).getTime() : 0;
          const bTime = b.lastActivity ? new Date(b.lastActivity).getTime() : 0;
          return (aTime - bTime) * order;
        default:
          return 0;
      }
    });

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Заголовок группы */}
      <GroupHeader group={group} onAction={handleAction} />
      
      {/* Статистика группы */}
      <GroupStatsOverview stats={stats} />
      
      {/* Вкладки */}
      <Tabs value={mainTab} onValueChange={(value) => setMainTab(value as 'students' | 'tests' | 'answers' | 'analytics' | 'settings')} className="w-full">
        <TabsList>
          <TabsTrigger value="students" expandToFill>Ученики</TabsTrigger>
          <TabsTrigger value="tests" expandToFill>Тесты</TabsTrigger>
          <TabsTrigger value="answers" expandToFill>Ответы</TabsTrigger>
          <TabsTrigger value="analytics" expandToFill>Аналитика</TabsTrigger>
          <TabsTrigger value="settings" expandToFill>Настройки</TabsTrigger>
        </TabsList>
        {mainTab === 'students' && (
          <ActionPanel
            density="compact"
            filterGroups={[]}
            selectAll={{
              label: 'Выбрать всех',
              checked: filteredStudents.length > 0 && selectedStudents.length === filteredStudents.length,
              onToggle: (checked) => {
                if (checked) {
                  setSelectedStudents(filteredStudents.map(s => s.id));
                } else {
                  setSelectedStudents([]);
                }
              }
            }}
            secondaryActions={selectedStudents.length > 0 ? [
              { id: 'message', label: 'Отправить сообщение', icon: Mail, onClick: () => {/* TODO: implement messaging */} },
              { id: 'export', label: 'Экспорт', icon: Download, onClick: () => {/* TODO: implement export */} },
            ] : []}
            primaryAction={{ label: 'Пригласить учеников', icon: UserPlus, onClick: () => handleAction('invite') }}
          />
        )}
        {mainTab === 'tests' && (
          <ActionPanel
            density="compact"
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
            primaryAction={{ label: 'Создать тест', icon: BookOpen, onClick: () => router.push('/create-test') }}
          />
        )}
        {mainTab === 'answers' && (
          <ActionPanel
            density="compact"
            filterGroups={[]}
            primaryAction={{ label: 'Действие', icon: List, onClick: () => {} }}
          />
        )}
        {mainTab === 'analytics' && (
          <ActionPanel
            density="compact"
            filterGroups={[]}
            primaryAction={{ label: 'Действие', icon: List, onClick: () => {} }}
          />
        )}
        {mainTab === 'settings' && (
          <ActionPanel
            density="compact"
            filterGroups={[]}
            primaryAction={{ label: 'Действие', icon: List, onClick: () => {} }}
          />
        )}
        
        <TabsContent value="students" className="space-y-6">
          {/* Панель фильтров */}
          <StudentsFilterBar 
            filters={filters}
            onFiltersChange={setFilters}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
          
          {/* Панель массовых действий перенесена в ActionPanel ниже заголовка вкладок */}
          
          {/* Список учеников */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStudents.map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  isSelected={selectedStudents.includes(student.id)}
                  onSelect={handleStudentSelect}
                  groupId={groupId}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border">
              <div className="p-4 border-b">
                <h3 className="font-medium">Список учеников</h3>
              </div>
              <div className="divide-y">
                {filteredStudents.map((student) => (
                  <div 
                    key={student.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer ${
                      selectedStudents.includes(student.id) ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleStudentSelect(student.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={student.avatar} />
                          <AvatarFallback className="text-xs">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-muted-foreground">{student.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span>{student.progress}%</span>
                        <span>{student.averageScore} балл</span>
                        <Badge variant="secondary" className={getStatusColor(student.status)}>
                          {student.status === 'active' ? 'Активен' : 
                           student.status === 'pending' ? 'Ожидает' : 'Неактивен'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Ученики не найдены</h3>
              <p className="text-muted-foreground mb-4">
                Попробуйте изменить параметры поиска или пригласите новых учеников
              </p>
              <Button onClick={() => handleAction('invite')}>
                <UserPlus className="h-4 w-4 mr-2" />
                Пригласить учеников
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Новая верхняя вкладка "Ответы" */}
        <TabsContent value="answers" className="space-y-6">
              <TestFeed data={mockTestFeed} />
        </TabsContent>

        <TabsContent value="tests" className="space-y-6">
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
              <CustomTestsStats data={mockCustomTests} />
              <TestsFilterBar
                filters={{
                  search: '',
                  type: 'all',
                  status: 'all',
                  difficulty: 'all',
                  sortBy: 'title',
                  sortOrder: 'asc'
                }}
                onFiltersChange={() => {}}
              />
              <div className="border rounded-lg bg-card">
                {mockCustomTests.tests.map((test, index) => (
                  <div key={test.id} className={index > 0 ? 'border-t' : ''}>
                    <CustomTestCard
                      test={test}
                      onAction={(action, testId) => {
                        console.log(`Action: ${action} for test ${testId}`);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general">Общая статистика</TabsTrigger>
              <TabsTrigger value="tasks">Статистика заданий</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-6">
              <SkillSection 
                title="Грамматика" 
                skills={mockStatsData.skills.grammar} 
                icon={BookOpen}
                onSkillClick={handleSkillClick}
              />
              <SkillSection 
                title="Лексика" 
                skills={mockStatsData.skills.vocabulary} 
                icon={Target}
                onSkillClick={handleSkillClick}
              />
              <SkillSection 
                title="Чтение" 
                skills={mockStatsData.skills.reading} 
                icon={BookOpen}
                onSkillClick={handleSkillClick}
              />
              <SkillSection 
                title="Аудирование" 
                skills={mockStatsData.skills.listening} 
                icon={Clock}
                onSkillClick={handleSkillClick}
              />
            </TabsContent>
            
            <TabsContent value="tasks" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mockTaskStats.tasks.map((task) => (
                  <TaskStatsCard key={task.taskId} task={task} />
                ))}
              </div>
            </TabsContent>
            
            {/* Лента ответов перенесена на верхний уровень вкладок */}
          </Tabs>
        </TabsContent>

        <TabsContent value="settings">
          <GroupSettingsPanel 
            settings={mockGroupSettingsNew}
            moderators={mockModeratorsNew}
            onSettingsChange={(settings) => {
              console.log('Settings changed:', settings);
              // Здесь будет логика сохранения настроек
            }}
            onModeratorAction={(action, moderatorId) => {
              console.log('Moderator action:', action, moderatorId);
              // Здесь будет логика управления модераторами
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Вспомогательная функция для цветов статуса (используется в table режиме)
function getStatusColor(status: string) {
  switch (status) {
    case 'active': return 'text-green-600 bg-green-50';
    case 'inactive': return 'text-gray-600 bg-gray-50';
    case 'pending': return 'text-yellow-600 bg-yellow-50';
    default: return 'text-gray-600 bg-gray-50';
  }
}

// Добавляем компонент для карточки статистики задания
function TaskStatsCard({ task }: { task: TaskStats }) {
  const completionRate = (task.completedStudents / task.assignedStudents) * 100;
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
  
  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case 'grammar': return BookOpen;
      case 'vocabulary': return Target;
      case 'reading': return BookOpen;
      case 'listening': return Clock;
      default: return BookOpen;
    }
  };

  const TaskIcon = getTaskTypeIcon(task.taskType);

  return (
    <Card className="hover:border-green-600 hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <TaskIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-base font-medium">{task.taskTitle}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {task.taskType === 'grammar' ? 'Грамматика' :
                   task.taskType === 'vocabulary' ? 'Лексика' :
                   task.taskType === 'reading' ? 'Чтение' : 'Аудирование'}
                </Badge>
                {isOverdue && (
                  <Badge variant="destructive" className="text-xs">
                    Просрочено
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                Редактировать
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="h-4 w-4 mr-2" />
                Дублировать
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Удалить
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Выполнено</p>
            <p className="text-lg font-semibold">
              {task.completedStudents}/{task.assignedStudents}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Средний балл</p>
            <p className="text-lg font-semibold">{task.averageScore}%</p>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Прогресс выполнения</span>
            <span>{Math.round(completionRate)}%</span>
          </div>
          <Progress value={completionRate} className="h-2" />
        </div>
        
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Среднее время: {task.averageTime} мин</span>
          {task.dueDate && (
            <span className={isOverdue ? 'text-red-600' : ''}>
              До: {new Date(task.dueDate).toLocaleDateString('ru-RU')}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Интерфейс для ленты ответов
interface TestFeedData {
  submissions: TestSubmission[];
  totalTests: number;
  totalAnswers: number;
  correctAnswers: number;
  incorrectAnswers: number;
  averageScore?: number;
}

// Mock данные для статистики заданий
const mockTaskStats: TaskStatsData = {
  totalTasks: 8,
  completedTasks: 5,
  averageCompletionRate: 78,
  tasks: [
    {
      taskId: 'task-1',
      taskTitle: 'Падежи существительных - Тест 1',
      taskType: 'grammar',
      assignedStudents: 25,
      completedStudents: 23,
      averageScore: 87,
      averageTime: 12,
      difficulty: 'medium',
      createdAt: '2024-12-15T10:00:00Z',
      dueDate: '2024-12-25T23:59:59Z'
    },
    {
      taskId: 'task-2',
      taskTitle: 'Синонимы и антонимы',
      taskType: 'vocabulary',
      assignedStudents: 25,
      completedStudents: 20,
      averageScore: 92,
      averageTime: 8,
      difficulty: 'easy',
      createdAt: '2024-12-10T14:30:00Z',
      dueDate: '2024-12-20T23:59:59Z'
    },
    {
      taskId: 'task-3',
      taskTitle: 'Анализ текста Пушкина',
      taskType: 'reading',
      assignedStudents: 25,
      completedStudents: 15,
      averageScore: 73,
      averageTime: 25,
      difficulty: 'hard',
      createdAt: '2024-12-12T09:15:00Z',
      dueDate: '2024-12-18T23:59:59Z'
    },
    {
      taskId: 'task-4',
      taskTitle: 'Восприятие диалогов',
      taskType: 'listening',
      assignedStudents: 25,
      completedStudents: 18,
      averageScore: 81,
      averageTime: 15,
      difficulty: 'medium',
      createdAt: '2024-12-08T16:45:00Z'
    },
    {
      taskId: 'task-5',
      taskTitle: 'Спряжение глаголов - Практика',
      taskType: 'grammar',
      assignedStudents: 25,
      completedStudents: 12,
      averageScore: 65,
      averageTime: 18,
      difficulty: 'hard',
      createdAt: '2024-12-14T11:20:00Z',
      dueDate: '2024-12-22T23:59:59Z'
    },
    {
      taskId: 'task-6',
      taskTitle: 'Фразеологизмы в речи',
      taskType: 'vocabulary',
      assignedStudents: 25,
      completedStudents: 8,
      averageScore: 58,
      averageTime: 22,
      difficulty: 'hard',
      createdAt: '2024-12-16T13:10:00Z',
      dueDate: '2024-12-30T23:59:59Z'
    }
  ]
};

// Mock данные для ленты решённых тестов
const mockTestFeed: TestFeedData = {
  totalTests: 6,
  totalAnswers: 156,
  correctAnswers: 124,
  incorrectAnswers: 32,
  averageScore: 79.5,
  submissions: [
    {
      id: 'sub-1',
      studentId: 'student-1',
      studentName: 'Анна Петрова',
      studentEmail: 'anna.petrova@school.ru',
      testId: 'task-1',
      testTitle: 'Падежи существительных - Тест 1',
      submittedAt: new Date(Date.now() - 30 * 60000).toISOString(), // 30 мин назад
      totalQuestions: 25,
      correctAnswers: 22,
      scorePercent: 88
    },
    {
      id: 'sub-2',
      studentId: 'student-2',
      studentName: 'Михаил Сидоров',
      studentEmail: 'mikhail.sidorov@school.ru',
      testId: 'task-2',
      testTitle: 'Синонимы и антонимы',
      submittedAt: new Date(Date.now() - 2 * 3600000).toISOString(), // 2 часа назад
      totalQuestions: 20,
      correctAnswers: 19,
      scorePercent: 95
    },
    {
      id: 'sub-3',
      studentId: 'student-3',
      studentName: 'Елена Козлова',
      studentEmail: 'elena.kozlova@school.ru',
      testId: 'task-3',
      testTitle: 'Анализ текста Пушкина',
      submittedAt: new Date(Date.now() - 5 * 3600000).toISOString(), // 5 часов назад
      totalQuestions: 10,
      correctAnswers: 6,
      scorePercent: 60
    },
    {
      id: 'sub-4',
      studentId: 'student-4',
      studentName: 'Дмитрий Волков',
      studentEmail: 'dmitry.volkov@school.ru',
      testId: 'task-4',
      testTitle: 'Восприятие диалогов',
      submittedAt: new Date(Date.now() - 24 * 3600000).toISOString(), // 1 день назад
      totalQuestions: 15,
      correctAnswers: 12,
      scorePercent: 80
    }
  ]
};

// Добавляем mock данные для настроек группы
const mockGroupSettings: GroupSettings = {
  general: {
    name: 'Русский язык - 10 класс',
    description: 'Изучение русского языка для учеников 10 класса с углубленным изучением литературы',
    category: 'Русский язык',
    language: 'ru',
    timezone: 'Europe/Moscow'
  },
  access: {
    isPublic: false,
    allowSelfEnrollment: true,
    requireApproval: true,
    maxStudents: 30,
    inviteCode: 'RUS10-2024'
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    studentProgress: true,
    newSubmissions: true
  },
  advanced: {
    allowStudentChat: true,
    showLeaderboard: false,
    allowRetakes: true,
    autoGrading: false,
    exportData: true
  }
};

const mockModerators: GroupModerator[] = [
  {
    id: 'mod-1',
    name: 'Елена Викторовна Смирнова',
    email: 'e.smirnova@school.ru',
    avatar: '/avatars/teacher1.jpg',
    role: 'owner',
    permissions: {
      manageSettings: true,
      manageStudents: true,
      createTests: true,
      viewAnalytics: true
    },
    addedAt: '2024-09-01T08:00:00Z'
  },
  {
    id: 'mod-2',
    name: 'Андрей Петрович Иванов',
    email: 'a.ivanov@school.ru',
    role: 'moderator',
    permissions: {
      manageSettings: false,
      manageStudents: true,
      createTests: true,
      viewAnalytics: true
    },
    addedAt: '2024-10-15T10:30:00Z'
  }
];

// Компонент ленты решённых тестов
const TestFeed = ({ data }: { data: TestFeedData }) => {
  const [selectedStudentIds, setSelectedStudentIds] = React.useState<string[]>([]);
  const [selectedTestIds, setSelectedTestIds] = React.useState<string[]>([]);
  const [startDate, setStartDate] = React.useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = React.useState<Date | undefined>(undefined);

  const studentOptions: MultiOption[] = Array.from(
    new Map(data.submissions.map((s) => [s.studentId, s.studentName])).entries()
  ).map(([value, label]) => ({ value, label }));
  const testOptions: MultiOption[] = Array.from(
    new Map(data.submissions.map((s) => [s.testId, s.testTitle])).entries()
  ).map(([value, label]) => ({ value, label }));

  const toInputDate = (d?: Date): string => {
    if (!d) return "";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const parseIsoInput = (iso: string): Date | undefined => {
    if (!iso) return undefined;
    const [y, m, d] = iso.split("-").map(Number);
    const next = new Date(y, (m ?? 1) - 1, d ?? 1);
    return isNaN(next.getTime()) ? undefined : next;
  };

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

  const filtered = data.submissions.filter((sub) => {
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
      <ActionPanel
        filterGroups={[
          {
            id: 'test-feed-filters',
            controls: [
              {
                type: 'multiselect',
                id: 'students',
                label: 'Ученики',
                values: selectedStudentIds,
                options: studentOptions,
                onChange: setSelectedStudentIds,
              },
              {
                type: 'multiselect',
                id: 'tests',
                label: 'Тесты',
                values: selectedTestIds,
                options: testOptions,
                onChange: setSelectedTestIds,
              },
              {
                type: 'daterange',
                id: 'date-range',
                startDate: startDate,
                endDate: endDate,
                onChange: (start, end) => {
                  setStartDate(start);
                  setEndDate(end);
                },
              },
            ],
          },
        ]}
        primaryAction={{
          label: 'Экспорт',
          icon: BookOpen,
          onClick: () => console.log('Export feed'),
        }}
        density="compact"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <h2 className="text-2xl font-bold text-blue-600">{stats.totalTests}</h2>
            <div className="text-sm text-gray-600">{pluralizeWord(stats.totalTests, 'тест', 'теста', 'тестов')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h2 className="text-2xl font-bold text-indigo-600">{stats.totalAnswers}</h2>
            <div className="text-sm text-gray-600">{pluralizeWord(stats.totalAnswers, 'ответ', 'ответа', 'ответов')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h2 className="text-2xl font-bold text-green-600">{stats.correctAnswers}</h2>
            <div className="text-sm text-gray-600">{pluralizeWord(stats.correctAnswers, 'правильный', 'правильных', 'правильных')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h2 className="text-2xl font-bold text-red-600">{stats.incorrectAnswers}</h2>
            <div className="text-sm text-gray-600">{pluralizeWord(stats.incorrectAnswers, 'неправильный', 'неправильных', 'неправильных')}</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Последние тесты</h3>
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

// Интерфейсы для пользовательских тестов
interface CustomTest {
  id: string;
  title: string;
  description?: string;
  type: 'grammar' | 'vocabulary' | 'reading' | 'listening' | 'mixed';
  difficulty: 'easy' | 'medium' | 'hard';
  questionsCount: number;
  timeLimit: number; // в минутах
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
  assignedStudents: number;
  completedStudents: number;
  averageScore?: number;
  tags: string[];
  isPublic: boolean;
}

interface CustomTestsData {
  tests: CustomTest[];
}

// Mock данные для пользовательских тестов
const mockCustomTests: CustomTestsData = {
  tests: [
    {
      id: 'ct-1',
      title: 'Итоговый тест по орфографии',
      description: 'Проверка знаний по всем правилам орфографии за курс.',
      type: 'grammar',
      difficulty: 'hard',
      questionsCount: 50,
      timeLimit: 60,
      status: 'published',
      createdAt: '2024-11-20T10:00:00Z',
      updatedAt: '2024-11-22T14:30:00Z',
      assignedStudents: 25,
      completedStudents: 18,
      averageScore: 76,
      tags: ['орфография', 'итоги'],
      isPublic: false,
    },
    {
      id: 'ct-2',
      title: 'Лексический минимум (A1)',
      type: 'vocabulary',
      difficulty: 'easy',
      questionsCount: 30,
      timeLimit: 20,
      status: 'published',
      createdAt: '2024-10-15T09:00:00Z',
      updatedAt: '2024-10-15T09:00:00Z',
      assignedStudents: 25,
      completedStudents: 25,
      averageScore: 92,
      tags: ['лексика', 'A1'],
      isPublic: true,
    },
    {
      id: 'ct-3',
      title: 'Анализ поэзии Серебряного века',
      type: 'reading',
      difficulty: 'hard',
      questionsCount: 10,
      timeLimit: 45,
      status: 'draft',
      createdAt: '2024-12-01T18:00:00Z',
      updatedAt: '2024-12-05T11:00:00Z',
      assignedStudents: 0,
      completedStudents: 0,
      tags: ['поэзия', 'анализ'],
      isPublic: false,
    },
  ],
};

// Интерфейсы для настроек группы
interface GroupSettings {
  general: {
    name: string;
    description: string;
    category: string;
    language: string;
    timezone: string;
  };
  access: {
    isPublic: boolean;
    allowSelfEnrollment: boolean;
    requireApproval: boolean;
    maxStudents: number;
    inviteCode: string;
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    weeklyReports: boolean;
    studentProgress: boolean;
    newSubmissions: boolean;
  };
  advanced: {
    allowStudentChat: boolean;
    showLeaderboard: boolean;
    allowRetakes: boolean;
    autoGrading: boolean;
    exportData: boolean;
  };
}

interface GroupModerator {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'moderator';
  permissions: {
    manageSettings: boolean;
    manageStudents: boolean;
    createTests: boolean;
    viewAnalytics: boolean;
  };
  addedAt: string;
}

// Mock данные для настроек (новый формат)
const mockGroupSettingsNew: GroupSettings = {
  general: {
    name: 'Русский язык - 10 класс',
    description: 'Изучение русского языка для учеников 10 класса с углубленным изучением литературы',
    category: 'Русский язык',
    language: 'ru',
    timezone: 'Europe/Moscow'
  },
  access: {
    isPublic: false,
    allowSelfEnrollment: true,
    requireApproval: true,
    maxStudents: 30,
    inviteCode: 'RUS10-2024'
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    studentProgress: true,
    newSubmissions: true
  },
  advanced: {
    allowStudentChat: true,
    showLeaderboard: false,
    allowRetakes: true,
    autoGrading: false,
    exportData: true
  }
};

const mockModeratorsNew: GroupModerator[] = [
  {
    id: 'mod-1',
    name: 'Елена Викторовна Смирнова',
    email: 'e.smirnova@school.ru',
    avatar: '/avatars/teacher1.jpg',
    role: 'owner',
    permissions: {
      manageSettings: true,
      manageStudents: true,
      createTests: true,
      viewAnalytics: true
    },
    addedAt: '2024-09-01T08:00:00Z'
  },
  {
    id: 'mod-2',
    name: 'Андрей Петрович Иванов',
    email: 'a.ivanov@school.ru',
    role: 'moderator',
    permissions: {
      manageSettings: false,
      manageStudents: true,
      createTests: true,
      viewAnalytics: true
    },
    addedAt: '2024-10-15T10:30:00Z'
  }
];

// Компонент панели настроек
function GroupSettingsPanel({
  settings,
  moderators,
  onSettingsChange,
  onModeratorAction,
}: {
  settings: GroupSettings;
  moderators: GroupModerator[];
  onSettingsChange: (settings: GroupSettings) => void;
  onModeratorAction: (action: string, moderatorId: string) => void;
}) {
  const [currentSettings, setCurrentSettings] = useState(settings);

  const handleSettingChange = (section: keyof GroupSettings, key: any, value: any) => {
    const newSettings = {
      ...currentSettings,
      [section]: {
        ...currentSettings[section],
        [key]: value,
      },
    };
    setCurrentSettings(newSettings);
    onSettingsChange(newSettings);
  };

  return (
    <div className="space-y-8">
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Общие настройки</CardTitle>
          <CardDescription>Основные параметры вашей группы.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="group-name">Название группы</Label>
            <Input
              id="group-name"
              value={currentSettings.general.name}
              onChange={(e) => handleSettingChange('general', 'name', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="group-description">Описание</Label>
            <Input
              id="group-description"
              value={currentSettings.general.description}
              onChange={(e) => handleSettingChange('general', 'description', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Access Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Доступ</CardTitle>
          <CardDescription>Управление доступом и приглашениями.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="allow-self-enrollment">Разрешить самостоятельное вступление</Label>
            <Switch
              id="allow-self-enrollment"
              checked={currentSettings.access.allowSelfEnrollment}
              onCheckedChange={(checked) => handleSettingChange('access', 'allowSelfEnrollment', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="require-approval">Требовать подтверждения</Label>
            <Switch
              id="require-approval"
              checked={currentSettings.access.requireApproval}
              onCheckedChange={(checked) => handleSettingChange('access', 'requireApproval', checked)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="invite-code">Код приглашения</Label>
            <div className="flex items-center gap-2">
              <Input id="invite-code" value={currentSettings.access.inviteCode} readOnly />
              <Button variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Копировать
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Moderators */}
      <Card>
        <CardHeader>
          <CardTitle>Модераторы</CardTitle>
          <CardDescription>Управление командой преподавателей.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {moderators.map((moderator) => (
              <div key={moderator.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={moderator.avatar} />
                    <AvatarFallback>{moderator.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{moderator.name}</p>
                    <p className="text-sm text-muted-foreground">{moderator.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={moderator.role === 'owner' ? 'default' : 'secondary'}>
                    {moderator.role === 'owner' ? 'Владелец' : 'Модератор'}
                  </Badge>
                  {moderator.role !== 'owner' && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onModeratorAction('edit', moderator.id)}>
                          Изменить права
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => onModeratorAction('remove', moderator.id)}
                        >
                          Удалить
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="mt-4">
            <UserPlus className="h-4 w-4 mr-2" />
            Добавить модератора
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
