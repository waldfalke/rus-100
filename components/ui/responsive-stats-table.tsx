"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { ChevronUp, ChevronDown, ChevronsUpDown, X, Maximize2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
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

export interface ColumnGroup {
  name: string
  key: string
  columns: StatColumn[]  // "Всего" + отдельные тесты
  collapsed?: boolean
}

export interface TaskDetails {
  taskName: string           // Название задания
  questionsCompleted: number  // Количество выполненных вопросов
  questionsTotal: number      // Всего вопросов
  successRate: number         // Процент успеха
  score: number               // Результат (баллы)
  maxScore: number            // Максимальный балл
  date: string                // Дата выполнения
}

export interface StatData {
  [key: string]: number | TaskDetails
}

export interface ResponsiveStatsTableProps {
  students: StudentData[]
  columns?: StatColumn[]  // Используется если нет columnGroups
  columnGroups?: ColumnGroup[]  // Новый способ с группами
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
  columns: columnsProp,
  columnGroups,
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
  const totalsScrollRef = React.useRef<HTMLDivElement>(null)
  const rowScrollRefs = React.useRef<(HTMLDivElement | null)[]>([])
  const [sortState, setSortState] = React.useState<SortState>({ column: null, direction: null })

  // State для управления collapsed группами
  const [collapsedGroups, setCollapsedGroups] = React.useState<Set<string>>(new Set())

