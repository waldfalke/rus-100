# Упрощение системы стратегий обработки Excel-файлов

## Обзор

Данный контракт описывает изменения в системе стратегий обработки Excel-файлов с целью упрощения и повышения надежности.

## Мотивация

Текущая система стратегий обработки Excel-файлов включает 4 различные стратегии:
1. StandardProcessingStrategy
2. HybridProcessingStrategy
3. SegmentedProcessingStrategy
4. SaxExcelToCSVStrategy

Такое количество стратегий является избыточным и усложняет систему. Основной критерий выбора стратегии - размер файла, вторичный - сложность данных (определяемая по конфигурации вендора).

## Изменения

### 1. Упрощение системы стратегий

Система стратегий будет упрощена до двух основных стратегий:
1. **StandardProcessingStrategy** - для файлов до определенного размера (по умолчанию 300 МБ)
2. **SaxExcelToCSVStrategy** - для файлов большего размера

Стратегии HybridProcessingStrategy и SegmentedProcessingStrategy будут заархивированы (код сохранен, но не используется).

### 2. Обновление класса StrategyThresholds

Класс StrategyThresholds будет упрощен и будет содержать только один основной порог:
- **standardToSaxCsvMB** - порог размера файла для перехода от стандартной стратегии к SAX CSV стратегии (по умолчанию 300 МБ)

### 3. Обновление ExcelProcessingStrategyFactory

Класс ExcelProcessingStrategyFactory будет обновлен для использования только двух стратегий:
- Метод createStrategy будет поддерживать только STANDARD и SAX_CSV режимы
- Метод selectBestStrategy будет выбирать стратегию только на основе размера файла и порога standardToSaxCsvMB
- Метод getAvailableStrategies будет возвращать только две доступные стратегии

### 4. Улучшение логирования

Будет добавлено параноидальное логирование для отслеживания процесса выбора стратегии:
- Логирование размера файла
- Логирование порогового значения
- Логирование выбранной стратегии
- Логирование параметров ZipSecureFile

### 5. Улучшение обработки ошибок "Zip bomb detected"

Будет улучшена обработка ошибок "Zip bomb detected" в SaxExcelToCSVStrategy:
- Увеличение maxEntrySize до максимально возможного значения
- Добавление механизма продолжения обработки даже при возникновении ошибки
- Подробное логирование ошибок и состояния системы

## Интерфейсы

### Обновленный класс StrategyThresholds

```java
/**
 * Пороги для выбора стратегии обработки.
 */
public class StrategyThresholds {
    /**
     * Порог размера файла в мегабайтах для перехода от стандартной к SAX CSV стратегии.
     * По умолчанию 300 МБ.
     */
    private long standardToSaxCsvMB;

    /**
     * Порог сложности файла (0.0-1.0) для выбора стратегии.
     * Высокие значения означают более сложный файл.
     * По умолчанию 0.7.
     */
    private double complexityThreshold;

    /**
     * Создает новый экземпляр с порогами по умолчанию.
     */
    public StrategyThresholds() {
        this.standardToSaxCsvMB = 300;
        this.complexityThreshold = 0.7;
    }

    /**
     * Создает новый экземпляр с указанным порогом.
     *
     * @param standardToSaxCsvMB порог для перехода от стандартной к SAX CSV стратегии
     */
    public StrategyThresholds(long standardToSaxCsvMB) {
        this.standardToSaxCsvMB = standardToSaxCsvMB;
        this.complexityThreshold = 0.7;
    }

    /**
     * Создает новый экземпляр с указанным порогом и порогом сложности.
     *
     * @param standardToSaxCsvMB порог для перехода от стандартной к SAX CSV стратегии
     * @param complexityThreshold порог сложности файла
     */
    public StrategyThresholds(long standardToSaxCsvMB, double complexityThreshold) {
        this.standardToSaxCsvMB = standardToSaxCsvMB;
        this.complexityThreshold = complexityThreshold;
    }

    // Геттеры и сеттеры
    public long getStandardToSaxCsvMB() {
        return standardToSaxCsvMB;
    }

    public StrategyThresholds setStandardToSaxCsvMB(long standardToSaxCsvMB) {
        this.standardToSaxCsvMB = standardToSaxCsvMB;
        return this;
    }

    public double getComplexityThreshold() {
        return complexityThreshold;
    }

    public StrategyThresholds setComplexityThreshold(double complexityThreshold) {
        this.complexityThreshold = complexityThreshold;
        return this;
    }
}
```

### Обновленный класс ExcelProcessingStrategyFactory

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
     */
    public static ExcelProcessingStrategy createStrategy(ProcessingMode mode, ResourceConstraints resourceConstraints) {
        switch (mode) {
            case STANDARD:
                return new StandardProcessingStrategy(resourceConstraints);
            case SAX_CSV:
                // Используем SAX стратегию для очень больших файлов
                SaxExcelToCSVStrategy strategy = new SaxExcelToCSVStrategy(resourceConstraints);
                // Настраиваем параметры для обработки очень больших файлов
                strategy.setKeepTempFiles(false);
                return strategy;
            case AUTO:
            default:
                // В режиме AUTO выбираем стратегию на основе ResourceConstraints
                // По умолчанию используем стандартную стратегию
                return new StandardProcessingStrategy(resourceConstraints);
        }
    }

    /**
     * Выбирает наиболее подходящую стратегию для указанного файла.
     *
     * @param excelFile файл Excel для оценки
     * @param resourceConstraints ограничения ресурсов
     * @return наиболее подходящая стратегия обработки
     * @throws IOException при ошибке доступа к файлу
     */
    public static ExcelProcessingStrategy selectBestStrategy(File excelFile, ResourceConstraints resourceConstraints) throws IOException {
        // Анализируем размер файла для выбора стратегии
        long fileSizeMB = excelFile.length() / (1024 * 1024);
        StrategyThresholds thresholds = new StrategyThresholds();

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
    }
}
```

## Примеры использования

### Выбор стратегии на основе размера файла

```java
File excelFile = new File("path/to/large_file.xlsx");
ResourceConstraints constraints = new ResourceConstraints();

try {
    ExcelProcessingStrategy strategy = ExcelProcessingStrategyFactory.selectBestStrategy(excelFile, constraints);
    System.out.println("Selected strategy: " + strategy.getName());
    
    // Использование выбранной стратегии
    strategy.processToFile(excelFile, new File("path/to/output.json"));
} catch (IOException e) {
    e.printStackTrace();
}
```

### Настройка порога выбора стратегии

```java
// Создание конвертера
ExcelToJsonConverter converter = new ExcelToJsonConverter(excelFile, jsonFile);

// Настройка порога для выбора стратегии
StrategyThresholds thresholds = new StrategyThresholds(500); // 500 МБ
converter.setStrategyThresholds(thresholds);

// Запуск конвертации
converter.convert();
```

## Заключение

Упрощение системы стратегий обработки Excel-файлов позволит:
1. Сделать систему более понятной и предсказуемой
2. Уменьшить количество кода и потенциальных ошибок
3. Улучшить логирование и отладку
4. Повысить надежность обработки больших файлов
