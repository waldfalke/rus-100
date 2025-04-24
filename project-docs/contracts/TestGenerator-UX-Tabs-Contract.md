# UX Контракт: Компонент вкладок генератора тестов

## Метаданные
- **Версия**: 1.0.0
- **Статус**: В разработке
- **Последнее обновление**: 2023-05-23
- **Последний редактор**: AI

## Назначение
Компонент вкладок обеспечивает навигацию между различными режимами и этапами создания тестов по русскому языку в генераторе тестов ЕГЭ. Вкладки позволяют пользователю переключаться между различными категориями заданий и способами формирования тестов.

## Визуальное представление
Компонент представлен в виде горизонтальной панели с вкладками в верхней части интерфейса. Каждая вкладка содержит текстовую метку и визуально отделена от других вкладок. Активная вкладка выделена цветом и подчеркиванием снизу.

Основные визуальные элементы используют следующие Tailwind классы:
- Контейнер вкладок: `w-full`
- Основная панель: `border-b border-gray-200`
- Список вкладок: `flex -mb-px`
- Неактивная вкладка: `py-2 px-4 text-center border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300`
- Активная вкладка: `py-2 px-4 text-center border-b-2 border-indigo-500 text-sm font-medium text-indigo-600`

## Состояния
- **Вкладка — неактивная**: `text-gray-500 border-transparent`
- **Вкладка — при наведении**: `text-gray-700 border-gray-300`
- **Вкладка — активная**: `text-indigo-600 border-indigo-500`
- **Вкладка — отключенная**: `text-gray-400 cursor-not-allowed opacity-50`
- **Вкладка — с индикатором**: Отображает индикатор (например, количество выбранных элементов)

## Поведение
- Клик по вкладке активирует соответствующую вкладку и отображает её содержимое
- Активная вкладка визуально выделяется
- Переключение между вкладками происходит без перезагрузки страницы
- При переключении вкладок состояние каждой вкладки сохраняется
- Некоторые вкладки могут быть отключены в зависимости от контекста

## Основные вкладки генератора тестов
1. **По заданиям** - отображает задания, сгруппированные по типам заданий ЕГЭ
2. **ЕГЭ** - отображает задания, сгруппированные по частям экзамена ЕГЭ
3. **Упражнения** - отображает задания, сгруппированные по типам языковых упражнений

## Доступность
- Вкладки имеют атрибут `role="tab"` и `aria-selected="true/false"` для обозначения активности
- Панель с вкладками имеет атрибут `role="tablist"`
- Содержимое вкладок имеет атрибут `role="tabpanel"`
- Вкладки и панели связаны атрибутами `aria-controls` и `id`
- Навигация между вкладками доступна с клавиатуры (Tab и Arrow keys)
- Отключенные вкладки имеют атрибут `aria-disabled="true"`

## Адаптивность
- На мобильных устройствах текст вкладок может становиться меньше
- На очень маленьких экранах вкладки могут трансформироваться в выпадающее меню
- Панель с вкладками имеет прокрутку при необходимости на маленьких экранах
- Отступы и размеры адаптируются в зависимости от размера экрана

## Примеры использования
```jsx
// Пример разметки компонента вкладок
<div className="w-full">
  <div className="border-b border-gray-200">
    <nav className="-mb-px flex" aria-label="Tabs">
      <button
        className={`${
          activeTab === 'tasks'
            ? 'border-indigo-500 text-indigo-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        } py-2 px-4 text-center border-b-2 text-sm font-medium`}
        onClick={() => setActiveTab('tasks')}
        role="tab"
        aria-selected={activeTab === 'tasks'}
        aria-controls="panel-tasks"
      >
        По заданиям
      </button>
      <button
        className={`${
          activeTab === 'ege'
            ? 'border-indigo-500 text-indigo-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        } py-2 px-4 text-center border-b-2 text-sm font-medium`}
        onClick={() => setActiveTab('ege')}
        role="tab"
        aria-selected={activeTab === 'ege'}
        aria-controls="panel-ege"
      >
        ЕГЭ
      </button>
      <button
        className={`${
          activeTab === 'exercises'
            ? 'border-indigo-500 text-indigo-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        } py-2 px-4 text-center border-b-2 text-sm font-medium`}
        onClick={() => setActiveTab('exercises')}
        role="tab"
        aria-selected={activeTab === 'exercises'}
        aria-controls="panel-exercises"
      >
        Упражнения
      </button>
    </nav>
  </div>
  <div>
    <div 
      id="panel-tasks" 
      role="tabpanel" 
      aria-labelledby="tab-tasks"
      className={activeTab === 'tasks' ? 'mt-4' : 'hidden'}
    >
      {/* Содержимое вкладки "По заданиям" */}
    </div>
    <div 
      id="panel-ege" 
      role="tabpanel" 
      aria-labelledby="tab-ege"
      className={activeTab === 'ege' ? 'mt-4' : 'hidden'}
    >
      {/* Содержимое вкладки "ЕГЭ" */}
    </div>
    <div 
      id="panel-exercises" 
      role="tabpanel" 
      aria-labelledby="tab-exercises"
      className={activeTab === 'exercises' ? 'mt-4' : 'hidden'}
    >
      {/* Содержимое вкладки "Упражнения" */}
    </div>
  </div>
</div>
```

## Предусловия и постусловия
- **Предусловия**: 
  - Должны быть определены все возможные вкладки
  - Должен быть определен обработчик события переключения вкладок
  - Должна быть выбрана начальная вкладка по умолчанию

- **Постусловия**:
  - При переключении вкладки соответствующий контент становится видимым
  - Состояние активной вкладки сохраняется

## Инварианты
- Всегда должна быть активна ровно одна вкладка
- Порядок вкладок должен сохраняться
- Переключение между вкладками не должно приводить к потере данных
- Отключенные вкладки не должны быть интерактивными

## Интеграция с другими компонентами
- **TabPanel** - содержит контент, связанный с каждой вкладкой
- **TestGenerator** - родительский компонент, интегрирующий все части
- **TaskSelection** - отображается на вкладке "По заданиям"

## Связанные контракты
- [TestGenerator Product Contract](./TestGenerator-Product-Contract.md)
- [UX контракт: Панель с вкладками](./TestGenerator-UX-TabPanel-Contract.md)
- [UX контракт: Выбор заданий](./TestGenerator-UX-TaskSelection-Contract.md) 