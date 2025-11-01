# UX Контракт: Панель настроек генератора тестов

## Метаданные
- **Версия**: 1.0.0
- **Статус**: В разработке
- **Последнее обновление**: 2023-05-23
- **Последний редактор**: AI

## Назначение
Панель настроек предоставляет пользователю возможность конфигурировать параметры генерации тестов по русскому языку, включая тип теста, сложность, количество вопросов, ограничения по времени и другие специфические параметры.

### Preconditions
- Пользователь должен быть аутентифицирован и иметь права доступа к генератору тестов и его настройкам.
- Все необходимые данные для отображения опций (типы тестов, тематики, уровни сложности, сохраненные профили) должны быть успешно загружены и доступны компоненту.
- Начальные значения настроек (`initialSettings`) должны быть предоставлены (либо дефолтные, либо загруженные).
- Функции-коллбэки `onApply` и `onCancel` должны быть предоставлены.

### Postconditions
- При нажатии "Применить" (`onApply`):
    - Текущие выбранные настройки (`settings`) передаются в коллбэк `onApply`.
    - В случае успеха `onApply`, настройки применяются к генератору тестов.
    - Настройки могут быть сохранены для текущей сессии или пользователя (в зависимости от логики `onApply`).
- При нажатии "Отмена" (`onCancel`):
    - Вызывается коллбэк `onCancel`.
    - Изменения, сделанные в панели настроек, отменяются (компонент может быть закрыт или сброшен к `initialSettings`).
- При нажатии "Сбросить к значениям по умолчанию":
    - Состояние `settings` панели сбрасывается к `defaultSettings`.
- При сохранении профиля:
    - Текущие `settings` сохраняются как именованный профиль в постоянном хранилище (БД или localStorage).
- При загрузке профиля:
    - Состояние `settings` панели обновляется значениями из выбранного профиля.

### Invariants
- Значения всех настроек всегда соответствуют типам данных (числа для слайдеров, булевы для чекбоксов, строки для селектов).
- Количество вопросов (`questionCount`) всегда находится в диапазоне [min, max], заданном для слайдера (e.g., [5, 50]).
- Длительность теста (`durationMinutes`), если включено ограничение, всегда находится в диапазоне [min, max] (e.g., [5, 120]).
- Состояние зависимых настроек всегда согласовано: недоступные опции (например, длительность теста при выключенном ограничении) неактивны или скрыты и не влияют на итоговые настройки.
- Выбранный профиль (если есть) соответствует текущим отображаемым настройкам (до момента их изменения пользователем).
- Доступность (Accessibility): Все интерактивные элементы остаются доступными с клавиатуры и имеют необходимые ARIA-атрибуты.

### Exceptions
- **Ошибка загрузки данных**: Если не удалось загрузить необходимые опции (тематики, профили), панель может отобразить состояние ошибки или работать с неполным набором опций.
- **Ошибка сохранения/применения**: Если коллбэк `onApply` или функция сохранения профиля завершаются ошибкой (например, сетевая ошибка, ошибка БД), пользователю отображается сообщение об ошибке (`error` state).
- **Невалидные настройки**: Попытка применить или сохранить невалидную комбинацию настроек (хотя инварианты должны это предотвращать).
- **Ошибка доступа**: Попытка загрузить/сохранить профиль или применить настройки без необходимых прав.
- **Конфликт состояний**: Если базовые данные для настроек (например, список доступных тем) изменяются во время работы пользователя с панелью, это может привести к неконсистентному состоянию.

## Визуальное представление

### Структура компонента
- **Контейнер**: `bg-white rounded-lg shadow-sm p-6 max-w-3xl mx-auto`
- **Заголовок**: `text-2xl font-semibold text-gray-900 mb-6`
- **Секция настроек**: `space-y-6`
- **Группа настроек**: `space-y-3`
- **Заголовок секции**: `text-lg font-medium text-gray-900 mb-2`
- **Подзаголовок**: `text-sm font-medium text-gray-700 mb-1`
- **Подсказка**: `text-sm text-gray-500 mt-1`
- **Разделитель**: `border-t border-gray-200 my-6`

### Элементы управления
- **Переключатели режимов**: кнопки с активным состоянием для выбора основных режимов работы
- **Селекторы множественного выбора**: чекбоксы для опций, которые можно комбинировать
- **Селекторы единичного выбора**: радиокнопки для взаимоисключающих опций
- **Слайдеры**: для выбора числовых значений (например, количество вопросов)
- **Выпадающие списки**: для выбора из предопределенного набора опций
- **Поля ввода**: для пользовательских значений
- **Цветовое кодирование**: визуальная индикация уровня сложности (зеленый - легкий, желтый - средний, красный - сложный)

