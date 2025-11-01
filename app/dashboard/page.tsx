'use client';

import { useState, useEffect } from "react";
import { TopNavBlock } from "@/components/ui/TopNavBlock";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  Users, 
  Folder, 
  Calendar, 
  TrendingUp,
  Eye,
  Edit,
  Archive,
  Copy,
  Download
} from "lucide-react";

// Типы данных согласно контракту DSH-001
type GroupStatus = 'active' | 'archived' | 'draft';

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  action: 'view' | 'edit' | 'archive' | 'duplicate' | 'export';
  disabled?: boolean;
}

interface GroupCardData {
  id: string;
  name: string;
  description?: string;
  studentCount: number;
  folderCount: number;
  displayedFolderCount: number;
  status: GroupStatus;
  createdAt: string;
  lastActivity?: string;
  isOwner: boolean;
  quickActions: QuickAction[];
}

interface GroupFilters {
  search: string;
  status: GroupStatus | 'all';
  sortBy: 'name' | 'created' | 'activity' | 'students';
  sortOrder: 'asc' | 'desc';
  showArchived: boolean;
}

interface DashboardStats {
  totalGroups: number;
  activeGroups: number;
  totalStudents: number;
  totalTests: number;
  recentActivity: number;
}

interface NavLink {
  label: string;
  href: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  hidden?: 'lg' | 'always';
}

