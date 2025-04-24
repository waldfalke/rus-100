# Контракт товаров/книг (Product Contract)

## Метаданные
| Атрибут | Значение |
|---------|----------|
| Версия | 1.0.0 |
| Статус | Планируемый |
| Последнее обновление | 2025-04-23 |
| Последний редактор | AI |

## История изменений
| Дата | Версия | Автор | Описание изменений | PR |
|------|--------|-------|-------------------|-----|
| 2025-04-23 | 1.0.0 | AI | Начальная версия | - |

## Описание

Данный контракт определяет структуру и правила работы с товарами (преимущественно книгами) в системе CATMEPIM. Контракт описывает как основные атрибуты и связи продуктов, так и механизмы их создания, обновления, валидации и удаления.

## Цели и задачи

**Основная цель**: Определить единый подход к управлению информацией о продуктах в системе CATMEPIM.

**Задачи**:
1. Стандартизировать структуру данных о продуктах
2. Обеспечить полноту и качество данных
3. Определить правила обработки продуктов
4. Установить механизмы валидации и нормализации
5. Описать API для работы с продуктами
6. Определить права доступа и контроль изменений

## Модель данных

### Основная сущность Product

```java
public class Product {
    // Идентификаторы
    private Long id;
    private String isbn;
    private String sku;
    
    // Основная информация
    private String title;
    private String originalTitle;
    private String description;
    private String shortDescription;
    
    // Связанные сущности
    private Publisher publisher;
    private List<Author> authors;
    private Category primaryCategory;
    private List<Category> additionalCategories;
    private List<Series> series;
    
    // Физические характеристики
    private Date publicationDate;
    private Integer pageCount;
    private String coverType; // hardcover, paperback, etc.
    private Double weight;
    private Dimensions dimensions;
    private String language;
    
    // Коммерческая информация
    private BigDecimal listPrice;
    private BigDecimal salePrice;
    private String currency;
    private BigDecimal costPrice;
    
    // Статус и метаданные
    private String status; // draft, active, inactive, discontinued
    private Double dataQualityScore;
    private Date createdAt;
    private Date updatedAt;
    private User createdBy;
    private Integer viewCount;
    private Date lastStockUpdate;
    
    // Расширяемые атрибуты
    private Map<String, AttributeValue> attributes;
    private Map<String, Object> additionalData;

    // Геттеры и сеттеры
    // ...
}
```

### Связанные сущности

#### Author (Автор)
```java
public class Author {
    private Long id;
    private String name;
    private String originalName;
    private String biography;
    private Date birthDate;
    private Date deathDate;
    private String imageUrl;
    private Map<String, String> externalLinks;
    private Date createdAt;
    private Date updatedAt;
    
    // Геттеры и сеттеры
    // ...
}
```

#### Publisher (Издательство)
```java
public class Publisher {
    private Long id;
    private String name;
    private String description;
    private String logoUrl;
    private String website;
    private Map<String, Object> contactInfo;
    private Date createdAt;
    private Date updatedAt;
    
    // Геттеры и сеттеры
    // ...
}
```

#### Category (Категория)
```java
public class Category {
    private Long id;
    private String name;
    private Category parent;
    private List<Category> children;
    private String description;
    private Integer level;
    private String path;
    private Boolean isActive;
    private Integer position;
    private Map<String, Object> attributesSchema;
    private Date createdAt;
    private Date updatedAt;
    
    // Геттеры и сеттеры
    // ...
}
```

#### AttributeValue (Значение атрибута)
```java
public class AttributeValue {
    private String name;
    private String value;
    private String type; // text, number, date, boolean, etc.
    private String unit;
    private Boolean isSearchable;
    private Boolean isDisplayed;
    private Integer displayOrder;
    private String source;
    private Date createdAt;
    private Date updatedAt;
    
    // Геттеры и сеттеры
    // ...
}
```

## Жизненный цикл продукта

### Статусы продукта

1. **draft** - Черновик, продукт создан, но не готов к публикации
2. **active** - Активный, продукт доступен для просмотра и заказа
3. **inactive** - Неактивный, продукт временно недоступен для заказа
4. **discontinued** - Снят с производства, продукт больше не выпускается

### Переходы состояний

```
                  ┌─────────────┐
                  │   draft     │
                  └─────────────┘
                        │
                        ▼
┌───────────┐     ┌─────────────┐    ┌─────────────┐
│ inactive  │◄───►│   active    │───►│discontinued │
└───────────┘     └─────────────┘    └─────────────┘
```

