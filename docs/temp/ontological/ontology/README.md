# Проектная онтология тестирования контрактов

Эта директория содержит проектную онтологию, которая хранит результаты онтологического тестирования контрактов CATMEPIM, их изменения и структуру связей между ними. Онтология представляет собой машиночитаемую базу знаний, которая позволяет отслеживать эволюцию контрактов и результаты их анализа.

## Структура онтологии

Онтология организована в виде набора JSON-файлов, которые связаны между собой через идентификаторы:

1. **contracts.json** - основной файл, содержащий информацию о всех контрактах
2. **test_results/** - директория с результатами тестов
   - **level1/** - результаты базового анализа
   - **level2/** - результаты избирательного анализа пересечений
   - **level3/** - результаты комплексного анализа
3. **ontological_entities.json** - онтологические сущности, выявленные в ходе анализа
4. **relationships.json** - связи между контрактами и онтологическими сущностями
5. **history.json** - история изменений контрактов и результатов тестирования

## Формат данных

### contracts.json

```json
{
  "contracts": [
    {
      "id": "contract-001",
      "name": "Deduplicator",
      "path": "../../interfaces/deduplicator/contract.md",
      "version": "1.0.0",
      "status": "active",
      "last_updated": "2025-04-15",
      "related_contracts": ["contract-002", "contract-003"],
      "test_results": ["test-001", "test-002"]
    },
    // другие контракты
  ]
}
```

### test_results/level1/test-001.json

```json
{
  "id": "test-001",
  "contract_id": "contract-001",
  "test_level": 1,
  "test_date": "2025-04-15",
  "tester": "AI",
  "ontological_profile": {
    "internal_external": {
      "internal_elements": ["element-001", "element-002"],
      "external_elements": ["element-003", "element-004"],
      "analysis": "Текст анализа...",
      "problems": ["problem-001", "problem-002"],
      "recommendations": ["recommendation-001"]
    },
    // другие оси
  },
  "first_principles_compliance": {
    "single_responsibility": {
      "compliance": "partial",
      "analysis": "Текст анализа...",
      "recommendations": ["recommendation-002"]
    },
    // другие принципы
  },
  "socratic_dialogue": [
    {
      "question": "Текст вопроса...",
      "answer": "Текст ответа..."
    },
    // другие вопросы и ответы
  ],
  "diagnostic_map": [
    {
      "problem_id": "problem-001",
      "ontological_location": "internal_external",
      "criticality": "high",
      "recommendation_id": "recommendation-001"
    },
    // другие проблемы
  ],
  "summary": "Общее заключение..."
}
```

### ontological_entities.json

```json
{
  "elements": [
    {
      "id": "element-001",
      "name": "deduplicate",
      "type": "method",
      "description": "Метод для дедупликации данных"
    },
    // другие элементы
  ],
  "problems": [
    {
      "id": "problem-001",
      "description": "Отсутствие явного определения критериев дедупликации",
      "first_detected": "test-001",
      "status": "open"
    },
    // другие проблемы
  ],
  "recommendations": [
    {
      "id": "recommendation-001",
      "description": "Добавить явное определение критериев дедупликации",
      "for_problems": ["problem-001"],
      "status": "pending"
    },
    // другие рекомендации
  ]
}
```

### relationships.json

```json
{
  "element_contract": [
    {
      "element_id": "element-001",
      "contract_id": "contract-001",
      "relationship_type": "defined_in"
    },
    // другие связи
  ],
  "element_element": [
    {
      "source_element_id": "element-001",
      "target_element_id": "element-002",
      "relationship_type": "uses"
    },
    // другие связи
  ],
  "contract_contract": [
    {
      "source_contract_id": "contract-001",
      "target_contract_id": "contract-002",
      "relationship_type": "depends_on"
    },
    // другие связи
  ]
}
```

### history.json

```json
{
  "changes": [
    {
      "id": "change-001",
      "date": "2025-04-15",
      "type": "contract_update",
      "contract_id": "contract-001",
      "description": "Обновление контракта Deduplicator",
      "before_test": "test-001",
      "after_test": "test-003"
    },
    // другие изменения
  ]
}
```

## Использование онтологии

### Запросы к онтологии

Онтология может быть использована для различных запросов:

1. **Получение всех проблем контракта**:
   ```python
   def get_contract_problems(contract_id):
       # Получаем тесты контракта
       contract = find_contract_by_id(contract_id)
       test_ids = contract["test_results"]
       
       # Собираем проблемы из всех тестов
       problems = []
       for test_id in test_ids:
           test = load_test(test_id)
           for problem in test["diagnostic_map"]:
               problems.append(problem)
       
       return problems
   ```

2. **Отслеживание эволюции проблемы**:
   ```python
   def track_problem_evolution(problem_id):
       # Находим все тесты, в которых упоминается проблема
       tests = []
       for test_file in glob.glob("test_results/**/*.json"):
           test = load_json(test_file)
           if any(p["problem_id"] == problem_id for p in test["diagnostic_map"]):
               tests.append(test)
       
       # Сортируем тесты по дате
       tests.sort(key=lambda t: t["test_date"])
       
       return tests
   ```

3. **Анализ связей между контрактами**:
   ```python
   def analyze_contract_dependencies(contract_id):
       # Находим прямые зависимости
       direct_deps = []
       for rel in relationships["contract_contract"]:
           if rel["source_contract_id"] == contract_id:
               direct_deps.append(rel["target_contract_id"])
       
       # Находим обратные зависимости
       reverse_deps = []
       for rel in relationships["contract_contract"]:
           if rel["target_contract_id"] == contract_id:
               reverse_deps.append(rel["source_contract_id"])
       
       return {"direct": direct_deps, "reverse": reverse_deps}
   ```

### Интеграция с тестированием

Результаты каждого онтологического теста автоматически сохраняются в онтологию:

```python
def save_test_results(contract_id, test_level, results):
    # Генерируем ID теста
    test_id = f"test-{uuid.uuid4()}"
    
    # Сохраняем результаты в соответствующий файл
    test_file = f"test_results/level{test_level}/{test_id}.json"
    with open(test_file, "w") as f:
        json.dump(results, f, indent=2)
    
    # Обновляем информацию о контракте
    contract = find_contract_by_id(contract_id)
    contract["test_results"].append(test_id)
    update_contract(contract)
    
    # Обновляем онтологические сущности
    update_ontological_entities(results)
    
    # Обновляем связи
    update_relationships(contract_id, results)
    
    return test_id
