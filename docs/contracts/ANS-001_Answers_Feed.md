# Feature Contract: ANS-001 Answers Feed

**Version:** 1.0
**Date:** 2025-01-25
**Author:** Claude 4 Sonnet

## 1. Overview

**ID:** ANS-001
**Name:** Answers Feed (Лента ответов)
**Description:** Интерактивная лента для просмотра, модерации и анализа ответов учеников в реальном времени. Предоставляет учителям возможность отслеживать активность учеников, проверять ответы, давать обратную связь и выявлять проблемные области в обучении.
**Target Users:**
  - Учитель (основной пользователь)
  - Администратор (с расширенными правами модерации)
  - Ученик (ограниченный доступ к собственным ответам)

## 2. Data Structure

Ожидаемая структура данных для ленты ответов:

```typescript
// Тип ответа ученика
type AnswerType = 'multiple_choice' | 'text' | 'essay' | 'matching' | 'drag_drop' | 'audio' | 'file_upload';

// Статус модерации ответа
type ModerationStatus = 'pending' | 'approved' | 'rejected' | 'flagged' | 'needs_review';

// Тип активности в ленте
type ActivityType = 'answer_submitted' | 'answer_updated' | 'answer_graded' | 'feedback_given' | 'test_completed' | 'test_started';

// Детальная информация об ответе
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
  
  // Содержимое ответа
  answerContent: {
    text?: string; // Текстовый ответ
    selectedOptions?: string[]; // Выбранные варианты
    files?: {
      id: string;
      name: string;
      url: string;
      type: string;
      size: number;
    }[]; // Загруженные файлы
    audioUrl?: string; // Аудио ответ
    metadata?: Record<string, any>; // Дополнительные данные
  };
  
  // Правильный ответ для сравнения
  correctAnswer?: {
    text?: string;
    options?: string[];
    explanation?: string;
  };
  
  // Оценка и обратная связь
  isCorrect?: boolean;
  score?: number; // Баллы за ответ
  maxScore: number; // Максимальные баллы
  feedback?: string; // Обратная связь от учителя
  autoGraded: boolean; // Автоматически оценен
  
  // Временные метки
  submittedAt: string; // ISO date string
  gradedAt?: string; // ISO date string
  lastModifiedAt: string; // ISO date string
  
  // Модерация и статус
  moderationStatus: ModerationStatus;
  moderatedBy?: string; // ID модератора
  moderationNotes?: string;
  flagReason?: string; // Причина флага
  
  // Метаданные
  attemptNumber: number; // Номер попытки
  timeSpent: number; // Время на ответ в секундах
  ipAddress?: string; // IP адрес (для безопасности)
  userAgent?: string; // User agent
  tags: string[]; // Теги для категоризации
  
  // Статистика
  viewCount: number; // Количество просмотров
  likeCount: number; // Лайки от других учеников
  commentCount: number; // Количество комментариев
}

// Активность в ленте
interface FeedActivity {
  id: string;
  type: ActivityType;
  timestamp: string; // ISO date string
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  groupId: string;
  groupName: string;
  
  // Связанные данные
  answerId?: string; // Для активности с ответами
  testId?: string;
  testName?: string;
  questionId?: string;
  
  // Содержимое активности
  content: {
    title: string; // Заголовок активности
    description: string; // Описание
    preview?: string; // Превью ответа
    score?: number; // Балл (если применимо)
    isCorrect?: boolean; // Правильность (если применимо)
  };
  
  // Метаданные
  isHighlighted: boolean; // Выделенная активность
  priority: 'low' | 'medium' | 'high' | 'urgent';
  readBy: string[]; // ID пользователей, которые видели
}

// Комментарий к ответу
interface AnswerComment {
  id: string;
  answerId: string;
  authorId: string;
  authorName: string;
  authorRole: 'teacher' | 'student' | 'admin';
  content: string;
  createdAt: string; // ISO date string
  updatedAt?: string; // ISO date string
  isPrivate: boolean; // Видимость только для учителя
  parentCommentId?: string; // Для вложенных комментариев
  reactions: {
    type: 'like' | 'helpful' | 'question';
    count: number;
    userIds: string[];
  }[];
}

// Фильтры для ленты
interface FeedFilters {
  timeRange: {
    from: string; // ISO date string
    to: string; // ISO date string
  };
  groups: string[]; // ID выбранных групп
  students: string[]; // ID выбранных учеников
  tests: string[]; // ID выбранных тестов
  questionTypes: AnswerType[]; // Типы вопросов
  moderationStatus: ModerationStatus | 'all';
  activityTypes: ActivityType[]; // Типы активности
  correctnessFilter: 'all' | 'correct' | 'incorrect' | 'ungraded';
  scoreRange: [number, number]; // Диапазон баллов
  tags: string[]; // Фильтр по тегам
  searchQuery: string; // Поиск по содержимому
  sortBy: 'timestamp' | 'score' | 'student' | 'test' | 'priority';
  sortOrder: 'asc' | 'desc';
  showOnlyFlagged: boolean;
  showOnlyUngraded: boolean;
}

// Настройки отображения ленты
interface FeedDisplaySettings {
  viewMode: 'compact' | 'detailed' | 'cards';
  itemsPerPage: number;
  autoRefresh: boolean;
  refreshInterval: number; // в секундах
  showPreviews: boolean;
  showScores: boolean;
  showTimestamps: boolean;
  groupByTest: boolean;
  highlightNewItems: boolean;
  enableNotifications: boolean;
}

// Основные данные ленты ответов
interface AnswersFeedData {
  activities: FeedActivity[];
  answers: StudentAnswer[];
  comments: AnswerComment[];
  filters: FeedFilters;
  displaySettings: FeedDisplaySettings;
  
  // Доступные опции для фильтров
  availableGroups: { id: string; name: string; studentCount: number }[];
  availableTests: { id: string; name: string; questionCount: number }[];
  availableStudents: { id: string; name: string; groupId: string; avatar?: string }[];
  availableTags: string[];
  
  // Статистика
  statistics: {
    totalAnswers: number;
    pendingModeration: number;
    averageScore: number;
    activeStudents: number;
    recentActivity: number; // За последний час
  };
  
  // Состояние
  isLoading: boolean;
  hasMore: boolean; // Есть ли еще данные для загрузки
  error?: string;
  selectedAnswers: string[]; // Выбранные ответы для bulk операций
  lastUpdated: string; // ISO date string
}

// Данные для bulk операций
interface BulkOperation {
  type: 'grade' | 'moderate' | 'tag' | 'export' | 'delete';
  answerIds: string[];
  parameters: {
    score?: number;
    feedback?: string;
    moderationStatus?: ModerationStatus;
    tags?: string[];
    exportFormat?: 'csv' | 'xlsx' | 'pdf';
  };
}

// Уведомления в реальном времени
interface FeedNotification {
  id: string;
  type: 'new_answer' | 'flagged_content' | 'urgent_review' | 'bulk_complete';
  title: string;
  message: string;
  timestamp: string; // ISO date string
  isRead: boolean;
  actionUrl?: string; // URL для перехода
  priority: 'low' | 'medium' | 'high' | 'urgent';
  relatedAnswerId?: string;
  relatedStudentId?: string;
}
```

