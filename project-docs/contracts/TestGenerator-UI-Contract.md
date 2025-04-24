# UI Контракт: Генератор тестов по русскому языку

## Метаданные
- **Версия**: 1.0.0
- **Статус**: В разработке
- **Последнее обновление**: 2023-05-23
- **Последний редактор**: AI

## Назначение
Определяет общий дизайн-язык и UI компоненты для генератора тестов по русскому языку, обеспечивая консистентный пользовательский опыт во всех частях приложения.

## Цветовая схема

### Основные цвета
- **Основной (Primary)**: `#4F46E5` (indigo-600)
  - Hover: `#4338CA` (indigo-700)
  - Focus/Active: `#4338CA` (indigo-700)
- **Вторичный (Secondary)**: `#6B7280` (gray-500)
  - Hover: `#4B5563` (gray-600)
  - Focus/Active: `#374151` (gray-700)
- **Акцент (Accent)**: `#8B5CF6` (violet-500)
  - Hover: `#7C3AED` (violet-600)

### Семантические цвета
- **Успех**: `#10B981` (green-500)
  - Фон: `#ECFDF5` (green-50)
  - Граница: `#A7F3D0` (green-200)
- **Предупреждение**: `#F59E0B` (amber-500)
  - Фон: `#FFFBEB` (amber-50)
  - Граница: `#FDE68A` (amber-200)
- **Ошибка**: `#EF4444` (red-500)
  - Фон: `#FEF2F2` (red-50)
  - Граница: `#FECACA` (red-200)
- **Информация**: `#3B82F6` (blue-500)
  - Фон: `#EFF6FF` (blue-50)
  - Граница: `#BFDBFE` (blue-200)

### Нейтральные цвета
- **Белый**: `#FFFFFF`
- **Фон страницы**: `#F9FAFB` (gray-50)
- **Фон компонентов**: `#FFFFFF`
- **Границы**: `#E5E7EB` (gray-200)
- **Разделители**: `#F3F4F6` (gray-100)
- **Текст (основной)**: `#111827` (gray-900)
- **Текст (вторичный)**: `#6B7280` (gray-500)
- **Текст (третичный)**: `#9CA3AF` (gray-400)
- **Отключенный**: `#E5E7EB` (gray-200)

## Типографика

### Шрифты
- **Основной**: Inter, system-ui, sans-serif
- **Альтернативный** (для русских специфических символов): Roboto, Arial, sans-serif
- **Моноширинный** (для кода): Menlo, Monaco, Consolas, monospace

### Размеры шрифтов
- **xs**: 0.75rem (12px)
- **sm**: 0.875rem (14px)
- **base**: 1rem (16px)
- **lg**: 1.125rem (18px)
- **xl**: 1.25rem (20px)
- **2xl**: 1.5rem (24px)
- **3xl**: 1.875rem (30px)
- **4xl**: 2.25rem (36px)
- **5xl**: 3rem (48px)

### Начертания
- **light**: 300
- **normal**: 400
- **medium**: 500
- **semibold**: 600
- **bold**: 700

### Применение типографики
- **Заголовок страницы**: 2xl (1.5rem), semibold, gray-900
- **Заголовок раздела**: xl (1.25rem), semibold, gray-900
- **Заголовок карточки**: lg (1.125rem), semibold, gray-900
- **Основной текст**: base (1rem), normal, gray-900
- **Вторичный текст**: sm (0.875rem), normal, gray-500
- **Метки форм**: sm (0.875rem), medium, gray-700
- **Кнопки**: sm (0.875rem), medium
- **Ссылки**: наследуют размер родителя, medium, indigo-600
- **Хлебные крошки**: sm (0.875rem), normal, gray-500
- **Подписи и мелкие метки**: xs (0.75rem), medium, gray-500

## Отступы и пространство

### Шкала отступов
- **0**: 0px
- **px**: 1px
- **0.5**: 0.125rem (2px)
- **1**: 0.25rem (4px)
- **1.5**: 0.375rem (6px)
- **2**: 0.5rem (8px)
- **2.5**: 0.625rem (10px)
- **3**: 0.75rem (12px)
- **3.5**: 0.875rem (14px)
- **4**: 1rem (16px)
- **5**: 1.25rem (20px)
- **6**: 1.5rem (24px)
- **8**: 2rem (32px)
- **10**: 2.5rem (40px)
- **12**: 3rem (48px)
- **16**: 4rem (64px)
- **20**: 5rem (80px)
- **24**: 6rem (96px)

### Применение отступов
- **Отступ страницы (по бокам)**: 
  - Десктоп: px-6 (1.5rem)
  - Планшет: px-4 (1rem)
  - Мобильный: px-4 (1rem)
- **Отступ страницы (сверху/снизу)**: py-8 (2rem)
- **Отступ между секциями**: mt-12 (3rem)
- **Отступ между компонентами одной секции**: mt-6 (1.5rem)
- **Внутренний отступ карточек**: p-6 (1.5rem)
- **Отступ между строками**: space-y-4 (1rem)
- **Отступ между элементами в строке**: space-x-3 (0.75rem)

