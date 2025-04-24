# Контракт управления ценами (Price Management Contract)

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

Данный контракт определяет структуру и правила работы с ценами продуктов, скидками и прайс-листами в системе CATMEPIM. Контракт описывает как механизмы управления прайс-листами поставщиков, так и формирование итоговых цен для конечных пользователей с учетом различных ценовых политик и скидок.

## Цели и задачи

**Основная цель**: Обеспечить единый подход к управлению ценовой информацией в системе CATMEPIM.

**Задачи**:
1. Определить модель хранения и представления цен продуктов
2. Описать механизм работы с прайс-листами поставщиков
3. Определить правила формирования скидок и специальных предложений
4. Обеспечить поддержку различных валют и конвертаций
5. Определить механизмы аудита и отслеживания изменений цен
6. Установить алгоритмы формирования итоговых цен

## Модель данных

### Основная сущность ProductPrice (Цена продукта)

```java
public class ProductPrice {
    // Идентификатор и связи
    private Long id;
    private Long productId;
    private Long priceListId;  // Прайс-лист, из которого взята цена
    private Long supplierId;   // Поставщик
    
    // Ценовая информация
    private BigDecimal basePrice;      // Базовая цена
    private BigDecimal specialPrice;   // Специальная цена (если есть акция)
    private String currency;           // Валюта (ISO код)
    private BigDecimal vatRate;        // Ставка НДС
    private BigDecimal vatAmount;      // Сумма НДС
    
    // Период действия
    private Date validFrom;            // Дата начала действия цены
    private Date validTo;              // Дата окончания действия цены
    
    // Минимальное количество для цены
    private Integer minQuantity;       // Минимальное количество товара для этой цены
    
    // Метаданные
    private String priceType;          // Тип цены (retail, wholesale, cost, msrp)
    private Double confidence;         // Уровень достоверности цены (0.0-1.0)
    private String status;             // Статус цены (active, inactive, pending)
    private Date createdAt;
    private Date updatedAt;
    private String source;             // Источник цены (price_list, manual, calculated)
    
    // Геттеры и сеттеры
    // ...
}
```

### Связанные сущности

#### PriceList (Прайс-лист)
```java
public class PriceList {
    private Long id;
    private String name;
    private String description;
    private Long supplierId;
    private String currency;
    private String format;              // csv, excel, xml, json
    private String status;              // active, inactive, processing
    private Date importedAt;
    private Date validFrom;
    private Date validTo;
    private Double completenessScore;   // Оценка полноты данных (0.0-1.0)
    private Integer itemCount;          // Количество позиций
    private Integer matchedItemCount;   // Количество сопоставленных позиций
    private Date createdAt;
    private Date updatedAt;
    
    // Геттеры и сеттеры
    // ...
}
```

#### Supplier (Поставщик)
```java
public class Supplier {
    private Long id;
    private String name;
    private String code;                // Уникальный код поставщика
    private String description;
    private SupplierContact contact;
    private String defaultCurrency;
    private Double reliability;         // Оценка надежности поставщика (0.0-1.0)
    private Integer priorityRank;       // Ранг приоритета (1 - наивысший)
    private Boolean isActive;
    private Map<String, Object> additionalInfo;
    private Date createdAt;
    private Date updatedAt;
    
    // Геттеры и сеттеры
    // ...
}
```

#### Discount (Скидка)
```java
public class Discount {
    private Long id;
    private String name;
    private String description;
    private String discountType;       // percent, fixed_amount, free_items
    private BigDecimal value;          // Значение скидки (процент или фиксированная сумма)
    private String currency;           // Валюта (для фиксированной суммы)
    private DiscountTarget target;     // Цель скидки (product, category, cart)
    private List<Long> targetIds;      // ID целевых объектов (продуктов, категорий)
    private Integer priority;          // Приоритет применения (высший применяется первым)
    private Boolean stackable;         // Можно ли комбинировать с другими скидками
    private Date validFrom;
    private Date validTo;
    private String couponCode;         // Код купона (если применимо)
    private Integer usageLimit;        // Ограничение на количество использований
    private Integer usageCount;        // Сколько раз уже использована
    private Boolean isActive;
    private List<DiscountCondition> conditions; // Условия применения
    private Date createdAt;
    private Date updatedAt;
    
    // Геттеры и сеттеры
    // ...
}
```

#### PriceHistory (История цен)
```java
public class PriceHistory {
    private Long id;
    private Long productId;
    private Long priceListId;
    private String priceType;
    private BigDecimal price;
    private String currency;
    private Date effectiveFrom;
    private Date effectiveTo;
    private String changeReason;
    private User changedBy;
    private Date changedAt;
    
    // Геттеры и сеттеры
    // ...
}
```

