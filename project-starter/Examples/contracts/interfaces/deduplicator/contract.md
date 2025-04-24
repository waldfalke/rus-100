# Контракт: Deduplicator Interface

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
Интерфейс Deduplicator определяет контракт для компонентов, отвечающих за выявление и удаление дубликатов в данных о товарах. Он предоставляет методы для дедупликации как потоков JSON-объектов, так и JSON-файлов.

### Критерии дедупликации
Дедупликация выполняется на основе следующих критериев:

1. **Точное совпадение по ключевым полям**:
   - ISBN (если доступен)
   - Артикул (SKU)
   - Штрихкод (Barcode)
   - Уникальный идентификатор товара (ID)

2. **Нечеткое совпадение** (используется, если точное совпадение не дало результатов):
   - Название товара (с порогом сходства, указанным в конфигурации)
   - Автор (для книг)
   - Комбинация полей (название + автор + издательство для книг)

3. **MinHash и LSH** (для масштабируемой дедупликации больших объемов данных):
   - Создание сигнатур MinHash для текстовых полей
   - Применение Locality-Sensitive Hashing для эффективного поиска кандидатов в дубликаты

### Стратегии разрешения конфликтов
При обнаружении дубликатов применяются следующие стратегии разрешения конфликтов:

1. **Стратегия MERGE (по умолчанию)**:
   - Для текстовых полей: выбирается наиболее полное значение (с наибольшей длиной)
   - Для числовых полей: выбирается наиболее свежее значение (если есть дата обновления) или среднее значение
   - Для полей с изображениями: объединяются все уникальные URL изображений
   - Для полей с категориями: объединяются все уникальные категории

2. **Стратегия REMOVE**:
   - Сохраняется только первая запись, остальные удаляются

3. **Стратегия MARK**:
   - Все записи сохраняются, но дубликаты помечаются специальным флагом

### Обработка частичных дубликатов
Частичные дубликаты (записи, которые совпадают по некоторым, но не всем критериям) обрабатываются следующим образом:

1. Для каждой пары записей вычисляется коэффициент сходства (от 0.0 до 1.0)
2. Если коэффициент сходства превышает порог, указанный в конфигурации (по умолчанию 0.8), записи считаются дубликатами
3. Применяется выбранная стратегия разрешения конфликтов

### Производительность и масштабируемость
Для обеспечения эффективной обработки больших объемов данных применяются следующие оптимизации:

1. **Блокировка** (blocking): группировка записей по определенным критериям для уменьшения количества сравнений
2. **Параллельная обработка**: использование многопоточности для ускорения процесса дедупликации
3. **Индексирование**: создание индексов для быстрого поиска по ключевым полям
4. **Потоковая обработка**: обработка данных потоками для минимизации использования памяти

## Интерфейс
```java
/**
 * Интерфейс для дедупликации данных о товарах.
 *
 * Deduplicator выявляет и обрабатывает дубликаты в данных о товарах
 * на основе настраиваемых критериев и стратегий. Он поддерживает
 * как точное, так и нечеткое сравнение, а также масштабируемые
 * алгоритмы для больших объемов данных.
 */
public interface Deduplicator {
    /**
     * Удаляет дубликаты из потока JSON-объектов.
     *
     * @param dataStream Поток JSON-объектов для дедупликации
     * @param config Конфигурация процесса дедупликации (опционально)
     * @return Поток уникальных JSON-объектов
     *
     * @pre dataStream != null
     * @post result != null
     * @post количество элементов в result <= количество элементов в dataStream
     * @post все уникальные записи из dataStream присутствуют в result
     * @post если config == null, используется конфигурация по умолчанию
     */
    Stream<JSONObject> deduplicate(Stream<JSONObject> dataStream, DeduplicationConfig config);

    /**
     * Удаляет дубликаты из JSON-файла и сохраняет результат.
     *
     * @param jsonFile JSON-файл для дедупликации
     * @param outputDir Директория для сохранения результата
     * @param config Конфигурация процесса дедупликации (опционально)
     * @return Созданный JSON-файл с уникальными записями
     * @throws IOException Если произошла ошибка при чтении или записи файла
     * @throws IllegalArgumentException Если формат файла некорректный или не соответствует схеме
     *
     * @pre jsonFile != null
     * @pre jsonFile.exists()
     * @pre jsonFile.canRead()
     * @pre outputDir != null
     * @pre outputDir.exists()
     * @pre outputDir.isDirectory()
     * @pre outputDir.canWrite()
     * @post result != null
     * @post result.exists()
     * @post если config == null, используется конфигурация по умолчанию
     */
    File deduplicateFile(File jsonFile, File outputDir, DeduplicationConfig config) throws IOException, IllegalArgumentException;

    /**
     * Возвращает статистику о последней операции дедупликации.
     *
     * @return Объект DeduplicationStats с информацией о процессе дедупликации
     *
     * @pre была выполнена хотя бы одна операция дедупликации
     * @post result != null
     */
    DeduplicationStats getStats();
}

/**
 * Класс для хранения статистики о процессе дедупликации.
 *
 * Содержит информацию о количестве обработанных записей,
 * найденных дубликатах, времени обработки и причинах
 * выявления дубликатов.
 */
public class DeduplicationStats {
    private final int totalRecords;
    private final int uniqueRecords;
    private final int duplicatesFound;
    private final long processingTimeMs;
    private final Map<String, Integer> duplicatesByReason;
    private final Map<String, Integer> duplicatesByField;
    private final Map<String, Double> similarityDistribution;
    private final int exactMatchCount;
    private final int fuzzyMatchCount;
    private final int minHashMatchCount;
    private final DeduplicationConfig usedConfig;

    // Геттеры и конструктор
}
```

