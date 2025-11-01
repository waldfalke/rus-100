# Контракт схемы базы данных

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

Данный контракт описывает структуру базы данных для системы подготовки к ЕГЭ, включая все таблицы, их поля, типы данных, ключи и связи между ними.

### Preconditions
- Установлено активное и валидное соединение с СУБД (PostgreSQL/MySQL).
- Любые операции записи (INSERT, UPDATE) должны предоставлять данные, соответствующие типам и ограничениям (`NOT NULL`, `UNIQUE`) полей, описанных в схеме.
- Для операций, затрагивающих связанные таблицы, должны существовать соответствующие записи в родительских таблицах (для `FOREIGN KEY`).
- Приложение, взаимодействующее с БД, должно использовать корректные SQL-запросы или ORM-методы, соответствующие данной схеме.

### Postconditions
- После успешной операции `INSERT` новая запись появляется в соответствующей таблице, `id` (если `AUTO_INCREMENT`) сгенерирован, значения по умолчанию установлены, индексы обновлены.
- После успешной операции `UPDATE` данные в указанной записи обновлены, поле `updated_at` (если есть) обновлено, индексы обновлены.
- После успешной операции `DELETE` запись удалена из таблицы. Зависимые записи (с `ON DELETE CASCADE`) также удалены.
- Операции чтения (`SELECT`) возвращают данные, соответствующие структуре таблиц и условиям запроса.

### Invariants
- **Целостность данных**: Все ограничения (`PRIMARY KEY`, `FOREIGN KEY`, `UNIQUE`, `NOT NULL`, `CHECK`) должны соблюдаться всегда.
    - Не может быть двух записей с одинаковым `PRIMARY KEY`.
    - Значения `FOREIGN KEY` должны ссылаться на существующие записи в родительской таблице или быть `NULL` (если разрешено).
    - Значения в `UNIQUE` столбцах должны быть уникальными (с учетом `NULL`).
    - Поля `NOT NULL` не могут содержать `NULL`.
    - Ограничения `CHECK` (например, в `TestAssignments`) всегда истинны.
- **Типы данных**: Данные, хранящиеся в каждом поле, всегда соответствуют указанному типу (e.g., `VARCHAR`, `BIGINT`, `TIMESTAMP`, `BOOLEAN`).
- **Структура схемы**: Названия таблиц, полей, их типы и ограничения остаются неизменными, если не была произведена контролируемая миграция схемы.
- **Индексы**: Определенные индексы существуют и поддерживаются СУБД для ускорения запросов.

### Exceptions
- **Нарушение ограничений**: Попытка `INSERT` или `UPDATE`, нарушающая `UNIQUE`, `NOT NULL`, `FOREIGN KEY` или `CHECK` ограничения, приводит к ошибке СУБД (e.g., `IntegrityError`, `ConstraintViolation`).
- **Неверный тип данных**: Попытка записать данные несовместимого типа в поле.
- **Ошибка соединения**: Потеря соединения с БД во время операции.
- **Взаимная блокировка (Deadlock)**: Если транзакции блокируют друг друга.
- **Несуществующая таблица/поле**: Попытка выполнить запрос к несуществующей таблице или полю (обычно указывает на рассинхронизацию приложения и схемы БД).
- **Ошибка прав доступа**: Попытка выполнить операцию без необходимых привилегий пользователя БД.

## Общая структура базы данных

База данных будет реализована с использованием реляционной СУБД (PostgreSQL/MySQL).

### Основные таблицы

1. **Users** - Пользователи системы
2. **Roles** - Роли пользователей
3. **UserRoles** - Связь пользователей и ролей
4. **Groups** - Группы учеников
5. **UserGroups** - Связь пользователей и групп
6. **Subjects** - Предметы ЕГЭ
7. **Topics** - Темы в рамках предметов
8. **QuestionTypes** - Типы вопросов
9. **Questions** - База вопросов
10. **Tests** - Тесты
11. **TestQuestions** - Связь тестов и вопросов
12. **TestAssignments** - Назначение тестов ученикам/группам
13. **UserAnswers** - Ответы пользователей на вопросы
14. **TestResults** - Результаты тестов
15. **Materials** - Учебные материалы

