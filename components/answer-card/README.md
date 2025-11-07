# TestSubmissionCard - Atomic Design Architecture

## Обзор

Карточка уведомления о прохождении теста учеником. Построена по принципам Atomic Design, переиспользует существующие компоненты и паттерны проекта.

## Структура проекта

```
components/answer-card/
├── atoms/                          # Базовые неделимые компоненты
│   ├── StudentAvatar.tsx           # Аватар ученика с инициалами
│   └── ScoreDisplay.tsx            # Отображение значения статистики
│
├── molecules/                      # Композитные компоненты
│   ├── SubmissionHeader.tsx        # Заголовок с инфо об ученике
│   ├── TestInfo.tsx                # Информация о тесте
│   └── SubmissionStats.tsx         # Сетка статистики (4 показателя)
│
├── organisms/                      # Сложные компоненты
│   └── TestSubmissionCardOrganism.tsx  # Основная карточка
│
├── utils/                          # Утилиты
│   └── formatters.ts               # Форматирование дат, инициалов, цветов
│
├── types.ts                        # TypeScript интерфейсы
├── index.ts                        # Публичный API
└── README.md                       # Эта документация
```

## Использование

### Базовое использование

```tsx
import { TestSubmissionCard } from '@/components/answer-card'
import type { TestSubmission } from '@/components/answer-card'

const submission: TestSubmission = {
  id: 'sub-1',
  studentId: 'student-1',
  studentName: 'Анна Петрова',
  studentEmail: 'anna.petrova@example.com',
  testId: 'test-123',
  testTitle: 'Русский язык. Орфография',
  submittedAt: '2024-12-20T14:30:00Z',
  totalQuestions: 25,
  correctAnswers: 21,
  scorePercent: 84
}

export function MyComponent() {
  const handleViewDetails = (submissionId: string) => {
    console.log('Просмотр деталей:', submissionId)
    // Навигация на страницу деталей или открытие модалки
  }

  return (
    <TestSubmissionCard
      submission={submission}
      onViewDetails={handleViewDetails}
    />
  )
}
```

### С списком (лента уведомлений)

```tsx
import { TestSubmissionCard } from '@/components/answer-card'

export function SubmissionsFeed({ submissions }: { submissions: TestSubmission[] }) {
  return (
    <div className="space-y-4">
      {submissions.map((submission) => (
        <TestSubmissionCard
          key={submission.id}
          submission={submission}
          onViewDetails={(id) => router.push(`/submissions/${id}`)}
        />
      ))}
    </div>
  )
}
```

## Интерфейсы

### TestSubmission

```typescript
interface TestSubmission {
  id: string;              // ID прохождения
  studentId: string;       // ID ученика
  studentName: string;     // Имя ученика
  studentEmail: string;    // Email ученика
  testId: string;          // ID теста
  testTitle: string;       // Название теста
  submittedAt: string;     // ISO дата прохождения
  totalQuestions: number;  // Всего вопросов
  correctAnswers: number;  // Правильные ответы
  scorePercent: number;    // Процент (0-100)
}
```

## Переиспользуемые компоненты

Карточка построена на основе существующих компонентов проекта:

- **Avatar** из `@/components/ui/avatar` - для аватара ученика
- **Card** из `@/components/ui/card` - основа карточки
- **Button** из `@/components/ui/button` - кнопка "Посмотреть детали"
- **Паттерн сетки статистики** из `GroupCard` и `StatCard`
- **Стили hover** из `statistics-card`

## Особенности

### Форматирование дат
- До 1 часа: "15 мин назад"
- До 24 часов: "3 ч назад"
- До 7 дней: "2 дн назад"
- Больше недели: "20 дек, 14:30"

### Цвета для баллов
- ≥85%: зеленый (отлично)
- ≥70%: желтый (хорошо)
- ≥50%: оранжевый (средне)
- <50%: красный (плохо)

### Hover эффекты
- Карточка: border-primary + shadow
- Кнопка: bg-primary + text-primary-foreground

## Примеры Mock данных

```typescript
const mockSubmissions: TestSubmission[] = [
  {
    id: 'sub-1',
    studentId: 'student-1',
    studentName: 'Анна Петрова',
    studentEmail: 'anna.petrova@school.ru',
    testId: 'test-101',
    testTitle: 'Орфография: Правописание приставок',
    submittedAt: new Date(Date.now() - 30 * 60000).toISOString(), // 30 мин назад
    totalQuestions: 20,
    correctAnswers: 18,
    scorePercent: 90
  },
  {
    id: 'sub-2',
    studentId: 'student-2',
    studentName: 'Иван Сидоров',
    studentEmail: 'ivan.sidorov@school.ru',
    testId: 'test-102',
    testTitle: 'Пунктуация: Знаки препинания в сложных предложениях',
    submittedAt: new Date(Date.now() - 2 * 3600000).toISOString(), // 2 часа назад
    totalQuestions: 25,
    correctAnswers: 15,
    scorePercent: 60
  }
]
```

## Design Tokens

Компонент использует следующие токены:
- `text-foreground` - основной текст
- `text-muted-foreground` - второстепенный текст
- `bg-muted` - фон статистики
- `border-primary` - border при hover
- `bg-primary` - фон кнопки при hover

---

**Стиль разработки**: Переиспользование существующих паттернов > создание новых компонентов
