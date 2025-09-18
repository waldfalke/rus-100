# TD-IMP-002: Извлечение и создание базовых токенов

## 0. Мета-данные

**Версия**: 1.0  
**Дата**: 2023-06-01  
**Статус**: Draft  
**Приоритет**: P0  
**Родительский контракт**: [TD-MS-001: Системный мастер-контракт внедрения дизайн-токенов](./TD-MS-001-Design-Token-System.md)  
**Зависимости**: [TD-IMP-001: Настройка инфраструктуры Style Dictionary](./TD-IMP-001-Infrastructure-Setup.md)  
**Исполнители**: UI-разработчик, Frontend-разработчик

---

## 1. Цель и назначение

Извлечь существующие стилевые значения из CSS-файлов проекта и создать структурированную систему базовых токенов в формате JSON, соответствующую UI-guidelines проекта. Токены станут фундаментом для создания семантических и компонентных токенов на последующих этапах.

## 2. Технические требования

### 2.1. Аудит существующих CSS-переменных

Провести аудит существующих CSS-переменных в файлах:
- `app/globals.css` 
- `styles/globals.css`
- `tailwind.config.ts`

Выполнить группировку и классификацию значений по следующим категориям:
- Цвета
- Типографика
- Отступы
- Тени
- Радиусы скругления
- Переходы и анимации

### 2.2. Создание JSON-файлов токенов

#### 2.2.1. Цвета (tokens/base/colors.json)

```json
{
  "color": {
    "primary": {
      "50": { "value": "#f0f9ff", "type": "color" },
      "100": { "value": "#e0f2fe", "type": "color" },
      "200": { "value": "#bae6fd", "type": "color" },
      "300": { "value": "#7dd3fc", "type": "color" },
      "400": { "value": "#38bdf8", "type": "color" },
      "500": { "value": "#0ea5e9", "type": "color" },
      "600": { "value": "#0284c7", "type": "color" },
      "700": { "value": "#0369a1", "type": "color" },
      "800": { "value": "#075985", "type": "color" },
      "900": { "value": "#0c4a6e", "type": "color" },
      "950": { "value": "#082f49", "type": "color" }
    },
    "neutral": {
      "50": { "value": "#f9fafb", "type": "color" },
      "100": { "value": "#f3f4f6", "type": "color" },
      "200": { "value": "#e5e7eb", "type": "color" },
      "300": { "value": "#d1d5db", "type": "color" },
      "400": { "value": "#9ca3af", "type": "color" },
      "500": { "value": "#6b7280", "type": "color" },
      "600": { "value": "#4b5563", "type": "color" },
      "700": { "value": "#374151", "type": "color" },
      "800": { "value": "#1f2937", "type": "color" },
      "900": { "value": "#111827", "type": "color" },
      "950": { "value": "#030712", "type": "color" }
    },
    "success": {
      "50": { "value": "#f0fdf4", "type": "color" },
      "500": { "value": "#22c55e", "type": "color" },
      "900": { "value": "#14532d", "type": "color" }
    },
    "error": {
      "50": { "value": "#fef2f2", "type": "color" },
      "500": { "value": "#ef4444", "type": "color" },
      "900": { "value": "#7f1d1d", "type": "color" }
    },
    "warning": {
      "50": { "value": "#fffbeb", "type": "color" },
      "500": { "value": "#f59e0b", "type": "color" },
      "900": { "value": "#78350f", "type": "color" }
    },
    "info": {
      "50": { "value": "#eff6ff", "type": "color" },
      "500": { "value": "#3b82f6", "type": "color" },
      "900": { "value": "#1e3a8a", "type": "color" }
    }
  }
}
```

#### 2.2.2. Типографика (tokens/base/typography.json)

