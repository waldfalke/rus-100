# TD-IMP-004: Разработка компонентных токенов

## 0. Мета-данные

**Версия**: 1.0  
**Дата**: 2023-06-03  
**Статус**: Draft  
**Приоритет**: P0  
**Родительский контракт**: [TD-MS-001: Системный мастер-контракт внедрения дизайн-токенов](./TD-MS-001-Design-Token-System.md)  
**Зависимости**: [TD-IMP-003: Создание семантических токенов и настройка тем](./TD-IMP-003-Semantic-Tokens.md)  
**Исполнители**: UI-разработчик, Frontend-разработчик

---

## 1. Цель и назначение

Разработать компонентные токены на основе семантических токенов, чтобы обеспечить стандартизированный дизайн для всех компонентов интерфейса. Компонентные токены должны быть конкретными для каждого компонента, но при этом использовать существующие семантические токены для обеспечения согласованности дизайна.

## 2. Технические требования

### 2.1. Разработка компонентных токенов

Компонентные токены должны быть разработаны для следующих ключевых компонентов:

1. **Элементы управления**:
   - Кнопки
   - Поля ввода
   - Чекбоксы и радиокнопки
   - Переключатели
   - Селекты и дропдауны

2. **Контейнеры и структурные элементы**:
   - Карточки
   - Модальные окна
   - Аккордеоны
   - Табы
   - Алерты и уведомления

3. **Навигационные элементы**:
   - Меню
   - Хлебные крошки
   - Пагинация
   - Вкладки

Компонентные токены должны ссылаться на семантические токены и не содержать абсолютных значений, за исключением случаев, когда значение уникально для конкретного компонента.

### 2.2. Структура файлов

```
design-system/
  tokens/
    components/
      button.json
      input.json
      card.json
      checkbox.json
      switch.json
      modal.json
      menu.json
      ...
```

### 2.3. Примеры компонентных токенов

#### 2.3.1. Кнопки (tokens/components/button.json)

```json
{
  "component": {
    "button": {
      "default": {
        "backgroundColor": { "value": "{theme.color.primary.default}", "type": "color" },
        "textColor": { "value": "{theme.color.primary.foreground}", "type": "color" },
        "padding": {
          "x": { "value": "{theme.space.component.md}", "type": "spacing" },
          "y": { "value": "{theme.space.component.sm}", "type": "spacing" }
        },
        "borderRadius": { "value": "{radius.base}", "type": "borderRadius" },
        "borderWidth": { "value": "0", "type": "borderWidth" },
        "fontSize": { "value": "{theme.typography.body.default.fontSize}", "type": "fontSize" },
        "fontWeight": { "value": "{theme.typography.body.default.fontWeight}", "type": "fontWeight" },
        "hover": {
          "backgroundColor": { "value": "{theme.color.primary.hover}", "type": "color" }
        },
        "focus": {
          "borderColor": { "value": "{theme.color.border.focus}", "type": "color" },
          "borderWidth": { "value": "2px", "type": "borderWidth" }
        },
        "disabled": {
          "backgroundColor": { "value": "{theme.color.background.disabled}", "type": "color" },
          "textColor": { "value": "{theme.color.foreground.disabled}", "type": "color" }
        }
      },
      "secondary": {
        "backgroundColor": { "value": "transparent", "type": "color" },
        "textColor": { "value": "{theme.color.primary.default}", "type": "color" },
        "borderColor": { "value": "{theme.color.primary.default}", "type": "color" },
        "borderWidth": { "value": "1px", "type": "borderWidth" },
        "hover": {
          "backgroundColor": { "value": "{theme.color.primary.muted}", "type": "color" }
        }
      },
      "ghost": {
        "backgroundColor": { "value": "transparent", "type": "color" },
        "textColor": { "value": "{theme.color.foreground.default}", "type": "color" },
        "hover": {
          "backgroundColor": { "value": "{theme.color.background.subtle}", "type": "color" }
        }
      },
      "destructive": {
        "backgroundColor": { "value": "{theme.color.error.default}", "type": "color" },
        "textColor": { "value": "{theme.color.error.foreground}", "type": "color" },
        "hover": {
          "backgroundColor": { "value": "darken({theme.color.error.default}, 10%)", "type": "color" }
        }
      },
      "sizes": {
        "sm": {
          "height": { "value": "{theme.size.input.sm}", "type": "sizing" },
          "padding": {
            "x": { "value": "{theme.space.component.sm}", "type": "spacing" }
          },
          "fontSize": { "value": "{theme.typography.body.small.fontSize}", "type": "fontSize" }
        },
        "md": {
          "height": { "value": "{theme.size.input.height}", "type": "sizing" },
          "padding": {
            "x": { "value": "{theme.space.component.md}", "type": "spacing" }
          },
          "fontSize": { "value": "{theme.typography.body.default.fontSize}", "type": "fontSize" }
        },
        "lg": {
          "height": { "value": "{theme.size.input.lg}", "type": "sizing" },
          "padding": {
            "x": { "value": "{theme.space.component.lg}", "type": "spacing" }
          },
          "fontSize": { "value": "{theme.typography.body.large.fontSize}", "type": "fontSize" }
        }
      }
    }
  }
}
```

