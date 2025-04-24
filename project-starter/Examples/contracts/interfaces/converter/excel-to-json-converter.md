# Контракт: ExcelToJsonConverter

## Метаданные
- **Версия**: 2.1.0
- **Статус**: Стабильный
- **Последнее обновление**: 2023-11-09
- **Последний редактор**: AI
- **Ветка разработки**: feature/adaptive-processing

## История изменений
| Дата | Версия | Автор | Описание изменений | PR |
|------|--------|-------|-------------------|-----|
| 2025-04-15 | 1.0.0 | AI | Начальная версия | - |
| 2023-11-08 | 2.0.0 | AI | Добавлена поддержка адаптивных стратегий обработки | - |
| 2023-11-09 | 2.1.0 | AI | Уточнены требования к очистке данных и выбору стратегии | - |

## Описание
Класс ExcelToJsonConverter предоставляет высокопроизводительный механизм для конвертации Excel-файлов в JSON-формат с использованием библиотеки EasyExcel. Он поддерживает потоковую обработку файлов любого размера благодаря адаптивной системе выбора стратегии обработки.

Конвертер выбирает оптимальную стратегию обработки преимущественно на основе размера входного файла, с возможностью учета профиля вендора для оценки сложности данных. Это позволяет эффективно обрабатывать как небольшие файлы с минимальными накладными расходами, так и сверхбольшие файлы, вызывающие ошибки "Zip bomb detected" или проблемы с памятью.

### Адаптивные стратегии обработки

1. **Стандартная стратегия**:
   - Для файлов малого и среднего размера (по умолчанию до 100 МБ)
   - Оптимизирована для скорости обработки
   - Минимальные накладные расходы

2. **Гибридная стратегия**:
   - Для файлов среднего размера (по умолчанию 100-500 МБ)
   - Многопоточная обработка с оптимизацией использования памяти
   - Баланс между скоростью и потреблением ресурсов

3. **Сегментированная стратегия**:
   - Для сверхбольших файлов (по умолчанию более 500 МБ)
   - Разделение на сегменты с контрольными точками
   - Минимальное использование памяти и устойчивость к ошибкам

