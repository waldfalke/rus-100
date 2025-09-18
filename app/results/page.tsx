'use client';

import { useState } from "react";
import { TopNavBlock } from "@/components/ui/TopNavBlock";
import { StatisticsCard } from "@/components/ui/statistics-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Clock, 
  BookOpen, 
  Award,
  Calendar,
  BarChart3,
  Download,
  Filter,
  Search,
  Grid3X3,
  List,
  Eye,
  ChevronDown,
  Users,
  FileText
} from "lucide-react";

interface NavLink {
  label: string;
  href: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  hidden?: 'lg' | 'always';
}

// Обновленные типы данных согласно контракту RES-001
interface DetailedTestResult {
  id: string;
  testId: string;
  testName: string;
  studentId: string;
  studentName: string;
  groupId: string;
  groupName: string;
  completedAt: string;
  startedAt: string;
  duration: number; // в секундах
  score: number;
  maxScore: number;
  percentage: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  answers: TestAnswer[];
  timeSpent: number; // в секундах
  attempts: number;
  status: 'completed' | 'in_progress' | 'abandoned';
  tags: string[];
}

interface TestAnswer {
  questionId: string;
  questionText: string;
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
  points: number;
  maxPoints: number;
}

interface ResultsFilters {
  search: string;
  groupId: string | 'all';
  studentId: string | 'all';
  testId: string | 'all';
  category: string | 'all';
  difficulty: 'easy' | 'medium' | 'hard' | 'all';
  status: 'completed' | 'in_progress' | 'abandoned' | 'all';
  dateRange: {
    from: string;
    to: string;
  };
  scoreRange: {
    min: number;
    max: number;
  };
}

interface TestStatistics {
  testId: string;
  testName: string;
  totalAttempts: number;
  averageScore: number;
  averageTime: number;
  completionRate: number;
  difficultyDistribution: {
    easy: number;
    medium: number;
    hard: number;
  };
}

interface StudentStatistics {
  studentId: string;
  studentName: string;
  groupName: string;
  testsCompleted: number;
  averageScore: number;
  totalTimeSpent: number;
  strongCategories: string[];
  weakCategories: string[];
  progressTrend: 'improving' | 'stable' | 'declining';
}

type ViewMode = 'table' | 'cards' | 'analytics';