## 3. Page Structure and Layout

Страница использует стандартный layout с навигацией. Основной контент организован как интерактивная лента с боковыми панелями для фильтрации и статистики.

**Общая структура:**

1. **Header Section:**
   - Заголовок "Лента ответов"
   - Статистика в реальном времени: новые ответы, ожидающие модерации, активные ученики
   - Кнопки: Настройки отображения, Экспорт, Уведомления

2. **Filters Sidebar (Left):**
   - Быстрые фильтры: Сегодня, Вчера, Неделя, Месяц
   - Детальные фильтры: группы, ученики, тесты, типы вопросов
   - Сохраненные фильтры
   - Поиск по содержимому

3. **Main Feed Area (Center):**
   - Лента активности с ответами
   - Infinite scroll или пагинация
   - Bulk selection и операции
   - Real-time обновления

4. **Details Sidebar (Right):**
   - Детали выбранного ответа
   - Комментарии и обратная связь
   - Быстрые действия (оценить, прокомментировать, пометить)
   - Статистика по ученику

5. **Floating Action Panel:**
   - Быстрые действия для выбранных ответов
   - Bulk операции
   - Уведомления

**Responsive Layout:**
- Desktop: Трехколоночный layout с sidebar'ами
- Tablet: Collapsible sidebar'ы, основная лента в центре
- Mobile: Стековая компоновка, drawer'ы для фильтров и деталей