```json
{
  "fontSize": {
    "xs": { "value": "0.75rem", "type": "fontSize" },
    "sm": { "value": "0.875rem", "type": "fontSize" },
    "base": { "value": "1rem", "type": "fontSize" },
    "lg": { "value": "1.125rem", "type": "fontSize" },
    "xl": { "value": "1.25rem", "type": "fontSize" },
    "2xl": { "value": "1.5rem", "type": "fontSize" },
    "3xl": { "value": "1.875rem", "type": "fontSize" },
    "4xl": { "value": "2.25rem", "type": "fontSize" },
    "5xl": { "value": "3rem", "type": "fontSize" },
    "6xl": { "value": "3.75rem", "type": "fontSize" }
  },
  "fontWeight": {
    "thin": { "value": "100", "type": "fontWeight" },
    "extralight": { "value": "200", "type": "fontWeight" },
    "light": { "value": "300", "type": "fontWeight" },
    "normal": { "value": "400", "type": "fontWeight" },
    "medium": { "value": "500", "type": "fontWeight" },
    "semibold": { "value": "600", "type": "fontWeight" },
    "bold": { "value": "700", "type": "fontWeight" },
    "extrabold": { "value": "800", "type": "fontWeight" },
    "black": { "value": "900", "type": "fontWeight" }
  },
  "lineHeight": {
    "none": { "value": "1", "type": "lineHeight" },
    "tight": { "value": "1.25", "type": "lineHeight" },
    "snug": { "value": "1.375", "type": "lineHeight" },
    "normal": { "value": "1.5", "type": "lineHeight" },
    "relaxed": { "value": "1.625", "type": "lineHeight" },
    "loose": { "value": "2", "type": "lineHeight" }
  },
  "letterSpacing": {
    "tighter": { "value": "-0.05em", "type": "letterSpacing" },
    "tight": { "value": "-0.025em", "type": "letterSpacing" },
    "normal": { "value": "0", "type": "letterSpacing" },
    "wide": { "value": "0.025em", "type": "letterSpacing" },
    "wider": { "value": "0.05em", "type": "letterSpacing" },
    "widest": { "value": "0.1em", "type": "letterSpacing" }
  },
  "fontFamily": {
    "sans": { 
      "value": "Arial, Helvetica, sans-serif", 
      "type": "fontFamily" 
    },
    "serif": { 
      "value": "Georgia, Times, Times New Roman, serif", 
      "type": "fontFamily" 
    },
    "mono": { 
      "value": "Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace", 
      "type": "fontFamily" 
    }
  }
}
```

#### 2.2.3. Отступы (tokens/base/spacing.json)

```json
{
  "spacing": {
    "0": { "value": "0", "type": "spacing" },
    "px": { "value": "1px", "type": "spacing" },
    "0.5": { "value": "0.125rem", "type": "spacing" },
    "1": { "value": "0.25rem", "type": "spacing" },
    "1.5": { "value": "0.375rem", "type": "spacing" },
    "2": { "value": "0.5rem", "type": "spacing" },
    "2.5": { "value": "0.625rem", "type": "spacing" },
    "3": { "value": "0.75rem", "type": "spacing" },
    "3.5": { "value": "0.875rem", "type": "spacing" },
    "4": { "value": "1rem", "type": "spacing" },
    "5": { "value": "1.25rem", "type": "spacing" },
    "6": { "value": "1.5rem", "type": "spacing" },
    "7": { "value": "1.75rem", "type": "spacing" },
    "8": { "value": "2rem", "type": "spacing" },
    "9": { "value": "2.25rem", "type": "spacing" },
    "10": { "value": "2.5rem", "type": "spacing" },
    "11": { "value": "2.75rem", "type": "spacing" },
    "12": { "value": "3rem", "type": "spacing" },
    "14": { "value": "3.5rem", "type": "spacing" },
    "16": { "value": "4rem", "type": "spacing" },
    "20": { "value": "5rem", "type": "spacing" },
    "24": { "value": "6rem", "type": "spacing" },
    "28": { "value": "7rem", "type": "spacing" },
    "32": { "value": "8rem", "type": "spacing" },
    "36": { "value": "9rem", "type": "spacing" },
    "40": { "value": "10rem", "type": "spacing" },
    "44": { "value": "11rem", "type": "spacing" },
    "48": { "value": "12rem", "type": "spacing" },
    "52": { "value": "13rem", "type": "spacing" },
    "56": { "value": "14rem", "type": "spacing" },
    "60": { "value": "15rem", "type": "spacing" },
    "64": { "value": "16rem", "type": "spacing" },
    "72": { "value": "18rem", "type": "spacing" },
    "80": { "value": "20rem", "type": "spacing" },
    "96": { "value": "24rem", "type": "spacing" }
  }
}
```

#### 2.2.4. Тени (tokens/base/shadows.json)

