"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { X, Maximize2 } from "lucide-react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ResponsiveStatsTableProps } from './types'
import { useTableSort } from './hooks/useTableSort'
import { useGroupCollapse } from './hooks/useGroupCollapse'
import { useScrollSync } from './hooks/useScrollSync'
import { useColumnWidths } from './hooks/useColumnWidths'
import { DesktopStatsTable } from './organisms/DesktopStatsTable'
import { MobileStatsTable } from './organisms/MobileStatsTable'
import './responsive-stats-table.css'

/**
 * Организм: Адаптивная таблица статистики
 *
 * Главный координатор, управляющий всей логикой таблицы:
 * - Переключение desktop/mobile версий
 * - Управление полноэкранным режимом
 * - Координация хуков и передача данных дочерним компонентам
 */
export default function ResponsiveStatsTableOrganism({
  students,
  columns: columnsProp,
  columnGroups,
  data,
  className,
  stickyStudent = true,
  onCellClick,
  ...props
}: ResponsiveStatsTableProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Используем кастомные хуки
  const { sortState, sortedStudents, handleSort } = useTableSort(students, data)
  const { collapsedGroups, toggleGroupCollapse, visibleColumns } = useGroupCollapse(columnGroups, columnsProp)
  const mobileScrollSync = useScrollSync([students.length])
  const desktopColumnSync = useColumnWidths(isMobile, [students.length, visibleColumns.length])

  // Определение мобильного устройства
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
      setIsFullscreen(false)
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

        {/* Десктопная версия */}
        <div className="table-scroll-container">
          <DesktopStatsTable
            students={sortedStudents}
            columns={visibleColumns}
            columnGroups={columnGroups}
            data={data}
            stickyStudent={stickyStudent}
            sortState={sortState}
            collapsedGroups={collapsedGroups}
            columnWidths={desktopColumnSync.columnWidths}
            onSort={handleSort}
            onToggleGroup={toggleGroupCollapse}
            onCellClick={onCellClick}
            headerScrollRef={desktopColumnSync.desktopHeaderScrollRef}
            bodyScrollRef={desktopColumnSync.desktopBodyScrollRef}
            headerTableRef={desktopColumnSync.desktopHeaderTableRef}
            bodyTableRef={desktopColumnSync.desktopBodyTableRef}
            isFullscreen={isFullscreen}
          />
        </div>

        {/* Мобильная версия */}
        <MobileStatsTable
          students={sortedStudents}
          columns={visibleColumns}
          columnGroups={columnGroups}
          data={data}
          sortState={sortState}
          collapsedGroups={collapsedGroups}
          onSort={handleSort}
          onToggleGroup={toggleGroupCollapse}
          onCellClick={onCellClick}
          headerScrollRef={mobileScrollSync.headerScrollRef}
          totalsScrollRef={mobileScrollSync.totalsScrollRef}
          rowScrollRefs={mobileScrollSync.rowScrollRefs}
        />
      </div>
    </TooltipProvider>
  )
}

export { ResponsiveStatsTableOrganism as ResponsiveStatsTable }