## Структура таблиц

### Users
| Поле | Тип | Описание | Ограничения |
|------|-----|----------|-------------|
| id | BIGINT | Уникальный идентификатор | PRIMARY KEY, AUTO_INCREMENT |
| username | VARCHAR(50) | Имя пользователя | UNIQUE, NOT NULL |
| email | VARCHAR(100) | Email пользователя | UNIQUE, NOT NULL |
| password_hash | VARCHAR(255) | Хеш пароля | NOT NULL |
| first_name | VARCHAR(50) | Имя | NOT NULL |
| last_name | VARCHAR(50) | Фамилия | NOT NULL |
| middle_name | VARCHAR(50) | Отчество | |
| is_active | BOOLEAN | Активен ли пользователь | DEFAULT TRUE |
| created_at | TIMESTAMP | Дата создания | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Дата обновления | DEFAULT CURRENT_TIMESTAMP |

### Roles
| Поле | Тип | Описание | Ограничения |
|------|-----|----------|-------------|
| id | BIGINT | Уникальный идентификатор | PRIMARY KEY, AUTO_INCREMENT |
| name | VARCHAR(50) | Название роли | UNIQUE, NOT NULL |
| description | TEXT | Описание роли | |

### UserRoles
| Поле | Тип | Описание | Ограничения |
|------|-----|----------|-------------|
| user_id | BIGINT | ID пользователя | FOREIGN KEY (Users.id) |
| role_id | BIGINT | ID роли | FOREIGN KEY (Roles.id) |
| PRIMARY KEY | | | (user_id, role_id) |

### Groups
| Поле | Тип | Описание | Ограничения |
|------|-----|----------|-------------|
| id | BIGINT | Уникальный идентификатор | PRIMARY KEY, AUTO_INCREMENT |
| name | VARCHAR(100) | Название группы | NOT NULL |
| description | TEXT | Описание группы | |
| teacher_id | BIGINT | ID учителя-создателя | FOREIGN KEY (Users.id) |
| created_at | TIMESTAMP | Дата создания | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Дата обновления | DEFAULT CURRENT_TIMESTAMP |

### UserGroups
| Поле | Тип | Описание | Ограничения |
|------|-----|----------|-------------|
| user_id | BIGINT | ID пользователя | FOREIGN KEY (Users.id) |
| group_id | BIGINT | ID группы | FOREIGN KEY (Groups.id) |
| PRIMARY KEY | | | (user_id, group_id) |

### Subjects
| Поле | Тип | Описание | Ограничения |
|------|-----|----------|-------------|
| id | BIGINT | Уникальный идентификатор | PRIMARY KEY, AUTO_INCREMENT |
| name | VARCHAR(100) | Название предмета | UNIQUE, NOT NULL |
| description | TEXT | Описание предмета | |

### Topics
| Поле | Тип | Описание | Ограничения |
|------|-----|----------|-------------|
| id | BIGINT | Уникальный идентификатор | PRIMARY KEY, AUTO_INCREMENT |
| subject_id | BIGINT | ID предмета | FOREIGN KEY (Subjects.id) |
| name | VARCHAR(100) | Название темы | NOT NULL |
| description | TEXT | Описание темы | |
| parent_topic_id | BIGINT | ID родительской темы | FOREIGN KEY (Topics.id) |

### QuestionTypes
| Поле | Тип | Описание | Ограничения |
|------|-----|----------|-------------|
| id | BIGINT | Уникальный идентификатор | PRIMARY KEY, AUTO_INCREMENT |
| name | VARCHAR(100) | Название типа вопроса | UNIQUE, NOT NULL |
| description | TEXT | Описание типа вопроса | |
| answer_format | VARCHAR(50) | Формат ответа | NOT NULL |

