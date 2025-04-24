# Контракт: DataAnalyzer Interface

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
Интерфейс DataAnalyzer определяет контракт для компонентов, отвечающих за анализ данных о товарах, выделение архетипов, проведение статистического анализа и базовой кластеризации. Он предоставляет методы для анализа данных как из потока JSON-объектов, так и из JSON-файла.

## Интерфейс
```java
/**
 * Интерфейс для анализа данных.
 */
public interface DataAnalyzer {
    /**
     * Анализирует данные и возвращает отчет.
     *
     * @param dataStream Поток JSON-объектов для анализа
     * @return Отчет об анализе данных
     *
     * @pre dataStream != null
     * @post result != null
     */
    AnalysisReport analyze(Stream<JSONObject> dataStream);

    /**
     * Анализирует данные из файла и возвращает отчет.
     *
     * @param jsonFile JSON-файл для анализа
     * @return Отчет об анализе данных
     * @throws IOException Если произошла ошибка при чтении файла
     *
     * @pre jsonFile != null
     * @pre jsonFile.exists()
     * @pre jsonFile.canRead()
     * @post result != null
     */
    AnalysisReport analyzeFile(File jsonFile) throws IOException;

    /**
     * Анализирует данные с дополнительными параметрами и возвращает отчет.
     *
     * @param dataStream Поток JSON-объектов для анализа
     * @param config Конфигурация анализа
     * @return Отчет об анализе данных
     *
     * @pre dataStream != null
     * @pre config != null
     * @post result != null
     */
    AnalysisReport analyze(Stream<JSONObject> dataStream, AnalyzerConfig config);

    /**
     * Сохраняет отчет об анализе в файл.
     *
     * @param report Отчет об анализе данных
     * @param outputFile Файл для сохранения отчета
     * @throws IOException Если произошла ошибка при записи файла
     *
     * @pre report != null
     * @pre outputFile != null
     * @post outputFile.exists()
     */
    void saveReport(AnalysisReport report, File outputFile) throws IOException;

    /**
     * Возвращает метаданные о последней операции анализа.
     *
     * @return Объект AnalysisMetadata с информацией о процессе анализа
     *
     * @pre была выполнена хотя бы одна операция анализа
     * @post result != null
     */
    AnalysisMetadata getMetadata();
}

/**
 * Класс для хранения отчета об анализе данных.
 */
public class AnalysisReport {
    private final Map<String, Object> statistics;
    private final List<Cluster> clusters;
    private final Map<String, List<JSONObject>> groupedData;
    private final List<Archetype> archetypes;
    private final Map<String, Chart> charts;

    /**
     * Создает новый объект AnalysisReport.
     *
     * @param statistics Статистические показатели
     * @param clusters Выделенные кластеры
     * @param groupedData Сгруппированные данные
     * @param archetypes Выделенные архетипы
     * @param charts Графики и диаграммы
     *
     * @pre statistics != null
     * @pre clusters != null
     * @pre groupedData != null
     * @pre archetypes != null
     * @pre charts != null
     */
    public AnalysisReport(
        Map<String, Object> statistics,
        List<Cluster> clusters,
        Map<String, List<JSONObject>> groupedData,
        List<Archetype> archetypes,
        Map<String, Chart> charts
    ) {
        this.statistics = statistics;
        this.clusters = clusters;
        this.groupedData = groupedData;
        this.archetypes = archetypes;
        this.charts = charts;
    }

    // Геттеры
    public Map<String, Object> getStatistics() { return statistics; }
    public List<Cluster> getClusters() { return clusters; }
    public Map<String, List<JSONObject>> getGroupedData() { return groupedData; }
    public List<Archetype> getArchetypes() { return archetypes; }
    public Map<String, Chart> getCharts() { return charts; }
}

/**
 * Класс для хранения метаданных о процессе анализа.
 */
public class AnalysisMetadata {
    private final String sourceFileName;
    private final int totalRecords;
    private final long processingTimeMs;
    private final Map<String, Long> stageTimings;
    private final List<String> warnings;

    // Геттеры и конструктор
}

/**
 * Класс для конфигурации процесса анализа.
 */
public class AnalyzerConfig {
    private final List<String> groupingFields;
    private final List<String> statisticalFields;
    private final int numClusters;
    private final double clusteringThreshold;
    private final boolean generateCharts;
    private final boolean detectArchetypes;
    private final int maxArchetypes;

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
        private int numClusters = 5;
        private double clusteringThreshold = 0.7;
        private boolean generateCharts = false;
        private boolean detectArchetypes = true;
        private int maxArchetypes = 10;
        
        // Методы для установки параметров
        
        /**
         * Создает объект AnalyzerConfig.
         *
         * @return Объект AnalyzerConfig
         */
        public AnalyzerConfig build() {
            return new AnalyzerConfig(
                groupingFields, statisticalFields, numClusters,
                clusteringThreshold, generateCharts, detectArchetypes, maxArchetypes
            );
        }
    }
}

/**
 * Класс для представления кластера данных.
 */
public class Cluster {
    private final String id;
    private final String name;
    private final List<JSONObject> items;
    private final JSONObject centroid;
    private final Map<String, Object> properties;

    // Геттеры и конструктор
}

/**
 * Класс для представления архетипа товара.
 */
public class Archetype {
    private final String id;
    private final String name;
    private final JSONObject prototype;
    private final List<String> keyFeatures;
    private final Map<String, Object> properties;

    // Геттеры и конструктор
}

/**
 * Класс для представления графика или диаграммы.
 */
public class Chart {
    private final String id;
    private final String title;
    private final String type;
    private final Map<String, Object> data;
    private final Map<String, Object> options;

    // Геттеры и конструктор
}
```

