import * as React from 'react'
import { cn } from '@/lib/utils'
import { StudentData, StatColumn, ColumnGroup, StatData, SortState } from '../types'
import { TableHeader } from '../atoms/TableHeader'
import { SortIcon } from '../atoms/SortIcon'
import { GroupHeader } from '../molecules/GroupHeader'
import { TotalsRow } from '../molecules/TotalsRow'
import { StudentRow } from '../molecules/StudentRow'

interface DesktopStatsTableProps {
  students: StudentData[]
  columns: StatColumn[]
  columnGroups?: ColumnGroup[]
  data: Record<string, StatData>
  stickyStudent?: boolean
  sortState: SortState
  collapsedGroups: Set<string>
  columnWidths: string[]
  onSort: (columnKey: string) => void
  onToggleGroup: (groupKey: string) => void
  onCellClick?: (studentId: string, columnKey: string, value: any) => void
  headerScrollRef: React.RefObject<HTMLDivElement>
  bodyScrollRef: React.RefObject<HTMLDivElement>
  headerTableRef: React.RefObject<HTMLTableElement>
  bodyTableRef: React.RefObject<HTMLTableElement>
  isFullscreen: boolean
}

/**
 * Организм: Десктопная версия таблицы статистики
 */
export function DesktopStatsTable({
  students,
  columns,
  columnGroups,
  data,
  stickyStudent,
  sortState,
  collapsedGroups,
  columnWidths,
  onSort,
  onToggleGroup,
  onCellClick,
  headerScrollRef,
  bodyScrollRef,
  headerTableRef,
  bodyTableRef,
  isFullscreen
}: DesktopStatsTableProps) {
  return (
    <div className="desktop-table">
      {/* Header table - БЕЗ overflow для tooltip, скроллится синхронно с body */}
      <div className="overflow-visible [scrollbar-gutter:stable]" ref={headerScrollRef}>
        <table className="w-full" ref={headerTableRef}>
          {columnWidths.length > 0 && (
            <colgroup>
              {columnWidths.map((width, idx) => (
                <col key={idx} style={{ width }} />
              ))}
            </colgroup>
          )}
          <thead>
            {columnGroups ? (
              <>
                {/* Первый ряд - названия групп */}
                <tr>
                  <th
                    className={cn(
                      "student-column bg-muted cursor-pointer hover:bg-muted/50 select-none",
                      "sticky top-0 left-0 z-25"
                    )}
                    style={{ width: '200px', minWidth: '200px', maxWidth: '200px' }}
                    rowSpan={2}
                    onClick={() => onSort('student')}
                  >
                    <div className="flex items-center justify-start">
                      Студент
                      <SortIcon
                        isActive={sortState.column === 'student'}
                        direction={sortState.direction}
                      />
                    </div>
                  </th>
                  {columnGroups.map((group) => (
                    <GroupHeader
                      key={group.key}
                      group={group}
                      isCollapsed={collapsedGroups.has(group.key)}
                      onToggle={onToggleGroup}
                    />
                  ))}
                </tr>

                {/* Второй ряд - названия колонок */}
                <tr>
                  {columns.map((column) => (
                    <TableHeader
                      key={column.key}
                      column={column}
                      sortState={sortState}
                      onSort={onSort}
                      style={{ top: '28px' }}
                    />
                  ))}
                </tr>
              </>
            ) : (
              /* Одноуровневые заголовки */
              <tr>
                <th
                  className={cn(
                    "student-column sticky top-0 z-20 bg-muted cursor-pointer hover:bg-muted/50 select-none",
                    stickyStudent && "sticky left-0"
                  )}
                  style={{ width: '200px', minWidth: '200px', maxWidth: '200px' }}
                  onClick={() => onSort('student')}
                >
                  <div className="flex items-center justify-start">
                    Студент
                    <SortIcon
                      isActive={sortState.column === 'student'}
                      direction={sortState.direction}
                    />
                  </div>
                </th>
                {columns.map((column) => (
                  <TableHeader
                    key={column.key}
                    column={column}
                    sortState={sortState}
                    onSort={onSort}
                  />
                ))}
              </tr>
            )}

            {/* Строка "Итого" */}
            <TotalsRow
              columns={columns}
              students={students}
              data={data}
              columnGroups={!!columnGroups}
              stickyStudent={stickyStudent}
            />
          </thead>
        </table>
      </div>

      {/* Body table - С overflow для скролла */}
      <div
        ref={bodyScrollRef}
        className={cn(
          "[scrollbar-gutter:stable]",
          isFullscreen ? "table-body-scroll" : "overflow-x-auto overflow-y-auto max-h-[70vh]"
        )}
      >
        <table className="w-full" ref={bodyTableRef}>
          {columnWidths.length > 0 && (
            <colgroup>
              {columnWidths.map((width, idx) => (
                <col key={idx} style={{ width }} />
              ))}
            </colgroup>
          )}
          <tbody>
            {students.map((student) => (
              <StudentRow
                key={student.id}
                student={student}
                columns={columns}
                studentStats={data[student.id] || {}}
                stickyStudent={stickyStudent}
                onCellClick={onCellClick}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