## 4. Component Breakdown

### 4.1 Existing Components to Use

- **Layout:** Стандартный layout с `TopNavBlock`
- **Card (`@/components/ui/card`):** Карточки ответов и активности
- **Button (`@/components/ui/button`):** Все кнопки действий
- **Input (`@/components/ui/input`):** Поиск и формы
- **Select (`@/components/ui/select`):** Фильтры и сортировка
- **Badge (`@/components/ui/badge`):** Статусы, теги, баллы
- **Avatar (`@/components/ui/avatar`):** Аватары учеников
- **Checkbox (`@/components/ui/checkbox`):** Множественный выбор
- **Textarea (`@/components/ui/textarea`):** Комментарии и обратная связь
- **DatePicker (`@/components/ui/date-picker`):** Фильтры по датам
- **Progress (`@/components/ui/progress`):** Прогресс оценивания
- **Tabs (`@/components/ui/tabs`):** Переключение между режимами
- **DropdownMenu (`@/components/ui/dropdown-menu`):** Меню действий
- **ScrollArea (`@/components/ui/scroll-area`):** Прокрутка ленты
- **Separator (`@/components/ui/separator`):** Разделители
- **Icons (`lucide-react`):**
  - `MessageSquare`: Ответы и комментарии
  - `Filter`: Фильтры
  - `Search`: Поиск
  - `Clock`: Время
  - `CheckCircle`: Правильные ответы
  - `XCircle`: Неправильные ответы
  - `Flag`: Флаги и модерация
  - `Star`: Оценки
  - `Eye`: Просмотры
  - `Bell`: Уведомления

### 4.2 New Components to Develop

- **`AnswersFeedPage` (`app/answers/page.tsx`):**
  - **Ответственность:** Основной компонент страницы ленты ответов, управление состоянием, real-time обновления
  - **Props:** Получает данные через server components или API

- **`FeedHeader`:**
  - **Ответственность:** Заголовок с статистикой и основными действиями
  - **Расположение:** `components/answers/FeedHeader.tsx`
  - **Props:** `statistics: FeedStatistics, notifications: FeedNotification[], onSettingsOpen: () => void`

- **`FeedFiltersPanel`:**
  - **Ответственность:** Боковая панель с фильтрами и поиском
  - **Расположение:** `components/answers/FeedFiltersPanel.tsx`
  - **Props:** `filters: FeedFilters, availableOptions: FilterOptions, onFiltersChange: (filters: FeedFilters) => void`

- **`AnswersFeed`:**
  - **Ответственность:** Основная лента с ответами и активностью
  - **Расположение:** `components/answers/AnswersFeed.tsx`
  - **Props:** `activities: FeedActivity[], answers: StudentAnswer[], selectedAnswers: string[], onSelect: (ids: string[]) => void, displaySettings: FeedDisplaySettings`

- **`FeedItem`:**
  - **Ответственность:** Отдельный элемент ленты (ответ или активность)
  - **Расположение:** `components/answers/FeedItem.tsx`
  - **Props:** `activity: FeedActivity, answer?: StudentAnswer, isSelected: boolean, onSelect: (id: string) => void, onViewDetails: (id: string) => void`

- **`AnswerCard`:**
  - **Ответственность:** Карточка ответа ученика с превью
  - **Расположение:** `components/answers/AnswerCard.tsx`
  - **Props:** `answer: StudentAnswer, isSelected: boolean, onSelect: (id: string) => void, onGrade: (id: string, score: number, feedback: string) => void`

- **`AnswerDetailsPanel`:**
  - **Ответственность:** Боковая панель с деталями выбранного ответа
  - **Расположение:** `components/answers/AnswerDetailsPanel.tsx`
  - **Props:** `answer: StudentAnswer | null, comments: AnswerComment[], onGrade: (score: number, feedback: string) => void, onComment: (content: string) => void`

- **`QuickGradingModal`:**
  - **Ответственность:** Модальное окно для быстрого оценивания ответа
  - **Расположение:** `components/answers/QuickGradingModal.tsx`
  - **Props:** `answer: StudentAnswer, isOpen: boolean, onClose: () => void, onGrade: (score: number, feedback: string) => void`

