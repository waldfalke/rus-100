# Контракт схемы базы данных (Database Schema Contract)

## Метаданные
| Атрибут | Значение |
|---------|----------|
| Версия | 1.0.0 |
| Статус | Планируемый |
| Последнее обновление | 2025-04-25 |
| Последний редактор | AI |

## История изменений
| Дата | Версия | Автор | Описание изменений | PR |
|------|--------|-------|-------------------|-----|
| 2025-04-25 | 1.0.0 | AI | Начальная версия | - |

## Описание

Данный контракт описывает структуру базы данных системы CATMEPIM, предназначенной для управления информацией о товарах (книгах) для магазина "Кот Учёный". База данных является хранилищем для эталонных данных (Архетипов) и поддерживает процессы ETL, нормализации и дедупликации.

## Технологии

- СУБД: **PostgreSQL**
- Особенности: Использование типа данных **JSONB** для гибкого хранения структурированных данных

## Общая структура базы данных

### Основные группы таблиц

1. **Архетипы и товары**
   - Эталонные данные о товарах (книгах)
   - Атрибуты и характеристики товаров
   - Категоризация товаров

2. **Справочники**
   - Авторы
   - Издательства
   - Категории и жанры
   - Языки и форматы

3. **ETL и обработка данных**
   - Загруженные данные от поставщиков
   - Журналы обработки и нормализации
   - Маппинги полей и форматов

4. **Метаданные**
   - Источники данных
   - История изменений
   - Конфигурации и настройки

## Схема основных таблиц

### Архетипы и товары

#### products
| Поле | Тип | Описание |
|------|-----|----------|
| id | BIGSERIAL | Первичный ключ |
| external_id | VARCHAR(50) | Внешний идентификатор |
| title | VARCHAR(255) | Название товара |
| description | TEXT | Описание товара |
| isbn | VARCHAR(20) | ISBN книги |
| data | JSONB | Дополнительные данные в JSON-формате |
| created_at | TIMESTAMP | Дата создания |
| updated_at | TIMESTAMP | Дата обновления |
| status | VARCHAR(20) | Статус (active, draft, discontinued) |
| data_quality_score | DECIMAL(3,2) | Оценка качества данных (0.0-1.0) |

#### product_attributes
| Поле | Тип | Описание |
|------|-----|----------|
| id | BIGSERIAL | Первичный ключ |
| product_id | BIGINT | Ссылка на товар |
| attribute_name | VARCHAR(100) | Название атрибута |
| attribute_value | TEXT | Значение атрибута |
| attribute_type | VARCHAR(50) | Тип атрибута |
| language | VARCHAR(10) | Язык (для многоязычных атрибутов) |

#### product_categories
| Поле | Тип | Описание |
|------|-----|----------|
| product_id | BIGINT | Ссылка на товар |
| category_id | BIGINT | Ссылка на категорию |
| is_primary | BOOLEAN | Является ли основной категорией |

#### product_authors
| Поле | Тип | Описание |
|------|-----|----------|
| product_id | BIGINT | Ссылка на товар |
| author_id | BIGINT | Ссылка на автора |
| role | VARCHAR(50) | Роль (author, editor, translator) |
| sequence | INT | Порядковый номер |

#### product_prices
| Поле | Тип | Описание |
|------|-----|----------|
| id | BIGSERIAL | Первичный ключ |
| product_id | BIGINT | Ссылка на товар |
| price_type | VARCHAR(50) | Тип цены |
| amount | DECIMAL(10,2) | Сумма |
| currency | VARCHAR(3) | Валюта |
| valid_from | TIMESTAMP | Дата начала действия |
| valid_to | TIMESTAMP | Дата окончания действия |
| source | VARCHAR(100) | Источник информации о цене |

### Справочники

#### authors
| Поле | Тип | Описание |
|------|-----|----------|
| id | BIGSERIAL | Первичный ключ |
| name | VARCHAR(255) | Имя автора |
| original_name | VARCHAR(255) | Оригинальное написание имени |
| biography | TEXT | Биография |
| data | JSONB | Дополнительные данные |
| status | VARCHAR(20) | Статус (active, merged) |

#### author_aliases
| Поле | Тип | Описание |
|------|-----|----------|
| id | BIGSERIAL | Первичный ключ |
| author_id | BIGINT | Ссылка на автора |
| alias_name | VARCHAR(255) | Псевдоним |
| alias_type | VARCHAR(50) | Тип псевдонима |

