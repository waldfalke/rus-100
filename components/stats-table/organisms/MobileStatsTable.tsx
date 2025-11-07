import * as React from 'react'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { StudentData, StatColumn, ColumnGroup, StatData, SortState, TaskDetails } from '../types'
import { SortIcon } from '../atoms/SortIcon'
import { formatValue, getCellClassName } from '../utils/formatters'
import { extractNumericValue } from '../utils/formatters'

interface MobileStatsTableProps {
  students: StudentData[]
  columns: StatColumn[]
  columnGroups?: ColumnGroup[]
  data: Record<string, StatData>
  sortState: SortState
  collapsedGroups: Set<string>
  onSort: (columnKey: string) => void
  onToggleGroup: (groupKey: string) => void
  onCellClick?: (studentId: string, columnKey: string, value: any) => void
  headerScrollRef: React.RefObject<HTMLDivElement>
  totalsScrollRef: React.RefObject<HTMLDivElement>
  rowScrollRefs: React.MutableRefObject<(HTMLDivElement | null)[]>
}

/**
 * Организм: Мобильная версия таблицы (A'/A'' паттерн)
 */
export function MobileStatsTable({
  students,
  columns,
  columnGroups,
  data,
  sortState,
  collapsedGroups,
  onSort,
  onToggleGroup,
  onCellClick,
  headerScrollRef,
  totalsScrollRef,
  rowScrollRefs
}: MobileStatsTableProps) {
  // Вычисляем итоговые данные
  const totalsData = React.useMemo(() => {
    const totals: Record<string, any> = {}

    columns.forEach(column => {
      const values = students
        .map(student => extractNumericValue(data[student.id]?.[column.key]))
        .filter((value): value is number => value !== null)

      if (values.length > 0) {
        const sum = values.reduce((acc, val) => acc + val, 0)
        const avg = sum / values.length
        totals[column.key] = Math.round(avg * 10) / 10
      } else {
        totals[column.key] = '-'
      }
    })

    return totals
  }, [students, data, columns])

  return (
    <div className="mobile-table">
      {/* Фиксированный заголовок */}
      <div className="header fixed-header">
        <div className="header-content">
          <div
            className="student-header cursor-pointer hover:bg-muted/50 select-none"
            onClick={() => onSort('student')}
          >
            <div className="flex items-center justify-start">
              Студент
              <SortIcon
                isActive={sortState.column === 'student'}
                direction={sortState.direction}
              />
            </div>
          </div>
          <div className="stats-header" ref={headerScrollRef}>
            {columnGroups ? (
              /* Двухуровневая структура с группами */
              <div className="stats-header-content-grouped">
                {/* Ряд групп */}
                <div className="flex">
                  {columnGroups.map((group) => {
                    const isCollapsed = collapsedGroups.has(group.key)
                    const visibleColCount = isCollapsed ? 1 : group.columns.length
                    const width = visibleColCount * 80

                    return (
                      <div
                        key={group.key}
                        className="border-r-2 border-muted-foreground/20 cursor-pointer hover:bg-muted/80 select-none px-2 py-1 text-center font-semibold text-xs bg-muted/50"
                        style={{ minWidth: `${width}px`, width: `${width}px` }}
                        onClick={() => onToggleGroup(group.key)}
                      >
                        {group.name} {isCollapsed ? '▶' : '▼'}
                      </div>
                    )
                  })}
                </div>
                {/* Ряд колонок */}
                <div className="flex">
                  {columns.map((column) => (
                    <div
                      key={`header-${column.key}`}
                      className={cn(
                        "header-cell text-xs",
                        (column.sortable !== false) && "cursor-pointer hover:bg-muted/50 select-none"
                      )}
                      onClick={() => onSort(column.key)}
                    >
                      <div className="flex items-center justify-center">
                        {column.label}
                        {column.sortable !== false && (
                          <SortIcon
                            isActive={sortState.column === column.key}
                            direction={sortState.direction}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Одноуровневая структура */
              <div className="stats-header-content">
                {columns.map((column) => (
                  <div
                    key={`header-${column.key}`}
                    className={cn(
                      "header-cell",
                      (column.sortable !== false) && "cursor-pointer hover:bg-muted/50 select-none"
                    )}
                    onClick={() => onSort(column.key)}
                  >
                    <div className="flex items-center justify-center">
                      {column.label}
                      {column.sortable !== false && (
                        <SortIcon
                          isActive={sortState.column === column.key}
                          direction={sortState.direction}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Фиксированная строка "Итого" */}
      <div className="totals-row-mobile fixed-totals">
        <div className="totals-content">
          <div className="student-totals font-semibold">
            Итого
          </div>
          <div className="stats-totals" ref={totalsScrollRef}>
            <div className="stats-totals-content">
              {columns.map((column) => {
                const value = totalsData[column.key]
                const formattedValue = formatValue(value, column)
                return (
                  <Tooltip key={`total-${column.key}`}>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          "total-cell font-semibold",
                          getCellClassName(column, value)
                        )}
                      >
                        {formattedValue}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-xs">
                        <p className="font-semibold">Среднее значение</p>
                        <p className="text-muted-foreground">{column.label}: {formattedValue}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Тело таблицы */}
      <div className="table-body">
        {students.map((student, studentIndex) => {
          const studentStats = data[student.id] || {}

          return (
            <div key={student.id} className="record">
              {/* A' - Фиксированная строка с информацией о студенте */}
              <div className="row-a-prime fixed-row">
                <div className="student-info">
                  <div className="student-name">{student.name}</div>
                  <div className="student-email">{student.email}</div>
                </div>
              </div>

              {/* A'' - Скроллируемая строка с данными */}
              <div
                className="row-a-double scrollable-row"
                ref={(el) => {
                  rowScrollRefs.current[studentIndex] = el
                }}
              >
                <div className="stats-content">
                  {columns.map((column) => {
                    const value = studentStats[column.key]
                    const formattedValue = formatValue(value, column)
                    const isTaskDetails = value && typeof value === 'object' && 'taskName' in value
                    const taskDetails = isTaskDetails ? (value as TaskDetails) : null

                    return (
                      <Tooltip key={`cell-${student.id}-${column.key}`}>
                        <TooltipTrigger asChild>
                          <div
                            className={cn(
                              "stat-cell",
                              getCellClassName(column, value),
                              onCellClick && "cursor-pointer hover:bg-muted/50"
                            )}
                            onClick={() => onCellClick?.(student.id, column.key, value)}
                          >
                            {formattedValue}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <div className="text-xs space-y-1">
                            <p className="text-muted-foreground">{student.email}</p>
                            {taskDetails ? (
                              <>
                                <p className="font-semibold">{taskDetails.taskName}</p>
                                <p className="text-muted-foreground">
                                  Выполнено {taskDetails.questionsCompleted} вопросов, успешно: {taskDetails.successRate}%
                                </p>
                                <p className="font-medium">
                                  Результат {taskDetails.score}/{taskDetails.maxScore} от {taskDetails.date}
                                </p>
                              </>
                            ) : (
                              <>
                                <p className="font-semibold">{student.name}</p>
                                <p className="text-muted-foreground">{column.label}: {formattedValue}</p>
                              </>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
