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
    return <ChevronsUpDown className="w-4 h-4 ml-1 text-gray-400" />
  }

  if (direction === 'asc') {
    return <ChevronUp className="w-4 h-4 ml-1 text-gray-600" />
  }

  if (direction === 'desc') {
    return <ChevronDown className="w-4 h-4 ml-1 text-gray-600" />
  }

  return <ChevronsUpDown className="w-4 h-4 ml-1 text-gray-400" />
}