#### publishers
| Поле | Тип | Описание |
|------|-----|----------|
| id | BIGSERIAL | Первичный ключ |
| name | VARCHAR(255) | Название издательства |
| description | TEXT | Описание |
| parent_id | BIGINT | ID родительского издательства |
| data | JSONB | Дополнительные данные |
| status | VARCHAR(20) | Статус (active, inactive) |

#### categories
| Поле | Тип | Описание |
|------|-----|----------|
| id | BIGSERIAL | Первичный ключ |
| parent_id | BIGINT | ID родительской категории |
| name | VARCHAR(255) | Название категории |
| path | VARCHAR(500) | Путь в иерархии |
| level | INT | Уровень в иерархии |
| description | TEXT | Описание |
| status | VARCHAR(20) | Статус |

#### binding_types
| Поле | Тип | Описание |
|------|-----|----------|
| id | SERIAL | Первичный ключ |
| code | VARCHAR(30) | Стандартный код типа переплета (HC, PB, IB) |
| name | VARCHAR(100) | Стандартное название типа переплета |
| description | TEXT | Описание типа переплета |
| data | JSONB | Дополнительные данные в JSON-формате |
| created_at | TIMESTAMP | Дата создания |
| updated_at | TIMESTAMP | Дата обновления |

### ETL и обработка данных

#### data_imports
| Поле | Тип | Описание |
|------|-----|----------|
| id | BIGSERIAL | Первичный ключ |
| vendor_id | BIGINT | ID поставщика |
| filename | VARCHAR(255) | Имя файла |
| file_size | BIGINT | Размер файла |
| status | VARCHAR(20) | Статус импорта |
| error_message | TEXT | Сообщение об ошибке |
| created_at | TIMESTAMP | Дата создания |
| completed_at | TIMESTAMP | Дата завершения |

#### import_records
| Поле | Тип | Описание |
|------|-----|----------|
| id | BIGSERIAL | Первичный ключ |
| import_id | BIGINT | Ссылка на импорт |
| external_id | VARCHAR(100) | Внешний идентификатор |
| raw_data | JSONB | Исходные данные |
| normalized_data | JSONB | Нормализованные данные |
| validation_errors | JSONB | Ошибки валидации |
| product_id | BIGINT | Ссылка на созданный/обновленный товар |
| status | VARCHAR(20) | Статус обработки |

#### field_mappings
| Поле | Тип | Описание |
|------|-----|----------|
| id | BIGSERIAL | Первичный ключ |
| vendor_id | BIGINT | ID поставщика |
| source_field | VARCHAR(100) | Поле источника |
| target_field | VARCHAR(100) | Целевое поле |
| transformation | VARCHAR(500) | Правило трансформации |
| is_required | BOOLEAN | Обязательное поле |

#### vendors
| Поле | Тип | Описание |
|------|-----|----------|
| id | BIGSERIAL | Первичный ключ |
| name | VARCHAR(255) | Название поставщика |
| code | VARCHAR(50) | Код поставщика |
| file_format | VARCHAR(50) | Формат файлов |
| config | JSONB | Конфигурация |
| status | VARCHAR(20) | Статус |

### Метаданные

#### data_lineage
| Поле | Тип | Описание |
|------|-----|----------|
| id | BIGSERIAL | Первичный ключ |
| entity_type | VARCHAR(50) | Тип сущности |
| entity_id | BIGINT | ID сущности |
| source_type | VARCHAR(50) | Тип источника |
| source_id | VARCHAR(100) | ID источника |
| operation | VARCHAR(50) | Операция |
| created_at | TIMESTAMP | Дата создания |
| data | JSONB | Дополнительные данные |

#### synonyms
| Поле | Тип | Описание |
|------|-----|----------|
| id | BIGSERIAL | Первичный ключ |
| term | VARCHAR(255) | Термин |
| normalized_term | VARCHAR(255) | Нормализованный термин |
| context | VARCHAR(50) | Контекст |
| confidence | DECIMAL(3,2) | Уровень уверенности |

## Индексы

Основные индексы для обеспечения производительности:

