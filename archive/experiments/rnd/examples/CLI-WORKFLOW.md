# CLI Workflow Example

## Реальный пример: Создание Dashboard за 60 минут

### Сценарий
Нужно создать admin dashboard с компонентами:
- DataCard (метрики)
- Chart (графики)
- DataTable (таблица данных)
- Filter (фильтры)
- Dashboard page (сборка)

---

## Шаг 1: Инициализация проекта (2 минуты)

```bash
$ npx create-contract-driven-app admin-dashboard --template dashboard

🎯 Creating Contract-Driven App: admin-dashboard

✨ Template: Dashboard
📦 Features:
  ✅ Next.js 15 + TypeScript
  ✅ Tailwind CSS v4
  ✅ Storybook 9
  ✅ Design Tokens
  ✅ Dark theme support
  ✅ CI/CD workflows
  ✅ Multi-agent AI setup

📥 Installing dependencies...
✅ Done in 45s

📂 Project structure:
   admin-dashboard/
   ├── components/_base/     (Button, Card, Input готовы)
   ├── contracts/templates/
   ├── scripts/ai/
   └── ...

🚀 Next steps:
   cd admin-dashboard
   npm run generate component DataCard

✨ Happy coding!
```

---

## Шаг 2: Генерация компонента DataCard (5 минут)

```bash
$ cd admin-dashboard
$ npm run generate component DataCard

🎯 Contract-Driven Component Generator

📝 Component Configuration:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Component name: DataCard
❓ Description: Card displaying key metric with trend indicator
❓ Category: 
   [1] Atomic (basic UI element)
   [2] Molecule (composite component)
   [3] Organism (complex section)
   
   Choose [1-3]: 2

❓ Props needed:
   title: string
   value: string | number
   change: number
   trend: 'up' | 'down' | 'neutral'
   icon?: ReactNode
   
   Add more props? [y/N]: n

❓ Variants:
   [✓] default
   [ ] compact
   [ ] detailed
   
   Select (space to toggle): ↓ compact ↓ Enter

❓ States:
   [✓] default
   [✓] loading
   [ ] error
   
   Select: ✓ error ✓ Enter

❓ Responsive behavior:
   [✓] Mobile (stack vertically)
   [✓] Desktop (horizontal layout)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 Generating contract: contracts/DATACARD-001.yml

✅ Contract created!

🤖 AI Generation:
   [1] Generate with Claude Sonnet 4 (recommended)
   [2] Generate with GPT-4
   [3] Multi-agent parallel (experimental)
   [4] Manual (skip AI)
   
   Choose [1-4]: 1

🔄 Calling Claude AI...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Contract Agent: Analyzing requirements...
   ✅ Props interface defined
   ✅ Variants specified
   ✅ States mapped
   ✅ Invariants added
   ✅ Anti-patterns listed

🔨 Component Agent: Generating code...
   ✅ DataCard.tsx (78 lines)
   ✅ DataCard.types.ts (24 lines)
   ✅ DataCard.stories.tsx (156 lines)

🎨 Style Agent: Checking tokens...
   ✅ Using existing color tokens
   ✅ Using existing spacing scale
   ℹ️  Consider adding: --color-success-light, --color-danger-light

🧪 Validation Agent: Running checks...
   ✅ Contract compliance: 100%
   ✅ TypeScript: No errors
   ✅ ESLint: Passed
   ✅ No hardcoded values: Passed
   ✅ Accessibility: WCAG AA
   ⚠️  Warning: Missing unit tests

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Component generation complete!

📁 Files created:
   components/DataCard/
   ├── DataCard.tsx
   ├── DataCard.types.ts
   ├── DataCard.stories.tsx
   ├── index.ts
   └── CONTRACT.yml

🎨 Preview in Storybook:
   npm run storybook
   → http://localhost:6006/?path=/story/molecules-datacard

📝 Next steps:
   1. Review generated component
   2. Add unit tests: npm run test DataCard
   3. Use in page: import { DataCard } from '@/components/DataCard'

⏱️  Time: 2m 34s
```

---

## Шаг 3: Batch generation остальных компонентов (15 минут)

