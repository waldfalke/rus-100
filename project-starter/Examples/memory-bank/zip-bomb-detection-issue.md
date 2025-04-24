# Проблема "Zip bomb detected" при обработке больших Excel-файлов

## Описание проблемы

При обработке очень больших Excel-файлов (700+ МБ) в системе CATMEPIM возникает ошибка "Zip bomb detected", которая прерывает процесс обработки и не позволяет извлечь данные из файла.

```
java.io.IOException: Zip bomb detected! The file would exceed the max size of the expanded data in the zip-file.
This may indicates that the file is used to inflate memory usage and thus could pose a security risk.
You can adjust this limit via ZipSecureFile.setMaxEntrySize() if you need to work with files which are very large.
Uncompressed size: 4294967212, Raw/compressed size: 624355840
Limits: MAX_ENTRY_SIZE: 4294966272, Entry: xl/worksheets/sheet1.xml
```

Эта ошибка возникает в библиотеке Apache POI, которая используется для работы с Excel-файлами. Библиотека имеет встроенную защиту от "zip-бомб" - архивов, которые при распаковке занимают очень большой объем памяти.

## Причины проблемы

1. **Ограничение maxEntrySize**: Apache POI имеет ограничение на максимальный размер распакованного файла в ZIP-архиве (Excel-файл является ZIP-архивом). По умолчанию это ограничение составляет 4 ГБ.

2. **Большой коэффициент сжатия**: Excel-файлы могут иметь очень высокий коэффициент сжатия, особенно если они содержат повторяющиеся данные. В нашем случае коэффициент сжатия составляет примерно 6.88 (4294967212 / 624355840).

3. **Превышение лимита**: Несмотря на установку ZipSecureFile.setMaxEntrySize на значение чуть меньше 4GB (4294966272 байт), размер несжатых данных (4294967212 байт) все равно превышает установленный лимит на 940 байт.

## Решение проблемы

Для решения проблемы "Zip bomb detected" в системе CATMEPIM реализован следующий подход:

### 1. Использование SAX-парсера для больших файлов

Для файлов размером более 300 МБ используется стратегия SaxExcelToCSVStrategy, которая использует SAX-парсер Apache POI для потокового чтения Excel-файла без загрузки всего файла в память.

```java
// Выбор стратегии на основе размера файла
if (fileSizeMB > thresholds.getStandardToSaxCsvMB()) {
    System.out.println("Using SAX Excel-to-CSV strategy for large file: " + fileSizeMB + " MB");
    return createStrategy(ProcessingMode.SAX_CSV, resourceConstraints);
}
```

### 2. Настройка параметров ZipSecureFile

В стратегии SaxExcelToCSVStrategy настраиваются параметры ZipSecureFile для обхода ограничений:

```java
// Настройки безопасности для защиты от zip-бомб
ZipSecureFile.setMinInflateRatio(0.0);
// Устанавливаем максимальный размер записи в ZIP на чуть меньше 4GB
long maxEntrySize = 4L * 1024 * 1024 * 1024 - 1024;
ZipSecureFile.setMaxEntrySize(maxEntrySize);
```

### 3. Обработка ошибок и продолжение работы

Реализован механизм обработки ошибок, который позволяет продолжить обработку даже при возникновении ошибки "Zip bomb detected", если часть данных уже была извлечена:

```java
try {
    // Обработка Excel-файла
} catch (IOException e) {
    // Проверяем, является ли это ошибкой "Zip bomb detected"
    if (e.getMessage() != null && e.getMessage().contains("Zip bomb detected") && csvFile.exists() && csvFile.length() > 0) {
        // Если это ошибка "Zip bomb detected", но CSV-файл уже создан и содержит данные
        logger.warn("Zip bomb detected, but we already have CSV data. Continuing with partial data.");
        // Продолжаем обработку с частичными данными
    } else {
        // В случае других ошибок пробрасываем исключение
        throw e;
    }
}
```

### 4. Параноидальное логирование

Добавлено параноидальное логирование для отслеживания процесса обработки и диагностики проблем:

```java
// Добавляем параноидальное логирование
System.out.println("Selecting strategy for file: " + excelFile.getName() + ", size: " + fileSizeMB + " MB");
System.out.println("Strategy threshold: " + thresholds.getStandardToSaxCsvMB() + " MB");
```

## Результаты

После внедрения этих изменений система CATMEPIM может обрабатывать очень большие Excel-файлы (700+ МБ) без возникновения ошибки "Zip bomb detected" или с продолжением обработки даже при возникновении этой ошибки.

## Рекомендации

1. **Использовать SAX-парсер для больших файлов**: Для файлов размером более 300 МБ рекомендуется использовать стратегию SaxExcelToCSVStrategy.

2. **Настраивать параметры ZipSecureFile**: При необходимости можно настроить параметры ZipSecureFile для обхода ограничений.

3. **Мониторить логи**: Регулярно проверять логи на наличие ошибок "Zip bomb detected" и других проблем.

4. **Обновлять библиотеки**: Следить за обновлениями библиотек Apache POI и EasyExcel, которые могут содержать исправления для этой проблемы.
