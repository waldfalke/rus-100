# Contract-Driven Development: Distilled Methodology

**Version:** 1.0  
**Status:** Production-ready distillation  
**For:** AI agents working on frontend projects

**📍 Navigation:** See [`../RND-INDEX.md`](../RND-INDEX.md) for complete ecosystem map

---

## 🎯 Purpose

This methodology is a distilled essence from three real projects, providing AI with structured knowledge for building consistent, maintainable systems using contracts as source of truth.

**Key principle:** Control generators, not generated code. Contracts define what to generate, AI executes.


## 📁 Structure

```
distilled-methodology/
├── README.md                    # Точка входа для AI
├── SUMMARY.md                   # Быстрая справка
│
├── rules/                       # Статические принципы
│   ├── 00-universal.md         # 10 фундаментальных правил
│   └── 01-cynefin.md           # Cynefin framework
│
├── workflows/                   # Процедуры
│   ├── create-component.md     # Создание компонента
│   ├── extract-contract.md     # Извлечение из legacy
│   └── meta-update-knowledge.md # Обновление методологии
│
├── schemas/                     # JSON схемы для валидации
│   ├── contract.schema.json    # Валидация контрактов
│   └── token.schema.json       # Валидация токенов
│
├── templates/                   # Шаблоны
│   ├── CONTRACT-COMPONENT.yml  # Шаблон контракта
│   └── design-tokens.json      # Шаблон токенов
│
├── contracts/                   # Реальные контракты (универсализированные)
│   ├── README.md               # Как использовать контракты
│   ├── METACONTRACT.yml        # Мета-контракт (как писать контракты)
│   └── CONTRACT-TOKENS-EXAMPLE.yml  # Пример контракта токенов
│
├── scripts/                     # Рабочие скрипты валидации
│   ├── README.md               # Документация скриптов
│   ├── validate-tokens.js      # Проверка токенов
│   ├── generate-css-from-tokens.js  # Генерация CSS
│   └── check-contract-compliance.js # Проверка соответствия
│
├── tasks/                       # Детальные задачи (не в темплейтах!)
│   ├── TASK-[ID].md            # Спецификация задачи
│   └── EPIC-[ID].md            # Эпик с группой задач
│
├── logs/                        # Ежедневные таск-логи
│   └── [DATE]-tasklog.md       # Лог работы за день
│
│   ├── 00-onboarding-exercise.md    # Обучающее упражнение
│   ├── 01-button-simple-domain.md   # Simple домен (Button)
│   └── 02-scanner-complex-domain.md # Complex домен (Scanner)
│
├── memories/                    # Накопленное знание
│   ├── lessons-learned.md ## 🚀 Quick Start for AI

**Read this first:** [`QUICK-START.md`](QUICK-START.md) (15 min to productive work)

### Essential Reading (30 min)

1. **[`QUICK-START.md`](QUICK-START.md)** - How to use this methodology
2. **[`rules/00-universal.md`](rules/00-universal.md)** - 10 core principles
3. **[`rules/05-traceability-obligations.md`](rules/05-traceability-obligations.md)** - Mandatory practices
4. **[`workflows/task-management.md`](workflows/task-management.md)** - How to manage work

### Your First Task (15 min)

1. Create entry in `master-backlog.md`
2. Create detailed `tasks/TASK-ID.md` file
3. Start work following relevant workflow
4. Log work in `logs/[DATE]-tasklog.md`
5. Update `traceability-matrix.csv` on completion

### When to Update Rules
- Found new anti-pattern → add to `rules/03-anti-patterns.md`
- Discovered project-specific constraint → update `rules/02-project-specific.md`

### When to Update Workflows
- Optimized existing process → refine workflow file
- Created new repeatable procedure → add new workflow

### When to Update Memories
- Task completed with lessons learned → append to `memories/lessons-learned.md`
- Found what doesn't work → document in `memories/anti-patterns.md`

**How to update:** See `workflows/meta-update-knowledge.md`

---

## 📊 Metrics

Track these to measure methodology effectiveness:
- Contract compliance: % of components matching their contracts
- Reuse factor: Average times each component is used
- Blast radius violations: # of changes outside contract scope
- Token usage consistency: % of hardcoded values

---

## 🎓 For New AI Agents

**Onboarding sequence:**
1. Read this README
2. Work through `cookbook/00-onboarding-exercise.md`
3. Complete one simple task using workflow
4. Review and self-assess
5. Proceed to real project work

**Working memory management:**
- Keep context at 60-80% capacity
- Checkpoint progress before context full
- Reload from contracts + memories after reset

---

## 🔗 Philosophy

**Three core insights:**

1. **Generators over generated code**  
   Control the source (contracts, tokens) not the output (components, pages)

2. **Blast radius isolation**  
   Everything outside contract scope is invariant. Changes must be contained.

3. **De-automate AI thinking**  
   AI defaults to functional decomposition. Use contracts, holonic analysis, Cynefin to break autopilot.

---

## 📖 Deep Dive

For detailed understanding:
- **Contracts:** `rules/01-contracts.md`
- **Design Tokens:** `rules/02-design-tokens.md`
- **Task Graphs:** `rules/03-task-management.md`
- **Holonic Analysis:** `memories/holonic-framework.md`

---

**Next:** Start with `rules/00-universal.md`
