# Контракт: JsonCleaner

## Метаданные
- **Версия**: 1.0.0
- **Статус**: Стабильный
- **Последнее обновление**: 2025-04-15
- **Последний редактор**: AI
- **Ветка разработки**: main

## История изменений
| Дата | Версия | Автор | Описание изменений | PR |
|------|--------|-------|-------------------|-----|
| 2025-04-15 | 1.0.0 | AI | Начальная версия | - |

## Описание
Класс JsonCleaner предоставляет функциональность для очистки и нормализации JSON-данных перед их загрузкой в базу данных. Он выполняет такие операции, как замена null-значений, удаление лишних пробелов, обработка специальных символов и проверка длины строковых значений. Это обеспечивает совместимость данных с PostgreSQL и другими системами хранения.

## Интерфейс
```java
/**
 * Класс для очистки JSON-данных перед загрузкой в PostgreSQL.
 * Выполняет следующие преобразования:
 * 1. Заменяет null, "null", "nan", "NaN" на пустые строки
 * 2. Удаляет лишние пробелы
 * 3. Обрабатывает специальные символы
 * 4. Проверяет длину строковых значений
 */
public class JsonCleaner {
    /**
     * Создает новый экземпляр JsonCleaner.
     */
    public JsonCleaner();

    /**
     * Очищает JSON-файл и сохраняет результат в новый файл.
     *
     * @param inputFilePath путь к входному JSON-файлу
     * @param outputFilePath путь к выходному JSON-файлу
     * @throws IOException если произошла ошибка при чтении или записи файла
     * 
     * @pre inputFilePath != null
     * @pre !inputFilePath.isEmpty()
     * @pre outputFilePath != null
     * @pre !outputFilePath.isEmpty()
     * @pre Файл по пути inputFilePath существует и доступен для чтения
     * @pre Директория для outputFilePath существует и доступна для записи
     * @post Файл по пути outputFilePath создан и содержит очищенные данные
     */
    public void cleanJsonFile(String inputFilePath, String outputFilePath) throws IOException;

    /**
     * Очищает объект JSON.
     *
     * @param node объект JSON для очистки
     * @return очищенный объект JSON
     * 
     * @pre node != null
     * @post result != null
     */
    private ObjectNode cleanObjectNode(ObjectNode node);

    /**
     * Очищает массив JSON.
     *
     * @param array массив JSON для очистки
     * @return очищенный массив JSON
     * 
     * @pre array != null
     * @post result != null
     */
    private ArrayNode cleanArrayNode(ArrayNode array);

    /**
     * Очищает строковое значение.
     *
     * @param value строковое значение для очистки
     * @return очищенное строковое значение
     * 
     * @post result != null
     */
    private String cleanStringValue(String value);
}
```

## Предусловия и постусловия

### JsonCleaner()
- **Предусловия**: нет
- **Постусловия**: нет

### cleanJsonFile(String inputFilePath, String outputFilePath)
- **Предусловия**:
  - inputFilePath != null
  - !inputFilePath.isEmpty()
  - outputFilePath != null
  - !outputFilePath.isEmpty()
  - Файл по пути inputFilePath существует и доступен для чтения
  - Директория для outputFilePath существует и доступна для записи
- **Постусловия**:
  - Файл по пути outputFilePath создан и содержит очищенные данные

### cleanObjectNode(ObjectNode node)
- **Предусловия**:
  - node != null
- **Постусловия**:
  - result != null

### cleanArrayNode(ArrayNode array)
- **Предусловия**:
  - array != null
- **Постусловия**:
  - result != null

### cleanStringValue(String value)
- **Предусловия**: нет
- **Постусловия**:
  - result != null

## Инварианты
- Очистка данных не должна изменять структуру JSON (объекты, массивы)
- Очистка данных не должна удалять поля из JSON-объектов
- Очистка данных должна заменять null-значения на пустые строки
- Очистка данных должна удалять лишние пробелы в строковых значениях
- Очистка данных должна ограничивать длину строковых значений до MAX_STRING_LENGTH
- Очистка данных должна заменять специальные значения ("null", "nan", "NaN", "none") на пустые строки

## Исключения
- **IOException**: если произошла ошибка при чтении или записи файла
- **IllegalArgumentException**: если нарушены предусловия методов

## Примеры использования
```java
// Пример очистки JSON-файла
JsonCleaner cleaner = new JsonCleaner();
try {
    cleaner.cleanJsonFile("input.json", "output.json");
    System.out.println("JSON cleaning completed successfully");
} catch (IOException e) {
    System.err.println("Error during JSON cleaning: " + e.getMessage());
}

// Пример использования в процессе ETL
public void processJsonData(String inputJsonPath, String outputJsonPath) {
    try {
        // Шаг 1: Конвертация Excel в JSON
        ExcelToJsonConverter converter = new ExcelToJsonConverter(
            "data.xlsx", 
            "temp.json", 
            1000
        );
        converter.convert();
        
        // Шаг 2: Очистка JSON-данных
        JsonCleaner cleaner = new JsonCleaner();
        cleaner.cleanJsonFile("temp.json", outputJsonPath);
        
        // Шаг 3: Удаление временного файла
        new File("temp.json").delete();
        
        System.out.println("Data processing completed successfully");
    } catch (IOException e) {
        System.err.println("Error during data processing: " + e.getMessage());
    }
}
```

## Реализации
- **JsonCleaner**: основная реализация, использующая Jackson для работы с JSON

## Связанные контракты
- [ExcelToJsonConverter Contract](./excel-to-json-converter.md)
- [ETL Process Contract](../../ETL-Process-Contract.md)
- [DatabaseLoader Contract](../database-loader/contract.md)