## Интерфейс
```java
/**
 * Высокопроизводительный конвертер Excel в JSON с адаптивной стратегией обработки.
 * Поддерживает обработку файлов любого размера с оптимальным использованием ресурсов.
 */
public class ExcelToJsonConverter implements Converter {
    /**
     * Создает новый экземпляр конвертера.
     *
     * @param excelFilePath путь к Excel-файлу
     * @param jsonFilePath путь к выходному JSON-файлу
     * @param batchSize размер пакета для обработки (рекомендуется 1000 для стандартной обработки, 50000-100000 для сегментированной)
     *
     * @pre excelFilePath != null
     * @pre !excelFilePath.isEmpty()
     * @pre jsonFilePath != null
     * @pre !jsonFilePath.isEmpty()
     * @pre batchSize > 0
     */
    public ExcelToJsonConverter(String excelFilePath, String jsonFilePath, int batchSize);

    /**
     * Создает новый экземпляр конвертера с указанием имени листа.
     *
     * @param excelFilePath путь к Excel-файлу
     * @param jsonFilePath путь к выходному JSON-файлу
     * @param batchSize размер пакета для обработки
     * @param sheetName имя листа для обработки (может быть null для первого листа)
     *
     * @pre excelFilePath != null
     * @pre !excelFilePath.isEmpty()
     * @pre jsonFilePath != null
     * @pre !jsonFilePath.isEmpty()
     * @pre batchSize > 0
     */
    public ExcelToJsonConverter(String excelFilePath, String jsonFilePath, int batchSize, String sheetName);

    /**
     * Выполняет конвертацию Excel в JSON с автоматическим выбором стратегии.
     *
     * @throws IOException если произошла ошибка ввода-вывода
     * @throws UnsupportedFormatException если формат файла не поддерживается
     * @throws InvalidFileException если файл поврежден или имеет неверную структуру
     *
     * @pre Файл по пути excelFilePath существует и доступен для чтения
     * @pre Директория для jsonFilePath существует и доступна для записи
     * @post Файл по пути jsonFilePath создан и содержит данные из Excel-файла в формате JSON
     */
    public void convert() throws IOException, UnsupportedFormatException, InvalidFileException;

    /**
     * Устанавливает режим обработки файла.
     * При значении AUTO конвертер сам выбирает оптимальную стратегию.
     *
     * @param processingMode режим обработки (AUTO, STANDARD, HYBRID, SEGMENTED)
     * @return текущий экземпляр конвертера для цепочки вызовов
     */
    public ExcelToJsonConverter setProcessingMode(ProcessingMode processingMode);

    /**
     * Устанавливает конфигурацию ресурсов для обработки.
     *
     * @param resourceConstraints ограничения по использованию ресурсов
     * @return текущий экземпляр конвертера для цепочки вызовов
     *
     * @pre resourceConstraints != null
     */
    public ExcelToJsonConverter setResourceConstraints(ResourceConstraints resourceConstraints);

    /**
     * Устанавливает пороги для выбора стратегии в режиме AUTO.
     *
     * @param thresholds пороги для выбора стратегии
     * @return текущий экземпляр конвертера для цепочки вызовов
     *
     * @pre thresholds != null
     */
    public ExcelToJsonConverter setStrategyThresholds(StrategyThresholds thresholds);

    /**
     * Устанавливает директорию для временных файлов при сегментированной обработке.
     *
     * @param tempDir директория для временных файлов
     * @return текущий экземпляр конвертера для цепочки вызовов
     *
     * @pre tempDir != null
     */
    public ExcelToJsonConverter setTempDirectory(String tempDir);

    /**
     * Устанавливает директорию для контрольных точек при сегментированной обработке.
     *
     * @param checkpointsDir директория для контрольных точек
     * @param createCheckpoints флаг создания контрольных точек
     * @return текущий экземпляр конвертера для цепочки вызовов
     *
     * @pre checkpointsDir != null (если createCheckpoints == true)
     */
    public ExcelToJsonConverter setCheckpoints(String checkpointsDir, boolean createCheckpoints);

    /**
     * Устанавливает флаг сохранения временных файлов при сегментированной обработке.
     *
     * @param keepTempFiles true - сохранять временные файлы, false - удалять
     * @return текущий экземпляр конвертера для цепочки вызовов
     */
    public ExcelToJsonConverter setKeepTempFiles(boolean keepTempFiles);

    /**
     * Устанавливает обработчик прогресса конвертации.
     *
     * @param progressHandler обработчик прогресса
     * @return текущий экземпляр конвертера для цепочки вызовов
     *
     * @pre progressHandler != null
     */
    public ExcelToJsonConverter setProgressHandler(Consumer<ProgressInfo> progressHandler);

    /**
     * Возвращает метаданные о последней операции конвертации.
     *
     * @return Объект ConversionMetadata с информацией о процессе конвертации
     * @throws IllegalStateException если конвертация еще не была выполнена
     *
     * @pre была выполнена хотя бы одна операция конвертации
     * @post result != null
     */
    @Override
    public ConversionMetadata getMetadata();

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
    @Override
    public Stream<JSONObject> convert(File excelFile) throws IOException, UnsupportedFormatException, InvalidFileException;

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
    @Override
    public File convertToFile(File excelFile, File outputDir) throws IOException, UnsupportedFormatException, InvalidFileException;
}

/**
 * Режимы обработки файла Excel.
 */
public enum ProcessingMode {
    /**
     * Автоматический выбор стратегии обработки.
     */
    AUTO,

    /**
     * Стандартная стратегия обработки.
     * Оптимальна для файлов малого и среднего размера.
     */
    STANDARD,

    /**
     * Гибридная стратегия обработки.
     * Баланс между скоростью и использованием памяти.
     */
    HYBRID,

    /**
     * Сегментированная стратегия обработки.
     * Оптимальна для сверхбольших файлов.
     */
    SEGMENTED
}

/**
 * Информация о прогрессе конвертации.
 */
public class ProgressInfo {
    /**
     * Общее количество обработанных строк.
     */
    private int processedRows;

    /**
     * Общее количество строк в файле (если известно, иначе -1).
     */
    private int totalRows;

    /**
     * Текущий обрабатываемый сегмент (для сегментированной обработки).
     */
    private int currentSegment;

    /**
     * Общее количество сегментов (для сегментированной обработки, если известно, иначе -1).
     */
    private int totalSegments;

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
     * Текущая используемая стратегия обработки.
     */
    private ProcessingMode currentMode;

    // Геттеры для всех полей
}

/**
 * Ограничения по использованию ресурсов.
 */
public class ResourceConstraints {
    /**
     * Максимальное количество памяти в мегабайтах.
     * По умолчанию 75% доступной памяти JVM.
     */
    private long maxMemoryMB;

    /**
     * Максимальное количество дискового пространства в мегабайтах для временных файлов.
     * По умолчанию 10 ГБ.
     */
    private long maxDiskSpaceMB;

    /**
     * Создает новый экземпляр с ограничениями по умолчанию.
     */
    public ResourceConstraints();

    /**
     * Создает новый экземпляр с указанными ограничениями.
     *
     * @param maxMemoryMB максимальное количество памяти в мегабайтах
     * @param maxDiskSpaceMB максимальное количество дискового пространства в мегабайтах
     *
     * @pre maxMemoryMB > 0
     * @pre maxDiskSpaceMB > 0
     */
    public ResourceConstraints(long maxMemoryMB, long maxDiskSpaceMB);

    // Геттеры и сеттеры для всех полей
}

/**
 * Пороги для выбора стратегии обработки.
 */
public class StrategyThresholds {
    /**
     * Порог размера файла в мегабайтах для перехода от стандартной к гибридной стратегии.
     * По умолчанию 100 МБ.
     */
    private long standardToHybridMB;

    /**
     * Порог размера файла в мегабайтах для перехода от гибридной к сегментированной стратегии.
     * По умолчанию 500 МБ.
     */
    private long hybridToSegmentedMB;

    /**
     * Порог сложности файла (0.0-1.0) для агрессивной сегментации.
     * Высокие значения означают более сложный файл, требующий более агрессивной сегментации.
     * По умолчанию 0.7.
     */
    private double complexityThreshold;

    /**
     * Создает новый экземпляр с порогами по умолчанию.
     */
    public StrategyThresholds();

    /**
     * Создает новый экземпляр с указанными порогами.
     *
     * @param standardToHybridMB порог для перехода от стандартной к гибридной стратегии
     * @param hybridToSegmentedMB порог для перехода от гибридной к сегментированной стратегии
     *
     * @pre standardToHybridMB > 0
     * @pre hybridToSegmentedMB > standardToHybridMB
     */
    public StrategyThresholds(long standardToHybridMB, long hybridToSegmentedMB);

    /**
     * Создает новый экземпляр с указанными порогами и порогом сложности.
     *
     * @param standardToHybridMB порог для перехода от стандартной к гибридной стратегии
     * @param hybridToSegmentedMB порог для перехода от гибридной к сегментированной стратегии
     * @param complexityThreshold порог сложности файла
     *
     * @pre standardToHybridMB > 0
     * @pre hybridToSegmentedMB > standardToHybridMB
     * @pre complexityThreshold >= 0.0
     * @pre complexityThreshold <= 1.0
     */
    public StrategyThresholds(long standardToHybridMB, long hybridToSegmentedMB, double complexityThreshold);

    // Геттеры и сеттеры для всех полей
}
```