  // Toggle collapse/expand группы
  const toggleGroupCollapse = (groupKey: string) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev)
      if (next.has(groupKey)) {
        next.delete(groupKey)
      } else {
        next.add(groupKey)
      }
      return next
    })
  }

  // Получаем видимые колонки с учётом collapsed состояния
  const visibleColumns = React.useMemo(() => {
    if (!columnGroups) {
      return columnsProp || []
    }

    return columnGroups.flatMap(group => {
      const isCollapsed = collapsedGroups.has(group.key)
      if (isCollapsed) {
        // Показываем только первую колонку (Всего)
        return group.columns.slice(0, 1)
      }
      return group.columns
    })
  }, [columnGroups, columnsProp, collapsedGroups])

  // Для обратной совместимости
  const columns = visibleColumns

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
    const totalsScroll = totalsScrollRef.current
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

    // Собираем все элементы для синхронизации (заголовок + строка итого + строки данных)
    const allScrollElements = totalsScroll
      ? [headerScroll, totalsScroll, ...rowScrolls]
      : [headerScroll, ...rowScrolls]

    // Синхронизация от заголовка
    const headerScrollHandler = syncScroll(headerScroll, allScrollElements.filter(el => el !== headerScroll))
    headerScroll.addEventListener('scroll', headerScrollHandler)

    // Синхронизация от строки итого (если есть)
    let totalsScrollHandler: (() => void) | null = null
    if (totalsScroll) {
      totalsScrollHandler = syncScroll(totalsScroll, allScrollElements.filter(el => el !== totalsScroll))
      totalsScroll.addEventListener('scroll', totalsScrollHandler)
    }

    // Синхронизация от строк к заголовку, итого и другим строкам
    const rowScrollHandlers = rowScrolls.map(rowScroll => {
      const handler = syncScroll(rowScroll, allScrollElements.filter(el => el !== rowScroll))
      rowScroll.addEventListener('scroll', handler)
      return { element: rowScroll, handler }
    })

    return () => {
      if (headerScroll) {
        headerScroll.removeEventListener('scroll', headerScrollHandler)
      }
      if (totalsScroll && totalsScrollHandler) {
        totalsScroll.removeEventListener('scroll', totalsScrollHandler)
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

      const headerCells = Array.from(headerTable.querySelectorAll('thead tr:first-child th'))
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

      // Вычисляем общую ширину таблицы
      const totalWidth = widths.reduce((sum, w) => sum + w, 0)

      // Устанавливаем минимальную ширину для обеих таблиц
      headerTable.style.minWidth = `${totalWidth}px`
      bodyTable.style.minWidth = `${totalWidth}px`

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

  const getCellClassName = (column: StatColumn, value: any) => {
    const baseClasses = "text-center"

    // Извлекаем числовое значение из TaskDetails если нужно
    let numericValue = value
    if (value && typeof value === 'object' && 'score' in value) {
      numericValue = (value as TaskDetails).score
    }

    switch (column.type) {
      case 'score':
        if (typeof numericValue === 'number') {
          if (numericValue >= 80) return cn(baseClasses, "text-green-600 font-medium")
          if (numericValue >= 60) return cn(baseClasses, "text-yellow-600")
          return cn(baseClasses, "text-red-600")
        }
        break
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

  const handleSort = (columnKey: string) => {
    // Специальный случай для колонки студента
    if (columnKey === 'student') {
      let newDirection: SortDirection = 'asc'

      if (sortState.column === columnKey) {
        if (sortState.direction === 'asc') {
          newDirection = 'desc'
        } else if (sortState.direction === 'desc') {
          newDirection = null
        }
      }

      setSortState({ column: newDirection ? columnKey : null, direction: newDirection })
      return
    }

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
      // Специальная логика для сортировки по имени студента
      if (sortState.column === 'student') {
        const comparison = a.name.localeCompare(b.name, 'ru')
        return sortState.direction === 'asc' ? comparison : -comparison
      }

      let aValue = data[a.id]?.[sortState.column!]
      let bValue = data[b.id]?.[sortState.column!]

      // Извлекаем числовые значения из TaskDetails если нужно
      if (aValue && typeof aValue === 'object' && 'score' in aValue) {
        aValue = (aValue as TaskDetails).score
      }
      if (bValue && typeof bValue === 'object' && 'score' in bValue) {
        bValue = (bValue as TaskDetails).score
      }

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

  // Вычисляем итоговые данные (средние значения) по каждой колонке
  const totalsData = React.useMemo(() => {
    const totals: Record<string, any> = {}

    columns.forEach(column => {
      const values = students
        .map(student => {
          const value = data[student.id]?.[column.key]
          // Извлекаем числовое значение из TaskDetails если нужно
          if (value && typeof value === 'object' && 'score' in value) {
            return (value as TaskDetails).score
          }
          return value
        })
        .filter(value => typeof value === 'number')

      if (values.length > 0) {
        const sum = values.reduce((acc, val) => acc + val, 0)
        const avg = sum / values.length
        totals[column.key] = Math.round(avg * 10) / 10 // Округляем до 1 знака
      } else {
        totals[column.key] = '-'
      }
    })

    return totals
  }, [students, data, columns])

  return (
    <TooltipProvider delayDuration={200}>
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
                  {/* Если используем columnGroups - рендерим двухуровневые заголовки */}
                  {columnGroups ? (
                    <>
                      {/* Первый ряд - названия групп */}
                      <tr>
                        <th
                          className={cn(
                            "student-column sticky top-0 z-20 bg-muted cursor-pointer hover:bg-muted/50 select-none",
                            stickyStudent && "sticky left-0"
                          )}
                          rowSpan={2}
                          onClick={() => handleSort('student')}
                        >
                          <div className="flex items-center justify-start">
                            Студент
                            {getSortIcon('student')}
                          </div>
                        </th>
                        {columnGroups.map((group) => {
                          const isCollapsed = collapsedGroups.has(group.key)
                          const visibleColCount = isCollapsed ? 1 : group.columns.length

                          return (
                            <th
                              key={group.key}
                              colSpan={visibleColCount}
                              className={cn(
                                "sticky top-0 z-10 bg-muted text-center p-2 border-b border-r-2 cursor-pointer hover:bg-muted/80 select-none",
                                "font-semibold text-sm"
                              )}
                              onClick={() => toggleGroupCollapse(group.key)}
                              title={isCollapsed ? "Развернуть группу" : "Свернуть группу"}
                            >
                              <div className="flex items-center justify-center gap-1">
                                <span>{group.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {isCollapsed ? '▶' : '▼'}
                                </span>
                              </div>
                            </th>
                          )
                        })}
                      </tr>

                      {/* Второй ряд - названия колонок */}
                      <tr>
                        {columns.map((column) => (
                          <th
                            key={column.key}
                            className={cn(
                              "sticky z-10 bg-muted text-center p-3 border-b text-xs",
                              (column.sortable !== false) && "cursor-pointer hover:bg-muted/50 select-none"
                            )}
                            style={{ top: '48px' }}
                            onClick={() => handleSort(column.key)}
                          >
                            <div className="flex items-center justify-center">
                              {column.label}
                              {column.sortable !== false && getSortIcon(column.key)}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </>
                  ) : (
                    /* Старый вариант - одноуровневые заголовки */
                    <tr>
                      <th
                        className={cn(
                          "student-column sticky top-0 z-20 bg-muted cursor-pointer hover:bg-muted/50 select-none",
                          stickyStudent && "sticky left-0"
                        )}
                        onClick={() => handleSort('student')}
                      >
                        <div className="flex items-center justify-start">
                          Студент
                          {getSortIcon('student')}
                        </div>
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
                  )}

                  {/* Строка "Итого" */}
                  <tr className="totals-row">
                <th
                  className={cn(
                    "student-column bg-muted font-semibold sticky z-30",
                    stickyStudent && "left-0"
                  )}
                  style={{ top: columnGroups ? '96px' : '56px' }}
                >
                  Итого
                </th>
                {columns.map((column) => {
                  const value = totalsData[column.key]
                  const formattedValue = formatValue(value, column)
                  return (
                    <Tooltip key={column.key}>
                      <TooltipTrigger asChild>
                        <th
                          className="sticky z-10 bg-muted text-center p-3 border-b font-semibold"
                          style={{ top: columnGroups ? '96px' : '56px' }}
                        >
                          <span className={getCellClassName(column, value)}>
                            {formattedValue}
                          </span>
                        </th>
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
                      stickyStudent && "sticky left-0 z-20"
                    )}>
                      <div className="student-info">
                        <div className="student-name">{student.name}</div>
                        <div className="student-email">{student.email}</div>
                      </div>
                    </td>
                    {columns.map((column) => {
                      const value = studentStats[column.key]
                      const formattedValue = formatValue(value, column)
                      const isTaskDetails = value && typeof value === 'object' && 'taskName' in value
                      const taskDetails = isTaskDetails ? (value as TaskDetails) : null

                      return (
                        <Tooltip key={column.key}>
                          <TooltipTrigger asChild>
                            <td
                              className={cn(
                                "p-3 border-b",
                                getCellClassName(column, value),
                                onCellClick && "cursor-pointer hover:bg-muted/50"
                              )}
                              onClick={() => onCellClick?.(student.id, column.key, value)}
                            >
                              {formattedValue}
                            </td>
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
            <div
              className="student-header cursor-pointer hover:bg-muted/50 select-none"
              onClick={() => handleSort('student')}
            >
              <div className="flex items-center justify-start">
                Студент
                {getSortIcon('student')}
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
                      const width = visibleColCount * 80 // 80px на колонку

                      return (
                        <div
                          key={group.key}
                          className="border-r-2 border-muted-foreground/20 cursor-pointer hover:bg-muted/80 select-none px-2 py-1 text-center font-semibold text-xs bg-muted/50"
                          style={{ minWidth: `${width}px`, width: `${width}px` }}
                          onClick={() => toggleGroupCollapse(group.key)}
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
                        key={column.key}
                        className={cn(
                          "header-cell text-xs",
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
              ) : (
                /* Одноуровневая структура */
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
                    <Tooltip key={column.key}>
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
                      const isTaskDetails = value && typeof value === 'object' && 'taskName' in value
                      const taskDetails = isTaskDetails ? (value as TaskDetails) : null

                      return (
                        <Tooltip key={column.key}>
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
    </div>
    </TooltipProvider>
  )
}

export { ResponsiveStatsTable }