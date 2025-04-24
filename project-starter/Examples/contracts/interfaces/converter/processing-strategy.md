# Контракт: ExcelProcessingStrategy - Общий интерфейс

## Метаданные
- **Версия**: 1.0.0
- **Статус**: Стабильный
- **Последнее обновление**: 2023-11-08
- **Последний редактор**: AI
- **Ветка разработки**: feature/adaptive-processing

## История изменений
| Дата | Версия | Автор | Описание изменений | PR |
|------|--------|-------|-------------------|-----|
| 2023-11-08 | 1.0.0 | AI | Начальная версия | - |

## Описание
ExcelProcessingStrategy определяет общий интерфейс для различных стратегий обработки Excel-файлов при конвертации в JSON. Стратегии инкапсулируют алгоритмы обработки, которые могут быть выбраны в зависимости от размера файла, доступных ресурсов и других характеристик.

Данный интерфейс обеспечивает единую точку взаимодействия для ExcelToJsonConverter при применении различных стратегий обработки (стандартной, гибридной, сегментированной), позволяя адаптивно выбирать оптимальный способ обработки Excel-файлов.

## Интерфейс

```java
/**
 * Общий интерфейс для различных стратегий обработки Excel-файлов.
 * Определяет контракт для всех конкретных стратегий.
 */
public interface ExcelProcessingStrategy {
    /**
     * Подготавливает стратегию к работе.
     * Выполняет анализ файла, инициализацию ресурсов и другие подготовительные действия.
     *
     * @param excelFile файл Excel для анализа
     * @throws IOException при ошибке доступа к файлу
     * @throws UnsupportedFormatException если формат файла не поддерживается
     * @throws InvalidFileException если файл поврежден или имеет неверную структуру
     *
     * @pre excelFile != null
     * @pre excelFile.exists()
     * @pre excelFile.canRead()
     */
    void prepare(File excelFile) throws IOException, UnsupportedFormatException, InvalidFileException;

    /**
     * Обрабатывает Excel-файл и возвращает поток JSON-объектов.
     *
     * @param excelFile файл Excel для обработки
     * @return поток JSON-объектов
     * @throws IOException при ошибке доступа к файлу
     * @throws UnsupportedFormatException если формат файла не поддерживается
     * @throws InvalidFileException если файл поврежден или имеет неверную структуру
     *
     * @pre excelFile != null
     * @pre excelFile.exists()
     * @pre excelFile.canRead()
     * @post result != null
     */
    Stream<JSONObject> process(File excelFile) throws IOException, UnsupportedFormatException, InvalidFileException;

    /**
     * Обрабатывает Excel-файл и создает JSON-файл.
     *
     * @param excelFile файл Excel для обработки
     * @param outputFile выходной JSON-файл
     * @throws IOException при ошибке доступа к файлу
     * @throws UnsupportedFormatException если формат файла не поддерживается
     * @throws InvalidFileException если файл поврежден или имеет неверную структуру
     *
     * @pre excelFile != null
     * @pre excelFile.exists()
     * @pre excelFile.canRead()
     * @pre outputFile != null
     * @pre outputFile.getParentFile().exists() || outputFile.getParentFile().mkdirs()
     * @post outputFile.exists()
     */
    void processToFile(File excelFile, File outputFile) throws IOException, UnsupportedFormatException, InvalidFileException;

    /**
     * Возвращает имя стратегии.
     *
     * @return строковое представление имени стратегии
     * @post result != null
     */
    String getName();

    /**
     * Проверяет применимость стратегии для указанного файла.
     * Стратегия оценивает свою применимость на основе характеристик файла.
     *
     * @param excelFile файл Excel для оценки
     * @return значение применимости (0.0-1.0), где более высокое значение означает более подходящую стратегию
     * @throws IOException при ошибке доступа к файлу
     *
     * @pre excelFile != null
     * @pre excelFile.exists()
     * @pre excelFile.canRead()
     * @post result >= 0.0 && result <= 1.0
     */
    double evaluateSuitability(File excelFile) throws IOException;

    /**
     * Возвращает метаданные обработки.
     *
     * @return метаданные обработки
     * @throws IllegalStateException если обработка еще не была выполнена
     *
     * @pre обработка была выполнена
     * @post result != null
     */
    ProcessingMetadata getMetadata();

    /**
     * Устанавливает обработчик прогресса.
     *
     * @param progressHandler обработчик прогресса
     * @return текущий экземпляр стратегии для цепочки вызовов
     *
     * @pre progressHandler != null
     * @post установлен обработчик прогресса
     */
    ExcelProcessingStrategy setProgressHandler(Consumer<ProgressInfo> progressHandler);

    /**
     * Устанавливает имя листа для обработки.
     *
     * @param sheetName имя листа (null для первого листа)
     * @return текущий экземпляр стратегии для цепочки вызовов
     *
     * @post установлено имя листа
     */
    ExcelProcessingStrategy setSheetName(String sheetName);

    /**
     * Очищает все ресурсы, используемые стратегией.
     * Вызывается после завершения обработки.
     */
    void cleanup();

    /**
     * Прерывает текущую обработку.
     * Должна корректно освобождать ресурсы.
     */
    void abort();
}

/**
 * Метаданные процесса обработки.
 * Содержит информацию о выполненной обработке.
 */
public class ProcessingMetadata {
    /**
     * Количество обработанных строк.
     */
    private int processedRows;

    /**
     * Общее количество строк в файле.
     */
    private int totalRows;

    /**
     * Время обработки в миллисекундах.
     */
    private long processingTimeMs;

    /**
     * Размер входного файла в байтах.
     */
    private long inputFileSizeBytes;

    /**
     * Размер выходного файла в байтах.
     */
    private long outputFileSizeBytes;

    /**
     * Количество чанков/сегментов (для стратегий с разделением данных).
     */
    private int totalChunks;

    /**
     * Пиковое использование памяти в байтах.
     */
    private long peakMemoryUsageBytes;

    /**
     * Имя используемой стратегии обработки.
     */
    private String strategyName;

    /**
     * Любые дополнительные свойства, специфичные для стратегии.
     */
    private Map<String, Object> additionalProperties;

    // Геттеры для всех полей

    /**
     * Добавляет дополнительное свойство.
     *
     * @param key ключ свойства
     * @param value значение свойства
     */
    public void addProperty(String key, Object value);

    /**
     * Получает дополнительное свойство.
     *
     * @param key ключ свойства
     * @return значение свойства или null, если свойство не существует
     */
    public Object getProperty(String key);
}

/**
 * Информация о прогрессе обработки.
 * Предоставляет текущую информацию о ходе выполнения процесса.
 */
public class ProgressInfo {
    /**
     * Количество обработанных строк.
     */
    private int processedRows;

    /**
     * Общее количество строк (если известно, иначе -1).
     */
    private int totalRows;

    /**
     * Текущий этап обработки.
     */
    private String currentStage;

    /**
     * Скорость обработки (строк в секунду).
     */
    private double rowsPerSecond;

    /**
     * Прошедшее время в миллисекундах.
     */
    private long elapsedTimeMs;

    /**
     * Оценка оставшегося времени в миллисекундах (если возможно рассчитать, иначе -1).
     */
    private long estimatedRemainingTimeMs;

    /**
     * Текущая фаза обработки.
     */
    private ProcessingPhase phase;

    /**
     * Дополнительная информация, специфичная для стратегии.
     * Например, для сегментированной стратегии это может быть информация о текущем сегменте.
     */
    private Map<String, Object> additionalInfo;

    // Геттеры для всех полей

    /**
     * Добавляет дополнительную информацию.
     *
     * @param key ключ
     * @param value значение
     */
    public void addInfo(String key, Object value);

    /**
     * Получает дополнительную информацию.
     *
     * @param key ключ
     * @return значение или null, если информация не существует
     */
    public Object getInfo(String key);
}

/**
 * Фаза процесса обработки.
 */
public enum ProcessingPhase {
    /**
     * Анализ файла.
     */
    ANALYZING,

    /**
     * Подготовка к обработке.
     */
    PREPARING,

    /**
     * Чтение данных.
     */
    READING,

    /**
     * Обработка данных.
     */
    PROCESSING,

    /**
     * Запись результата.
     */
    WRITING,

    /**
     * Очистка и оптимизация.
     */
    CLEANING,

    /**
     * Завершение.
     */
    FINALIZING
}
```

