# Contracts Repository

Это центральный репозиторий контрактов для проекта CATMEPIM. Он служит единым источником истины (Single Source of Truth) для всех контрактов, используемых в проекте.

## Структура репозитория

```
/contracts
  /README.md                # Общее описание и инструкции
  /OWNERSHIP.md             # Текущее распределение ответственности
  /interfaces               # Контракты интерфейсов
    /converter/             # Контракты для модуля Converter
    /deduplicator/          # Контракты для модуля Deduplicator
    /database-loader/       # Контракты для модуля DatabaseLoader
    /data-analyzer/         # Контракты для модуля DataAnalyzer
  /data                     # Контракты данных
    /json-schema/           # JSON-схемы для валидации данных
  /database                 # Контракты базы данных
```

## Гибридная стратегия управления контрактами

Проект CATMEPIM использует гибридную стратегию управления контрактами (#DECISION_ID_HYBRID_CONTRACTS), которая обеспечивает:

1. **Централизованный репозиторий контрактов (SSoT)** - все контракты хранятся в этой директории
2. **Локальные ссылки/копии в модулях** - для контекстной доступности
3. **Автоматическую синхронизацию** - для поддержания консистентности
4. **Валидацию в CI/CD** - для проверки соответствия кода контрактам

## Протокол работы с контрактами

1. **Перед началом работы**:
   - Ознакомьтесь с файлом OWNERSHIP.md для понимания текущего состояния контрактов
   - Проверьте Memory Bank (contracts.md) для получения общего контекста

2. **Начало работы с контрактом**:
   - Создайте ветку для работы (если требуется)
   - Обновите OWNERSHIP.md, указав себя владельцем
   - Обновите contracts.md в Memory Bank, изменив статус контракта

3. **Работа с контрактом**:
   - Следуйте стандартам документирования контрактов
   - Обеспечивайте синхронизацию контракта и кода
   - Документируйте все изменения в истории контракта

4. **Завершение работы**:
   - Создайте резюме изменений (HANDOVER.md)
   - Обновите OWNERSHIP.md и contracts.md в Memory Bank
   - Создайте PR или оставьте заметки для следующего ИИ

## Стандарты документирования контрактов

### Для Java-интерфейсов

```java
/**
 * Интерфейс для загрузки данных в базу данных.
 *
 * @pre dataStream != null
 * @post result != null
 * @post result.getTotalRecords() >= 0
 * @post result.getSuccessfulRecords() <= result.getTotalRecords()
 */
public interface DatabaseLoader {
    /**
     * Загружает данные в базу данных.
     *
     * @param dataStream Поток JSON-объектов для загрузки
     * @return Результат загрузки
     * @throws SQLException Если произошла ошибка при работе с базой данных
     *
     * @pre dataStream != null
     * @post result != null
     * @post result.getTotalRecords() >= 0
     * @post result.getSuccessfulRecords() <= result.getTotalRecords()
     */
    LoadResult loadData(Stream<JSONObject> dataStream) throws SQLException;
}
```

### Для JSON-схем

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Product",
  "type": "object",
  "required": ["Название", "Артикул"],
  "properties": {
    "Название": {
      "type": "string",
      "description": "Название товара"
    },
    "Артикул": {
      "type": "string",
      "description": "Артикул товара"
    }
  }
}
```

## Дополнительная информация

Для получения более подробной информации о контрактном программировании в проекте CATMEPIM см. следующие документы:

- [revised_detailed_contract_programming_analysis_report.md](../java_tools/revised_detailed_contract_programming_analysis_report.md)
- [contract_management_workflows.md](../Docs/contract_management_workflows.md)
- [contracts.md](../memory-bank/contracts.md) в Memory Bank