```json
{
  "shadow": {
    "sm": {
      "value": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      "type": "boxShadow"
    },
    "base": {
      "value": "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      "type": "boxShadow"
    },
    "md": {
      "value": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      "type": "boxShadow"
    },
    "lg": {
      "value": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      "type": "boxShadow"
    },
    "xl": {
      "value": "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      "type": "boxShadow"
    },
    "2xl": {
      "value": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      "type": "boxShadow"
    },
    "inner": {
      "value": "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
      "type": "boxShadow"
    },
    "none": {
      "value": "none",
      "type": "boxShadow"
    }
  }
}
```

#### 2.2.5. Радиусы скругления (tokens/base/radii.json)

```json
{
  "radius": {
    "none": { "value": "0", "type": "borderRadius" },
    "sm": { "value": "0.125rem", "type": "borderRadius" },
    "base": { "value": "0.25rem", "type": "borderRadius" },
    "md": { "value": "0.375rem", "type": "borderRadius" },
    "lg": { "value": "0.5rem", "type": "borderRadius" },
    "xl": { "value": "0.75rem", "type": "borderRadius" },
    "2xl": { "value": "1rem", "type": "borderRadius" },
    "3xl": { "value": "1.5rem", "type": "borderRadius" },
    "full": { "value": "9999px", "type": "borderRadius" }
  }
}
```

#### 2.2.6. Анимации (tokens/base/animations.json)

```json
{
  "animation": {
    "spin": {
      "value": "spin 1s linear infinite",
      "type": "animation"
    },
    "ping": {
      "value": "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
      "type": "animation"
    },
    "pulse": {
      "value": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      "type": "animation"
    },
    "bounce": {
      "value": "bounce 1s infinite",
      "type": "animation"
    }
  },
  "transitionProperty": {
    "none": {
      "value": "none",
      "type": "transitionProperty"
    },
    "all": {
      "value": "all",
      "type": "transitionProperty"
    },
    "default": {
      "value": "background-color, border-color, color, fill, stroke, opacity, box-shadow, transform",
      "type": "transitionProperty"
    },
    "colors": {
      "value": "background-color, border-color, color, fill, stroke",
      "type": "transitionProperty"
    },
    "opacity": {
      "value": "opacity",
      "type": "transitionProperty"
    },
    "shadow": {
      "value": "box-shadow",
      "type": "transitionProperty"
    },
    "transform": {
      "value": "transform",
      "type": "transitionProperty"
    }
  },
  "transitionDuration": {
    "75": {
      "value": "75ms",
      "type": "transitionDuration"
    },
    "100": {
      "value": "100ms",
      "type": "transitionDuration"
    },
    "150": {
      "value": "150ms",
      "type": "transitionDuration"
    },
    "200": {
      "value": "200ms",
      "type": "transitionDuration"
    },
    "300": {
      "value": "300ms",
      "type": "transitionDuration"
    },
    "500": {
      "value": "500ms",
      "type": "transitionDuration"
    },
    "700": {
      "value": "700ms",
      "type": "transitionDuration"
    },
    "1000": {
      "value": "1000ms",
      "type": "transitionDuration"
    }
  }
}
```

### 2.3. Создание семантических токенов для тем

#### 2.3.1. Светлая тема (tokens/themes/light.json)

```json
{
  "theme": {
    "background": {
      "default": { "value": "{color.neutral.50.value}", "type": "color" },
      "paper": { "value": "#ffffff", "type": "color" },
      "muted": { "value": "{color.neutral.100.value}", "type": "color" }
    },
    "text": {
      "primary": { "value": "{color.neutral.900.value}", "type": "color" },
      "secondary": { "value": "{color.neutral.700.value}", "type": "color" },
      "muted": { "value": "{color.neutral.500.value}", "type": "color" },
      "disabled": { "value": "{color.neutral.400.value}", "type": "color" }
    },
    "border": {
      "default": { "value": "{color.neutral.200.value}", "type": "color" },
      "focus": { "value": "{color.primary.400.value}", "type": "color" }
    },
    "action": {
      "primary": { "value": "{color.primary.600.value}", "type": "color" },
      "hover": { "value": "{color.primary.700.value}", "type": "color" },
      "disabled": { "value": "{color.neutral.300.value}", "type": "color" }
    },
    "status": {
      "success": { "value": "{color.success.500.value}", "type": "color" },
      "error": { "value": "{color.error.500.value}", "type": "color" },
      "warning": { "value": "{color.warning.500.value}", "type": "color" },
      "info": { "value": "{color.info.500.value}", "type": "color" }
    }
  }
}
```

