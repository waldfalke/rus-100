'use client';

import { useState, useEffect } from "react";
import { TopNavBlock } from "@/components/ui/TopNavBlock";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  MessageSquare, 
  Filter, 
  Search, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Flag, 
  Star, 
  Eye, 
  Bell,
  Settings,
  Download,
  MoreHorizontal,
  ThumbsUp,
  MessageCircle,
  Calendar,
  Users,
  FileText,
  AlertTriangle,
  TrendingUp,
  BarChart3
} from "lucide-react";

interface NavLink {
  label: string;
  href: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  hidden?: 'lg' | 'always';
}

// Types from ANS-001 contract
type AnswerType = 'multiple_choice' | 'text' | 'essay' | 'matching' | 'drag_drop' | 'audio' | 'file_upload';
type ModerationStatus = 'pending' | 'approved' | 'rejected' | 'flagged' | 'needs_review';
type ActivityType = 'answer_submitted' | 'answer_updated' | 'answer_graded' | 'feedback_given' | 'test_completed' | 'test_started';

interface StudentAnswer {
  id: string;
  questionId: string;
  questionText: string;
  questionType: AnswerType;
  testId: string;
  testName: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  groupId: string;
  groupName: string;
  
  answerContent: {
    text?: string;
    selectedOptions?: string[];
    files?: {
      id: string;
      name: string;
      url: string;
      type: string;
      size: number;
    }[];
    audioUrl?: string;
    metadata?: Record<string, any>;
  };
  
  correctAnswer?: {
    text?: string;
    options?: string[];
    explanation?: string;
  };
  
  isCorrect?: boolean;
  score?: number;
  maxScore: number;
  feedback?: string;
  autoGraded: boolean;
  
  submittedAt: string;
  gradedAt?: string;
  lastModifiedAt: string;
  
  moderationStatus: ModerationStatus;
  moderatedBy?: string;
  moderationNotes?: string;
  flagReason?: string;
  
  attemptNumber: number;
  timeSpent: number;
  ipAddress?: string;
  userAgent?: string;
  tags: string[];
  
  viewCount: number;
  likeCount: number;
  commentCount: number;
}

interface FeedActivity {
  id: string;
  type: ActivityType;
  timestamp: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  groupId: string;
  groupName: string;
  
  answerId?: string;
  testId?: string;
  testName?: string;
  questionId?: string;
  
  content: {
    title: string;
    description: string;
    preview?: string;
    score?: number;
    isCorrect?: boolean;
  };
  
  isHighlighted: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  readBy: string[];
}

interface AnswerComment {
  id: string;
  answerId: string;
  authorId: string;
  authorName: string;
  authorRole: 'teacher' | 'student' | 'admin';
  content: string;
  createdAt: string;
  updatedAt?: string;
  isPrivate: boolean;
  parentCommentId?: string;
  reactions: {
    type: 'like' | 'helpful' | 'question';
    count: number;
    userIds: string[];
  }[];
}

interface FeedFilters {
  timeRange: {
    from: string;
    to: string;
  };
  groups: string[];
  students: string[];
  tests: string[];
  questionTypes: AnswerType[];
  moderationStatus: ModerationStatus | 'all';
  activityTypes: ActivityType[];
  correctnessFilter: 'all' | 'correct' | 'incorrect' | 'ungraded';
  scoreRange: [number, number];
  tags: string[];
  searchQuery: string;
  sortBy: 'timestamp' | 'score' | 'student' | 'test' | 'priority';
  sortOrder: 'asc' | 'desc';
  showOnlyFlagged: boolean;
  showOnlyUngraded: boolean;
}

interface FeedDisplaySettings {
  viewMode: 'compact' | 'detailed' | 'cards';
  itemsPerPage: number;
  autoRefresh: boolean;
  refreshInterval: number;
  showPreviews: boolean;
  showScores: boolean;
  showTimestamps: boolean;
  groupByTest: boolean;
  highlightNewItems: boolean;
  enableNotifications: boolean;
}

