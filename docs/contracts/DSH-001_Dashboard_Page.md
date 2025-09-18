# Feature Contract: DSH-001 Dashboard Page

**Version:** 1.0
**Date:** 2025-01-25
**Author:** Claude 4 Sonnet

## 1. Overview

**ID:** DSH-001
**Name:** Dashboard Page (Главная страница)
**Description:** Главная страница приложения для отображения обзора всех групп пользователя с возможностью фильтрации, поиска и быстрых действий. Страница предоставляет централизованный доступ к управлению группами и навигации по основным функциям системы.
**Target Users:**
  - Учитель (основной пользователь)
  - Администратор (с расширенными правами)

## 2. Data Structure

Ожидаемая структура данных для страницы:

```typescript
// Статус группы
type GroupStatus = 'active' | 'archived' | 'draft';

// Быстрое действие для группы
interface QuickAction {
  id: string;
  label: string;
  icon: string; // Lucide icon name
  action: 'view' | 'edit' | 'archive' | 'duplicate' | 'export';
  disabled?: boolean;
}

// Данные группы для карточки
interface GroupCardData {
  id: string;
  name: string; // Название группы
  description?: string; // Описание группы
  studentCount: number; // Количество учеников
  folderCount: number; // Количество папок с тестами
  displayedFolderCount: number; // Количество отображаемых папок
  status: GroupStatus;
  createdAt: string; // ISO date string
  lastActivity?: string; // ISO date string последней активности
  isOwner: boolean; // Является ли текущий пользователь владельцем
  quickActions: QuickAction[];
}

// Фильтры для групп
interface GroupFilters {
  search: string; // Поисковый запрос
  status: GroupStatus | 'all'; // Фильтр по статусу
  sortBy: 'name' | 'created' | 'activity' | 'students'; // Сортировка
  sortOrder: 'asc' | 'desc';
  showArchived: boolean; // Показывать архивные группы
}

// Статистика для дашборда
interface DashboardStats {
  totalGroups: number;
  activeGroups: number;
  totalStudents: number;
  totalTests: number;
  recentActivity: number; // Количество активности за последние 7 дней
}

// Основные данные дашборда
interface DashboardData {
  user: {
    id: string;
    name: string;
    isAdmin: boolean;
  };
  stats: DashboardStats;
  groups: GroupCardData[];
  filters: GroupFilters;
  isLoading: boolean;
  error?: string;
}
```

## 3. Page Structure and Layout

Страница использует стандартный layout приложения с навигацией. Основной контент организован в responsive grid layout.

**Общая структура:**

1. **Header Section:**
   - Заголовок страницы "Мои группы" / "Управление группами" (для админа)
   - Краткая статистика (карточки с ключевыми метриками)
   - Кнопка "Создать группу"

2. **Filter Bar:**
   - Поле поиска с иконкой
   - Фильтры по статусу (Select)
   - Сортировка (Select)
   - Toggle "Показать архивные"
   - Кнопка экспорта (для админа)

3. **Groups Grid:**
   - Responsive grid карточек групп
   - Empty state при отсутствии групп
   - Loading state с skeleton cards
   - Error state при ошибках загрузки

4. **Pagination (если необходимо):**
   - Компонент пагинации для больших списков

**Responsive Layout:**
- Desktop: 3-4 колонки в grid
- Tablet: 2 колонки
- Mobile: 1 колонка

## 4. Component Breakdown

### 4.1 Existing Components to Use

- **Layout:** Стандартный layout с `TopNavBlock` и sidebar
- **Card (`@/components/ui/card`):** Базовый контейнер для `GroupCard` и статистических карточек
- **Button (`@/components/ui/button`):** Для действий создания, фильтрации и быстрых действий
- **Input (`@/components/ui/input`):** Поле поиска в FilterBar
- **Select (`@/components/ui/select`):** Выпадающие списки для фильтров и сортировки
- **Badge (`@/components/ui/badge`):** Статусы групп и счетчики
- **DropdownMenu (`@/components/ui/dropdown-menu`):** Меню быстрых действий в GroupCard
- **Switch (`@/components/ui/switch`):** Toggle для показа архивных групп
- **Skeleton (`@/components/ui/skeleton`):** Loading состояния
- **Icons (`lucide-react`):**
  - `Search`: Поиск
  - `Plus`: Создание группы
  - `Filter`: Фильтры
  - `MoreVertical`: Меню действий
  - `Users`: Ученики
  - `Folder`: Папки
  - `Calendar`: Даты
  - `TrendingUp`: Статистика

### 4.2 New Components to Develop

- **`DashboardPage` (`app/dashboard/page.tsx`):**
  - **Ответственность:** Основной компонент страницы, управление состоянием фильтров, загрузка данных, координация между компонентами
  - **Props:** Получает данные через server components или API

- **`DashboardStats`:**
  - **Ответственность:** Отображение статистических карточек в header секции
  - **Расположение:** `components/dashboard/DashboardStats.tsx`
  - **Props:** `stats: DashboardStats`

- **`GroupsFilterBar`:**
  - **Ответственность:** Панель фильтрации и поиска групп
  - **Расположение:** `components/dashboard/GroupsFilterBar.tsx`
  - **Props:** `filters: GroupFilters, onFiltersChange: (filters: GroupFilters) => void`

- **`GroupCard`:**
  - **Ответственность:** Карточка группы с информацией и быстрыми действиями
  - **Расположение:** `components/dashboard/GroupCard.tsx`
  - **Props:** `group: GroupCardData, onAction: (action: string, groupId: string) => void`

- **`GroupsGrid`:**
  - **Ответственность:** Grid layout для отображения карточек групп с состояниями loading/empty/error
  - **Расположение:** `components/dashboard/GroupsGrid.tsx`
  - **Props:** `groups: GroupCardData[], isLoading: boolean, error?: string`

