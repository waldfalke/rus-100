# Контракт: DataEnricher

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
Интерфейс DataEnricher определяет контракт для компонентов, отвечающих за обогащение данных о товарах дополнительной информацией. Он предоставляет методы для обогащения отдельных JSON-объектов, потоков JSON-объектов и JSON-файлов.

## Интерфейс
```java
/**
 * Интерфейс для обогащения данных о товарах дополнительной информацией.
 */
public interface DataEnricher {
    /**
     * Обогащает JSON-объект дополнительной информацией.
     *
     * @param jsonObject JSON-объект для обогащения
     * @return Обогащенный JSON-объект
     *
     * @pre jsonObject != null
     * @post result != null
     */
    JSONObject enrich(JSONObject jsonObject);

    /**
     * Обогащает JSON-объект дополнительной информацией с использованием указанных источников.
     *
     * @param jsonObject JSON-объект для обогащения
     * @param sources Список источников данных для обогащения
     * @return Обогащенный JSON-объект
     *
     * @pre jsonObject != null
     * @pre sources != null
     * @post result != null
     */
    JSONObject enrich(JSONObject jsonObject, List<EnrichmentSource> sources);

    /**
     * Обогащает поток JSON-объектов дополнительной информацией.
     *
     * @param jsonStream Поток JSON-объектов для обогащения
     * @return Поток обогащенных JSON-объектов
     *
     * @pre jsonStream != null
     * @post result != null
     */
    Stream<JSONObject> enrichStream(Stream<JSONObject> jsonStream);

    /**
     * Обогащает поток JSON-объектов дополнительной информацией с использованием указанных источников.
     *
     * @param jsonStream Поток JSON-объектов для обогащения
     * @param sources Список источников данных для обогащения
     * @return Поток обогащенных JSON-объектов
     *
     * @pre jsonStream != null
     * @pre sources != null
     * @post result != null
     */
    Stream<JSONObject> enrichStream(Stream<JSONObject> jsonStream, List<EnrichmentSource> sources);

    /**
     * Обогащает JSON-файл дополнительной информацией.
     *
     * @param jsonFile JSON-файл для обогащения
     * @param outputDir Директория для сохранения результата
     * @return Созданный JSON-файл с обогащенными данными
     * @throws IOException Если произошла ошибка при чтении или записи файла
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
     */
    File enrichFile(File jsonFile, File outputDir) throws IOException;

    /**
     * Обогащает JSON-файл дополнительной информацией с использованием указанных источников.
     *
     * @param jsonFile JSON-файл для обогащения
     * @param outputDir Директория для сохранения результата
     * @param sources Список источников данных для обогащения
     * @return Созданный JSON-файл с обогащенными данными
     * @throws IOException Если произошла ошибка при чтении или записи файла
     *
     * @pre jsonFile != null
     * @pre jsonFile.exists()
     * @pre jsonFile.canRead()
     * @pre outputDir != null
     * @pre outputDir.exists()
     * @pre outputDir.isDirectory()
     * @pre outputDir.canWrite()
     * @pre sources != null
     * @post result != null
     * @post result.exists()
     */
    File enrichFile(File jsonFile, File outputDir, List<EnrichmentSource> sources) throws IOException;

    /**
     * Возвращает список доступных источников данных для обогащения.
     *
     * @return Список источников данных
     *
     * @post result != null
     */
    List<EnrichmentSource> getAvailableSources();

    /**
     * Возвращает источник данных по имени.
     *
     * @param sourceName Имя источника данных
     * @return Источник данных
     * @throws SourceNotFoundException Если источник не найден
     *
     * @pre sourceName != null
     * @pre !sourceName.isEmpty()
     * @post result != null
     */
    EnrichmentSource getSource(String sourceName) throws SourceNotFoundException;

    /**
     * Регистрирует новый источник данных.
     *
     * @param source Источник данных
     * @throws DuplicateSourceException Если источник с таким именем уже зарегистрирован
     *
     * @pre source != null
     * @post getAvailableSources().contains(source)
     */
    void registerSource(EnrichmentSource source) throws DuplicateSourceException;

    /**
     * Возвращает статистику обогащения.
     *
     * @return Статистика обогащения
     * @throws IllegalStateException Если метод вызван до выполнения операции обогащения
     *
     * @post result != null
     */
    EnrichmentStats getStats() throws IllegalStateException;
}

/**
 * Интерфейс для источника данных обогащения.
 */
public interface EnrichmentSource {
    /**
     * Возвращает имя источника данных.
     *
     * @return Имя источника данных
     *
     * @post result != null
     * @post !result.isEmpty()
     */
    String getName();

    /**
     * Возвращает описание источника данных.
     *
     * @return Описание источника данных
     *
     * @post result != null
     */
    String getDescription();

    /**
     * Возвращает список полей, которые может обогатить источник.
     *
     * @return Список полей
     *
     * @post result != null
     */
    List<String> getEnrichableFields();

    /**
     * Проверяет, может ли источник обогатить указанное поле.
     *
     * @param fieldName Имя поля
     * @return true, если источник может обогатить поле, иначе false
     *
     * @pre fieldName != null
     * @pre !fieldName.isEmpty()
     * @post result == true || result == false
     */
    boolean canEnrichField(String fieldName);

    /**
     * Обогащает JSON-объект дополнительной информацией.
     *
     * @param jsonObject JSON-объект для обогащения
     * @return Обогащенный JSON-объект
     *
     * @pre jsonObject != null
     * @post result != null
     */
    JSONObject enrich(JSONObject jsonObject);

    /**
     * Возвращает конфигурацию источника данных.
     *
     * @return Конфигурация источника данных
     *
     * @post result != null
     */
    SourceConfig getConfig();

    /**
     * Устанавливает конфигурацию источника данных.
     *
     * @param config Конфигурация источника данных
     *
     * @pre config != null
     * @post getConfig().equals(config)
     */
    void setConfig(SourceConfig config);
}

/**
 * Класс для хранения конфигурации источника данных.
 */
public class SourceConfig {
    private final Map<String, Object> parameters;
    private final boolean enabled;
    private final int priority;
    private final int timeout;
    private final int maxRetries;
    private final RetryStrategy retryStrategy;

    // Геттеры и конструктор
}

/**
 * Класс для хранения статистики обогащения.
 */
public class EnrichmentStats {
    private final int totalObjects;
    private final int enrichedObjects;
    private final Map<String, Integer> enrichedBySource;
    private final Map<String, Integer> enrichedByField;
    private final long processingTimeMs;
    private final int failedObjects;
    private final Map<String, Integer> failureReasons;

    // Геттеры и конструктор
}

/**
 * Исключение, выбрасываемое, когда источник данных не найден.
 */
public class SourceNotFoundException extends Exception {
    public SourceNotFoundException(String message) {
        super(message);
    }
}

/**
 * Исключение, выбрасываемое при попытке зарегистрировать источник данных с именем, которое уже существует.
 */
public class DuplicateSourceException extends Exception {
    public DuplicateSourceException(String message) {
        super(message);
    }
}

/**
 * Перечисление стратегий повторных попыток.
 */
public enum RetryStrategy {
    /** Линейная задержка между попытками */
    LINEAR,
    /** Экспоненциальная задержка между попытками */
    EXPONENTIAL,
    /** Фиксированная задержка между попытками */
    FIXED,
    /** Случайная задержка между попытками */
    RANDOM
}
```