## Фабрика стратегий

```java
/**
 * Фабрика стратегий обработки Excel-файлов.
 * Создает и возвращает наиболее подходящую стратегию обработки.
 */
public class ExcelProcessingStrategyFactory {
    /**
     * Создает стратегию обработки для указанного режима.
     *
     * @param mode режим обработки
     * @param resourceConstraints ограничения ресурсов
     * @return экземпляр стратегии обработки
     *
     * @pre mode != null
     * @pre resourceConstraints != null
     * @post result != null
     */
    public static ExcelProcessingStrategy createStrategy(ProcessingMode mode, ResourceConstraints resourceConstraints);

    /**
     * Выбирает наиболее подходящую стратегию для указанного файла.
     *
     * @param excelFile файл Excel для оценки
     * @param resourceConstraints ограничения ресурсов
     * @return наиболее подходящая стратегия обработки
     * @throws IOException при ошибке доступа к файлу
     *
     * @pre excelFile != null
     * @pre excelFile.exists()
     * @pre excelFile.canRead()
     * @pre resourceConstraints != null
     * @post result != null
     */
    public static ExcelProcessingStrategy selectBestStrategy(File excelFile, ResourceConstraints resourceConstraints) throws IOException;

    /**
     * Получает список доступных стратегий.
     *
     * @return список доступных стратегий
     * @post result != null
     * @post result.size() > 0
     */
    public static List<ExcelProcessingStrategy> getAvailableStrategies();
}
```

## Конкретные реализации стратегий

