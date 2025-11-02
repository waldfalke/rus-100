import * as React from 'react'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { StatColumn, TaskDetails } from '../types'
import { formatValue, getCellClassName } from '../utils/formatters'

interface TableCellProps {
  value: any
  column: StatColumn
  studentEmail?: string
  studentName?: string
  onClick?: () => void
  className?: string
}

/**
 * Атом: Базовая ячейка таблицы с tooltip
 */
export function TableCell({
  value,
  column,
  studentEmail,
  studentName,
  onClick,
  className = ''
}: TableCellProps) {
  const formattedValue = formatValue(value, column)
  const isTaskDetails = value && typeof value === 'object' && 'taskName' in value
  const taskDetails = isTaskDetails ? (value as TaskDetails) : null

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <td
          className={cn(
            "p-3 border-b",
            getCellClassName(column, value),
            onClick && "cursor-pointer hover:bg-muted/50",
            className
          )}
          onClick={onClick}
        >
          {formattedValue}
        </td>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <div className="text-xs space-y-1">
          {studentEmail && <p className="text-muted-foreground">{studentEmail}</p>}
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
              {studentName && <p className="font-semibold">{studentName}</p>}
              <p className="text-muted-foreground">{column.label}: {formattedValue}</p>
            </>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