## Предусловия и постусловия

### ExcelToJsonConverter(String excelFilePath, String jsonFilePath, int batchSize)
- **Предусловия**:
  - excelFilePath != null
  - !excelFilePath.isEmpty()
  - jsonFilePath != null
  - !jsonFilePath.isEmpty()
  - batchSize > 0
- **Постусловия**:
  - Создан экземпляр конвертера с указанными параметрами
  - Установлен режим AUTO

### ExcelToJsonConverter(String excelFilePath, String jsonFilePath, int batchSize, String sheetName)
- **Предусловия**:
  - excelFilePath != null
  - !excelFilePath.isEmpty()
  - jsonFilePath != null
  - !jsonFilePath.isEmpty()
  - batchSize > 0
- **Постусловия**:
  - Создан экземпляр конвертера с указанными параметрами
  - Установлен режим AUTO
  - Установлено имя листа

### convert()
- **Предусловия**:
  - Файл по пути excelFilePath существует и доступен для чтения
  - Директория для jsonFilePath существует и доступна для записи
- **Постусловия**:
  - Файл по пути jsonFilePath создан и содержит данные из Excel-файла в формате JSON
  - Заполнен объект метаданных с информацией о конвертации

### setProcessingMode(ProcessingMode processingMode)
- **Предусловия**:
  - processingMode != null
