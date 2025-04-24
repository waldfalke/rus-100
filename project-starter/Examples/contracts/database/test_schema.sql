-- Тестовый SQL скрипт для проверки схемы базы данных
-- Этот скрипт создает основные таблицы и вставляет тестовые данные

-- Создаем основные таблицы

-- Издательства
CREATE TABLE publishers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    logo_url VARCHAR(500),
    website VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Авторы
CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255),
    biography TEXT,
    photo_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Товары (книги)
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

-- Связь авторов и товаров
CREATE TABLE product_authors (
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    author_id INTEGER REFERENCES authors(id) ON DELETE CASCADE,
    author_role VARCHAR(50) DEFAULT 'author',
    sorting_order INTEGER DEFAULT 0,
    PRIMARY KEY (product_id, author_id)
);

-- Поставщики
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

-- Настройки поставщиков
CREATE TABLE supplier_settings (
    supplier_id INTEGER PRIMARY KEY REFERENCES suppliers(id) ON DELETE CASCADE,
    file_format VARCHAR(20) NOT NULL DEFAULT 'auto',
    has_header BOOLEAN DEFAULT TRUE,
    delimiter CHAR(1) DEFAULT ';',
    encoding VARCHAR(20) DEFAULT 'UTF-8',
    column_mapping JSONB,
    default_currency VARCHAR(3) DEFAULT 'RUB',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Прайс-листы
CREATE TABLE price_lists (
    id SERIAL PRIMARY KEY,
    supplier_id INTEGER NOT NULL REFERENCES suppliers(id),
    name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500),
    file_hash VARCHAR(64),
    file_size BIGINT,
    status VARCHAR(20) NOT NULL DEFAULT 'imported',
    total_items INTEGER DEFAULT 0,
    processed_items INTEGER DEFAULT 0,
    matched_items INTEGER DEFAULT 0,
    import_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    process_date TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_by INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Позиции прайс-листов
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
    status VARCHAR(20) NOT NULL DEFAULT 'new',
    product_id INTEGER REFERENCES products(id),
    match_confidence DECIMAL(5, 2),
    match_method VARCHAR(50),
    raw_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Функция для автоматического обновления поля updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггеры для обновления updated_at
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at
    BEFORE UPDATE ON suppliers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_price_lists_updated_at
    BEFORE UPDATE ON price_lists
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Вставка тестовых данных

-- Издательства
INSERT INTO publishers (name, description, website) VALUES
('Эксмо', 'Крупное российское издательство', 'https://eksmo.ru'),
('АСТ', 'Одно из ведущих издательств России', 'https://ast.ru'),
('МИФ', 'Издательство "Манн, Иванов и Фербер"', 'https://www.mann-ivanov-ferber.ru');

-- Авторы
INSERT INTO authors (name, biography) VALUES
('Лев Толстой', 'Русский писатель, классик мировой литературы'),
('Михаил Булгаков', 'Русский писатель, драматург и театральный режиссер'),
('Джордж Оруэлл', 'Английский писатель и публицист'),
('Джоан Роулинг', 'Британская писательница, автор серии книг о Гарри Поттере');

-- Товары
INSERT INTO products (title, isbn, publisher_id, publication_year, language_code, page_count, binding_type, status)
VALUES
('Война и мир', '9785699123456', 1, 2020, 'RU', 1200, 'Твердый переплет', 'active'),
('Мастер и Маргарита', '9785170987654', 2, 2019, 'RU', 480, 'Твердый переплет', 'active'),
('1984', '9785699765432', 1, 2021, 'RU', 320, 'Мягкий переплет', 'active'),
('Гарри Поттер и философский камень', '9785389077331', 2, 2018, 'RU', 432, 'Твердый переплет', 'active');

-- Связь авторов и товаров
INSERT INTO product_authors (product_id, author_id, author_role)
VALUES
(1, 1, 'author'),
(2, 2, 'author'),
(3, 3, 'author'),
(4, 4, 'author');

-- Поставщики
INSERT INTO suppliers (name, code, contact_person, email, phone, status)
VALUES
('Книжный клуб', 'BOOKCLUB', 'Иванов Иван', 'ivanov@bookclub.ru', '+7 (495) 123-45-67', 'active'),
('Лабиринт', 'LABIRINT', 'Петров Петр', 'petrov@labirint.ru', '+7 (495) 765-43-21', 'active');

-- Настройки поставщиков
INSERT INTO supplier_settings (supplier_id, file_format, has_header, delimiter, column_mapping)
VALUES
(1, 'csv', true, ';', '{"ISBN": "isbn", "Название": "title", "Автор": "author", "Цена": "price"}'),
(2, 'excel', true, ',', '{"ISBN": "isbn", "Наименование": "title", "Автор": "author", "Цена": "price", "Валюта": "currency"}');

-- Прайс-листы
INSERT INTO price_lists (supplier_id, name, file_path, file_hash, file_size, status, total_items, processed_items, matched_items)
VALUES
(1, 'Прайс-лист Книжного клуба от 01.04.2025', '/uploads/bookclub_20250401.csv', 'a1b2c3d4e5f6', 12500, 'processed', 100, 100, 95),
(2, 'Прайс-лист Лабиринта от 05.04.2025', '/uploads/labirint_20250405.xlsx', 'f6e5d4c3b2a1', 25600, 'imported', 200, 0, 0);

-- Позиции прайс-листов
INSERT INTO price_items (price_list_id, isbn, title, author, publisher, price, currency, stock, status, product_id, match_confidence)
VALUES
(1, '9785699123456', 'Война и мир', 'Лев Толстой', 'Эксмо', 850.00, 'RUB', 15, 'matched', 1, 1.0),
(1, '9785170987654', 'Мастер и Маргарита', 'Михаил Булгаков', 'АСТ', 580.00, 'RUB', 8, 'matched', 2, 1.0),
(1, '9785699765432', '1984', 'Джордж Оруэлл', 'Эксмо', 450.00, 'RUB', 20, 'matched', 3, 1.0),
(1, '9785389077331', 'Гарри Поттер и философский камень', 'Дж. К. Роулинг', 'Росмэн', 650.00, 'RUB', 12, 'matched', 4, 0.95);

-- Запросы для проверки

-- 1. Получить все книги с авторами
SELECT 
    p.id, 
    p.title, 
    p.isbn, 
    pub.name AS publisher, 
    string_agg(a.name, ', ') AS authors
FROM 
    products p
LEFT JOIN 
    publishers pub ON p.publisher_id = pub.id
LEFT JOIN 
    product_authors pa ON p.id = pa.product_id
LEFT JOIN 
    authors a ON pa.author_id = a.id
GROUP BY 
    p.id, pub.name
ORDER BY 
    p.title;

-- 2. Найти все позиции прайс-листов для конкретной книги
SELECT 
    pi.id,
    pi.title,
    pi.author,
    pi.price,
    pi.currency,
    pi.stock,
    s.name AS supplier,
    pl.name AS price_list
FROM 
    price_items pi
JOIN 
    price_lists pl ON pi.price_list_id = pl.id
JOIN 
    suppliers s ON pl.supplier_id = s.id
WHERE 
    pi.product_id = 1;

-- 3. Получить статистику по прайс-листам
SELECT 
    s.name AS supplier,
    COUNT(pl.id) AS price_list_count,
    SUM(pl.total_items) AS total_items,
    SUM(pl.matched_items) AS matched_items,
    ROUND(SUM(pl.matched_items)::numeric / NULLIF(SUM(pl.total_items), 0) * 100, 2) AS match_percentage
FROM 
    suppliers s
LEFT JOIN 
    price_lists pl ON s.id = pl.supplier_id
GROUP BY 
    s.id, s.name
ORDER BY 
    match_percentage DESC NULLS LAST; 