## Компоненты

### Контейнеры
- **Ограничение ширины страницы**: max-w-7xl mx-auto
- **Карточка**: bg-white rounded-lg shadow-sm overflow-hidden
- **Панель**: bg-white rounded-lg shadow-sm p-6

### Кнопки
- **Основная кнопка**: bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md shadow-sm 
- **Вторичная кнопка**: bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-md shadow-sm border border-gray-300
- **Контурная кнопка**: bg-transparent text-indigo-600 hover:bg-indigo-50 border border-indigo-600 font-medium py-2 px-4 rounded-md
- **Текстовая кнопка**: text-indigo-600 hover:text-indigo-700 font-medium
- **Кнопка-иконка**: p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700

### Формы
- **Поле ввода**: w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500
- **Метка**: block text-sm font-medium text-gray-700 mb-1
- **Выпадающий список**: w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500
- **Чекбокс/Радиокнопка**: rounded border-gray-300 text-indigo-600 focus:ring-indigo-500
- **Переключатель**: relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
- **Текстовая область**: w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500
- **Группа полей**: flex items-center space-x-3
- **Подсказка/ошибка**: mt-1 text-sm text-red-600 (для ошибки) или text-gray-500 (для подсказки)

### Навигация
- **Главное меню**: bg-white shadow-sm
- **Активный пункт меню**: text-indigo-600 border-b-2 border-indigo-600
- **Неактивный пункт меню**: text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent
- **Вкладки**: border-b border-gray-200
- **Активная вкладка**: text-indigo-600 border-b-2 border-indigo-600
- **Неактивная вкладка**: text-gray-500 hover:text-gray-700 hover:border-gray-300

### Обратная связь
- **Алерт (успех)**: bg-green-50 border-l-4 border-green-400 p-4
- **Алерт (предупреждение)**: bg-yellow-50 border-l-4 border-yellow-400 p-4
- **Алерт (ошибка)**: bg-red-50 border-l-4 border-red-400 p-4
- **Алерт (информация)**: bg-blue-50 border-l-4 border-blue-400 p-4
- **Бейдж**: inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
- **Тост**: fixed bottom-4 right-4 bg-gray-900 text-white rounded-lg shadow-lg p-4 z-50

### Модальные окна
- **Оверлей**: fixed inset-0 bg-gray-500 bg-opacity-75 z-40
- **Модальное окно**: relative bg-white rounded-lg shadow-xl overflow-hidden p-6 max-w-lg mx-auto z-50
- **Заголовок модального окна**: text-xl font-semibold text-gray-900 mb-4
- **Футер модального окна**: mt-6 pt-4 border-t border-gray-200 flex justify-end space-x-3

### Таблицы
- **Таблица**: min-w-full divide-y divide-gray-200
- **Заголовок таблицы**: px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider
- **Ячейка таблицы**: px-6 py-4 whitespace-nowrap text-sm text-gray-900
- **Строка таблицы (четная)**: bg-white
- **Строка таблицы (нечетная)**: bg-gray-50
- **Строка таблицы (ховер)**: hover:bg-gray-100

### Карточки вопросов
- **Карточка вопроса**: bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow
- **Заголовок карточки**: p-4 border-b border-gray-200 bg-gray-50
- **Тело карточки**: p-4
- **Футер карточки**: p-4 bg-gray-50 border-t border-gray-200
- **Карточка вопроса (выбранная)**: ring-2 ring-indigo-500 border-transparent
- **Карточка вопроса (правильный ответ)**: border-green-500
- **Карточка вопроса (неправильный ответ)**: border-red-500

## Анимации и переходы
- **Стандартный переход**: transition-all duration-200 ease-in-out
- **Затухание**: transition-opacity duration-150 ease-in-out
- **Трансформация**: transition-transform duration-200 ease-in-out
- **Появление модального окна**: animate-fade-in duration-300
- **Вращение для лоадеров**: animate-spin
- **Пульсация**: animate-pulse
- **Перемещение из выпадающего меню**: transform origin-top-right transition-all duration-200 ease-out

## Адаптивный дизайн

### Контрольные точки (Breakpoints)
- **sm**: 640px (маленькие устройства)
- **md**: 768px (планшеты)
- **lg**: 1024px (десктоп)
- **xl**: 1280px (большие экраны)
- **2xl**: 1536px (очень большие экраны)

### Правила адаптивности
1. **Макеты**:
   - Мобильные устройства: Одноколоночный макет, полная ширина контента
   - Планшеты: Двухколоночный макет для подходящего контента
   - Десктоп: Многоколоночный макет, с боковой панелью навигации

2. **Навигация**:
   - Мобильные устройства: Скрытое меню-гамбургер
   - Планшеты и выше: Горизонтальное меню