- **Постусловия**:
  - Установлен режим обработки
  - Возвращен текущий экземпляр конвертера

### setResourceConstraints(ResourceConstraints resourceConstraints)
- **Предусловия**:
  - resourceConstraints != null
- **Постусловия**:
  - Установлены ограничения по использованию ресурсов
  - Возвращен текущий экземпляр конвертера

### setStrategyThresholds(StrategyThresholds thresholds)
- **Предусловия**:
  - thresholds != null
- **Постусловия**:
  - Установлены пороги для выбора стратегии
  - Возвращен текущий экземпляр конвертера

### setTempDirectory(String tempDir)
- **Предусловия**:
  - tempDir != null
- **Постусловия**:
  - Установлена директория для временных файлов
  - Возвращен текущий экземпляр конвертера

### setCheckpoints(String checkpointsDir, boolean createCheckpoints)
- **Предусловия**:
  - checkpointsDir != null (если createCheckpoints == true)
- **Постусловия**:
  - Установлены параметры контрольных точек
  - Возвращен текущий экземпляр конвертера

### setKeepTempFiles(boolean keepTempFiles)
- **Предусловия**: нет
- **Постусловия**:
  - Установлен флаг сохранения временных файлов
  - Возвращен текущий экземпляр конвертера

### setProgressHandler(Consumer<ProgressInfo> progressHandler)
- **Предусловия**:
  - progressHandler != null
- **Постусловия**:
  - Установлен обработчик прогресса
  - Возвращен текущий экземпляр конвертера

### getMetadata()
- **Предусловия**:
  - Была выполнена хотя бы одна операция конвертации
- **Постусловия**:
  - Возвращен объект ConversionMetadata с информацией о последней конвертации

## Инварианты
- Конвертер должен корректно обрабатывать все типы данных Excel (строки, числа, даты, булевы значения)
- Конвертер должен сохранять структуру данных Excel (строки, столбцы)
- Конвертер должен обеспечивать минимальное использование памяти при обработке больших файлов
- Конвертер должен обеспечивать корректную обработку заголовков столбцов
- Конвертер должен обеспечивать корректную обработку пустых ячеек
- Конвертер должен автоматически адаптировать стратегию обработки в зависимости от характеристик файла и доступных ресурсов
- Выходной JSON должен иметь одинаковый формат независимо от выбранной стратегии обработки
- Информация о прогрессе должна быть доступна в режиме реального времени через обработчик прогресса
- Метаданные конвертации должны содержать полную информацию о процессе, включая выбранную стратегию обработки

