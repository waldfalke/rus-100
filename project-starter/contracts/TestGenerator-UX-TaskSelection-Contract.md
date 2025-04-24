# UX Контракт: Интерфейс выбора заданий

## Метаданные
- **Версия**: 1.0.0
- **Статус**: В разработке
- **Последнее обновление**: 2023-05-23
- **Последний редактор**: AI

## Назначение
Интерфейс выбора заданий предоставляет учителю возможность просматривать и выбирать задания для включения в тест по русскому языку. Компонент отображает структурированный список заданий с возможностью выбора количества вопросов каждого типа и настройки их сложности.

## Визуальное представление
Интерфейс представляет собой иерархический список категорий заданий, каждая из которых может быть развернута или свернута. Внутри категорий располагаются карточки заданий со счетчиками количества и индикаторами сложности. Каждая категория имеет заголовок и кнопку сворачивания/разворачивания.

Основные визуальные элементы используют следующие Tailwind классы:
- Контейнер категории: `bg-white rounded-lg p-4 shadow-sm my-4`
- Заголовок категории: `font-semibold text-lg text-gray-800 flex items-center justify-between cursor-pointer`
- Карточка задания: `bg-white p-3 rounded border border-gray-200 flex justify-between items-center my-2`
- Счетчик заданий: `flex items-center space-x-2`
- Кнопки +/-: `w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300`

## Состояния
- **Заголовок категории — обычное**: `font-semibold text-lg text-gray-800`
- **Заголовок категории — при наведении**: `hover:text-gray-600`
- **Кнопка разворачивания — свернуто**: Отображается иконка ChevronDown
- **Кнопка разворачивания — развернуто**: Отображается иконка ChevronUp
- **Кнопка + — обычное**: `bg-gray-200 hover:bg-gray-300`
- **Кнопка + — отключенное**: `bg-gray-200 opacity-50 cursor-not-allowed`
- **Кнопка - — обычное**: `bg-gray-200 hover:bg-gray-300`
- **Кнопка - — отключенное**: `bg-gray-200 opacity-50 cursor-not-allowed`
- **Индикатор сложности — легкий**: `bg-green-100 text-green-800`
- **Индикатор сложности — сложный**: `bg-red-100 text-red-800`
- **Индикатор сложности — оба**: `bg-blue-100 text-blue-800`

## Поведение
- Клик по заголовку категории или иконке разворачивает/сворачивает список заданий в категории
- Нажатие кнопки "+" увеличивает количество заданий данного типа на 1 (до максимального значения)
- Нажатие кнопки "-" уменьшает количество заданий данного типа на 1 (до 0)
- При достижении максимального количества заданий кнопка "+" становится неактивной
- При достижении 0 заданий кнопка "-" становится неактивной
- Выбор уровня сложности переключается между опциями (легкие/сложные/оба)
- При любом изменении обновляется общий счетчик выбранных заданий

## Доступность
- Кнопки имеют aria-label для описания их действия (`aria-label="Увеличить количество"`, `aria-label="Уменьшить количество"`)
- Заголовки категорий имеют `aria-expanded="true/false"` для индикации состояния разворачивания
- Счетчики заданий имеют `role="status"` и `aria-live="polite"` для уведомления об изменениях
- Состояние "отключено" для кнопок обозначается атрибутом `disabled`
- Интерактивные элементы имеют видимое состояние фокуса

## Адаптивность
- На мобильных устройствах заголовки категорий используют `text-base` вместо `text-lg`
- На мобильных устройствах карточки заданий переключаются на вертикальное расположение элементов
- Прогресс-бар и элементы управления сохраняют работоспособность на всех размерах экрана
- Использование `flex-wrap` для корректного отображения на узких экранах

## Примеры использования
```jsx
// Пример разметки категории с заданиями
<div className="bg-white rounded-lg p-4 shadow-sm my-4">
  <div 
    className="font-semibold text-lg text-gray-800 flex items-center justify-between cursor-pointer"
    onClick={() => toggleCategory(category.category)}
    aria-expanded={expandedCategories[category.category]}
  >
    <span>{category.category}</span>
    {expandedCategories[category.category] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
  </div>
  
  {expandedCategories[category.category] && (
    <div className="mt-3">
      {category.items.map((item) => (
        <div 
          key={item.id}
          className="bg-white p-3 rounded border border-gray-200 flex justify-between items-center my-2"
        >
          <div className="flex-1">
            <h3 className="font-medium text-gray-800">{item.title}</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
              onClick={() => handleCountChange(item.id, category.category, -1, "tasks")}
              disabled={item.count === 0}
              aria-label="Уменьшить количество"
            >
              <span className="text-gray-600">-</span>
            </button>
            <span 
              className="w-6 text-center font-medium"
              role="status"
              aria-live="polite"
            >
              {item.count}
            </span>
            <button 
              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
              onClick={() => handleCountChange(item.id, category.category, 1, "tasks")}
              disabled={item.count === item.maxCount}
              aria-label="Увеличить количество"
            >
              <span className="text-gray-600">+</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
```

## Предусловия и постусловия
- **Предусловия**: 
  - Должны быть доступны данные о заданиях в структурированном виде
  - Компонент должен знать текущее состояние счетчиков для каждого задания
  - Должны быть определены функции обработки изменений

- **Постусловия**:
  - Выбранные задания и их количество сохраняются в состоянии
  - Общий счетчик заданий обновляется
  - Визуальные индикаторы отражают текущее состояние выбора

## Инварианты
- Количество заданий не может быть отрицательным
- Количество заданий не может превышать установленный максимум
- Общее количество выбранных заданий не может превышать 50
- Состояние разворачивания категорий сохраняется до явного изменения
- Каждое задание должно иметь уникальный идентификатор
- Все интерактивные элементы должны быть доступны с клавиатуры 