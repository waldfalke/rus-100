# Контракт на внедрение системы логирования в CATMEPIM

**Версия**: 1.0.0
**Дата**: 2025-04-19
**Статус**: Черновик
**Автор**: Евгений Соколов

## Связи с другими контрактами

- **[Системный контракт](../system/system-contract.md)** - Основной контракт системы CATMEPIM
- **[Excel-to-JSON конвертер](../converters/excel-to-json-converter.md)** - Контракт компонента, который будет использовать систему логирования
- **[Segmented Excel Converter](../converters/segmented-excel-converter.md)** - Контракт компонента, который будет использовать систему логирования
- **[ETL System](../etl/etl-system.md)** - Контракт ETL-системы, которая будет использовать систему логирования

## 1. Цели и задачи

### 1.1. Цели
- Обеспечить комплексное логирование всех компонентов системы CATMEPIM
- Улучшить диагностику ошибок и проблем производительности
- Обеспечить возможность мониторинга состояния системы в реальном времени
- Создать единый подход к логированию во всех компонентах системы

### 1.2. Задачи
- Внедрить SLF4J как фасад логирования с Log4j2 в качестве реализации
- Разработать стандарты логирования для всех компонентов системы
- Настроить различные уровни логирования для разных компонентов
- Реализовать ротацию логов и архивирование
- Обеспечить возможность фильтрации и поиска в логах

## 2. Архитектура системы логирования

### 2.1. Компоненты
- **SLF4J** - фасад логирования, используемый во всех компонентах системы
- **Log4j2** - реализация логирования
- **slf4j-log4j2** - мост между SLF4J и Log4j2

### 2.2. Конфигурация
- Конфигурация Log4j2 через XML-файл
- Поддержка различных аппендеров (консоль, файл, сокет)
- Настройка форматов логирования для разных типов вывода

### 2.3. Уровни логирования
- **TRACE** - детальная отладочная информация
- **DEBUG** - отладочная информация
- **INFO** - информационные сообщения о нормальной работе
- **WARN** - предупреждения, не влияющие на работу системы
- **ERROR** - ошибки, влияющие на работу компонента
- **FATAL** - критические ошибки, приводящие к остановке системы

## 3. Стандарты логирования

### 3.1. Общие принципы
- Использование SLF4J в качестве фасада логирования
- Использование MDC для контекстного логирования
- Соблюдение уровней логирования
- Очистка MDC после завершения обработки

### 3.2. Контекстное логирование (MDC)
Для каждого процесса обработки файла в MDC должны быть добавлены следующие параметры:
- `excelFile` - путь к файлу Excel
- `jsonFile` / `csvFile` - путь к выходному файлу
- `fileSize` - размер файла в байтах
- `conversionId` - уникальный идентификатор конверсии
- `strategy` - название стратегии обработки (для классов стратегий)

### 3.3. Логирование использования памяти
Для каждого процесса обработки файла должна логироваться информация о доступной памяти:
- Перед началом обработки
- После завершения обработки

Информация о памяти должна включать:
- Максимальный размер памяти (maxMemory)
- Общий размер памяти (totalMemory)
- Используемый размер памяти (usedMemory)
- Свободный размер памяти (freeMemory)

### 3.4. Логирование производительности
Для каждого процесса обработки файла должна логироваться информация о производительности:
- Время выполнения операций
- Скорость обработки строк (строк в секунду)
- Информация о прогрессе обработки

### 3.5. Логирование файловых операций
Для каждого процесса обработки файла должна логироваться информация о файловых операциях:
- Информация о размере входных и выходных файлов
- Информация о коэффициенте сжатия
- Информация о временных файлах

### 3.1. Формат сообщений
- Временная метка (ISO 8601)
- Уровень логирования
- Имя потока
- Имя класса/компонента
- Сообщение
- Контекстная информация (MDC)
- Стек вызовов (для ошибок)

Пример формата:
```
%d{yyyy-MM-dd HH:mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n
```

### 3.2. Контекстная информация
- ID запроса/операции
- Имя файла/ресурса
- Имя компонента
- Метрики производительности (время выполнения)

### 3.3. Правила логирования
- Логирование начала и завершения важных операций
- Логирование параметров операций (без конфиденциальных данных)
- Логирование исключений с полным стеком вызовов
- Использование соответствующих уровней логирования

