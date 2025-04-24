# Контракт: Converter Interface

## Метаданные
- **Версия**: 1.1.0
- **Статус**: Стабильный
- **Последнее обновление**: 2025-04-15
- **Последний редактор**: AI
- **Ветка разработки**: main

## История изменений
| Дата | Версия | Автор | Описание изменений | PR |
|------|--------|-------|-------------------|-----|
| 2025-04-15 | 1.0.0 | AI | Начальная версия | - |
| 2025-04-15 | 1.1.0 | AI | Добавлены методы для конфигурации и метаданных | - |

## Описание
Интерфейс Converter определяет контракт для компонентов, отвечающих за преобразование Excel-файлов в JSON-формат. Он предоставляет методы для конвертации как в поток JSON-объектов, так и в JSON-файл.

### Определение формата входных данных
Конвертер определяет формат входных данных на основе следующих критериев:

1. **Расширение файла**:
   - .xlsx - Excel 2007+ (OOXML)
   - .xls - Excel 97-2003 (BIFF)
   - .csv - текстовый файл с разделителями
   - .xlsm - Excel с макросами

2. **Анализ сигнатуры файла** (магические числа):
   - Проверка заголовка файла для подтверждения формата
   - Проверка структуры ZIP для OOXML файлов

3. **Конфигурация пользователя**:
   - Явное указание формата через параметр конфигурации
   - Указание специфических параметров для конкретного формата

### Поддерживаемые форматы
Конвертер поддерживает следующие форматы входных данных:

1. **Excel форматы**:
   - XLSX (Excel 2007+, Office Open XML)
   - XLS (Excel 97-2003, Binary Interchange File Format)
   - XLSM (Excel с макросами)
   - XLSB (Excel Binary Workbook)

2. **Текстовые форматы**:
   - CSV (значения, разделенные запятыми)
   - TSV (значения, разделенные табуляцией)

Для расширения поддерживаемых форматов используется механизм плагинов, позволяющий добавлять новые форматы без изменения основного интерфейса.

### Производительность и масштабируемость
Для обеспечения эффективной обработки больших файлов применяются следующие оптимизации:

1. **Потоковая обработка**:
   - Чтение и обработка данных порциями для минимизации использования памяти

2. **Разбиение на части** (chunking):
   - Разделение больших файлов на управляемые части
   - Возможность настройки размера частей через конфигурацию

3. **Параллельная обработка**:
   - Обработка нескольких частей одновременно для ускорения процесса

4. **Низкоуровневые оптимизации**:
   - Использование специализированных библиотек для работы с большими файлами (xlsx2csv, pandas)
   - Оптимизация использования памяти и дискового пространства

