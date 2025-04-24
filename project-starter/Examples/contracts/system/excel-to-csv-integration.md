# Контракт: Системная интеграция SAX Excel-to-CSV конвертера

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
Данный контракт описывает системную интеграцию новой функциональности SAX Excel-to-CSV конвертера в существующую систему CATMEPIM. Он объединяет все предыдущие контракты и описывает, как новая функциональность будет интегрирована в существующую систему.

## Цель
Создать эффективный механизм конвертации Excel-файлов в CSV, который:
1. Работает эффективнее с большими файлами (700+ МБ)
2. Избегает проблем с "zip bomb detected"
3. Потребляет меньше памяти, чем текущее решение на EasyExcel
4. Не нарушает существующую функциональность

## Компоненты системы

### Новые компоненты
1. **SaxExcelToCSVStrategy** - стратегия обработки Excel-файлов с использованием SAX-парсера для конвертации в CSV
2. **SaxSheetHandler** - обработчик событий SAX для Excel-листа
3. **OutputFormat** - перечисление форматов вывода (JSON, CSV)
4. **StrategyThresholds** - класс с пороговыми значениями для выбора стратегии обработки

### Обновляемые компоненты
1. **ProcessingMode** - перечисление режимов обработки Excel-файлов (добавление SAX_CSV)
2. **ExcelProcessingStrategyFactory** - фабрика стратегий обработки Excel-файлов (обновление для поддержки SaxExcelToCSVStrategy)

## Архитектура

```
                                  +-------------------+
                                  |                   |
                                  | ExcelToJsonConverter |
                                  |                   |
                                  +--------+----------+
                                           |
                                           v
                      +-------------------+-------------------+
                      |                                       |
                      | ExcelProcessingStrategyFactory        |
                      |                                       |
                      +---+---+---+---+---+-------------------+
                          |   |   |   |
                          |   |   |   +----------------+
                          |   |   |                    |
                          |   |   v                    v
                          |   | +----------------+ +-------------------+
                          |   | |                | |                   |
                          |   | | SegmentedStrategy | | SaxExcelToCSVStrategy |
                          |   | |                | |                   |
                          |   | +----------------+ +-------------------+
                          |   |                              |
                          |   v                              v
                          | +----------------+     +-------------------+
                          | |                |     |                   |
                          | | HybridStrategy |     | SaxSheetHandler   |
                          | |                |     |                   |
                          | +----------------+     +-------------------+
                          |
                          v
                      +----------------+
                      |                |
                      | StandardStrategy |
                      |                |
                      +----------------+
```

## Интеграция с существующей системой

### 1. Добавление новой стратегии
Новая стратегия `SaxExcelToCSVStrategy` будет добавлена в систему как реализация интерфейса `ExcelProcessingStrategy`. Она будет наследоваться от `AbstractProcessingStrategy` для повторного использования общей функциональности.

### 2. Обновление фабрики стратегий
Класс `ExcelProcessingStrategyFactory` будет обновлен для поддержки новой стратегии:
- Добавление нового значения `SAX_CSV` в перечисление `ProcessingMode`
- Обновление метода `createStrategy` для поддержки нового режима
- Обновление метода `selectBestStrategy` для выбора `SaxExcelToCSVStrategy` для очень больших файлов
- Добавление перегруженного метода `selectBestStrategy` с параметром `outputFormat`

### 3. Добавление поддержки CSV-вывода
Система будет расширена для поддержки вывода в формате CSV:
- Добавление перечисления `OutputFormat` для определения форматов вывода
- Обновление класса `ExcelToJsonConverter` для поддержки конвертации в CSV

### 4. Обновление логики выбора стратегии
Логика выбора стратегии будет обновлена для учета размера файла и требуемого формата вывода:
- Для очень больших файлов (700+ МБ) будет выбираться `SaxExcelToCSVStrategy`
- Для файлов, требующих вывода в CSV, будет предпочтительно выбираться `SaxExcelToCSVStrategy`

## Алгоритм работы

### 1. Выбор стратегии
```
Вход: Excel-файл, ограничения ресурсов, формат вывода
Выход: Экземпляр стратегии обработки

1. Если формат вывода == CSV и размер файла > standardToSaxCsvMB:
   1.1. Вернуть SaxExcelToCSVStrategy
2. Иначе, если размер файла > segmentedToSaxCsvMB:
   2.1. Вернуть SaxExcelToCSVStrategy
3. Иначе, если размер файла > hybridToSegmentedMB:
   3.1. Вернуть SegmentedProcessingStrategy
4. Иначе, если размер файла > standardToHybridMB:
   4.1. Вернуть HybridProcessingStrategy
5. Иначе:
   5.1. Вернуть StandardProcessingStrategy
```

### 2. Обработка файла с использованием SaxExcelToCSVStrategy
```
Вход: Excel-файл, выходной CSV-файл
Выход: CSV-файл

1. Отключить проверку на zip bomb
2. Открыть Excel-файл с использованием OPCPackage
3. Получить таблицу стилей и общие строки
4. Для каждого листа в Excel-файле:
   4.1. Создать SaxSheetHandler
   4.2. Настроить SAX-парсер
   4.3. Обработать лист с использованием SAX-парсера
   4.4. Записать данные в CSV-файл
5. Закрыть все ресурсы
6. Обновить метаданные обработки
```

## Пример использования

### 1. Прямое использование SaxExcelToCSVStrategy
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

### 2. Использование через фабрику стратегий
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

### 3. Использование через ExcelToJsonConverter
```java
// Создание конвертера
ExcelToJsonConverter converter = new ExcelToJsonConverter();

// Конвертация Excel в CSV
File excelFile = new File("/path/to/huge_file.xlsx");
File csvFile = new File("/path/to/output.csv");

try {
    converter.convertToCSV(excelFile, csvFile);
} catch (IOException | UnsupportedFormatException | InvalidFileException e) {
    e.printStackTrace();
}
```

## Зависимости

### Новые зависимости
- Apache Commons CSV (если еще не используется)
```xml
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-csv</artifactId>
    <version>1.10.0</version>
</dependency>
```

### Существующие зависимости
- Apache POI (core, ooxml, ooxml-schemas)
- Apache Commons IO
- Jackson (для JSON-обработки)

## Ограничения

1. Стратегия `SaxExcelToCSVStrategy` оптимизирована для конвертации Excel в CSV, а не в JSON
2. Не поддерживает сложное форматирование ячеек
3. Не поддерживает формулы (только их результаты)
4. Работает только с XLSX-файлами (не поддерживает XLS)

## Критерии успеха

1. Успешная конвертация файлов размером 700+ МБ без ошибок "zip bomb detected"
2. Снижение потребления памяти при конвертации больших файлов
3. Сохранение или улучшение производительности по сравнению с существующими стратегиями
4. Отсутствие регрессий в существующей функциональности

## План внедрения

1. Создание новых классов:
   - `SaxExcelToCSVStrategy`
   - `SaxSheetHandler`
   - `OutputFormat`
   - `StrategyThresholds`

2. Обновление существующих классов:
   - `ProcessingMode`
   - `ExcelProcessingStrategyFactory`
   - `ExcelToJsonConverter`

3. Написание тестов:
   - Модульные тесты для новых классов
   - Интеграционные тесты для проверки работы с большими файлами
   - Тесты производительности для сравнения с существующими стратегиями

4. Документация:
   - Обновление JavaDoc для всех новых и измененных классов
   - Обновление README.md с описанием новой функциональности
   - Создание примеров использования

5. Развертывание:
   - Сборка и публикация новой версии библиотеки
   - Обновление зависимостей в проектах, использующих библиотеку