## Типы цен

1. **Розничная цена (Retail)** - Цена для конечного потребителя
2. **Оптовая цена (Wholesale)** - Цена для оптовых покупателей, зависит от объема
3. **Закупочная цена (Cost)** - Цена закупки у поставщика
4. **Рекомендованная цена (MSRP)** - Рекомендованная производителем розничная цена
5. **Специальная цена (Special)** - Временная акционная цена
6. **Персональная цена (Personal)** - Индивидуальная цена для конкретного клиента

## Жизненный цикл цены

### Статусы цены

1. **active** - Активная, действующая цена
2. **inactive** - Неактивная цена (устаревшая или будущая)
3. **pending** - Ожидающая подтверждения (например, после импорта)

### Переходы состояний

```
                ┌─────────────┐
                │   pending   │
                └─────────────┘
                      │
                      ▼
┌───────────┐    ┌─────────────┐
│ inactive  │◄──►│   active    │
└───────────┘    └─────────────┘
```

## API для работы с ценами

### Управление ценами продуктов

```java
/**
 * Добавление или обновление цены продукта
 *
 * @param productPrice информация о цене
 * @return созданная/обновленная цена
 * @throws EntityNotFoundException если продукт не найден
 * @throws ValidationException если данные цены не проходят валидацию
 */
ProductPrice setProductPrice(ProductPrice productPrice) 
    throws EntityNotFoundException, ValidationException;

/**
 * Получение активной цены продукта определенного типа
 *
 * @param productId идентификатор продукта
 * @param priceType тип цены
 * @param currency валюта (опционально)
 * @return цена продукта или null, если активная цена не найдена
 */
ProductPrice getActiveProductPrice(Long productId, String priceType, String currency);

/**
 * Получение всех активных цен продукта
 *
 * @param productId идентификатор продукта
 * @return список активных цен продукта
 */
List<ProductPrice> getAllActiveProductPrices(Long productId);

/**
 * Получение истории цен продукта
 *
 * @param productId идентификатор продукта
 * @param priceType тип цены (опционально)
 * @param startDate начальная дата периода (опционально)
 * @param endDate конечная дата периода (опционально)
 * @return история цен продукта
 */
List<PriceHistory> getProductPriceHistory(Long productId, String priceType, 
                                       Date startDate, Date endDate);
```

### Управление прайс-листами

```java
/**
 * Создание нового прайс-листа
 *
 * @param priceList информация о прайс-листе
 * @return созданный прайс-лист
 * @throws ValidationException если данные прайс-листа не проходят валидацию
 */
PriceList createPriceList(PriceList priceList) throws ValidationException;

/**
 * Импорт прайс-листа из файла
 *
 * @param priceListId идентификатор прайс-листа
 * @param file файл с прайс-листом
 * @param importOptions опции импорта
 * @return результат импорта
 * @throws EntityNotFoundException если прайс-лист не найден
 */
PriceListImportResult importPriceList(Long priceListId, File file, 
                                  PriceListImportOptions importOptions)
    throws EntityNotFoundException;

/**
 * Активация прайс-листа
 *
 * @param priceListId идентификатор прайс-листа
 * @param activationOptions опции активации
 * @return результат активации
 * @throws EntityNotFoundException если прайс-лист не найден
 */
PriceListActivationResult activatePriceList(Long priceListId, 
                                        PriceListActivationOptions activationOptions)
    throws EntityNotFoundException;

/**
 * Получение прайс-листа по идентификатору
 *
 * @param priceListId идентификатор прайс-листа
 * @return прайс-лист или null, если не найден
 */
PriceList getPriceList(Long priceListId);

/**
 * Поиск прайс-листов по фильтрам
 *
 * @param filters фильтры поиска
 * @return список прайс-листов, соответствующих фильтрам
 */
List<PriceList> searchPriceLists(PriceListSearchFilters filters);
```

### Управление скидками

