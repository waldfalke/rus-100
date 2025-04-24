# Контракт: VendorConfig

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
Класс VendorConfig определяет контракт для конфигурации поставщиков (вендоров) данных. Он содержит настройки для маппинга полей, критерии дедупликации, правила обработки данных и другие параметры, специфичные для конкретного поставщика. Этот контракт используется в различных компонентах системы, включая Converter, Deduplicator и ETL-процесс.

## Интерфейс
```java
/**
 * Класс для конфигурации поставщика данных.
 */
public class VendorConfig {
    /**
     * Создает конфигурацию поставщика.
     *
     * @param name Имя поставщика
     * @param mapping Маппинг полей {поле_файла: поле_системы}
     * @param columnsToRemove Список колонок для удаления
     * @param duplicateThreshold Порог для определения дубликатов (0.0-1.0)
     * @param duplicateMethod Метод определения дубликатов
     * @param isbnFields Список полей, содержащих ISBN
     * @param detection Правила определения поставщика (например, шаблоны имен файлов, регулярные выражения)
     * @throws InvalidVendorConfigException Если обязательные поля отсутствуют или значения недопустимы
     *
     * @pre name != null && !name.isEmpty()
     * @pre mapping != null && !mapping.isEmpty()
     * @pre 0.0 <= duplicateThreshold <= 1.0
     * @pre duplicateMethod != null
     * @post this.name == name
     * @post this.mapping == mapping
     */
    public VendorConfig(String name, Map<String, String> mapping, List<String> columnsToRemove,
                        double duplicateThreshold, String duplicateMethod, List<String> isbnFields,
                        Map<String, Object> detection);

    /**
     * Возвращает имя поставщика.
     *
     * @return Имя поставщика
     *
     * @post result != null && !result.isEmpty()
     */
    public String getName();

    /**
     * Возвращает маппинг полей.
     *
     * @return Маппинг полей {поле_файла: поле_системы}
     *
     * @post result != null
     */
    public Map<String, String> getMapping();

    /**
     * Возвращает список колонок для удаления.
     *
     * @return Список колонок для удаления
     *
     * @post result != null
     */
    public List<String> getColumnsToRemove();

    /**
     * Возвращает порог для определения дубликатов.
     *
     * @return Порог для определения дубликатов (0.0-1.0)
     *
     * @post 0.0 <= result <= 1.0
     */
    public double getDuplicateThreshold();

    /**
     * Возвращает метод определения дубликатов.
     *
     * @return Метод определения дубликатов
     *
     * @post result != null
     */
    public String getDuplicateMethod();

    /**
     * Возвращает список полей, содержащих ISBN.
     *
     * @return Список полей, содержащих ISBN
     *
     * @post result != null
     */
    public List<String> getIsbnFields();

    /**
     * Возвращает правила определения поставщика.
     *
     * @return Правила определения поставщика
     *
     * @post result может быть null
     */
    public Map<String, Object> getDetection();

    /**
     * Создает конфигурацию поставщика из словаря.
     *
     * @param data Словарь с данными конфигурации
     * @return Конфигурация поставщика
     * @throws InvalidVendorConfigException Если обязательные поля отсутствуют или значения недопустимы
     *
     * @pre data != null
     * @pre data.containsKey("name")
     * @pre data.containsKey("mapping")
     * @post result != null
     */
    public static VendorConfig fromDict(Map<String, Object> data);

    /**
     * Преобразует конфигурацию в словарь.
     *
     * @return Словарь с данными конфигурации
     *
     * @post result != null
     * @post result.containsKey("name")
     * @post result.containsKey("mapping")
     */
    public Map<String, Object> toDict();
}
```

## Предусловия и постусловия

### Конструктор
- **Предусловия**:
  - name != null && !name.isEmpty()
  - mapping != null && !mapping.isEmpty()
  - 0.0 <= duplicateThreshold <= 1.0
  - duplicateMethod != null
