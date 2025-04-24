"""
Тесты для валидации JSON-схем.

Эти тесты проверяют, что JSON-схемы корректны и соответствуют стандарту JSON Schema.
"""

import os
import sys
import json
import pytest
from pathlib import Path

# Добавляем директорию utils в путь для импорта
sys.path.append(str(Path(__file__).parent.parent / "utils"))

from schema_validator import (
    validate_json_schema,
    validate_json_against_schema,
    check_schema_compatibility,
    find_all_schemas,
    generate_example_data
)


# Фикстура для получения всех JSON-схем
@pytest.fixture(scope="module")
def all_schemas():
    """Возвращает все JSON-схемы в проекте."""
    base_dir = Path(__file__).parent.parent.parent / "data" / "json-schema"
    return find_all_schemas(str(base_dir))


# Фикстура для получения схем по модулям
@pytest.fixture(scope="module")
def schemas_by_module(all_schemas):
    """Группирует схемы по модулям."""
    modules = {
        "converter": [],
        "deduplicator": [],
    }
    
    for schema_path in all_schemas:
        for module in modules:
            if module in schema_path.lower():
                modules[module].append(schema_path)
                break
    
    return modules


def test_all_schemas_are_valid(all_schemas):
    """Проверяет, что все JSON-схемы валидны."""
    for schema_path in all_schemas:
        problems = validate_json_schema(schema_path)
        assert not problems, f"Проблемы в схеме {schema_path}: {problems}"


def test_example_data_validates_against_schema(all_schemas):
    """Проверяет, что сгенерированные примеры данных валидны относительно схем."""
    for schema_path in all_schemas:
        # Генерируем пример данных
        example_data = generate_example_data(schema_path)
        
        # Валидируем пример данных относительно схемы
        problems = validate_json_against_schema(example_data, schema_path)
        assert not problems, f"Проблемы валидации примера данных для схемы {schema_path}: {problems}"


def test_converter_output_deduplicator_input_compatibility(schemas_by_module):
    """Проверяет совместимость между выходной схемой Converter и входной схемой Deduplicator."""
    converter_output_schemas = schemas_by_module["converter"]
    deduplicator_input_schemas = [s for s in schemas_by_module["deduplicator"] if "input" in s.lower()]
    
    for converter_schema in converter_output_schemas:
        for deduplicator_schema in deduplicator_input_schemas:
            problems = check_schema_compatibility(converter_schema, deduplicator_schema)
            assert not problems, f"Проблемы совместимости между схемами {converter_schema} и {deduplicator_schema}: {problems}"


def test_deduplicator_output_schema_compatibility(schemas_by_module):
    """Проверяет совместимость выходной схемы Deduplicator с другими схемами."""
    deduplicator_output_schemas = [s for s in schemas_by_module["deduplicator"] if "output" in s.lower()]
    
    # Проверяем, что выходная схема Deduplicator совместима с входной схемой Deduplicator
    # (для случаев, когда выход одной операции дедупликации является входом для другой)
    deduplicator_input_schemas = [s for s in schemas_by_module["deduplicator"] if "input" in s.lower()]
    
    for output_schema in deduplicator_output_schemas:
        for input_schema in deduplicator_input_schemas:
            problems = check_schema_compatibility(output_schema, input_schema)
            assert not problems, f"Проблемы совместимости между схемами {output_schema} и {input_schema}: {problems}"


def test_schema_required_fields(all_schemas):
    """Проверяет, что схемы имеют необходимые поля."""
    for schema_path in all_schemas:
        with open(schema_path, 'r', encoding='utf-8') as f:
            schema = json.load(f)
        
        # Проверяем наличие обязательных полей в схеме
        assert "$schema" in schema, f"Схема {schema_path} не имеет поля $schema"
        assert "title" in schema, f"Схема {schema_path} не имеет поля title"
        assert "description" in schema, f"Схема {schema_path} не имеет поля description"
        assert "type" in schema, f"Схема {schema_path} не имеет поля type"


def test_schema_array_items(all_schemas):
    """Проверяет, что схемы массивов имеют определение элементов."""
    for schema_path in all_schemas:
        with open(schema_path, 'r', encoding='utf-8') as f:
            schema = json.load(f)
        
        # Проверяем, что схемы массивов имеют определение элементов
        if schema.get("type") == "array":
            assert "items" in schema, f"Схема массива {schema_path} не имеет определения элементов (items)"


def test_schema_object_properties(all_schemas):
    """Проверяет, что схемы объектов имеют определение свойств."""
    for schema_path in all_schemas:
        with open(schema_path, 'r', encoding='utf-8') as f:
            schema = json.load(f)
        
        # Проверяем, что схемы объектов имеют определение свойств
        if schema.get("type") == "object":
            assert "properties" in schema, f"Схема объекта {schema_path} не имеет определения свойств (properties)"


def test_schema_property_descriptions(all_schemas):
    """Проверяет, что все свойства в схемах имеют описания."""
    for schema_path in all_schemas:
        with open(schema_path, 'r', encoding='utf-8') as f:
            schema = json.load(f)
        
        # Проверяем наличие описаний для свойств
        if schema.get("type") == "object" and "properties" in schema:
            for prop_name, prop_schema in schema["properties"].items():
                assert "description" in prop_schema, f"Свойство {prop_name} в схеме {schema_path} не имеет описания"


def test_schema_additional_properties(all_schemas):
    """Проверяет, что схемы объектов имеют определение additionalProperties."""
    for schema_path in all_schemas:
        with open(schema_path, 'r', encoding='utf-8') as f:
            schema = json.load(f)
        
        # Проверяем наличие определения additionalProperties для объектов
        if schema.get("type") == "object" and "properties" in schema:
            assert "additionalProperties" in schema, f"Схема объекта {schema_path} не имеет определения additionalProperties"


if __name__ == "__main__":
    # Запускаем тесты
    pytest.main(["-xvs", __file__])