- **`BulkActionsPanel`:**
  - **Ответственность:** Панель для bulk операций с выбранными ответами
  - **Расположение:** `components/answers/BulkActionsPanel.tsx`
  - **Props:** `selectedAnswers: string[], onBulkOperation: (operation: BulkOperation) => void, onClearSelection: () => void`

- **`ModerationQueue`:**
  - **Ответственность:** Очередь ответов, требующих модерации
  - **Расположение:** `components/answers/ModerationQueue.tsx`
  - **Props:** `pendingAnswers: StudentAnswer[], onModerate: (id: string, status: ModerationStatus, notes?: string) => void`

- **`AnswerComments`:**
  - **Ответственность:** Компонент для отображения и добавления комментариев
  - **Расположение:** `components/answers/AnswerComments.tsx`
  - **Props:** `comments: AnswerComment[], answerId: string, onAddComment: (content: string, isPrivate: boolean) => void`

- **`FeedNotifications`:**
  - **Ответственность:** Компонент уведомлений в реальном времени
  - **Расположение:** `components/answers/FeedNotifications.tsx`
  - **Props:** `notifications: FeedNotification[], onMarkAsRead: (id: string) => void, onClearAll: () => void`

- **`AnswerPreview`:**
  - **Ответственность:** Превью ответа с основной информацией
  - **Расположение:** `components/answers/AnswerPreview.tsx`
  - **Props:** `answer: StudentAnswer, showScore: boolean, showTimestamp: boolean`

- **`FeedDisplaySettings`:**
  - **Ответственность:** Модальное окно настроек отображения ленты
  - **Расположение:** `components/answers/FeedDisplaySettings.tsx`
  - **Props:** `settings: FeedDisplaySettings, isOpen: boolean, onClose: () => void, onSave: (settings: FeedDisplaySettings) => void`

- **`StudentActivitySummary`:**
  - **Ответственность:** Краткая сводка активности ученика
  - **Расположение:** `components/answers/StudentActivitySummary.tsx`
  - **Props:** `studentId: string, recentAnswers: StudentAnswer[], statistics: StudentStatistics`

## 5. Styling and Theming

- Используется **Tailwind CSS** и shadcn/ui дизайн-система
- **Feed Layout:** Flexbox с sticky sidebar'ами
- **Карточки ответов:**
  - Компактный дизайн с hover эффектами
  - Цветовое кодирование по статусам и правильности
  - Smooth transitions для selection состояний
- **Real-time индикаторы:**
  - Пульсирующие badges для новых ответов
  - Анимированные уведомления
  - Live статистика с обновлениями
- **Цветовая схема статусов:**
  - Pending: `text-yellow-600 bg-yellow-50`
  - Approved: `text-green-600 bg-green-50`
  - Rejected: `text-red-600 bg-red-50`
  - Flagged: `text-orange-600 bg-orange-50`
  - Needs Review: `text-blue-600 bg-blue-50`
- **Правильность ответов:**
  - Correct: `border-l-4 border-green-500`
  - Incorrect: `border-l-4 border-red-500`
  - Ungraded: `border-l-4 border-gray-300`

## 6. Interaction and Behavior

### 6.1 Real-time Updates
- **WebSocket Connection:** Для live обновлений ленты
- **Optimistic Updates:** Мгновенное отображение действий пользователя
- **Conflict Resolution:** Обработка конфликтов при одновременном редактировании

### 6.2 User Interactions
- **Feed Navigation:**
  - Infinite scroll с lazy loading
  - Keyboard shortcuts для навигации
  - Quick actions на hover
- **Grading Workflow:**
  - Inline grading для простых ответов
  - Modal для детального оценивания
  - Bulk grading для множественных ответов
- **Filtering and Search:**
  - Real-time фильтрация без перезагрузки
  - Saved filter presets
  - Advanced search с автодополнением
- **Moderation:**
  - Quick moderation actions
  - Batch moderation для эффективности
  - Escalation workflow для сложных случаев

### 6.3 State Management
- **Real-time State:** WebSocket updates с optimistic UI
- **Filter State:** Синхронизация с URL для sharing
- **Selection State:** Persistent selection across page refreshes
- **Cache Management:** Smart caching с invalidation

### 6.4 Notifications
- **In-app Notifications:** Toast уведомления для действий
- **Real-time Alerts:** Критические уведомления
- **Email Notifications:** Настраиваемые email уведомления
- **Push Notifications:** Для мобильных устройств

