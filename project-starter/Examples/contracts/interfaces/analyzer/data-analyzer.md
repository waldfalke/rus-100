# Контракт: DataAnalyzer

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
Интерфейс DataAnalyzer определяет контракт для компонентов, отвечающих за анализ данных о товарах и формирование аналитических отчетов. Он предоставляет методы для анализа отдельных JSON-объектов, потоков JSON-объектов, JSON-файлов и данных из базы данных.

## Интерфейс
```java
/**
 * Интерфейс для анализа данных о товарах и формирования аналитических отчетов.
 */
public interface DataAnalyzer {
    /**
     * Анализирует JSON-объект и возвращает результат анализа.
     *
     * @param jsonObject JSON-объект для анализа
     * @return Результат анализа
     *
     * @pre jsonObject != null
     * @post result != null
     */
    AnalysisResult analyze(JSONObject jsonObject);

    /**
     * Анализирует поток JSON-объектов и возвращает результат анализа.
     *
     * @param jsonStream Поток JSON-объектов для анализа
     * @return Результат анализа
     *
     * @pre jsonStream != null
     * @post result != null
     */
    AnalysisResult analyzeStream(Stream<JSONObject> jsonStream);

    /**
     * Анализирует JSON-файл и возвращает результат анализа.
     *
     * @param jsonFile JSON-файл для анализа
     * @return Результат анализа
     * @throws IOException Если произошла ошибка при чтении файла
     *
     * @pre jsonFile != null
     * @pre jsonFile.exists()
     * @pre jsonFile.canRead()
     * @post result != null
     */
    AnalysisResult analyzeFile(File jsonFile) throws IOException;

    /**
     * Анализирует данные из базы данных и возвращает результат анализа.
     *
     * @param query SQL-запрос для выборки данных
     * @param connection Соединение с базой данных
     * @return Результат анализа
     * @throws SQLException Если произошла ошибка при работе с базой данных
     *
     * @pre query != null
     * @pre !query.isEmpty()
     * @pre connection != null
     * @pre !connection.isClosed()
     * @post result != null
     */
    AnalysisResult analyzeDatabase(String query, Connection connection) throws SQLException;

    /**
     * Генерирует отчет на основе результата анализа.
     *
     * @param result Результат анализа
     * @param format Формат отчета
     * @return Отчет
     *
     * @pre result != null
     * @pre format != null
     * @post result != null
     */
    Report generateReport(AnalysisResult result, ReportFormat format);

    /**
     * Сохраняет отчет в файл.
     *
     * @param report Отчет
     * @param outputFile Файл для сохранения отчета
     * @throws IOException Если произошла ошибка при записи файла
     *
     * @pre report != null
     * @pre outputFile != null
     * @post outputFile.exists()
     */
    void saveReport(Report report, File outputFile) throws IOException;

    /**
     * Возвращает список доступных аналитических алгоритмов.
     *
     * @return Список аналитических алгоритмов
     *
     * @post result != null
     */
    List<AnalysisAlgorithm> getAvailableAlgorithms();

    /**
     * Возвращает список доступных форматов отчетов.
     *
     * @return Список форматов отчетов
     *
     * @post result != null
     */
    List<ReportFormat> getAvailableReportFormats();

    /**
     * Устанавливает конфигурацию анализатора.
     *
     * @param config Конфигурация анализатора
     *
     * @pre config != null
     */
    void setConfig(AnalyzerConfig config);

    /**
     * Возвращает текущую конфигурацию анализатора.
     *
     * @return Конфигурация анализатора
     *
     * @post result != null
     */
    AnalyzerConfig getConfig();
}

/**
 * Интерфейс для аналитического алгоритма.
 */
public interface AnalysisAlgorithm {
    /**
     * Возвращает имя алгоритма.
     *
     * @return Имя алгоритма
     *
     * @post result != null
     * @post !result.isEmpty()
     */
    String getName();

    /**
     * Возвращает описание алгоритма.
     *
     * @return Описание алгоритма
     *
     * @post result != null
     */
    String getDescription();

    /**
     * Возвращает список параметров алгоритма.
     *
     * @return Список параметров
     *
     * @post result != null
     */
    List<AlgorithmParameter> getParameters();

    /**
     * Выполняет анализ данных.
     *
     * @param data Данные для анализа
     * @param parameters Параметры алгоритма
     * @return Результат анализа
     *
     * @pre data != null
     * @pre parameters != null
     * @post result != null
     */
    AnalysisResult execute(List<JSONObject> data, Map<String, Object> parameters);
}

/**
 * Класс для хранения параметра алгоритма.
 */
public class AlgorithmParameter {
    private final String name;
    private final String description;
    private final Class<?> type;
    private final Object defaultValue;
    private final boolean required;
    private final List<Object> allowedValues;

    // Геттеры и конструктор
}

/**
 * Класс для хранения результата анализа.
 */
public class AnalysisResult {
    private final String algorithmName;
    private final Date timestamp;
    private final Map<String, Object> metrics;
    private final Map<String, Object> insights;
    private final Map<String, Object> statistics;
    private final List<Anomaly> anomalies;
    private final List<Cluster> clusters;
    private final List<Trend> trends;
    private final List<Correlation> correlations;
    private final Map<String, Object> rawData;

    // Геттеры и конструктор
}

/**
 * Класс для хранения аномалии в данных.
 */
public class Anomaly {
    private final String type;
    private final String description;
    private final double severity;
    private final JSONObject data;
    private final Map<String, Object> details;

    // Геттеры и конструктор
}

/**
 * Класс для хранения кластера данных.
 */
public class Cluster {
    private final String name;
    private final String description;
    private final int size;
    private final Map<String, Object> centroid;
    private final List<JSONObject> members;
    private final Map<String, Object> statistics;

    // Геттеры и конструктор
}

/**
 * Класс для хранения тренда в данных.
 */
public class Trend {
    private final String field;
    private final String direction;
    private final double magnitude;
    private final Date startDate;
    private final Date endDate;
    private final List<Point> points;
    private final Map<String, Object> statistics;

    // Геттеры и конструктор
}

/**
 * Класс для хранения корреляции между полями.
 */
public class Correlation {
    private final String field1;
    private final String field2;
    private final double coefficient;
    private final String type;
    private final double pValue;
    private final Map<String, Object> details;

    // Геттеры и конструктор
}

/**
 * Класс для хранения точки данных.
 */
public class Point {
    private final Date timestamp;
    private final double value;

    // Геттеры и конструктор
}

/**
 * Интерфейс для отчета.
 */
public interface Report {
    /**
     * Возвращает заголовок отчета.
     *
     * @return Заголовок отчета
     *
     * @post result != null
     */
    String getTitle();

    /**
     * Возвращает формат отчета.
     *
     * @return Формат отчета
     *
     * @post result != null
     */
    ReportFormat getFormat();

    /**
     * Возвращает содержимое отчета в виде строки.
     *
     * @return Содержимое отчета
     *
     * @post result != null
     */
    String getContent();

    /**
     * Возвращает содержимое отчета в виде массива байтов.
     *
     * @return Содержимое отчета
     *
     * @post result != null
     */
    byte[] getContentAsBytes();

    /**
     * Возвращает размер отчета в байтах.
     *
     * @return Размер отчета
     *
     * @post result >= 0
     */
    long getSize();

    /**
     * Возвращает дату создания отчета.
     *
     * @return Дата создания
     *
     * @post result != null
     */
    Date getCreationDate();

    /**
     * Возвращает результат анализа, на основе которого был создан отчет.
     *
     * @return Результат анализа
     *
     * @post result != null
     */
    AnalysisResult getAnalysisResult();
}

/**
 * Перечисление форматов отчетов.
 */
public enum ReportFormat {
    /** HTML-формат */
    HTML,
    /** PDF-формат */
    PDF,
    /** CSV-формат */
    CSV,
    /** JSON-формат */
    JSON,
    /** XML-формат */
    XML,
    /** Excel-формат */
    EXCEL,
    /** Markdown-формат */
    MARKDOWN,
    /** Текстовый формат */
    TEXT
}

/**
 * Класс для хранения конфигурации анализатора.
 */
public class AnalyzerConfig {
    private final List<String> enabledAlgorithms;
    private final Map<String, Map<String, Object>> algorithmParameters;
    private final int maxThreads;
    private final int timeout;
    private final boolean cacheResults;
    private final int cacheSize;
    private final String outputDirectory;
    private final ReportFormat defaultReportFormat;
    private final Map<String, Object> additionalSettings;

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
        private List<String> enabledAlgorithms = new ArrayList<>();
        private Map<String, Map<String, Object>> algorithmParameters = new HashMap<>();
        private int maxThreads = Runtime.getRuntime().availableProcessors();
        private int timeout = 60000;
        private boolean cacheResults = true;
        private int cacheSize = 1000;
        private String outputDirectory = "reports";
        private ReportFormat defaultReportFormat = ReportFormat.HTML;
        private Map<String, Object> additionalSettings = new HashMap<>();

        // Методы для установки параметров

        /**
         * Создает объект AnalyzerConfig.
         *
         * @return Объект AnalyzerConfig
         */
        public AnalyzerConfig build() {
            return new AnalyzerConfig(
                enabledAlgorithms, algorithmParameters, maxThreads, timeout,
                cacheResults, cacheSize, outputDirectory, defaultReportFormat,
                additionalSettings
            );
        }
    }
}

## Предусловия и постусловия

### analyze(JSONObject jsonObject)
- **Предусловия**:
  - jsonObject != null
- **Постусловия**:
  - result != null

### analyzeStream(Stream<JSONObject> jsonStream)
- **Предусловия**:
  - jsonStream != null
- **Постусловия**:
  - result != null

### analyzeFile(File jsonFile)
- **Предусловия**:
  - jsonFile != null
  - jsonFile.exists()
  - jsonFile.canRead()
- **Постусловия**:
  - result != null

### analyzeDatabase(String query, Connection connection)
- **Предусловия**:
  - query != null
  - !query.isEmpty()
  - connection != null
  - !connection.isClosed()
- **Постусловия**:
  - result != null

### generateReport(AnalysisResult result, ReportFormat format)
- **Предусловия**:
  - result != null
  - format != null
- **Постусловия**:
  - result != null

### saveReport(Report report, File outputFile)
- **Предусловия**:
  - report != null
  - outputFile != null
- **Постусловия**:
  - outputFile.exists()

### getAvailableAlgorithms()
- **Предусловия**: нет
- **Постусловия**:
  - result != null

### getAvailableReportFormats()
- **Предусловия**: нет
- **Постусловия**:
  - result != null

### setConfig(AnalyzerConfig config)
- **Предусловия**:
  - config != null
- **Постусловия**: нет

### getConfig()
- **Предусловия**: нет
- **Постусловия**:
  - result != null

## Инварианты
- Анализатор должен быть потокобезопасным
- Анализатор должен корректно обрабатывать все типы данных JSON (строки, числа, булевы значения, массивы, объекты, null)
- Анализатор должен возвращать согласованные результаты для одинаковых входных данных и параметров
- Анализатор должен обеспечивать изоляцию между разными аналитическими алгоритмами
- Анализатор должен обеспечивать корректную обработку больших объемов данных с минимальным использованием памяти

## Исключения
- **IOException**: если произошла ошибка при чтении или записи файла
- **SQLException**: если произошла ошибка при работе с базой данных
- **IllegalArgumentException**: если нарушены предусловия методов
- **UnsupportedOperationException**: если запрошенная операция не поддерживается конкретной реализацией
- **AnalysisException**: если произошла ошибка во время анализа данных
- **ReportGenerationException**: если произошла ошибка при генерации отчета
- **TimeoutException**: если выполнение анализа превысило установленный таймаут

## Примеры использования
```java
// Пример анализа JSON-объекта
DataAnalyzer analyzer = new DefaultDataAnalyzer();