### Questions
| Поле | Тип | Описание | Ограничения |
|------|-----|----------|-------------|
| id | BIGINT | Уникальный идентификатор | PRIMARY KEY, AUTO_INCREMENT |
| topic_id | BIGINT | ID темы | FOREIGN KEY (Topics.id) |
| type_id | BIGINT | ID типа вопроса | FOREIGN KEY (QuestionTypes.id) |
| difficulty | INT | Сложность вопроса (1-10) | DEFAULT 5 |
| text | TEXT | Текст вопроса | NOT NULL |
| options | TEXT | Варианты ответа (JSON) | |
| correct_answer | TEXT | Правильный ответ | NOT NULL |
| explanation | TEXT | Объяснение ответа | |
| created_by | BIGINT | ID создателя | FOREIGN KEY (Users.id) |
| created_at | TIMESTAMP | Дата создания | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Дата обновления | DEFAULT CURRENT_TIMESTAMP |

### Tests
| Поле | Тип | Описание | Ограничения |
|------|-----|----------|-------------|
| id | BIGINT | Уникальный идентификатор | PRIMARY KEY, AUTO_INCREMENT |
| title | VARCHAR(200) | Название теста | NOT NULL |
| description | TEXT | Описание теста | |
| subject_id | BIGINT | ID предмета | FOREIGN KEY (Subjects.id) |
| time_limit | INT | Ограничение по времени (минуты) | DEFAULT NULL |
| created_by | BIGINT | ID создателя | FOREIGN KEY (Users.id) |
| is_active | BOOLEAN | Активен ли тест | DEFAULT TRUE |
| created_at | TIMESTAMP | Дата создания | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Дата обновления | DEFAULT CURRENT_TIMESTAMP |

### TestQuestions
| Поле | Тип | Описание | Ограничения |
|------|-----|----------|-------------|
| test_id | BIGINT | ID теста | FOREIGN KEY (Tests.id) |
| question_id | BIGINT | ID вопроса | FOREIGN KEY (Questions.id) |
| position | INT | Позиция вопроса в тесте | NOT NULL |
| points | INT | Количество баллов за вопрос | DEFAULT 1 |
| PRIMARY KEY | | | (test_id, question_id) |

### TestAssignments
| Поле | Тип | Описание | Ограничения |
|------|-----|----------|-------------|
| id | BIGINT | Уникальный идентификатор | PRIMARY KEY, AUTO_INCREMENT |
| test_id | BIGINT | ID теста | FOREIGN KEY (Tests.id) |
| user_id | BIGINT | ID пользователя | FOREIGN KEY (Users.id), NULL |
| group_id | BIGINT | ID группы | FOREIGN KEY (Groups.id), NULL |
| start_date | TIMESTAMP | Дата начала доступности | NOT NULL |
| end_date | TIMESTAMP | Дата окончания доступности | |
| is_mandatory | BOOLEAN | Обязательный ли тест | DEFAULT TRUE |
| created_by | BIGINT | ID создателя | FOREIGN KEY (Users.id) |
| created_at | TIMESTAMP | Дата создания | DEFAULT CURRENT_TIMESTAMP |
| CHECK | | | (user_id IS NOT NULL OR group_id IS NOT NULL) |

### UserAnswers
| Поле | Тип | Описание | Ограничения |
|------|-----|----------|-------------|
| id | BIGINT | Уникальный идентификатор | PRIMARY KEY, AUTO_INCREMENT |
| test_assignment_id | BIGINT | ID назначенного теста | FOREIGN KEY (TestAssignments.id) |
| user_id | BIGINT | ID пользователя | FOREIGN KEY (Users.id) |
| question_id | BIGINT | ID вопроса | FOREIGN KEY (Questions.id) |
| answer | TEXT | Ответ пользователя | |
| is_correct | BOOLEAN | Правильный ли ответ | |
| points_earned | INT | Полученные баллы | DEFAULT 0 |
| answered_at | TIMESTAMP | Дата ответа | DEFAULT CURRENT_TIMESTAMP |

### TestResults
| Поле | Тип | Описание | Ограничения |
|------|-----|----------|-------------|
| id | BIGINT | Уникальный идентификатор | PRIMARY KEY, AUTO_INCREMENT |
| test_assignment_id | BIGINT | ID назначенного теста | FOREIGN KEY (TestAssignments.id) |
| user_id | BIGINT | ID пользователя | FOREIGN KEY (Users.id) |
| start_time | TIMESTAMP | Время начала теста | |
| end_time | TIMESTAMP | Время окончания теста | |
| total_points | INT | Общее количество баллов | |
| earned_points | INT | Заработанные баллы | |
| percentage | DECIMAL(5,2) | Процент правильных ответов | |
| status | VARCHAR(20) | Статус (completed, in_progress, not_started) | DEFAULT 'not_started' |

