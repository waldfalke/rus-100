"""
Генератор mock-реализаций контрактов.

Этот модуль предоставляет функции для генерации минимальных реализаций
контрактов, которые удовлетворяют всем требованиям контракта.
"""

import os
import re
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple, Set

from contract_parser import Contract, ContractElement, parse_markdown_contract


class MockGenerator:
    """Генератор mock-реализаций контрактов."""
    
    def __init__(self, contract: Contract):
        """
        Инициализирует генератор mock-реализаций.
        
        Args:
            contract: Объект контракта
        """
        self.contract = contract
    
    def generate_java_implementation(self) -> str:
        """
        Генерирует Java-реализацию контракта.
        
        Returns:
            Java-код реализации контракта
        """
        code = []
        
        # Добавляем пакет
        code.append("package com.catmepim.mock;")
        code.append("")
        
        # Добавляем импорты
        code.append("import java.io.File;")
        code.append("import java.io.IOException;")
        code.append("import java.util.List;")
        code.append("import java.util.Map;")
        code.append("import java.util.stream.Stream;")
        code.append("import org.json.JSONObject;")
        code.append("")
        
        # Добавляем JavaDoc для класса
        code.append("/**")
        code.append(f" * Mock-реализация контракта {self.contract.name}.")
        code.append(" * ")
        code.append(" * Эта реализация удовлетворяет всем требованиям контракта,")
        code.append(" * но не выполняет никакой реальной работы.")
        code.append(" */")
        
        # Генерируем код для каждого элемента контракта
        for element in self.contract.elements:
            if element.element_type == "interface":
                # Генерируем реализацию интерфейса
                code.append(f"public class Mock{element.name} implements {element.name} {{")
                code.append("")
                
                # Добавляем поля для хранения состояния
                code.append("    // Поля для хранения состояния")
                code.append("    private boolean operationPerformed = false;")
                code.append("")
                
                # Генерируем реализации методов
                for method in element.children:
                    if method.element_type == "method":
                        code.extend(self._generate_method_implementation(method))
                
                code.append("}")
            elif element.element_type == "class":
                # Генерируем реализацию класса
                code.append(f"public class Mock{element.name} extends {element.name} {{")
                code.append("")
                
                # Генерируем конструктор
                code.append("    /**")
                code.append(f"     * Создает новый экземпляр Mock{element.name}.")
                code.append("     */")
                code.append(f"    public Mock{element.name}() {{")
                code.append("        // Инициализация полей")
                code.append("    }")
                code.append("")
                
                # Генерируем реализации методов
                for method in element.children:
                    if method.element_type == "method":
                        code.extend(self._generate_method_implementation(method))
                
                code.append("}")
        
        return "\n".join(code)
    
    def _generate_method_implementation(self, method: ContractElement) -> List[str]:
        """
        Генерирует реализацию метода.
        
        Args:
            method: Элемент контракта, представляющий метод
            
        Returns:
            Список строк с кодом реализации метода
        """
        code = []
        
        # Добавляем JavaDoc для метода
        code.append("    /**")
        code.append(f"     * {method.description}")
        code.append("     * ")
        code.append("     * Эта реализация удовлетворяет всем требованиям контракта,")
        code.append("     * но не выполняет никакой реальной работы.")
        
        # Добавляем информацию о параметрах
        for param in method.parameters:
            code.append(f"     * @param {param['name']} {param.get('description', '')}")
        
        # Добавляем информацию о возвращаемом значении
        if method.return_type:
            code.append(f"     * @return {method.return_description or 'Результат операции'}")
        
        # Добавляем информацию об исключениях
        for exception in method.exceptions:
            code.append(f"     * @throws {exception['type']} {exception.get('description', '')}")
        
        code.append("     */")
        
        # Определяем сигнатуру метода
        method_signature = self._extract_method_signature(method)
        code.append(f"    @Override")
        code.append(f"    public {method_signature} {{")
        
        # Проверяем предусловия
        for precondition in method.preconditions:
            code.append(f"        // Проверка предусловия: {precondition}")
            
            # Генерируем код проверки предусловия
            check_code = self._generate_precondition_check(precondition, method)
            if check_code:
                code.append(f"        {check_code}")
        
        # Устанавливаем флаг выполнения операции
        code.append("        // Устанавливаем флаг выполнения операции")
        code.append("        this.operationPerformed = true;")
        code.append("")
        
        # Генерируем возвращаемое значение
        return_type = self._extract_return_type(method)
        if return_type != "void":
            code.append("        // Возвращаем результат, удовлетворяющий постусловиям")
            
            # Генерируем код возвращаемого значения
            return_code = self._generate_return_value(return_type, method.postconditions)
            code.append(f"        return {return_code};")
        
        code.append("    }")
        code.append("")
        
        return code
    
    def _extract_method_signature(self, method: ContractElement) -> str:
        """
        Извлекает сигнатуру метода из элемента контракта.
        
        Args:
            method: Элемент контракта, представляющий метод
            
        Returns:
            Сигнатура метода
        """
        # Ищем метод в коде интерфейса
        for element in self.contract.elements:
            for child in element.children:
                if child.name == method.name:
                    # Находим сигнатуру метода в коде интерфейса
                    interface_code = self._find_interface_code()
                    if interface_code:
                        method_pattern = rf"{method.name}\s*\((.*?)\)(?:\s+throws\s+(.*?))?(?:\s*;|\s*\{{)"
                        method_match = re.search(method_pattern, interface_code, re.DOTALL)
                        if method_match:
                            params = method_match.group(1)
                            exceptions = method_match.group(2) if method_match.group(2) else ""
                            
                            # Определяем возвращаемый тип
                            return_type_pattern = rf"(?:public|protected|private)?\s+(?:static\s+)?(?:final\s+)?([\w<>[\],\s]+)\s+{method.name}\s*\("
                            return_type_match = re.search(return_type_pattern, interface_code, re.DOTALL)
                            return_type = return_type_match.group(1).strip() if return_type_match else "void"
                            
                            # Формируем сигнатуру метода
                            signature = f"{return_type} {method.name}({params})"
                            if exceptions:
                                signature += f" throws {exceptions}"
                            
                            return signature
        
        # Если не удалось найти сигнатуру, генерируем ее на основе информации о методе
        params = ", ".join([f"{param['type']} {param['name']}" for param in method.parameters])
        return_type = method.return_type or "void"
        
        signature = f"{return_type} {method.name}({params})"
        
        # Добавляем исключения
        if method.exceptions:
            exceptions = ", ".join([exception['type'] for exception in method.exceptions])
            signature += f" throws {exceptions}"
        
        return signature
    
    def _find_interface_code(self) -> Optional[str]:
        """
        Находит код интерфейса в контракте.
        
        Returns:
            Код интерфейса или None, если не найден
        """
        with open(self.contract.path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        interface_match = re.search(r'## Интерфейс\n```java\n(.*?)```', content, re.DOTALL)
        if interface_match:
            return interface_match.group(1)
        
        return None
    
    def _extract_return_type(self, method: ContractElement) -> str:
        """
        Извлекает тип возвращаемого значения метода.
        
        Args:
            method: Элемент контракта, представляющий метод
            
        Returns:
            Тип возвращаемого значения
        """
        # Ищем метод в коде интерфейса
        interface_code = self._find_interface_code()
        if interface_code:
            return_type_pattern = rf"(?:public|protected|private)?\s+(?:static\s+)?(?:final\s+)?([\w<>[\],\s]+)\s+{method.name}\s*\("
            return_type_match = re.search(return_type_pattern, interface_code, re.DOTALL)
            if return_type_match:
                return return_type_match.group(1).strip()
        
        return method.return_type or "void"
    
    def _generate_precondition_check(self, precondition: str, method: ContractElement) -> Optional[str]:
        """
        Генерирует код проверки предусловия.
        
        Args:
            precondition: Предусловие
            method: Элемент контракта, представляющий метод
            
        Returns:
            Код проверки предусловия или None, если не удалось сгенерировать
        """
        # Ищем параметры в предусловии
        param_names = [param['name'] for param in method.parameters]
        
        for param_name in param_names:
            if param_name in precondition:
                # Проверка на null
                if "!= null" in precondition:
                    return f"if ({param_name} == null) throw new IllegalArgumentException(\"{param_name} cannot be null\");"
                
                # Проверка на существование файла
                if ".exists()" in precondition:
                    return f"if (!{param_name}.exists()) throw new IllegalArgumentException(\"{param_name} must exist\");"
                
                # Проверка на возможность чтения файла
                if ".canRead()" in precondition:
                    return f"if (!{param_name}.canRead()) throw new IllegalArgumentException(\"{param_name} must be readable\");"
                
                # Проверка на директорию
                if ".isDirectory()" in precondition:
                    return f"if (!{param_name}.isDirectory()) throw new IllegalArgumentException(\"{param_name} must be a directory\");"
                
                # Проверка на возможность записи в директорию
                if ".canWrite()" in precondition:
                    return f"if (!{param_name}.canWrite()) throw new IllegalArgumentException(\"{param_name} must be writable\");"
        
        # Проверка на выполнение предыдущей операции
        if "была выполнена" in precondition:
            return f"if (!this.operationPerformed) throw new IllegalStateException(\"Operation must be performed before calling this method\");"
        
        return None
    
    def _generate_return_value(self, return_type: str, postconditions: List[str]) -> str:
        """
        Генерирует код возвращаемого значения.
        
        Args:
            return_type: Тип возвращаемого значения
            postconditions: Список постусловий
            
        Returns:
            Код возвращаемого значения
        """
        # Генерируем значение в зависимости от типа
        if return_type == "Stream<JSONObject>":
            return "Stream.empty()"
        elif return_type == "File":
            return "new File(\"mock.json\")"
        elif return_type == "DeduplicationStats" or return_type == "ConversionMetadata" or return_type == "LoadResult" or return_type == "LoadMetadata" or return_type == "AnalysisReport" or return_type == "AnalysisMetadata":
            return f"new {return_type}()"
        elif return_type == "boolean":
            return "true"
        elif return_type == "int":
            return "0"
        elif return_type == "long":
            return "0L"
        elif return_type == "double":
            return "0.0"
        elif return_type == "String":
            return "\"mock\""
        elif return_type == "List<String>":
            return "java.util.Collections.emptyList()"
        elif return_type == "Map<String, Object>":
            return "java.util.Collections.emptyMap()"
        else:
            return "null"


def generate_mock_implementation(contract_path: str, output_dir: str) -> str:
    """
    Генерирует mock-реализацию контракта.
    
    Args:
        contract_path: Путь к файлу контракта
        output_dir: Директория для сохранения реализации
        
    Returns:
        Путь к сгенерированной реализации
    """
    # Парсим контракт
    contract = parse_markdown_contract(contract_path)
    
    # Генерируем реализацию
    generator = MockGenerator(contract)
    implementation = generator.generate_java_implementation()
    
    # Определяем имя файла
    contract_name = os.path.basename(contract_path).replace('.md', '')
    output_path = os.path.join(output_dir, f"Mock{contract_name}.java")
    
    # Сохраняем реализацию
    os.makedirs(output_dir, exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(implementation)
    
    return output_path


if __name__ == "__main__":
    # Пример использования
    contract_path = "D:/Dev/CATMEPIM/contracts/interfaces/deduplicator/contract.md"
    output_dir = "D:/Dev/CATMEPIM/contracts/tests/java/deduplicator/mock"
    
    output_path = generate_mock_implementation(contract_path, output_dir)
    print(f"Mock-реализация сгенерирована: {output_path}")