```sql
-- Индексы для таблицы products
CREATE INDEX idx_products_external_id ON products(external_id);
CREATE INDEX idx_products_isbn ON products(isbn);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_data_gin ON products USING gin (data jsonb_path_ops);

-- Индексы для таблицы authors
CREATE INDEX idx_authors_name ON authors(name);
CREATE INDEX idx_authors_status ON authors(status);

-- Индексы для таблицы publishers
CREATE INDEX idx_publishers_name ON publishers(name);
CREATE INDEX idx_publishers_parent_id ON publishers(parent_id);

-- Индексы для таблицы categories
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_path ON categories(path);

-- Индексы для ETL-таблиц
CREATE INDEX idx_data_imports_vendor_id ON data_imports(vendor_id);
CREATE INDEX idx_data_imports_status ON data_imports(status);
CREATE INDEX idx_import_records_import_id ON import_records(import_id);
CREATE INDEX idx_import_records_product_id ON import_records(product_id);
CREATE INDEX idx_import_records_external_id ON import_records(external_id);
```

## Связи между таблицами

Основные связи между таблицами:

```
products
  ├── product_attributes (1:N)
  ├── product_categories (N:M с categories)
  ├── product_authors (N:M с authors)
  └── product_prices (1:N)

authors
  └── author_aliases (1:N)

publishers
  └── publishers (self-reference для parent_id, 1:N)

categories
  └── categories (self-reference для parent_id, 1:N)

data_imports
  └── import_records (1:N)

vendors
  └── field_mappings (1:N)
```

## ETL процессы

База данных поддерживает следующие ETL-процессы:

1. **Загрузка данных**
   - Запись метаданных файла в `data_imports`
   - Преобразование и запись строк в `import_records`

2. **Нормализация и очистка**
   - Обновление `normalized_data` в `import_records`
   - Применение правил из `field_mappings`

3. **Создание/обновление Архетипов**
   - Создание/обновление записей в `products` и связанных таблицах
   - Запись информации о происхождении данных в `data_lineage`

## Безопасность

- Разделение прав доступа на чтение/запись для различных групп пользователей
- Ведение логов изменений для критически важных таблиц
- Резервное копирование данных с настраиваемой периодичностью

## Миграции и версионирование

- Использование системы миграций базы данных для отслеживания изменений схемы
- Документирование изменений в истории версий
- Поддержка обратной совместимости при изменении схемы

## Расширения PostgreSQL

Необходимые расширения PostgreSQL:

```sql
-- Полнотекстовый поиск
CREATE EXTENSION pg_trgm;

-- Работа с JSON
CREATE EXTENSION jsonb_path_ops;

-- Генерация UUID
CREATE EXTENSION pgcrypto;
```

## API и интерфейсы доступа к данным

Система CATMEPIM предоставляет следующие способы работы с базой данных:

### 1. Прямой SQL-доступ (технический уровень)

Предназначен для разработчиков и администраторов системы:
- **Подключение**: JDBC/psycopg2/другие драйверы PostgreSQL
- **Ограничения**: Ограниченный набор пользователей с прямым доступом

### 2. Data Access Layer (DAL) (прикладной уровень)

Основной слой доступа к данным для приложений:

#### 2.1. Сервисы данных

```java
// Интерфейс сервиса товаров
public interface ProductService {
    // Базовые операции CRUD
    Product getProductById(Long id);
    List<Product> getProductsByIds(List<Long> ids);
    List<Product> searchProducts(ProductSearchCriteria criteria);
    Product createProduct(Product product);
    Product updateProduct(Product product);
    void deleteProduct(Long id);
    
    // Специализированные операции
    List<Product> getProductsByCategory(Long categoryId, boolean includeSubcategories);
    Product getProductByISBN(String isbn);
    List<Product> getProductsByAuthor(Long authorId);
    List<ProductAttribute> getProductAttributes(Long productId);
}

// Аналогичные интерфейсы для других сущностей:
// AuthorService, PublisherService, CategoryService, PriceService...
```

#### 2.2. Репозитории (низкоуровневый доступ)

```java
// Интерфейс репозитория товаров
public interface ProductRepository {
    // Базовые операции
    Optional<Product> findById(Long id);
    List<Product> findByIds(List<Long> ids);
    List<Product> findByCriteria(ProductSearchCriteria criteria);
    Product save(Product product);
    void delete(Long id);
    
    // Специализированные запросы
    Optional<Product> findByISBN(String isbn);
    List<Product> findByCategory(Long categoryId);
    List<Product> findByAuthor(Long authorId);
    List<Product> findPotentialDuplicates(Product product);
    
    // Пакетные операции
    void batchInsert(List<Product> products);
    void batchUpdate(List<Product> products);
}
```

