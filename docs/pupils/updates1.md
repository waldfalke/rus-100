

# Итоговое впечатление (коротко)

Прототип отдалённо похож на то, что нужно: есть секции, карточки, прогресс-бары. Но важные семантические и визуальные моменты потеряны — цветовая семантика, поведение дельт, акценты в карточках, подписи `{n}/{d}`, мелкие состояния («малый объём»), фокус/доступность и визуальная иерархия. Ниже — что поправить прямо сейчас (MVP), затем полный список правок и критерии приёмки.

---

# MVP — правки, которые нужно сделать в первую очередь (быстро и заметно)

1. **Семантические цвета прогресс-баров и дельт**

   * Зеленый для ≥90%, желтый/янтарный для 75–89%, оранжевый для 50–74%, красный для <50%.
   * Дельта (линейка внизу карточки) — цвет и значок (▲/▼) должны соответствовать знаку (положительная — зелёная, отрицательная — красная, нейтраль — серый/желтый).
2. **Процент в прогресс-баре — внутри бара + fallback**

   * Процент должен по умолчанию показываться внутри заполненной части. Если заполнение <20% — выводить процент справа от бара. Сейчас проценты иногда рисуются вне логики.
3. **Пил «уровень сложности» и «малый объём»**

   * Сделать визуально отличимыми: мягкий бекграунд + тонкая граница, position: top-right карточки для сложности; «малый объём» — маленький пил рядом с `{n}/{d}` (tooltip с объяснением).
4. **Карточка — визуальная иерархия и отступы**

   * Увеличить padding карточки, привести H3 (title) к более насыщенному весу, поставить secondary text (Выполнено / Средний балл) слева/справа в одну строку. Сейчас карточки выглядят «сплюснутыми».
5. **Контейнер и отступы страницы**

   * Центрировать главный контейнер, max-width = 1200–1280px, consistent left padding для секций. Навигация вкладок — дать активной вкладке фон как в требований (filled green pill).

---

# Полный список несоответствий и как их фиксить (Actionable)

(Ниже — элемент → проблема → решение / пример CSS или поведение)

### 1. Карточки (SkillCard)

* Проблема: визуально все карточки однотонные; нет семантики и акцента на дельте.
* Решение:

  * `card` padding: `20px`; `border-radius: 10px`; `box-shadow: 0 1px 2px rgba(0,0,0,0.04)`.
  * Разметка внутри: title (left/top), complexity badge (top-right), две колонки метрик (left: «Выполнено», right: «Средний балл»), прогресс-бар под ними, delta-pill внизу слева.
  * Delta-pill: height 28px, border-radius 8px, bg `#e6f6ec` (green) / `#fff4e6` (yellow) / `#fdecea` (red); icon ▲/▼ + text `+8%`/`-3%`.
  * Тест: открыть 3 разных карточки — цвета и дельта соответствуют правилам.

### 2. Прогресс-бар

* Проблема: толщина, радиус, поведение процента неконсистентны.
* Решение:

  * height = `12px` (desktop), `10px` (mobile); border-radius `8px`; background `#eef2f6`.
  * fill width = percent%; transition `width .3s`.
  * percent text: `font-weight: 600; font-size:13px; color` — контраст с fill. If percent < 20% → render outside right with margin-left `8px`.
  * ARIA: `role="progressbar" aria-valuenow={percent} aria-valuemin=0 aria-valuemax=100`.

### 3. Цветовая семантика (токены)

* Проблема: сейчас нет централизованной палитры.
* Решение: добавить токены (пример):

  * `--success: #16a34a`
  * `--amber: #f59e0b`
  * `--orange: #f97316`
  * `--danger: #ef4444`
  * `--card-bg: #fff`
  * `--muted: #6b7280`
* Использовать токены везде (progress-fill, delta-bg, badge-bg).

### 4. Текст `{n}/{d}` и «малый объём»

* Проблема: `{n}/{d}` не выделен и не моноширинный, нет индикатора малой выборки.
* Решение:

  * Поставить `{n}/{d}` первым элементом строки, font-family `monospace`/`font-feature-prop` or `font-weight:500`.
  * Если denominator < 3 → показать pill `n<3` справа от `{n}/{d}` с tooltip: «Малая выборка: результаты неустойчивы».

### 5. Секции и заголовки

* Проблема: заголовки секций слишком похожи на карточки, нет иконок секций.
* Решение:

  * H2/H3 семантика: иконка слева, заголовок и count badge справа `3 навыка`.
  * Margin-top между секциями: `32px`.

### 6. Вкладки/фильтры

* Проблема: активная вкладка сейчас не выделена ясно.
* Решение:

  * Активная вкладка: filled pill `--accent (green)`, white text; hover: slight darken; inactive: border-leftless, text-muted.
  * Implement keyboard focus outline and role="tablist".

### 7. Контраст / типографика

* Проблема: контраст вторичных текстов может быть ниже WCAG; шрифты смешаны.
* Решение:

  * Основной текст `#0f1720` (или `#111827`), secondary `#4b5563` (`--muted`), ensure contrast ≥ 4.5:1 for body text.
  * Title font-size desktop: 16–18px bold; labels 13–14px.

### 8. Интеррактивности (hover/focus/keyboard)

* Проблема: нет видимого focus, ховер слаб.
* Решение:

  * Card hover: `transform: translateY(-2px)` + subtle shadow, focus: `outline: 2px solid var(--accent)`.
  * All interactive items `tabindex=0`, proper aria-labels.

### 9. Mobile / responsive

* Проблема: не видно поведения на tablet/mobile.
* Решение:

  * Grid: desktop 3 cols, tablet 2, mobile 1. Ensure touch targets >=44px height.
  * Progress bars scale down height and font sizes.

### 10. Мелкие UX моменты

* Лишние скобки в лейблах (в прототипе остались) — показывать оригинальный текст, но на дизайне отметить опечатки (tooltip или комментарий в прототипе).
* Close button for drawer: touch zone 44px.

---

# Готовые CSS / Tailwind-подсказки (пример)

Если используете Tailwind, вот быстрый набор классов для карточки:

```
.card {
  @apply bg-white rounded-lg p-5 shadow-sm border border-gray-100;
}
.card-title { @apply text-base font-semibold text-gray-900; }
.card-meta { @apply text-sm text-gray-600; }
.progress {
  @apply w-full h-3 rounded-full bg-gray-100 overflow-hidden;
}
.progress-fill { @apply h-full rounded-full transition-all duration-300; }
.delta-pill { @apply inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm; }
```

Для семантики цвета:

```
.progress-fill.success { background: var(--success); }
.progress-fill.amber { background: var(--amber); }
.delta-pill.positive { background: #e6f6ec; color: var(--success) }
.delta-pill.negative { background: #fdecea; color: var(--danger) }
```

---

# Acceptance criteria (что тестировать после правок)

1. Для каждой карточки цвет прогресса и дельты соответствует порогам.
2. Процент внутри бара видим; для % <20 он отрисован справа.
3. `{n}/{d}` выделен, для denominator <3 отображается пил с tooltip.
4. Активная вкладка — заполненная pill; фокус на элементах виден.
5. Карточки имеют consistent padding и визуальную иерархию (title, метрики, прогресс, дельта).
6. ARIA/role для progressbar и tablist присутствуют.

---
