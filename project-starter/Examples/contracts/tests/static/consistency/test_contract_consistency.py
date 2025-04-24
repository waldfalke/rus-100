"""
Тесты для проверки внутренней согласованности контрактов.

Эти тесты проверяют, что контракты внутренне согласованы:
- Все методы имеют предусловия и постусловия
- Предусловия и постусловия не противоречат друг другу
- Инварианты не противоречат предусловиям и постусловиям
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
    check_contract_consistency,
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


def test_all_contracts_have_description(all_contracts):
    """Проверяет, что все контракты имеют описание."""
    for contract in all_contracts:
        assert contract.description, f"Контракт {contract.name} не имеет описания"


def test_all_contracts_have_elements(all_contracts):
    """Проверяет, что все контракты имеют элементы (классы, интерфейсы, методы)."""
    for contract in all_contracts:
        assert contract.elements, f"Контракт {contract.name} не имеет элементов"


def test_all_methods_have_preconditions_and_postconditions(all_contracts):
    """Проверяет, что все методы имеют предусловия и постусловия."""
    for contract in all_contracts:
        for element in contract.elements:
            for method in element.children:
                if method.element_type == "method":
                    assert method.preconditions, f"Метод {method.name} в контракте {contract.name} не имеет предусловий"
                    assert method.postconditions, f"Метод {method.name} в контракте {contract.name} не имеет постусловий"


def test_no_contradictions_in_preconditions(all_contracts):
    """Проверяет, что в предусловиях нет противоречий."""
    for contract in all_contracts:
        for element in contract.elements:
            for method in element.children:
                if method.element_type == "method":
                    # Проверяем противоречия в предусловиях
                    # Например, не может быть одновременно "x > 0" и "x < 0"
                    contradictions = _find_contradictions_in_conditions(method.preconditions)
                    assert not contradictions, f"Противоречия в предусловиях метода {method.name} в контракте {contract.name}: {contradictions}"


def test_no_contradictions_in_postconditions(all_contracts):
    """Проверяет, что в постусловиях нет противоречий."""
    for contract in all_contracts:
        for element in contract.elements:
            for method in element.children:
                if method.element_type == "method":
                    # Проверяем противоречия в постусловиях
                    contradictions = _find_contradictions_in_conditions(method.postconditions)
                    assert not contradictions, f"Противоречия в постусловиях метода {method.name} в контракте {contract.name}: {contradictions}"


def test_no_contradictions_between_preconditions_and_postconditions(all_contracts):
    """Проверяет, что нет противоречий между предусловиями и постусловиями."""
    for contract in all_contracts:
        for element in contract.elements:
            for method in element.children:
                if method.element_type == "method":
                    # Проверяем противоречия между предусловиями и постусловиями
                    contradictions = _find_contradictions_between_conditions(method.preconditions, method.postconditions)
                    assert not contradictions, f"Противоречия между предусловиями и постусловиями метода {method.name} в контракте {contract.name}: {contradictions}"


def test_no_contradictions_with_invariants(all_contracts):
    """Проверяет, что нет противоречий между инвариантами и предусловиями/постусловиями."""
    for contract in all_contracts:
        for element in contract.elements:
            # Проверяем только для классов и интерфейсов
            if element.element_type in ["class", "interface"]:
                for method in element.children:
                    if method.element_type == "method":
                        # Проверяем противоречия между инвариантами и предусловиями
                        contradictions = _find_contradictions_between_conditions(contract.invariants, method.preconditions)
                        assert not contradictions, f"Противоречия между инвариантами и предусловиями метода {method.name} в контракте {contract.name}: {contradictions}"
                        
                        # Проверяем противоречия между инвариантами и постусловиями
                        contradictions = _find_contradictions_between_conditions(contract.invariants, method.postconditions)
                        assert not contradictions, f"Противоречия между инвариантами и постусловиями метода {method.name} в контракте {contract.name}: {contradictions}"


def test_contract_consistency(all_contracts):
    """Проверяет общую согласованность контрактов."""
    for contract in all_contracts:
        problems = check_contract_consistency(contract)
        assert not problems, f"Проблемы согласованности в контракте {contract.name}: {problems}"


def _find_contradictions_in_conditions(conditions):
    """
    Находит противоречия в списке условий.
    
    Args:
        conditions: Список условий
        
    Returns:
        Список найденных противоречий
    """
    contradictions = []
    
    # Простые противоречия
    for i in range(len(conditions)):
        for j in range(i + 1, len(conditions)):
            cond1 = conditions[i]
            cond2 = conditions[j]
            
            # Проверяем противоречия типа "x > 0" и "x <= 0"
            if ">" in cond1 and "<=" in cond2 and cond1.split(">")[0].strip() == cond2.split("<=")[0].strip():
                contradictions.append(f"Противоречие: '{cond1}' и '{cond2}'")
            
            # Проверяем противоречия типа "x < 0" и "x >= 0"
            if "<" in cond1 and ">=" in cond2 and cond1.split("<")[0].strip() == cond2.split(">=")[0].strip():
                contradictions.append(f"Противоречие: '{cond1}' и '{cond2}'")
            
            # Проверяем противоречия типа "x == 0" и "x != 0"
            if "==" in cond1 and "!=" in cond2 and cond1.split("==")[0].strip() == cond2.split("!=")[0].strip():
                contradictions.append(f"Противоречие: '{cond1}' и '{cond2}'")
    
    return contradictions


def _find_contradictions_between_conditions(conditions1, conditions2):
    """
    Находит противоречия между двумя списками условий.
    
    Args:
        conditions1: Первый список условий
        conditions2: Второй список условий
        
    Returns:
        Список найденных противоречий
    """
    contradictions = []
    
    for cond1 in conditions1:
        for cond2 in conditions2:
            # Проверяем противоречия типа "x > 0" и "x <= 0"
            if ">" in cond1 and "<=" in cond2 and cond1.split(">")[0].strip() == cond2.split("<=")[0].strip():
                contradictions.append(f"Противоречие: '{cond1}' и '{cond2}'")
            
            # Проверяем противоречия типа "x < 0" и "x >= 0"
            if "<" in cond1 and ">=" in cond2 and cond1.split("<")[0].strip() == cond2.split(">=")[0].strip():
                contradictions.append(f"Противоречие: '{cond1}' и '{cond2}'")
            
            # Проверяем противоречия типа "x == 0" и "x != 0"
            if "==" in cond1 and "!=" in cond2 and cond1.split("==")[0].strip() == cond2.split("!=")[0].strip():
                contradictions.append(f"Противоречие: '{cond1}' и '{cond2}'")
    
    return contradictions


if __name__ == "__main__":
    # Запускаем тесты
    pytest.main(["-xvs", __file__])
