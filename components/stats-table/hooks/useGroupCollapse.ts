import * as React from 'react'
import { ColumnGroup, StatColumn } from '../types'

/**
 * Хук для управления collapsed/expanded состоянием групп колонок
 */
export function useGroupCollapse(columnGroups?: ColumnGroup[], columnsProp?: StatColumn[]) {
  const [collapsedGroups, setCollapsedGroups] = React.useState<Set<string>>(new Set())

  const toggleGroupCollapse = React.useCallback((groupKey: string) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev)
      if (next.has(groupKey)) {
        next.delete(groupKey)
      } else {
        next.add(groupKey)
      }
      return next
    })
  }, [])

  const visibleColumns = React.useMemo(() => {
    if (!columnGroups) {
      return columnsProp || []
    }

    return columnGroups.flatMap(group => {
      const isCollapsed = collapsedGroups.has(group.key)
      if (isCollapsed) {
        // Показываем только первую колонку (Всего)
        return group.columns.slice(0, 1)
      }
      return group.columns
    })
  }, [columnGroups, columnsProp, collapsedGroups])

  return {
    collapsedGroups,
    toggleGroupCollapse,
    visibleColumns
  }
}