## 4. Реализация

### 4.1. Зависимости Maven
```xml
<dependencies>
    <!-- SLF4J API -->
    <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-api</artifactId>
        <version>1.7.36</version>
    </dependency>

    <!-- Log4j2 Core -->
    <dependency>
        <groupId>org.apache.logging.log4j</groupId>
        <artifactId>log4j-core</artifactId>
        <version>2.20.0</version>
    </dependency>

    <!-- Log4j2 API -->
    <dependency>
        <groupId>org.apache.logging.log4j</groupId>
        <artifactId>log4j-api</artifactId>
        <version>2.20.0</version>
    </dependency>

    <!-- Bridge between SLF4J and Log4j2 -->
    <dependency>
        <groupId>org.apache.logging.log4j</groupId>
        <artifactId>log4j-slf4j-impl</artifactId>
        <version>2.20.0</version>
    </dependency>
</dependencies>
```

### 4.2. Конфигурация Log4j2
Файл `log4j2.xml` в директории `src/main/resources`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="WARN">
    <Properties>
        <Property name="LOG_PATTERN">%d{yyyy-MM-dd HH:mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n</Property>
        <Property name="APP_LOG_ROOT">logs</Property>
    </Properties>

    <Appenders>
        <Console name="Console" target="SYSTEM_OUT">
            <PatternLayout pattern="${LOG_PATTERN}"/>
        </Console>

        <RollingFile name="FileAppender" fileName="${APP_LOG_ROOT}/application.log"
                     filePattern="${APP_LOG_ROOT}/application-%d{yyyy-MM-dd}-%i.log">
            <PatternLayout pattern="${LOG_PATTERN}"/>
            <Policies>
                <SizeBasedTriggeringPolicy size="10MB" />
                <TimeBasedTriggeringPolicy interval="1" />
            </Policies>
            <DefaultRolloverStrategy max="10"/>
        </RollingFile>

        <RollingFile name="ErrorFileAppender" fileName="${APP_LOG_ROOT}/error.log"
                     filePattern="${APP_LOG_ROOT}/error-%d{yyyy-MM-dd}-%i.log">
            <PatternLayout pattern="${LOG_PATTERN}"/>
            <Policies>
                <SizeBasedTriggeringPolicy size="10MB" />
                <TimeBasedTriggeringPolicy interval="1" />
            </Policies>
            <DefaultRolloverStrategy max="10"/>
        </RollingFile>

        <RollingFile name="ETLFileAppender" fileName="${APP_LOG_ROOT}/etl.log"
                     filePattern="${APP_LOG_ROOT}/etl-%d{yyyy-MM-dd}-%i.log">
            <PatternLayout pattern="${LOG_PATTERN}"/>
            <Policies>
                <SizeBasedTriggeringPolicy size="10MB" />
                <TimeBasedTriggeringPolicy interval="1" />
            </Policies>
            <DefaultRolloverStrategy max="10"/>
        </RollingFile>

        <RollingFile name="ExcelConverterAppender" fileName="${APP_LOG_ROOT}/excel-converter.log"
                     filePattern="${APP_LOG_ROOT}/excel-converter-%d{yyyy-MM-dd}-%i.log">
            <PatternLayout pattern="${LOG_PATTERN}"/>
            <Policies>
                <SizeBasedTriggeringPolicy size="10MB" />
                <TimeBasedTriggeringPolicy interval="1" />
            </Policies>
            <DefaultRolloverStrategy max="10"/>
        </RollingFile>
    </Appenders>

    <Loggers>
        <!-- ETL System Logger -->
        <Logger name="com.catmepim.etl" level="INFO" additivity="false">
            <AppenderRef ref="ETLFileAppender"/>
            <AppenderRef ref="Console"/>
        </Logger>

        <!-- Excel to JSON Converter Logger -->
        <Logger name="com.catmepim.strategy" level="INFO" additivity="false">
            <AppenderRef ref="ExcelConverterAppender"/>
            <AppenderRef ref="Console"/>
        </Logger>

        <!-- Error Logger -->
        <Logger name="com.catmepim" level="ERROR" additivity="false">
            <AppenderRef ref="ErrorFileAppender"/>
            <AppenderRef ref="Console"/>
        </Logger>

        <!-- Root Logger -->
        <Root level="INFO">
            <AppenderRef ref="FileAppender"/>
            <AppenderRef ref="Console"/>
        </Root>
    </Loggers>
</Configuration>
```

### 4.3. Использование в коде

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;

public class ExampleClass {
    private static final Logger logger = LoggerFactory.getLogger(ExampleClass.class);

    public void processFile(String filePath) {
        MDC.put("filePath", filePath);
        logger.info("Starting file processing");

        try {
            // Логирование начала операции с параметрами
            logger.debug("Processing file with parameters: path={}", filePath);

            // Логирование метрик производительности
            long startTime = System.currentTimeMillis();

            // Бизнес-логика
            // ...

            // Логирование завершения операции с метриками
            long endTime = System.currentTimeMillis();
            logger.info("File processing completed in {} ms", (endTime - startTime));

        } catch (Exception e) {
            // Логирование ошибок с полным стеком вызовов
            logger.error("Error processing file: {}", e.getMessage(), e);
            throw e;
        } finally {
            // Очистка контекста
            MDC.remove("filePath");
        }
    }
}
```

## 5. Специфические требования к логированию компонентов

### 5.1. Excel-to-JSON конвертер
- Логирование размера файла и выбранной стратегии обработки
- Логирование прогресса обработки (каждые 10% или 100,000 строк)
- Логирование времени выполнения каждого этапа конвертации
- Детальное логирование ошибок при обработке файлов

### 5.2. ETL-система
- Логирование начала и завершения каждого этапа ETL-процесса
- Логирование количества обработанных записей
- Логирование времени выполнения каждого этапа
- Логирование состояния базы данных до и после загрузки

### 5.3. Обработка ошибок
- Логирование всех исключений с полным стеком вызовов
- Логирование контекста, в котором произошла ошибка
- Классификация ошибок по типам (ошибки ввода-вывода, ошибки памяти, ошибки базы данных)

## 6. Мониторинг и анализ логов

### 6.1. Инструменты
- Просмотр логов через консоль и файлы
- Возможность интеграции с системами мониторинга (ELK, Grafana)
- Скрипты для анализа логов и генерации отчетов

### 6.2. Метрики
- Количество ошибок по типам
- Время выполнения операций
- Использование ресурсов (память, CPU)
- Количество обработанных файлов/записей

## 7. Компоненты с логированием

Следующие компоненты системы CATMEPIM должны использовать систему логирования:

### 7.1. Конвертеры
- **ExcelToJsonConverter** - основной конвертер Excel в JSON
- **StandardProcessingStrategy** - стандартная стратегия обработки Excel
- **SaxExcelToCSVStrategy** - стратегия обработки Excel с использованием SAX-парсера
- **CsvToJsonConverterWithLogging** - конвертер CSV в JSON с логированием
- **FastExcelToJsonConverterWithLogging** - быстрый конвертер Excel в JSON с логированием
- **FastExcelToCsvConverterWithLogging** - быстрый конвертер Excel в CSV с логированием

### 7.2. ETL-система
- **ETLSystem** - основной класс ETL-системы
- **DataProcessor** - класс обработки данных
- **DataLoader** - класс загрузки данных

### 7.3. База данных
- **DatabaseManager** - класс управления базой данных
- **QueryExecutor** - класс выполнения запросов к базе данных

## 8. Внедрение и тестирование

### 8.1. План внедрения
1. Добавление зависимостей в pom.xml
2. Создание конфигурационного файла log4j2.xml
3. Обновление кода для использования SLF4J
4. Тестирование логирования в различных сценариях
5. Настройка ротации и архивирования логов

### 8.2. Тестирование
- Проверка корректности логирования на всех уровнях
- Проверка ротации логов
- Проверка производительности системы логирования
- Проверка корректности логирования в многопоточной среде

## 8. Заключение

Внедрение комплексной системы логирования с использованием SLF4J и Log4j2 позволит значительно улучшить диагностику и мониторинг системы CATMEPIM. Это обеспечит более быстрое выявление и устранение проблем, а также повысит надежность системы в целом.

Использование SLF4J в качестве фасада с Log4j2 в качестве реализации обеспечит гибкость, производительность и совместимость с другими компонентами системы.
