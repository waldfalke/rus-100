/**
 * Типы для компонентов статистической таблицы
 */

export interface StudentData {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface StatColumn {
  key: string
  label: string
  type: 'score' | 'percentage' | 'count' | 'text'
  format?: (value: any) => string
  sortable?: boolean
  isHidden?: boolean
}

export interface ColumnGroup {
  name: string
  key: string
  columns: StatColumn[]
  collapsed?: boolean
}

export interface TaskDetails {
  taskName: string
  questionsCompleted: number
  questionsTotal: number
  successRate: number
  score: number
  maxScore: number
  date: string
}

export interface StatData {
  [key: string]: number | string | TaskDetails
}

export type SortDirection = 'asc' | 'desc' | null

export interface SortState {
  column: string | null
  direction: SortDirection
}

export interface ResponsiveStatsTableProps {
  students: StudentData[]
  columns?: StatColumn[]
  columnGroups?: ColumnGroup[]
  data: Record<string, StatData>
  className?: string
  stickyStudent?: boolean
  onCellClick?: (studentId: string, columnKey: string, value: any) => void
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  onSort?: (column: string, order: 'asc' | 'desc') => void
}
