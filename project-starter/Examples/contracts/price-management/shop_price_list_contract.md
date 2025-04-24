# Контракт обработки прайс-листа магазина "Кот Учёный"

## Метаданные

| Поле          | Значение                    |
|---------------|----------------------------|
| Версия        | 1.0.0                      |
| Статус        | Утверждено                 |
| Дата обновления | 2025-04-26               |
| Редактор      | AI                         |

## История изменений

| Версия | Дата       | Описание                                         |
|--------|------------|--------------------------------------------------|
| 1.0.0  | 2025-04-26 | Начальная версия контракта, выделенная из контракта схемы базы данных |

## Описание

Данный контракт определяет структуру данных, механизмы обработки и API для работы с прайс-листом магазина "Кот Учёный". Он описывает процессы ETL, связанные с импортом, нормализацией, анализом и экспортом данных прайс-листа.

## Цели и задачи

1. Определить структуру хранения данных прайс-листа
2. Описать процесс импорта и нормализации данных
3. Определить механизмы анализа аномалий цен
4. Специфицировать функции экспорта в различные форматы
5. Определить API для работы с данными прайс-листа

## Структура данных

### Таблица `shop_price_list`

```sql
CREATE TABLE shop_price_list (
    id SERIAL PRIMARY KEY,
    external_id VARCHAR(50) NOT NULL,
    isbn VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    publisher VARCHAR(100),
    price DECIMAL(10,2) NOT NULL,
    discount DECIMAL(5,2),
    quantity INT NOT NULL DEFAULT 0,
    available BOOLEAN NOT NULL DEFAULT TRUE,
    import_date TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'new',
    match_status VARCHAR(20),
    match_product_id INT,
    match_confidence DECIMAL(5,2),
    processing_notes TEXT,
    CONSTRAINT fk_product
        FOREIGN KEY(match_product_id) 
        REFERENCES products(id)
        ON DELETE SET NULL
);

CREATE INDEX idx_price_list_isbn ON shop_price_list(isbn);
CREATE INDEX idx_price_list_external_id ON shop_price_list(external_id);
CREATE INDEX idx_price_list_match_product ON shop_price_list(match_product_id);
```

### Статусы записей

| Статус | Описание |
|--------|----------|
| new | Новая запись, еще не обработанная |
| processed | Запись обработана, товар найден |
| needs_review | Требуется ручная проверка для сопоставления с товаром |
| excluded | Запись исключена из обработки |
| error | Ошибка при обработке записи |

### Статусы сопоставления (match_status)

| Статус | Описание |
|--------|----------|
| exact_match | Точное совпадение по ISBN |
| high_confidence | Высокая уверенность в совпадении (на основе алгоритмов нечеткого поиска) |
| medium_confidence | Средняя уверенность в совпадении |
| low_confidence | Низкая уверенность в совпадении |
| no_match | Совпадение не найдено |
| manual_match | Сопоставлено вручную оператором |

## Процедуры обработки прайс-листа

### Импорт данных

```sql
CREATE OR REPLACE PROCEDURE import_shop_price_list(
    file_path TEXT,
    format TEXT DEFAULT 'csv'
)
LANGUAGE plpgsql AS $$
BEGIN
    -- Очистка временной таблицы
    TRUNCATE TABLE temp_price_list;
    
    -- Импорт данных во временную таблицу
    IF format = 'csv' THEN
        EXECUTE format(
            'COPY temp_price_list(external_id, isbn, title, author, publisher, price, discount, quantity, available) 
             FROM %L WITH (FORMAT CSV, HEADER true, DELIMITER '','', ENCODING ''UTF8'')', 
            file_path
        );
    ELSIF format = 'xlsx' THEN
        -- Вызов внешней функции для импорта XLSX
        PERFORM import_xlsx_to_temp_price_list(file_path);
    ELSE
        RAISE EXCEPTION 'Неподдерживаемый формат: %', format;
    END IF;
    
    -- Перенос данных в основную таблицу с проверкой на дубликаты
    INSERT INTO shop_price_list
        (external_id, isbn, title, author, publisher, price, discount, quantity, available, import_date, status)
    SELECT 
        external_id, 
        COALESCE(NULLIF(regexp_replace(isbn, '[^0-9X]', '', 'g'), ''), 'UNKNOWN') as isbn,
        title, 
        author, 
        publisher, 
        price, 
        discount, 
        quantity, 
        available, 
        CURRENT_TIMESTAMP, 
        'new'
    FROM temp_price_list t
    WHERE NOT EXISTS (
        SELECT 1 FROM shop_price_list 
        WHERE external_id = t.external_id 
        AND import_date > CURRENT_DATE - INTERVAL '1 day'
    );
    
    -- Логирование результатов импорта
    INSERT INTO etl_log (process_name, records_processed, status, message)
    VALUES (
        'import_shop_price_list', 
        (SELECT count(*) FROM temp_price_list), 
        'success', 
        format('Imported %s records from %s', 
               (SELECT count(*) FROM temp_price_list), 
               file_path)
    );
END;
$$;
```

