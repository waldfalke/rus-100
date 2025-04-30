# Контракт: Модернизация TaskCardBlock компонента (B-версия)

## Метаданные
- **Версия**: 1.0.0
- **Статус**: Проект
- **Последнее обновление**: 2023-06-10
- **Ответственный**: AI-Claude

## Назначение
Определяет структуру и поведение модернизированной версии компонента TaskCardBlock в соответствии с современным дизайном, представленным в TaskCardBlockB.stories.tsx. Контракт устанавливает правила отображения карточек заданий с категориями и уровнями сложности.

## ⚠️ Требование соответствия эталону

**ВАЖНО**: Реализация TaskCardBlock и SelectionDropdown ДОЛЖНА в точности соответствовать вариантам, представленным в TaskCardBlockB.stories.tsx. Любые отклонения от этого эталона недопустимы.

1. **TaskCardBlock** должен быть полностью обновлен в соответствии с интерфейсом и поведением из TaskCardBlockB.stories.tsx.
2. **SelectionDropdown** должен использовать API и визуальное представление, реализованное в историях.
3. Любая кастомизация или "улучшения" вне рамок существующего решения в историях запрещены без отдельного согласования.
4. Существующая реализация TaskCardBlock должна быть полностью замещена новой, соответствующей данному контракту.

## Пререквизиты
- Существующий компонент TaskCardBlock
- Компонент SelectionDropdown для отображения выпадающих меню
- Badge компонент для отображения чипов категорий и сложности
- Система отображения счетчиков заданий для контроля количества

## Интерфейс компонента

```typescript
export interface TaskCardBlockProps {
  // Информация о задании
  item: {
    id: string;
    title: string;
    description: string;
    url?: string;
  };

  // Счетчик заданий
  currentCount: number;
  maxCount: number;
  onDecrement: () => void;
  onIncrement: () => void;

  // Выбор категорий
  categories: string[];
  onCategoriesChange: (id: string, categories: string[]) => void;
  categoryDropdown?: React.ReactNode;

  // Выбор сложности
  difficulties: string[];
  onDifficultyChange: (difficultyId: string) => void;
  difficultyTiers: { id: string; label: string }[];
  itemStats?: Record<string, number>;
  difficultyDropdown?: React.ReactNode;

  // Дополнительные настройки
  layout?: "auto" | "vertical" | "horizontal";
  controlsClassName?: string;
  onSolveClick?: (id: string) => void;
}
```

## Варианты компонента

1. **FullCard_B**
   - **Условия**: Задание имеет номер (извлекается из `item.title` с помощью regex `/№\s*(\d+)/`) И имеет статистику сложности (`itemStats`)
   - **Отображение**: Показывает как выбор категорий, так и выбор сложности

2. **OnlyDifficulty_B**
   - **Условия**: Задание НЕ имеет номер, но имеет статистику сложности
   - **Отображение**: Показывает только выбор сложности, без категорий

3. **Minimal_B**
   - **Условия**: Задание не имеет ни номера, ни статистики сложности
   - **Отображение**: Показывает только базовую карточку с заголовком и счетчиком

## Логика определения варианта

```javascript
const taskNumber = item.title.match(/№\s*(\d+)/)?.[1];
const hasTaskNumber = !!taskNumber;
const hasDifficultyStats = !!itemStats;

let cardVariant;
if (hasTaskNumber && hasDifficultyStats) {
  cardVariant = 'FullCard_B';
} else if (!hasTaskNumber && hasDifficultyStats) {
  cardVariant = 'OnlyDifficulty_B';
} else {
  cardVariant = 'Minimal_B';
}
```

## Результаты

1. **Унифицированное отображение карточек** заданий в системе с современным дизайном
2. **Консистентный пользовательский опыт** при выборе категорий и сложности заданий
3. **Адаптивный интерфейс**, корректно работающий на мобильных устройствах и десктопе
4. **Повышение юзабилити** за счет визуализации статистики сложности заданий

## Инварианты