## Предусловия и постусловия

### enrich(JSONObject jsonObject)
- **Предусловия**:
  - jsonObject != null
- **Постусловия**:
  - result != null

### enrich(JSONObject jsonObject, List<EnrichmentSource> sources)
- **Предусловия**:
  - jsonObject != null
  - sources != null
- **Постусловия**:
  - result != null

### enrichStream(Stream<JSONObject> jsonStream)
- **Предусловия**:
  - jsonStream != null
- **Постусловия**:
  - result != null

### enrichStream(Stream<JSONObject> jsonStream, List<EnrichmentSource> sources)
- **Предусловия**:
  - jsonStream != null
  - sources != null
- **Постусловия**:
  - result != null

### enrichFile(File jsonFile, File outputDir)
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

### enrichFile(File jsonFile, File outputDir, List<EnrichmentSource> sources)
- **Предусловия**:
  - jsonFile != null
  - jsonFile.exists()
  - jsonFile.canRead()
  - outputDir != null
  - outputDir.exists()
  - outputDir.isDirectory()
  - outputDir.canWrite()
  - sources != null
- **Постусловия**:
  - result != null
  - result.exists()

### getAvailableSources()
- **Предусловия**: нет
- **Постусловия**:
  - result != null

### getSource(String sourceName)
- **Предусловия**:
  - sourceName != null
  - !sourceName.isEmpty()
- **Постусловия**:
  - result != null

### registerSource(EnrichmentSource source)
- **Предусловия**:
  - source != null
- **Постусловия**:
  - getAvailableSources().contains(source)

### getStats()
- **Предусловия**: нет
- **Постусловия**:
  - result != null

## Инварианты
- Обогащение данных не должно изменять существующие поля, только добавлять новые или дополнять существующие
- Обогащение должно быть идемпотентным: повторное применение к уже обогащенным данным не должно изменять результат
- Источники данных должны иметь уникальные имена
- Обогащение должно быть потокобезопасным
- Обогащение не должно терять данные из исходного объекта

## Исключения
- **IOException**: если произошла ошибка при чтении или записи файла
- **IllegalArgumentException**: если нарушены предусловия методов
- **IllegalStateException**: если метод getStats() вызван до выполнения операции обогащения
- **SourceNotFoundException**: если источник данных не найден
- **DuplicateSourceException**: при попытке зарегистрировать источник данных с именем, которое уже существует

