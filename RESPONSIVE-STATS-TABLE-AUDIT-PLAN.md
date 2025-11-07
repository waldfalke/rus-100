# План Исправления Компонента ResponsiveStatsTable

## 1. Общие выводы аудита

Всесторонний анализ компонента `ResponsiveStatsTable` и его окружения выявил четыре основные проблемы, которые мешают его корректной работе и усложняют поддержку:

1.  **Сбой `position: sticky` для заголовков:** Критическая проблема, из-за которой заголовки таблицы прокручиваются вместе с контентом, вместо того чтобы "прилипать" к верху.
2.  **Дублирование и конфликт CSS:** Существуют два почти идентичных файла стилей, и используется устаревший путь импорта компонента.
3.  **Двойная логика адаптивности (JS + CSS):** Компонент одновременно рендерит и мобильную, и десктопную версии, скрывая одну из них через CSS. Это неэффективно и усложняет отладку.
4.  **"Магические числа" (хардкод):** Множество размеров, отступов и позиций жестко прописаны в коде, что противоречит принципам дизайн-системы.

Ниже представлен пошаговый план устранения этих проблем в виде последовательных, изолированных мини-патчей.

---

## 2. План мини-патчей

### Патч №1: Восстановление `position: sticky` (Критический)

-   **Проблема:** `position: sticky` не работает, потому что родительский контейнер `[role="tabpanel"]` (компонент `TabsContent`) имеет стиль `display: flex; flex-direction: column;`, который создает новый контекст форматирования и ломает "липкое" позиционирование.
-   **Решение:** Изолированно переопределить стиль для вкладки, содержащей таблицу, не затрагивая другие вкладки.

    1.  **Файл:** `D:\Dev\rus100\app\groups\[id]\GroupStatsClient.tsx`
        -   **Действие:** Добавить кастомный класс `table-tab-content` к компоненту `TabsContent`, который оборачивает таблицу.
        -   **Diff:**
            ```diff
            - <TabsContent value="table" className="space-y-6">
            + <TabsContent value="table" className="space-y-6 table-tab-content">
            ```

    2.  **Файл:** `D:\Dev\rus100\app\globals.css`
        -   **Действие:** Добавить в конец файла CSS-правило, которое переопределяет `display` только для нашего нового класса.
        -   **Код для добавления:**
            ```css
            /* Fix for ResponsiveStatsTable sticky header inside TabsContent */
            .table-tab-content {
              display: block;
            }
            ```

### Патч №2: Унификация CSS и импортов

-   **Проблема:** Используется устаревший импорт таблицы из `components/ui/`, который тянет за собой дублирующий CSS-файл.
-   **Решение:** Переключиться на правильный путь импорта и удалить старые, более не используемые файлы.

    1.  **Файл:** `D:\Dev\rus100\app\groups\[id]\GroupStatsClient.tsx`
        -   **Действие:** Изменить путь импорта `ResponsiveStatsTable`.
        -   **Diff:**
            ```diff
            - import { ResponsiveStatsTable } from '@/components/ui/responsive-stats-table';
            + import { ResponsiveStatsTable } from '@/components/stats-table';
            ```

    2.  **Действие:** Удалить следующие файлы, ставшие ненужными:
        -   `D:\Dev\rus100\components\ui\responsive-stats-table.tsx`
        -   `D:\Dev\rus100\components\ui\responsive-stats-table.css`

### Патч №3: Консолидация логики адаптивности

-   **Проблема:** Рендерятся обе версии таблицы (`Desktop` и `Mobile`), что неэффективно.
-   **Решение:** Перейти на условный рендеринг в JavaScript на основе состояния `isMobile`.

    1.  **Файл:** `D:\Dev\rus100\components\stats-table\ResponsiveStatsTableOrganism.tsx`
        -   **Действие:** Заменить одновременный рендеринг двух компонентов на тернарный оператор.
        -   **Diff:**
            ```diff
            - <div className="table-scroll-container">
            -   <DesktopStatsTable ... />
            - </div>
            - <MobileStatsTable ... />
            + {isMobile ? (
            +   <MobileStatsTable ... />
            + ) : (
            +   <div className="table-scroll-container">
            +     <DesktopStatsTable ... />
            +   </div>
            + )}
            ```

    2.  **Файл:** `D:\Dev\rus100\components\stats-table\responsive-stats-table.css`
        -   **Действие:** Удалить CSS-правила, которые скрывали/показывали разные версии таблицы.
        -   **Код для удаления:**
            ```css
            @media (max-width: 768px) {
              .desktop-table {
                display: none;
              }
            
              .mobile-table {
                display: block;
              }
              ...
            }
            
            .mobile-table {
               display: none;
            }
            ```

### Патч №4 (План): Токенизация "магических чисел"

-   **Проблема:** Жестко закодированные значения размеров и отступов.
-   **Решение:** Провести рефакторинг, заменив эти значения на переменные из дизайн-системы. Этот патч следует применять после исправления критических ошибок.

| "Магическое число" | Файл | Строка (примерно) | Предлагаемый токен / CSS-переменная |
| :--- | :--- | :--- | :--- |
| `768px` | `ResponsiveStatsTableOrganism.tsx` | 40 | `var(--breakpoint-md)` или Tailwind класс `md:` |
| `200px` | `hooks/useColumnWidths.ts` | 30 | `var(--stats-table-student-column-width)` |
| `80px` | `hooks/useColumnWidths.ts` | 30 | `var(--stats-table-data-column-width)` |
| `'96px'` / `'56px'` | `molecules/TotalsRow.tsx` | 58 | `var(--header-height-with-groups)` / `var(--header-height)` |
| `'28px'` | `organisms/DesktopStatsTable.tsx` | 121 | `var(--header-group-height)` |

---

## 3. Ожидаемый результат

Последовательное применение патчей №1, №2 и №3 приведет к:
-   **Полностью рабочей `sticky`-функциональности** заголовков таблицы.
-   **Устранению дублирования кода** и упрощению структуры проекта.
-   **Повышению производительности** за счет отказа от рендеринга невидимых компонентов.

Патч №4 (токенизация) является следующим шагом для приведения компонента в полное соответствие с дизайн-системой.
