# TD-FMT-001: Кастомный форматтер Style Dictionary для Tailwind CSS

**Статус:** Предложено
**Дата:** 2025-05-02

## 1. Цель

Стандартный форматтер `css/variables` в Style Dictionary генерирует CSS-переменные с иерархическими именами (например, `--theme-color-background-default`). Однако текущая конфигурация `tailwind.config.ts` ожидает "плоские" имена переменных (например, `--background`) для определения своей темы (цветов, радиусов).

Цель данного контракта — определить требования к кастомному форматтеру Style Dictionary (`css-variables-tailwind`), который будет генерировать CSS-файл с переменными, имеющими имена, совместимые с `tailwind.config.ts`, используя значения из семантических токенов Style Dictionary.

## 2. Требования к именованию переменных

Кастомный форматтер должен генерировать следующие CSS-переменные с "плоскими" именами, используя значения из указанных семантических или базовых токенов Style Dictionary:

| Переменная Tailwind (`tailwind.config.ts`) | Источник значения (Токен Style Dictionary)        | Примечания / Решения по неоднозначностям                                                                                                                               |
| :--------------------------------------- | :------------------------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--background`                           | `theme.color.background.default`                  |                                                                                                                                                                        |
| `--foreground`                           | `theme.color.foreground.default`                  |                                                                                                                                                                        |
| `--card`                                 | `theme.color.background.card`                     |                                                                                                                                                                        |
| `--card-foreground`                      | `theme.color.foreground.default`                  | Используем `foreground.default`. Если потребуется отдельный цвет текста на карточках, нужно будет добавить семантический токен `theme.color.foreground.onCard`.     |
| `--popover`                              | `theme.color.background.card`                     | Используем фон карточки для поповеров. Если дизайн требует иного, добавить `theme.color.background.popover`.                                                         |
| `--popover-foreground`                   | `theme.color.foreground.default`                  | Используем `foreground.default`. Если дизайн требует иного, добавить `theme.color.foreground.onPopover`.                                                              |
| `--primary`                              | `theme.color.primary.default`                     |                                                                                                                                                                        |
| `--primary-foreground`                   | `theme.color.primary.foreground`                  |                                                                                                                                                                        |
| `--secondary`                            | **`theme.color.neutral.100` (Light)** / **??? (Dark)** | **Требуется действие:** Семантический токен `theme.color.secondary.default` отсутствует. **Временно** мапим на `neutral.100` (для light). Необходимо определить и добавить семантические токены `secondary` в `light.json` и `dark.json`. |
| `--secondary-foreground`                 | **`theme.color.neutral.900` (Light)** / **??? (Dark)** | **Требуется действие:** Семантический токен `theme.color.secondary.foreground` отсутствует. **Временно** мапим на `neutral.900` (для light). Необходимо определить и добавить семантические токены `secondary` в `light.json` и `dark.json`. |
| `--muted`                                | `theme.color.background.muted`                    |                                                                                                                                                                        |
| `--muted-foreground`                     | `theme.color.foreground.muted`                    |                                                                                                                                                                        |
| `--accent`                               | **`theme.color.neutral.200` (Light)** / **??? (Dark)** | **Требуется действие:** Семантический токен `theme.color.accent.default` отсутствует. **Временно** мапим на `neutral.200` (для light). Необходимо определить и добавить семантические токены `accent` в `light.json` и `dark.json`.   |
| `--accent-foreground`                    | **`theme.color.neutral.900` (Light)** / **??? (Dark)** | **Требуется действие:** Семантический токен `theme.color.accent.foreground` отсутствует. **Временно** мапим на `neutral.900` (для light). Необходимо определить и добавить семантические токены `accent` в `light.json` и `dark.json`.   |
| `--destructive`                          | `theme.color.error.default`                       | Предполагается, что `destructive` соответствует семантике `error`.                                                                                                   |
| `--destructive-foreground`               | `theme.color.error.foreground`                    |                                                                                                                                                                        |
| `--border`                               | `theme.color.border.default`                      |                                                                                                                                                                        |
| `--input`                                | `theme.color.border.default`                      | Используем `border.default`. Если для инпутов нужен другой цвет границы, добавить семантический токен `theme.color.border.input`.                                   |
| `--ring`                                 | `theme.color.border.focus`                        |                                                                                                                                                                        |
| `--radius`                               | `radius.base`                                     | Значение берется из базового токена (не из `theme`).                                                                                                                |

**Важно:** Перед реализацией форматтера необходимо определить и добавить недостающие семантические токены для `secondary` и `accent` в файлы `light.json` и `dark.json`.

## 3. Обработка остальных токенов

Все остальные токены (базовые, другие семантические, компонентные), не перечисленные в таблице выше, должны генерироваться форматтером с их стандартными иерархическими именами (например, `--color-primary-500`, `--theme-typography-body-default-font-size`). Это позволит использовать их напрямую в кастомном CSS при необходимости.

## 4. Формат вывода

Форматтер должен использовать опцию `outputReferences: false` (или эквивалентную логику), чтобы значения CSS-переменных были конечными (например, `#ffffff`, `1rem`, `hsl(...)`), а не ссылками на другие переменные.

## 5. Регистрация форматтера

Форматтер должен быть зарегистрирован в `style-dictionary.config.js` и использоваться для платформы `css`. 