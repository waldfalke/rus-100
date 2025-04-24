# Компонент Контракт: Карточка задания

## Метаданные
- **Версия**: 1.0.0
- **Статус**: В разработке
- **Последнее обновление**: 2023-05-23
- **Последний редактор**: AI

## Назначение
Компонент карточки задания предоставляет стандартизированное представление для одного задания в генераторе тестов ЕГЭ. Карточка отображает информацию о задании, позволяет регулировать количество вопросов данного типа и настраивать его сложность.

## Визуальное представление
Компонент представлен в виде прямоугольной карточки с заголовком, элементами управления количеством и селектором сложности. Карточка имеет визуальное разграничение от других элементов и ясно отображает текущие настройки.

Основные визуальные элементы используют следующие Tailwind классы:
- Контейнер карточки: `bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-3`
- Заголовок задания: `text-md font-medium text-gray-800`
- Счетчик количества: `flex items-center space-x-2`
- Кнопки управления: `w-8 h-8 rounded-full flex items-center justify-center`
- Индикатор сложности: `mt-2 flex items-center text-sm`

## Состояния
- **Карточка — обычное состояние**: `bg-white border-gray-200`
- **Карточка — при наведении**: `hover:bg-gray-50`
- **Карточка — выбрана**: `border-indigo-300 bg-indigo-50`
- **Кнопка увеличения — активная**: `bg-gray-100 hover:bg-gray-200 text-gray-600`
- **Кнопка увеличения — неактивная**: `bg-gray-100 text-gray-300 cursor-not-allowed`
- **Кнопка уменьшения — активная**: `bg-gray-100 hover:bg-gray-200 text-gray-600`
- **Кнопка уменьшения — неактивная**: `bg-gray-100 text-gray-300 cursor-not-allowed`
- **Индикатор сложности — легкий**: `bg-green-100 text-green-800`
- **Индикатор сложности — сложный**: `bg-red-100 text-red-800`
- **Индикатор сложности — оба уровня**: `bg-blue-100 text-blue-800`

## Поведение
- При клике на кнопку "+" увеличивается счетчик количества заданий данного типа (до максимума)
- При клике на кнопку "-" уменьшается счетчик количества заданий (до 0)
- При достижении максимального количества кнопка "+" становится неактивной
- При достижении 0 заданий кнопка "-" становится неактивной
- При изменении значения счетчика обновляется общий прогресс в родительском компоненте
- Нажатие на селектор сложности циклически меняет уровень сложности (если поддерживается)
- При наведении на карточку отображается дополнительная информация (например, подсказка об ограничениях)

## Пропсы и интерфейсы
```typescript
interface TaskCardProps {
  id: number;               // Уникальный идентификатор задания
  title: string;            // Название задания
  count: number;            // Текущее количество выбранных заданий
  maxCount: number;         // Максимальное количество заданий
  difficulty: "easy" | "hard" | "both" | null;  // Текущий уровень сложности
  difficultyType: "none" | "easy" | "hard" | "both";  // Поддерживаемые типы сложности
  description?: string;     // Опциональное описание задания
  onCountChange: (id: number, increment: number) => void;  // Обработчик изменения количества
  onDifficultyChange?: (id: number, difficulty: "easy" | "hard" | "both" | null) => void;  // Обработчик изменения сложности
}
```

## Доступность
- Кнопки управления имеют явные текстовые метки (`aria-label`)
- Счетчик объявляет изменения через `aria-live="polite"`
- Селектор сложности имеет соответствующий `role` и состояние
- Неактивные элементы управления имеют атрибут `disabled`
- Все интерактивные элементы доступны с клавиатуры и имеют видимый фокус-стейт
- Цветовая индикация дополнена текстовыми метками
- Компонент использует семантическую разметку

## Адаптивность
- На мобильных устройствах элементы управления имеют увеличенную область касания
- На очень узких экранах компонент может перестраиваться в вертикальный формат
- Размер текста адаптируется к размеру экрана, сохраняя читаемость
- Сохраняется минимальное расстояние между интерактивными элементами на всех устройствах