## Интерфейс
```java
/**
 * Интерфейс для преобразования Excel-файлов в JSON.
 *
 * Поддерживает различные форматы Excel (XLSX, XLS, XLSM, XLSB) и текстовые форматы (CSV, TSV).
 * Обеспечивает эффективную обработку больших файлов с помощью потоковой обработки и разбиения на части.
 */
public interface Converter {
    /**
     * Преобразует Excel-файл в поток JSON-объектов.
     *
     * @param excelFile Excel-файл для преобразования
     * @return Поток JSON-объектов
     * @throws IOException Если произошла ошибка при чтении файла
     * @throws UnsupportedFormatException Если формат файла не поддерживается
     * @throws InvalidFileException Если файл поврежден или имеет неверную структуру
     *
     * @pre excelFile != null
     * @pre excelFile.exists()
     * @pre excelFile.canRead()
     * @post result != null
     */
    Stream<JSONObject> convert(File excelFile) throws IOException, UnsupportedFormatException, InvalidFileException;

    /**
     * Преобразует Excel-файл в поток JSON-объектов с использованием конфигурации вендора.
     *
     * @param excelFile Excel-файл для преобразования
     * @param vendorConfig Конфигурация вендора для маппинга полей
     * @return Поток JSON-объектов
     * @throws IOException Если произошла ошибка при чтении файла
     * @throws UnsupportedFormatException Если формат файла не поддерживается
     * @throws InvalidFileException Если файл поврежден или имеет неверную структуру
     *
     * @pre excelFile != null
     * @pre excelFile.exists()
     * @pre excelFile.canRead()
     * @pre vendorConfig != null
     * @post result != null
     */
    Stream<JSONObject> convert(File excelFile, VendorConfig vendorConfig) throws IOException, UnsupportedFormatException, InvalidFileException;

    /**
     * Преобразует Excel-файл в JSON-файл.
     *
     * @param excelFile Excel-файл для преобразования
     * @param outputDir Директория для сохранения результата
     * @return Созданный JSON-файл
     * @throws IOException Если произошла ошибка при чтении или записи файла
     * @throws UnsupportedFormatException Если формат файла не поддерживается
     * @throws InvalidFileException Если файл поврежден или имеет неверную структуру
     *
     * @pre excelFile != null
     * @pre excelFile.exists()
     * @pre excelFile.canRead()
     * @pre outputDir != null
     * @pre outputDir.exists()
     * @pre outputDir.isDirectory()
     * @pre outputDir.canWrite()
     * @post result != null
     * @post result.exists()
     */
    File convertToFile(File excelFile, File outputDir) throws IOException, UnsupportedFormatException, InvalidFileException;

    /**
     * Преобразует Excel-файл в JSON-файл с использованием конфигурации вендора.
     *
     * @param excelFile Excel-файл для преобразования
     * @param outputDir Директория для сохранения результата
     * @param vendorConfig Конфигурация вендора для маппинга полей
     * @return Созданный JSON-файл
     * @throws IOException Если произошла ошибка при чтении или записи файла
     * @throws UnsupportedFormatException Если формат файла не поддерживается
     * @throws InvalidFileException Если файл поврежден или имеет неверную структуру
     *
     * @pre excelFile != null
     * @pre excelFile.exists()
     * @pre excelFile.canRead()
     * @pre outputDir != null
     * @pre outputDir.exists()
     * @pre outputDir.isDirectory()
     * @pre outputDir.canWrite()
     * @pre vendorConfig != null
     * @post result != null
     * @post result.exists()
     */
    File convertToFile(File excelFile, File outputDir, VendorConfig vendorConfig) throws IOException, UnsupportedFormatException, InvalidFileException;

    /**
     * Преобразует Excel-файл в JSON-файл с дополнительными параметрами.
     *
     * @param excelFile Excel-файл для преобразования
     * @param outputDir Директория для сохранения результата
     * @param config Конфигурация конвертации
     * @return Созданный JSON-файл
     * @throws IOException Если произошла ошибка при чтении или записи файла
     * @throws UnsupportedFormatException Если формат файла не поддерживается
     * @throws InvalidFileException Если файл поврежден или имеет неверную структуру
     * @throws InvalidConfigurationException Если конфигурация содержит несовместимые параметры
     *
     * @pre excelFile != null
     * @pre excelFile.exists()
     * @pre excelFile.canRead()
     * @pre outputDir != null
     * @pre outputDir.exists()
     * @pre outputDir.isDirectory()
     * @pre outputDir.canWrite()
     * @pre config != null
     * @post result != null
     * @post result.exists()
     */
    File convertToFile(File excelFile, File outputDir, ConverterConfig config) throws IOException, UnsupportedFormatException, InvalidFileException, InvalidConfigurationException;

    /**
     * Преобразует Excel-файл в JSON-файл с использованием конфигурации вендора и дополнительных параметров.
     *
     * @param excelFile Excel-файл для преобразования
     * @param outputDir Директория для сохранения результата
     * @param vendorConfig Конфигурация вендора для маппинга полей
     * @param converterConfig Конфигурация конвертации
     * @return Созданный JSON-файл
     * @throws IOException Если произошла ошибка при чтении или записи файла
     * @throws UnsupportedFormatException Если формат файла не поддерживается
     * @throws InvalidFileException Если файл поврежден или имеет неверную структуру
     * @throws InvalidConfigurationException Если конфигурация содержит несовместимые параметры
     *
     * @pre excelFile != null
     * @pre excelFile.exists()
     * @pre excelFile.canRead()
     * @pre outputDir != null
     * @pre outputDir.exists()
     * @pre outputDir.isDirectory()
     * @pre outputDir.canWrite()
     * @pre vendorConfig != null
     * @pre converterConfig != null
     * @post result != null
     * @post result.exists()
     */
    File convertToFile(File excelFile, File outputDir, VendorConfig vendorConfig, ConverterConfig converterConfig) throws IOException, UnsupportedFormatException, InvalidFileException, InvalidConfigurationException;

    /**
     * Возвращает метаданные о последней операции конвертации.
     *
     * @return Объект ConversionMetadata с информацией о процессе конвертации
     *
     * @pre была выполнена хотя бы одна операция конвертации
     * @post result != null
     */
    ConversionMetadata getMetadata();
}

/**
 * Класс для хранения метаданных о процессе конвертации.
 *
 * Содержит информацию о входном и выходном файлах, статистику обработки,
 * предупреждения и другие метаданные, полезные для анализа процесса конвертации.
 */
public class ConversionMetadata {
    private final String sourceFileName;
    private final String outputFileName;
    private final int totalRows;
    private final int processedRows;
    private final int skippedRows;
    private final int errorRows;
    private final long processingTimeMs;
    private final long inputFileSizeBytes;
    private final long outputFileSizeBytes;
    private final List<String> warnings;
    private final List<String> errors;
    private final String vendorName;
    private final String detectedFormat;
    private final String encoding;
    private final Map<String, Integer> columnStats;
    private final Map<String, Object> additionalInfo;
    private final boolean chunked;
    private final int totalChunks;
    private final int processedChunks;
    private final ConverterConfig usedConfig;
    private final VendorConfig usedVendorConfig;

    // Геттеры и конструктор
}

/**
 * Класс для конфигурации процесса конвертации.
 *
 * Позволяет настроить различные аспекты процесса конвертации, включая кодировку,
 * форматирование, разбиение на части и другие параметры.
 */
public class ConverterConfig {
    /**
     * Режим обработки ошибок при конвертации.
     */
    public enum ErrorHandlingMode {
        /** Остановка при первой ошибке */
        FAIL_FAST,
        /** Пропуск ошибочных строк */
        SKIP_ERRORS,
        /** Замена ошибочных значений на значения по умолчанию */
        REPLACE_WITH_DEFAULT
    }

    /**
     * Формат выходного JSON.
     */
    public enum OutputFormat {
        /** Один объект JSON на строку */
        JSON_LINES,
        /** Массив JSON-объектов */
        JSON_ARRAY,
        /** Объект JSON с массивом в поле "items" */
        JSON_OBJECT_WITH_ITEMS
    }

    private final String encoding;
    private final String delimiter;
    private final String sheetName;
    private final Integer sheetIndex;
    private final Integer chunkSize;
    private final boolean gzipOutput;
    private final boolean prettyPrint;
    private final boolean minified;
    private final Integer maxChunks;
    private final ErrorHandlingMode errorHandlingMode;
    private final OutputFormat outputFormat;
    private final boolean includeHeaders;
    private final boolean detectFormat;
    private final boolean skipEmptyRows;
    private final boolean skipEmptyColumns;
    private final boolean trimValues;
    private final int numThreads;
    private final Map<String, Object> formatSpecificOptions;
    private final String dateFormat;
    private final String numberFormat;
    private final boolean includeMetadata;
    private final String outputFileNamePattern;

    // Геттеры и конструктор

    /**
     * Создает билдер для конфигурации.
     *
     * @return Билдер для ConverterConfig
     */
    public static Builder builder() {
        return new Builder();
    }

    /**
     * Билдер для ConverterConfig.
     */
    public static class Builder {
        private String encoding = "UTF-8";
        private String delimiter = ",";
        private String sheetName = null;
        private Integer sheetIndex = null;
        private Integer chunkSize = 1000;
        private boolean gzipOutput = false;
        private boolean prettyPrint = true;
        private boolean minified = false;
        private Integer maxChunks = null;
        private ErrorHandlingMode errorHandlingMode = ErrorHandlingMode.SKIP_ERRORS;
        private OutputFormat outputFormat = OutputFormat.JSON_ARRAY;
        private boolean includeHeaders = true;
        private boolean detectFormat = true;
        private boolean skipEmptyRows = true;
        private boolean skipEmptyColumns = true;
        private boolean trimValues = true;
        private int numThreads = Runtime.getRuntime().availableProcessors();
        private Map<String, Object> formatSpecificOptions = new HashMap<>();
        private String dateFormat = "yyyy-MM-dd";
        private String numberFormat = "#.##";
        private boolean includeMetadata = true;
        private String outputFileNamePattern = "{basename}.json";

        // Методы для установки параметров

        /**
         * Устанавливает кодировку для чтения файлов.
         *
         * @param encoding Кодировка (UTF-8, CP1251 и т.д.)
         * @return Текущий билдер
         */
        public Builder encoding(String encoding) {
            this.encoding = encoding;
            return this;
        }

        /**
         * Устанавливает разделитель для CSV-файлов.
         *
         * @param delimiter Разделитель (",", ";", "\t" и т.д.)
         * @return Текущий билдер
         */
        public Builder delimiter(String delimiter) {
            this.delimiter = delimiter;
            return this;
        }

        // Другие методы для установки параметров...

        /**
         * Создает объект ConverterConfig.
         *
         * @return Объект ConverterConfig
         * @throws InvalidConfigurationException Если конфигурация содержит несовместимые параметры
         */
        public ConverterConfig build() throws InvalidConfigurationException {
            validateConfiguration();
            return new ConverterConfig(
                encoding, delimiter, sheetName, sheetIndex, chunkSize,
                gzipOutput, prettyPrint, minified, maxChunks,
                errorHandlingMode, outputFormat, includeHeaders, detectFormat,
                skipEmptyRows, skipEmptyColumns, trimValues, numThreads,
                formatSpecificOptions, dateFormat, numberFormat,
                includeMetadata, outputFileNamePattern
            );
        }

        /**
         * Проверяет конфигурацию на наличие несовместимых параметров.
         *
         * @throws InvalidConfigurationException Если конфигурация содержит несовместимые параметры
         */
        private void validateConfiguration() throws InvalidConfigurationException {
            if (prettyPrint && minified) {
                throw new InvalidConfigurationException("prettyPrint and minified cannot be both true");
            }

            if (sheetName != null && sheetIndex != null) {
                throw new InvalidConfigurationException("sheetName and sheetIndex cannot be both specified");
            }

            if (chunkSize != null && chunkSize <= 0) {
                throw new InvalidConfigurationException("chunkSize must be positive");
            }

            if (maxChunks != null && maxChunks <= 0) {
                throw new InvalidConfigurationException("maxChunks must be positive");
            }

            if (numThreads <= 0) {
                throw new InvalidConfigurationException("numThreads must be positive");
            }
        }
    }
}
```

