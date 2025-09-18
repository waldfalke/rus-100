# Прототип определений токенов для компонентов страницы аккаунта

Этот документ содержит прототипы определений для дизайн-токенов, которые будут использоваться для стилизации компонентов на странице аккаунта. Определения основаны на аудите существующих стилей и UI-guidelines-v1.

## Структура токенов

Токены организованы в трехуровневую структуру:
1. **Базовые токены** — абсолютные значения без смыслового контекста
2. **Семантические токены** — значения со смысловым контекстом, ссылающиеся на базовые токены
3. **Компонентные токены** — специфичные для компонентов значения, ссылающиеся на семантические токены

## Базовые токены

### Цвета

```json
{
  "color": {
    "neutral": {
      "50": { "value": "hsl(0, 0%, 98%)" },
      "100": { "value": "hsl(0, 0%, 96%)" },
      "200": { "value": "hsl(0, 0%, 90%)" },
      "300": { "value": "hsl(0, 0%, 83%)" },
      "400": { "value": "hsl(0, 0%, 64%)" },
      "500": { "value": "hsl(0, 0%, 45%)" },
      "600": { "value": "hsl(0, 0%, 32%)" },
      "700": { "value": "hsl(0, 0%, 25%)" },
      "800": { "value": "hsl(0, 0%, 15%)" },
      "900": { "value": "hsl(0, 0%, 9%)" }
    },
    "primary": {
      "50": { "value": "hsl(173, 100%, 95%)" },
      "100": { "value": "hsl(173, 100%, 85%)" },
      "200": { "value": "hsl(173, 100%, 75%)" },
      "300": { "value": "hsl(173, 100%, 60%)" },
      "400": { "value": "hsl(173, 100%, 45%)" },
      "500": { "value": "hsl(173, 100%, 28%)" },
      "600": { "value": "hsl(173, 100%, 22%)" },
      "700": { "value": "hsl(173, 100%, 18%)" },
      "800": { "value": "hsl(173, 100%, 14%)" },
      "900": { "value": "hsl(173, 100%, 10%)" }
    },
    "destructive": {
      "50": { "value": "hsl(0, 100%, 95%)" },
      "100": { "value": "hsl(0, 100%, 87%)" },
      "200": { "value": "hsl(0, 92%, 80%)" },
      "300": { "value": "hsl(0, 91%, 71%)" },
      "500": { "value": "hsl(0, 84%, 60%)" },
      "600": { "value": "hsl(0, 72%, 51%)" },
      "700": { "value": "hsl(0, 74%, 42%)" },
      "800": { "value": "hsl(0, 70%, 35%)" },
      "900": { "value": "hsl(0, 63%, 31%)" }
    }
  }
}
```

### Типографика

```json
{
  "font": {
    "family": {
      "base": { "value": "Arial, Helvetica, sans-serif" },
      "heading": { "value": "Arial, Helvetica, sans-serif" }
    },
    "weight": {
      "regular": { "value": "400" },
      "medium": { "value": "500" },
      "semibold": { "value": "600" },
      "bold": { "value": "700" }
    },
    "size": {
      "xs": { "value": "0.75rem" },
      "sm": { "value": "0.875rem" },
      "base": { "value": "1rem" },
      "lg": { "value": "1.125rem" },
      "xl": { "value": "1.25rem" },
      "2xl": { "value": "1.5rem" },
      "3xl": { "value": "1.875rem" },
      "4xl": { "value": "2.25rem" },
      "5xl": { "value": "3rem" }
    },
    "lineHeight": {
      "none": { "value": "1" },
      "tight": { "value": "1.25" },
      "snug": { "value": "1.375" },
      "normal": { "value": "1.5" },
      "relaxed": { "value": "1.625" },
      "loose": { "value": "2" }
    }
  }
}
```

### Отступы

```json
{
  "spacing": {
    "0": { "value": "0" },
    "1": { "value": "0.25rem" },
    "2": { "value": "0.5rem" },
    "3": { "value": "0.75rem" },
    "4": { "value": "1rem" },
    "5": { "value": "1.25rem" },
    "6": { "value": "1.5rem" },
    "8": { "value": "2rem" },
    "10": { "value": "2.5rem" },
    "12": { "value": "3rem" },
    "16": { "value": "4rem" },
    "20": { "value": "5rem" },
    "24": { "value": "6rem" }
  }
}
```