```java
/**
 * Создание новой скидки
 *
 * @param discount информация о скидке
 * @return созданная скидка
 * @throws ValidationException если данные скидки не проходят валидацию
 */
Discount createDiscount(Discount discount) throws ValidationException;

/**
 * Обновление существующей скидки
 *
 * @param discountId идентификатор скидки
 * @param discount новые данные скидки
 * @return обновленная скидка
 * @throws EntityNotFoundException если скидка не найдена
 * @throws ValidationException если данные скидки не проходят валидацию
 */
Discount updateDiscount(Long discountId, Discount discount)
    throws EntityNotFoundException, ValidationException;

/**
 * Активация/деактивация скидки
 *
 * @param discountId идентификатор скидки
 * @param active флаг активности
 * @return обновленная скидка
 * @throws EntityNotFoundException если скидка не найдена
 */
Discount setDiscountActive(Long discountId, Boolean active)
    throws EntityNotFoundException;

/**
 * Применение скидок к продукту
 *
 * @param productId идентификатор продукта
 * @param quantity количество единиц продукта
 * @param context контекст применения скидок (информация о корзине, пользователе и т.д.)
 * @return результат применения скидок
 */
DiscountApplicationResult applyDiscounts(Long productId, Integer quantity, 
                                     DiscountContext context);

/**
 * Получение всех активных скидок для продукта
 *
 * @param productId идентификатор продукта
 * @return список активных скидок
 */
List<Discount> getActiveDiscountsForProduct(Long productId);
```

## Алгоритмы расчета цен

### Расчет итоговой цены продукта

```java
/**
 * Расчет итоговой цены продукта с учетом всех скидок
 *
 * @param productId идентификатор продукта
 * @param quantity количество единиц продукта
 * @param priceType тип цены
 * @param currency валюта
 * @param context контекст расчета цены
 * @return детализированный результат расчета
 */
PriceCalculationResult calculateProductPrice(Long productId, Integer quantity, 
                                        String priceType, String currency, 
                                        PriceCalculationContext context);

public class PriceCalculationResult {
    private Long productId;
    private BigDecimal basePrice;           // Базовая цена без скидок
    private BigDecimal discountAmount;      // Общая сумма скидок
    private BigDecimal finalPrice;          // Итоговая цена после всех скидок
    private String currency;
    private List<AppliedDiscount> appliedDiscounts; // Примененные скидки
    private Map<String, Object> priceDetails; // Детализация расчета цены
    
    // Геттеры и сеттеры
    // ...
}

public class AppliedDiscount {
    private Long discountId;
    private String discountName;
    private String discountType;
    private BigDecimal value;
    private BigDecimal amountSaved;
    private Integer priority;
    
    // Геттеры и сеттеры
    // ...
}
```

### Определение лучшей цены среди поставщиков

```java
/**
 * Определение лучшей цены продукта среди всех поставщиков
 *
 * @param productId идентификатор продукта
 * @param priceType тип цены
 * @param currency валюта
 * @return лучшее предложение цены
 */
BestPriceResult findBestPrice(Long productId, String priceType, String currency);

public class BestPriceResult {
    private Long productId;
    private ProductPrice bestPrice;
    private Supplier supplier;
    private List<ProductPrice> alternativePrices; // Альтернативные предложения
    private String currency;
    private Date calculatedAt;
    
    // Геттеры и сеттеры
    // ...
}
```

## Конвертация валют

```java
/**
 * Конвертация суммы из одной валюты в другую
 *
 * @param amount сумма для конвертации
 * @param fromCurrency исходная валюта
 * @param toCurrency целевая валюта
 * @param date дата, на которую выполняется конвертация (null - текущая)
 * @return сконвертированная сумма
 * @throws CurrencyConversionException при ошибке конвертации
 */
BigDecimal convertCurrency(BigDecimal amount, String fromCurrency, 
                        String toCurrency, Date date)
    throws CurrencyConversionException;

/**
 * Получение курса обмена между валютами
 *
 * @param fromCurrency исходная валюта
 * @param toCurrency целевая валюта
 * @param date дата, на которую запрашивается курс (null - текущая)
 * @return курс обмена
 * @throws CurrencyConversionException при ошибке получения курса
 */
BigDecimal getExchangeRate(String fromCurrency, String toCurrency, Date date)
    throws CurrencyConversionException;
```

## Система управления прайс-листами

### Процесс импорта прайс-листа

1. **Загрузка файла прайс-листа** - Файл загружается в систему
2. **Валидация формата** - Проверка соответствия формату и структуре
3. **Предварительный анализ** - Определение количества позиций, валидных записей, ошибок
4. **Сопоставление товаров** - Идентификация продуктов на основе кодов (ISBN, SKU, артикул поставщика)
5. **Валидация цен** - Проверка корректности цен (не отрицательные, в допустимом диапазоне)
6. **Создание позиций прайс-листа** - Сохранение позиций в системе
7. **Активация прайс-листа** - По требованию пользователя или автоматически

### Опции активации прайс-листа

