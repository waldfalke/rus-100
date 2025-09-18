# Feature Contract: GRP-001 Group Page

**Version:** 1.0
**Date:** 2025-01-25
**Author:** Claude 4 Sonnet

## 1. Overview

**ID:** GRP-001
**Name:** Group Page (Страница группы)
**Description:** Детальная страница отдельной группы, предоставляющая полный обзор учеников, их прогресса, результатов тестирования и инструменты для управления группой. Центральная страница для работы учителя с конкретной группой.
**Target Users:**
  - Учитель (основной пользователь)
  - Администратор (с расширенными правами)

## 2. Data Structure

Ожидаемая структура данных для страницы:

```typescript
// Статус ученика в группе
type StudentStatus = 'active' | 'inactive' | 'pending';

// Результат теста ученика
interface TestResult {
  testId: string;
  testName: string;
  score: number; // 0-100
  maxScore: number;
  completedAt: string; // ISO date string
  timeSpent: number; // в секундах
  attempts: number;
}

// Данные ученика в группе
interface GroupStudent {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  status: StudentStatus;
  joinedAt: string; // ISO date string
  lastActivity?: string; // ISO date string
  avatar?: string; // URL аватара
  testResults: TestResult[];
  overallProgress: number; // 0-100, общий прогресс
  completedTests: number;
  totalTests: number;
  averageScore: number; // Средний балл
  tags: string[]; // Теги для группировки/фильтрации
}

// Папка с тестами
interface TestFolder {
  id: string;
  name: string;
  description?: string;
  testsCount: number;
  completedByStudents: number; // Количество учеников, завершивших все тесты
  averageScore: number; // Средний балл по папке
  createdAt: string;
  isVisible: boolean; // Видимость для учеников
}

// Статистика группы
interface GroupStats {
  totalStudents: number;
  activeStudents: number;
  averageProgress: number; // 0-100
  averageScore: number; // Средний балл по группе
  totalTests: number;
  completedTests: number;
  lastActivity: string; // ISO date string
  engagementRate: number; // 0-100, процент активных учеников
}

// Фильтры для учеников
interface StudentFilters {
  search: string; // Поиск по имени
  status: StudentStatus | 'all';
  progressRange: [number, number]; // Диапазон прогресса 0-100
  scoreRange: [number, number]; // Диапазон среднего балла 0-100
  tags: string[]; // Фильтр по тегам
  sortBy: 'name' | 'progress' | 'score' | 'activity' | 'joined';
  sortOrder: 'asc' | 'desc';
  showInactive: boolean;
}

// Основные данные группы
interface GroupData {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'archived' | 'draft';
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  ownerName: string;
  isOwner: boolean; // Является ли текущий пользователь владельцем
  students: GroupStudent[];
  testFolders: TestFolder[];
  stats: GroupStats;
  filters: StudentFilters;
  settings: {
    allowSelfEnrollment: boolean;
    requireApproval: boolean;
    showLeaderboard: boolean;
    allowRetakes: boolean;
    maxAttempts: number;
  };
}

// Данные страницы группы
interface GroupPageData {
  group: GroupData;
  isLoading: boolean;
  error?: string;
  selectedStudents: string[]; // Выбранные ученики для bulk операций
  viewMode: 'grid' | 'table'; // Режим отображения учеников
}
```

## 3. Page Structure and Layout

Страница использует стандартный layout с навигацией и breadcrumbs. Основной контент организован в табы или секции.

**Общая структура:**

1. **Header Section:**
   - Breadcrumbs: Dashboard > Группы > [Название группы]
   - Заголовок с названием группы и статусом
   - Описание группы (если есть)
   - Кнопки действий: Настройки, Пригласить учеников, Экспорт

2. **Stats Overview:**
   - Карточки с ключевой статистикой группы
   - Быстрые метрики: количество учеников, средний прогресс, активность

3. **Navigation Tabs:**
   - Ученики (основная вкладка)
   - Тесты и папки
   - Результаты и аналитика
   - Настройки группы

4. **Students Section (основная):**
   - Filter Bar с поиском и фильтрами
   - View Mode Toggle (grid/table)
   - Bulk Actions Bar (при выборе учеников)
   - Students Grid/Table
   - Pagination (если необходимо)

5. **Quick Actions Panel:**
   - Floating action button для быстрых действий
   - Добавить ученика, создать тест, экспорт данных

**Responsive Layout:**
- Desktop: Полная функциональность с sidebar
- Tablet: Адаптивные табы и grid
- Mobile: Стековая компоновка, collapsible фильтры

## 4. Component Breakdown

### 4.1 Existing Components to Use

