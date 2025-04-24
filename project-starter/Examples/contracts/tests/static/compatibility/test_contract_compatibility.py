"""
Тесты для проверки совместимости между контрактами.

Эти тесты проверяют, что контракты разных модулей совместимы между собой:
- Выходные данные одного модуля совместимы с входными данными другого
- Типы данных согласованы между модулями
- Обработка ошибок согласована между модулями
"""

import os
import sys
import pytest
from pathlib import Path

# Добавляем директорию utils в путь для импорта
sys.path.append(str(Path(__file__).parent.parent.parent / "utils"))

from contract_parser import (
    parse_markdown_contract,
    find_all_contracts,
    check_contracts_compatibility,
    Contract,
    ContractElement
)


# Фикстура для получения всех контрактов
@pytest.fixture(scope="module")
def all_contracts():
    """Возвращает все контракты в проекте."""
    base_dir = Path(__file__).parent.parent.parent.parent
    return find_all_contracts(str(base_dir))


# Фикстура для получения контрактов по модулям
@pytest.fixture(scope="module")
def contracts_by_module(all_contracts):
    """Группирует контракты по модулям."""
    modules = {
        "converter": [],
        "deduplicator": [],
        "database-loader": [],
        "data-analyzer": []
    }
    
    for contract in all_contracts:
        for module in modules:
            if module in contract.path.lower():
                modules[module].append(contract)
                break
    
    return modules


def test_contracts_compatibility(all_contracts):
    """Проверяет совместимость между всеми контрактами."""
    problems = check_contracts_compatibility(all_contracts)
    assert not problems, f"Проблемы совместимости между контрактами: {problems}"


def test_converter_deduplicator_compatibility(contracts_by_module):
    """Проверяет совместимость между контрактами Converter и Deduplicator."""
    converter_contracts = contracts_by_module["converter"]
    deduplicator_contracts = contracts_by_module["deduplicator"]
    
    # Проверяем, что выходные данные Converter совместимы с входными данными Deduplicator
    _check_output_input_compatibility(converter_contracts, deduplicator_contracts)


def test_deduplicator_database_loader_compatibility(contracts_by_module):
    """Проверяет совместимость между контрактами Deduplicator и DatabaseLoader."""
    deduplicator_contracts = contracts_by_module["deduplicator"]
    database_loader_contracts = contracts_by_module["database-loader"]
    
    # Проверяем, что выходные данные Deduplicator совместимы с входными данными DatabaseLoader
    _check_output_input_compatibility(deduplicator_contracts, database_loader_contracts)


def test_database_loader_data_analyzer_compatibility(contracts_by_module):
    """Проверяет совместимость между контрактами DatabaseLoader и DataAnalyzer."""
    database_loader_contracts = contracts_by_module["database-loader"]
    data_analyzer_contracts = contracts_by_module["data-analyzer"]
    
    # Проверяем, что выходные данные DatabaseLoader совместимы с входными данными DataAnalyzer
    _check_output_input_compatibility(database_loader_contracts, data_analyzer_contracts)


def test_related_contracts_exist(all_contracts):
    """Проверяет, что все связанные контракты существуют."""
    contract_paths = {os.path.basename(contract.path): contract.path for contract in all_contracts}
    
    for contract in all_contracts:
        for related_contract_name, related_contract_path in contract.related_contracts:
            # Проверяем, что связанный контракт существует
            related_contract_basename = os.path.basename(related_contract_path)
            assert related_contract_basename in contract_paths, f"Связанный контракт {related_contract_basename} не найден для контракта {contract.name}"


def test_exception_handling_consistency(all_contracts):
    """Проверяет согласованность обработки исключений между контрактами."""
    # Собираем все исключения из всех контрактов
    exceptions_by_contract = {}
    
    for contract in all_contracts:
        exceptions = []
        
        for element in contract.elements:
            for method in element.children:
                if method.element_type == "method":
                    exceptions.extend(method.exceptions)
        
        exceptions_by_contract[contract.name] = exceptions
    
    # Проверяем согласованность обработки исключений
    for contract_name, exceptions in exceptions_by_contract.items():
        for exception in exceptions:
            # Проверяем, что исключение обрабатывается согласованно во всех контрактах
            for other_contract_name, other_exceptions in exceptions_by_contract.items():
                if contract_name != other_contract_name:
                    # Если исключение встречается в обоих контрактах, проверяем согласованность
                    if exception in other_exceptions:
                        assert exception['type'] == other_exceptions[other_exceptions.index(exception)]['type'], \
                            f"Несогласованная обработка исключения {exception['type']} между контрактами {contract_name} и {other_contract_name}"