export default function ResultsPage() {
  // Состояние компонента
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [selectedResults, setSelectedResults] = useState<string[]>([]);
  const [filters, setFilters] = useState<ResultsFilters>({
    search: '',
    groupId: 'all',
    studentId: 'all',
    testId: 'all',
    category: 'all',
    difficulty: 'all',
    status: 'all',
    dateRange: {
      from: '',
      to: ''
    },
    scoreRange: {
      min: 0,
      max: 100
    }
  });

  const navLinks: NavLink[] = [
    { label: "Дашборд", href: "/dashboard" },
    { label: "Задания", href: "/tasks" },
    { label: "Результаты", href: "/results" },
    { label: "Тесты", href: "/tests" },
    { label: "Демо", href: "/demo" },
  ];

  // Моковые данные согласно контракту RES-001
  const testResults: DetailedTestResult[] = [
    {
      id: "1",
      testId: "test_1",
      testName: "Падежи существительных",
      studentId: "student_1",
      studentName: "Анна Петрова",
      groupId: "group_1",
      groupName: "Группа А1",
      completedAt: "2024-01-15T14:30:00Z",
      startedAt: "2024-01-15T14:15:00Z",
      duration: 900, // 15 минут
      score: 18,
      maxScore: 20,
      percentage: 90,
      category: "Грамматика",
      difficulty: "medium",
      answers: [],
      timeSpent: 900,
      attempts: 1,
      status: "completed",
      tags: ["падежи", "существительные"]
    },
    {
      id: "2",
      testId: "test_2",
      testName: "Глаголы движения",
      studentId: "student_2",
      studentName: "Иван Сидоров",
      groupId: "group_1",
      groupName: "Группа А1",
      completedAt: "2024-01-14T16:20:00Z",
      startedAt: "2024-01-14T16:00:00Z",
      duration: 1200, // 20 минут
      score: 14,
      maxScore: 20,
      percentage: 70,
      category: "Грамматика",
      difficulty: "hard",
      answers: [],
      timeSpent: 1200,
      attempts: 2,
      status: "completed",
      tags: ["глаголы", "движение"]
    },
    {
      id: "3",
      testId: "test_3",
      testName: "Лексика: Семья",
      studentId: "student_3",
      studentName: "Мария Козлова",
      groupId: "group_2",
      groupName: "Группа А2",
      completedAt: "2024-01-13T10:10:00Z",
      startedAt: "2024-01-13T10:00:00Z",
      duration: 600, // 10 минут
      score: 28,
      maxScore: 30,
      percentage: 93,
      category: "Лексика",
      difficulty: "easy",
      answers: [],
      timeSpent: 600,
      attempts: 1,
      status: "completed",
      tags: ["семья", "родственники"]
    },
    {
      id: "4",
      testId: "test_4",
      testName: "Понимание текста",
      studentId: "student_1",
      studentName: "Анна Петрова",
      groupId: "group_1",
      groupName: "Группа А1",
      completedAt: "2024-01-12T11:25:00Z",
      startedAt: "2024-01-12T11:00:00Z",
      duration: 1500, // 25 минут
      score: 16,
      maxScore: 20,
      percentage: 80,
      category: "Чтение",
      difficulty: "medium",
      answers: [],
      timeSpent: 1500,
      attempts: 1,
      status: "completed",
      tags: ["чтение", "понимание"]
    },
    {
      id: "5",
      testId: "test_5",
      testName: "Произношение",
      studentId: "student_4",
      studentName: "Дмитрий Волков",
      groupId: "group_2",
      groupName: "Группа А2",
      completedAt: "2024-01-11T15:12:00Z",
      startedAt: "2024-01-11T15:00:00Z",
      duration: 720, // 12 минут
      score: 22,
      maxScore: 25,
      percentage: 88,
      category: "Произношение",
      difficulty: "easy",
      answers: [],
      timeSpent: 720,
      attempts: 1,
      status: "completed",
      tags: ["произношение", "фонетика"]
    }
  ];

  const testStatistics: TestStatistics[] = [
    {
      testId: "test_1",
      testName: "Падежи существительных",
      totalAttempts: 45,
      averageScore: 82,
      averageTime: 900,
      completionRate: 95,
      difficultyDistribution: { easy: 10, medium: 25, hard: 10 }
    },
    {
      testId: "test_2",
      testName: "Глаголы движения",
      totalAttempts: 32,
      averageScore: 68,
      averageTime: 1200,
      completionRate: 87,
      difficultyDistribution: { easy: 5, medium: 15, hard: 12 }
    }
  ];

  const studentStatistics: StudentStatistics[] = [
    {
      studentId: "student_1",
      studentName: "Анна Петрова",
      groupName: "Группа А1",
      testsCompleted: 12,
      averageScore: 85,
      totalTimeSpent: 14400, // 4 часа
      strongCategories: ["Лексика", "Чтение"],
      weakCategories: ["Произношение"],
      progressTrend: "improving"
    },
    {
      studentId: "student_2",
      studentName: "Иван Сидоров",
      groupName: "Группа А1",
      testsCompleted: 8,
      averageScore: 72,
      totalTimeSpent: 9600, // 2.7 часа
      strongCategories: ["Грамматика"],
      weakCategories: ["Лексика", "Произношение"],
      progressTrend: "stable"
    }
  ];

  // Вспомогательные функции
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Легко';
      case 'medium': return 'Средне';
      case 'hard': return 'Сложно';
      default: return difficulty;
    }
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'abandoned': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Завершен';
      case 'in_progress': return 'В процессе';
      case 'abandoned': return 'Прерван';
      default: return status;
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes > 0) {
      return `${minutes} мин ${remainingSeconds > 0 ? remainingSeconds + ' сек' : ''}`;
    }
    return `${remainingSeconds} сек`;
  };

  const calculateAverageScore = () => {
    const total = testResults.reduce((sum, result) => sum + result.percentage, 0);
    return Math.round(total / testResults.length);
  };

  // Фильтрация результатов
  const filteredResults = testResults.filter(result => {
    if (filters.search && !result.testName.toLowerCase().includes(filters.search.toLowerCase()) &&
        !result.studentName.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.groupId !== 'all' && result.groupId !== filters.groupId) return false;
    if (filters.studentId !== 'all' && result.studentId !== filters.studentId) return false;
    if (filters.testId !== 'all' && result.testId !== filters.testId) return false;
    if (filters.category !== 'all' && result.category !== filters.category) return false;
    if (filters.difficulty !== 'all' && result.difficulty !== filters.difficulty) return false;
    if (filters.status !== 'all' && result.status !== filters.status) return false;
    if (result.percentage < filters.scoreRange.min || result.percentage > filters.scoreRange.max) return false;
    
    return true;
  });

  // Компоненты
  const ResultsHeader = () => (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="font-source-serif-pro text-3xl font-bold text-foreground mb-2">
          Результаты тестирования
        </h1>
        <p className="text-muted-foreground">
          Детальный анализ результатов тестов учеников
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Экспорт
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Фильтры
        </Button>
      </div>
    </div>
  );

  const ViewModeSelector = () => (
    <div className="flex items-center gap-2 mb-4">
      <Button
        variant={viewMode === 'cards' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setViewMode('cards')}
        className="flex items-center gap-2"
      >
        <Grid3X3 className="h-4 w-4" />
        Карточки
      </Button>
      <Button
        variant={viewMode === 'table' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setViewMode('table')}
        className="flex items-center gap-2"
      >
        <List className="h-4 w-4" />
        Таблица
      </Button>
      <Button
        variant={viewMode === 'analytics' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setViewMode('analytics')}
        className="flex items-center gap-2"
      >
        <BarChart3 className="h-4 w-4" />
        Аналитика
      </Button>
    </div>
  );

  const ResultsFiltersPanel = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Фильтры
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Поиск</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по тесту или ученику..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Категория</label>
            <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Все категории" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все категории</SelectItem>
                <SelectItem value="Грамматика">Грамматика</SelectItem>
                <SelectItem value="Лексика">Лексика</SelectItem>
                <SelectItem value="Чтение">Чтение</SelectItem>
                <SelectItem value="Произношение">Произношение</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Сложность</label>
            <Select value={filters.difficulty} onValueChange={(value) => setFilters(prev => ({ ...prev, difficulty: value as any }))}>
              <SelectTrigger>
                <SelectValue placeholder="Все уровни" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все уровни</SelectItem>
                <SelectItem value="easy">Легко</SelectItem>
                <SelectItem value="medium">Средне</SelectItem>
                <SelectItem value="hard">Сложно</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Статус</label>
            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value as any }))}>
              <SelectTrigger>
                <SelectValue placeholder="Все статусы" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="completed">Завершен</SelectItem>
                <SelectItem value="in_progress">В процессе</SelectItem>
                <SelectItem value="abandoned">Прерван</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ResultCard = ({ result }: { result: DetailedTestResult }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{result.testName}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Users className="h-4 w-4" />
              {result.studentName} • {result.groupName}
            </CardDescription>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Calendar className="h-4 w-4" />
              {new Date(result.completedAt).toLocaleDateString('ru-RU')}
            </CardDescription>
          </div>
          <div className={`text-2xl font-bold ${getScoreColor(result.percentage)}`}>
            {result.score}/{result.maxScore}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <Badge className={getDifficultyColor(result.difficulty)}>
            {getDifficultyText(result.difficulty)}
          </Badge>
          <Badge className={getStatusColor(result.status)}>
            {getStatusText(result.status)}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDuration(result.timeSpent)}
          </Badge>
          <Badge variant="outline">{result.category}</Badge>
          {result.attempts > 1 && (
            <Badge variant="secondary">
              Попытка {result.attempts}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Результат</span>
              <span>{result.percentage}%</span>
            </div>
            <Progress value={result.percentage} className="h-2" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Подробнее
            </Button>
            <Checkbox
              checked={selectedResults.includes(result.id)}
              onCheckedChange={(checked) => {
                if (checked) {
                  setSelectedResults(prev => [...prev, result.id]);
                } else {
                  setSelectedResults(prev => prev.filter(id => id !== result.id));
                }
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="font-sans min-h-screen bg-background flex flex-col">
      <TopNavBlock 
        userName="Евгений" 
        userEmail="stribojich@gmail.com" 
        navLinks={navLinks}
        onUserClick={() => {}} 
      />

      <main className="flex-grow pb-20">
        <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="font-source-serif-pro text-3xl font-bold text-foreground mb-2">
              Результаты
            </h1>
            <p className="text-muted-foreground">
              Анализ вашего прогресса и достижений в изучении русского языка
            </p>
          </div>

          {/* Общая статистика */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatisticsCard
              data={{
                id: "1",
                questionNumber: "№1",
                title: "Средний балл",
                completedWorkouts: calculateAverageScore(),
                averageScore: calculateAverageScore(),
                changePercent: 5,
                level: 3
              }}
            />
            <StatisticsCard
              data={{
                id: "2",
                questionNumber: "№2",
                title: "Тестов пройдено",
                completedWorkouts: testResults.length,
                averageScore: 75,
                changePercent: 2,
                level: 2
              }}
            />
            <StatisticsCard
              data={{
                id: "3",
                questionNumber: "№3",
                title: "Время изучения",
                completedWorkouts: 47,
                averageScore: 68,
                changePercent: 8,
                level: 2
              }}
            />
            <StatisticsCard
              data={{
                id: "4",
                questionNumber: "№4",
                title: "Достижения",
                completedWorkouts: achievements.length,
                averageScore: 45,
                changePercent: 1,
                level: 1
              }}
            />
          </div>

          <Tabs defaultValue="tests" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tests">Результаты тестов</TabsTrigger>
              <TabsTrigger value="achievements">Достижения</TabsTrigger>
              <TabsTrigger value="analytics">Аналитика</TabsTrigger>
            </TabsList>

            <TabsContent value="tests" className="mt-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Последние результаты</h2>
                  <Button variant="outline">
                    Экспорт результатов
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {testResults.map(result => (
                    <TestResultCard key={result.id} result={result} />
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="mt-6">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Ваши достижения</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {achievements.map(achievement => (
                    <Card key={achievement.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start gap-3">
                          <div className="text-3xl">{achievement.icon}</div>
                          <div className="flex-1">
                            <CardTitle className="text-lg">{achievement.title}</CardTitle>
                            <CardDescription className="mt-1">
                              {achievement.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {new Date(achievement.date).toLocaleDateString('ru-RU')}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Аналитика прогресса</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Прогресс по категориям</CardTitle>
                      <CardDescription>
                        Ваши результаты в разных областях изучения
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Грамматика</span>
                            <span>80%</span>
                          </div>
                          <Progress value={80} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Лексика</span>
                            <span>93%</span>
                          </div>
                          <Progress value={93} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Чтение</span>
                            <span>80%</span>
                          </div>
                          <Progress value={80} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Произношение</span>
                            <span>88%</span>
                          </div>
                          <Progress value={88} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Тенденции</CardTitle>
                      <CardDescription>
                        Изменения в ваших результатах за последний месяц
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <TrendingUp className="h-5 w-5 text-green-500" />
                            <div>
                              <p className="font-medium">Средний балл</p>
                              <p className="text-sm text-muted-foreground">+5% за неделю</p>
                            </div>
                          </div>
                          <div className="text-green-600 font-semibold">↗ 85%</div>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <TrendingUp className="h-5 w-5 text-green-500" />
                            <div>
                              <p className="font-medium">Время изучения</p>
                              <p className="text-sm text-muted-foreground">+2ч за неделю</p>
                            </div>
                          </div>
                          <div className="text-green-600 font-semibold">↗ 8ч</div>
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <TrendingDown className="h-5 w-5 text-red-500" />
                            <div>
                              <p className="font-medium">Ошибки</p>
                              <p className="text-sm text-muted-foreground">-15% за неделю</p>
                            </div>
                          </div>
                          <div className="text-red-600 font-semibold">↘ 12%</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}