#### 2.3.2. Карточки (tokens/components/card.json)

```json
{
  "component": {
    "card": {
      "default": {
        "backgroundColor": { "value": "{theme.color.background.card}", "type": "color" },
        "textColor": { "value": "{theme.color.foreground.default}", "type": "color" },
        "borderRadius": { "value": "{radius.lg}", "type": "borderRadius" },
        "borderWidth": { "value": "1px", "type": "borderWidth" },
        "borderColor": { "value": "{theme.color.border.default}", "type": "color" },
        "padding": { "value": "{theme.space.component.lg}", "type": "spacing" },
        "elevation": { "value": "{theme.elevation.low}", "type": "boxShadow" }
      },
      "hover": {
        "elevation": { "value": "{theme.elevation.medium}", "type": "boxShadow" }
      },
      "interactive": {
        "backgroundColor": { "value": "{theme.color.background.card}", "type": "color" },
        "hover": {
          "backgroundColor": { "value": "{theme.color.background.subtle}", "type": "color" },
          "borderColor": { "value": "{theme.color.border.strong}", "type": "color" }
        }
      },
      "selected": {
        "borderColor": { "value": "{theme.color.primary.default}", "type": "color" },
        "borderWidth": { "value": "2px", "type": "borderWidth" }
      }
    }
  }
}
```

#### 2.3.3. Поля ввода (tokens/components/input.json)

```json
{
  "component": {
    "input": {
      "default": {
        "backgroundColor": { "value": "{theme.color.background.card}", "type": "color" },
        "textColor": { "value": "{theme.color.foreground.default}", "type": "color" },
        "placeholderColor": { "value": "{theme.color.foreground.subtle}", "type": "color" },
        "borderRadius": { "value": "{radius.base}", "type": "borderRadius" },
        "borderWidth": { "value": "1px", "type": "borderWidth" },
        "borderColor": { "value": "{theme.color.border.default}", "type": "color" },
        "padding": {
          "x": { "value": "{theme.space.component.md}", "type": "spacing" },
          "y": { "value": "{theme.space.component.sm}", "type": "spacing" }
        },
        "fontSize": { "value": "{theme.typography.body.default.fontSize}", "type": "fontSize" },
        "lineHeight": { "value": "{theme.typography.body.default.lineHeight}", "type": "lineHeight" },
        "height": { "value": "{theme.size.input.height}", "type": "sizing" }
      },
      "hover": {
        "borderColor": { "value": "{theme.color.border.strong}", "type": "color" }
      },
      "focus": {
        "borderColor": { "value": "{theme.color.primary.default}", "type": "color" },
        "borderWidth": { "value": "2px", "type": "borderWidth" },
        "boxShadow": { "value": "0 0 0 1px {theme.color.primary.default}", "type": "boxShadow" }
      },
      "disabled": {
        "backgroundColor": { "value": "{theme.color.background.disabled}", "type": "color" },
        "textColor": { "value": "{theme.color.foreground.disabled}", "type": "color" },
        "borderColor": { "value": "{theme.color.border.default}", "type": "color" }
      },
      "error": {
        "borderColor": { "value": "{theme.color.error.default}", "type": "color" },
        "focus": {
          "boxShadow": { "value": "0 0 0 1px {theme.color.error.default}", "type": "boxShadow" }
        }
      },
      "success": {
        "borderColor": { "value": "{theme.color.success.default}", "type": "color" }
      },
      "sizes": {
        "sm": {
          "height": { "value": "{theme.size.input.sm}", "type": "sizing" },
          "fontSize": { "value": "{theme.typography.body.small.fontSize}", "type": "fontSize" },
          "padding": {
            "x": { "value": "{theme.space.component.sm}", "type": "spacing" }
          }
        },
        "md": {
          "height": { "value": "{theme.size.input.height}", "type": "sizing" },
          "fontSize": { "value": "{theme.typography.body.default.fontSize}", "type": "fontSize" },
          "padding": {
            "x": { "value": "{theme.space.component.md}", "type": "spacing" }
          }
        },
        "lg": {
          "height": { "value": "{theme.size.input.lg}", "type": "sizing" },
          "fontSize": { "value": "{theme.typography.body.large.fontSize}", "type": "fontSize" },
          "padding": {
            "x": { "value": "{theme.space.component.lg}", "type": "spacing" }
          }
        }
      }
    }
  }
}
```