- **Layout:** Стандартный layout с `TopNavBlock` и breadcrumbs
- **Card (`@/components/ui/card`):** Для статистических карточек и карточек учеников
- **Button (`@/components/ui/button`):** Все кнопки действий
- **Input (`@/components/ui/input`):** Поиск и формы
- **Select (`@/components/ui/select`):** Фильтры и сортировка
- **Badge (`@/components/ui/badge`):** Статусы и теги
- **Tabs (`@/components/ui/tabs`):** Навигация по секциям
- **Table (`@/components/ui/table`):** Табличное отображение учеников
- **Checkbox (`@/components/ui/checkbox`):** Множественный выбор
- **DropdownMenu (`@/components/ui/dropdown-menu`):** Меню действий
- **Progress (`@/components/ui/progress`):** Прогресс-бары
- **Avatar (`@/components/ui/avatar`):** Аватары учеников
- **Switch (`@/components/ui/switch`):** Настройки группы
- **Slider (`@/components/ui/slider`):** Фильтры по диапазонам
- **Icons (`lucide-react`):**
  - `Users`: Ученики
  - `Settings`: Настройки
  - `UserPlus`: Добавить ученика
  - `Download`: Экспорт
  - `Search`: Поиск
  - `Filter`: Фильтры
  - `Grid3X3`: Grid view
  - `List`: Table view
  - `MoreHorizontal`: Действия

### 4.2 New Components to Develop

- **`GroupPage` (`app/groups/[id]/page.tsx`):**
  - **Ответственность:** Основной компонент страницы группы, управление состоянием, координация между компонентами
  - **Props:** Получает `groupId` из URL params

- **`GroupHeader`:**
  - **Ответственность:** Заголовок страницы с информацией о группе и основными действиями
  - **Расположение:** `components/group/GroupHeader.tsx`
  - **Props:** `group: GroupData, onAction: (action: string) => void`

- **`GroupStatsOverview`:**
  - **Ответственность:** Отображение статистических карточек группы
  - **Расположение:** `components/group/GroupStatsOverview.tsx`
  - **Props:** `stats: GroupStats`

- **`StudentsFilterBar`:**
  - **Ответственность:** Панель фильтрации и поиска учеников
  - **Расположение:** `components/group/StudentsFilterBar.tsx`
  - **Props:** `filters: StudentFilters, onFiltersChange: (filters: StudentFilters) => void`

- **`StudentsViewToggle`:**
  - **Ответственность:** Переключатель между grid и table режимами
  - **Расположение:** `components/group/StudentsViewToggle.tsx`
  - **Props:** `viewMode: 'grid' | 'table', onViewModeChange: (mode: 'grid' | 'table') => void`

- **`StudentCard`:**
  - **Ответственность:** Карточка ученика в grid режиме
  - **Расположение:** `components/group/StudentCard.tsx`
  - **Props:** `student: GroupStudent, isSelected: boolean, onSelect: (id: string) => void, onAction: (action: string, studentId: string) => void`

- **`StudentsTable`:**
  - **Ответственность:** Табличное отображение учеников
  - **Расположение:** `components/group/StudentsTable.tsx`
  - **Props:** `students: GroupStudent[], selectedStudents: string[], onSelect: (ids: string[]) => void`

- **`StudentsGrid`:**
  - **Ответственность:** Grid отображение карточек учеников
  - **Расположение:** `components/group/StudentsGrid.tsx`
  - **Props:** `students: GroupStudent[], selectedStudents: string[], onSelect: (ids: string[]) => void`

- **`BulkActionsBar`:**
  - **Ответственность:** Панель массовых действий при выборе учеников
  - **Расположение:** `components/group/BulkActionsBar.tsx`
  - **Props:** `selectedCount: number, onAction: (action: string, studentIds: string[]) => void`

- **`InviteStudentsModal`:**
  - **Ответственность:** Модальное окно для приглашения новых учеников
  - **Расположение:** `components/group/InviteStudentsModal.tsx`
  - **Props:** `groupId: string, isOpen: boolean, onClose: () => void`

- **`GroupSettingsPanel`:**
  - **Ответственность:** Панель настроек группы
  - **Расположение:** `components/group/GroupSettingsPanel.tsx`
  - **Props:** `settings: GroupData['settings'], onSettingsChange: (settings: GroupData['settings']) => void`

## 5. Styling and Theming

- Используется **Tailwind CSS** и shadcn/ui дизайн-система
- **Grid Layout для карточек:** `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4`
- **Карточки учеников:**
  - Компактный дизайн с аватаром, именем, прогрессом
  - Hover эффекты и selection состояния
  - Цветовое кодирование по статусу
- **Статистические карточки:**
  - Минималистичный дизайн с иконками
  - Цветовые акценты для разных метрик
- **Filter Bar:**
  - Горизонтальная компоновка с collapsible секциями
  - Responsive поведение на мобильных устройствах
- **Цветовая схема статусов:**
  - Active: `text-green-600 bg-green-50`
  - Inactive: `text-gray-600 bg-gray-50`
  - Pending: `text-yellow-600 bg-yellow-50`

## 6. Interaction and Behavior

### 6.1 Data Loading
- **Initial Load:** Загрузка данных группы и учеников при монтировании
- **Lazy Loading:** Подгрузка дополнительных данных при скролле
- **Real-time Updates:** WebSocket подключение для live обновлений активности

### 6.2 User Interactions
- **Student Selection:**
  - Клик по карточке/строке → выбор ученика
  - Shift+Click → множественный выбор
  - Ctrl/Cmd+Click → добавление к выбору
