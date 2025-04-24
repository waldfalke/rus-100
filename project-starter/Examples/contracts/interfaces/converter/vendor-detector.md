# Контракт: VendorDetector Interface

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
Интерфейс VendorDetector определяет контракт для компонентов, отвечающих за определение поставщика (вендора) на основе имени файла или его содержимого. Это важный компонент модуля Converter, который позволяет адаптировать процесс конвертации под специфику конкретного поставщика.

### Критерии определения поставщика
Поставщик определяется на основе следующих критериев:

1. **Анализ имени файла**:
   - Соответствие шаблонам имен файлов конкретных поставщиков
   - Наличие ключевых слов в имени файла ("book24", "chitai-gorod", "bookvoed" и т.д.)

2. **Анализ содержимого файла**:
   - Структура заголовков столбцов
   - Формат данных в конкретных столбцах
   - Наличие характерных маркеров в данных

### Алгоритм определения
1. Сначала происходит попытка определить поставщика по имени файла (быстрый метод)
2. Если по имени файла не удалось определить поставщика, происходит анализ содержимого файла (более ресурсоемкий метод)
3. Если поставщик определен, возвращается соответствующая конфигурация
4. Если поставщик не определен, выбрасывается исключение или возвращается конфигурация по умолчанию

## Интерфейс
```java
/**
 * Интерфейс для определения поставщика (вендора) на основе файла.
 */
public interface VendorDetector {
    /**
     * Определяет поставщика на основе имени файла.
     *
     * @param fileName Имя файла
     * @return Имя поставщика или null, если поставщик не определен
     *
     * @pre fileName != null
     * @post result != null || result == null
     */
    String detectVendorByFileName(String fileName);

    /**
     * Определяет конфигурацию поставщика на основе имени файла.
     *
     * @param fileName Имя файла
     * @return Конфигурация поставщика или null, если поставщик не определен
     * @throws VendorNotFoundException Если поставщик не может быть определен
     *
     * @pre fileName != null
     * @post result != null
     */
    VendorConfig detectVendorConfigByFileName(String fileName) throws VendorNotFoundException;

    /**
     * Определяет поставщика на основе содержимого файла.
     *
     * @param file Файл для анализа
     * @return Имя поставщика или null, если поставщик не определен
     * @throws IOException Если произошла ошибка при чтении файла
     *
     * @pre file != null
     * @pre file.exists()
     * @pre file.canRead()
     * @post result != null || result == null
     */
    String detectVendorByContent(File file) throws IOException;

    /**
     * Определяет конфигурацию поставщика на основе содержимого файла.
     *
     * @param file Файл для анализа
     * @return Конфигурация поставщика
     * @throws IOException Если произошла ошибка при чтении файла
     * @throws VendorNotFoundException Если поставщик не может быть определен
     *
     * @pre file != null
     * @pre file.exists()
     * @pre file.canRead()
     * @post result != null
     */
    VendorConfig detectVendorConfigByContent(File file) throws IOException, VendorNotFoundException;

    /**
     * Определяет поставщика на основе имени файла и его содержимого.
     * Сначала пытается определить по имени файла, затем по содержимому.
     *
     * @param file Файл для анализа
     * @return Имя поставщика или null, если поставщик не определен
     * @throws IOException Если произошла ошибка при чтении файла
     *
     * @pre file != null
     * @pre file.exists()
     * @pre file.canRead()
     * @post result != null || result == null
     */
    String detectVendor(File file) throws IOException;

    /**
     * Определяет конфигурацию поставщика на основе имени файла и его содержимого.
     * Сначала пытается определить по имени файла, затем по содержимому.
     *
     * @param file Файл для анализа
     * @return Конфигурация поставщика
     * @throws IOException Если произошла ошибка при чтении файла
     * @throws VendorNotFoundException Если поставщик не может быть определен
     *
     * @pre file != null
     * @pre file.exists()
     * @pre file.canRead()
     * @post result != null
     */
    VendorConfig detectVendorConfig(File file) throws IOException, VendorNotFoundException;

    /**
     * Возвращает список поддерживаемых поставщиков.
     *
     * @return Список имен поставщиков
     *
     * @post result != null
     */
    List<String> getSupportedVendors();

    /**
     * Возвращает список всех доступных конфигураций поставщиков.
     *
     * @return Список конфигураций поставщиков
     *
     * @post result != null
     */
    List<VendorConfig> getAllVendorConfigs();

    /**
     * Проверяет, поддерживается ли указанный поставщик.
     *
     * @param vendorName Имя поставщика
     * @return true, если поставщик поддерживается, иначе false
     *
     * @pre vendorName != null
     * @post result == true || result == false
     */
    boolean isVendorSupported(String vendorName);

    /**
     * Возвращает конфигурацию поставщика по имени.
     *
     * @param vendorName Имя поставщика
     * @return Конфигурация поставщика
     * @throws VendorNotFoundException Если поставщик не найден
     *
     * @pre vendorName != null
     * @pre !vendorName.isEmpty()
     * @post result != null
     */
    VendorConfig getVendorConfigByName(String vendorName) throws VendorNotFoundException;

    /**
     * Регистрирует новую конфигурацию поставщика.
     *
     * @param vendorConfig Конфигурация поставщика
     * @throws IllegalArgumentException Если конфигурация некорректна
     * @throws DuplicateVendorException Если поставщик с таким именем уже зарегистрирован
     *
     * @pre vendorConfig != null
     * @post getAllVendorConfigs().contains(vendorConfig)
     */
    void registerVendorConfig(VendorConfig vendorConfig) throws IllegalArgumentException, DuplicateVendorException;

    /**
     * Обновляет существующую конфигурацию поставщика.
     *
     * @param vendorConfig Обновленная конфигурация поставщика
     * @throws VendorNotFoundException Если поставщик не найден
     * @throws IllegalArgumentException Если конфигурация некорректна
     *
     * @pre vendorConfig != null
     * @post getVendorConfigByName(vendorConfig.getName()).equals(vendorConfig)
     */
    void updateVendorConfig(VendorConfig vendorConfig) throws VendorNotFoundException, IllegalArgumentException;

    /**
     * Удаляет конфигурацию поставщика.
     *
     * @param vendorName Имя поставщика
     * @throws VendorNotFoundException Если поставщик не найден
     *
     * @pre vendorName != null
     * @pre !vendorName.isEmpty()
     * @post !getAllVendorConfigs().stream().anyMatch(v -> v.getName().equals(vendorName))
     */
    void removeVendorConfig(String vendorName) throws VendorNotFoundException;
}

/**
 * Исключение, выбрасываемое, когда поставщик не может быть определен или найден.
 */
public class VendorNotFoundException extends Exception {
    public VendorNotFoundException(String message) {
        super(message);
    }
}

/**
 * Исключение, выбрасываемое при попытке зарегистрировать поставщика с именем, которое уже существует.
 */
public class DuplicateVendorException extends Exception {
    public DuplicateVendorException(String message) {
        super(message);
    }
}
```