```bash
$ npm run generate:batch

🎯 Batch Component Generator

📝 How many components to generate? 3

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Component 1/3:
❓ Name: Chart
❓ Description: Wrapper for chart library with consistent theming
❓ Type: [molecule]
❓ Key props: data, type (line|bar|pie), title
✅ Contract: contracts/CHART-001.yml

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Component 2/3:
❓ Name: DataTable
❓ Description: Sortable, filterable data table
❓ Type: [organism]
❓ Key props: columns, data, onSort, onFilter
✅ Contract: contracts/DATATABLE-001.yml

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Component 3/3:
❓ Name: Filter
❓ Description: Filter panel with multiple filter types
❓ Type: [molecule]
❓ Key props: filters, onApply, onReset
✅ Contract: contracts/FILTER-001.yml

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🤖 Generation mode:
   [1] Sequential (one by one)
   [2] Parallel (all at once) - Faster! ⚡
   
   Choose [1-2]: 2

🚀 Multi-Agent Parallel Generation

🎯 Orchestrator: Creating execution plan...
   ✅ Dependency graph built
   ✅ 3 components, 0 dependencies
   ✅ Can parallelize: ALL

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚙️  Agent Pool: 3 agents active

[Agent 1] 🔨 Generating Chart...
[Agent 2] 🔨 Generating DataTable...
[Agent 3] 🔨 Generating Filter...

[Agent 1] ✅ Chart.tsx (95 lines) - 8s
[Agent 2] ✅ DataTable.tsx (187 lines) - 12s
[Agent 3] ✅ Filter.tsx (134 lines) - 9s

[Agent 1] ✅ Chart.stories.tsx - 3s
[Agent 2] ✅ DataTable.stories.tsx - 4s
[Agent 3] ✅ Filter.stories.tsx - 3s

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🧪 Validation Agent: Checking all components...
   ✅ Chart: 100% compliant
   ✅ DataTable: 100% compliant
   ✅ Filter: 100% compliant

📊 Summary:
   ✅ 3 components generated
   ✅ 12 files created
   ✅ 0 errors
   ⚠️  3 warnings (missing tests)

⏱️  Total time: 14m 23s
   ⚡ 3x faster than sequential!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎨 View in Storybook:
   npm run storybook

📝 Next: Generate dashboard page
   npm run generate page dashboard
```

---

## Шаг 4: Генерация Dashboard страницы (10 минут)

```bash
$ npm run generate page dashboard

🎯 Page Generator

📝 Page Configuration:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Page path: /dashboard
❓ Page title: Admin Dashboard
❓ Layout: 
   [1] Default (Header + Footer)
   [2] Dashboard (Sidebar + Header)
   [3] Minimal (No chrome)
   
   Choose: 2

❓ Sections to include:
   Available components:
   [✓] DataCard (4x in grid)
   [✓] Chart (2x side by side)
   [✓] DataTable
   [✓] Filter (sidebar)
   
   Select (space to toggle): ✓ all ✓ Enter

❓ Data source:
   [1] Static mock data
   [2] API endpoint
   [3] Server component fetch
   
   Choose: 3
   
❓ API endpoint: /api/dashboard/stats

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🤖 Calling Integration Agent...

📋 Integration Agent: Planning layout...
   ✅ Analyzed component dependencies
   ✅ Created responsive grid layout
   ✅ Added loading states
   ✅ Added error boundaries

🔨 Generating files...
   ✅ app/dashboard/page.tsx (142 lines)
   ✅ app/dashboard/layout.tsx (68 lines)
   ✅ app/dashboard/loading.tsx (24 lines)
   ✅ app/dashboard/error.tsx (31 lines)
   ✅ app/api/dashboard/stats/route.ts (mock API)

🎨 Style Agent: Adding page-specific tokens...
   ✅ Dashboard grid layout variables
   ✅ Sidebar width tokens
   ✅ Responsive breakpoints

🧪 Validation Agent: Checking integration...
   ✅ All imports resolved
   ✅ Props correctly passed
   ✅ TypeScript: No errors
   ✅ Accessibility: Landmarks present
   ✅ SEO: Metadata included

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Page generation complete!

📁 Files created:
   app/dashboard/
   ├── page.tsx
   ├── layout.tsx
   ├── loading.tsx
   └── error.tsx
   
   app/api/dashboard/
   └── stats/route.ts

🌐 Preview:
   npm run dev
   → http://localhost:3000/dashboard

⏱️  Time: 3m 18s
```

---

## Шаг 5: Validation & Review (8 минут)