## Предусловия и постусловия

### deduplicate(Stream<JSONObject> dataStream, DeduplicationConfig config)
- **Предусловия**:
  - dataStream != null
- **Постусловия**:
  - result != null
  - количество элементов в result <= количество элементов в dataStream
  - все уникальные записи из dataStream присутствуют в result
  - если config == null, используется конфигурация по умолчанию

### deduplicateFile(File jsonFile, File outputDir, DeduplicationConfig config)
- **Предусловия**:
  - jsonFile != null
  - jsonFile.exists()
  - jsonFile.canRead()
  - outputDir != null
  - outputDir.exists()
  - outputDir.isDirectory()
  - outputDir.canWrite()
- **Постусловия**:
  - result != null
  - result.exists()
  - если config == null, используется конфигурация по умолчанию

### getStats()
- **Предусловия**:
  - была выполнена хотя бы одна операция дедупликации
- **Постусловия**:
  - result != null

## Инварианты
- После выполнения дедупликации количество уникальных записей должно быть меньше или равно исходному количеству записей
- Все уникальные записи из исходного набора данных должны присутствовать в результате
- Порядок записей в результате может отличаться от порядка в исходном наборе
- Записи, идентичные по всем ключевым полям (ISBN, SKU, ID), всегда определяются как дубликаты
- Если две записи имеют коэффициент сходства выше порога, указанного в конфигурации, они считаются дубликатами
- При объединении дубликатов не должна теряться информация, присутствующая только в одной из записей
- Процесс дедупликации должен быть идемпотентным: повторное применение к уже дедуплицированным данным не должно изменять результат

## Исключения
- **IllegalArgumentException**: если нарушены предусловия методов или формат данных некорректный
- **IOException**: если произошла ошибка при чтении или записи файла
- **IllegalStateException**: если метод getStats() вызван до выполнения операции дедупликации
- **UnsupportedOperationException**: если запрошенная операция не поддерживается конкретной реализацией
- **OutOfMemoryError**: если объем данных слишком велик для обработки в памяти (реализации должны предотвращать это путем потоковой обработки)

## Примеры использования
```java
// Пример создания конфигурации для дедупликации
DeduplicationConfig config = DeduplicationConfig.builder()
    .vendor("book24")
    .handlingStrategy(DuplicateHandlingStrategy.MERGE)
    .blockingStrategy(BlockingStrategy.ISBN)
    .similarityThreshold(0.85)
    .exactMatchFields(Arrays.asList("ISBN", "SKU"))
    .fuzzyMatchFields(Arrays.asList("title", "author"))
    .fieldWeights(Map.of(
        "title", 0.5,
        "author", 0.3,
        "publisher", 0.1,
        "publication_date", 0.1
    ))
    .enableMinHash(true)
    .numThreads(4)
    .build();

// Пример использования метода deduplicate с конфигурацией
Deduplicator deduplicator = new EnhancedDeduplicator();
Stream<JSONObject> jsonData = loadJsonData();
Stream<JSONObject> uniqueData = deduplicator.deduplicate(jsonData, config);
uniqueData.forEach(System.out::println);

// Пример использования метода deduplicate с конфигурацией по умолчанию
Stream<JSONObject> uniqueDataDefault = deduplicator.deduplicate(jsonData, null);

// Пример использования метода deduplicateFile с конфигурацией
File jsonFile = new File("input.json");
File outputDir = new File("output");
File uniqueJsonFile = deduplicator.deduplicateFile(jsonFile, outputDir, config);
System.out.println("Unique data saved to: " + uniqueJsonFile.getAbsolutePath());

// Пример получения и анализа статистики
DeduplicationStats stats = deduplicator.getStats();
System.out.println("Total records: " + stats.getTotalRecords());
System.out.println("Unique records: " + stats.getUniqueRecords());
System.out.println("Duplicates found: " + stats.getDuplicatesFound());
System.out.println("Processing time: " + stats.getProcessingTimeMs() + " ms");
System.out.println("Exact matches: " + stats.getExactMatchCount());
System.out.println("Fuzzy matches: " + stats.getFuzzyMatchCount());

// Анализ причин дубликатов
Map<String, Integer> duplicatesByReason = stats.getDuplicatesByReason();
duplicatesByReason.forEach((reason, count) ->
    System.out.println(reason + ": " + count));

// Анализ распределения коэффициентов сходства
Map<String, Double> similarityDistribution = stats.getSimilarityDistribution();
similarityDistribution.forEach((range, percentage) ->
    System.out.println(range + ": " + percentage + "%"));
```

## Реализации
- **EnhancedDeduplicator**: основная реализация, использующая многоступенчатый подход к дедупликации
- **FuzzyDeduplicator**: реализация, основанная на нечетком сравнении текстовых полей
- **MinHashDeduplicator**: реализация, использующая MinHash и LSH для масштабируемой дедупликации
- **HybridDeduplicator**: реализация, комбинирующая различные алгоритмы дедупликации в зависимости от характеристик данных
- **StreamingDeduplicator**: реализация, оптимизированная для потоковой обработки больших объемов данных с минимальным использованием памяти

## Связанные контракты
- [Deduplicator Architecture Contract](../../Deduplicator-Architecture-Contract.md)
- [JSON Schema](../../data/json-schema/input-schema.json)
- [DeduplicationConfig](./deduplication-config.md)
- [VendorConfig](../converter/vendor-config.md)
- [ConflictResolutionStrategy](./conflict-resolution-strategy.md)
