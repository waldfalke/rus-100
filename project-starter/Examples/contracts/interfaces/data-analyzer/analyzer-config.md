# Контракт: AnalyzerConfig

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
Класс AnalyzerConfig определяет контракт для конфигурации процесса анализа данных. Он содержит настройки для статистического анализа, группировки, кластеризации и выделения архетипов, а также параметры для генерации отчетов и визуализации.

## Интерфейс
```java
/**
 * Класс для конфигурации процесса анализа данных.
 */
public class AnalyzerConfig {
    /**
     * Тип статистического анализа.
     */
    public enum StatisticalAnalysisType {
        /** Базовая статистика (среднее, медиана, мин, макс) */
        BASIC,
        /** Расширенная статистика (включая стандартное отклонение, квартили и т.д.) */
        EXTENDED,
        /** Полная статистика (включая корреляции, регрессии и т.д.) */
        FULL
    }

    /**
     * Алгоритм кластеризации.
     */
    public enum ClusteringAlgorithm {
        /** K-средних */
        K_MEANS,
        /** Иерархическая кластеризация */
        HIERARCHICAL,
        /** DBSCAN */
        DBSCAN,
        /** Нет кластеризации */
        NONE
    }

    /**
     * Формат отчета.
     */
    public enum ReportFormat {
        /** JSON */
        JSON,
        /** XML */
        XML,
        /** HTML */
        HTML,
        /** PDF */
        PDF,
        /** CSV */
        CSV
    }

    // Поля конфигурации
    private final List<String> groupingFields;
    private final List<String> statisticalFields;
    private final StatisticalAnalysisType statisticalAnalysisType;
    private final ClusteringAlgorithm clusteringAlgorithm;
    private final int numClusters;
    private final double clusteringThreshold;
    private final boolean generateCharts;
    private final boolean detectArchetypes;
    private final int maxArchetypes;
    private final ReportFormat reportFormat;
    private final boolean includeRawData;
    private final int maxItemsPerGroup;
    private final Map<String, Object> algorithmSpecificParams;

    // Геттеры и конструктор
    
    /**
     * Создает билдер для конфигурации.
     *
     * @return Билдер для AnalyzerConfig
     */
    public static Builder builder() {
        return new Builder();
    }
    
    /**
     * Билдер для AnalyzerConfig.
     */
    public static class Builder {
        private List<String> groupingFields = new ArrayList<>();
        private List<String> statisticalFields = new ArrayList<>();
        private StatisticalAnalysisType statisticalAnalysisType = StatisticalAnalysisType.BASIC;
        private ClusteringAlgorithm clusteringAlgorithm = ClusteringAlgorithm.K_MEANS;
        private int numClusters = 5;
        private double clusteringThreshold = 0.7;
        private boolean generateCharts = false;
        private boolean detectArchetypes = true;
        private int maxArchetypes = 10;
        private ReportFormat reportFormat = ReportFormat.JSON;
        private boolean includeRawData = false;
        private int maxItemsPerGroup = 100;
        private Map<String, Object> algorithmSpecificParams = new HashMap<>();
        
        // Методы для установки параметров
        
        /**
         * Создает объект AnalyzerConfig.
         *
         * @return Объект AnalyzerConfig
         */
        public AnalyzerConfig build() {
            return new AnalyzerConfig(
                groupingFields, statisticalFields, statisticalAnalysisType,
                clusteringAlgorithm, numClusters, clusteringThreshold,
                generateCharts, detectArchetypes, maxArchetypes,
                reportFormat, includeRawData, maxItemsPerGroup,
                algorithmSpecificParams
            );
        }
    }
}
```

## Предусловия и инварианты

### Предусловия для конструктора
- groupingFields != null
- statisticalFields != null
- statisticalAnalysisType != null
- clusteringAlgorithm != null
- numClusters > 0 (если clusteringAlgorithm != NONE)
- clusteringThreshold >= 0.0 && clusteringThreshold <= 1.0
- maxArchetypes > 0 (если detectArchetypes == true)
- reportFormat != null
- maxItemsPerGroup > 0
- algorithmSpecificParams != null

### Инварианты
- Если clusteringAlgorithm == NONE, то numClusters игнорируется
- Если detectArchetypes == false, то maxArchetypes игнорируется
- Если generateCharts == false, то графики не генерируются
- Если includeRawData == false, то сырые данные не включаются в отчет

## Примеры использования
```java
// Пример создания базовой конфигурации
AnalyzerConfig basicConfig = AnalyzerConfig.builder()
    .groupingFields(Arrays.asList("category", "publisher"))
    .statisticalFields(Arrays.asList("price", "pages"))
    .build();

// Пример создания конфигурации для расширенного статистического анализа
AnalyzerConfig statsConfig = AnalyzerConfig.builder()
    .statisticalFields(Arrays.asList("price", "pages", "weight"))
    .statisticalAnalysisType(StatisticalAnalysisType.EXTENDED)
    .includeRawData(true)
    .build();

// Пример создания конфигурации для кластеризации
AnalyzerConfig clusteringConfig = AnalyzerConfig.builder()
    .clusteringAlgorithm(ClusteringAlgorithm.K_MEANS)
    .numClusters(10)
    .clusteringThreshold(0.8)
    .algorithmSpecificParams(Map.of(
        "maxIterations", 100,
        "initMethod", "k-means++"
    ))
    .build();

// Пример создания конфигурации для выделения архетипов и генерации отчета
AnalyzerConfig archetypeConfig = AnalyzerConfig.builder()
    .detectArchetypes(true)
    .maxArchetypes(15)
    .generateCharts(true)
    .reportFormat(ReportFormat.HTML)
    .build();

// Пример использования конфигурации для анализа данных
DataAnalyzer analyzer = new StatisticalAnalyzer();
AnalysisReport report = analyzer.analyze(jsonData, archetypeConfig);
```

## Реализации
- **BasicAnalyzerConfig**: упрощенная конфигурация для базового анализа
- **ClusteringAnalyzerConfig**: конфигурация, оптимизированная для кластеризации
- **ArchetypeAnalyzerConfig**: конфигурация, оптимизированная для выделения архетипов

## Связанные контракты
- [DataAnalyzer Interface Contract](./contract.md)
- [DataAnalyzer Architecture Contract](../../DataAnalyzer-Architecture-Contract.md)