### Правила перехода состояний

1. Новый продукт создается в статусе `draft`
2. Продукт переходит из `draft` в `active` только после валидации всех обязательных полей
3. Активный продукт (`active`) может быть временно деактивирован (`inactive`) и затем снова активирован
4. Продукт в статусе `discontinued` не может быть возвращен в `active` или `inactive`
5. Продукт не может быть полностью удален из системы, только переведен в `discontinued`

## API для работы с продуктами

### Создание продукта

```java
/**
 * Создание нового продукта
 *
 * @param productData данные нового продукта
 * @return созданный продукт
 * @throws ValidationException если данные продукта не проходят валидацию
 */
Product createProduct(ProductDto productData) throws ValidationException;
```

### Получение продукта

```java
/**
 * Получение продукта по идентификатору
 *
 * @param productId идентификатор продукта
 * @return найденный продукт или null
 */
Product getProductById(Long productId);

/**
 * Поиск продукта по ISBN
 *
 * @param isbn ISBN книги
 * @return найденный продукт или null
 */
Product findProductByIsbn(String isbn);

/**
 * Поиск продукта по SKU
 *
 * @param sku SKU продукта
 * @return найденный продукт или null
 */
Product findProductBySku(String sku);
```

### Обновление продукта

```java
/**
 * Обновление существующего продукта
 *
 * @param productId идентификатор продукта
 * @param productData новые данные продукта
 * @return обновленный продукт
 * @throws EntityNotFoundException если продукт не найден
 * @throws ValidationException если данные продукта не проходят валидацию
 */
Product updateProduct(Long productId, ProductDto productData) 
    throws EntityNotFoundException, ValidationException;

/**
 * Обновление статуса продукта
 *
 * @param productId идентификатор продукта
 * @param newStatus новый статус
 * @param reason причина изменения статуса
 * @return обновленный продукт
 * @throws EntityNotFoundException если продукт не найден
 * @throws InvalidStateTransitionException если переход в новый статус невозможен
 */
Product updateProductStatus(Long productId, String newStatus, String reason)
    throws EntityNotFoundException, InvalidStateTransitionException;
```

### Управление атрибутами продукта

```java
/**
 * Добавление/обновление атрибута продукта
 *
 * @param productId идентификатор продукта
 * @param attributeName имя атрибута
 * @param attributeValue значение атрибута
 * @param attributeType тип атрибута
 * @return обновленный продукт
 * @throws EntityNotFoundException если продукт не найден
 */
Product setProductAttribute(Long productId, String attributeName, 
                          String attributeValue, String attributeType)
    throws EntityNotFoundException;

/**
 * Удаление атрибута продукта
 *
 * @param productId идентификатор продукта
 * @param attributeName имя атрибута
 * @return обновленный продукт
 * @throws EntityNotFoundException если продукт не найден
 */
Product removeProductAttribute(Long productId, String attributeName)
    throws EntityNotFoundException;
```

### Связи продукта с другими сущностями

```java
/**
 * Добавление автора к продукту
 *
 * @param productId идентификатор продукта
 * @param authorId идентификатор автора
 * @param role роль автора (автор, редактор, переводчик)
 * @param sequence порядковый номер для сортировки авторов
 * @return обновленный продукт
 * @throws EntityNotFoundException если продукт или автор не найден
 */
Product addAuthorToProduct(Long productId, Long authorId, String role, Integer sequence)
    throws EntityNotFoundException;

/**
 * Добавление категории к продукту
 *
 * @param productId идентификатор продукта
 * @param categoryId идентификатор категории
 * @param isPrimary является ли категория основной
 * @return обновленный продукт
 * @throws EntityNotFoundException если продукт или категория не найдены
 */
Product addCategoryToProduct(Long productId, Long categoryId, Boolean isPrimary)
    throws EntityNotFoundException;

/**
 * Добавление продукта в серию
 *
 * @param productId идентификатор продукта
 * @param seriesId идентификатор серии
 * @param sequenceNumber порядковый номер в серии
 * @param volumeTitle название тома (если отличается от основного названия)
 * @return обновленный продукт
 * @throws EntityNotFoundException если продукт или серия не найдены
 */
Product addProductToSeries(Long productId, Long seriesId, 
                         Integer sequenceNumber, String volumeTitle)
    throws EntityNotFoundException;
```

## Поиск и фильтрация продуктов

### Поисковый запрос