```

## Кросс-линковка с файловой системой

Для удобства навигации между файлами онтологии и фактическими контрактами используются символические ссылки:

```bash
# Создание символических ссылок от контрактов к их тестам
for contract in $(jq -r '.contracts[].id' contracts.json); do
    contract_path=$(jq -r ".contracts[] | select(.id == \"$contract\") | .path" contracts.json)
    mkdir -p "symlinks/$contract"
    ln -s "../../$contract_path" "symlinks/$contract/contract.md"
    
    # Ссылки на тесты
    test_ids=$(jq -r ".contracts[] | select(.id == \"$contract\") | .test_results[]" contracts.json)
    for test_id in $test_ids; do
        test_level=$(jq -r ".test_level" "test_results/level*/$test_id.json")
        ln -s "../../../test_results/level$test_level/$test_id.json" "symlinks/$contract/$test_id.json"
    done
done
```

## Визуализация (опционально)

Хотя визуализация не является приоритетом, онтология может быть легко преобразована в формат графа для визуализации с помощью инструментов, таких как Graphviz или D3.js:

```python
def generate_graph_data():
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
    for element in ontological_entities["elements"]:
        nodes.append({
            "id": element["id"],
            "label": element["name"],
            "type": "element"
        })
    
    # Добавляем связи между контрактами
    for rel in relationships["contract_contract"]:
        edges.append({
            "source": rel["source_contract_id"],
            "target": rel["target_contract_id"],
            "label": rel["relationship_type"]
        })
    
    # Добавляем связи между элементами и контрактами
    for rel in relationships["element_contract"]:
        edges.append({
            "source": rel["element_id"],
            "target": rel["contract_id"],
            "label": rel["relationship_type"]
        })
    
    return {"nodes": nodes, "edges": edges}
```

## Заключение

Проектная онтология предоставляет мощный инструмент для хранения, анализа и использования результатов онтологического тестирования контрактов. Она позволяет:

1. Сохранять результаты всех тестов в структурированном виде
2. Отслеживать эволюцию контрактов и проблем
3. Анализировать связи между контрактами и их элементами
4. Накапливать знания о системе и ее концептуальной структуре

Эта онтология становится ценным активом проекта, сохраняя знания, которые в противном случае могли бы быть утеряны.
