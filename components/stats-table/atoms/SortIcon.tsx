import * as React from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import { SortDirection } from '../types'

interface SortIconProps {
  isActive: boolean
  direction: SortDirection
}

/**
 * Атом: Иконка сортировки
 */
export function SortIcon({ isActive, direction }: SortIconProps) {
  if (!isActive) {
    return <ChevronsUpDown className="w-3 h-3 text-gray-400 flex-shrink-0" />
  }

  if (direction === 'asc') {
    return <ChevronUp className="w-3 h-3 text-gray-600 flex-shrink-0" />
  }

  if (direction === 'desc') {
    return <ChevronDown className="w-3 h-3 text-gray-600 flex-shrink-0" />
  }

  return <ChevronsUpDown className="w-3 h-3 text-gray-400 flex-shrink-0" />
}
