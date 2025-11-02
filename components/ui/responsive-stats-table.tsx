/**
 * DEPRECATED: Этот файл сохранён для обратной совместимости
 *
 * Таблица была рефакторена используя Atomic Design архитектуру.
 * Новая структура находится в: components/stats-table/
 *
 * Архитектура:
 * - atoms/       - Базовые компоненты
 * - molecules/   - Композитные компоненты
 * - organisms/   - Сложные компоненты
 * - hooks/       - Кастомные хуки
 * - utils/       - Утилиты
 *
 * Для новых проектов используйте:
 * import { ResponsiveStatsTable } from '@/components/stats-table'
 */

export { ResponsiveStatsTable as default, ResponsiveStatsTable } from '@/components/stats-table'
export type {
  StudentData,
  StatColumn,
  ColumnGroup,
  TaskDetails,
  StatData,
  ResponsiveStatsTableProps
} from '@/components/stats-table'
