'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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
    <div className="bg-white p-4 rounded-lg border mb-6">
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
      case 'grammar': return <BookOpen className="h-4 w-4" />;
      case 'vocabulary': return <Target className="h-4 w-4" />;
      case 'reading': return <BookOpen className="h-4 w-4" />;
      case 'listening': return <Clock className="h-4 w-4" />;
      case 'mixed': return <Grid3X3 className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:border-green-600 hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getTypeIcon(test.type)}
            <CardTitle className="text-lg">{test.title}</CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
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
        {test.description && (
          <p className="text-sm text-gray-600 mt-2">{test.description}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Badge className={getStatusColor(test.status)}>
              {test.status === 'published' ? 'Опубликован' : 
               test.status === 'draft' ? 'Черновик' : 'Архив'}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Вопросов:</span>
              <span className="ml-2 font-medium">{test.questionsCount}</span>
            </div>
            {test.timeLimit && (
              <div>
                <span className="text-gray-500">Время:</span>
                <span className="ml-2 font-medium">{test.timeLimit} мин</span>
              </div>
            )}
            <div>
              <span className="text-gray-500">Назначен:</span>
              <span className="ml-2 font-medium">{test.assignedStudents}</span>
            </div>
            <div>
              <span className="text-gray-500">Выполнен:</span>
              <span className="ml-2 font-medium">{test.completedStudents}</span>
            </div>
          </div>

          {test.averageScore && (
            <div className="pt-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Средний балл</span>
                <span className="font-medium">{test.averageScore}%</span>
              </div>
              <Progress value={test.averageScore} className="h-2" />
            </div>
          )}

          {test.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-2">
              {test.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Компонент карточки ученика
function StudentCard({ 
  student, 
  isSelected, 
  onSelect 
}: { 
  student: GroupStudent; 
  isSelected: boolean;
  onSelect: (studentId: string) => void;
}) {
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
          <h2 className={`text-2xl font-bold ${getScoreColor(student.averageScore)}`}>
            {student.averageScore}
          </h2>
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
      <Tabs defaultValue="students" className="w-full">
        <TabsList>
          <TabsTrigger value="students" expandToFill>Ученики</TabsTrigger>
          <TabsTrigger value="tests" expandToFill>Тесты</TabsTrigger>
          <TabsTrigger value="analytics" expandToFill>Аналитика</TabsTrigger>
          <TabsTrigger value="settings" expandToFill>Настройки</TabsTrigger>
        </TabsList>
        
        <TabsContent value="students" className="space-y-6">
          {/* Панель фильтров */}
          <StudentsFilterBar 
            filters={filters}
            onFiltersChange={setFilters}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
          
          {/* Панель массовых действий */}
          {selectedStudents.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Выбрано учеников: {selectedStudents.length}
                </span>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Отправить сообщение
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Экспорт
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setSelectedStudents([])}
                  >
                    Отменить выбор
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Список учеников */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStudents.map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  isSelected={selectedStudents.includes(student.id)}
                  onSelect={handleStudentSelect}
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
        
        <TabsContent value="tests" className="space-y-6">
          <Tabs defaultValue="custom" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="custom">Пользовательские тесты</TabsTrigger>
              <TabsTrigger value="assigned">Назначенные тесты</TabsTrigger>
            </TabsList>
            
            <TabsContent value="custom" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Пользовательские тесты</h3>
                  <p className="text-sm text-muted-foreground">
                    Создавайте и управляйте собственными тестами для группы
                  </p>
                </div>
                <Button>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Создать тест
                </Button>
              </div>
              
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockCustomTests.tests.map((test) => (
                  <CustomTestCard 
                    key={test.id} 
                    test={test} 
                    onAction={(action, testId) => {
                      console.log(`Action: ${action} for test ${testId}`);
                    }}
                  />
                ))}
              </div>
              
              {mockCustomTests.tests.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Нет пользовательских тестов</h3>
                  <p className="text-muted-foreground mb-4">
                    Создайте свой первый тест для группы
                  </p>
                  <Button>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Создать тест
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="assigned" className="space-y-6">
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Назначенные тесты</h3>
                <p className="text-muted-foreground">
                  Здесь будут отображаться тесты, назначенные группе из библиотеки
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">Общая статистика</TabsTrigger>
              <TabsTrigger value="tasks">Статистика заданий</TabsTrigger>
              <TabsTrigger value="answers">Лента ответов</TabsTrigger>
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
            
            <TabsContent value="answers" className="space-y-6">
              <AnswerFeed data={mockAnswerFeed} />
            </TabsContent>
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

// Интерфейсы для ленты ответов
interface StudentAnswer {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  taskId: string;
  taskTitle: string;
  taskType: 'grammar' | 'vocabulary' | 'reading' | 'listening';
  answer: string;
  isCorrect: boolean;
  score: number;
  maxScore: number;
  submittedAt: string;
  timeSpent: number; // в секундах
  difficulty: 'easy' | 'medium' | 'hard';
}

interface AnswerFeedData {
  answers: StudentAnswer[];
  totalAnswers: number;
  correctAnswers: number;
  averageScore: number;
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

// Mock данные для ленты ответов
const mockAnswerFeed: AnswerFeedData = {
  totalAnswers: 156,
  correctAnswers: 124,
  averageScore: 79.5,
  answers: [
    {
      id: 'ans-1',
      studentId: 'student-1',
      studentName: 'Анна Петрова',
      studentAvatar: '/avatars/anna.jpg',
      taskId: 'task-1',
      taskTitle: 'Падежи существительных - Тест 1',
      taskType: 'grammar',
      answer: 'В родительном падеже',
      isCorrect: true,
      score: 5,
      maxScore: 5,
      submittedAt: '2024-12-17T14:30:00Z',
      timeSpent: 45,
      difficulty: 'medium'
    },
    {
      id: 'ans-2',
      studentId: 'student-2',
      studentName: 'Михаил Сидоров',
      taskId: 'task-2',
      taskTitle: 'Синонимы и антонимы',
      taskType: 'vocabulary',
      answer: 'Большой - огромный',
      isCorrect: true,
      score: 3,
      maxScore: 3,
      submittedAt: '2024-12-17T14:25:00Z',
      timeSpent: 32,
      difficulty: 'easy'
    },
    {
      id: 'ans-3',
      studentId: 'student-3',
      studentName: 'Елена Козлова',
      taskId: 'task-3',
      taskTitle: 'Анализ текста Пушкина',
      taskType: 'reading',
      answer: 'Основная тема - любовь к родине',
      isCorrect: false,
      score: 2,
      maxScore: 4,
      submittedAt: '2024-12-17T14:20:00Z',
      timeSpent: 180,
      difficulty: 'hard'
    },
    {
      id: 'ans-4',
      studentId: 'student-4',
      studentName: 'Дмитрий Волков',
      taskId: 'task-4',
      taskTitle: 'Восприятие диалогов',
      taskType: 'listening',
      answer: 'Собеседники обсуждают планы на выходные',
      isCorrect: true,
      score: 4,
      maxScore: 4,
      submittedAt: '2024-12-17T14:15:00Z',
      timeSpent: 95,
      difficulty: 'medium'
    },
    {
      id: 'ans-5',
      studentId: 'student-5',
      studentName: 'Ольга Морозова',
      taskId: 'task-1',
      taskTitle: 'Падежи существительных - Тест 1',
      taskType: 'grammar',
      answer: 'В дательном падеже',
      isCorrect: false,
      score: 0,
      maxScore: 5,
      submittedAt: '2024-12-17T14:10:00Z',
      timeSpent: 67,
      difficulty: 'medium'
    },
    {
      id: 'ans-6',
      studentId: 'student-6',
      studentName: 'Александр Новиков',
      taskId: 'task-5',
      taskTitle: 'Спряжение глаголов - Практика',
      taskType: 'grammar',
      answer: 'читаю, читаешь, читает',
      isCorrect: true,
      score: 5,
      maxScore: 5,
      submittedAt: '2024-12-17T14:05:00Z',
      timeSpent: 120,
      difficulty: 'hard'
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

// Компонент карточки ответа студента
const AnswerCard = ({ answer }: { answer: StudentAnswer }) => {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'только что';
    if (diffInMinutes < 60) return `${diffInMinutes} мин назад`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} ч назад`;
    return `${Math.floor(diffInMinutes / 1440)} дн назад`;
  };

  const formatTimeSpent = (seconds: number) => {
    if (seconds < 60) return `${seconds} сек`;
    return `${Math.floor(seconds / 60)} мин ${seconds % 60} сек`;
  };

  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case 'grammar': return '📝';
      case 'vocabulary': return '📚';
      case 'reading': return '📖';
      case 'listening': return '🎧';
      default: return '📋';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'hard': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              {answer.studentAvatar ? (
                <img src={answer.studentAvatar} alt={answer.studentName} className="w-10 h-10 rounded-full" />
              ) : (
                <span className="text-blue-600 font-medium text-sm">
                  {answer.studentName.split(' ').map(n => n[0]).join('')}
                </span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium text-gray-900">{answer.studentName}</span>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">{formatTimeAgo(answer.submittedAt)}</span>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">{getTaskTypeIcon(answer.taskType)}</span>
                <span className="text-sm font-medium text-gray-700">{answer.taskTitle}</span>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 mb-2">
                <p className="text-sm text-gray-800">{answer.answer}</p>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Время: {formatTimeSpent(answer.timeSpent)}</span>
                <div className="flex items-center space-x-4">
                  <span className={answer.isCorrect ? 'text-green-600' : 'text-red-600'}>
                    {answer.isCorrect ? '✓ Правильно' : '✗ Неправильно'}
                  </span>
                  <span className="font-medium">
                    {answer.score}/{answer.maxScore} баллов
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Компонент ленты ответов
const AnswerFeed = ({ data }: { data: AnswerFeedData }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <h2 className="text-2xl font-bold text-blue-600">{data.totalAnswers}</h2>
            <div className="text-sm text-gray-600">Всего ответов</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h2 className="text-2xl font-bold text-green-600">{data.correctAnswers}</h2>
            <div className="text-sm text-gray-600">Правильных ответов</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h2 className="text-2xl font-bold text-purple-600">{data.averageScore.toFixed(1)}%</h2>
            <div className="text-sm text-gray-600">Средний балл</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Последние ответы</h3>
        {data.answers.map((answer) => (
          <AnswerCard key={answer.id} answer={answer} />
        ))}
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
  totalTests: number;
  publishedTests: number;
  draftTests: number;
}

// GroupSettings and GroupModerator interfaces
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
    maxStudents?: number;
    inviteCode?: string;
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
  role: 'owner' | 'admin' | 'moderator';
  permissions: {
    manageStudents: boolean;
    createTests: boolean;
    viewAnalytics: boolean;
    manageSettings: boolean;
  };
  addedAt: string;
}

// Mock data for group settings
const mockGroupSettingsNew: GroupSettings = {
  general: {
    name: 'Русский язык - 10 класс',
    description: 'Изучение русского языка для учеников 10 класса с акцентом на грамматику и литературу',
    category: 'Русский язык',
    language: 'ru',
    timezone: 'Europe/Moscow'
  },
  access: {
    isPublic: false,
    allowSelfEnrollment: true,
    requireApproval: false,
    maxStudents: 30,
    inviteCode: 'RUS10-2024'
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: true,
    weeklyReports: true,
    studentProgress: true,
    newSubmissions: false
  },
  advanced: {
    allowStudentChat: false,
    showLeaderboard: true,
    allowRetakes: true,
    autoGrading: true,
    exportData: true
  }
};

const mockModeratorsNew: GroupModerator[] = [
  {
    id: 'mod-1',
    name: 'Елена Васильевна Смирнова',
    email: 'elena.smirnova@school.ru',
    avatar: '/avatars/elena.jpg',
    role: 'owner',
    permissions: {
      manageStudents: true,
      createTests: true,
      viewAnalytics: true,
      manageSettings: true
    },
    addedAt: '2024-09-01T08:00:00Z'
  },
  {
    id: 'mod-2',
    name: 'Андрей Петрович Козлов',
    email: 'andrey.kozlov@school.ru',
    role: 'admin',
    permissions: {
      manageStudents: true,
      createTests: true,
      viewAnalytics: true,
      manageSettings: false
    },
    addedAt: '2024-09-15T10:30:00Z'
  }
];

// Mock data for custom tests
const mockCustomTests: CustomTestsData = {
  totalTests: 5,
  publishedTests: 3,
  draftTests: 2,
  tests: [
    {
      id: 'custom-1',
      title: 'Тест по падежам - Авторский',
      description: 'Углубленное изучение падежной системы русского языка',
      type: 'grammar',
      difficulty: 'medium',
      questionsCount: 15,
      timeLimit: 20,
      status: 'published',
      createdAt: '2024-12-10T10:00:00Z',
      updatedAt: '2024-12-15T14:30:00Z',
      assignedStudents: 25,
      completedStudents: 18,
      averageScore: 82,
      tags: ['падежи', 'грамматика', 'склонение'],
      isPublic: false
    },
    {
      id: 'custom-2',
      title: 'Словарный запас - Синонимы',
      description: 'Проверка знания синонимов и их правильного употребления',
      type: 'vocabulary',
      difficulty: 'easy',
      questionsCount: 20,
      timeLimit: 15,
      status: 'published',
      createdAt: '2024-12-08T09:15:00Z',
      updatedAt: '2024-12-12T16:45:00Z',
      assignedStudents: 25,
      completedStudents: 22,
      averageScore: 89,
      tags: ['синонимы', 'лексика', 'словарь'],
      isPublic: true
    },
    {
      id: 'custom-3',
      title: 'Анализ стихотворения Есенина',
      description: 'Комплексный анализ поэтического текста',
      type: 'reading',
      difficulty: 'hard',
      questionsCount: 10,
      timeLimit: 30,
      status: 'published',
      createdAt: '2024-12-05T11:20:00Z',
      updatedAt: '2024-12-14T13:10:00Z',
      assignedStudents: 25,
      completedStudents: 12,
      averageScore: 74,
      tags: ['поэзия', 'анализ', 'Есенин'],
      isPublic: false
    },
    {
      id: 'custom-4',
      title: 'Орфоэпия - Ударения',
      description: 'Правильная постановка ударений в словах',
      type: 'listening',
      difficulty: 'medium',
      questionsCount: 25,
      timeLimit: 18,
      status: 'draft',
      createdAt: '2024-12-16T15:30:00Z',
      updatedAt: '2024-12-17T10:15:00Z',
      assignedStudents: 0,
      completedStudents: 0,
      tags: ['орфоэпия', 'ударения', 'произношение'],
      isPublic: false
    },
    {
      id: 'custom-5',
      title: 'Комплексный тест - Итоговый',
      description: 'Итоговая проверка знаний по всем разделам',
      type: 'mixed',
      difficulty: 'hard',
      questionsCount: 40,
      timeLimit: 45,
      status: 'draft',
      createdAt: '2024-12-17T08:00:00Z',
      updatedAt: '2024-12-17T12:30:00Z',
      assignedStudents: 0,
      completedStudents: 0,
      tags: ['итоговый', 'комплексный', 'все разделы'],
      isPublic: false
    }
  ]
};

// GroupSettingsPanel component
const GroupSettingsPanel = ({ 
  settings, 
  moderators, 
  onSettingsChange, 
  onModeratorAction 
}: { 
  settings: GroupSettings;
  moderators: GroupModerator[];
  onSettingsChange: (settings: GroupSettings) => void;
  onModeratorAction: (action: string, moderatorId?: string) => void;
}) => {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">Основные</TabsTrigger>
          <TabsTrigger value="access">Доступ</TabsTrigger>
          <TabsTrigger value="notifications">Уведомления</TabsTrigger>
          <TabsTrigger value="advanced">Дополнительно</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Основная информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Название группы</label>
                <Input 
                  value={settings.general.name}
                  onChange={(e) => onSettingsChange({
                    ...settings,
                    general: { ...settings.general, name: e.target.value }
                  })}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Описание</label>
                <Input 
                  value={settings.general.description}
                  onChange={(e) => onSettingsChange({
                    ...settings,
                    general: { ...settings.general, description: e.target.value }
                  })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Категория</label>
                  <Select 
                    value={settings.general.category}
                    onValueChange={(value) => onSettingsChange({
                      ...settings,
                      general: { ...settings.general, category: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Русский язык">Русский язык</SelectItem>
                      <SelectItem value="Математика">Математика</SelectItem>
                      <SelectItem value="История">История</SelectItem>
                      <SelectItem value="Физика">Физика</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Часовой пояс</label>
                  <Select 
                    value={settings.general.timezone}
                    onValueChange={(value) => onSettingsChange({
                      ...settings,
                      general: { ...settings.general, timezone: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Europe/Moscow">Москва (UTC+3)</SelectItem>
                      <SelectItem value="Europe/Kiev">Киев (UTC+2)</SelectItem>
                      <SelectItem value="Asia/Almaty">Алматы (UTC+6)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Настройки доступа</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Публичная группа</p>
                  <p className="text-sm text-gray-600">Группа видна в поиске</p>
                </div>
                <Switch 
                  checked={settings.access.isPublic}
                  onCheckedChange={(checked) => onSettingsChange({
                    ...settings,
                    access: { ...settings.access, isPublic: checked }
                  })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Самостоятельная запись</p>
                  <p className="text-sm text-gray-600">Студенты могут присоединиться сами</p>
                </div>
                <Switch 
                  checked={settings.access.allowSelfEnrollment}
                  onCheckedChange={(checked) => onSettingsChange({
                    ...settings,
                    access: { ...settings.access, allowSelfEnrollment: checked }
                  })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Требовать одобрение</p>
                  <p className="text-sm text-gray-600">Модерация новых участников</p>
                </div>
                <Switch 
                  checked={settings.access.requireApproval}
                  onCheckedChange={(checked) => onSettingsChange({
                    ...settings,
                    access: { ...settings.access, requireApproval: checked }
                  })}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Максимум студентов</label>
                <Input 
                  type="number"
                  value={settings.access.maxStudents || ''}
                  onChange={(e) => onSettingsChange({
                    ...settings,
                    access: { ...settings.access, maxStudents: parseInt(e.target.value) || undefined }
                  })}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Код приглашения</label>
                <div className="flex space-x-2">
                  <Input 
                    value={settings.access.inviteCode || ''}
                    readOnly
                  />
                  <Button variant="outline" size="sm">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Уведомления</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email уведомления</p>
                  <p className="text-sm text-gray-600">Получать уведомления на почту</p>
                </div>
                <Switch 
                  checked={settings.notifications.emailNotifications}
                  onCheckedChange={(checked) => onSettingsChange({
                    ...settings,
                    notifications: { ...settings.notifications, emailNotifications: checked }
                  })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Push уведомления</p>
                  <p className="text-sm text-gray-600">Уведомления в браузере</p>
                </div>
                <Switch 
                  checked={settings.notifications.pushNotifications}
                  onCheckedChange={(checked) => onSettingsChange({
                    ...settings,
                    notifications: { ...settings.notifications, pushNotifications: checked }
                  })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Еженедельные отчеты</p>
                  <p className="text-sm text-gray-600">Сводка активности группы</p>
                </div>
                <Switch 
                  checked={settings.notifications.weeklyReports}
                  onCheckedChange={(checked) => onSettingsChange({
                    ...settings,
                    notifications: { ...settings.notifications, weeklyReports: checked }
                  })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Прогресс студентов</p>
                  <p className="text-sm text-gray-600">Уведомления о достижениях</p>
                </div>
                <Switch 
                  checked={settings.notifications.studentProgress}
                  onCheckedChange={(checked) => onSettingsChange({
                    ...settings,
                    notifications: { ...settings.notifications, studentProgress: checked }
                  })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Новые ответы</p>
                  <p className="text-sm text-gray-600">Уведомления о новых ответах</p>
                </div>
                <Switch 
                  checked={settings.notifications.newSubmissions}
                  onCheckedChange={(checked) => onSettingsChange({
                    ...settings,
                    notifications: { ...settings.notifications, newSubmissions: checked }
                  })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Дополнительные настройки</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Чат студентов</p>
                  <p className="text-sm text-gray-600">Разрешить общение между студентами</p>
                </div>
                <Switch 
                  checked={settings.advanced.allowStudentChat}
                  onCheckedChange={(checked) => onSettingsChange({
                    ...settings,
                    advanced: { ...settings.advanced, allowStudentChat: checked }
                  })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Таблица лидеров</p>
                  <p className="text-sm text-gray-600">Показывать рейтинг студентов</p>
                </div>
                <Switch 
                  checked={settings.advanced.showLeaderboard}
                  onCheckedChange={(checked) => onSettingsChange({
                    ...settings,
                    advanced: { ...settings.advanced, showLeaderboard: checked }
                  })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Пересдача тестов</p>
                  <p className="text-sm text-gray-600">Разрешить повторное прохождение</p>
                </div>
                <Switch 
                  checked={settings.advanced.allowRetakes}
                  onCheckedChange={(checked) => onSettingsChange({
                    ...settings,
                    advanced: { ...settings.advanced, allowRetakes: checked }
                  })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Автоматическая проверка</p>
                  <p className="text-sm text-gray-600">Автоматически оценивать ответы</p>
                </div>
                <Switch 
                  checked={settings.advanced.autoGrading}
                  onCheckedChange={(checked) => onSettingsChange({
                    ...settings,
                    advanced: { ...settings.advanced, autoGrading: checked }
                  })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Экспорт данных</p>
                  <p className="text-sm text-gray-600">Разрешить экспорт результатов</p>
                </div>
                <Switch 
                  checked={settings.advanced.exportData}
                  onCheckedChange={(checked) => onSettingsChange({
                    ...settings,
                    advanced: { ...settings.advanced, exportData: checked }
                  })}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Модераторы</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {moderators.map((moderator) => (
                  <div key={moderator.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={moderator.avatar} />
                        <AvatarFallback>{moderator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{moderator.name}</p>
                        <p className="text-sm text-gray-600">{moderator.email}</p>
                        <Badge variant={moderator.role === 'owner' ? 'default' : 'secondary'}>
                          {moderator.role === 'owner' ? 'Владелец' : moderator.role === 'admin' ? 'Администратор' : 'Модератор'}
                        </Badge>
                      </div>
                    </div>
                    {moderator.role !== 'owner' && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => onModeratorAction('edit', moderator.id)}>
                            Изменить права
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => onModeratorAction('remove', moderator.id)}
                            className="text-red-600"
                          >
                            Удалить
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                ))}
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => onModeratorAction('add')}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Добавить модератора
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Опасная зона</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Архивировать группу</p>
                  <p className="text-sm text-gray-600">Группа станет недоступна для студентов</p>
                </div>
                <Button variant="outline" onClick={() => onModeratorAction('archive')}>
                  <Archive className="h-4 w-4 mr-2" />
                  Архивировать
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-red-600">Удалить группу</p>
                  <p className="text-sm text-gray-600">Это действие нельзя отменить</p>
                </div>
                <Button variant="destructive" onClick={() => onModeratorAction('delete')}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Удалить
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};