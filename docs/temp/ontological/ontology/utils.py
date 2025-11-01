#!/usr/bin/env python3
"""
Утилиты для работы с проектной онтологией тестирования контрактов.
"""

import json
import os
import uuid
import glob
from datetime import datetime
from pathlib import Path

# Пути к файлам онтологии
ONTOLOGY_DIR = Path(__file__).parent
CONTRACTS_FILE = ONTOLOGY_DIR / "contracts.json"
ENTITIES_FILE = ONTOLOGY_DIR / "ontological_entities.json"
RELATIONSHIPS_FILE = ONTOLOGY_DIR / "relationships.json"
HISTORY_FILE = ONTOLOGY_DIR / "history.json"
TEST_RESULTS_DIR = ONTOLOGY_DIR / "test_results"


def load_json(file_path):
    """Загружает JSON-файл."""
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)


def save_json(file_path, data):
    """Сохраняет данные в JSON-файл."""
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def find_contract_by_id(contract_id):
    """Находит контракт по ID."""
    contracts = load_json(CONTRACTS_FILE)
    for contract in contracts["contracts"]:
        if contract["id"] == contract_id:
            return contract
    return None


def update_contract(contract):
    """Обновляет информацию о контракте."""
    contracts = load_json(CONTRACTS_FILE)
    for i, c in enumerate(contracts["contracts"]):
        if c["id"] == contract["id"]:
            contracts["contracts"][i] = contract
            break
    save_json(CONTRACTS_FILE, contracts)


def generate_test_id():
    """Генерирует уникальный ID для теста."""
    return f"test-{uuid.uuid4().hex[:8]}"


def save_test_results(contract_id, test_level, results):
    """Сохраняет результаты теста в онтологию."""
    # Генерируем ID теста
    test_id = generate_test_id()
    
    # Создаем директорию для результатов, если она не существует
    level_dir = TEST_RESULTS_DIR / f"level{test_level}"
    level_dir.mkdir(parents=True, exist_ok=True)
    
    # Добавляем метаданные к результатам
    results["id"] = test_id
    results["contract_id"] = contract_id
    results["test_level"] = test_level
    results["test_date"] = datetime.now().isoformat()
    
    # Сохраняем результаты в файл
    test_file = level_dir / f"{test_id}.json"
    save_json(test_file, results)
    
    # Обновляем информацию о контракте
    contract = find_contract_by_id(contract_id)
    if contract:
        contract["test_results"].append(test_id)
        update_contract(contract)
    
    # Обновляем историю
    add_history_entry({
        "type": "test_execution",
        "contract_id": contract_id,
        "description": f"Выполнение онтологического теста уровня {test_level}",
        "test_id": test_id
    })
    
    return test_id


def add_history_entry(entry):
    """Добавляет запись в историю."""
    history = load_json(HISTORY_FILE)
    
    # Добавляем метаданные к записи
    entry["id"] = f"change-{len(history['changes']) + 1:03d}"
    entry["date"] = datetime.now().isoformat()
    
    # Добавляем запись в историю
    history["changes"].append(entry)
    save_json(HISTORY_FILE, history)
    
    return entry["id"]


def update_ontological_entities(test_results):
    """Обновляет онтологические сущности на основе результатов теста."""
    entities = load_json(ENTITIES_FILE)
    
    # Обрабатываем проблемы
    for problem in test_results.get("diagnostic_map", []):
        problem_id = problem.get("problem_id")
        if problem_id:
            # Проверяем, существует ли уже такая проблема
            existing_problem = next((p for p in entities["problems"] if p["id"] == problem_id), None)
            if existing_problem:
                # Обновляем статус проблемы
                existing_problem["status"] = "confirmed"
            else:
                # Добавляем новую проблему
                entities["problems"].append({
                    "id": problem_id,
                    "description": problem.get("description", ""),
                    "first_detected": test_results["id"],
                    "status": "confirmed",
                    "contract_id": test_results["contract_id"],
                    "ontological_axis": problem.get("ontological_location", "")
                })
    
    # Обрабатываем рекомендации
    for recommendation in test_results.get("recommendations", []):
        recommendation_id = recommendation.get("id")
        if recommendation_id:
            # Проверяем, существует ли уже такая рекомендация
            existing_recommendation = next((r for r in entities["recommendations"] if r["id"] == recommendation_id), None)
            if not existing_recommendation:
                # Добавляем новую рекомендацию
                entities["recommendations"].append({
                    "id": recommendation_id,
                    "description": recommendation.get("description", ""),
                    "for_problems": recommendation.get("for_problems", []),
                    "status": "pending",
                    "contract_id": test_results["contract_id"]
                })
    
    save_json(ENTITIES_FILE, entities)


