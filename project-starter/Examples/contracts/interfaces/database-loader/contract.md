# Контракт: DatabaseLoader Interface

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
Интерфейс DatabaseLoader определяет контракт для компонентов, отвечающих за загрузку данных в базу данных. Он предоставляет методы для загрузки данных как из потока JSON-объектов, так и из JSON-файла.

## Интерфейс
```java
/**
 * Интерфейс для загрузки данных в базу данных.
 */
public interface DatabaseLoader {
    /**
     * Загружает данные в базу данных.
     *
     * @param dataStream Поток JSON-объектов для загрузки
     * @return Результат загрузки
     * @throws SQLException Если произошла ошибка при работе с базой данных
     *
     * @pre dataStream != null
     * @post result != null
     * @post result.getTotalRecords() >= 0
     * @post result.getSuccessfulRecords() <= result.getTotalRecords()
     */
    LoadResult loadData(Stream<JSONObject> dataStream) throws SQLException;

    /**
     * Загружает данные из файла в базу данных.
     *
     * @param jsonFile JSON-файл для загрузки
     * @return Результат загрузки
     * @throws SQLException Если произошла ошибка при работе с базой данных
     * @throws IOException Если произошла ошибка при чтении файла
     *
     * @pre jsonFile != null
     * @pre jsonFile.exists()
     * @pre jsonFile.canRead()
     * @post result != null
     * @post result.getTotalRecords() >= 0
     * @post result.getSuccessfulRecords() <= result.getTotalRecords()
     */
    LoadResult loadDataFromFile(File jsonFile) throws SQLException, IOException;

    /**
     * Загружает данные в базу данных с дополнительными параметрами.
     *
     * @param dataStream Поток JSON-объектов для загрузки
     * @param config Конфигурация загрузки
     * @return Результат загрузки
     * @throws SQLException Если произошла ошибка при работе с базой данных
     *
     * @pre dataStream != null
     * @pre config != null
     * @post result != null
     * @post result.getTotalRecords() >= 0
     * @post result.getSuccessfulRecords() <= result.getTotalRecords()
     */
    LoadResult loadData(Stream<JSONObject> dataStream, LoaderConfig config) throws SQLException;

    /**
     * Проверяет подключение к базе данных.
     *
     * @return true, если подключение успешно, иначе false
     *
     * @post result == true || result == false
     */
    boolean testConnection();

    /**
     * Инициализирует схему базы данных.
     *
     * @return true, если инициализация успешна, иначе false
     * @throws SQLException Если произошла ошибка при работе с базой данных
     *
     * @post result == true || result == false
     */
    boolean initializeSchema() throws SQLException;

    /**
     * Возвращает метаданные о последней операции загрузки.
     *
     * @return Объект LoadMetadata с информацией о процессе загрузки
     *
     * @pre была выполнена хотя бы одна операция загрузки
     * @post result != null
     */
    LoadMetadata getMetadata();
}

/**
 * Класс для хранения результата загрузки данных.
 */
public class LoadResult {
    private final int totalRecords;
    private final int successfulRecords;
    private final int failedRecords;
    private final List<String> errors;

    /**
     * Создает новый объект LoadResult.
     *
     * @param totalRecords Общее количество записей
     * @param successfulRecords Количество успешно загруженных записей
     * @param failedRecords Количество записей, которые не удалось загрузить
     * @param errors Список ошибок
     *
     * @pre totalRecords >= 0
     * @pre successfulRecords >= 0
     * @pre failedRecords >= 0
     * @pre successfulRecords + failedRecords == totalRecords
     * @pre errors != null
     */
    public LoadResult(int totalRecords, int successfulRecords, int failedRecords, List<String> errors) {
        this.totalRecords = totalRecords;
        this.successfulRecords = successfulRecords;
        this.failedRecords = failedRecords;
        this.errors = errors;
    }

    // Геттеры
    public int getTotalRecords() { return totalRecords; }
    public int getSuccessfulRecords() { return successfulRecords; }
    public int getFailedRecords() { return failedRecords; }
    public List<String> getErrors() { return errors; }
}

/**
 * Класс для хранения метаданных о процессе загрузки.
 */
public class LoadMetadata {
    private final String sourceFileName;
    private final int totalRecords;
    private final int successfulRecords;
    private final int failedRecords;
    private final long processingTimeMs;
    private final List<String> errors;
    private final Map<String, Object> statistics;

    // Геттеры и конструктор
}

/**
 * Класс для конфигурации процесса загрузки.
 */
public class LoaderConfig {
    private final int batchSize;
    private final int maxRetries;
    private final long retryDelayMs;
    private final boolean continueOnError;
    private final boolean validateBeforeLoad;
    private final boolean useTransaction;
    private final int transactionIsolationLevel;

    // Геттеры и конструктор
    
    /**
     * Создает билдер для конфигурации.
     *
     * @return Билдер для LoaderConfig
     */
    public static Builder builder() {
        return new Builder();
    }
    
    /**
     * Билдер для LoaderConfig.
     */
    public static class Builder {
        private int batchSize = 1000;
        private int maxRetries = 3;
        private long retryDelayMs = 1000;
        private boolean continueOnError = false;
        private boolean validateBeforeLoad = true;
        private boolean useTransaction = true;
        private int transactionIsolationLevel = Connection.TRANSACTION_READ_COMMITTED;
        
        // Методы для установки параметров
        
        /**
         * Создает объект LoaderConfig.
         *
         * @return Объект LoaderConfig
         */
        public LoaderConfig build() {
            return new LoaderConfig(
                batchSize, maxRetries, retryDelayMs, continueOnError,
                validateBeforeLoad, useTransaction, transactionIsolationLevel
            );
        }
    }
}
```

