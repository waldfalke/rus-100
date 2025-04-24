"""
Валидатор JSON-схем.

Этот модуль предоставляет функции для валидации JSON-схем и проверки
совместимости между схемами разных модулей.
"""

import json
import os
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple, Set

import jsonschema
from jsonschema import validators


def validate_json_schema(schema_path: str) -> List[str]:
    """
    Валидирует JSON-схему на соответствие стандарту JSON Schema.
    
    Args:
        schema_path: Путь к файлу JSON-схемы
        
    Returns:
        Список обнаруженных проблем
    """
    problems = []
    
    try:
        with open(schema_path, 'r', encoding='utf-8') as f:
            schema = json.load(f)
        
        # Проверяем схему на соответствие стандарту JSON Schema Draft 7
        validators.Draft7Validator.check_schema(schema)
    except json.JSONDecodeError as e:
        problems.append(f"Ошибка декодирования JSON: {e}")
    except jsonschema.exceptions.SchemaError as e:
        problems.append(f"Ошибка схемы: {e}")
    except Exception as e:
        problems.append(f"Неизвестная ошибка: {e}")
    
    return problems


def validate_json_against_schema(json_data: Dict[str, Any], schema_path: str) -> List[str]:
    """
    Валидирует JSON-данные на соответствие схеме.
    
    Args:
        json_data: JSON-данные для валидации
        schema_path: Путь к файлу JSON-схемы
        
    Returns:
        Список обнаруженных проблем
    """
    problems = []
    
    try:
        with open(schema_path, 'r', encoding='utf-8') as f:
            schema = json.load(f)
        
        # Валидируем данные
        validator = jsonschema.Draft7Validator(schema)
        errors = list(validator.iter_errors(json_data))
        
        for error in errors:
            problems.append(f"Ошибка валидации: {error.message}")
    except json.JSONDecodeError as e:
        problems.append(f"Ошибка декодирования JSON: {e}")
    except Exception as e:
        problems.append(f"Неизвестная ошибка: {e}")
    
    return problems


def check_schema_compatibility(schema1_path: str, schema2_path: str) -> List[str]:
    """
    Проверяет совместимость между двумя JSON-схемами.
    
    Args:
        schema1_path: Путь к первой JSON-схеме
        schema2_path: Путь к второй JSON-схеме
        
    Returns:
        Список обнаруженных проблем
    """
    problems = []
    
    try:
        with open(schema1_path, 'r', encoding='utf-8') as f:
            schema1 = json.load(f)
        
        with open(schema2_path, 'r', encoding='utf-8') as f:
            schema2 = json.load(f)
        
        # Проверяем совместимость схем
        problems.extend(_check_properties_compatibility(schema1, schema2))
    except json.JSONDecodeError as e:
        problems.append(f"Ошибка декодирования JSON: {e}")
    except Exception as e:
        problems.append(f"Неизвестная ошибка: {e}")
    
    return problems


def _check_properties_compatibility(schema1: Dict[str, Any], schema2: Dict[str, Any]) -> List[str]:
    """
    Проверяет совместимость свойств между двумя схемами.
    
    Args:
        schema1: Первая схема
        schema2: Вторая схема
        
    Returns:
        Список обнаруженных проблем
    """
    problems = []
    
    # Проверяем свойства в корне схемы
    if 'properties' in schema1 and 'properties' in schema2:
        schema1_props = schema1['properties']
        schema2_props = schema2['properties']
        
        # Проверяем свойства, которые есть в обеих схемах
        common_props = set(schema1_props.keys()) & set(schema2_props.keys())
        for prop in common_props:
            # Проверяем тип свойства
            if 'type' in schema1_props[prop] and 'type' in schema2_props[prop]:
                type1 = schema1_props[prop]['type']
                type2 = schema2_props[prop]['type']
                
                # Если типы не совместимы
                if not _are_types_compatible(type1, type2):
                    problems.append(f"Несовместимые типы для свойства '{prop}': {type1} и {type2}")
            
            # Проверяем формат свойства
            if 'format' in schema1_props[prop] and 'format' in schema2_props[prop]:
                format1 = schema1_props[prop]['format']
                format2 = schema2_props[prop]['format']
                
                if format1 != format2:
                    problems.append(f"Несовместимые форматы для свойства '{prop}': {format1} и {format2}")
            
            # Проверяем ограничения
            for constraint in ['minimum', 'maximum', 'minLength', 'maxLength', 'pattern']:
                if constraint in schema1_props[prop] and constraint in schema2_props[prop]:
                    value1 = schema1_props[prop][constraint]
                    value2 = schema2_props[prop][constraint]
                    
                    if value1 != value2:
                        problems.append(f"Несовместимые ограничения {constraint} для свойства '{prop}': {value1} и {value2}")
    
    # Проверяем вложенные схемы
    if 'items' in schema1 and 'items' in schema2:
        problems.extend(_check_properties_compatibility(schema1['items'], schema2['items']))
    
    return problems


