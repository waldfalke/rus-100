import * as React from 'react'
import { StudentData, StatData, SortState, SortDirection } from '../types'
import { extractNumericValue } from '../utils/formatters'

/**
 * Хук для управления сортировкой таблицы
 */
export function useTableSort(students: StudentData[], data: Record<string, StatData>) {
  const [sortState, setSortState] = React.useState<SortState>({
    column: null,
    direction: null
  })

  const handleSort = React.useCallback((columnKey: string) => {
    let newDirection: SortDirection = 'asc'

    if (sortState.column === columnKey) {
      if (sortState.direction === 'asc') {
        newDirection = 'desc'
      } else if (sortState.direction === 'desc') {
        newDirection = null
      }
    }

    setSortState({
      column: newDirection ? columnKey : null,
      direction: newDirection
    })
  }, [sortState])

  const sortedStudents = React.useMemo(() => {
    if (!sortState.column || !sortState.direction) {
      return students
    }

    return [...students].sort((a, b) => {
      // Специальная логика для сортировки по имени студента
      if (sortState.column === 'student') {
        const comparison = a.name.localeCompare(b.name, 'ru')
        return sortState.direction === 'asc' ? comparison : -comparison
      }

      const aValue = extractNumericValue(data[a.id]?.[sortState.column!])
      const bValue = extractNumericValue(data[b.id]?.[sortState.column!])

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0
      if (aValue == null) return sortState.direction === 'asc' ? 1 : -1
      if (bValue == null) return sortState.direction === 'asc' ? -1 : 1

      const comparison = aValue - bValue
      return sortState.direction === 'asc' ? comparison : -comparison
    })
  }, [students, data, sortState])

  return {
    sortState,
    sortedStudents,
    handleSort
  }
}