## 3. Процесс внедрения

### 3.1. Этапы разработки компонентных токенов

1. **Анализ компонентов**:
   - Инвентаризация существующих компонентов
   - Выявление стилевых паттернов в компонентах
   - Определение свойств, требующих токенизации

2. **Разработка компонентных токенов**:
   - Создание JSON определений для компонентных токенов
   - Привязка компонентных токенов к семантическим
   - Верификация правильности ссылок

3. **Тестирование и валидация**:
   - Генерация CSS с компонентными токенами
   - Визуальная проверка компонентов с новыми токенами
   - Тестирование в различных темах

4. **Интеграция с компонентами**:
   - Обновление стилей компонентов с использованием токенов
   - Разработка примеров использования
   - Документирование в Storybook

### 3.2. Приоритеты и порядок реализации

1. **Высокий приоритет**:
   - Кнопки (button.json)
   - Поля ввода (input.json)
   - Карточки (card.json)

2. **Средний приоритет**:
   - Чекбоксы и радиокнопки (checkbox.json, radio.json)
   - Селекты (select.json)
   - Модальные окна (modal.json)

3. **Низкий приоритет**:
   - Табы (tabs.json)
   - Меню (menu.json)
   - Прочие компоненты

## 4. Ожидаемые результаты

1. **Набор компонентных токенов**:
   - JSON определения для всех основных компонентов
   - CSS переменные, генерируемые из компонентных токенов
   - Типы TypeScript для компонентных токенов

2. **Примеры использования**:
   - Стайлгайд с примерами компонентов в Storybook
   - Рекомендации по использованию токенов
   - Демо-страница с компонентами в различных темах

3. **Документация**:
   - Подробное описание компонентных токенов
   - Инструкции по расширению и кастомизации
   - Примеры интеграции с CSS и Tailwind

## 5. Зависимости и риски

### 5.1. Зависимости

1. **Технические зависимости**:
   - Базовые и семантические токены
   - Style Dictionary для сборки
   - Компоненты для визуализации

2. **Процессные зависимости**:
   - Одобрение дизайнерами компонентных токенов
   - Координация с командой, разрабатывающей компоненты

### 5.2. Риски

| Риск | Воздействие | Вероятность | Стратегия смягчения |
|------|-------------|-------------|---------------------|
| Недостаточный охват всех вариаций компонентов | Высокое | Средняя | Анализ всех существующих компонентов с учетом крайних случаев |
| Несоответствие компонентных токенов дизайн-макетам | Высокое | Средняя | Регулярные проверки с дизайнерами, визуальное сравнение |
| Сложности при интеграции со сторонними компонентами | Среднее | Высокая | Разработка адаптеров для сторонних компонентов, документирование подходов |
| Избыточная сложность системы токенов | Среднее | Средняя | Следование принципу "минимально необходимого количества токенов", регулярный рефакторинг |

## 6. Заключение

Разработка компонентных токенов является ключевым шагом в построении полноценной дизайн-системы, так как именно на уровне компонентов происходит фактическое применение токенов в пользовательском интерфейсе. После завершения этого контракта проект получит:

- Полный набор стандартизированных компонентных токенов
- Единообразный внешний вид компонентов во всем приложении
- Возможность гибкой кастомизации компонентов через токены

Это значительно упростит разработку UI, обеспечит визуальную консистентность и ускорит процесс внедрения новых компонентов. 