def _are_types_compatible(type1: Any, type2: Any) -> bool:
    """
    Проверяет совместимость типов.
    
    Args:
        type1: Первый тип
        type2: Второй тип
        
    Returns:
        True, если типы совместимы, иначе False
    """
    # Если типы одинаковые, они совместимы
    if type1 == type2:
        return True
    
    # Если один из типов - массив, проверяем совместимость элементов массива
    if isinstance(type1, list) and isinstance(type2, list):
        return set(type1) & set(type2)
    
    if isinstance(type1, list) and not isinstance(type2, list):
        return type2 in type1
    
    if not isinstance(type1, list) and isinstance(type2, list):
        return type1 in type2
    
    # Некоторые типы совместимы между собой
    compatible_types = {
        'integer': ['number'],
        'number': ['integer']
    }
    
    return type1 in compatible_types.get(type2, []) or type2 in compatible_types.get(type1, [])


def find_all_schemas(base_dir: str) -> List[str]:
    """
    Находит все JSON-схемы в указанной директории.
    
    Args:
        base_dir: Базовая директория для поиска схем
        
    Returns:
        Список путей к JSON-схемам
    """
    schemas = []
    
    for root, _, files in os.walk(base_dir):
        for file in files:
            if file.endswith('.json'):
                file_path = os.path.join(root, file)
                schemas.append(file_path)
    
    return schemas


def generate_example_data(schema_path: str) -> Dict[str, Any]:
    """
    Генерирует пример данных на основе JSON-схемы.
    
    Args:
        schema_path: Путь к файлу JSON-схемы
        
    Returns:
        Пример данных, соответствующих схеме
    """
    with open(schema_path, 'r', encoding='utf-8') as f:
        schema = json.load(f)
    
    return _generate_example_for_schema(schema)


def _generate_example_for_schema(schema: Dict[str, Any]) -> Any:
    """
    Рекурсивно генерирует пример данных для схемы.
    
    Args:
        schema: JSON-схема
        
    Returns:
        Пример данных
    """
    if 'example' in schema:
        return schema['example']
    
    if 'type' not in schema:
        return {}
    
    schema_type = schema['type']
    
    if schema_type == 'object':
        result = {}
        if 'properties' in schema:
            for prop, prop_schema in schema['properties'].items():
                result[prop] = _generate_example_for_schema(prop_schema)
        return result
    
    elif schema_type == 'array':
        if 'items' in schema:
            return [_generate_example_for_schema(schema['items'])]
        return []
    
    elif schema_type == 'string':
        if 'format' in schema:
            if schema['format'] == 'date-time':
                return "2025-04-15T12:00:00Z"
            elif schema['format'] == 'date':
                return "2025-04-15"
            elif schema['format'] == 'email':
                return "example@example.com"
            elif schema['format'] == 'uri':
                return "https://example.com"
        return "example"
    
    elif schema_type == 'number' or schema_type == 'integer':
        return 42
    
    elif schema_type == 'boolean':
        return True
    
    elif schema_type == 'null':
        return None
    
    # Если тип - массив типов, используем первый тип
    elif isinstance(schema_type, list):
        for t in schema_type:
            if t != 'null':
                return _generate_example_for_schema({'type': t})
        return None
    
    return None


if __name__ == "__main__":
    # Пример использования
    base_dir = "D:/Dev/CATMEPIM/contracts/data/json-schema"
    schemas = find_all_schemas(base_dir)
    
    print(f"Найдено {len(schemas)} JSON-схем")
    
    for schema_path in schemas:
        print(f"Схема: {os.path.basename(schema_path)}")
        
        # Валидируем схему
        problems = validate_json_schema(schema_path)
        if problems:
            print("  Проблемы:")
            for problem in problems:
                print(f"    - {problem}")
        else:
            print("  Схема валидна")
        
        # Генерируем пример данных
        example = generate_example_data(schema_path)
        print(f"  Пример данных: {json.dumps(example, indent=2)[:100]}...")
        
        print()
    
    # Проверяем совместимость между схемами
    if len(schemas) >= 2:
        print("Проверка совместимости между схемами:")
        for i in range(len(schemas)):
            for j in range(i + 1, len(schemas)):
                schema1_path = schemas[i]
                schema2_path = schemas[j]
                
                print(f"  {os.path.basename(schema1_path)} и {os.path.basename(schema2_path)}:")
                
                compatibility_problems = check_schema_compatibility(schema1_path, schema2_path)
                if compatibility_problems:
                    print("    Проблемы:")
                    for problem in compatibility_problems:
                        print(f"      - {problem}")
                else:
                    print("    Схемы совместимы")