### 3. ETL API (интеграционный уровень)

Специализированный API для процессов извлечения, преобразования и загрузки данных:

```java
// Интерфейс для ETL-операций
public interface DataImportService {
    // Операции импорта
    ImportJob startImport(ImportRequest request);
    ImportStatus getImportStatus(Long importId);
    ImportResult getImportResult(Long importId);
    void cancelImport(Long importId);
    
    // Валидация и подготовка данных
    ValidationResult validateImportData(ImportRequest request);
    List<FieldMapping> suggestFieldMappings(ImportRequest request);
    
    // Работа с записями
    void applyRecordTransformations(List<ImportRecord> records, List<Transformation> transformations);
    List<ArchetypeMatch> findArchetypeMatches(List<ImportRecord> records);
}
```

### 4. REST API (внешний уровень)

JSON-API для внешних систем и веб-интерфейса:

```
GET /api/products/{id}
GET /api/products?isbn={isbn}
GET /api/products?category={categoryId}&includeSubcategories={true|false}
POST /api/products
PUT /api/products/{id}
DELETE /api/products/{id}

// Аналогичные эндпоинты для других сущностей
```

### 5. Транзакционное поведение

- **Уровень изоляции**: По умолчанию READ COMMITTED
- **Управление транзакциями**: Декларативное управление через аннотации (@Transactional) или программное управление
- **Стратегия блокировок**: Оптимистические блокировки для объектов с высокой конкуренцией

## Жизненный цикл данных

### 1. Жизненный цикл товаров (продуктов)

#### 1.1. Состояния товара
- **Draft** (Черновик): Начальное состояние при создании товара
- **Active** (Активный): Товар прошел валидацию и доступен в каталоге
- **Discontinued** (Снят с производства): Товар больше не выпускается, но информация сохраняется
- **Deleted** (Удален): Логически удаленный товар (не удаляется физически из БД)

#### 1.2. Переходы состояний
```
Draft -> Active: После валидации и одобрения
Active -> Discontinued: При прекращении выпуска
Active/Discontinued -> Deleted: При логическом удалении
Deleted -> Active: Возможно восстановление (предусмотрена процедура)
```

#### 1.3. Версионирование и история
- Каждое значимое изменение товара регистрируется в таблице `data_lineage`
- Поддерживается информация о том, когда и откуда получены атрибуты

### 2. Жизненный цикл справочных данных

#### 2.1. Авторы и издательства
- **Создание**: Через ETL-процесс или административный интерфейс
- **Нормализация**: Автоматический процесс нормализации имен и данных
- **Дедупликация**: Объединение дубликатов с сохранением истории
- **Обогащение**: Добавление дополнительной информации из внешних источников

#### 2.2. Категории
- **Создание**: Преимущественно через административный интерфейс
- **Реорганизация**: Возможность изменения иерархии с автоматическим обновлением товаров

### 3. Жизненный цикл ETL-данных

#### 3.1. Стадии обработки импортированных данных
```
Загрузка -> Валидация -> Нормализация -> Дедупликация -> Обогащение -> Интеграция
```

#### 3.2. Хранение исходных данных
- Исходные данные сохраняются в `raw_data` для аудита и диагностики
- Настраиваемая политика хранения (по умолчанию 90 дней)

#### 3.3. Механизм отката
- Поддержка отката импорта при обнаружении проблем
- Возможность выборочного отката отдельных записей

### 4. Архивация и удаление

#### 4.1. Политика архивации
- Неактивные данные архивируются после настраиваемого периода (по умолчанию 1 год)
- Архивные таблицы имеют ту же структуру, но оптимизированы для хранения

#### 4.2. Удаление и очистка
- Физическое удаление только для временных и ошибочных данных
- Автоматическая очистка журналов импорта по расписанию

## Стратегии масштабирования

Система спроектирована с учетом потенциального роста объема данных и нагрузки.

### 1. Вертикальное масштабирование

#### 1.1. Ресурсные требования
- **Начальная конфигурация**: 4 CPU, 8GB RAM, 100GB SSD
- **Рекомендуемая для 500K товаров**: 8 CPU, 16GB RAM, 500GB SSD
- **Рекомендуемая для 1M+ товаров**: 16 CPU, 32GB RAM, 1TB SSD

