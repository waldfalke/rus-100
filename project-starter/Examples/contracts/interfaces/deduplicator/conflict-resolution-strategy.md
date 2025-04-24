# Контракт: ConflictResolutionStrategy

## Метаданные
- **Версия**: 1.0.0
- **Статус**: Стабильный
- **Последнее обновление**: 2025-04-15
- **Последний редактор**: AI
- **Ветка разработки**: main

## История изменений
| Дата | Версия | Автор | Описание изменений | PR |
|------|--------|-------|-------------------|-----|
| 2025-04-15 | 1.0.0 | AI | Начальная версия | - |

## Описание
Интерфейс ConflictResolutionStrategy определяет контракт для стратегий разрешения конфликтов при объединении дубликатов в процессе дедупликации. Он предоставляет методы для выбора значений из конфликтующих полей и объединения записей.

## Интерфейс
```java
/**
 * Интерфейс для стратегий разрешения конфликтов при объединении дубликатов.
 */
public interface ConflictResolutionStrategy {
    /**
     * Разрешает конфликт между двумя значениями одного поля.
     *
     * @param field Имя поля
     * @param value1 Первое значение
     * @param value2 Второе значение
     * @param metadata Метаданные о записях (например, даты обновления)
     * @return Выбранное значение
     *
     * @pre field != null
     * @pre field.isEmpty() == false
     * @post result != null (если оба входных значения не null)
     */
    Object resolveConflict(String field, Object value1, Object value2, Map<String, Object> metadata);

    /**
     * Объединяет две записи, разрешая конфликты между полями.
     *
     * @param record1 Первая запись
     * @param record2 Вторая запись
     * @param metadata Метаданные о записях
     * @return Объединенная запись
     *
     * @pre record1 != null
     * @pre record2 != null
     * @post result != null
     * @post result содержит все поля из record1 и record2
     */
    JSONObject mergeRecords(JSONObject record1, JSONObject record2, Map<String, Object> metadata);

    /**
     * Объединяет список записей, разрешая конфликты между полями.
     *
     * @param records Список записей для объединения
     * @param metadata Метаданные о записях
     * @return Объединенная запись
     *
     * @pre records != null
     * @pre records.isEmpty() == false
     * @post result != null
     * @post result содержит все уникальные поля из всех записей в records
     */
    JSONObject mergeRecords(List<JSONObject> records, Map<String, Object> metadata);

    /**
     * Возвращает имя стратегии.
     *
     * @return Имя стратегии
     *
     * @post result != null
     * @post result.isEmpty() == false
     */
    String getName();

    /**
     * Возвращает описание стратегии.
     *
     * @return Описание стратегии
     *
     * @post result != null
     */
    String getDescription();

    /**
     * Проверяет, применима ли стратегия к указанному полю.
     *
     * @param field Имя поля
     * @param fieldType Тип поля
     * @return true, если стратегия применима, иначе false
     *
     * @pre field != null
     * @pre fieldType != null
     */
    boolean isApplicable(String field, Class<?> fieldType);
}
```

## Предусловия и постусловия

### resolveConflict(String field, Object value1, Object value2, Map<String, Object> metadata)
- **Предусловия**:
  - field != null
  - field.isEmpty() == false
- **Постусловия**:
  - result != null (если оба входных значения не null)

### mergeRecords(JSONObject record1, JSONObject record2, Map<String, Object> metadata)
- **Предусловия**:
  - record1 != null
  - record2 != null
- **Постусловия**:
  - result != null
  - result содержит все поля из record1 и record2

### mergeRecords(List<JSONObject> records, Map<String, Object> metadata)
- **Предусловия**:
  - records != null
  - records.isEmpty() == false
- **Постусловия**:
  - result != null
  - result содержит все уникальные поля из всех записей в records

### getName()
- **Предусловия**: Нет
- **Постусловия**:
  - result != null
  - result.isEmpty() == false

### getDescription()
- **Предусловия**: Нет
- **Постусловия**:
  - result != null

### isApplicable(String field, Class<?> fieldType)
- **Предусловия**:
  - field != null
  - fieldType != null
- **Постусловия**: Нет

## Инварианты
- Стратегия должна быть детерминированной: при одинаковых входных данных должен быть одинаковый результат
- Стратегия не должна терять информацию: если информация присутствует только в одной из записей, она должна быть сохранена
- Стратегия должна быть идемпотентной: повторное применение к уже объединенным записям не должно изменять результат

## Исключения
- **IllegalArgumentException**: если нарушены предусловия методов
- **UnsupportedOperationException**: если стратегия не поддерживает определенный тип поля

## Примеры использования
```java
// Пример создания и использования стратегии разрешения конфликтов
ConflictResolutionStrategy strategy = new MergeStrategy();

// Разрешение конфликта между двумя значениями
String title1 = "Война и мир";
String title2 = "Война и мир (в 4-х томах)";
Map<String, Object> metadata = Map.of("record1_date", "2023-01-01", "record2_date", "2023-02-01");
String resolvedTitle = (String) strategy.resolveConflict("title", title1, title2, metadata);
System.out.println("Resolved title: " + resolvedTitle); // Выведет "Война и мир (в 4-х томах)"

// Объединение двух записей
JSONObject book1 = new JSONObject();
book1.put("title", "Война и мир");
book1.put("author", "Лев Толстой");
book1.put("isbn", "9785171147341");

JSONObject book2 = new JSONObject();
book2.put("title", "Война и мир (в 4-х томах)");
book2.put("publisher", "Эксмо");
book2.put("year", 2018);

JSONObject mergedBook = strategy.mergeRecords(book1, book2, metadata);
System.out.println("Merged book: " + mergedBook.toString());
// Выведет запись со всеми полями, где title = "Война и мир (в 4-х томах)"

// Проверка применимости стратегии
boolean isApplicable = strategy.isApplicable("price", Double.class);
System.out.println("Is applicable to price field: " + isApplicable);
```

## Реализации
- **MergeStrategy**: стратегия, объединяющая записи с выбором наиболее полных значений
- **PreferNewerStrategy**: стратегия, предпочитающая значения из более новых записей
- **PreferOlderStrategy**: стратегия, предпочитающая значения из более старых записей
- **AverageNumericStrategy**: стратегия, вычисляющая среднее значение для числовых полей
- **ConcatenateTextStrategy**: стратегия, объединяющая текстовые поля
- **ListCombineStrategy**: стратегия, объединяющая списки (например, категории, теги)
- **CustomFieldStrategy**: стратегия, применяющая специфические правила для определенных полей

## Связанные контракты
- [Deduplicator Interface Contract](./contract.md)
- [DeduplicationConfig](./deduplication-config.md)
- [VendorConfig](../converter/vendor-config.md)
