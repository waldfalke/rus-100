import { StatColumn, TaskDetails } from '../types'
import { cn } from '@/lib/utils'

/**
 * Форматирование значения ячейки в соответствии с типом колонки
 */
export function formatValue(value: any, column: StatColumn): string {
  if (column.format) {
    return column.format(value)
  }

  // Если значение - это TaskDetails, извлекаем score
  if (value && typeof value === 'object' && 'score' in value) {
    const taskDetails = value as TaskDetails
    return taskDetails.score.toFixed(1)
  }

  switch (column.type) {
    case 'percentage':
      return `${value}%`
    case 'score':
      return typeof value === 'number' ? value.toFixed(1) : value
    default:
      return value?.toString() || '-'
  }
}

/**
 * Получение CSS классов для ячейки в зависимости от значения
 */
export function getCellClassName(column: StatColumn, value: any): string {
  const baseClasses = "text-center"

  // Извлекаем числовое значение из TaskDetails если нужно
  let numericValue = value
  if (value && typeof value === 'object' && 'score' in value) {
    numericValue = (value as TaskDetails).score
  }

  switch (column.type) {
    case 'score':
    case 'percentage':
      if (typeof numericValue === 'number') {
        if (numericValue >= 80) return cn(baseClasses, "text-green-600 font-medium")
        if (numericValue >= 60) return cn(baseClasses, "text-yellow-600")
        return cn(baseClasses, "text-red-600")
      }
      break
  }

  return baseClasses
}

/**
 * Извлечение числового значения из данных (в том числе из TaskDetails)
 */
export function extractNumericValue(value: any): number | null {
  if (value == null) return null

  if (typeof value === 'number') return value

  if (value && typeof value === 'object' && 'score' in value) {
    return (value as TaskDetails).score
  }

  return null
}