## Примеры использования
```jsx
// Пример использования компонента TaskCard
<TaskCard
  id={1}
  title="№1. Средства связи предложений в тексте"
  count={2}
  maxCount={10}
  difficulty="both"
  difficultyType="both"
  description="Задания на определение средств связи между предложениями"
  onCountChange={(id, increment) => handleCountChange(id, increment)}
  onDifficultyChange={(id, difficulty) => handleDifficultyChange(id, difficulty)}
/>

// Реализация компонента TaskCard
const TaskCard = ({
  id,
  title,
  count,
  maxCount,
  difficulty,
  difficultyType,
  description,
  onCountChange,
  onDifficultyChange
}) => {
  // Получить соответствующую метку сложности
  const getDifficultyLabel = (diff) => {
    switch(diff) {
      case "easy": return "Легкий";
      case "hard": return "Сложный";
      case "both": return "Оба уровня";
      default: return "Не указано";
    }
  };
  
  // Получить стили для метки сложности
  const getDifficultyStyle = (diff) => {
    switch(diff) {
      case "easy": return "bg-green-100 text-green-800";
      case "hard": return "bg-red-100 text-red-800";
      case "both": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-3 hover:bg-gray-50">
      <div className="flex justify-between items-start">
        <h3 className="text-md font-medium text-gray-800">{title}</h3>
        
        {/* Селектор сложности (если поддерживается) */}
        {difficultyType !== "none" && (
          <button
            onClick={() => {
              if (onDifficultyChange) {
                let newDifficulty;
                switch(difficulty) {
                  case "easy": newDifficulty = "hard"; break;
                  case "hard": newDifficulty = "both"; break;
                  case "both": newDifficulty = "easy"; break;
                  default: newDifficulty = "easy";
                }
                onDifficultyChange(id, newDifficulty);
              }
            }}
            className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyStyle(difficulty)}`}
            aria-label={`Изменить сложность. Текущая: ${getDifficultyLabel(difficulty)}`}
          >
            {getDifficultyLabel(difficulty)}
          </button>
        )}
      </div>
      
      {description && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}
      
      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm text-gray-500">Количество:</span>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onCountChange(id, -1)}
            disabled={count === 0}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              count === 0 
                ? 'bg-gray-100 text-gray-300 cursor-not-allowed' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
            aria-label="Уменьшить количество"
          >
            <span>−</span>
          </button>
          
          <span 
            className="w-6 text-center font-medium text-gray-700"
            aria-live="polite"
          >
            {count}
          </span>
          
          <button
            onClick={() => onCountChange(id, 1)}
            disabled={count === maxCount}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              count === maxCount 
                ? 'bg-gray-100 text-gray-300 cursor-not-allowed' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
            aria-label="Увеличить количество"
          >
            <span>+</span>
          </button>
        </div>
      </div>
    </div>
  );
};
```

## Предусловия и постусловия
- **Предусловия**: 
  - Должны быть переданы обязательные пропсы (id, title, count, maxCount, difficultyType, onCountChange)
  - Если difficultyType не 'none', должен быть определен начальный уровень сложности
  - Если difficultyType не 'none', должен быть передан обработчик onDifficultyChange

- **Постусловия**:
  - При изменении count вызывается onCountChange с правильными параметрами
  - При изменении difficulty вызывается onDifficultyChange с правильными параметрами
  - Визуальное отображение соответствует текущему состоянию компонента

## Инварианты
- Счетчик count всегда находится в диапазоне [0, maxCount]
- Если difficultyType равно 'none', селектор сложности не отображается
- Если count равно 0, кнопка уменьшения неактивна
- Если count равно maxCount, кнопка увеличения неактивна
- Текст заголовка не меняется при изменении состояния компонента

## Интеграция с другими компонентами
- **TaskSelection** - содержит и управляет множеством карточек заданий
- **ProgressIndicator** - обновляется при изменении количества заданий в карточке
- **TestGenerator** - получает обновленную информацию о выбранных заданиях

## Связанные контракты
- [TestGenerator Product Contract](./TestGenerator-Product-Contract.md)
- [UX контракт: Выбор заданий](./TestGenerator-UX-TaskSelection-Contract.md)
- [UX контракт: Прогресс-индикатор](./TestGenerator-UX-Progress-Contract.md) 