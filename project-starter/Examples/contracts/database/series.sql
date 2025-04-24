-- Контракт: DDL для таблиц серий книг и их связей
-- Версия: 1.0.0
-- Статус: Планируемый
-- Последнее обновление: 2025-04-20
-- Последний редактор: AI

-- Описание:
-- Данный файл содержит определения таблиц для хранения информации о сериях книг
-- и связей книг с сериями в системе CATMEPIM.

-- Предусловия:
-- 1. Таблица products (books) должна быть создана
-- 2. База данных должна поддерживать GIN индексы для эффективного текстового поиска
-- 3. Текущий пользователь должен иметь права на создание таблиц и индексов

-- Инварианты:
-- 1. Каждая серия имеет уникальный идентификатор
-- 2. Названия серий не должны дублироваться у одного издательства
-- 3. Книга может принадлежать к нескольким сериям одновременно
-- 4. Для каждой книги в серии можно указать порядковый номер

-- Таблица series - хранит информацию о сериях книг
CREATE TABLE series (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    publisher_id INTEGER REFERENCES publishers(id), -- Издательство, выпускающее серию
    editor VARCHAR(255), -- Редактор серии
    start_year INTEGER, -- Год начала серии
    end_year INTEGER, -- Год завершения серии (NULL для продолжающихся)
    logo_url VARCHAR(500), -- URL логотипа серии
    status VARCHAR(20) NOT NULL DEFAULT 'active', -- active, completed, discontinued
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_series_name_publisher UNIQUE (name, publisher_id)
);

-- Индексы для таблицы series
CREATE INDEX idx_series_name ON series USING gin(to_tsvector('russian', name));
CREATE INDEX idx_series_publisher ON series(publisher_id);
CREATE INDEX idx_series_status ON series(status);

-- Комментарии к таблице series
COMMENT ON TABLE series IS 'Серии книг';
COMMENT ON COLUMN series.id IS 'Уникальный идентификатор серии';
COMMENT ON COLUMN series.name IS 'Название серии';
COMMENT ON COLUMN series.description IS 'Описание серии';
COMMENT ON COLUMN series.publisher_id IS 'Ссылка на издательство серии';
COMMENT ON COLUMN series.editor IS 'Редактор серии';
COMMENT ON COLUMN series.start_year IS 'Год начала серии';
COMMENT ON COLUMN series.end_year IS 'Год завершения серии (NULL для продолжающихся)';
COMMENT ON COLUMN series.logo_url IS 'URL логотипа серии';
COMMENT ON COLUMN series.status IS 'Статус серии: active (активная), completed (завершенная), discontinued (прекращенная)';
COMMENT ON COLUMN series.created_at IS 'Дата и время создания записи';
COMMENT ON COLUMN series.updated_at IS 'Дата и время последнего обновления записи';

-- Таблица product_series - связь между книгами и сериями (многие ко многим)
CREATE TABLE product_series (
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    series_id INTEGER REFERENCES series(id) ON DELETE CASCADE,
    sequence_number INTEGER, -- Порядковый номер книги в серии
    volume_title VARCHAR(255), -- Название тома, если отличается от основного названия
    notes TEXT, -- Дополнительные примечания
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (product_id, series_id)
);

-- Индексы для таблицы product_series
CREATE INDEX idx_product_series_product ON product_series(product_id);
CREATE INDEX idx_product_series_series ON product_series(series_id);
CREATE INDEX idx_product_series_sequence ON product_series(series_id, sequence_number);

-- Комментарии к таблице product_series
COMMENT ON TABLE product_series IS 'Связь книг с сериями';
COMMENT ON COLUMN product_series.product_id IS 'Ссылка на книгу';
COMMENT ON COLUMN product_series.series_id IS 'Ссылка на серию';
COMMENT ON COLUMN product_series.sequence_number IS 'Порядковый номер книги в серии';
COMMENT ON COLUMN product_series.volume_title IS 'Название тома, если отличается от основного названия';
COMMENT ON COLUMN product_series.notes IS 'Дополнительные примечания';
COMMENT ON COLUMN product_series.created_at IS 'Дата и время создания записи';
COMMENT ON COLUMN product_series.updated_at IS 'Дата и время последнего обновления записи';

-- Триггер для автоматического обновления поля updated_at в таблице series
CREATE TRIGGER update_series_updated_at
    BEFORE UPDATE ON series
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Триггер для автоматического обновления поля updated_at в таблице product_series
CREATE TRIGGER update_product_series_updated_at
    BEFORE UPDATE ON product_series
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Примеры запросов:

-- 1. Получение всех книг в серии с сортировкой по номеру
/*
SELECT 
    p.id, 
    p.title, 
    p.isbn, 
    ps.sequence_number,
    ps.volume_title,
    a.name AS author_name
FROM 
    series s
JOIN 
    product_series ps ON s.id = ps.series_id
JOIN 
    products p ON ps.product_id = p.id
LEFT JOIN 
    product_authors pa ON p.id = pa.product_id
LEFT JOIN 
    authors a ON pa.author_id = a.author_id
WHERE 
    s.name = 'Имя серии'
ORDER BY 
    ps.sequence_number NULLS LAST;
*/

-- 2. Получение всех серий определенного издательства
/*
SELECT 
    s.id,
    s.name,
    s.description,
    s.start_year,
    s.end_year,
    s.status,
    COUNT(ps.product_id) AS book_count
FROM 
    series s
LEFT JOIN 
    product_series ps ON s.id = ps.series_id
WHERE 
    s.publisher_id = 1
GROUP BY 
    s.id
ORDER BY 
    s.name;
*/ 