### Размеры

```json
{
  "size": {
    "0": { "value": "0" },
    "xs": { "value": "20rem" },
    "sm": { "value": "24rem" },
    "md": { "value": "28rem" },
    "lg": { "value": "32rem" },
    "xl": { "value": "36rem" },
    "2xl": { "value": "42rem" },
    "3xl": { "value": "48rem" },
    "4xl": { "value": "56rem" },
    "5xl": { "value": "64rem" },
    "6xl": { "value": "72rem" },
    "full": { "value": "100%" }
  }
}
```

### Радиусы

```json
{
  "radius": {
    "none": { "value": "0" },
    "sm": { "value": "0.125rem" },
    "base": { "value": "0.5rem" },
    "md": { "value": "0.375rem" },
    "lg": { "value": "0.5rem" },
    "xl": { "value": "0.75rem" },
    "2xl": { "value": "1rem" },
    "full": { "value": "9999px" }
  }
}
```

### Тени

```json
{
  "shadow": {
    "sm": { "value": "0 1px 2px 0 rgba(0, 0, 0, 0.05)" },
    "base": { "value": "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)" },
    "md": { "value": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" },
    "lg": { "value": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" },
    "xl": { "value": "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" },
    "2xl": { "value": "0 25px 50px -12px rgba(0, 0, 0, 0.25)" },
    "inner": { "value": "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)" },
    "none": { "value": "none" }
  }
}
```

### Брейкпоинты

```json
{
  "breakpoint": {
    "xs": { "value": "0px" },
    "sm": { "value": "640px" },
    "md": { "value": "768px" },
    "lg": { "value": "1024px" },
    "xl": { "value": "1280px" },
    "2xl": { "value": "1536px" }
  }
}
```

## Семантические токены

### Цвета семантические

```json
{
  "color": {
    "background": {
      "default": { "value": "{color.neutral.50}" },
      "muted": { "value": "{color.neutral.100}" },
      "subtle": { "value": "{color.neutral.200}" },
      "card": { "value": "white" },
      "disabled": { "value": "{color.neutral.200}" }
    },
    "surface": {
      "default": { "value": "white" },
      "muted": { "value": "{color.neutral.50}" },
      "accent": { "value": "{color.primary.50}" },
      "card": { "value": "white" },
      "popover": { "value": "white" },
      "sidebar": { "value": "{color.neutral.50}" }
    },
    "text": {
      "primary": { "value": "{color.neutral.900}" },
      "secondary": { "value": "{color.neutral.700}" },
      "muted": { "value": "{color.neutral.500}" },
      "disabled": { "value": "{color.neutral.400}" },
      "onPrimary": { "value": "white" },
      "onSecondary": { "value": "{color.neutral.900}" },
      "onAccent": { "value": "{color.neutral.900}" },
      "onError": { "value": "white" },
      "onSidebar": { "value": "{color.neutral.700}" }
    },
    "border": {
      "default": { "value": "{color.neutral.200}" },
      "muted": { "value": "{color.neutral.100}" },
      "active": { "value": "{color.primary.500}" },
      "focus": { "value": "{color.primary.500}" },
      "input": { "value": "{color.neutral.200}" },
      "error": { "value": "{color.destructive.500}" },
      "sidebar": { "value": "{color.neutral.100}" }
    },
    "action": {
      "primary": { "value": "{color.primary.500}" },
      "primaryHover": { "value": "{color.primary.600}" },
      "primaryActive": { "value": "{color.primary.700}" },
      "secondary": { "value": "{color.neutral.200}" },
      "secondaryHover": { "value": "{color.neutral.300}" },
      "secondaryActive": { "value": "{color.neutral.400}" },
      "destructive": { "value": "{color.destructive.500}" },
      "destructiveHover": { "value": "{color.destructive.600}" },
      "destructiveActive": { "value": "{color.destructive.700}" }
    }
  }
}
```

### Типографика семантическая

