Ниже — доработанные и расширенные требования, приведённые в виде PlainText по пунктам от Trae. Учёл всё важное из первоначального набора требований + добавил конкретику по структуре данных, компонентам, API и этапам реализации для Next.js проекта `rus100`. Всё в формате, который удобно копировать в техническое задание.

1. Общий анализ страницы
   Это страница «Статистика группы / ученики» — page типа: статистика группы с карточками метрик по навыкам (не список профилей учеников и не один профиль).
   Основное назначение: дать преподавателю/куратору быстрый обзор текущих показателей группы по наборам навыков (Нормы, Орфография, Пунктуация, Работа с текстом), показать проблемные навыки и тренды, дать вход в детальную аналитику по карточке.
   Целевая аудитория: учителя/методисты/кураторы и администраторы платформы (desktop-first, вторично — tablet/mobile).

2. Структура и компоненты

* Заголовок и навигация:

  * Хлебные крошки (breadcrumb) сверху.
  * H1: «Группа Тесты, Русский-Годовой, 2025».
  * Вкладки (tabs): «Общая статистика», «Статистика заданий», «Ученики», «Лента заданий», «Свои тесты 2».
  * Профиль/иконки в правом верхнем углу.
* Основные блоки контента:

  * Секция «Общая статистика группы» (краткий KPI при необходимости).
  * Далее несколько разделов (H2): «Нормы», «Орфография», «Пунктуация», «Работа с текстом» — в каждом сетка карточек.
  * Каждая карточка — tile с: номером навыка (№11), выполнено отработок (число), средний балл (процент), дельта/стрелка, семантический фон (зелёный/жёлтый/красный/нейтраль).
* Боковые панели/доп. элементы:

  * Вариант: правая панель для детальной карточки (drawer) или модал при клике.
  * Фильтры/датапикер над сеткой (период: 7/30/90 дней), сортировка, поиск навыков.
* Футер: отсутствует на скриншоте — опционален.
* UI-компоненты:

  * Breadcrumbs, Tabs, Card (tile), Grid, Badge/Delta, Button, Icon, Skeleton, Drawer/Modal, Tooltip, Avatar (если нужно).

3. Функциональность

* Действия пользователя:

  * Переключение вкладок.
  * Сортировка и фильтрация карточек по значению/дельте/названию.
  * Фильтр времени (период сравнения).
  * Клик по карточке → открыть детальную аналитику (drawer или страница).
  * Экспорт данных (CSV/PDF) — опционально.
* Поиск/фильтрация/сортировка:

  * Быстрый поиск по номеру/названию навыка.
  * Фильтр по порогам (показывать только ухудшающиеся/улучшающиеся).
  * Сортировка по среднему баллу, по выполненным отработкам, по абсолютной дельте.
* Интерктивные элементы:

  * Вкладки, кликабельные карточки, тултипы на дельтах, кнопки экспорта, кнопки retry при ошибке.
* Модальные окна/выпадающие меню:

  * Драфтер/модал для детальной карточки.
  * Dropdown для выбора периода/сортировки.
  * Tooltip для пояснений (что такое «№11», что значит дельта).
* Поведение:

  * SPA-переходы (pushState) при смене вкладки.
  * Skeleton при загрузке.
  * Ленивая подгрузка/виртуализация при большом количестве карточек.

4. Данные и контент

* Отображаемые данные (карточка):

  * skillId: string/number (например '11')
  * skillTitle: string (доп. поле: description)
  * completedRuns: number («Выполнено отработок»)
  * averageScore: number (целый процент)
  * deltaPercent: number (может быть отрицательным/нулевым/положительным)
  * deltaSign: derived from deltaPercent (up/down/zero)
  * severity: enum {success, neutral, warning, danger} — вычисляется по deltaPercent или по бизнес-правилам
  * lastUpdated: ISO timestamp
* Структура данных страницы:

  * groupId, groupTitle, period (current filter), sections: [{sectionId, sectionTitle, skills: Skill[]}]
* Группировка:

  * Данные структурированы по секциям навыков (Нормы, Орфография…).
* Метрики:

  * Выполнено (count), Средний балл (%), Дельта (%), Приоритизация (severity).
* Источники/агрегация:

  * Агрегаты считаются на бэкенде (суммы/средние) и отдаются готовыми.

5. Адаптивность и состояния

* Адаптивность:

  * Desktop ≥1200px: 3 колонки карточек.
  * Tablet 768–1199px: 2 колонки.
  * Mobile <768px: 1 колонка.
  * Контейнер(centered) max-width 1200–1280px.
* Состояния элементов:

  * Card: normal / hover / focus / active / disabled.
  * Delta: positive (зелёный + стрелка вверх), neutral (жёлтый/серый), negative (красный + стрелка вниз).
  * Кнопки: default / hover / pressed / disabled.
* Пустые состояния / ошибки:

  * Пустой раздел: иллюстрация + текст «Нет данных».
  * Ошибка загрузки: баннер/inline-ошибка с кнопкой «Повторить».
  * Skeleton при загрузке.