## Исключения
- **IOException**: если произошла ошибка при чтении Excel-файла, записи временных файлов или записи итогового JSON-файла
- **IllegalArgumentException**: если нарушены предусловия методов
- **UnsupportedFormatException**: если формат файла не поддерживается
- **InvalidFileException**: если файл поврежден или имеет неверную структуру
- **InvalidConfigurationException**: если конфигурация содержит несовместимые параметры
- **IllegalStateException**: при попытке получить метаданные до выполнения конвертации
- **RuntimeException**: если произошла непредвиденная ошибка при обработке данных

## Метрики производительности
- **Использование памяти**: Адаптивно в зависимости от выбранной стратегии и размера файла
- **Скорость обработки**: Зависит от выбранной стратегии, но не ниже 100 000 строк в минуту на стандартном оборудовании
- **Устойчивость к ошибкам**: Полная для сегментированной стратегии с контрольными точками
- **Дисковое пространство**: Временные файлы не должны занимать более чем в 2 раза больше места, чем итоговый JSON-файл (только для гибридной и сегментированной стратегий)

## Примеры использования
```java
// Базовый пример с автоматическим выбором стратегии
ExcelToJsonConverter converter = new ExcelToJsonConverter(
    "path/to/excel.xlsx",
    "path/to/output.json",
    1000 // batch size
);
try {
    converter.convert();
    System.out.println("Conversion completed successfully");

    // Получение метаданных о конвертации
    ConversionMetadata metadata = converter.getMetadata();
    System.out.printf("Processed %d rows using %s strategy. Total time: %d ms%n",
        metadata.getProcessedRows(),
        metadata.getUsedStrategy(),
        metadata.getProcessingTimeMs());
} catch (IOException e) {
    System.err.println("Error during conversion: " + e.getMessage());
} catch (UnsupportedFormatException | InvalidFileException e) {
    System.err.println("Error with input file: " + e.getMessage());
}

// Пример с явным указанием стратегии и настройкой параметров
ExcelToJsonConverter converter = new ExcelToJsonConverter(
    "path/to/huge_excel.xlsx",
    "path/to/output.json",
    100000 // batch size для сегментированной обработки
);

// Настройка конвертера с использованием цепочки вызовов
converter
    .setProcessingMode(ProcessingMode.SEGMENTED) // явное указание стратегии
    .setResourceConstraints(new ResourceConstraints(1024, 5000)) // 1GB RAM, 5GB для временных файлов
    .setTempDirectory("D:/Dev/CATMEPIM/data/temp") // директория для временных файлов
    .setCheckpoints("D:/Dev/CATMEPIM/data/checkpoints", true) // включить контрольные точки
    .setKeepTempFiles(false) // удалять временные файлы после обработки
    .setProgressHandler(progress -> {
        if (progress.getTotalRows() > 0) {
            System.out.printf("Progress: %.1f%% using %s strategy%n",
                progress.getProcessedRows() * 100.0 / progress.getTotalRows(),
                progress.getCurrentMode());
        }
    });

try {
    converter.convert();
    System.out.println("Conversion completed successfully");
} catch (IOException e) {
    System.err.println("Error during conversion: " + e.getMessage());
} catch (UnsupportedFormatException | InvalidFileException e) {
    System.err.println("Error with input file: " + e.getMessage());
}

// Пример с настройкой порогов для автоматического выбора стратегии
ExcelToJsonConverter converter = new ExcelToJsonConverter(
    "path/to/excel.xlsx",
    "path/to/output.json",
    1000
);

// Изменение порогов для более агрессивной сегментации
StrategyThresholds thresholds = new StrategyThresholds(50, 200, 0.6);
converter.setStrategyThresholds(thresholds);

try {
    converter.convert();
    System.out.println("Conversion completed successfully using " +
        converter.getMetadata().getUsedStrategy() + " strategy");
} catch (IOException | UnsupportedFormatException | InvalidFileException e) {
    System.err.println("Error during conversion: " + e.getMessage());
}

// Пример использования из командной строки
public static void main(String[] args) {
    if (args.length < 2) {
        System.out.println("Usage: ExcelToJsonConverter <excel_file_path> <json_file_path> [batch_size] [sheet_name] [processing_mode]");
        System.exit(1);
    }

    String excelFilePath = args[0];
    String jsonFilePath = args[1];
    int batchSize = args.length > 2 ? Integer.parseInt(args[2]) : 1000;
    String sheetName = args.length > 3 ? args[3] : null;
    ProcessingMode mode = args.length > 4 ? ProcessingMode.valueOf(args[4]) : ProcessingMode.AUTO;

    ExcelToJsonConverter converter = new ExcelToJsonConverter(excelFilePath, jsonFilePath, batchSize, sheetName);
    converter.setProcessingMode(mode);

    // Настройка отображения прогресса в консоли
    converter.setProgressHandler(progress -> {
        if (progress.getTotalRows() > 0) {
            System.out.printf("Progress: %.1f%% using %s mode\r",
                progress.getProcessedRows() * 100.0 / progress.getTotalRows(),
                progress.getCurrentMode());
        } else {
            System.out.printf("Processed %d rows using %s mode\r",
                progress.getProcessedRows(),
                progress.getCurrentMode());
        }
    });

    try {
        converter.convert();
        System.out.println("\nConversion completed successfully");

        // Вывод статистики
        ConversionMetadata metadata = converter.getMetadata();
        System.out.printf("Processed: %d rows using %s strategy\n",
            metadata.getProcessedRows(), metadata.getUsedStrategy());
        System.out.printf("Time: %.2f seconds (%.2f rows/sec)\n",
            metadata.getProcessingTimeMs() / 1000.0,
            metadata.getProcessedRows() / (metadata.getProcessingTimeMs() / 1000.0));
    } catch (IOException e) {
        System.err.println("\nError during conversion: " + e.getMessage());
        System.exit(1);
    } catch (UnsupportedFormatException | InvalidFileException e) {
        System.err.println("\nError with input file: " + e.getMessage());
        System.exit(1);
    }
}
```