interface FeedStatistics {
  totalAnswers: number;
  pendingModeration: number;
  averageScore: number;
  activeStudents: number;
  recentActivity: number;
}

export default function AnswersFeedPage() {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<StudentAnswer | null>(null);
  const [filters, setFilters] = useState<FeedFilters>({
    timeRange: { from: '', to: '' },
    groups: [],
    students: [],
    tests: [],
    questionTypes: [],
    moderationStatus: 'all',
    activityTypes: [],
    correctnessFilter: 'all',
    scoreRange: [0, 100],
    tags: [],
    searchQuery: '',
    sortBy: 'timestamp',
    sortOrder: 'desc',
    showOnlyFlagged: false,
    showOnlyUngraded: false
  });
  const [displaySettings, setDisplaySettings] = useState<FeedDisplaySettings>({
    viewMode: 'cards',
    itemsPerPage: 20,
    autoRefresh: true,
    refreshInterval: 30,
    showPreviews: true,
    showScores: true,
    showTimestamps: true,
    groupByTest: false,
    highlightNewItems: true,
    enableNotifications: true
  });

  // Mock data
  const navLinks: NavLink[] = [
    { label: 'Главная', href: '/' },
    { label: 'Тесты', href: '/tests' },
    { label: 'Все группы', href: '/groups' },
    { label: 'Профиль', href: '/account' },
  ];

  const mockStatistics: FeedStatistics = {
    totalAnswers: 1247,
    pendingModeration: 23,
    averageScore: 78.5,
    activeStudents: 156,
    recentActivity: 12
  };

  const mockAnswers: StudentAnswer[] = [
    {
      id: "ans-001",
      questionId: "q-001",
      questionText: "Какое из слов является синонимом к слову 'красивый'?",
      questionType: "multiple_choice",
      testId: "test-001",
      testName: "Синонимы и антонимы",
      studentId: "student-001",
      studentName: "Анна Петрова",
      studentAvatar: "/placeholder-user.jpg",
      groupId: "group-001",
      groupName: "10А класс",
      answerContent: {
        selectedOptions: ["прекрасный"]
      },
      correctAnswer: {
        options: ["прекрасный", "великолепный"],
        explanation: "Синонимы - это слова с похожим значением"
      },
      isCorrect: true,
      score: 5,
      maxScore: 5,
      feedback: "Отличный ответ!",
      autoGraded: true,
      submittedAt: "2025-01-25T10:30:00Z",
      gradedAt: "2025-01-25T10:30:05Z",
      lastModifiedAt: "2025-01-25T10:30:00Z",
      moderationStatus: "approved",
      attemptNumber: 1,
      timeSpent: 45,
      tags: ["синонимы", "лексика"],
      viewCount: 3,
      likeCount: 2,
      commentCount: 1
    },
    {
      id: "ans-002",
      questionId: "q-002",
      questionText: "Напишите эссе на тему 'Роль литературы в современном мире' (не менее 200 слов)",
      questionType: "essay",
      testId: "test-002",
      testName: "Литературное эссе",
      studentId: "student-002",
      studentName: "Михаил Иванов",
      studentAvatar: "/placeholder-user.jpg",
      groupId: "group-001",
      groupName: "10А класс",
      answerContent: {
        text: "Литература играет важную роль в современном мире. Она помогает нам понять человеческую природу, развивает эмпатию и критическое мышление. В эпоху цифровых технологий литература остается источником глубоких размышлений о жизни..."
      },
      maxScore: 20,
      autoGraded: false,
      submittedAt: "2025-01-25T09:15:00Z",
      lastModifiedAt: "2025-01-25T09:15:00Z",
      moderationStatus: "pending",
      attemptNumber: 1,
      timeSpent: 1800,
      tags: ["эссе", "литература"],
      viewCount: 1,
      likeCount: 0,
      commentCount: 0
    },
    {
      id: "ans-003",
      questionId: "q-003",
      questionText: "Определите падеж выделенного слова в предложении",
      questionType: "text",
      testId: "test-003",
      testName: "Падежи в русском языке",
      studentId: "student-003",
      studentName: "Елена Сидорова",
      studentAvatar: "/placeholder-user.jpg",
      groupId: "group-002",
      groupName: "10Б класс",
      answerContent: {
        text: "винительный падеж"
      },
      correctAnswer: {
        text: "винительный падеж",
        explanation: "Слово отвечает на вопрос 'что?' и является прямым дополнением"
      },
      isCorrect: true,
      score: 3,
      maxScore: 3,
      feedback: "Правильно!",
      autoGraded: false,
      submittedAt: "2025-01-25T11:45:00Z",
      gradedAt: "2025-01-25T12:00:00Z",
      lastModifiedAt: "2025-01-25T11:45:00Z",
      moderationStatus: "approved",
      moderatedBy: "teacher-001",
      attemptNumber: 2,
      timeSpent: 120,
      tags: ["падежи", "грамматика"],
      viewCount: 2,
      likeCount: 1,
      commentCount: 0
    }
  ];

  const mockActivities: FeedActivity[] = [
    {
      id: "activity-001",
      type: "answer_submitted",
      timestamp: "2025-01-25T12:30:00Z",
      studentId: "student-001",
      studentName: "Анна Петрова",
      studentAvatar: "/placeholder-user.jpg",
      groupId: "group-001",
      groupName: "10А класс",
      answerId: "ans-001",
      testId: "test-001",
      testName: "Синонимы и антонимы",
      content: {
        title: "Новый ответ отправлен",
        description: "Анна Петрова ответила на вопрос о синонимах",
        preview: "прекрасный",
        isCorrect: true
      },
      isHighlighted: true,
      priority: "medium",
      readBy: []
    },
    {
      id: "activity-002",
      type: "answer_graded",
      timestamp: "2025-01-25T12:00:00Z",
      studentId: "student-003",
      studentName: "Елена Сидорова",
      studentAvatar: "/placeholder-user.jpg",
      groupId: "group-002",
      groupName: "10Б класс",
      answerId: "ans-003",
      testId: "test-003",
      testName: "Падежи в русском языке",
      content: {
        title: "Ответ оценен",
        description: "Елена Сидорова получила оценку за ответ",
        score: 3,
        isCorrect: true
      },
      isHighlighted: false,
      priority: "low",
      readBy: ["teacher-001"]
    }
  ];

  // Helper functions
  const getStatusColor = (status: ModerationStatus) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'approved': return 'text-green-600 bg-green-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      case 'flagged': return 'text-orange-600 bg-orange-50';
      case 'needs_review': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: ModerationStatus) => {
    switch (status) {
      case 'pending': return 'Ожидает';
      case 'approved': return 'Одобрен';
      case 'rejected': return 'Отклонен';
      case 'flagged': return 'Помечен';
      case 'needs_review': return 'Требует проверки';
      default: return status;
    }
  };

  const getCorrectnessColor = (isCorrect?: boolean) => {
    if (isCorrect === true) return 'border-l-4 border-green-500';
    if (isCorrect === false) return 'border-l-4 border-red-500';
    return 'border-l-4 border-gray-300';
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'только что';
    if (diffInMinutes < 60) return `${diffInMinutes} мин назад`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} ч назад`;
    return `${Math.floor(diffInMinutes / 1440)} дн назад`;
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Components
  const FeedHeader = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-source-serif-pro text-3xl font-bold text-foreground mb-2">
            Лента ответов
          </h1>
          <p className="text-muted-foreground">
            Отслеживайте активность учеников и модерируйте ответы в реальном времени
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Настройки
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Экспорт
          </Button>
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Уведомления
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Всего ответов</p>
                <p className="text-2xl font-bold">{mockStatistics.totalAnswers}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ожидают модерации</p>
                <p className="text-2xl font-bold text-yellow-600">{mockStatistics.pendingModeration}</p>
              </div>
              <Flag className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Средний балл</p>
                <p className="text-2xl font-bold text-green-600">{mockStatistics.averageScore}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Активные ученики</p>
                <p className="text-2xl font-bold">{mockStatistics.activeStudents}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">За последний час</p>
                <p className="text-2xl font-bold text-blue-600">{mockStatistics.recentActivity}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const FeedFiltersPanel = () => (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Фильтры
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Поиск</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Поиск по содержимому..." 
              className="pl-10"
              value={filters.searchQuery}
              onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Статус модерации</label>
          <Select 
            value={filters.moderationStatus} 
            onValueChange={(value) => setFilters(prev => ({ ...prev, moderationStatus: value as ModerationStatus | 'all' }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="pending">Ожидает</SelectItem>
              <SelectItem value="approved">Одобрен</SelectItem>
              <SelectItem value="rejected">Отклонен</SelectItem>
              <SelectItem value="flagged">Помечен</SelectItem>
              <SelectItem value="needs_review">Требует проверки</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Правильность</label>
          <Select 
            value={filters.correctnessFilter} 
            onValueChange={(value) => setFilters(prev => ({ ...prev, correctnessFilter: value as any }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все ответы</SelectItem>
              <SelectItem value="correct">Правильные</SelectItem>
              <SelectItem value="incorrect">Неправильные</SelectItem>
              <SelectItem value="ungraded">Не оценены</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="flagged"
            checked={filters.showOnlyFlagged}
            onCheckedChange={(checked) => setFilters(prev => ({ ...prev, showOnlyFlagged: !!checked }))}
          />
          <label htmlFor="flagged" className="text-sm">Только помеченные</label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="ungraded"
            checked={filters.showOnlyUngraded}
            onCheckedChange={(checked) => setFilters(prev => ({ ...prev, showOnlyUngraded: !!checked }))}
          />
          <label htmlFor="ungraded" className="text-sm">Только не оцененные</label>
        </div>

        <Separator />

        <div>
          <label className="text-sm font-medium mb-2 block">Сортировка</label>
          <Select 
            value={filters.sortBy} 
            onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value as any }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="timestamp">По времени</SelectItem>
              <SelectItem value="score">По баллам</SelectItem>
              <SelectItem value="student">По ученику</SelectItem>
              <SelectItem value="test">По тесту</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );

  const AnswerCard = ({ answer }: { answer: StudentAnswer }) => (
    <Card className={`cursor-pointer transition-all hover:shadow-md ${getCorrectnessColor(answer.isCorrect)} ${selectedAnswers.includes(answer.id) ? 'ring-2 ring-blue-500' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Checkbox 
              checked={selectedAnswers.includes(answer.id)}
              onCheckedChange={(checked) => {
                if (checked) {
                  setSelectedAnswers(prev => [...prev, answer.id]);
                } else {
                  setSelectedAnswers(prev => prev.filter(id => id !== answer.id));
                }
              }}
            />
            <Avatar className="h-8 w-8">
              <AvatarImage src={answer.studentAvatar} />
              <AvatarFallback>{answer.studentName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{answer.studentName}</p>
              <p className="text-xs text-muted-foreground">{answer.groupName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(answer.moderationStatus)}>
              {getStatusText(answer.moderationStatus)}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedAnswer(answer)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Просмотреть
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Star className="h-4 w-4 mr-2" />
                  Оценить
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Flag className="h-4 w-4 mr-2" />
                  Пометить
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="mb-3">
          <p className="text-sm font-medium mb-1">{answer.testName}</p>
          <p className="text-sm text-muted-foreground mb-2">{answer.questionText}</p>
          
          {answer.answerContent.text && (
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm">{answer.answerContent.text.length > 100 ? 
                `${answer.answerContent.text.substring(0, 100)}...` : 
                answer.answerContent.text
              }</p>
            </div>
          )}
          
          {answer.answerContent.selectedOptions && (
            <div className="flex flex-wrap gap-1 mt-2">
              {answer.answerContent.selectedOptions.map((option, index) => (
                <Badge key={index} variant="secondary">{option}</Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatTimeAgo(answer.submittedAt)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDuration(answer.timeSpent)}
            </span>
            {answer.score !== undefined && (
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                {answer.score}/{answer.maxScore}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {answer.viewCount}
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="h-3 w-3" />
              {answer.likeCount}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="h-3 w-3" />
              {answer.commentCount}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const AnswerDetailsPanel = () => {
    if (!selectedAnswer) {
      return (
        <Card className="h-fit">
          <CardContent className="p-6 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Выберите ответ для просмотра деталей</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Детали ответа
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={selectedAnswer.studentAvatar} />
              <AvatarFallback>{selectedAnswer.studentName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{selectedAnswer.studentName}</p>
              <p className="text-sm text-muted-foreground">{selectedAnswer.groupName}</p>
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-sm font-medium mb-1">Тест</p>
            <p className="text-sm text-muted-foreground">{selectedAnswer.testName}</p>
          </div>

          <div>
            <p className="text-sm font-medium mb-1">Вопрос</p>
            <p className="text-sm text-muted-foreground">{selectedAnswer.questionText}</p>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Ответ ученика</p>
            {selectedAnswer.answerContent.text && (
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm">{selectedAnswer.answerContent.text}</p>
              </div>
            )}
            {selectedAnswer.answerContent.selectedOptions && (
              <div className="flex flex-wrap gap-1">
                {selectedAnswer.answerContent.selectedOptions.map((option, index) => (
                  <Badge key={index} variant="secondary">{option}</Badge>
                ))}
              </div>
            )}
          </div>

          {selectedAnswer.correctAnswer && (
            <div>
              <p className="text-sm font-medium mb-2">Правильный ответ</p>
              <div className="bg-green-50 p-3 rounded-md">
                {selectedAnswer.correctAnswer.text && (
                  <p className="text-sm">{selectedAnswer.correctAnswer.text}</p>
                )}
                {selectedAnswer.correctAnswer.options && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedAnswer.correctAnswer.options.map((option, index) => (
                      <Badge key={index} variant="outline" className="text-green-700">{option}</Badge>
                    ))}
                  </div>
                )}
                {selectedAnswer.correctAnswer.explanation && (
                  <p className="text-xs text-green-700 mt-2">{selectedAnswer.correctAnswer.explanation}</p>
                )}
              </div>
            </div>
          )}

          <Separator />

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-2 block">Оценка</label>
              <div className="flex items-center gap-2">
                <Input 
                  type="number" 
                  placeholder="Баллы" 
                  className="w-20"
                  max={selectedAnswer.maxScore}
                  defaultValue={selectedAnswer.score}
                />
                <span className="text-sm text-muted-foreground">из {selectedAnswer.maxScore}</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Обратная связь</label>
              <Textarea 
                placeholder="Комментарий для ученика..."
                defaultValue={selectedAnswer.feedback}
              />
            </div>

            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                <CheckCircle className="h-4 w-4 mr-2" />
                Сохранить
              </Button>
              <Button variant="outline" size="sm">
                <Flag className="h-4 w-4 mr-2" />
                Пометить
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const BulkActionsPanel = () => {
    if (selectedAnswers.length === 0) return null;

    return (
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <Card className="shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">
                Выбрано: {selectedAnswers.length}
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Одобрить
                </Button>
                <Button size="sm" variant="outline">
                  <XCircle className="h-4 w-4 mr-2" />
                  Отклонить
                </Button>
                <Button size="sm" variant="outline">
                  <Flag className="h-4 w-4 mr-2" />
                  Пометить
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Экспорт
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => setSelectedAnswers([])}
                >
                  Отменить
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

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
          <FeedHeader />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <FeedFiltersPanel />
            </div>

            {/* Main Feed */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {mockAnswers.map((answer) => (
                  <AnswerCard key={answer.id} answer={answer} />
                ))}
              </div>
            </div>

            {/* Details Sidebar */}
            <div className="lg:col-span-1">
              <AnswerDetailsPanel />
            </div>
          </div>
        </div>
      </main>

      <BulkActionsPanel />
    </div>
  );
}