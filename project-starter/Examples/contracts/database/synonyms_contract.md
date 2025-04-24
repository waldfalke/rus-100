# Контракт синонимов (Synonyms Contract)

## Метаданные
- **Версия**: 1.0.0
- **Статус**: Планируемый
- **Последнее обновление**: 2025-04-21
- **Последний редактор**: AI
- **Ветка разработки**: main

## История изменений
| Дата | Версия | Автор | Описание изменений | PR |
|------|--------|-------|-------------------|-----|
| 2025-04-21 | 1.0.0 | AI | Начальная версия | - |

## Описание
Данный контракт определяет структуру и механизмы работы с синонимами в системе CATMEPIM. Синонимы используются для улучшения поиска, классификации и сопоставления данных, позволяя связывать различные термины, имеющие одинаковое или близкое значение.

## Схема данных

### Основная таблица синонимов

```sql
CREATE TABLE synonyms (
    id SERIAL PRIMARY KEY,
    term TEXT NOT NULL,
    canonical_term TEXT NOT NULL,
    domain VARCHAR(50) NOT NULL,
    confidence FLOAT DEFAULT 1.0,
    source VARCHAR(100),
    locale VARCHAR(10) DEFAULT 'ru_RU',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id)
);

-- Индексы для ускорения поиска
CREATE INDEX idx_synonyms_term ON synonyms(term);
CREATE INDEX idx_synonyms_canonical_term ON synonyms(canonical_term);
CREATE INDEX idx_synonyms_domain ON synonyms(domain);
CREATE INDEX idx_synonyms_locale ON synonyms(locale);
```

### Группы синонимов

```sql
CREATE TABLE synonym_groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    domain VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id)
);

CREATE TABLE synonym_group_members (
    synonym_id INTEGER REFERENCES synonyms(id),
    group_id INTEGER REFERENCES synonym_groups(id),
    PRIMARY KEY (synonym_id, group_id)
);
```

## Домены синонимов

Система поддерживает следующие домены синонимов:

1. **author** - синонимы для имен авторов (например, "Л.Н. Толстой" и "Лев Толстой")
2. **publisher** - синонимы для названий издательств (например, "АСТ" и "Издательство АСТ")
3. **genre** - синонимы для жанров литературы (например, "фантастика" и "sci-fi")
4. **subject** - синонимы для предметных областей
5. **title** - синонимы для названий книг (например, "Война и мир" и "War and Peace")
6. **series** - синонимы для названий серий
7. **attribute** - синонимы для атрибутов товаров (например, "твердый переплет" и "hardcover")
8. **general** - общие синонимы, не привязанные к конкретному домену

## Интерфейс

```java
package com.catmepim.synonyms;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Сервис для работы с синонимами
 */
public interface SynonymService {
    
    /**
     * Добавить новый синоним
     * 
     * @param term Термин, для которого создается синоним
     * @param canonicalTerm Канонический термин (основная форма)
     * @param domain Домен синонима
     * @param confidence Уровень уверенности (от 0.0 до 1.0)
     * @param locale Локаль
     * @return ID созданного синонима
     */
    Long addSynonym(String term, String canonicalTerm, String domain, 
                   Double confidence, String locale);
    
    /**
     * Получить канонический термин для заданного термина
     * 
     * @param term Исходный термин
     * @param domain Домен поиска
     * @param locale Локаль
     * @return Канонический термин или Optional.empty(), если синоним не найден
     */
    Optional<String> getCanonicalTerm(String term, String domain, String locale);
    
    /**
     * Найти все синонимы для канонического термина
     * 
     * @param canonicalTerm Канонический термин
     * @param domain Домен поиска
     * @param locale Локаль
     * @return Список синонимов
     */
    List<String> findSynonyms(String canonicalTerm, String domain, String locale);
    
    /**
     * Создать группу синонимов
     * 
     * @param name Название группы
     * @param description Описание группы
     * @param domain Домен
     * @param terms Список терминов для включения в группу
     * @return ID созданной группы
     */
    Long createSynonymGroup(String name, String description, String domain, List<String> terms);
    
    /**
     * Добавить термины в существующую группу синонимов
     * 
     * @param groupId ID группы
     * @param terms Список терминов для добавления
     */
    void addTermsToGroup(Long groupId, List<String> terms);
    
    /**
     * Удалить синоним
     * 
     * @param synonymId ID синонима
     * @return true, если синоним успешно удален
     */
    boolean deleteSynonym(Long synonymId);
    
    /**
     * Импортировать синонимы из файла
     * 
     * @param filePath Путь к файлу
     * @param domain Домен для импортируемых синонимов
     * @param locale Локаль для импортируемых синонимов
     * @return Количество импортированных синонимов
     */
    int importSynonyms(String filePath, String domain, String locale);
    
    /**
     * Экспортировать синонимы в файл
     * 
     * @param filePath Путь к файлу для экспорта
     * @param domain Домен для экспорта (null - все домены)
     * @param locale Локаль для экспорта (null - все локали)
     * @return Количество экспортированных синонимов
     */
    int exportSynonyms(String filePath, String domain, String locale);
    
    /**
     * Поиск с учетом синонимов
     * 
     * @param query Поисковый запрос
     * @param domains Домены для учета синонимов
     * @param locale Локаль
     * @return Расширенный поисковый запрос с учетом синонимов
     */
    String expandSearchQuery(String query, List<String> domains, String locale);
}
```