```java
public class ProductSearchQuery {
    private String textQuery;
    private List<Long> categoryIds;
    private List<Long> authorIds;
    private List<Long> publisherIds;
    private List<Long> seriesIds;
    private DateRange publicationDateRange;
    private PriceRange priceRange;
    private List<String> statuses;
    private List<AttributeFilter> attributeFilters;
    private Boolean inStock;
    private String sortBy;
    private String sortDirection;
    private Integer page;
    private Integer pageSize;
    
    // Геттеры и сеттеры
    // ...
}

public class AttributeFilter {
    private String attributeName;
    private String operator; // eq, ne, gt, lt, in, between, contains
    private Object value;
    
    // Геттеры и сеттеры
    // ...
}
```

### API поиска

```java
/**
 * Поиск продуктов по заданным критериям
 *
 * @param query поисковый запрос
 * @return страница результатов поиска
 */
Page<Product> searchProducts(ProductSearchQuery query);

/**
 * Быстрый полнотекстовый поиск продуктов
 *
 * @param searchText текст для поиска
 * @param page номер страницы
 * @param pageSize размер страницы
 * @return страница результатов поиска
 */
Page<Product> quickSearch(String searchText, Integer page, Integer pageSize);
```

## Валидация и качество данных

### Уровни валидации

1. **Базовая валидация** - проверка обязательных полей и типов данных
2. **Структурная валидация** - проверка согласованности данных (например, дата публикации не может быть в будущем)
3. **Бизнес-валидация** - проверка соответствия бизнес-правилам (например, ISBN должен быть действительным)
4. **Контекстная валидация** - проверка зависящая от контекста (например, для активации все обязательные поля должны быть заполнены)

### Правила валидации

1. **Базовые правила**:
   - Название (title) обязательно и не должно превышать 255 символов
   - ISBN должен соответствовать формату ISBN-10 или ISBN-13
   - SKU должен быть уникальным в системе
   - Цена не может быть отрицательной

2. **Категориальные правила**:
   - Каждый продукт должен иметь хотя бы одну категорию
   - Если указано несколько категорий, одна должна быть отмечена как основная

3. **Правила для публикации (активации)**:
   - Для активации продукта должны быть заполнены все обязательные поля
   - Качество данных (dataQualityScore) должно быть не ниже 0.7

### Оценка качества данных

Качество данных продукта оценивается по шкале от 0.0 до 1.0, где:
- 0.0 - минимальное качество (только обязательные поля)
- 1.0 - максимальное качество (все возможные поля заполнены, данные валидированы)

Формула расчета:
```java
/**
 * Расчет оценки качества данных продукта
 *
 * @param product продукт для оценки
 * @return оценка качества от 0.0 до 1.0
 */
double calculateDataQualityScore(Product product) {
    double score = 0.0;
    double totalWeight = 0.0;
    
    // Оценка обязательных полей (высокий вес)
    Map<String, Double> requiredFields = Map.of(
        "title", 1.0,
        "isbn", 0.9,
        "publisher", 0.8
        // и т.д.
    );
    
    // Оценка опциональных полей (средний вес)
    Map<String, Double> optionalFields = Map.of(
        "description", 0.6,
        "pageCount", 0.5,
        "dimensions", 0.4
        // и т.д.
    );
    
    // Оценка дополнительных полей (низкий вес)
    Map<String, Double> additionalFields = Map.of(
        "shortDescription", 0.3,
        "originalTitle", 0.3
        // и т.д.
    );
    
    // Расчет по каждой группе полей
    // ...
    
    return score / totalWeight;
}
```

## Механизмы дедупликации

### Выявление дубликатов

```java
/**
 * Поиск потенциальных дубликатов продукта
 *
 * @param productId идентификатор продукта
 * @param threshold порог схожести (от 0.0 до 1.0)
 * @return список потенциальных дубликатов с оценкой схожести
 */
List<ProductSimilarity> findPotentialDuplicates(Long productId, double threshold);

public class ProductSimilarity {
    private Product product;
    private double similarityScore;
    private Map<String, Double> fieldSimilarities;
    
    // Геттеры и сеттеры
    // ...
}
```

### Слияние продуктов