```java
public class PriceListActivationOptions {
    private Boolean updateExistingPrices;    // Обновлять существующие цены
    private Boolean deactivateOldPrices;     // Деактивировать старые цены того же поставщика
    private Boolean updateOnlyIfBetter;      // Обновлять только если новая цена лучше
    private Boolean skipValidation;          // Пропустить валидацию
    private Date effectiveFrom;              // Дата начала действия цен
    private Date effectiveTo;                // Дата окончания действия цен
    private BigDecimal priceThreshold;       // Порог изменения цены (в процентах)
    private Boolean autoApprove;             // Автоматическое подтверждение без модерации
    
    // Геттеры и сеттеры
    // ...
}
```

### Результат активации прайс-листа

```java
public class PriceListActivationResult {
    private Long priceListId;
    private int totalItems;
    private int processedItems;
    private int newPrices;
    private int updatedPrices;
    private int skippedItems;
    private int failedItems;
    private List<String> errors;
    private Date activatedAt;
    private User activatedBy;
    
    // Геттеры и сеттеры
    // ...
}
```

## Механизм скидок и акций

### Типы скидок

1. **Процентная скидка (Percent)** - Скидка в процентах от базовой цены
2. **Фиксированная скидка (Fixed Amount)** - Скидка в виде фиксированной суммы
3. **Бесплатные товары (Free Items)** - Бесплатные единицы товара при покупке определенного количества
4. **Бесплатная доставка (Free Shipping)** - Бесплатная доставка при выполнении условий
5. **Комбинированная скидка (Bundle)** - Скидка при покупке набора товаров
6. **Купонная скидка (Coupon)** - Скидка по купону

### Условия применения скидок

```java
public class DiscountCondition {
    private String type;       // min_qty, min_amount, customer_group, date_range, etc.
    private String operator;   // eq, ne, gt, lt, in, between
    private Object value;
    private Object secondaryValue; // Для операторов типа "between"
    
    // Геттеры и сеттеры
    // ...
}
```

### Приоритизация и комбинирование скидок

1. **Правила приоритизации**:
   - Скидки с более высоким приоритетом применяются первыми
   - При равном приоритете выбирается более выгодная для покупателя скидка

2. **Правила комбинирования**:
   - Скидки могут комбинироваться только если имеют атрибут `stackable = true`
   - Комбинируемые скидки применяются последовательно (каждая к результату предыдущей)
   - Общая сумма скидок не может превышать базовую цену товара

## Механизмы аудита и контроля изменений

### Отслеживание изменений цен

Все изменения цен фиксируются в истории с указанием:
- Предыдущего значения цены
- Нового значения цены
- Даты и времени изменения
- Пользователя, внесшего изменение
- Причины изменения (если указана)
- Источника изменения (ручное, импорт, автоматический перерасчет)

### Уведомления об изменениях цен

Система может отправлять уведомления:
- При изменении цены выше определенного порога (%)
- При активации нового прайс-листа
- При истечении срока действия цены
- При обнаружении аномалий в ценах (значительное отклонение от средней рыночной цены)

## Примеры использования

### Пример 1: Добавление новой цены продукта

```java
// Создание новой цены для продукта
ProductPrice newPrice = new ProductPrice();
newPrice.setProductId(1001L);
newPrice.setPriceType("retail");
newPrice.setBasePrice(BigDecimal.valueOf(950.00));
newPrice.setCurrency("RUB");
newPrice.setVatRate(BigDecimal.valueOf(20.0)); // 20% НДС
newPrice.setValidFrom(new Date());
newPrice.setValidTo(null); // Бессрочно
newPrice.setStatus("active");
newPrice.setSource("manual");

try {
    ProductPrice created = priceService.setProductPrice(newPrice);
    System.out.println("Created price with ID: " + created.getId());
} catch (Exception e) {
    System.err.println("Error creating price: " + e.getMessage());
}
```

### Пример 2: Расчет итоговой цены с учетом скидок

```java
// Создание контекста для расчета цены
PriceCalculationContext context = new PriceCalculationContext();
context.setCustomerId(42L);
context.setCustomerGroupId(2L); // VIP клиенты
context.setCartTotal(BigDecimal.valueOf(5000.00));
context.setCartItems(cartItems);
context.setCouponCodes(List.of("SUMMER2025"));

// Расчет итоговой цены
PriceCalculationResult result = priceService.calculateProductPrice(
    1001L,    // ID продукта
    2,        // Количество
    "retail", // Тип цены
    "RUB",    // Валюта
    context
);

System.out.println("Base price: " + result.getBasePrice() + " " + result.getCurrency());
System.out.println("Discount amount: " + result.getDiscountAmount() + " " + result.getCurrency());
System.out.println("Final price: " + result.getFinalPrice() + " " + result.getCurrency());

System.out.println("Applied discounts:");
for (AppliedDiscount discount : result.getAppliedDiscounts()) {
    System.out.println(" - " + discount.getDiscountName() + ": " + 
                     discount.getAmountSaved() + " " + result.getCurrency());
}
```