## Предусловия и постусловия

### analyze(Stream<JSONObject> dataStream)
- **Предусловия**:
  - dataStream != null
- **Постусловия**:
  - result != null

### analyzeFile(File jsonFile)
- **Предусловия**:
  - jsonFile != null
  - jsonFile.exists()
  - jsonFile.canRead()
- **Постусловия**:
  - result != null

### analyze(Stream<JSONObject> dataStream, AnalyzerConfig config)
- **Предусловия**:
  - dataStream != null
  - config != null
- **Постусловия**:
  - result != null

### saveReport(AnalysisReport report, File outputFile)
- **Предусловия**:
  - report != null
  - outputFile != null
- **Постусловия**:
  - outputFile.exists()

### getMetadata()
- **Предусловия**:
  - была выполнена хотя бы одна операция анализа
- **Постусловия**:
  - result != null

## Инварианты
- Анализатор должен обрабатывать все записи из входного потока
- Анализатор должен корректно обрабатывать пустые поля и значения null
- Анализатор должен обеспечивать воспроизводимость результатов при одинаковых входных данных

## Исключения
- **IOException**: если произошла ошибка при чтении или записи файла
- **IllegalArgumentException**: если нарушены предусловия методов
- **IllegalStateException**: если метод getMetadata() вызван до выполнения операции анализа

## Примеры использования
```java
// Пример использования метода analyze
Stream<JSONObject> jsonData = getJsonData();
DataAnalyzer analyzer = new StatisticalAnalyzer();
AnalysisReport report = analyzer.analyze(jsonData);
System.out.println("Analysis completed with " + report.getStatistics().size() + " statistical indicators");
System.out.println("Found " + report.getClusters().size() + " clusters");
System.out.println("Detected " + report.getArchetypes().size() + " archetypes");

// Пример использования метода analyzeFile
File jsonFile = new File("data.json");
DataAnalyzer analyzer = new StatisticalAnalyzer();
try {
    AnalysisReport report = analyzer.analyzeFile(jsonFile);
    System.out.println("Analysis of file completed");
} catch (IOException e) {
    System.err.println("Error reading file: " + e.getMessage());
}

// Пример использования метода analyze с конфигурацией
Stream<JSONObject> jsonData = getJsonData();
AnalyzerConfig config = AnalyzerConfig.builder()
    .groupingFields(Arrays.asList("category", "publisher"))
    .statisticalFields(Arrays.asList("price", "pages"))
    .numClusters(10)
    .generateCharts(true)
    .build();
DataAnalyzer analyzer = new StatisticalAnalyzer();
AnalysisReport report = analyzer.analyze(jsonData, config);
System.out.println("Custom analysis completed");

// Пример сохранения отчета
File outputFile = new File("analysis_report.json");
try {
    analyzer.saveReport(report, outputFile);
    System.out.println("Report saved to " + outputFile.getAbsolutePath());
} catch (IOException e) {
    System.err.println("Error saving report: " + e.getMessage());
}

// Пример получения метаданных
AnalysisMetadata metadata = analyzer.getMetadata();
System.out.println("Analysis took " + metadata.getProcessingTimeMs() + " ms");
System.out.println("Processed " + metadata.getTotalRecords() + " records");
```

## Реализации
- **StatisticalAnalyzer**: основная реализация, выполняющая статистический анализ данных
- **ClusteringAnalyzer**: реализация, фокусирующаяся на кластеризации данных
- **ArchetypeAnalyzer**: реализация, фокусирующаяся на выделении архетипов товаров

## Связанные контракты
- [DataAnalyzer Architecture Contract](../../DataAnalyzer-Architecture-Contract.md)
- [Deduplicator Interface Contract](../deduplicator/contract.md)
- [JSON Schema](../../data/json-schema/deduplicator-output-schema.json)