#### 2.3.2. Темная тема (tokens/themes/dark.json)

```json
{
  "theme": {
    "background": {
      "default": { "value": "{color.neutral.950.value}", "type": "color" },
      "paper": { "value": "{color.neutral.900.value}", "type": "color" },
      "muted": { "value": "{color.neutral.800.value}", "type": "color" }
    },
    "text": {
      "primary": { "value": "{color.neutral.50.value}", "type": "color" },
      "secondary": { "value": "{color.neutral.200.value}", "type": "color" },
      "muted": { "value": "{color.neutral.400.value}", "type": "color" },
      "disabled": { "value": "{color.neutral.600.value}", "type": "color" }
    },
    "border": {
      "default": { "value": "{color.neutral.700.value}", "type": "color" },
      "focus": { "value": "{color.primary.400.value}", "type": "color" }
    },
    "action": {
      "primary": { "value": "{color.primary.400.value}", "type": "color" },
      "hover": { "value": "{color.primary.300.value}", "type": "color" },
      "disabled": { "value": "{color.neutral.700.value}", "type": "color" }
    },
    "status": {
      "success": { "value": "{color.success.500.value}", "type": "color" },
      "error": { "value": "{color.error.500.value}", "type": "color" },
      "warning": { "value": "{color.warning.500.value}", "type": "color" },
      "info": { "value": "{color.info.500.value}", "type": "color" }
    }
  }
}
```

### 2.4. Валидация соответствия UI-guidelines

Все создаваемые токены должны соответствовать руководящим принципам дизайна, определенным в `docs/UI-guidelines-v1.md`:

1. **Типографика**:
   - Ограничение количества шрифтовых размеров
   - Координация межстрочного интервала

2. **Пространственные отношения**:
   - Использование модульной сетки кратной 4 или 8
   - Соблюдение пропорций между отступами

3. **Цветовая палитра**:
   - Применение правила 60-30-10
   - Обеспечение доступности (контрастность)

4. **Иконография и визуальные элементы**:
   - Единая стилистика
   - Предпочтение векторной графики

5. **Макет и компоновка**:
   - Вертикальная и горизонтальная иерархия
   - Контентное разделение и фокус

## 3. Валидация и тестирование

### 3.1. Проверка структуры и формата

- Все JSON-файлы должны быть валидными и соответствовать требуемой структуре
- Значения токенов должны соответствовать соответствующим типам
- Ссылки между токенами (`{color.primary.500.value}`) должны быть корректными

### 3.2. Проверка сгенерированных файлов

После запуска `npm run build:tokens` проверить, что:
- CSS-переменные генерируются корректно
- Учитываются все зависимости между токенами
- Нет ошибок или предупреждений

### 3.3. Тестирование в контексте Tailwind

Проверить, что Tailwind может использовать сгенерированные токены через плагин, и классы вида `bg-theme-background-default` работают корректно.

## 4. Доставка результатов

1. Полный набор JSON-файлов с базовыми токенами в директории `/design-system/tokens/`
2. Документация с описанием токенов и примерами их использования
3. Демонстрация примеров использования токенов в CSS и через Tailwind

## 5. Критерии приемки

- ✅ Все базовые токены определены в соответствующих JSON-файлах
- ✅ Структура токенов соответствует требованиям Style Dictionary
- ✅ Токены валидны и могут быть трансформированы без ошибок
- ✅ Определены семантические значения для светлой и темной тем
- ✅ Токены соответствуют UI-guidelines проекта
- ✅ Сгенерированные CSS-переменные работают в проекте

## 6. Дополнительные рекомендации

- При извлечении значений из существующих CSS, уделить особое внимание обеспечению обратной совместимости
- Документировать любые отклонения от существующих стилей и причины этих отклонений
- Рассмотреть возможность создания скрипта для автоматического извлечения значений из существующего CSS
- При определении цветовой палитры убедиться, что все цвета соответствуют требованиям доступности WCAG 