#### 1.2. Оптимизация PostgreSQL
```
shared_buffers = 4GB        # 25% RAM до 8GB, затем 15-20%
effective_cache_size = 12GB  # 75% RAM
maintenance_work_mem = 1GB   # Для операций обслуживания
work_mem = 50MB             # Для сложных запросов
max_connections = 100       # Настраивается в зависимости от нагрузки
```

### 2. Горизонтальное масштабирование

#### 2.1. Возможность шардирования
При превышении 1 миллиона товаров или высокой нагрузке:

- **Вариант шардирования**: По первичному ключу товаров (id % NUM_SHARDS)
- **Таблицы для шардирования**: products, product_attributes, product_prices
- **Неразделяемые таблицы**: справочники (authors, publishers, categories)

#### 2.2. Репликация
- **Primary-Replica** архитектура для распределения нагрузки чтения
- Режим работы реплик: только чтение, асинхронная репликация

```
┌────────────┐        ┌────────────┐
│  Primary   │━━━━━━━▶│  Replica 1 │
│  Database  │        │ (Read-only)│
└────────────┘        └────────────┘
      ▲                     ^
      │                     │
      │                     │
      ▼                     │
┌────────────┐        ┌────────────┐
│   Write    │        │    Read    │
│   Traffic  │        │   Traffic  │
└────────────┘        └────────────┘
```

#### 2.3. Многоуровневое хранение
- **Горячие данные**: SSD-хранилище для активных товаров
- **Холодные данные**: HDD-хранилище для архивных/неактивных товаров
- **Автоматическая миграция** данных между уровнями на основе возраста и активности

### 3. Партиционирование таблиц

#### 3.1. Таблицы с партиционированием
- **import_records**: партиционирование по `import_id`
- **data_lineage**: партиционирование по времени (по месяцам)

```sql
-- Пример партиционирования таблицы import_records
CREATE TABLE import_records (
    id BIGSERIAL,
    import_id BIGINT NOT NULL,
    -- другие поля
) PARTITION BY RANGE (import_id);

-- Создание партиции для конкретного диапазона import_id
CREATE TABLE import_records_p1 PARTITION OF import_records
    FOR VALUES FROM (1) TO (1000);
```

## Кеширование и оптимизация производительности

### 1. Стратегии кеширования

#### 1.1. Многоуровневое кеширование
- **L1**: Кэш приложения (in-memory, короткоживущие объекты)
- **L2**: Распределенный кэш (Redis/Memcached, для разделяемых объектов)
- **L3**: Кэш запросов базы данных (встроенный в PostgreSQL)

#### 1.2. Политики кеширования
- **Время жизни (TTL)**:
  - Справочники (авторы, издательства): 1 час
  - Категории: 30 минут
  - Товары: 15 минут
  - Цены: 5 минут

- **Инвалидация кэша**:
  - По событиям (обновление данных)
  - По расписанию (плановая очистка)

#### 1.3. Избирательное кеширование
- Кеширование только наиболее часто запрашиваемых данных
- Мониторинг попаданий в кэш для динамической корректировки стратегии

### 2. Оптимизация запросов

#### 2.1. Материализованные представления
```sql
-- Материализованное представление для популярных категорий с количеством товаров
CREATE MATERIALIZED VIEW popular_categories AS
SELECT c.id, c.name, c.path, COUNT(pc.product_id) as product_count
FROM categories c
JOIN product_categories pc ON c.id = pc.category_id
JOIN products p ON pc.product_id = p.id
WHERE p.status = 'active'
GROUP BY c.id, c.name, c.path
ORDER BY product_count DESC;

-- Обновление представления по расписанию
REFRESH MATERIALIZED VIEW popular_categories;
```

#### 2.2. Планировщик запросов
- Настройка статистики для планировщика PostgreSQL:
```sql
ALTER TABLE products SET (autovacuum_analyze_threshold = 100);
ALTER TABLE import_records SET (autovacuum_analyze_threshold = 1000);
```

- Принудительный сбор статистики после массовых операций:
```sql
ANALYZE products;
ANALYZE import_records;
```

#### 2.3. Параллельные запросы
- Включение параллельных запросов для операций с большими наборами данных:
```
max_parallel_workers_per_gather = 4
max_parallel_workers = 8
```

### 3. Оптимизация ETL-процессов

#### 3.1. Пакетная обработка
- Обработка данных пакетами по 1000-5000 записей
- Использование COPY для массовой загрузки вместо INSERT

#### 3.2. Асинхронная обработка
- Разделение ETL на независимые потоки для параллельной обработки
- Очереди задач для распределения нагрузки

