# Контракт импорта прайс-листов (Price List Import Contract)

## Метаданные
- **Версия**: 1.0.0
- **Статус**: Планируемый
- **Последнее обновление**: 2025-04-20
- **Последний редактор**: AI
- **Ветка разработки**: main

## История изменений
| Дата | Версия | Автор | Описание изменений | PR |
|------|--------|-------|-------------------|-----|
| 2025-04-20 | 1.0.0 | AI | Начальная версия | - |

## Описание
Данный контракт определяет процесс импорта прайс-листов от различных поставщиков в систему CATMEPIM. Контракт описывает форматы прайс-листов, процесс валидации данных, обработку ошибок и хранение импортированной информации.

## Интерфейс

```java
package com.catmepim.import;

import com.catmepim.model.PriceList;
import com.catmepim.model.PriceItem;
import com.catmepim.model.Supplier;
import com.catmepim.model.ImportResult;
import java.io.File;
import java.io.InputStream;
import java.util.List;

/**
 * Интерфейс для импорта прайс-листов
 */
public interface PriceListImporter {
    
    /**
     * Импортировать прайс-лист из файла
     * 
     * @param file Файл с прайс-листом
     * @param supplier Поставщик, от которого получен прайс-лист
     * @param options Дополнительные параметры импорта
     * @return Результат импорта с информацией о количестве обработанных записей и ошибках
     */
    ImportResult importFromFile(File file, Supplier supplier, ImportOptions options);
    
    /**
     * Импортировать прайс-лист из потока
     * 
     * @param inputStream Поток данных с прайс-листом
     * @param fileType Тип файла (CSV, Excel, XML, JSON)
     * @param supplier Поставщик, от которого получен прайс-лист
     * @param options Дополнительные параметры импорта
     * @return Результат импорта с информацией о количестве обработанных записей и ошибках
     */
    ImportResult importFromStream(InputStream inputStream, FileType fileType, 
                                 Supplier supplier, ImportOptions options);
    
    /**
     * Валидировать файл прайс-листа без импорта
     * 
     * @param file Файл с прайс-листом
     * @param supplier Поставщик, от которого получен прайс-лист
     * @return Отчет о валидации с указанием потенциальных проблем
     */
    ValidationReport validateFile(File file, Supplier supplier);
    
    /**
     * Получить шаблон для импорта прайс-листа для конкретного поставщика
     * 
     * @param supplier Поставщик
     * @param fileType Тип файла (CSV, Excel, XML, JSON)
     * @return Файл с шаблоном прайс-листа
     */
    File getImportTemplate(Supplier supplier, FileType fileType);
    
    /**
     * Перечисление поддерживаемых типов файлов
     */
    public enum FileType {
        CSV, EXCEL, XML, JSON
    }
    
    /**
     * Класс для настройки параметров импорта
     */
    public static class ImportOptions {
        private boolean updateExistingPrices;
        private boolean createNewProducts;
        private boolean validateOnly;
        private PriceList.PriceType priceType; // Розничная, оптовая, рекомендованная
        private String currencyCode;
        private String dateFormat;
        private String encoding;
        private boolean skipFirstRow;
        private ColumnMapping columnMapping;
        
        // Геттеры и сеттеры...
    }
    
    /**
     * Класс для отчета о валидации
     */
    public static class ValidationReport {
        private int totalRows;
        private int invalidRows;
        private List<ValidationError> errors;
        private List<ValidationWarning> warnings;
        
        // Геттеры и сеттеры...
    }
    
    /**
     * Класс для отображения колонок файла на поля системы
     */
    public static class ColumnMapping {
        private Map<String, String> fieldToColumnMap;
        
        // Геттеры и сеттеры...
    }
}
```

## Форматы прайс-листов

Система поддерживает следующие форматы файлов прайс-листов:

### 1. CSV
```csv
ISBN;Название;Автор;Издательство;Цена;Наличие;Валюта
9785699123456;Война и мир;Лев Толстой;Эксмо;450.50;125;RUB
9785170987654;Мастер и Маргарита;Михаил Булгаков;АСТ;380.00;47;RUB
```

### 2. Excel (XLSX, XLS)
Стандартная таблица Excel с заголовками в первой строке и данными в последующих строках.

### 3. XML
```xml
<pricelist supplier="Эксмо" date="2025-01-15">
  <item>
    <isbn>9785699123456</isbn>
    <title>Война и мир</title>
    <author>Лев Толстой</author>
    <publisher>Эксмо</publisher>
    <price currency="RUB">450.50</price>
    <stock>125</stock>
  </item>
  <item>
    <isbn>9785170987654</isbn>
    <title>Мастер и Маргарита</title>
    <author>Михаил Булгаков</author>
    <publisher>АСТ</publisher>
    <price currency="RUB">380.00</price>
    <stock>47</stock>
  </item>
</pricelist>
```

### 4. JSON
```json
{
  "supplier": "Эксмо",
  "date": "2025-01-15",
  "items": [
    {
      "isbn": "9785699123456",
      "title": "Война и мир",
      "author": "Лев Толстой",
      "publisher": "Эксмо",
      "price": 450.50,
      "currency": "RUB",
      "stock": 125
    },
    {
      "isbn": "9785170987654",
      "title": "Мастер и Маргарита",
      "author": "Михаил Булгаков",
      "publisher": "АСТ",
      "price": 380.00,
      "currency": "RUB",
      "stock": 47
    }
  ]
}
```

## Сопоставление полей

Каждый формат прайс-листа должен содержать минимальный набор полей:

