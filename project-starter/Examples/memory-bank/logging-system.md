# Система логирования в CATMEPIM

## Общая информация

В проекте CATMEPIM внедрена система логирования на базе SLF4J и Log4j2. Система логирования предоставляет подробную информацию о процессе обработки файлов, включая информацию о начале и завершении обработки, выбранной стратегии, прогрессе обработки и ошибках.

## Компоненты системы логирования

1. **Зависимости в pom.xml**:
   - SLF4J API
   - Log4j2 Core
   - Log4j2 API
   - Log4j2 SLF4J Binding

2. **Конфигурационный файл log4j2.xml**:
   - Настроены различные аппендеры (консоль, файлы)
   - Настроена ротация логов
   - Настроены различные уровни логирования для разных компонентов
   - Созданы отдельные файлы для разных типов логов (application.log, error.log, excel-converter.log)

3. **Классы с логированием**:
   - ExcelToJsonConverter
   - StandardProcessingStrategy
   - SaxExcelToCSVStrategy
   - CsvToJsonConverterWithLogging

## Функциональность системы логирования

1. **Контекстное логирование (MDC)**:
   - Информация о файле (путь, размер)
   - Уникальный идентификатор конверсии
   - Информация о стратегии обработки

2. **Логирование использования памяти**:
   - Информация о доступной памяти до и после обработки
   - Информация о максимальной, общей, используемой и свободной памяти

3. **Логирование производительности**:
   - Время выполнения операций
   - Скорость обработки строк (строк в секунду)
   - Информация о прогрессе обработки

4. **Логирование ошибок**:
   - Подробная информация об ошибках с полным стеком вызовов
   - Отдельный файл для логов ошибок (error.log)

5. **Логирование файловых операций**:
   - Информация о размере входных и выходных файлов
   - Информация о коэффициенте сжатия
   - Информация о временных файлах

## Примеры использования

### Пример логирования в ExcelToJsonConverter:

```java
// Добавляем информацию о файле в MDC для логирования
MDC.put("excelFile", excelFilePath);
MDC.put("jsonFile", jsonFilePath);
MDC.put("fileSize", String.valueOf(fileSize));
MDC.put("conversionId", String.valueOf(System.currentTimeMillis()));

// Логируем информацию о доступной памяти перед началом конвертации
Runtime runtime = Runtime.getRuntime();
long maxMemory = runtime.maxMemory() / (1024 * 1024);
long totalMemory = runtime.totalMemory() / (1024 * 1024);
long freeMemory = runtime.freeMemory() / (1024 * 1024);
long usedMemory = totalMemory - freeMemory;

logger.info("Memory before conversion - Max: {} MB, Total: {} MB, Used: {} MB, Free: {} MB",
        maxMemory, totalMemory, usedMemory, freeMemory);

logger.info("Starting conversion of {} to {}", excelFilePath, jsonFilePath);
```

### Пример логирования в StandardProcessingStrategy:

```java
logger.info("Starting to write JSON data to file: {}", outputFile.getName());
long writeStartTime = System.currentTimeMillis();
AtomicInteger recordCount = new AtomicInteger(0);

// ... код записи в файл ...

long writeTime = System.currentTimeMillis() - writeStartTime;
logger.info("JSON writing completed. Written {} records in {} ms ({} records/sec)",
        recordCount.get(), writeTime,
        writeTime > 0 ? (recordCount.get() * 1000 / writeTime) : 0);
```

### Пример логирования в CsvToJsonConverterWithLogging:

```java
// Добавляем информацию о файле в MDC для логирования
MDC.put("csvFile", csvFile.getAbsolutePath());
MDC.put("jsonFile", jsonFile.getAbsolutePath());
MDC.put("fileSize", String.valueOf(csvFile.length()));
MDC.put("conversionId", String.valueOf(System.currentTimeMillis()));

logger.info("Starting CSV to JSON conversion: {} to {} (size: {} MB)",
    csvFile.getName(), jsonFile.getName(), csvFile.length() / (1024 * 1024));
```

## Файлы логов

Система логирования создает следующие файлы логов:

1. **application.log** - основной файл логов приложения
2. **application-YYYY-MM-DD-N.log** - архивные файлы логов приложения
3. **error.log** - файл логов ошибок
4. **excel-converter.log** - файл логов конвертера Excel

## Улучшения системы логирования

1. **Добавлен уникальный идентификатор конверсии (conversionId)** для отслеживания каждой операции конвертации
2. **Добавлено логирование использования памяти** до и после конвертации
3. **Добавлено логирование производительности** (время выполнения операций, скорость обработки строк)
4. **Улучшено логирование в StandardProcessingStrategy**:
   - Добавлено подробное логирование в методы prepare, process и writeToFile
   - Добавлено логирование параметров ZipSecureFile
   - Добавлено логирование прогресса обработки данных
5. **Добавлено логирование размера выходного файла** и коэффициента сжатия
6. **Добавлена очистка MDC** после завершения обработки для предотвращения утечек контекста
7. **Создан новый класс CsvToJsonConverterWithLogging** с расширенным логированием
8. **Создан новый класс FastExcelToJsonConverterWithLogging** с расширенным логированием
9. **Создан новый класс FastExcelToCsvConverterWithLogging** с расширенным логированием
10. **Обновлен контракт по логированию** с учетом всех новых компонентов
11. **Обновлен файл run-etl-easy.bat** для использования новых классов с логированием

## Дальнейшие улучшения

1. **Настройка ротации логов по размеру файла** - в дополнение к ротации по дате
2. **Добавление логирования в классы валидации данных**
3. **Улучшение форматирования логов для лучшей читаемости**
4. **Добавление MDC для отслеживания потоков выполнения**
5. **Интеграция с системой мониторинга** для отслеживания производительности и ошибок в реальном времени
6. **Добавление логирования в ETL-систему** для отслеживания процесса загрузки данных в базу данных
7. **Добавление логирования в базу данных** для отслеживания запросов и производительности
8. **Создание дашборда для анализа логов** с использованием инструментов визуализации

## Параноидальное логирование

В систему добавлено параноидальное логирование для отслеживания процесса выбора стратегии и обработки файлов:

```java
// Добавляем параноидальное логирование
System.out.println("Selecting strategy for file: " + excelFile.getName() + ", size: " + fileSizeMB + " MB");
System.out.println("Strategy threshold: " + thresholds.getStandardToSaxCsvMB() + " MB");

// Если файл больше порогового значения, используем SAX CSV стратегию
if (fileSizeMB > thresholds.getStandardToSaxCsvMB()) {
    System.out.println("Using SAX Excel-to-CSV strategy for large file: " + fileSizeMB + " MB");
    return createStrategy(ProcessingMode.SAX_CSV, resourceConstraints);
} else {
    System.out.println("Using Standard strategy for file: " + fileSizeMB + " MB");
    return createStrategy(ProcessingMode.STANDARD, resourceConstraints);
}
```

Это позволяет легко отслеживать процесс выбора стратегии и диагностировать проблемы, связанные с неправильным выбором стратегии.