// Компонент статистики
function DashboardStats({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Всего групп</p>
              <p className="text-2xl font-bold">{stats.totalGroups}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Активных групп</p>
              <p className="text-2xl font-bold">{stats.activeGroups}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Всего учеников</p>
              <p className="text-2xl font-bold">{stats.totalStudents}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Folder className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Всего тестов</p>
              <p className="text-2xl font-bold">{stats.totalTests}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Активность (7 дней)</p>
              <p className="text-2xl font-bold">{stats.recentActivity}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Компонент панели фильтров
function GroupsFilterBar({ 
  filters, 
  onFiltersChange 
}: { 
  filters: GroupFilters; 
  onFiltersChange: (filters: GroupFilters) => void;
}) {
  return (
    <div className="bg-white p-6 rounded-lg border mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Поиск групп..."
              value={filters.search}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select 
          value={filters.status} 
          onValueChange={(value) => onFiltersChange({ ...filters, status: value as GroupStatus | 'all' })}
        >
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue placeholder="Статус" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="active">Активные</SelectItem>
            <SelectItem value="draft">Черновики</SelectItem>
            <SelectItem value="archived">Архивные</SelectItem>
          </SelectContent>
        </Select>
        
        <Select 
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onValueChange={(value) => {
            const [sortBy, sortOrder] = value.split('-');
            onFiltersChange({ 
              ...filters, 
              sortBy: sortBy as GroupFilters['sortBy'], 
              sortOrder: sortOrder as 'asc' | 'desc' 
            });
          }}
        >
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue placeholder="Сортировка" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name-asc">Название (А-Я)</SelectItem>
            <SelectItem value="name-desc">Название (Я-А)</SelectItem>
            <SelectItem value="created-desc">Новые первые</SelectItem>
            <SelectItem value="created-asc">Старые первые</SelectItem>
            <SelectItem value="activity-desc">По активности</SelectItem>
            <SelectItem value="students-desc">По количеству учеников</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="show-archived"
            checked={filters.showArchived}
            onCheckedChange={(checked) => onFiltersChange({ ...filters, showArchived: checked })}
          />
          <label htmlFor="show-archived" className="text-sm font-medium">
            Показать архивные
          </label>
        </div>
      </div>
    </div>
  );
}

// Компонент карточки группы
function GroupCard({ 
  group, 
  onAction 
}: { 
  group: GroupCardData; 
  onAction: (action: string, groupId: string) => void;
}) {
  const getStatusColor = (status: GroupStatus) => {
    switch (status) {
      case 'active': return 'border-l-green-500 bg-green-50';
      case 'archived': return 'border-l-gray-400 bg-gray-50';
      case 'draft': return 'border-l-yellow-500 bg-yellow-50';
      default: return 'border-l-gray-300';
    }
  };

  const getStatusBadge = (status: GroupStatus) => {
    switch (status) {
      case 'active': return <Badge variant="default" className="bg-green-100 text-green-800">Активная</Badge>;
      case 'archived': return <Badge variant="secondary">Архивная</Badge>;
      case 'draft': return <Badge variant="outline" className="border-yellow-500 text-yellow-700">Черновик</Badge>;
    }
  };

  return (
    <Card className={`border-l-4 ${getStatusColor(group.status)} hover:shadow-md transition-shadow cursor-pointer`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold mb-1">{group.name}</CardTitle>
            {group.description && (
              <CardDescription className="text-sm">{group.description}</CardDescription>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onAction('view', group.id)}>
                <Eye className="h-4 w-4 mr-2" />
                Просмотр
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('edit', group.id)}>
                <Edit className="h-4 w-4 mr-2" />
                Редактировать
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('duplicate', group.id)}>
                <Copy className="h-4 w-4 mr-2" />
                Дублировать
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('export', group.id)}>
                <Download className="h-4 w-4 mr-2" />
                Экспорт
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('archive', group.id)}>
                <Archive className="h-4 w-4 mr-2" />
                {group.status === 'archived' ? 'Восстановить' : 'Архивировать'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex justify-between items-center mt-2">
          {getStatusBadge(group.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-1" />
              {group.studentCount} учеников
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Folder className="h-4 w-4 mr-1" />
              {group.folderCount} папок
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            <div>Создана: {new Date(group.createdAt).toLocaleDateString('ru-RU')}</div>
            {group.lastActivity && (
              <div>Активность: {new Date(group.lastActivity).toLocaleDateString('ru-RU')}</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Компонент сетки групп
function GroupsGrid({ 
  groups, 
  isLoading, 
  error,
  onAction 
}: { 
  groups: GroupCardData[]; 
  isLoading: boolean; 
  error?: string;
  onAction: (action: string, groupId: string) => void;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Произошла ошибка при загрузке групп</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Попробовать снова
        </Button>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Нет групп</h3>
        <p className="text-muted-foreground mb-4">
          Создайте свою первую группу для начала работы
        </p>
        <Button onClick={() => onAction('create', '')}>
          <Plus className="h-4 w-4 mr-2" />
          Создать группу
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {groups.map((group) => (
        <GroupCard 
          key={group.id} 
          group={group} 
          onAction={onAction}
        />
      ))}
    </div>
  );
}

// Основной компонент страницы
export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [stats, setStats] = useState<DashboardStats>({
    totalGroups: 0,
    activeGroups: 0,
    totalStudents: 0,
    totalTests: 0,
    recentActivity: 0
  });
  const [groups, setGroups] = useState<GroupCardData[]>([]);
  const [filters, setFilters] = useState<GroupFilters>({
    search: '',
    status: 'all',
    sortBy: 'created',
    sortOrder: 'desc',
    showArchived: false
  });

  const navLinks: NavLink[] = [
    { label: 'Главная', href: '/' },
    { label: 'Тесты', href: '/tests' },
    { label: 'Все группы', href: '/groups' },
    { label: 'Профиль', href: '/account' },
  ];

  // Моковые данные для демонстрации
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Симуляция загрузки данных
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setStats({
          totalGroups: 12,
          activeGroups: 8,
          totalStudents: 247,
          totalTests: 156,
          recentActivity: 34
        });

        setGroups([
          {
            id: '1',
            name: '10А класс',
            description: 'Основная группа 10А класса для подготовки к ЕГЭ',
            studentCount: 28,
            folderCount: 12,
            displayedFolderCount: 8,
            status: 'active',
            createdAt: '2024-09-01T00:00:00Z',
            lastActivity: '2024-12-20T10:30:00Z',
            isOwner: true,
            quickActions: []
          },
          {
            id: '2',
            name: '11Б класс',
            description: 'Интенсивная подготовка к ЕГЭ по русскому языку',
            studentCount: 24,
            folderCount: 15,
            displayedFolderCount: 10,
            status: 'active',
            createdAt: '2024-09-01T00:00:00Z',
            lastActivity: '2024-12-19T14:15:00Z',
            isOwner: true,
            quickActions: []
          },
          {
            id: '3',
            name: 'Дополнительные занятия',
            description: 'Группа для дополнительных занятий по сложным темам',
            studentCount: 15,
            folderCount: 8,
            displayedFolderCount: 6,
            status: 'active',
            createdAt: '2024-10-15T00:00:00Z',
            lastActivity: '2024-12-18T16:45:00Z',
            isOwner: true,
            quickActions: []
          },
          {
            id: '4',
            name: 'Черновик новой группы',
            description: 'Подготовка материалов для новой группы',
            studentCount: 0,
            folderCount: 3,
            displayedFolderCount: 2,
            status: 'draft',
            createdAt: '2024-12-15T00:00:00Z',
            isOwner: true,
            quickActions: []
          }
        ]);
      } catch (err) {
        setError('Ошибка загрузки данных');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleAction = (action: string, groupId: string) => {
    console.log(`Action: ${action}, Group ID: ${groupId}`);
    // Здесь будет логика обработки действий
  };

  const handleCreateGroup = () => {
    console.log('Creating new group');
    // Здесь будет логика создания группы
  };

  // Фильтрация и сортировка групп
  const filteredGroups = groups
    .filter(group => {
      if (filters.search && !group.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.status !== 'all' && group.status !== filters.status) {
        return false;
      }
      if (!filters.showArchived && group.status === 'archived') {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (filters.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'created':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'activity':
          const aActivity = a.lastActivity ? new Date(a.lastActivity).getTime() : 0;
          const bActivity = b.lastActivity ? new Date(b.lastActivity).getTime() : 0;
          comparison = aActivity - bActivity;
          break;
        case 'students':
          comparison = a.studentCount - b.studentCount;
          break;
      }
      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

  return (
    <div className="font-sans min-h-screen bg-background flex flex-col">
      <TopNavBlock 
        userName="Евгений" 
        userEmail="stribojich@gmail.com" 
        navLinks={navLinks}
        onUserClick={() => {}} 
      />

      <main className="flex-grow pb-20">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="font-source-serif-pro text-3xl font-bold text-foreground mb-2">
                Мои группы
              </h1>
              <p className="text-muted-foreground">
                Управление группами учеников и их прогрессом
              </p>
            </div>
            <Button onClick={handleCreateGroup} size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Создать группу
            </Button>
          </div>

          {/* Статистика */}
          <DashboardStats stats={stats} />

          {/* Фильтры */}
          <GroupsFilterBar 
            filters={filters} 
            onFiltersChange={setFilters} 
          />

          {/* Сетка групп */}
          <GroupsGrid 
            groups={filteredGroups}
            isLoading={isLoading}
            error={error}
            onAction={handleAction}
          />
        </div>
      </main>
    </div>
  );
}