### Materials
| Поле | Тип | Описание | Ограничения |
|------|-----|----------|-------------|
| id | BIGINT | Уникальный идентификатор | PRIMARY KEY, AUTO_INCREMENT |
| title | VARCHAR(200) | Название материала | NOT NULL |
| description | TEXT | Описание материала | |
| content | TEXT | Содержание материала | |
| subject_id | BIGINT | ID предмета | FOREIGN KEY (Subjects.id) |
| topic_id | BIGINT | ID темы | FOREIGN KEY (Topics.id) |
| created_by | BIGINT | ID создателя | FOREIGN KEY (Users.id) |
| created_at | TIMESTAMP | Дата создания | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Дата обновления | DEFAULT CURRENT_TIMESTAMP |

## Индексы

### Таблица Users
- Индекс по email (UNIQUE)
- Индекс по username (UNIQUE)

### Таблица Questions
- Индекс по topic_id
- Индекс по type_id
- Индекс по difficulty

### Таблица Tests
- Индекс по subject_id
- Индекс по created_by

### Таблица TestQuestions
- Индекс по test_id
- Индекс по question_id

### Таблица TestAssignments
- Индекс по test_id
- Индекс по user_id
- Индекс по group_id
- Индекс по start_date

### Таблица UserAnswers
- Индекс по test_assignment_id
- Индекс по user_id
- Индекс по question_id

### Таблица TestResults
- Индекс по test_assignment_id
- Индекс по user_id

## Связи между таблицами

1. Users -> UserRoles -> Roles (многие ко многим)
2. Users -> UserGroups -> Groups (многие ко многим)
3. Groups -> Users (многие к одному, teacher_id)
4. Topics -> Subjects (многие к одному)
5. Topics -> Topics (самосвязь, parent_topic_id)
6. Questions -> Topics (многие к одному)
7. Questions -> QuestionTypes (многие к одному)
8. Questions -> Users (многие к одному, created_by)
9. Tests -> Subjects (многие к одному)
10. Tests -> Users (многие к одному, created_by)
11. TestQuestions -> Tests (многие к одному)
12. TestQuestions -> Questions (многие к одному)
13. TestAssignments -> Tests (многие к одному)
14. TestAssignments -> Users (многие к одному, user_id)
15. TestAssignments -> Groups (многие к одному, group_id)
16. TestAssignments -> Users (многие к одному, created_by)
17. UserAnswers -> TestAssignments (многие к одному)
18. UserAnswers -> Users (многие к одному)
19. UserAnswers -> Questions (многие к одному)
20. TestResults -> TestAssignments (многие к одному)
21. TestResults -> Users (многие к одному)
22. Materials -> Subjects (многие к одному)
23. Materials -> Topics (многие к одному)
24. Materials -> Users (многие к одному, created_by)

## Требования к производительности

1. База данных должна обеспечивать быстрое извлечение вопросов по темам и типам
2. База данных должна обеспечивать быстрый доступ к результатам тестов для формирования отчетов
3. База данных должна обеспечивать эффективное хранение и извлечение учебных материалов
4. База данных должна поддерживать одновременную работу не менее 1000 пользователей

## Миграции и обновления

База данных должна поддерживать механизм миграций для безопасного обновления схемы базы данных в процессе развития системы.

## Резервное копирование и восстановление

1. Полное резервное копирование базы данных должно выполняться ежедневно
2. Инкрементальное резервное копирование должно выполняться каждый час
3. Процедуры восстановления из резервных копий должны быть протестированы и документированы

## Безопасность

1. Пароли пользователей должны храниться в виде хешей с использованием современных алгоритмов хеширования
2. Доступ к базе данных должен осуществляться только через API приложения
3. База данных должна поддерживать механизм аудита для отслеживания критических операций 