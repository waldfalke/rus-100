# Контракт создания тестов

## Метаданные
- **Версия**: 1.0.0
- **Статус**: В разработке
- **Последнее обновление**: 2023-05-20
- **Последний редактор**: Claude
- **Ветка разработки**: main

## История изменений
| Дата | Версия | Автор | Описание изменений | PR |
|------|--------|-------|-------------------|-----|
| 2023-05-20 | 1.0.0 | Claude | Начальная версия | - |

## Назначение

Данный контракт описывает компонент создания тестов в системе подготовки к ЕГЭ, включая его функциональность, интерфейсы, входные и выходные данные.

## Общее описание компонента

Компонент создания тестов предоставляет учителям возможность создавать тесты для подготовки учеников к ЕГЭ. Учитель может выбирать предметы, темы, типы вопросов и уровни сложности, а система предлагает соответствующие задания из банка заданий. Учитель может формировать тесты как вручную, так и с помощью автоматизированных инструментов.

## Компоненты системы

### TestCreator (Создатель тестов)

#### Функциональность
- Создание нового теста
- Выбор предмета и тем для теста
- Настройка параметров теста (название, описание, ограничение по времени)
- Добавление вопросов в тест
- Упорядочивание вопросов в тесте
- Установка баллов за вопросы
- Предварительный просмотр теста
- Сохранение и публикация теста

#### Интерфейсы
- **createTest**: Создание нового теста
- **updateTest**: Обновление существующего теста
- **deleteTest**: Удаление теста
- **getTestById**: Получение теста по идентификатору
- **publishTest**: Публикация теста для назначения ученикам

#### Входные данные
- Информация о тесте (название, описание, предмет, время)
- Список вопросов
- Информация о баллах за вопросы
- Флаг публикации

#### Выходные данные
- Созданный или обновленный тест
- Статус операции (успех/ошибка)
- Сообщения об ошибках (если есть)

### QuestionSelector (Селектор вопросов)

#### Функциональность
- Поиск вопросов по предмету
- Поиск вопросов по теме
- Поиск вопросов по типу
- Поиск вопросов по уровню сложности
- Фильтрация и сортировка вопросов
- Просмотр деталей вопроса
- Выбор вопросов для добавления в тест

#### Интерфейсы
- **searchQuestions**: Поиск вопросов по критериям
- **getQuestionById**: Получение вопроса по идентификатору
- **getQuestionsByIds**: Получение вопросов по списку идентификаторов
- **getQuestionsByTopic**: Получение вопросов по теме
- **getQuestionsByType**: Получение вопросов по типу
- **getQuestionsByDifficulty**: Получение вопросов по сложности

#### Входные данные
- Критерии поиска (предмет, тема, тип, сложность)
- Параметры фильтрации и сортировки
- Параметры пагинации

#### Выходные данные
- Список вопросов, соответствующих критериям
- Общее количество вопросов
- Метаданные (количество вопросов по темам, типам, сложности)

### TestGenerator (Генератор тестов)

#### Функциональность
- Автоматическое создание теста по заданным критериям
- Балансировка вопросов по темам
- Балансировка вопросов по типам
- Балансировка вопросов по сложности
- Генерация вариантов теста

#### Интерфейсы
- **generateTest**: Генерация теста по критериям
- **generateVariants**: Генерация вариантов теста
- **balanceTest**: Балансировка существующего теста

#### Входные данные
- Критерии генерации (предмет, темы, типы вопросов, сложность)
- Количество вопросов
- Параметры балансировки
- Количество вариантов (для generateVariants)

#### Выходные данные
- Сгенерированный тест или список вариантов
- Метаданные теста (распределение по темам, типам, сложности)
- Статус операции (успех/ошибка)

### TestValidator (Валидатор тестов)

#### Функциональность
- Проверка корректности теста
- Проверка полноты теста
- Проверка баланса вопросов
- Выявление потенциальных проблем

#### Интерфейсы
- **validateTest**: Валидация теста
- **checkBalance**: Проверка баланса вопросов
- **suggestImprovements**: Предложение улучшений

#### Входные данные
- Тест для валидации
- Параметры валидации

#### Выходные данные
- Результат валидации (успех/ошибка)
- Список проблем (если есть)
- Предложения по улучшению (если есть)

## Алгоритмы и процессы

