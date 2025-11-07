import * as React from 'react'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { StatColumn, StudentData, StatData } from '../types'
import { formatValue, getCellClassName, extractNumericValue } from '../utils/formatters'

interface TotalsRowProps {
  columns: StatColumn[]
  students: StudentData[]
  data: Record<string, StatData>
  columnGroups?: boolean
  stickyStudent?: boolean
}

/**
 * Молекула: Строка итогов (средние значения)
 */
export function TotalsRow({
  columns,
  students,
  data,
  columnGroups,
  stickyStudent
}: TotalsRowProps) {
  // Вычисляем итоговые данные (средние значения) по каждой колонке
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
    <tr className="totals-row">
      <th
        className={cn(
          "student-column bg-muted font-semibold sticky z-30",
          stickyStudent && "left-0"
        )}
        style={{
          top: columnGroups ? '96px' : '56px',
          width: '200px',
          minWidth: '200px',
          maxWidth: '200px'
        }}
      >
        Итого
      </th>
      {columns.map((column) => {
        const value = totalsData[column.key]
        const formattedValue = formatValue(value, column)
        return (
          <th
            key={column.key}
            className={cn(
              "sticky z-10 bg-muted text-center border-b font-semibold",
              column.isHidden && "column-hidden"
            )}
            style={{ top: columnGroups ? '96px' : '56px' }}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <span className={cn("w-full h-full flex items-center justify-center", getCellClassName(column, value))}>
                  {formattedValue}
                </span>
              </TooltipTrigger>
              <TooltipContent
                className="z-[9999]"
                sideOffset={8}
                side="top"
                align="center"
                collisionPadding={16}
                avoidCollisions={true}
                sticky="always"
              >
                <div className="text-xs">
                  <p className="font-semibold">Среднее значение</p>
                  <p className="text-muted-foreground">{column.label}: {formattedValue}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </th>
        )
      })}
    </tr>
  )
}
