"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { ChevronUp, ChevronDown, ChevronsUpDown, X, Maximize2 } from "lucide-react"
import "./responsive-stats-table.css"

export interface StudentData {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface StatColumn {
  key: string
  label: string
  type: 'score' | 'percentage' | 'count' | 'text'
  format?: (value: any) => string
  sortable?: boolean
}

export interface StatData {
  [key: string]: any
}

export interface ResponsiveStatsTableProps {
  students: StudentData[]
  columns: StatColumn[]
  data: Record<string, StatData> // studentId -> таблица статистики
  className?: string
  stickyStudent?: boolean
  onCellClick?: (studentId: string, columnKey: string, value: any) => void
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  onSort?: (column: string, order: 'asc' | 'desc') => void
}

type SortDirection = 'asc' | 'desc' | null
type SortState = {
  column: string | null
  direction: SortDirection
}

export default function ResponsiveStatsTable({ 
  students, 
  columns, 
  data, 
  className, 
  stickyStudent = true,
  onCellClick,
  sortBy,
  sortOrder,
  onSort,
  ...props 
}: ResponsiveStatsTableProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const headerScrollRef = React.useRef<HTMLDivElement>(null)
  const rowScrollRefs = React.useRef<(HTMLDivElement | null)[]>([])
  const [sortState, setSortState] = React.useState<SortState>({ column: null, direction: null })

  // Рефы для синхронизации скролла и ширин десктопной таблицы
  const desktopHeaderScrollRef = React.useRef<HTMLDivElement>(null)
  const desktopBodyScrollRef = React.useRef<HTMLDivElement>(null)
  const desktopHeaderTableRef = React.useRef<HTMLTableElement>(null)
  const desktopBodyTableRef = React.useRef<HTMLTableElement>(null)
  const [columnWidths, setColumnWidths] = React.useState<string[]>([])

  // Определение мобильного устройства; полноэкранный режим включаем вручную кнопкой
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
      setIsFullscreen(false) // Не включаем авто-полноэкранный режим
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Блокируем скролл body в полноэкранном режиме
  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    if (isFullscreen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = prevOverflow || ''
    }
    return () => {
      document.body.style.overflow = prevOverflow || ''
    }
  }, [isFullscreen])

  // Синхронизация горизонтального скролла (только для мобильной версии)
  React.useEffect(() => {
    const headerScroll = headerScrollRef.current
    const rowScrolls = rowScrollRefs.current.filter((ref): ref is HTMLDivElement => ref !== null)

    if (!headerScroll || rowScrolls.length === 0) return

    const syncScroll = (source: HTMLDivElement, targets: HTMLDivElement[]) => {
      return () => {
        const scrollLeft = source.scrollLeft
        targets.forEach(target => {
          if (target !== source) {
            target.scrollLeft = scrollLeft
          }
        })
      }
    }

    // Синхронизация от заголовка к строкам
    const headerScrollHandler = syncScroll(headerScroll, rowScrolls)
    headerScroll.addEventListener('scroll', headerScrollHandler)

    // Синхронизация от строк к заголовку и другим строкам
    const rowScrollHandlers = rowScrolls.map(rowScroll => {
      const handler = syncScroll(rowScroll, [headerScroll, ...rowScrolls])
      rowScroll.addEventListener('scroll', handler)
      return { element: rowScroll, handler }
    })

    return () => {
      if (headerScroll) {
        headerScroll.removeEventListener('scroll', headerScrollHandler)
      }
      rowScrollHandlers.forEach(({ element, handler }) => {
        if (element) {
          element.removeEventListener('scroll', handler)
        }
      })
    }
  }, [students.length])

  // Синхронизация ширин колонок и горизонтального скролла десктопной таблицы
  React.useEffect(() => {
    if (isMobile) return

    const headerScroll = desktopHeaderScrollRef.current
    const bodyScroll = desktopBodyScrollRef.current
    const headerTable = desktopHeaderTableRef.current
    const bodyTable = desktopBodyTableRef.current

    if (!headerScroll || !bodyScroll || !headerTable || !bodyTable) return

    // Функция синхронизации ширин колонок
    const syncColumnWidths = () => {
      // Временно переключаем на auto для измерения реальных ширин
      headerTable.style.tableLayout = 'auto'
      bodyTable.style.tableLayout = 'auto'

      const headerCells = Array.from(headerTable.querySelectorAll('thead th'))
      const bodyCells = Array.from(bodyTable.querySelectorAll('tbody tr:first-child td'))

      // Измеряем и берём максимальную ширину для каждой колонки
      const widths = headerCells.map((headerCell, idx) => {
        const headerWidth = headerCell.getBoundingClientRect().width
        const bodyWidth = bodyCells[idx]?.getBoundingClientRect().width || 0
        return Math.max(headerWidth, bodyWidth)
      })

      // Возвращаем fixed layout
      headerTable.style.tableLayout = 'fixed'
      bodyTable.style.tableLayout = 'fixed'

      // Сохраняем вычисленные ширины в state
      setColumnWidths(widths.map(w => `${w}px`))
    }

    // Синхронизация горизонтального скролла
    const syncFromHeader = () => {
      bodyScroll.scrollLeft = headerScroll.scrollLeft
    }

    const syncFromBody = () => {
      headerScroll.scrollLeft = bodyScroll.scrollLeft
    }

    // Первичная синхронизация ширин
    syncColumnWidths()

    // Слушаем события скролла
    headerScroll.addEventListener('scroll', syncFromHeader)
    bodyScroll.addEventListener('scroll', syncFromBody)

    // ResizeObserver для динамического пересчёта ширин
    const resizeObserver = new ResizeObserver(() => {
      syncColumnWidths()
    })

    if (headerTable.parentElement) {
      resizeObserver.observe(headerTable.parentElement)
    }

    return () => {
      if (headerScroll) {
        headerScroll.removeEventListener('scroll', syncFromHeader)
      }
      if (bodyScroll) {
        bodyScroll.removeEventListener('scroll', syncFromBody)
      }
      resizeObserver.disconnect()
    }
  }, [isMobile, students.length, columns.length])

  const formatValue = (value: any, column: StatColumn) => {
    if (column.format) {
      return column.format(value)
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

  const getCellClassName = (column: StatColumn, value: any) => {
    const baseClasses = "text-center"
    
    switch (column.type) {
      case 'score':
        if (typeof value === 'number') {
          if (value >= 80) return cn(baseClasses, "text-green-600 font-medium")
          if (value >= 60) return cn(baseClasses, "text-yellow-600")
          return cn(baseClasses, "text-red-600")
        }
        break
      case 'percentage':
        if (typeof value === 'number') {
          if (value >= 80) return cn(baseClasses, "text-green-600 font-medium")
          if (value >= 60) return cn(baseClasses, "text-yellow-600")
          return cn(baseClasses, "text-red-600")
        }
        break
    }
    
    return baseClasses
  }

  const handleSort = (columnKey: string) => {
    const column = columns.find(col => col.key === columnKey)
    if (!column || column.sortable === false) return

    let newDirection: SortDirection = 'asc'
    
    if (sortState.column === columnKey) {
      if (sortState.direction === 'asc') {
        newDirection = 'desc'
      } else if (sortState.direction === 'desc') {
        newDirection = null
      }
    }
    
    setSortState({ column: newDirection ? columnKey : null, direction: newDirection })
  }

  const getSortIcon = (columnKey: string) => {
    if (sortState.column !== columnKey) {
      return <ChevronsUpDown className="w-4 h-4 ml-1 text-gray-400" />
    }
    
    if (sortState.direction === 'asc') {
      return <ChevronUp className="w-4 h-4 ml-1 text-gray-600" />
    }
    
    if (sortState.direction === 'desc') {
      return <ChevronDown className="w-4 h-4 ml-1 text-gray-600" />
    }
    
    return <ChevronsUpDown className="w-4 h-4 ml-1 text-gray-400" />
  }

  const sortedStudents = React.useMemo(() => {
    if (!sortState.column || !sortState.direction) {
      return students
    }

    return [...students].sort((a, b) => {
      const aValue = data[a.id]?.[sortState.column!]
      const bValue = data[b.id]?.[sortState.column!]
      
      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0
      if (aValue == null) return sortState.direction === 'asc' ? 1 : -1
      if (bValue == null) return sortState.direction === 'asc' ? -1 : 1
      
      // Compare values
      let comparison = 0
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue
      } else {
        comparison = String(aValue).localeCompare(String(bValue))
      }
      
      return sortState.direction === 'asc' ? comparison : -comparison
    })
  }, [students, data, sortState])

  return (
      <div className={cn(
        "responsive-stats-table relative", 
        isFullscreen && "fullscreen-mode",
        className
      )} {...props}>
        
        {/* Кнопка закрытия полноэкранного режима */}
        {isFullscreen && !isMobile && (
          <button
            onClick={() => setIsFullscreen(false)}
            className="fixed top-4 right-4 z-50 p-2 bg-background border border-border rounded-md hover:bg-muted transition-colors"
            aria-label="Закрыть полноэкранный режим"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Кнопка разворачивания таблицы */}
        {!isFullscreen && !isMobile && (
          <button
            onClick={() => setIsFullscreen(true)}
            className="absolute top-2 right-2 z-30 p-2 bg-background border border-border rounded-md hover:bg-muted transition-colors"
            aria-label="Развернуть таблицу"
            title="Развернуть таблицу"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        )}
        
        {/* Десктопная версия - обычная таблица */}
        <div className="table-scroll-container">
          <div className="desktop-table">
            {/* Header table - БЕЗ overflow, sticky к viewport */}
            <div className="overflow-x-auto [scrollbar-gutter:stable]" ref={desktopHeaderScrollRef}>
              <table className="w-full" ref={desktopHeaderTableRef}>
                {columnWidths.length > 0 && (
                  <colgroup>
                    {columnWidths.map((width, idx) => (
                      <col key={idx} style={{ width }} />
                    ))}
                  </colgroup>
                )}
                <thead>
                  <tr>
                    <th
                      className={cn(
                        "student-column sticky top-0 z-20 bg-muted",
                        stickyStudent && "sticky left-0"
                      )}
                    >
                      Студент
                    </th>
                {columns.map((column) => (
                   <th
                     key={column.key}
                     className={cn(
                       "sticky top-0 z-10 bg-muted text-center p-3 border-b",
                       (column.sortable !== false) && "cursor-pointer hover:bg-muted/50 select-none"
                     )}
                     onClick={() => handleSort(column.key)}
                   >
                     <div className="flex items-center justify-center">
                       {column.label}
                       {column.sortable !== false && getSortIcon(column.key)}
                     </div>
                   </th>
                 ))}
              </tr>
            </thead>
          </table>
        </div>

        {/* Body table - С overflow для скролла */}
        <div
          ref={desktopBodyScrollRef}
          className={cn(
            "[scrollbar-gutter:stable]",
            isFullscreen ? "table-body-scroll" : "overflow-x-auto overflow-y-auto max-h-[70vh]"
          )}
        >
          <table className="w-full" ref={desktopBodyTableRef}>
            {columnWidths.length > 0 && (
              <colgroup>
                {columnWidths.map((width, idx) => (
                  <col key={idx} style={{ width }} />
                ))}
              </colgroup>
            )}
            <tbody>
               {sortedStudents.map((student) => {
                const studentStats = data[student.id] || {}

                return (
                  <tr key={student.id}>
                    <td className={cn(
                      "student-column bg-background",
                      stickyStudent && "sticky left-0 z-10"
                    )}>
                      <div className="student-info">
                        <div className="student-name">{student.name}</div>
                        <div className="student-email">{student.email}</div>
                      </div>
                    </td>
                    {columns.map((column) => {
                      const value = studentStats[column.key]
                      const formattedValue = formatValue(value, column)

                      return (
                        <td
                          key={column.key}
                          className={cn(
                            "p-3 border-b",
                            getCellClassName(column, value),
                            onCellClick && "cursor-pointer hover:bg-muted/50"
                          )}
                          onClick={() => onCellClick?.(student.id, column.key, value)}
                        >
                          {formattedValue}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        </div>
      </div>

      {/* Мобильная версия - A'/A'' паттерн */}
      <div className="mobile-table">
        {/* Фиксированный заголовок */}
        <div className="header fixed-header">
          <div className="header-content">
            <div className="student-header">Студент</div>
            <div className="stats-header" ref={headerScrollRef}>
              <div className="stats-header-content">
                 {columns.map((column) => (
                   <div 
                     key={column.key} 
                     className={cn(
                       "header-cell",
                       (column.sortable !== false) && "cursor-pointer hover:bg-muted/50 select-none"
                     )}
                     onClick={() => handleSort(column.key)}
                   >
                     <div className="flex items-center justify-center">
                       {column.label}
                       {column.sortable !== false && getSortIcon(column.key)}
                     </div>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        </div>

        {/* Тело таблицы */}
         <div className="table-body">
           {sortedStudents.map((student, studentIndex) => {
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
                      
                      return (
                        <div
                          key={column.key}
                          className={cn(
                            "stat-cell",
                            getCellClassName(column, value),
                            onCellClick && "cursor-pointer hover:bg-muted/50"
                          )}
                          onClick={() => onCellClick?.(student.id, column.key, value)}
                        >
                          {formattedValue}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export { ResponsiveStatsTable }