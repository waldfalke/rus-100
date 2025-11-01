'use client';

import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Clock, 
  Users, 
  Target, 
  BookOpen, 
  Mic, 
  PenTool, 
  Eye,
  Play,
  Star,
  Trophy
} from "lucide-react";

interface NavLink {
  label: string;
  href: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  hidden?: 'lg' | 'always';
}

interface Test {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: string;
  questions: number;
  participants: number;
  rating: number;
  type: 'grammar' | 'vocabulary' | 'reading' | 'listening' | 'speaking' | 'writing';
}

export default function TestsPage() {
  const navLinks: NavLink[] = [
    { label: 'Главная', href: '/' },
    { label: 'Тесты', href: '/tests' },
    { label: 'Все группы', href: '/groups' },
    { label: 'Профиль', href: '/account' },
  ];

  const tests: Test[] = [
    {
      id: "1",
      title: "Падежи существительных",
      description: "Проверьте знание склонения существительных в русском языке",
      category: "Грамматика",
      difficulty: "medium",
      duration: "20 мин",
      questions: 25,
      participants: 1247,
      rating: 4.8,
      type: "grammar"
    },
    {
      id: "2",
      title: "Глаголы движения",
      description: "Тест на знание глаголов движения с приставками и без",
      category: "Грамматика",
      difficulty: "hard",
      duration: "30 мин",
      questions: 20,
      participants: 892,
      rating: 4.6,
      type: "grammar"
    },
    {
      id: "3",
      title: "Словарь: Семья и родственники",
      description: "Проверьте знание лексики по теме семьи",
      category: "Лексика",
      difficulty: "easy",
      duration: "15 мин",
      questions: 30,
      participants: 2156,
      rating: 4.9,
      type: "vocabulary"
    },
    {
      id: "4",
      title: "Понимание художественного текста",
      description: "Анализ отрывка из произведения русской литературы",
      category: "Чтение",
      difficulty: "hard",
      duration: "45 мин",
      questions: 15,
      participants: 634,
      rating: 4.7,
      type: "reading"
    },
    {
      id: "5",
      title: "Аудирование: Диалоги",
      description: "Понимание разговорной речи в различных ситуациях",
      category: "Аудирование",
      difficulty: "medium",
      duration: "25 мин",
      questions: 20,
      participants: 1089,
      rating: 4.5,
      type: "listening"
    },
    {
      id: "6",
      title: "Произношение: Ударения",
      description: "Правильная постановка ударений в словах",
      category: "Произношение",
      difficulty: "medium",
      duration: "18 мин",
      questions: 40,
      participants: 756,
      rating: 4.4,
      type: "speaking"
    },
    {
      id: "7",
      title: "Сочинение: Описание",
      description: "Написание описательного текста по заданной теме",
      category: "Письмо",
      difficulty: "hard",
      duration: "60 мин",
      questions: 1,
      participants: 423,
      rating: 4.3,
      type: "writing"
    },
    {
      id: "8",
      title: "Быстрый тест: Орфография",
      description: "Проверка знания правил русской орфографии",
      category: "Грамматика",
      difficulty: "easy",
      duration: "10 мин",
      questions: 50,
      participants: 3421,
      rating: 4.7,
      type: "grammar"
    }
  ];

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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'grammar': return <BookOpen className="h-5 w-5" />;
      case 'vocabulary': return <Target className="h-5 w-5" />;
      case 'reading': return <Eye className="h-5 w-5" />;
      case 'listening': return <Users className="h-5 w-5" />;
      case 'speaking': return <Mic className="h-5 w-5" />;
      case 'writing': return <PenTool className="h-5 w-5" />;
      default: return <BookOpen className="h-5 w-5" />;
    }
  };

  const filterTestsByCategory = (category: string) => {
    if (category === 'all') return tests;
    return tests.filter(test => test.category === category);
  };

  const TestCard = ({ test }: { test: Test }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getTypeIcon(test.type)}
              <CardTitle className="text-lg">{test.title}</CardTitle>
            </div>
            <CardDescription>{test.description}</CardDescription>
          </div>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-medium">{test.rating}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <Badge className={getDifficultyColor(test.difficulty)}>
            {getDifficultyText(test.difficulty)}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {test.duration}
          </Badge>
          <Badge variant="outline">{test.category}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{test.questions} вопросов</span>
            <span>{test.participants.toLocaleString()} участников</span>
          </div>
          <Button className="w-full">
            <Play className="h-4 w-4 mr-2" />
            Начать тест
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <PageLayout
      header={{
        userName: "Евгений",
        userEmail: "stribojich@gmail.com",
        navLinks: navLinks,
        onUserClick: () => {}
      }}
    >
      <div className="mb-8">
        <h1 className="font-source-serif-pro text-3xl font-bold text-foreground mb-2">
          Тесты
        </h1>
        <p className="text-muted-foreground">
          Проверьте свои знания русского языка с помощью разнообразных тестов
        </p>
      </div>

          {/* Статистика тестов */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{tests.length}</p>
                    <p className="text-sm text-muted-foreground">Доступных тестов</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Target className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-sm text-muted-foreground">Пройдено</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Trophy className="h-8 w-8 text-yellow-500" />
                  <div>
                    <p className="text-2xl font-bold">85%</p>
                    <p className="text-sm text-muted-foreground">Средний результат</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="text-2xl font-bold">6ч</p>
                    <p className="text-sm text-muted-foreground">Время тестирования</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Рекомендуемые тесты */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Рекомендуемые тесты</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tests.slice(0, 3).map(test => (
                <Card key={test.id} className="border-primary/20 bg-primary/5">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(test.type)}
                      <CardTitle className="text-base">{test.title}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getDifficultyColor(test.difficulty)}>
                        {getDifficultyText(test.difficulty)}
                      </Badge>
                      <Badge variant="outline">{test.duration}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button size="sm" className="w-full">
                      <Play className="h-3 w-3 mr-2" />
                      Начать
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Фильтры по категориям */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="all">Все</TabsTrigger>
              <TabsTrigger value="Грамматика">Грамматика</TabsTrigger>
              <TabsTrigger value="Лексика">Лексика</TabsTrigger>
              <TabsTrigger value="Чтение">Чтение</TabsTrigger>
              <TabsTrigger value="Аудирование">Аудирование</TabsTrigger>
              <TabsTrigger value="Произношение">Произношение</TabsTrigger>
              <TabsTrigger value="Письмо">Письмо</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tests.map(test => (
                  <TestCard key={test.id} test={test} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="Грамматика" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filterTestsByCategory('Грамматика').map(test => (
                  <TestCard key={test.id} test={test} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="Лексика" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filterTestsByCategory('Лексика').map(test => (
                  <TestCard key={test.id} test={test} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="Чтение" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filterTestsByCategory('Чтение').map(test => (
                  <TestCard key={test.id} test={test} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="Аудирование" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filterTestsByCategory('Аудирование').map(test => (
                  <TestCard key={test.id} test={test} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="Произношение" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filterTestsByCategory('Произношение').map(test => (
                  <TestCard key={test.id} test={test} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="Письмо" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filterTestsByCategory('Письмо').map(test => (
                  <TestCard key={test.id} test={test} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
    </PageLayout>
  );
}