## Предусловия и постусловия

### convert(File excelFile)
- **Предусловия**:
  - excelFile != null
  - excelFile.exists()
  - excelFile.canRead()
- **Постусловия**:
  - result != null

### convertToFile(File excelFile, File outputDir)
- **Предусловия**:
  - excelFile != null
  - excelFile.exists()
  - excelFile.canRead()
  - outputDir != null
  - outputDir.exists()
  - outputDir.isDirectory()
  - outputDir.canWrite()
- **Постусловия**:
  - result != null
  - result.exists()

### convertToFile(File excelFile, File outputDir, ConverterConfig config)
- **Предусловия**:
  - excelFile != null
  - excelFile.exists()
  - excelFile.canRead()
  - outputDir != null
  - outputDir.exists()
  - outputDir.isDirectory()
  - outputDir.canWrite()
  - config != null
- **Постусловия**:
  - result != null
  - result.exists()

### getMetadata()
- **Предусловия**:
  - была выполнена хотя бы одна операция конвертации
- **Постусловия**:
  - result != null

## Инварианты
- Конвертер должен сохранять все данные из исходного файла (не должен терять информацию)
- Конвертер должен корректно обрабатывать кириллические символы
- Конвертер должен корректно обрабатывать пустые ячейки и строки
- Конвертер должен генерировать валидный JSON, соответствующий схеме
- Конвертер должен корректно обрабатывать все поддерживаемые форматы файлов
- Конвертер должен корректно применять маппинг полей из конфигурации вендора
- Конвертер должен обеспечивать потоковую обработку для минимизации использования памяти
- Конвертер должен корректно обрабатывать различные типы данных (числа, даты, строки, булевы значения)
- Конвертер должен предоставлять точную информацию о прогрессе и статистике конвертации