### Пример 3: Импорт и активация прайс-листа

```java
// Создание нового прайс-листа
PriceList priceList = new PriceList();
priceList.setName("Поставщик XYZ - Июнь 2025");
priceList.setDescription("Регулярное обновление прайс-листа");
priceList.setSupplierId(5L);
priceList.setCurrency("RUB");
priceList.setFormat("excel");
priceList.setStatus("processing");

PriceList created = priceService.createPriceList(priceList);

// Настройка опций импорта
PriceListImportOptions importOptions = new PriceListImportOptions();
importOptions.setHeaderRow(1);
importOptions.setDataStartRow(2);
importOptions.setSkipEmptyRows(true);
importOptions.setProductIdColumn("A");
importOptions.setIsbnColumn("B");
importOptions.setPriceColumn("E");
importOptions.setQuantityColumn("F");

// Импорт файла прайс-листа
File priceListFile = new File("supplier_xyz_prices.xlsx");
PriceListImportResult importResult = priceService.importPriceList(
    created.getId(), 
    priceListFile, 
    importOptions
);

System.out.println("Import completed:");
System.out.println("Total rows: " + importResult.getTotalRows());
System.out.println("Processed rows: " + importResult.getProcessedRows());
System.out.println("Matched products: " + importResult.getMatchedProducts());
System.out.println("Unmatched products: " + importResult.getUnmatchedProducts());
System.out.println("Invalid rows: " + importResult.getInvalidRows());

// Если импорт успешен, активируем прайс-лист
if (importResult.getMatchedProducts() > 0) {
    PriceListActivationOptions activationOptions = new PriceListActivationOptions();
    activationOptions.setUpdateExistingPrices(true);
    activationOptions.setDeactivateOldPrices(true);
    activationOptions.setEffectiveFrom(new Date());
    activationOptions.setPriceThreshold(BigDecimal.valueOf(10.0)); // 10% порог изменения
    activationOptions.setAutoApprove(false); // Требуется подтверждение
    
    PriceListActivationResult activationResult = priceService.activatePriceList(
        created.getId(), 
        activationOptions
    );
    
    System.out.println("Activation result:");
    System.out.println("New prices: " + activationResult.getNewPrices());
    System.out.println("Updated prices: " + activationResult.getUpdatedPrices());
    System.out.println("Skipped items: " + activationResult.getSkippedItems());
    
    if (!activationResult.getErrors().isEmpty()) {
        System.out.println("Activation errors:");
        activationResult.getErrors().forEach(System.out::println);
    }
}
```

## Связь с другими контрактами

- [Контракт импорта прайс-листов (Price List Import Contract)](../price-management/price_list_import_contract.md) - Определяет механизмы импорта прайс-листов
- [Контракт схемы базы данных (Database Schema Contract)](./database_schema_contract.md) - Определяет структуру таблиц цен в базе данных
- [Контракт товаров/книг (Product Contract)](./product_contract.md) - Определяет структуру и работу с продуктами
- [Контракт происхождения данных (Data Lineage Contract)](../data/data_lineage_contract.md) - Определяет механизмы отслеживания происхождения данных о ценах

## Инварианты

1. Каждый продукт может иметь несколько цен разных типов, но только одну активную цену каждого типа
2. Цена продукта не может быть отрицательной
3. Все ценовые изменения протоколируются в системе аудита
4. Каждая цена имеет период действия (начало и, опционально, окончание)
5. Скидка не может привести к отрицательной стоимости товара
6. Комбинированные скидки применяются последовательно, а не одновременно
7. Обновление цены на величину, превышающую установленный порог, требует подтверждения

## Расширения и эволюция

1. **Динамическое ценообразование**:
   - Автоматическая корректировка цен на основе спроса и конкуренции
   - Алгоритмы оптимизации цен для максимизации прибыли

2. **Персонализированные ценовые предложения**:
   - Индивидуальные скидки на основе истории покупок
   - A/B тестирование ценовых стратегий

3. **Интеграция с внешними системами**:
   - Автоматическое получение цен конкурентов
   - Синхронизация с внешними маркетплейсами

4. **Расширенная аналитика**:
   - Прогнозирование эластичности спроса по цене
   - Анализ эффективности ценовых стратегий и акций 