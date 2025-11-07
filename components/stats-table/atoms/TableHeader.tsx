import * as React from 'react'
import { cn } from '@/lib/utils'
import { StatColumn, SortState } from '../types'
import { SortIcon } from './SortIcon'

interface TableHeaderProps {
  column: StatColumn
  sortState: SortState
  onSort: (columnKey: string) => void
  style?: React.CSSProperties
  className?: string
}

/**
 * Атом: Заголовок колонки таблицы
 */
export function TableHeader({
  column,
  sortState,
  onSort,
  style,
  className = ''
}: TableHeaderProps) {
  const isSortable = column.sortable !== false
  const isActive = sortState.column === column.key

  return (
    <th
      className={cn(
        "sticky z-10 bg-muted text-center border-b text-xs whitespace-nowrap",
        isSortable && "cursor-pointer hover:bg-muted/50 select-none",
        column.isHidden && "column-hidden",
        className
      )}
      style={style}
      onClick={() => isSortable && onSort(column.key)}
    >
      <div className="flex items-center justify-center gap-0.5 px-1 py-2">
        <span>{column.label}</span>
        {isSortable && (
          <SortIcon isActive={isActive} direction={sortState.direction} />
        )}
      </div>
    </th>
  )
}