## Предусловия и постусловия

### detectVendorByFileName(String fileName)
- **Предусловия**:
  - fileName != null
- **Постусловия**:
  - result != null || result == null

### detectVendorConfigByFileName(String fileName)
- **Предусловия**:
  - fileName != null
- **Постусловия**:
  - result != null

### detectVendorByContent(File file)
- **Предусловия**:
  - file != null
  - file.exists()
  - file.canRead()
- **Постусловия**:
  - result != null || result == null

### detectVendorConfigByContent(File file)
- **Предусловия**:
  - file != null
  - file.exists()
  - file.canRead()
- **Постусловия**:
  - result != null

### detectVendor(File file)
- **Предусловия**:
  - file != null
  - file.exists()
  - file.canRead()
- **Постусловия**:
  - result != null || result == null

### detectVendorConfig(File file)
- **Предусловия**:
  - file != null
  - file.exists()
  - file.canRead()
- **Постусловия**:
  - result != null

### getSupportedVendors()
- **Предусловия**: нет
- **Постусловия**:
  - result != null

### getAllVendorConfigs()
- **Предусловия**: нет
- **Постусловия**:
  - result != null

### isVendorSupported(String vendorName)
- **Предусловия**:
  - vendorName != null
- **Постусловия**:
  - result == true || result == false

### getVendorConfigByName(String vendorName)
- **Предусловия**:
  - vendorName != null
  - !vendorName.isEmpty()
- **Постусловия**:
  - result != null

### registerVendorConfig(VendorConfig vendorConfig)
- **Предусловия**:
  - vendorConfig != null
- **Постусловия**:
  - getAllVendorConfigs().contains(vendorConfig)

### updateVendorConfig(VendorConfig vendorConfig)
- **Предусловия**:
  - vendorConfig != null
- **Постусловия**:
  - getVendorConfigByName(vendorConfig.getName()).equals(vendorConfig)

### removeVendorConfig(String vendorName)
- **Предусловия**:
  - vendorName != null
  - !vendorName.isEmpty()
- **Постусловия**:
  - !getAllVendorConfigs().stream().anyMatch(v -> v.getName().equals(vendorName))

## Инварианты
- Детектор должен возвращать одинаковый результат для одного и того же файла при повторных вызовах
- Детектор должен быть потокобезопасным
- Имена поставщиков должны быть уникальными
- Каждый поставщик должен иметь корректную конфигурацию
- Детектор должен всегда возвращать действительную конфигурацию поставщика или выбрасывать исключение

