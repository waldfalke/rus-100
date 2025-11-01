# Memory Bank Directory
This directory is used for storing project-specific knowledge and configurations.

## Available Documentation

- [Build and Deploy Instructions](./build-and-deploy-instructions.md) - Инструкции по сборке и деплою проекта
- [Project Setup](./project-setup.md) - Настройка проекта
- [EGE Technical Architecture](./ege-technical-architecture.md) - Техническая архитектура системы
- [EGE Test Prep System](./ege-test-prep-system.md) - Общее описание системы подготовки к ЕГЭ
- [Storybook Integration Contract](../contracts/Storybook-Integration-Contract.md) - Контракт на внедрение Storybook и организацию библиотеки компонентов

## Примечание о проблемах со сборкой и зависимостями
В проекте наблюдались проблемы при сборке на GitHub Actions:
1. **Конфликты зависимостей:** Изначально возникали конфликты между версиями (`react-day-picker` и `date-fns`). Использование флага `--legacy-peer-deps` при установке (`npm ci --legacy-peer-deps`) позволяло обойти ошибку `ERESOLVE`, но не решало потенциальные проблемы совместимости.
2. **Ошибки памяти с Node.js 20:** При переходе на Node.js 20 в GitHub Actions сборка начала падать с ошибкой нехватки памяти (`Fatal JavaScript invalid size error`), даже при увеличении лимита до 4GB и 8GB (`NODE_OPTIONS=--max-old-space-size=...`).
3. **Решение:** Возврат к использованию **Node.js 18** в workflow `.github/workflows/nextjs.yml` позволил успешно завершить сборку без явного увеличения лимита памяти или использования `--legacy-peer-deps` (хотя конфликты peer зависимостей формально остаются).

**Рекомендации:**
- Использовать **Node.js 18** для сборки и деплоя через GitHub Actions до выяснения причин проблем с Node.js 20.
- При обновлении зависимостей или версии Node.js тщательно тестировать процесс сборки и деплоя.
- Помнить о потенциальных конфликтах peer-зависимостей.