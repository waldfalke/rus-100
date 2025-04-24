# Контракт: Обновление ProcessingMode и ExcelProcessingStrategyFactory

## Метаданные
- **Версия**: 1.0.0
- **Статус**: Предложение
- **Последнее обновление**: 2025-04-19
- **Последний редактор**: AI
- **Ветка разработки**: feature/sax-excel-to-csv

## История изменений
| Дата | Версия | Автор | Описание изменений | PR |
|------|--------|-------|-------------------|-----|
| 2025-04-19 | 1.0.0 | AI | Начальная версия | - |

## Описание
Данный контракт описывает обновления для перечисления `ProcessingMode` и класса `ExcelProcessingStrategyFactory` для поддержки новой стратегии `SaxExcelToCSVStrategy`.

## Обновление ProcessingMode

```java
/**
 * Режимы обработки Excel-файлов.
 * Определяет доступные стратегии обработки.
 */
public enum ProcessingMode {
    /**
     * Стандартный режим обработки.
     * Использует стандартную стратегию обработки Excel-файла целиком в памяти.
     * Оптимален для небольших файлов (до 100 МБ).
     */
    STANDARD,
    
    /**
     * Гибридный режим обработки.
     * Использует гибридную стратегию обработки, сочетающую преимущества потоковой обработки и работы с памятью.
     * Оптимален для средних файлов (100-500 МБ).
     */
    HYBRID,
    
    /**
     * Сегментированный режим обработки.
     * Использует сегментированную стратегию обработки, обрабатывая файл сегментами и сохраняя промежуточные результаты на диск.
     * Оптимален для больших файлов (более 500 МБ).
     */
    SEGMENTED,
    
    /**
     * Режим обработки с использованием SAX-парсера для конвертации в CSV.
     * Использует SAX-парсер Apache POI для потокового чтения Excel и прямой конвертации в CSV-формат.
     * Оптимален для очень больших файлов (700+ МБ) и когда требуется формат CSV вместо JSON.
     */
    SAX_CSV,
    
    /**
     * Автоматический режим обработки.
     * Выбирает наиболее подходящую стратегию на основе характеристик файла и доступных ресурсов.
     */
    AUTO
}
```

## Обновление ExcelProcessingStrategyFactory

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
            case HYBRID:
                return new HybridProcessingStrategy(resourceConstraints);
            case SEGMENTED:
                return new SegmentedProcessingStrategy(resourceConstraints);
            case SAX_CSV:
                return new SaxExcelToCSVStrategy(resourceConstraints);
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
        
        if (fileSizeMB > thresholds.getSegmentedToSaxCsvMB()) {
            return createStrategy(ProcessingMode.SAX_CSV, resourceConstraints);
        } else if (fileSizeMB > thresholds.getHybridToSegmentedMB()) {
            return createStrategy(ProcessingMode.SEGMENTED, resourceConstraints);
        } else if (fileSizeMB > thresholds.getStandardToHybridMB()) {
            return createStrategy(ProcessingMode.HYBRID, resourceConstraints);
        } else {
            return createStrategy(ProcessingMode.STANDARD, resourceConstraints);
        }
    }
    
    /**
     * Выбирает наиболее подходящую стратегию для указанного файла с учетом требуемого формата вывода.
     *
     * @param excelFile файл Excel для оценки
     * @param resourceConstraints ограничения ресурсов
     * @param outputFormat требуемый формат вывода (JSON или CSV)
     * @return наиболее подходящая стратегия обработки
     * @throws IOException при ошибке доступа к файлу
     */
    public static ExcelProcessingStrategy selectBestStrategy(File excelFile, ResourceConstraints resourceConstraints, OutputFormat outputFormat) throws IOException {
        // Если требуется формат CSV и файл достаточно большой, используем SAX_CSV
        if (outputFormat == OutputFormat.CSV) {
            long fileSizeMB = excelFile.length() / (1024 * 1024);
            StrategyThresholds thresholds = new StrategyThresholds();
            
            if (fileSizeMB > thresholds.getStandardToSaxCsvMB()) {
                return createStrategy(ProcessingMode.SAX_CSV, resourceConstraints);
            }
        }
        
        // В остальных случаях используем стандартный выбор стратегии
        return selectBestStrategy(excelFile, resourceConstraints);
    }
    
    /**
     * Получает список доступных стратегий.
     *
     * @return список доступных стратегий
     */
    public static List<ExcelProcessingStrategy> getAvailableStrategies() {
        List<ExcelProcessingStrategy> strategies = new ArrayList<>();
        
        // Добавляем все доступные стратегии
        ResourceConstraints defaultConstraints = new ResourceConstraints();
        
        // Добавляем стандартную стратегию
        strategies.add(new StandardProcessingStrategy(defaultConstraints));
        
        // Добавляем гибридную стратегию
        strategies.add(new HybridProcessingStrategy(defaultConstraints));
        
        // Добавляем сегментированную стратегию
        strategies.add(new SegmentedProcessingStrategy(defaultConstraints));
        
        // Добавляем SAX CSV стратегию
        strategies.add(new SaxExcelToCSVStrategy(defaultConstraints));
        
        return strategies;
    }
}
```

## Добавление класса StrategyThresholds

```java
/**
 * Пороговые значения для выбора стратегии обработки.
 * Определяет пороги размера файла для выбора различных стратегий.
 */