// Создание JSON-объекта с данными о товаре
JSONObject product = new JSONObject();
product.put("id", "12345");
product.put("name", "Война и мир");
product.put("author", "Лев Толстой");
product.put("price", 599.99);
product.put("category", "Классическая литература");
product.put("publisher", "Эксмо");
product.put("year", 2018);
product.put("isbn", "9785171147341");
product.put("pages", 1300);
product.put("rating", 4.8);
product.put("reviews", 120);

// Анализ данных
AnalysisResult result = analyzer.analyze(product);

// Вывод результатов анализа
System.out.println("Algorithm: " + result.getAlgorithmName());
System.out.println("Timestamp: " + result.getTimestamp());

// Вывод метрик
Map<String, Object> metrics = result.getMetrics();
metrics.forEach((key, value) -> System.out.println(key + ": " + value));

// Вывод выводов (инсайтов)
Map<String, Object> insights = result.getInsights();
insights.forEach((key, value) -> System.out.println(key + ": " + value));

// Пример анализа потока JSON-объектов
// Загрузка данных из файла
File jsonFile = new File("products.json");
try (Stream<JSONObject> jsonStream = loadJsonStream(jsonFile)) {
    // Анализ потока данных
    AnalysisResult streamResult = analyzer.analyzeStream(jsonStream);

    // Генерация отчета в формате HTML
    Report report = analyzer.generateReport(streamResult, ReportFormat.HTML);

    // Сохранение отчета в файл
    File outputFile = new File("report.html");
    analyzer.saveReport(report, outputFile);
    System.out.println("Report saved to: " + outputFile.getAbsolutePath());
} catch (IOException e) {
    System.err.println("Error processing file: " + e.getMessage());
}