## Реализации
- **ExcelToJsonConverter**: основная реализация с поддержкой адаптивных стратегий

## Технические детали
1. **Механизм выбора стратегии**:
   - В режиме AUTO анализируется размер файла, доступная память и дисковое пространство
   - Учитывается сложность файла (заголовки, типы данных, размер ячеек)
   - Выбирается оптимальная стратегия на основе этих параметров и пользовательских порогов

2. **Стандартная стратегия**:
   - Использует потоковую обработку EasyExcel с минимальными накладными расходами
   - Оптимизирована для максимальной скорости на файлах малого и среднего размера
   - Не создает временных файлов на диске

3. **Гибридная стратегия**:
   - Использует частичную сегментацию с буферизацией в памяти
   - Оптимизирует использование памяти через агрессивную сборку мусора
   - Создает минимальное количество временных файлов

4. **Сегментированная стратегия**:
   - Полностью сегментирует файл на части для экономии памяти
   - Создает временные файлы для каждого сегмента
   - Поддерживает контрольные точки для восстановления после сбоев
   - Объединяет сегменты потоковым способом без загрузки всех данных в память

5. **Система метрик**:
   - Мониторинг использования памяти и диска в реальном времени
   - Адаптивная настройка размера батча в зависимости от доступных ресурсов
   - Система обратной связи для оптимизации параметров во время выполнения

## Связанные контракты
- [Converter Interface Contract](./contract.md) - Общий интерфейс для всех конвертеров
- [ProcessingStrategy Contract](./processing-strategy.md) - Стратегии обработки Excel-файлов
- [Data Cleaning Requirements](./data-cleaning-requirements.md) - Требования к очистке данных
- [Strategy Selection Requirements](./strategy-selection-requirements.md) - Требования к выбору стратегии
- [VendorConfig Contract](./vendor-config.md) - Конфигурация вендора для маппинга полей
- [ETL Process Contract](../../ETL-Process-Contract.md) - Общий процесс ETL