```java
/**
 * Слияние двух продуктов
 *
 * @param targetProductId идентификатор целевого продукта (сохраняется)
 * @param sourceProductId идентификатор исходного продукта (будет помечен как дубликат)
 * @param mergeStrategy стратегия слияния полей
 * @return результат слияния
 * @throws EntityNotFoundException если один из продуктов не найден
 */
ProductMergeResult mergeProducts(Long targetProductId, Long sourceProductId, 
                               MergeStrategy mergeStrategy)
    throws EntityNotFoundException;

public enum MergeStrategy {
    TARGET_PRIORITY,       // приоритет данных целевого продукта
    SOURCE_PRIORITY,       // приоритет данных исходного продукта
    USE_MOST_COMPLETE,     // использовать наиболее полные данные
    MANUAL_FIELD_SELECTION // ручной выбор полей для объединения
}

public class ProductMergeResult {
    private Product mergedProduct;
    private Product sourceProduct;
    private Map<String, String> fieldSources;
    private List<String> conflictFields;
    
    // Геттеры и сеттеры
    // ...
}
```

## Импорт и экспорт

### Импорт продуктов

```java
/**
 * Импорт продуктов из файла
 *
 * @param file файл для импорта
 * @param format формат файла (CSV, Excel, XML, JSON)
 * @param importOptions опции импорта
 * @return результат импорта
 */
ImportResult importProducts(File file, FileFormat format, ImportOptions importOptions);

public class ImportOptions {
    private Boolean createNewProducts;
    private Boolean updateExistingProducts;
    private Boolean skipValidation;
    private String defaultStatus;
    private String matchingField; // isbn, sku, etc.
    private Map<String, String> fieldMapping;
    
    // Геттеры и сеттеры
    // ...
}

public class ImportResult {
    private int totalRows;
    private int successfulImports;
    private int skippedRows;
    private int failedRows;
    private List<String> errors;
    private List<Product> importedProducts;
    
    // Геттеры и сеттеры
    // ...
}
```

### Экспорт продуктов

```java
/**
 * Экспорт продуктов в файл
 *
 * @param productIds список идентификаторов продуктов для экспорта
 * @param format формат файла (CSV, Excel, XML, JSON)
 * @param exportOptions опции экспорта
 * @return файл с экспортированными данными
 */
File exportProducts(List<Long> productIds, FileFormat format, ExportOptions exportOptions);

public class ExportOptions {
    private List<String> includeFields;
    private List<String> excludeFields;
    private Boolean includeRelatedEntities;
    private Boolean includeAttributes;
    private Boolean includeStockInfo;
    private String dateFormat;
    
    // Геттеры и сеттеры
    // ...
}
```

## Права доступа

### Роли и разрешения

| Роль | Создание | Чтение | Обновление | Удаление | Активация | Импорт/Экспорт |
|------|----------|--------|------------|----------|-----------|----------------|
| Admin | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Editor | ✓ | ✓ | ✓ | × | ✓ | ✓ |
| Author | × | ✓ | Частично | × | × | × |
| Viewer | × | ✓ | × | × | × | × |

### Контроль изменений

Все изменения продуктов протоколируются в системе аудита с указанием:
- Пользователя, внесшего изменения
- Времени изменения
- Типа операции (создание, обновление, изменение статуса)
- Измененных полей и их значений до и после изменения
- Причины изменения (если указана)

## Примеры использования

### Пример 1: Создание нового продукта

```java
// Создание нового продукта (книги)
ProductDto newBook = new ProductDto();
newBook.setTitle("Война и мир");
newBook.setIsbn("9785171070038");
newBook.setPublisherId(1L); // ID издательства
newBook.setCategoryIds(List.of(5L)); // ID категории
newBook.setDescription("Роман-эпопея Льва Николаевича Толстого...");
newBook.setPageCount(1300);
newBook.setCoverType("hardcover");
newBook.setLanguage("ru");
newBook.setPublicationDate(new Date());
newBook.setListPrice(BigDecimal.valueOf(950.00));
newBook.setCurrency("RUB");

// Добавление атрибутов
Map<String, AttributeValue> attributes = new HashMap<>();
attributes.put("format", new AttributeValue("format", "60x90/16", "text", null, true, true, 1, "manual", null, null));
attributes.put("paper_type", new AttributeValue("paper_type", "офсетная", "text", null, true, true, 2, "manual", null, null));
newBook.setAttributes(attributes);

// Создание продукта
try {
    Product created = productService.createProduct(newBook);
    System.out.println("Created product with ID: " + created.getId());
    
    // Добавление авторов
    productService.addAuthorToProduct(created.getId(), 42L, "author", 1); // Лев Толстой
    
} catch (ValidationException e) {
    System.err.println("Validation error: " + e.getMessage());
}
```

