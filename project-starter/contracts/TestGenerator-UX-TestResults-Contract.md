# UX Контракт: Компонент результатов теста

## Метаданные
- **Версия**: 1.0.0
- **Статус**: В разработке
- **Последнее обновление**: 2023-05-23
- **Последний редактор**: AI

## Назначение
Компонент результатов теста предоставляет интерфейс для отображения и анализа результатов прохождения теста по русскому языку. Он позволяет преподавателям и учащимся просматривать статистику ответов, правильные и неправильные ответы, анализировать ошибки и отслеживать прогресс.

## Визуальное представление
Компонент представлен в виде интерактивной панели с несколькими секциями: общая статистика, детализация по вопросам, график распределения ответов и возможность экспорта/печати результатов.

Основные визуальные элементы используют следующие Tailwind классы:
- Контейнер результатов: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8`
- Карточка с общей статистикой: `bg-white rounded-lg shadow-md overflow-hidden`
- Заголовок статистики: `text-xl font-semibold text-gray-900 px-6 py-4 bg-gray-50 border-b border-gray-200`
- Блок с показателями: `flex flex-col sm:flex-row justify-between divide-y sm:divide-y-0 sm:divide-x divide-gray-200`
- Показатель: `px-6 py-5 text-center sm:flex-1`
- Значение показателя: `text-3xl font-bold text-gray-900`
- Подпись показателя: `mt-1 text-sm font-medium text-gray-500`
- Список вопросов: `mt-6 bg-white shadow rounded-lg divide-y divide-gray-200`
- Вопрос: `px-6 py-5 flex flex-col md:flex-row md:items-center justify-between`
- Правильный ответ: `text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium`
- Неправильный ответ: `text-red-600 bg-red-50 px-3 py-1 rounded-full text-sm font-medium`
- Кнопка экспорта: `inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-6`
- График: `w-full h-64 sm:h-96 mt-6 bg-white rounded-lg shadow-md p-4`

## Состояния
- **Вопрос — правильный ответ**: `text-green-800 bg-green-50 hover:bg-green-100`
- **Вопрос — неправильный ответ**: `text-red-800 bg-red-50 hover:bg-red-100`
- **Вопрос — не отвеченный**: `text-gray-500 bg-gray-50 hover:bg-gray-100`
- **Вопрос — раскрытый (с деталями)**: `border-l-4 border-indigo-500`
- **Вопрос — свернутый**: Стандартное состояние
- **Кнопка экспорта — активная**: `bg-indigo-600 hover:bg-indigo-700`
- **Кнопка экспорта — загрузка**: Отображает индикатор загрузки и блокирует повторные нажатия
- **Статистика — загрузка**: Отображает скелетную загрузку вместо реальных данных

## Поведение
- При открытии страницы данные загружаются асинхронно
- При клике на вопрос раскрываются детали: текст вопроса, правильный ответ, ответ учащегося, пояснение
- Фильтрация вопросов по категориям: все, правильные, неправильные, пропущенные
- Сортировка вопросов по сложности, типу, номеру или результату
- Экспорт результатов в различные форматы: PDF, CSV, XLSX
- Возможность поделиться результатами по ссылке или отправить на email
- Переключение между представлениями: список и графики/диаграммы
- Печать результатов с адаптированной для печати версткой
- Сохранение сессии при обновлении страницы и возможность вернуться к результатам позже

## Доступность
- Все интерактивные элементы доступны с клавиатуры
- Контрастные цвета для текста и фона обеспечивают хорошую читаемость
- Семантическая разметка с использованием правильных HTML5 элементов
- Корректное использование ARIA-атрибутов
- Реализация фокусных состояний для навигации с клавиатуры
- Использование HTML таблиц с заголовками для статистических данных
- Графики сопровождаются текстовым описанием для скринридеров
- Анимации и переходы подчиняются предпочтениям пользователя по reduced motion

## Адаптивность
- На мобильных устройствах показатели отображаются в столбик
- Графики адаптируются под размер экрана устройства
- На маленьких экранах детали вопросов занимают полную ширину в раскрытом виде
- Кнопки и интерактивные элементы увеличиваются для удобства взаимодействия на тачскринах
- Таблицы трансформируются в карточки на маленьких экранах
- Навигация между секциями результатов упрощается на мобильных устройствах
- Панель фильтров трансформируется в выпадающее меню

## Примеры использования
```jsx
// Пример разметки компонента результатов теста
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <div className="md:flex md:items-center md:justify-between">
    <div className="flex-1 min-w-0">
      <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
        Результаты теста: {testName}
      </h2>
      <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
          {formatDate(completionDate)}
        </div>
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <UserIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
          {studentName}
        </div>
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
          Время: {formatDuration(duration)}
        </div>
      </div>
    </div>
    <div className="mt-5 flex lg:mt-0 lg:ml-4">
      <span className="hidden sm:block ml-3">
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PrinterIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" aria-hidden="true" />
          Печать
        </button>
      </span>
      <span className="sm:ml-3">
        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <DownloadIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Экспорт PDF
        </button>
      </span>
    </div>
  </div>

  {/* Общая статистика */}
  <div className="bg-white rounded-lg shadow-md overflow-hidden mt-8">
    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
      <h3 className="text-lg leading-6 font-medium text-gray-900">
        Общая статистика
      </h3>
    </div>
    <div className="flex flex-col sm:flex-row justify-between divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
      <div className="px-6 py-5 text-center sm:flex-1">
        <dt className="text-sm font-medium text-gray-500 truncate">Общий балл</dt>
        <dd className="mt-1 text-3xl font-semibold text-gray-900">{score}/{maxScore}</dd>
        <p className="mt-1 text-sm font-medium text-gray-500">{(score / maxScore * 100).toFixed(0)}%</p>
      </div>

      <div className="px-6 py-5 text-center sm:flex-1">
        <dt className="text-sm font-medium text-gray-500 truncate">Правильных ответов</dt>
        <dd className="mt-1 text-3xl font-semibold text-green-600">{correctAnswers}</dd>
        <p className="mt-1 text-sm font-medium text-gray-500">из {totalQuestions} вопросов</p>
      </div>

      <div className="px-6 py-5 text-center sm:flex-1">
        <dt className="text-sm font-medium text-gray-500 truncate">Неправильных ответов</dt>
        <dd className="mt-1 text-3xl font-semibold text-red-600">{incorrectAnswers}</dd>
        <p className="mt-1 text-sm font-medium text-gray-500">{(incorrectAnswers / totalQuestions * 100).toFixed(0)}%</p>
      </div>

      <div className="px-6 py-5 text-center sm:flex-1">
        <dt className="text-sm font-medium text-gray-500 truncate">Среднее время на вопрос</dt>
        <dd className="mt-1 text-3xl font-semibold text-gray-900">{avgTimePerQuestion}с</dd>
        <p className="mt-1 text-sm font-medium text-gray-500">Общее время: {formatDuration(duration)}</p>
      </div>
    </div>
  </div>

  {/* Визуализация результатов */}
  <div className="w-full h-64 sm:h-96 mt-8 bg-white rounded-lg shadow-md p-4">
    <div className="flex flex-col h-full">
      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
        Распределение ответов по категориям
      </h3>
      <div className="flex-grow" aria-hidden="true">
        {/* Здесь будет компонент графика */}
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="sr-only">
        {/* Доступное текстовое описание для скринридеров */}
        <ul>
          {categoryData.map((category) => (
            <li key={category.name}>{category.name}: {category.value} вопросов ({(category.value / totalQuestions * 100).toFixed(0)}%)</li>
          ))}
        </ul>
      </div>
    </div>
  </div>

  {/* Фильтры и сортировка */}
  <div className="bg-white rounded-lg shadow-md mt-8 px-6 py-4">
    <div className="sm:flex sm:justify-between sm:items-center">
      <div className="flex items-center space-x-4">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Детальные результаты
        </h3>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>Всего: {totalQuestions}</span>
          <span>•</span>
          <span className="text-green-600">{correctAnswers} правильных</span>
          <span>•</span>
          <span className="text-red-600">{incorrectAnswers} неправильных</span>
          {skippedAnswers > 0 && (
            <>
              <span>•</span>
              <span className="text-gray-600">{skippedAnswers} пропущенных</span>
            </>
          )}
        </div>
      </div>
      <div className="mt-3 sm:mt-0 sm:ml-4">
        <label htmlFor="filter" className="sr-only">Фильтр вопросов</label>
        <select
          id="filter"
          name="filter"
          value={filter}
          onChange={handleFilterChange}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="all">Все вопросы</option>
          <option value="correct">Правильные ответы</option>
          <option value="incorrect">Неправильные ответы</option>
          <option value="skipped">Пропущенные вопросы</option>
        </select>
      </div>
    </div>
  </div>

  {/* Список вопросов с результатами */}
  <div className="mt-4 bg-white shadow rounded-lg divide-y divide-gray-200">
    {filteredQuestions.map((question) => (
      <div
        key={question.id}
        className={`px-6 py-5 ${
          expandedQuestions.includes(question.id) ? 'border-l-4 border-indigo-500' : ''
        } ${
          question.status === 'correct' ? 'hover:bg-green-50' :
          question.status === 'incorrect' ? 'hover:bg-red-50' :
          'hover:bg-gray-50'
        } cursor-pointer`}
        onClick={() => toggleQuestionExpand(question.id)}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex-1">
            <h4 className="text-lg font-medium text-gray-900 flex items-center">
              <span className="bg-gray-200 text-gray-700 w-7 h-7 rounded-full inline-flex items-center justify-center mr-3">
                {question.number}
              </span>
              {question.title}
            </h4>
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
          </div>
          <div className="mt-4 md:mt-0 flex items-center">
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-4">
                {question.points} / {question.maxPoints} баллов
              </span>
              <span className={`flex-shrink-0 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                question.status === 'correct' ? 'text-green-600 bg-green-50' :
                question.status === 'incorrect' ? 'text-red-600 bg-red-50' :
                'text-gray-600 bg-gray-50'
              }`}>
                {question.status === 'correct' ? 'Верно' :
                 question.status === 'incorrect' ? 'Неверно' :
                 'Пропущено'}
              </span>
            </div>
            <ChevronDownIcon
              className={`ml-3 h-5 w-5 text-gray-400 transform ${
                expandedQuestions.includes(question.id) ? 'rotate-180' : ''
              }`}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Развернутая информация о вопросе */}
        {expandedQuestions.includes(question.id) && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="prose prose-sm max-w-none">
              <h5 className="text-base font-medium text-gray-900 mb-2">Вопрос:</h5>
              <div dangerouslySetInnerHTML={{ __html: question.content }} />
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-base font-medium text-gray-900 mb-2">Правильный ответ:</h5>
                  <div className="bg-green-50 p-3 rounded-md">
                    <p className="text-green-800">{question.correctAnswer}</p>
                  </div>
                </div>
                <div>
                  <h5 className="text-base font-medium text-gray-900 mb-2">Ваш ответ:</h5>
                  <div className={`p-3 rounded-md ${
                    question.status === 'correct' ? 'bg-green-50' :
                    question.status === 'incorrect' ? 'bg-red-50' :
                    'bg-gray-50'
                  }`}>
                    <p className={
                      question.status === 'correct' ? 'text-green-800' :
                      question.status === 'incorrect' ? 'text-red-800' :
                      'text-gray-500 italic'
                    }>
                      {question.userAnswer || 'Нет ответа'}
                    </p>
                  </div>
                </div>
              </div>
              
              {question.explanation && (
                <div className="mt-4">
                  <h5 className="text-base font-medium text-gray-900 mb-2">Объяснение:</h5>
                  <div className="bg-yellow-50 p-3 rounded-md">
                    <p className="text-yellow-800">{question.explanation}</p>
                  </div>
                </div>
              )}
              
              {question.status === 'incorrect' && question.commonMistakes && (
                <div className="mt-4">
                  <h5 className="text-base font-medium text-gray-900 mb-2">Распространенные ошибки:</h5>
                  <ul className="list-disc pl-5 text-gray-700 space-y-1">
                    {question.commonMistakes.map((mistake, index) => (
                      <li key={index}>{mistake}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    ))}
  </div>

  {/* Рекомендации */}
  {recommendations.length > 0 && (
    <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Рекомендации для улучшения
        </h3>
      </div>
      <div className="px-6 py-5">
        <ul className="space-y-4">
          {recommendations.map((recommendation, index) => (
            <li key={index} className="flex">
              <LightBulbIcon className="h-6 w-6 text-yellow-500 flex-shrink-0 mr-3" aria-hidden="true" />
              <p className="text-gray-700">{recommendation}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )}
</div>
```

## Предусловия и постусловия
- **Предусловия**:
  - Тест должен быть полностью выполнен и представлен для оценки
  - Должны быть доступны все данные о вопросах, ответах и правильных ответах
  - Результаты должны быть корректно сохранены в системе

- **Постусловия**:
  - Пользователь должен получить полную информацию о своих результатах
  - Данные о прохождении теста должны быть сохранены в истории пользователя
  - При необходимости результаты должны быть отправлены преподавателю/координатору

## Инварианты
- Общее количество баллов всегда соответствует сумме баллов за каждый вопрос
- Процент правильных ответов всегда корректно рассчитывается на основе количества верных ответов
- Все специфические для вопроса данные (например, выбранные варианты) всегда связаны с правильным вопросом
- Время прохождения теста всегда отображается корректно
- Статистические данные всегда основаны на фактических результатах теста
- Рекомендации формируются на основе конкретных ошибок в тесте
- Данные о прохождении надежно хранятся и не могут быть изменены пользователем 