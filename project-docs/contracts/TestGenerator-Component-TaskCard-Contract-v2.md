# Компонент Контракт: Карточка задания B-вариантов

## Метаданные
- **Версия**: 2.1.0
- **Статус**: В разработке
- **Дата создания**: 2024-05-23
- **Последнее обновление**: 2024-05-27
- **Последний редактор**: AI

## Назначение
Компонент карточки задания B-вариантов предоставляет альтернативное представление карточек заданий в генераторе тестов ЕГЭ, с основным отличием в форме элементов фильтрации сложности и категорий заданий, а также измененным визуальным представлением. Карточка отображает информацию о задании, позволяет регулировать количество вопросов данного типа и настраивать его сложность и категории.

## Расположение компонентов
- Основной компонент: `components/ui/TaskCardBlock.tsx`
- История Storybook A-варианты: `components/stories/TaskCardBlock.stories_A.tsx`
- История Storybook B-варианты: `components/stories/TaskCardBlock.stories_B.tsx`
- Генератор тестов A-вариант: `components/stories/TestGenerator_A.stories.tsx`
- Генератор тестов B-вариант: `components/stories/TestGenerator_B.stories.tsx`

## Визуальное представление
Компонент представлен в виде прямоугольной карточки с заголовком, элементами управления количеством, селектором сложности и категорий в виде выпадающих списков. Карточка имеет визуальное разграничение от других элементов и ясно отображает текущие настройки.

Основные визуальные элементы используют следующие Tailwind классы:
- Контейнер карточки: `border border-gray-200 mb-2`
- Содержимое карточки: `p-3 sm:p-4`
- Заголовок задания: `text-sm text-gray-800`
- Счетчик количества: `flex items-center space-x-1.5 flex-shrink-0`
- Кнопки управления: `variant="outline" size="icon" className="h-6 w-6"`
- Выпадающие списки для сложности и категорий: `Badge variant="outline" className="cursor-pointer py-1 px-3 flex items-center gap-1.5 hover:bg-gray-100 transition-colors dropdown-badge"`

## Типы карточек и логика их отображения
Существуют три типа карточек B-вариантов, отличающихся набором элементов управления:

1. **Full Card B** - если в карточке есть и категории заданий, и статистика сложности
   - Определяется наличием номера задания в заголовке (`taskNumber`) И данных статистики (`itemStats`)
   - Отображает: dropdown категорий И dropdown сложности

2. **Only Difficulty B** - если в карточке есть только статистика сложности, но нет категорий
   - Определяется наличием данных статистики (`itemStats`) при ОТСУТСТВИИ номера задания в заголовке
   - Отображает: ТОЛЬКО dropdown сложности

3. **Minimal B** - если в карточке нет ни категорий, ни статистики сложности
   - Определяется отсутствием и номера задания, и данных статистики
   - Отображает: только заголовок и кнопки +/-

### Правила определения типа карточки
1. Проверяем наличие номера задания: `const taskNumber = item.title.match(/№\s*(\d+)/)?.[1];`
2. Определяем наличие категорий: `const hasCategories = !!taskNumber;` 
3. Проверяем наличие данных статистики: `itemStats` должен быть не null и не undefined
4. На основе этих данных определяем тип карточки и отображаемые элементы

### Важные детали:
- Кнопки +/- должны отображаться **ВСЕГДА** для всех типов карточек
- Если у задания есть номер, то есть и категории
- Заголовок должен обрабатываться только в типе Minimal B: `hasCategories ? item.title : item.title.replace(/№\s*\d+\.\s*/, "")`

