# Контракт: ETL Process

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
Контракт ETL Process определяет общую архитектуру и взаимодействие компонентов в процессе извлечения, преобразования и загрузки данных о товарах. Он описывает последовательность операций, потоки данных и интерфейсы взаимодействия между компонентами.

## Архитектура ETL-процесса

### Компоненты
ETL-процесс состоит из следующих основных компонентов:

1. **VendorDetector**: определяет поставщика данных на основе имени файла или его содержимого
2. **Converter**: преобразует Excel-файлы в JSON-формат
3. **Deduplicator**: выявляет и удаляет дубликаты в данных
4. **DatabaseLoader**: загружает данные в базу данных
5. **DataAnalyzer**: анализирует данные и формирует отчеты

### Последовательность операций
1. **Извлечение (Extract)**:
   - Обнаружение новых файлов в директории входных данных
   - Определение поставщика данных (VendorDetector)
   - Загрузка соответствующей конфигурации поставщика (VendorConfig)
   - Преобразование файлов в JSON-формат (Converter)

2. **Преобразование (Transform)**:
   - Нормализация данных согласно схеме
   - Удаление дубликатов (Deduplicator)
   - Обогащение данных дополнительной информацией

3. **Загрузка (Load)**:
   - Загрузка данных в базу данных (DatabaseLoader)
   - Обновление существующих записей
   - Создание индексов и связей

4. **Анализ (Analysis)**:
   - Статистический анализ данных (DataAnalyzer)
   - Выделение архетипов и кластеризация
   - Формирование отчетов

## Потоки данных

### Входные данные
- Excel-файлы (.xlsx, .xls, .xlsm, .xlsb)
- CSV-файлы (.csv)
- Текстовые файлы с разделителями (.tsv)

### Промежуточные данные
- JSON-файлы с данными о товарах
- Временные файлы для обработки больших объемов данных
- Логи процесса обработки

### Выходные данные
- Записи в базе данных
- Отчеты о результатах обработки
- Аналитические отчеты

## Интерфейсы взаимодействия

### VendorDetector → Converter
```java
// Определение поставщика и получение его конфигурации
VendorConfig vendorConfig = vendorDetector.detectVendor(inputFile);

// Использование конфигурации поставщика при конвертации
Stream<JSONObject> jsonData = converter.convert(inputFile, vendorConfig);
```

### Converter → Deduplicator
```java
// Конвертация файла в JSON
Stream<JSONObject> jsonData = converter.convert(inputFile, vendorConfig);

// Передача данных в Deduplicator
Stream<JSONObject> uniqueData = deduplicator.deduplicate(jsonData, deduplicationConfig);
```

### Deduplicator → DatabaseLoader
```java
// Дедупликация данных
Stream<JSONObject> uniqueData = deduplicator.deduplicate(jsonData, deduplicationConfig);

// Загрузка данных в базу
DatabaseLoadResult result = databaseLoader.loadData(uniqueData);
```

### DatabaseLoader → DataAnalyzer
```java
// Загрузка данных в базу
DatabaseLoadResult result = databaseLoader.loadData(uniqueData);

// Анализ загруженных данных
AnalysisReport report = dataAnalyzer.analyzeData(result.getLoadedIds());
```

## Конфигурация

### Системная конфигурация
```java
public class SystemConfig {
    // Директории
    public static final Path INPUT_DIR = Path.of("data/input");
    public static final Path OUTPUT_DIR = Path.of("data/output");
    public static final Path TEMP_DIR = Path.of("data/temp");

    // Параметры обработки
    public static final int DEFAULT_CHUNK_SIZE = 1000;
    public static final int MAX_THREADS = Runtime.getRuntime().availableProcessors();

    // Параметры базы данных
    public static final String DB_URL = "jdbc:postgresql://localhost:5432/catmepim";
    public static final String DB_USER = "postgres";
    public static final String DB_PASSWORD = "postgres";
}
```

### Конфигурация поставщика
```java
public class VendorConfig {
    private final String name;
    private final Map<String, String> mapping;
    private final List<String> columnsToRemove;
    private final double duplicateThreshold;
    private final String duplicateMethod;
    private final List<String> isbnFields;
    private final Map<String, Object> detection;

    // Геттеры и конструктор
}
```

### Конфигурация дедупликации
```java
public class DeduplicationConfig {
    private final DuplicateHandlingStrategy handlingStrategy;
    private final BlockingStrategy blockingStrategy;
    private final double similarityThreshold;
    private final List<String> exactMatchFields;
    private final List<String> fuzzyMatchFields;
    private final Map<String, Double> fieldWeights;

    // Геттеры и конструктор
}
```

## Обработка ошибок

### Стратегии обработки ошибок
1. **Fail Fast**: остановка процесса при первой ошибке
2. **Skip Errors**: пропуск ошибочных записей и продолжение обработки
3. **Replace with Default**: замена ошибочных значений на значения по умолчанию

### Логирование ошибок
```java
try {
    // Выполнение операции
} catch (UnsupportedFormatException e) {
    logger.error("Unsupported file format: {}", e.getMessage());
    // Обработка ошибки
} catch (InvalidFileException e) {
    logger.error("Invalid file structure: {}", e.getMessage());
    // Обработка ошибки
} catch (IOException e) {
    logger.error("I/O error: {}", e.getMessage());
    // Обработка ошибки
}
```

### Восстановление после сбоев
- Сохранение состояния обработки в контрольных точках
- Возможность продолжения обработки с последней успешной точки
- Механизм отката изменений при критических ошибках

## Производительность и масштабируемость

### Оптимизации
1. **Потоковая обработка**: минимизация использования памяти
2. **Разбиение на части**: обработка больших файлов по частям
3. **Параллельная обработка**: использование многопоточности
4. **Кэширование**: сохранение промежуточных результатов

### Мониторинг
- Сбор метрик о времени выполнения каждого этапа
- Отслеживание использования ресурсов (CPU, память, диск)
- Оповещение о превышении пороговых значений

## Связанные контракты
- [Converter Interface Contract](./interfaces/converter/contract.md)
- [Deduplicator Interface Contract](./interfaces/deduplicator/contract.md)
- [DatabaseLoader Interface Contract](./interfaces/database-loader/contract.md)
- [DataAnalyzer Interface Contract](./interfaces/data-analyzer/contract.md)
- [VendorConfig Contract](./interfaces/converter/vendor-config.md)
- [VendorDetector Contract](./interfaces/converter/vendor-detector.md)
- [ExcelToJsonConverter Contract](./interfaces/converter/excel-to-json-converter.md)
- [JsonCleaner Contract](./interfaces/converter/json-cleaner.md)
- [DataEnricher Interface Contract](./interfaces/enricher/data-enricher.md)
