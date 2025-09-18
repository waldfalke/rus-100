# Feature Contract: RES-001 Results Page

**Version:** 1.0
**Date:** 2025-01-25
**Author:** Claude 4 Sonnet

## 1. Overview

**ID:** RES-001
**Name:** Results Page (Страница результатов)
**Description:** Страница для просмотра и анализа результатов тестирования учеников. Предоставляет детальную аналитику по группам, отдельным ученикам, тестам и временным периодам с возможностью экспорта данных и генерации отчетов.
**Target Users:**
  - Учитель (основной пользователь)
  - Администратор (с расширенными правами)
  - Ученик (ограниченный доступ к собственным результатам)

## 2. Data Structure

Ожидаемая структура данных для страницы:

```typescript
// Тип результата теста
type TestResultType = 'completed' | 'in_progress' | 'not_started' | 'failed';

// Детальный результат ответа на вопрос
interface QuestionResult {
  questionId: string;
  questionText: string;
  questionType: 'multiple_choice' | 'text' | 'essay' | 'matching';
  studentAnswer: string | string[]; // Ответ ученика
  correctAnswer: string | string[]; // Правильный ответ
  isCorrect: boolean;
  points: number; // Баллы за вопрос
  maxPoints: number; // Максимальные баллы
  timeSpent: number; // Время на вопрос в секундах
}

// Детальный результат теста
interface DetailedTestResult {
  id: string;
  testId: string;
  testName: string;
  studentId: string;
  studentName: string;
  groupId: string;
  groupName: string;
  status: TestResultType;
  score: number; // Итоговый балл 0-100
  maxScore: number;
  pointsEarned: number; // Заработанные баллы
  totalPoints: number; // Максимальные баллы
  percentage: number; // Процент правильных ответов
  startedAt: string; // ISO date string
  completedAt?: string; // ISO date string
  timeSpent: number; // Общее время в секундах
  attempts: number; // Номер попытки
  questionResults: QuestionResult[];
  feedback?: string; // Обратная связь от учителя
  tags: string[]; // Теги для категоризации
}

// Агрегированная статистика по тесту
interface TestStatistics {
  testId: string;
  testName: string;
  totalAttempts: number;
  completedAttempts: number;
  averageScore: number;
  medianScore: number;
  highestScore: number;
  lowestScore: number;
  averageTimeSpent: number;
  passRate: number; // Процент прошедших тест
  difficultyLevel: 'easy' | 'medium' | 'hard'; // Автоматически определяется
  questionStatistics: {
    questionId: string;
    correctAnswersRate: number; // Процент правильных ответов
    averageTimeSpent: number;
    difficultyRating: number; // 1-5
  }[];
}

// Статистика по ученику
interface StudentStatistics {
  studentId: string;
  studentName: string;
  groupId: string;
  groupName: string;
  totalTests: number;
  completedTests: number;
  averageScore: number;
  bestScore: number;
  worstScore: number;
  totalTimeSpent: number;
  averageTimePerTest: number;
  improvementTrend: 'improving' | 'declining' | 'stable';
  strongAreas: string[]; // Области, где ученик показывает хорошие результаты
  weakAreas: string[]; // Области для улучшения
  lastActivity: string; // ISO date string
}

// Фильтры для результатов
interface ResultsFilters {
  dateRange: {
    from: string; // ISO date string
    to: string; // ISO date string
  };
  groups: string[]; // ID выбранных групп
  students: string[]; // ID выбранных учеников
  tests: string[]; // ID выбранных тестов
  status: TestResultType | 'all';
  scoreRange: [number, number]; // Диапазон баллов 0-100
  tags: string[]; // Фильтр по тегам
  sortBy: 'date' | 'score' | 'time' | 'student' | 'test';
  sortOrder: 'asc' | 'desc';
  showOnlyLatestAttempts: boolean;
}

// Данные для экспорта
interface ExportData {
  format: 'csv' | 'xlsx' | 'pdf';
  includeDetails: boolean;
  includeStatistics: boolean;
  includeCharts: boolean;
  filters: ResultsFilters;
}

// Основные данные страницы результатов
interface ResultsPageData {
  results: DetailedTestResult[];
  testStatistics: TestStatistics[];
  studentStatistics: StudentStatistics[];
  filters: ResultsFilters;
  availableGroups: { id: string; name: string }[];
  availableTests: { id: string; name: string }[];
  availableStudents: { id: string; name: string; groupId: string }[];
  isLoading: boolean;
  error?: string;
  viewMode: 'table' | 'cards' | 'analytics';
  selectedResults: string[]; // Выбранные результаты для bulk операций
}
```