- **`CreateGroupButton`:**
  - **Ответственность:** Кнопка создания новой группы с модальным окном или навигацией
  - **Расположение:** `components/dashboard/CreateGroupButton.tsx`

## 5. Styling and Theming

- Используется **Tailwind CSS** и shadcn/ui дизайн-система
- **Grid Layout:** `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6`
- **Карточки групп:** 
  - Стандартный Card с `shadow-sm hover:shadow-md` transition
  - Минимальная высота для консистентности
  - Border-left цветовая полоса для статуса группы
- **Статистические карточки:**
  - Компактный размер с иконками
  - Цветовое кодирование по типу метрики
- **Filter Bar:**
  - Горизонтальная компоновка на desktop
  - Вертикальная на mobile с collapsible панелью
- **Цветовая схема статусов:**
  - Active: `border-green-500`
  - Archived: `border-gray-400`
  - Draft: `border-yellow-500`

## 6. Interaction and Behavior

### 6.1 Data Loading
- **Initial Load:** Загрузка данных групп и статистики при монтировании компонента
- **Filtering:** Debounced поиск (300ms), мгновенная фильтрация по статусу
- **Sorting:** Мгновенная пересортировка при изменении параметров

### 6.2 User Interactions
- **Search:** Real-time поиск по названию группы с debounce
- **Filters:** Применение фильтров с сохранением в URL query params
- **Group Actions:**
  - Клик по карточке → переход на страницу группы
  - Dropdown меню → быстрые действия (архивировать, дублировать, экспорт)
- **Create Group:** Открытие модального окна или навигация на страницу создания

### 6.3 State Management
- **Local State:** Фильтры, loading состояния, UI состояния
- **URL State:** Синхронизация фильтров с URL для bookmarking
- **Server State:** Кэширование данных групп с возможностью invalidation

### 6.4 Error Handling
- **Network Errors:** Toast уведомления с retry опцией
- **Empty States:** Дружелюбные сообщения с призывом к действию
- **Loading States:** Skeleton компоненты для плавного UX

## 7. Accessibility and Performance

### 7.1 Accessibility
- **Keyboard Navigation:** Полная поддержка tab navigation
- **Screen Readers:** Proper ARIA labels и semantic HTML
- **Focus Management:** Видимые focus indicators
- **Color Contrast:** WCAG AA compliance через дизайн-токены

### 7.2 Performance
- **Virtualization:** Для больших списков групп (>100 элементов)
- **Lazy Loading:** Изображения и дополнительные данные
- **Memoization:** React.memo для GroupCard компонентов
- **Debouncing:** Поисковые запросы и фильтрация

## 8. Security Considerations

- **Authorization:** Проверка прав доступа к группам на уровне API
- **Data Validation:** Валидация всех пользовательских вводов
- **XSS Prevention:** Санитизация отображаемых данных
- **CSRF Protection:** Токены для всех мутирующих операций

## 9. Testing Strategy

### 9.1 Unit Tests
- Тестирование логики фильтрации и сортировки
- Тестирование компонентов с различными props
- Тестирование обработчиков событий

### 9.2 Integration Tests
- Тестирование взаимодействия между компонентами
- Тестирование API интеграции
- Тестирование навигации и роутинга

### 9.3 E2E Tests
- Полные пользовательские сценарии
- Тестирование responsive поведения
- Тестирование accessibility

## 10. Future Considerations

- **Advanced Filtering:** Фильтры по дате создания, количеству учеников
- **Bulk Operations:** Множественное выделение и групповые действия
- **Analytics:** Интеграция с аналитикой использования
- **Notifications:** Real-time уведомления о изменениях в группах
- **Collaboration:** Функции совместной работы над группами
- **Export/Import:** Расширенные возможности экспорта данных

## 11. Acceptance Criteria

### Phase 1 - Core Functionality
- [ ] Создан роут `/dashboard` и базовая страница `DashboardPage`
- [ ] Реализованы все основные компоненты: `DashboardStats`, `GroupsFilterBar`, `GroupCard`, `GroupsGrid`
- [ ] Страница корректно отображает список групп с фильтрацией и поиском
- [ ] Реализованы все состояния: loading, empty, error
- [ ] Responsive дизайн работает на всех устройствах
- [ ] Базовые быстрые действия функционируют

### Phase 2 - Enhanced UX
- [ ] Реализована пагинация или виртуализация для больших списков
- [ ] Добавлены анимации и transitions
- [ ] Реализовано сохранение фильтров в URL
- [ ] Добавлены keyboard shortcuts для основных действий
- [ ] Полная accessibility поддержка

### Phase 3 - Advanced Features
- [ ] Bulk operations для групп
- [ ] Advanced фильтры и сортировка
- [ ] Real-time обновления
- [ ] Analytics интеграция
- [ ] Performance оптимизации

## 12. API Requirements

```typescript
// GET /api/dashboard
interface DashboardResponse {
  stats: DashboardStats;
  groups: GroupCardData[];
}

// GET /api/groups?search=&status=&sort=&order=
interface GroupsResponse {
  groups: GroupCardData[];
  total: number;
  page: number;
  limit: number;
}

// POST /api/groups
interface CreateGroupRequest {
  name: string;
  description?: string;
}

// PATCH /api/groups/:id
interface UpdateGroupRequest {
  name?: string;
  description?: string;
  status?: GroupStatus;
}

// DELETE /api/groups/:id
// Архивирование группы
```

Контракт DSH-001 определяет полную спецификацию для Dashboard страницы с фокусом на производительность, accessibility и расширяемость.