3. **Таблицы**:
   - Мобильные устройства: Таблицы трансформируются в карточки
   - Планшеты и выше: Стандартный табличный вид

4. **Формы**:
   - Мобильные устройства: Поля ввода занимают полную ширину, элементы располагаются в столбик
   - Десктоп: Возможно многоколоночное расположение для связанных полей

## Доступность
- Все интерактивные элементы должны иметь focus state
- Цветовой контраст должен соответствовать WCAG AA
- Все изображения должны иметь альтернативный текст
- Все элементы формы должны иметь связанные метки (labels)
- Корректное использование иерархии заголовков (h1-h6)
- Интерактивные элементы должны быть доступны с клавиатуры
- Модальные окна: правильная фокусировка и ловушка для фокуса
- Использование ARIA-атрибутов для сложных компонентов
- Компоненты с изменяющимся контентом должны уведомлять об этом (напр. live regions)
- Адаптивность при масштабировании текста до 200%

## Иконки и изображения
- **Система иконок**: Heroicons (24px и 20px)
- **Размеры иконок**:
  - **Маленькие**: 16px (h-4 w-4)
  - **Стандартные**: 20px (h-5 w-5)
  - **Средние**: 24px (h-6 w-6)
  - **Большие**: 32px (h-8 w-8)
- **Формат изображений**: SVG для иконок и простой графики, WebP/JPEG для фотографий
- **Изображения вопросов**: должны быть оптимизированы, максимальная ширина 800px

## Поведение компонентов

### Формы и валидация
- Валидация ввода происходит при потере фокуса (blur)
- Ошибки отображаются под полем ввода с иконкой предупреждения
- Кнопка отправки формы блокируется до валидного заполнения обязательных полей
- Элементы формы должны содержать подсказки для помощи пользователю

### Загрузка и состояния
- Отображение скелетонов при первичной загрузке данных
- Индикаторы загрузки при действиях пользователя (спиннеры для кнопок)
- Отображение пустых состояний с предложением действий
- Прозрачные анимации переходов между состояниями

### Система сообщений
- Тосты для временных уведомлений об успешных действиях (исчезают через 5с)
- Закрепленные сообщения для критических ошибок (требуют ручного закрытия)
- Подтверждение действий через модальные окна для необратимых операций

## Примеры кода компонентов

### Кнопка (React + Tailwind)
```jsx
function Button({ children, variant = 'primary', size = 'md', isLoading, disabled, onClick, className, ...props }) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm focus:ring-indigo-500',
    secondary: 'bg-white hover:bg-gray-50 text-gray-700 shadow-sm border border-gray-300 focus:ring-indigo-500',
    outline: 'bg-transparent text-indigo-600 hover:bg-indigo-50 border border-indigo-600 focus:ring-indigo-500',
    text: 'text-indigo-600 hover:text-indigo-700 focus:ring-indigo-500 shadow-none',
  };
  
  const sizeClasses = {
    sm: 'py-1 px-3 text-xs',
    md: 'py-2 px-4 text-sm',
    lg: 'py-2.5 px-5 text-base',
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
}
```

### Карточка вопроса (React + Tailwind)
```jsx
function QuestionCard({ question, isSelected, onClick }) {
  return (
    <div 
      className={`bg-white border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer ${
        isSelected ? 'ring-2 ring-indigo-500 border-transparent' : 'border-gray-200'
      }`}
      onClick={onClick}
    >
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 truncate">{question.title}</h3>
          <div className="flex space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              {question.type}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
              ${question.difficulty === 'easy' ? 'bg-green-100 text-green-800' : 
                question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'}`}
            >
              {question.difficulty}
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="prose prose-sm">{question.shortDescription}</div>
        
        <div className="mt-3 flex flex-wrap gap-2">
          {question.tags.map(tag => (
            <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
        <span className="text-sm text-gray-500">ID: {question.id}</span>
        <span className="text-sm font-medium text-indigo-600">Подробнее</span>
      </div>
    </div>
  );
}
```

## Лучшие практики

1. **Консистентность**:
   - Использовать компоненты из библиотеки UI последовательно
   - Придерживаться одного стиля для аналогичных элементов во всем приложении

2. **Отзывчивость**:
   - Обеспечивать визуальную обратную связь для всех действий пользователя
   - Использовать микроанимации для улучшения UX (в разумных пределах)

3. **Эффективность**:
   - Минимизировать количество действий для выполнения задач
   - Использовать понятные ярлыки и иконки
   - Предлагать значения по умолчанию там, где это возможно

4. **Гибкость**:
   - Учитывать различные языковые настройки (расширение текста)
   - Проектировать компоненты так, чтобы они хорошо работали с различным содержимым

## Система контроля версий
- Основная документация компонентов хранится в формате Markdown
- При внесении изменений необходимо обновлять номер версии по принципу SemVer
- Все визуальные изменения компонентов должны быть задокументированы 