## 3. Page Structure and Layout

Страница использует стандартный layout с навигацией. Основной контент организован в табы с различными представлениями данных.

**Общая структура:**

1. **Header Section:**
   - Заголовок "Результаты тестирования"
   - Краткая статистика: общее количество результатов, средний балл, активность
   - Кнопки: Экспорт, Настройки отчетов

2. **Filters Panel:**
   - Расширенная панель фильтрации
   - Быстрые фильтры: Последние 7 дней, Последний месяц, Все время
   - Детальные фильтры: группы, ученики, тесты, даты, баллы
   - Сохраненные фильтры

3. **View Mode Selector:**
   - Переключатель между режимами: Таблица, Карточки, Аналитика
   - Настройки отображения для каждого режима

4. **Main Content Area:**
   - **Table View:** Детальная таблица результатов с сортировкой
   - **Cards View:** Карточки результатов с ключевой информацией
   - **Analytics View:** Графики, диаграммы и статистические данные

5. **Sidebar (опционально):**
   - Быстрая статистика
   - Фильтры по категориям
   - Недавние отчеты

**Responsive Layout:**
- Desktop: Полная функциональность с sidebar
- Tablet: Адаптивные табы и collapsible фильтры
- Mobile: Стековая компоновка, drawer для фильтров

## 4. Component Breakdown

### 4.1 Existing Components to Use

- **Layout:** Стандартный layout с `TopNavBlock`
- **Card (`@/components/ui/card`):** Для карточек результатов и статистики
- **Button (`@/components/ui/button`):** Все кнопки действий
- **Input (`@/components/ui/input`):** Поиск и формы
- **Select (`@/components/ui/select`):** Фильтры и сортировка
- **Badge (`@/components/ui/badge`):** Статусы и теги
- **Table (`@/components/ui/table`):** Табличное отображение результатов
- **Checkbox (`@/components/ui/checkbox`):** Множественный выбор
- **DatePicker (`@/components/ui/date-picker`):** Выбор диапазона дат
- **Slider (`@/components/ui/slider`):** Фильтры по диапазонам
- **Progress (`@/components/ui/progress`):** Прогресс-бары
- **Tabs (`@/components/ui/tabs`):** Переключение между режимами
- **DropdownMenu (`@/components/ui/dropdown-menu`):** Меню действий
- **Icons (`lucide-react`):**
  - `BarChart3`: Аналитика
  - `Download`: Экспорт
  - `Filter`: Фильтры
  - `Search`: Поиск
  - `Calendar`: Даты
  - `TrendingUp`: Тренды
  - `Award`: Результаты
  - `Clock`: Время

### 4.2 New Components to Develop

- **`ResultsPage` (`app/results/page.tsx`):**
  - **Ответственность:** Основной компонент страницы результатов, управление состоянием, координация между компонентами
  - **Props:** Получает данные через server components или API

- **`ResultsHeader`:**
  - **Ответственность:** Заголовок страницы с общей статистикой и основными действиями
  - **Расположение:** `components/results/ResultsHeader.tsx`
  - **Props:** `stats: { totalResults: number; averageScore: number; recentActivity: number }, onExport: () => void`

- **`ResultsFiltersPanel`:**
  - **Ответственность:** Расширенная панель фильтрации результатов
  - **Расположение:** `components/results/ResultsFiltersPanel.tsx`
  - **Props:** `filters: ResultsFilters, availableOptions: { groups, students, tests }, onFiltersChange: (filters: ResultsFilters) => void`

- **`ViewModeSelector`:**
  - **Ответственность:** Переключатель между режимами отображения
  - **Расположение:** `components/results/ViewModeSelector.tsx`
  - **Props:** `viewMode: 'table' | 'cards' | 'analytics', onViewModeChange: (mode) => void`

- **`ResultsTable`:**
  - **Ответственность:** Табличное отображение результатов с сортировкой и выбором
  - **Расположение:** `components/results/ResultsTable.tsx`
  - **Props:** `results: DetailedTestResult[], selectedResults: string[], onSelect: (ids: string[]) => void, onSort: (field: string, order: 'asc' | 'desc') => void`

