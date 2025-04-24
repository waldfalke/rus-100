"""
Парсер контрактов из Markdown-файлов.

Этот модуль предоставляет функции для извлечения информации о контрактах
из Markdown-файлов, включая предусловия, постусловия, инварианты и примеры кода.
"""

import re
import os
from pathlib import Path
from typing import Dict, List, Optional, Any, Tuple, Set


class ContractElement:
    """Представляет элемент контракта (метод, класс, интерфейс)."""
    
    def __init__(self, name: str, element_type: str, description: str = ""):
        """
        Инициализирует элемент контракта.
        
        Args:
            name: Имя элемента
            element_type: Тип элемента (метод, класс, интерфейс)
            description: Описание элемента
        """
        self.name = name
        self.element_type = element_type
        self.description = description
        self.preconditions: List[str] = []
        self.postconditions: List[str] = []
        self.invariants: List[str] = []
        self.parameters: List[Dict[str, str]] = []
        self.return_type: Optional[str] = None
        self.return_description: Optional[str] = None
        self.exceptions: List[Dict[str, str]] = []
        self.code_example: Optional[str] = None
        self.parent: Optional[ContractElement] = None
        self.children: List[ContractElement] = []


class Contract:
    """Представляет контракт модуля."""
    
    def __init__(self, name: str, version: str, status: str, path: str):
        """
        Инициализирует контракт.
        
        Args:
            name: Имя контракта
            version: Версия контракта
            status: Статус контракта
            path: Путь к файлу контракта
        """
        self.name = name
        self.version = version
        self.status = status
        self.path = path
        self.description: str = ""
        self.elements: List[ContractElement] = []
        self.related_contracts: List[str] = []
        self.invariants: List[str] = []


