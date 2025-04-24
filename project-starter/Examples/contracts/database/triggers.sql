-- Контракт: DDL для триггеров и функций
-- Версия: 1.0.0
-- Статус: Актуальный
-- Последнее обновление: 2025-04-20
-- Последний редактор: AI

-- Описание:
-- Этот файл содержит определения триггеров и функций, используемых в базе данных
-- CATMEPIM для обеспечения целостности и автоматизации операций.

-- Предусловия:
-- 1. Таблица products должна быть создана
-- 2. База данных должна поддерживать триггеры и хранимые функции (PostgreSQL)
-- 3. Текущий пользователь должен иметь права на создание триггеров и функций

-- Инварианты:
-- 1. Триггеры должны поддерживать целостность и корректность данных
-- 2. Поле updated_at должно автоматически обновляться при изменении записи

-- Функция для автоматического обновления поля updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггер для автоматического обновления updated_at в таблице products
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Комментарии к объектам
COMMENT ON FUNCTION update_updated_at_column() IS 'Функция для автоматического обновления поля updated_at при изменении записи';
COMMENT ON TRIGGER update_products_updated_at ON products IS 'Триггер для автоматического обновления поля updated_at при изменении записи в таблице products'; 