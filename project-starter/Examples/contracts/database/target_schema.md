# Контракт схемы базы данных (Database Schema Contract)

## Метаданные
- **Версия**: 1.0.0
- **Статус**: Планируемый
- **Последнее обновление**: 2025-04-20
- **Последний редактор**: AI
- **Ветка разработки**: main

## История изменений
| Дата | Версия | Автор | Описание изменений | PR |
|------|--------|-------|-------------------|-----|
| 2025-04-20 | 1.0.0 | AI | Начальная версия | - |

## Описание
Данный контракт определяет схему базы данных для системы CATMEPIM. Схема включает структуру таблиц, связи между ними, ограничения и индексы.

## Общая структура

База данных системы CATMEPIM основана на PostgreSQL и состоит из следующих основных блоков:

1. **Каталог продуктов** - таблицы для хранения информации о товарах, авторах, издательствах и т.д.
2. **Прайс-листы** - таблицы для хранения и обработки прайс-листов поставщиков
3. **Поставщики** - информация о поставщиках и их настройках
4. **Статистика и логи** - таблицы для хранения информации о работе системы
5. **Пользователи и права** - таблицы для хранения информации о пользователях и их правах

## Схема данных

### Каталог продуктов

#### Таблица `products`
Основная таблица для хранения информации о товарах.

```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    original_title VARCHAR(255),
    isbn VARCHAR(20),
    ean VARCHAR(20),
    publisher_id INTEGER REFERENCES publishers(id),
    publication_year INTEGER,
    language_code VARCHAR(10),
    page_count INTEGER,
    binding_type VARCHAR(50),
    weight DECIMAL(10, 2),
    height DECIMAL(10, 2),
    width DECIMAL(10, 2),
    thickness DECIMAL(10, 2),
    description TEXT,
    cover_url VARCHAR(500),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_isbn CHECK (isbn IS NULL OR (isbn ~ '^[0-9-]{10,17}$')),
    CONSTRAINT unique_ean CHECK (ean IS NULL OR (ean ~ '^[0-9]{13}$'))
);

CREATE INDEX idx_products_isbn ON products(isbn) WHERE isbn IS NOT NULL;
CREATE INDEX idx_products_ean ON products(ean) WHERE ean IS NOT NULL;
CREATE INDEX idx_products_title ON products USING gin(to_tsvector('russian', title));
CREATE INDEX idx_products_status ON products(status);
```

#### Таблица `authors`
Хранит информацию об авторах.

```sql
CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255),
    biography TEXT,
    photo_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_authors_name ON authors USING gin(to_tsvector('russian', name));
```

#### Таблица `product_authors`
Связывает товары с авторами (многие ко многим).

```sql
CREATE TABLE product_authors (
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    author_id INTEGER REFERENCES authors(id) ON DELETE CASCADE,
    author_role VARCHAR(50) DEFAULT 'author',
    sorting_order INTEGER DEFAULT 0,
    PRIMARY KEY (product_id, author_id)
);

CREATE INDEX idx_product_authors_product ON product_authors(product_id);
CREATE INDEX idx_product_authors_author ON product_authors(author_id);
```

#### Таблица `publishers`
Информация об издательствах.

```sql
CREATE TABLE publishers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    logo_url VARCHAR(500),
    website VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_publishers_name ON publishers USING gin(to_tsvector('russian', name));
```

#### Таблица `categories`
Категории товаров.

```sql
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    parent_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    level INTEGER NOT NULL DEFAULT 1,
    path VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_path ON categories(path);
```

#### Таблица `product_categories`
Связывает товары с категориями (многие ко многим).

```sql
CREATE TABLE product_categories (
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (product_id, category_id)
);

CREATE INDEX idx_product_categories_product ON product_categories(product_id);
CREATE INDEX idx_product_categories_category ON product_categories(category_id);
CREATE INDEX idx_product_categories_primary ON product_categories(product_id, is_primary) WHERE is_primary = TRUE;
```

### Прайс-листы

#### Таблица `suppliers`
Информация о поставщиках.

```sql
CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_suppliers_code ON suppliers(code);
CREATE INDEX idx_suppliers_status ON suppliers(status);
```

#### Таблица `supplier_settings`
Настройки для импорта прайс-листов поставщика.