### Сопоставление с товарами

```sql
CREATE OR REPLACE PROCEDURE match_shop_price_list_items()
LANGUAGE plpgsql AS $$
DECLARE
    matched_count INT := 0;
    review_count INT := 0;
    no_match_count INT := 0;
BEGIN
    -- Сброс предыдущих сопоставлений для новых записей
    UPDATE shop_price_list
    SET match_status = NULL, match_product_id = NULL, match_confidence = NULL
    WHERE status = 'new';
    
    -- Точное сопоставление по ISBN
    UPDATE shop_price_list p
    SET 
        match_product_id = b.id,
        match_status = 'exact_match',
        match_confidence = 1.0,
        status = 'processed'
    FROM 
        products b
    WHERE 
        p.isbn = b.isbn
        AND p.status = 'new'
        AND p.isbn != 'UNKNOWN';
        
    GET DIAGNOSTICS matched_count = ROW_COUNT;
    
    -- Нечеткое сопоставление по названию и автору для записей без ISBN
    UPDATE shop_price_list p
    SET 
        match_product_id = s.product_id,
        match_status = 
            CASE 
                WHEN s.similarity > 0.9 THEN 'high_confidence'
                WHEN s.similarity > 0.75 THEN 'medium_confidence'
                ELSE 'low_confidence'
            END,
        match_confidence = s.similarity,
        status = 
            CASE 
                WHEN s.similarity > 0.8 THEN 'processed'
                ELSE 'needs_review'
            END
    FROM (
        SELECT 
            p.id as price_id,
            b.id as product_id,
            similarity(p.title, b.title) * 0.7 + 
            similarity(COALESCE(p.author, ''), COALESCE(b.author_display, '')) * 0.3 as similarity
        FROM 
            shop_price_list p
            CROSS JOIN LATERAL (
                SELECT id, title, author_display
                FROM products
                ORDER BY 
                    similarity(p.title, title) * 0.7 + 
                    similarity(COALESCE(p.author, ''), COALESCE(author_display, '')) * 0.3 DESC
                LIMIT 1
            ) b
        WHERE 
            p.status = 'new'
            AND (p.isbn = 'UNKNOWN' OR p.match_product_id IS NULL)
    ) s
    WHERE 
        p.id = s.price_id
        AND s.similarity > 0.6;
        
    GET DIAGNOSTICS review_count = ROW_COUNT;
    
    -- Маркировка оставшихся записей как не найденных
    UPDATE shop_price_list
    SET 
        match_status = 'no_match',
        status = 'needs_review'
    WHERE 
        status = 'new';
        
    GET DIAGNOSTICS no_match_count = ROW_COUNT;
    
    -- Логирование результатов сопоставления
    INSERT INTO etl_log (process_name, records_processed, status, message)
    VALUES (
        'match_shop_price_list_items', 
        matched_count + review_count + no_match_count, 
        'success', 
        format('Matched: %s (exact), %s (fuzzy), %s (no match)', 
               matched_count, review_count, no_match_count)
    );
END;
$$;
```

