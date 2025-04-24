# Контракт: DeduplicationConfig

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
Класс DeduplicationConfig определяет контракт для конфигурации алгоритмов дедупликации. Он содержит настройки для различных стратегий дедупликации, пороги сходства и другие параметры, влияющие на процесс выявления и обработки дубликатов.

## Интерфейс
```java
/**
 * Класс для конфигурации алгоритмов дедупликации.
 */
public class DeduplicationConfig {
    /**
     * Стратегия обработки дубликатов.
     */
    public enum DuplicateHandlingStrategy {
        /** Удаление дубликатов */
        REMOVE,
        /** Объединение дубликатов */
        MERGE,
        /** Пометка дубликатов */
        MARK
    }

    /**
     * Стратегия блокировки для группировки записей.
     */
    public enum BlockingStrategy {
        /** Блокировка по ISBN */
        ISBN,
        /** Блокировка по артикулу */
        SKU,
        /** Блокировка по первым символам названия */
        TITLE_PREFIX,
        /** Блокировка по категории */
        CATEGORY,
        /** Гибридная блокировка */
        HYBRID
    }

    // Поля конфигурации
    private final String vendor;
    private final DuplicateHandlingStrategy handlingStrategy;
    private final BlockingStrategy blockingStrategy;
    private final double similarityThreshold;
    private final int minHashSignatureSize;
    private final int lshBandSize;
    private final List<String> exactMatchFields;
    private final List<String> fuzzyMatchFields;
    private final Map<String, Double> fieldWeights;
    private final boolean enableMinHash;
    private final boolean enableLSH;
    private final int numThreads;

    // Геттеры и конструктор
}
```

## Предусловия и инварианты

### Предусловия для конструктора
- vendor != null
- handlingStrategy != null
- blockingStrategy != null
- 0.0 <= similarityThreshold <= 1.0
- minHashSignatureSize > 0
- lshBandSize > 0
- exactMatchFields != null
- fuzzyMatchFields != null
- fieldWeights != null
- numThreads > 0

### Инварианты
- Сумма весов полей в fieldWeights должна быть равна 1.0
- Все поля, указанные в exactMatchFields и fuzzyMatchFields, должны существовать в схеме данных
- Если enableMinHash == true, то minHashSignatureSize должен быть > 0
- Если enableLSH == true, то lshBandSize должен быть > 0 и enableMinHash должен быть true

## Примеры использования
```java
// Пример создания конфигурации для дедупликации книг
DeduplicationConfig bookConfig = DeduplicationConfig.builder()
    .vendor("book24")
    .handlingStrategy(DuplicateHandlingStrategy.MERGE)
    .blockingStrategy(BlockingStrategy.ISBN)
    .similarityThreshold(0.85)
    .minHashSignatureSize(128)
    .lshBandSize(16)
    .exactMatchFields(Arrays.asList("ISBN", "Артикул"))
    .fuzzyMatchFields(Arrays.asList("Название", "Автор"))
    .fieldWeights(Map.of(
        "Название", 0.5,
        "Автор", 0.3,
        "Издательство", 0.1,
        "Год издания", 0.1
    ))
    .enableMinHash(true)
    .enableLSH(true)
    .numThreads(4)
    .build();

// Пример создания конфигурации для дедупликации канцтоваров
DeduplicationConfig stationeryConfig = DeduplicationConfig.builder()
    .vendor("officemag")
    .handlingStrategy(DuplicateHandlingStrategy.REMOVE)
    .blockingStrategy(BlockingStrategy.SKU)
    .similarityThreshold(0.9)
    .minHashSignatureSize(64)
    .lshBandSize(8)
    .exactMatchFields(Arrays.asList("Артикул", "Штрихкод"))
    .fuzzyMatchFields(Arrays.asList("Название", "Категория"))
    .fieldWeights(Map.of(
        "Название", 0.6,
        "Категория", 0.2,
        "Бренд", 0.2
    ))
    .enableMinHash(true)
    .enableLSH(true)
    .numThreads(2)
    .build();
```

## Реализации
- **VendorSpecificDeduplicationConfig**: расширение базовой конфигурации с учетом специфики конкретного поставщика
- **AdaptiveDeduplicationConfig**: конфигурация, которая адаптируется к данным на основе их характеристик

## Связанные контракты
- [Deduplicator Interface Contract](./contract.md)
- [JSON Schema](../../data/json-schema/input-schema.json)