// Пример анализа данных из базы данных
try (Connection connection = DriverManager.getConnection("jdbc:postgresql://localhost:5432/catmepim", "postgres", "postgres")) {
    // SQL-запрос для выборки данных
    String query = "SELECT * FROM products WHERE category = 'Классическая литература'";

    // Анализ данных из базы
    AnalysisResult dbResult = analyzer.analyzeDatabase(query, connection);

    // Генерация отчета в формате PDF
    Report report = analyzer.generateReport(dbResult, ReportFormat.PDF);

    // Сохранение отчета в файл
    File outputFile = new File("database_report.pdf");
    analyzer.saveReport(report, outputFile);
    System.out.println("Database report saved to: " + outputFile.getAbsolutePath());
} catch (SQLException e) {
    System.err.println("Database error: " + e.getMessage());
} catch (IOException e) {
    System.err.println("Error saving report: " + e.getMessage());
}

// Пример настройки анализатора
// Создание конфигурации
AnalyzerConfig config = AnalyzerConfig.builder()
    .enabledAlgorithms(Arrays.asList("clustering", "anomaly-detection", "trend-analysis"))
    .algorithmParameters(Map.of(
        "clustering", Map.of("num_clusters", 5, "distance_metric", "euclidean"),
        "anomaly-detection", Map.of("threshold", 0.95, "method", "isolation-forest"),
        "trend-analysis", Map.of("window_size", 30, "min_points", 10)
    ))
    .maxThreads(4)
    .timeout(120000)
    .cacheResults(true)
    .cacheSize(500)
    .outputDirectory("reports/analytics")
    .defaultReportFormat(ReportFormat.HTML)
    .additionalSettings(Map.of("debug", true, "log_level", "INFO"))
    .build();