```json
{
  "typography": {
    "heading": {
      "1": {
        "fontFamily": { "value": "{font.family.heading}" },
        "fontWeight": { "value": "{font.weight.bold}" },
        "fontSize": { "value": "{font.size.4xl}" },
        "lineHeight": { "value": "{font.lineHeight.tight}" }
      },
      "2": {
        "fontFamily": { "value": "{font.family.heading}" },
        "fontWeight": { "value": "{font.weight.bold}" },
        "fontSize": { "value": "{font.size.3xl}" },
        "lineHeight": { "value": "{font.lineHeight.tight}" }
      },
      "3": {
        "fontFamily": { "value": "{font.family.heading}" },
        "fontWeight": { "value": "{font.weight.semibold}" },
        "fontSize": { "value": "{font.size.2xl}" },
        "lineHeight": { "value": "{font.lineHeight.tight}" }
      },
      "4": {
        "fontFamily": { "value": "{font.family.heading}" },
        "fontWeight": { "value": "{font.weight.semibold}" },
        "fontSize": { "value": "{font.size.xl}" },
        "lineHeight": { "value": "{font.lineHeight.tight}" }
      }
    },
    "text": {
      "xs": {
        "fontFamily": { "value": "{font.family.base}" },
        "fontWeight": { "value": "{font.weight.regular}" },
        "fontSize": { "value": "{font.size.xs}" },
        "lineHeight": { "value": "{font.lineHeight.normal}" }
      },
      "sm": {
        "fontFamily": { "value": "{font.family.base}" },
        "fontWeight": { "value": "{font.weight.regular}" },
        "fontSize": { "value": "{font.size.sm}" },
        "lineHeight": { "value": "{font.lineHeight.normal}" }
      },
      "base": {
        "fontFamily": { "value": "{font.family.base}" },
        "fontWeight": { "value": "{font.weight.regular}" },
        "fontSize": { "value": "{font.size.base}" },
        "lineHeight": { "value": "{font.lineHeight.normal}" }
      },
      "lg": {
        "fontFamily": { "value": "{font.family.base}" },
        "fontWeight": { "value": "{font.weight.regular}" },
        "fontSize": { "value": "{font.size.lg}" },
        "lineHeight": { "value": "{font.lineHeight.normal}" }
      }
    },
    "label": {
      "sm": {
        "fontFamily": { "value": "{font.family.base}" },
        "fontWeight": { "value": "{font.weight.medium}" },
        "fontSize": { "value": "{font.size.sm}" },
        "lineHeight": { "value": "{font.lineHeight.normal}" }
      },
      "base": {
        "fontFamily": { "value": "{font.family.base}" },
        "fontWeight": { "value": "{font.weight.medium}" },
        "fontSize": { "value": "{font.size.base}" },
        "lineHeight": { "value": "{font.lineHeight.normal}" }
      }
    }
  }
}
```

### Отступы семантические

```json
{
  "spacing": {
    "page": {
      "x": {
        "sm": { "value": "{spacing.4}" },
        "md": { "value": "{spacing.6}" }
      },
      "y": { "value": "{spacing.6}" }
    },
    "section": {
      "gap": { "value": "{spacing.6}" },
      "padding": { "value": "{spacing.4}" }
    },
    "component": {
      "padding": {
        "sm": { "value": "{spacing.3}" },
        "base": { "value": "{spacing.4}" },
        "lg": { "value": "{spacing.6}" }
      },
      "gap": {
        "sm": { "value": "{spacing.2}" },
        "base": { "value": "{spacing.4}" },
        "lg": { "value": "{spacing.6}" }
      }
    }
  }
}
```

### Размеры семантические

```json
{
  "size": {
    "container": {
      "sm": { "value": "{size.sm}" },
      "md": { "value": "{size.md}" },
      "lg": { "value": "{size.lg}" },
      "xl": { "value": "{size.xl}" },
      "2xl": { "value": "{size.2xl}" },
      "3xl": { "value": "{size.3xl}" },
      "4xl": { "value": "{size.4xl}" },
      "5xl": { "value": "{size.5xl}" },
      "6xl": { "value": "{size.6xl}" }
    },
    "component": {
      "xs": { "value": "16rem" },
      "sm": { "value": "20rem" },
      "md": { "value": "24rem" },
      "lg": { "value": "28rem" },
      "xl": { "value": "32rem" },
      "2xl": { "value": "36rem" },
      "3xl": { "value": "42rem" },
      "4xl": { "value": "48rem" }
    }
  }
}
```

## Компонентные токены

### Карточка профиля (ProfileCard)