- **`ResultCard`:**
  - **Ответственность:** Карточка отдельного результата теста
  - **Расположение:** `components/results/ResultCard.tsx`
  - **Props:** `result: DetailedTestResult, isSelected: boolean, onSelect: (id: string) => void, onViewDetails: (id: string) => void`

- **`ResultsGrid`:**
  - **Ответственность:** Grid отображение карточек результатов
  - **Расположение:** `components/results/ResultsGrid.tsx`
  - **Props:** `results: DetailedTestResult[], selectedResults: string[], onSelect: (ids: string[]) => void`

- **`AnalyticsView`:**
  - **Ответственность:** Аналитическое представление с графиками и статистикой
  - **Расположение:** `components/results/AnalyticsView.tsx`
  - **Props:** `testStatistics: TestStatistics[], studentStatistics: StudentStatistics[], filters: ResultsFilters`

- **`ResultDetailsModal`:**
  - **Ответственность:** Модальное окно с детальной информацией о результате
  - **Расположение:** `components/results/ResultDetailsModal.tsx`
  - **Props:** `result: DetailedTestResult, isOpen: boolean, onClose: () => void`

- **`ExportModal`:**
  - **Ответственность:** Модальное окно для настройки экспорта данных
  - **Расположение:** `components/results/ExportModal.tsx`
  - **Props:** `exportData: ExportData, isOpen: boolean, onClose: () => void, onExport: (data: ExportData) => void`

- **`StatisticsCards`:**
  - **Ответственность:** Карточки с ключевой статистикой
  - **Расположение:** `components/results/StatisticsCards.tsx`
  - **Props:** `statistics: { tests: TestStatistics[], students: StudentStatistics[] }`

- **`TrendChart`:**
  - **Ответственность:** График трендов результатов во времени
  - **Расположение:** `components/results/TrendChart.tsx`
  - **Props:** `data: { date: string; averageScore: number; testsCount: number }[], timeRange: string`

## 5. Styling and Theming

- Используется **Tailwind CSS** и shadcn/ui дизайн-система
- **Grid Layout для карточек:** `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`
- **Карточки результатов:**
  - Компактный дизайн с ключевой информацией
  - Цветовое кодирование по баллам (зеленый > 80%, желтый 60-80%, красный < 60%)
  - Hover эффекты и selection состояния
- **Таблица результатов:**
  - Sticky header для больших списков
  - Zebra striping для лучшей читаемости
  - Responsive columns с приоритетами
- **Аналитические компоненты:**
  - Современные графики с использованием Chart.js или Recharts
  - Консистентная цветовая палитра
  - Интерактивные элементы с tooltips
- **Цветовая схема статусов:**
  - Completed: `text-green-600 bg-green-50`
  - In Progress: `text-blue-600 bg-blue-50`
  - Not Started: `text-gray-600 bg-gray-50`
  - Failed: `text-red-600 bg-red-50`

## 6. Interaction and Behavior

### 6.1 Data Loading
- **Initial Load:** Загрузка результатов с базовыми фильтрами
- **Lazy Loading:** Подгрузка дополнительных данных при скролле
- **Real-time Updates:** Обновление результатов при завершении новых тестов

### 6.2 User Interactions
- **Filtering:**
  - Multi-select фильтры с поиском
  - Date range picker для временных диапазонов
  - Quick filters для часто используемых периодов
- **Sorting:**
  - Клик по заголовкам таблицы для сортировки
  - Множественная сортировка с приоритетами
- **Selection:**
  - Checkbox selection для bulk операций
  - Shift+Click для диапазонного выбора
- **Details View:**
  - Клик по результату → модальное окно с деталями
  - Drill-down в аналитике для детального анализа

### 6.3 State Management
- **Local State:** Фильтры, выбранные результаты, режим отображения
- **URL State:** Синхронизация фильтров с URL для sharing
- **Server State:** Кэширование результатов с smart invalidation
- **Persistent State:** Сохранение пользовательских настроек

### 6.4 Export and Reporting
- **Multiple Formats:** CSV, Excel, PDF экспорт
- **Customizable Reports:** Выбор включаемых данных
- **Scheduled Reports:** Автоматическая генерация отчетов
- **Email Delivery:** Отправка отчетов по email

## 7. Accessibility and Performance