// Установка конфигурации
analyzer.setConfig(config);

// Получение списка доступных алгоритмов
List<AnalysisAlgorithm> algorithms = analyzer.getAvailableAlgorithms();
System.out.println("Available algorithms:");
algorithms.forEach(algorithm -> {
    System.out.println("- " + algorithm.getName() + ": " + algorithm.getDescription());
    System.out.println("  Parameters:");
    algorithm.getParameters().forEach(param -> {
        System.out.println("  - " + param.getName() + ": " + param.getDescription());
        System.out.println("    Type: " + param.getType().getSimpleName());
        System.out.println("    Default: " + param.getDefaultValue());
        System.out.println("    Required: " + param.isRequired());
    });
});

// Получение списка доступных форматов отчетов
List<ReportFormat> formats = analyzer.getAvailableReportFormats();
System.out.println("Available report formats: " + formats);
```

## Типы аналитических алгоритмов

1. **Кластеризация (Clustering)**
   - Группировка товаров по схожим характеристикам
   - Выявление естественных групп и категорий
   - Алгоритмы: K-means, DBSCAN, иерархическая кластеризация

2. **Обнаружение аномалий (Anomaly Detection)**
   - Выявление нетипичных товаров или цен
   - Поиск ошибок в данных
   - Алгоритмы: Isolation Forest, One-Class SVM, статистические методы

3. **Анализ трендов (Trend Analysis)**
   - Выявление тенденций в ценах или популярности товаров
   - Прогнозирование будущих значений
   - Алгоритмы: регрессионный анализ, временные ряды, ARIMA

4. **Корреляционный анализ (Correlation Analysis)**
   - Выявление взаимосвязей между различными характеристиками товаров
   - Поиск скрытых зависимостей
   - Алгоритмы: коэффициент корреляции Пирсона, ранговая корреляция Спирмена

5. **Ассоциативный анализ (Association Analysis)**
   - Выявление товаров, которые часто покупают вместе
   - Анализ потребительской корзины
   - Алгоритмы: Apriori, FP-Growth

6. **Сегментация (Segmentation)**
   - Разделение товаров на группы по бизнес-критериям
   - Выделение высокоприбыльных и низкоприбыльных сегментов
   - Алгоритмы: RFM-анализ, ABC-анализ

7. **Статистический анализ (Statistical Analysis)**
   - Расчет основных статистических показателей
   - Анализ распределений цен, рейтингов и других числовых показателей
   - Алгоритмы: дескриптивная статистика, статистические тесты

8. **Текстовый анализ (Text Analysis)**
   - Анализ описаний товаров и отзывов
   - Выделение ключевых слов и тем
   - Алгоритмы: TF-IDF, анализ тональности, тематическое моделирование

## Реализации
- **DefaultDataAnalyzer**: основная реализация, поддерживающая все типы анализа
- **StatisticalAnalyzer**: реализация, специализирующаяся на статистическом анализе
- **MachineLearningAnalyzer**: реализация, использующая алгоритмы машинного обучения
- **StreamingAnalyzer**: реализация, оптимизированная для обработки больших объемов данных
- **DistributedAnalyzer**: реализация с распределенной обработкой данных
- **CachedAnalyzer**: реализация с кэшированием результатов анализа

## Связанные контракты
- [Converter Interface Contract](../converter/contract.md)
- [Deduplicator Interface Contract](../deduplicator/contract.md)
- [ETL Process Contract](../../ETL-Process-Contract.md)
- [DatabaseLoader Interface Contract](../database-loader/contract.md)
- [DataEnricher Interface Contract](../enricher/data-enricher.md)
