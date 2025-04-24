-- Контракт: DDL для таблицы архетипов данных
-- Версия: 1.0.0
-- Статус: Планируемый
-- Последнее обновление: 2025-04-20
-- Последний редактор: AI

-- Описание:
-- Данный файл содержит определение таблицы для хранения архетипов данных в системе CATMEPIM.
-- Архетипы данных используются для стандартизации и валидации данных о продуктах
-- из различных источников. Они определяют обязательные и опциональные поля,
-- правила валидации и трансформации данных.

-- Предусловия:
-- 1. База данных должна поддерживать тип данных JSONB
-- 2. Текущий пользователь должен иметь права на создание таблиц и индексов

-- Инварианты:
-- 1. Каждый архетип имеет уникальный идентификатор и уникальное имя
-- 2. Каждый архетип содержит информацию о требуемых и опциональных полях
-- 3. Архетипы используются для валидации данных при импорте

-- Таблица data_archetypes - хранит шаблоны данных для стандартизации
CREATE TABLE data_archetypes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    category VARCHAR(50) NOT NULL, -- Категория архетипа: 'book', 'author', 'publisher', etc.
    version VARCHAR(20) NOT NULL DEFAULT '1.0.0', -- Версия архетипа
    required_fields JSONB NOT NULL, -- Обязательные поля и их типы
    optional_fields JSONB, -- Опциональные поля и их типы
    validation_rules JSONB, -- Правила валидации
    transformation_rules JSONB, -- Правила трансформации данных
    examples JSONB, -- Примеры данных
    status VARCHAR(20) NOT NULL DEFAULT 'active', -- active, deprecated
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by INTEGER -- Ссылка на пользователя, создавшего архетип
);

-- Индексы для таблицы data_archetypes
CREATE INDEX idx_data_archetypes_category ON data_archetypes(category);
CREATE INDEX idx_data_archetypes_status ON data_archetypes(status);

-- Комментарии к таблице data_archetypes
-- COMMENT ON TABLE data_archetypes IS 'Архетипы данных для определения стандартов и шаблонов';
-- COMMENT ON COLUMN data_archetypes.id IS 'Уникальный идентификатор архетипа';
-- COMMENT ON COLUMN data_archetypes.name IS 'Название архетипа данных';
-- COMMENT ON COLUMN data_archetypes.description IS 'Подробное описание архетипа данных';
-- COMMENT ON COLUMN data_archetypes.category IS 'Категория архетипа (product, price, customer и т.д.)';
-- COMMENT ON COLUMN data_archetypes.required_fields IS 'JSON-массив обязательных полей для данного архетипа';
-- COMMENT ON COLUMN data_archetypes.optional_fields IS 'JSON-массив опциональных полей для данного архетипа';
-- COMMENT ON COLUMN data_archetypes.validation_rules IS 'JSON-объект с правилами валидации полей';
-- COMMENT ON COLUMN data_archetypes.transformation_rules IS 'JSON-объект с правилами трансформации данных';
-- COMMENT ON COLUMN data_archetypes.default_values IS 'JSON-объект со значениями по умолчанию для полей';
-- COMMENT ON COLUMN data_archetypes.status IS 'Статус архетипа (active, deprecated, draft)';
-- COMMENT ON COLUMN data_archetypes.version IS 'Версия архетипа данных';
-- COMMENT ON COLUMN data_archetypes.created_at IS 'Дата и время создания записи';
-- COMMENT ON COLUMN data_archetypes.updated_at IS 'Дата и время последнего обновления';

-- Таблица vendor_archetype_mapping - связь между поставщиками и архетипами
CREATE TABLE vendor_archetype_mapping (
    vendor_id INTEGER NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    archetype_id INTEGER NOT NULL REFERENCES data_archetypes(id) ON DELETE CASCADE,
    field_mapping JSONB NOT NULL, -- Сопоставление полей поставщика с полями архетипа
    priority INTEGER DEFAULT 1, -- Приоритет архетипа для данного поставщика
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (vendor_id, archetype_id)
);

-- Индексы для таблицы vendor_archetype_mapping
CREATE INDEX idx_vendor_archetype_mapping_vendor ON vendor_archetype_mapping(vendor_id);
CREATE INDEX idx_vendor_archetype_mapping_archetype ON vendor_archetype_mapping(archetype_id);

