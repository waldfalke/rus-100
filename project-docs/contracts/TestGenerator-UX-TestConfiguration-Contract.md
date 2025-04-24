# UX Контракт: Конфигурация теста

## Метаданные
- **Версия**: 1.0.0
- **Статус**: В разработке
- **Последнее обновление**: 2023-05-23
- **Последний редактор**: AI

## Назначение
Компонент конфигурации теста предоставляет интерфейс для настройки параметров генерируемого теста по русскому языку. Пользователь может указать название, тип теста, количество вариантов, продолжительность, класс обучения и другие специфические для ЕГЭ параметры.

## Визуальное представление
Компонент представляет собой форму с полями ввода, выпадающими списками и переключателями, организованными в логические секции. Каждая секция содержит заголовок и группу элементов управления, связанных с определенным аспектом конфигурации теста.

Основные визуальные элементы используют следующие Tailwind классы:
- Контейнер формы: `mt-5 md:mt-0 md:col-span-2`
- Секция формы: `shadow sm:rounded-md sm:overflow-hidden`
- Заголовок секции: `px-4 py-5 bg-white space-y-6 sm:p-6`
- Группа полей: `grid grid-cols-6 gap-6`
- Метка поля: `block text-sm font-medium text-gray-700`
- Текстовое поле: `mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md`
- Выпадающий список: `mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`
- Переключатель: `focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300`
- Секция кнопок: `px-4 py-3 bg-gray-50 text-right sm:px-6`
- Кнопка сохранения: `inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`

## Состояния
- **Поле — нормальное**: `border-gray-300`
- **Поле — в фокусе**: `focus:ring-indigo-500 focus:border-indigo-500`
- **Поле — с ошибкой**: `border-red-500`
- **Поле — отключенное**: `bg-gray-100 text-gray-500 cursor-not-allowed`
- **Кнопка — нормальная**: `bg-indigo-600 hover:bg-indigo-700`
- **Кнопка — отключенная**: `bg-gray-300 cursor-not-allowed`
- **Кнопка — нажатие**: `focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`
- **Форма — загрузка**: Отображает индикатор загрузки при сохранении конфигурации

## Поведение
- Изменение значений полей немедленно обновляет состояние формы
- Валидация полей происходит при вводе или потере фокуса
- Ошибки валидации отображаются под соответствующими полями
- Некоторые поля могут становиться активными/неактивными в зависимости от значений других полей
- Кнопка сохранения отключена, если форма содержит ошибки валидации
- При сохранении отображается индикатор загрузки

## Доступность
- Все поля ввода имеют связанные метки (`label`)
- Поля с ошибками имеют атрибут `aria-invalid="true"`
- Сообщения об ошибках связаны с полями через `aria-describedby`
- Обязательные поля имеют атрибут `aria-required="true"`
- Группы связанных элементов управления имеют атрибут `role="group"` и `aria-labelledby`
- Фокус клавиатуры перемещается логично между полями формы (Tab order)

## Адаптивность
- На мобильных устройствах поля занимают полную ширину экрана
- Группы полей преобразуются в вертикальное расположение на узких экранах
- Размер шрифта и отступы адаптируются к размеру экрана
- На планшетах и больших экранах форма разделяется на колонки для более эффективного использования пространства
- Используются гибкие margin и padding для обеспечения читаемости на любых устройствах

## Примеры использования
```jsx
// Пример разметки формы конфигурации теста
<form onSubmit={handleSubmit}>
  <div className="shadow sm:rounded-md sm:overflow-hidden">
    <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
      {/* Основная информация */}
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Основная информация</h3>
        <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-4">
            <label htmlFor="test-name" className="block text-sm font-medium text-gray-700">
              Название теста
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="test-name"
                id="test-name"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                aria-required="true"
              />
            </div>
            {errors.testName && (
              <p className="mt-2 text-sm text-red-600" id="test-name-error">
                {errors.testName}
              </p>
            )}
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="test-type" className="block text-sm font-medium text-gray-700">
              Тип теста
            </label>
            <select
              id="test-type"
              name="test-type"
              value={testType}
              onChange={(e) => setTestType(e.target.value)}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="ege">ЕГЭ</option>
              <option value="oge">ОГЭ</option>
              <option value="custom">Пользовательский</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="variants-count" className="block text-sm font-medium text-gray-700">
              Количество вариантов
            </label>
            <input
              type="number"
              name="variants-count"
              id="variants-count"
              min="1"
              max="100"
              value={variantsCount}
              onChange={(e) => setVariantsCount(Number(e.target.value))}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Параметры теста */}
      <div className="pt-4">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Параметры теста</h3>
        <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
              Класс
            </label>
            <select
              id="grade"
              name="grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
              Продолжительность (минуты)
            </label>
            <input
              type="number"
              name="duration"
              id="duration"
              min="15"
              max="240"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          {/* Дополнительные опции */}
          <div className="sm:col-span-6">
            <fieldset>
              <legend className="text-sm font-medium text-gray-700">
                Дополнительные настройки
              </legend>
              <div className="mt-4 space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="include-answers"
                      name="include-answers"
                      type="checkbox"
                      checked={includeAnswers}
                      onChange={(e) => setIncludeAnswers(e.target.checked)}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="include-answers" className="font-medium text-gray-700">
                      Включить ответы
                    </label>
                    <p className="text-gray-500">
                      Ответы будут отображаться в сгенерированном тесте
                    </p>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
        </div>
      </div>
    </div>

    <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
      {isLoading ? (
        <div className="inline-flex items-center px-4 py-2">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Сохранение...
        </div>
      ) : (
        <button
          type="submit"
          disabled={!isFormValid}
          className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
            isFormValid ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-300 cursor-not-allowed'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        >
          Сохранить
        </button>
      )}
    </div>
  </div>
</form>
```

## Предусловия и постусловия
- **Предусловия**: 
  - Должны быть загружены начальные значения конфигурации (при редактировании существующего теста)
  - Должны быть доступны списки допустимых значений для выпадающих списков
  - Пользователь должен иметь соответствующие права для создания/редактирования тестов

- **Постусловия**:
  - При успешном сохранении обновляется конфигурация теста
  - Пользователь получает уведомление об успешном сохранении
  - Пользователь перенаправляется на следующий этап создания теста или список тестов

## Инварианты
- Название теста не может быть пустым
- Количество вариантов должно быть положительным целым числом
- Продолжительность теста должна быть в пределах допустимых значений
- Все поля формы должны иметь допустимые значения перед сохранением
- Тип теста определяет набор доступных параметров конфигурации 