def update_relationships(contract_id, test_results):
    """Обновляет связи на основе результатов теста."""
    relationships = load_json(RELATIONSHIPS_FILE)
    
    # Добавляем связи между проблемами и рекомендациями
    for problem in test_results.get("diagnostic_map", []):
        problem_id = problem.get("problem_id")
        recommendation_id = problem.get("recommendation_id")
        
        if problem_id and recommendation_id:
            # Проверяем, существует ли уже такая связь
            existing_relationship = next((r for r in relationships["ontological_relationships"] 
                                         if r["source_id"] == problem_id and r["target_id"] == recommendation_id), None)
            if not existing_relationship:
                # Добавляем новую связь
                relationships["ontological_relationships"].append({
                    "source_id": problem_id,
                    "target_id": recommendation_id,
                    "relationship_type": "addressed_by"
                })
    
    save_json(RELATIONSHIPS_FILE, relationships)


def get_contract_problems(contract_id):
    """Получает все проблемы контракта."""
    # Получаем тесты контракта
    contract = find_contract_by_id(contract_id)
    if not contract:
        return []
    
    test_ids = contract["test_results"]
    
    # Собираем проблемы из всех тестов
    problems = []
    for test_id in test_ids:
        # Ищем файл теста
        test_files = list(TEST_RESULTS_DIR.glob(f"*/{test_id}.json"))
        if not test_files:
            continue
        
        test = load_json(test_files[0])
        for problem in test.get("diagnostic_map", []):
            problems.append(problem)
    
    return problems


def track_problem_evolution(problem_id):
    """Отслеживает эволюцию проблемы."""
    # Находим все тесты, в которых упоминается проблема
    tests = []
    for test_file in TEST_RESULTS_DIR.glob("**/*.json"):
        test = load_json(test_file)
        if any(p.get("problem_id") == problem_id for p in test.get("diagnostic_map", [])):
            tests.append(test)
    
    # Сортируем тесты по дате
    tests.sort(key=lambda t: t.get("test_date", ""))
    
    return tests


def analyze_contract_dependencies(contract_id):
    """Анализирует зависимости контракта."""
    relationships = load_json(RELATIONSHIPS_FILE)
    
    # Находим прямые зависимости
    direct_deps = []
    for rel in relationships.get("contract_contract", []):
        if rel["source_contract_id"] == contract_id:
            direct_deps.append({
                "contract_id": rel["target_contract_id"],
                "relationship_type": rel["relationship_type"]
            })
    
    # Находим обратные зависимости
    reverse_deps = []
    for rel in relationships.get("contract_contract", []):
        if rel["target_contract_id"] == contract_id:
            reverse_deps.append({
                "contract_id": rel["source_contract_id"],
                "relationship_type": rel["relationship_type"]
            })
    
    return {"direct": direct_deps, "reverse": reverse_deps}