- **Постусловия**:
  - this.name == name
  - this.mapping == mapping
  - this.columnsToRemove == columnsToRemove (или пустой список, если null)
  - this.duplicateThreshold == duplicateThreshold
  - this.duplicateMethod == duplicateMethod
  - this.isbnFields == isbnFields (или значение по умолчанию, если null)
  - this.detection == detection

### getName()
- **Предусловия**: Нет
- **Постусловия**:
  - result != null && !result.isEmpty()

### getMapping()
- **Предусловия**: Нет
- **Постусловия**:
  - result != null

### getColumnsToRemove()
- **Предусловия**: Нет
- **Постусловия**:
  - result != null

### getDuplicateThreshold()
- **Предусловия**: Нет
- **Постусловия**:
  - 0.0 <= result <= 1.0

### getDuplicateMethod()
- **Предусловия**: Нет
- **Постусловия**:
  - result != null

### getIsbnFields()
- **Предусловия**: Нет
- **Постусловия**:
  - result != null

### getDetection()
- **Предусловия**: Нет
- **Постусловия**:
  - result может быть null

### fromDict(Map<String, Object> data)
- **Предусловия**:
  - data != null
  - data.containsKey("name")
  - data.containsKey("mapping")
- **Постусловия**:
  - result != null
  - result.getName() == data.get("name")
  - result.getMapping() соответствует data.get("mapping")

### toDict()
- **Предусловия**: Нет
- **Постусловия**:
  - result != null
  - result.containsKey("name")
  - result.containsKey("mapping")
  - result.get("name") == getName()
  - result.get("mapping") соответствует getMapping()

## Инварианты
- Имя поставщика всегда не null и не пустое
- Маппинг полей всегда не null и содержит хотя бы одну запись
- Порог для определения дубликатов всегда в диапазоне [0.0, 1.0]
- Метод определения дубликатов всегда не null
- Список колонок для удаления всегда не null (может быть пустым)
- Список полей, содержащих ISBN, всегда не null (может быть пустым)

## Исключения
- **InvalidVendorConfigException**: если обязательные поля отсутствуют или значения недопустимы

## Примеры использования
```java
// Пример создания конфигурации для поставщика книг
Map<String, String> mapping = Map.of(
    "Изображения", "images",
    "Название", "title",
    "Артикул", "sku",
    "Цена", "price",
    "Автор", "author",
    "ISBN", "isbn"
);

List<String> columnsToRemove = Arrays.asList("Наличие", "Бренд", "Категория");

VendorConfig bookVendorConfig = new VendorConfig(
    "book24",
    mapping,
    columnsToRemove,
    0.9,
    "exact",
    Arrays.asList("ISBN", "Артикул"),
    Map.of("filename_pattern", "book24.*\\.xlsx")
);

// Пример создания конфигурации из словаря
Map<String, Object> configData = Map.of(
    "name", "chitai-gorod",
    "mapping", Map.of(
        "Изображения", "images",
        "Название", "title",
        "Артикул", "sku",
        "Цена", "price",
        "Автор", "author",
        "ID товара", "id",
        "ISBN", "isbn"
    ),
    "duplicate_threshold", 0.85,
    "duplicate_method", "fuzzy"
);

VendorConfig chitaiGorodConfig = VendorConfig.fromDict(configData);

// Пример использования конфигурации в ETL-процессе
Converter converter = new ExcelConverter();
Stream<JSONObject> jsonData = converter.convert(excelFile, bookVendorConfig);

// Пример преобразования конфигурации в словарь
Map<String, Object> configDict = bookVendorConfig.toDict();
System.out.println("Vendor name: " + configDict.get("name"));
```

## Реализации
- **DefaultVendorConfig**: базовая реализация, использующая значения по умолчанию для необязательных полей
- **JsonVendorConfig**: реализация, загружающая конфигурацию из JSON-файла
- **YamlVendorConfig**: реализация, загружающая конфигурацию из YAML-файла

## Связанные контракты
- [Converter Interface Contract](./contract.md)
- [VendorDetector Contract](./vendor-detector.md)
- [Deduplicator Interface Contract](../deduplicator/contract.md)
