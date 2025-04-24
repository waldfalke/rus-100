# UX Контракт: Список вопросов теста

## Метаданные
- **Версия**: 1.0.0
- **Статус**: В разработке
- **Последнее обновление**: 2023-05-23
- **Последний редактор**: AI

## Назначение
Компонент списка вопросов предоставляет интерфейс для просмотра, выбора и управления вопросами, которые включены в генерируемый тест по русскому языку. Он позволяет пользователю видеть доступные вопросы, фильтровать их по типу, сложности и другим параметрам, а также добавлять их в тест.

## Визуальное представление
Компонент представлен в виде интерактивного списка с карточками вопросов, панелью фильтрации и поиска, а также элементами управления для добавления выбранных вопросов в тест. Список может отображаться в различных режимах - сжатом (только основная информация) и расширенном (с предпросмотром вопроса).

Основные визуальные элементы используют следующие Tailwind классы:
- Контейнер списка: `mt-5 overflow-hidden sm:rounded-md`
- Карточка вопроса: `bg-white px-4 py-5 sm:px-6 border-b border-gray-200 hover:bg-gray-50`
- Выбранная карточка: `bg-indigo-50 border-l-4 border-indigo-500`
- Заголовок вопроса: `text-lg font-medium text-gray-900`
- Метки типа задания: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800`
- Метки сложности: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`
  - Легкий: `bg-green-100 text-green-800`
  - Средний: `bg-yellow-100 text-yellow-800`
  - Сложный: `bg-red-100 text-red-800`
- Панель фильтров: `bg-white p-4 border-b border-gray-200`
- Поле поиска: `focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md`
- Кнопки управления: `inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`
- Пагинация: `bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6`

## Состояния
- **Карточка вопроса — нормальная**: `bg-white hover:bg-gray-50`
- **Карточка вопроса — выбранная**: `bg-indigo-50 border-l-4 border-indigo-500`
- **Карточка вопроса — наведение**: `hover:bg-gray-50`
- **Кнопка добавления — активная**: `bg-indigo-600 hover:bg-indigo-700`
- **Кнопка добавления — отключенная**: `bg-gray-300 cursor-not-allowed`
- **Фильтр — выбранный**: `bg-indigo-100 text-indigo-800`
- **Фильтр — не выбранный**: `bg-gray-100 text-gray-800`
- **Список — загрузка**: Отображает индикатор загрузки при загрузке вопросов или применении фильтров
- **Список — пустой**: Отображает сообщение об отсутствии вопросов

## Поведение
- Вопросы загружаются асинхронно с возможностью пагинации
- При нажатии на карточку вопроса она выделяется и может быть добавлена в тест
- Поиск работает в реальном времени по мере ввода текста
- Фильтры можно комбинировать для уточнения списка вопросов
- Множественный выбор вопросов через чекбоксы или с зажатой клавишей Shift/Ctrl
- Перетаскивание вопросов для изменения порядка в тесте (drag-and-drop)
- Возможность просмотра предпросмотра вопроса без перехода на другую страницу
- Быстрое добавление вопросов в тест через кнопку или двойной клик

## Доступность
- Карточки вопросов имеют атрибут `role="listitem"`
- Контейнер списка имеет атрибут `role="list"`
- Элементы выбора имеют атрибуты `aria-selected="true/false"`
- Элементы управления и фильтры доступны с клавиатуры
- Уведомления о результатах действий объявляются для скринридеров
- Цветовая индикация дублируется текстовыми метками
- Поддержка навигации с клавиатуры между элементами списка
- Возможность управления всеми функциями без использования мыши

## Адаптивность
- На мобильных устройствах карточки вопросов представлены в сжатом виде
- Панель фильтров трансформируется в выпадающее меню на узких экранах
- Элементы управления адаптируются для удобного использования на тачскринах
- Количество отображаемых вопросов на странице адаптируется в зависимости от размера экрана
- Многоколоночный режим на больших экранах для более эффективного использования пространства
- Фиксированная панель с выбранными вопросами при прокрутке длинного списка