## Предусловия и постусловия

### loadData(Stream<JSONObject> dataStream)
- **Предусловия**:
  - dataStream != null
- **Постусловия**:
  - result != null
  - result.getTotalRecords() >= 0
  - result.getSuccessfulRecords() <= result.getTotalRecords()

### loadDataFromFile(File jsonFile)
- **Предусловия**:
  - jsonFile != null
  - jsonFile.exists()
  - jsonFile.canRead()
- **Постусловия**:
  - result != null
  - result.getTotalRecords() >= 0
  - result.getSuccessfulRecords() <= result.getTotalRecords()

### loadData(Stream<JSONObject> dataStream, LoaderConfig config)
- **Предусловия**:
  - dataStream != null
  - config != null
- **Постусловия**:
  - result != null
  - result.getTotalRecords() >= 0
  - result.getSuccessfulRecords() <= result.getTotalRecords()

### testConnection()
- **Предусловия**: нет
- **Постусловия**:
  - result == true || result == false

### initializeSchema()
- **Предусловия**: нет
- **Постусловия**:
  - result == true || result == false

### getMetadata()
- **Предусловия**:
  - была выполнена хотя бы одна операция загрузки
- **Постусловия**:
  - result != null

## Инварианты
- Загрузчик должен обеспечивать целостность данных при возникновении ошибок
- Загрузчик должен корректно обрабатывать транзакции
- Загрузчик должен корректно обрабатывать кириллические символы

## Исключения
- **SQLException**: если произошла ошибка при работе с базой данных
- **IOException**: если произошла ошибка при чтении файла
- **IllegalArgumentException**: если нарушены предусловия методов
- **IllegalStateException**: если метод getMetadata() вызван до выполнения операции загрузки

## Примеры использования
```java
// Пример использования метода loadData
Stream<JSONObject> jsonData = getJsonData();
DatabaseLoader loader = new PostgreSQLLoader(dbConfig);
try {
    LoadResult result = loader.loadData(jsonData);
    System.out.println("Loaded " + result.getSuccessfulRecords() + " records");
    System.out.println("Failed " + result.getFailedRecords() + " records");
    if (result.getFailedRecords() > 0) {
        System.out.println("Errors: " + result.getErrors());
    }
} catch (SQLException e) {
    System.err.println("Database error: " + e.getMessage());
}

// Пример использования метода loadDataFromFile
File jsonFile = new File("data.json");
DatabaseLoader loader = new PostgreSQLLoader(dbConfig);
try {
    LoadResult result = loader.loadDataFromFile(jsonFile);
    System.out.println("Loaded " + result.getSuccessfulRecords() + " records from file");
} catch (SQLException | IOException e) {
    System.err.println("Error: " + e.getMessage());
}

// Пример использования метода loadData с конфигурацией
Stream<JSONObject> jsonData = getJsonData();
LoaderConfig config = LoaderConfig.builder()
    .batchSize(500)
    .maxRetries(5)
    .continueOnError(true)
    .build();
DatabaseLoader loader = new PostgreSQLLoader(dbConfig);
try {
    LoadResult result = loader.loadData(jsonData, config);
    System.out.println("Loaded " + result.getSuccessfulRecords() + " records with custom config");
} catch (SQLException e) {
    System.err.println("Database error: " + e.getMessage());
}

// Пример проверки подключения и инициализации схемы
DatabaseLoader loader = new PostgreSQLLoader(dbConfig);
if (loader.testConnection()) {
    System.out.println("Connection successful");
    try {
        if (loader.initializeSchema()) {
            System.out.println("Schema initialized");
        } else {
            System.out.println("Failed to initialize schema");
        }
    } catch (SQLException e) {
        System.err.println("Schema initialization error: " + e.getMessage());
    }
} else {
    System.out.println("Connection failed");
}

// Пример получения метаданных
LoadMetadata metadata = loader.getMetadata();
System.out.println("Processing time: " + metadata.getProcessingTimeMs() + " ms");
System.out.println("Records processed: " + metadata.getTotalRecords());
```

## Реализации
- **PostgreSQLLoader**: реализация для PostgreSQL
- **MySQLLoader**: реализация для MySQL
- **JDBCLoader**: универсальная реализация для любой СУБД с поддержкой JDBC

## Связанные контракты
- [DatabaseLoader Architecture Contract](../../DatabaseLoader-Architecture-Contract.md)
- [Deduplicator Interface Contract](../deduplicator/contract.md)
- [JSON Schema](../../data/json-schema/deduplicator-output-schema.json)
