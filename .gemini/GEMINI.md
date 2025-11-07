# Project: rus100

## Tech Stack
- Framework: Next.js 15 (App Router, static export for demo)
- Language: TypeScript 5+
- UI: shadcn/ui + Tailwind CSS
- Design tokens: custom tokens in `design-system/tokens`
- Package manager: npm

## Project-Specific Rules
- Directory structure: `app/`, `components/` (`components/ui`), `lib/`, `src/`, `styles/`, `tests`, `__tests__`, `design-system`, `public`
- Component naming: `*Block.tsx`, `*Organism.tsx`, базовые имена из shadcn/ui (`button.tsx`, `card.tsx`)
- File size limits: стремиться к ≤ 400 строк на компонент, дробить при росте сложности
- Testing requirements: Vitest (unit), Playwright (E2E/visual), BDD features

## DbC Contracts
- Все функции должны иметь контракты входа/выхода
- Инварианты документированы рядом с типами
- Предусловия и постусловия обязательны для публичных функций
- Ошибочные состояния перечислены явно; использовать безопасные паттерны (Result/throw)

## Context Imports
@../GEMINI.md

## CLI Tips
- Показать загруженный контекст: `/memory show`
- Обновить контекст после правок: `/memory refresh`
- Добавить временную инструкцию: `/memory add <instruction>`
- Включить Plan Mode: `export GEMINI_SYSTEM_MD=".gemini/plan-mode.md"`

## Model and Auth
- Предпочтительная модель: `gemini-2.5-pro` (для скорости — `gemini-2.5-flash`)
- Аутентификация: OAuth personal или API-ключи из `.env` (`GEMINI_API_KEY`, `GOOGLE_API_KEY`)