## Исключения
- **IOException**: если произошла ошибка при чтении файла
- **IllegalArgumentException**: если нарушены предусловия методов или конфигурация поставщика некорректна
- **VendorNotFoundException**: если поставщик не может быть определен или найден
- **DuplicateVendorException**: при попытке зарегистрировать поставщика с именем, которое уже существует

## Примеры использования
```java
// Пример использования VendorDetector для определения поставщика
File excelFile = new File("book24_catalog.xlsx");
VendorDetector detector = new SimpleVendorDetector();

// Определение поставщика по имени файла
String vendorByName = detector.detectVendorByFileName(excelFile.getName());
System.out.println("Vendor by file name: " + vendorByName);

// Определение поставщика по содержимому файла
String vendorByContent = detector.detectVendorByContent(excelFile);
System.out.println("Vendor by content: " + vendorByContent);

// Определение поставщика комбинированным методом
String vendor = detector.detectVendor(excelFile);
System.out.println("Detected vendor: " + vendor);

// Пример использования VendorDetector для получения конфигурации поставщика
try {
    // Определение конфигурации поставщика по файлу
    VendorConfig vendorConfig = detector.detectVendorConfig(excelFile);
    System.out.println("Detected vendor: " + vendorConfig.getName());
    System.out.println("Mapping: " + vendorConfig.getMapping());

    // Использование конфигурации для конвертации
    Converter converter = new ExcelConverter();
    Stream<JSONObject> jsonData = converter.convert(excelFile, vendorConfig);
    jsonData.forEach(System.out::println);
} catch (VendorNotFoundException e) {
    System.err.println("Vendor not detected: " + e.getMessage());
    // Использование конфигурации по умолчанию
    try {
        VendorConfig defaultConfig = detector.getVendorConfigByName("default");
        // Использование конфигурации по умолчанию
    } catch (VendorNotFoundException ex) {
        System.err.println("Default vendor not found: " + ex.getMessage());
    }
} catch (IOException e) {
    System.err.println("Error reading file: " + e.getMessage());
}

// Пример работы с конфигурациями поставщиков
// Проверка поддержки поставщика
boolean isSupported = detector.isVendorSupported("book24");
System.out.println("Is book24 supported: " + isSupported);

// Получение списка поддерживаемых поставщиков
List<String> supportedVendors = detector.getSupportedVendors();
System.out.println("Supported vendors: " + supportedVendors);

// Получение всех конфигураций поставщиков
List<VendorConfig> allConfigs = detector.getAllVendorConfigs();
allConfigs.forEach(config -> System.out.println(config.getName()));

// Пример регистрации новой конфигурации поставщика
Map<String, String> mapping = Map.of(
    "Изображения", "images",
    "Название", "title",
    "Артикул", "sku",
    "Цена", "price",
    "Автор", "author",
    "ISBN", "isbn"
);

VendorConfig newVendorConfig = new VendorConfig(
    "new-vendor",
    mapping,
    Arrays.asList("Наличие", "Бренд"),
    0.9,
    "exact",
    Arrays.asList("ISBN", "Артикул"),
    Map.of("filename_pattern", "new-vendor.*\\.xlsx")
);

try {
    detector.registerVendorConfig(newVendorConfig);
    System.out.println("New vendor configuration registered successfully");
} catch (DuplicateVendorException e) {
    System.err.println("Vendor already exists: " + e.getMessage());
    // Обновление существующей конфигурации
    try {
        detector.updateVendorConfig(newVendorConfig);
        System.out.println("Vendor configuration updated successfully");
    } catch (VendorNotFoundException ex) {
        System.err.println("Vendor not found: " + ex.getMessage());
    }
} catch (IllegalArgumentException e) {
    System.err.println("Invalid vendor configuration: " + e.getMessage());
}
```

## Реализации
- **DefaultVendorDetector**: основная реализация, использующая комбинацию методов определения поставщика
- **SimpleVendorDetector**: базовая реализация, использующая регулярные выражения для определения поставщика по имени файла и простой анализ содержимого
- **PatternBasedVendorDetector**: реализация, использующая настраиваемые шаблоны для определения поставщика
- **MLVendorDetector**: реализация, использующая машинное обучение для определения поставщика на основе содержимого файла
- **CachedVendorDetector**: реализация с кэшированием результатов для повышения производительности
- **ConfigurableVendorDetector**: реализация с возможностью настройки приоритетов методов определения

## Связанные контракты
- [Converter Interface Contract](./contract.md)
- [VendorConfig Contract](./vendor-config.md)
- [ETL Process Contract](../../ETL-Process-Contract.md)
