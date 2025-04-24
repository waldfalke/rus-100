# Контракт: JSON Schema Validator

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
Интерфейс JSONSchemaValidator определяет контракт для компонентов, отвечающих за валидацию JSON-данных на соответствие схеме. Он предоставляет методы для проверки отдельных JSON-объектов, потоков JSON-объектов и JSON-файлов.

## Интерфейс
```java
/**
 * Интерфейс для валидации JSON-данных на соответствие схеме.
 */
public interface JSONSchemaValidator {
    /**
     * Проверяет JSON-объект на соответствие схеме.
     *
     * @param jsonObject JSON-объект для проверки
     * @param schemaName Имя схемы для проверки
     * @return Результат валидации
     *
     * @pre jsonObject != null
     * @pre schemaName != null
     * @pre !schemaName.isEmpty()
     * @post result != null
     */
    ValidationResult validate(JSONObject jsonObject, String schemaName);

    /**
     * Проверяет JSON-объект на соответствие схеме.
     *
     * @param jsonObject JSON-объект для проверки
     * @param schema Схема для проверки
     * @return Результат валидации
     *
     * @pre jsonObject != null
     * @pre schema != null
     * @post result != null
     */
    ValidationResult validate(JSONObject jsonObject, JSONSchema schema);

    /**
     * Проверяет поток JSON-объектов на соответствие схеме.
     *
     * @param jsonStream Поток JSON-объектов для проверки
     * @param schemaName Имя схемы для проверки
     * @return Поток результатов валидации
     *
     * @pre jsonStream != null
     * @pre schemaName != null
     * @pre !schemaName.isEmpty()
     * @post result != null
     */
    Stream<ValidationResult> validateStream(Stream<JSONObject> jsonStream, String schemaName);

    /**
     * Проверяет поток JSON-объектов на соответствие схеме.
     *
     * @param jsonStream Поток JSON-объектов для проверки
     * @param schema Схема для проверки
     * @return Поток результатов валидации
     *
     * @pre jsonStream != null
     * @pre schema != null
     * @post result != null
     */
    Stream<ValidationResult> validateStream(Stream<JSONObject> jsonStream, JSONSchema schema);

    /**
     * Проверяет JSON-файл на соответствие схеме.
     *
     * @param jsonFile JSON-файл для проверки
     * @param schemaName Имя схемы для проверки
     * @return Результат валидации
     * @throws IOException Если произошла ошибка при чтении файла
     *
     * @pre jsonFile != null
     * @pre jsonFile.exists()
     * @pre jsonFile.canRead()
     * @pre schemaName != null
     * @pre !schemaName.isEmpty()
     * @post result != null
     */
    ValidationResult validateFile(File jsonFile, String schemaName) throws IOException;

    /**
     * Проверяет JSON-файл на соответствие схеме.
     *
     * @param jsonFile JSON-файл для проверки
     * @param schema Схема для проверки
     * @return Результат валидации
     * @throws IOException Если произошла ошибка при чтении файла
     *
     * @pre jsonFile != null
     * @pre jsonFile.exists()
     * @pre jsonFile.canRead()
     * @pre schema != null
     * @post result != null
     */
    ValidationResult validateFile(File jsonFile, JSONSchema schema) throws IOException;

    /**
     * Загружает схему из файла.
     *
     * @param schemaFile Файл схемы
     * @return Загруженная схема
     * @throws IOException Если произошла ошибка при чтении файла
     * @throws InvalidSchemaException Если схема некорректна
     *
     * @pre schemaFile != null
     * @pre schemaFile.exists()
     * @pre schemaFile.canRead()
     * @post result != null
     */
    JSONSchema loadSchema(File schemaFile) throws IOException, InvalidSchemaException;

    /**
     * Загружает схему из строки.
     *
     * @param schemaString Строка со схемой
     * @return Загруженная схема
     * @throws InvalidSchemaException Если схема некорректна
     *
     * @pre schemaString != null
     * @pre !schemaString.isEmpty()
     * @post result != null
     */
    JSONSchema loadSchema(String schemaString) throws InvalidSchemaException;

    /**
     * Регистрирует схему с указанным именем.
     *
     * @param schemaName Имя схемы
     * @param schema Схема
     * @throws DuplicateSchemaException Если схема с таким именем уже зарегистрирована
     *
     * @pre schemaName != null
     * @pre !schemaName.isEmpty()
     * @pre schema != null
     * @post isSchemaRegistered(schemaName) == true
     */
    void registerSchema(String schemaName, JSONSchema schema) throws DuplicateSchemaException;

    /**
     * Возвращает схему по имени.
     *
     * @param schemaName Имя схемы
     * @return Схема
     * @throws SchemaNotFoundException Если схема не найдена
     *
     * @pre schemaName != null
     * @pre !schemaName.isEmpty()
     * @post result != null
     */
    JSONSchema getSchema(String schemaName) throws SchemaNotFoundException;

    /**
     * Проверяет, зарегистрирована ли схема с указанным именем.
     *
     * @param schemaName Имя схемы
     * @return true, если схема зарегистрирована, иначе false
     *
     * @pre schemaName != null
     * @pre !schemaName.isEmpty()
     * @post result == true || result == false
     */
    boolean isSchemaRegistered(String schemaName);

    /**
     * Возвращает список имен всех зарегистрированных схем.
     *
     * @return Список имен схем
     *
     * @post result != null
     */
    List<String> getRegisteredSchemaNames();
}

/**
 * Класс для хранения результата валидации.
 */
public class ValidationResult {
    private final boolean valid;
    private final List<ValidationError> errors;
    private final JSONObject jsonObject;
    private final String schemaName;

    // Геттеры и конструктор
}

/**
 * Класс для хранения ошибки валидации.
 */
public class ValidationError {
    private final String message;
    private final String path;
    private final String keyword;
    private final Object value;

    // Геттеры и конструктор
}

/**
 * Интерфейс для представления JSON-схемы.
 */
public interface JSONSchema {
    /**
     * Возвращает схему в виде JSON-объекта.
     *
     * @return JSON-объект со схемой
     *
     * @post result != null
     */
    JSONObject toJSONObject();

    /**
     * Возвращает схему в виде строки.
     *
     * @return Строка со схемой
     *
     * @post result != null
     */
    String toString();

    /**
     * Возвращает версию схемы.
     *
     * @return Версия схемы
     *
     * @post result != null
     */
    String getVersion();

    /**
     * Возвращает идентификатор схемы.
     *
     * @return Идентификатор схемы или null, если не указан
     */
    String getId();

    /**
     * Возвращает заголовок схемы.
     *
     * @return Заголовок схемы или null, если не указан
     */
    String getTitle();

    /**
     * Возвращает описание схемы.
     *
     * @return Описание схемы или null, если не указано
     */
    String getDescription();
}

/**
 * Исключение, выбрасываемое при некорректной схеме.
 */
public class InvalidSchemaException extends Exception {
    public InvalidSchemaException(String message) {
        super(message);
    }
}

/**
 * Исключение, выбрасываемое при попытке зарегистрировать схему с именем, которое уже существует.
 */
public class DuplicateSchemaException extends Exception {
    public DuplicateSchemaException(String message) {
        super(message);
    }
}

/**
 * Исключение, выбрасываемое, когда схема не найдена.
 */
public class SchemaNotFoundException extends Exception {
    public SchemaNotFoundException(String message) {
        super(message);
    }
}
```