### Анализ аномалий цен

```sql
CREATE OR REPLACE FUNCTION analyze_price_anomalies()
RETURNS TABLE (
    product_id INT,
    product_title VARCHAR(255),
    current_price DECIMAL(10,2),
    shop_price DECIMAL(10,2),
    price_difference DECIMAL(10,2),
    percentage_change DECIMAL(5,2),
    anomaly_level VARCHAR(20)
)
LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
    WITH price_comparison AS (
        SELECT 
            p.id AS product_id,
            p.title AS product_title,
            COALESCE(pp.price, 0) AS current_price,
            spl.price AS shop_price,
            COALESCE(pp.price, 0) - spl.price AS price_difference,
            CASE 
                WHEN COALESCE(pp.price, 0) = 0 THEN 0
                ELSE ((spl.price - COALESCE(pp.price, 0)) / COALESCE(pp.price, 0)) * 100 
            END AS percentage_change
        FROM 
            shop_price_list spl
        JOIN 
            products p ON spl.match_product_id = p.id
        LEFT JOIN 
            product_prices pp ON p.id = pp.product_id AND pp.price_type = 'retail'
        WHERE 
            spl.match_status IN ('exact_match', 'high_confidence', 'manual_match')
            AND spl.status = 'processed'
    )
    SELECT 
        pc.product_id,
        pc.product_title,
        pc.current_price,
        pc.shop_price,
        pc.price_difference,
        pc.percentage_change,
        CASE 
            WHEN ABS(pc.percentage_change) > 30 THEN 'critical'
            WHEN ABS(pc.percentage_change) > 15 THEN 'warning'
            WHEN ABS(pc.percentage_change) > 5 THEN 'notice'
            ELSE 'normal'
        END AS anomaly_level
    FROM 
        price_comparison pc
    WHERE 
        ABS(pc.percentage_change) > 5
    ORDER BY 
        ABS(pc.percentage_change) DESC;
END;
$$;
```

### Экспортные функции

```sql
CREATE OR REPLACE FUNCTION export_processed_price_list_to_csv(
    file_path TEXT
)
RETURNS INT
LANGUAGE plpgsql AS $$
DECLARE
    exported_count INT;
BEGIN
    EXECUTE format(
        'COPY (
            SELECT 
                p.id, 
                p.isbn, 
                p.title, 
                p.author_display, 
                p.publisher, 
                COALESCE(pp.price, 0) AS current_price,
                spl.price AS shop_price,
                spl.available,
                spl.quantity
            FROM 
                shop_price_list spl
            JOIN 
                products p ON spl.match_product_id = p.id
            LEFT JOIN 
                product_prices pp ON p.id = pp.product_id AND pp.price_type = ''retail''
            WHERE 
                spl.status = ''processed''
            ORDER BY 
                p.title
        ) TO %L WITH (FORMAT CSV, HEADER true, FORCE_QUOTE *, DELIMITER '','', ENCODING ''UTF8'')', 
        file_path
    );
    
    GET DIAGNOSTICS exported_count = ROW_COUNT;
    
    -- Логирование результатов экспорта
    INSERT INTO etl_log (process_name, records_processed, status, message)
    VALUES (
        'export_processed_price_list', 
        exported_count, 
        'success', 
        format('Exported %s records to %s', exported_count, file_path)
    );
    
    RETURN exported_count;
END;
$$;
```

## API интерфейс

### Получение списка записей прайс-листа

```java
/**
 * Получает список записей прайс-листа с возможностью фильтрации и пагинации
 * 
 * @param status Фильтр по статусу записи (опционально)
 * @param matchStatus Фильтр по статусу сопоставления (опционально)
 * @param page Номер страницы результатов (начиная с 0)
 * @param size Размер страницы
 * @return PagedResult<ShopPriceListItem> Страница результатов
 */
PagedResult<ShopPriceListItem> getPriceListItems(
    String status, 
    String matchStatus, 
    int page, 
    int size
);
```

### Обновление сопоставления товара