-- Комментарии к таблице vendor_archetype_mapping
COMMENT ON TABLE vendor_archetype_mapping IS 'Связь между поставщиками и архетипами данных';
COMMENT ON COLUMN vendor_archetype_mapping.vendor_id IS 'Идентификатор поставщика';
COMMENT ON COLUMN vendor_archetype_mapping.archetype_id IS 'Идентификатор архетипа данных';
COMMENT ON COLUMN vendor_archetype_mapping.field_mapping IS 'JSON-структура с сопоставлением полей поставщика с полями архетипа';
COMMENT ON COLUMN vendor_archetype_mapping.priority IS 'Приоритет архетипа для данного поставщика';
COMMENT ON COLUMN vendor_archetype_mapping.is_active IS 'Флаг активности сопоставления';
COMMENT ON COLUMN vendor_archetype_mapping.created_at IS 'Дата и время создания записи';
COMMENT ON COLUMN vendor_archetype_mapping.updated_at IS 'Дата и время последнего обновления записи';

-- Триггер для автоматического обновления поля updated_at в таблице data_archetypes
CREATE TRIGGER update_data_archetypes_updated_at
    BEFORE UPDATE ON data_archetypes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Триггер для автоматического обновления поля updated_at в таблице vendor_archetype_mapping
CREATE TRIGGER update_vendor_archetype_mapping_updated_at
    BEFORE UPDATE ON vendor_archetype_mapping
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Примеры содержимого полей JSONB:

-- 1. Пример required_fields для архетипа 'book'
/*
{
  "isbn": {
    "type": "string",
    "pattern": "^[0-9-]{10,17}$",
    "description": "ISBN книги в формате ISBN-10 или ISBN-13"
  },
  "title": {
    "type": "string",
    "minLength": 1,
    "maxLength": 255,
    "description": "Название книги"
  },
  "author": {
    "type": "array",
    "items": {
      "type": "string"
    },
    "description": "Авторы книги"
  }
}
*/

-- 2. Пример validation_rules для архетипа 'book'
/*
{
  "isbn": [
    {
      "rule": "regex",
      "pattern": "^[0-9-]{10,17}$",
      "message": "ISBN должен содержать от 10 до 17 символов (цифры и дефисы)"
    },
    {
      "rule": "isbn_check",
      "message": "Невалидный ISBN"
    }
  ],
  "price": [
    {
      "rule": "min",
      "value": 0,
      "message": "Цена не может быть отрицательной"
    }
  ]
}
*/

-- 3. Пример field_mapping для связи поставщика с архетипом
/*
{
  "isbn": "ISBN",
  "title": "Название",
  "author": "Автор",
  "publisher": "Издательство",
  "price": "Цена",
  "currency": "Валюта",
  "stock": "Наличие"
}
*/

-- Функция для проверки соответствия данных архетипу
CREATE OR REPLACE FUNCTION validate_data_against_archetype(
    p_data JSONB,
    p_archetype_id INTEGER
) RETURNS TABLE (
    is_valid BOOLEAN,
    error_messages JSONB
) AS $$
DECLARE
    v_archetype RECORD;
    v_required_fields JSONB;
    v_field_name TEXT;
    v_field_spec JSONB;
    v_errors JSONB := '[]'::JSONB;
    v_field_value JSONB;
    v_is_valid BOOLEAN := TRUE;
BEGIN
    -- Получаем информацию об архетипе
    SELECT * INTO v_archetype FROM data_archetypes WHERE id = p_archetype_id;
    
    IF NOT FOUND THEN
        v_errors := v_errors || jsonb_build_object('archetype', 'Архетип не найден');
        RETURN QUERY SELECT FALSE, v_errors;
    END IF;
    
    -- Проверяем наличие всех обязательных полей
    v_required_fields := v_archetype.required_fields;
    
    FOR v_field_name, v_field_spec IN SELECT * FROM jsonb_each(v_required_fields)
    LOOP
        IF NOT p_data ? v_field_name THEN
            v_is_valid := FALSE;
            v_errors := v_errors || jsonb_build_object(
                'field', v_field_name,
                'error', 'Обязательное поле отсутствует'
            );
        ELSE
            -- Проверка типа данных для поля (упрощенная реализация)
            v_field_value := p_data->v_field_name;
            
            -- Пример проверки типа string
            IF v_field_spec->>'type' = 'string' AND jsonb_typeof(v_field_value) != 'string' THEN
                v_is_valid := FALSE;
                v_errors := v_errors || jsonb_build_object(
                    'field', v_field_name,
                    'error', 'Неверный тип данных, ожидается строка'
                );
            END IF;
            
            -- Здесь могут быть другие проверки в зависимости от типа и правил
        END IF;
    END LOOP;
    
    -- Возвращаем результат
    RETURN QUERY SELECT v_is_valid, v_errors;
END;
$$ LANGUAGE plpgsql; 