## 7. Accessibility and Performance

### 7.1 Accessibility
- **Keyboard Navigation:** Полная поддержка keyboard shortcuts
- **Screen Readers:** ARIA labels для всех интерактивных элементов
- **Focus Management:** Логичный порядок табуляции в ленте
- **High Contrast:** Поддержка режима высокой контрастности

### 7.2 Performance
- **Virtual Scrolling:** Для больших лент ответов
- **Lazy Loading:** Постепенная загрузка контента
- **Memoization:** React.memo для компонентов ответов
- **Debouncing:** Поисковые запросы и фильтрация
- **WebSocket Optimization:** Efficient real-time updates

## 8. Security Considerations

- **Data Privacy:** Ограничение доступа к ответам других пользователей
- **Content Moderation:** Автоматическое обнаружение неподходящего контента
- **Input Validation:** Валидация всех пользовательских данных
- **Rate Limiting:** Ограничения на частоту действий
- **Audit Trail:** Логирование всех действий модерации

## 9. Testing Strategy

### 9.1 Unit Tests
- Тестирование компонентов ленты с различными данными
- Тестирование логики фильтрации и поиска
- Тестирование real-time обновлений

### 9.2 Integration Tests
- Тестирование WebSocket соединений
- Тестирование bulk операций
- Тестирование модерации workflow

### 9.3 E2E Tests
- Полные пользовательские сценарии оценивания
- Тестирование real-time взаимодействий
- Тестирование responsive поведения

## 10. Future Considerations

- **AI-Powered Moderation:** Автоматическая модерация контента
- **Advanced Analytics:** Детальная аналитика по ответам
- **Collaborative Grading:** Совместное оценивание несколькими учителями
- **Mobile App:** Нативное мобильное приложение
- **Integration:** Интеграция с внешними системами оценивания
- **Gamification:** Элементы геймификации для учеников

## 11. Acceptance Criteria

### Phase 1 - Core Feed
- [ ] Создан роут `/answers` и базовая страница `AnswersFeedPage`
- [ ] Реализованы основные компоненты: `AnswersFeed`, `FeedItem`, `AnswerCard`
- [ ] Страница корректно отображает ленту ответов с фильтрацией
- [ ] Работает базовое оценивание ответов
- [ ] Responsive дизайн функционирует на всех устройствах

### Phase 2 - Real-time and Moderation
- [ ] Реализованы real-time обновления через WebSocket
- [ ] Добавлена система модерации с очередью
- [ ] Реализованы bulk операции
- [ ] Добавлены комментарии и обратная связь
- [ ] Полная accessibility поддержка

### Phase 3 - Advanced Features
- [ ] AI-powered модерация и рекомендации
- [ ] Advanced аналитика и отчеты
- [ ] Collaborative grading возможности
- [ ] Mobile app интеграция
- [ ] Performance оптимизации для больших объемов данных

## 12. API Requirements

```typescript
// GET /api/answers/feed?filters=&page=&limit=
interface FeedResponse {
  activities: FeedActivity[];
  answers: StudentAnswer[];
  total: number;
  hasMore: boolean;
  statistics: FeedStatistics;
}

// WebSocket /ws/answers/feed
interface WebSocketMessage {
  type: 'new_answer' | 'answer_updated' | 'answer_graded' | 'bulk_complete';
  data: FeedActivity | StudentAnswer | BulkOperationResult;
}

// POST /api/answers/:id/grade
interface GradeAnswerRequest {
  score: number;
  feedback?: string;
  isCorrect?: boolean;
}

// POST /api/answers/bulk
interface BulkOperationRequest {
  operation: BulkOperation;
}

// GET /api/answers/:id/comments
interface CommentsResponse {
  comments: AnswerComment[];
}

// POST /api/answers/:id/comments
interface AddCommentRequest {
  content: string;
  isPrivate: boolean;
  parentCommentId?: string;
}

// PATCH /api/answers/:id/moderate
interface ModerateAnswerRequest {
  status: ModerationStatus;
  notes?: string;
  flagReason?: string;
}

// GET /api/answers/notifications
interface NotificationsResponse {
  notifications: FeedNotification[];
  unreadCount: number;
}
```

Контракт ANS-001 определяет полную спецификацию для ленты ответов с фокусом на real-time взаимодействие, модерацию и эффективное оценивание ответов учеников.