#### 3.3. Предварительный расчет и агрегация
- Расчет и хранение агрегированных значений для аналитики
- Инкрементальное обновление агрегатов при изменении данных

### 4. Мониторинг производительности

#### 4.1. Ключевые метрики
- Среднее время выполнения запросов
- Количество запросов в секунду
- Утилизация ресурсов (CPU, RAM, I/O)
- Размер базы данных и темпы роста

#### 4.2. Логирование медленных запросов
```
log_min_duration_statement = 1000  # логировать запросы дольше 1 секунды
```

#### 4.3. Инструменты мониторинга
- Системный мониторинг: Prometheus + Grafana
- Мониторинг PostgreSQL: pg_stat_statements, pgBadger
- Алерты при превышении пороговых значений

## Memory Bank

Специализированная подсистема для эффективного управления памятью при обработке больших объемов данных.

### 1. Архитектура Memory Bank

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│  Off-Heap Cache │◄────►│  Active Memory  │◄────►│ Database Buffer │
│                 │      │     Region      │      │     Cache       │
└─────────────────┘      └─────────────────┘      └─────────────────┘
        ▲                        ▲                        ▲
        │                        │                        │
        ▼                        ▼                        ▼
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│  Archived Data  │      │  ETL Processing │      │   Query Engine  │
│    Storage      │      │     Pipeline    │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

### 2. Компоненты Memory Bank

#### 2.1. Active Memory Region
- **Назначение**: Оперативная обработка текущих ETL-операций
- **Характеристики**:
  - Динамическое распределение памяти (до 70% доступной RAM)
  - Автоматическое выделение регионов для параллельных операций
  - Приоритезация критических потоков данных
- **Политика вытеснения**: LRU (Least Recently Used) с защитой критических данных

#### 2.2. Off-Heap Cache
- **Назначение**: Хранение обработанных промежуточных результатов
- **Характеристики**:
  - Доступ на основе ключей (подобно распределенному кэшу)
  - Сериализованное хранение за пределами кучи Java
  - Компрессия данных для оптимизации использования памяти
- **Настройки**:
  - Максимальный размер: 20% от доступной RAM
  - Время хранения: от 10 минут до 24 часов (настраивается)

#### 2.3. Database Buffer Cache
- **Назначение**: Координация с буфером PostgreSQL
- **Характеристики**:
  - Интеллектуальная предвыборка данных
  - Предотвращение дублирования кэшированных данных
  - Оптимизация VACUUM и ANALYZE операций

### 3. Стратегии управления памятью

#### 3.1. Адаптивное выделение памяти
- Мониторинг использования памяти в реальном времени
- Расширение и сокращение регионов памяти в зависимости от нагрузки
- Выделение дополнительной памяти для пиковых операций

#### 3.2. Интеллектуальная сегментация данных
- Разделение больших наборов данных на управляемые сегменты
- Параллельная обработка сегментов с оптимальным использованием памяти
- Поддержка операций MapReduce для распределенной обработки

#### 3.3. Управление давлением памяти
- Система раннего обнаружения нехватки памяти
- Стратегия сброса наименее важных данных на диск
- Предотвращение OutOfMemory ошибок через контролируемое освобождение

### 4. Интеграция с ETL-процессами

#### 4.1. Фазы-специфическое управление памятью
- **Extraction**: Буферизованное чтение с контролируемым потреблением памяти
- **Transformation**: Оптимизированная обработка в Active Memory Region
- **Loading**: Транзакционная запись с контролем целостности данных

#### 4.2. Настройки по типам операций
```java
// Конфигурация памяти для разных типов ETL-процессов
public class MemoryBankConfig {
    // Импорт крупных прайс-листов
    public static final MemorySettings PRICE_LIST_IMPORT = MemorySettings.builder()
        .activeRegionSize("40%")  // 40% Active Memory Region
        .offHeapCacheSize("15%")  // 15% Off-Heap Cache
        .batchSize(2000)          // Размер пакета обработки
        .segmentSize("10MB")      // Размер сегмента данных
        .build();
        
    // Обогащение продуктовых данных
    public static final MemorySettings PRODUCT_ENRICHMENT = MemorySettings.builder()
        .activeRegionSize("50%")  // 50% Active Memory Region
        .offHeapCacheSize("25%")  // 25% Off-Heap Cache
        .batchSize(500)           // Размер пакета обработки
        .segmentSize("5MB")       // Размер сегмента данных
        .build();
        
    // Дедупликация и объединение записей
    public static final MemorySettings DEDUPLICATION = MemorySettings.builder()
        .activeRegionSize("60%")  // 60% Active Memory Region
        .offHeapCacheSize("30%")  // 30% Off-Heap Cache
        .batchSize(1000)          // Размер пакета обработки
        .segmentSize("8MB")       // Размер сегмента данных
        .build();
}
```

