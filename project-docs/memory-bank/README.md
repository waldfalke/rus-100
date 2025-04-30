# Memory Bank Directory
This directory is used for storing project-specific knowledge and configurations.

## Available Documentation

- [Build and Deploy Instructions](./build-and-deploy-instructions.md) - Инструкции по сборке и деплою проекта
- [Project Setup](./project-setup.md) - Настройка проекта
- [EGE Technical Architecture](./ege-technical-architecture.md) - Техническая архитектура системы
- [EGE Test Prep System](./ege-test-prep-system.md) - Общее описание системы подготовки к ЕГЭ
- [Storybook Integration Contract](../contracts/Storybook-Integration-Contract.md) - Контракт на внедрение Storybook и организацию библиотеки компонентов

## Примечание о dependency hell и расхождении версий
В проекте возможны конфликты между версиями зависимостей (например, date-fns@4.1.0 и react-day-picker@8.10.1), что затрудняет установку и интеграцию инструментов вроде Storybook. npm v7+ строго проверяет peer dependencies, и любые обходы (npm install --legacy-peer-deps, --force) не гарантируют стабильную работу. Рекомендуется изолировать инфраструктурные инструменты или формализовать процесс обновления зависимостей.