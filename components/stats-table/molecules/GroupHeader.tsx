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
  // colspan всегда равен полному количеству колонок в группе
  // Скрытые колонки имеют width: 0 в <colgroup>, но остаются в DOM
  const colSpan = group.columns.length

  return (
    <th
      colSpan={colSpan}
      className={cn(
        "sticky top-0 z-10 bg-muted text-center border-b border-r-2 cursor-pointer hover:bg-muted/80 select-none",
        "font-semibold text-sm"
      )}
      onClick={() => onToggle(group.key)}
      title={group.name}
    >
      <div className="flex items-center justify-center gap-1 py-1 px-2">
        <span className="whitespace-nowrap">{group.name}</span>
        <span className="text-xs text-muted-foreground flex-shrink-0">
          {isCollapsed ? '▶' : '▼'}
        </span>
      </div>
    </th>
  )
}