### 7.1 Accessibility
- **Keyboard Navigation:** Полная поддержка keyboard shortcuts
- **Screen Readers:** ARIA labels для всех интерактивных элементов
- **High Contrast:** Поддержка режима высокой контрастности
- **Focus Management:** Логичный порядок табуляции

### 7.2 Performance
- **Virtualization:** Для больших таблиц результатов
- **Pagination:** Server-side пагинация для оптимизации
- **Memoization:** React.memo для компонентов результатов
- **Debouncing:** Поисковые запросы и фильтрация
- **Chart Optimization:** Lazy loading графиков и оптимизация рендеринга

## 8. Security Considerations

- **Data Privacy:** Ограничение доступа к результатам других пользователей
- **Authorization:** Проверка прав доступа на уровне API
- **Input Validation:** Валидация всех фильтров и параметров
- **Export Security:** Ограничения на экспорт чувствительных данных
- **Audit Trail:** Логирование доступа к результатам

## 9. Testing Strategy

### 9.1 Unit Tests
- Тестирование логики фильтрации и сортировки
- Тестирование компонентов с различными данными
- Тестирование экспорта и генерации отчетов

### 9.2 Integration Tests
- Тестирование взаимодействия между компонентами
- Тестирование API интеграции
- Тестирование real-time обновлений

### 9.3 E2E Tests
- Полные пользовательские сценарии анализа результатов
- Тестирование экспорта данных
- Тестирование responsive поведения

## 10. Future Considerations

- **AI-Powered Insights:** Автоматический анализ результатов с рекомендациями
- **Predictive Analytics:** Прогнозирование успеваемости учеников
- **Advanced Visualizations:** 3D графики и интерактивные дашборды
- **Mobile App:** Нативное мобильное приложение для просмотра результатов
- **Integration:** Интеграция с внешними аналитическими системами
- **Collaborative Analysis:** Совместная работа над анализом результатов

## 11. Acceptance Criteria

### Phase 1 - Core Functionality
- [ ] Создан роут `/results` и базовая страница `ResultsPage`
- [ ] Реализованы все основные компоненты: `ResultsTable`, `ResultCard`, `ResultsFiltersPanel`
- [ ] Страница корректно отображает результаты тестов с фильтрацией
- [ ] Реализованы все режимы отображения: table, cards, analytics
- [ ] Работает базовый экспорт данных
- [ ] Responsive дизайн функционирует на всех устройствах

### Phase 2 - Enhanced Analytics
- [ ] Реализованы аналитические графики и статистика
- [ ] Добавлены детальные модальные окна результатов
- [ ] Реализованы bulk операции с результатами
- [ ] Добавлены сохраненные фильтры и настройки
- [ ] Полная accessibility поддержка

### Phase 3 - Advanced Features
- [ ] AI-powered insights и рекомендации
- [ ] Advanced экспорт с кастомизацией
- [ ] Real-time обновления результатов
- [ ] Integration с внешними системами
- [ ] Performance оптимизации для больших датасетов

## 12. API Requirements

```typescript
// GET /api/results?filters=&page=&limit=
interface ResultsResponse {
  results: DetailedTestResult[];
  total: number;
  page: number;
  limit: number;
  statistics: {
    totalResults: number;
    averageScore: number;
    recentActivity: number;
  };
}

// GET /api/results/statistics?filters=
interface StatisticsResponse {
  testStatistics: TestStatistics[];
  studentStatistics: StudentStatistics[];
  trends: {
    date: string;
    averageScore: number;
    testsCount: number;
  }[];
}

// GET /api/results/:id/details
interface ResultDetailsResponse {
  result: DetailedTestResult;
}

// POST /api/results/export
interface ExportRequest {
  format: 'csv' | 'xlsx' | 'pdf';
  filters: ResultsFilters;
  includeDetails: boolean;
  includeStatistics: boolean;
}

// PATCH /api/results/:id/feedback
interface UpdateFeedbackRequest {
  feedback: string;
}

// GET /api/results/filters/options
interface FilterOptionsResponse {
  groups: { id: string; name: string }[];
  students: { id: string; name: string; groupId: string }[];
  tests: { id: string; name: string }[];
  tags: string[];
}
```

Контракт RES-001 определяет полную спецификацию для страницы результатов с фокусом на аналитику, отчетность и детальный анализ данных тестирования.