# Контракт серий книг (Book Series Contract)

## Метаданные
| Атрибут | Значение |
|---------|----------|
| Версия | 1.0.0 |
| Статус | Планируемый |
| Последнее обновление | 2025-04-21 |
| Последний редактор | AI |
| Ветка разработки | main |

## История изменений
| Дата | Версия | Автор | Описание изменений | PR |
|------|--------|-------|-------------------|-----|
| 2025-04-21 | 1.0.0 | AI | Начальная версия | - |

## Описание
Данный контракт определяет структуру и механизмы работы с сериями книг в системе CATMEPIM. Контракт описывает как хранение информации о сериях, так и связи между книгами и сериями, включая порядок книг в серии.

## Схема данных

### Таблица серий (series)

```sql
CREATE TABLE series (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    publisher_id INTEGER REFERENCES publishers(id), -- Издательство, выпускающее серию
    editor VARCHAR(255), -- Редактор серии
    start_year INTEGER, -- Год начала серии
    end_year INTEGER, -- Год завершения серии (NULL для продолжающихся)
    logo_url VARCHAR(500), -- URL логотипа серии
    status VARCHAR(20) NOT NULL DEFAULT 'active', -- active, completed, discontinued
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_series_name_publisher UNIQUE (name, publisher_id)
);
```

### Таблица связей книг с сериями (product_series)

```sql
CREATE TABLE product_series (
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    series_id INTEGER REFERENCES series(id) ON DELETE CASCADE,
    sequence_number INTEGER, -- Порядковый номер книги в серии
    volume_title VARCHAR(255), -- Название тома, если отличается от основного названия
    notes TEXT, -- Дополнительные примечания
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (product_id, series_id)
);
```

## Основные концепции

1. **Серия книг** - группа связанных книг, объединенных общей тематикой, персонажами, вселенной или издательским оформлением
2. **Порядок в серии** - позиция книги в серии, определяемая порядковым номером (sequence_number)
3. **Том** - отдельная книга как часть серии, может иметь собственное название (volume_title)
4. **Статус серии** - текущее состояние серии (активная, завершенная, прекращенная)

## Интерфейсы для работы с сериями

```java
package com.catmepim.series;

import java.util.List;
import java.util.Optional;

/**
 * Сервис для работы с сериями книг
 */
public interface SeriesService {
    
    /**
     * Получить серию по идентификатору
     * 
     * @param seriesId Идентификатор серии
     * @return Объект серии или Optional.empty(), если серия не найдена
     */
    Optional<Series> getSeriesById(Long seriesId);
    
    /**
     * Найти серии по названию
     * 
     * @param name Название или часть названия серии
     * @param exactMatch True для точного совпадения, False для частичного
     * @return Список серий, соответствующих критерию поиска
     */
    List<Series> findSeriesByName(String name, boolean exactMatch);
    
    /**
     * Получить серии определенного издательства
     * 
     * @param publisherId Идентификатор издательства
     * @return Список серий этого издательства
     */
    List<Series> getSeriesByPublisher(Long publisherId);
    
    /**
     * Создать новую серию
     * 
     * @param series Данные серии для создания
     * @return Созданный объект серии с присвоенным идентификатором
     */
    Series createSeries(Series series);
    
    /**
     * Обновить информацию о серии
     * 
     * @param seriesId Идентификатор серии
     * @param seriesData Новые данные серии
     * @return Обновленный объект серии
     */
    Series updateSeries(Long seriesId, Series seriesData);
    
    /**
     * Изменить статус серии
     * 
     * @param seriesId Идентификатор серии
     * @param status Новый статус (active, completed, discontinued)
     * @return True, если статус успешно изменен
     */
    boolean updateSeriesStatus(Long seriesId, String status);
    
    /**
     * Удалить серию
     * 
     * @param seriesId Идентификатор серии
     * @return True, если серия успешно удалена
     */
    boolean deleteSeries(Long seriesId);
    
    /**
     * Добавить книгу в серию
     * 
     * @param productId Идентификатор книги
     * @param seriesId Идентификатор серии
     * @param sequenceNumber Порядковый номер в серии
     * @param volumeTitle Название тома (опционально)
     * @return Объект связи книги с серией
     */
    ProductSeries addBookToSeries(Long productId, Long seriesId, Integer sequenceNumber, String volumeTitle);
    
    /**
     * Обновить информацию о книге в серии
     * 
     * @param productId Идентификатор книги
     * @param seriesId Идентификатор серии
     * @param sequenceNumber Новый порядковый номер
     * @param volumeTitle Новое название тома
     * @return Обновленный объект связи
     */
    ProductSeries updateBookInSeries(Long productId, Long seriesId, Integer sequenceNumber, String volumeTitle);
    
    /**
     * Удалить книгу из серии
     * 
     * @param productId Идентификатор книги
     * @param seriesId Идентификатор серии
     * @return True, если связь успешно удалена
     */
    boolean removeBookFromSeries(Long productId, Long seriesId);
    
    /**
     * Получить все книги в серии, отсортированные по порядковому номеру
     * 
     * @param seriesId Идентификатор серии
     * @return Список книг в серии с информацией о порядке
     */
    List<ProductSeriesInfo> getBooksInSeries(Long seriesId);
    
    /**
     * Получить все серии, в которые входит книга
     * 
     * @param productId Идентификатор книги
     * @return Список серий с информацией о порядке книги
     */
    List<SeriesInfo> getSeriesForBook(Long productId);
    
    /**
     * Найти серии с пересекающимися книгами
     * 
     * @param seriesId Идентификатор серии
     * @return Список серий, имеющих общие книги с указанной серией
     */
    List<SeriesOverlap> findRelatedSeries(Long seriesId);
}
```