### Процесс создания теста вручную
1. Учитель инициирует создание нового теста
2. Учитель указывает основные параметры теста (название, описание, предмет, ограничение по времени)
3. Учитель выбирает темы для теста
4. Система предлагает вопросы из банка заданий, соответствующие выбранным темам
5. Учитель выбирает вопросы и добавляет их в тест
6. Учитель указывает порядок вопросов и количество баллов за каждый вопрос
7. Система валидирует тест и предлагает улучшения (при необходимости)
8. Учитель сохраняет и публикует тест

### Процесс автоматической генерации теста
1. Учитель инициирует автоматическую генерацию теста
2. Учитель указывает основные параметры теста (название, описание, предмет, ограничение по времени)
3. Учитель выбирает темы, типы вопросов и уровни сложности
4. Учитель указывает общее количество вопросов и параметры балансировки
5. Система генерирует тест, соответствующий указанным критериям
6. Система предлагает сгенерированный тест учителю для просмотра и корректировки
7. Учитель вносит необходимые изменения
8. Учитель сохраняет и публикует тест

### Алгоритм автоматического выбора вопросов
1. Система определяет количество вопросов для каждой темы на основе параметров балансировки
2. Система определяет количество вопросов каждого типа для каждой темы
3. Система определяет распределение уровней сложности
4. Для каждой комбинации (тема, тип, сложность) система выбирает случайные вопросы из банка заданий
5. Система проверяет полноту и баланс выбранных вопросов
6. Если необходимо, система корректирует выбор для достижения требуемого баланса

## Взаимодействие с другими компонентами

### Компонент управления пользователями
- Получение информации о текущем пользователе (учителе)
- Проверка прав доступа на создание и редактирование тестов

### Компонент управления банком заданий
- Получение вопросов по заданным критериям
- Просмотр деталей вопросов

### Компонент назначения тестов
- Передача созданных тестов для назначения ученикам или группам

## Нефункциональные требования

### Производительность
- Время поиска вопросов по критериям: не более 2 секунд для любых критериев
- Время генерации теста: не более 5 секунд для теста из 30 вопросов
- Время сохранения теста: не более 1 секунды

### Масштабируемость
- Поддержка банка заданий объемом не менее 100 000 вопросов
- Поддержка создания и хранения не менее 10 000 тестов
- Поддержка одновременной работы не менее 100 учителей

### Безопасность
- Доступ к созданию тестов только для пользователей с ролью "Учитель"
- Защита тестов от несанкционированного доступа
- Логирование всех операций создания, изменения и удаления тестов

## Ограничения и допущения
- Максимальное количество вопросов в одном тесте: 100
- Максимальное количество баллов за один вопрос: 10
- Максимальное ограничение времени на тест: 240 минут (4 часа)
- Типы вопросов ограничены предопределенным набором (с одним ответом, с множественным выбором, с коротким ответом, с развернутым ответом)

## Примеры использования

### Пример 1: Создание теста по математике
```
1. Учитель входит в систему и переходит в раздел "Создание теста"
2. Учитель указывает название "Подготовка к ЕГЭ по математике: Тригонометрия"
3. Учитель выбирает предмет "Математика"
4. Учитель выбирает темы "Тригонометрические функции", "Тригонометрические уравнения"
5. Система предлагает вопросы по выбранным темам
6. Учитель выбирает 20 вопросов разного типа и сложности
7. Учитель устанавливает порядок вопросов и баллы (от 1 до 5 в зависимости от сложности)
8. Учитель устанавливает ограничение времени 90 минут
9. Учитель сохраняет и публикует тест
```

### Пример 2: Автоматическая генерация теста
```
1. Учитель входит в систему и переходит в раздел "Создание теста"
2. Учитель выбирает опцию "Автоматическая генерация"
3. Учитель указывает название "Пробный ЕГЭ по русскому языку"
4. Учитель выбирает предмет "Русский язык"
5. Учитель выбирает все темы предмета
6. Учитель устанавливает параметры: 30 вопросов, баланс по темам пропорционально их весу в ЕГЭ, 70% легких и средних вопросов, 30% сложных
7. Система генерирует тест и показывает его учителю
8. Учитель просматривает тест, заменяет несколько вопросов
9. Учитель устанавливает ограничение времени 120 минут
10. Учитель сохраняет и публикует тест
```

## Связанные контракты
- [Question Bank Contract](./contracts/question-bank-contract.md)
- [Test Assignment Contract](./contracts/test-assignment-contract.md)
- [User Management Contract](./contracts/user-management-contract.md)
- [Database Schema Contract](./Database-Schema-Contract.md) 