В системе предусмотрены следующие конкретные реализации стратегий обработки:

1. **StandardProcessingStrategy**
   - Использует стандартный подход обработки Excel-файла целиком в памяти
   - Оптимальна для небольших файлов (до 100 МБ)
   - Обеспечивает максимальную скорость обработки
   - Подробности: [StandardProcessingStrategy.md](./standard-processing-strategy.md)

2. **HybridProcessingStrategy**
   - Сочетает преимущества потоковой обработки и работы с памятью
   - Оптимальна для средних файлов (100-500 МБ)
   - Балансирует между скоростью и использованием памяти
   - Подробности: [HybridProcessingStrategy.md](./hybrid-processing-strategy.md)

3. **SegmentedProcessingStrategy**
   - Разделяет обработку на сегменты с сохранением промежуточных результатов
   - Оптимальна для сверхбольших файлов (более 500 МБ)
   - Гарантирует минимальное использование памяти
   - Подробности: [SegmentedProcessingStrategy.md](./segmented-excel-converter.md)

## Механизм выбора стратегии

Выбор стратегии обработки основан на нескольких факторах:

1. **Размер файла**:
   - До 100 МБ: StandardProcessingStrategy
   - 100-500 МБ: HybridProcessingStrategy
   - Более 500 МБ: SegmentedProcessingStrategy

2. **Доступная память**:
   - Если доступной памяти недостаточно для выбранной по размеру стратегии, выбирается более экономичная стратегия

3. **Сложность файла**:
   - Анализируется структура файла: количество листов, типы данных, форматирование
   - Более сложные файлы могут обрабатываться более надежными стратегиями даже при относительно небольшом размере

4. **Предыдущие ошибки**:
   - Если предыдущие попытки обработки файла определенной стратегией завершились ошибкой, выбирается более надежная стратегия

5. **Пользовательские ограничения**:
   - Учитываются ограничения, заданные пользователем через ResourceConstraints

## Примеры использования

```java
// Создание стратегии с явным указанием режима
ExcelProcessingStrategy strategy = ExcelProcessingStrategyFactory.createStrategy(
    ProcessingMode.SEGMENTED,
    new ResourceConstraints(256 * 1024 * 1024, 4) // 256 МБ памяти, 4 потока
);

// Настройка стратегии
strategy
    .setSheetName("Products")
    .setProgressHandler(progress -> {
        System.out.printf("Processed %d rows (%.2f%%). Stage: %s\n",
            progress.getProcessedRows(),
            progress.getTotalRows() > 0 ?
                progress.getProcessedRows() * 100.0 / progress.getTotalRows() : 0,
            progress.getCurrentStage()
        );
    });

// Использование стратегии
File excelFile = new File("path/to/huge_file.xlsx");
File outputFile = new File("path/to/output.json");

try {
    strategy.processToFile(excelFile, outputFile);

    // Получение метаданных обработки
    ProcessingMetadata metadata = strategy.getMetadata();
    System.out.printf("Processed %d rows in %d ms. Strategy: %s\n",
        metadata.getProcessedRows(),
        metadata.getProcessingTimeMs(),
        metadata.getStrategyName()
    );
} catch (IOException | UnsupportedFormatException | InvalidFileException e) {
    e.printStackTrace();
} finally {
    // Очистка ресурсов
    strategy.cleanup();
}
```

```java
// Автоматический выбор наиболее подходящей стратегии
File excelFile = new File("path/to/some_excel.xlsx");
ResourceConstraints constraints = new ResourceConstraints(512 * 1024 * 1024, 8); // 512 МБ, 8 потоков

try {
    ExcelProcessingStrategy strategy = ExcelProcessingStrategyFactory.selectBestStrategy(
        excelFile, constraints
    );

    System.out.println("Selected strategy: " + strategy.getName());

    // Использование выбранной стратегии
    strategy.processToFile(excelFile, new File("path/to/output.json"));
} catch (IOException e) {
    e.printStackTrace();
}
```

## Исключения

- **IOException**: при ошибке доступа к файлу
- **UnsupportedFormatException**: если формат файла не поддерживается
- **InvalidFileException**: если файл поврежден или имеет неверную структуру
- **IllegalArgumentException**: если нарушены предусловия методов
- **IllegalStateException**: при попытке получить метаданные до выполнения обработки
- **MemoryLimitExceededException**: если процесс обработки превышает ограничения памяти

## Связанные контракты

- [ExcelToJsonConverter Contract](./excel-to-json-converter.md) - Основной конвертер с адаптивными стратегиями
- [Converter Interface Contract](./contract.md) - Общий интерфейс для всех конвертеров
- [SegmentedProcessingStrategy](./segmented-excel-converter.md) - Сегментированная стратегия обработки
- [Data Cleaning Requirements](./data-cleaning-requirements.md) - Требования к очистке данных
- [Strategy Selection Requirements](./strategy-selection-requirements.md) - Требования к выбору стратегии
- [ETL Process Contract](../../ETL-Process-Contract.md) - Общий процесс ETL