## Модели данных

### Series

```java
public class Series {
    private Long id;
    private String name;
    private String description;
    private Long publisherId;
    private String publisherName; // Для удобства отображения
    private String editor;
    private Integer startYear;
    private Integer endYear;
    private String logoUrl;
    private String status; // active, completed, discontinued
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer bookCount; // Количество книг в серии (вычисляемое поле)
}
```

### ProductSeries

```java
public class ProductSeries {
    private Long productId;
    private Long seriesId;
    private Integer sequenceNumber;
    private String volumeTitle;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

### ProductSeriesInfo (расширенная информация о книге в серии)

```java
public class ProductSeriesInfo {
    private Long productId;
    private String title;
    private String isbn;
    private Integer sequenceNumber;
    private String volumeTitle;
    private List<String> authors;
    private Integer publicationYear;
    private String coverUrl;
    private String notes;
}
```

### SeriesInfo (расширенная информация о серии для книги)

```java
public class SeriesInfo {
    private Long seriesId;
    private String name;
    private String publisherName;
    private Integer sequenceNumber;
    private String volumeTitle;
    private Integer totalBooks;
    private String status;
}
```

### SeriesOverlap (информация о пересечении серий)

```java
public class SeriesOverlap {
    private Long seriesId;
    private String seriesName;
    private Integer overlapCount; // Количество общих книг
    private List<ProductInfo> commonBooks; // Информация об общих книгах
}
```

## Запросы к данным

### Получение всех книг в серии с сортировкой по номеру

```sql
SELECT 
    p.id, 
    p.title, 
    p.isbn, 
    ps.sequence_number,
    ps.volume_title,
    a.name AS author_name
FROM 
    series s
JOIN 
    product_series ps ON s.id = ps.series_id
JOIN 
    products p ON ps.product_id = p.id
LEFT JOIN 
    product_authors pa ON p.id = pa.product_id
LEFT JOIN 
    authors a ON pa.author_id = a.id
WHERE 
    s.id = ?
ORDER BY 
    ps.sequence_number NULLS LAST;
```

### Получение всех серий определенного издательства

```sql
SELECT 
    s.id,
    s.name,
    s.description,
    s.start_year,
    s.end_year,
    s.status,
    COUNT(ps.product_id) AS book_count
FROM 
    series s
LEFT JOIN 
    product_series ps ON s.id = ps.series_id
WHERE 
    s.publisher_id = ?
GROUP BY 
    s.id
ORDER BY 
    s.name;
```

### Поиск серий по названию

```sql
SELECT 
    s.id,
    s.name,
    s.description,
    p.name AS publisher_name,
    s.start_year,
    s.end_year,
    s.status,
    COUNT(ps.product_id) AS book_count
FROM 
    series s
LEFT JOIN 
    publishers p ON s.publisher_id = p.id
LEFT JOIN 
    product_series ps ON s.id = ps.series_id
WHERE 
    s.name ILIKE ?
GROUP BY 
    s.id, p.name
ORDER BY 
    s.name;
