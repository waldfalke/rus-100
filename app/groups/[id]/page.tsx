'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
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
  Clock,
  Star,
  ChevronLeft,
  Edit,
  Archive,
  Trash2,
  Copy
} from 'lucide-react';

// Типы данных согласно контракту GRP-001
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
                Архивировать
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('delete')} className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Удалить
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-sm text-muted-foreground">Всего учеников</p>
              <p className="text-2xl font-bold">{stats.totalStudents}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-sm text-muted-foreground">Активные</p>
              <p className="text-2xl font-bold">{stats.activeStudents}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-purple-600" />
            <div>
              <p className="text-sm text-muted-foreground">Средний прогресс</p>
              <p className="text-2xl font-bold">{stats.averageProgress}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-orange-600" />
            <div>
              <p className="text-sm text-muted-foreground">Тесты выполнено</p>
              <p className="text-2xl font-bold">{stats.completedTests}/{stats.totalTests}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-600" />
            <div>
              <p className="text-sm text-muted-foreground">Средний балл</p>
              <p className="text-2xl font-bold">{stats.averageScore}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-gray-600" />
            <div>
              <p className="text-sm text-muted-foreground">Настройки</p>
              <Button variant="ghost" size="sm" className="p-0 h-auto">
                Управление
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
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
      case 'active': return 'text-green-600 bg-green-50';
      case 'inactive': return 'text-gray-600 bg-gray-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={() => onSelect(student.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarImage src={student.avatar} />
            <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-medium truncate">{student.name}</h3>
              <Badge variant="secondary" className={getStatusColor(student.status)}>
                {student.status === 'active' ? 'Активен' : 
                 student.status === 'pending' ? 'Ожидает' : 'Неактивен'}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground truncate mb-2">{student.email}</p>
            
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Прогресс</span>
                  <span>{student.progress}%</span>
                </div>
                <Progress value={student.progress} className="h-2" />
              </div>
              
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Тестов: {student.testsCompleted}</span>
                <span>Балл: {student.averageScore}</span>
              </div>
              
              {student.lastActivity && (
                <p className="text-xs text-muted-foreground">
                  Активность: {new Date(student.lastActivity).toLocaleDateString('ru-RU')}
                </p>
              )}
            </div>
            
            {student.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {student.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {student.tags.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{student.tags.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Основной компонент страницы группы
export default function GroupPage() {
  const params = useParams();
  const groupId = params.id as string;
  
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
          <TabsTrigger value="students">Ученики</TabsTrigger>
          <TabsTrigger value="tests">Тесты</TabsTrigger>
          <TabsTrigger value="analytics">Аналитика</TabsTrigger>
          <TabsTrigger value="settings">Настройки</TabsTrigger>
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
        
        <TabsContent value="tests">
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Тесты группы</h3>
            <p className="text-muted-foreground">
              Здесь будут отображаться тесты, назначенные группе
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="text-center py-12">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Аналитика группы</h3>
            <p className="text-muted-foreground">
              Здесь будет отображаться детальная аналитика прогресса группы
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="text-center py-12">
            <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Настройки группы</h3>
            <p className="text-muted-foreground">
              Здесь будут настройки группы и управление доступом
            </p>
          </div>
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