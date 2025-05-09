# Контракт: Автоматизация проверки соответствия компонентов токенам

## Цель
Обеспечить автоматическую проверку того, что все компоненты и stories используют только актуальные design tokens и темы.

## Область действия
- Настройка lint-правил и тестов для проверки использования токенов
- Интеграция проверки в CI/CD pipeline
- Автоматическое уведомление о нарушениях (например, hardcoded-цвета, неиспользуемые токены)

## Требования
- Все stories и компоненты проходят автоматическую проверку на соответствие токенам
- В случае нарушения сборка падает или появляется предупреждение
- Проверка запускается автоматически при каждом pull request и деплое

## Критерии успеха
- Нет hardcoded-стилей и несанкционированных изменений токенов
- Все компоненты используют только утверждённые токены и темы

## Примечание
Контракт может быть делегирован другому агенту. Все термины раскрыты, неявных связей нет. 