### Действия
- **Кнопка "Сбросить к значениям по умолчанию"**: `text-indigo-600 hover:text-indigo-800 text-sm font-medium`
- **Кнопка "Сохранить профиль настроек"**: `text-indigo-600 hover:text-indigo-800 text-sm font-medium`
- **Кнопка "Применить"**: `bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md shadow-sm`
- **Кнопка "Отмена"**: `bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-md shadow-sm border border-gray-300`

## Состояния

### Состояния панели
- **Стандартное**: все настройки доступны для изменения
- **Загрузка**: при загрузке данных или сохранении настроек
- **Ошибка**: с сообщением об ошибке и возможностью повторить действие
- **Режим только для чтения**: при отсутствии прав на изменение настроек

### Состояния элементов
- **Активный элемент**: визуально выделен (для переключателей, опций)
- **Неактивный элемент**: стандартное состояние
- **Отключенный элемент**: недоступен для взаимодействия, визуально приглушен
- **Ховер**: визуальный отклик при наведении
- **Фокус**: визуальный отклик при получении фокуса

## Поведение

### Базовое поведение
- Панель настроек загружается со значениями по умолчанию или сохраненными пользователем настройками
- Изменения в настройках отображаются в интерфейсе немедленно
- Некоторые настройки могут динамически влиять на доступность других настроек

### Зависимости настроек
- При выборе определенного типа теста становятся доступны только релевантные параметры
- При выборе ограничения по времени становятся доступны дополнительные настройки таймера
- При выборе адаптивного режима изменяются доступные опции сложности

### Группы настроек
1. **Основные параметры**
   - Тип теста (множественный выбор, открытые вопросы, смешанный и т.д.)
   - Тематика (орфография, пунктуация, стилистика и т.д.)
   - Уровень сложности (легкий, средний, сложный)
   - Количество вопросов (слайдер или поле ввода)

2. **Временные параметры**
   - Ограничение по времени (вкл/выкл)
   - Длительность теста (если ограничение включено)
   - Отображение таймера (всегда, последние N минут, никогда)

3. **Дополнительные параметры**
   - Показывать правильные ответы после каждого вопроса
   - Перемешивать порядок вопросов
   - Адаптивная сложность (изменение сложности в зависимости от ответов)
   - Ограничение повторного прохождения

4. **Профили настроек**
   - Загрузить сохраненный профиль
   - Сохранить текущие настройки как профиль
   - Управление профилями (переименование, удаление)

### Сохранение настроек
- Автоматическое сохранение в локальное хранилище при изменении
- Возможность экспорта/импорта профилей настроек
- Синхронизация настроек через аккаунт пользователя (если применимо)

## Доступность
- Все элементы управления должны быть доступны с клавиатуры
- Элементы форм должны иметь соответствующие метки
- Группы радиокнопок и чекбоксов должны быть правильно сгруппированы с помощью fieldset и legend
- Слайдеры должны поддерживать управление стрелками и иметь aria-valuemin, aria-valuemax, aria-valuenow
- Сообщения об ошибках должны быть связаны с соответствующими полями через aria-describedby
- Цветовое кодирование должно сопровождаться текстовыми метками

## Адаптивность
- На мобильных устройствах элементы располагаются в один столбец
- Слайдеры и другие элементы управления адаптируются к ширине экрана
- Увеличенные области нажатия для сенсорных устройств
- Упрощенное представление для маленьких экранов (скрытие второстепенных опций в раскрывающиеся секции)

## Пример реализации

