## Контракт LYT-CNTR-001: Стандартизация контейнера страницы (v2 - Эффект "ушей")

**Дата:** 2024-07-27 (Обновлен)

**Статус:** Предложен

**Цель:**
Унифицировать структуру контейнеризации страниц для обеспечения согласованного внешнего вида: фон шапки (`components/ui/TopNavBlock.tsx`) должен иметь возможность расширяться ("уши"), в то время как её *содержимое* и основной контент страницы должны выравниваться по общей вертикальной "красной линии" (ограниченной стандартной шириной `max-w-*` и центрированной `mx-auto`). Исправить проблему "несжатой" шапки на странице `/account`.

**Анализ референса (`https://waldfalke.github.io/rus-100/`) и Требования:**
Референс и требование "ушей шапки" предполагают структуру, где:
1.  Фон шапки может занимать большую ширину, чем основной контент.
2.  Содержимое шапки (ссылки, иконки) и основной контент под ней выровнены по одинаковым вертикальным границам.

**Анализ предыдущего решения (v1):**
Подход с единым контейнером `max-w-6xl` для шапки и контента не позволяет создать эффект "ушей" и ограничивает фон шапки.

**Предлагаемое решение (v2):**

1.  **Модификация `components/ui/TopNavBlock.tsx`:**
    *   **Внешний `<nav>`:** Отвечает за фон, вертикальные отступы (`mt-5 mb-10`) и горизонтальные отступы для "ушей" (`px-4 sm:px-6 lg:px-8` - те же, что у основного контента). **Не должен** иметь `max-w-*` или `mx-auto`.
    *   **Внутренний `<div>`:** Оборачивает *все содержимое* шапки (лого, ссылки, иконки). Имеет классы `max-w-6xl w-full mx-auto` для ограничения ширины и центрирования содержимого шапки по "красной линии". Также отвечает за `flex`, `items-center` и внутренние отступы самого содержимого шапки (например, `py-2`).

    ```diff
    // components/ui/TopNavBlock.tsx
    export const TopNavBlock: React.FC = () => (
    - <nav className="bg-muted/90 rounded-2xl flex items-center p-2 mt-5 mb-10 relative">
    + <nav className="bg-muted/90 rounded-2xl mt-5 mb-10 px-4 sm:px-6 lg:px-8"> {/* Внешний контейнер для фона и "ушей" */}
    +   <div className="max-w-6xl w-full mx-auto flex items-center py-2 relative"> {/* Внутренний контейнер для контента шапки и "красной линии" */}
          <span className="text-foreground text-sm font-medium px-3 py-2">
            Русский<span className="text-primary">_100</span>
          </span>
    -     <div className="hidden lg:flex flex-wrap flex-1 items-center">
    +     <div className="hidden lg:flex flex-wrap flex-1 items-center ml-4"> {/* Добавлен отступ от лого */}
            <a href="#" className="text-foreground text-sm font-medium bg-muted rounded-xl px-4 py-2 mx-1 my-1 text-center hover:bg-accent hover:text-accent-foreground">
              Дашборд
            </a>
            {/* ... другие ссылки ... */}
          </div>
          <div className="relative ml-auto mx-1 my-1">
            {/* ... иконка User ... */}
          </div>
          <div className="ml-1 my-1"> 
            <ThemeToggle />
          </div>
    +   </div> {/* Конец внутреннего контейнера */}
      </nav>
    );
    ```
    *(Примечание: `p-2` заменено на `py-2` во внутреннем div, так как горизонтальные отступы теперь контролируются внешним `<nav>`)*

2.  **Модификация `app/account/page.tsx`:**
    *   **Удалить** общую обертку `<div class="max-w-6xl ...">`, которая ранее оборачивала `TopNavBlock` и `<main>`.
    *   `TopNavBlock` размещается напрямую внутри корневого `div` страницы.
    *   **Добавить** классы `max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8` к элементу `<main>` (или к его первому дочернему `div`), чтобы ограничить основной контент по "красной линии".

    ```diff
    // app/account/page.tsx
    export default function Page() {
      // ... state and handlers ...
      return (
        <div className="min-h-screen flex flex-col">
    -     <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8">
            <TopNavBlock />
    -       <main className="flex-grow p-4 md:p-6">
    +       <main className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 p-4 md:p-6"> {/* Контейнер контента */}
              <div> {/* Этот div может больше не нужен, или оставить без max-w/mx-auto */}
                <BreadcrumbsBlock items={breadcrumbItems} />
                {/* ... rest of the main content ... */}
              </div>
            </main>
    -     </div>
        </div>
      );
    }
    ```
    *(Примечание: Добавление `max-w-6xl...` прямо к `<main>` может конфликтовать с `flex-grow`. Возможно, лучше оставить `<main>` как есть, а обернуть его содержимое в `<div class="max-w-6xl w-full mx-auto px-...">`)*.

3.  **Модификация `app/page.tsx` (Генератор тестов):**
    *   Аналогично, **удалить** общую обертку `<div class="max-w-6xl ...">`.
    *   `TopNavBlock` размещается напрямую.
    *   **Добавить** классы `max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8` к `div`, который оборачивает основной контент страницы (начиная с хлебных крошек).
    *   `ProgressPanelBlock` остается вне этой обертки.

    ```diff
    // app/page.tsx
    export default function TestGenerator() {
      // ... state and handlers ...
      return (
        <div className="font-sans pb-24 min-h-screen bg-background">
    -     <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8">
            <TopNavBlock />

            {/* Main content starts here */}
    -       <div>
    +       <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8"> {/* Контейнер контента */}
              <div className="flex justify-between items-center mb-4">
                {/* ... breadcrumbs ... */}
              </div>
              {/* ... rest of the page content (h1, p, form, tabs, etc.) ... */}
            </div> {/* Конец контейнера контента */}
    -     </div>

          <ProgressPanelBlock
            // ... props ...
          />
        </div>
      );
    }
    ```

**Верификация:**
1.  Визуально проверить страницы `/account` и `/`. Фон шапки должен иметь "уши", а ее содержимое и основной контент должны быть выровнены по одной вертикальной линии.
2.  Проверить на мобильных/планшетах - горизонтальные отступы (`px-*`) должны работать и для шапки, и для контента.
3.  Вертикальные отступы должны сохраниться.

**Потенциальные проблемы:**
*   Необходимость небольшой корректировки `padding` на элементах `<main>` или внутренних `div`, если возникнет эффект "двойного" отступа.
*   Класс `w-full` на обертке может потребоваться или не потребоваться в зависимости от точной flex-структуры родителя (`min-h-screen flex flex-col`). 