```json
{
  "component": {
    "profileCard": {
      "background": { "value": "{color.surface.default}" },
      "borderColor": { "value": "{color.border.default}" },
      "borderRadius": { "value": "{radius.base}" },
      "shadow": { "value": "{shadow.sm}" },
      "padding": { "value": "{spacing.component.padding.base}" },
      "gap": { "value": "{spacing.component.gap.base}" },
      "header": {
        "typography": { "value": "{typography.heading.3}" },
        "color": { "value": "{color.text.primary}" },
        "marginBottom": { "value": "{spacing.4}" }
      },
      "field": {
        "label": {
          "typography": { "value": "{typography.label.sm}" },
          "color": { "value": "{color.text.muted}" }
        },
        "value": {
          "typography": { "value": "{typography.text.base}" },
          "color": { "value": "{color.text.primary}" }
        },
        "gap": { "value": "{spacing.1}" }
      },
      "button": {
        "background": { "value": "{color.action.primary}" },
        "backgroundHover": { "value": "{color.action.primaryHover}" },
        "color": { "value": "{color.text.onPrimary}" },
        "borderRadius": { "value": "{radius.base}" },
        "paddingX": { "value": "{spacing.4}" },
        "paddingY": { "value": "{spacing.2}" },
        "typography": { "value": "{typography.text.sm}" }
      }
    }
  }
}
```

### Карточка тарифа (TariffPaymentCard)

```json
{
  "component": {
    "tariffCard": {
      "background": { "value": "{color.surface.default}" },
      "borderColor": { "value": "{color.border.default}" },
      "borderRadius": { "value": "{radius.base}" },
      "shadow": { "value": "{shadow.sm}" },
      "padding": { "value": "{spacing.component.padding.base}" },
      "gap": { "value": "{spacing.component.gap.base}" },
      "header": {
        "typography": { "value": "{typography.heading.3}" },
        "color": { "value": "{color.text.primary}" },
        "marginBottom": { "value": "{spacing.4}" }
      },
      "tariff": {
        "name": {
          "typography": { "value": "{typography.text.lg}" },
          "color": { "value": "{color.text.primary}" }
        },
        "cost": {
          "typography": { "value": "{typography.text.base}" },
          "color": { "value": "{color.text.secondary}" }
        },
        "limit": {
          "typography": { "value": "{typography.text.sm}" },
          "color": { "value": "{color.text.muted}" }
        }
      },
      "field": {
        "label": {
          "typography": { "value": "{typography.label.sm}" },
          "color": { "value": "{color.text.muted}" }
        },
        "value": {
          "typography": { "value": "{typography.text.base}" },
          "color": { "value": "{color.text.primary}" }
        },
        "gap": { "value": "{spacing.1}" }
      },
      "button": {
        "primary": {
          "background": { "value": "{color.action.primary}" },
          "backgroundHover": { "value": "{color.action.primaryHover}" },
          "color": { "value": "{color.text.onPrimary}" },
          "borderRadius": { "value": "{radius.base}" },
          "paddingX": { "value": "{spacing.4}" },
          "paddingY": { "value": "{spacing.2}" },
          "typography": { "value": "{typography.text.sm}" }
        },
        "secondary": {
          "background": { "value": "{color.action.secondary}" },
          "backgroundHover": { "value": "{color.action.secondaryHover}" },
          "color": { "value": "{color.text.primary}" },
          "borderRadius": { "value": "{radius.base}" },
          "paddingX": { "value": "{spacing.4}" },
          "paddingY": { "value": "{spacing.2}" },
          "typography": { "value": "{typography.text.sm}" }
        }
      }
    }
  }
}
```

### Модальное окно (EditProfileModal)