## Предусловия и постусловия

### validate(JSONObject jsonObject, String schemaName)
- **Предусловия**:
  - jsonObject != null
  - schemaName != null
  - !schemaName.isEmpty()
- **Постусловия**:
  - result != null

### validate(JSONObject jsonObject, JSONSchema schema)
- **Предусловия**:
  - jsonObject != null
  - schema != null
- **Постусловия**:
  - result != null

### validateStream(Stream<JSONObject> jsonStream, String schemaName)
- **Предусловия**:
  - jsonStream != null
  - schemaName != null
  - !schemaName.isEmpty()
- **Постусловия**:
  - result != null

### validateStream(Stream<JSONObject> jsonStream, JSONSchema schema)
- **Предусловия**:
  - jsonStream != null
  - schema != null
- **Постусловия**:
  - result != null

### validateFile(File jsonFile, String schemaName)
- **Предусловия**:
  - jsonFile != null
  - jsonFile.exists()
  - jsonFile.canRead()
  - schemaName != null
  - !schemaName.isEmpty()
- **Постусловия**:
  - result != null

### validateFile(File jsonFile, JSONSchema schema)
- **Предусловия**:
  - jsonFile != null
  - jsonFile.exists()
  - jsonFile.canRead()
  - schema != null
- **Постусловия**:
  - result != null

### loadSchema(File schemaFile)
- **Предусловия**:
  - schemaFile != null
  - schemaFile.exists()
  - schemaFile.canRead()
- **Постусловия**:
  - result != null

### loadSchema(String schemaString)
- **Предусловия**:
  - schemaString != null
  - !schemaString.isEmpty()
- **Постусловия**:
  - result != null

