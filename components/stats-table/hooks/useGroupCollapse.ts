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

    // Вместо удаления колонок из DOM, помечаем их флагом isHidden
    // Это позволяет использовать visibility: collapse для стабильной ширины таблицы
    return columnGroups.flatMap(group => {
      const isCollapsed = collapsedGroups.has(group.key)

      return group.columns.map((column, index) => {
        // Первая колонка (Всего) всегда видима, остальные скрыты при collapse
        const isHidden = isCollapsed && index > 0

        return {
          ...column,
          isHidden
        }
      })
    })
  }, [columnGroups, columnsProp, collapsedGroups])

  return {
    collapsedGroups,
    toggleGroupCollapse,
    visibleColumns
  }
}