## Форматы импорта/экспорта

### CSV формат
```csv
term;canonical_term;domain;confidence;locale
Толстой Л.Н.;Лев Толстой;author;1.0;ru_RU
Лев Николаевич Толстой;Лев Толстой;author;1.0;ru_RU
Leo Tolstoy;Лев Толстой;author;1.0;en_US
Букварь;Азбука;title;0.8;ru_RU
```

### JSON формат
```json
{
  "domain": "author",
  "locale": "ru_RU",
  "synonyms": [
    {
      "term": "Толстой Л.Н.",
      "canonical_term": "Лев Толстой",
      "confidence": 1.0
    },
    {
      "term": "Лев Николаевич Толстой",
      "canonical_term": "Лев Толстой",
      "confidence": 1.0
    }
  ]
}
```

## Алгоритмы и методы поиска синонимов

### 1. Точное соответствие
Прямой поиск синонимов по точному соответствию термина.

### 2. Нечеткое соответствие
Поиск с использованием алгоритмов нечеткого сопоставления (Левенштейн, Джаро-Винклер) для обнаружения близких по написанию терминов.

### 3. Автоматическое извлечение
Методы извлечения потенциальных синонимов:
- Статистический анализ совместной встречаемости терминов
- Векторное представление слов (word embeddings)
- Анализ шаблонов в текстах (например, "также известный как", "или")

## Примеры использования

### Пример 1: Добавление синонимов и поиск канонической формы

```java
// Инициализация сервиса
SynonymService synonymService = new DefaultSynonymService();

// Добавление синонимов для автора
Long synonymId1 = synonymService.addSynonym("Толстой Л.Н.", "Лев Толстой", "author", 1.0, "ru_RU");
Long synonymId2 = synonymService.addSynonym("Лев Николаевич Толстой", "Лев Толстой", "author", 1.0, "ru_RU");
Long synonymId3 = synonymService.addSynonym("Leo Tolstoy", "Лев Толстой", "author", 1.0, "en_US");

// Получение канонической формы
String userInput = "Толстой Л.Н.";
Optional<String> canonicalForm = synonymService.getCanonicalTerm(userInput, "author", "ru_RU");

canonicalForm.ifPresent(term -> {
    System.out.println("Канонический термин для '" + userInput + "': " + term);
    // Выведет: Канонический термин для 'Толстой Л.Н.': Лев Толстой
});

// Получение всех синонимов
List<String> allSynonyms = synonymService.findSynonyms("Лев Толстой", "author", "ru_RU");
System.out.println("Синонимы для 'Лев Толстой': " + String.join(", ", allSynonyms));
// Выведет: Синонимы для 'Лев Толстой': Толстой Л.Н., Лев Николаевич Толстой
```

### Пример 2: Создание группы синонимов

```java
// Создание группы синонимов для издательства АСТ
List<String> astPublisherVariants = Arrays.asList(
    "АСТ", 
    "Издательство АСТ", 
    "ООО \"Издательство АСТ\"", 
    "AST Publishers"
);

Long groupId = synonymService.createSynonymGroup(
    "АСТ издательство", 
    "Варианты названия издательства АСТ", 
    "publisher", 
    astPublisherVariants
);

// Позже добавить еще один вариант
synonymService.addTermsToGroup(groupId, Arrays.asList("АСТ-Пресс"));
```

### Пример 3: Расширение поискового запроса

```java
String userQuery = "Толстой война";
String expandedQuery = synonymService.expandSearchQuery(
    userQuery, 
    Arrays.asList("author", "title"), 
    "ru_RU"
);

System.out.println("Исходный запрос: " + userQuery);
System.out.println("Расширенный запрос: " + expandedQuery);
// Выведет примерно:
// Исходный запрос: Толстой война
// Расширенный запрос: (Толстой OR "Лев Толстой" OR "Толстой Л.Н." OR "Лев Николаевич Толстой") AND (война OR "Война и мир")
```

## Инварианты и гарантии

1. **Консистентность данных**:
   - Один термин может быть синонимом к разным каноническим терминам в разных доменах
   - В рамках одного домена и локали термин может быть синонимом только к одному каноническому термину

2. **Производительность**:
   - Поиск канонического термина должен выполняться за O(1) время
   - Поиск всех синонимов для канонического термина должен выполняться за O(log n) время

3. **Сохранность**:
   - При удалении канонического термина все связанные с ним синонимы должны быть также удалены или переназначены

## Взаимодействие с другими системами

1. **Интеграция с поисковой системой**:
   - Автоматическое расширение поисковых запросов с учетом синонимов
   - Повышение релевантности результатов поиска

2. **Интеграция с системой импорта данных**:
   - Нормализация терминов при импорте данных
   - Автоматическое сопоставление вариантов написания

3. **Интеграция с системой рекомендаций**:
   - Использование синонимов для улучшения рекомендаций

## Связанные контракты

- [Полнотекстовый поиск (Full-text Search Contract)](../search/full_text_search_contract.md)
- [Сопоставление продуктов (Product Matching Contract)](../matching/product_matching_contract.md)
- [Контракт нормализации данных (Data Normalization Contract)](../data/data_normalization_contract.md) 