## Примеры использования
```jsx
// Пример разметки списка вопросов
<div>
  {/* Панель фильтров */}
  <div className="bg-white p-4 border-b border-gray-200">
    <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
      <div className="relative flex-grow">
        <input
          type="text"
          placeholder="Поиск вопросов..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <select
          value={difficultyFilter}
          onChange={handleDifficultyChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="">Все уровни сложности</option>
          <option value="easy">Легкий</option>
          <option value="medium">Средний</option>
          <option value="hard">Сложный</option>
        </select>
        
        <select
          value={typeFilter}
          onChange={handleTypeChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="">Все типы заданий</option>
          <option value="grammar">Грамматика</option>
          <option value="vocabulary">Лексика</option>
          <option value="syntax">Синтаксис</option>
          <option value="essay">Сочинение</option>
        </select>
      </div>
      
      <button
        onClick={handleClearFilters}
        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Сбросить фильтры
      </button>
    </div>
  </div>

  {/* Список вопросов */}
  {isLoading ? (
    <div className="flex justify-center items-center h-64">
      <svg className="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
  ) : questions.length === 0 ? (
    <div className="bg-white px-4 py-12 sm:px-6 text-center">
      <p className="text-gray-500">Нет вопросов, соответствующих вашим фильтрам</p>
      <button
        onClick={handleClearFilters}
        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Сбросить фильтры
      </button>
    </div>
  ) : (
    <div role="list" className="mt-5 overflow-hidden sm:rounded-md">
      {questions.map((question) => (
        <div
          key={question.id}
          role="listitem"
          onClick={() => handleQuestionSelect(question)}
          className={`bg-white px-4 py-5 sm:px-6 border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${
            selectedQuestions.includes(question.id) ? 'bg-indigo-50 border-l-4 border-indigo-500' : ''
          }`}
          aria-selected={selectedQuestions.includes(question.id)}
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {question.title}
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {questionTypeLabels[question.type]}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                  question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {difficultyLabels[question.difficulty]}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                {question.description}
              </p>
            </div>
            <div className="ml-4 flex-shrink-0">
              <input
                type="checkbox"
                checked={selectedQuestions.includes(question.id)}
                onChange={(e) => {
                  e.stopPropagation();
                  handleQuestionCheckbox(question.id);
                }}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
            </div>
          </div>
          {expandedQuestions.includes(question.id) && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <div dangerouslySetInnerHTML={{ __html: question.content }} />
            </div>
          )}
        </div>
      ))}
    </div>
  )}

  {/* Пагинация */}
  <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
    <div className="flex-1 flex justify-between sm:hidden">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
          currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
      >
        Предыдущая
      </button>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
          currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
      >
        Следующая
      </button>
    </div>
    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
      <div>
        <p className="text-sm text-gray-700">
          Показано <span className="font-medium">{((currentPage - 1) * pageSize) + 1}</span> по <span className="font-medium">{Math.min(currentPage * pageSize, totalQuestions)}</span> из <span className="font-medium">{totalQuestions}</span> вопросов
        </p>
      </div>
      <div>
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
              currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-500 hover:bg-gray-50'
            }`}
          >
            <span className="sr-only">Предыдущая</span>
            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
          </button>
          {/* Номера страниц */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
            if (page <= totalPages) {
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    currentPage === page ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            }
            return null;
          })}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
              currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-500 hover:bg-gray-50'
            }`}
          >
            <span className="sr-only">Следующая</span>
            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </nav>
      </div>
    </div>
  </div>

  {/* Панель выбранных вопросов */}
  {selectedQuestions.length > 0 && (
    <div className="fixed bottom-0 inset-x-0 pb-2 sm:pb-5">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="p-2 rounded-lg bg-indigo-600 shadow-lg sm:p-3">
          <div className="flex items-center justify-between flex-wrap">
            <div className="w-0 flex-1 flex items-center">
              <span className="flex p-2 rounded-lg bg-indigo-800">
                <DocumentIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </span>
              <p className="ml-3 font-medium text-white truncate">
                <span className="md:hidden">Выбрано {selectedQuestions.length} вопросов</span>
                <span className="hidden md:inline">Выбрано {selectedQuestions.length} вопросов для теста</span>
              </p>
            </div>
            <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
              <button
                onClick={handleAddSelectedToTest}
                className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50"
              >
                Добавить в тест
              </button>
            </div>
            <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-2">
              <button
                onClick={handleClearSelection}
                className="-mr-1 flex p-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white"
              >
                <span className="sr-only">Очистить выбор</span>
                <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )}
</div>
```

## Предусловия и постусловия
- **Предусловия**: 
  - Должны быть загружены данные о доступных вопросах
  - Должны быть доступны данные о типах вопросов и уровнях сложности
  - Пользователь должен иметь соответствующие права для доступа к вопросам

- **Постусловия**:
  - Выбранные вопросы добавляются в создаваемый тест
  - Список выбранных вопросов обновляется после каждого действия пользователя
  - При добавлении вопросов в тест пользователь получает подтверждение

## Инварианты
- Один и тот же вопрос не может быть добавлен в тест дважды
- Количество вопросов в тесте соответствует ограничениям, указанным в конфигурации
- Фильтры и поиск всегда отражают актуальный набор доступных вопросов
- Состояние выбора вопросов сохраняется между страницами при пагинации
- При изменении фильтров список вопросов обновляется с учетом текущих критериев 