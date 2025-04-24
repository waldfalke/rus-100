# Контракт: SaxSheetHandler - Обработчик событий SAX для Excel-листа

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
`SaxSheetHandler` - это обработчик событий SAX для Excel-листа, который реализует интерфейс `SheetContentsHandler` из Apache POI. Он обрабатывает события чтения ячеек и строк и записывает данные в CSV-файл. Этот класс является ключевым компонентом стратегии `SaxExcelToCSVStrategy`.

## Интерфейс

```java
/**
 * Обработчик событий SAX для Excel-листа.
 * Реализует интерфейс SheetContentsHandler из Apache POI.
 * Обрабатывает события чтения ячеек и строк и записывает данные в CSV-файл.
 */
public class SaxSheetHandler implements SheetContentsHandler {

    /**
     * Создает новый экземпляр обработчика.
     *
     * @param csvPrinter принтер CSV для записи данных
     * @param dataFormatter форматировщик данных для форматирования значений ячеек
     * @param includeHeaders флаг включения заголовков в CSV-файл
     */
    public SaxSheetHandler(CSVPrinter csvPrinter, DataFormatter dataFormatter, boolean includeHeaders);

    /**
     * Вызывается в начале строки.
     *
     * @param rowNum номер строки
     */
    @Override
    public void startRow(int rowNum);

    /**
     * Вызывается в конце строки.
     *
     * @param rowNum номер строки
     */
    @Override
    public void endRow(int rowNum);

    /**
     * Вызывается для каждой ячейки в строке.
     *
     * @param cellReference ссылка на ячейку
     * @param formattedValue отформатированное значение ячейки
     * @param comment комментарий к ячейке
     */
    @Override
    public void cell(String cellReference, String formattedValue, XSSFComment comment);

    /**
     * Вызывается для заголовка или нижнего колонтитула.
     *
     * @param text текст заголовка или нижнего колонтитула
     * @param isHeader флаг, указывающий, является ли это заголовком
     * @param tagName имя тега
     */
    @Override
    public void headerFooter(String text, boolean isHeader, String tagName);

    /**
     * Возвращает количество обработанных строк.
     *
     * @return количество обработанных строк
     */
    public int getRowCount();

    /**
     * Возвращает список заголовков.
     *
     * @return список заголовков
     */
    public List<String> getHeaders();

    /**
     * Устанавливает обработчик прогресса.
     *
     * @param progressHandler обработчик прогресса
     * @return текущий экземпляр обработчика для цепочки вызовов
     */
    public SaxSheetHandler setProgressHandler(Consumer<ProgressInfo> progressHandler);

    /**
     * Устанавливает интервал обновления прогресса.
     *
     * @param progressUpdateInterval интервал обновления прогресса (количество строк)
     * @return текущий экземпляр обработчика для цепочки вызовов
     */
    public SaxSheetHandler setProgressUpdateInterval(int progressUpdateInterval);
}
```

## Реализация

### Основные компоненты

1. **Поля класса**
   - `CSVPrinter csvPrinter` - принтер CSV для записи данных
   - `DataFormatter dataFormatter` - форматировщик данных для форматирования значений ячеек
   - `boolean includeHeaders` - флаг включения заголовков в CSV-файл
   - `List<String> rowData` - данные текущей строки
   - `List<String> headers` - заголовки столбцов
   - `int currentRow` - текущий номер строки
   - `int currentCol` - текущий номер столбца
   - `int rowCount` - общее количество обработанных строк
   - `Consumer<ProgressInfo> progressHandler` - обработчик прогресса
   - `int progressUpdateInterval` - интервал обновления прогресса

2. **Методы**
   - `startRow(int rowNum)` - вызывается в начале строки
   - `endRow(int rowNum)` - вызывается в конце строки
   - `cell(String cellReference, String formattedValue, XSSFComment comment)` - вызывается для каждой ячейки
   - `headerFooter(String text, boolean isHeader, String tagName)` - вызывается для заголовка или нижнего колонтитула
   - `getRowCount()` - возвращает количество обработанных строк
   - `getHeaders()` - возвращает список заголовков
   - `setProgressHandler(Consumer<ProgressInfo> progressHandler)` - устанавливает обработчик прогресса
   - `setProgressUpdateInterval(int progressUpdateInterval)` - устанавливает интервал обновления прогресса

### Алгоритм работы

1. **Обработка заголовков**
   - Если `includeHeaders` установлен в `true` и текущая строка - первая, сохраняем заголовки
   - Заголовки определяются по первой строке или генерируются автоматически (column_0, column_1, ...)

2. **Обработка строк**
   - Для каждой строки создаем новый список `rowData`
   - Для каждой ячейки в строке получаем значение и добавляем в `rowData`
   - Если ячейка отсутствует, добавляем пустую строку
   - После обработки всех ячеек в строке записываем `rowData` в CSV-файл

3. **Обновление прогресса**
   - Если установлен `progressHandler`, периодически отправляем информацию о прогрессе
   - Частота обновления определяется `progressUpdateInterval`

## Пример использования

```java
// Создание CSV-принтера
CSVFormat csvFormat = CSVFormat.DEFAULT
        .withDelimiter(',')
        .withQuote('"')
        .withEscape('\\');
CSVPrinter csvPrinter = new CSVPrinter(new FileWriter(csvFile), csvFormat);

// Создание форматировщика данных
DataFormatter dataFormatter = new DataFormatter();

// Создание обработчика
SaxSheetHandler handler = new SaxSheetHandler(csvPrinter, dataFormatter, true);

// Установка обработчика прогресса
handler.setProgressHandler(progressInfo -> {
    System.out.printf("Processed %d rows\n", progressInfo.getCurrentRow());
}).setProgressUpdateInterval(1000);

// Использование обработчика с SAX-парсером
XMLReader sheetParser = XMLHelper.newXMLReader();
ContentHandler contentHandler = new XSSFSheetXMLHandler(
        styles, null, strings, handler, dataFormatter, false);
sheetParser.setContentHandler(contentHandler);
sheetParser.parse(sheetSource);

// Получение результатов
int rowCount = handler.getRowCount();
List<String> headers = handler.getHeaders();
```

## Зависимости

- Apache POI (core, ooxml, ooxml-schemas)
- Apache Commons CSV

## Ограничения

1. Не поддерживает сложное форматирование ячеек
2. Не поддерживает формулы (только их результаты)
3. Не обрабатывает объединенные ячейки специальным образом
4. Работает только с XLSX-файлами (не поддерживает XLS)

## Взаимодействие с другими компонентами

`SaxSheetHandler` тесно взаимодействует со следующими компонентами:

1. **SaxExcelToCSVStrategy**
   - Создает экземпляр `SaxSheetHandler`
   - Передает ему CSV-принтер и форматировщик данных
   - Использует его для обработки Excel-листов

2. **XSSFSheetXMLHandler**
   - Использует `SaxSheetHandler` для обработки событий SAX
   - Вызывает методы `startRow`, `endRow`, `cell` и `headerFooter`

3. **CSVPrinter**
   - Используется `SaxSheetHandler` для записи данных в CSV-файл
   - Обеспечивает правильное форматирование CSV
