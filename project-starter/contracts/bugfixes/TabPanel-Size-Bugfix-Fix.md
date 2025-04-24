# Реализация исправления: Размеры панели с вкладками

## Метаданные
- **Версия**: 1.0.0
- **Статус**: Готово к внедрению
- **Приоритет**: Высокий
- **Последнее обновление**: 2025-04-23
- **Последний редактор**: AI

## Анализ проблемы
После анализа кода и интерфейса выявлены следующие проблемы:

1. Панель с вкладками в компоненте `TestGenerator` использует компонент `Tabs` из UI библиотеки Shadcn (адаптированный из Radix UI), но настройки размеров и отображения требуют корректировки.
2. В текущей реализации присутствуют следующие проблемы:
   - Контент вкладок может обрезаться из-за неправильного применения стилей ширины и переполнения
   - Sticky-позиционирование вкладок работает некорректно
   - Компонент не адаптируется должным образом к размеру экрана

## Предлагаемое решение

### 1. Исправление компонента в app/page.tsx

```jsx
{/* Tabs */}
<Tabs 
  defaultValue="tasks" 
  value={selectedTab} 
  onValueChange={setSelectedTab} 
  className="w-full max-w-full flex flex-col"
>
  <TabsList className="grid w-full grid-cols-3 sticky top-0 z-30 bg-white shadow-sm rounded-none border-b pb-0">
    <TabsTrigger
      value="tasks"
      className="data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-b-none px-4 py-3"
    >
      По заданиям
    </TabsTrigger>
    <TabsTrigger
      value="ege"
      className="data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-b-none px-4 py-3"
    >
      Формат ЕГЭ
    </TabsTrigger>
    <TabsTrigger
      value="exercises"
      className="data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-b-none px-4 py-3"
    >
      Упражнения
    </TabsTrigger>
  </TabsList>

  {/* Контент вкладок */}
  <TabsContent value="tasks" className="w-full max-w-full mt-0 pt-6">
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm w-full">
      {/* Существующий контент */}
    </div>
  </TabsContent>
  
  <TabsContent value="ege" className="w-full max-w-full mt-0 pt-6">
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm w-full">
      {/* Существующий контент */}
    </div>
  </TabsContent>
  
  <TabsContent value="exercises" className="w-full max-w-full mt-0 pt-6">
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm w-full">
      {/* Существующий контент */}
    </div>
  </TabsContent>
</Tabs>
```

### 2. Модификация компонента Tabs (components/ui/tabs.tsx)

```jsx
const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "w-full ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
```

## Ключевые изменения

1. **Корневой компонент Tabs**:
   - Добавлен класс `flex flex-col` для правильного вертикального расположения элементов
   - Добавлен класс `max-w-full` для предотвращения обрезания при переполнении

2. **Компонент TabsList**:
   - Удалено свойство `mb-6`, вызывающее некорректное отображение
   - Добавлен класс `rounded-none border-b pb-0` для правильного стиля и отступов
   - Сохранено sticky-позиционирование, но с корректными стилями

3. **Компоненты TabsTrigger**:
   - Добавлен класс `rounded-b-none` для устранения скругления снизу
   - Увеличены отступы с помощью `px-4 py-3` для лучшего визуального представления

4. **Компоненты TabsContent**:
   - Добавлены классы `w-full max-w-full` для корректного отображения
   - Установлен `mt-0 pt-6` для правильных вертикальных отступов
   - В дочерних элементах добавлен класс `w-full` для правильного заполнения

5. **Базовый компонент TabsContent**:
   - Добавлен класс `w-full` в определении компонента для применения ко всем экземплярам

## Тестирование

Исправление должно быть протестировано на следующих устройствах и разрешениях:
- Настольные компьютеры (>1200px)
- Планшеты (768px-1024px)
- Мобильные устройства (<768px)

## Критерии успешного внедрения

1. Вкладки отображаются по всей ширине экрана без обрезания
2. Содержимое вкладок полностью видно и не обрезается
3. При прокрутке заголовки вкладок корректно фиксируются вверху 
4. При переключении между вкладками не происходит визуальных скачков или артефактов
5. Интерфейс корректно отображается на всех размерах экрана

## Связанные контракты
- [Контракт исправления бага: Размеры панели с вкладками](./TabPanel-Size-Bugfix-Contract.md)
- [UX Контракт: Панель с вкладками](../TestGenerator-UX-TabPanel-Contract.md)
- [UX Контракт: Компонент вкладок генератора тестов](../TestGenerator-UX-Tabs-Contract.md) 