```java
/**
 * Обновляет сопоставление записи прайс-листа с товаром
 * 
 * @param priceListItemId ID записи прайс-листа
 * @param productId ID товара для сопоставления
 * @param confidence Уровень уверенности в сопоставлении (от 0 до 1)
 * @return boolean Результат операции
 */
boolean updatePriceListItemMatch(
    Long priceListItemId,
    Long productId,
    double confidence
);
```

### Импорт прайс-листа

```java
/**
 * Импортирует прайс-лист из файла
 * 
 * @param file Файл прайс-листа
 * @param format Формат файла (csv, xlsx)
 * @return ImportResult Результат импорта с количеством обработанных и ошибочных записей
 */
ImportResult importPriceList(
    File file,
    String format
);
```

### Запуск сопоставления товаров

```java
/**
 * Запускает процесс сопоставления записей прайс-листа с товарами
 * 
 * @return MatchResult Результат сопоставления с количеством сопоставленных записей
 */
MatchResult matchPriceListItems();
```

### Получение отчета по аномалиям цен

```java
/**
 * Получает отчет по аномалиям цен
 * 
 * @param minPercentageChange Минимальный процент изменения цены для включения в отчет
 * @return List<PriceAnomaly> Список аномалий цен
 */
List<PriceAnomaly> getPriceAnomaliesReport(
    double minPercentageChange
);
```

### Экспорт обработанного прайс-листа

```java
/**
 * Экспортирует обработанный прайс-лист в файл CSV
 * 
 * @param filePath Путь к файлу для экспорта
 * @return int Количество экспортированных записей
 */
int exportProcessedPriceList(
    String filePath
);
```

## Примеры использования

### Импорт и обработка прайс-листа

```java
// Импорт прайс-листа из CSV файла
File priceListFile = new File("/path/to/shop_price_list.csv");
ImportResult importResult = priceListService.importPriceList(priceListFile, "csv");
System.out.println("Импортировано записей: " + importResult.getProcessedCount());

// Запуск сопоставления товаров
MatchResult matchResult = priceListService.matchPriceListItems();
System.out.println("Сопоставлено точно: " + matchResult.getExactMatchCount());
System.out.println("Требует проверки: " + matchResult.getNeedsReviewCount());

// Получение отчета по аномалиям цен
List<PriceAnomaly> anomalies = priceListService.getPriceAnomaliesReport(10.0);
System.out.println("Найдено аномалий цен: " + anomalies.size());
for (PriceAnomaly anomaly : anomalies) {
    System.out.println(anomaly.getProductTitle() + ": текущая цена=" + 
                      anomaly.getCurrentPrice() + ", цена магазина=" + 
                      anomaly.getShopPrice() + ", изменение=" + 
                      anomaly.getPercentageChange() + "%");
}

// Экспорт обработанного прайс-листа
int exportedCount = priceListService.exportProcessedPriceList("/path/to/export/processed_list.csv");
System.out.println("Экспортировано записей: " + exportedCount);
```

### Ручное сопоставление товаров

```java
// Получение списка записей, требующих проверки
PagedResult<ShopPriceListItem> itemsToReview = priceListService.getPriceListItems(
    "needs_review", null, 0, 20
);

for (ShopPriceListItem item : itemsToReview.getItems()) {
    System.out.println("ID: " + item.getId() + ", ISBN: " + item.getIsbn() + 
                      ", Название: " + item.getTitle());
    
    // Предположим, что мы нашли соответствующий товар с ID 12345
    boolean updated = priceListService.updatePriceListItemMatch(
        item.getId(), 12345L, 0.9
    );
    
    if (updated) {
        System.out.println("Сопоставление обновлено успешно");
    }
}
```

## Связь с другими контрактами

- [Database Schema Contract](../database/database_schema_contract.md) - Определяет общую схему базы данных
- [Product Contract](../database/product_contract.md) - Детализирует работу с товарами
- [ETL Process Contract](../ETL-Process-Contract.md) - Описывает общие процессы ETL
- [Price Management Contract](../price-management/price_management_contract.md) - Определяет общие механизмы работы с ценами 