```bash
$ npm run validate:all

🧪 Running all validation checks...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1️⃣  Contract Compliance
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 Checking contracts/DATACARD-001.yml
   ✅ Schema valid
   ✅ All required fields present
   ✅ Component matches contract
   ✅ Props: 6/6 implemented
   ✅ Variants: 2/2 implemented
   ✅ States: 3/3 implemented

📄 Checking contracts/CHART-001.yml
   ✅ All checks passed

📄 Checking contracts/DATATABLE-001.yml
   ✅ All checks passed

📄 Checking contracts/FILTER-001.yml
   ✅ All checks passed

Summary: ✅ 4/4 contracts compliant

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2️⃣  Design Token Usage
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎨 Scanning components for hardcoded values...

   ✅ components/DataCard/*.tsx - No hardcoded values
   ✅ components/Chart/*.tsx - No hardcoded values
   ✅ components/DataTable/*.tsx - No hardcoded values
   ✅ components/Filter/*.tsx - No hardcoded values
   ✅ app/dashboard/*.tsx - No hardcoded values

🔍 Token synchronization:
   ✅ design-tokens.json ↔ globals.css: 100% synced

Summary: ✅ All components use design tokens correctly

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3️⃣  Component Reuse Analysis
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Usage statistics:

   <DataCard> - 4 usages in 2 files
   ├─ app/dashboard/page.tsx (4x)
   └─ stories/DataCard.stories.tsx (3x)

   <Chart> - 2 usages in 2 files
   ├─ app/dashboard/page.tsx (2x)
   └─ stories/Chart.stories.tsx (4x)

   <DataTable> - 1 usage in 2 files
   ├─ app/dashboard/page.tsx (1x)
   └─ stories/DataTable.stories.tsx (5x)

   <Filter> - 1 usage in 2 files
   ├─ app/dashboard/page.tsx (1x)
   └─ stories/Filter.stories.tsx (3x)

Reuse Score: 2.1x (Good)
Summary: ✅ All components properly reused

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4️⃣  TypeScript & Linting
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 Running TypeScript compiler...
   ✅ No type errors found

🔍 Running ESLint...
   ✅ No linting errors
   ⚠️  3 warnings (missing ARIA labels)

Summary: ✅ Passed with warnings

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5️⃣  Accessibility (a11y)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 Running axe-core accessibility checks...

   ✅ DataCard: WCAG AA compliant
   ⚠️  Chart: Missing <title> in SVG
   ✅ DataTable: WCAG AA compliant
   ⚠️  Filter: Low contrast on reset button

Summary: ⚠️  2 warnings to address

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
6️⃣  Build Test
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔨 Running production build...
   ✅ Build successful
   📦 Bundle size: 142 KB (within budget)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Final Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Contract Compliance: 100%
✅ Token Usage: 100%
✅ Component Reuse: Good (2.1x)
✅ TypeScript: Passed
⚠️  Accessibility: 2 warnings
✅ Build: Successful

Overall: ✅ PASSED (with minor warnings)

🔧 Action items:
   1. Add <title> to Chart SVG
   2. Increase contrast on Filter reset button
   3. Add ARIA labels to 3 components

⏱️  Validation time: 1m 47s
```

---

## Шаг 6: Финальные правки и запуск (5 минут)

```bash
# Исправляем warnings
$ npm run fix:a11y
✅ Fixed 2 accessibility issues

# Запускаем Storybook для review
$ npm run storybook &
🚀 Storybook running on http://localhost:6006

# Запускаем dev server
$ npm run dev
✅ Ready on http://localhost:3000/dashboard

# Коммитим результат
$ git add .
$ git commit -m "feat: add admin dashboard with DataCard, Chart, DataTable, Filter"

[main 7f3a92c] feat: add admin dashboard
 18 files changed, 1247 insertions(+)
 create mode 100644 app/dashboard/page.tsx
 create mode 100644 components/DataCard/DataCard.tsx
 ...

✅ Dashboard готов к продакшену!
```

---

## Timeline Summary

| Этап | Время | Накопительно |
|------|-------|--------------|
| 1. Setup проекта | 2 мин | 2 мин |
| 2. DataCard generation | 5 мин | 7 мин |
| 3. Batch generation (3 components) | 15 мин | 22 мин |
| 4. Dashboard page | 10 мин | 32 мин |
| 5. Validation | 8 мин | 40 мин |
| 6. Fixes & review | 5 мин | **45 мин** |

**Итого: 45 минут** вместо потенциальных 16-20 часов ручной работы!

**Ускорение: 26x** 🚀

---

## Что делал AI vs Человек

### AI (90% работы):
- ✅ Генерация контрактов
- ✅ Генерация компонентов (TSX, types, stories)
- ✅ Интеграция в страницу
- ✅ Валидация кода
- ✅ Accessibility checks

### Человек (10% работы):
- ✅ Ответы на вопросы wizard'ов (requirements)
- ✅ Code review сгенерированного кода
- ✅ Исправление 2 accessibility warnings
- ✅ Финальная проверка в браузере

---

## Вывод

**Contract-Driven + Multi-Agent AI = 26x ускорение** 🎉

Методология работает и масштабируется!