## Состояния
- **Dropdown сложности — открыт**: `open={diffOpen} onOpenChange={setDiffOpen}`
- **Dropdown категорий — открыт**: `open={catOpen} onOpenChange={setCatOpen}`
- **Badge сложности — выбран**: `bg-teal-600 hover:bg-teal-700 text-white border-teal-600`
- **Badge категорий — выбран**: `bg-teal-600 hover:bg-teal-700 text-white border-teal-600`
- **Badge — не выбран**: `border-gray-300 text-gray-700 hover:bg-gray-100`
- **Кнопка увеличения — активная**: не имеет атрибута `disabled`
- **Кнопка увеличения — неактивная**: имеет атрибут `disabled={currentCount >= maxCount}`
- **Кнопка уменьшения — активная**: не имеет атрибута `disabled`
- **Кнопка уменьшения — неактивная**: имеет атрибут `disabled={currentCount <= 0}`

## Поведение
- Выпадающие списки открываются по клику на Badge
- При клике на элемент выпадающего списка изменяется выбор сложности/категории
- При клике на кнопку "+" увеличивается счетчик количества заданий данного типа (до максимума)
- При клике на кнопку "-" уменьшается счетчик количества заданий (до 0)
- При достижении максимального количества кнопка "+" становится неактивной
- При достижении 0 заданий кнопка "-" становится неактивной
- При изменении значения счетчика обновляется общий прогресс в родительском компоненте

## Функция renderItemRow
Функция `renderItemRow` в компоненте TestGenerator2 должна:
1. Определить тип карточки на основе данных
2. Создать соответствующие dropdown-элементы при необходимости
3. Вернуть компонент TaskCardBlock с правильными пропсами

```typescript
const renderItemRow = (item: TestItem, category: TestCategory | EGECategory, tabType: TabType) => {
  const currentCount = item.count || 0;
  const maxCount = item.maxCount || 10;
  const categoryIdentifier = 'category' in category ? category.category : category.title;
  const statsId = `${tabType}-${item.id}`;
  const itemStats = difficultyStatsData[statsId] || mockItemStats;
  
  // Определение типа карточки
  const taskNumber = item.title.match(/№\s*(\d+)/)?.[1];
  const hasCategories = !!taskNumber;
  const availableCategories = hasCategories ? ['Орфография', 'Пунктуация', 'Лексика', 'Морфология'] : [];
  
  // Создаем интерактивные блоки в зависимости от данных
  let interactiveBlock = null;
  
  if (hasCategories && itemStats) {
    // FullCard_B вариант
    const difficultyDropdown = createDifficultyDropdown(item, itemStats);
    const categoryDropdown = createCategoryDropdown(item, availableCategories);
    
    interactiveBlock = (
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }} className="sb-interactive-block">
        {categoryDropdown}
        {difficultyDropdown}
      </div>
    );
  } else if (!hasCategories && itemStats) {
    // OnlyDifficulty_B вариант
    const difficultyDropdown = createDifficultyDropdown(item, itemStats);
    
    interactiveBlock = (
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }} className="sb-interactive-block">
        {difficultyDropdown}
      </div>
    );
  }
  // Для Minimal_B варианта interactiveBlock остается null
  
  return (
    <TaskCardBlock
      key={item.id}
      item={{...item, title: hasCategories ? item.title : item.title.replace(/№\s*\d+\.\s*/, "")}}
      category={null} // В B-вариантах не используем встроенный селектор категорий
      currentCount={currentCount}
      maxCount={maxCount}
      onDecrement={() => handleCountChange(item.id, categoryIdentifier, -1, tabType)}
      onIncrement={() => handleCountChange(item.id, categoryIdentifier, 1, tabType)}
      difficulties={itemDifficulties[item.id] || ["any"]}
      onDifficultyChange={(id) => handleItemDifficultyChange(item.id, id)}
      categories={itemCategories[item.id] || availableCategories}
      onCategoriesChange={(cats) => handleCategoriesChange(item.id, cats)}
      itemStats={itemStats}
      difficultyTiers={mockDifficultyTiers}
      difficultyDropdown={interactiveBlock}
      categoryDropdown={null}
    />
  );
};
```

## Требования к вспомогательным функциям