def parse_markdown_contract(file_path: str) -> Contract:
    """
    Парсит Markdown-файл контракта и возвращает объект Contract.
    
    Args:
        file_path: Путь к Markdown-файлу контракта
        
    Returns:
        Объект Contract, представляющий контракт
        
    Raises:
        FileNotFoundError: Если файл не найден
        ValueError: Если файл не содержит валидный контракт
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Файл контракта не найден: {file_path}")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Извлекаем метаданные контракта
    title_match = re.search(r'# Контракт: (.*)', content)
    if not title_match:
        raise ValueError(f"Не удалось найти заголовок контракта в файле: {file_path}")
    
    contract_name = title_match.group(1)
    
    # Извлекаем версию
    version_match = re.search(r'\*\*Версия\*\*: ([\d\.]+)', content)
    version = version_match.group(1) if version_match else "1.0.0"
    
    # Извлекаем статус
    status_match = re.search(r'\*\*Статус\*\*: (.*)', content)
    status = status_match.group(1) if status_match else "Неизвестно"
    
    # Создаем объект контракта
    contract = Contract(contract_name, version, status, file_path)
    
    # Извлекаем описание
    description_match = re.search(r'## Описание\n\n(.*?)(?=\n##)', content, re.DOTALL)
    if description_match:
        contract.description = description_match.group(1).strip()
    
    # Извлекаем код интерфейса
    interface_match = re.search(r'## Интерфейс\n```java\n(.*?)```', content, re.DOTALL)
    if interface_match:
        interface_code = interface_match.group(1)
        # Парсим элементы интерфейса (классы, методы)
        contract.elements = _parse_java_interface(interface_code)
    
    # Извлекаем предусловия и постусловия
    preconditions_postconditions_match = re.search(r'## Предусловия и постусловия\n\n(.*?)(?=\n##)', content, re.DOTALL)
    if preconditions_postconditions_match:
        _parse_preconditions_postconditions(preconditions_postconditions_match.group(1), contract)
    
    # Извлекаем инварианты
    invariants_match = re.search(r'## Инварианты\n\n(.*?)(?=\n##)', content, re.DOTALL)
    if invariants_match:
        invariants_text = invariants_match.group(1)
        contract.invariants = [inv.strip() for inv in re.findall(r'- (.*)', invariants_text)]
    
    # Извлекаем связанные контракты
    related_contracts_match = re.search(r'## Связанные контракты\n\n(.*?)(?=\n##|$)', content, re.DOTALL)
    if related_contracts_match:
        related_contracts_text = related_contracts_match.group(1)
        contract.related_contracts = [rc.strip() for rc in re.findall(r'\[(.*?)\]\((.*?)\)', related_contracts_text)]
    
    return contract


def _parse_java_interface(interface_code: str) -> List[ContractElement]:
    """
    Парсит Java-код интерфейса и возвращает список элементов контракта.
    
    Args:
        interface_code: Java-код интерфейса
        
    Returns:
        Список элементов контракта
    """
    elements: List[ContractElement] = []
    
    # Парсим классы и интерфейсы
    class_matches = re.finditer(r'(?:public\s+)?(?:class|interface)\s+(\w+)(?:\s+extends\s+\w+)?(?:\s+implements\s+[\w,\s]+)?\s*{', interface_code)
    
    for class_match in class_matches:
        class_name = class_match.group(1)
        class_start = class_match.start()
        
        # Ищем конец класса
        braces_count = 1
        class_end = class_start + class_match.group(0).find('{') + 1
        
        while braces_count > 0 and class_end < len(interface_code):
            if interface_code[class_end] == '{':
                braces_count += 1
            elif interface_code[class_end] == '}':
                braces_count -= 1
            class_end += 1
        
        class_code = interface_code[class_start:class_end]
        
        # Извлекаем описание класса из JavaDoc
        class_javadoc_match = re.search(r'/\*\*(.*?)\*/', interface_code[:class_start], re.DOTALL)
        class_description = ""
        if class_javadoc_match:
            class_description = _parse_javadoc_description(class_javadoc_match.group(1))
        
        class_element = ContractElement(class_name, "class" if "class" in class_match.group(0) else "interface", class_description)
        
        # Парсим методы класса
        method_matches = re.finditer(r'(?:public|protected|private)?\s+(?:static\s+)?(?:final\s+)?(?:[\w<>[\],\s]+)\s+(\w+)\s*\((.*?)\)', class_code)
        
        for method_match in method_matches:
            method_name = method_match.group(1)
            method_params = method_match.group(2)
            method_start = method_match.start()
            
            # Извлекаем описание метода из JavaDoc
            method_javadoc_match = re.search(r'/\*\*(.*?)\*/', class_code[:method_start], re.DOTALL)
            method_description = ""
            if method_javadoc_match:
                method_description = _parse_javadoc_description(method_javadoc_match.group(1))
            
            method_element = ContractElement(method_name, "method", method_description)
            method_element.parent = class_element
            
            # Парсим параметры метода
            if method_params.strip():
                params = method_params.split(',')
                for param in params:
                    param = param.strip()
                    if param:
                        param_parts = param.split()
                        param_type = ' '.join(param_parts[:-1])
                        param_name = param_parts[-1]
                        method_element.parameters.append({
                            "name": param_name,
                            "type": param_type,
                            "description": ""
                        })
            
            # Добавляем метод в класс
            class_element.children.append(method_element)
        
        # Добавляем класс в список элементов
        elements.append(class_element)
    
    return elements


def _parse_preconditions_postconditions(text: str, contract: Contract) -> None:
    """
    Парсит предусловия и постусловия из текста и добавляет их в контракт.
    
    Args:
        text: Текст с предусловиями и постусловиями
        contract: Объект контракта
    """
    # Ищем блоки для каждого метода
    method_blocks = re.finditer(r'### ([\w()]+)\n(.*?)(?=\n###|\Z)', text, re.DOTALL)
    
    for method_block in method_blocks:
        method_name = method_block.group(1)
        method_text = method_block.group(2)
        
        # Ищем элемент контракта для этого метода
        method_element = None
        for class_element in contract.elements:
            for child in class_element.children:
                if child.name in method_name:
                    method_element = child
                    break
            if method_element:
                break
        
        if not method_element:
            # Создаем новый элемент, если не нашли существующий
            method_element = ContractElement(method_name, "method")
            contract.elements.append(method_element)
        
        # Извлекаем предусловия
        preconditions_match = re.search(r'- \*\*Предусловия\*\*:\n(.*?)(?=\n-|\Z)', method_text, re.DOTALL)
        if preconditions_match:
            preconditions_text = preconditions_match.group(1)
            method_element.preconditions = [pre.strip() for pre in re.findall(r'- (.*)', preconditions_text)]
        
        # Извлекаем постусловия
        postconditions_match = re.search(r'- \*\*Постусловия\*\*:\n(.*?)(?=\n-|\Z)', method_text, re.DOTALL)
        if postconditions_match:
            postconditions_text = postconditions_match.group(1)
            method_element.postconditions = [post.strip() for post in re.findall(r'- (.*)', postconditions_text)]


def _parse_javadoc_description(javadoc: str) -> str:
    """
    Извлекает описание из JavaDoc.
    
    Args:
        javadoc: Текст JavaDoc
        
    Returns:
        Описание из JavaDoc
    """
    # Удаляем звездочки и пробелы в начале строк
    lines = [line.strip().lstrip('* ') for line in javadoc.split('\n')]
    
    # Собираем описание до первого тега (@param, @return и т.д.)
    description_lines = []
    for line in lines:
        if line.startswith('@'):
            break
        description_lines.append(line)
    
    return ' '.join(description_lines).strip()


def find_all_contracts(base_dir: str) -> List[Contract]:
    """
    Находит и парсит все контракты в указанной директории.
    
    Args:
        base_dir: Базовая директория для поиска контрактов
        
    Returns:
        Список объектов Contract
    """
    contracts = []
    
    for root, _, files in os.walk(base_dir):
        for file in files:
            if file.endswith('.md') and file != 'README.md':
                file_path = os.path.join(root, file)
                try:
                    contract = parse_markdown_contract(file_path)
                    contracts.append(contract)
                except (ValueError, FileNotFoundError) as e:
                    print(f"Ошибка при парсинге контракта {file_path}: {e}")
    
    return contracts


def check_contract_consistency(contract: Contract) -> List[str]:
    """
    Проверяет внутреннюю согласованность контракта.
    
    Args:
        contract: Объект контракта
        
    Returns:
        Список обнаруженных проблем
    """
    problems = []
    
    # Проверяем наличие описания
    if not contract.description:
        problems.append(f"Контракт {contract.name} не имеет описания")
    
    # Проверяем элементы контракта
    for element in contract.elements:
        # Проверяем наличие описания у элемента
        if not element.description and element.element_type != "method":
            problems.append(f"Элемент {element.name} контракта {contract.name} не имеет описания")
        
        # Проверяем методы
        for method in element.children:
            if method.element_type == "method":
                # Проверяем наличие предусловий и постусловий
                if not method.preconditions:
                    problems.append(f"Метод {method.name} класса {element.name} не имеет предусловий")
                
                if not method.postconditions:
                    problems.append(f"Метод {method.name} класса {element.name} не имеет постусловий")
    
    return problems


def check_contracts_compatibility(contracts: List[Contract]) -> List[str]:
    """
    Проверяет совместимость между контрактами.
    
    Args:
        contracts: Список контрактов
        
    Returns:
        Список обнаруженных проблем
    """
    problems = []
    
    # Создаем словарь контрактов по имени
    contracts_dict = {contract.name: contract for contract in contracts}
    
    # Проверяем связанные контракты
    for contract in contracts:
        for related_contract_name, _ in contract.related_contracts:
            if related_contract_name not in contracts_dict:
                problems.append(f"Контракт {contract.name} ссылается на несуществующий контракт {related_contract_name}")
    
    # TODO: Добавить более сложные проверки совместимости
    
    return problems


if __name__ == "__main__":
    # Пример использования
    base_dir = "D:/Dev/CATMEPIM/contracts"
    contracts = find_all_contracts(base_dir)
    
    print(f"Найдено {len(contracts)} контрактов")
    
    for contract in contracts:
        print(f"Контракт: {contract.name} (версия {contract.version}, статус: {contract.status})")
        print(f"  Описание: {contract.description[:100]}...")
        print(f"  Элементы: {len(contract.elements)}")
        
        # Проверяем согласованность контракта
        problems = check_contract_consistency(contract)
        if problems:
            print("  Проблемы:")
            for problem in problems:
                print(f"    - {problem}")
        else:
            print("  Проблем не обнаружено")
        
        print()
    
    # Проверяем совместимость между контрактами
    compatibility_problems = check_contracts_compatibility(contracts)
    if compatibility_problems:
        print("Проблемы совместимости:")
        for problem in compatibility_problems:
            print(f"  - {problem}")
    else:
        print("Проблем совместимости не обнаружено")
