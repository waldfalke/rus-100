-- Контракт: DDL для таблицы products
-- Версия: 1.0.0
-- Статус: Актуальный
-- Последнее обновление: 2025-04-20
-- Последний редактор: AI

-- Описание:
-- Таблица products является основной таблицей для хранения данных о продуктах (книгах)
-- в формате JSONB. Она использует PostgreSQL JSONB для гибкого хранения данных
-- без необходимости изменения схемы при добавлении новых атрибутов.

-- Предусловия:
-- 1. База данных должна поддерживать тип данных JSONB (PostgreSQL 9.4+)
-- 2. База данных должна поддерживать GIN индексы
-- 3. Текущий пользователь должен иметь права на создание таблиц и индексов

-- Инварианты:
-- 1. id должен быть уникальным
-- 2. data должно содержать валидный JSON
-- 3. created_at и updated_at должны быть корректными временными метками
-- 4. updated_at должно автоматически обновляться при изменении записи

-- Таблица products
CREATE TABLE IF NOT EXISTS products (
    -- Уникальный идентификатор продукта
    id SERIAL PRIMARY KEY,
    
    -- Данные о продукте в формате JSONB
    -- Контракт поля:
    -- {
    --   "Артикул": string,
    --   "Название": string,
    --   "Категория": string,
    --   "Бренд": string | null,
    --   "Цена": string | number,
    --   "Валюта": string,
    --   "Наличие": string | boolean,
    --   "Раздел": string | null,
    --   "Автор": string | null,
    --   "Издательство": string | null,
    --   "Серия": string | null,
    --   "Год издания": string | null,
    --   "Кол-во страниц": string | number | null,
    --   "Размеры": string | null,
    --   "Переплет": string | null,
    --   "Год, тираж": string | null,
    --   "Вес": string | number | null,
    --   "Краткое описание": string | null,
    --   "Описание": string | null,
    --   "ИСБН": string | null
    -- }
    data JSONB NOT NULL,
    
    -- Дата и время создания записи
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Дата и время последнего обновления записи
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Проверка, что data содержит валидный JSON
    CONSTRAINT valid_json CHECK (data IS NOT NULL)
);

-- Индекс для ускорения поиска по JSON-данным
CREATE INDEX IF NOT EXISTS idx_products_data ON products USING GIN (data);

-- Индексы для часто используемых полей
CREATE INDEX IF NOT EXISTS idx_products_artikul ON products ((data->>'Артикул'));
CREATE INDEX IF NOT EXISTS idx_products_category ON products ((data->>'Категория'));
CREATE INDEX IF NOT EXISTS idx_products_brand ON products ((data->>'Бренд'));
CREATE INDEX IF NOT EXISTS idx_products_isbn ON products ((data->>'ИСБН'));
CREATE INDEX IF NOT EXISTS idx_products_name ON products ((data->>'Название'));

-- Комментарии к таблице и полям
COMMENT ON TABLE products IS 'Таблица для хранения данных о продуктах (книгах)';
COMMENT ON COLUMN products.id IS 'Уникальный идентификатор продукта';
COMMENT ON COLUMN products.data IS 'Данные о продукте в формате JSONB';
COMMENT ON COLUMN products.created_at IS 'Дата и время создания записи';
COMMENT ON COLUMN products.updated_at IS 'Дата и время последнего обновления записи';

-- Связанные объекты:
-- 1. Функция update_updated_at_column() - см. triggers.sql
-- 2. Триггер update_products_updated_at - см. triggers.sql
-- 3. Представление products_view - см. views.sql 