def generate_graph_data():
    """Генерирует данные для визуализации графа."""
    contracts = load_json(CONTRACTS_FILE)
    entities = load_json(ENTITIES_FILE)
    relationships = load_json(RELATIONSHIPS_FILE)
    
    nodes = []
    edges = []
    
    # Добавляем контракты как узлы
    for contract in contracts["contracts"]:
        nodes.append({
            "id": contract["id"],
            "label": contract["name"],
            "type": "contract"
        })
    
    # Добавляем элементы как узлы
    for element in entities["elements"]:
        nodes.append({
            "id": element["id"],
            "label": element["name"],
            "type": "element"
        })
    
    # Добавляем проблемы как узлы
    for problem in entities["problems"]:
        nodes.append({
            "id": problem["id"],
            "label": problem["description"][:30] + "..." if len(problem["description"]) > 30 else problem["description"],
            "type": "problem"
        })
    
    # Добавляем рекомендации как узлы
    for recommendation in entities["recommendations"]:
        nodes.append({
            "id": recommendation["id"],
            "label": recommendation["description"][:30] + "..." if len(recommendation["description"]) > 30 else recommendation["description"],
            "type": "recommendation"
        })
    
    # Добавляем связи между контрактами
    for rel in relationships.get("contract_contract", []):
        edges.append({
            "source": rel["source_contract_id"],
            "target": rel["target_contract_id"],
            "label": rel["relationship_type"]
        })
    
    # Добавляем связи между элементами и контрактами
    for rel in relationships.get("element_contract", []):
        edges.append({
            "source": rel["element_id"],
            "target": rel["contract_id"],
            "label": rel["relationship_type"]
        })
    
    # Добавляем связи между элементами
    for rel in relationships.get("element_element", []):
        edges.append({
            "source": rel["source_element_id"],
            "target": rel["target_element_id"],
            "label": rel["relationship_type"]
        })
    
    # Добавляем онтологические связи
    for rel in relationships.get("ontological_relationships", []):
        edges.append({
            "source": rel["source_id"],
            "target": rel["target_id"],
            "label": rel["relationship_type"]
        })
    
    return {"nodes": nodes, "edges": edges}


def export_graph_to_json(output_file="graph.json"):
    """Экспортирует граф в JSON-файл для визуализации."""
    graph_data = generate_graph_data()
    save_json(ONTOLOGY_DIR / output_file, graph_data)
    return ONTOLOGY_DIR / output_file


def create_symlinks():
    """Создает символические ссылки для удобной навигации."""
    contracts = load_json(CONTRACTS_FILE)
    symlinks_dir = ONTOLOGY_DIR / "symlinks"
    
    # Создаем директорию для символических ссылок, если она не существует
    symlinks_dir.mkdir(exist_ok=True)
    
    for contract in contracts["contracts"]:
        contract_id = contract["id"]
        contract_path = Path(contract["path"]).resolve()
        
        # Создаем директорию для контракта
        contract_dir = symlinks_dir / contract_id
        contract_dir.mkdir(exist_ok=True)
        
        # Создаем символическую ссылку на контракт
        contract_link = contract_dir / "contract.md"
        if not contract_link.exists():
            try:
                contract_link.symlink_to(contract_path)
                print(f"Created symlink: {contract_link} -> {contract_path}")
            except Exception as e:
                print(f"Failed to create symlink: {e}")
        
        # Создаем символические ссылки на тесты
        for test_id in contract["test_results"]:
            # Ищем файл теста
            test_files = list(TEST_RESULTS_DIR.glob(f"*/{test_id}.json"))
            if not test_files:
                continue
            
            test_path = test_files[0]
            test_link = contract_dir / f"{test_id}.json"
            
            if not test_link.exists():
                try:
                    test_link.symlink_to(test_path)
                    print(f"Created symlink: {test_link} -> {test_path}")
                except Exception as e:
                    print(f"Failed to create symlink: {e}")


if __name__ == "__main__":
    # Создаем директории для результатов тестов, если они не существуют
    for level in range(1, 4):
        level_dir = TEST_RESULTS_DIR / f"level{level}"
        level_dir.mkdir(parents=True, exist_ok=True)
    
    # Создаем символические ссылки
    create_symlinks()
    
    # Экспортируем граф для визуализации
    graph_file = export_graph_to_json()
    print(f"Graph exported to {graph_file}")
    
    print("Ontology utilities initialized successfully.")