```

## Правила валидации

1. Название серии не может быть пустым
2. Название серии должно быть уникальным в рамках одного издательства
3. Год окончания серии не может быть меньше года начала
4. Статус серии должен быть одним из предопределенных значений (active, completed, discontinued)
5. Порядковый номер книги в серии должен быть положительным целым числом

## Обработка особых случаев

### Слияние серий

Когда обнаружено, что две серии фактически являются одной:

1. Определить целевую (основную) серию
2. Перенести все книги из второй серии в целевую
3. Объединить метаданные серий (взять наиболее полные данные)
4. Сохранить альтернативное название как алиас серии
5. Деактивировать вторую серию или пометить как дубликат

### Разделение серии

Когда необходимо разделить серию на подсерии:

1. Создать новые записи серий
2. Распределить книги по соответствующим сериям
3. Установить связи между основной серией и подсериями

### Изменение порядка книг в серии

При необходимости изменить порядок книг (например, при вставке новой книги между существующими):

1. Определить новый порядковый номер для вставляемой книги
2. Увеличить порядковые номера всех последующих книг
3. Обновить данные о порядке во всех затронутых записях

## Инварианты

1. Каждая серия имеет уникальный идентификатор
2. Названия серий не дублируются у одного издательства
3. Книга может принадлежать к нескольким сериям одновременно
4. Для каждой книги в серии можно указать порядковый номер
5. Связь между книгой и серией является уникальной

## Связанные контракты

- [Контракт продуктов (Product Contract)](../product/product_contract.md) - Определяет структуру книги как продукта
- [Контракт издательств (Publisher Contract)](./publisher_contract.md) - Определяет структуру издательства
- [Контракт авторов (Author Contract)](./author_contract.md) - Определяет структуру автора
- [Контракт синонимов (Synonyms Contract)](../data/synonyms_contract.md) - Определяет механизмы работы с синонимами названий серий

## Тестирование и соответствие

Системы, реализующие данный контракт, должны проверять:

1. Корректное создание и обновление серий
2. Правильное установление связей между книгами и сериями
3. Корректную сортировку книг по порядковому номеру в серии
4. Целостность данных при слиянии и разделении серий
5. Соблюдение всех инвариантов и правил валидации

## Расширения

### Подсерии

Поддержка иерархической структуры серий:

```sql
ALTER TABLE series ADD COLUMN parent_series_id INTEGER REFERENCES series(id);
```

### Переводы названий серий

Поддержка названий серий на разных языках:

```sql
CREATE TABLE series_translations (
    series_id INTEGER REFERENCES series(id) ON DELETE CASCADE,
    language_code VARCHAR(10) NOT NULL,
    translated_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (series_id, language_code)
);
```

### Отслеживание истории изменений серий

Протоколирование всех изменений в данных о сериях:

```sql
CREATE TABLE series_history (
    id SERIAL PRIMARY KEY,
    series_id INTEGER NOT NULL REFERENCES series(id),
    change_type VARCHAR(20) NOT NULL, -- created, updated, deleted
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    changed_by INTEGER REFERENCES users(id),
    old_data JSONB,
    new_data JSONB
);
```

## Примеры использования

### Пример 1: Создание новой серии

```java
Series newSeries = new Series();
newSeries.setName("Гарри Поттер");
newSeries.setDescription("Серия книг о юном волшебнике");
newSeries.setPublisherId(5L); // Издательство "Росмэн"
newSeries.setStartYear(1998);
newSeries.setStatus("active");

Series createdSeries = seriesService.createSeries(newSeries);
System.out.println("Создана серия с ID: " + createdSeries.getId());
```

### Пример 2: Добавление книги в серию

```java
// Добавление книги "Гарри Поттер и философский камень" в серию
Long bookId = 1001L;
Long seriesId = 42L;
Integer sequenceNumber = 1; // Первая книга в серии
String volumeTitle = null; // Используем оригинальное название книги

ProductSeries relation = seriesService.addBookToSeries(bookId, seriesId, sequenceNumber, volumeTitle);
```

### Пример 3: Получение всех книг в серии

```java
Long seriesId = 42L; // ID серии "Гарри Поттер"
List<ProductSeriesInfo> booksInSeries = seriesService.getBooksInSeries(seriesId);

System.out.println("Книги в серии 'Гарри Поттер':");
for (ProductSeriesInfo book : booksInSeries) {
    System.out.printf("%d. %s (%s)%n", 
        book.getSequenceNumber(), 
        book.getTitle(), 
        String.join(", ", book.getAuthors()));
}
``` 