## Исключения
- **IOException**: если произошла ошибка при чтении или записи файла
- **IllegalArgumentException**: если нарушены предусловия методов
- **IllegalStateException**: если метод getMetadata() вызван до выполнения операции конвертации
- **UnsupportedFormatException**: если формат файла не поддерживается
- **InvalidFileException**: если файл поврежден или имеет неверную структуру
- **InvalidConfigurationException**: если конфигурация содержит несовместимые параметры
- **OutOfMemoryError**: если файл слишком большой и не хватает памяти для его обработки (реализации должны предотвращать это путем потоковой обработки и разбиения на части)

## Примеры использования
```java
// Пример использования метода convert с обработкой исключений
File excelFile = new File("input.xlsx");
Converter converter = new ExcelConverter();
try {
    try (Stream<JSONObject> jsonStream = converter.convert(excelFile)) {
        jsonStream.forEach(System.out::println);
    }
} catch (UnsupportedFormatException e) {
    System.err.println("Unsupported file format: " + e.getMessage());
} catch (InvalidFileException e) {
    System.err.println("Invalid file structure: " + e.getMessage());
} catch (IOException e) {
    System.err.println("I/O error: " + e.getMessage());
}

// Пример использования метода convert с конфигурацией вендора
File excelFile = new File("input.xlsx");
Converter converter = new ExcelConverter();

// Создание конфигурации вендора
Map<String, String> mapping = Map.of(
    "Изображения", "images",
    "Название", "title",
    "Артикул", "sku",
    "Цена", "price",
    "Автор", "author",
    "ISBN", "isbn"
);
VendorConfig vendorConfig = new VendorConfig(
    "book24",
    mapping,
    Arrays.asList("Наличие", "Бренд"),
    0.9,
    "exact",
    Arrays.asList("ISBN", "Артикул"),
    Map.of("filename_pattern", "book24.*\\.xlsx")
);

try (Stream<JSONObject> jsonStream = converter.convert(excelFile, vendorConfig)) {
    jsonStream.forEach(System.out::println);
}

// Пример использования метода convertToFile
File excelFile = new File("input.xlsx");
File outputDir = new File("output");
Converter converter = new ExcelConverter();
File jsonFile = converter.convertToFile(excelFile, outputDir);
System.out.println("JSON file created: " + jsonFile.getAbsolutePath());

// Пример использования метода convertToFile с расширенной конфигурацией
File excelFile = new File("large_input.xlsx");
File outputDir = new File("output");

try {
    ConverterConfig config = ConverterConfig.builder()
        .encoding("UTF-8")
        .delimiter(",")
        .sheetName("Sheet1")
        .chunkSize(1000)
        .maxChunks(10)
        .gzipOutput(true)
        .prettyPrint(false)
        .errorHandlingMode(ConverterConfig.ErrorHandlingMode.SKIP_ERRORS)
        .outputFormat(ConverterConfig.OutputFormat.JSON_LINES)
        .includeHeaders(true)
        .skipEmptyRows(true)
        .trimValues(true)
        .numThreads(4)
        .dateFormat("yyyy-MM-dd")
        .outputFileNamePattern("{basename}_{timestamp}.json")
        .build();

    File jsonFile = converter.convertToFile(excelFile, outputDir, config);
    System.out.println("JSON file created: " + jsonFile.getAbsolutePath());
} catch (InvalidConfigurationException e) {
    System.err.println("Invalid configuration: " + e.getMessage());
}

// Пример использования метода convertToFile с конфигурацией вендора и конвертера
File excelFile = new File("input.xlsx");
File outputDir = new File("output");
Converter converter = new ExcelConverter();

try {
    // Создание конфигурации вендора и конвертера
    VendorConfig vendorConfig = /* см. пример выше */;
    ConverterConfig converterConfig = ConverterConfig.builder()
        .chunkSize(500)
        .outputFormat(ConverterConfig.OutputFormat.JSON_ARRAY)
        .build();

    File jsonFile = converter.convertToFile(excelFile, outputDir, vendorConfig, converterConfig);
    System.out.println("JSON file created: " + jsonFile.getAbsolutePath());
} catch (Exception e) {
    System.err.println("Error: " + e.getMessage());
}

// Пример получения и анализа метаданных
try {
    ConversionMetadata metadata = converter.getMetadata();
    System.out.println("Source file: " + metadata.getSourceFileName());
    System.out.println("Output file: " + metadata.getOutputFileName());
    System.out.println("Total rows: " + metadata.getTotalRows());
    System.out.println("Processed rows: " + metadata.getProcessedRows());
    System.out.println("Skipped rows: " + metadata.getSkippedRows());
    System.out.println("Error rows: " + metadata.getErrorRows());
    System.out.println("Processing time: " + metadata.getProcessingTimeMs() + " ms");
    System.out.println("Input file size: " + metadata.getInputFileSizeBytes() + " bytes");
    System.out.println("Output file size: " + metadata.getOutputFileSizeBytes() + " bytes");
    System.out.println("Vendor: " + metadata.getVendorName());
    System.out.println("Detected format: " + metadata.getDetectedFormat());

    // Анализ предупреждений и ошибок
    System.out.println("\nWarnings:");
    metadata.getWarnings().forEach(warning -> System.out.println("- " + warning));

    System.out.println("\nErrors:");
    metadata.getErrors().forEach(error -> System.out.println("- " + error));

    // Анализ статистики по колонкам
    System.out.println("\nColumn statistics:");
    metadata.getColumnStats().forEach((column, count) ->
        System.out.println(column + ": " + count + " values"));
} catch (IllegalStateException e) {
    System.err.println("Metadata not available: " + e.getMessage());
}
```

