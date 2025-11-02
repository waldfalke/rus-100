import * as React from 'react'
import { cn } from '@/lib/utils'
import { ColumnGroup } from '../types'

interface GroupHeaderProps {
  group: ColumnGroup
  isCollapsed: boolean
  onToggle: (groupKey: string) => void
}

/**
 * Молекула: Заголовок группы колонок с collapse/expand
 */
export function GroupHeader({ group, isCollapsed, onToggle }: GroupHeaderProps) {
  const visibleColCount = isCollapsed ? 1 : group.columns.length

  return (
    <th
      colSpan={visibleColCount}
      className={cn(
        "sticky top-0 z-10 bg-muted text-center border-b border-r-2 cursor-pointer hover:bg-muted/80 select-none",
        "font-semibold text-sm whitespace-nowrap"
      )}
      onClick={() => onToggle(group.key)}
      title={isCollapsed ? "Развернуть группу" : "Свернуть группу"}
    >
      <div className="flex items-center justify-center gap-1 py-1 px-2">
        <span>{group.name}</span>
        <span className="text-xs text-muted-foreground">
          {isCollapsed ? '▶' : '▼'}
        </span>
      </div>
    </th>
  )
}
