'use client';

import { TopNavBlock } from "@/components/ui/TopNavBlock";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Clock, Star, CheckCircle, Circle, Play } from "lucide-react";

interface NavLink {
  label: string;
  href: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  hidden?: 'lg' | 'always';
}

interface Task {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: string;
  progress: number;
  completed: boolean;
  category: string;
}

export default function TasksPage() {
  const navLinks: NavLink[] = [
    { label: 'Главная', href: '/' },
    { label: 'Тесты', href: '/tests' },
    { label: 'Дашборд', href: '/dashboard' },
    { label: 'Профиль', href: '/account' },
  ];

  const tasks: Task[] = [
    {
      id: "1",
      title: "Склонение существительных",
      description: "Изучите правила склонения существительных в русском языке",
      difficulty: "medium",
      duration: "25 мин",
      progress: 100,
      completed: true,
      category: "Грамматика"
    },
    {
      id: "2", 
      title: "Глаголы движения",
      description: "Освойте использование глаголов движения с приставками",
      difficulty: "hard",
      duration: "40 мин",
      progress: 65,
      completed: false,
      category: "Грамматика"
    },
    {
      id: "3",
      title: "Словарь: Семья",
      description: "Выучите 30 новых слов по теме 'Семья и родственники'",
      difficulty: "easy",
      duration: "15 мин",
      progress: 0,
      completed: false,
      category: "Лексика"
    },
    {
      id: "4",
      title: "Чтение: Рассказ Чехова",
      description: "Прочитайте и проанализируйте рассказ А.П. Чехова",
      difficulty: "hard",
      duration: "60 мин",
      progress: 30,
      completed: false,
      category: "Чтение"
    },
    {
      id: "5",
      title: "Произношение: Твердые и мягкие согласные",
      description: "Отработайте произношение твердых и мягких согласных",
      difficulty: "medium",
      duration: "20 мин",
      progress: 0,
      completed: false,
      category: "Произношение"
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

  const filterTasksByCategory = (category: string) => {
    if (category === 'all') return tasks;
    return tasks.filter(task => task.category === category);
  };

  const TaskCard = ({ task }: { task: Task }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {task.completed ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
              <CardTitle className="text-lg">{task.title}</CardTitle>
            </div>
            <CardDescription>{task.description}</CardDescription>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <Badge className={getDifficultyColor(task.difficulty)}>
            {getDifficultyText(task.difficulty)}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {task.duration}
          </Badge>
          <Badge variant="outline">{task.category}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {task.progress > 0 && (
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Прогресс</span>
                <span>{task.progress}%</span>
              </div>
              <Progress value={task.progress} className="h-2" />
            </div>
          )}
          <div className="flex gap-2">
            {task.completed ? (
              <Button variant="outline" className="flex-1">
                <Star className="h-4 w-4 mr-2" />
                Повторить
              </Button>
            ) : (
              <Button className="flex-1">
                <Play className="h-4 w-4 mr-2" />
                {task.progress > 0 ? 'Продолжить' : 'Начать'}
              </Button>
            )}
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
              Задания
            </h1>
            <p className="text-muted-foreground">
              Выберите задание для изучения русского языка
            </p>
          </div>

          {/* Статистика заданий */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{tasks.length}</p>
                    <p className="text-sm text-muted-foreground">Всего заданий</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{tasks.filter(t => t.completed).length}</p>
                    <p className="text-sm text-muted-foreground">Завершено</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Play className="h-8 w-8 text-orange-500" />
                  <div>
                    <p className="text-2xl font-bold">{tasks.filter(t => t.progress > 0 && !t.completed).length}</p>
                    <p className="text-sm text-muted-foreground">В процессе</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Circle className="h-8 w-8 text-gray-500" />
                  <div>
                    <p className="text-2xl font-bold">{tasks.filter(t => t.progress === 0).length}</p>
                    <p className="text-sm text-muted-foreground">Не начато</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Фильтры по категориям */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all">Все</TabsTrigger>
              <TabsTrigger value="Грамматика">Грамматика</TabsTrigger>
              <TabsTrigger value="Лексика">Лексика</TabsTrigger>
              <TabsTrigger value="Чтение">Чтение</TabsTrigger>
              <TabsTrigger value="Произношение">Произношение</TabsTrigger>
              <TabsTrigger value="Письмо">Письмо</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="min-h-[400px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="Грамматика" className="mt-6">
              <div className="min-h-[400px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filterTasksByCategory('Грамматика').map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="Лексика" className="mt-6">
              <div className="min-h-[400px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filterTasksByCategory('Лексика').map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="Чтение" className="mt-6">
              <div className="min-h-[400px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filterTasksByCategory('Чтение').map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="Произношение" className="mt-6">
              <div className="min-h-[400px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filterTasksByCategory('Произношение').map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="Письмо" className="mt-6">
              <div className="min-h-[400px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filterTasksByCategory('Письмо').length > 0 ? (
                    filterTasksByCategory('Письмо').map(task => (
                      <TaskCard key={task.id} task={task} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <p className="text-muted-foreground text-lg">
                        Задания по письму скоро появятся
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}