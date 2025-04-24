-- Контракт: DDL для таблицы Books (целевая схема)
-- Версия: 1.0.0
-- Статус: Планируемый
-- Последнее обновление: 2025-04-20
-- Последний редактор: AI

-- Описание:
-- Таблица Books является основной таблицей для хранения информации о книгах
-- в нормализованной форме. Она заменяет хранение книг в JSONB-формате
-- в существующей таблице products.

-- Предусловия:
-- 1. База данных должна быть PostgreSQL 11+
-- 2. Таблицы Publishers и другие связанные таблицы должны быть созданы
-- 3. Текущий пользователь должен иметь права на создание таблиц и индексов

-- Инварианты:
-- 1. book_id должен быть уникальным
-- 2. ISBN должен быть уникальным (если присутствует)
-- 3. created_at и updated_at должны быть корректными временными метками
-- 4. updated_at должно автоматически обновляться при изменении записи
-- 5. Внешние ключи должны ссылаться на существующие записи

-- Таблица Books
CREATE TABLE IF NOT EXISTS books (
    -- Уникальный идентификатор книги
    book_id SERIAL PRIMARY KEY,
    
    -- ISBN книги (уникальный, если присутствует)
    isbn VARCHAR(20) UNIQUE,
    
    -- Название книги
    title VARCHAR(255) NOT NULL,
    
    -- Подзаголовок книги
    subtitle VARCHAR(255),
    
    -- Описание книги
    description TEXT,
    
    -- Издательство (внешний ключ)
    publisher_id INTEGER REFERENCES publishers(publisher_id),
    
    -- Дата публикации
    publication_date DATE,
    
    -- Количество страниц
    page_count INTEGER CHECK (page_count > 0),
    
    -- Тип обложки (внешний ключ)
    cover_type_id INTEGER REFERENCES cover_types(cover_type_id),
    
    -- Вес книги в граммах
    weight INTEGER CHECK (weight > 0),
    
    -- Размеры книги (например, "210x148x10 мм")
    dimensions VARCHAR(50),
    
    -- Язык книги
    language VARCHAR(20),
    
    -- Статус книги (например, "active", "discontinued", "out_of_print")
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    
    -- Оценка качества данных (от 0 до 100)
    data_quality_score INTEGER CHECK (data_quality_score BETWEEN 0 AND 100),
    
    -- Дополнительные данные в формате JSONB
    additional_data JSONB,
    
    -- Дата и время создания записи
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Дата и время последнего обновления записи
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для ускорения поиска
CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);
CREATE INDEX IF NOT EXISTS idx_books_publisher_id ON books(publisher_id);
CREATE INDEX IF NOT EXISTS idx_books_status ON books(status);
CREATE INDEX IF NOT EXISTS idx_books_data_quality_score ON books(data_quality_score);
CREATE INDEX IF NOT EXISTS idx_books_additional_data ON books USING GIN (additional_data);

-- Комментарии к таблице и полям
COMMENT ON TABLE books IS 'Таблица для хранения информации о книгах';
COMMENT ON COLUMN books.book_id IS 'Уникальный идентификатор книги';
COMMENT ON COLUMN books.isbn IS 'ISBN книги (уникальный, если присутствует)';
COMMENT ON COLUMN books.title IS 'Название книги';
COMMENT ON COLUMN books.subtitle IS 'Подзаголовок книги';
COMMENT ON COLUMN books.description IS 'Описание книги';
COMMENT ON COLUMN books.publisher_id IS 'Издательство (внешний ключ)';
COMMENT ON COLUMN books.publication_date IS 'Дата публикации';
COMMENT ON COLUMN books.page_count IS 'Количество страниц';
COMMENT ON COLUMN books.cover_type_id IS 'Тип обложки (внешний ключ)';
COMMENT ON COLUMN books.weight IS 'Вес книги в граммах';
COMMENT ON COLUMN books.dimensions IS 'Размеры книги (например, "210x148x10 мм")';
COMMENT ON COLUMN books.language IS 'Язык книги';
COMMENT ON COLUMN books.status IS 'Статус книги (например, "active", "discontinued", "out_of_print")';
COMMENT ON COLUMN books.data_quality_score IS 'Оценка качества данных (от 0 до 100)';
COMMENT ON COLUMN books.additional_data IS 'Дополнительные данные в формате JSONB';
COMMENT ON COLUMN books.created_at IS 'Дата и время создания записи';
COMMENT ON COLUMN books.updated_at IS 'Дата и время последнего обновления записи';

-- Триггер для автоматического обновления updated_at
CREATE TRIGGER update_books_updated_at
    BEFORE UPDATE ON books
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Связанные объекты:
-- 1. Таблица publishers - см. publishers.sql
-- 2. Таблица cover_types - см. cover_types.sql
-- 3. Таблица book_authors - см. book_authors.sql
-- 4. Таблица book_categories - см. book_categories.sql
-- 5. Функция update_updated_at_column() - см. ../triggers.sql 