/**
 * Stats Table - Atomic Design Architecture
 *
 * Структура:
 * - atoms/       - Базовые компоненты (SortIcon, StudentInfo, TableCell, TableHeader)
 * - molecules/   - Композитные компоненты (GroupHeader, StudentRow, TotalsRow)
 * - organisms/   - Сложные компоненты (DesktopStatsTable, MobileStatsTable)
 * - hooks/       - Кастомные хуки (useTableSort, useGroupCollapse, useScrollSync, useColumnWidths)
 * - utils/       - Утилиты (formatters)
 * - types.ts     - TypeScript типы
 */

// Главный компонент
export { default as ResponsiveStatsTable } from './ResponsiveStatsTableOrganism'

// Типы для внешнего использования
export type {
  StudentData,
  StatColumn,
  ColumnGroup,
  TaskDetails,
  StatData,
  SortDirection,
  SortState,
  ResponsiveStatsTableProps
} from './types'

// CSS (импортируется автоматически в ResponsiveStatsTableOrganism)