### createDifficultyDropdown
Функция создает выпадающий список выбора сложности:
1. Использует `Popover` и `PopoverTrigger` для создания выпадающего меню
2. Отображает выбранную сложность в виде Badge
3. В раскрытом меню позволяет выбрать между "любая сложность" и конкретными уровнями сложности
4. При выборе опции обновляет состояние через `setItemDifficulties`
5. Используется общая логика во всех типах карточек, где требуется выбор сложности

### createCategoryDropdown
Функция создает выпадающий список выбора категорий:
1. Использует `Popover` и `PopoverTrigger` для создания выпадающего меню
2. Отображает выбранные категории в виде Badge
3. В раскрытом меню позволяет выбрать между "все категории" и конкретными категориями
4. При выборе опции обновляет состояние через `setItemCategories`
5. Используется только в карточках типа Full Card B

## Адаптивность
- На мобильных устройствах выпадающие списки должны стать полноэкранными, с кнопкой "Закрыть" внизу
- В мобильной версии интерактивные элементы располагаются вертикально
- Badge должны растягиваться на всю ширину экрана
- На десктопе выпадающие списки должны быть компактными, с указанием закрытия по ESC
- Специальные стили для мобильных устройств добавляются через медиа-запросы

```css
@media (max-width: 600px) {
  .mobile-close-btn { display: block !important; }
  .desktop-close-hint { display: none !important; }
  .dropdown-badge { width: calc(100vw - 32px) !important; margin: 0 16px !important; max-width: 100vw !important; }
  .sb-interactive-block { flex-direction: column !important; gap: 8px !important; align-items: stretch !important; }
}
```

## Соответствие с основным компонентом
Компонент TaskCardBlock B-вариантов **ДОЛЖЕН** сохранять полное соответствие с основным компонентом TestGenerator в остальных аспектах:
1. Общий интерфейс и функциональность
2. Работа с табами (tasks, ege, exercises)
3. Отображение прогресса и общего счетчика выбранных заданий
4. Все модальные окна и дополнительные элементы управления
5. Стили, цветовая гамма и прочие визуальные элементы
6. Работа с развернутыми/свернутыми категориями заданий
7. Механизм инкремента/декремента количества заданий
8. Названия, подписи и тексты должны быть идентичны

## Инварианты
- Счетчик count всегда находится в диапазоне [0, maxCount]
- Всегда должны отображаться кнопки +/-
- Тип карточки определяется ТОЛЬКО по наличию taskNumber и itemStats
- Если count равно 0, кнопка уменьшения неактивна
- Если count равно maxCount, кнопка увеличения неактивна
- При отсутствии taskNumber категории не должны отображаться
- При отсутствии itemStats сложность не должна отображаться
- Текст кнопки создания теста должен обновляться в зависимости от выбранных табов

## Хрупкие места и особые указания
1. **КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО** изменять логику определения типов карточек
2. **ОБЯЗАТЕЛЬНО** проверять наличие taskNumber через регулярное выражение
3. **НЕЛЬЗЯ** удалять кнопки увеличения/уменьшения количества из любого типа карточек
4. **ОСТОРОЖНО** с заголовком в Minimal_B - нужно удалять номер задания, если есть
5. Все стили должны быть чувствительны к мобильным устройствам
6. **НЕ ИЗМЕНЯТЬ** основной функционал страницы TestGenerator2
7. Если dropdown уже создан для какого-то типа карточек - он **НЕ ДОЛЖЕН** дублироваться

## Связанные контракты
- [TestGenerator Product Contract](./TestGenerator-Product-Contract.md)
- [UX контракт: Выбор заданий](./TestGenerator-UX-TaskSelection-Contract.md)
- [UX контракт: Прогресс-индикатор](./TestGenerator-UX-Progress-Contract.md)
- [Компонент Контракт: Карточка задания](./TestGenerator-Component-TaskCard-Contract.md) 