### Пример 2: Поиск продуктов

```java
// Создание поискового запроса
ProductSearchQuery query = new ProductSearchQuery();
query.setTextQuery("толстой");
query.setCategoryIds(List.of(5L, 6L)); // Художественная литература, Классика
query.setPublicationDateRange(new DateRange(
    new SimpleDateFormat("yyyy-MM-dd").parse("2010-01-01"),
    null // до настоящего времени
));
query.setPriceRange(new PriceRange(BigDecimal.valueOf(500), BigDecimal.valueOf(2000)));
query.setStatuses(List.of("active"));
query.setInStock(true);
query.setSortBy("publicationDate");
query.setSortDirection("desc");
query.setPage(0);
query.setPageSize(20);

// Добавление фильтра по атрибуту
AttributeFilter coverFilter = new AttributeFilter();
coverFilter.setAttributeName("cover_type");
coverFilter.setOperator("eq");
coverFilter.setValue("hardcover");
query.setAttributeFilters(List.of(coverFilter));

// Выполнение поиска
Page<Product> results = productService.searchProducts(query);

System.out.println("Found " + results.getTotalElements() + " products");
for (Product product : results.getContent()) {
    System.out.println(product.getTitle() + " (" + product.getIsbn() + ")");
}
```

### Пример 3: Импорт продуктов

```java
// Настройка опций импорта
ImportOptions options = new ImportOptions();
options.setCreateNewProducts(true);
options.setUpdateExistingProducts(true);
options.setDefaultStatus("draft");
options.setMatchingField("isbn");

// Настройка маппинга полей
Map<String, String> fieldMapping = new HashMap<>();
fieldMapping.put("Название", "title");
fieldMapping.put("ISBN", "isbn");
fieldMapping.put("Автор", "authors");
fieldMapping.put("Издательство", "publisher");
fieldMapping.put("Цена", "listPrice");
options.setFieldMapping(fieldMapping);

// Импорт из файла
File importFile = new File("books.xlsx");
ImportResult result = productService.importProducts(importFile, FileFormat.EXCEL, options);

System.out.println("Import completed:");
System.out.println("Total rows: " + result.getTotalRows());
System.out.println("Successful imports: " + result.getSuccessfulImports());
System.out.println("Failed rows: " + result.getFailedRows());
System.out.println("Skipped rows: " + result.getSkippedRows());

if (!result.getErrors().isEmpty()) {
    System.out.println("Errors:");
    result.getErrors().forEach(System.out::println);
}
```

## Связь с другими контрактами

- [Контракт схемы базы данных (Database Schema Contract)](./database_schema_contract.md) - Определяет структуру таблиц в базе данных
- [Контракт серий книг (Series Contract)](./series_contract.md) - Определяет структуру и механизмы работы с сериями книг
- [Контракт управления ценами (Price Management Contract)](./price_management_contract.md) - Определяет механизмы работы с ценами продуктов
- [Контракт архетипов данных (Data Archetypes Contract)](../data/data_archetypes_contract.md) - Определяет шаблоны данных для разных типов продуктов
- [Контракт происхождения данных (Data Lineage Contract)](../data/data_lineage_contract.md) - Определяет механизмы отслеживания происхождения данных
- [Контракт типов переплета (Binding Types Contract)](./binding_types_contract.md) - Определяет типы переплета книг и механизмы их нормализации

## Инварианты

1. Каждый продукт имеет уникальный идентификатор (id)
2. ISBN продукта должен быть уникальным среди всех продуктов (если указан)
3. SKU продукта должен быть уникальным среди всех продуктов (если указан)
4. Продукт всегда имеет статус из определенного набора значений (draft, active, inactive, discontinued)
5. Удаление продукта из системы невозможно, только переход в статус discontinued
6. Любое изменение продукта протоколируется в системе аудита
7. Продукт может быть связан с несколькими авторами, но каждый автор имеет уникальную роль

## Расширения и эволюция

1. **Мультиязычная поддержка**:
   - Добавление переводов названий, описаний и других текстовых полей
   - Поддержка поиска на разных языках

2. **Расширенные метаданные**:
   - Интеграция с внешними источниками данных для обогащения информации
   - Добавление рейтингов, обзоров и отзывов

3. **Сложные взаимосвязи**:
   - Поддержка связей "похожие продукты", "часто покупают вместе"
   - Рекомендательная система на основе характеристик продуктов 