```sql
CREATE TABLE supplier_settings (
    supplier_id INTEGER PRIMARY KEY REFERENCES suppliers(id) ON DELETE CASCADE,
    file_format VARCHAR(20) NOT NULL DEFAULT 'auto', -- auto, csv, excel, xml, json
    has_header BOOLEAN DEFAULT TRUE,
    delimiter CHAR(1) DEFAULT ';',
    encoding VARCHAR(20) DEFAULT 'UTF-8',
    column_mapping JSONB,
    default_currency VARCHAR(3) DEFAULT 'RUB',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Таблица `price_lists`
Хранит информацию об импортированных прайс-листах.

```sql
CREATE TABLE price_lists (
    id SERIAL PRIMARY KEY,
    supplier_id INTEGER NOT NULL REFERENCES suppliers(id),
    name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500),
    file_hash VARCHAR(64),
    file_size BIGINT,
    status VARCHAR(20) NOT NULL DEFAULT 'imported', -- imported, processed, archived, failed
    total_items INTEGER DEFAULT 0,
    processed_items INTEGER DEFAULT 0,
    matched_items INTEGER DEFAULT 0,
    import_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    process_date TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_by INTEGER, -- References users(id)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_price_lists_supplier ON price_lists(supplier_id);
CREATE INDEX idx_price_lists_status ON price_lists(status);
CREATE INDEX idx_price_lists_import_date ON price_lists(import_date);
CREATE UNIQUE INDEX idx_price_lists_file_hash ON price_lists(file_hash) WHERE file_hash IS NOT NULL;
```

#### Таблица `price_items`
Хранит отдельные позиции из прайс-листов.

```sql
CREATE TABLE price_items (
    id SERIAL PRIMARY KEY,
    price_list_id INTEGER NOT NULL REFERENCES price_lists(id) ON DELETE CASCADE,
    external_id VARCHAR(100),
    isbn VARCHAR(20),
    ean VARCHAR(20),
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    publisher VARCHAR(255),
    price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'RUB',
    recommended_price DECIMAL(10, 2),
    stock INTEGER,
    status VARCHAR(20) NOT NULL DEFAULT 'new', -- new, matched, matching_failed, ignored
    product_id INTEGER REFERENCES products(id),
    match_confidence DECIMAL(5, 2),
    match_method VARCHAR(50),
    raw_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_price_items_price_list ON price_items(price_list_id);
CREATE INDEX idx_price_items_isbn ON price_items(isbn) WHERE isbn IS NOT NULL;
CREATE INDEX idx_price_items_ean ON price_items(ean) WHERE ean IS NOT NULL;
CREATE INDEX idx_price_items_status ON price_items(status);
CREATE INDEX idx_price_items_product ON price_items(product_id) WHERE product_id IS NOT NULL;
CREATE INDEX idx_price_items_title ON price_items USING gin(to_tsvector('russian', title));
```

#### Таблица `product_prices`
Хранит актуальные цены продуктов.

```sql
CREATE TABLE product_prices (
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    supplier_id INTEGER NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'RUB',
    recommended_price DECIMAL(10, 2),
    stock INTEGER,
    price_list_id INTEGER REFERENCES price_lists(id),
    price_item_id INTEGER REFERENCES price_items(id),
    last_update TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (product_id, supplier_id)
);

CREATE INDEX idx_product_prices_product ON product_prices(product_id);
CREATE INDEX idx_product_prices_supplier ON product_prices(supplier_id);
CREATE INDEX idx_product_prices_currency ON product_prices(currency);
CREATE INDEX idx_product_prices_last_update ON product_prices(last_update);
```

### Логи и аудит

#### Таблица `import_logs`
Хранит детальные логи процесса импорта.

```sql
CREATE TABLE import_logs (
    id SERIAL PRIMARY KEY,
    price_list_id INTEGER NOT NULL REFERENCES price_lists(id) ON DELETE CASCADE,
    level VARCHAR(10) NOT NULL, -- info, warning, error
    message TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_import_logs_price_list ON import_logs(price_list_id);
CREATE INDEX idx_import_logs_level ON import_logs(level);
CREATE INDEX idx_import_logs_created_at ON import_logs(created_at);
```

#### Таблица `price_history`
Хранит историю изменений цен.

```sql
CREATE TABLE price_history (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    supplier_id INTEGER NOT NULL REFERENCES suppliers(id),
    old_price DECIMAL(10, 2),
    new_price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'RUB',
    price_list_id INTEGER REFERENCES price_lists(id),
    price_item_id INTEGER REFERENCES price_items(id),
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_price_history_product ON price_history(product_id);
CREATE INDEX idx_price_history_supplier ON price_history(supplier_id);
CREATE INDEX idx_price_history_changed_at ON price_history(changed_at);
```

#### Таблица `matching_decisions`
Хранит решения по сопоставлению товаров.

```sql
CREATE TABLE matching_decisions (
    id SERIAL PRIMARY KEY,
    price_item_id INTEGER NOT NULL REFERENCES price_items(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    decision VARCHAR(20) NOT NULL, -- auto_matched, manual_matched, ignored, create_new
    confidence DECIMAL(5, 2),
    algorithm VARCHAR(50),
    decided_by INTEGER, -- References users(id)
    decided_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_matching_decisions_price_item ON matching_decisions(price_item_id);
CREATE INDEX idx_matching_decisions_product ON matching_decisions(product_id) WHERE product_id IS NOT NULL;
CREATE INDEX idx_matching_decisions_decision ON matching_decisions(decision);
CREATE INDEX idx_matching_decisions_decided_at ON matching_decisions(decided_at);
```

### Пользователи и права

#### Таблица `users`
Хранит информацию о пользователях системы.

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255),
    role VARCHAR(50) NOT NULL DEFAULT 'user', -- admin, manager, operator, user
    status VARCHAR(20) NOT NULL DEFAULT 'active', -- active, inactive, blocked
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
```

#### Таблица `user_permissions`
Хранит индивидуальные разрешения пользователей.

```sql
CREATE TABLE user_permissions (
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    permission VARCHAR(100) NOT NULL,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    granted_by INTEGER REFERENCES users(id),
    PRIMARY KEY (user_id, permission)
);

CREATE INDEX idx_user_permissions_user ON user_permissions(user_id);
```

## Инварианты и ограничения

1. **Уникальность ISBN/EAN**: ISBN и EAN должны быть уникальными для товаров, если они указаны.
2. **Формат ISBN/EAN**: ISBN должен соответствовать формату ISBN-10 или ISBN-13, EAN должен быть 13-значным числом.
3. **Обязательные поля**: title является обязательным полем для товаров.
4. **Связи между таблицами**: Все внешние ключи должны ссылаться на существующие записи.
5. **Валюты**: Все валюты должны соответствовать стандарту ISO 4217 (трехбуквенные коды).
6. **Статусы**: Все статусы должны иметь допустимые значения из предопределенного списка.
7. **Цены**: Цены должны быть положительными числами.
8. **Уникальность файлов прайс-листов**: Не должно быть дублирующихся файлов прайс-листов (проверка по хешу).
9. **Архивация старых данных**: Устаревшие прайс-листы должны переходить в статус 'archived'.
10. **Изменение цен**: Любое изменение цены должно сохраняться в истории изменений.

## Миграции и развитие схемы

1. **Версионирование схемы**: Каждое изменение схемы должно сопровождаться созданием миграции с номером версии.
2. **Обратная совместимость**: Предпочтение отдается изменениям, сохраняющим обратную совместимость.
3. **Документирование изменений**: Все изменения схемы должны быть задокументированы.
4. **Тестирование миграций**: Все миграции должны быть протестированы на тестовых данных.

## Производительность

1. **Индексы**: Критичные для производительности поля должны быть проиндексированы.
2. **Партиционирование**: Таблицы, которые могут стать очень большими (price_items, price_history), должны быть подготовлены к партиционированию.
3. **Ограничение выборок**: Запросы должны использовать ограничения (LIMIT) для предотвращения возврата слишком большого количества данных.
4. **Оптимизация запросов**: Запросы, используемые в приложении, должны быть оптимизированы и протестированы с большим объемом данных.

## Безопасность

1. **Хеширование паролей**: Пароли должны храниться только в виде хешей (bcrypt, argon2).
2. **Аудит изменений**: Все важные изменения (цены, сопоставления) должны фиксироваться с указанием пользователя и времени.
3. **Ограничение доступа**: Доступ к таблицам должен осуществляться через представления (views) и хранимые процедуры с соответствующими правами доступа.
4. **Защита от SQL-инъекций**: Все запросы должны использовать параметризованные выражения.

## Связанные контракты

- [Product Matching Contract](../price-management/product_matching_contract.md) - Контракт сопоставления товаров
- [Price List Import Contract](../price-management/price_list_import_contract.md) - Контракт импорта прайс-листов
- [API Contract](../api/api_contract.md) - Контракт API системы 