## Примеры использования
```java
// Пример обогащения JSON-объекта
DataEnricher enricher = new DefaultDataEnricher();

// Создание JSON-объекта с данными о товаре
JSONObject product = new JSONObject();
product.put("id", "12345");
product.put("name", "Война и мир");
product.put("author", "Лев Толстой");
product.put("isbn", "9785171147341");

// Обогащение данных
JSONObject enrichedProduct = enricher.enrich(product);
System.out.println("Enriched product: " + enrichedProduct.toString());

// Пример обогащения с указанием конкретных источников
List<EnrichmentSource> sources = new ArrayList<>();
sources.add(enricher.getSource("isbn-db"));
sources.add(enricher.getSource("book-covers"));

JSONObject customEnrichedProduct = enricher.enrich(product, sources);
System.out.println("Custom enriched product: " + customEnrichedProduct.toString());

// Пример обогащения потока JSON-объектов
try (Stream<JSONObject> jsonStream = loadJsonStream()) {
    Stream<JSONObject> enrichedStream = enricher.enrichStream(jsonStream);
    
    // Обработка обогащенных данных
    enrichedStream.forEach(System.out::println);
}

// Пример обогащения JSON-файла
File jsonFile = new File("products.json");
File outputDir = new File("enriched");
try {
    File enrichedFile = enricher.enrichFile(jsonFile, outputDir);
    System.out.println("Enriched file created: " + enrichedFile.getAbsolutePath());
} catch (IOException e) {
    System.err.println("Error enriching file: " + e.getMessage());
}

// Пример получения статистики обогащения
try {
    EnrichmentStats stats = enricher.getStats();
    System.out.println("Total objects: " + stats.getTotalObjects());
    System.out.println("Enriched objects: " + stats.getEnrichedObjects());
    System.out.println("Failed objects: " + stats.getFailedObjects());
    System.out.println("Processing time: " + stats.getProcessingTimeMs() + " ms");
    
    // Статистика по источникам
    Map<String, Integer> enrichedBySource = stats.getEnrichedBySource();
    enrichedBySource.forEach((source, count) -> 
        System.out.println("Enriched by " + source + ": " + count));
    
    // Статистика по полям
    Map<String, Integer> enrichedByField = stats.getEnrichedByField();
    enrichedByField.forEach((field, count) -> 
        System.out.println("Field " + field + " enriched: " + count));
} catch (IllegalStateException e) {
    System.err.println("Stats not available: " + e.getMessage());
}

// Пример регистрации нового источника данных
try {
    // Создание и настройка нового источника
    CustomEnrichmentSource customSource = new CustomEnrichmentSource("custom-api");
    SourceConfig config = new SourceConfig.Builder()
        .parameter("api-key", "your-api-key")
        .parameter("base-url", "https://api.example.com")
        .enabled(true)
        .priority(10)
        .timeout(5000)
        .maxRetries(3)
        .retryStrategy(RetryStrategy.EXPONENTIAL)
        .build();
    customSource.setConfig(config);
    
    // Регистрация источника
    enricher.registerSource(customSource);
    System.out.println("Custom source registered successfully");
} catch (DuplicateSourceException e) {
    System.err.println("Source already exists: " + e.getMessage());
}
```

## Типы источников данных
1. **ISBN Database**: обогащает данные о книгах на основе ISBN
   - Добавляет информацию о издательстве, годе издания, количестве страниц, языке
   - Источник данных: API isbndb.com, Open Library API

2. **Book Covers**: добавляет ссылки на обложки книг
   - Добавляет URL изображений обложек в разных размерах
   - Источник данных: Google Books API, Open Library Covers API

3. **Product Categories**: обогащает данные о категориях товаров
   - Добавляет иерархию категорий, связанные категории
   - Источник данных: внутренняя база данных категорий

4. **Price Comparison**: добавляет информацию о ценах у конкурентов
   - Добавляет минимальную, максимальную и среднюю цену
   - Источник данных: агрегаторы цен, парсинг сайтов конкурентов

5. **Author Information**: обогащает данные об авторах
   - Добавляет биографию, список других книг автора
   - Источник данных: Wikipedia API, Goodreads API

6. **Reviews and Ratings**: добавляет отзывы и рейтинги
   - Добавляет средний рейтинг, количество отзывов, избранные отзывы
   - Источник данных: Goodreads API, внутренняя база отзывов

7. **Related Products**: добавляет связанные товары
   - Добавляет список "с этим товаром покупают", "похожие товары"
   - Источник данных: алгоритмы рекомендаций, анализ покупок

8. **SEO Metadata**: обогащает данные для SEO
   - Добавляет мета-теги, ключевые слова, канонические URL
   - Источник данных: алгоритмы генерации SEO-метаданных

## Реализации
- **DefaultDataEnricher**: основная реализация, использующая все доступные источники данных
- **AsyncDataEnricher**: реализация с асинхронным обогащением для повышения производительности
- **CachedDataEnricher**: реализация с кэшированием результатов обогащения
- **PrioritizedDataEnricher**: реализация с приоритизацией источников данных
- **FallbackDataEnricher**: реализация с механизмом резервных источников данных

## Связанные контракты
- [Converter Interface Contract](../converter/contract.md)
- [Deduplicator Interface Contract](../deduplicator/contract.md)
- [ETL Process Contract](../../ETL-Process-Contract.md)
- [DatabaseLoader Interface Contract](../database-loader/contract.md)
