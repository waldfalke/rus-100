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
    <td
      className={cn(
        getCellClassName(column, value),
        onClick && "cursor-pointer",
        column.isHidden && "column-hidden",
        className
      )}
      onClick={onClick}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="w-full h-full flex items-center justify-center">
            {formattedValue}
          </span>
        </TooltipTrigger>
        <TooltipContent
          className="max-w-xs z-[9999]"
          sideOffset={8}
          side="top"
          align="center"
          collisionPadding={16}
          avoidCollisions={true}
          sticky="always"
        >
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
    </td>
  )
}
