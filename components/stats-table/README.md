# ResponsiveStatsTable - Atomic Design Architecture

## Обзор

Адаптивная таблица статистики, реструктурированная с использованием методологии Atomic Design. Монолитный компонент (917 строк) разбит на модульную архитектуру с четким разделением ответственности.

## Структура проекта

```
components/stats-table/
├── atoms/                          # Базовые неделимые компоненты
│   ├── SortIcon.tsx                # Иконка сортировки (3 состояния)
│   ├── StudentInfo.tsx             # Блок с именем и email студента
│   ├── TableCell.tsx               # Ячейка таблицы с tooltip
│   └── TableHeader.tsx             # Заголовок колонки с сортировкой
│
├── molecules/                      # Композитные компоненты
│   ├── GroupHeader.tsx             # Заголовок группы с collapse/expand
│   ├── StudentRow.tsx              # Строка данных студента
│   └── TotalsRow.tsx               # Строка итогов (средние значения)
│
├── organisms/                      # Сложные компоненты
│   ├── DesktopStatsTable.tsx       # Десктопная версия таблицы
│   └── MobileStatsTable.tsx        # Мобильная версия (A'/A'' паттерн)
│
├── hooks/                          # Кастомные React хуки
│   ├── useTableSort.ts             # Логика сортировки
│   ├── useGroupCollapse.ts         # Управление collapsed группами
│   ├── useScrollSync.ts            # Синхронизация горизонтального скролла
│   └── useColumnWidths.ts          # Синхронизация ширины колонок
│
├── utils/                          # Утилиты и хелперы
│   └── formatters.ts               # Форматирование значений, CSS классы
│
├── ResponsiveStatsTableOrganism.tsx  # Главный координатор
├── types.ts                          # TypeScript интерфейсы
├── index.ts                          # Публичный API
├── responsive-stats-table.css        # Стили с design tokens
└── README.md                         # Эта документация
```

## Использование

### Базовое использование

```tsx
import { ResponsiveStatsTable } from '@/components/stats-table'
import type { StudentData, StatColumn } from '@/components/stats-table'

const students: StudentData[] = [
  { id: '1', name: 'Иван Петров', email: 'ivan@example.com' },
  { id: '2', name: 'Мария Сидорова', email: 'maria@example.com' }
]

const columns: StatColumn[] = [
  { key: 'task1', label: 'Задание 1', type: 'score' },
  { key: 'task2', label: 'Задание 2', type: 'percentage' }
]

const data = {
  '1': { task1: 85, task2: 92 },
  '2': { task1: 78, task2: 88 }
}

export function MyComponent() {
  return (
    <ResponsiveStatsTable
      students={students}
      columns={columns}
      data={data}
    />
  )
}
```

### С группами колонок

```tsx
import { ResponsiveStatsTable } from '@/components/stats-table'
import type { ColumnGroup } from '@/components/stats-table'

const columnGroups: ColumnGroup[] = [
  {
    name: 'Работа с текстом',
    key: 'text-work',
    columns: [
      { key: 'text-total', label: 'Всего', type: 'score' },
      { key: 'task1', label: '#1', type: 'score' },
      { key: 'task2', label: '#2', type: 'score' }
    ]
  },
  {
    name: 'Орфография',
    key: 'spelling',
    columns: [
      { key: 'spelling-total', label: 'Всего', type: 'score' },
      { key: 'task9', label: '#9', type: 'score' },
      { key: 'task10', label: '#10', type: 'score' }
    ]
  }
]

<ResponsiveStatsTable
  students={students}
  columnGroups={columnGroups}
  data={data}
/>
```

### С детальной информацией о заданиях

```tsx
import type { TaskDetails } from '@/components/stats-table'

const data = {
  '1': {
    task1: {
      taskName: 'Орфоэпические нормы',
      questionsCompleted: 15,
      questionsTotal: 20,
      successRate: 85,
      score: 17,
      maxScore: 20,
      date: '2024-01-15'
    } as TaskDetails
  }
}

// При наведении на ячейку покажется детальная информация
<ResponsiveStatsTable students={students} columns={columns} data={data} />
```

## API

### ResponsiveStatsTableProps

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `students` | `StudentData[]` | обязательно | Массив студентов |
| `columns` | `StatColumn[]` | `[]` | Колонки (если нет `columnGroups`) |
| `columnGroups` | `ColumnGroup[]` | `undefined` | Группы колонок с collapse/expand |
| `data` | `Record<string, StatData>` | обязательно | Данные студентов по ID |
| `stickyStudent` | `boolean` | `true` | Зафиксировать колонку студента |
| `onCellClick` | `function` | `undefined` | Callback при клике на ячейку |
| `className` | `string` | `''` | Дополнительные CSS классы |

### StudentData

```tsx
interface StudentData {
  id: string
  name: string
  email: string
  avatar?: string
}
```

### StatColumn

```tsx
interface StatColumn {
  key: string                        // Ключ для доступа к данным
  label: string                      // Отображаемое название
  type: 'score' | 'percentage' | 'count' | 'text'
  format?: (value: any) => string   // Кастомное форматирование
  sortable?: boolean                 // Можно ли сортировать (по умолчанию true)
}
```

### ColumnGroup

```tsx
interface ColumnGroup {
  name: string          // Название группы
  key: string           // Уникальный ключ
  columns: StatColumn[] // Колонки в группе
  collapsed?: boolean   // Начальное состояние (свернута/развернута)
}
```

### TaskDetails

