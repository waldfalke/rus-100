# Контракт: DatabaseConfig

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
Класс DatabaseConfig определяет контракт для конфигурации подключения к базе данных. Он содержит настройки для подключения к различным СУБД, параметры пула соединений и другие настройки, влияющие на процесс работы с базой данных.

## Интерфейс
```java
/**
 * Класс для конфигурации подключения к базе данных.
 */
public class DatabaseConfig {
    /**
     * Тип СУБД.
     */
    public enum DatabaseType {
        /** PostgreSQL */
        POSTGRESQL,
        /** MySQL */
        MYSQL,
        /** SQLite */
        SQLITE,
        /** Oracle */
        ORACLE,
        /** Microsoft SQL Server */
        SQLSERVER
    }

    // Поля конфигурации
    private final DatabaseType databaseType;
    private final String host;
    private final int port;
    private final String database;
    private final String username;
    private final String password;
    private final String schema;
    private final Map<String, String> additionalProperties;
    private final int maxPoolSize;
    private final int minPoolSize;
    private final long connectionTimeout;
    private final long idleTimeout;
    private final long maxLifetime;
    private final boolean autoCommit;
    private final String initScript;

    // Геттеры и конструктор

    /**
     * Возвращает URL для подключения к базе данных.
     *
     * @return URL для подключения к базе данных
     */
    public String getUrl() {
        switch (databaseType) {
            case POSTGRESQL:
                return String.format("jdbc:postgresql://%s:%d/%s", host, port, database);
            case MYSQL:
                return String.format("jdbc:mysql://%s:%d/%s", host, port, database);
            case SQLITE:
                return String.format("jdbc:sqlite:%s", database);
            case ORACLE:
                return String.format("jdbc:oracle:thin:@%s:%d:%s", host, port, database);
            case SQLSERVER:
                return String.format("jdbc:sqlserver://%s:%d;databaseName=%s", host, port, database);
            default:
                throw new IllegalStateException("Unsupported database type: " + databaseType);
        }
    }

    /**
     * Возвращает драйвер для подключения к базе данных.
     *
     * @return Имя класса драйвера
     */
    public String getDriverClassName() {
        switch (databaseType) {
            case POSTGRESQL:
                return "org.postgresql.Driver";
            case MYSQL:
                return "com.mysql.cj.jdbc.Driver";
            case SQLITE:
                return "org.sqlite.JDBC";
            case ORACLE:
                return "oracle.jdbc.OracleDriver";
            case SQLSERVER:
                return "com.microsoft.sqlserver.jdbc.SQLServerDriver";
            default:
                throw new IllegalStateException("Unsupported database type: " + databaseType);
        }
    }
}
```

## Предусловия и инварианты

### Предусловия для конструктора
- databaseType != null
- host != null (для всех типов, кроме SQLITE)
- port > 0 (для всех типов, кроме SQLITE)
- database != null
- username != null (для всех типов, кроме SQLITE)
- password != null (для всех типов, кроме SQLITE)
- additionalProperties != null
- maxPoolSize > 0
- minPoolSize >= 0
- minPoolSize <= maxPoolSize
- connectionTimeout > 0
- idleTimeout > 0
- maxLifetime > 0

### Инварианты
- URL для подключения должен быть корректным для выбранного типа СУБД
- Драйвер для подключения должен соответствовать выбранному типу СУБД
- Дополнительные свойства не должны конфликтовать с основными параметрами подключения

## Примеры использования
```java
// Пример создания конфигурации для PostgreSQL
DatabaseConfig postgresConfig = DatabaseConfig.builder()
    .databaseType(DatabaseType.POSTGRESQL)
    .host("localhost")
    .port(5432)
    .database("catmepim")
    .username("postgres")
    .password("postgres")
    .schema("public")
    .maxPoolSize(10)
    .minPoolSize(2)
    .connectionTimeout(30000)
    .idleTimeout(600000)
    .maxLifetime(1800000)
    .autoCommit(false)
    .initScript("init.sql")
    .build();

// Пример создания конфигурации для SQLite
DatabaseConfig sqliteConfig = DatabaseConfig.builder()
    .databaseType(DatabaseType.SQLITE)
    .database("catmepim.db")
    .maxPoolSize(5)
    .connectionTimeout(10000)
    .autoCommit(true)
    .build();

// Пример использования конфигурации для создания загрузчика
DatabaseLoader loader = new PostgreSQLLoader(postgresConfig);
```

## Реализации
- **PostgreSQLConfig**: расширение базовой конфигурации с учетом специфики PostgreSQL
- **MySQLConfig**: расширение базовой конфигурации с учетом специфики MySQL
- **SQLiteConfig**: расширение базовой конфигурации с учетом специфики SQLite

## Связанные контракты
- [DatabaseLoader Interface Contract](./contract.md)
- [DatabaseLoader Architecture Contract](../../DatabaseLoader-Architecture-Contract.md)