def _check_output_input_compatibility(source_contracts, target_contracts):
    """
    Проверяет совместимость выходных данных одних контрактов с входными данными других.
    
    Args:
        source_contracts: Контракты, предоставляющие выходные данные
        target_contracts: Контракты, принимающие входные данные
    """
    # Извлекаем методы, возвращающие данные
    output_methods = []
    for contract in source_contracts:
        for element in contract.elements:
            for method in element.children:
                if method.element_type == "method" and method.return_type:
                    output_methods.append(method)
    
    # Извлекаем методы, принимающие данные
    input_methods = []
    for contract in target_contracts:
        for element in contract.elements:
            for method in element.children:
                if method.element_type == "method" and method.parameters:
                    input_methods.append(method)
    
    # Проверяем совместимость типов
    for output_method in output_methods:
        for input_method in input_methods:
            # Проверяем, совместим ли выходной тип с входным типом
            if output_method.return_type and input_method.parameters:
                for param in input_method.parameters:
                    if _are_types_compatible(output_method.return_type, param['type']):
                        # Типы совместимы, проверяем дополнительные условия
                        _check_additional_compatibility(output_method, input_method, param)


def _are_types_compatible(type1, type2):
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
    
    # Проверяем совместимость потоков и коллекций
    if "Stream<" in type1 and "Stream<" in type2:
        # Извлекаем типы элементов потоков
        element_type1 = type1.split("<")[1].split(">")[0]
        element_type2 = type2.split("<")[1].split(">")[0]
        return _are_types_compatible(element_type1, element_type2)
    
    if "List<" in type1 and "List<" in type2:
        # Извлекаем типы элементов списков
        element_type1 = type1.split("<")[1].split(">")[0]
        element_type2 = type2.split("<")[1].split(">")[0]
        return _are_types_compatible(element_type1, element_type2)
    
    if "Map<" in type1 and "Map<" in type2:
        # Извлекаем типы ключей и значений
        key_type1, value_type1 = type1.split("<")[1].split(">")[0].split(",")
        key_type2, value_type2 = type2.split("<")[1].split(">")[0].split(",")
        return _are_types_compatible(key_type1, key_type2) and _are_types_compatible(value_type1, value_type2)
    
    # Проверяем совместимость примитивных типов
    if type1 in ["int", "long", "short", "byte"] and type2 in ["int", "long", "short", "byte"]:
        return True
    
    if type1 in ["float", "double"] and type2 in ["float", "double"]:
        return True
    
    # Проверяем совместимость File и String
    if type1 == "File" and type2 == "String":
        return True
    
    if type1 == "String" and type2 == "File":
        return True
    
    return False


def _check_additional_compatibility(output_method, input_method, param):
    """
    Проверяет дополнительные условия совместимости между методами.
    
    Args:
        output_method: Метод, возвращающий данные
        input_method: Метод, принимающий данные
        param: Параметр метода, принимающего данные
    """
    # Проверяем совместимость постусловий и предусловий
    for postcondition in output_method.postconditions:
        for precondition in input_method.preconditions:
            # Проверяем противоречия между постусловиями и предусловиями
            if "result" in postcondition and param['name'] in precondition:
                # Заменяем "result" на имя параметра
                modified_postcondition = postcondition.replace("result", param['name'])
                
                # Проверяем противоречия
                if _are_conditions_contradictory(modified_postcondition, precondition):
                    pytest.fail(f"Противоречие между постусловием '{postcondition}' метода {output_method.name} и предусловием '{precondition}' метода {input_method.name}")


def _are_conditions_contradictory(condition1, condition2):
    """
    Проверяет, противоречат ли условия друг другу.
    
    Args:
        condition1: Первое условие
        condition2: Второе условие
        
    Returns:
        True, если условия противоречат друг другу, иначе False
    """
    # Проверяем противоречия типа "x > 0" и "x <= 0"
    if ">" in condition1 and "<=" in condition2 and condition1.split(">")[0].strip() == condition2.split("<=")[0].strip():
        return True
    
    # Проверяем противоречия типа "x < 0" и "x >= 0"
    if "<" in condition1 and ">=" in condition2 and condition1.split("<")[0].strip() == condition2.split(">=")[0].strip():
        return True
    
    # Проверяем противоречия типа "x == 0" и "x != 0"
    if "==" in condition1 and "!=" in condition2 and condition1.split("==")[0].strip() == condition2.split("!=")[0].strip():
        return True
    
    return False


if __name__ == "__main__":
    # Запускаем тесты
    pytest.main(["-xvs", __file__])
