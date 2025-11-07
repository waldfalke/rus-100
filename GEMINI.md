# Настройка контекста для Gemini CLI в проекте `rus100`

Этот файл задаёт правила доступа к коду, включаемые директории и ожидания при работе Gemini CLI с репозиторием.

## Обзор прототипа
- UX/UI фронтенд-прототип платформы подготовки к экзамену по русскому языку (школы, учителя, студенты).
- Цель: валидация UX-потоков и визуального дизайна до реализации бэкенда.
- Основы на `shadcn/ui` и дизайн-токенах; реалистичные мок-данные.

## Контекст проекта
- Стек: Next.js (App Router), TypeScript, Tailwind CSS, Shadcn-UI стили, Jest/Vitest, Playwright.
- Ключевые директории:
  - `app/` — страницы и маршруты App Router.
  - `components/` и `components/ui/` — общие UI-компоненты.
  - `lib/` — утилиты, контексты, темы.
  - `src/` — дополнительные компоненты/модули и демо.
  - `styles/` — глобальные стили и токены.
  - `tests/` и `__tests__/` — e2e, визуальные, property-based и др.
  - `design-system/` — токены дизайна, сборка.

## Фокус прототипа
- Панель учителя и управление группами — основной сценарий.
- Библиотека компонентов на базе shadcn/ui.
- Валидация дизайн-токенов и паттернов.
- Прототипы пользовательских потоков (интерактивные макеты).

## Включаемые директории
Gemini должен видеть и индексировать содержимое:
- `app/`
- `components/`
- `lib/`
- `src/`
- `styles/`
- `tests/`
- `__tests__/`
- `data/`
- `design-system/`
- `public/`

## Исключения
Не использовать как контекст:
- `node_modules/`, `.next/`, `dist/`, `design-system/dist/`
- Сгенерированные артефакты, временные файлы, секреты.

## Политика изменений
- Вносить минимальные и целевые изменения, без рефакторинга вне задачи.
- Сохранять стиль кода (TypeScript, функциональные компоненты, именование как в проекте).
- Не менять не связанные с задачей файлы.
- Предпочитать патчи, краткие диффы и точечные правки.

## Команды для проверки
- Установка: `npm ci` или `npm install`
- Дев-сервер: `npm run dev`
- Сборка: `npm run build`
- Тесты: `npm test`, `npx playwright test`

## Расширенные команды (из прототипа)
- Разработка: `npm run dev`, `npm run build`, `npm run lint`
- Тестирование:
  - E2E: `npm run test:e2e`, `npm run test:e2e:ui`, `npm run test:e2e:headed`, `npm run test:e2e:debug`, `npm run test:e2e:report`
  - BDD: `npm run test:bdd`, `npm run test:bdd:ui`
  - Визуальные: `npm run test:visual`, `npm run test:visual:update`
  - Юнит: `npm run test`, `npm run test:watch`, `npm run test:all`
- Дизайн-токены: `npm run build:tokens`, `npm run build:tokens:watch`, `npm run validate:tokens`, `npm run benchmark:tokens`
- Проверки кода: `npm run verify:hardcoded`, `npm run verify:tokens-in-code`, `npm run verify:css-injection`, `npm run verify:shadcn`
- Варианты сборки: `npm run build:gh-pages`, `npm run build:gh-pages:win`, `npm run start:static`, `npm run start:static:local`
- Storybook: `npm run storybook`
- Утилиты: `npm run audit:a11y`, `npm run prepare:tests`

## Аутентификация и модель
- Использовать модель: `gemini-2.5-pro`
- Для Vertex AI предпочитать локацию `global` при проблемах 429.
- Переменные окружения берутся из `.env` (`GOOGLE_CLOUD_PROJECT`, `GOOGLE_CLOUD_LOCATION`).

## Примеры запросов
- Архитектура проекта: 
  - `gemini -m gemini-2.5-pro "Проанализируй архитектуру проекта, перечисли страницы и ключевые компоненты."`
- Навигация и маршруты:
  - `gemini -m gemini-2.5-pro "Пройди по app/, опиши маршруты и их назначение."`
- Поиск проблем производительности:
  - `gemini -m gemini-2.5-pro "Найди потенциальные узкие места рендеринга в components/ui и app."`
- Предложение правок (с предварительным описанием):
  - `gemini -m gemini-2.5-pro "Предложи точечные правки для optim. рендера в компоненте X, объясни риски."`

## Карта функций (фокус: учитель)
- `app/dashboard/page.tsx` — домашняя страница учителя: карточки статистики, фильтры групп, сетка групп.
- `app/groups/page.tsx` — просмотр всех групп: вкладки (Active/Archived/All), поиск, сортировка.
- `app/groups/[id]/page.tsx` — детальный вид группы: статистика, sticky-заголовки (известные проблемы).
- Связанные разделы: `app/tests/`, `app/tasks/`, `app/answers/`, `app/results/`, `app/account/`.

## Архитектура страниц
- Паттерн страниц: клиентский компонент, загрузка мок-данных, фильтрация/сортировка, макет с верхней навигацией и основным контентом.
- Именование компонентов:
  - `*Block.tsx` — композитные блоки (например, TopNavBlock).
  - `*Organism.tsx` — сложные организме (например, HeaderOrganism).
  - Базовые компоненты — имена из shadcn/ui (`button.tsx`, `card.tsx`).
- Повторно используемые компоненты: навигация (TopNavBlock, HeaderOrganism), макеты (ResponsiveContainer, TokenGrid), отображение данных (GroupCard, ResponsiveStatsTable).

## ResponsiveStatsTable
- Расположение: `components/stats-table/`.
- Подход: Atomic Design (atoms/molecules/organisms/hooks/utils), мобильная и десктопная версии, сортировка и синхронизация скролла.
- При запросах к таблице указывать типы входных данных (`students`, `columnGroups`/`columns`) и сценарии (sticky-заголовки, collapse групп, форматирование).

## Расширение контекста вне корня
Если нужна дополнительная папка вне рабочей директории, запускайте CLI с параметром включения директорий:
- `gemini -m gemini-2.5-pro --include-directories "d:\\Dev\\rus100;d:\\Dev\\another-folder" "Задача..."`

## Безопасность
- Не читать/не использовать секреты.
- Не запускать потенциально опасные команды; любые команды — только с явным подтверждением.