### 5. Мониторинг и управление

#### 5.1. Ключевые метрики
- Использование памяти по регионам
- Частота обращений к Off-Heap Cache
- Соотношение попаданий/промахов в кэше
- Частота сброса данных на диск

#### 5.2. Административный интерфейс
- Визуализация использования памяти в реальном времени
- Ручное управление размерами регионов памяти
- Запуск принудительной сборки мусора для выбранных регионов

#### 5.3. Алерты и уведомления
- Предупреждения о приближении к порогам использования памяти
- Автоматические корректирующие действия
- Логирование событий управления памятью

## Связь с другими контрактами

- [Product Contract](./product_contract.md) - Детализирует работу с товарами
- [Authors Contract](./authors_contract.md) - Детализирует работу с авторами
- [Publishers Contract](./publishers_contract.md) - Детализирует работу с издательствами
- [Categories Contract](./categories_contract.md) - Детализирует работу с категориями
- [Data Lineage Contract](../data/data_lineage_contract.md) - Детализирует отслеживание происхождения данных
- [ETL Process Contract](../ETL-Process-Contract.md) - Описывает процессы ETL
- [Shop Price List Contract](../price-management/shop_price_list_contract.md) - Детализирует обработку прайс-листа магазина "Кот Учёный"

## Инварианты

1. Все внешние ключи должны указывать на существующие записи или быть NULL
2. У каждого товара должны быть заполнены обязательные атрибуты (title, isbn)
3. История изменений должна сохраняться для всех критически важных операций
4. Категории должны образовывать ациклический граф
5. Данные в JSONB-полях должны соответствовать определенным схемам
6. Поле path в таблице categories должно соответствовать иерархии parent_id

## Примеры запросов

### Получение товара с атрибутами и категориями

```sql
SELECT 
  p.*,
  jsonb_agg(DISTINCT pa.*) AS attributes,
  jsonb_agg(DISTINCT c.*) AS categories,
  jsonb_agg(DISTINCT a.*) AS authors
FROM products p
LEFT JOIN product_attributes pa ON p.id = pa.product_id
LEFT JOIN product_categories pc ON p.id = pc.product_id
LEFT JOIN categories c ON pc.category_id = c.id
LEFT JOIN product_authors pa2 ON p.id = pa2.product_id
LEFT JOIN authors a ON pa2.author_id = a.id
WHERE p.id = 1
GROUP BY p.id;
```

### Получение товаров по категории (включая подкатегории)

```sql
WITH RECURSIVE category_tree AS (
  SELECT id, name, path FROM categories WHERE id = 5
  UNION ALL
  SELECT c.id, c.name, c.path 
  FROM categories c
  JOIN category_tree ct ON c.path LIKE ct.path || '/%'
)
SELECT p.*
FROM products p
JOIN product_categories pc ON p.id = pc.product_id
JOIN category_tree ct ON pc.category_id = ct.id
WHERE p.status = 'active';
```

### Определение дубликатов по ISBN

```sql
SELECT isbn, COUNT(*) as count, array_agg(id) as product_ids
FROM products
WHERE isbn IS NOT NULL
GROUP BY isbn
HAVING COUNT(*) > 1;
```

## Допущения и ограничения

1. Система рассчитана на работу с каталогом до 1 миллиона товаров
2. Поддерживается хранение данных на нескольких языках
3. Формат ISBN поддерживает как ISBN-10, так и ISBN-13
4. JSONB-данные используются для хранения атрибутов, которые могут отличаться для разных типов товаров
5. Система не включает функциональность управления запасами и транзакциями

## Эволюция схемы

Предусмотренные направления развития схемы:

1. **Расширение типов данных** - Добавление поддержки для мультимедийных файлов, отзывов и рейтингов
2. **Улучшение поиска** - Интеграция с полнотекстовыми поисковыми движками
3. **Улучшение аналитики** - Добавление таблиц для хранения агрегированных данных и метрик
4. **Интернационализация** - Расширение поддержки многоязычности и локализации 