| Поле системы | Описание | Обязательно |
|--------------|----------|-------------|
| isbn | ISBN или EAN книги | Да* |
| title | Название книги | Да |
| author | Автор(ы) книги | Нет |
| publisher | Издательство | Нет |
| price | Цена | Да |
| currency | Валюта (ISO 4217) | Да |
| stock | Наличие (количество) | Нет |
| publicationYear | Год издания | Нет |
| pages | Количество страниц | Нет |
| weight | Вес | Нет |
| dimensions | Размеры | Нет |
| cover | Тип обложки | Нет |
| description | Описание | Нет |

\* ISBN или title+author должны присутствовать для идентификации товара

## Процесс импорта

### 1. Загрузка файла
Файл прайс-листа загружается через веб-интерфейс или API.

### 2. Определение формата
Система автоматически определяет формат файла по расширению или содержимому.

### 3. Валидация данных
Производится проверка:
- Структуры файла (соответствие ожидаемому формату)
- Наличия обязательных полей
- Корректности данных (ISBN, цены, дат и т.д.)

### 4. Отображение предварительных результатов
Пользователю показывается:
- Количество успешно прочитанных записей
- Количество записей с ошибками
- Примеры данных для подтверждения правильности импорта

### 5. Сопоставление полей (при необходимости)
Если система не может автоматически определить соответствие колонок файла полям системы, пользователю предлагается выполнить сопоставление вручную.

### 6. Обработка данных
После подтверждения пользователем данные:
- Преобразуются в единый формат
- Сопоставляются с существующими товарами в базе (см. [Product Matching Contract](./product_matching_contract.md))
- Сохраняются в базу данных

### 7. Формирование отчета
Генерируется итоговый отчет с информацией:
- Количество импортированных записей
- Количество обновленных цен
- Количество товаров, требующих ручного сопоставления
- Ошибки и предупреждения

## Обработка ошибок

### Типы ошибок
1. **Критические ошибки** - приводят к отмене импорта:
   - Неподдерживаемый формат файла
   - Повреждение файла
   - Отсутствие обязательных колонок

2. **Ошибки на уровне записей** - не прерывают импорт, но запись игнорируется:
   - Отсутствие идентификаторов товара (ISBN или название+автор)
   - Некорректный формат данных (например, цена содержит буквы)
   - Недопустимые значения (отрицательная цена, несуществующий ISBN)

3. **Предупреждения** - запись обрабатывается, но пользователь информируется:
   - Значительное отклонение цены от текущей
   - Неполные данные (отсутствие необязательных, но желательных полей)
   - Потенциальные дубликаты

### Действия при ошибках
- Для каждой записи с ошибкой формируется подробное описание проблемы
- Пользователю предоставляется возможность исправить ошибки и повторить импорт
- Ведется журнал всех импортов и связанных с ними ошибок

## Примеры использования

### Пример 1: Базовый импорт CSV-файла

```java
// Создание импортера для прайс-листов
PriceListImporter importer = new StandardPriceListImporter();

// Получение файла прайс-листа
File priceListFile = new File("/uploads/supplier_prices.csv");

// Получение информации о поставщике
Supplier supplier = supplierService.findById(1L);

// Настройка параметров импорта
ImportOptions options = new ImportOptions();
options.setUpdateExistingPrices(true);
options.setCreateNewProducts(false);
options.setPriceType(PriceList.PriceType.RETAIL);
options.setCurrencyCode("RUB");
options.setSkipFirstRow(true);

// Выполнение импорта
ImportResult result = importer.importFromFile(priceListFile, supplier, options);

// Обработка результата
System.out.println("Всего записей: " + result.getTotalItems());
System.out.println("Успешно импортировано: " + result.getSuccessfullyImported());
System.out.println("Требуют ручной обработки: " + result.getPendingReview());
System.out.println("Ошибки: " + result.getErrors().size());
```

### Пример 2: Валидация файла перед импортом

```java
// Создание импортера для прайс-листов
PriceListImporter importer = new StandardPriceListImporter();

// Получение файла прайс-листа
File priceListFile = new File("/uploads/supplier_prices.xlsx");

// Получение информации о поставщике
Supplier supplier = supplierService.findById(2L);

// Валидация файла
ValidationReport report = importer.validateFile(priceListFile, supplier);

// Анализ отчета валидации
if (report.getInvalidRows() > 0) {
    System.out.println("Найдены ошибки в файле:");
    for (ValidationError error : report.getErrors()) {
        System.out.println("Строка " + error.getRowNumber() + ": " + error.getMessage());
    }
} else {
    System.out.println("Файл прошел валидацию успешно. Можно импортировать.");
}
```

## Реализации

### 1. StandardPriceListImporter
Стандартная реализация, поддерживающая все основные форматы (CSV, Excel, XML, JSON).

### 2. FastPriceListImporter
Оптимизированная реализация для работы с большими файлами, использующая потоковую обработку данных.

### 3. ExtendedPriceListImporter
Расширенная реализация с поддержкой дополнительных форматов и расширенным набором полей.

## Инварианты и гарантии

1. **Целостность данных**:
   - Импорт выполняется как транзакция: или все корректные записи импортируются, или ни одна
   - Ошибки в отдельных записях не приводят к отмене всего импорта

2. **Производительность**:
   - Импорт файла размером до 10 МБ должен выполняться не более 1 минуты
   - Поддержка файлов размером до 100 МБ с возможностью асинхронной обработки

3. **Безопасность**:
   - Проверка файлов на вирусы и вредоносный код
   - Ограничение размера загружаемых файлов
   - Валидация всех входных данных для предотвращения инъекций

## Связанные контракты

- [Product Matching Contract](./product_matching_contract.md) - Контракт сопоставления товаров
- [Database Schema Contract](../database/target_schema.md) - Схема базы данных
- [Supplier API Contract](../api/supplier_api_contract.md) - API для поставщиков 