## Реализации
- **ExcelConverter**: основная реализация, использующая Apache POI для работы с Excel-файлами
- **PandasExcelConverter**: реализация, использующая pandas для работы с Excel-файлами (через JNI)
- **Xlsx2csvConverter**: реализация, использующая xlsx2csv для работы с большими Excel-файлами
- **StreamingExcelConverter**: реализация, оптимизированная для потоковой обработки больших файлов с минимальным использованием памяти
- **EasyExcelConverter**: реализация, использующая библиотеку EasyExcel для эффективной работы с Excel-файлами
- **MultiFormatConverter**: реализация, поддерживающая различные форматы файлов с автоматическим определением формата

## Связанные контракты
- [Converter Architecture Contract](../../Converter-Architecture-Contract.md)
- [JSON Schema](../../data/json-schema/converter-output-schema.json)
- [VendorDetector Contract](./vendor-detector.md)
- [VendorConfig Contract](./vendor-config.md)
- [ExcelToJsonConverter Contract](./excel-to-json-converter.md)
- [JsonCleaner Contract](./json-cleaner.md)
- [ETL Process Contract](../../ETL-Process-Contract.md)
- [DatabaseLoader Contract](../database-loader/contract.md)

## Исключения

```java
/**
 * Исключение, выбрасываемое при попытке обработать файл неподдерживаемого формата.
 */
public class UnsupportedFormatException extends Exception {
    private final String format;

    public UnsupportedFormatException(String format, String message) {
        super(message);
        this.format = format;
    }

    public String getFormat() {
        return format;
    }
}

/**
 * Исключение, выбрасываемое при обработке поврежденного или некорректного файла.
 */
public class InvalidFileException extends Exception {
    private final String filePath;

    public InvalidFileException(String filePath, String message) {
        super(message);
        this.filePath = filePath;
    }

    public String getFilePath() {
        return filePath;
    }
}

/**
 * Исключение, выбрасываемое при некорректной конфигурации.
 */
public class InvalidConfigurationException extends Exception {
    public InvalidConfigurationException(String message) {
        super(message);
    }
}
```