### registerSchema(String schemaName, JSONSchema schema)
- **Предусловия**:
  - schemaName != null
  - !schemaName.isEmpty()
  - schema != null
- **Постусловия**:
  - isSchemaRegistered(schemaName) == true

### getSchema(String schemaName)
- **Предусловия**:
  - schemaName != null
  - !schemaName.isEmpty()
- **Постусловия**:
  - result != null

### isSchemaRegistered(String schemaName)
- **Предусловия**:
  - schemaName != null
  - !schemaName.isEmpty()
- **Постусловия**:
  - result == true || result == false

### getRegisteredSchemaNames()
- **Предусловия**: нет
- **Постусловия**:
  - result != null

## Инварианты
- Валидатор должен корректно обрабатывать все типы данных JSON (строки, числа, булевы значения, массивы, объекты, null)
- Валидатор должен поддерживать все ключевые слова JSON Schema (type, properties, required, items, etc.)
- Валидатор должен быть потокобезопасным
- Имена схем должны быть уникальными
- Валидатор должен возвращать все ошибки валидации, а не только первую

## Исключения
- **IOException**: если произошла ошибка при чтении файла
- **InvalidSchemaException**: если схема некорректна
- **DuplicateSchemaException**: при попытке зарегистрировать схему с именем, которое уже существует
- **SchemaNotFoundException**: если схема не найдена
- **IllegalArgumentException**: если нарушены предусловия методов

## Примеры использования
```java
// Пример валидации JSON-объекта
JSONSchemaValidator validator = new DefaultJSONSchemaValidator();

// Загрузка и регистрация схемы
File schemaFile = new File("product-schema.json");
try {
    JSONSchema schema = validator.loadSchema(schemaFile);
    validator.registerSchema("product", schema);
} catch (IOException e) {
    System.err.println("Error reading schema file: " + e.getMessage());
} catch (InvalidSchemaException e) {
    System.err.println("Invalid schema: " + e.getMessage());
} catch (DuplicateSchemaException e) {
    System.err.println("Schema already registered: " + e.getMessage());
}

// Валидация JSON-объекта
JSONObject product = new JSONObject();
product.put("id", "12345");
product.put("name", "Product Name");
product.put("price", 19.99);
product.put("category", "Electronics");

try {
    ValidationResult result = validator.validate(product, "product");
    if (result.isValid()) {
        System.out.println("Product is valid");
    } else {
        System.out.println("Product is invalid:");
        for (ValidationError error : result.getErrors()) {
            System.out.println("- " + error.getMessage() + " at " + error.getPath());
        }
    }
} catch (SchemaNotFoundException e) {
    System.err.println("Schema not found: " + e.getMessage());
}

// Пример валидации потока JSON-объектов
try (Stream<JSONObject> jsonStream = loadJsonStream()) {
    Stream<ValidationResult> results = validator.validateStream(jsonStream, "product");
    
    // Обработка результатов валидации
    long validCount = results.filter(ValidationResult::isValid).count();
    System.out.println("Valid objects: " + validCount);
} catch (SchemaNotFoundException e) {
    System.err.println("Schema not found: " + e.getMessage());
}

// Пример валидации JSON-файла
File jsonFile = new File("products.json");
try {
    ValidationResult result = validator.validateFile(jsonFile, "product");
    if (result.isValid()) {
        System.out.println("File is valid");
    } else {
        System.out.println("File is invalid:");
        for (ValidationError error : result.getErrors()) {
            System.out.println("- " + error.getMessage() + " at " + error.getPath());
        }
    }
} catch (IOException e) {
    System.err.println("Error reading JSON file: " + e.getMessage());
} catch (SchemaNotFoundException e) {
    System.err.println("Schema not found: " + e.getMessage());
}

// Пример получения списка зарегистрированных схем
List<String> schemaNames = validator.getRegisteredSchemaNames();
System.out.println("Registered schemas: " + schemaNames);
```

## Реализации
- **DefaultJSONSchemaValidator**: основная реализация, использующая библиотеку Everit JSON Schema
- **JacksonJSONSchemaValidator**: реализация, использующая библиотеку Jackson
- **NetworkJSONSchemaValidator**: реализация, поддерживающая загрузку схем по URL
- **CachedJSONSchemaValidator**: реализация с кэшированием результатов валидации для повышения производительности

## Связанные контракты
- [Converter Interface Contract](../converter/contract.md)
- [Deduplicator Interface Contract](../deduplicator/contract.md)
- [ETL Process Contract](../../ETL-Process-Contract.md)
- [JSON Schema](../../data/json-schema/input-schema.json)