* Анимации:

  * Ненавязчивые (fade/transform 150–300ms) при hover и при появлении данных.

6. Интеграция с существующим проектом (Next.js rus100)

* Папка страницы:

  * Поместить в `app/groups/[groupId]/stats` или `app/groups/[groupId]/students` — рекомендую `app/groups/[groupId]/stats`, т.к. это аналитическая страница группы. Если проект использует английские названия, `app/groups/[groupId]/students` можно зарезервировать для списка учеников.
* Переиспользуемые компоненты:

  * `Breadcrumbs`, `Tabs`, `Card`, `Avatar`, `Button`, `Skeleton`, `Icon`, `DatePicker`, `Drawer` — если они уже есть в проекте.
  * Перепользовать токены темы (colors, spacing, radii).
* Новые API endpoints (backend/edge):

  * `GET /api/groups/:groupId/stats?period=7|30|90` — возвращает агрегированную структуру sections+skills.
  * `GET /api/groups/:groupId/skill/:skillId/details?period=...` — детальная аналитика для drawer.
  * `GET /api/groups/:groupId/export?format=csv|pdf&period=...` — экспорт.
  * Опционально: `POST /api/telemetry/event` для аналитики действий.
* Связь с существующими страницами:

  * Вкладка «Ученики» → `app/groups/[groupId]/students`.
  * Dashboard → ссылка на `groups/:groupId/stats`.
  * При переходе по URL должны работать SSR/SSG или ISR в зависимости от требований (см. производительность).

7. Техническая спецификация

* React-компоненты (предложение):

  * `GroupStatsPage` (страница контейнер)
  * `GroupHeader` (breadcrumb + H1 + tabs)
  * `StatsFilters` (period selector, search, sort)
  * `SectionsList` (итерирует sections)
  * `SkillCard` (tile) — props: skill: Skill, onClick(skillId)
  * `SkillDetailsDrawer` (детали)
  * `SkeletonGrid` (заготовки)
  * `EmptyState` / `ErrorBanner`
* TypeScript интерфейсы:

  * `interface Skill { id: string; title: string; completedRuns: number; averageScore: number; deltaPercent: number; lastUpdated: string; severity: 'success'|'neutral'|'warning'|'danger' }`
  * `interface Section { id: string; title: string; skills: Skill[] }`
  * `interface GroupStats { groupId: string; groupTitle: string; period: string; sections: Section[] }`
* Пропсы кратко:

  * `SkillCard` props: `{ skill: Skill; onOpen: (id: string) => void }`
  * `SectionsList` props: `{ sections: Section[]; onCardClick: (id: string) => void }`
* Hooks / утилиты:

  * `useGroupStats(groupId: string, period: string)` — fetch + cache + revalidate.
  * `useDebouncedSearch(value, delay)` — для поиска.
  * `useInfiniteGrid` / `useVirtualList` — если >50 карточек.
  * Утилиты: `formatPercent`, `computeSeverity(delta)`, `formatNumber`.
* Стили:

  * Использовать существующую дизайн-систему / Tailwind (если в проекте).
  * Токены: colors (bg-success, bg-warning, bg-danger), spacing (gap-6 / gap-4), radii (rounded-lg), box-shadow subtle.
  * Классы: `grid-cols-{1,2,3}` responsive; `card`, `card--success`, `card--warning`, `delta--positive`, `delta--negative`.
* Доступность:

  * ARIA: role="tablist"/"tab", card role="button" + aria-label including title & averageScore.
  * Keyboard navigation support.
* Тесты:

  * Unit: snapshot SkillCard, utils formatPercent, computeSeverity.
  * Integration: rendering sections, skeleton during fetch, error state, click opens drawer.
  * E2E: переключение периодов, фильтрация, сортировка, export flow.

8. Приоритизация задач (эпики и шаги)

* MVP (1–2 спринта):

  * Структура страницы + Header + Tabs.
  * Fetch `GET /api/groups/:groupId/stats` и рендер Sections + SkillCard.
  * Skeleton loading, error banner, пустое состояние.
  * Клик по карточке открывает простой Drawer с базовыми данными.
  * Basic filters: period selector, sort.
  * Accessibility базовый (aria, keyboard tab).
* Доп. функциональность (после MVP):

  * Поиск по навыкам, детальная аналитика в drawer (графики), экспорт CSV.
  * Визуальные улучшения: анимации, подсказки, цветовые токены.
  * Виртуализация для больших наборов данных, кэширование, telemetry events.
* Полировка и оптимизация:

  * Оптимизация запросов (batching), SSR/ISR настройки, edge caching.
  * Тесты покрытия, performance budgets, WCAG проверка.
* Параллельные задачи:

  * Backend: endpoints для агрегации + экспорт.
  * Frontend: компоненты общего набора (Card, Tabs) можно делать параллельно.
  * QA/Design: утверждение цветовой палитры и токенов одновременно с версткой.
* Критерии готовности (Definition of Done):

  * API возвращает корректные агрегаты.
  * UI соответствует responsive-правилам.
  * Клики, фильтры и сортировка работают и покрыты тестами.
  * Accessibility checks пройдены (basic).

---