```jsx
function SettingsPanel({ initialSettings, onApply, onCancel }) {
  const [settings, setSettings] = useState(initialSettings || defaultSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };
  
  const handleReset = () => {
    setSettings(defaultSettings);
  };
  
  const handleApply = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await onApply(settings);
    } catch (err) {
      setError('Произошла ошибка при сохранении настроек.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Настройки теста</h2>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-6">
        {/* Основные параметры */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-gray-900">Основные параметры</h3>
          
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Тип теста</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {testTypes.map(type => (
                <button
                  key={type.id}
                  className={`px-4 py-2 rounded-md ${
                    settings.basic.testType === type.id
                      ? 'bg-indigo-100 text-indigo-700 border-indigo-300'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  } border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  onClick={() => handleChange('basic', 'testType', type.id)}
                >
                  {type.name}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Тематика</label>
            <div className="flex flex-wrap gap-2">
              {topics.map(topic => (
                <label key={topic.id} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    checked={settings.basic.topics.includes(topic.id)}
                    onChange={(e) => {
                      const newTopics = e.target.checked
                        ? [...settings.basic.topics, topic.id]
                        : settings.basic.topics.filter(id => id !== topic.id);
                      handleChange('basic', 'topics', newTopics);
                    }}
                  />
                  <span className="ml-2 text-sm text-gray-700">{topic.name}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Уровень сложности</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: 'easy', name: 'Легкий', bgClass: 'bg-green-100', textClass: 'text-green-700', borderClass: 'border-green-300' },
                { id: 'medium', name: 'Средний', bgClass: 'bg-yellow-100', textClass: 'text-yellow-700', borderClass: 'border-yellow-300' },
                { id: 'hard', name: 'Сложный', bgClass: 'bg-red-100', textClass: 'text-red-700', borderClass: 'border-red-300' },
              ].map(difficulty => (
                <button
                  key={difficulty.id}
                  className={`px-4 py-2 rounded-md border ${
                    settings.basic.difficulty === difficulty.id
                      ? `${difficulty.bgClass} ${difficulty.textClass} ${difficulty.borderClass}`
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  } text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  onClick={() => handleChange('basic', 'difficulty', difficulty.id)}
                >
                  {difficulty.name}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Количество вопросов: {settings.basic.questionCount}
            </label>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={settings.basic.questionCount}
              onChange={(e) => handleChange('basic', 'questionCount', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>5</span>
              <span>25</span>
              <span>50</span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 my-6"></div>
        
        {/* Временные параметры */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-gray-900">Временные параметры</h3>
          
          <div className="flex items-center">
            <input
              id="time-limit-toggle"
              type="checkbox"
              checked={settings.time.hasTimeLimit}
              onChange={(e) => handleChange('time', 'hasTimeLimit', e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="time-limit-toggle" className="ml-2 block text-sm text-gray-700">
              Ограничение по времени
            </label>
          </div>
          
          {settings.time.hasTimeLimit && (
            <div className="pl-6 space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Длительность теста (минуты): {settings.time.durationMinutes}
                </label>
                <input
                  type="range"
                  min="5"
                  max="120"
                  step="5"
                  value={settings.time.durationMinutes}
                  onChange={(e) => handleChange('time', 'durationMinutes', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>5</span>
                  <span>60</span>
                  <span>120</span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Отображение таймера</label>
                <select
                  value={settings.time.timerDisplay}
                  onChange={(e) => handleChange('time', 'timerDisplay', e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="always">Всегда показывать</option>
                  <option value="lastMinutes">Только в последние 5 минут</option>
                  <option value="never">Не показывать</option>
                </select>
              </div>
            </div>
          )}
        </div>
        
        <div className="border-t border-gray-200 my-6"></div>
        
        {/* Дополнительные параметры */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-gray-900">Дополнительные параметры</h3>
          
          <div className="space-y-2">
            {[
              { id: 'showAnswers', label: 'Показывать правильные ответы после каждого вопроса' },
              { id: 'shuffleQuestions', label: 'Перемешивать порядок вопросов' },
              { id: 'adaptiveDifficulty', label: 'Адаптивная сложность' },
              { id: 'limitRetries', label: 'Ограничить повторное прохождение' },
            ].map(option => (
              <div key={option.id} className="flex items-center">
                <input
                  id={option.id}
                  type="checkbox"
                  checked={settings.additional[option.id]}
                  onChange={(e) => handleChange('additional', option.id, e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor={option.id} className="ml-2 block text-sm text-gray-700">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {settings.additional.limitRetries && (
          <div className="pl-6">
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Минимальный интервал между попытками (часы)
            </label>
            <input
              type="number"
              min="1"
              max="72"
              value={settings.additional.retryHours}
              onChange={(e) => handleChange('additional', 'retryHours', parseInt(e.target.value))}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        )}
        
        <div className="border-t border-gray-200 my-6"></div>
        
        {/* Профили настроек */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-gray-900">Профили настроек</h3>
          
          <div className="flex space-x-3">
            <select
              value={settings.profileId || ''}
              onChange={(e) => loadProfile(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Выберите профиль</option>
              {savedProfiles.map(profile => (
                <option key={profile.id} value={profile.id}>{profile.name}</option>
              ))}
            </select>
            
            <button
              type="button"
              onClick={() => saveCurrentAsProfile()}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Сохранить текущие
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={handleReset}
          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
        >
          Сбросить к значениям по умолчанию
        </button>
        
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-md shadow-sm border border-gray-300"
          >
            Отмена
          </button>
          
          <button
            type="button"
            onClick={handleApply}
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md shadow-sm flex items-center"
          >
            {isLoading && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            Применить
          </button>
        </div>
      </div>
    </div>
  );
}
``` 