```json
{
  "component": {
    "modal": {
      "overlay": {
        "background": { "value": "rgba(0, 0, 0, 0.5)" }
      },
      "container": {
        "background": { "value": "{color.surface.default}" },
        "borderRadius": { "value": "{radius.base}" },
        "shadow": { "value": "{shadow.xl}" },
        "width": { "value": "{size.component.md}" },
        "maxWidth": { "value": "calc(100vw - 2rem)" }
      },
      "header": {
        "typography": { "value": "{typography.heading.3}" },
        "color": { "value": "{color.text.primary}" },
        "paddingX": { "value": "{spacing.6}" },
        "paddingY": { "value": "{spacing.4}" },
        "borderBottom": { "value": "1px solid {color.border.default}" }
      },
      "body": {
        "padding": { "value": "{spacing.6}" },
        "gap": { "value": "{spacing.4}" }
      },
      "footer": {
        "paddingX": { "value": "{spacing.6}" },
        "paddingY": { "value": "{spacing.4}" },
        "borderTop": { "value": "1px solid {color.border.default}" },
        "gap": { "value": "{spacing.3}" }
      },
      "button": {
        "primary": {
          "background": { "value": "{color.action.primary}" },
          "backgroundHover": { "value": "{color.action.primaryHover}" },
          "color": { "value": "{color.text.onPrimary}" },
          "borderRadius": { "value": "{radius.base}" },
          "paddingX": { "value": "{spacing.4}" },
          "paddingY": { "value": "{spacing.2}" },
          "typography": { "value": "{typography.text.sm}" }
        },
        "secondary": {
          "background": { "value": "{color.action.secondary}" },
          "backgroundHover": { "value": "{color.action.secondaryHover}" },
          "color": { "value": "{color.text.primary}" },
          "borderRadius": { "value": "{radius.base}" },
          "paddingX": { "value": "{spacing.4}" },
          "paddingY": { "value": "{spacing.2}" },
          "typography": { "value": "{typography.text.sm}" }
        }
      }
    }
  }
}
```

### Выпадающий список аккаунтов (AccountSelectorDropdown)

```json
{
  "component": {
    "dropdown": {
      "trigger": {
        "background": { "value": "{color.surface.default}" },
        "borderColor": { "value": "{color.border.default}" },
        "borderRadius": { "value": "{radius.base}" },
        "paddingX": { "value": "{spacing.3}" },
        "paddingY": { "value": "{spacing.2}" },
        "typography": { "value": "{typography.text.sm}" },
        "color": { "value": "{color.text.primary}" }
      },
      "content": {
        "background": { "value": "{color.surface.default}" },
        "borderColor": { "value": "{color.border.default}" },
        "borderRadius": { "value": "{radius.base}" },
        "shadow": { "value": "{shadow.md}" },
        "width": { "value": "var(--radix-dropdown-menu-trigger-width)" },
        "maxHeight": { "value": "var(--radix-dropdown-menu-content-available-height)" }
      },
      "item": {
        "typography": { "value": "{typography.text.sm}" },
        "color": { "value": "{color.text.primary}" },
        "colorHover": { "value": "{color.text.primary}" },
        "backgroundHover": { "value": "{color.background.muted}" },
        "paddingX": { "value": "{spacing.3}" },
        "paddingY": { "value": "{spacing.2}" }
      },
      "separator": {
        "background": { "value": "{color.border.default}" },
        "margin": { "value": "{spacing.1}" }
      }
    }
  }
}
```

## Применение к компонентам страницы аккаунта

Вот как будут применяться токены к компонентам на странице аккаунта:

### Layout

```jsx
<div className="min-h-screen flex flex-col">
  <TopNavBlock />
  <main 
    // Использует семантические токены отступов
    className="flex-grow p-[{spacing.page.x.sm}] md:p-[{spacing.page.x.md}]"
  >
    <div 
      // Использует семантические токены размеров
      className="max-w-[{size.container.6xl}] mx-auto"
    >
      {/* ... Содержимое ... */}
    </div>
  </main>
</div>
```

### Заголовок страницы

```jsx
<h1 
  // Использует семантические токены типографики
  className="typography-[{typography.heading.3}]"
>
  {pageTitle}
</h1>
```

### Секция с карточками

```jsx
<div 
  // Использует семантические токены отступов
  className="space-y-[{spacing.section.gap}]"
>
  {/* Компоненты с применением собственных компонентных токенов */}
  <ProfileCard ... />
  <TariffPaymentCard ... />
  <EditProfileModal ... />
</div>
```

## Примечания по внедрению

1. Для реализации системы токенов потребуется настройка Style Dictionary
2. Токены должны быть доступны как через CSS-переменные, так и через JS для компонентов React
3. Для TypeScript можно создать типизированный интерфейс токенов
4. Потребуется доработка компонентов для использования токенов вместо хардкодных значений 