```tsx
interface TaskDetails {
  taskName: string           // Название задания
  questionsCompleted: number // Выполнено вопросов
  questionsTotal: number     // Всего вопросов
  successRate: number        // Процент успеха
  score: number              // Результат (баллы)
  maxScore: number           // Максимальный балл
  date: string               // Дата выполнения
}
```

## Архитектурные решения

### Atomic Design

**Atoms (Атомы)** - Базовые неделимые компоненты:
- Не содержат бизнес-логику
- Получают все данные через props
- Переиспользуемы в любом контексте
- Примеры: `SortIcon`, `TableCell`

**Molecules (Молекулы)** - Композитные компоненты:
- Группа атомов с локальной логикой
- Решают конкретную задачу
- Примеры: `StudentRow`, `TotalsRow`

**Organisms (Организмы)** - Сложные компоненты:
- Координируют несколько молекул
- Содержат бизнес-логику
- Примеры: `DesktopStatsTable`, `MobileStatsTable`

### Разделение логики

**Hooks** - Изолированная логика без UI:
- `useTableSort` - сортировка данных
- `useGroupCollapse` - управление collapsed состоянием
- `useScrollSync` - синхронизация скролла
- `useColumnWidths` - синхронизация ширины колонок

**Utils** - Чистые функции:
- `formatValue` - форматирование значений
- `getCellClassName` - вычисление CSS классов
- `extractNumericValue` - извлечение числовых значений

### Преимущества

✅ **Модульность**: Легко найти нужный компонент
✅ **Переиспользуемость**: Атомы и молекулы работают независимо
✅ **Тестируемость**: Каждый компонент легко изолировать
✅ **Maintainability**: Изменения локализованы в одном месте
✅ **Type Safety**: Все типы в одном файле `types.ts`
✅ **Design Tokens**: CSS использует переменные вместо hardcoded значений

## Адаптивность

### Десктопная версия (> 768px)

- Обычная HTML таблица
- Sticky заголовки и колонка студента
- Синхронизация ширины колонок между header и body
- Полноэкранный режим (кнопка Maximize)
- Группировка колонок с collapse/expand

### Мобильная версия (≤ 768px)

- **A'/A'' паттерн**:
  - A' - фиксированная строка с именем студента
  - A'' - скроллируемая строка с данными
- Синхронизация горизонтального скролла между строками
- Компактное отображение (100px на колонку)

## CSS и Design Tokens

CSS файл использует CSS-переменные:

```css
/* Вместо hardcoded значений */
padding: var(--spacing-3, 12px) var(--spacing-4, 16px);
font-size: var(--font-size-sm, 0.875rem);
border-radius: var(--radius);

/* Вместо конкретных цветов */
background: hsl(var(--muted));
color: hsl(var(--foreground));
```

Это позволяет:
- Легко менять тему (светлая/темная)
- Унифицировать отступы и размеры
- Поддерживать дизайн-систему проекта

## Миграция со старой версии

Старый импорт продолжает работать:

```tsx
// ✅ Работает (обратная совместимость)
import ResponsiveStatsTable from '@/components/ui/responsive-stats-table'
```

Новый импорт (рекомендуется):

```tsx
// ✅ Рекомендуется (новая структура)
import { ResponsiveStatsTable } from '@/components/stats-table'
```

API компонента **не изменился** - все props работают так же.

## Производительность

- **Мемоизация**: `useMemo` для вычисления totals и sorted students
- **useCallback**: Стабильные ссылки на обработчики
- **Lazy computation**: Вычисления только при изменении зависимостей
- **CSS-оптимизации**: `will-change`, hardware acceleration для sticky элементов

## Разработка

### Добавление нового атома

```tsx
// components/stats-table/atoms/MyAtom.tsx
import * as React from 'react'

interface MyAtomProps {
  // ...
}

export function MyAtom({ ... }: MyAtomProps) {
  return (
    // ...
  )
}
```

### Добавление новой молекулы

```tsx
// components/stats-table/molecules/MyMolecule.tsx
import * as React from 'react'
import { MyAtom } from '../atoms/MyAtom'

export function MyMolecule({ ... }) {
  return (
    <div>
      <MyAtom />
    </div>
  )
}
```

### Добавление нового хука

```tsx
// components/stats-table/hooks/useMyHook.ts
import * as React from 'react'

export function useMyHook(dependencies: any[]) {
  const [state, setState] = React.useState(...)

  // Логика

  return {
    state,
    // ...
  }
}
```

## Тестирование

```tsx
import { render, screen } from '@testing-library/react'
import { ResponsiveStatsTable } from '@/components/stats-table'

test('renders student names', () => {
  const students = [
    { id: '1', name: 'Test Student', email: 'test@example.com' }
  ]

  render(
    <ResponsiveStatsTable
      students={students}
      columns={[]}
      data={{}}
    />
  )

  expect(screen.getByText('Test Student')).toBeInTheDocument()
})
```

## Troubleshooting

### Таблица не отображается

Проверьте:
1. Переданы ли `students`, `columns`/`columnGroups`, `data`
2. Корректны ли ключи в `data` (совпадают с `student.id`)
3. Импортирован ли CSS файл (должен быть автоматически)

### Sticky headers не работают

- Убедитесь, что родительский контейнер не имеет `overflow: hidden`
- Проверьте z-index родительских элементов

### Сортировка не работает

- Проверьте, что `sortable !== false` для колонки
- Убедитесь, что данные корректного типа (число для числовых колонок)

## Лицензия

Часть проекта rus100 - Russian language exam prep platform prototype.