- **Filtering and Search:**
  - Real-time поиск с debounce (300ms)
  - Мгновенная фильтрация по статусу и тегам
  - Range sliders для прогресса и баллов
- **View Modes:**
  - Toggle между grid и table режимами
  - Сохранение предпочтений в localStorage
- **Bulk Actions:**
  - Появление панели при выборе учеников
  - Массовые операции: изменение статуса, отправка сообщений, экспорт

### 6.3 State Management
- **Local State:** Фильтры, выбранные ученики, режим отображения
- **URL State:** Синхронизация активной вкладки и фильтров с URL
- **Server State:** Кэширование данных группы с optimistic updates
- **Real-time State:** WebSocket для live обновлений

### 6.4 Navigation
- **Tabs Navigation:** Переключение между секциями группы
- **Breadcrumbs:** Навигация по иерархии
- **Deep Linking:** Прямые ссылки на конкретные вкладки и фильтры

## 7. Accessibility and Performance

### 7.1 Accessibility
- **Keyboard Navigation:** Полная поддержка keyboard shortcuts
- **Screen Readers:** ARIA labels для всех интерактивных элементов
- **Focus Management:** Логичный порядок табуляции
- **High Contrast:** Поддержка режима высокой контрастности

### 7.2 Performance
- **Virtualization:** Для больших списков учеников (>50 элементов)
- **Pagination:** Server-side пагинация для очень больших групп
- **Memoization:** React.memo для StudentCard компонентов
- **Debouncing:** Поисковые запросы и фильтрация
- **Image Optimization:** Lazy loading аватаров

## 8. Security Considerations

- **Authorization:** Проверка прав доступа к группе на уровне API
- **Data Privacy:** Ограничение доступа к персональным данным учеников
- **Input Validation:** Валидация всех пользовательских вводов
- **XSS Prevention:** Санитизация отображаемых данных
- **CSRF Protection:** Токены для всех мутирующих операций

## 9. Testing Strategy

### 9.1 Unit Tests
- Тестирование логики фильтрации и сортировки учеников
- Тестирование компонентов с различными состояниями
- Тестирование обработчиков bulk операций

### 9.2 Integration Tests
- Тестирование взаимодействия между компонентами
- Тестирование API интеграции
- Тестирование real-time обновлений

### 9.3 E2E Tests
- Полные пользовательские сценарии работы с группой
- Тестирование responsive поведения
- Тестирование accessibility

## 10. Future Considerations

- **Advanced Analytics:** Детальная аналитика прогресса учеников
- **Communication Tools:** Встроенный чат или система сообщений
- **Gamification:** Система достижений и рейтингов
- **AI Insights:** Автоматические рекомендации по улучшению обучения
- **Mobile App:** Нативное мобильное приложение
- **Offline Support:** Возможность работы в offline режиме

## 11. Acceptance Criteria

### Phase 1 - Core Functionality
- [ ] Создан роут `/groups/[id]` и базовая страница `GroupPage`
- [ ] Реализованы все основные компоненты: `GroupHeader`, `GroupStatsOverview`, `StudentsFilterBar`, `StudentCard`, `StudentsTable`
- [ ] Страница корректно отображает информацию о группе и списке учеников
- [ ] Реализована фильтрация и поиск учеников
- [ ] Работают оба режима отображения: grid и table
- [ ] Реализованы базовые действия с учениками

### Phase 2 - Enhanced UX
- [ ] Реализованы bulk операции с учениками
- [ ] Добавлена система приглашений новых учеников
- [ ] Реализованы настройки группы
- [ ] Добавлены анимации и transitions
- [ ] Полная responsive поддержка

### Phase 3 - Advanced Features
- [ ] Real-time обновления активности
- [ ] Advanced аналитика и отчеты
- [ ] Экспорт данных в различных форматах
- [ ] Integration с внешними системами
- [ ] Performance оптимизации для больших групп

## 12. API Requirements

```typescript
// GET /api/groups/:id
interface GroupResponse {
  group: GroupData;
}

// GET /api/groups/:id/students?search=&status=&sort=&order=&page=&limit=
interface GroupStudentsResponse {
  students: GroupStudent[];
  total: number;
  page: number;
  limit: number;
}

// POST /api/groups/:id/students/invite
interface InviteStudentsRequest {
  emails: string[];
  message?: string;
}

// PATCH /api/groups/:id/students/:studentId
interface UpdateStudentRequest {
  status?: StudentStatus;
  tags?: string[];
}

// POST /api/groups/:id/students/bulk
interface BulkStudentActionRequest {
  studentIds: string[];
  action: 'activate' | 'deactivate' | 'remove' | 'tag';
  data?: any;
}

// PATCH /api/groups/:id/settings
interface UpdateGroupSettingsRequest {
  settings: Partial<GroupData['settings']>;
}

// GET /api/groups/:id/export?format=csv|xlsx|pdf
// Экспорт данных группы
```

Контракт GRP-001 определяет полную спецификацию для страницы группы с фокусом на управление учениками, аналитику прогресса и расширенную функциональность для учителей.