public class StrategyThresholds {
    
    /**
     * Порог размера файла (в МБ) для перехода от стандартной стратегии к гибридной.
     */
    private final int standardToHybridMB = 100;
    
    /**
     * Порог размера файла (в МБ) для перехода от гибридной стратегии к сегментированной.
     */
    private final int hybridToSegmentedMB = 500;
    
    /**
     * Порог размера файла (в МБ) для перехода от сегментированной стратегии к SAX CSV.
     */
    private final int segmentedToSaxCsvMB = 700;
    
    /**
     * Порог размера файла (в МБ) для перехода от стандартной стратегии к SAX CSV для CSV-вывода.
     */
    private final int standardToSaxCsvMB = 200;
    
    /**
     * Возвращает порог размера файла (в МБ) для перехода от стандартной стратегии к гибридной.
     *
     * @return порог размера файла (в МБ)
     */
    public int getStandardToHybridMB() {
        return standardToHybridMB;
    }
    
    /**
     * Возвращает порог размера файла (в МБ) для перехода от гибридной стратегии к сегментированной.
     *
     * @return порог размера файла (в МБ)
     */
    public int getHybridToSegmentedMB() {
        return hybridToSegmentedMB;
    }
    
    /**
     * Возвращает порог размера файла (в МБ) для перехода от сегментированной стратегии к SAX CSV.
     *
     * @return порог размера файла (в МБ)
     */
    public int getSegmentedToSaxCsvMB() {
        return segmentedToSaxCsvMB;
    }
    
    /**
     * Возвращает порог размера файла (в МБ) для перехода от стандартной стратегии к SAX CSV для CSV-вывода.
     *
     * @return порог размера файла (в МБ)
     */
    public int getStandardToSaxCsvMB() {
        return standardToSaxCsvMB;
    }
}
```

## Добавление перечисления OutputFormat

```java
/**
 * Форматы вывода для конвертации Excel-файлов.
 */
public enum OutputFormat {
    /**
     * Формат JSON.
     */
    JSON,
    
    /**
     * Формат CSV.
     */
    CSV
}
```

## Интеграция с существующей системой

Обновления `ProcessingMode` и `ExcelProcessingStrategyFactory` интегрируются с существующей системой следующим образом:

1. Добавление нового значения `SAX_CSV` в перечисление `ProcessingMode`
2. Обновление метода `createStrategy` в классе `ExcelProcessingStrategyFactory` для поддержки нового режима
3. Обновление метода `selectBestStrategy` для выбора `SaxExcelToCSVStrategy` для очень больших файлов
4. Добавление перегруженного метода `selectBestStrategy` с параметром `outputFormat` для выбора стратегии с учетом требуемого формата вывода
5. Обновление метода `getAvailableStrategies` для включения `SaxExcelToCSVStrategy` в список доступных стратегий
6. Добавление класса `StrategyThresholds` для определения пороговых значений размера файла
7. Добавление перечисления `OutputFormat` для определения форматов вывода

## Пример использования

```java
// Выбор стратегии с учетом формата вывода
File excelFile = new File("/path/to/huge_file.xlsx");
ResourceConstraints constraints = new ResourceConstraints(512 * 1024 * 1024, 8); // 512 МБ, 8 потоков

try {
    ExcelProcessingStrategy strategy = ExcelProcessingStrategyFactory.selectBestStrategy(
        excelFile, constraints, OutputFormat.CSV
    );

    System.out.println("Selected strategy: " + strategy.getName());

    // Использование выбранной стратегии
    strategy.processToFile(excelFile, new File("/path/to/output.csv"));
} catch (IOException e) {
    e.printStackTrace();
}
```

## Зависимости

- Существующие классы `ProcessingMode` и `ExcelProcessingStrategyFactory`
- Новый класс `SaxExcelToCSVStrategy`

## Ограничения

1. Стратегия `SaxExcelToCSVStrategy` оптимизирована для конвертации Excel в CSV, а не в JSON
2. Для конвертации в JSON по-прежнему используются существующие стратегии
