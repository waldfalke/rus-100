# Контракт: SaxExcelToCSVStrategy - Стратегия конвертации Excel в CSV с использованием SAX-парсера

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
`SaxExcelToCSVStrategy` - это специализированная стратегия обработки Excel-файлов, которая использует SAX-парсер Apache POI для потокового чтения Excel и прямой конвертации в CSV-формат. Эта стратегия разработана для эффективной обработки очень больших Excel-файлов (700+ МБ) без проблем с "zip bomb detected" и с минимальным использованием памяти.

Данная стратегия является расширением существующей `SegmentedProcessingStrategy`, но вместо использования EasyExcel и конвертации в JSON, она использует SAX-парсер Apache POI и конвертирует напрямую в CSV.

## Преимущества
1. **Низкое потребление памяти**: SAX-парсер читает файл последовательно, не загружая весь файл в память
2. **Обход проблемы "zip bomb"**: Отключение проверки на zip bomb для SAX-парсера, который не подвержен этой проблеме
3. **Высокая производительность**: Потоковая обработка обеспечивает высокую скорость конвертации
4. **Прямая конвертация**: Конвертация Excel в CSV без промежуточных форматов

## Интерфейс

```java
/**
 * Стратегия обработки Excel-файлов с использованием SAX-парсера для конвертации в CSV.
 * Оптимизирована для очень больших файлов (700+ МБ).
 */
public class SaxExcelToCSVStrategy extends AbstractProcessingStrategy {

    /**
     * Создает новый экземпляр стратегии с ограничениями ресурсов.
     *
     * @param resourceConstraints ограничения ресурсов
     */
    public SaxExcelToCSVStrategy(ResourceConstraints resourceConstraints);

    /**
     * Создает новый экземпляр стратегии с ограничениями ресурсов и максимальным количеством строк.
     *
     * @param resourceConstraints ограничения ресурсов
     * @param maxRows максимальное количество строк для обработки
     */
    public SaxExcelToCSVStrategy(ResourceConstraints resourceConstraints, int maxRows);

    /**
     * Устанавливает директорию для временных файлов.
     *
     * @param tempDir директория для временных файлов
     * @return текущий экземпляр стратегии для цепочки вызовов
     */
    public SaxExcelToCSVStrategy setTempDirectory(String tempDir);

    /**
     * Устанавливает флаг сохранения временных файлов.
     *
     * @param keepTempFiles true - сохранять временные файлы, false - удалять
     * @return текущий экземпляр стратегии для цепочки вызовов
     */
    public SaxExcelToCSVStrategy setKeepTempFiles(boolean keepTempFiles);

    /**
     * Устанавливает директорию для контрольных точек и флаг их создания.
     *
     * @param checkpointsDir директория для контрольных точек
     * @param createCheckpoints флаг создания контрольных точек
     * @return текущий экземпляр стратегии для цепочки вызовов
     */
    public SaxExcelToCSVStrategy setCheckpoints(String checkpointsDir, boolean createCheckpoints);

    /**
     * Устанавливает разделитель для CSV-файла.
     *
     * @param delimiter разделитель для CSV-файла
     * @return текущий экземпляр стратегии для цепочки вызовов
     */
    public SaxExcelToCSVStrategy setCsvDelimiter(char delimiter);

    /**
     * Устанавливает символ кавычек для CSV-файла.
     *
     * @param quoteChar символ кавычек для CSV-файла
     * @return текущий экземпляр стратегии для цепочки вызовов
     */
    public SaxExcelToCSVStrategy setCsvQuoteChar(char quoteChar);

    /**
     * Устанавливает символ экранирования для CSV-файла.
     *
     * @param escapeChar символ экранирования для CSV-файла
     * @return текущий экземпляр стратегии для цепочки вызовов
     */
    public SaxExcelToCSVStrategy setCsvEscapeChar(char escapeChar);

    /**
     * Устанавливает флаг включения заголовков в CSV-файл.
     *
     * @param includeHeaders true - включать заголовки, false - не включать
     * @return текущий экземпляр стратегии для цепочки вызовов
     */
    public SaxExcelToCSVStrategy setIncludeHeaders(boolean includeHeaders);

    /**
     * Устанавливает кодировку для CSV-файла.
     *
     * @param charset кодировка для CSV-файла
     * @return текущий экземпляр стратегии для цепочки вызовов
     */
    public SaxExcelToCSVStrategy setCsvCharset(String charset);
}
```

## Реализация

### Основные компоненты

1. **SaxExcelToCSVStrategy**
   - Основной класс стратегии, реализующий интерфейс `ExcelProcessingStrategy`
   - Наследует от `AbstractProcessingStrategy`
   - Использует SAX-парсер Apache POI для потокового чтения Excel
   - Использует Apache Commons CSV для записи CSV

2. **SaxSheetHandler**
   - Обработчик событий SAX для Excel-листа
   - Реализует интерфейс `SheetContentsHandler`
   - Обрабатывает события чтения ячеек и строк
   - Записывает данные в CSV-файл

### Алгоритм работы

1. **Подготовка**
   - Отключение проверки на zip bomb
   - Настройка параметров SAX-парсера
   - Создание временных директорий

2. **Обработка**
   - Открытие Excel-файла с использованием OPCPackage
   - Получение таблицы стилей и общих строк
   - Итерация по листам Excel-файла
   - Обработка каждого листа с использованием SAX-парсера
   - Запись данных в CSV-файл

3. **Завершение**
   - Закрытие всех ресурсов
   - Удаление временных файлов (если не требуется их сохранение)
   - Обновление метаданных обработки

## Пример использования

```java
// Создание стратегии
ResourceConstraints constraints = new ResourceConstraints(512 * 1024 * 1024, 8); // 512 МБ, 8 потоков
SaxExcelToCSVStrategy strategy = new SaxExcelToCSVStrategy(constraints);

// Настройка параметров
strategy.setTempDirectory("/path/to/temp")
        .setKeepTempFiles(false)
        .setCsvDelimiter(',')
        .setIncludeHeaders(true)
        .setCsvCharset("UTF-8");

// Обработка файла
File excelFile = new File("/path/to/huge_file.xlsx");
File csvFile = new File("/path/to/output.csv");

try {
    strategy.processToFile(excelFile, csvFile);
    
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

## Интеграция с существующей системой

Стратегия `SaxExcelToCSVStrategy` интегрируется с существующей системой через фабрику `ExcelProcessingStrategyFactory`:

```java
// Добавление новой стратегии в фабрику
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
            return new StandardProcessingStrategy(resourceConstraints);
    }
}
```

## Зависимости

- Apache POI (core, ooxml, ooxml-schemas)
- Apache Commons CSV
- Apache Commons IO

## Ограничения

1. Стратегия оптимизирована для конвертации Excel в CSV, а не в JSON
2. Не поддерживает сложное форматирование ячеек
3. Не поддерживает формулы (только их результаты)
4. Работает только с XLSX-файлами (не поддерживает XLS)

## Критерии успеха

1. Успешная конвертация файлов размером 700+ МБ без ошибок "zip bomb detected"
2. Снижение потребления памяти при конвертации больших файлов
3. Сохранение или улучшение производительности по сравнению с существующими стратегиями
4. Отсутствие регрессий в существующей функциональности