1. **Порядок элементов**: Текст задания → категории → сложность → счетчик
2. **Инкапсуляция данных**: Компонент не обрабатывает бизнес-логику, а только отображает данные и вызывает колбэки
3. **Адаптивность**: На мобильных устройствах контролы выстраиваются вертикально, на десктопе - горизонтально
4. **Доступность**: Все интерактивные элементы должны быть доступны с клавиатуры

## Взаимодействие с другими компонентами

1. **SelectionDropdown**: Используется для создания выпадающих списков категорий и сложности
   - Передается через пропсы `difficultyDropdown` и `categoryDropdown`
   - При отсутствии этих пропсов используются встроенные представления

2. **TaskCategorySelector**: Запасной вариант для выбора категорий, если не предоставлен `categoryDropdown`
   - Используется только в случае наличия номера задания (`taskNumber`)

3. **Badge** и **Card**: Базовые UI компоненты для визуализации карточки и чипов

## План миграции

1. **Анализ существующей реализации**
   - Изучение `TaskCardBlockB.stories.tsx` как эталонной реализации
   - Идентификация всех отличий от текущих компонентов

2. **Обновление компонентов**
   - Обновление `TaskCardBlock.tsx` в соответствии с новым интерфейсом и реализацией
   - Возможное создание/обновление `SelectionDropdown.tsx` для соответствия используемому в историях

3. **Проверка совместимости**
   - Тестирование на всех существующих страницах и в разных контекстах
   - Отладка возможных проблем без изменения основной концепции

4. **Удаление устаревших компонентов**
   - Удаление старых историй `TaskCardBlockA.stories.tsx` и `TaskCardBlock.stories.tsx`
   - Удаление неиспользуемых вспомогательных компонентов и функций

5. **Документация**
   - Обновление документации для отражения новой архитектуры
   - Создание руководства по миграции для разработчиков

## Пример использования

### 1. Создание выпадающего списка сложности
```tsx
const difficultyDropdown = (
  <SelectionDropdown
    options={difficultyTiers.map(tier => ({
      id: tier.id,
      label: tier.label,
      count: itemStats[tier.id] || 0
    }))}
    selected={difficulties}
    onChange={setDifficulties}
    label="Сложность"
    allLabel="любая сложность"
    totalCount={Object.values(itemStats).reduce((sum, count) => sum + count, 0)}
  />
);
```

### 2. Создание выпадающего списка категорий
```tsx
const categoryDropdown = (
  <SelectionDropdown
    options={availableCategories.map(cat => ({
      id: cat,
      label: cat
    }))}
    selected={categories}
    onChange={setCategories}
    label="Категории"
    allLabel="все категории"
  />
);
```

### 3. Использование TaskCardBlock
```tsx
<TaskCardBlock
  item={{
    id: "1",
    title: "№1. Средства связи предложений в тексте",
    description: "Выберите категорию средств связи"
  }}
  currentCount={3}
  maxCount={20}
  onDecrement={() => setCount(prev => Math.max(0, prev - 1))}
  onIncrement={() => setCount(prev => Math.min(20, prev + 1))}
  categories={selectedCategories}
  onCategoriesChange={(id, categories) => setSelectedCategories(categories)}
  difficulties={selectedDifficulties}
  onDifficultyChange={(id) => handleDifficultyChange(id)}
  difficultyTiers={difficultyTiers}
  itemStats={itemStats}
  difficultyDropdown={difficultyDropdown}
  categoryDropdown={categoryDropdown}
/>
```

## Проверка реализации

1. Компонент корректно определяет и отображает нужный вариант карточки
2. Чипы сложности отображают корректные счетчики из `itemStats`
3. Компонент правильно отображается на мобильных устройствах и десктопе
4. Все интерактивные элементы работают согласно ожиданиям
5. Стилизация соответствует дизайн-системе проекта

## Связанные контракты
- [SelectionDropdown Component Contract](./SelectionDropdown-contract.md)
- [TestGenerator-UI-Contract](./TestGenerator-UI-Contract.md)
- [Badge Component Contract](./Badge-contract.md)

## Зависимые компоненты
- `app/page.tsx`: Использует TaskCardBlock для отображения карточек заданий
- `TaskCardBlockB.stories.tsx`: Содержит истории для демонстрации вариантов компонента 